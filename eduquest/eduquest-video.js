(function () {
  var PLAY_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var registry = {};
  var activeId = "";
  var activeIdx = 0;

  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function resolveVideoSrc(v) {
    if (!v) return "";
    if (v.r2Url) return String(v.r2Url);
    if (v.localPath) return "../" + String(v.localPath).replace(/^\.\//, "");
    return "";
  }

  function cleanCaption(raw) {
    return String(raw || "")
      .replace(/^(?:Video|Animasi|Simulasi|Narrated|Klip)[^:]{0,65}:\s*/i, "")
      .replace(/\s*\(\s*Tanpa\s+Audio\s*\)\s*/gi, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function buildActionBtn(notaId, videos) {
    if (!notaId || !Array.isArray(videos) || !videos.length) return "";
    var hasAudio = videos.some(function (v) { return Boolean(v && v.hasNarration); });
    var cls = hasAudio ? "eq-node-video-btn is-narrated" : "eq-node-video-btn";
    var tip = "Tonton video";
    return '<button type="button" class="' + cls + '" data-eq-video-open="' + esc(notaId) + '" aria-label="' + esc(tip) + '" title="' + esc(tip) + '">' + PLAY_SVG + "</button>";
  }

  function renderEpisode() {
    var entry = registry[activeId];
    if (!entry || !entry.videos.length) return;
    if (activeIdx < 0 || activeIdx >= entry.videos.length) activeIdx = 0;
    var v = entry.videos[activeIdx];
    var player = document.getElementById("eqVideoPlayer");
    var titleEl = document.getElementById("eqVideoChapterTitle");
    var capEl = document.getElementById("eqVideoCaption");
    var listEl = document.getElementById("eqVideoPlaylist");
    var notaBtn = document.getElementById("eqVideoOpenNotaBtn");

    if (titleEl) titleEl.textContent = entry.title + (v.unitNumber ? (" \u2022 Unit " + v.unitNumber) : "");
    if (capEl) capEl.textContent = cleanCaption(v.caption || v.stepTitle || v.unitTitle || "");
    if (notaBtn) notaBtn.hidden = !entry.notaSrc;

    if (listEl) {
      if (entry.videos.length > 1) {
        listEl.hidden = false;
        listEl.innerHTML = entry.videos.map(function (ep, i) {
          var epTag = "Unit " + (ep.unitNumber || (i + 1));
          var epSub = ep.stepTitle || ep.unitTitle || ep.caption || ("Episod " + (i + 1));
          return '<button type="button" class="eq-video-ep' + (i === activeIdx ? " is-active" : "") + '" data-eq-video-idx="' + i + '">' +
            "<strong>" + esc(epTag) + "</strong><span>" + esc(epSub) + "</span></button>";
        }).join("");
      } else {
        listEl.hidden = true;
        listEl.innerHTML = "";
      }
    }

    if (player) {
      var src = resolveVideoSrc(v);
      player.pause();
      player.muted = false;
      player.loop = !v.hasNarration;
      player.controls = true;
      player.src = src;
      player.load();
      var playRes = player.play();
      if (playRes && typeof playRes.catch === "function") playRes.catch(function () {});
    }
  }

  function open(notaId, idx) {
    var modal = document.getElementById("eqVideoModal");
    var entry = registry[notaId];
    if (!modal || !entry || !entry.videos.length) return;
    activeId = notaId;
    activeIdx = Number(idx) || 0;
    renderEpisode();
    modal.hidden = false;
    document.body.classList.add("eq-player-open");
  }

  function close() {
    var modal = document.getElementById("eqVideoModal");
    var player = document.getElementById("eqVideoPlayer");
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (modal) modal.hidden = true;
    document.body.classList.remove("eq-player-open");
    activeId = "";
    activeIdx = 0;
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-eq-video-open]");
    if (openBtn) {
      open(openBtn.getAttribute("data-eq-video-open"), 0);
      return;
    }
    var epBtn = e.target.closest("[data-eq-video-idx]");
    if (epBtn) {
      activeIdx = Number(epBtn.getAttribute("data-eq-video-idx")) || 0;
      renderEpisode();
      return;
    }
    if (e.target.closest("#eqVideoCloseBtn")) { close(); return; }
    var modal = document.getElementById("eqVideoModal");
    if (modal && e.target === modal) { close(); return; }
    if (e.target.closest("#eqVideoOpenNotaBtn")) {
      var idToOpen = activeId;
      close();
      if (idToOpen && typeof window.etEqOpenChapterFromVideo === "function") {
        window.etEqOpenChapterFromVideo(idToOpen);
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    var modal = document.getElementById("eqVideoModal");
    if (e.key === "Escape" && modal && !modal.hidden) close();
  });

  window.etEqVideo = {
    reset: function () { registry = {}; },
    register: function (notaId, meta) {
      if (notaId && meta && Array.isArray(meta.videos) && meta.videos.length) registry[notaId] = meta;
    },
    buildActionBtn: buildActionBtn,
    open: open,
    close: close
  };
})();
