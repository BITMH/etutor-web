/**
 * public-web/integrations/cikgu-ai/ui/chat-turn-runner.js
 * Pemproses pusingan sembang SSE Cikgu AI, pemaparan Markdown SPM, sejarah tetingkap & butang TTS.
 */

import { renderSpmMarkdown } from "./markdown-spm.js";

export async function executeCikguChatTurn(drawerInstance, userMessage) {
  const feed = drawerInstance.rootEl.querySelector("#cikguAiFeed");
  const submitBtn = drawerInstance.rootEl.querySelector("#cikguAiSubmitBtn");

  const freshCtx = (await drawerInstance.getLiveScreenSnapshot()) || drawerInstance.activeScreenQuestion;
  if (freshCtx) drawerInstance.setActiveScreenQuestion(freshCtx);

  const userBubble = document.createElement("div");
  userBubble.className = "cikgu-ai-msg cikgu-ai-msg-user";
  userBubble.textContent = userMessage;
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
    screenContextText =
      `Kertas: ${freshCtx.quizTitle || "Kertas SPM"}\n` +
      `${freshCtx.questionTitle ? "Soalan: " + freshCtx.questionTitle + "\n" : ""}` +
      `Teks Soalan Pada Skrin:\n${freshCtx.fullQuestion}`;
    studentDraftText = freshCtx.studentDraft || "";
    detectedMarks = freshCtx.marks || 4;
  }

  let rawAccumulated = "";
  let detectedSubj = (freshCtx && freshCtx.subject) || "auto";
  const studentName = drawerInstance.getStudentName() || (freshCtx && freshCtx.candidateName) || "";

  try {
    if (drawerInstance.warmupMachine && drawerInstance.warmupMachine.status !== "ready") {
      contentDiv.innerHTML = `<span style="color:#64748b;">Sekejap ya, Cikgu sedang membuka buku rekod KSSM &amp; bersedia di meja...</span>`;
      await drawerInstance.warmupMachine.greetCikgu();
      contentDiv.innerHTML = `<span style="color:#64748b;">Sedang meneliti soalan...</span>`;
    }

    await drawerInstance.client.streamSemak(
      {
        subjek: detectedSubj || "auto",
        mod: "auto",
        soalan: userMessage,
        jawapan_pelajar: studentDraftText,
        konteks_skrin: screenContextText,
        nama_pelajar: studentName,
        sesi_sudah_sapa: drawerInstance.sessionGreeted || drawerInstance.chatHistory.length > 0,
        sejarah_sembang: drawerInstance.chatHistory.slice(-6),
        markah_penuh: detectedMarks
      },
      {
        onMeta: (meta) => {
          if (meta.subjek) detectedSubj = meta.subjek;
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
    }

    if (drawerInstance.speechIO && drawerInstance.speechIO.isTtsSupported()) {
      const footer = document.createElement("div");
      footer.className = "cikgu-ai-msg-footer";
      footer.innerHTML = `<button type="button" class="cikgu-ai-tts-btn">🔊 Dengar</button>`;
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
