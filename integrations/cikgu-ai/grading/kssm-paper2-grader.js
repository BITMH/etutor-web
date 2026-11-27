/**
 * public-web/integrations/cikgu-ai/grading/kssm-paper2-grader.js
 * Kotak jawapan terus (teks atau muat naik gambar) & semakan berstruktur Cikgu AI untuk soalan Kertas 2 KSSM.
 */

import { CikguFailoverClient } from "../api/failover-client.js";
import { loadDailyTokenState } from "../config.js";
import { compressDesktopImageFile } from "../ui/snap-photo-helper.js";
import { renderSpmMarkdown } from "../ui/markdown-spm.js";
import { parseAiAwardedScore } from "./paper2-bridge.js";

const MAX_B64_CHARS = 245000;
const client = new CikguFailoverClient();

function resizeDataUrl(dataUrl, maxSide, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Gagal mengecilkan gambar."));
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
      const w = Math.max(1, Math.round((img.width || 1) * scale));
      const h = Math.max(1, Math.round((img.height || 1) * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const outUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ dataUrl: outUrl, base64: outUrl.split(",")[1] || "", mime: "image/jpeg" });
    };
    img.src = dataUrl;
  });
}

async function compressImageUnderLimit(file) {
  let out = await compressDesktopImageFile(file);
  if (out.base64.length > MAX_B64_CHARS) {
    const r1 = await resizeDataUrl(out.dataUrl, 960, 0.65);
    out = { ...out, ...r1 };
  }
  if (out.base64.length > MAX_B64_CHARS) {
    const r2 = await resizeDataUrl(out.dataUrl, 760, 0.55);
    out = { ...out, ...r2 };
  }
  if (out.base64.length > MAX_B64_CHARS) {
    throw new Error("Saiz gambar masih melebihi had. Sila ambil gambar lebih dekat.");
  }
  return out;
}

function refreshAllTokenChips() {
  const st = loadDailyTokenState();
  document.querySelectorAll(".kssm-p2-token-chip").forEach((el) => {
    el.textContent = `Baki: ${st.remaining} Token (Tulis: 1 • Gambar: 3)`;
  });
}

function escapePlain(raw) {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bindPaper2Card(card) {
  const grader = card.querySelector(".kssm-p2-grader");
  if (!grader) return;

  const textarea = card.querySelector(".kssm-p2-textarea");
  const fileInput = card.querySelector(".kssm-p2-file-input");
  const uploadBtn = card.querySelector(".kssm-p2-upload-btn");
  const submitBtn = card.querySelector(".kssm-p2-submit-btn");
  const previewBox = card.querySelector(".kssm-p2-img-preview");
  const thumbEl = card.querySelector(".kssm-p2-img-thumb");
  const imgNameEl = card.querySelector(".kssm-p2-img-name");
  const rmImgBtn = card.querySelector(".kssm-p2-img-rm");
  const aiBox = card.querySelector(".kssm-p2-ai-box");
  const aiScoreEl = card.querySelector(".kssm-p2-ai-score");
  const aiBodyEl = card.querySelector(".kssm-p2-ai-body");

  let pendingImg = null;

  const syncPreview = () => {
    if (!previewBox || !thumbEl || !imgNameEl) return;
    if (pendingImg && pendingImg.dataUrl) {
      thumbEl.src = pendingImg.dataUrl;
      imgNameEl.textContent = pendingImg.name || "jawapan_pelajar.jpg";
      previewBox.hidden = false;
    } else {
      thumbEl.removeAttribute("src");
      previewBox.hidden = true;
    }
  };

  const clearImage = () => {
    pendingImg = null;
    if (fileInput) fileInput.value = "";
    syncPreview();
  };

  const showError = (msg) => {
    if (!aiBox || !aiBodyEl) return;
    aiBox.hidden = false;
    if (aiScoreEl) aiScoreEl.hidden = true;
    aiBodyEl.innerHTML = `<p class="kssm-p2-ai-err">${escapePlain(msg)}</p>`;
  };

  const handleFile = async (file) => {
    if (!file || !String(file.type || "").startsWith("image/")) return;
    try {
      pendingImg = await compressImageUnderLimit(file);
      syncPreview();
    } catch (err) {
      showError((err && err.message) || "Gagal memproses gambar.");
    }
  };

  if (uploadBtn && fileInput) uploadBtn.addEventListener("click", () => fileInput.click());
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) void handleFile(f);
    });
  }
  if (rmImgBtn) rmImgBtn.addEventListener("click", clearImage);

  if (textarea) {
    textarea.addEventListener("paste", (ev) => {
      const items = ev.clipboardData && ev.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith("image/")) {
          const f = items[i].getAsFile();
          if (f) {
            ev.preventDefault();
            void handleFile(f);
            break;
          }
        }
      }
    });
  }

  grader.addEventListener("dragover", (ev) => {
    if (ev.dataTransfer && Array.from(ev.dataTransfer.types || []).includes("Files")) ev.preventDefault();
  });
  grader.addEventListener("drop", (ev) => {
    const f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (f && String(f.type || "").startsWith("image/")) {
      ev.preventDefault();
      void handleFile(f);
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const typed = (textarea ? textarea.value : "").trim();
      const hasImg = Boolean(pendingImg && pendingImg.base64);
      if (typed.length < 2 && !hasImg) {
        showError("Sila tulis jawapan atau muat naik gambar jawapan anda dahulu.");
        return;
      }

      const maxMarks = Math.max(1, Math.min(100, Math.round(Number(card.dataset.p2Marks) || 4)));
      const needTok = hasImg ? 3 : 1;
      const curTok = loadDailyTokenState();
      if (curTok.remaining < needTok) {
        showError(`Baki token AI tidak mencukupi (${curTok.remaining} baki, perlukan ${needTok} token). Buka 'Petunjuk Kata Kunci & Panduan Pemarkahan' di bawah secara percuma.`);
        return;
      }

      submitBtn.disabled = true;
      const origLabel = submitBtn.innerHTML;
      submitBtn.textContent = "Menyemak...";
      if (aiBox) aiBox.hidden = false;
      if (aiScoreEl) aiScoreEl.hidden = true;
      if (aiBodyEl) aiBodyEl.innerHTML = "<p class=\"cikgu-ai-p\">Menghantar jawapan kepada Cikgu AI &amp; memadankan rubrik KSSM...</p>";

      let accText = "";
      try {
        await client.streamSemak(
          {
            subjek: card.dataset.p2Subject || "auto",
            mod: hasImg ? "semak_gambar" : "semak_pantask2",
            sub_id: (card.dataset.p2Subid || "").slice(0, 120),
            soalan: (card.dataset.p2Question || "").slice(0, 5500),
            jawapan_pelajar: (typed || "(Jawapan tulisan tangan dilampirkan melalui gambar)").slice(0, 7500),
            skema_rasmi: (card.dataset.p2Scheme || "").slice(0, 4500),
            imej_base64: hasImg ? pendingImg.base64.slice(0, 255000) : "",
            imej_mime: hasImg ? (pendingImg.mime || "image/jpeg") : "image/jpeg",
            sesi_sudah_sapa: true,
            markah_penuh: maxMarks,
            max_tokens: 4096
          },
          {
            onFailover: (msg) => {
              if (!accText && aiBodyEl) aiBodyEl.innerHTML = `<p class="cikgu-ai-p">${escapePlain(msg)}</p>`;
            },
            onToken: (tok) => {
              accText += tok;
              if (aiBodyEl) aiBodyEl.innerHTML = renderSpmMarkdown(accText);
              const sc = parseAiAwardedScore(accText, maxMarks);
              if (sc !== null && aiScoreEl) {
                aiScoreEl.textContent = `${sc} / ${maxMarks} Markah`;
                aiScoreEl.hidden = false;
              }
            }
          }
        );
        if (!accText && aiBodyEl) {
          showError("Tiada jawapan diterima daripada pelayan. Sila rujuk panduan pemarkahan di bawah atau cuba semula.");
        }
      } catch (err) {
        const msg = (err && err.message) || "Ralat menyambung ke Cikgu AI.";
        showError(`${msg} (Anda boleh semak 'Petunjuk Kata Kunci & Panduan Pemarkahan' secara percuma).`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origLabel;
        refreshAllTokenChips();
      }
    });
  }
}

function initKssmPaper2Graders() {
  refreshAllTokenChips();
  document.querySelectorAll(".kssm-p2-card[data-p2-idx]").forEach(bindPaper2Card);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKssmPaper2Graders);
} else {
  initKssmPaper2Graders();
}
