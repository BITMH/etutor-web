/**
 * public-web/integrations/cikgu-ai/grading/paper2-bridge.js
 * Jambatan komunikasi penandaan subjektif Kertas 2 sebaris (ETUTOR_AI_SUB_GRADE_REQ) & penyegerakan kuota token.
 */

import { loadDailyTokenState } from "../config.js";
import { detectSubjectFromText, resolveStudentLoginName } from "../sensor/iframe-screen-sensor.js";

export function parseAiAwardedScore(text, maxMarks) {
  if (!text) return null;
  const m =
    String(text).match(/Markah\s+Cikgu\s+AI\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+)/i) ||
    String(text).match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+)\s*Markah/i);
  if (!m) return null;
  const rawVal = parseFloat(m[1]);
  const rawDenom = parseFloat(m[2]);
  if (isNaN(rawVal)) return null;
  const targetMax = Math.max(1, Math.min(100, Math.round(Number(maxMarks) || rawDenom || 20)));
  const scaled =
    rawDenom > 0 && rawDenom !== targetMax
      ? Math.round((rawVal / rawDenom) * targetMax)
      : Math.round(rawVal);
  return Math.max(0, Math.min(targetMax, scaled));
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
  const maxMarks = Math.max(1, Math.min(100, Math.round(Number(d.marks) || 2)));
  const rawAnsStr = String(d.studentAnswer || "");
  const hasImg = Boolean(d.imageBase64 && String(d.imageBase64).length > 30);
  const needTok = Number(d.tokenCost) || (hasImg ? 3 : 1);
  const emptyPtsMatches = [...rawAnsStr.matchAll(/\((\d+)\s*m\)\]\s*:\s*\(kosong/gi)];
  const emptySlotPts = emptyPtsMatches.reduce((acc, m) => acc + (parseInt(m[1], 10) || 0), 0);
  const emptyCount = (rawAnsStr.match(/\(kosong/gi) || []).length;
  const cappedMax = hasImg ? maxMarks : Math.max(0, maxMarks - (emptySlotPts > 0 ? emptySlotPts : emptyCount));

  const normalizeAiGradeOutput = (raw) => {
    let cleanTxt = String(raw || "").replace(/\*\*/g, "").trim();
    let sc = parseAiAwardedScore(cleanTxt, maxMarks);
    if (sc !== null) {
      if (sc > cappedMax) sc = cappedMax;
      cleanTxt = cleanTxt.replace(
        /(Markah\s+Cikgu\s+AI\s*:\s*)\d+(?:\.\d+)?\s*\/\s*\d+/i,
        `$1${sc} / ${maxMarks}`
      );
    }
    return { cleanTxt, parsedScore: sc };
  };

  let accText = "";
  try {
    const curTok = loadDailyTokenState();
    if (curTok.remaining < needTok) {
      targetWin.postMessage(
        {
          type: "ETUTOR_AI_SUB_GRADE_LIMIT",
          subId: d.subId,
          remaining: curTok.remaining,
          limit: curTok.limit,
          message: `Baki token AI tidak mencukupi (${curTok.remaining} baki, perlukan ${needTok} token). Sila tambah Token AI atau klik butang 'Skema Jawapan' secara terbuka!`
        },
        "*"
      );
      return;
    }

    if (!hasImg && warmupMachine && warmupMachine.status !== "ready") {
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
        mod: hasImg ? "semak_gambar" : "semak_pantask2",
        sub_id: String(d.subId || "").slice(0, 120),
        soalan: String(d.questionText || "").slice(0, 5500),
        jawapan_pelajar: rawAnsStr.slice(0, 7500),
        skema_rasmi: String(d.officialScheme || "").slice(0, 4500),
        imej_base64: hasImg ? String(d.imageBase64).slice(0, 255000) : "",
        imej_mime: hasImg ? String(d.imageMime || "image/jpeg") : "image/jpeg",
        nama_pelajar: resolveStudentLoginName(d.candidateName),
        sesi_sudah_sapa: true,
        markah_penuh: maxMarks,
        max_tokens: hasImg || maxMarks >= 20 ? 520 : 340
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
