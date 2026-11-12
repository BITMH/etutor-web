/**
 * public-web/integrations/cikgu-ai/index.js
 * Pintu Masuk Tunggal (Plug-and-Play Integration Entrypoint) untuk Cikgu AI.
 * Mengorkestrasi penderia skrin iframe, jambatan penandaan Kertas 2, dan laci sembang Cikgu AI.
 */

import { onDailyTokenChange } from "./config.js?v=21";
import { CikguFailoverClient } from "./api/failover-client.js?v=21";
import { WarmupStateMachine } from "./state/warmup-machine.js?v=21";
import { CikguSpeechIO } from "./audio/speech-io.js?v=21";
import { CikguWidgetDrawer } from "./ui/widget-drawer.js?v=21";
import {
  resolveStudentLoginName,
  installExamIframeSensorHook,
  detectSubjectFromText,
  readMainWebsiteFallbackContext
} from "./sensor/iframe-screen-sensor.js?v=21";
import {
  postTokenSyncToIframe,
  handlePaper2SubGradeRequest
} from "./grading/paper2-bridge.js?v=21";

export { resolveStudentLoginName };

function injectScopedStylesheet() {
  if (document.getElementById("cikguAiScopedCss")) return;
  const link = document.createElement("link");
  link.id = "cikguAiScopedCss";
  link.rel = "stylesheet";
  link.href = new URL("./ui/cikgu-ai.css?v=21", import.meta.url).href;
  document.head.appendChild(link);
}

export function initCikguAiIntegration() {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (window.__CIKGU_AI_INSTANCE__) return window.__CIKGU_AI_INSTANCE__;

  injectScopedStylesheet();
  installExamIframeSensorHook();

  let latestIframeQuestion = null;
  let pendingResolvers = [];

  const client = new CikguFailoverClient();
  const speechIO = new CikguSpeechIO({ client });
  let drawer = null;

  const warmupMachine = new WarmupStateMachine(client, (state) => {
    if (drawer) drawer.updateWarmupUi(state);
  });

  onDailyTokenChange((st) => postTokenSyncToIframe(st));

  window.addEventListener("message", (ev) => {
    const d = ev && ev.data;
    if (!d || typeof d !== "object") return;

    if (d.type === "ETUTOR_REQUEST_TOKEN_SYNC") {
      postTokenSyncToIframe();
      return;
    }

    if (d.type === "ETUTOR_AI_SUB_GRADE_REQ" && d.subId) {
      handlePaper2SubGradeRequest(ev, d, { client, warmupMachine });
      return;
    }

    if (d.type !== "CIKGU_AI_ACTIVE_QUESTION" && d.type !== "ETUTOR_ACTIVE_QUESTION") return;
    postTokenSyncToIframe();
    const stageTitle = ((document.getElementById("examStageTitle") || {}).textContent || "").trim();
    const enriched = {
      ...d,
      quizTitle: stageTitle || d.quizTitle || "Kertas Soalan SPM",
      subject: d.subject || detectSubjectFromText(`${stageTitle} ${d.quizTitle}`)
    };
    latestIframeQuestion = enriched;
    if (drawer) drawer.setActiveScreenQuestion(enriched);
    if (pendingResolvers.length) {
      const list = pendingResolvers;
      pendingResolvers = [];
      list.forEach((fn) => fn(enriched));
    }
  });

  async function getLiveScreenSnapshot() {
    const examStage = document.getElementById("examStage");
    const frame = document.getElementById("examIframe");
    if (examStage && !examStage.hidden && frame && frame.contentWindow) {
      const fromPostMessage = await new Promise((resolve) => {
        const timer = setTimeout(() => {
          pendingResolvers = pendingResolvers.filter((r) => r !== resolve);
          resolve(null);
        }, 220);
        pendingResolvers.push((data) => {
          clearTimeout(timer);
          resolve(data);
        });
        try {
          frame.contentWindow.postMessage({ type: "ETUTOR_REQUEST_ACTIVE_QUESTION" }, "*");
        } catch {
          clearTimeout(timer);
          resolve(null);
        }
      });
      if (fromPostMessage) return fromPostMessage;
      if (latestIframeQuestion) return latestIframeQuestion;
    }
    return readMainWebsiteFallbackContext();
  }

  drawer = new CikguWidgetDrawer({
    client,
    warmupMachine,
    speechIO,
    getLiveScreenSnapshot,
    getStudentName: () =>
      resolveStudentLoginName(latestIframeQuestion && latestIframeQuestion.candidateName)
  });
  drawer.mount();

  const examStageEl = document.getElementById("examStage");
  const syncExamStageBodyClass = () => {
    const isOpen = Boolean(examStageEl && !examStageEl.hidden);
    document.body.classList.toggle("is-exam-stage-open", isOpen);
  };
  syncExamStageBodyClass();

  if (examStageEl && window.MutationObserver) {
    const stageObs = new MutationObserver(() => {
      syncExamStageBodyClass();
      if (examStageEl.hidden) {
        latestIframeQuestion = null;
        drawer.setActiveScreenQuestion(readMainWebsiteFallbackContext());
      } else {
        installExamIframeSensorHook();
        const tipEl = document.getElementById("cikguAiTooltip");
        if (tipEl) tipEl.hidden = true;
      }
    });
    stageObs.observe(examStageEl, { attributes: true, attributeFilter: ["hidden"] });
  }

  const api = { client, warmupMachine, speechIO, drawer, getLiveScreenSnapshot };
  window.__CIKGU_AI_INSTANCE__ = api;
  return api;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCikguAiIntegration, { once: true });
  } else {
    initCikguAiIntegration();
  }
}
