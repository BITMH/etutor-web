/**
 * public-web/integrations/cikgu-ai/ui/chat-turn-runner.js
 * Pemproses pusingan sembang SSE Cikgu AI, pemaparan Markdown SPM, sejarah tetingkap & butang TTS.
 */

import { loadDailyTokenState } from "../config.js";
import { renderSpmMarkdown } from "./markdown-spm.js";
import { appendHybridActionButtons, syncHybridComposerUi } from "./hybrid-homework-ui.js?v=28";
import { SNAP_IMAGE_TOKEN_COST } from "./snap-photo-helper.js?v=28";

export async function executeCikguChatTurn(drawerInstance, userMessage, turnOpts = {}) {
  const feed = drawerInstance.rootEl.querySelector("#cikguAiFeed");
  const submitBtn = drawerInstance.rootEl.querySelector("#cikguAiSubmitBtn");

  const imgCopy = drawerInstance.pendingImage ? { ...drawerInstance.pendingImage } : null;
  const hasImg = Boolean(imgCopy && imgCopy.base64);
  if (hasImg) {
    const tokSnap = loadDailyTokenState();
    if (tokSnap.remaining < SNAP_IMAGE_TOKEN_COST) {
      const warnBubble = document.createElement("div");
      warnBubble.className = "cikgu-ai-msg cikgu-ai-msg-bot";
      warnBubble.innerHTML = `<span style="color:#92400e;font-weight:600;">Baki token tidak mencukupi untuk semakan gambar (${SNAP_IMAGE_TOKEN_COST} Token diperlukan). Sila tambah nilai melalui Dompet Token.</span>`;
      feed.appendChild(warnBubble);
      feed.scrollTop = feed.scrollHeight;
      return;
    }
    if (typeof drawerInstance.clearPendingImage === "function") drawerInstance.clearPendingImage();
  }

  const forcedMod = turnOpts && turnOpts.mod ? String(turnOpts.mod) : "";
  const activeMod = forcedMod || (drawerInstance.hybridMode ? "bimbing_kerja_sekolah" : (hasImg ? "semak_gambar" : "auto"));
  const activeStage =
    activeMod === "bimbing_kerja_sekolah"
      ? String((turnOpts && turnOpts.tahap_bimbingan) || drawerInstance.pendingHintStage || "bimbing")
      : "";

  if (activeMod === "bimbing_kerja_sekolah" && activeStage === "bimbing") {
    drawerInstance.lastHomeworkQuestion = userMessage;
  }
  if (drawerInstance.pendingHintStage === "semak_cubaan") {
    drawerInstance.pendingHintStage = "bimbing";
    syncHybridComposerUi(drawerInstance.rootEl, {
      hybridMode: drawerInstance.hybridMode,
      pendingHintStage: "bimbing"
    });
  }

  const freshCtx = (await drawerInstance.getLiveScreenSnapshot()) || drawerInstance.activeScreenQuestion;
  if (freshCtx) drawerInstance.setActiveScreenQuestion(freshCtx);

  const userBubble = document.createElement("div");
  userBubble.className = "cikgu-ai-msg cikgu-ai-msg-user";
  if (hasImg) {
    const imgEl = document.createElement("img");
    imgEl.className = "cikgu-ai-user-img";
    imgEl.src = imgCopy.dataUrl;
    imgEl.alt = "Lampiran gambar kerja sekolah";
    userBubble.appendChild(imgEl);
  }
  const msgTxtEl = document.createElement("div");
  msgTxtEl.textContent = userMessage;
  userBubble.appendChild(msgTxtEl);
  feed.appendChild(userBubble);

  const botBubble = document.createElement("div");
  botBubble.className = "cikgu-ai-msg cikgu-ai-msg-bot";
  const contentDiv = document.createElement("div");
  contentDiv.innerHTML = `<span style="color:#64748b;">Sedang meneliti soalan...</span>`;
  botBubble.appendChild(contentDiv);
  feed.appendChild(botBubble);
  feed.scrollTop = feed.scrollHeight;

  drawerInstance.isStreaming = true;
  submitBtn.disabled = true;

  let screenContextText = "";
  let studentDraftText = "";
  let detectedMarks = 4;

  if (freshCtx && freshCtx.fullQuestion) {
    screenContextText = (
      `Kertas: ${freshCtx.quizTitle || "Kertas SPM"}\n` +
      `${freshCtx.questionTitle ? "Soalan: " + freshCtx.questionTitle + "\n" : ""}` +
      `Teks Soalan Pada Skrin:\n${freshCtx.fullQuestion}`
    ).slice(0, 5500);
    studentDraftText = String(freshCtx.studentDraft || "").slice(0, 7500);
    detectedMarks = Math.max(1, Math.min(100, Math.round(Number(freshCtx.marks) || 4)));
  }

  let rawAccumulated = "";
  let detectedSubj = (freshCtx && freshCtx.subject) || "auto";
  const studentName = drawerInstance.getStudentName() || (freshCtx && freshCtx.candidateName) || "";
  const responseMeta = { mod: activeMod, tahap_bimbingan: activeStage, sahsiah_signal: "" };

  const soalanPayload =
    activeMod === "bimbing_kerja_sekolah" && activeStage !== "bimbing"
      ? String((turnOpts && turnOpts.homeworkQuestion) || drawerInstance.lastHomeworkQuestion || userMessage)
      : userMessage;
  const jawapanPayload =
    activeMod === "bimbing_kerja_sekolah" && activeStage === "semak_cubaan"
      ? [userMessage, studentDraftText].filter(Boolean).join("\n")
      : studentDraftText;

  try {
    if (drawerInstance.warmupMachine && drawerInstance.warmupMachine.status !== "ready" && !hasImg) {
      contentDiv.innerHTML = `<span style="color:#64748b;">Sekejap ya, Cikgu sedang membuka buku rekod KSSM &amp; bersedia di meja...</span>`;
      await drawerInstance.warmupMachine.greetCikgu();
      contentDiv.innerHTML = `<span style="color:#64748b;">Sedang meneliti soalan...</span>`;
    }

    const reqPayload = {
      subjek: detectedSubj || "auto",
      mod: activeMod,
      soalan: soalanPayload,
      jawapan_pelajar: jawapanPayload || (hasImg ? userMessage.slice(0, 3500) : ""),
      konteks_skrin: screenContextText,
      nama_pelajar: studentName,
      sesi_sudah_sapa: drawerInstance.sessionGreeted || drawerInstance.chatHistory.length > 0,
      sejarah_sembang: drawerInstance.chatHistory.slice(-6),
      markah_penuh: hasImg ? Math.max(detectedMarks, 6) : detectedMarks
    };
    if (hasImg) {
      reqPayload.imej_base64 = imgCopy.base64.slice(0, 255000);
      reqPayload.imej_mime = imgCopy.mime || "image/jpeg";
      reqPayload.max_tokens = 520;
    }
    if (activeMod === "bimbing_kerja_sekolah") {
      reqPayload.tahap_bimbingan = activeStage || "bimbing";
    }

    await drawerInstance.client.streamSemak(
      reqPayload,
      {
        onMeta: (meta) => {
          if (meta.subjek) detectedSubj = meta.subjek;
          if (meta.mod) responseMeta.mod = meta.mod;
          if (meta.tahap_bimbingan) responseMeta.tahap_bimbingan = meta.tahap_bimbingan;
          if (meta.sahsiah_signal) responseMeta.sahsiah_signal = meta.sahsiah_signal;
          if (meta.sesi_sudah_sapa !== undefined) {
            drawerInstance.sessionGreeted = Boolean(meta.sesi_sudah_sapa);
          }
        },
        onToken: (tok) => {
          rawAccumulated += tok;
          contentDiv.innerHTML = renderSpmMarkdown(rawAccumulated);
          feed.scrollTop = feed.scrollHeight;
        }
      }
    );

    if (rawAccumulated.trim()) {
      drawerInstance.chatHistory.push(
        { role: "user", content: userMessage.slice(0, 500) },
        { role: "assistant", content: rawAccumulated.trim().slice(0, 700) }
      );
      if (drawerInstance.chatHistory.length > 8) {
        drawerInstance.chatHistory = drawerInstance.chatHistory.slice(-8);
      }
      appendHybridActionButtons({
        botBubble,
        drawerInstance,
        meta: responseMeta,
        homeworkQuestion: drawerInstance.lastHomeworkQuestion || soalanPayload,
        onCheckAttempt: () => {
          if (typeof drawerInstance.setHybridMode === "function") {
            drawerInstance.setHybridMode(true, "semak_cubaan");
          }
          const inp = drawerInstance.rootEl && drawerInstance.rootEl.querySelector("#cikguAiChatInput");
          if (inp) inp.focus();
        },
        onRevealFull: (hwQ) => {
          if (!drawerInstance.isStreaming) {
            executeCikguChatTurn(drawerInstance, "Tunjuk jalan kerja penuh bagi soalan ini.", {
              mod: "bimbing_kerja_sekolah",
              tahap_bimbingan: "jalan_kerja_penuh",
              homeworkQuestion: hwQ
            });
          }
        }
      });
    }

    if (drawerInstance.speechIO && drawerInstance.speechIO.isTtsSupported()) {
      const footer = document.createElement("div");
      footer.className = "cikgu-ai-msg-footer";
      footer.innerHTML = `<button type="button" class="cikgu-ai-tts-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="vertical-align:-2px;margin-right:4px"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>Dengar</button>`;
      const ttsBtn = footer.querySelector(".cikgu-ai-tts-btn");
      ttsBtn.addEventListener("click", () => {
        drawerInstance.speechIO.speakText(rawAccumulated, detectedSubj, ttsBtn);
      });
      botBubble.appendChild(footer);
    }
  } catch (err) {
    if (err && err.isDailyLimit) {
      contentDiv.innerHTML = `<span style="color:#92400e;font-weight:600;">${String(err.message)}</span>`;
    } else {
      contentDiv.innerHTML = `<span style="color:#b91c1c;">Maaf, sambungan tergendala sebentar (${String(err.message || err)}). Cuba hantar semula ya.</span>`;
    }
  } finally {
    drawerInstance.isStreaming = false;
    submitBtn.disabled = false;
    feed.scrollTop = feed.scrollHeight;
  }
}
