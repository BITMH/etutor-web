/**
 * public-web/integrations/cikgu-ai/ui/markdown-spm.js
 * Pemformat teks selamat (bebas XSS) khusus untuk skema pemarkahan SPM:
 * menyerlahkan lencana markah [1m]/[4m], struktur Fakta/Huraian/Contoh/Inferens, dan tajuk seksyen.
 */

function escapeHtml(raw) {
  return String(raw || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderSpmMarkdown(text) {
  let safe = escapeHtml(text);

  // Tajuk tebal **[...]**
  safe = safe.replace(
    /\*\*\[([^\]]+)\]\*\*/g,
    '<div class="cikgu-ai-sec-badge">$1</div>'
  );

  // Teks tebal **...**
  safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Teks condong *...*
  safe = safe.replace(/(^|\s)\*([^*\n]+)\*(?=\s|[.,;:!?]|$)/g, "$1<em>$2</em>");

  // Lencana markah seperti [1m], [2m], [4 markah]
  safe = safe.replace(
    /\[(\d+\s*(?:m|markah))\]/gi,
    '<span class="cikgu-ai-mark-pill">$1</span>'
  );

  // Senarai bullet
  const lines = safe.split("\n");
  const out = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•]\s+/.test(trimmed)) {
      if (!inList) {
        out.push('<ul class="cikgu-ai-list">');
        inList = true;
      }
      out.push(`<li>${trimmed.replace(/^[-•]\s+/, "")}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (trimmed === "") {
        out.push('<div class="cikgu-ai-spacer"></div>');
      } else {
        out.push(`<p class="cikgu-ai-p">${line}</p>`);
      }
    }
  }
  if (inList) out.push("</ul>");

  return out.join("");
}
