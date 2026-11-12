/**
 * public-web/integrations/cikgu-ai/ui/widget-drawer.js
 * Pengawal interaksi UI laci sembang Cikgu AI, input suara STT/TTS, dan penstriman jawapan.
 */

import {
  loadDailyTokenState,
  loadRuntimeEndpoints,
  onDailyTokenChange,
  saveRuntimeEndpoints
} from "../config.js";
import { buildCikguDrawerTemplate } from "./widget-template.js";
import { executeCikguChatTurn } from "./chat-turn-runner.js";

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
    root.innerHTML = buildCikguDrawerTemplate(endpoints, isAdminRoute);

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
      statusSub.textContent =
        this.activeScreenQuestion && this.activeScreenQuestion.questionTitle
          ? `Melihat ${this.activeScreenQuestion.questionTitle}`
          : "Sedia membantu";
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
    const tokenPill = this.rootEl.querySelector("#cikguAiTokenPill");

    const renderTokenPill = (st) => {
      if (!tokenPill || !st) return;
      tokenPill.textContent = `${st.remaining}/${st.limit} Token`;
      tokenPill.classList.toggle("is-empty", st.remaining <= 0);
      tokenPill.classList.toggle("is-low", st.remaining > 0 && st.remaining <= 5);
    };
    renderTokenPill(loadDailyTokenState());
    onDailyTokenChange(renderTokenPill);

    window.addEventListener("hashchange", () => {
      if (settingsBtn) settingsBtn.hidden = window.location.hash !== "#admin";
    });

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
      if (!alreadyDismissed && drawer.hidden && tooltip && !document.body.classList.contains("is-exam-stage-open")) {
        tooltip.hidden = false;
        tipAutoHideTimer = setTimeout(hideTooltip, 6500);
      }
    }, 3500);

    if (tooltipClose) tooltipClose.addEventListener("click", hideTooltip);

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

    this.speechIO.onListeningChange = (listening) => micBtn.classList.toggle("is-listening", listening);
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
    await executeCikguChatTurn(this, userMessage);
  }
}
