/* AUTO-GENERATED DARIPADA src/features/catalog/ OLEH scripts/build-frontend.mjs */
(function () {
  "use strict";

  // --- [features/catalog/liveIndexDomReconciler.js] ---
  /**
   * src/features/catalog/liveIndexDomReconciler.js
   * Pemapar & penyelarasan DOM langsung bagi halaman Indeks Direktori (/soalan-percubaan-spm/ & /soalan-klon-spm/)
   * serta pautan navigasi halaman SEO individu.
   */

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugifySub(str) {
    return String(str || "")
      .replace(/&/g, " dan ")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normKey(str) {
    return String(str || "").trim().toLowerCase();
  }

  function summarizeCatalog(items) {
    let harianCount = 0;
    let klonCount = 0;
    const allSubs = {};
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it) continue;
      if (it.subject) allSubs[it.subject] = true;
      if (it.category === "klon") klonCount++;
      else harianCount++;
    }
    return {
      totalCount: items.length,
      harianCount: harianCount,
      klonCount: klonCount,
      totalSubjectCount: Object.keys(allSubs).length,
      fingerprint: items.map(function (x) { return String(x.fileId || "") + ":" + String(x.updatedMs || ""); }).join("|")
    };
  }

  function applySharedNavCounts(stats) {
    if (!stats || stats.totalCount <= 0) return;
    document.querySelectorAll("[data-live-nav-harian]").forEach(function (el) {
      el.textContent = "Indeks " + stats.harianCount + " Set";
    });
    document.querySelectorAll("[data-live-nav-klon]").forEach(function (el) {
      el.textContent = stats.klonCount > 0 ? ("Indeks " + stats.klonCount + " Klon SPM") : "Indeks Klon SPM";
    });
    document.querySelectorAll("[data-live-all-harian-btn]").forEach(function (el) {
      el.textContent = "Lihat Semua " + stats.harianCount + " Set Percubaan SPM";
    });
    document.querySelectorAll("[data-live-all-klon-btn]").forEach(function (el) {
      el.textContent = "Lihat Semua " + stats.klonCount + " Set Klon SPM";
    });
  }

  function buildLiveHubCardHtml(item, isKlon) {
    const launchHref = "../?fileId=" + encodeURIComponent(item.fileId) + "&open=1#portal";
    const badgeCode = item.setCode || (isKlon ? "KLON SPM" : "SET BAHARU");
    const metaRight = isKlon
      ? ("Klon SPM \u2022 " + (item.year || "2026"))
      : ([item.stateOrSource, item.year].filter(Boolean).join(" \u2022 ") || "KSSM Terkini");
    const ctaLabel = isKlon ? "Jawab Klon" : "Jawab Set";

    return [
      '<article class="seo-related-card" style="cursor:default" data-live-injected="1" data-file-id="' + esc(item.fileId) + '" data-file-name="' + esc(item.fileName || "") + '" data-clean-title="' + esc(item.cleanTitle || "") + '">',
      '  <div>',
      '    <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px">',
      '      <span class="status-badge badge-subject">' + esc(badgeCode) + '</span>',
      '      <span class="tabular-nums" style="font-size:0.78rem;font-weight:700;color:var(--grade-emerald)">Live \u2022 ' + esc(metaRight) + '</span>',
      '    </div>',
      '    <h3 style="font-size:1rem;color:var(--brand-navy);margin:0 0 6px;line-height:1.35">',
      '      <a href="' + esc(launchHref) + '" style="color:inherit;text-decoration:none">' + esc(item.cleanTitle || item.fileName) + '</a>',
      '    </h3>',
      '    <p style="font-size:0.83rem;color:var(--text-secondary);margin:0 0 10px">Set Peperiksaan Interaktif Penuh + Skema Jawapan Automatik</p>',
      '  </div>',
      '  <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">',
      '    <a href="' + esc(launchHref) + '" data-launch-link class="btn btn-emerald btn-sm" style="flex:1;justify-content:center">' + ctaLabel + '</a>',
      '  </div>',
      '</article>'
    ].join("\n");
  }

  function ensureSubjectSection(containerEl, subjectName, isKlon) {
    const slug = slugifySub(subjectName);
    const secId = "subjek-" + slug;
    let sec = document.getElementById(secId);
    if (sec) return sec;

    sec = document.createElement("section");
    sec.id = secId;
    sec.className = "seo-section-card seo-hub-subject-block";
    sec.setAttribute("data-subject-name", subjectName);
    const headId = (isKlon ? "hk-" : "h-") + slug;
    sec.setAttribute("aria-labelledby", headId);
    const filterHref = isKlon
      ? ("../?klonSubject=" + encodeURIComponent(subjectName) + "#klon-portal")
      : ("../?subject=" + encodeURIComponent(subjectName) + "#portal");
    const titlePrefix = isKlon ? "Soalan Klon SPM " : "Soalan Percubaan SPM ";

    sec.innerHTML = [
      '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;margin-bottom:16px">',
      '  <div>',
      '    <h2 id="' + esc(headId) + '" style="font-size:1.3rem;color:var(--brand-navy);margin:0">' + esc(titlePrefix + subjectName) + '</h2>',
      '    <p data-subject-set-count style="font-size:0.86rem;color:var(--text-secondary);margin:4px 0 0">1 set interaktif lengkap skema pemarkahan</p>',
      '  </div>',
      '  <a href="' + esc(filterHref) + '" class="btn btn-outline btn-sm">Tapis ' + esc(subjectName) + ' Di Portal &rarr;</a>',
      '</div>',
      '<div class="seo-related-grid"></div>'
    ].join("\n");

    containerEl.appendChild(sec);
    return sec;
  }

  function reconcileHubDom(hubCategory, allItems, syncedAtStr) {
    const isKlon = hubCategory === "klon";
    const categoryItems = allItems
      .filter(function (c) { return isKlon ? c.category === "klon" : c.category !== "klon"; })
      .slice()
      .sort(function (a, b) {
        return (Number(a.setNumber) || 9999) - (Number(b.setNumber) || 9999) || String(a.cleanTitle || "").localeCompare(String(b.cleanTitle || ""));
      });

    const mainContainer = document.querySelector("main .lp-container");
    if (!mainContainer) return;

    const existingCards = Array.from(mainContainer.querySelectorAll(".seo-hub-subject-block article.seo-related-card"));
    const matchedCards = new Set();

    for (let i = 0; i < categoryItems.length; i++) {
      const item = categoryItems[i];
      const fnNorm = normKey(item.fileName);
      const titleNorm = normKey(item.cleanTitle);

      const card = existingCards.find(function (el) {
        if (matchedCards.has(el)) return false;
        if (item.fileId && el.getAttribute("data-file-id") === item.fileId) return true;
        if (fnNorm && normKey(el.getAttribute("data-file-name")) === fnNorm) return true;
        if (titleNorm && normKey(el.getAttribute("data-clean-title")) === titleNorm) return true;
        return false;
      });

      if (card) {
        matchedCards.add(card);
        card.hidden = false;
        if (item.fileId) {
          card.setAttribute("data-file-id", item.fileId);
          const launchBtn = card.querySelector("[data-launch-link]");
          if (launchBtn) {
            launchBtn.setAttribute("href", "../?fileId=" + encodeURIComponent(item.fileId) + "&open=1#portal");
          }
        }
      } else if (item.fileId) {
        const subjectName = item.subject || "Umum";
        const sec = ensureSubjectSection(mainContainer, subjectName, isKlon);
        const grid = sec.querySelector(".seo-related-grid");
        if (grid) {
          grid.insertAdjacentHTML("beforeend", buildLiveHubCardHtml(item, isKlon));
          if (grid.lastElementChild) matchedCards.add(grid.lastElementChild);
        }
      }
    }

    existingCards.forEach(function (el) {
      if (!matchedCards.has(el)) el.hidden = true;
    });

    const activeSubjects = [];
    Array.from(mainContainer.querySelectorAll(".seo-hub-subject-block")).forEach(function (sec) {
      const visibleCards = Array.from(sec.querySelectorAll("article.seo-related-card")).filter(function (c) { return !c.hidden; });
      sec.hidden = visibleCards.length === 0;
      if (visibleCards.length > 0) {
        const subName = sec.getAttribute("data-subject-name") || sec.id.replace(/^subjek-/, "");
        activeSubjects.push({ name: subName, slug: sec.id.replace(/^subjek-/, ""), count: visibleCards.length });
        const countLine = sec.querySelector("[data-subject-set-count]");
        if (countLine) {
          countLine.textContent = visibleCards.length + (isKlon
            ? " set kertas klon SPM interaktif lengkap skema pemarkahan"
            : " set kertas percubaan interaktif lengkap skema pemarkahan");
        }
      }
    });

    const pillsList = document.getElementById("hubSubjectPillsList");
    if (pillsList && activeSubjects.length > 0) {
      pillsList.innerHTML = activeSubjects.map(function (s) {
        return '<li><a href="#subjek-' + esc(s.slug) + '">' + esc(s.name) + ' (' + s.count + ')</a></li>';
      }).join("\n");
    }

    const totalSets = categoryItems.length;
    const subjectCount = activeSubjects.length;

    document.querySelectorAll("[data-hub-heading-count]").forEach(function (el) { el.textContent = String(totalSets); });
    document.querySelectorAll("[data-hub-lead-subjects]").forEach(function (el) { el.textContent = subjectCount + " subjek KSSM"; });
    document.querySelectorAll("[data-hub-total-sets]").forEach(function (el) { el.textContent = totalSets + " Set"; });
    document.querySelectorAll("[data-hub-subject-count]").forEach(function (el) { el.textContent = subjectCount + " Subjek"; });
    document.querySelectorAll("[data-hub-live-status]").forEach(function (el) {
      el.textContent = "Auto-kemas kini langsung aktif" + (syncedAtStr ? (" \u2022 " + syncedAtStr) : "");
    });

    document.title = isKlon
      ? ("Set Soalan Klon SPM 2026 Interaktif & Skema Jawapan (" + totalSets + " Set KSSM) | eTutor.my")
      : (totalSets + " Set Soalan Percubaan SPM Interaktif & Skema Jawapan (" + subjectCount + " Subjek) | eTutor.my");
  }

  // --- [features/catalog/liveIndexSyncStandalone.js] ---
  /**
   * src/features/catalog/liveIndexSyncStandalone.js
   * Pengawal rangkaian & pemasa kitar hayat penyegerakan langsung (Live Auto-Update)
   * bagi halaman Indeks Direktori (/soalan-percubaan-spm/ & /soalan-klon-spm/) serta halaman set SEO.
   */

  const LIVE_CACHE_KEY = "etutor_live_catalog_v1";
  const LIVE_POLL_MS = 60000;
  const LIVE_STALE_MS = 30000;

  let syncBusy = false;
  let lastSyncMs = 0;
  let lastFp = "";

  function clockNow() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function resolveApiEndpoint() {
    const host = (window.location && window.location.hostname) ? window.location.hostname : "";
    if (/^(localhost|127\.0\.0\.1)$/i.test(host)) return "/api";
    const cfg = window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.GAS_WEB_APP_URL
      ? String(window.ETUTOR_CONFIG.GAS_WEB_APP_URL).trim()
      : "";
    return cfg || "";
  }

  function applyPayload(items, syncedAtStr) {
    if (!Array.isArray(items) || items.length === 0) return;
    const stats = summarizeCatalog(items);
    applySharedNavCounts(stats);
    const hubCat = document.body ? document.body.getAttribute("data-hub-category") : "";
    if (hubCat === "harian" || hubCat === "klon") {
      reconcileHubDom(hubCat, items, syncedAtStr);
    }
  }

  async function fetchLiveCatalog(forceRefresh) {
    if (syncBusy) return;
    const endpoint = resolveApiEndpoint();
    if (!endpoint) return;

    syncBusy = true;
    const refreshBtn = document.getElementById("hubRefreshLiveBtn");
    if (refreshBtn && forceRefresh) refreshBtn.disabled = true;

    try {
      const fetchInit = {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "publicDashboard", forceRefresh: Boolean(forceRefresh) }),
        redirect: "follow"
      };
      if (!forceRefresh) {
        fetchInit.priority = "low";
      }

      const resp = await fetch(endpoint, fetchInit);
      if (!resp.ok) return;
      const data = await resp.json();
      if (!data || !data.ok || !Array.isArray(data.catalog)) return;

      const syncedAtStr = clockNow();
      const stats = summarizeCatalog(data.catalog);
      lastSyncMs = Date.now();
      if (stats.fingerprint !== lastFp || forceRefresh) {
        lastFp = stats.fingerprint;
        applyPayload(data.catalog, syncedAtStr);
      } else {
        document.querySelectorAll("[data-hub-live-status]").forEach(function (el) {
          el.textContent = "Auto-kemas kini langsung aktif \u2022 " + syncedAtStr;
        });
      }

      try {
        localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({
          savedAt: lastSyncMs,
          syncedAtStr: syncedAtStr,
          stats: stats,
          items: data.catalog
        }));
      } catch (e) {}
    } catch (e) {
    } finally {
      syncBusy = false;
      if (refreshBtn) refreshBtn.disabled = false;
    }
  }

  function initStandaloneLiveSync() {
    try {
      const raw = localStorage.getItem(LIVE_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
          applyPayload(cached.items, cached.syncedAtStr || "");
        } else if (cached && cached.stats) {
          applySharedNavCounts(cached.stats);
        }
      }
    } catch (e) {}

    const refreshBtn = document.getElementById("hubRefreshLiveBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () { fetchLiveCatalog(true); });
    }

    fetchLiveCatalog(false);

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && Date.now() - lastSyncMs > LIVE_STALE_MS) {
        fetchLiveCatalog(false);
      }
    });

    setInterval(function () {
      if (!document.hidden) fetchLiveCatalog(false);
    }, LIVE_POLL_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStandaloneLiveSync);
  } else {
    initStandaloneLiveSync();
  }
})();
