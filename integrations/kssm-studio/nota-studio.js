/**
 * public-web/integrations/kssm-studio/nota-studio.js
 * Studio templat visual berilustrasi, penjana PDF A4 terus & tetingkap Cetak segerak untuk Nota KSSM.
 */

import { buildA4PdfBlobFromJpegDataUrls } from "./pdf-packer.js";
import { renderNotaToA4Jpegs, TPL_THEMES } from "./canvas-renderer.js";

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function readNotaDomData(sheet) {
  const ds = sheet.dataset || {};
  const objectives = Array.from(sheet.querySelectorAll(".kssm-obj-item")).map((el) =>
    (el.getAttribute("data-obj-text") || el.textContent || "").trim()
  ).filter(Boolean);

  const subtopics = Array.from(sheet.querySelectorAll(".kssm-sub-card")).map((card) => ({
    title: (card.querySelector("h3") && card.querySelector("h3").textContent || "").trim(),
    summary: (card.querySelector(".kssm-sub-summary") && card.querySelector(".kssm-sub-summary").textContent || "").trim(),
    keyPoints: Array.from(card.querySelectorAll(".kssm-kp-list li")).map((li) => li.textContent.trim()).filter(Boolean),
    prompt: card.getAttribute("data-ex-prompt") || "",
    solution: card.getAttribute("data-ex-solution") || "",
    takeaway: card.getAttribute("data-ex-takeaway") || ""
  }));

  const mistakes = Array.from(sheet.querySelectorAll(".kssm-mistake-card")).map((card) => ({
    mistake: card.getAttribute("data-m-mistake") || "",
    correction: card.getAttribute("data-m-correction") || "",
    tip: card.getAttribute("data-m-tip") || ""
  }));

  return {
    formLabel: ds.formLabel || "",
    subjectName: ds.subjectName || "",
    subjectCode: ds.subjectCode || "",
    pages: ds.pages || "",
    dskp: ds.dskp || "",
    chapterHeading: ds.chapterHeading || "",
    heroSummary: ds.heroSummary || "",
    objectives,
    subtopics,
    mistakes
  };
}

function openIllustratedPrintWindow(sheet, bgUrl, th) {
  const styles = Array.from(document.querySelectorAll("style"))
    .map((s) => s.textContent || "")
    .join("\n");
  const title = sheet.dataset.chapterHeading || "Nota KSSM";
  const w = window.open("", "_blank");
  if (!w) {
    const notaTabBtn = document.querySelector('[data-kssm-tab-btn="nota"]');
    if (notaTabBtn) notaTabBtn.click();
    window.print();
    return;
  }

  const clone = sheet.cloneNode(true);
  clone.style.setProperty("--tpl-accent", th.accent);
  clone.style.setProperty("--tpl-soft", th.accentSoft);
  clone.style.setProperty("--tpl-border", th.border);
  clone.style.setProperty("--tpl-ink", th.ink);
  clone.style.setProperty("--tpl-bg", `url("${bgUrl}")`);

  w.document.open();
  w.document.write(`<!DOCTYPE html><html lang="ms"><head><meta charset="UTF-8"><title>${title} | Cetak PDF</title><style>
    @page { size: A4 portrait; margin: 8mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; color: #0f172a; background: #fff; }
    .print-toolbar { position: sticky; top: 0; z-index: 20; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 16px; background: #1e3a8a; color: #fff; }
    .print-toolbar button { padding: 8px 14px; border-radius: 9px; border: none; font-weight: 700; cursor: pointer; background: #10b981; color: #fff; }
    .print-toolbar button.sec { background: rgba(255,255,255,0.2); margin-left: 8px; }
    .print-wrap { max-width: 900px; margin: 14px auto; padding: 0 12px; }
    ${styles}
    .kssm-studio-bar { display: none !important; }
    @media print { .print-toolbar { display: none !important; } .print-wrap { max-width: 100%; margin: 0; padding: 0; } }
  </style></head><body>
    <div class="print-toolbar"><span>Pratonton Cetak A4 • ${title}</span><div><button id="goPrint" type="button">Cetak / Simpan PDF</button><button id="closeWin" type="button" class="sec">Tutup</button></div></div>
    <div class="print-wrap"></div>
  </body></html>`);
  w.document.close();

  const wrap = w.document.querySelector(".print-wrap");
  if (wrap) wrap.appendChild(w.document.importNode(clone, true));
  const goBtn = w.document.getElementById("goPrint");
  const clBtn = w.document.getElementById("closeWin");
  if (goBtn) goBtn.addEventListener("click", () => w.print());
  if (clBtn) clBtn.addEventListener("click", () => w.close());
  setTimeout(() => { try { w.focus(); w.print(); } catch (_) {} }, 250);
}

function initNotaStudio() {
  const sheet = document.getElementById("kssmNotaSheet");
  if (!sheet) return;
  const assetPrefix = sheet.dataset.assetPrefix || "../../../../";
  const subjSlug = sheet.dataset.subjectSlug || "umum";
  const storageKey = `etutor_kssm_nota_tpl_v1_${subjSlug}`;
  const swatches = Array.from(document.querySelectorAll("[data-nota-tpl]"));

  let activeTpl = sheet.dataset.defaultTpl || "bahasa";
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved && TPL_THEMES[saved]) activeTpl = saved;
  } catch (_) {}

  const applyTemplate = (tplKey, persist) => {
    const key = TPL_THEMES[tplKey] ? tplKey : "bahasa";
    const th = TPL_THEMES[key];
    activeTpl = key;
    sheet.dataset.tpl = key;
    sheet.style.setProperty("--tpl-accent", th.accent);
    sheet.style.setProperty("--tpl-soft", th.accentSoft);
    sheet.style.setProperty("--tpl-border", th.border);
    sheet.style.setProperty("--tpl-ink", th.ink);
    sheet.style.setProperty("--tpl-bg", `url("${assetPrefix}images/nota-templates/${th.file}")`);
    swatches.forEach((btn) => {
      const on = btn.getAttribute("data-nota-tpl") === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (persist) {
      try { localStorage.setItem(storageKey, key); } catch (_) {}
    }
  };

  swatches.forEach((btn) => {
    btn.addEventListener("click", () => applyTemplate(btn.getAttribute("data-nota-tpl"), true));
  });
  applyTemplate(activeTpl, false);

  const dlBtn = document.getElementById("kssmDownloadPdfBtn");
  if (dlBtn) {
    dlBtn.addEventListener("click", async () => {
      const labelEl = dlBtn.querySelector("span") || dlBtn;
      const origText = labelEl.textContent;
      dlBtn.disabled = true;
      labelEl.textContent = "Menjana PDF...";
      try {
        const th = TPL_THEMES[activeTpl] || TPL_THEMES.bahasa;
        const bgImg = await loadImage(`${assetPrefix}images/nota-templates/${th.file}`);
        const pageData = renderNotaToA4Jpegs({ data: readNotaDomData(sheet), theme: th, bgImage: bgImg });
        const blob = buildA4PdfBlobFromJpegDataUrls(pageData);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = sheet.dataset.pdfFilename || "Nota_KSSM_eTutor.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 15000);
        labelEl.textContent = "PDF Dimuat Turun!";
        setTimeout(() => { labelEl.textContent = origText; }, 2500);
      } catch (err) {
        labelEl.textContent = "Gagal Jana PDF";
        setTimeout(() => { labelEl.textContent = origText; }, 2500);
      } finally {
        dlBtn.disabled = false;
      }
    });
  }

  const printBtn = document.getElementById("kssmPrintPdfBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const th = TPL_THEMES[activeTpl] || TPL_THEMES.bahasa;
      const bgUrl = `${assetPrefix}images/nota-templates/${th.file}`;
      openIllustratedPrintWindow(sheet, bgUrl, th);
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNotaStudio);
} else {
  initNotaStudio();
}
