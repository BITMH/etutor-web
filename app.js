/**
 * app.js
 * Logik Pelanggan Utama Portal Set Soalan Interaktif Harian (etutor.my)
 * Menyokong:
 *   1. Continue Progress merentas peranti (telefon <-> komputer)
 *   2. Bento Kemajuan Pembelajaran (Progress Ring, Bar Subjek, Streak & Fokus Ulang Kaji)
 *   3. Leaderboard Adil (Podium Top 3, Jadual Responsif @container & Kedudukan Peribadi)
 *   4. Pemapar Kuiz <iframe srcdoc> Anti-Reseller + Cetakan Slip Keputusan Rasmi
 */

(function () {
  "use strict";

  const SESSION_STORAGE_KEY = "etutor_portal_session_v1";
  const ADMIN_SESSION_STORAGE_KEY = "etutor_admin_session_v1";
  const DEVICE_STORAGE_KEY = "etutor_portal_device_id_v1";

  // Ikon Vektor SVG Sebaris (UI/UX Pro Max: Sifar Emoji Struktur, Garisan Seragam)
  const ICONS = {
    shield: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"/></svg>',
    play: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4" stroke-linejoin="round"/></svg>',
    refresh: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-2.64-6.36M21 3v6h-6"/></svg>',
    checkCircle: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    clock: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2"/></svg>',
    trophy: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4m-5-17h10v5a5 5 0 01-10 0V4zM7 6H4v2a3 3 0 003 3m10-5h3v2a3 3 0 01-3 3"/></svg>',
    flame: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2c.5 4.5 4 6.5 4 11a4 4 0 11-8 0c0-2.5 1.5-4.5 2-6 1 1.5 2 2 2 0 0-2-.5-3.5 0-5z"/></svg>',
    sparkles: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM5 17l.8 1.8L7.6 19.6 5.8 20.4 5 22.2l-.8-1.8-1.8-.8 1.8-.8L5 17z"/></svg>',
    book: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"/></svg>',
    printer: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"/></svg>',
    arrowLeft: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m6-7l-7 7 7 7"/></svg>',
    alert: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01"/></svg>',
    logout: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 17l5-5-5-5M21 12H9m4 9H5a2 2 0 01-2-2V5a2 2 0 012-2h8"/></svg>'
  };

  const portalState = {
    sessionToken: "",
    deviceId: getOrCreateDeviceId(),
    user: null,
    catalog: [],
    inProgress: [],
    progressSummary: null,
    leaderboard: null,
    selectedSubject: "ALL",
    selectedStatus: "ALL",
    searchQuery: "",
    lbPeriod: "all",
    lbSubject: "ALL",
    activeQuizFileId: null,
    latestSlipData: null,
    pendingProgressPayload: null,
    progressFlushTimer: null,
    adminToken: "",
    adminData: null,
    adminSearch: "",
    adminStatusFilter: "ALL",
    revealedAdminPins: new Set()
  };

  function getOrCreateDeviceId() {
    try {
      let existing = localStorage.getItem(DEVICE_STORAGE_KEY);
      if (existing && existing.length >= 8) return existing;
      const uuid = (window.crypto && window.crypto.randomUUID)
        ? "dev_" + window.crypto.randomUUID().replace(/-/g, "").slice(0, 16)
        : "dev_" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      localStorage.setItem(DEVICE_STORAGE_KEY, uuid);
      return uuid;
    } catch (e) {
      return "dev_session_fallback";
    }
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatMinutesLeft(sec) {
    if (sec === null || typeof sec === "undefined" || sec === "" || isNaN(Number(sec))) return "";
    const mins = Math.max(1, Math.ceil(Number(sec) / 60));
    return "Baki ~" + mins + " minit";
  }

  function showToast(msg) {
    const el = document.getElementById("portalToast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    if (window.ETutorMotion) window.ETutorMotion.animateToastIn(el);
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () {
      el.hidden = true;
    }, 4200);
  }

  // Top-Layer <dialog> Exit Transition Detection & Fallback (Firefox Bug 1882408 / Safari)
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (typeof window === "undefined" || !window.CSS || !window.CSS.supports || !window.CSS.supports("transition-behavior", "allow-discrete") || !document.body) {
      return false;
    }
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS && window.CSS.supports && window.CSS.supports("overlay", "auto") && canTransitionDisplay());
  }

  async function closeTopLayer(dialogEl) {
    if (!dialogEl || !dialogEl.open) return;
    if (!supportsTopLayerExit()) {
      dialogEl.setAttribute("data-closing", "");
      const animations = typeof dialogEl.getAnimations === "function" ? dialogEl.getAnimations({ subtree: true }) : [];
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map(function (a) { return a.finished; })),
          new Promise(function (r) { setTimeout(r, 400); })
        ]);
      }
      if (!dialogEl.hasAttribute("data-closing")) return;
      dialogEl.removeAttribute("data-closing");
    }
    dialogEl.close();
  }

  // ==========================================================================
  // TRANSPORT LAYER (GAS WebApp POST text/plain | google.script.run | Local /api)
  // ==========================================================================
  async function callBackend(action, payload) {
    const reqBody = Object.assign({}, payload || {}, {
      action: action,
      deviceId: portalState.deviceId,
      sessionToken: portalState.sessionToken || undefined
    });

    // 1. Jika dibuka terus sebagai Sandaran Google Apps Script (Index.html)
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise(function (resolve, reject) {
        google.script.run
          .withSuccessHandler(function (res) { resolve(res); })
          .withFailureHandler(function (err) { reject(err); })
          .gasClientBridge(JSON.stringify(reqBody));
      });
    }

    // 2. Domain etutor.my atau Pelayan Pratonton Lokal (/api)
    const cfgUrl = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.GAS_WEB_APP_URL)
      ? window.ETUTOR_CONFIG.GAS_WEB_APP_URL.trim()
      : "";
    const hostName = (typeof window !== "undefined" && window.location && window.location.hostname)
      ? window.location.hostname
      : "";
    const isLocalPreview = /^(localhost|127\.0\.0\.1)$/i.test(hostName);
    if (!cfgUrl && !isLocalPreview) {
      throw new Error(
        "Pelayan Google Apps Script belum dipautkan pada config.js. Sila jalankan `npm run clasp:login`, `npm run clasp:create`, dan `npm run deploy:all` pada komputer pentadbir."
      );
    }
    const endpoint = cfgUrl || "/api";

    // Guna Content-Type: text/plain;charset=utf-8 bagi mengelakkan CORS OPTIONS preflight pada GAS
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(reqBody),
      redirect: "follow"
    });

    if (!resp.ok) {
      throw new Error("Ralat sambungan pelayan (HTTP " + resp.status + ")");
    }
    return resp.json();
  }

  // ==========================================================================
  // FORM VALIDATION (:user-invalid + ARIA sync + WeakMap Fallback)
  // ==========================================================================
  function initFormValidation() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const syncAria = function (el) {
      if (!el || !el.checkValidity) return;
      try {
        const invalid = el.matches(":user-invalid") || el.classList.contains("user-invalid-fallback");
        el.setAttribute("aria-invalid", invalid ? "true" : "false");
      } catch (e) {}
    };

    document.addEventListener("blur", function (e) { syncAria(e.target); }, true);
    document.addEventListener("input", function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute("aria-invalid")) {
        syncAria(e.target);
      }
    });

    // Fallback untuk pelayar lama tanpa sokongan :user-invalid
    if (typeof CSS !== "undefined" && !CSS.supports("selector(:user-invalid)")) {
      const dirty = new WeakMap();
      const updateFallback = function (input) {
        const ok = input.checkValidity();
        input.classList.toggle("user-invalid-fallback", !ok);
        input.setAttribute("aria-invalid", ok ? "false" : "true");
      };
      form.addEventListener("input", function (e) {
        const st = dirty.get(e.target) || {};
        st.typed = true;
        dirty.set(e.target, st);
        if (st.blurred) updateFallback(e.target);
      });
      form.addEventListener("blur", function (e) {
        if (!e.target || !e.target.checkValidity) return;
        const st = dirty.get(e.target) || {};
        st.blurred = true;
        dirty.set(e.target, st);
        if (st.typed) updateFallback(e.target);
      }, true);
    }
  }

  // ==========================================================================
  // RENDERING: DASHBOARD SECTIONS
  // ==========================================================================
  function applyDashboardBundle(res) {
    if (res.user) portalState.user = res.user;
    if (Array.isArray(res.catalog)) portalState.catalog = res.catalog;
    if (Array.isArray(res.inProgress)) portalState.inProgress = res.inProgress;
    if (res.progressSummary) portalState.progressSummary = res.progressSummary;
    if (res.leaderboard) portalState.leaderboard = res.leaderboard;

    renderHeaderUser();
    renderContinueProgressSection();
    renderProgressOverviewSection();
    populateSubjectSelectors();
    renderLeaderboardSection();
    renderCatalogSection();

    if (window.ETutorMotion) {
      window.ETutorMotion.playDashboardEntrance();
      window.ETutorMotion.animateProgressCounters(portalState.progressSummary);
    }
  }

  function renderHeaderUser() {
    const u = portalState.user || {};
    const nameEl = document.getElementById("navBuyerName");
    const pkgEl = document.getElementById("navPackageBadge");
    if (nameEl) nameEl.textContent = u.buyerName || "Pelajar";
    if (pkgEl) pkgEl.textContent = "Pakej: " + (u.aksesPakej || "ALL");
  }

  // 1. SEKSYEN CONTINUE PROGRESS
  function renderContinueProgressSection() {
    const sec = document.getElementById("continueProgressSection");
    const grid = document.getElementById("continueProgressGrid");
    if (!sec || !grid) return;

    const list = portalState.inProgress || [];
    if (list.length === 0) {
      sec.hidden = true;
      grid.innerHTML = "";
      return;
    }

    sec.hidden = false;
    grid.innerHTML = list.slice(0, 2).map(function (item) {
      const answered = Math.max(0, Number(item.answeredCount) || 0);
      const total = Math.max(1, Number(item.totalQuestions) || 45);
      const pct = Math.min(100, Math.round((answered / total) * 100));
      const remLabel = formatMinutesLeft(item.timeRemaining);
      const title = item.quizTitle || "Set Latihan Interaktif";

      return [
        '<article class="continue-card">',
        '  <div>',
        '    <div class="continue-top">',
        '      <span class="continue-tag">' + ICONS.clock + ' Sedang Dijawab</span>',
        '      <span class="tabular-nums" style="font-size:0.8rem;color:#cbd5e1">' + escapeHtml(item.subject || "SPM") + '</span>',
        '    </div>',
        '    <h3 class="continue-title">' + escapeHtml(title) + '</h3>',
        '    <div class="continue-meta" style="margin-top:8px">',
        '      <span>Disimpan: ' + escapeHtml(item.updatedAt || "Sebentar tadi") + '</span>',
        (remLabel ? '      <span class="tabular-nums">• ' + escapeHtml(remLabel) + '</span>' : ''),
        '    </div>',
        '  </div>',
        '  <div class="continue-progress-wrap">',
        '    <div class="continue-progress-labels">',
        '      <span>Kemajuan Jawapan</span>',
        '      <strong class="tabular-nums">' + answered + ' / ' + total + ' soalan (' + pct + '%)</strong>',
        '    </div>',
        '    <progress class="etutor-progress on-dark" max="' + total + '" value="' + Math.min(answered, total) + '" aria-label="Kemajuan ' + escapeHtml(title) + '"></progress>',
        '  </div>',
        '  <div class="continue-actions">',
        '    <button type="button" class="btn btn-continue-white js-open-quiz" data-file-id="' + escapeHtml(item.fileId) + '" data-resume="1">',
               ICONS.play + ' <span>Sambung Semula</span>',
        '    </button>',
        '    <button type="button" class="btn btn-continue-subtle btn-sm js-open-quiz" data-file-id="' + escapeHtml(item.fileId) + '" data-reset="1">',
               ICONS.refresh + ' <span>Mula Baharu</span>',
        '    </button>',
        '  </div>',
        '</article>'
      ].join("\n");
    }).join("\n");
  }

  // 2. SEKSYEN PROGRESS OVERVIEW (Bento Grid)
  function renderProgressOverviewSection() {
    const ps = portalState.progressSummary || {
      totalSets: 0,
      completedSets: 0,
      completionPercentage: 0,
      averageScore: 0,
      averageGrade: "—",
      totalXp: 0,
      streakDays: 0,
      subjectBreakdown: [],
      weakTopics: []
    };

    const ringBox = document.getElementById("overallProgressRing");
    const ringVal = document.getElementById("overallProgressPct");
    const setsCountEl = document.getElementById("overallSetsDoneText");
    if (ringBox) {
      const pctNum = Math.max(0, Math.min(100, Number(ps.completionPercentage) || 0));
      ringBox.value = pctNum;
      ringBox.setAttribute("value", String(pctNum));
      ringBox.style.setProperty("--ring-pct", String(pctNum));
    }
    if (ringVal) ringVal.textContent = (ps.completionPercentage || 0) + "%";
    if (setsCountEl) setsCountEl.textContent = (ps.completedSets || 0) + " daripada " + (ps.totalSets || 0) + " set selesai";

    const kpiAvg = document.getElementById("kpiAvgScore");
    const kpiGrade = document.getElementById("kpiAvgGrade");
    const kpiXp = document.getElementById("kpiTotalXp");
    const kpiStreak = document.getElementById("kpiStreakDays");

    if (kpiAvg) kpiAvg.textContent = (ps.averageScore || 0) + "%";
    if (kpiGrade) kpiGrade.textContent = ps.averageGrade || "—";
    if (kpiXp) kpiXp.textContent = Number(ps.totalXp || 0).toLocaleString("en-MY") + " XP";
    if (kpiStreak) kpiStreak.textContent = (ps.streakDays || 0) + " Hari";

    // Bar Subjek
    const subContainer = document.getElementById("subjectBreakdownList");
    if (subContainer) {
      const subs = ps.subjectBreakdown || [];
      if (subs.length === 0) {
        subContainer.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted)">Tiada set soalan lagi.</p>';
      } else {
        subContainer.innerHTML = subs.map(function (s) {
          return [
            '<div class="subject-bar-item">',
            '  <div class="subject-bar-head">',
            '    <span>' + escapeHtml(s.subject) + '</span>',
            '    <span class="tabular-nums">' + s.completed + '/' + s.total + ' (' + s.percentage + '%)</span>',
            '  </div>',
            '  <progress class="etutor-progress" max="100" value="' + s.percentage + '" aria-label="Kemajuan subjek ' + escapeHtml(s.subject) + '"></progress>',
            '</div>'
          ].join("");
        }).join("");
      }
    }

    // Fokus Ulang Kaji (Topik Lemah)
    const weakCard = document.getElementById("weakTopicsBanner");
    const weakRow = document.getElementById("weakTopicsPills");
    if (weakCard && weakRow) {
      const wList = ps.weakTopics || [];
      if (wList.length === 0) {
        weakCard.hidden = true;
      } else {
        weakCard.hidden = false;
        weakRow.innerHTML = wList.map(function (w) {
          return '<span class="weak-pill">' + ICONS.alert + ' ' + escapeHtml(w.topic) + ' <strong class="tabular-nums">(' + w.lowestPct + '%)</strong></span>';
        }).join("");
      }
    }
  }

  // 3. SEKSYEN LEADERBOARD
  function renderLeaderboardSection() {
    const lb = portalState.leaderboard || { entries: [], myStanding: null, totalParticipants: 0 };
    const podiumEl = document.getElementById("leaderboardPodium");
    const tbodyEl = document.getElementById("leaderboardTableBody");
    const myFootEl = document.getElementById("myStandingFooter");

    const entries = lb.entries || [];

    if (podiumEl) {
      if (entries.length === 0) {
        podiumEl.innerHTML = "";
        podiumEl.hidden = true;
      } else {
        podiumEl.hidden = false;
        podiumEl.innerHTML = entries.slice(0, 3).map(function (e) {
          return [
            '<div class="podium-tile rank-' + e.rank + '">',
            '  <div class="podium-medal tabular-nums">#' + e.rank + '</div>',
            '  <div style="min-width:0">',
            '    <div style="font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">',
                   escapeHtml(e.displayName) + (e.isCurrentUser ? '<span class="you-badge">Anda</span>' : ''),
            '    </div>',
            '    <div class="tabular-nums" style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px">',
                   Number(e.xp).toLocaleString("en-MY") + ' XP • Purata ' + e.averageScore + '% (' + escapeHtml(e.grade) + ')',
            '    </div>',
            '  </div>',
            '</div>'
          ].join("");
        }).join("");
      }
    }

    if (tbodyEl) {
      if (entries.length === 0) {
        tbodyEl.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">Belum ada rekod markah dihantar bagi kategori ini. Jadilah pelajar pertama di tangga #1!</td></tr>';
      } else {
        tbodyEl.innerHTML = entries.map(function (e) {
          return [
            '<tr class="' + (e.isCurrentUser ? "is-me" : "") + '">',
            '  <th scope="row">',
            '    <span class="tabular-nums" style="display:inline-block;min-width:28px;color:var(--text-muted)">#' + e.rank + '</span> ',
                 escapeHtml(e.displayName),
                 (e.isCurrentUser ? '<span class="you-badge">Anda</span>' : ''),
            '  </th>',
            '  <td class="tabular-nums">' + e.setsCompleted + ' set</td>',
            '  <td class="tabular-nums">' + e.averageScore + '%</td>',
            '  <td><span class="status-badge badge-done">' + escapeHtml(e.grade) + '</span></td>',
            '  <td class="tabular-nums" style="font-weight:700;color:var(--brand-primary)">' + Number(e.xp).toLocaleString("en-MY") + ' XP</td>',
            '</tr>'
          ].join("");
        }).join("");
      }
    }

    if (myFootEl) {
      const me = lb.myStanding;
      if (!me) {
        myFootEl.hidden = true;
      } else {
        myFootEl.hidden = false;
        const rankText = me.rank
          ? "Kedudukan Semasa Anda: #" + me.rank + " daripada " + (lb.totalParticipants || 1) + " pelajar"
          : "Anda belum menghantar markah bagi penapis ini — selesaikan 1 set untuk masuk ke Leaderboard!";
        myFootEl.innerHTML = [
          '<span>' + ICONS.trophy + ' ' + escapeHtml(rankText) + '</span>',
          '<span class="tabular-nums">' + Number(me.xp || 0).toLocaleString("en-MY") + ' XP • ' + (me.setsCompleted || 0) + ' Set • Purata ' + (me.averageScore || 0) + '%</span>'
        ].join("");
      }
    }

    if (window.ETutorMotion) window.ETutorMotion.animateLeaderboardUpdate();
  }

  function populateSubjectSelectors() {
    const subjects = [];
    const seen = {};
    (portalState.catalog || []).forEach(function (c) {
      if (c.subject && !seen[c.subject]) {
        seen[c.subject] = true;
        subjects.push(c.subject);
      }
    });
    subjects.sort();

    // Cip Subjek Katalog
    const chipRow = document.getElementById("subjectChipsRow");
    if (chipRow) {
      const allOpts = ["ALL"].concat(subjects);
      chipRow.innerHTML = allOpts.map(function (sub) {
        const active = portalState.selectedSubject === sub;
        const label = sub === "ALL" ? "Semua Subjek" : sub;
        return '<button type="button" class="tab-chip js-subject-chip" data-subject="' + escapeHtml(sub) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
      }).join("");
    }

    // Dropdown Subjek Leaderboard
    const lbSelect = document.getElementById("lbSubjectSelect");
    if (lbSelect) {
      const prev = portalState.lbSubject || "ALL";
      lbSelect.innerHTML = ['<option value="ALL">Semua Subjek</option>']
        .concat(subjects.map(function (s) {
          return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
        }))
        .join("");
      lbSelect.value = seen[prev] ? prev : "ALL";
    }
  }

  // 4. SEKSYEN KATALOG BANK SOALAN
  function renderCatalogSection() {
    const grid = document.getElementById("catalogCardsGrid");
    const countLabel = document.getElementById("catalogCountLabel");
    if (!grid) return;

    const q = portalState.searchQuery.trim().toLowerCase();
    const filtered = (portalState.catalog || []).filter(function (item) {
      if (portalState.selectedSubject !== "ALL" && item.subject !== portalState.selectedSubject) {
        return false;
      }
      if (portalState.selectedStatus !== "ALL" && item.status !== portalState.selectedStatus) {
        return false;
      }
      if (q) {
        const hay = [item.cleanTitle, item.subject, item.level, item.stateOrSource, item.setCode].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (countLabel) {
      countLabel.textContent = filtered.length + " set dipaparkan";
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:32px">Tiada set soalan sepadan dengan carian atau penapis semasa.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      let statusBadgeHtml = '<span class="status-badge badge-new">Belum Jawab</span>';
      let primaryBtnLabel = "Mula Latihan";
      let primaryBtnClass = "btn-primary";
      let resumeAttr = 'data-resume="0"';

      if (item.inProgress) {
        const ans = item.inProgress.answeredCount || 0;
        const tot = item.inProgress.totalQuestions || 45;
        statusBadgeHtml = '<span class="status-badge badge-progress">' + ICONS.clock + ' <span class="tabular-nums">' + ans + '/' + tot + ' Dijawab</span></span>';
        primaryBtnLabel = "Sambung Semula";
        primaryBtnClass = "btn-emerald";
        resumeAttr = 'data-resume="1"';
      } else if (item.bestScore) {
        statusBadgeHtml = '<span class="status-badge badge-done">' + ICONS.checkCircle + ' <span class="tabular-nums">' + item.bestScore.percentage + '% • Gred ' + escapeHtml(item.bestScore.grade) + '</span></span>';
        primaryBtnLabel = "Ulang Latihan";
        primaryBtnClass = "btn-outline";
      }

      return [
        '<article class="quiz-card">',
        '  <div>',
        '    <div class="quiz-card-badges">',
        '      <span class="status-badge badge-subject">' + ICONS.book + ' ' + escapeHtml(item.subject) + '</span>',
               statusBadgeHtml,
        '    </div>',
        '    <h3 class="quiz-card-title">' + escapeHtml(item.cleanTitle) + '</h3>',
        '    <div class="quiz-card-meta">',
        (item.setCode ? '<span>' + escapeHtml(item.setCode) + '</span>' : ''),
        (item.stateOrSource ? '<span>• ' + escapeHtml(item.stateOrSource) + '</span>' : ''),
        (item.year ? '<span class="tabular-nums">• ' + escapeHtml(item.year) + '</span>' : ''),
        '    </div>',
        '  </div>',
        '  <div class="quiz-card-footer">',
        '    <button type="button" class="btn ' + primaryBtnClass + ' js-open-quiz" data-file-id="' + escapeHtml(item.fileId) + '" ' + resumeAttr + '>',
               ICONS.play + ' <span>' + primaryBtnLabel + '</span>',
        '    </button>',
        (item.inProgress
          ? '<button type="button" class="btn btn-ghost btn-sm js-open-quiz" data-file-id="' + escapeHtml(item.fileId) + '" data-reset="1" title="Mula semula dari awal">' + ICONS.refresh + '<span class="sr-only">Mula Baharu</span></button>'
          : ''),
        '  </div>',
        '</article>'
      ].join("\n");
    }).join("\n");

    if (window.ETutorMotion) window.ETutorMotion.animateCatalogCards();
  }

  // ==========================================================================
  // OPEN QUIZ IN PROTECTED <iframe srcdoc> & SYNC PROGRESS / SCORE
  // ==========================================================================
  async function openQuizSet(fileId, autoResume, resetStart) {
    const stage = document.getElementById("examStage");
    const iframe = document.getElementById("examIframe");
    const titleEl = document.getElementById("examStageTitle");
    const slipBtn = document.getElementById("openSlipBtn");
    const syncEl = document.getElementById("examSyncStatus");

    const meta = (portalState.catalog || []).find(function (c) { return c.fileId === fileId; });
    if (titleEl) titleEl.textContent = meta ? meta.cleanTitle : "Memuatkan Set Soalan...";
    if (slipBtn) slipBtn.hidden = true;
    if (syncEl) syncEl.textContent = "Memuatkan soalan selamat...";

    portalState.activeQuizFileId = fileId;
    portalState.latestSlipData = null;
    stage.hidden = false;
    document.body.style.overflow = "hidden";
    if (window.ETutorMotion) window.ETutorMotion.playExamStageOpen();

    iframe.srcdoc = '<!DOCTYPE html><html lang="ms"><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;height:92vh;color:#334155;background:#f8fafc"><div style="text-align:center"><p style="font-weight:700;font-size:1.05rem;margin-bottom:6px">Menyediakan Kertas Soalan Dilindungi...</p><p style="font-size:0.88rem;color:#64748b">Sila tunggu sebentar.</p></div></body></html>';

    try {
      const res = await callBackend("getQuizHtml", {
        fileId: fileId,
        autoResume: Boolean(autoResume),
        resetStart: Boolean(resetStart)
      });

      if (!res || !res.ok) {
        if (res && res.authExpired) {
          handleLogout();
        }
        showToast((res && res.error) || "Gagal memuatkan set soalan.");
        closeQuizStage();
        return;
      }

      iframe.srcdoc = res.html;
      if (syncEl) {
        syncEl.textContent = autoResume && res.hasSavedState
          ? "Sesi terdahulu disambung automatik"
          : "Auto-simpan aktif";
      }

      if (resetStart) {
        portalState.inProgress = (portalState.inProgress || []).filter(function (p) { return p.fileId !== fileId; });
        renderContinueProgressSection();
        renderCatalogSection();
      }
    } catch (err) {
      showToast("Ralat rangkaian semasa memuatkan soalan: " + err.message);
      closeQuizStage();
    }
  }

  async function flushPendingProgressNow() {
    clearTimeout(portalState.progressFlushTimer);
    const payload = portalState.pendingProgressPayload;
    portalState.pendingProgressPayload = null;
    if (!payload) return;

    try {
      await callBackend("saveProgress", payload);
    } catch (e) {}
  }

  async function closeQuizStage() {
    const stage = document.getElementById("examStage");
    const iframe = document.getElementById("examIframe");
    await flushPendingProgressNow();

    if (iframe) iframe.srcdoc = "";
    if (stage) stage.hidden = true;
    document.body.style.overflow = "";
    portalState.activeQuizFileId = null;

    // Segarkan data dashboard dari pelayan supaya Continue Progress & Leaderboard tepat
    try {
      const refreshed = await callBackend("dashboard", { forceRefresh: false });
      if (refreshed && refreshed.ok) {
        applyDashboardBundle(refreshed);
      }
    } catch (e) {}
  }

  // Terima mesej postMessage daripada jambatan di dalam <iframe sandbox srcdoc> dengan pengesahan ketat
  function handleQuizMessage(event) {
    const iframe = document.getElementById("examIframe");
    if (!iframe || !iframe.contentWindow || !event || event.source !== iframe.contentWindow) return;
    if (event.origin !== "null" && event.origin !== window.location.origin) return;

    const msg = event.data;
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (!portalState.activeQuizFileId || String(msg.fileId || "") !== String(portalState.activeQuizFileId)) return;

    if (msg.type === "ETUTOR_PRINT_BLOCKED") {
      showToast("Cetakan kertas soalan disekat. Sila hantar kuiz dahulu untuk mencetak Slip Keputusan Rasmi.");
      return;
    }

    if (msg.type === "ETUTOR_PROGRESS_CLEARED") {
      portalState.pendingProgressPayload = null;
      callBackend("clearProgress", { fileId: portalState.activeQuizFileId }).catch(function () {});
      return;
    }

    if (msg.type === "ETUTOR_PROGRESS_SYNC") {
      if (msg.isSubmitted) return; // Keputusan penuh diuruskan oleh ETUTOR_QUIZ_COMPLETED
      const answeredCount = Math.max(0, Math.round(Number(msg.answeredCount) || 0));
      const totalQuestions = Math.max(1, Math.round(Number(msg.totalQuestions) || 45));
      if (answeredCount === 0) return;

      const syncEl = document.getElementById("examSyncStatus");
      if (syncEl) {
        syncEl.textContent = "Disimpan (" + answeredCount + " dijawab)";
      }

      const activeMeta = (portalState.catalog || []).find(function (c) {
        return c.fileId === portalState.activeQuizFileId;
      });
      const safeTitle = (activeMeta && activeMeta.cleanTitle) || String(msg.quizTitle || "").slice(0, 140);
      const safeSubject = (activeMeta && activeMeta.subject) || String(msg.subject || "").slice(0, 60);

      // Kemas kini state lokal segera supaya UI responsif serta-merta
      const itemSummary = {
        updatedAt: "Sebentar tadi",
        fileId: portalState.activeQuizFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        answeredCount: answeredCount,
        totalQuestions: totalQuestions,
        timeRemaining: typeof msg.timeRemaining === "number" ? Math.max(0, Math.round(msg.timeRemaining)) : null
      };

      const others = (portalState.inProgress || []).filter(function (p) { return p.fileId !== portalState.activeQuizFileId; });
      portalState.inProgress = [itemSummary].concat(others);

      portalState.pendingProgressPayload = {
        fileId: portalState.activeQuizFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        answeredCount: answeredCount,
        totalQuestions: totalQuestions,
        timeRemaining: itemSummary.timeRemaining,
        stateJson: String(msg.stateJson || "")
      };

      clearTimeout(portalState.progressFlushTimer);
      portalState.progressFlushTimer = setTimeout(function () {
        flushPendingProgressNow();
      }, 7000);
      return;
    }

    if (msg.type === "ETUTOR_QUIZ_COMPLETED") {
      portalState.pendingProgressPayload = null;
      clearTimeout(portalState.progressFlushTimer);

      const pctSafe = Math.max(0, Math.min(100, Math.round(Number(msg.percentage) || 0)));
      const gradeSafe = String(msg.grade || "—").trim().slice(0, 6);
      const activeMeta = (portalState.catalog || []).find(function (c) {
        return c.fileId === portalState.activeQuizFileId;
      });
      const safeTitle = (activeMeta && activeMeta.cleanTitle) || String(msg.quizTitle || "").slice(0, 140);
      const safeSubject = (activeMeta && activeMeta.subject) || String(msg.subject || "").slice(0, 60);
      const safeWeakTopics = (Array.isArray(msg.weakTopics) ? msg.weakTopics.slice(0, 10) : [])
        .filter(function (w) { return w && typeof w === "object" && w.topic; })
        .map(function (w) {
          return {
            topic: String(w.topic || "").trim().slice(0, 120),
            percentage: Math.max(0, Math.min(100, Math.round(Number(w.percentage) || 0))),
            obtained: Math.max(0, Math.round(Number(w.obtained) || 0)),
            total: Math.max(1, Math.round(Number(w.total) || 1))
          };
        });

      portalState.latestSlipData = {
        fileId: portalState.activeQuizFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        buyerName: (portalState.user && portalState.user.buyerName) || "",
        scoreText: String(msg.scoreText || (pctSafe + "%")).slice(0, 40),
        percentage: pctSafe,
        grade: gradeSafe,
        breakdown: String(msg.breakdown || "").slice(0, 180),
        weakTopics: safeWeakTopics
      };

      const slipBtn = document.getElementById("openSlipBtn");
      if (slipBtn) slipBtn.hidden = false;
      if (window.ETutorMotion) window.ETutorMotion.celebrateQuizCompletion();

      const syncEl = document.getElementById("examSyncStatus");
      if (syncEl) syncEl.textContent = "Keputusan direkodkan: " + pctSafe + "% (" + gradeSafe + ")";

      showToast("Tahniah! Markah " + pctSafe + "% (Gred " + gradeSafe + ") telah direkodkan ke Leaderboard.");

      callBackend("saveScore", {
        fileId: portalState.activeQuizFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        scoreText: portalState.latestSlipData.scoreText,
        percentage: pctSafe,
        grade: gradeSafe,
        weakTopics: safeWeakTopics
      }).then(function (res) {
        if (res && res.ok) {
          applyDashboardBundle(res);
        }
      }).catch(function () {});
    }
  }

  // ==========================================================================
  // OFFICIAL RESULT SLIP MODAL & SAFE PRINT
  // ==========================================================================
  function openResultSlipModal() {
    const data = portalState.latestSlipData;
    const dlg = document.getElementById("resultSlipDialog");
    if (!data || !dlg) return;

    const safePct = Math.max(0, Math.min(100, Math.round(Number(data.percentage) || 0)));
    document.getElementById("slipStudentName").textContent = (portalState.user && portalState.user.buyerName) || data.buyerName || "Pelajar";
    document.getElementById("slipUserId").textContent = (portalState.user && portalState.user.userId) || "";
    document.getElementById("slipQuizTitle").textContent = data.quizTitle || "Set Latihan Interaktif";
    document.getElementById("slipSubject").textContent = data.subject || "SPM";
    document.getElementById("slipDate").textContent = new Date().toLocaleString("ms-MY");
    document.getElementById("slipScorePct").textContent = safePct + "%";
    document.getElementById("slipGrade").textContent = String(data.grade || "—").slice(0, 6);
    document.getElementById("slipBreakdown").textContent = data.breakdown || ("Markah: " + (data.scoreText || ""));

    const weakListEl = document.getElementById("slipWeakTopics");
    weakListEl.textContent = "";
    const wt = Array.isArray(data.weakTopics) ? data.weakTopics : [];
    if (wt.length === 0) {
      const okLi = document.createElement("li");
      okLi.style.color = "var(--grade-emerald)";
      okLi.textContent = "Penguasaan kukuh (>= 60%) merentasi semua bab yang diuji.";
      weakListEl.appendChild(okLi);
    } else {
      wt.forEach(function (w) {
        const li = document.createElement("li");
        const wPct = Math.max(0, Math.min(100, Math.round(Number(w.percentage) || 0)));
        const wObt = Math.max(0, Math.round(Number(w.obtained) || 0));
        const wTot = Math.max(1, Math.round(Number(w.total) || 1));
        li.textContent = String(w.topic || "Topik") + " — Penguasaan " + wPct + "% (" + wObt + "/" + wTot + ")";
        weakListEl.appendChild(li);
      });
    }

    if (typeof dlg.showModal === "function") {
      dlg.showModal();
    } else {
      dlg.setAttribute("open", "");
    }
    if (window.ETutorMotion) window.ETutorMotion.animateSlipScore(safePct);
  }

  function printOfficialSlip() {
    document.body.classList.add("printing-official-slip");
    window.print();
    setTimeout(function () {
      document.body.classList.remove("printing-official-slip");
    }, 500);
  }

  // ==========================================================================
  // AUTHENTICATION & SESSION LIFECYCLE
  // ==========================================================================
  function saveSessionLocally(token, userObj) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        sessionToken: token,
        user: userObj
      }));
    } catch (e) {}
  }

  function handleLogout() {
    portalState.sessionToken = "";
    portalState.user = null;
    try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
    document.getElementById("dashboardView").hidden = true;
    document.getElementById("examStage").hidden = true;
    document.body.style.overflow = "";
    window.location.hash = "#login";
    syncRouteMode();
  }

  async function tryRestoreExistingSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.sessionToken) return false;

      portalState.sessionToken = parsed.sessionToken;
      portalState.user = parsed.user || null;

      const btn = document.getElementById("loginSubmitBtn");
      if (btn) btn.textContent = "Menyambung sesi...";

      const res = await callBackend("dashboard", { forceRefresh: false });
      if (res && res.ok) {
        const landingEl = document.getElementById("landingView");
        if (landingEl) landingEl.hidden = true;
        document.getElementById("loginView").hidden = true;
        document.getElementById("dashboardView").hidden = false;
        applyDashboardBundle(res);
        return true;
      } else {
        portalState.sessionToken = "";
        portalState.user = null;
        try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e2) {}
        syncRouteMode();
        return false;
      }
    } catch (e) {
      portalState.sessionToken = "";
      portalState.user = null;
      try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e3) {}
      syncRouteMode();
      return false;
    } finally {
      const btn = document.getElementById("loginSubmitBtn");
      if (btn) btn.textContent = "Log Masuk ke Portal";
    }
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  function bindEvents() {
    initFormValidation();
    window.addEventListener("message", handleQuizMessage);

    // Sekat Ctrl+S / Ctrl+P pada peringkat induk kecuali semasa dialog slip dibuka
    document.addEventListener("keydown", function (e) {
      const ctrl = e.ctrlKey || e.metaKey;
      const k = String(e.key || "").toLowerCase();
      if (ctrl && (k === "s" || k === "u")) {
        e.preventDefault();
      }
      if (ctrl && k === "p") {
        const dlg = document.getElementById("resultSlipDialog");
        if (!dlg || !dlg.open) {
          e.preventDefault();
          showToast("Cetakan halaman disekat. Gunakan butang Slip Keputusan selepas tamat menjawab kuiz.");
        }
      }
    });

    // Toggle Show/Hide PIN
    const pinBtn = document.getElementById("togglePinBtn");
    const pinInput = document.getElementById("loginPinInput");
    if (pinBtn && pinInput) {
      pinBtn.addEventListener("click", function () {
        const isPwd = pinInput.type === "password";
        pinInput.type = isPwd ? "text" : "password";
        pinBtn.setAttribute("aria-pressed", isPwd ? "true" : "false");
        pinBtn.setAttribute("aria-label", isPwd ? "Sembunyikan Kod PIN" : "Paparkan Kod PIN");
      });
    }

    // Submit Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const errBox = document.getElementById("loginAlertBox");
        const errText = document.getElementById("loginAlertText");
        const submitBtn = document.getElementById("loginSubmitBtn");

        const userId = document.getElementById("loginUserIdInput").value.trim();
        const pin = document.getElementById("loginPinInput").value.trim();

        if (!loginForm.checkValidity()) {
          loginForm.reportValidity();
          return;
        }

        errBox.hidden = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengesahkan Akses...";

        try {
          const res = await callBackend("login", { userId: userId, pin: pin });
          if (!res || !res.ok) {
            errText.textContent = (res && res.error) || "Log masuk gagal. Sila semak ID & PIN anda.";
            errBox.hidden = false;
            if (window.ETutorMotion) window.ETutorMotion.shakeLoginAlert();
            return;
          }

          portalState.sessionToken = res.sessionToken;
          saveSessionLocally(res.sessionToken, res.user);

          const landingEl = document.getElementById("landingView");
          if (landingEl) landingEl.hidden = true;
          document.getElementById("loginView").hidden = true;
          document.getElementById("dashboardView").hidden = false;
          if (window.location.hash.toLowerCase() === "#login") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
          applyDashboardBundle(res);
        } catch (err) {
          errText.textContent = "Gagal menghubungi pelayan pengesahan: " + err.message;
          errBox.hidden = false;
          if (window.ETutorMotion) window.ETutorMotion.shakeLoginAlert();
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Log Masuk ke Portal";
        }
      });
    }

    // Logout & Refresh
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

    const refreshBtn = document.getElementById("refreshCatalogBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async function () {
        refreshBtn.disabled = true;
        try {
          const res = await callBackend("dashboard", { forceRefresh: true });
          if (res && res.ok) {
            applyDashboardBundle(res);
            showToast("Bank soalan & Leaderboard telah dikemas kini.");
          }
        } catch (err) {
          showToast("Gagal menyegarkan data.");
        } finally {
          refreshBtn.disabled = false;
        }
      });
    }

    // Delegated Clicks (Open Quiz, Subject Filter Chips, Leaderboard Period)
    document.addEventListener("click", async function (e) {
      const openBtn = e.target.closest(".js-open-quiz");
      if (openBtn) {
        const fid = openBtn.getAttribute("data-file-id");
        const resume = openBtn.getAttribute("data-resume") === "1";
        const reset = openBtn.getAttribute("data-reset") === "1";
        if (fid) openQuizSet(fid, resume, reset);
        return;
      }

      const subChip = e.target.closest(".js-subject-chip");
      if (subChip) {
        portalState.selectedSubject = subChip.getAttribute("data-subject") || "ALL";
        document.querySelectorAll(".js-subject-chip").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === subChip ? "true" : "false");
        });
        renderCatalogSection();
        return;
      }

      const lbTab = e.target.closest(".js-lb-period");
      if (lbTab) {
        const period = lbTab.getAttribute("data-period") || "all";
        portalState.lbPeriod = period;
        document.querySelectorAll(".js-lb-period").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === lbTab ? "true" : "false");
        });
        try {
          const res = await callBackend("getLeaderboard", {
            period: portalState.lbPeriod,
            subject: portalState.lbSubject
          });
          if (res && res.ok) {
            portalState.leaderboard = res.leaderboard;
            renderLeaderboardSection();
          }
        } catch (err) {}
      }
    });

    // Leaderboard Subject Select
    const lbSubSel = document.getElementById("lbSubjectSelect");
    if (lbSubSel) {
      lbSubSel.addEventListener("change", async function () {
        portalState.lbSubject = lbSubSel.value || "ALL";
        try {
          const res = await callBackend("getLeaderboard", {
            period: portalState.lbPeriod,
            subject: portalState.lbSubject
          });
          if (res && res.ok) {
            portalState.leaderboard = res.leaderboard;
            renderLeaderboardSection();
          }
        } catch (err) {}
      });
    }

    // Catalog Search & Status Filter
    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        portalState.searchQuery = searchInput.value;
        renderCatalogSection();
      });
    }

    const statusSelect = document.getElementById("catalogStatusSelect");
    if (statusSelect) {
      statusSelect.addEventListener("change", function () {
        portalState.selectedStatus = statusSelect.value || "ALL";
        renderCatalogSection();
      });
    }

    // Exam Stage Controls & Result Slip Dialog
    const closeStageBtn = document.getElementById("closeExamStageBtn");
    if (closeStageBtn) closeStageBtn.addEventListener("click", closeQuizStage);

    const openSlipBtn = document.getElementById("openSlipBtn");
    if (openSlipBtn) openSlipBtn.addEventListener("click", openResultSlipModal);

    const printSlipBtn = document.getElementById("printSlipBtn");
    if (printSlipBtn) printSlipBtn.addEventListener("click", printOfficialSlip);

    const closeSlipBtn = document.getElementById("closeSlipBtn");
    const slipDlg = document.getElementById("resultSlipDialog");
    if (closeSlipBtn && slipDlg) {
      closeSlipBtn.addEventListener("click", function () { closeTopLayer(slipDlg); });
      slipDlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
        closeTopLayer(slipDlg);
      });
      if (typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype)) {
        slipDlg.addEventListener("click", function (ev) {
          if (ev.target !== slipDlg) return;
          const rect = slipDlg.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= ev.clientY &&
            ev.clientY <= rect.top + rect.height &&
            rect.left <= ev.clientX &&
            ev.clientX <= rect.left + rect.width
          );
          if (!isDialogContent) {
            closeTopLayer(slipDlg);
          }
        });
      }
    }

    initLandingAndOrderBindings();
    initAdminPanelBindings();
  }

  // ==========================================================================
  // LAMAN JUALAN UTAMA (LANDING PAGE), SIMULASI KUIZ DEMO & TEMPAHAN PAKEJ
  // ==========================================================================
  const DEMO_QUESTIONS = [
    {
      topic: "Topik: Ungkapan & Persamaan Kuadratik (Matematik Kertas 1)",
      question: "Diberi persamaan kuadratik (x - 4)(2x + 3) = 0. Nyatakan punca-punca bagi persamaan tersebut.",
      options: [
        "x = -4 atau x = 3/2",
        "x = 4 atau x = -3/2",
        "x = 4 atau x = 3/2",
        "x = -4 atau x = -3/2"
      ],
      correctIndex: 1,
      explanation: "Apabila hasil darab dua faktor ialah sifar: (x - 4) = 0 menghasilkan x = 4, manakala (2x + 3) = 0 menghasilkan 2x = -3, maka x = -3/2."
    },
    {
      topic: "Topik: Bab 2 Tingkatan 5 — Perlembagaan Persekutuan (Sejarah Kertas 1)",
      question: "Apakah kepentingan utama Pindaan Perlembagaan Persekutuan 1963 dalam sejarah pembinaan negara Malaysia?",
      options: [
        "Memansuhkan jawatan Yang di-Pertuan Agong di peringkat Persekutuan",
        "Menyesuaikan peruntukan perlembagaan bagi kemasukan Sabah, Sarawak dan Singapura",
        "Menyeragamkan semua undang-undang adat negeri di bawah satu mahkamah tunggal",
        "Menggantikan sistem Raja Berperlembagaan kepada sistem Republik"
      ],
      correctIndex: 1,
      explanation: "Kata kunci skema KSSM: Pindaan 1963 dilakukan khusus untuk menyesuaikan struktur Mahkamah Tinggi, kedudukan Yang di-Pertua Negeri, dan autonomi imigresen berikutan pembentukan Malaysia."
    },
    {
      topic: "Topik: Analisis & Tafsiran Penyata Kewangan (Prinsip Perakaunan)",
      question: "Perniagaan Wawasan mempunyai Aset Semasa berjumlah RM 54,000 dan Liabiliti Semasa berjumlah RM 18,000. Berapakah Nisbah Semasa perniagaan ini?",
      options: [
        "0.33 : 1",
        "1.5 : 1",
        "3 : 1",
        "36,000 : 1"
      ],
      correctIndex: 2,
      explanation: "Rumus Nisbah Semasa = Aset Semasa / Liabiliti Semasa = RM 54,000 / RM 18,000 = 3 : 1. Ini bermakna setiap RM 1 liabiliti jangka pendek disokong oleh RM 3 aset semasa."
    }
  ];

  let activeDemoIdx = 0;
  let demoXpEarned = 0;
  const answeredDemoSet = {};

  function renderLandingDemoQuestion(idx) {
    activeDemoIdx = idx;
    const q = DEMO_QUESTIONS[idx] || DEMO_QUESTIONS[0];
    const topicEl = document.getElementById("lpDemoTopicLabel");
    const textEl = document.getElementById("lpDemoQuestionText");
    const gridEl = document.getElementById("lpDemoOptionsGrid");
    const expEl = document.getElementById("lpDemoExplainBox");

    document.querySelectorAll(".lp-demo-tab").forEach(function (btn) {
      const bIdx = parseInt(btn.getAttribute("data-demo-idx"), 10);
      btn.setAttribute("aria-selected", bIdx === idx ? "true" : "false");
    });

    if (topicEl) topicEl.textContent = q.topic;
    if (textEl) textEl.textContent = q.question;
    if (expEl) expEl.hidden = true;
    if (!gridEl) return;

    const letters = ["A", "B", "C", "D"];
    gridEl.innerHTML = q.options.map(function (optText, optIdx) {
      return [
        '<button type="button" class="lp-demo-opt" data-opt-idx="' + optIdx + '">',
        '  <span class="lp-demo-opt-letter">' + letters[optIdx] + "</span>",
        "  <span>" + escapeHtml(optText) + "</span>",
        "</button>"
      ].join("");
    }).join("");
  }

  function handleDemoOptionSelect(optIdx) {
    const q = DEMO_QUESTIONS[activeDemoIdx] || DEMO_QUESTIONS[0];
    const gridEl = document.getElementById("lpDemoOptionsGrid");
    const expEl = document.getElementById("lpDemoExplainBox");
    const xpBadge = document.getElementById("lpDemoXpBadge");
    if (!gridEl || !expEl) return;

    const isRight = optIdx === q.correctIndex;
    gridEl.querySelectorAll(".lp-demo-opt").forEach(function (btn) {
      const idx = parseInt(btn.getAttribute("data-opt-idx"), 10);
      btn.classList.remove("is-correct", "is-wrong");
      if (idx === q.correctIndex) {
        btn.classList.add("is-correct");
      } else if (idx === optIdx && !isRight) {
        btn.classList.add("is-wrong");
      }
    });

    if (!answeredDemoSet[activeDemoIdx]) {
      answeredDemoSet[activeDemoIdx] = true;
      demoXpEarned += isRight ? 100 : 40;
      if (xpBadge) xpBadge.textContent = "+" + demoXpEarned + " XP Dicuba";
    }

    const statusHead = isRight
      ? "<strong>Jawapan Tepat! (+100 XP)</strong> — Beginilah kepantasan semakan sebenar di dalam eTutor.my:"
      : "<strong>Kurang Tepat — Jom Semak Skema Sebenar:</strong> Jawapan betul telah ditandakan hijau di atas.";

    expEl.className = isRight ? "lp-demo-explain" : "lp-demo-explain is-wrong-box";
    expEl.innerHTML = [
      '<div style="margin-bottom:6px">' + statusHead + "</div>",
      "<div>" + escapeHtml(q.explanation) + "</div>",
      '<div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px">',
      '  <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary)">Di dalam portal penuh, setiap set mengandungi 40–45 soalan lengkap analisis bab lemah.</span>',
      '  <a href="#pakej" class="btn btn-primary btn-sm">Buka Akses Penuh Sekarang</a>',
      "</div>"
    ].join("");
    expEl.hidden = false;
    if (window.ETutorMotion) window.ETutorMotion.animateDemoFeedback(expEl);
  }

  function initLandingAndOrderBindings() {
    renderLandingDemoQuestion(0);

    // Segerakkan harga pakej daripada config.js jika diubah pentadbir
    const plans = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.PRICING_PLANS) || {};
    if (plans.single && document.getElementById("lpPriceSingle")) {
      document.getElementById("lpPriceSingle").textContent = plans.single.price;
    }
    if (plans.allAccess && document.getElementById("lpPriceAll")) {
      document.getElementById("lpPriceAll").textContent = plans.allAccess.price;
    }
    if (plans.family && document.getElementById("lpPriceFamily")) {
      document.getElementById("lpPriceFamily").textContent = plans.family.price;
    }

    const orderDlg = document.getElementById("orderDialog");
    const closeOrderBtn = document.getElementById("closeOrderDialogBtn");
    const pkgSelect = document.getElementById("orderPackageSelect");
    const focusWrap = document.getElementById("orderFocusSubjectWrap");
    const focusSelect = document.getElementById("orderFocusSubjectSelect");
    const planBadge = document.getElementById("orderPlanBadge");
    const orderForm = document.getElementById("orderLeadForm");

    const syncOrderPlanBadge = function () {
      if (!pkgSelect || !planBadge) return;
      const key = pkgSelect.value || "allAccess";
      const p = plans[key];
      if (p) {
        planBadge.textContent = p.name + " — " + p.price;
      }
      if (focusWrap) {
        focusWrap.hidden = key !== "single";
      }
    };

    if (pkgSelect) {
      pkgSelect.addEventListener("change", syncOrderPlanBadge);
    }

    if (closeOrderBtn && orderDlg) {
      closeOrderBtn.addEventListener("click", function () { closeTopLayer(orderDlg); });
      orderDlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
        closeTopLayer(orderDlg);
      });
      if (typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype)) {
        orderDlg.addEventListener("click", function (ev) {
          if (ev.target !== orderDlg) return;
          const rect = orderDlg.getBoundingClientRect();
          const inside = rect.top <= ev.clientY && ev.clientY <= rect.top + rect.height && rect.left <= ev.clientX && ev.clientX <= rect.left + rect.width;
          if (!inside) closeTopLayer(orderDlg);
        });
      }
    }

    document.addEventListener("click", function (e) {
      const demoTab = e.target.closest(".lp-demo-tab");
      if (demoTab) {
        renderLandingDemoQuestion(parseInt(demoTab.getAttribute("data-demo-idx"), 10) || 0);
        return;
      }

      const demoOpt = e.target.closest(".lp-demo-opt");
      if (demoOpt) {
        handleDemoOptionSelect(parseInt(demoOpt.getAttribute("data-opt-idx"), 10) || 0);
        return;
      }

      const planBtn = e.target.closest(".js-select-plan");
      if (planBtn && orderDlg) {
        const key = planBtn.getAttribute("data-plan-key") || "allAccess";
        const directPayUrl = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.PAYMENT_URL) ? window.ETUTOR_CONFIG.PAYMENT_URL.trim() : "";
        if (directPayUrl) {
          window.open(directPayUrl, "_blank", "noopener");
          return;
        }
        if (pkgSelect) pkgSelect.value = key;
        syncOrderPlanBadge();
        orderDlg.showModal();
        return;
      }

      const gotoLogin = e.target.closest(".js-goto-login");
      if (gotoLogin) {
        e.preventDefault();
        window.location.hash = "#login";
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const backLanding = e.target.closest(".js-back-to-landing");
      if (backLanding) {
        e.preventDefault();
        history.pushState("", document.title, window.location.pathname + window.location.search);
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const backPricing = e.target.closest(".js-back-to-pricing");
      if (backPricing) {
        e.preventDefault();
        window.location.hash = "#pakej";
        syncRouteMode();
      }
    });

    if (orderForm) {
      orderForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const studentName = document.getElementById("orderStudentName").value.trim();
        const phone = document.getElementById("orderPhoneInput").value.trim();
        const key = (pkgSelect && pkgSelect.value) || "allAccess";
        if (!studentName || phone.length < 7) {
          orderForm.reportValidity();
          return;
        }
        const p = plans[key] || { name: "Pas Penuh Semua Subjek SPM", price: "RM 59" };
        const chosenFocusSubject = (key === "single" && focusSelect && focusSelect.value)
          ? focusSelect.value.trim()
          : "";
        const packageLabel = chosenFocusSubject
          ? p.name + " — Subjek: " + chosenFocusSubject + " (" + p.price + ")"
          : p.name + " (" + p.price + ")";

        const msgLines = [
          "Salam Admin eTutor.my, saya berminat untuk mengaktifkan akses portal:",
          "",
          "Nama Pelajar: " + studentName,
          "No. Telefon (ID): " + phone,
          "Pakej Pilihan: " + packageLabel,
          "",
          "Mohon kongsikan maklumat pembayaran untuk pengaktifan Kod PIN. Terima kasih!"
        ].join("\n");

        const rawWa = ((window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.SALES_WHATSAPP) || "60137327696").replace(/\D/g, "");
        const waUrl = "https://wa.me/" + (rawWa || "60137327696") + "?text=" + encodeURIComponent(msgLines);

        try { await navigator.clipboard.writeText(msgLines); } catch (err) {}
        await closeTopLayer(orderDlg);
        window.open(waUrl, "_blank", "noopener");
        showToast("Membuka WhatsApp Admin (013-732 7696)...");
      });
    }
  }

  // ==========================================================================
  // PANEL KAWALAN ADMIN (#admin) & PENGHALAAN PAPARAN (#landing / #login / #admin)
  // ==========================================================================
  function isHashAdmin() {
    return window.location.hash.toLowerCase() === "#admin";
  }

  function isHashLogin() {
    return window.location.hash.toLowerCase() === "#login";
  }

  async function syncRouteMode() {
    const landingView = document.getElementById("landingView");
    const adminView = document.getElementById("adminView");
    const loginView = document.getElementById("loginView");
    const dashboardView = document.getElementById("dashboardView");
    const examStage = document.getElementById("examStage");
    if (!adminView) return;

    if (isHashAdmin()) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = true;
      dashboardView.hidden = true;
      examStage.hidden = true;
      adminView.hidden = false;

      let savedAdminTok = portalState.adminToken;
      if (!savedAdminTok) {
        try {
          savedAdminTok = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) || "";
        } catch (e) {}
      }

      if (savedAdminTok) {
        portalState.adminToken = savedAdminTok;
        try {
          const res = await callBackend("adminDashboard", { adminToken: savedAdminTok });
          if (res && res.ok) {
            document.getElementById("adminLoginShell").hidden = true;
            document.getElementById("adminDashboardShell").hidden = false;
            applyAdminBundle(res);
            return;
          }
        } catch (e) {}
      }

      portalState.adminToken = "";
      document.getElementById("adminDashboardShell").hidden = true;
      document.getElementById("adminLoginShell").hidden = false;
      return;
    }

    adminView.hidden = true;
    if (portalState.sessionToken && portalState.user) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = true;
      dashboardView.hidden = false;
      return;
    }

    dashboardView.hidden = true;
    if (isHashLogin()) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = false;
      if (window.ETutorMotion) window.ETutorMotion.playLoginEntrance();
    } else {
      loginView.hidden = true;
      if (landingElExists(landingView)) {
        landingView.hidden = false;
        const hashId = window.location.hash ? window.location.hash.slice(1) : "";
        if (hashId) {
          const targetSec = document.getElementById(hashId);
          if (targetSec) {
            setTimeout(function () { targetSec.scrollIntoView(); }, 30);
          }
        }
      }
    }
  }

  function landingElExists(el) {
    return Boolean(el);
  }

  const ADMIN_PRESET_SUBJECTS = {
    TERAS: ["Bahasa Melayu", "Bahasa Inggeris", "Sejarah", "Matematik", "Sains", "Pendidikan Islam", "Pendidikan Moral"],
    SAINS_TULEN: ["Biologi", "Fizik", "Kimia", "Matematik Tambahan"],
    IKHTISAS: ["Prinsip Perakaunan", "Perniagaan", "Ekonomi", "Sains Komputer", "Geografi", "Tasawwur Islam"]
  };

  function getMergedSubjectOptions() {
    const defaults = (window.ETUTOR_CONFIG && Array.isArray(window.ETUTOR_CONFIG.DEFAULT_SUBJECTS))
      ? window.ETUTOR_CONFIG.DEFAULT_SUBJECTS
      : ["Bahasa Melayu", "Bahasa Inggeris", "Sejarah", "Matematik", "Sains", "Pendidikan Islam", "Pendidikan Moral", "Prinsip Perakaunan", "Perniagaan", "Sains Komputer", "Geografi", "Tasawwur Islam", "Biologi", "Fizik"];
    const dynamicSubs = (portalState.adminData && Array.isArray(portalState.adminData.availableSubjects))
      ? portalState.adminData.availableSubjects
      : [];
    const seen = new Set();
    const out = [];
    defaults.concat(dynamicSubs).forEach(function (s) {
      const clean = String(s || "").trim();
      if (!clean || clean === "Umum") return;
      const k = clean.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        out.push(clean);
      }
    });
    return out;
  }

  function renderAdminSubjectCheckboxes(selectedList) {
    const grid = document.getElementById("admSubjectPillsGrid");
    if (!grid) return;
    const selectedSet = new Set(
      (selectedList || []).map(function (s) { return String(s || "").trim().toLowerCase(); }).filter(Boolean)
    );
    const allSubjects = getMergedSubjectOptions();
    grid.textContent = "";

    allSubjects.forEach(function (subj) {
      const label = document.createElement("label");
      label.className = "adm-subject-pill";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "adm-subject-cb";
      cb.name = "admSubjectItem";
      cb.value = subj;
      cb.checked = selectedSet.has(subj.toLowerCase());
      if (cb.checked) label.classList.add("is-checked");

      const span = document.createElement("span");
      span.textContent = subj;

      label.appendChild(cb);
      label.appendChild(span);
      grid.appendChild(label);
    });
  }

  function syncAdminPackageInputFromCheckboxes() {
    const grid = document.getElementById("admSubjectPillsGrid");
    const pkgInput = document.getElementById("admPackage");
    if (!grid || !pkgInput) return;
    const picked = [];
    grid.querySelectorAll(".adm-subject-cb").forEach(function (cb) {
      const pill = cb.closest(".adm-subject-pill");
      if (pill) pill.classList.toggle("is-checked", cb.checked);
      if (cb.checked) picked.push(cb.value);
    });
    pkgInput.value = picked.join(", ");
  }

  function applyAdminPresetSelection(presetValue, customPackageRaw) {
    const presetEl = document.getElementById("admPackagePreset");
    const fieldset = document.getElementById("admSubjectFieldset");
    const pkgInput = document.getElementById("admPackage");
    const devInput = document.getElementById("admDeviceLimit");
    if (!presetEl || !fieldset || !pkgInput) return;

    presetEl.value = presetValue;

    if (presetValue === "ALL") {
      fieldset.hidden = true;
      pkgInput.value = "ALL";
      if (devInput && devInput.value === "4") devInput.value = "2";
      return;
    }

    if (presetValue === "FAMILY") {
      fieldset.hidden = true;
      pkgInput.value = "ALL";
      if (devInput) devInput.value = "4";
      return;
    }

    fieldset.hidden = false;
    if (presetValue === "TERAS" || presetValue === "SAINS_TULEN" || presetValue === "IKHTISAS") {
      const list = ADMIN_PRESET_SUBJECTS[presetValue] || [];
      renderAdminSubjectCheckboxes(list);
      syncAdminPackageInputFromCheckboxes();
      return;
    }

    // CUSTOM
    const tokens = String(customPackageRaw || "")
      .split(",")
      .map(function (t) { return t.trim(); })
      .filter(function (t) { return t && t.toUpperCase() !== "ALL"; });
    renderAdminSubjectCheckboxes(tokens);
    if (tokens.length > 0) {
      pkgInput.value = tokens.join(", ");
    } else {
      syncAdminPackageInputFromCheckboxes();
    }
  }

  function toMalaysianWhatsAppNumber(rawUserId) {
    const s = String(rawUserId || "").trim();
    if (!s || s.indexOf("@") !== -1) return "";
    const digits = s.replace(/\D/g, "");
    if (/^601\d{7,9}$/.test(digits)) return digits;
    if (/^01\d{7,9}$/.test(digits)) return "6" + digits;
    if (/^1\d{7,9}$/.test(digits)) return "60" + digits;
    return "";
  }

  function buildCustomerActivationWaText(btnEl) {
    const basePortalUrl = ((portalState.adminData && portalState.adminData.portalUrl) || window.location.origin).replace(/\/$/, "");
    const adminWaDigits = ((window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.SALES_WHATSAPP) || "60137327696").replace(/\D/g, "") || "60137327696";
    const adminWaDisplay = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.ADMIN_WHATSAPP_DISPLAY) || "013-732 7696";
    const pkgVal = btnEl.getAttribute("data-pkg") || "ALL";
    const pkgReadable = pkgVal.toUpperCase() === "ALL" ? "Semua Subjek SPM (ALL)" : pkgVal;

    return [
      "Assalamualaikum & Salam Sejahtera " + (btnEl.getAttribute("data-name") || "Pelajar") + ",",
      "",
      "Akses Portal Latihan Interaktif eTutor.my anda telah DIAKTIFKAN:",
      "URL Log Masuk: " + basePortalUrl + "/#login",
      "ID Pengguna: " + btnEl.getAttribute("data-uid"),
      "Kod PIN: " + btnEl.getAttribute("data-pin"),
      "Pakej Akses: " + pkgReadable,
      "",
      "Bantuan Sokongan Admin WhatsApp: " + adminWaDisplay + " (https://wa.me/" + adminWaDigits + ")",
      "",
      "Selamat maju jaya!"
    ].join("\n");
  }

  function applyAdminBundle(res) {
    portalState.adminData = res;
    const st = res.stats || {};
    const elTot = document.getElementById("admTotalUsers");
    const elAct = document.getElementById("admActiveUsers");
    const elBlk = document.getElementById("admBlockedUsers");
    const elScr = document.getElementById("admTotalScores");
    if (elTot) elTot.textContent = String(st.totalUsers || 0);
    if (elAct) elAct.textContent = String(st.activeUsers || 0);
    if (elBlk) elBlk.textContent = String(st.blockedOrExpiredUsers || 0);
    if (elScr) elScr.textContent = String(st.totalScoreSubmissions || 0);

    const sheetLink = document.getElementById("adminOpenSheetLink");
    if (sheetLink) {
      if (res.spreadsheetUrl) {
        sheetLink.href = res.spreadsheetUrl;
        sheetLink.hidden = false;
      } else {
        sheetLink.hidden = true;
      }
    }

    const fieldset = document.getElementById("admSubjectFieldset");
    if (fieldset && !fieldset.hidden) {
      const currentRaw = (document.getElementById("admPackage") || {}).value || "";
      const currentTokens = currentRaw.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
      renderAdminSubjectCheckboxes(currentTokens);
    } else {
      renderAdminSubjectCheckboxes([]);
    }

    renderAdminUsersTable();
    renderAdminLogsTable();
  }

  function renderAdminUsersTable() {
    const tbody = document.getElementById("adminUsersTableBody");
    if (!tbody || !portalState.adminData) return;

    const q = portalState.adminSearch.trim().toLowerCase();
    const sf = portalState.adminStatusFilter;
    const list = (portalState.adminData.users || []).filter(function (u) {
      const effectivelyActive = u.status === "AKTIF" && !u.isExpired;
      if (sf === "AKTIF" && !effectivelyActive) return false;
      if (sf === "SEKAT" && effectivelyActive) return false;
      if (q) {
        const hay = [u.userId, u.buyerName, u.aksesPakej, u.status].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px">Tiada rekod pelanggan sepadan.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (u) {
      const isOk = u.status === "AKTIF" && !u.isExpired;
      const badgeClass = isOk ? "badge-done" : "badge-progress";
      const statusLabel = u.isExpired ? "TAMAT TEMPOH" : u.status;
      const toggleLabel = u.status === "AKTIF" ? "Sekat" : "Aktifkan";
      const expText = u.expiryDate ? " (Tamat: " + escapeHtml(u.expiryDate) + ")" : " (Tiada had tarikh)";

      const isPinVisible = portalState.revealedAdminPins.has(u.userId);
      const pinDisplay = isPinVisible ? escapeHtml(u.pin || "—") : "••••••";
      const pinBtnLabel = isPinVisible ? "Tutup" : "Lihat";

      return [
        "<tr>",
        '  <th scope="row">',
        '    <div style="font-weight:700;color:var(--text-primary)">' + escapeHtml(u.buyerName || "Pelajar") + "</div>",
        '    <div class="tabular-nums" style="font-size:0.8rem;color:var(--text-muted)">' + escapeHtml(u.userId) + "</div>",
        "  </th>",
        '  <td class="tabular-nums"><div style="display:inline-flex;align-items:center;gap:6px"><code>' + pinDisplay + '</code><button type="button" class="btn btn-ghost btn-xs js-adm-toggle-pin" data-uid="' + escapeHtml(u.userId) + '" aria-label="Papar atau sembunyi PIN">' + pinBtnLabel + "</button></div></td>",
        "  <td>" + escapeHtml(u.aksesPakej || "ALL") + "</td>",
        '  <td><span class="status-badge ' + badgeClass + '">' + escapeHtml(statusLabel) + '</span><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">' + expText + "</div></td>",
        '  <td class="tabular-nums">' + u.devicesUsed + " / " + u.deviceLimit + " peranti</td>",
        '  <td class="tabular-nums" style="font-size:0.8rem;color:var(--text-secondary)">' + escapeHtml(u.lastAccess || "Belum log masuk") + "</td>",
        "  <td>",
        '    <div class="admin-row-actions">',
        '      <button type="button" class="btn btn-outline btn-xs js-adm-edit-user" data-uid="' + escapeHtml(u.userId) + '">Edit Pakej</button>',
        '      <button type="button" class="btn btn-emerald btn-xs js-adm-send-wa" data-uid="' + escapeHtml(u.userId) + '" data-name="' + escapeHtml(u.buyerName) + '" data-pin="' + escapeHtml(u.pin) + '" data-pkg="' + escapeHtml(u.aksesPakej) + '">Hantar WA</button>',
        '      <button type="button" class="btn btn-outline btn-xs js-adm-copy-wa" data-uid="' + escapeHtml(u.userId) + '" data-name="' + escapeHtml(u.buyerName) + '" data-pin="' + escapeHtml(u.pin) + '" data-pkg="' + escapeHtml(u.aksesPakej) + '">Salin WA</button>',
        '      <button type="button" class="btn btn-outline btn-xs js-adm-reset-dev" data-uid="' + escapeHtml(u.userId) + '">Reset Peranti</button>',
        '      <button type="button" class="btn btn-outline btn-xs js-adm-toggle-status" data-uid="' + escapeHtml(u.userId) + '">' + toggleLabel + "</button>",
        "    </div>",
        "  </td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function renderAdminLogsTable() {
    const tbody = document.getElementById("adminLogsTableBody");
    if (!tbody || !portalState.adminData) return;
    const logs = portalState.adminData.recentLogs || [];
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:18px">Belum ada log akses direkodkan.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.slice(0, 30).map(function (l) {
      return [
        "<tr>",
        '  <th scope="row" class="tabular-nums" style="font-size:0.8rem">' + escapeHtml(l.timestamp) + "</th>",
        '  <td class="tabular-nums">' + escapeHtml(l.userId) + "</td>",
        '  <td><span class="status-badge badge-subject">' + escapeHtml(l.eventType) + "</span></td>",
        '  <td class="tabular-nums" style="font-size:0.78rem">' + escapeHtml(l.deviceId) + "</td>",
        '  <td style="font-size:0.82rem;color:var(--text-secondary)">' + escapeHtml(l.details) + "</td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function initAdminPanelBindings() {
    window.addEventListener("hashchange", syncRouteMode);

    const exitLink = document.getElementById("exitAdminToStudentLink");
    if (exitLink) {
      exitLink.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.hash = "";
        syncRouteMode();
      });
    }

    const adminForm = document.getElementById("adminLoginForm");
    if (adminForm) {
      adminForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const keyInput = document.getElementById("adminKeyInput");
        const errBox = document.getElementById("adminLoginError");
        const errTxt = document.getElementById("adminLoginErrorText");
        const btn = document.getElementById("adminLoginBtn");

        errBox.hidden = true;
        btn.disabled = true;
        btn.textContent = "Mengesahkan...";
        try {
          const res = await callBackend("adminLogin", { adminKey: keyInput.value.trim() });
          if (!res || !res.ok) {
            errTxt.textContent = (res && res.error) || "Kunci Rahsia Admin tidak sah.";
            errBox.hidden = false;
            return;
          }
          portalState.adminToken = res.adminToken;
          try { sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, res.adminToken); } catch (e2) {}
          keyInput.value = "";
          document.getElementById("adminLoginShell").hidden = true;
          document.getElementById("adminDashboardShell").hidden = false;
          applyAdminBundle(res);
        } catch (err) {
          errTxt.textContent = "Ralat pelayan: " + err.message;
          errBox.hidden = false;
        } finally {
          btn.disabled = false;
          btn.textContent = "Buka Panel Admin";
        }
      });
    }

    const admLogout = document.getElementById("adminLogoutBtn");
    if (admLogout) {
      admLogout.addEventListener("click", function () {
        portalState.adminToken = "";
        try { sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY); } catch (e) {}
        window.location.hash = "";
        syncRouteMode();
      });
    }

    const admRefresh = document.getElementById("adminRefreshBtn");
    if (admRefresh) {
      admRefresh.addEventListener("click", async function () {
        const res = await callBackend("adminDashboard", { adminToken: portalState.adminToken });
        if (res && res.ok) {
          applyAdminBundle(res);
          showToast("Data langganan & log akses telah disegarkan.");
        }
      });
    }

    const admPresetSelect = document.getElementById("admPackagePreset");
    if (admPresetSelect) {
      admPresetSelect.addEventListener("change", function () {
        applyAdminPresetSelection(admPresetSelect.value || "ALL", "");
      });
    }

    const admPillsGrid = document.getElementById("admSubjectPillsGrid");
    if (admPillsGrid) {
      admPillsGrid.addEventListener("change", function (e) {
        if (e.target && e.target.classList.contains("adm-subject-cb")) {
          const presetEl = document.getElementById("admPackagePreset");
          if (presetEl && presetEl.value !== "CUSTOM") {
            presetEl.value = "CUSTOM";
          }
          syncAdminPackageInputFromCheckboxes();
        }
      });
    }

    const admSelectAllSubBtn = document.getElementById("admSelectAllSubBtn");
    if (admSelectAllSubBtn) {
      admSelectAllSubBtn.addEventListener("click", function () {
        renderAdminSubjectCheckboxes(getMergedSubjectOptions());
        syncAdminPackageInputFromCheckboxes();
      });
    }

    const admClearAllSubBtn = document.getElementById("admClearAllSubBtn");
    if (admClearAllSubBtn) {
      admClearAllSubBtn.addEventListener("click", function () {
        renderAdminSubjectCheckboxes([]);
        syncAdminPackageInputFromCheckboxes();
      });
    }

    const admResetFormBtn = document.getElementById("admResetFormBtn");
    if (admResetFormBtn) {
      admResetFormBtn.addEventListener("click", function () {
        const f = document.getElementById("adminUpsertForm");
        if (f) f.reset();
        document.getElementById("admDeviceLimit").value = "2";
        applyAdminPresetSelection("ALL", "");
      });
    }

    const upsertForm = document.getElementById("adminUpsertForm");
    if (upsertForm) {
      upsertForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const presetVal = (document.getElementById("admPackagePreset") || {}).value || "ALL";
        const pkgRaw = document.getElementById("admPackage").value.trim();
        if (presetVal !== "ALL" && presetVal !== "FAMILY" && !pkgRaw) {
          showToast("Sila tandakan sekurang-kurangnya satu subjek bagi pakej pilihan.");
          return;
        }

        const btn = document.getElementById("admSaveUserBtn");
        btn.disabled = true;
        try {
          const res = await callBackend("adminUpsertUser", {
            adminToken: portalState.adminToken,
            userId: document.getElementById("admUserId").value.trim(),
            buyerName: document.getElementById("admBuyerName").value.trim(),
            aksesPakej: pkgRaw || "ALL",
            deviceLimit: document.getElementById("admDeviceLimit").value,
            expiryDate: document.getElementById("admExpiry").value,
            pin: document.getElementById("admCustomPin").value.trim()
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast("Pelanggan disimpan! Kod PIN: " + res.savedPin);
            upsertForm.reset();
            document.getElementById("admDeviceLimit").value = "2";
            applyAdminPresetSelection("ALL", "");
          } else {
            showToast((res && res.error) || "Gagal menyimpan pelanggan.");
          }
        } catch (err) {
          showToast("Ralat: " + err.message);
        } finally {
          btn.disabled = false;
        }
      });
    }

    const admSearch = document.getElementById("adminSearchInput");
    if (admSearch) {
      admSearch.addEventListener("input", function () {
        portalState.adminSearch = admSearch.value;
        renderAdminUsersTable();
      });
    }

    const admStatus = document.getElementById("adminStatusFilter");
    if (admStatus) {
      admStatus.addEventListener("change", function () {
        portalState.adminStatusFilter = admStatus.value || "ALL";
        renderAdminUsersTable();
      });
    }

    document.addEventListener("click", async function (e) {
      const pinToggleBtn = e.target.closest(".js-adm-toggle-pin");
      if (pinToggleBtn) {
        const uid = pinToggleBtn.getAttribute("data-uid");
        if (uid) {
          if (portalState.revealedAdminPins.has(uid)) {
            portalState.revealedAdminPins.delete(uid);
          } else {
            portalState.revealedAdminPins.add(uid);
          }
          renderAdminUsersTable();
        }
        return;
      }

      const editUserBtn = e.target.closest(".js-adm-edit-user");
      if (editUserBtn && portalState.adminData) {
        const uid = editUserBtn.getAttribute("data-uid");
        const found = (portalState.adminData.users || []).find(function (u) { return u.userId === uid; });
        if (found) {
          document.getElementById("admUserId").value = found.userId || "";
          document.getElementById("admBuyerName").value = found.buyerName || "";
          document.getElementById("admDeviceLimit").value = String(found.deviceLimit || 2);
          document.getElementById("admExpiry").value = found.expiryDate || "";
          document.getElementById("admCustomPin").value = found.pin || "";

          const rawPkg = String(found.aksesPakej || "ALL").trim();
          if (!rawPkg || rawPkg.toUpperCase() === "ALL") {
            applyAdminPresetSelection((found.deviceLimit || 2) >= 4 ? "FAMILY" : "ALL", "ALL");
          } else {
            applyAdminPresetSelection("CUSTOM", rawPkg);
          }

          const addHeading = document.getElementById("adminAddHeading");
          if (addHeading) addHeading.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast("Rekod " + found.buyerName + " dimuatkan ke borang untuk dikemas kini.");
        }
        return;
      }

      const sendWaBtn = e.target.closest(".js-adm-send-wa");
      if (sendWaBtn) {
        const msg = buildCustomerActivationWaText(sendWaBtn);
        const buyerWa = toMalaysianWhatsAppNumber(sendWaBtn.getAttribute("data-uid"));
        const targetWaUrl = buyerWa
          ? "https://wa.me/" + buyerWa + "?text=" + encodeURIComponent(msg)
          : "https://wa.me/?text=" + encodeURIComponent(msg);
        try { await navigator.clipboard.writeText(msg); } catch {}
        window.open(targetWaUrl, "_blank", "noopener");
        showToast(buyerWa ? "Membuka WhatsApp terus kepada pelanggan..." : "Mesej disalin & membuka WhatsApp...");
        return;
      }

      const waBtn = e.target.closest(".js-adm-copy-wa");
      if (waBtn) {
        const msg = buildCustomerActivationWaText(waBtn);
        try {
          await navigator.clipboard.writeText(msg);
          showToast("Mesej WhatsApp akses (lengkap No. Admin 013-732 7696) berjaya disalin!");
        } catch {
          showToast("PIN Pelanggan: " + waBtn.getAttribute("data-pin"));
        }
        return;
      }

      const resetBtn = e.target.closest(".js-adm-reset-dev");
      if (resetBtn) {
        const uid = resetBtn.getAttribute("data-uid");
        const res = await callBackend("adminResetDevices", { adminToken: portalState.adminToken, userId: uid });
        if (res && res.ok) {
          applyAdminBundle(res);
          showToast("Senarai peranti untuk " + uid + " telah dikosongkan.");
        }
        return;
      }

      const toggleBtn = e.target.closest(".js-adm-toggle-status");
      if (toggleBtn) {
        const uid = toggleBtn.getAttribute("data-uid");
        const res = await callBackend("adminToggleStatus", { adminToken: portalState.adminToken, userId: uid });
        if (res && res.ok) {
          applyAdminBundle(res);
          showToast("Status langganan " + uid + " telah dikemas kini.");
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    bindEvents();
    if (isHashAdmin()) {
      syncRouteMode();
      return;
    }
    const restored = await tryRestoreExistingSession();
    if (!restored) {
      syncRouteMode();
      if (!isHashLogin() && window.ETutorMotion) {
        window.ETutorMotion.playLandingEntrance();
      }
    }
  });
})();
