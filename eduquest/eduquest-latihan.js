(function () {
  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function calcKssmStars(xp, maxXp) {
    var pct = (Math.max(0, Number(xp) || 0) / Math.max(1, Number(maxXp) || 200)) * 100;
    return pct >= 80 ? 3 : (pct >= 50 ? 2 : (xp > 0 ? 1 : 0));
  }

  function readTpMap() {
    try {
      var raw = JSON.parse(localStorage.getItem("etutor_kssm_tp_v1") || "{}") || {};
      return (raw && raw.chapters && typeof raw.chapters === "object") ? raw.chapters : {};
    } catch (e) {
      return {};
    }
  }

  function renderSection(enriched, activeForm, def, kMap) {
    var stage = document.getElementById("eqLatihanStage");
    var countEl = document.getElementById("eqLatihanCount");
    var items = (Array.isArray(enriched) ? enriched : []).filter(function (x) { return Boolean(x && x.kssm && !x.locked); });
    if (countEl) countEl.textContent = String(items.length);
    if (!stage) return;

    var isUasa = Number(activeForm) <= 3;
    var examTag = isUasa ? "UASA" : "SPM";
    var tpMap = isUasa ? {} : readTpMap();
    var headHtml = '<h2 class="eq-latihan-title">Ujian Topikal ' + examTag + " &bull; " + esc(def.name) + " (Ting. " + Number(activeForm) + ")</h2>";

    if (!items.length) {
      stage.innerHTML = headHtml +
        '<div class="eq-latihan-empty">' +
        "  <p>Tiada set ujian topikal " + examTag + " untuk subjek ini buat masa ini.</p>" +
        '  <button type="button" class="eq-node-btn" data-eq-section="nota">Peta Nota EduQuest</button>' +
        "</div>";
      return;
    }

    var cardsHtml = items.map(function (item) {
      var kRec = (kMap && kMap[item.kssmTajuk]) || null;
      var kXp = kRec ? (Number(kRec.earnedXp) || 0) : 0;
      var mcqCnt = Number(item.kssm && item.kssm.mcqCount) || 20;
      var essayCnt = Number(item.kssm && item.kssm.essayCount) || (isUasa ? 2 : 6);
      var paperLabel = isUasa ? (mcqCnt + " MCQ &amp; " + essayCnt + " Struktur") : (mcqCnt + " MCQ &amp; " + essayCnt + " Kertas 2 (TP1-TP6)");
      var maxXp = mcqCnt * 10;
      var kStars = calcKssmStars(kXp, maxXp);
      var starsHtml = [1, 2, 3].map(function (s) {
        return '<span class="' + (s <= kStars ? "eq-star-on" : "eq-star-off") + '">&#9733;</span>';
      }).join("");
      var tpRec = tpMap[item.kssmTajuk] || null;
      var tpMax = tpRec ? (Number(tpRec.maxTp) || 0) : 0;
      var tpPill = (!isUasa && tpMax > 0)
        ? ('<span class="eq-node-badge eq-tp-pill">TP ' + tpMax + "</span>")
        : "";
      var src = ".." + String(item.kssm.url || "").replace(/^([^/])/, "/$1");
      var btnTxt = kStars > 0 ? "Ulang Ujian Bab " + item.bab : "Mula Ujian Topikal";
      return '<article class="eq-latihan-card">' +
        '  <div class="eq-latihan-top"><span class="eq-node-bab">Bab ' + item.bab + "</span>" + tpPill + '<span class="eq-pin-stars-bar">' + starsHtml + "</span></div>" +
        '  <h3 class="eq-latihan-card-title">' + esc((item.kssm && item.kssm.title) || item.title) + "</h3>" +
        '  <span class="eq-node-xp">' + kXp + " / " + maxXp + " XP (Format " + examTag + " &bull; " + paperLabel + ")</span>" +
        '  <button type="button" class="eq-latihan-btn" data-open-tajuk="' + esc(item.kssmTajuk) + '" data-src="' + esc(src) + '" data-title="' + esc("Ujian Topikal " + examTag + " Bab " + item.bab + ": " + item.title) + '" data-note-id="">' + btnTxt + "</button>" +
        "</article>";
    }).join("");

    stage.innerHTML = headHtml + '<div class="eq-latihan-grid">' + cardsHtml + "</div>";
  }

  window.etEqLatihan = { renderSection: renderSection };
})();
