(function () {
  var SUBJ_DEFS = [
    { name: "Bahasa Melayu", short: "BM", slug: "bahasa-melayu", world: "Kepulauan Melayu", theme: "bm", img: "../images/game-map/world-bm.jpg" },
    { name: "Bahasa Inggeris", short: "BI", slug: "bahasa-inggeris", world: "Taman Pustaka Bahasa", theme: "bi", img: "../images/game-map/world-bi.jpg" },
    { name: "Matematik", short: "Matematik", slug: "matematik", world: "Kota Geometri & Nombor", theme: "math", img: "../images/game-map/world-math.jpg" },
    { name: "Sains", short: "Sains", slug: "sains", world: "Makmal Sains Pintar", theme: "sains", img: "../images/game-map/world-sains.jpg" },
    { name: "Sejarah", short: "Sejarah", slug: "sejarah", world: "Kota Warisan & Manuskrip", theme: "sejarah", img: "../images/game-map/world-sejarah.jpg" },
    { name: "Pendidikan Islam", short: "P. Islam", slug: "pendidikan-islam", world: "Taman Cahaya Ilmu", theme: "pi", img: "../images/game-map/world-pi.jpg" },
    { name: "Geografi", short: "Geografi", slug: "geografi", world: "Lembah Peta & Kompas", theme: "geo", img: "../images/game-map/world-geo.jpg" },
    { name: "Fizik", short: "Fizik", slug: "fizik", world: "Stesen Daya & Tenaga", theme: "fizik", img: "../images/game-map/world-fizik.jpg" },
    { name: "Kimia", short: "Kimia", slug: "kimia", world: "Makmal Molekul & Reaksi", theme: "kimia", img: "../images/game-map/world-kimia.jpg" },
    { name: "Biologi", short: "Biologi", slug: "biologi", world: "Taman Sel & Ekosistem", theme: "biologi", img: "../images/game-map/world-biologi.jpg" },
    { name: "Matematik Tambahan", short: "Add Math", slug: "matematik-tambahan", world: "Menara Kalkulus & Vektor", theme: "addmath", img: "../images/game-map/world-addmath.jpg" },
    { name: "Pendidikan Moral", short: "P. Moral", slug: "pendidikan-moral", world: "Balai Etika & Integriti", theme: "moral", img: "../images/game-map/world-moral.jpg" }
  ];
  var UPPER_SLUGS = ["fizik", "kimia", "biologi", "matematik-tambahan", "pendidikan-moral"];
  var LOCK_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" d="M8 11V7a4 4 0 018 0v4"/></svg>';

  var kssmList = [], notaList = [], roadmap = {}, activeForm = 5, activeSlug = "sains", activeSection = "nota", activeTajuk = "", activeNoteId = "", pendingDeepTajuk = "";
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function readStore(k) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : {}; } catch (e) { return {}; } }
  function writeStore(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function calcStars(xp, max) { var p = (Math.max(0, Number(xp) || 0) / Math.max(1, Number(max) || 100)) * 100; return p >= 80 ? 3 : (p >= 50 ? 2 : (p > 0 ? 1 : 0)); }
  function calcNotaStars(rec, uCnt) {
    if (!rec || typeof rec !== "object") return 0;
    var d = Math.max(0, Number(rec.completedUnits) || 0), t = Math.max(1, Number(rec.totalUnits) || Number(uCnt) || 6);
    var p = (d / t) * 100;
    return p >= 80 ? 3 : (p >= 50 ? 2 : ((d > 0 || (Number(rec.xp) || 0) > 0) ? 1 : 0));
  }
  function validSubjs(f) { return SUBJ_DEFS.filter(function (s) { return s.slug === "geografi" ? f <= 3 : (UPPER_SLUGS.indexOf(s.slug) !== -1 ? f >= 4 : true); }); }
  function getSubjDef(slug) { return SUBJ_DEFS.find(function (s) { return s.slug === slug; }) || SUBJ_DEFS[0]; }

  function initFromQuery() {
    var params = new URLSearchParams(window.location.search || "");
    var qForm = Number(String(params.get("form") || "").replace(/\D/g, ""));
    var qSubj = String(params.get("subject") || "").trim().toLowerCase();
    activeSection = params.get("tab") === "latihan" ? "latihan" : "nota";
    pendingDeepTajuk = String(params.get("tajuk") || "").trim();
    var prof = readStore("etutor_student_profile_v1");
    var profForm = Number(String((prof && prof.currentForm) || "T5").replace(/\D/g, "")) || 5;
    activeForm = (qForm >= 1 && qForm <= 5) ? qForm : profForm;
    var savedSubj = "";
    try { savedSubj = localStorage.getItem("etutor_eduquest_subject_v1") || ""; } catch (e) {}
    var list = validSubjs(activeForm);
    var match = list.find(function (s) { return s.slug === qSubj || s.name.toLowerCase() === qSubj; })
      || list.find(function (s) { return s.name === savedSubj || s.slug === savedSubj; }) || list[0];
    activeSlug = match.slug;
  }

  function syncUrl(pushMode, tajukVal) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("form", String(activeForm));
      url.searchParams.set("subject", activeSlug);
      if (activeSection === "latihan") url.searchParams.set("tab", "latihan");
      else url.searchParams.delete("tab");
      if (tajukVal) url.searchParams.set("tajuk", tajukVal);
      else url.searchParams.delete("tajuk");
      if (pushMode) window.history.pushState({ eqTajuk: tajukVal || "" }, "", url.toString());
      else window.history.replaceState({ eqTajuk: tajukVal || "" }, "", url.toString());
      localStorage.setItem("etutor_eduquest_subject_v1", getSubjDef(activeSlug).name);
    } catch (e) {}
  }

  function mergeChapters(def) {
    var byBab = {}, rmTitles = roadmap["T" + activeForm + ":" + activeSlug] || [];
    rmTitles.forEach(function (t, i) { byBab[i + 1] = { bab: i + 1, roadmapTitle: t }; });
    kssmList.forEach(function (c) {
      if (Number(c.form) === activeForm && c.subjectSlug === activeSlug) {
        var b = Number(c.bab) || 1;
        byBab[b] = byBab[b] || { bab: b };
        byBab[b].kssm = c;
      }
    });
    notaList.forEach(function (n) {
      if (Number(n.form) === activeForm && String(n.subject || "").toLowerCase() === def.name.toLowerCase()) {
        var b = Number(n.chapterNumber) || 1;
        byBab[b] = byBab[b] || { bab: b };
        byBab[b].nota = n;
      }
    });
    var babs = Object.keys(byBab).map(Number).sort(function (a, b) { return a - b; });
    if (!babs.length && UPPER_SLUGS.indexOf(activeSlug) === -1) {
      [1, 2].forEach(function (b) {
        byBab[b] = { bab: b, kssm: { form: activeForm, subjectSlug: activeSlug, bab: b, title: "Bab " + b + " " + def.name, url: "/kssm/tingkatan-" + activeForm + "/" + activeSlug + "/bab-" + b + "/", playableNoteId: "" } };
      });
      babs = [1, 2];
    }
    return babs.map(function (b) { return byBab[b]; });
  }

  function openPlayer(src, title, tajukId, noteId, pushMode) {
    var stage = document.getElementById("eqPlayerStage"), frame = document.getElementById("eqPlayerIframe");
    var titleEl = document.getElementById("eqPlayerTitle"), statEl = document.getElementById("eqPlayerStatus");
    if (!stage || !frame) return;
    activeTajuk = tajukId; activeNoteId = noteId || "";
    if (titleEl) titleEl.textContent = title || "Bab EduQuest";
    if (statEl) statEl.textContent = activeNoteId ? "Auto-simpan aktif" : "Ujian Topikal KSSM";
    frame.src = src;
    stage.classList.toggle("is-nota-mode", Boolean(activeNoteId));
    stage.hidden = false;
    document.body.classList.add("eq-player-open");
    syncUrl(Boolean(pushMode), tajukId);
  }

  function closePlayer(fromPop) {
    var stage = document.getElementById("eqPlayerStage"), frame = document.getElementById("eqPlayerIframe");
    if (!stage || stage.hidden) return;
    stage.classList.remove("is-nota-mode");
    stage.hidden = true;
    document.body.classList.remove("eq-player-open");
    if (frame) frame.src = "about:blank";
    activeTajuk = ""; activeNoteId = "";
    if (!fromPop) syncUrl(false, "");
    render();
  }

  function render() {
    var def = getSubjDef(activeSlug);
    document.body.setAttribute("data-theme", def.theme);
    var kssmStore = readStore("etutor_kssm_bab_xp_v1"), kMap = (kssmStore && kssmStore.chapters) ? kssmStore.chapters : {};
    var notaProg = readStore("etutor_nota_progress_v1");
    var totalXpAll = (Number(kssmStore && kssmStore.totalXp) || 0) + Object.keys(notaProg).reduce(function (s, k) {
      return s + (Number(notaProg[k] && notaProg[k].xp) || 0);
    }, 0);

    if (window.etEqVideo) window.etEqVideo.reset();
    var slots = mergeChapters(def), cleared = 0, starsSum = 0, unlockedCount = 0, activeFound = false, totalVideos = 0;
    var enriched = slots.map(function (slot) {
      var k = slot.kssm, n = slot.nota, bab = slot.bab, locked = !k && !n;
      var kRec = kMap[activeSlug + "-t" + activeForm + "-bab-" + bab] || null;
      var notaId = (n && n.id) || (k && k.playableNoteId) || "";
      var nRec = notaId ? (notaProg[notaId] || null) : null;
      var xp = Math.max(kRec ? (Number(kRec.earnedXp) || 0) : 0, nRec ? (Number(nRec.xp) || 0) : 0);
      var stars = locked ? 0 : Math.max(calcStars(kRec && kRec.earnedXp, k && k.mcqCount ? k.mcqCount * 10 : 200), calcNotaStars(nRec, n && n.unitCount));
      var videos = (!locked && n && Array.isArray(n.videos)) ? n.videos : [];
      if (!locked) unlockedCount += 1;
      if (!locked && (stars > 0 || xp > 0)) cleared += 1;
      starsSum += stars;
      totalVideos += videos.length;
      var isCurrent = false;
      if (!locked && !activeFound && stars < 3) { isCurrent = true; activeFound = true; }
      var bgImg = (n && n.chapterBgPath) ? ("../" + String(n.chapterBgPath).replace(/^\.\//, "")) : def.img;
      var chTitle = (n && n.title) || (k && k.title) || slot.roadmapTitle || ("Bab " + bab);
      if (notaId && videos.length && window.etEqVideo) {
        window.etEqVideo.register(notaId, { title: "Bab " + bab + ": " + chTitle, notaSrc: "../nota-interaktif/dist/" + encodeURIComponent(notaId) + ".html", videos: videos });
      }
      return {
        bab: bab, kssm: k, nota: n, notaId: notaId, locked: locked, bgImg: bgImg, videos: videos,
        kssmTajuk: activeSlug + "-t" + activeForm + "-bab-" + bab,
        tajukId: notaId || (activeSlug + "-t" + activeForm + "-bab-" + bab),
        title: chTitle, xp: xp, stars: stars, isCurrent: isCurrent
      };
    });

    var bandsHtml = enriched.map(function (item, idx) {
      var sideCls = idx % 2 === 1 ? "is-odd" : "is-even";
      var stateCls = item.locked ? "is-locked" : (item.stars === 3 ? "is-full" : (item.stars > 0 ? "is-partial" : ""));
      var badgeTxt = item.locked ? "Terkunci" : (item.stars === 3 ? "3/3 Penuh!" : (item.stars > 0 ? item.stars + "/3 Bintang" : "Belum Dicuba"));
      var medInner = item.locked ? LOCK_SVG : (item.stars === 3 ? "&#10003;" : String(item.bab));
      var starsHtml = [1, 2, 3].map(function (s) { return '<span class="' + (s <= item.stars ? "eq-star-on" : "eq-star-off") + '">&#9733;</span>'; }).join("");
      var avatar = item.isCurrent ? '<span class="eq-pin-avatar"><img src="../images/hero-student-3d.webp" alt="Penjelajah" width="40" height="40"></span>' : "";
      var hasNota = Boolean(item.notaId);
      var notaSrc = hasNota ? ("../nota-interaktif/dist/" + encodeURIComponent(item.notaId) + ".html") : "";
      var kssmSrc = item.kssm ? (".." + String(item.kssm.url || "").replace(/^([^/])/, "/$1")) : "";
      var primarySrc = hasNota ? notaSrc : kssmSrc;
      var primaryNoteId = hasNota ? item.notaId : "";
      var primaryTajuk = hasNota ? item.notaId : item.kssmTajuk;
      var btnTxt = item.stars === 3 ? "Ulang Kaji" : (item.stars > 0 ? "Ulang Untuk 3\u2605" : (hasNota ? "Mula Nota Bab " + item.bab : "Buka Ujian Bab " + item.bab));
      var videoBtn = (!item.locked && window.etEqVideo) ? window.etEqVideo.buildActionBtn(item.notaId, item.videos) : "";
      var actions = item.locked
        ? '<button type="button" class="eq-node-btn is-locked-btn" disabled>Akan Dibuka Berperingkat</button>'
        : (hasNota
          ? ('<button type="button" class="eq-node-btn" data-open-tajuk="' + esc(primaryTajuk) + '" data-src="' + esc(primarySrc) + '" data-title="' + esc("Bab " + item.bab + ": " + item.title) + '" data-note-id="' + esc(primaryNoteId) + '">' + btnTxt + "</button>" + videoBtn)
          : '<button type="button" class="eq-node-btn" data-eq-section="latihan">' + btnTxt + "</button>");
      var medBtn = item.locked
        ? '<span class="eq-pin-medallion" aria-label="Bab ' + item.bab + ' Terkunci">' + medInner + "</span>"
        : '<button type="button" class="eq-pin-medallion" data-open-tajuk="' + esc(primaryTajuk) + '" data-src="' + esc(primarySrc) + '" data-title="' + esc("Bab " + item.bab + ": " + item.title) + '" data-note-id="' + esc(primaryNoteId) + '" aria-label="Buka Bab ' + item.bab + '">' + medInner + "</button>";
      var conn = idx > 0 ? '<div class="eq-band-connector" aria-hidden="true"></div>' : "";
      return conn + '<article class="eq-chap-band ' + sideCls + " " + stateCls + '">' +
        '<div class="eq-band-inner"><div class="eq-pin-col">' + avatar + medBtn + '<div class="eq-pin-stars-bar">' + starsHtml + "</div></div>" +
        '<div class="eq-pin-card"><div class="eq-node-top"><span class="eq-node-bab">Bab ' + item.bab + '</span><span class="eq-node-badge">' + badgeTxt + "</span></div>" +
        '<h2 class="eq-node-title">' + esc(item.title) + '</h2><span class="eq-node-xp">' + (item.locked ? "Kandungan berperingkat KSSM" : (item.xp + " / 100 XP")) + "</span>" +
        '<div class="eq-node-actions">' + actions + "</div></div></div></article>";
    }).join("");

    var maxStars = Math.max(1, unlockedCount) * 3, pct = unlockedCount > 0 ? Math.round((starsSum / maxStars) * 100) : 0;
    document.getElementById("eqWorldKicker").textContent = "DUNIA EDUQUEST \u2022 TINGKATAN " + activeForm;
    document.getElementById("eqWorldTitle").textContent = def.world + " \u2022 " + def.name;
    document.getElementById("eqClrSummary").textContent = cleared + " / " + unlockedCount + " Bab Terbuka Selesai";
    document.getElementById("eqClrPct").textContent = pct + "%";
    document.getElementById("eqClrFill").style.width = Math.max(6, pct) + "%";
    var vidHud = document.getElementById("eqHudVideoCount");
    if (vidHud) { vidHud.textContent = totalVideos + " Video"; vidHud.hidden = totalVideos <= 0; }
    document.getElementById("eqHudTotalXp").textContent = totalXpAll.toLocaleString("en-MY") + " XP";
    document.getElementById("eqHudTotalStars").textContent = starsSum + " / " + maxStars + " \u2605";

    document.getElementById("eqFormPills").innerHTML = [1, 2, 3, 4, 5].map(function (f) {
      return '<button type="button" class="eq-pill' + (f === activeForm ? " is-active" : "") + '" data-eq-form="' + f + '">Ting. ' + f + "</button>";
    }).join("");
    document.getElementById("eqSubjPills").innerHTML = validSubjs(activeForm).map(function (s) {
      return '<button type="button" class="eq-pill' + (s.slug === activeSlug ? " is-active" : "") + '" data-eq-subj="' + esc(s.slug) + '">' + esc(s.short) + "</button>";
    }).join("");
    document.getElementById("eqPathStage").innerHTML = '<div class="eq-bands-wrap">' + bandsHtml + "</div>";
    if (window.etEqLatihan) window.etEqLatihan.renderSection(enriched, activeForm, def, kMap);
    var pathEl = document.getElementById("eqPathStage"), latEl = document.getElementById("eqLatihanStage");
    var tabNota = document.getElementById("eqTabNotaBtn"), tabLat = document.getElementById("eqTabLatihanBtn");
    if (pathEl) pathEl.hidden = (activeSection !== "nota");
    if (latEl) latEl.hidden = (activeSection !== "latihan");
    if (tabNota) { tabNota.classList.toggle("is-active", activeSection === "nota"); tabNota.setAttribute("aria-selected", String(activeSection === "nota")); }
    if (tabLat) { tabLat.classList.toggle("is-active", activeSection === "latihan"); tabLat.setAttribute("aria-selected", String(activeSection === "latihan")); }
    if (window.etEqWorldBg) window.etEqWorldBg.sync();

    if (pendingDeepTajuk) {
      var reqTajuk = pendingDeepTajuk;
      pendingDeepTajuk = "";
      var target = enriched.find(function (x) {
        return !x.locked && (x.notaId === reqTajuk || x.tajukId === reqTajuk || x.kssmTajuk === reqTajuk);
      });
      if (target) {
        var openKssm = Boolean(target.kssm) && (!target.notaId || reqTajuk === target.kssmTajuk);
        var dSrc = openKssm
          ? (".." + String(target.kssm.url || "").replace(/^([^/])/, "/$1"))
          : ("../nota-interaktif/dist/" + encodeURIComponent(target.notaId) + ".html");
        var dNoteId = openKssm ? "" : target.notaId;
        var dTitle = (openKssm ? "Ujian Topikal Bab " : "Bab ") + target.bab + ": " + target.title;
        openPlayer(dSrc, dTitle, openKssm ? target.kssmTajuk : target.notaId, dNoteId, false);
      }
    }
  }

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-open-tajuk]");
    if (openBtn) {
      openPlayer(openBtn.getAttribute("data-src"), openBtn.getAttribute("data-title"), openBtn.getAttribute("data-open-tajuk"), openBtn.getAttribute("data-note-id"), true);
      return;
    }
    if (e.target.closest("#eqPlayerBackBtn")) { closePlayer(false); return; }
    var fBtn = e.target.closest("[data-eq-form]");
    if (fBtn) {
      activeForm = Number(fBtn.getAttribute("data-eq-form")) || 5;
      var list = validSubjs(activeForm);
      if (!list.some(function (s) { return s.slug === activeSlug; })) activeSlug = list[0].slug;
      syncUrl(false, ""); render(); return;
    }
    var secBtn = e.target.closest("[data-eq-section]");
    if (secBtn) {
      activeSection = secBtn.getAttribute("data-eq-section") === "latihan" ? "latihan" : "nota";
      syncUrl(false, ""); render(); return;
    }
    var sBtn = e.target.closest("[data-eq-subj]");
    if (sBtn) { activeSlug = sBtn.getAttribute("data-eq-subj") || "sains"; syncUrl(false, ""); render(); }
  });

  window.addEventListener("popstate", function () {
    var t = new URLSearchParams(window.location.search || "").get("tajuk");
    if (!t) closePlayer(true);
  });

  window.addEventListener("message", function (ev) {
    var frame = document.getElementById("eqPlayerIframe"), d = ev && ev.data;
    if (!frame || !frame.contentWindow || ev.source !== frame.contentWindow || !d || typeof d.type !== "string") return;
    if (d.type === "ETUTOR_NOTA_READY" && activeNoteId) {
      var rec = readStore("etutor_nota_progress_v1")[activeNoteId];
      frame.contentWindow.postMessage({ type: "ETUTOR_NOTA_INIT", noteId: activeNoteId, stateJson: (rec && rec.stateJson) || "" }, "*");
    } else if (d.type === "ETUTOR_NOTA_PROGRESS" && d.noteId) {
      var map = readStore("etutor_nota_progress_v1");
      map[d.noteId] = Object.assign({}, map[d.noteId] || {}, {
        completedUnits: d.completedUnits || 0, totalUnits: d.totalUnits || 0, masteryPct: d.masteryPct || 0,
        xp: d.xp || 0, stars: d.stars || 0, stateJson: d.stateJson || "", updatedMs: Date.now()
      });
      writeStore("etutor_nota_progress_v1", map);
    } else if (d.type === "ETUTOR_NOTA_CLOSE") {
      closePlayer(false);
    }
  });

  window.etEqOpenChapterFromVideo = function (notaId) {
    var btns = document.querySelectorAll("[data-note-id]");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute("data-note-id") === notaId) {
        openPlayer(btns[i].getAttribute("data-src"), btns[i].getAttribute("data-title"), btns[i].getAttribute("data-open-tajuk"), notaId, true);
        return;
      }
    }
  };

  initFromQuery(); syncUrl(false, pendingDeepTajuk);
  var grab = function (u) { return fetch(u).then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; }); };
  Promise.all([grab("../kssm/manifest.json"), grab("../nota-interaktif/manifest.json"), grab("./syllabus-roadmap.json")])
    .then(function (res) {
      kssmList = res[0] && Array.isArray(res[0].chapters) ? res[0].chapters : [];
      notaList = res[1] && Array.isArray(res[1].chapters) ? res[1].chapters : [];
      roadmap = (res[2] && typeof res[2] === "object") ? res[2] : {};
    })
    .finally(function () { render(); });
})();
