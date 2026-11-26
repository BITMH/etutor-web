(function () {
  var rafId = 0;
  var resizeTimer = 0;

  function renderTilesNow() {
    var host = document.getElementById("eqScrollWorld");
    if (!host) return;
    var docH = Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.scrollHeight : 0,
      window.innerHeight || 900
    );
    var w = window.innerWidth || 1280;
    var tileH = Math.max(Math.round(w * 1.34), 960);
    host.style.height = docH + "px";
    host.textContent = "";

    var frag = document.createDocumentFragment();
    if (docH <= Math.round(tileH * 1.15)) {
      var solo = document.createElement("div");
      solo.className = "eq-scroll-tile";
      solo.style.top = "0px";
      solo.style.height = docH + "px";
      frag.appendChild(solo);
      host.appendChild(frag);
      return;
    }

    var overlap = 180;
    var step = Math.max(400, tileH - overlap);
    var count = Math.max(1, Math.ceil((docH - overlap) / step));
    for (var i = 0; i < count; i++) {
      var top = i * step;
      var h = i === count - 1 ? Math.max(tileH, docH - top) : tileH;
      var tile = document.createElement("div");
      var cls = "eq-scroll-tile";
      if (i % 2 === 1) cls += " is-mirror";
      if (i === 0) cls += " is-fade-bot";
      else if (i === count - 1) cls += " is-fade-top";
      else cls += " is-fade-both";
      tile.className = cls;
      tile.style.top = top + "px";
      tile.style.height = h + "px";
      frag.appendChild(tile);
    }
    host.appendChild(frag);
  }

  function sync() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      rafId = 0;
      renderTilesNow();
    });
  }

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sync, 120);
  });

  window.etEqWorldBg = { sync: sync };
})();
