/**
 * public-web/integrations/cikgu-ai/sensor/iframe-screen-sensor.js
 * Penderia skrin iframe kuiz (#examIframe.srcdoc), pengesan subjek KSSM, dan penyelesai nama pelajar.
 */

import { DEFAULT_CIKGU_CONFIG } from "../config.js";

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
  } catch {}

  try {
    const openName = localStorage.getItem("etutor_open_student_name_v1");
    if (openName && !isGeneric(openName)) return String(openName).trim();
  } catch {}

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
  } catch {}

  if (iframeCandidateName && !isGeneric(iframeCandidateName)) {
    return String(iframeCandidateName).trim();
  }

  return "";
}

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

export function installExamIframeSensorHook() {
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

  if (
    frame.srcdoc &&
    !frame.srcdoc.includes("loading-spinner") &&
    !frame.srcdoc.includes("cikgu-ai-screen-sensor") &&
    !frame.srcdoc.includes("ETUTOR_ACTIVE_QUESTION")
  ) {
    frame.srcdoc = injectSensorIntoHtml(frame.srcdoc);
  }
}

export function detectSubjectFromText(text) {
  if (!text) return "";
  const lower = String(text).toLowerCase();
  const sorted = [...DEFAULT_CIKGU_CONFIG.subjects].sort((a, b) => b.length - a.length);
  for (const subj of sorted) {
    if (lower.includes(subj.toLowerCase())) return subj;
  }
  if (lower.includes("pqs") || lower.includes("al-quran")) {
    return "Pendidikan Al-Quran dan As-Sunnah";
  }
  if (lower.includes("usuluddin")) return "Usul al-Din";
  return "";
}

export function readMainWebsiteFallbackContext() {
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
