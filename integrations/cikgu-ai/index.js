/**
 * public-web/integrations/cikgu-ai/index.js
 * Pintu Masuk Tunggal (Plug-and-Play Integration Entrypoint) untuk Cikgu AI.
 * Menyuntik penderia skrin secara automatik ke dalam #examIframe.srcdoc (berfungsi walaupun
 * HTML kuiz dimuat turun daripada pelayan jauh Google Apps Script!) tanpa menyentuh app.js.
 */

import { DEFAULT_CIKGU_CONFIG } from "./config.js?v=13";
import { CikguFailoverClient } from "./api/failover-client.js?v=13";
import { WarmupStateMachine } from "./state/warmup-machine.js?v=13";
import { CikguSpeechIO } from "./audio/speech-io.js?v=13";
import { CikguWidgetDrawer } from "./ui/widget-drawer.js?v=13";

function injectScopedStylesheet() {
  if (document.getElementById("cikguAiScopedCss")) return;
  const link = document.createElement("link");
  link.id = "cikguAiScopedCss";
  link.rel = "stylesheet";
  link.href = new URL("./ui/cikgu-ai.css?v=13", import.meta.url).href;
  document.head.appendChild(link);
}

export function resolveStudentLoginName(iframeCandidateName = "") {
  const isGeneric = (s) =>
    !s ||
    /^(pelajar|pelajar berdaftar|calon|tetamu|guest|anda|log masuk|login|cikgu|—|-)$/i.test(
      String(s).trim()
    );

  try {
    const rawSession = localStorage.getItem("etutor_portal_session_v1");
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      const bName = parsed && parsed.user && (parsed.user.buyerName || parsed.user.name);
      if (bName && !isGeneric(bName)) return String(bName).trim();
    }
  } catch {
    // abaikan
  }

  try {
    const openName = localStorage.getItem("etutor_open_student_name_v1");
    if (openName && !isGeneric(openName)) return String(openName).trim();
  } catch {
    // abaikan
  }

  for (const domId of ["navBuyerName", "headerUserName"]) {
    const hdrEl = document.getElementById(domId);
    if (hdrEl && hdrEl.textContent && !isGeneric(hdrEl.textContent)) {
      return hdrEl.textContent.trim();
    }
  }

  try {
    const syncEmail = localStorage.getItem("etutor_sync_email_v1");
    if (syncEmail && syncEmail.includes("@")) {
      const prefix = syncEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
      if (prefix && !isGeneric(prefix)) return prefix;
    }
  } catch {
    // abaikan
  }

  if (iframeCandidateName && !isGeneric(iframeCandidateName)) {
    return String(iframeCandidateName).trim();
  }

  return "";
}

// Skrip penderia ringan yang disuntik ke dalam iframe kuiz supaya #examIframe sentiasa
// menghantar teks penuh soalan aktif, pilihan A/B/C/D, dan jawapan ditaip pelajar ke Cikgu AI.
const IFRAME_SCREEN_SENSOR_SNIPPET = `
<script id="cikgu-ai-screen-sensor">
(function(){
  if (window.__CIKGU_SENSOR_ACTIVE__) return;
  window.__CIKGU_SENSOR_ACTIVE__ = true;
  var emitTimer = null;
  function readAndSendActiveQuestion() {
    try {
      var qc = document.getElementById("questionContainer") ||
               document.getElementById("questionCard") ||
               document.querySelector(".question-card");
      if (!qc || window.getComputedStyle(qc).display === "none") return;
      var examView = document.getElementById("examView");
      if (examView && window.getComputedStyle(examView).display === "none") return;

      var headerH1 = ((document.querySelector("header h1") || {}).textContent || "").trim();
      var clone = qc.cloneNode(true);
      var ignoreEls = clone.querySelectorAll("script, style, .math-strip, .skema-pre");
      for (var i = 0; i < ignoreEls.length; i++) { ignoreEls[i].remove(); }

      var imgNotes = [];
      var imgs = qc.querySelectorAll("img[alt]");
      for (var m = 0; m < imgs.length; m++) {
        var alt = (imgs[m].getAttribute("alt") || "").trim();
        if (alt && alt.length > 4) imgNotes.push("[Rajah: " + alt + "]");
      }

      var cardText = (clone.innerText || clone.textContent || "").replace(/\\n{3,}/g, "\\n\\n").trim();
      if (!cardText || cardText.length < 8) return;

      var fullQ = (imgNotes.length ? imgNotes.join("\\n") + "\\n\\n" : "") + cardText;

      var drafts = [];
      var selNodes = qc.querySelectorAll(".option-item.selected, .opt-card.selected, .opt-btn.selected, [aria-checked='true'], input[type='radio']:checked");
      for (var s = 0; s < selNodes.length; s++) {
        var box = selNodes[s].closest ? (selNodes[s].closest(".option-item, .opt-card, .opt-btn, label, button") || selNodes[s]) : selNodes[s];
        var st = (box.innerText || box.textContent || "").replace(/\\s+/g, " ").trim();
        if (st && drafts.indexOf("Pilihan pelajar: " + st) === -1) drafts.push("Pilihan pelajar: " + st);
      }

      var inputs = qc.querySelectorAll("textarea, input[type='text'], input[type='number']");
      for (var j = 0; j < inputs.length; j++) {
        var val = (inputs[j].value || "").trim();
        if (val) {
          var wrap = inputs[j].closest ? inputs[j].closest(".slot-item, .subquestion-card, .subq-card, label") : null;
          var lbl = wrap ? ((wrap.querySelector(".slot-label, .subquestion-header") || {}).textContent || "").replace(/\\s+/g, " ").trim() : "";
          drafts.push((lbl ? "[" + lbl + "]: " : "Jawapan pelajar: ") + val);
        }
      }

      var qNumMatch = cardText.match(/Soalan\\s+\\d+(?:\\s+daripada\\s+\\d+)?/i);
      var qShort = qNumMatch ? qNumMatch[0] : "Soalan Semasa";
      var marksMatch = cardText.match(/(\\d+)\\s*Markah/i);
      var marks = marksMatch ? parseInt(marksMatch[1], 10) : 4;

      var candEl = document.getElementById("candidateNameInput");
      var candName = candEl && candEl.value ? candEl.value.trim() : "";

      window.parent.postMessage({
        type: "CIKGU_AI_ACTIVE_QUESTION",
        quizTitle: headerH1 || document.title || "",
        questionTitle: qShort,
        fullQuestion: fullQ.slice(0, 3400),
        studentDraft: drafts.join("\\n").slice(0, 1500),
        candidateName: candName,
        marks: marks || 4
      }, "*");
    } catch (e) {}
  }

  function scheduleRead() {
    if (emitTimer) clearTimeout(emitTimer);
    emitTimer = setTimeout(readAndSendActiveQuestion, 60);
  }

  if (window.MutationObserver && document.body) {
    new MutationObserver(scheduleRead).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-checked"]
    });
  }
  document.addEventListener("click", scheduleRead, true);
  document.addEventListener("input", scheduleRead, true);
  window.addEventListener("message", function(ev) {
    if (ev && ev.data && ev.data.type === "ETUTOR_REQUEST_ACTIVE_QUESTION") {
      readAndSendActiveQuestion();
    }
  });
  setTimeout(readAndSendActiveQuestion, 180);
  setTimeout(readAndSendActiveQuestion, 700);
})();
${"<" + "/script>"}
`;

function installExamIframeSensorHook() {
  const frame = document.getElementById("examIframe");
  if (!frame || frame.__cikguHookInstalled) return;
  frame.__cikguHookInstalled = true;

  const injectSensorIntoHtml = (rawHtml) => {
    const html = String(rawHtml || "");
    if (
      !html ||
      html.includes("loading-spinner") ||
      html.includes("cikgu-ai-screen-sensor") ||
      html.includes("ETUTOR_ACTIVE_QUESTION")
    ) {
      return html;
    }
    if (/<\/body>/i.test(html)) {
      return html.replace(/<\/body>/i, () => `${IFRAME_SCREEN_SENSOR_SNIPPET}\n</body>`);
    }
    return html + IFRAME_SCREEN_SENSOR_SNIPPET;
  };

  // Pintas penetapan examIframe.srcdoc secara langsung supaya walaupun HTML datang dari GAS jauh,
  // penderia Cikgu AI tetap disuntik 100% setiap kali kertas soalan dibuka!
  const proto = Object.getPrototypeOf(frame);
  const desc =
    Object.getOwnPropertyDescriptor(frame, "srcdoc") ||
    Object.getOwnPropertyDescriptor(proto, "srcdoc") ||
    Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "srcdoc");

  if (desc && desc.set && desc.get) {
    Object.defineProperty(frame, "srcdoc", {
      configurable: true,
      enumerable: true,
      get() {
        return desc.get.call(this);
      },
      set(val) {
        desc.set.call(this, injectSensorIntoHtml(val));
      }
    });
  }

  // Jika kertas soalan sudah pun dibuka sebelum skrip ini dimuatkan, suntik sekarang
  if (
    frame.srcdoc &&
    !frame.srcdoc.includes("loading-spinner") &&
    !frame.srcdoc.includes("cikgu-ai-screen-sensor") &&
    !frame.srcdoc.includes("ETUTOR_ACTIVE_QUESTION")
  ) {
    frame.srcdoc = injectSensorIntoHtml(frame.srcdoc);
  }
}

function detectSubjectFromText(text) {
  if (!text) return "";
  const lower = String(text).toLowerCase();
  const sorted = [...DEFAULT_CIKGU_CONFIG.subjects].sort((a, b) => b.length - a.length);
  for (const subj of sorted) {
    if (lower.includes(subj.toLowerCase())) {
      return subj;
    }
  }
  if (lower.includes("pqs") || lower.includes("al-quran")) {
    return "Pendidikan Al-Quran dan As-Sunnah";
  }
  if (lower.includes("usuluddin")) {
    return "Usul al-Din";
  }
  return "";
}

function readMainWebsiteFallbackContext() {
  const demoQ = document.getElementById("lpDemoQuestionText");
  const demoOpts = document.getElementById("lpDemoOptionsGrid");
  const demoTopic = document.getElementById("lpDemoTopicLabel");
  if (demoQ && demoQ.offsetParent !== null && demoQ.textContent.trim()) {
    const topicTxt = demoTopic ? demoTopic.textContent.trim() : "Soalan Demo Portal";
    const optsTxt = demoOpts ? demoOpts.innerText.trim() : "";
    return {
      quizTitle: "Demo Interaktif Halaman Utama",
      subject: detectSubjectFromText(topicTxt),
      questionTitle: "Soalan Demo",
      fullQuestion: `${topicTxt}\n\n${demoQ.textContent.trim()}\n\n${optsTxt}`.trim(),
      studentDraft: "",
      marks: 1
    };
  }
  return null;
}

export function initCikguAiIntegration() {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  if (window.__CIKGU_AI_INSTANCE__) return window.__CIKGU_AI_INSTANCE__;

  injectScopedStylesheet();
  installExamIframeSensorHook();

  let latestIframeQuestion = null;
  let pendingResolvers = [];

  function parseAiAwardedScore(text, maxMarks) {
    if (!text) return null;
    const m =
      String(text).match(/Markah\s+Cikgu\s+AI\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*\d+/i) ||
      String(text).match(/(\d+(?:\.\d+)?)\s*\/\s*\d+\s*Markah/i);
    if (!m) return null;
    const val = Math.round(parseFloat(m[1]));
    if (isNaN(val)) return null;
    return Math.max(0, Math.min(Number(maxMarks) || 20, val));
  }

  window.addEventListener("message", (ev) => {
    const d = ev && ev.data;
    if (!d || typeof d !== "object") return;

    if (d.type === "ETUTOR_AI_SUB_GRADE_REQ" && d.subId) {
      const frame = document.getElementById("examIframe");
      const targetWin = (ev && ev.source) || (frame && frame.contentWindow);
      if (!targetWin) return;
      const stageTitle = ((document.getElementById("examStageTitle") || {}).textContent || "").trim();
      const detectedSubj = d.subject || detectSubjectFromText(`${stageTitle} ${d.quizTitle}`) || "auto";
      const maxMarks = Number(d.marks) || 2;
      const emptyCount = (String(d.studentAnswer || "").match(/\(kosong/gi) || []).length;
      const cappedMax = Math.max(0, maxMarks - emptyCount);

      const normalizeAiGradeOutput = (raw) => {
        let cleanTxt = String(raw || "").replace(/\*\*/g, "").trim();
        let sc = parseAiAwardedScore(cleanTxt, maxMarks);
        if (sc !== null && sc > cappedMax) {
          sc = cappedMax;
          cleanTxt = cleanTxt.replace(
            /(Markah\s+Cikgu\s+AI\s*:\s*)\d+(?:\.\d+)?(\s*\/\s*\d+)/i,
            `$1${sc}$2`
          );
        }
        return { cleanTxt, parsedScore: sc };
      };

      (async () => {
        let accText = "";
        try {
          await client.streamSemak(
            {
              subjek: detectedSubj,
              mod: "semak_pantask2",
              soalan: String(d.questionText || "").slice(0, 3500),
              jawapan_pelajar: String(d.studentAnswer || "").slice(0, 3500),
              skema_rasmi: String(d.officialScheme || "").slice(0, 2400),
              nama_pelajar: resolveStudentLoginName(d.candidateName),
              sesi_sudah_sapa: true,
              markah_penuh: maxMarks,
              max_tokens: 340
            },
            {
              onToken: (tok) => {
                accText += tok;
                const { cleanTxt, parsedScore } = normalizeAiGradeOutput(accText);
                try {
                  targetWin.postMessage(
                    {
                      type: "ETUTOR_AI_SUB_GRADE_STREAM",
                      subId: d.subId,
                      text: cleanTxt,
                      aiScore: parsedScore,
                      done: false
                    },
                    "*"
                  );
                } catch {}
              }
            }
          );
          const { cleanTxt: finalClean, parsedScore: finalScore } = normalizeAiGradeOutput(accText);
          if (!finalClean) {
            targetWin.postMessage({ type: "ETUTOR_AI_SUB_GRADE_FALLBACK", subId: d.subId }, "*");
            return;
          }
          targetWin.postMessage(
            {
              type: "ETUTOR_AI_SUB_GRADE_STREAM",
              subId: d.subId,
              text: finalClean,
              aiScore: finalScore,
              done: true
            },
            "*"
          );
        } catch {
          // Jika AI gagal / luar talian, kembali kepada fallback asal 100% secara automatik
          try {
            targetWin.postMessage({ type: "ETUTOR_AI_SUB_GRADE_FALLBACK", subId: d.subId }, "*");
          } catch {}
        }
      })();
      return;
    }

    if (d.type !== "CIKGU_AI_ACTIVE_QUESTION" && d.type !== "ETUTOR_ACTIVE_QUESTION") return;
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

  const client = new CikguFailoverClient();
  const speechIO = new CikguSpeechIO({ client });
  let drawer = null;

  const warmupMachine = new WarmupStateMachine(client, (state) => {
    if (drawer) drawer.updateWarmupUi(state);
  });

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

  const isLocalPreviewHost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const hasExplicitEndpoint = Boolean(
    (window.ETUTOR_CONFIG &&
      (window.ETUTOR_CONFIG.CIKGU_LOCAL_DEV || window.ETUTOR_CONFIG.CIKGU_CLOUD_RUN_URL)) ||
      (() => {
        try {
          return Boolean(localStorage.getItem("etutor_cikgu_cloudrun_url_v1"));
        } catch {
          return false;
        }
      })()
  );

  if (!isLocalPreviewHost || hasExplicitEndpoint) {
    setTimeout(() => {
      warmupMachine.triggerSilentPrewarm();
    }, DEFAULT_CIKGU_CONFIG.silentPrewarmDelayMs);
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
