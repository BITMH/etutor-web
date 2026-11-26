(function () {
  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function calcKssmStars(xp) {
    var v = Math.max(0, Number(xp) || 0);
    return v >= 80 ? 3 : (v >= 50 ? 2 : (v > 0 ? 1 : 0));
  }

  function renderSection(enriched, activeForm, def, kMap) {
    var stage = document.getElementById("eqLatihanStage");
    var countEl = document.getElementById("eqLatihanCount");
    var items = (Array.isArray(enriched) ? enriched : []).filter(function (x) { return Boolean(x && x.kssm && !x.locked); });
    if (countEl) countEl.textContent = String(items.length);
    if (!stage) return;

    var headHtml =
      '<div class="eq-latihan-head">' +
      '  <div>' +
      '    <span class="eq-latihan-kicker">SEKSYEN BERASINGAN &bull; KSSM TINGKATAN ' + activeForm + "</span>" +
      '    <h2 class="eq-latihan-title">Latihan Teks &amp; MCQ &bull; ' + esc(def.name) + "</h2>" +
      '    <p class="eq-latihan-sub">Latih tubi nota buku teks KPM &amp; 10 soalan objektif MCQ berhuraian mengikut bab — diasingkan daripada peta Nota EduQuest.</p>' +
      "  </div>" +
      "</div>";

    if (!items.length) {
      stage.innerHTML = headHtml +
        '<div class="eq-latihan-empty">' +
        "  <p>Set Latihan Teks &amp; MCQ khusus untuk " + esc(def.name) + " Tingkatan " + activeForm + " sedang disiapkan. Gunakan Peta Nota EduQuest untuk meneroka nota visual interaktif bab ini.</p>" +
        '  <button type="button" class="eq-node-btn" data-eq-section="nota">Kembali ke Peta Nota EduQuest</button>' +
        "</div>";
      return;
    }

    var cardsHtml = items.map(function (item) {
      var kRec = (kMap && kMap[item.kssmTajuk]) || null;
      var kXp = kRec ? (Number(kRec.earnedXp) || 0) : 0;
      var kStars = calcKssmStars(kXp);
      var starsHtml = [1, 2, 3].map(function (s) {
        return '<span class="' + (s <= kStars ? "eq-star-on" : "eq-star-off") + '">&#9733;</span>';
      }).join("");
      var src = ".." + String(item.kssm.url || "").replace(/^([^/])/, "/$1");
      var btnTxt = kStars > 0 ? "Ulang Latihan Bab " + item.bab : "Mula Latihan & MCQ";
      return '<article class="eq-latihan-card">' +
        '  <div class="eq-latihan-top"><span class="eq-node-bab">Bab ' + item.bab + '</span><span class="eq-pin-stars-bar">' + starsHtml + "</span></div>" +
        '  <h3 class="eq-latihan-card-title">' + esc((item.kssm && item.kssm.title) || item.title) + "</h3>" +
        '  <span class="eq-node-xp">' + kXp + " / 100 XP (MCQ &amp; Kertas 2)</span>" +
        '  <button type="button" class="eq-latihan-btn" data-open-tajuk="' + esc(item.kssmTajuk) + '" data-src="' + esc(src) + '" data-title="' + esc("Latihan Bab " + item.bab + ": " + item.title) + '" data-note-id="">' + btnTxt + "</button>" +
        "</article>";
    }).join("");

    stage.innerHTML = headHtml + '<div class="eq-latihan-grid">' + cardsHtml + "</div>";
  }

  window.etEqLatihan = { renderSection: renderSection };
})();
