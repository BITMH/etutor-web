/**
 * public-web/integrations/kssm-studio/canvas-renderer.js
 * Penjana kanvas A4 berilustrasi berbilang muka surat untuk Nota KSSM (dibungkus terus ke PDF).
 */

export const TPL_THEMES = {
  bahasa: { label: "Klasik Gading", accent: "#1d4ed8", accentSoft: "#eff6ff", border: "#93c5fd", ink: "#1e3a8a", file: "bahasa.jpg" },
  sains: { label: "Botani Pudina", accent: "#047857", accentSoft: "#ecfdf5", border: "#6ee7b7", ink: "#064e3b", file: "sains.jpg" },
  matematik: { label: "Geometri Biru", accent: "#4338ca", accentSoft: "#eef2ff", border: "#a5b4fc", ink: "#312e81", file: "matematik.jpg" },
  sejarah: { label: "Warisan Emas", accent: "#b45309", accentSoft: "#fffbeb", border: "#fcd34d", ink: "#78350f", file: "sejarah.jpg" },
  islam: { label: "Arabes Zamrud", accent: "#0f766e", accentSoft: "#f0fdfa", border: "#5eead4", ink: "#134e4a", file: "islam.jpg" },
  geografi: { label: "Puncak Awan", accent: "#0369a1", accentSoft: "#f0f9ff", border: "#7dd3fc", ink: "#0c4a6e", file: "geografi.jpg" }
};

const W = 1240;
const H = 1754;
const SX = 98;
const CW = 1044;
const TOP = 136;
const BOT = 1612;

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapLines(ctx, text, maxW, font) {
  ctx.font = font;
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let cur = words[0];
  for (let i = 1; i < words.length; i++) {
    const nxt = `${cur} ${words[i]}`;
    if (ctx.measureText(nxt).width <= maxW) cur = nxt;
    else { lines.push(cur); cur = words[i]; }
  }
  lines.push(cur);
  return lines;
}

function drawLines(ctx, lines, x, startY, lineH, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  let y = startY;
  for (const ln of lines) {
    ctx.fillText(ln, x, y);
    y += lineH;
  }
  return y;
}

export function renderNotaToA4Jpegs({ data, theme, bgImage }) {
  const th = theme || TPL_THEMES.bahasa;
  const pages = [];
  let canvas = null;
  let ctx = null;
  let curY = TOP;

  const startPage = () => {
    canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    if (bgImage && bgImage.naturalWidth > 0) {
      const sc = Math.max(W / bgImage.naturalWidth, H / bgImage.naturalHeight);
      const dw = bgImage.naturalWidth * sc;
      const dh = bgImage.naturalHeight * sc;
      ctx.drawImage(bgImage, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }
    ctx.fillStyle = "rgba(255,255,255,0.84)";
    roundRectPath(ctx, 78, 114, 1084, 1528, 22);
    ctx.fill();
    ctx.strokeStyle = th.border;
    ctx.lineWidth = 2;
    ctx.stroke();
    pages.push(canvas);
    curY = TOP;
  };

  const ensureSpace = (needH) => {
    if (!ctx || (curY + needH > BOT && curY > TOP + 20)) startPage();
  };

  startPage();

  // Masthead kad utama
  const titleLines = wrapLines(ctx, data.chapterHeading, CW - 48, "800 32px 'Lexend', sans-serif");
  const sumLines = wrapLines(ctx, data.heroSummary, CW - 48, "400 18px 'Plus Jakarta Sans', sans-serif");
  const dskpLines = wrapLines(ctx, `Rujukan Rasmi: ${data.dskp}`, CW - 48, "600 16px 'Plus Jakarta Sans', sans-serif");
  const mastH = 74 + titleLines.length * 40 + sumLines.length * 26 + dskpLines.length * 24 + 28;
  roundRectPath(ctx, SX, curY, CW, mastH, 16);
  ctx.fillStyle = th.accentSoft;
  ctx.fill();
  ctx.strokeStyle = th.accent;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  roundRectPath(ctx, SX + 22, curY + 18, 220, 30, 15);
  ctx.fillStyle = th.accent;
  ctx.fill();
  ctx.font = "800 14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("eTutor.my • NOTA KSSM", SX + 38, curY + 25);

  ctx.font = "700 16px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = th.ink;
  ctx.fillText(`${data.formLabel} • ${data.subjectName} (${data.subjectCode}) • ${data.pages}`, SX + 258, curY + 24);

  let my = drawLines(ctx, titleLines, SX + 24, curY + 64, 40, "800 32px 'Lexend', sans-serif", th.ink);
  my = drawLines(ctx, sumLines, SX + 24, my + 8, 26, "400 18px 'Plus Jakarta Sans', sans-serif", "#334155");
  drawLines(ctx, dskpLines, SX + 24, my + 8, 24, "600 16px 'Plus Jakarta Sans', sans-serif", th.accent);
  curY += mastH + 22;

  // Objektif Pembelajaran DSKP
  if (data.objectives && data.objectives.length) {
    const objRows = data.objectives.map((txt, idx) => ({
      num: String(idx + 1).padStart(2, "0"),
      lines: wrapLines(ctx, txt, CW - 92, "500 17px 'Plus Jakarta Sans', sans-serif")
    }));
    const objH = 54 + objRows.reduce((s, r) => s + Math.max(32, r.lines.length * 25) + 10, 12);
    ensureSpace(objH);
    roundRectPath(ctx, SX, curY, CW, objH, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = th.border;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.font = "800 18px 'Lexend', sans-serif";
    ctx.fillStyle = th.ink;
    ctx.fillText("OBJEKTIF PEMBELAJARAN DSKP", SX + 22, curY + 18);
    let oy = curY + 54;
    for (const row of objRows) {
      ctx.beginPath();
      ctx.arc(SX + 36, oy + 12, 14, 0, Math.PI * 2);
      ctx.fillStyle = th.accent;
      ctx.fill();
      ctx.font = "800 13px 'Lexend', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(row.num, SX + 27, oy + 5);
      drawLines(ctx, row.lines, SX + 64, oy, 25, "500 17px 'Plus Jakarta Sans', sans-serif", "#0f172a");
      oy += Math.max(32, row.lines.length * 25) + 10;
    }
    curY += objH + 22;
  }

  // Subtopik
  (data.subtopics || []).forEach((sub, idx) => {
    const tLines = wrapLines(ctx, sub.title, CW - 48, "700 22px 'Lexend', sans-serif");
    const sLines = wrapLines(ctx, sub.summary, CW - 48, "400 17px 'Plus Jakarta Sans', sans-serif");
    const kpRows = (sub.keyPoints || []).map((kp) => wrapLines(ctx, kp, CW - 76, "400 17px 'Plus Jakarta Sans', sans-serif"));
    const exQ = wrapLines(ctx, `Contoh: ${sub.prompt}`, CW - 76, "600 16px 'Plus Jakarta Sans', sans-serif");
    const exS = wrapLines(ctx, `Penyelesaian: ${sub.solution}`, CW - 76, "400 16px 'Plus Jakarta Sans', sans-serif");
    const exT = wrapLines(ctx, `Tip Penting: ${sub.takeaway}`, CW - 76, "700 16px 'Plus Jakarta Sans', sans-serif");
    const exH = 24 + (exQ.length + exS.length + exT.length) * 23 + 16;
    const kpH = kpRows.reduce((s, r) => s + r.length * 24 + 6, 0);
    const cardH = 54 + tLines.length * 29 + sLines.length * 24 + kpH + exH + 40;

    ensureSpace(cardH);
    roundRectPath(ctx, SX, curY, CW, cardH, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = th.border;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    roundRectPath(ctx, SX, curY, CW, 8, 8);
    ctx.fillStyle = th.accent;
    ctx.fill();

    roundRectPath(ctx, SX + 22, curY + 20, 122, 24, 12);
    ctx.fillStyle = th.accentSoft;
    ctx.fill();
    ctx.font = "800 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = th.accent;
    ctx.fillText(`SUBTOPIK ${String(idx + 1).padStart(2, "0")}`, SX + 34, curY + 26);

    let sy = drawLines(ctx, tLines, SX + 22, curY + 54, 29, "700 22px 'Lexend', sans-serif", th.ink);
    sy = drawLines(ctx, sLines, SX + 22, sy + 6, 24, "400 17px 'Plus Jakarta Sans', sans-serif", "#334155") + 10;
    for (const r of kpRows) {
      ctx.beginPath();
      ctx.arc(SX + 32, sy + 10, 4, 0, Math.PI * 2);
      ctx.fillStyle = th.accent;
      ctx.fill();
      sy = drawLines(ctx, r, SX + 46, sy, 24, "400 17px 'Plus Jakarta Sans', sans-serif", "#0f172a") + 6;
    }

    roundRectPath(ctx, SX + 22, sy + 4, CW - 44, exH, 12);
    ctx.fillStyle = th.accentSoft;
    ctx.fill();
    ctx.strokeStyle = th.border;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    let ey = drawLines(ctx, exQ, SX + 38, sy + 16, 23, "600 16px 'Plus Jakarta Sans', sans-serif", "#1e293b");
    ey = drawLines(ctx, exS, SX + 38, ey + 4, 23, "400 16px 'Plus Jakarta Sans', sans-serif", "#334155");
    drawLines(ctx, exT, SX + 38, ey + 4, 23, "700 16px 'Plus Jakarta Sans', sans-serif", "#047857");
    curY += cardH + 20;
  });

  // Kesilapan Lazim
  (data.mistakes || []).forEach((m, idx) => {
    const l1 = wrapLines(ctx, `ELAKKAN: ${m.mistake}`, CW - 48, "600 16px 'Plus Jakarta Sans', sans-serif");
    const l2 = wrapLines(ctx, `TEPAT: ${m.correction}`, CW - 48, "600 16px 'Plus Jakarta Sans', sans-serif");
    const l3 = wrapLines(ctx, `Tip Skor Exam: ${m.tip}`, CW - 48, "700 16px 'Plus Jakarta Sans', sans-serif");
    const mh = 46 + (l1.length + l2.length + l3.length) * 24 + 24;
    ensureSpace(mh);
    roundRectPath(ctx, SX, curY, CW, mh, 14);
    ctx.fillStyle = "#fffbeb";
    ctx.fill();
    ctx.strokeStyle = "#fcd34d";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.font = "800 14px 'Lexend', sans-serif";
    ctx.fillStyle = "#92400e";
    ctx.fillText(`AMARAN PEMERIKSA #${idx + 1}`, SX + 22, curY + 14);
    let my2 = drawLines(ctx, l1, SX + 22, curY + 42, 24, "600 16px 'Plus Jakarta Sans', sans-serif", "#991b1b");
    my2 = drawLines(ctx, l2, SX + 22, my2 + 4, 24, "600 16px 'Plus Jakarta Sans', sans-serif", "#065f46");
    drawLines(ctx, l3, SX + 22, my2 + 4, 24, "700 16px 'Plus Jakarta Sans', sans-serif", "#92400e");
    curY += mh + 16;
  });

  const totalP = pages.length;
  pages.forEach((c, i) => {
    const fCtx = c.getContext("2d");
    fCtx.font = "600 14px 'Plus Jakarta Sans', sans-serif";
    fCtx.fillStyle = "#475569";
    fCtx.fillText("eTutor.my • Nota Ringkas KSSM (0 Token)", 98, 1662);
    fCtx.fillText(`Muka Surat ${i + 1} / ${totalP}`, 1015, 1662);
  });

  return pages.map((c) => ({ dataUrl: c.toDataURL("image/jpeg", 0.90), width: W, height: H }));
}
