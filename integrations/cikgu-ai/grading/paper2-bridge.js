/**
 * public-web/integrations/cikgu-ai/grading/paper2-bridge.js
 * Jambatan komunikasi penandaan subjektif Kertas 2 sebaris (ETUTOR_AI_SUB_GRADE_REQ) & penyegerakan kuota token.
 */

import { loadDailyTokenState } from "../config.js";
import { detectSubjectFromText, resolveStudentLoginName } from "../sensor/iframe-screen-sensor.js";

export function parseAiAwardedScore(text, maxMarks) {
  if (!text) return null;
  const m =
    String(text).match(/Markah\s+Cikgu\s+AI\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*\d+/i) ||
    String(text).match(/(\d+(?:\.\d+)?)\s*\/\s*\d+\s*Markah/i);
  if (!m) return null;
  const val = Math.round(parseFloat(m[1]));
  if (isNaN(val)) return null;
  return Math.max(0, Math.min(Number(maxMarks) || 20, val));
}

export function postTokenSyncToIframe(st = loadDailyTokenState()) {
  const frame = document.getElementById("examIframe");
  if (!frame || !frame.contentWindow || !st) return;
  try {
    frame.contentWindow.postMessage(
      {
        type: "ETUTOR_TOKEN_SYNC",
        remaining: st.remaining,
        limit: st.limit
      },
      "*"
    );
  } catch {}
}

export async function handlePaper2SubGradeRequest(ev, d, { client, warmupMachine }) {
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

  let accText = "";
  try {
    const curTok = loadDailyTokenState();
    if (curTok.remaining <= 0) {
      targetWin.postMessage(
        {
          type: "ETUTOR_AI_SUB_GRADE_LIMIT",
          subId: d.subId,
          remaining: 0,
          limit: curTok.limit,
          message: `Kuota ${curTok.limit} token AI harian anda telah penuh untuk hari ini (reset jam 12:00 tengah malam MYT). Sila klik butang 'Skema Jawapan' untuk menyemak jawapan rasmi tanpa had!`
        },
        "*"
      );
      return;
    }

    if (warmupMachine && warmupMachine.status !== "ready") {
      try {
        targetWin.postMessage(
          {
            type: "ETUTOR_AI_SUB_GRADE_STREAM",
            subId: d.subId,
            text: "Cikgu AI sedang membuka buku rekod skema KSSM...",
            aiScore: null,
            done: false
          },
          "*"
        );
      } catch {}
      await warmupMachine.greetCikgu();
    }

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
    const updatedTok = loadDailyTokenState();
    targetWin.postMessage(
      {
        type: "ETUTOR_AI_SUB_GRADE_STREAM",
        subId: d.subId,
        text: finalClean,
        aiScore: finalScore,
        remaining: updatedTok.remaining,
        limit: updatedTok.limit,
        done: true
      },
      "*"
    );
  } catch (err) {
    if (err && err.isDailyLimit) {
      const updatedTok = loadDailyTokenState();
      try {
        targetWin.postMessage(
          {
            type: "ETUTOR_AI_SUB_GRADE_LIMIT",
            subId: d.subId,
            remaining: 0,
            limit: updatedTok.limit,
            message: String(err.message)
          },
          "*"
        );
      } catch {}
      return;
    }
    try {
      targetWin.postMessage({ type: "ETUTOR_AI_SUB_GRADE_FALLBACK", subId: d.subId }, "*");
    } catch {}
  }
}
