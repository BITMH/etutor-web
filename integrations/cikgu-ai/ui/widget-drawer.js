/**
 * public-web/integrations/cikgu-ai/ui/widget-drawer.js
 * Reka bentuk bersih & minimalis Cikgu AI:
 * - Hanya tajuk "Cikgu AI" tanpa sebarang teks serabut di header
 * - Tiada dropdown subjek, tiada tab mod, tiada cip contoh yang menyemak
 * - Membaca soalan semasa di skrin pelajar secara automatik di latar belakang
 */

import { loadRuntimeEndpoints, saveRuntimeEndpoints } from "../config.js";
import { renderSpmMarkdown } from "./markdown-spm.js";

export class CikguWidgetDrawer {
  constructor({ client, warmupMachine, speechIO, getLiveScreenSnapshot, getStudentName }) {
    this.client = client;
    this.warmupMachine = warmupMachine;
    this.speechIO = speechIO;
    this.getLiveScreenSnapshot = getLiveScreenSnapshot || (async () => null);
    this.getStudentName = getStudentName || (() => "");
    this.isStreaming = false;
    this.rootEl = null;
    this.activeScreenQuestion = null;
    this.sessionGreeted = false;
    this.chatHistory = [];
  }

  _shortDisplayName(rawName) {
    const clean = String(rawName || "").trim();
    if (!clean) return "";
    const parts = clean.split(/\s+(?:bin|binti|bt\.?|b\.|a\/l|a\/p)\s+/i);
    return parts[0].trim().split(/\s+/).slice(0, 3).join(" ");
  }

  mount() {
    if (document.getElementById("cikguAiIntegrationRoot")) return;

    const root = document.createElement("aside");
    root.id = "cikguAiIntegrationRoot";
    root.className = "cikgu-ai-root";
    root.setAttribute("aria-label", "Cikgu AI");

    const endpoints = loadRuntimeEndpoints();
    const isAdminRoute = typeof window !== "undefined" && window.location.hash === "#admin";

    root.innerHTML = `
      <div class="cikgu-ai-drawer" id="cikguAiDrawer" hidden>
        <div class="cikgu-ai-header">
          <div class="cikgu-ai-brand">
            <div class="cikgu-ai-avatar" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
            </div>
            <div>
              <h2 class="cikgu-ai-title">Cikgu AI</h2>
              <p class="cikgu-ai-subtitle">
                <span class="cikgu-ai-online-dot"></span>
                <span id="cikguAiStatusSub">Sedia membantu</span>
              </p>
            </div>
          </div>
          <div class="cikgu-ai-hdr-actions">
            <button type="button" class="cikgu-ai-icon-btn" id="cikguAiSettingsBtn" title="Tetapan Pelayan (Admin)" ${isAdminRoute ? "" : "hidden"}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button type="button" class="cikgu-ai-icon-btn" id="cikguAiCloseBtn" aria-label="Tutup">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="cikgu-ai-admin-panel" id="cikguAiAdminPanel" hidden>
          <div class="cikgu-ai-admin-grid">
            <div class="cikgu-ai-admin-status" id="cikguAiAdminStatusBox">
              Status pelayan dwi-awan percuma.
            </div>
            <div class="cikgu-ai-admin-row">
              <label for="cikguAiRouteMode">Mod Penghalaan:</label>
              <select id="cikguAiRouteMode">
                <option value="auto"${endpoints.mode === "auto" ? " selected" : ""}>Auto-Failover (Cloud Run → HF Spaces)</option>
                <option value="cloud-run"${endpoints.mode === "cloud-run" ? " selected" : ""}>Cloud Run Sahaja</option>
                <option value="hf-spaces"${endpoints.mode === "hf-spaces" ? " selected" : ""}>HF Spaces Sahaja</option>
              </select>
            </div>
            <div class="cikgu-ai-admin-row">
              <label for="cikguAiPrimaryInput">URL Utama:</label>
              <input id="cikguAiPrimaryInput" type="url" value="${endpoints.primaryUrl}">
            </div>
            <div class="cikgu-ai-admin-row">
              <label for="cikguAiBackupInput">URL Sandaran:</label>
              <input id="cikguAiBackupInput" type="url" value="${endpoints.backupUrl}">
            </div>
            <div style="display:flex; gap:6px; margin-top:2px;">
              <button type="button" class="cikgu-ai-tts-btn" id="cikguAiCheckHealthBtn">Semak Kesihatan</button>
              <button type="button" class="cikgu-ai-tts-btn" id="cikguAiSaveEndpointsBtn" style="background:#059669;color:#fff;border-color:#059669;">Simpan</button>
            </div>
          </div>
        </div>

        <div class="cikgu-ai-feed" id="cikguAiFeed">
          <div class="cikgu-ai-msg cikgu-ai-msg-bot" id="cikguAiWelcomeBubble">
            Assalamualaikum &amp; salam sejahtera! Ada bahagian soalan pada skrin yang kurang jelas, atau nak Cikgu semakkan jawapan kamu? Mulakan dengan sapaan dan tulis di bawah ya.
          </div>
        </div>

        <form class="cikgu-ai-composer" id="cikguAiForm">
          <textarea
            id="cikguAiChatInput"
            class="cikgu-ai-chat-input"
            rows="1"
            placeholder="Tanya Cikgu..."
          ></textarea>
          <button type="button" class="cikgu-ai-mic-btn" id="cikguAiMicBtn" title="Input Suara">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          </button>
          <button type="submit" class="cikgu-ai-submit-btn" id="cikguAiSubmitBtn" aria-label="Hantar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>

      <div class="cikgu-ai-fab-wrap">
        <div class="cikgu-ai-tooltip" id="cikguAiTooltip" hidden>
          <span>Perlukan bantuan soalan ini? Tanya Cikgu AI</span>
          <button type="button" class="cikgu-ai-tooltip-close" id="cikguAiTooltipClose" aria-label="Tutup">✕</button>
        </div>
        <button type="button" class="cikgu-ai-fab" id="cikguAiFab" aria-label="Buka Cikgu AI">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          <span class="cikgu-ai-pulse-dot"></span>
        </button>
      </div>
    `;

    document.body.appendChild(root);
    this.rootEl = root;
    this._bindEvents();
  }

  setActiveScreenQuestion(ctx) {
    this.activeScreenQuestion = ctx;
    if (!this.rootEl) return;
    const statusSub = this.rootEl.querySelector("#cikguAiStatusSub");
    if (!statusSub) return;

    if (ctx && ctx.fullQuestion) {
      statusSub.textContent = ctx.questionTitle
        ? `Melihat ${ctx.questionTitle}`
        : "Melihat soalan semasa";
    } else {
      statusSub.textContent = "Sedia membantu";
    }
  }

  updateWarmupUi(state) {
    if (!this.rootEl) return;
    const statusSub = this.rootEl.querySelector("#cikguAiStatusSub");
    if (!statusSub) return;

    if (state.status === "warming") {
      statusSub.textContent = "Cikgu sedang masuk kelas...";
    } else if (state.status === "ready") {
      if (this.activeScreenQuestion && this.activeScreenQuestion.questionTitle) {
        statusSub.textContent = `Melihat ${this.activeScreenQuestion.questionTitle}`;
      } else {
        statusSub.textContent = "Sedia membantu";
      }
    }
  }

  _bindEvents() {
    const fab = this.rootEl.querySelector("#cikguAiFab");
    const drawer = this.rootEl.querySelector("#cikguAiDrawer");
    const closeBtn = this.rootEl.querySelector("#cikguAiCloseBtn");
    const tooltip = this.rootEl.querySelector("#cikguAiTooltip");
    const tooltipClose = this.rootEl.querySelector("#cikguAiTooltipClose");
    const settingsBtn = this.rootEl.querySelector("#cikguAiSettingsBtn");
    const adminPanel = this.rootEl.querySelector("#cikguAiAdminPanel");
    const checkHealthBtn = this.rootEl.querySelector("#cikguAiCheckHealthBtn");
    const saveEndpointsBtn = this.rootEl.querySelector("#cikguAiSaveEndpointsBtn");
    const micBtn = this.rootEl.querySelector("#cikguAiMicBtn");
    const form = this.rootEl.querySelector("#cikguAiForm");
    const chatInput = this.rootEl.querySelector("#cikguAiChatInput");

    window.addEventListener("hashchange", () => {
      if (settingsBtn) {
        settingsBtn.hidden = window.location.hash !== "#admin";
      }
    });

    // Pintasan admin tersembunyi (Alt + Shift + C) untuk buka panel kawalan pelayan
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.shiftKey && String(e.key).toLowerCase() === "c") {
        adminPanel.hidden = !adminPanel.hidden;
      }
    });

    let tipAutoHideTimer = null;
    const hideTooltip = () => {
      if (tooltip) tooltip.hidden = true;
      if (tipAutoHideTimer) {
        clearTimeout(tipAutoHideTimer);
        tipAutoHideTimer = null;
      }
      try {
        sessionStorage.setItem("etutor_cikgu_tip_dismissed_v1", "1");
      } catch {}
    };

    setTimeout(() => {
      let alreadyDismissed = false;
      try {
        alreadyDismissed = sessionStorage.getItem("etutor_cikgu_tip_dismissed_v1") === "1";
      } catch {}
      if (
        !alreadyDismissed &&
        drawer.hidden &&
        tooltip &&
        !document.body.classList.contains("is-exam-stage-open")
      ) {
        tooltip.hidden = false;
        tipAutoHideTimer = setTimeout(hideTooltip, 6500);
      }
    }, 3500);

    if (tooltipClose) {
      tooltipClose.addEventListener("click", hideTooltip);
    }

    fab.addEventListener(
      "pointerenter",
      () => {
        if (this.warmupMachine.status === "idle") {
          this.warmupMachine.triggerSilentPrewarm();
        }
      },
      { once: true }
    );

    fab.addEventListener("click", async () => {
      const willOpen = drawer.hidden;
      drawer.hidden = !willOpen;
      if (tooltip) tooltip.hidden = true;
      if (willOpen) {
        const snap = await this.getLiveScreenSnapshot();
        if (snap) this.setActiveScreenQuestion(snap);
        const sName = this._shortDisplayName(this.getStudentName());
        const welcomeEl = this.rootEl.querySelector("#cikguAiWelcomeBubble");
        if (welcomeEl && sName) {
          welcomeEl.innerHTML = `Assalamualaikum &amp; salam sejahtera, <strong>${sName}</strong>! Ada bahagian soalan pada skrin yang kurang jelas, atau nak Cikgu semakkan jawapan kamu?`;
        }
        if (this.warmupMachine.status === "idle") {
          this.warmupMachine.triggerSilentPrewarm();
        }
        setTimeout(() => chatInput.focus(), 60);
      }
    });

    closeBtn.addEventListener("click", () => {
      drawer.hidden = true;
      this.speechIO.stopSpeaking();
    });

    settingsBtn.addEventListener("click", () => {
      adminPanel.hidden = !adminPanel.hidden;
    });

    saveEndpointsBtn.addEventListener("click", () => {
      const mode = this.rootEl.querySelector("#cikguAiRouteMode").value;
      const primaryUrl = this.rootEl.querySelector("#cikguAiPrimaryInput").value;
      const backupUrl = this.rootEl.querySelector("#cikguAiBackupInput").value;
      saveRuntimeEndpoints({ mode, primaryUrl, backupUrl });
      this.client.primaryCooldownUntil = 0;
      this.rootEl.querySelector("#cikguAiAdminStatusBox").textContent = "Tetapan disimpan.";
    });

    checkHealthBtn.addEventListener("click", async () => {
      const statusBox = this.rootEl.querySelector("#cikguAiAdminStatusBox");
      statusBox.textContent = "Menyemak kesihatan pelayan...";
      const statuses = await this.client.fetchStatus();
      const cr = statuses["cloud-run"];
      const hf = statuses["hf-spaces"];
      const crLine = cr && cr.ready ? `Utama: Aktif (${cr.remaining_quota_pct ?? 100}%)` : "Utama: Tidur";
      const hfLine = hf && hf.ready ? "Sandaran HF: Aktif" : "Sandaran HF: Tidur";
      statusBox.textContent = `${crLine} • ${hfLine}`;
    });

    if (!this.speechIO.isSttSupported()) {
      micBtn.hidden = true;
    } else {
      micBtn.addEventListener("click", () => {
        const curSubj = (this.activeScreenQuestion && this.activeScreenQuestion.subject) || "Sejarah";
        this.speechIO.toggleDictation(curSubj);
      });
    }

    this.speechIO.onListeningChange = (listening) => {
      micBtn.classList.toggle("is-listening", listening);
    };

    this.speechIO.onTranscript = (transcript) => {
      chatInput.value = (chatInput.value ? chatInput.value + " " : "") + transcript;
      chatInput.focus();
    };

    chatInput.addEventListener("input", () => {
      chatInput.style.height = "auto";
      chatInput.style.height = Math.min(chatInput.scrollHeight, 110) + "px";
    });

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (this.isStreaming) return;

      const msg = chatInput.value.trim();
      if (msg.length < 2) {
        chatInput.focus();
        return;
      }

      chatInput.value = "";
      chatInput.style.height = "auto";
      await this._handleChatTurn(msg);
    });
  }

  async _handleChatTurn(userMessage) {
    const feed = this.rootEl.querySelector("#cikguAiFeed");
    const submitBtn = this.rootEl.querySelector("#cikguAiSubmitBtn");

    const freshCtx = (await this.getLiveScreenSnapshot()) || this.activeScreenQuestion;
    if (freshCtx) this.setActiveScreenQuestion(freshCtx);

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

    this.isStreaming = true;
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
    const studentName = this.getStudentName() || (freshCtx && freshCtx.candidateName) || "";

    try {
      await this.client.streamSemak(
        {
          subjek: detectedSubj || "auto",
          mod: "auto",
          soalan: userMessage,
          jawapan_pelajar: studentDraftText,
          konteks_skrin: screenContextText,
          nama_pelajar: studentName,
          sesi_sudah_sapa: this.sessionGreeted || this.chatHistory.length > 0,
          sejarah_sembang: this.chatHistory.slice(-6),
          markah_penuh: detectedMarks
        },
        {
          onMeta: (meta) => {
            if (meta.subjek) detectedSubj = meta.subjek;
            if (meta.sesi_sudah_sapa !== undefined) {
              this.sessionGreeted = Boolean(meta.sesi_sudah_sapa);
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
        this.chatHistory.push(
          { role: "user", content: userMessage.slice(0, 500) },
          { role: "assistant", content: rawAccumulated.trim().slice(0, 700) }
        );
        if (this.chatHistory.length > 8) {
          this.chatHistory = this.chatHistory.slice(-8);
        }
      }

      const footer = document.createElement("div");
      footer.className = "cikgu-ai-msg-footer";
      footer.innerHTML = `<button type="button" class="cikgu-ai-tts-btn">🔊 Dengar</button>`;
      const ttsBtn = footer.querySelector(".cikgu-ai-tts-btn");
      ttsBtn.addEventListener("click", () => {
        this.speechIO.speakText(rawAccumulated, detectedSubj, ttsBtn);
      });
      botBubble.appendChild(footer);
    } catch (err) {
      contentDiv.innerHTML = `<span style="color:#b91c1c;">Maaf, sambungan tergendala sebentar (${String(err.message || err)}). Cuba hantar semula ya.</span>`;
    } finally {
      this.isStreaming = false;
      submitBtn.disabled = false;
      feed.scrollTop = feed.scrollHeight;
    }
  }
}
