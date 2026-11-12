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
  const OPEN_PROGRESS_STORAGE_KEY = "etutor_open_progress_v1";
  const OPEN_SCORES_STORAGE_KEY = "etutor_open_scores_v1";
  const OPEN_STUDENT_NAME_KEY = "etutor_open_student_name_v1";
  const OPEN_MODE_OVERRIDE_KEY = "etutor_open_mode_override_v1";

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
    klonSelectedSubject: "ALL",
    klonSelectedStatus: "ALL",
    klonSearchQuery: "",
    lpKlonFilter: "ALL",
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
    revealedAdminPins: new Set(),
    openPortalActive: false,
    rawOpenCatalog: [],
    rawServerLeaderboard: null,
    deepLinkHandled: false
  };

  function isOpenAccessMode() {
    try {
      const ov = sessionStorage.getItem(OPEN_MODE_OVERRIDE_KEY);
      if (ov === "1") return true;
      if (ov === "0") return false;
    } catch (e) {}
    return Boolean(window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.OPEN_ACCESS_MODE);
  }

  function setOpenAccessOverride(enabled) {
    try {
      sessionStorage.setItem(OPEN_MODE_OVERRIDE_KEY, enabled ? "1" : "0");
    } catch (e) {}
    syncOpenAccessDom();
  }

  function syncOpenAccessDom() {
    const open = isOpenAccessMode();
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-open-access", open ? "true" : "false");
      document.querySelectorAll("[data-paid-only]").forEach(function (el) {
        el.hidden = open;
      });
      document.querySelectorAll("[data-open-only]").forEach(function (el) {
        el.hidden = !open;
      });
    }
    renderHeaderUser();
  }

  function getOpenStudentName() {
    try {
      return String(localStorage.getItem(OPEN_STUDENT_NAME_KEY) || "").trim().slice(0, 80);
    } catch (e) {
      return "";
    }
  }

  function setOpenStudentName(name) {
    const clean = String(name || "").trim().slice(0, 80);
    try {
      if (clean) localStorage.setItem(OPEN_STUDENT_NAME_KEY, clean);
      else localStorage.removeItem(OPEN_STUDENT_NAME_KEY);
    } catch (e) {}
    return clean;
  }

  function loadOpenProgressMap() {
    try {
      const raw = localStorage.getItem(OPEN_PROGRESS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveOpenProgressMap(mapObj) {
    try {
      localStorage.setItem(OPEN_PROGRESS_STORAGE_KEY, JSON.stringify(mapObj || {}));
    } catch (e) {}
  }

  function loadOpenScoresList() {
    try {
      const raw = localStorage.getItem(OPEN_SCORES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveOpenScoresList(listArr) {
    try {
      localStorage.setItem(OPEN_SCORES_STORAGE_KEY, JSON.stringify(Array.isArray(listArr) ? listArr.slice(-250) : []));
    } catch (e) {}
  }

  function computeLocalSpmGrade(pct, hasData) {
    if (!hasData) return "—";
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "A-";
    if (pct >= 65) return "B+";
    if (pct >= 60) return "B";
    if (pct >= 55) return "C+";
    if (pct >= 50) return "C";
    if (pct >= 45) return "D";
    if (pct >= 40) return "E";
    return "G";
  }

  function formatLocalDateOnly(d) {
    const dt = d instanceof Date ? d : new Date();
    const pad = function (n) { return String(n).padStart(2, "0"); };
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  }

  function calculateLocalStreakDays(dateMap) {
    let streak = 0;
    const now = new Date();
    for (let d = 0; d < 365; d++) {
      const check = new Date(now.getTime() - d * 86400000);
      const key = formatLocalDateOnly(check);
      if (dateMap[key]) {
        streak++;
      } else if (d === 0) {
        continue;
      } else {
        break;
      }
    }
    return streak;
  }

  function buildOpenDashboardBundle(rawCatalog, serverLb) {
    const files = Array.isArray(rawCatalog) ? rawCatalog : [];
    const progMap = loadOpenProgressMap();
    const scores = loadOpenScoresList();
    const customName = getOpenStudentName() || "Pelajar";

    const bestByFile = {};
    const dateMap = {};
    const weakCounter = {};

    scores.forEach(function (s) {
      if (!s || !s.fileId) return;
      const pct = Math.max(0, Math.min(100, Number(s.percentage) || 0));
      if (s.dateOnly) dateMap[s.dateOnly] = true;
      if (!bestByFile[s.fileId] || pct >= bestByFile[s.fileId].percentage) {
        bestByFile[s.fileId] = {
          fileId: s.fileId,
          quizTitle: s.quizTitle || "",
          subject: s.subject || "",
          scoreText: s.scoreText || (pct + "%"),
          percentage: pct,
          grade: s.grade || computeLocalSpmGrade(pct, true),
          completedAt: s.completedAt || ""
        };
      }
      if (Array.isArray(s.weakTopics)) {
        s.weakTopics.forEach(function (w) {
          if (!w || !w.topic) return;
          if (!weakCounter[w.topic]) weakCounter[w.topic] = { topic: w.topic, count: 0, lowestPct: 100 };
          weakCounter[w.topic].count++;
          if (typeof w.percentage === "number" && w.percentage < weakCounter[w.topic].lowestPct) {
            weakCounter[w.topic].lowestPct = w.percentage;
          }
        });
      }
    });

    const fileIdSet = new Set(files.map(function (f) { return f.fileId; }));
    const fileByTitle = {};
    files.forEach(function (f) {
      if (f && f.cleanTitle) {
        fileByTitle[String(f.cleanTitle).trim().toLowerCase()] = f;
      }
    });

    let progMapChanged = false;
    Object.keys(progMap).forEach(function (fid) {
      const p = progMap[fid];
      if (!p) return;
      if (!fileIdSet.has(fid) && p.quizTitle) {
        const matched = fileByTitle[String(p.quizTitle).trim().toLowerCase()];
        if (matched && matched.fileId) {
          p.fileId = matched.fileId;
          progMap[matched.fileId] = p;
          delete progMap[fid];
          progMapChanged = true;
        }
      }
    });
    if (progMapChanged) {
      saveOpenProgressMap(progMap);
    }

    const inProgressList = Object.keys(progMap)
      .map(function (fid) {
        const p = progMap[fid];
        if (!p || !p.fileId) return null;
        return {
          updatedAt: p.updatedAt || "Sebentar tadi",
          fileId: p.fileId,
          quizTitle: p.quizTitle || "Set Latihan Interaktif",
          subject: p.subject || "SPM",
          answeredCount: Math.max(0, Number(p.answeredCount) || 0),
          totalQuestions: Math.max(1, Number(p.totalQuestions) || 45),
          timeRemaining: p.timeRemaining !== undefined ? p.timeRemaining : null
        };
      })
      .filter(Boolean);

    const subMap = {};
    let completedSets = 0;
    let sumBestPct = 0;
    let totalXp = 0;

    const enrichedCatalog = files.map(function (f) {
      const best = bestByFile[f.fileId] || null;
      const prog = progMap[f.fileId] || null;
      const subName = f.subject || "Umum";
      if (!subMap[subName]) subMap[subName] = { subject: subName, total: 0, completed: 0 };
      subMap[subName].total++;
      if (best) {
        completedSets++;
        subMap[subName].completed++;
        sumBestPct += best.percentage;
        totalXp += Math.round(best.percentage * 10) + 50;
      }
      return Object.assign({}, f, {
        bestScore: best,
        inProgress: prog ? {
          updatedAt: prog.updatedAt || "Sebentar tadi",
          fileId: prog.fileId,
          quizTitle: prog.quizTitle,
          subject: prog.subject,
          answeredCount: prog.answeredCount,
          totalQuestions: prog.totalQuestions,
          timeRemaining: prog.timeRemaining
        } : null,
        status: prog ? "in_progress" : (best ? "completed" : "not_started")
      });
    });

    const avgScore = completedSets > 0 ? Math.round(sumBestPct / completedSets) : 0;
    const completionPct = enrichedCatalog.length > 0 ? Math.round((completedSets / enrichedCatalog.length) * 100) : 0;
    const subjectBreakdown = Object.keys(subMap)
      .map(function (k) {
        const st = subMap[k];
        return {
          subject: st.subject,
          completed: st.completed,
          total: st.total,
          percentage: st.total > 0 ? Math.round((st.completed / st.total) * 100) : 0
        };
      })
      .sort(function (a, b) { return b.total - a.total; });

    const weakTopics = Object.keys(weakCounter)
      .map(function (k) { return weakCounter[k]; })
      .sort(function (a, b) { return a.lowestPct - b.lowestPct || b.count - a.count; })
      .slice(0, 4);

    // Kira kedudukan tempatan pelajar ("Anda") dan gabungkan bersama papan pendahulu pelayan
    const subFilterNorm = String(portalState.lbSubject || "ALL").trim().toLowerCase();
    const isWeekly = portalState.lbPeriod === "weekly";
    const sevenDaysMs = 7 * 24 * 3600 * 1000;
    const myLbBest = {};
    scores.forEach(function (s) {
      if (!s || !s.fileId) return;
      if (isWeekly && s.completedMs && (Date.now() - Number(s.completedMs)) > sevenDaysMs) return;
      const sSub = String(s.subject || "").trim().toLowerCase();
      if (subFilterNorm && subFilterNorm !== "all" && sSub !== subFilterNorm) return;
      const pct = Math.max(0, Math.min(100, Number(s.percentage) || 0));
      if (!myLbBest[s.fileId] || pct > myLbBest[s.fileId]) myLbBest[s.fileId] = pct;
    });

    const myLbFids = Object.keys(myLbBest);
    let myLbXp = 0;
    let myLbSum = 0;
    myLbFids.forEach(function (fid) {
      myLbSum += myLbBest[fid];
      myLbXp += Math.round(myLbBest[fid] * 10) + 50;
    });
    const myLbAvg = myLbFids.length > 0 ? Math.round(myLbSum / myLbFids.length) : 0;

    const baseEntries = (serverLb && Array.isArray(serverLb.entries))
      ? serverLb.entries.map(function (e) { return Object.assign({}, e, { isCurrentUser: false }); })
      : [];

    if (myLbFids.length > 0) {
      baseEntries.push({
        isCurrentUser: true,
        displayName: customName,
        setsCompleted: myLbFids.length,
        averageScore: myLbAvg,
        grade: computeLocalSpmGrade(myLbAvg, true),
        xp: myLbXp
      });
    }

    baseEntries.sort(function (a, b) {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      return b.setsCompleted - a.setsCompleted;
    });
    baseEntries.forEach(function (item, i) { item.rank = i + 1; });

    const meRow = baseEntries.find(function (b) { return b.isCurrentUser; }) || null;
    const totalPart = Math.max(baseEntries.length, (serverLb && serverLb.totalParticipants) || 0);

    return {
      user: {
        userId: "PELAJAR",
        buyerName: customName,
        aksesPakej: "ALL"
      },
      catalog: enrichedCatalog,
      inProgress: inProgressList,
      progressSummary: {
        totalSets: enrichedCatalog.length,
        completedSets: completedSets,
        inProgressSets: inProgressList.length,
        completionPercentage: completionPct,
        averageScore: avgScore,
        averageGrade: computeLocalSpmGrade(avgScore, completedSets > 0),
        totalXp: totalXp,
        streakDays: calculateLocalStreakDays(dateMap),
        subjectBreakdown: subjectBreakdown,
        weakTopics: weakTopics
      },
      leaderboard: {
        period: portalState.lbPeriod,
        subject: portalState.lbSubject,
        totalParticipants: totalPart,
        entries: baseEntries.slice(0, 10),
        myStanding: {
          rank: meRow ? meRow.rank : null,
          totalParticipants: totalPart,
          isCurrentUser: true,
          displayName: customName,
          setsCompleted: myLbFids.length,
          averageScore: myLbAvg,
          grade: computeLocalSpmGrade(myLbAvg, myLbFids.length > 0),
          xp: myLbXp
        }
      }
    };
  }

  async function enterOpenPortal(forceRefresh) {
    if (!isOpenAccessMode()) {
      window.location.hash = "#login";
      syncRouteMode();
      return;
    }

    portalState.openPortalActive = true;
    const landingView = document.getElementById("landingView");
    const loginView = document.getElementById("loginView");
    const adminView = document.getElementById("adminView");
    const dashboardView = document.getElementById("dashboardView");

    if (landingView) landingView.hidden = true;
    if (loginView) loginView.hidden = true;
    if (adminView) adminView.hidden = true;
    if (dashboardView) dashboardView.hidden = false;

    const grid = document.getElementById("catalogCardsGrid");
    const klonGrid = document.getElementById("klonCatalogCardsGrid");
    if ((portalState.rawOpenCatalog.length === 0 || forceRefresh) && portalState.rawOpenCatalog.length === 0) {
      if (grid) {
        grid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:32px">Memuatkan Bank Set Soalan Interaktif...</div>';
      }
      if (klonGrid) {
        klonGrid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:32px">Memuatkan Set Soalan Klon SPM Interaktif...</div>';
      }
    }

    if (portalState.rawOpenCatalog.length === 0 || forceRefresh) {
      try {
        const res = await callBackend("publicDashboard", { forceRefresh: Boolean(forceRefresh) });
        if (res && res.openAccessDisabled) {
          portalState.openPortalActive = false;
          setOpenAccessOverride(false);
          window.location.hash = "#login";
          syncRouteMode();
          showToast("Portal kini beroperasi dalam mod akses berdaftar.");
          return;
        }
        if (res && res.ok) {
          portalState.rawOpenCatalog = Array.isArray(res.catalog) ? res.catalog : [];
          portalState.rawServerLeaderboard = res.leaderboard || null;
        } else if (res && res.error) {
          showToast(res.error);
        }
      } catch (err) {
        showToast("Gagal memuatkan senarai bank soalan: " + err.message);
      }
    }

    const bundle = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard);
    applyDashboardBundle(bundle);
    maybeAutoPull();
  }

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
    const endpoint = isLocalPreview ? "/api" : (cfgUrl || "/api");

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
    populateKlonSubjectChips();
    renderLeaderboardSection();
    renderKlonCatalogSection();
    renderCatalogSection();
    syncLandingKlonCountBadge();

    if (window.ETutorMotion) {
      window.ETutorMotion.playDashboardEntrance();
      window.ETutorMotion.animateProgressCounters(portalState.progressSummary);
    }

    applyDeepLinkParamsOnce();
  }

  function syncLandingKlonCountBadge() {
    const badge = document.getElementById("lpKlonTotalBadge");
    if (!badge) return;
    const klonCount = (portalState.catalog || []).filter(function (c) { return c.category === "klon"; }).length;
    if (klonCount > 0) {
      badge.textContent = klonCount + " Set Klon SPM Interaktif";
    }
  }

  function hasDeepLinkPortalParams() {
    try {
      if (!window.location || !window.location.search) return false;
      const params = new URLSearchParams(window.location.search);
      return Boolean(
        (params.get("set") || "").trim() ||
        (params.get("klon") || "").trim() ||
        (params.get("klonSubject") || "").trim() ||
        (params.get("subject") || "").trim() ||
        (params.get("q") || "").trim()
      );
    } catch (e) {
      return false;
    }
  }

  function applyDeepLinkParamsOnce() {
    if (portalState.deepLinkHandled) return;
    const list = portalState.catalog || [];
    if (list.length === 0) return;

    let params;
    try {
      params = new URLSearchParams(window.location.search || "");
    } catch (e) {
      portalState.deepLinkHandled = true;
      return;
    }

    const setParam = (params.get("set") || "").trim();
    const klonParam = (params.get("klon") || "").trim();
    const klonSubParam = (params.get("klonSubject") || "").trim();
    const subParam = (params.get("subject") || "").trim();
    const qParam = (params.get("q") || "").trim();
    const autoOpen = params.get("open") === "1" || params.get("open") === "true";
    const wantsKlonScroll = window.location.hash.toLowerCase() === "#klon-portal" || Boolean(klonParam) || Boolean(klonSubParam);

    portalState.deepLinkHandled = true;
    if (!setParam && !klonParam && !klonSubParam && !subParam && !qParam && !wantsKlonScroll) return;

    if (klonSubParam) {
      const targetKlonNorm = klonSubParam.toLowerCase();
      const matchedKlonSub = list
        .filter(function (c) { return c.category === "klon"; })
        .map(function (c) { return c.subject; })
        .find(function (s) { return String(s || "").trim().toLowerCase() === targetKlonNorm; });
      if (matchedKlonSub) {
        portalState.klonSelectedSubject = matchedKlonSub;
        populateKlonSubjectChips();
      }
    }

    if (subParam) {
      const targetNorm = subParam.toLowerCase();
      const matchedSub = list
        .filter(function (c) { return c.category !== "klon"; })
        .map(function (c) { return c.subject; })
        .find(function (s) {
          return String(s || "").trim().toLowerCase() === targetNorm;
        });
      if (matchedSub) {
        portalState.selectedSubject = matchedSub;
        populateSubjectSelectors();
      }
    }

    if (qParam) {
      portalState.searchQuery = qParam;
      const searchEl = document.getElementById("catalogSearchInput");
      if (searchEl) searchEl.value = qParam;
    }

    let matchedSetItem = null;
    if (klonParam) {
      const kDigits = klonParam.replace(/\D/g, "");
      const kCodeNorm = kDigits ? ("KLON " + kDigits.padStart(2, "0")) : klonParam.toUpperCase();
      matchedSetItem = list.find(function (c) {
        return c.category === "klon" && String(c.setCode || "").toUpperCase() === kCodeNorm;
      }) || list.find(function (c) {
        return c.category === "klon" && String(c.cleanTitle || "").toLowerCase().indexOf(klonParam.toLowerCase()) !== -1;
      }) || null;

      if (!autoOpen) {
        const kFilterText = matchedSetItem && matchedSetItem.setCode ? matchedSetItem.setCode : klonParam;
        portalState.klonSearchQuery = kFilterText;
        const klonSearchEl = document.getElementById("klonSearchInput");
        if (klonSearchEl) klonSearchEl.value = kFilterText;
      }
    } else if (setParam) {
      const digits = setParam.replace(/\D/g, "");
      const codeNorm = digits ? ("SET " + digits.padStart(2, "0")) : setParam.toUpperCase();
      matchedSetItem = list.find(function (c) {
        return c.category !== "klon" && String(c.setCode || "").toUpperCase() === codeNorm;
      }) || list.find(function (c) {
        return String(c.setCode || "").toUpperCase() === codeNorm;
      }) || list.find(function (c) {
        return String(c.cleanTitle || "").toLowerCase().indexOf(setParam.toLowerCase()) !== -1;
      }) || null;

      if (!autoOpen) {
        const filterText = matchedSetItem && matchedSetItem.setCode ? matchedSetItem.setCode : setParam;
        portalState.searchQuery = filterText;
        const searchEl2 = document.getElementById("catalogSearchInput");
        if (searchEl2) searchEl2.value = filterText;
      }
    }

    renderKlonCatalogSection();
    renderCatalogSection();

    try {
      history.replaceState(null, "", window.location.pathname + (wantsKlonScroll ? "#klon-portal" : "#portal"));
    } catch (e) {}

    if (matchedSetItem && autoOpen) {
      openQuizSet(matchedSetItem.fileId, Boolean(matchedSetItem.inProgress), false);
    } else {
      const targetHead = document.getElementById(wantsKlonScroll ? "klonCatalogHeading" : "catalogHeading");
      if (targetHead) {
        setTimeout(function () { targetHead.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
    }
  }

  function renderHeaderUser() {
    const isOpenGuest = !portalState.sessionToken && isOpenAccessMode();
    const u = portalState.user || {};
    const nameEl = document.getElementById("navBuyerName");
    const pkgEl = document.getElementById("navPackageBadge");
    if (isOpenGuest) {
      if (nameEl) {
        const lnk = getSyncLink();
        nameEl.textContent = getOpenStudentName() || (lnk && lnk.email ? lnk.email.split("@")[0] : "Log Masuk");
      }
      if (pkgEl) pkgEl.textContent = "Portal Latihan Interaktif";
    } else {
      if (nameEl) nameEl.textContent = u.buyerName || "Pelajar";
      if (pkgEl) pkgEl.textContent = "Pakej: " + (u.aksesPakej || "ALL");
    }
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
    const harianSubjects = [];
    const seenHarian = {};
    const allSubjects = [];
    const seenAll = {};

    (portalState.catalog || []).forEach(function (c) {
      if (c.subject && !seenAll[c.subject]) {
        seenAll[c.subject] = true;
        allSubjects.push(c.subject);
      }
      if (c.category !== "klon" && c.subject && !seenHarian[c.subject]) {
        seenHarian[c.subject] = true;
        harianSubjects.push(c.subject);
      }
    });
    harianSubjects.sort();
    allSubjects.sort();

    // Cip Subjek Katalog Harian
    const chipRow = document.getElementById("subjectChipsRow");
    if (chipRow) {
      const allOpts = ["ALL"].concat(harianSubjects);
      chipRow.innerHTML = allOpts.map(function (sub) {
        const active = portalState.selectedSubject === sub;
        const label = sub === "ALL" ? "Semua Subjek" : sub;
        return '<button type="button" class="tab-chip js-subject-chip" data-subject="' + escapeHtml(sub) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
      }).join("");
    }

    // Dropdown Subjek Leaderboard (merangkumi semua subjek Harian + Klon)
    const lbSelect = document.getElementById("lbSubjectSelect");
    if (lbSelect) {
      const prev = portalState.lbSubject || "ALL";
      lbSelect.innerHTML = ['<option value="ALL">Semua Subjek</option>']
        .concat(allSubjects.map(function (s) {
          return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
        }))
        .join("");
      lbSelect.value = seenAll[prev] ? prev : "ALL";
    }
  }

  function populateKlonSubjectChips() {
    const klonSubjects = [];
    const seen = {};
    (portalState.catalog || []).forEach(function (c) {
      if (c.category === "klon" && c.subject && !seen[c.subject]) {
        seen[c.subject] = true;
        klonSubjects.push(c.subject);
      }
    });
    klonSubjects.sort();

    if (portalState.klonSelectedSubject !== "ALL" && !seen[portalState.klonSelectedSubject]) {
      portalState.klonSelectedSubject = "ALL";
    }

    const chipRow = document.getElementById("klonSubjectChipsRow");
    if (chipRow) {
      const allOpts = ["ALL"].concat(klonSubjects);
      chipRow.innerHTML = allOpts.map(function (sub) {
        const active = portalState.klonSelectedSubject === sub;
        const label = sub === "ALL" ? "Semua Subjek" : sub;
        return '<button type="button" class="tab-chip js-klon-subject-chip" data-subject="' + escapeHtml(sub) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
      }).join("");
    }
  }

  function renderQuizCardMarkup_(item, isKlon) {
    let statusBadgeHtml = '<span class="status-badge badge-new">Belum Jawab</span>';
    let primaryBtnLabel = isKlon ? "Jawab Klon" : "Mula Latihan";
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

    const leadBadgeHtml = isKlon
      ? '<span class="badge-klon">' + ICONS.sparkles + ' ' + escapeHtml(item.setCode || "KLON SPM") + '</span><span class="status-badge badge-subject">' + escapeHtml(item.subject) + '</span>'
      : '<span class="status-badge badge-subject">' + ICONS.book + ' ' + escapeHtml(item.subject) + '</span>';

    return [
      '<article class="quiz-card">',
      '  <div>',
      '    <div class="quiz-card-badges">',
             leadBadgeHtml,
             statusBadgeHtml,
      '    </div>',
      '    <h3 class="quiz-card-title">' + escapeHtml(item.cleanTitle) + '</h3>',
      '    <div class="quiz-card-meta">',
      (!isKlon && item.setCode ? '<span>' + escapeHtml(item.setCode) + '</span>' : ''),
      (item.stateOrSource ? '<span>' + (!isKlon && item.setCode ? '• ' : '') + escapeHtml(item.stateOrSource) + '</span>' : ''),
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
  }

  // 4A. SEKSYEN SET SOALAN KLON SPM INTERAKTIF
  function renderKlonCatalogSection() {
    const sec = document.getElementById("klonCatalogSection");
    const grid = document.getElementById("klonCatalogCardsGrid");
    const countLabel = document.getElementById("klonCatalogCountLabel");
    if (!sec || !grid) return;

    const allKlon = (portalState.catalog || [])
      .filter(function (item) { return item.category === "klon"; })
      .slice()
      .sort(function (a, b) {
        return (Number(a.setNumber) || 999) - (Number(b.setNumber) || 999) || String(a.cleanTitle || "").localeCompare(String(b.cleanTitle || ""));
      });

    if (allKlon.length === 0) {
      sec.hidden = true;
      grid.innerHTML = "";
      return;
    }

    sec.hidden = false;
    const q = portalState.klonSearchQuery.trim().toLowerCase();
    const filtered = allKlon.filter(function (item) {
      if (portalState.klonSelectedSubject !== "ALL" && item.subject !== portalState.klonSelectedSubject) {
        return false;
      }
      if (portalState.klonSelectedStatus !== "ALL" && item.status !== portalState.klonSelectedStatus) {
        return false;
      }
      if (q) {
        const hay = [item.cleanTitle, item.subject, item.level, item.stateOrSource, item.setCode, "klon"].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (countLabel) {
      countLabel.textContent = filtered.length + " set klon dipaparkan";
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:32px">Tiada set Klon SPM sepadan dengan carian atau penapis semasa.</div>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      return renderQuizCardMarkup_(item, true);
    }).join("\n");
  }

  // 4. SEKSYEN KATALOG BANK SOALAN HARIAN
  function renderCatalogSection() {
    const grid = document.getElementById("catalogCardsGrid");
    const countLabel = document.getElementById("catalogCountLabel");
    if (!grid) return;

    const q = portalState.searchQuery.trim().toLowerCase();
    const filtered = (portalState.catalog || []).filter(function (item) {
      if (item.category === "klon") {
        return false;
      }
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
      return renderQuizCardMarkup_(item, false);
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
    if (syncEl) syncEl.textContent = "Memuatkan soalan...";

    portalState.activeQuizFileId = fileId;
    portalState.latestSlipData = null;
    stage.hidden = false;
    document.body.style.overflow = "hidden";
    if (window.ETutorMotion) window.ETutorMotion.playExamStageOpen();

    const loadingSpinnerHtml = [
      '<!DOCTYPE html><html lang="ms"><head><meta charset="utf-8"><style>',
      'progress.loading-spinner:indeterminate::-webkit-progress-bar,progress.loading-spinner:indeterminate::-webkit-progress-value{display:none;background:none}',
      'progress.loading-spinner:indeterminate::-moz-progress-bar{display:none;background:none}',
      'progress.loading-spinner:indeterminate{--size:38px;--thickness:3px;--spinner-color:#2563eb;--track-color:#e2e8f0;--_used-spinner-duration:1.1s;display:inline-block;width:var(--size);height:var(--size);border-radius:50%;appearance:none;margin-bottom:14px;background:conic-gradient(from 90deg,var(--spinner-color) 158deg,transparent 0) var(--track-color);animation:progress-spin var(--_used-spinner-duration) linear infinite}',
      '@supports (background-clip: border-area){progress.loading-spinner:indeterminate{background-clip:border-area;border:var(--thickness) solid transparent;background-origin:border-box}}',
      '@supports not (background-clip: border-area){progress.loading-spinner:indeterminate{--clip-boundary:calc(100% - var(--thickness));-webkit-mask-image:radial-gradient(farthest-side,transparent var(--clip-boundary),#000 var(--clip-boundary));mask-image:radial-gradient(farthest-side,transparent var(--clip-boundary),#000 var(--clip-boundary));border:0}}',
      '@keyframes progress-spin{to{rotate:1turn}}',
      '@media (prefers-reduced-motion: reduce){progress.loading-spinner:indeterminate{--_used-spinner-duration:6s}}',
      '</style></head>',
      '<body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:92dvh;margin:0;color:#334155;background:#f8fafc">',
      '<div style="text-align:center">',
      '<progress aria-label="Memuatkan kertas soalan" class="loading-spinner"></progress>',
      '<p style="font-weight:700;font-size:1.05rem;margin:0 0 6px">Memuatkan kertas soalan...</p>',
      '<p style="font-size:0.88rem;color:#64748b;margin:0">Sila tunggu sebentar.</p>',
      '</div></body></html>'
    ].join("");

    // Elakkan isu perlumbaan OOPIF (double-srcdoc navigation abort) apabila respons API sangat pantas:
    // Hanya papar spinner jika pemuatan mengambil masa melebihi 260ms.
    let quizResolved = false;
    iframe.removeAttribute("srcdoc");
    const spinnerTimer = setTimeout(function () {
      if (!quizResolved && portalState.activeQuizFileId === fileId) {
        iframe.srcdoc = loadingSpinnerHtml;
      }
    }, 260);

    try {
      const isOpenGuest = !portalState.sessionToken && isOpenAccessMode();
      let clientSavedStateJson;
      if (isOpenGuest) {
        const progMap = loadOpenProgressMap();
        if (resetStart) {
          delete progMap[fileId];
          saveOpenProgressMap(progMap);
        } else if (autoResume && progMap[fileId] && progMap[fileId].stateJson) {
          clientSavedStateJson = progMap[fileId].stateJson;
        }
      }

      const reqBody = {
        fileId: fileId,
        quizTitle: meta ? meta.cleanTitle : "",
        autoResume: Boolean(autoResume),
        resetStart: Boolean(resetStart)
      };
      if (isOpenGuest) {
        reqBody.guestName = getOpenStudentName() || "Pelajar";
        if (clientSavedStateJson) reqBody.clientSavedStateJson = clientSavedStateJson;
      }

      const res = await callBackend("getQuizHtml", reqBody);
      quizResolved = true;
      clearTimeout(spinnerTimer);

      if (!res || !res.ok) {
        if (res && res.openAccessDisabled) {
          portalState.openPortalActive = false;
          setOpenAccessOverride(false);
          closeQuizStage();
          window.location.hash = "#login";
          syncRouteMode();
          showToast("Portal kini beroperasi dalam mod akses berdaftar.");
          return;
        }
        if (res && res.authExpired) {
          handleLogout();
        }
        showToast((res && res.error) || "Gagal memuatkan set soalan.");
        closeQuizStage();
        return;
      }

      let safeQuizHtml = String(res.html || "");
      if (safeQuizHtml && !safeQuizHtml.includes("sanitizeQuestionPlaceholders")) {
        const closeScriptTag = "<" + "/script>";
        const clientSanitizer = [
          "<script>",
          "(function(){",
          "  function cleanPlaceholders(){",
          "    try {",
          "      if (typeof SUBJECTIVE_QUESTIONS !== 'undefined' && Array.isArray(SUBJECTIVE_QUESTIONS)) {",
          "        var isEng = /bahasa\\s+inggeris|english/i.test(document.title || '');",
          "        SUBJECTIVE_QUESTIONS.forEach(function(sq){",
          "          (sq.subquestions || []).forEach(function(sub){",
          "            if (Array.isArray(sub.steps)) sub.steps.forEach(function(st){ st.placeholder = isEng ? (st.type === 'K' ? 'Enter your working / equation...' : 'Enter your final value / answer...') : (st.type === 'K' ? 'Taip langkah kiraan / persamaan anda...' : 'Taip nilai / jawapan akhir anda...'); });",
          "            if (Array.isArray(sub.slots)) sub.slots.forEach(function(sl){ sl.placeholder = isEng ? 'Type your answer here...' : 'Taipkan jawapan / huraian anda di sini...'; });",
          "            if (Array.isArray(sub.vars)) sub.vars.forEach(function(vd){ vd.placeholder = 'Taipkan jawapan anda di sini...'; });",
          "            if (Array.isArray(sub.word_bank)) sub.word_bank = [];",
          "          });",
          "        });",
          "        if (typeof renderCurrentQuestion === 'function') renderCurrentQuestion();",
          "      }",
          "    } catch(e) {}",
          "  }",
          "  cleanPlaceholders();",
          "  document.addEventListener('DOMContentLoaded', cleanPlaceholders);",
          "})();",
          closeScriptTag
        ].join("\n");
        safeQuizHtml = /<\/body>/i.test(safeQuizHtml)
          ? safeQuizHtml.replace(/<\/body>/i, clientSanitizer + "\n</body>")
          : (safeQuizHtml + "\n" + clientSanitizer);
      }
      iframe.srcdoc = safeQuizHtml;
      if (syncEl) {
        syncEl.textContent = autoResume && res.hasSavedState
          ? "Sesi terdahulu disambung automatik"
          : "Auto-simpan aktif";
      }

      if (resetStart) {
        portalState.inProgress = (portalState.inProgress || []).filter(function (p) { return p.fileId !== fileId; });
        renderContinueProgressSection();
        renderKlonCatalogSection();
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
    if (!portalState.sessionToken && isOpenAccessMode()) return;

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

    if (!portalState.sessionToken && isOpenAccessMode()) {
      applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
      return;
    }

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

    const isOpenGuest = !portalState.sessionToken && isOpenAccessMode();

    if (msg.type === "ETUTOR_PRINT_BLOCKED") {
      showToast("Cetakan kertas soalan disekat. Sila hantar kuiz dahulu untuk mencetak Slip Keputusan Rasmi.");
      return;
    }

    if (msg.type === "ETUTOR_PROGRESS_CLEARED") {
      portalState.pendingProgressPayload = null;
      if (isOpenGuest) {
        const progMap = loadOpenProgressMap();
        delete progMap[portalState.activeQuizFileId];
        saveOpenProgressMap(progMap);
      } else {
        callBackend("clearProgress", { fileId: portalState.activeQuizFileId }).catch(function () {});
      }
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
        timeRemaining: typeof msg.timeRemaining === "number" ? Math.max(0, Math.round(msg.timeRemaining)) : null,
        updatedMs: Date.now()
      };

      const others = (portalState.inProgress || []).filter(function (p) { return p.fileId !== portalState.activeQuizFileId; });
      portalState.inProgress = [itemSummary].concat(others);

      if (isOpenGuest) {
        const progMap = loadOpenProgressMap();
        progMap[portalState.activeQuizFileId] = Object.assign({}, itemSummary, {
          stateJson: String(msg.stateJson || "")
        });
        saveOpenProgressMap(progMap);
        return;
      }

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
            total: Math.max(1, Math.round(Number(w.total) || 1)),
            attempted: w.attempted === undefined ? true : Boolean(w.attempted)
          };
        });

      const resolvedName = isOpenGuest
        ? (getOpenStudentName() || "Pelajar")
        : ((portalState.user && portalState.user.buyerName) || "");

      portalState.latestSlipData = {
        fileId: portalState.activeQuizFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        buyerName: resolvedName,
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

      if (isOpenGuest) {
        const progMap = loadOpenProgressMap();
        delete progMap[portalState.activeQuizFileId];
        saveOpenProgressMap(progMap);

        const scores = loadOpenScoresList();
        scores.push({
          completedAt: new Date().toLocaleString("ms-MY"),
          completedMs: Date.now(),
          dateOnly: formatLocalDateOnly(new Date()),
          fileId: portalState.activeQuizFileId,
          quizTitle: safeTitle,
          subject: safeSubject,
          scoreText: portalState.latestSlipData.scoreText,
          percentage: pctSafe,
          grade: gradeSafe,
          weakTopics: safeWeakTopics
        });
        saveOpenScoresList(scores);
        cloudSyncAfterSubmit(portalState.activeQuizFileId);

        showToast("Tahniah! Markah " + pctSafe + "% (Gred " + gradeSafe + ") telah direkodkan.");
        applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
        return;
      }

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

    const isOpenGuest = !portalState.sessionToken && isOpenAccessMode();
    const customNameInput = document.getElementById("slipCustomNameInput");
    const savedOpenName = getOpenStudentName();
    if (customNameInput && isOpenGuest) {
      customNameInput.value = savedOpenName;
    }

    const displayStudentName = isOpenGuest
      ? (savedOpenName || data.buyerName || "Pelajar")
      : ((portalState.user && portalState.user.buyerName) || data.buyerName || "Pelajar");

    const safePct = Math.max(0, Math.min(100, Math.round(Number(data.percentage) || 0)));
    document.getElementById("slipStudentName").textContent = displayStudentName;
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
        const isAttempted = w.attempted === undefined ? true : Boolean(w.attempted);
        if (isAttempted) {
          li.style.color = "var(--status-danger, #b91c1c)";
          li.style.fontWeight = "600";
          li.textContent = String(w.topic || "Topik") + " — Penguasaan " + wPct + "% (" + wObt + "/" + wTot + ") • Perlu Ulang Kaji";
        } else {
          li.textContent = String(w.topic || "Topik") + " — Belum Dijawab (" + wObt + "/" + wTot + ")";
        }
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
    portalState.openPortalActive = false;
    try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
    document.getElementById("dashboardView").hidden = true;
    document.getElementById("examStage").hidden = true;
    document.body.style.overflow = "";
    window.location.hash = isOpenAccessMode() ? "" : "#login";
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
          if (!portalState.sessionToken && isOpenAccessMode()) {
            await enterOpenPortal(true);
            showToast("Bank soalan telah dikemas kini.");
          } else {
            const res = await callBackend("dashboard", { forceRefresh: true });
            if (res && res.ok) {
              applyDashboardBundle(res);
              showToast("Bank soalan & Leaderboard telah dikemas kini.");
            }
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

      const klonChip = e.target.closest(".js-klon-subject-chip");
      if (klonChip) {
        portalState.klonSelectedSubject = klonChip.getAttribute("data-subject") || "ALL";
        document.querySelectorAll(".js-klon-subject-chip").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === klonChip ? "true" : "false");
        });
        renderKlonCatalogSection();
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
            if (!portalState.sessionToken && isOpenAccessMode()) {
              portalState.rawServerLeaderboard = res.leaderboard;
              portalState.leaderboard = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard).leaderboard;
            } else {
              portalState.leaderboard = res.leaderboard;
            }
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
            if (!portalState.sessionToken && isOpenAccessMode()) {
              portalState.rawServerLeaderboard = res.leaderboard;
              portalState.leaderboard = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard).leaderboard;
            } else {
              portalState.leaderboard = res.leaderboard;
            }
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

    const klonSearchInput = document.getElementById("klonSearchInput");
    if (klonSearchInput) {
      klonSearchInput.addEventListener("input", function () {
        portalState.klonSearchQuery = klonSearchInput.value;
        renderKlonCatalogSection();
      });
    }

    const klonStatusSelect = document.getElementById("klonStatusSelect");
    if (klonStatusSelect) {
      klonStatusSelect.addEventListener("change", function () {
        portalState.klonSelectedStatus = klonStatusSelect.value || "ALL";
        renderKlonCatalogSection();
      });
    }

    // Exam Stage Controls & Result Slip Dialog
    const closeStageBtn = document.getElementById("closeExamStageBtn");
    if (closeStageBtn) closeStageBtn.addEventListener("click", closeQuizStage);

    const openSlipBtn = document.getElementById("openSlipBtn");
    if (openSlipBtn) openSlipBtn.addEventListener("click", openResultSlipModal);

    const printSlipBtn = document.getElementById("printSlipBtn");
    if (printSlipBtn) printSlipBtn.addEventListener("click", printOfficialSlip);

    const slipCustomNameInput = document.getElementById("slipCustomNameInput");
    if (slipCustomNameInput) {
      slipCustomNameInput.addEventListener("input", function () {
        if (portalState.sessionToken || !isOpenAccessMode()) return;
        const clean = setOpenStudentName(slipCustomNameInput.value);
        const finalName = clean || "Pelajar";
        const slipNameEl = document.getElementById("slipStudentName");
        if (slipNameEl) slipNameEl.textContent = finalName;
        if (portalState.latestSlipData) portalState.latestSlipData.buyerName = finalName;
        renderHeaderUser();
      });
    }

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

    const demoCtaHtml = isOpenAccessMode()
      ? '  <a href="#portal" class="btn btn-primary btn-sm js-enter-open-portal">Buka Bank Soalan Penuh</a>'
      : '  <a href="#pakej" class="btn btn-primary btn-sm">Buka Akses Penuh Sekarang</a>';

    expEl.className = isRight ? "lp-demo-explain" : "lp-demo-explain is-wrong-box";
    expEl.innerHTML = [
      '<div style="margin-bottom:6px">' + statusHead + "</div>",
      "<div>" + escapeHtml(q.explanation) + "</div>",
      '<div style="margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px">',
      '  <span style="font-size:0.82rem;font-weight:600;color:var(--text-secondary)">Di dalam portal penuh, setiap set mengandungi 40–45 soalan lengkap analisis bab lemah.</span>',
      demoCtaHtml,
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

      const enterOpen = e.target.closest(".js-enter-open-portal");
      if (enterOpen) {
        e.preventDefault();
        window.location.hash = "#portal";
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const lpKlonFilterBtn = e.target.closest(".js-lp-klon-filter");
      if (lpKlonFilterBtn) {
        const grp = lpKlonFilterBtn.getAttribute("data-klon-filter") || "ALL";
        portalState.lpKlonFilter = grp;
        document.querySelectorAll(".js-lp-klon-filter").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === lpKlonFilterBtn ? "true" : "false");
        });
        document.querySelectorAll("#lpKlonCardsGrid .klon-card").forEach(function (card) {
          const cardGrp = card.getAttribute("data-klon-group") || "";
          card.hidden = grp !== "ALL" && cardGrp !== grp;
        });
        return;
      }

      const gotoKlonPortal = e.target.closest(".js-goto-klon-portal");
      if (gotoKlonPortal) {
        e.preventDefault();
        window.location.hash = isOpenAccessMode() || (portalState.sessionToken && portalState.user) ? "#klon-portal" : "#login";
        syncRouteMode().then(function () {
          const klonHead = document.getElementById("klonCatalogHeading");
          if (klonHead && !document.getElementById("dashboardView").hidden) {
            setTimeout(function () { klonHead.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
          }
        });
        return;
      }

      const openKlonDirect = e.target.closest(".js-open-klon-direct");
      if (openKlonDirect && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const klonCode = (openKlonDirect.getAttribute("data-klon-code") || "").trim().toUpperCase();
        const klonSub = (openKlonDirect.getAttribute("data-klon-subject") || "").trim().toLowerCase();
        (async function () {
          if (!(portalState.sessionToken && portalState.user)) {
            if (!isOpenAccessMode()) {
              window.location.hash = "#login";
              syncRouteMode();
              window.scrollTo(0, 0);
              return;
            }
            window.location.hash = "#klon-portal";
            await enterOpenPortal(false);
          } else {
            window.location.hash = "#klon-portal";
            syncRouteMode();
          }
          const list = portalState.catalog || [];
          const found = list.find(function (c) {
            return c.category === "klon" && String(c.setCode || "").toUpperCase() === klonCode;
          }) || list.find(function (c) {
            return c.category === "klon" && String(c.subject || "").toLowerCase() === klonSub;
          });
          if (found && found.fileId) {
            openQuizSet(found.fileId, Boolean(found.inProgress), false);
          } else {
            const klonHead = document.getElementById("klonCatalogHeading");
            if (klonHead) klonHead.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        })();
        return;
      }

      const gotoLogin = e.target.closest(".js-goto-login");
      if (gotoLogin) {
        e.preventDefault();
        window.location.hash = isOpenAccessMode() ? "#portal" : "#login";
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const backLanding = e.target.closest(".js-back-to-landing");
      if (backLanding) {
        e.preventDefault();
        portalState.openPortalActive = false;
        history.pushState("", document.title, window.location.pathname);
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

  function isHashPortal() {
    const h = window.location.hash.toLowerCase();
    return h === "#portal" || h === "#klon-portal";
  }

  async function syncRouteMode() {
    syncOpenAccessDom();

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

    if (isOpenAccessMode() && (isHashPortal() || isHashLogin() || hasDeepLinkPortalParams() || portalState.openPortalActive)) {
      if (isHashLogin()) {
        history.replaceState(null, "", window.location.pathname + window.location.search + "#portal");
      }
      await enterOpenPortal(false);
      return;
    }

    if (!isOpenAccessMode() && isHashPortal()) {
      history.replaceState(null, "", window.location.pathname + window.location.search + "#login");
    }

    dashboardView.hidden = true;
    if (isHashLogin() || (!isOpenAccessMode() && isHashPortal())) {
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
          if (targetSec && !targetSec.hidden) {
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
    if (typeof res.openAccessMode === "boolean") {
      setOpenAccessOverride(res.openAccessMode);
      const modeBadge = document.getElementById("admPortalModeBadge");
      const modeDesc = document.getElementById("admPortalModeDesc");
      const modeBtn = document.getElementById("admToggleOpenModeBtn");
      if (modeBadge) {
        modeBadge.textContent = res.openAccessMode
          ? "Mod Akses Terbuka Aktif"
          : "Mod Langganan & Log Masuk PIN Aktif";
        modeBadge.className = "status-badge " + (res.openAccessMode ? "badge-done" : "badge-subject");
      }
      if (modeDesc) {
        modeDesc.textContent = res.openAccessMode
          ? "Pakej harga dan skrin log masuk ditutup buat masa ini — pelajar boleh terus masuk ke Bank Soalan. Klik butang di sebelah pada tahun hadapan apabila anda sedia mengaktifkan semula harga & log masuk PIN."
          : "Pakej harga dan pengesahan ID + Kod PIN sedang aktif sepenuhnya. Hanya pelanggan berdaftar yang mempunyai PIN sah boleh membuka set soalan.";
      }
      if (modeBtn) {
        modeBtn.textContent = res.openAccessMode
          ? "Tukar ke Mod Langganan & Log Masuk PIN"
          : "Tukar ke Mod Akses Terbuka (Tutup Harga & Login)";
        modeBtn.className = res.openAccessMode ? "btn btn-primary" : "btn btn-outline";
      }
    }
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

    const admToggleOpenBtn = document.getElementById("admToggleOpenModeBtn");
    if (admToggleOpenBtn) {
      admToggleOpenBtn.addEventListener("click", async function () {
        const currentOpen = portalState.adminData && typeof portalState.adminData.openAccessMode === "boolean"
          ? portalState.adminData.openAccessMode
          : isOpenAccessMode();
        const nextOpen = !currentOpen;
        admToggleOpenBtn.disabled = true;
        try {
          const res = await callBackend("adminSetOpenAccessMode", {
            adminToken: portalState.adminToken,
            enabled: nextOpen
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast(nextOpen
              ? "Mod Akses Terbuka diaktifkan — harga & skrin log masuk kini disembunyikan."
              : "Mod Langganan & Log Masuk PIN diaktifkan semula sepenuhnya.");
          } else {
            showToast((res && res.error) || "Gagal menukar mod operasi portal.");
          }
        } catch (err) {
          showToast("Ralat: " + err.message);
        } finally {
          admToggleOpenBtn.disabled = false;
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

  // ==========================================================================
  // CLOUD SYNC PROGRESS (Mod Akses Terbuka) — e-mel OTP / Google Sign-In
  // Simpan setempat dahulu (localStorage); hantar ke awan HANYA bila "Hantar Jawapan"
  // atau pelajar menekan "Sync Progress".
  // ==========================================================================
  const SYNC_TOKEN_KEY = "etutor_sync_token_v1";
  const SYNC_EMAIL_KEY = "etutor_sync_email_v1";
  const SYNC_LAST_KEY = "etutor_sync_last_v1";
  const syncUi = { busy: false, pulledOnce: false, otpEmail: "", gsiReady: false };

  function getSyncLink() {
    try {
      const t = localStorage.getItem(SYNC_TOKEN_KEY);
      return t ? { token: t, email: localStorage.getItem(SYNC_EMAIL_KEY) || "" } : null;
    } catch (e) { return null; }
  }

  function setSyncLink(token, email) {
    try {
      localStorage.setItem(SYNC_TOKEN_KEY, token);
      localStorage.setItem(SYNC_EMAIL_KEY, email || "");
    } catch (e) {}
  }

  function clearSyncLink() {
    try {
      localStorage.removeItem(SYNC_TOKEN_KEY);
      localStorage.removeItem(SYNC_EMAIL_KEY);
      localStorage.removeItem(SYNC_LAST_KEY);
    } catch (e) {}
  }

  function syncScoreKey(s) {
    return String(s.fileId) + "|" + String(Math.round(Number(s.completedMs) || 0));
  }

  function mergeRemoteIntoLocal(remote) {
    const localScores = loadOpenScoresList();
    const seen = {};
    localScores.forEach(function (s) { if (s && s.fileId) seen[syncScoreKey(s)] = true; });
    (Array.isArray(remote.scores) ? remote.scores : []).forEach(function (s) {
      if (!s || !s.fileId || !s.completedMs) return;
      const k = syncScoreKey(s);
      if (seen[k]) return;
      seen[k] = true;
      localScores.push(s);
    });
    localScores.sort(function (a, b) { return (a.completedMs || 0) - (b.completedMs || 0); });
    saveOpenScoresList(localScores);

    const progMap = loadOpenProgressMap();
    (Array.isArray(remote.progress) ? remote.progress : []).forEach(function (p) {
      if (!p || !p.fileId) return;
      const cur = progMap[p.fileId];
      if (!cur || (p.updatedMs || 0) > (cur.updatedMs || 0)) progMap[p.fileId] = p;
    });
    localScores.forEach(function (s) {
      const pr = progMap[s.fileId];
      if (pr && (s.completedMs || 0) >= (pr.updatedMs || 0)) delete progMap[s.fileId];
    });
    saveOpenProgressMap(progMap);

    if (remote.name && !getOpenStudentName()) setOpenStudentName(remote.name);
  }

  function refreshOpenDashboardIfIdle() {
    if (portalState.sessionToken || !isOpenAccessMode() || !portalState.openPortalActive) return;
    if (portalState.activeQuizFileId) return;
    applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
  }

  function renderSyncButton() {
    const btn = document.getElementById("syncProgressBtn");
    const link = getSyncLink();
    const landingLbl = document.querySelector("#landingLoginBtn [data-login-label]");
    if (landingLbl) landingLbl.textContent = link && link.email ? link.email.split("@")[0] : "Log Masuk";
    renderHeaderUser();
    if (!btn) return;
    const label = btn.querySelector("[data-sync-label]");
    if (label) label.textContent = link ? "Sync Progress" : "Simpan Progress";
    btn.setAttribute("data-linked", link ? "true" : "false");
    btn.title = link ? ("Disambungkan: " + link.email) : "Simpan progress ke awan supaya boleh disambung di peranti lain";
    const st = document.getElementById("syncDialogLinked");
    const form = document.getElementById("syncDialogLogin");
    if (st) st.hidden = !link;
    if (form) form.hidden = Boolean(link);
    const em = document.getElementById("syncLinkedEmail");
    if (em) em.textContent = link ? link.email : "";
    const last = document.getElementById("syncLastTime");
    if (last) {
      let t = "";
      try { t = localStorage.getItem(SYNC_LAST_KEY) || ""; } catch (e) {}
      last.textContent = t ? ("Disegerak terakhir: " + t) : "Belum pernah disegerak.";
    }
  }

  function setSyncDialogMsg(text, isError) {
    const el = document.getElementById("syncDialogMsg");
    if (!el) return;
    el.textContent = text || "";
    el.hidden = !text;
    el.setAttribute("data-error", isError ? "true" : "false");
  }

  async function syncNow(opts) {
    opts = opts || {};
    const link = getSyncLink();
    if (!link || syncUi.busy) return false;
    syncUi.busy = true;
    const btn = document.getElementById("syncProgressBtn");
    if (btn) btn.setAttribute("aria-busy", "true");
    try {
      const progMap = loadOpenProgressMap();
      const res = await callBackend("syncPush", {
        syncToken: link.token,
        name: getOpenStudentName(),
        scores: loadOpenScoresList().slice(-250),
        progress: Object.keys(progMap).map(function (k) { return progMap[k]; }),
        completedFileIds: opts.completedFileId ? [opts.completedFileId] : []
      });
      if (!res || !res.ok) {
        if (res && res.authExpired) {
          clearSyncLink();
          renderSyncButton();
          if (!opts.silent) showToast(res.error || "Sesi sync tamat. Sila sahkan e-mel semula.");
        } else if (!opts.silent) {
          showToast((res && res.error) || "Gagal menyegerak progress.");
        }
        return false;
      }
      mergeRemoteIntoLocal(res);
      try { localStorage.setItem(SYNC_LAST_KEY, res.syncedAt || new Date().toLocaleString("ms-MY")); } catch (e) {}

      if (res.newScoresAdded) {
        try {
          const lb = await callBackend("getLeaderboard", { period: portalState.lbPeriod, subject: portalState.lbSubject });
          if (lb && lb.ok) portalState.rawServerLeaderboard = lb.leaderboard;
        } catch (e) {}
      }
      refreshOpenDashboardIfIdle();
      renderSyncButton();
      if (!opts.silent) showToast("Progress berjaya disimpan ke awan.");
      return true;
    } catch (err) {
      if (!opts.silent) showToast("Tiada sambungan. Progress kekal disimpan di peranti ini.");
      return false;
    } finally {
      syncUi.busy = false;
      if (btn) btn.removeAttribute("aria-busy");
    }
  }

  async function onSyncLoggedIn(res) {
    setSyncLink(res.syncToken, res.email);
    mergeRemoteIntoLocal(res);
    renderSyncButton();
    setSyncDialogMsg("");
    await syncNow({ silent: true });
    refreshOpenDashboardIfIdle();
    showToast("Disambungkan sebagai " + res.email + ". Progress anda kini disegerakkan.");
    const dlg = document.getElementById("syncDialog");
    if (dlg) closeTopLayer(dlg);
    const landingEl = document.getElementById("landingView");
    if (landingEl && !landingEl.hidden && isOpenAccessMode()) {
      window.location.hash = "#portal";
      enterOpenPortal(false);
    }
  }

  function loadGoogleSignIn() {
    const cid = window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.GOOGLE_CLIENT_ID;
    const holder = document.getElementById("syncGoogleBtn");
    const wrap = document.getElementById("syncGoogleWrap");
    if (!cid || !holder || (typeof google !== "undefined" && google.script)) return;
    if (wrap) wrap.hidden = false;

    function init() {
      if (syncUi.gsiReady || !window.google || !google.accounts || !google.accounts.id) return;
      syncUi.gsiReady = true;
      google.accounts.id.initialize({
        client_id: cid,
        callback: async function (resp) {
          setSyncDialogMsg("Mengesahkan akaun Google...");
          try {
            const res = await callBackend("googleSignIn", { idToken: resp.credential });
            if (res && res.ok) await onSyncLoggedIn(res);
            else setSyncDialogMsg((res && res.error) || "Pengesahan Google gagal.", true);
          } catch (e) {
            setSyncDialogMsg("Ralat rangkaian. Cuba lagi.", true);
          }
        }
      });
      syncUi.renderGsi = function () {
        const w = Math.max(200, Math.min(400, (holder.parentElement ? holder.parentElement.clientWidth : 320) || 320));
        holder.innerHTML = "";
        google.accounts.id.renderButton(holder, { theme: "outline", size: "large", text: "continue_with", shape: "pill", width: w });
      };
      syncUi.renderGsi();
    }

    if (window.google && google.accounts) { init(); return; }
    if (document.getElementById("gsiScript")) return;
    const s = document.createElement("script");
    s.id = "gsiScript";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = init;
    document.head.appendChild(s);
  }

  function openSyncDialog() {
    const dlg = document.getElementById("syncDialog");
    if (!dlg) return;
    renderSyncButton();
    setSyncDialogMsg("");
    const stepCode = document.getElementById("syncStepCode");
    const stepEmail = document.getElementById("syncStepEmail");
    if (stepCode) stepCode.hidden = true;
    if (stepEmail) stepEmail.hidden = false;
    loadGoogleSignIn();
    if (!dlg.open) dlg.showModal();
    if (syncUi.renderGsi) syncUi.renderGsi();
  }

  function bindCloudSyncEvents() {
    const btn = document.getElementById("syncProgressBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        btn.removeAttribute("data-nudge");
        if (getSyncLink()) {
          syncNow({ silent: false });
          return;
        }
        openSyncDialog();
      });
    }
    renderSyncButton();

    document.addEventListener("click", function (e) {
      if (e.target.closest(".js-open-sync-dialog")) openSyncDialog();
    });

    const dlg = document.getElementById("syncDialog");
    const closeBtn = document.getElementById("syncDialogClose");
    if (closeBtn && dlg) closeBtn.addEventListener("click", function () { closeTopLayer(dlg); });

    const emailForm = document.getElementById("syncEmailForm");
    if (emailForm) {
      emailForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const input = document.getElementById("syncEmailInput");
        const submit = emailForm.querySelector("button[type=submit]");
        const email = String(input && input.value || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          setSyncDialogMsg("Sila masukkan e-mel yang sah.", true);
          return;
        }
        if (submit) submit.disabled = true;
        setSyncDialogMsg("Menghantar kod...");
        try {
          const res = await callBackend("requestEmailOtp", { email: email });
          if (res && res.ok) {
            syncUi.otpEmail = email;
            document.getElementById("syncStepEmail").hidden = true;
            document.getElementById("syncStepCode").hidden = false;
            const ci = document.getElementById("syncCodeInput");
            if (ci) { ci.value = ""; ci.focus(); }
            setSyncDialogMsg(res.message || "Kod telah dihantar.");
          } else {
            setSyncDialogMsg((res && res.error) || "Gagal menghantar kod.", true);
          }
        } catch (err) {
          setSyncDialogMsg("Ralat rangkaian. Cuba lagi.", true);
        } finally {
          if (submit) submit.disabled = false;
        }
      });
    }

    const codeForm = document.getElementById("syncCodeForm");
    if (codeForm) {
      codeForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const code = String((document.getElementById("syncCodeInput") || {}).value || "").replace(/\D/g, "");
        const submit = codeForm.querySelector("button[type=submit]");
        if (code.length !== 6) { setSyncDialogMsg("Masukkan kod 6 digit.", true); return; }
        if (submit) submit.disabled = true;
        try {
          const res = await callBackend("verifyEmailOtp", { email: syncUi.otpEmail, code: code });
          if (res && res.ok) await onSyncLoggedIn(res);
          else setSyncDialogMsg((res && res.error) || "Kod tidak betul.", true);
        } catch (err) {
          setSyncDialogMsg("Ralat rangkaian. Cuba lagi.", true);
        } finally {
          if (submit) submit.disabled = false;
        }
      });
    }

    const backBtn = document.getElementById("syncCodeBack");
    if (backBtn) backBtn.addEventListener("click", function () {
      document.getElementById("syncStepCode").hidden = true;
      document.getElementById("syncStepEmail").hidden = false;
      setSyncDialogMsg("");
    });

    const nowBtn = document.getElementById("syncNowBtn");
    if (nowBtn) nowBtn.addEventListener("click", async function () {
      nowBtn.disabled = true;
      await syncNow({ silent: false });
      nowBtn.disabled = false;
    });

    const outBtn = document.getElementById("syncSignOutBtn");
    if (outBtn) outBtn.addEventListener("click", function () {
      clearSyncLink();
      renderSyncButton();
      showToast("Cloud Sync diputuskan. Data kekal di peranti ini.");
    });
  }

  // Selepas "Hantar Jawapan": segerak senyap jika sudah disambung; jika belum, tarik perhatian ke butang simpan.
  function cloudSyncAfterSubmit(fileId) {
    if (getSyncLink()) {
      syncNow({ silent: true, completedFileId: fileId });
      return;
    }
    const btn = document.getElementById("syncProgressBtn");
    if (btn) btn.setAttribute("data-nudge", "true");
  }

  // Tarik data awan sekali setiap muat semula halaman (peranti baharu / pelayar berlainan)
  function maybeAutoPull() {
    if (syncUi.pulledOnce || !getSyncLink()) return;
    syncUi.pulledOnce = true;
    syncNow({ silent: true });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    syncOpenAccessDom();
    bindEvents();
    bindCloudSyncEvents();

    // Segerakkan status mod operasi daripada pelayan secara latar belakang (tanpa menghalang UI)
    callBackend("ping").then(function (r) {
      if (r && typeof r.openAccessMode === "boolean") {
        const prev = isOpenAccessMode();
        setOpenAccessOverride(r.openAccessMode);
        if (prev !== r.openAccessMode) {
          syncRouteMode();
        }
      }
    }).catch(function () {});

    if (isHashAdmin()) {
      syncRouteMode();
      return;
    }
    const restored = isOpenAccessMode() ? false : await tryRestoreExistingSession();
    if (!restored) {
      await syncRouteMode();
      const landingEl = document.getElementById("landingView");
      if (landingEl && !landingEl.hidden && window.ETutorMotion) {
        window.ETutorMotion.playLandingEntrance();
      }
    }
  });
})();
