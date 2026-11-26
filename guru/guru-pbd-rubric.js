(function () {
  "use strict";

  var MALAYSIA_STATES = [
    "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang",
    "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor",
    "Terengganu", "WP Kuala Lumpur", "WP Putrajaya", "WP Labuan"
  ];

  var TEACHER_SUBJECTS = [
    { name: "Bahasa Melayu", slug: "bahasa-melayu" },
    { name: "Bahasa Inggeris", slug: "bahasa-inggeris" },
    { name: "Matematik", slug: "matematik" },
    { name: "Sains", slug: "sains" },
    { name: "Sejarah", slug: "sejarah" },
    { name: "Pendidikan Islam", slug: "pendidikan-islam" },
    { name: "Geografi", slug: "geografi" },
    { name: "Fizik", slug: "fizik" },
    { name: "Kimia", slug: "kimia" },
    { name: "Biologi", slug: "biologi" },
    { name: "Matematik Tambahan", slug: "matematik-tambahan" },
    { name: "Prinsip Perakaunan", slug: "prinsip-perakaunan" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Perniagaan", slug: "perniagaan" },
    { name: "Pendidikan Moral", slug: "pendidikan-moral" }
  ];

  // Tafsiran rasmi Tahap Penguasaan Umum KSSM (Standard Prestasi DSKP KPM)
  var PBD_TP_RUBRICS = [
    { tp: 1, title: "Tahu", desc: "Mempamerkan pengetahuan asas tentang konsep/idea utama secara lisan atau bukan lisan." },
    { tp: 2, title: "Tahu & Faham", desc: "Mempamerkan kefahaman dengan menerangkan konsep atau langkah asas." },
    { tp: 3, title: "Boleh Buat", desc: "Mengaplikasikan kefahaman asas untuk menyelesaikan tugasan/pengiraan rutin mudah." },
    { tp: 4, title: "Sistematik", desc: "Mengaplikasikan pengetahuan dan kemahiran dengan kaedah/prosedur yang tepat dalam masalah rutin." },
    { tp: 5, title: "Situasi Baharu", desc: "Melaksanakan prosedur berlapis dan menaakul dalam situasi baharu atau masalah rutin kompleks." },
    { tp: 6, title: "Mithali / KBAT", desc: "Menggunakan maklumat secara penyiasatan, kreatif dan berkesan dalam situasi bukan rutin." }
  ];

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function suggestTpClient(sub) {
    if (!sub) return null;
    if (sub.suggestedTp) return Number(sub.suggestedTp);
    var hasScore = sub.autoMcqScore !== null && sub.autoMcqScore !== undefined;
    var tot = Math.max(1, Number(sub.autoMcqTotal) || 10);
    var pct = hasScore ? (Number(sub.autoMcqScore) / tot) * 100 : 0;
    var stars = Number(sub.eduquestStars) || 0;
    var hints = Number(sub.aiHintsUsed) || 0;
    if (!hasScore && !sub.notaCompleted && stars === 0) return null;
    if (hasScore && pct >= 85 && hints === 0 && stars >= 3) return 6;
    if (hasScore && pct >= 80) return 5;
    if (hasScore && pct >= 60) return 4;
    if (hasScore && pct >= 40) return 3;
    if (sub.notaCompleted || (hasScore && pct >= 25) || stars >= 1) return 2;
    return 1;
  }

  function renderTpLegendHtml() {
    var rows = PBD_TP_RUBRICS.map(function (r) {
      return "<li><strong>TP" + r.tp + " (" + esc(r.title) + "):</strong> " + esc(r.desc) + "</li>";
    }).join("");
    return '<details class="g-rubric-box"><summary>Panduan Aras Penilaian PBD Rasmi (DSKP KPM TP1–TP6)</summary>' +
      '<ul class="g-rubric-list">' + rows + "</ul></details>";
  }

  window.ETGuruRubric = {
    STATES: MALAYSIA_STATES,
    SUBJECTS: TEACHER_SUBJECTS,
    TP_LIST: PBD_TP_RUBRICS,
    esc: esc,
    suggestTpClient: suggestTpClient,
    renderTpLegendHtml: renderTpLegendHtml
  };
})();
