/* AUTO-GENERATED DARIPADA src/ OLEH scripts/build-frontend.mjs */
(function () {
  "use strict";

  // --- [config/storageKeys.js] ---
  /**
   * src/config/storageKeys.js
   * Pemalar kunci storan pelayar (localStorage) merentas sesi portal, mod terbuka & penyegerakan awan.
   */

  const SESSION_STORAGE_KEY = "etutor_portal_session_v1";
  const ADMIN_SESSION_STORAGE_KEY = "etutor_admin_session_v1";
  const DEVICE_STORAGE_KEY = "etutor_portal_device_id_v1";
  const OPEN_PROGRESS_STORAGE_KEY = "etutor_open_progress_v1";
  const OPEN_SCORES_STORAGE_KEY = "etutor_open_scores_v1";
  const OPEN_STUDENT_NAME_KEY = "etutor_open_student_name_v1";
  const OPEN_MODE_OVERRIDE_KEY = "etutor_open_mode_override_v1";
  const SYNC_TOKEN_KEY = "etutor_sync_token_v1";
  const SYNC_EMAIL_KEY = "etutor_sync_email_v1";
  const SYNC_LAST_KEY = "etutor_sync_last_v1";
  const SYNC_LB_ID_KEY = "etutor_sync_lb_id_v1";
  const SYNC_PAKEJ_KEY = "etutor_sync_pakej_v1";
  const LIVE_CATALOG_CACHE_KEY = "etutor_live_catalog_v1";
  const PORTAL_PREFS_STORAGE_KEY = "etutor_portal_prefs_v1";
  const UNLOCKED_CONTENTS_STORAGE_KEY = "etutor_unlocked_contents_v1";
  const SPM_COUNTDOWN_PREFS_KEY = "etutor_spm2026_countdown_prefs_v1";
  const PENDING_REFERRAL_STORAGE_KEY = "etutor_pending_ref_code_v1";
  const ATTRIBUTED_REFERRAL_STORAGE_KEY = "etutor_attributed_ref_v1";
  const PHONE_WELCOME_DONE_KEY = "etutor_phone_welcome_done_v1";
  const NOTA_PROGRESS_STORAGE_KEY = "etutor_nota_progress_v1";
  const EXAM_REPORTS_STORAGE_KEY = "etutor_exam_reports_v1";
  const STUDENT_PROFILE_STORAGE_KEY = "etutor_student_profile_v1";

  // --- [config/learningModulesRegistry.js] ---
  /**
   * src/config/learningModulesRegistry.js
   * Pendaftaran berpusat Tahap Pendidikan (Sekolah Rendah -> Menengah / SPM),
   * modul program pembelajaran (aktif & masa depan), serta simpanan keutamaan pelajar.
   */

  const PORTAL_BATCH_SIZE = 12;

  const EDUCATION_STAGES = [
    { id: "spm", label: "SPM (Tingkatan 4–5)", shortLabel: "SPM", active: true, badge: "Aktif" },
    { id: "menengah_rendah", label: "Menengah Rendah (Tingkatan 1–3)", shortLabel: "Ting. 1–3", active: false, badge: "Akan Datang" },
    { id: "sekolah_rendah", label: "Sekolah Rendah (Tahun 1–6)", shortLabel: "Tahun 1–6", active: false, badge: "Akan Datang" }
  ];

  const PORTAL_MODULES = [
    { id: "klon_spm", stage: "spm", title: "Set Soalan Klon SPM Interaktif", active: true, defaultOpen: true, defaultVisible: true },
    { id: "pra_spm", stage: "spm", title: "Soalan Percubaan / Pra-SPM Negeri", active: true, defaultOpen: false, defaultVisible: true },
    { id: "nota_interaktif", stage: "spm", title: "Nota Interaktif Visual", active: true, defaultOpen: false, defaultVisible: true },
    { id: "countdown_spm", stage: "spm", title: "Countdown & Jadual Waktu SPM 2026", active: true, defaultOpen: false, defaultVisible: true },
    { id: "progress", stage: "all", title: "Kemajuan Pembelajaran & Analisis", active: true, defaultOpen: false, defaultVisible: true },
    { id: "leaderboard", stage: "all", title: "Carta Kedudukan Pelajar (Leaderboard)", active: true, defaultOpen: false, defaultVisible: true },
    { id: "flashcard", stage: "spm", title: "Latihan Flashcard Pantas", active: false, defaultOpen: false, defaultVisible: false, badge: "Akan Datang" }
  ];

  function getDefaultPortalPrefs() {
    const visibleModules = {};
    PORTAL_MODULES.forEach(function (m) {
      visibleModules[m.id] = Boolean(m.defaultVisible);
    });
    return {
      stage: "spm",
      singleOpenAccordion: true,
      openModuleId: "klon_spm",
      notaLaunchedV1: true,
      visibleModules: visibleModules
    };
  }

  function loadPortalPrefs() {
    const base = getDefaultPortalPrefs();
    try {
      if (typeof localStorage === "undefined") return base;
      const raw = localStorage.getItem(PORTAL_PREFS_STORAGE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return base;
      const vis = Object.assign({}, base.visibleModules);
      if (parsed.visibleModules && typeof parsed.visibleModules === "object") {
        PORTAL_MODULES.forEach(function (m) {
          if (typeof parsed.visibleModules[m.id] === "boolean") {
            vis[m.id] = parsed.visibleModules[m.id];
          }
        });
      }
      if (!parsed.notaLaunchedV1) {
        vis.nota_interaktif = true;
      }
      const validStage = EDUCATION_STAGES.some(function (s) { return s.id === parsed.stage && s.active; })
        ? parsed.stage
        : "spm";
      return {
        stage: validStage,
        singleOpenAccordion: typeof parsed.singleOpenAccordion === "boolean" ? parsed.singleOpenAccordion : true,
        openModuleId: typeof parsed.openModuleId === "string" ? parsed.openModuleId : "klon_spm",
        notaLaunchedV1: true,
        visibleModules: vis
      };
    } catch (e) {
      return base;
    }
  }

  function savePortalPrefs(prefs) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(PORTAL_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  // --- [shared/ui/icons.js] ---
  /**
   * src/shared/ui/icons.js
   * Pendaftaran ikon vektor SVG sebaris (sifar emoji struktur mengikut piawaian UI/UX).
   */

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
    lock: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4"/></svg>',
    unlock: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 017.5-1.9"/></svg>',
    logout: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 17l5-5-5-5M21 12H9m4 9H5a2 2 0 01-2-2V5a2 2 0 012-2h8"/></svg>',
    calendar: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>',
    starOutline: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linejoin="round"/></svg>',
    starSolid: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-linejoin="round"/></svg>',
    download: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    listTimeline: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    gridCards: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>'
  };

  // --- [shared/utils/formatters.js] ---
  /**
   * src/shared/utils/formatters.js
   * Fungsi tulen pemformatan teks HTML selamat, gred SPM tempatan, tarikh MYT, streak & ID peranti.
   */

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

  // --- [shared/state/portalStore.js] ---
  /**
   * src/shared/state/portalStore.js
   * Storan keadaan berpusat (Single Source of Truth) untuk portal pelajar, katalog, dan panel admin.
   */

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
    klonSelectedGroup: "ALL",
    klonSelectedSubject: "ALL",
    klonSelectedStatus: "ALL",
    klonSearchQuery: "",
    notaSelectedSubject: "ALL",
    notaSearchQuery: "",
    lbPeriod: "all",
    lbSubject: "ALL",
    activeQuizFileId: null,
    activeNotaId: null,
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
    deepLinkHandled: false,
    catalogFingerprint: "",
    lastCatalogSyncMs: 0,
    pinProgressStateByFileId: {},
    supabaseAuthenticated: false,
    pendingKlonScroll: false,
    pendingCountdownScroll: false,
    pendingNotaScroll: false,
    klonVisibleLimit: 12,
    harianVisibleLimit: 12,
    activeStage: "spm",
    portalPrefs: null,
    examHistoryPushed: false,
    suppressNextExamPopstate: false,
    studentProfile: null,
    activeFormFilter: "T5",
    showAllSubjectsOverride: false,
    activeWorkspaceTab: "belajar"
  };

  // --- [shared/ui/toast.js] ---
  /**
   * src/shared/ui/toast.js
   * Komponen makluman ringkas (Toast Notification) dengan integrasi animasi masuk.
   */

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

  // --- [shared/ui/topLayerDialog.js] ---
  /**
   * src/shared/ui/topLayerDialog.js
   * Pengurusan penutupan animasi elemen <dialog> Top-Layer (@starting-style + allow-discrete + fallback).
   */

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

  function bindLightDismissFallback(dialogEl) {
    if (!dialogEl || typeof HTMLDialogElement === "undefined") return;
    if ("closedBy" in HTMLDialogElement.prototype) return;
    if (dialogEl.dataset.lightDismissBound === "1") return;
    dialogEl.dataset.lightDismissBound = "1";

    dialogEl.addEventListener("click", function (event) {
      if (event.target !== dialogEl) return;
      const rect = dialogEl.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        closeTopLayer(dialogEl);
      }
    });
  }

  // --- [shared/supabase/supabaseClient.js] ---
  /**
   * src/shared/supabase/supabaseClient.js
   * Pengurus klien Supabase singleton, pasangan nonce SHA-256 Google One-Tap & pengesan WebView terhad.
   */

  let cachedSupabaseClient = null;
  let cachedSupabaseSignature = "";

  function bytesToHex(bytes) {
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex;
  }

  function isSupabaseConfigured() {
    if (typeof window === "undefined") return false;
    const cfg = window.ETUTOR_CONFIG || {};
    const url = String(cfg.SUPABASE_URL || "").trim();
    const key = String(cfg.SUPABASE_ANON_KEY || "").trim();
    return Boolean(url && key && window.supabase && typeof window.supabase.createClient === "function");
  }

  function getSupabaseClient() {
    if (!isSupabaseConfigured()) return null;
    const cfg = window.ETUTOR_CONFIG || {};
    const url = String(cfg.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    const key = String(cfg.SUPABASE_ANON_KEY || "").trim();
    const sig = url + "|" + key.slice(0, 12);
    if (cachedSupabaseClient && cachedSupabaseSignature === sig) {
      return cachedSupabaseClient;
    }
    cachedSupabaseClient = window.supabase.createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      }
    });
    cachedSupabaseSignature = sig;
    return cachedSupabaseClient;
  }

  async function generateGoogleNoncePair() {
    const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : null;
    let rawNonce = "";
    if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
      const bytes = new Uint8Array(32);
      cryptoApi.getRandomValues(bytes);
      rawNonce = bytesToHex(bytes);
    } else {
      rawNonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    let hashedNonce = rawNonce;
    if (cryptoApi && cryptoApi.subtle && typeof cryptoApi.subtle.digest === "function" && typeof TextEncoder !== "undefined") {
      const encoded = new TextEncoder().encode(rawNonce);
      const digest = await cryptoApi.subtle.digest("SHA-256", encoded);
      hashedNonce = bytesToHex(new Uint8Array(digest));
    }
    return { rawNonce: rawNonce, hashedNonce: hashedNonce };
  }

  function isRestrictedInAppWebView(uaString) {
    const ua = uaString !== undefined
      ? String(uaString || "")
      : (typeof navigator !== "undefined" ? String(navigator.userAgent || "") : "");
    if (!ua) return false;
    return /(TikTok|BytedanceWebview|musical_ly|Instagram|FBAN|FBAV|FB_IAB|Line\/|MicroMessenger)/i.test(ua);
  }

  // --- [features/mobile-app/capacitorAuthAndAccountService.js] ---
  /**
   * src/features/mobile-app/capacitorAuthAndAccountService.js
   * Aliran Google OAuth pelayar luaran Capacitor (@capacitor/browser + Deep Link my.etutor.app://auth/callback)
   * serta pemadaman akaun kekal pengguna (pematuhan Apple 5.1.1(v) & Google Play).
   */








  const CAPACITOR_OAUTH_CALLBACK = "my.etutor.app://auth/callback";
  let deepLinkListenerBound = false;
  let accountDeletionBound = false;

  function isNativeCapacitorPlatform() {
    if (typeof window === "undefined") return false;
    return Boolean(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === "function" &&
      window.Capacitor.isNativePlatform()
    );
  }

  async function startCapacitorExternalGoogleOAuth(sb) {
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: CAPACITOR_OAUTH_CALLBACK,
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account" }
      }
    });
    if (error || !data || !data.url) {
      return { ok: false, error: (error && error.message) || "Gagal membuka log masuk Google." };
    }
    const browserPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
    if (browserPlugin && typeof browserPlugin.open === "function") {
      await browserPlugin.open({ url: data.url, presentationStyle: "popover" });
    } else {
      window.open(data.url, "_blank", "noopener,noreferrer");
    }
    return { ok: true, redirecting: true };
  }

  function bindCapacitorOAuthDeepLinkListener() {
    if (deepLinkListenerBound || !isNativeCapacitorPlatform()) return;
    const appPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (!appPlugin || typeof appPlugin.addListener !== "function") return;
    deepLinkListenerBound = true;

    appPlugin.addListener("appUrlOpen", async function (event) {
      const rawUrl = String((event && event.url) || "");
      if (
        rawUrl.indexOf(CAPACITOR_OAUTH_CALLBACK) !== 0 &&
        rawUrl.indexOf("https://etutor.my/auth/callback") !== 0
      ) {
        return;
      }

      try {
        const browserPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
        if (browserPlugin && typeof browserPlugin.close === "function") {
          await browserPlugin.close();
        }
      } catch (e) {}

      const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
      if (!sb) return;
      try {
        const parsed = new URL(rawUrl);
        const code = parsed.searchParams.get("code");
        if (code) {
          await sb.auth.exchangeCodeForSession(code);
        } else if (parsed.hash) {
          const hp = new URLSearchParams(parsed.hash.replace(/^#/, ""));
          const accessTok = hp.get("access_token");
          const refreshTok = hp.get("refresh_token");
          if (accessTok && refreshTok) {
            await sb.auth.setSession({ access_token: accessTok, refresh_token: refreshTok });
          }
        }
        window.location.hash = "#portal";
      } catch (err) {
        showToast("Pengesahan log masuk Google tidak selesai. Sila cuba semula.");
      }
    });
  }

  function clearLocalStudentAccountData() {
    const keys = [
      SESSION_STORAGE_KEY,
      OPEN_PROGRESS_STORAGE_KEY,
      OPEN_SCORES_STORAGE_KEY,
      OPEN_STUDENT_NAME_KEY,
      SYNC_LAST_KEY,
      UNLOCKED_CONTENTS_STORAGE_KEY,
      PHONE_WELCOME_DONE_KEY,
      "etutor_cikgu_daily_tokens_v1"
    ];
    keys.forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    clearSyncLink();
  }

  async function deleteCurrentUserAccountUnified() {
    const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
    if (sb) {
      try {
        const sessRes = await sb.auth.getSession();
        if (sessRes && sessRes.data && sessRes.data.session) {
          const rpcRes = await sb.rpc("delete_my_account");
          if (rpcRes.error || !rpcRes.data || !rpcRes.data.ok) {
            return {
              ok: false,
              error: (rpcRes.data && rpcRes.data.error) || (rpcRes.error && rpcRes.error.message) || "Gagal memadam akaun awan."
            };
          }
          try { await sb.auth.signOut(); } catch (e) {}
          clearLocalStudentAccountData();
          handleLogout();
          return { ok: true };
        }
      } catch (err) {
        return { ok: false, error: err && err.message ? err.message : "Ralat rangkaian semasa memadam akaun." };
      }
    }

    if (portalState.sessionToken) {
      if (sb && String(portalState.sessionToken).indexOf("sbpin_") === 0) {
        const pinDel = await sb.rpc("delete_my_pin_account", {
          p_session_token: portalState.sessionToken,
          p_device_id: portalState.deviceId
        });
        if (pinDel.error || !pinDel.data || !pinDel.data.ok) {
          return {
            ok: false,
            error: (pinDel.data && pinDel.data.error) || (pinDel.error && pinDel.error.message) || "Gagal memadam akaun PIN."
          };
        }
      } else {
        const res = await callBackend("deleteAccount", {});
        if (!res || !res.ok) {
          return { ok: false, error: (res && res.error) || "Gagal memadam rekod akaun." };
        }
      }
    }

    clearLocalStudentAccountData();
    handleLogout();
    return { ok: true };
  }

  function openDeleteAccountConfirmation() {
    const dlg = document.getElementById("deleteAccountDialog");
    const stEl = document.getElementById("deleteAccountStatusMsg");
    if (!dlg) return;
    if (stEl) stEl.textContent = "";
    if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
  }

  function bindAccountDeletionEvents() {
    if (accountDeletionBound) return;
    accountDeletionBound = true;

    const delDlg = document.getElementById("deleteAccountDialog");
    const cancelBtn = document.getElementById("cancelDeleteAccountBtn");
    const confirmBtn = document.getElementById("confirmPermanentDeleteAccountBtn");
    const stEl = document.getElementById("deleteAccountStatusMsg");

    if (delDlg) {
      bindLightDismissFallback(delDlg);
      delDlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
        closeTopLayer(delDlg);
      });
    }
    if (cancelBtn && delDlg) {
      cancelBtn.addEventListener("click", function () { closeTopLayer(delDlg); });
    }

    document.addEventListener("click", async function (e) {
      if (e.target.closest("#openDeleteAccountBtn") || e.target.closest("#walletDeleteAccountBtn")) {
        const syncDlg = document.getElementById("syncDialog");
        const walletDlg = document.getElementById("tokenWalletDialog");
        if (syncDlg && syncDlg.open) await closeTopLayer(syncDlg);
        if (walletDlg && walletDlg.open) await closeTopLayer(walletDlg);
        openDeleteAccountConfirmation();
      }
    });

    if (confirmBtn && delDlg) {
      confirmBtn.addEventListener("click", async function () {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Memadam Akaun...";
        if (stEl) stEl.textContent = "";
        try {
          const res = await deleteCurrentUserAccountUnified();
          if (!res || !res.ok) {
            if (stEl) stEl.textContent = (res && res.error) || "Gagal memadam akaun.";
            return;
          }
          await closeTopLayer(delDlg);
          showToast("Akaun dan semua rekod peribadi anda telah dipadamkan.");
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Padam Akaun Secara Kekal";
        }
      });
    }
  }

  // --- [shared/supabase/supabaseDataService.js] ---
  /**
   * src/shared/supabase/supabaseDataService.js
   * Lapisan perkhidmatan Supabase Auth (Google ID Token, OAuth PKCE, OTP E-mel) & RPC Postgres.
   */



  function mapAuthError(err, fallbackMsg) {
    const raw = String((err && err.message) || err || "");
    if (/expired|invalid.*token|otp/i.test(raw)) return "Kod pengesahan tidak sah atau telah tamat tempoh.";
    if (/rate limit|too many/i.test(raw)) return "Terlalu banyak cubaan. Sila tunggu sebentar sebelum cuba semula.";
    if (/network|fetch/i.test(raw)) return "Tidak dapat menghubungi pelayan Supabase. Semak sambungan internet anda.";
    return raw || fallbackMsg || "Pengesahan gagal. Sila cuba lagi.";
  }

  async function sbSyncStudentBundle(payload) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const sessRes = await sb.auth.getSession();
    const session = sessRes && sessRes.data ? sessRes.data.session : null;
    if (!session || !session.user) {
      return { ok: false, authExpired: true, error: "Sesi tamat. Sila log masuk semula." };
    }

    const p = payload || {};
    const { data, error } = await sb.rpc("sync_student_bundle", {
      p_name: String(p.name || "").trim().slice(0, 80),
      p_scores: Array.isArray(p.scores) ? p.scores.slice(-250) : [],
      p_progress: Array.isArray(p.progress) ? p.progress.slice(0, 10) : [],
      p_completed_file_ids: Array.isArray(p.completedFileIds) ? p.completedFileIds.slice(0, 60) : []
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal menyegerakkan data.") };
    if (!data || !data.ok) return data || { ok: false, error: "Gagal menyegerakkan data." };

    return Object.assign({}, data, {
      syncToken: session.access_token || "sb_session",
      email: data.email || session.user.email || ""
    });
  }

  async function sbSignInWithGoogleIdToken(idToken, rawNonce) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const opts = { provider: "google", token: String(idToken || "") };
    if (rawNonce) opts.nonce = String(rawNonce);
    const { data, error } = await sb.auth.signInWithIdToken(opts);
    if (error || !data || !data.session) {
      return { ok: false, error: mapAuthError(error, "Pengesahan Google gagal.") };
    }
    return sbSyncStudentBundle({});
  }

  async function sbSignInWithGoogleRedirect(redirectHash) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    if (isNativeCapacitorPlatform()) {
      return startCapacitorExternalGoogleOAuth(sb);
    }
    const baseUrl = window.location.origin + window.location.pathname;
    const targetHash = redirectHash || "#portal";
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: baseUrl + targetHash,
        queryParams: { prompt: "select_account" }
      }
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal membuka log masuk Google.") };
    return { ok: true, redirecting: true };
  }

  async function sbRequestEmailOtp(email) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const cleanEmail = String(email || "").trim().toLowerCase();
    const { error } = await sb.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true }
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal menghantar kod e-mel.") };
    return { ok: true, message: "Kod 6 digit telah dihantar ke " + cleanEmail + ". Semak juga folder Spam." };
  }

  async function sbVerifyEmailOtp(email, code) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanCode = String(code || "").replace(/\D/g, "");
    const { data, error } = await sb.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: "email"
    });
    if (error || !data || !data.session) {
      return { ok: false, error: mapAuthError(error, "Kod pengesahan tidak betul atau tamat tempoh.") };
    }
    return sbSyncStudentBundle({});
  }

  async function sbSignOut() {
    const sb = getSupabaseClient();
    if (!sb) return { ok: true };
    await sb.auth.signOut();
    return { ok: true };
  }

  async function sbFetchLeaderboard(period, subject, userKey, displayName) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const { data, error } = await sb.rpc("get_leaderboard", {
      p_period: period || "all",
      p_subject: subject || "ALL",
      p_current_user_key: userKey || "",
      p_current_name: displayName || ""
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal memuatkan Leaderboard.") };
    return { ok: true, leaderboard: data };
  }

  async function sbRedeemBuyerPin(buyerId, pin, deviceId) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const { data, error } = await sb.rpc("redeem_buyer_pin", {
      p_buyer_id: String(buyerId || "").trim(),
      p_pin: String(pin || "").trim(),
      p_device_id: String(deviceId || portalState.deviceId || "web")
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal menebus Kod PIN.") };
    return data || { ok: false, error: "Gagal menebus Kod PIN." };
  }

  async function sbLoginWithBuyerPin(buyerId, pin, deviceId) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const { data, error } = await sb.rpc("login_with_buyer_pin", {
      p_buyer_id: String(buyerId || "").trim(),
      p_pin: String(pin || "").trim(),
      p_device_id: String(deviceId || portalState.deviceId || "web")
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal mengesahkan PIN.") };
    return data || { ok: false, error: "Log masuk PIN gagal." };
  }

  async function sbGetPinDashboardData(sessionToken, deviceId) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const { data, error } = await sb.rpc("get_pin_dashboard_data", {
      p_session_token: String(sessionToken || ""),
      p_device_id: String(deviceId || portalState.deviceId || "web")
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal memuatkan data sesi.") };
    return data || { ok: false, authExpired: true, error: "Sesi tamat." };
  }

  async function sbSavePinProgress(sessionToken, deviceId, payload) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false };
    const p = payload || {};
    const { data, error } = await sb.rpc("save_pin_quiz_progress", {
      p_session_token: String(sessionToken || ""),
      p_device_id: String(deviceId || portalState.deviceId || "web"),
      p_file_id: String(p.fileId || ""),
      p_quiz_title: String(p.quizTitle || ""),
      p_subject: String(p.subject || ""),
      p_answered_count: Number(p.answeredCount) || 0,
      p_total_questions: Number(p.totalQuestions) || 45,
      p_time_remaining: typeof p.timeRemaining === "number" ? Math.round(p.timeRemaining) : null,
      p_state_json: String(p.stateJson || "")
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: true };
  }

  async function sbClearPinProgress(sessionToken, deviceId, fileId) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false };
    const { data, error } = await sb.rpc("clear_pin_quiz_progress", {
      p_session_token: String(sessionToken || ""),
      p_device_id: String(deviceId || portalState.deviceId || "web"),
      p_file_id: String(fileId || "")
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: true };
  }

  async function sbSavePinScore(sessionToken, deviceId, payload) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false };
    const p = payload || {};
    const { data, error } = await sb.rpc("save_pin_quiz_score", {
      p_session_token: String(sessionToken || ""),
      p_device_id: String(deviceId || portalState.deviceId || "web"),
      p_file_id: String(p.fileId || ""),
      p_quiz_title: String(p.quizTitle || ""),
      p_subject: String(p.subject || ""),
      p_score_text: String(p.scoreText || ""),
      p_percentage: Number(p.percentage) || 0,
      p_weak_topics: Array.isArray(p.weakTopics) ? p.weakTopics : []
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: false };
  }

  async function sbSetPinScoreLeaderboardVisibility(sessionToken, deviceId, fileId, showOnLeaderboard) {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false };
    const { data, error } = await sb.rpc("set_pin_score_leaderboard_visibility", {
      p_session_token: String(sessionToken || ""),
      p_device_id: String(deviceId || portalState.deviceId || "web"),
      p_file_id: String(fileId || ""),
      p_show: Boolean(showOnLeaderboard)
    });
    if (error) return { ok: false, error: error.message };
    return data || { ok: false };
  }

  async function sbGetPortalSettings() {
    const sb = getSupabaseClient();
    if (!sb || !isSupabaseConfigured()) return null;
    const { data, error } = await sb.from("portal_settings").select("open_access_mode").eq("id", 1).maybeSingle();
    if (error || !data) return null;
    return data;
  }

  async function sbGetMyAiWallet() {
    const sb = getSupabaseClient();
    if (!sb || !isSupabaseConfigured()) return { ok: false, unconfigured: true };
    const sessRes = await sb.auth.getSession();
    if (!sessRes || !sessRes.data || !sessRes.data.session) return { ok: false, authExpired: true };
    const { data, error } = await sb.rpc("get_my_ai_wallet");
    if (error) return { ok: false, error: mapAuthError(error, "Gagal memuatkan dompet token.") };
    return data || { ok: false };
  }

  async function sbRedeemAiTopupVoucher(code) {
    const sb = getSupabaseClient();
    if (!sb || !isSupabaseConfigured()) return { ok: false, unconfigured: true };
    const { data, error } = await sb.rpc("redeem_ai_topup_voucher", { p_code: String(code || "").trim() });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal menebus kod baucar.") };
    return data || { ok: false, error: "Gagal menebus kod baucar." };
  }

  async function sbClaimAiReferralBonus(refCode) {
    const sb = getSupabaseClient();
    if (!sb || !isSupabaseConfigured()) return { ok: false, unconfigured: true };
    const { data, error } = await sb.rpc("claim_ai_referral_bonus", { p_ref_code: String(refCode || "").trim() });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal menebus bonus rujukan.") };
    return data || { ok: false };
  }

  async function sbUnlockPortalContent(contentType, contentId, title) {
    const sb = getSupabaseClient();
    if (!sb || !isSupabaseConfigured()) return { ok: false, unconfigured: true };
    const sessRes = await sb.auth.getSession();
    if (!sessRes || !sessRes.data || !sessRes.data.session) return { ok: false, authExpired: true };
    const { data, error } = await sb.rpc("unlock_portal_content", {
      p_content_type: String(contentType || ""),
      p_content_id: String(contentId || ""),
      p_title: String(title || "").slice(0, 180)
    });
    if (error) return { ok: false, error: mapAuthError(error, "Gagal membuka kunci kandungan.") };
    return data || { ok: false };
  }

  // --- [shared/supabase/supabaseProfileService.js] ---
  /**
   * src/shared/supabase/supabaseProfileService.js
   * Perkhidmatan RPC profil pembelajaran pelajar & ibu bapa pada Supabase (public.profiles).
   */

  const PROFILE_VALID_FORMS_ = ["T1", "T2", "T3", "T4", "T5"];
  const PROFILE_VALID_FOCUSES_ = ["nota_bab", "kerja_sekolah", "pecutan_exam"];
  const PROFILE_VALID_GOALS_ = [10, 15, 30];

  function cleanFormCode_(val) {
    const upper = String(val || "").trim().toUpperCase();
    return PROFILE_VALID_FORMS_.indexOf(upper) !== -1 ? upper : "T5";
  }

  function mapProfileError_(err, fallbackMsg) {
    const raw = String((err && err.message) || err || "");
    if (/network|fetch/i.test(raw)) {
      return "Tidak dapat menghubungi pelayan Supabase. Semak sambungan internet anda.";
    }
    return raw || fallbackMsg || "Gagal memproses profil pembelajaran.";
  }

  function parseProfileUpdatedMs_(raw) {
    if (typeof raw.updatedAtMs === "number" && isFinite(raw.updatedAtMs)) return Math.max(0, raw.updatedAtMs);
    if (typeof raw.updated_at_ms === "number" && isFinite(raw.updated_at_ms)) return Math.max(0, raw.updated_at_ms);
    const iso = raw.onboarding_updated_at || raw.onboardingUpdatedAt || raw.updated_at || "";
    if (iso) {
      const parsed = Date.parse(String(iso));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 0;
  }

  function normalizeLearningProfileRow_(row) {
    const r = row && typeof row === "object" ? row : {};
    const roleVal = r.role !== undefined ? r.role : r.user_role;
    const formVal = r.currentForm !== undefined ? r.currentForm : r.current_form;
    const formsVal = r.learningForms !== undefined ? r.learningForms : r.learning_forms;
    const subjVal = r.selectedSubjects !== undefined ? r.selectedSubjects : r.selected_subjects;
    const focusVal = r.studyFocus !== undefined ? r.studyFocus : r.study_focus;
    const goalVal = r.dailyGoalMinutes !== undefined ? r.dailyGoalMinutes : r.daily_goal_minutes;
    const doneVal = r.onboardingCompleted !== undefined ? r.onboardingCompleted : r.onboarding_completed;
    const lbVal = r.showOnLeaderboard !== undefined ? r.showOnLeaderboard : r.show_on_leaderboard;
    const nameVal = r.displayName !== undefined ? r.displayName : r.display_name;
    const cleanForm = cleanFormCode_(formVal);

    return {
      displayName: String(nameVal || "").trim().slice(0, 80),
      role: roleVal === "ibu_bapa" ? "ibu_bapa" : "pelajar",
      currentForm: cleanForm,
      learningForms: Array.isArray(formsVal) && formsVal.length > 0 ? formsVal.slice() : [cleanForm],
      selectedSubjects: Array.isArray(subjVal) ? subjVal.slice() : [],
      studyFocus: PROFILE_VALID_FOCUSES_.indexOf(focusVal) !== -1 ? focusVal : "nota_bab",
      dailyGoalMinutes: PROFILE_VALID_GOALS_.indexOf(Number(goalVal)) !== -1 ? Number(goalVal) : 15,
      onboardingCompleted: Boolean(doneVal),
      showOnLeaderboard: Boolean(lbVal),
      updatedAtMs: parseProfileUpdatedMs_(r)
    };
  }

  async function getAuthenticatedSupabaseClient_() {
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    const sessRes = await sb.auth.getSession();
    const session = sessRes && sessRes.data ? sessRes.data.session : null;
    if (!session || !session.user) {
      return { ok: false, authExpired: true, error: "Sesi tamat. Sila log masuk semula." };
    }
    return { ok: true, sb: sb };
  }

  async function sbGetStudentLearningProfile() {
    const auth = await getAuthenticatedSupabaseClient_();
    if (!auth.ok) return auth;
    const { data, error } = await auth.sb.rpc("get_student_learning_profile");
    if (error) return { ok: false, error: mapProfileError_(error, "Gagal memuatkan profil pembelajaran.") };
    if (!data || !data.ok) return data || { ok: false, error: "Gagal memuatkan profil pembelajaran." };
    return { ok: true, profile: normalizeLearningProfileRow_(data.profile || data) };
  }

  async function sbSaveStudentLearningProfile(profile) {
    const auth = await getAuthenticatedSupabaseClient_();
    if (!auth.ok) return auth;
    const p = profile && typeof profile === "object" ? profile : {};
    const currentForm = cleanFormCode_(p.currentForm);
    const { data, error } = await auth.sb.rpc("save_student_learning_profile", {
      p_display_name: String(p.displayName || "").trim().slice(0, 80),
      p_role: p.role === "ibu_bapa" ? "ibu_bapa" : "pelajar",
      p_current_form: currentForm,
      p_learning_forms: Array.isArray(p.learningForms) && p.learningForms.length > 0 ? p.learningForms : [currentForm],
      p_selected_subjects: Array.isArray(p.selectedSubjects) ? p.selectedSubjects : [],
      p_study_focus: PROFILE_VALID_FOCUSES_.indexOf(p.studyFocus) !== -1 ? p.studyFocus : "nota_bab",
      p_daily_goal_minutes: PROFILE_VALID_GOALS_.indexOf(Number(p.dailyGoalMinutes)) !== -1 ? Number(p.dailyGoalMinutes) : 15,
      p_onboarding_completed: Boolean(p.onboardingCompleted),
      p_show_on_leaderboard: typeof p.showOnLeaderboard === "boolean" ? p.showOnLeaderboard : null
    });
    if (error) return { ok: false, error: mapProfileError_(error, "Gagal menyimpan profil pembelajaran.") };
    if (!data || !data.ok) return data || { ok: false, error: "Gagal menyimpan profil pembelajaran." };
    return { ok: true, profile: normalizeLearningProfileRow_(data.profile || data) };
  }

  // --- [shared/supabase/pinBundleBuilder.js] ---
  /**
   * src/shared/supabase/pinBundleBuilder.js
   * Pembina pakej papan pemuka (Catalog + Continue Progress + KPI Bento) untuk sesi PIN Supabase.
   */



  function filterCatalogByPackage(items, aksesPakej) {
    const list = Array.isArray(items) ? items : [];
    const pkg = String(aksesPakej || "ALL").trim();
    if (!pkg || pkg.toUpperCase() === "ALL") return list;
    const allowedSet = new Set(
      pkg.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean)
    );
    if (allowedSet.size === 0) return list;
    return list.filter(function (item) {
      return allowedSet.has(String((item && item.subject) || "").trim().toLowerCase());
    });
  }

  function getCachedCatalogFallback() {
    if (Array.isArray(portalState.rawOpenCatalog) && portalState.rawOpenCatalog.length > 0) {
      return portalState.rawOpenCatalog;
    }
    if (Array.isArray(portalState.catalog) && portalState.catalog.length > 0) {
      return portalState.catalog;
    }
    try {
      const raw = localStorage.getItem(LIVE_CATALOG_CACHE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    } catch (e) {}
    return [];
  }

  function buildPinDashboardBundle(pinDashData, rawCatalog, lbData) {
    const userObj = (pinDashData && pinDashData.user) || portalState.user || { userId: "PELAJAR", buyerName: "Pelajar", aksesPakej: "ALL" };
    const allowedFiles = filterCatalogByPackage(rawCatalog, userObj.aksesPakej);
    const scores = Array.isArray(pinDashData && pinDashData.scores) ? pinDashData.scores : [];
    portalState.scores = scores;
    const progRows = Array.isArray(pinDashData && pinDashData.inProgress) ? pinDashData.inProgress : [];

    const bestByFile = {};
    const attemptCountByFile = {};
    const dateMap = {};
    const weakCounter = {};

    scores.forEach(function (s) {
      if (!s || !s.fileId) return;
      attemptCountByFile[s.fileId] = (attemptCountByFile[s.fileId] || 0) + 1;
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

    const progMap = {};
    const stateByFileId = {};
    progRows.forEach(function (p) {
      if (!p || !p.fileId) return;
      progMap[p.fileId] = {
        updatedAt: p.updatedAt || "Sebentar tadi",
        fileId: p.fileId,
        quizTitle: p.quizTitle || "Set Latihan Interaktif",
        subject: p.subject || "SPM",
        answeredCount: Math.max(0, Number(p.answeredCount) || 0),
        totalQuestions: Math.max(1, Number(p.totalQuestions) || 45),
        timeRemaining: p.timeRemaining !== undefined ? p.timeRemaining : null
      };
      if (p.stateJson) stateByFileId[p.fileId] = p.stateJson;
    });
    portalState.pinProgressStateByFileId = stateByFileId;

    const subMap = {};
    let completedSets = 0;
    let sumBestPct = 0;
    let totalXp = 0;

    const enrichedCatalog = allowedFiles.map(function (f) {
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
        attemptCount: attemptCountByFile[f.fileId] || (best ? 1 : 0),
        inProgress: prog,
        status: prog ? "in_progress" : (best ? "completed" : "not_started")
      });
    });

    const avgScore = completedSets > 0 ? Math.round(sumBestPct / completedSets) : 0;
    const completionPct = enrichedCatalog.length > 0 ? Math.round((completedSets / enrichedCatalog.length) * 100) : 0;
    const weakTopics = Object.keys(weakCounter)
      .map(function (k) { return weakCounter[k]; })
      .sort(function (a, b) { return a.lowestPct - b.lowestPct || b.count - a.count; })
      .slice(0, 4);

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

    return {
      ok: true,
      user: userObj,
      catalog: enrichedCatalog,
      inProgress: Object.keys(progMap).map(function (k) { return progMap[k]; }),
      progressSummary: {
        totalSets: enrichedCatalog.length,
        completedSets: completedSets,
        inProgressSets: progRows.length,
        completionPercentage: completionPct,
        averageScore: avgScore,
        averageGrade: computeLocalSpmGrade(avgScore, completedSets > 0),
        totalXp: totalXp,
        streakDays: calculateLocalStreakDays(dateMap),
        subjectBreakdown: subjectBreakdown,
        weakTopics: weakTopics
      },
      leaderboard: lbData || portalState.leaderboard || null
    };
  }

  // --- [shared/utils/apiClient.js] ---
  /**
   * src/shared/utils/apiClient.js
   * Klien komunikasi hibrid ke Backend Supabase Auth/Postgres (jika aktif) serta Google Apps Script /api.
   */





  async function sendToGasOrPreview(reqBody, options) {
    if (typeof google !== "undefined" && google.script && google.script.run) {
      return new Promise(function (resolve, reject) {
        google.script.run
          .withSuccessHandler(function (res) { resolve(res); })
          .withFailureHandler(function (err) { reject(err); })
          .gasClientBridge(JSON.stringify(reqBody));
      });
    }

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

    const fetchInit = {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(reqBody),
      redirect: "follow"
    };
    if (options && options.priority) {
      fetchInit.priority = options.priority;
    }
    const resp = await fetch(endpoint, fetchInit);
    if (!resp.ok) {
      throw new Error("Ralat sambungan pelayan (HTTP " + resp.status + ")");
    }
    return resp.json();
  }

  async function fetchRawCatalogForSupabase(forceRefresh) {
    let rawCatalog = forceRefresh ? [] : getCachedCatalogFallback();
    if (rawCatalog.length === 0 || forceRefresh) {
      try {
        const pubRes = await sendToGasOrPreview({
          action: "publicDashboard",
          forceRefresh: Boolean(forceRefresh),
          deviceId: portalState.deviceId
        });
        if (pubRes && pubRes.ok && Array.isArray(pubRes.catalog)) {
          rawCatalog = pubRes.catalog;
          portalState.rawOpenCatalog = pubRes.catalog;
        }
      } catch (e) {}
    }
    return rawCatalog;
  }

  function resolveCurrentLbIdentity() {
    if (portalState.sessionToken && portalState.sessionToken.indexOf("sbpin_") === 0 && portalState.user) {
      return {
        userKey: "pin_" + portalState.user.userId,
        name: portalState.user.buyerName || ""
      };
    }
    try {
      const lbId = localStorage.getItem(SYNC_LB_ID_KEY) || "";
      if (lbId) {
        return {
          userKey: lbId,
          name: (portalState.user && portalState.user.buyerName) || ""
        };
      }
    } catch (e) {}
    return { userKey: "", name: "" };
  }

  async function callBackend(action, payload, options) {
    const reqBody = Object.assign({}, payload || {}, {
      action: action,
      deviceId: portalState.deviceId,
      sessionToken: portalState.sessionToken || undefined
    });

    if (isSupabaseConfigured()) {
      const isSbPinSession = Boolean(portalState.sessionToken && String(portalState.sessionToken).indexOf("sbpin_") === 0);

      if (action === "getLeaderboard") {
        const me = resolveCurrentLbIdentity();
        return sbFetchLeaderboard(reqBody.period || "all", reqBody.subject || "ALL", me.userKey, me.name);
      }

      if (action === "login") {
        const auth = await sbLoginWithBuyerPin(reqBody.userId, reqBody.pin, portalState.deviceId);
        if (!auth || !auth.ok) {
          const isLocalPreview = typeof window !== "undefined" &&
            /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || "");
          if (isLocalPreview && !(auth && auth.rateLimited)) {
            return sendToGasOrPreview(reqBody, options);
          }
          return auth;
        }
        const pinDash = await sbGetPinDashboardData(auth.sessionToken, portalState.deviceId);
        if (!pinDash || !pinDash.ok) return pinDash;
        const rawCat = await fetchRawCatalogForSupabase(false);
        const lbRes = await sbFetchLeaderboard("all", "ALL", pinDash.userKey, auth.user.buyerName);
        const bundle = buildPinDashboardBundle(pinDash, rawCat, lbRes && lbRes.ok ? lbRes.leaderboard : null);
        return Object.assign({ sessionToken: auth.sessionToken }, bundle);
      }

      if (action === "dashboard" && isSbPinSession) {
        const pinDash = await sbGetPinDashboardData(portalState.sessionToken, portalState.deviceId);
        if (!pinDash || !pinDash.ok) return pinDash;
        const rawCat = await fetchRawCatalogForSupabase(Boolean(reqBody.forceRefresh));
        const lbRes = await sbFetchLeaderboard(portalState.lbPeriod, portalState.lbSubject, pinDash.userKey, pinDash.user.buyerName);
        return buildPinDashboardBundle(pinDash, rawCat, lbRes && lbRes.ok ? lbRes.leaderboard : null);
      }

      if (action === "saveProgress" && isSbPinSession) {
        return sbSavePinProgress(portalState.sessionToken, portalState.deviceId, reqBody);
      }

      if (action === "clearProgress" && isSbPinSession) {
        return sbClearPinProgress(portalState.sessionToken, portalState.deviceId, reqBody.fileId);
      }

      if (action === "saveScore" && isSbPinSession) {
        const saved = await sbSavePinScore(portalState.sessionToken, portalState.deviceId, reqBody);
        if (!saved || !saved.ok) return saved;
        const rawCat = await fetchRawCatalogForSupabase(false);
        const lbRes = await sbFetchLeaderboard(portalState.lbPeriod, portalState.lbSubject, saved.userKey, saved.user.buyerName);
        return buildPinDashboardBundle(saved, rawCat, lbRes && lbRes.ok ? lbRes.leaderboard : null);
      }

      if (action === "setScoreLeaderboardVisibility" && isSbPinSession) {
        const saved = await sbSetPinScoreLeaderboardVisibility(
          portalState.sessionToken,
          portalState.deviceId,
          reqBody.fileId,
          Boolean(reqBody.showOnLeaderboard)
        );
        if (!saved || !saved.ok) return saved;
        const rawCat = await fetchRawCatalogForSupabase(false);
        const lbRes = await sbFetchLeaderboard(portalState.lbPeriod, portalState.lbSubject, saved.userKey, saved.user.buyerName);
        return buildPinDashboardBundle(saved, rawCat, lbRes && lbRes.ok ? lbRes.leaderboard : null);
      }

      if (action === "publicDashboard") {
        const gasPub = await sendToGasOrPreview(reqBody, options);
        if (gasPub && gasPub.ok) {
          const me = resolveCurrentLbIdentity();
          const lbRes = await sbFetchLeaderboard(portalState.lbPeriod || "all", portalState.lbSubject || "ALL", me.userKey, me.name);
          if (lbRes && lbRes.ok && lbRes.leaderboard) {
            gasPub.leaderboard = lbRes.leaderboard;
          }
        }
        return gasPub;
      }

      if (action === "getQuizHtml" && isSbPinSession) {
        const gasReq = Object.assign({}, reqBody, {
          sessionToken: undefined,
          guestName: (portalState.user && portalState.user.buyerName) || "Pelajar"
        });
        if (reqBody.autoResume && !reqBody.resetStart && portalState.pinProgressStateByFileId) {
          const savedJson = portalState.pinProgressStateByFileId[reqBody.fileId];
          if (savedJson) gasReq.clientSavedStateJson = savedJson;
        }
        return sendToGasOrPreview(gasReq, options);
      }
    }

    return sendToGasOrPreview(reqBody, options);
  }

  // --- [shared/ui/formValidation.js] ---
  /**
   * src/shared/ui/formValidation.js
   * Pengesahan borang mesra pengguna selepas interaksi (:user-invalid + data-error bersyarat + fallback CSS).
   */

  function findErrorEl(el) {
    if (!el || !el.closest) return null;
    const group = el.closest(".field-group, .form-group, .lp-field, .modal-field, .input-wrap, label, div");
    if (!group) return null;
    if (el.id) {
      const byId = document.getElementById(el.id + "Error");
      if (byId) return byId;
    }
    return group.querySelector("[data-error]");
  }

  function syncFieldState(el, forceShow) {
    if (!el || !el.checkValidity) return;
    let userInvalid = false;
    try {
      userInvalid = el.matches(":user-invalid");
    } catch (e) {}
    const invalid = forceShow ? !el.checkValidity() : (userInvalid || el.classList.contains("user-invalid-fallback"));
    el.setAttribute("aria-invalid", invalid ? "true" : "false");

    const errEl = findErrorEl(el);
    if (!errEl) return;
    if (invalid) {
      if (errEl.dataset && errEl.dataset.defaultMsg && !errEl.textContent.trim()) {
        errEl.textContent = errEl.dataset.defaultMsg;
      }
      if (errEl.id) el.setAttribute("aria-describedby", errEl.id);
      errEl.hidden = false;
    } else {
      errEl.hidden = true;
      if (errEl.id && el.getAttribute("aria-describedby") === errEl.id) {
        el.removeAttribute("aria-describedby");
      }
    }
  }

  function initFormValidation() {
    if (initFormValidation._bound) return;
    initFormValidation._bound = true;

    const touched = new WeakSet();
    const supportsUserInvalid = typeof CSS !== "undefined" && CSS.supports("selector(:user-invalid)");

    document.addEventListener("blur", function (e) {
      const el = e.target;
      if (!el || !el.checkValidity || el.type === "hidden" || el.disabled) return;
      if ((el.value || "").trim().length > 0 || touched.has(el)) {
        touched.add(el);
        if (!supportsUserInvalid) {
          el.classList.toggle("user-invalid-fallback", !el.checkValidity());
        }
        syncFieldState(el, false);
      }
    }, true);

    document.addEventListener("input", function (e) {
      const el = e.target;
      if (!el || !el.checkValidity) return;
      if (touched.has(el) || el.getAttribute("aria-invalid") === "true") {
        touched.add(el);
        const valid = el.checkValidity();
        if (!supportsUserInvalid || el.classList.contains("user-invalid-fallback")) {
          el.classList.toggle("user-invalid-fallback", !valid);
        }
        syncFieldState(el, valid ? false : touched.has(el));
      }
    });

    document.addEventListener("invalid", function (e) {
      const el = e.target;
      if (!el || !el.checkValidity) return;
      touched.add(el);
      if (!supportsUserInvalid) el.classList.add("user-invalid-fallback");
      syncFieldState(el, true);
    }, true);

    document.addEventListener("reset", function (e) {
      const form = e.target;
      if (!form || !form.querySelectorAll) return;
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        el.classList.remove("user-invalid-fallback");
        el.removeAttribute("aria-invalid");
        const errEl = findErrorEl(el);
        if (errEl) {
          errEl.hidden = true;
          if (errEl.id && el.getAttribute("aria-describedby") === errEl.id) {
            el.removeAttribute("aria-describedby");
          }
        }
      });
    });
  }

  function setFormBusy(formEl, isBusy, busyLabel) {
    if (!formEl) return;
    const submitBtn = formEl.querySelector('button[type="submit"], input[type="submit"]');
    if (!submitBtn) return;
    if (isBusy) {
      if (!submitBtn.dataset.origLabel) {
        submitBtn.dataset.origLabel = submitBtn.textContent || "";
      }
      submitBtn.disabled = true;
      if (busyLabel) submitBtn.textContent = busyLabel;
    } else {
      submitBtn.disabled = false;
      if (submitBtn.dataset.origLabel) {
        submitBtn.textContent = submitBtn.dataset.origLabel;
      }
    }
  }

  // --- [features/dashboard/openDashboardBuilder.js] ---
  /**
   * src/features/dashboard/openDashboardBuilder.js
   * Pengira kemajuan pembelajaran, XP, streak & gabungan Leaderboard tempatan semasa Mod Akses Terbuka.
   */


  function buildOpenDashboardBundle(rawCatalog, serverLb) {
    const files = Array.isArray(rawCatalog) ? rawCatalog : [];
    const progMap = loadOpenProgressMap();
    const scores = loadOpenScoresList();
    const customName = getOpenStudentName() || "Pelajar";

    const bestByFile = {};
    const attemptCountByFile = {};
    const dateMap = {};
    const weakCounter = {};

    scores.forEach(function (s) {
      if (!s || !s.fileId) return;
      attemptCountByFile[s.fileId] = (attemptCountByFile[s.fileId] || 0) + 1;
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
        attemptCount: attemptCountByFile[f.fileId] || (best ? 1 : 0),
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
      if (s.showOnLeaderboard !== true) return;
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

  // --- [features/catalog/supabaseCatalogCache.js] ---
  /**
   * src/features/catalog/supabaseCatalogCache.js
   * Pembaca pantas cache katalog set soalan dari Supabase RPC (get_cached_quiz_catalog) tanpa melalui kelewatan GAS cold-start.
   */

  function isLocalPreviewHost() {
    const h = (typeof window !== "undefined" && window.location && window.location.hostname) || "";
    return /^(localhost|127\.0\.0\.1)$/i.test(h);
  }

  async function fetchSupabaseCachedCatalog() {
    if (isLocalPreviewHost() || !isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const rpcPromise = supabase.rpc("get_cached_quiz_catalog");
      const timeoutPromise = new Promise(function (resolve) {
        setTimeout(function () { resolve({ data: null, error: new Error("timeout") }); }, 4500);
      });
      const res = await Promise.race([rpcPromise, timeoutPromise]);
      if (!res || res.error || !res.data || !res.data.ok) return null;
      if (!Array.isArray(res.data.catalog) || res.data.catalog.length === 0) return null;
      return {
        ok: true,
        catalog: res.data.catalog,
        syncedAt: res.data.syncedAt || "",
        count: Number(res.data.count || res.data.catalog.length)
      };
    } catch (e) {
      return null;
    }
  }

  // --- [features/auth/openAccessService.js] ---
  /**
   * src/features/auth/openAccessService.js
   * Perkhidmatan Mod Akses Terbuka: suis mod operasi, storan kemajuan/skor setempat & kemasukan terus portal.
   */











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
    const notaPromo = isNotaFreePromoActive();
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-open-access", open ? "true" : "false");
      document.documentElement.setAttribute("data-nota-promo", notaPromo ? "true" : "false");
      document.querySelectorAll("[data-paid-only]").forEach(function (el) {
        el.hidden = open;
      });
      document.querySelectorAll("[data-open-only]").forEach(function (el) {
        el.hidden = !open;
      });
      document.querySelectorAll("[data-nota-promo-only]").forEach(function (el) {
        el.hidden = !notaPromo;
      });
      document.querySelectorAll("[data-nota-std-only]").forEach(function (el) {
        el.hidden = notaPromo;
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

  function isPhoneAppLaunchEnv() {
    if (isNativeCapacitorPlatform()) return true;
    if (typeof window === "undefined") return false;
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      const q = new URLSearchParams(window.location.search || "");
      if (q.get("phoneApp") === "1" || q.get("storeShell") === "1") return true;
    } catch (e) {}
    return false;
  }

  function hasCompletedPhoneWelcome() {
    if (portalState.phoneGuestActive) return true;
    try {
      return localStorage.getItem(PHONE_WELCOME_DONE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markPhoneWelcomeCompleted(done) {
    portalState.phoneGuestActive = Boolean(done);
    try {
      if (done) localStorage.setItem(PHONE_WELCOME_DONE_KEY, "1");
      else localStorage.removeItem(PHONE_WELCOME_DONE_KEY);
    } catch (e) {}
  }

  function isPhoneGuestAllowed() {
    return Boolean(isOpenAccessMode() && isPhoneAppLaunchEnv() && hasCompletedPhoneWelcome());
  }

  function isPortalUserAuthenticated() {
    if (portalState.sessionToken && portalState.user) return true;
    if (portalState.supabaseAuthenticated) return true;
    try {
      return Boolean(localStorage.getItem(SYNC_TOKEN_KEY));
    } catch (e) {
      return false;
    }
  }

  async function enterOpenPortal(forceRefresh) {
    if (!isOpenAccessMode()) {
      window.location.hash = "#login";
      syncRouteMode();
      return;
    }
    if (isPhoneAppLaunchEnv() && !isPortalUserAuthenticated() && !isPhoneGuestAllowed()) {
      portalState.openPortalActive = false;
      window.location.hash = "#login";
      syncRouteMode();
      return;
    }

    portalState.openPortalActive = true;
    const landingView = document.getElementById("landingView");
    const phoneWelcomeView = document.getElementById("phoneWelcomeView");
    const loginView = document.getElementById("loginView");
    const adminView = document.getElementById("adminView");
    const dashboardView = document.getElementById("dashboardView");

    if (landingView) landingView.hidden = true;
    if (phoneWelcomeView) phoneWelcomeView.hidden = true;
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
      let loadedFromCache = false;
      if (!forceRefresh) {
        const cached = await fetchSupabaseCachedCatalog();
        if (cached && cached.ok) {
          portalState.rawOpenCatalog = cached.catalog;
          loadedFromCache = true;
        }
      }
      if (!loadedFromCache) {
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
    }

    const bundle = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard);
    applyDashboardBundle(bundle);
    maybeAutoPull();
    maybeLaunchOnboarding();
  }

  // --- [features/onboarding/studentProfileStore.js] ---
  /**
   * src/features/onboarding/studentProfileStore.js
   * Storan profil pembelajaran pelajar/ibu bapa (localStorage + portalState + penyegerakan awan Supabase)
   * serta penapis pintar katalog kertas & Nota Interaktif mengikut tingkatan dan subjek pilihan.
   */




  const STUDENT_CORE_SUBJECTS_6 = ["Bahasa Melayu", "Bahasa Inggeris", "Matematik", "Sains", "Sejarah", "Pendidikan Islam"];
  const STUDENT_LOWER_SEC_EXTRA = ["Geografi"];
  const STUDENT_SPM_STREAM_PRESETS = {
    teras: [...STUDENT_CORE_SUBJECTS_6],
    sains_tulen: ["Matematik Tambahan", "Fizik", "Kimia", "Biologi"],
    akaun_bisnes: ["Prinsip Perakaunan", "Ekonomi", "Perniagaan"],
    agama_elektif: [
      "Tasawwur Islam", "Pendidikan Al-Quran dan As-Sunnah", "Pendidikan Syariah Islamiah",
      "Usul Al-Din", "Bahasa Arab", "Pendidikan Moral", "Geografi",
      "Sains Komputer", "Reka Cipta", "Sains Sukan", "Sains Rumah Tangga"
    ]
  };

  const VALID_FORM_CODES_ = ["T1", "T2", "T3", "T4", "T5"];
  const VALID_STUDY_FOCUSES_ = ["nota_bab", "kerja_sekolah", "pecutan_exam"];
  const VALID_DAILY_GOALS_ = [10, 15, 30];
  let profileStoreEventsBound_ = false;
  let profileCloudSyncBusy_ = false;

  function resolveStudentProfileKey_() {
    return (typeof STUDENT_PROFILE_STORAGE_KEY === "string" && STUDENT_PROFILE_STORAGE_KEY)
      ? STUDENT_PROFILE_STORAGE_KEY : "etutor_student_profile_v1";
  }
  function normalizeFormCode_(code, fallback) {
    const upper = String(code || "").trim().toUpperCase();
    return VALID_FORM_CODES_.indexOf(upper) !== -1 ? upper : (fallback || "T5");
  }
  function normalizeSubjectKey_(name) {
    return String(name || "").replace(/&amp;/gi, "&").replace(/&/g, " dan ").toLowerCase().replace(/\s+/g, " ").trim();
  }
  function uniqueNonEmptyList_(arr) {
    const out = [], seen = {};
    (Array.isArray(arr) ? arr : []).forEach(function (val) {
      const clean = String(val || "").trim();
      if (clean && !seen[clean]) { seen[clean] = true; out.push(clean); }
    });
    return out;
  }

  function normalizeStudentProfile_(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    const currentForm = normalizeFormCode_(src.currentForm, "T5");
    const cleanForms = [];
    (Array.isArray(src.learningForms) ? src.learningForms : [currentForm]).forEach(function (f) {
      const nf = normalizeFormCode_(f, "");
      if (nf && cleanForms.indexOf(nf) === -1) cleanForms.push(nf);
    });
    if (cleanForms.length === 0) cleanForms.push(currentForm);
    const cleanSubjects = Array.isArray(src.selectedSubjects) ? uniqueNonEmptyList_(src.selectedSubjects) : [...STUDENT_CORE_SUBJECTS_6];
    const done = Boolean(src.onboardingCompleted);
    return {
      displayName: String(src.displayName || "").trim().slice(0, 80),
      role: src.role === "ibu_bapa" ? "ibu_bapa" : "pelajar",
      currentForm: currentForm,
      learningForms: cleanForms,
      selectedSubjects: (cleanSubjects.length === 0 && !done) ? [...STUDENT_CORE_SUBJECTS_6] : cleanSubjects,
      studyFocus: VALID_STUDY_FOCUSES_.indexOf(src.studyFocus) !== -1 ? src.studyFocus : "nota_bab",
      dailyGoalMinutes: VALID_DAILY_GOALS_.indexOf(Number(src.dailyGoalMinutes)) !== -1 ? Number(src.dailyGoalMinutes) : 15,
      onboardingCompleted: done,
      onboardingSkipped: Boolean(src.onboardingSkipped),
      showOnLeaderboard: Boolean(src.showOnLeaderboard),
      updatedAtMs: Math.max(0, Number(src.updatedAtMs) || 0)
    };
  }

  function readStoredStudentProfile_() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(resolveStudentProfileKey_());
        if (raw) return normalizeStudentProfile_(JSON.parse(raw));
      }
    } catch (e) {}
    return normalizeStudentProfile_({});
  }

  function emitStudentProfileUpdated_(profile) {
    if (typeof window === "undefined") return;
    try { window.dispatchEvent(new CustomEvent("etutor:student-profile-updated", { detail: profile })); } catch (e) {}
  }

  function resolveSyncedActiveForm_(profile, currentFilter, forceUseCurrentForm) {
    const forms = Array.isArray(profile.learningForms) ? profile.learningForms : [];
    if (!forceUseCurrentForm && currentFilter === "ALL" && forms.length > 1) return "ALL";
    if (!forceUseCurrentForm && currentFilter && forms.indexOf(currentFilter) !== -1) return currentFilter;
    return forms.indexOf(profile.currentForm) !== -1 ? profile.currentForm : (forms[0] || "T5");
  }

  function initStudentProfileStore() {
    const profile = readStoredStudentProfile_();
    if (!profile.displayName && typeof getOpenStudentName === "function") {
      const fallbackName = getOpenStudentName();
      if (fallbackName) profile.displayName = fallbackName;
    }
    portalState.studentProfile = profile;
    portalState.activeFormFilter = resolveSyncedActiveForm_(profile, portalState.activeFormFilter, false);
    if (typeof window !== "undefined" && !profileStoreEventsBound_) {
      profileStoreEventsBound_ = true;
      window.addEventListener("etutor:cloud-synced", function () { void syncStudentProfileWithCloud(); });
    }
    return profile;
  }

  function getStudentProfile() {
    if (portalState.studentProfile && typeof portalState.studentProfile === "object") return portalState.studentProfile;
    portalState.studentProfile = readStoredStudentProfile_();
    return portalState.studentProfile;
  }

  function saveStudentProfile(patch, opts) {
    const options = opts || {};
    const prev = getStudentProfile();
    const merged = Object.assign({}, prev, patch || {});
    if (!options.preserveTimestamp) merged.updatedAtMs = Date.now();
    const next = normalizeStudentProfile_(merged);

    try { if (typeof localStorage !== "undefined") localStorage.setItem(resolveStudentProfileKey_(), JSON.stringify(next)); } catch (e) {}
    portalState.studentProfile = next;
    portalState.activeFormFilter = resolveSyncedActiveForm_(next, portalState.activeFormFilter, prev.currentForm !== next.currentForm);

    if (patch && Object.prototype.hasOwnProperty.call(patch, "displayName") && typeof setOpenStudentName === "function") {
      setOpenStudentName(next.displayName);
    } else if (next.displayName && !getOpenStudentName() && typeof setOpenStudentName === "function") {
      setOpenStudentName(next.displayName);
    }

    emitStudentProfileUpdated_(next);
    if (portalState.supabaseAuthenticated && !options.skipCloud && typeof sbSaveStudentLearningProfile === "function") {
      sbSaveStudentLearningProfile(next).catch(function () {});
    }
    return next;
  }

  async function syncStudentProfileWithCloud() {
    if (profileCloudSyncBusy_ || !portalState.supabaseAuthenticated || typeof sbGetStudentLearningProfile !== "function") {
      return getStudentProfile();
    }
    profileCloudSyncBusy_ = true;
    try {
      const res = await sbGetStudentLearningProfile();
      if (!res || !res.ok || !res.profile) return getStudentProfile();
      const local = getStudentProfile(), remote = normalizeStudentProfile_(res.profile);
      if (local.onboardingCompleted && (!remote.onboardingCompleted || local.updatedAtMs > remote.updatedAtMs)) {
        if (typeof sbSaveStudentLearningProfile === "function") await sbSaveStudentLearningProfile(local);
        return local;
      }
      if (remote.onboardingCompleted) {
        return saveStudentProfile(Object.assign({}, remote, { onboardingSkipped: false }), { skipCloud: true, preserveTimestamp: true });
      }
      return local;
    } catch (e) {
      return getStudentProfile();
    } finally {
      profileCloudSyncBusy_ = false;
    }
  }

  function buildSelectedSubjectSet_(profile) {
    const set = new Set();
    (Array.isArray(profile && profile.selectedSubjects) ? profile.selectedSubjects : []).forEach(function (s) {
      const key = normalizeSubjectKey_(s);
      if (key) set.add(key);
    });
    return set;
  }

  function getActiveFormFilter() {
    const val = String(portalState.activeFormFilter || "").trim().toUpperCase();
    if (val === "ALL" || VALID_FORM_CODES_.indexOf(val) !== -1) return val;
    const p = getStudentProfile();
    return normalizeFormCode_(p.currentForm || (p.learningForms && p.learningForms[0]), "T5");
  }
  function setActiveFormFilter(formCode) {
    const upper = String(formCode || "").trim().toUpperCase();
    const profile = getStudentProfile();
    portalState.activeFormFilter = upper === "ALL" ? "ALL" : normalizeFormCode_(upper, profile.currentForm);
    emitStudentProfileUpdated_(profile);
    return portalState.activeFormFilter;
  }
  function getShowAllSubjectsOverride() { return Boolean(portalState.showAllSubjectsOverride); }
  function setShowAllSubjectsOverride(enabled) {
    portalState.showAllSubjectsOverride = Boolean(enabled);
    emitStudentProfileUpdated_(getStudentProfile());
    return portalState.showAllSubjectsOverride;
  }
  function isLowerSecFormCode(formCode) {
    const upper = String(formCode || "").trim().toUpperCase();
    return upper === "T1" || upper === "T2" || upper === "T3";
  }
  function hasAnySpmLearningForm(profile) {
    const p = profile || getStudentProfile(), active = getActiveFormFilter();
    if (active === "T4" || active === "T5") return true;
    return active === "ALL" && Array.isArray(p.learningForms) && p.learningForms.some(function (f) { return f === "T4" || f === "T5"; });
  }

  function filterCatalogItemsForStudent(items) {
    const list = Array.isArray(items) ? items : [];
    const profile = getStudentProfile(), active = getActiveFormFilter();
    if (isLowerSecFormCode(active)) {
      const targetNum = active.slice(1);
      return list.filter(function (item) { return String((item && item.form) || "").replace(/^T/i, "").trim() === targetNum; });
    }
    if (getShowAllSubjectsOverride()) return list;
    if (active === "ALL" && !hasAnySpmLearningForm(profile)) {
      const forms = Array.isArray(profile.learningForms) ? profile.learningForms : [];
      return list.filter(function (item) {
        const f = String((item && item.form) || "").replace(/^T/i, "").trim();
        return f && forms.indexOf("T" + f) !== -1;
      });
    }
    if (profile.onboardingCompleted && Array.isArray(profile.selectedSubjects) && profile.selectedSubjects.length > 0) {
      const selectedSet = buildSelectedSubjectSet_(profile);
      return list.filter(function (item) { return item && selectedSet.has(normalizeSubjectKey_(item.subject)); });
    }
    return list;
  }

  function filterNotaItemsForStudent(items) {
    const list = Array.isArray(items) ? items : [];
    const profile = getStudentProfile(), active = getActiveFormFilter();
    const filterBySubject = Boolean(profile.onboardingCompleted && !getShowAllSubjectsOverride() && Array.isArray(profile.selectedSubjects) && profile.selectedSubjects.length > 0);
    const selectedSet = filterBySubject ? buildSelectedSubjectSet_(profile) : null;
    const targetNum = active !== "ALL" ? active.replace(/^T/i, "") : "";
    const allowedForms = Array.isArray(profile.learningForms) ? profile.learningForms : [];
    return list.filter(function (item) {
      if (!item) return false;
      const itemFormNum = String(item.form || "").replace(/^T/i, "").trim();
      if (active !== "ALL" ? itemFormNum !== targetNum : allowedForms.indexOf("T" + itemFormNum) === -1) return false;
      return !selectedSet || selectedSet.has(normalizeSubjectKey_(item.subject));
    });
  }

  // --- [features/onboarding/onboardingWizardController.js] ---
  /**
   * src/features/onboarding/onboardingWizardController.js
   * Pengawal Panduan Permulaan 5-Langkah gaya Duolingo (#onboardingWizardDialog).
   */




  const ONB_WIZ_FORMS = ["T1", "T2", "T3", "T4", "T5"];
  const ONB_WIZ_META = {
    1: ["Siapa nama panggilan anda?", "Kami akan sesuaikan ucapan, nota dan latihan mengikut profil anda."],
    2: ["Anda di tingkatan mana sekarang?", "Pilih tingkatan semasa untuk tetapan asas ruang belajar anda."],
    3: ["Ingin belajar tingkatan mana?", "Boleh pilih lebih daripada satu tingkatan untuk ulang kaji menyeluruh."],
    4: ["Pilih subjek pilihan anda", "Kami akan tapis nota dan set soalan supaya anda fokus pada subjek anda sahaja."],
    5: ["Apa fokus & sasaran harian anda?", "Tetapkan matlamat kecil harian yang konsisten menuju kecemerlangan."]
  };
  const onbWizState = {
    bound: false, step: 1, completing: false, autoLaunchedOnce: false,
    step3Touched: false, step4Touched: false, finishTimer: null, draft: null
  };

  function onbWizMergeUnique_(a, b) {
    const seen = {}, out = [];
    [a || [], b || []].forEach(function (arr) {
      arr.forEach(function (v) {
        const s = String(v || "").trim();
        if (s && !seen[s]) { seen[s] = true; out.push(s); }
      });
    });
    return out;
  }

  function onbWizBuildDraft_(p) {
    const src = p || {};
    const cur = ONB_WIZ_FORMS.indexOf(src.currentForm) !== -1 ? src.currentForm : "T5";
    const lf = (Array.isArray(src.learningForms) ? src.learningForms : []).filter(function (f) { return ONB_WIZ_FORMS.indexOf(f) !== -1; });
    const subs = Array.isArray(src.selectedSubjects) && src.selectedSubjects.length > 0 ? src.selectedSubjects.slice() : (STUDENT_CORE_SUBJECTS_6 || []).slice();
    return {
      displayName: String(src.displayName || "").trim().slice(0, 80),
      role: src.role === "ibu_bapa" ? "ibu_bapa" : "pelajar",
      currentForm: cur,
      learningForms: lf.length > 0 ? lf : [cur],
      selectedSubjects: subs,
      studyFocus: ["nota_bab", "kerja_sekolah", "pecutan_exam"].indexOf(src.studyFocus) !== -1 ? src.studyFocus : "nota_bab",
      dailyGoalMinutes: [10, 15, 30].indexOf(Number(src.dailyGoalMinutes)) !== -1 ? Number(src.dailyGoalMinutes) : 15
    };
  }

  function onbWizSyncPressed_(sel, pred) {
    document.querySelectorAll(sel).forEach(function (el) { el.setAttribute("aria-pressed", pred(el) ? "true" : "false"); });
  }

  function onbWizSetErr_(msg) {
    const el = document.getElementById("onbValidationMsg");
    if (!el) return;
    el.textContent = msg || "";
    el.hidden = !msg;
  }

  function onbWizRenderStep4_() {
    const d = onbWizState.draft, presets = STUDENT_SPM_STREAM_PRESETS || {};
    const presetsWrap = document.getElementById("onbStreamPresetsWrap");
    if (presetsWrap) presetsWrap.hidden = !d.learningForms.some(function (f) { return f === "T4" || f === "T5"; });
    onbWizSyncPressed_(".js-onb-preset", function (btn) {
      const key = btn.getAttribute("data-onb-preset");
      const target = key === "teras" ? (STUDENT_CORE_SUBJECTS_6 || []) : onbWizMergeUnique_(STUDENT_CORE_SUBJECTS_6, presets[key] || []);
      return target.length === d.selectedSubjects.length && target.every(function (s) { return d.selectedSubjects.indexOf(s) !== -1; });
    });
    const allSubs = onbWizMergeUnique_(
      onbWizMergeUnique_(STUDENT_CORE_SUBJECTS_6, STUDENT_LOWER_SEC_EXTRA),
      onbWizMergeUnique_(onbWizMergeUnique_(presets.teras, presets.sains_tulen), onbWizMergeUnique_(presets.akaun_bisnes, presets.agama_elektif))
    );
    const grid = document.getElementById("onbSubjectsGrid");
    if (grid) {
      grid.innerHTML = onbWizMergeUnique_(allSubs, d.selectedSubjects).map(function (sub) {
        const p = d.selectedSubjects.indexOf(sub) !== -1 ? "true" : "false";
        return '<button type="button" class="et-onb-subj-chip js-onb-subj-chip" data-onb-subject="' + escapeHtml(sub) + '" aria-pressed="' + p + '">' + escapeHtml(sub) + "</button>";
      }).join("");
    }
    const hint = document.getElementById("onbSubjectCountHint");
    if (hint) hint.textContent = d.selectedSubjects.length + " subjek dipilih";
  }

  function onbWizRenderStep_() {
    const step = onbWizState.step, d = onbWizState.draft;
    if (!d) return;
    const pct = step * 20, meta = ONB_WIZ_META[step] || ONB_WIZ_META[1];
    const fill = document.getElementById("onbProgressFill"), track = document.getElementById("onbProgressTrack");
    const counter = document.getElementById("onbStepCounter"), backBtn = document.getElementById("onbBackBtn");
    const titleEl = document.getElementById("onbStepTitle"), subEl = document.getElementById("onbStepSub");
    const nextLbl = document.getElementById("onbNextBtnLabel");
    if (fill) fill.style.width = pct + "%";
    if (track) track.setAttribute("aria-valuenow", String(pct));
    if (counter) counter.textContent = step + "/5";
    if (backBtn) backBtn.hidden = step <= 1;
    if (titleEl) titleEl.textContent = meta[0];
    if (subEl) subEl.textContent = meta[1];
    if (nextLbl) nextLbl.textContent = step === 5 ? "Sediakan Ruang Belajar" : "Teruskan";
    onbWizSetErr_("");
    document.querySelectorAll("[data-onb-step]").forEach(function (el) { el.hidden = Number(el.getAttribute("data-onb-step")) !== step; });
    const inp = document.getElementById("onbNameInput");
    if (inp && step === 1 && inp.value !== d.displayName) inp.value = d.displayName;
    onbWizSyncPressed_(".js-onb-role-card", function (b) { return b.getAttribute("data-onb-role") === d.role; });
    onbWizSyncPressed_(".js-onb-current-form", function (b) { return b.getAttribute("data-onb-current-form") === d.currentForm; });
    onbWizSyncPressed_(".js-onb-learn-form", function (b) { return d.learningForms.indexOf(b.getAttribute("data-onb-learn-form")) !== -1; });
    onbWizSyncPressed_(".js-onb-focus-card", function (b) { return b.getAttribute("data-onb-focus") === d.studyFocus; });
    onbWizSyncPressed_(".js-onb-goal-card", function (b) { return Number(b.getAttribute("data-onb-goal")) === d.dailyGoalMinutes; });
    if (step === 4) onbWizRenderStep4_();
  }

  function onbWizFinish_(dlg) {
    if (onbWizState.completing) return;
    const d = onbWizState.draft;
    onbWizState.completing = true;
    const overlay = document.getElementById("onbCompletionOverlay"), txt = document.getElementById("onbCompletionText");
    if (txt) txt.textContent = "Menyediakan ruang belajar untuk " + (d.displayName || "Pelajar") + "...";
    if (overlay) overlay.hidden = false;
    saveStudentProfile({
      displayName: d.displayName, role: d.role, currentForm: d.currentForm,
      learningForms: d.learningForms.slice(), selectedSubjects: d.selectedSubjects.slice(),
      studyFocus: d.studyFocus, dailyGoalMinutes: d.dailyGoalMinutes,
      onboardingCompleted: true, onboardingSkipped: false
    });
    clearTimeout(onbWizState.finishTimer);
    onbWizState.finishTimer = setTimeout(function () {
      onbWizState.completing = false;
      if (overlay) overlay.hidden = true;
      closeTopLayer(dlg);
    }, 900);
  }

  function onbWizAdvance_(dlg) {
    const d = onbWizState.draft;
    if (onbWizState.step === 1) {
      const inp = document.getElementById("onbNameInput");
      d.displayName = inp ? String(inp.value || "").trim().slice(0, 80) : d.displayName;
      onbWizState.step = 2;
    } else if (onbWizState.step === 2) {
      if (!onbWizState.step3Touched) d.learningForms = [d.currentForm];
      else if (d.learningForms.indexOf(d.currentForm) === -1) d.learningForms = [d.currentForm].concat(d.learningForms);
      onbWizState.step = 3;
    } else if (onbWizState.step === 3) {
      if (d.learningForms.length === 0) return onbWizSetErr_("Sila pilih sekurang-kurangnya satu tingkatan.");
      const hasLower = d.learningForms.some(isLowerSecFormCode);
      if (!onbWizState.step4Touched || d.selectedSubjects.length === 0) d.selectedSubjects = onbWizMergeUnique_(d.selectedSubjects, STUDENT_CORE_SUBJECTS_6);
      if (hasLower) d.selectedSubjects = onbWizMergeUnique_(d.selectedSubjects, STUDENT_LOWER_SEC_EXTRA);
      onbWizState.step = 4;
    } else if (onbWizState.step === 4) {
      if (d.selectedSubjects.length === 0) return onbWizSetErr_("Sila pilih sekurang-kurangnya satu subjek.");
      onbWizState.step = 5;
    } else {
      return onbWizFinish_(dlg);
    }
    onbWizRenderStep_();
  }

  function initStudentOnboardingWizard() {
    const dlg = document.getElementById("onboardingWizardDialog");
    if (!dlg || onbWizState.bound) return;
    onbWizState.bound = true;
    bindLightDismissFallback(dlg);
    dlg.addEventListener("cancel", function (ev) { ev.preventDefault(); if (!onbWizState.completing) closeTopLayer(dlg); });

    dlg.addEventListener("click", function (ev) {
      const d = onbWizState.draft;
      if (onbWizState.completing || !d) return;
      if (ev.target.closest("#onbBackBtn") && onbWizState.step > 1) { onbWizState.step -= 1; return onbWizRenderStep_(); }
      if (ev.target.closest("#onbSkipBtn")) { saveStudentProfile({ onboardingSkipped: true }, { skipCloud: true }); return closeTopLayer(dlg); }
      if (ev.target.closest("#onbNextBtn")) return onbWizAdvance_(dlg);
      const roleBtn = ev.target.closest(".js-onb-role-card");
      if (roleBtn) { d.role = roleBtn.getAttribute("data-onb-role") === "ibu_bapa" ? "ibu_bapa" : "pelajar"; return onbWizRenderStep_(); }
      const curBtn = ev.target.closest(".js-onb-current-form");
      if (curBtn) { d.currentForm = curBtn.getAttribute("data-onb-current-form") || "T5"; return onbWizRenderStep_(); }
      const lfBtn = ev.target.closest(".js-onb-learn-form");
      if (lfBtn) {
        const code = lfBtn.getAttribute("data-onb-learn-form"), idx = d.learningForms.indexOf(code);
        onbWizState.step3Touched = true;
        if (idx === -1) d.learningForms.push(code); else d.learningForms.splice(idx, 1);
        return onbWizRenderStep_();
      }
      const presetBtn = ev.target.closest(".js-onb-preset");
      if (presetBtn) {
        const key = presetBtn.getAttribute("data-onb-preset"), presets = STUDENT_SPM_STREAM_PRESETS || {};
        onbWizState.step4Touched = true;
        d.selectedSubjects = key === "teras" ? (STUDENT_CORE_SUBJECTS_6 || []).slice() : onbWizMergeUnique_(STUDENT_CORE_SUBJECTS_6, presets[key] || []);
        return onbWizRenderStep_();
      }
      const subBtn = ev.target.closest(".js-onb-subj-chip");
      if (subBtn) {
        const sub = subBtn.getAttribute("data-onb-subject"), idx = d.selectedSubjects.indexOf(sub);
        onbWizState.step4Touched = true;
        if (idx === -1) d.selectedSubjects.push(sub); else d.selectedSubjects.splice(idx, 1);
        return onbWizRenderStep_();
      }
      const focBtn = ev.target.closest(".js-onb-focus-card");
      if (focBtn) { d.studyFocus = focBtn.getAttribute("data-onb-focus") || "nota_bab"; return onbWizRenderStep_(); }
      const goalBtn = ev.target.closest(".js-onb-goal-card");
      if (goalBtn) { d.dailyGoalMinutes = Number(goalBtn.getAttribute("data-onb-goal")) || 15; onbWizRenderStep_(); }
    });
  }

  function openOnboardingWizard(opts) {
    const dlg = document.getElementById("onboardingWizardDialog");
    if (!dlg) return;
    initStudentOnboardingWizard();
    onbWizState.draft = onbWizBuildDraft_(getStudentProfile());
    if (!opts || opts.forceResetStep) { onbWizState.step = 1; onbWizState.step3Touched = false; onbWizState.step4Touched = false; }
    onbWizState.completing = false;
    const overlay = document.getElementById("onbCompletionOverlay");
    if (overlay) overlay.hidden = true;
    onbWizRenderStep_();
    if (!dlg.open) {
      dlg.removeAttribute("data-closing");
      bindLightDismissFallback(dlg);
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    }
  }

  function maybeLaunchOnboarding() {
    if (onbWizState.autoLaunchedOnce) return false;
    const dlg = document.getElementById("onboardingWizardDialog"), profile = getStudentProfile();
    if (!dlg || dlg.open || !profile || profile.onboardingCompleted || profile.onboardingSkipped) return false;
    try {
      const qs = new URLSearchParams(window.location.search || "");
      if ((qs.get("set") || qs.get("klon") || qs.get("nota") || qs.get("fileId") || "").trim()) return false;
    } catch (e) {}
    const hash = String(window.location.hash || "").toLowerCase();
    if (hash.indexOf("#admin") === 0 || hash === "#login" || portalState.activeQuizFileId || portalState.activeNotaId) return false;
    const isVis = function (id) { const el = document.getElementById(id); return Boolean(el && !el.hidden); };
    if (isVis("loginView") || isVis("adminView") || isVis("examStage") || isVis("notaStage") || isVis("phoneWelcomeView") || isVis("landingView")) return false;
    if ((!isVis("dashboardView") && !isVis("phoneAppShell")) || document.querySelector("dialog[open]")) return false;
    onbWizState.autoLaunchedOnce = true;
    openOnboardingWizard({ forceResetStep: true });
    return true;
  }

  // --- [features/onboarding/studentSettingsController.js] ---
  /**
   * src/features/onboarding/studentSettingsController.js
   * Pengawal Dialog Tetapan Pembelajaran Pelajar (#studentSettingsDialog) untuk kemas kini profil secara langsung.
   */










  const STD_SET_FORMS = ["T1", "T2", "T3", "T4", "T5"];
  const stdSetState = { bound: false, learnFormsTouched: false, subjectsTouched: false, draft: null };

  function stdSetMergeUnique_(a, b) {
    const seen = {}, out = [];
    [a || [], b || []].forEach(function (arr) {
      arr.forEach(function (v) {
        const s = String(v || "").trim();
        if (s && !seen[s]) { seen[s] = true; out.push(s); }
      });
    });
    return out;
  }

  function stdSetSyncPressed_(sel, pred) {
    document.querySelectorAll(sel).forEach(function (el) { el.setAttribute("aria-pressed", pred(el) ? "true" : "false"); });
  }

  function stdSetBuildDraft_(p) {
    const src = p || {};
    const cur = STD_SET_FORMS.indexOf(src.currentForm) !== -1 ? src.currentForm : "T5";
    const lf = (Array.isArray(src.learningForms) ? src.learningForms : []).filter(function (f) { return STD_SET_FORMS.indexOf(f) !== -1; });
    const subs = Array.isArray(src.selectedSubjects) && src.selectedSubjects.length > 0 ? src.selectedSubjects.slice() : (STUDENT_CORE_SUBJECTS_6 || []).slice();
    let showLb = Boolean(src.showOnLeaderboard);
    if (!src.updatedAtMs && isOpenAccessMode()) showLb = loadOpenScoresList().some(function (s) { return Boolean(s && s.showOnLeaderboard); });
    return {
      displayName: String(src.displayName || "").trim().slice(0, 80),
      role: src.role === "ibu_bapa" ? "ibu_bapa" : "pelajar",
      currentForm: cur,
      learningForms: lf.length > 0 ? lf : [cur],
      selectedSubjects: subs,
      studyFocus: ["nota_bab", "kerja_sekolah", "pecutan_exam"].indexOf(src.studyFocus) !== -1 ? src.studyFocus : "nota_bab",
      dailyGoalMinutes: [10, 15, 30].indexOf(Number(src.dailyGoalMinutes)) !== -1 ? Number(src.dailyGoalMinutes) : 15,
      showOnLeaderboard: showLb
    };
  }

  function stdSetShowError_(msg) {
    const el = document.getElementById("stdSetErrorMsg");
    if (!el) return;
    el.textContent = msg || "";
    el.hidden = !msg;
  }

  function stdSetApplySmartSubjects_() {
    const d = stdSetState.draft;
    if (!d || stdSetState.subjectsTouched) return;
    const hasSpm = d.learningForms.some(function (f) { return f === "T4" || f === "T5"; });
    const hasLower = d.learningForms.some(isLowerSecFormCode);
    if (hasLower && !hasSpm) {
      d.selectedSubjects = stdSetMergeUnique_(STUDENT_CORE_SUBJECTS_6, STUDENT_LOWER_SEC_EXTRA);
    } else if (hasLower) {
      d.selectedSubjects = stdSetMergeUnique_(d.selectedSubjects, STUDENT_LOWER_SEC_EXTRA);
    }
  }

  function stdSetRenderDialog_() {
    const d = stdSetState.draft;
    if (!d) return;
    const nameInp = document.getElementById("stdSetNameInput");
    if (nameInp && nameInp.value !== d.displayName) nameInp.value = d.displayName;
    const lbToggle = document.getElementById("stdSetLeaderboardToggle");
    if (lbToggle) lbToggle.checked = Boolean(d.showOnLeaderboard);

    stdSetSyncPressed_(".js-std-role-pill", function (b) { return b.getAttribute("data-std-role") === d.role; });
    stdSetSyncPressed_(".js-std-cur-form", function (b) { return b.getAttribute("data-std-current-form") === d.currentForm; });
    stdSetSyncPressed_(".js-std-learn-form", function (b) { return d.learningForms.indexOf(b.getAttribute("data-std-learn-form")) !== -1; });
    stdSetSyncPressed_(".js-std-focus-pill", function (b) { return b.getAttribute("data-std-focus") === d.studyFocus; });
    stdSetSyncPressed_(".js-std-goal-pill", function (b) { return Number(b.getAttribute("data-std-goal")) === d.dailyGoalMinutes; });

    const presets = STUDENT_SPM_STREAM_PRESETS || {};
    const presetRow = document.getElementById("stdSetStreamPresets");
    if (presetRow) presetRow.hidden = !d.learningForms.some(function (f) { return f === "T4" || f === "T5"; });
    stdSetSyncPressed_(".js-std-preset", function (btn) {
      const key = btn.getAttribute("data-std-preset");
      const target = key === "teras" ? (STUDENT_CORE_SUBJECTS_6 || []) : stdSetMergeUnique_(STUDENT_CORE_SUBJECTS_6, presets[key] || []);
      return target.length === d.selectedSubjects.length && target.every(function (s) { return d.selectedSubjects.indexOf(s) !== -1; });
    });

    const allSubs = stdSetMergeUnique_(
      stdSetMergeUnique_(STUDENT_CORE_SUBJECTS_6, STUDENT_LOWER_SEC_EXTRA),
      stdSetMergeUnique_(stdSetMergeUnique_(presets.teras, presets.sains_tulen), stdSetMergeUnique_(presets.akaun_bisnes, presets.agama_elektif))
    );
    const subGrid = document.getElementById("stdSetSubjectsGrid");
    if (subGrid) {
      subGrid.innerHTML = stdSetMergeUnique_(allSubs, d.selectedSubjects).map(function (sub) {
        const p = d.selectedSubjects.indexOf(sub) !== -1 ? "true" : "false";
        return '<button type="button" class="et-onb-subj-chip js-std-subj-chip" data-std-subject="' + escapeHtml(sub) + '" aria-pressed="' + p + '">' + escapeHtml(sub) + "</button>";
      }).join("");
    }
    const countHint = document.getElementById("stdSetSubjectCountHint");
    if (countHint) countHint.textContent = d.selectedSubjects.length + " subjek dipilih";
  }

  function stdSetSaveAndClose_(dlg) {
    const d = stdSetState.draft;
    if (!d) return;
    const nameInp = document.getElementById("stdSetNameInput"), lbToggle = document.getElementById("stdSetLeaderboardToggle");
    d.displayName = nameInp ? String(nameInp.value || "").trim().slice(0, 80) : d.displayName;
    d.showOnLeaderboard = lbToggle ? Boolean(lbToggle.checked) : Boolean(d.showOnLeaderboard);
    if (d.learningForms.length === 0) return stdSetShowError_("Sila pilih sekurang-kurangnya satu tingkatan untuk belajar.");
    if (d.selectedSubjects.length === 0) return stdSetShowError_("Sila pilih sekurang-kurangnya satu subjek pilihan.");
    stdSetShowError_("");

    if (isOpenAccessMode()) {
      const scores = loadOpenScoresList();
      let changed = false;
      scores.forEach(function (s) {
        if (s && Boolean(s.showOnLeaderboard) !== d.showOnLeaderboard) { s.showOnLeaderboard = d.showOnLeaderboard; changed = true; }
      });
      if (changed) saveOpenScoresList(scores);
    }
    saveStudentProfile({
      displayName: d.displayName, role: d.role, currentForm: d.currentForm,
      learningForms: d.learningForms.slice(), selectedSubjects: d.selectedSubjects.slice(),
      studyFocus: d.studyFocus, dailyGoalMinutes: d.dailyGoalMinutes,
      showOnLeaderboard: d.showOnLeaderboard, onboardingCompleted: true, onboardingSkipped: false
    });
    if (isOpenAccessMode() && Array.isArray(portalState.rawOpenCatalog) && portalState.rawOpenCatalog.length > 0) {
      const bundle = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard);
      portalState.user = bundle.user;
      portalState.leaderboard = bundle.leaderboard;
      renderLeaderboardSection();
    }
    renderHeaderUser();
    closeTopLayer(dlg);
    showToast("Tetapan pembelajaran anda dikemas kini.");
  }

  function initStudentSettingsDialog() {
    const dlg = document.getElementById("studentSettingsDialog");
    if (!dlg || stdSetState.bound) return;
    stdSetState.bound = true;
    bindLightDismissFallback(dlg);
    document.addEventListener("click", function (ev) { if (ev.target.closest("#openStudentSettingsBtn")) openStudentSettingsDialog(); });
    dlg.addEventListener("cancel", function (ev) { ev.preventDefault(); closeTopLayer(dlg); });

    dlg.addEventListener("click", async function (ev) {
      const d = stdSetState.draft;
      if (ev.target.closest("#stdSetCloseBtn") || ev.target.closest("#stdSetCancelBtn")) return closeTopLayer(dlg);
      if (ev.target.closest("#stdSetSaveBtn")) return stdSetSaveAndClose_(dlg);
      if (ev.target.closest("#stdSetRestartOnbBtn")) { await closeTopLayer(dlg); return openOnboardingWizard({ forceResetStep: true }); }
      if (!d) return;

      const roleBtn = ev.target.closest(".js-std-role-pill");
      if (roleBtn) { d.role = roleBtn.getAttribute("data-std-role") === "ibu_bapa" ? "ibu_bapa" : "pelajar"; return stdSetRenderDialog_(); }
      const curBtn = ev.target.closest(".js-std-cur-form");
      if (curBtn) {
        d.currentForm = curBtn.getAttribute("data-std-current-form") || "T5";
        if (!stdSetState.learnFormsTouched) d.learningForms = [d.currentForm];
        else if (d.learningForms.indexOf(d.currentForm) === -1) d.learningForms.push(d.currentForm);
        stdSetApplySmartSubjects_();
        return stdSetRenderDialog_();
      }
      const lfBtn = ev.target.closest(".js-std-learn-form");
      if (lfBtn) {
        const code = lfBtn.getAttribute("data-std-learn-form"), idx = d.learningForms.indexOf(code);
        stdSetState.learnFormsTouched = true;
        if (idx === -1) d.learningForms.push(code); else d.learningForms.splice(idx, 1);
        stdSetApplySmartSubjects_();
        return stdSetRenderDialog_();
      }
      const presetBtn = ev.target.closest(".js-std-preset");
      if (presetBtn) {
        const key = presetBtn.getAttribute("data-std-preset"), presets = STUDENT_SPM_STREAM_PRESETS || {};
        stdSetState.subjectsTouched = true;
        d.selectedSubjects = key === "teras" ? (STUDENT_CORE_SUBJECTS_6 || []).slice() : stdSetMergeUnique_(STUDENT_CORE_SUBJECTS_6, presets[key] || []);
        return stdSetRenderDialog_();
      }
      const subBtn = ev.target.closest(".js-std-subj-chip");
      if (subBtn) {
        const sub = subBtn.getAttribute("data-std-subject"), idx = d.selectedSubjects.indexOf(sub);
        stdSetState.subjectsTouched = true;
        if (idx === -1) d.selectedSubjects.push(sub); else d.selectedSubjects.splice(idx, 1);
        return stdSetRenderDialog_();
      }
      const focBtn = ev.target.closest(".js-std-focus-pill");
      if (focBtn) { d.studyFocus = focBtn.getAttribute("data-std-focus") || "nota_bab"; return stdSetRenderDialog_(); }
      const goalBtn = ev.target.closest(".js-std-goal-pill");
      if (goalBtn) { d.dailyGoalMinutes = Number(goalBtn.getAttribute("data-std-goal")) || 15; stdSetRenderDialog_(); }
    });
  }

  function openStudentSettingsDialog() {
    const dlg = document.getElementById("studentSettingsDialog");
    if (!dlg) return;
    initStudentSettingsDialog();
    if (dlg.open) return;
    stdSetState.learnFormsTouched = false;
    stdSetState.subjectsTouched = false;
    stdSetState.draft = stdSetBuildDraft_(getStudentProfile());
    stdSetShowError_("");
    stdSetRenderDialog_();
    dlg.removeAttribute("data-closing");
    bindLightDismissFallback(dlg);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  // --- [features/dashboard/portalModuleDropdowns.js] ---
  /**
   * src/features/dashboard/portalModuleDropdowns.js
   * Pengawal dropdown akordion kategori modul, penyesuaian pelajar & ringkasan KPI pada pengepala.
   */




  let syncingDropdownState = false;
  let dropdownListenersBound = false;

  function getPortalPrefsSafe() {
    if (!portalState.portalPrefs) {
      portalState.portalPrefs = loadPortalPrefs();
    }
    return portalState.portalPrefs;
  }

  function getAllModuleDropdowns() {
    return Array.prototype.slice.call(document.querySelectorAll("details.portal-module-dropdown[data-module-id]"));
  }

  function applyPortalPreferencesToDom() {
    const prefs = getPortalPrefsSafe();
    portalState.activeStage = prefs.stage || "spm";
    syncingDropdownState = true;
    try {
      getAllModuleDropdowns().forEach(function (el) {
        const mid = el.getAttribute("data-module-id");
        const isVisible = Boolean(prefs.visibleModules && prefs.visibleModules[mid]);
        el.hidden = !isVisible;
        if (!isVisible) {
          el.open = false;
        } else if (prefs.singleOpenAccordion) {
          el.open = mid === prefs.openModuleId;
        }
      });

      document.querySelectorAll(".js-toggle-module-vis").forEach(function (btn) {
        const mid = btn.getAttribute("data-module-id");
        const active = Boolean(prefs.visibleModules && prefs.visibleModules[mid]);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });

      const accBtn = document.getElementById("toggleSingleAccordionBtn");
      if (accBtn) {
        accBtn.setAttribute("aria-pressed", prefs.singleOpenAccordion ? "true" : "false");
      }

      document.querySelectorAll(".js-stage-pill").forEach(function (btn) {
        const sid = btn.getAttribute("data-stage-id");
        btn.setAttribute("aria-pressed", sid === prefs.stage ? "true" : "false");
      });
    } finally {
      syncingDropdownState = false;
    }
  }

  function openPortalModuleDropdown(moduleId) {
    if (!moduleId) return;
    const prefs = getPortalPrefsSafe();
    if (prefs.visibleModules && !prefs.visibleModules[moduleId]) {
      prefs.visibleModules[moduleId] = true;
    }
    prefs.openModuleId = moduleId;
    savePortalPrefs(prefs);

    syncingDropdownState = true;
    try {
      getAllModuleDropdowns().forEach(function (el) {
        const mid = el.getAttribute("data-module-id");
        if (mid === moduleId) {
          el.hidden = false;
          el.open = true;
        } else if (prefs.singleOpenAccordion) {
          el.open = false;
        }
      });
    } finally {
      syncingDropdownState = false;
    }
  }

  function syncPortalDropdownSummaries() {
    applyPortalPreferencesToDom();
    const cat = portalState.catalog || [];
    let klonCount = 0;
    let praCount = 0;
    cat.forEach(function (c) {
      if (c.category === "klon") klonCount++;
      else praCount++;
    });

    const klonPill = document.getElementById("klonSummaryPill");
    if (klonPill && cat.length > 0) {
      klonPill.textContent = klonCount + " set klon";
    }

    const praPill = document.getElementById("praSpmSummaryPill");
    if (praPill && cat.length > 0) {
      praPill.textContent = praCount + " set";
    }

    const notaPill = document.getElementById("notaSummaryPill");
    if (notaPill) {
      notaPill.textContent = getNotaCatalogList().length + " bab interaktif";
    }

    const ps = portalState.progressSummary;
    const progPill = document.getElementById("progressSummaryPill");
    if (progPill && ps) {
      const pct = Number(ps.completionPercentage) || 0;
      const xp = Number(ps.totalXp || 0).toLocaleString("en-MY");
      progPill.textContent = pct + "% siap • " + xp + " XP";
    }

    const lb = portalState.leaderboard;
    const lbPill = document.getElementById("leaderboardSummaryPill");
    if (lbPill && lb) {
      const total = Number(lb.totalParticipants) || 0;
      lbPill.textContent = total > 0 ? (total + " peserta") : "Top 10 Aktif";
    }
  }

  function initPortalModuleDropdowns() {
    applyPortalPreferencesToDom();
    if (dropdownListenersBound) return;
    dropdownListenersBound = true;

    getAllModuleDropdowns().forEach(function (el) {
      el.addEventListener("toggle", function () {
        if (syncingDropdownState) return;
        const mid = el.getAttribute("data-module-id");
        const prefs = getPortalPrefsSafe();
        if (el.open) {
          prefs.openModuleId = mid;
          savePortalPrefs(prefs);
          if (prefs.singleOpenAccordion) {
            syncingDropdownState = true;
            try {
              getAllModuleDropdowns().forEach(function (other) {
                if (other !== el) other.open = false;
              });
            } finally {
              syncingDropdownState = false;
            }
          }
        } else if (prefs.openModuleId === mid) {
          prefs.openModuleId = "";
          savePortalPrefs(prefs);
        }
      });
    });

    const customizerBtn = document.getElementById("toggleModuleCustomizerBtn");
    const customizerPanel = document.getElementById("portalModuleCustomizerPanel");
    if (customizerBtn && customizerPanel) {
      customizerBtn.addEventListener("click", function () {
        const nextOpen = customizerPanel.hidden;
        customizerPanel.hidden = !nextOpen;
        customizerBtn.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      });
    }

    document.addEventListener("click", function (e) {
      const visBtn = e.target.closest(".js-toggle-module-vis");
      if (visBtn) {
        const mid = visBtn.getAttribute("data-module-id");
        const prefs = getPortalPrefsSafe();
        const visibleCount = Object.keys(prefs.visibleModules).filter(function (k) { return prefs.visibleModules[k]; }).length;
        const nextVal = !prefs.visibleModules[mid];
        if (!nextVal && visibleCount <= 1) {
          showToast("Sekurang-kurangnya satu modul mesti dikekalkan pada portal.");
          return;
        }
        prefs.visibleModules[mid] = nextVal;
        if (nextVal && prefs.singleOpenAccordion) {
          prefs.openModuleId = mid;
        }
        savePortalPrefs(prefs);
        applyPortalPreferencesToDom();
        return;
      }

      const stageBtn = e.target.closest(".js-stage-pill");
      if (stageBtn) {
        const sid = stageBtn.getAttribute("data-stage-id");
        const stMeta = EDUCATION_STAGES.find(function (s) { return s.id === sid; });
        if (stMeta && !stMeta.active) {
          showToast("Tahap " + stMeta.label + " sedang dibangunkan dan akan dibuka dalam fasa seterusnya.");
          return;
        }
        const prefs = getPortalPrefsSafe();
        prefs.stage = sid || "spm";
        savePortalPrefs(prefs);
        applyPortalPreferencesToDom();
        return;
      }

      const accBtn = e.target.closest("#toggleSingleAccordionBtn");
      if (accBtn) {
        const prefs = getPortalPrefsSafe();
        prefs.singleOpenAccordion = !prefs.singleOpenAccordion;
        savePortalPrefs(prefs);
        applyPortalPreferencesToDom();
      }
    });
  }

  // --- [features/dashboard/tokenReferralService.js] ---
  /**
   * src/features/dashboard/tokenReferralService.js
   * Penangkapan kod rujukan (?ref=ET...), tuntutan bonus rujukan (had 20/bulan),
   * dan penebusan baucar bersepadu dengan pengawal log masuk & jambatan GAS->Supabase.
   */







  const REF_CODE_REGEX = /^ET[A-Z0-9]{6,12}$/;

  function extractRefParamFromLocation() {
    try {
      const sp = new URLSearchParams(window.location.search || "");
      let raw = sp.get("ref") || "";
      if (!raw && window.location.hash && window.location.hash.indexOf("?") !== -1) {
        const hashQuery = window.location.hash.slice(window.location.hash.indexOf("?") + 1);
        raw = new URLSearchParams(hashQuery).get("ref") || "";
      }
      const clean = String(raw).trim().toUpperCase();
      return REF_CODE_REGEX.test(clean) ? clean : "";
    } catch (e) {
      return "";
    }
  }

  function initTokenReferralCapture() {
    const code = extractRefParamFromLocation();
    if (!code) return "";
    try {
      localStorage.setItem(PENDING_REFERRAL_STORAGE_KEY, code);
      localStorage.setItem(ATTRIBUTED_REFERRAL_STORAGE_KEY, code);
    } catch (e) {}
    return code;
  }

  function getAttributedReferralCode() {
    try {
      const raw = (localStorage.getItem(ATTRIBUTED_REFERRAL_STORAGE_KEY) || "").trim().toUpperCase();
      return REF_CODE_REGEX.test(raw) ? raw : "";
    } catch (e) {
      return "";
    }
  }

  async function tryClaimPendingReferralBonus() {
    let pendingCode = "";
    try {
      pendingCode = (localStorage.getItem(PENDING_REFERRAL_STORAGE_KEY) || "").trim().toUpperCase();
    } catch (e) {}
    if (!pendingCode || !REF_CODE_REGEX.test(pendingCode)) {
      return { ok: false, skipped: true };
    }
    if (!isSupabaseConfigured()) return { ok: false, unconfigured: true };
    const sb = getSupabaseClient();
    if (!sb) return { ok: false, unconfigured: true };
    const sessRes = await sb.auth.getSession();
    const session = sessRes && sessRes.data ? sessRes.data.session : null;
    if (!session || !session.user) return { ok: false, authRequired: true };

    const localCompleted = loadOpenScoresList().length;
    const stateCompleted = Array.isArray(portalState.scores) ? portalState.scores.length : 0;
    if (localCompleted < 1 && stateCompleted < 1) {
      return { ok: false, waitingQuiz: true };
    }

    const res = await sbClaimAiReferralBonus(pendingCode);
    if (res && res.ok) {
      try { localStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent("etutor:refresh-wallet-requested")); } catch (e) {}
      showToast("Bonus Rujukan Aktif! +10 Token Asas ditambah ke dompet anda & rakan.");
      return res;
    }

    const errMsg = String((res && res.error) || "");
    if (/telah ditebus|sendiri|tidak sah|mencapai had|20 rujukan/i.test(errMsg)) {
      try {
        localStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY);
        if (/sendiri/i.test(errMsg)) localStorage.removeItem(ATTRIBUTED_REFERRAL_STORAGE_KEY);
      } catch (e) {}
    }
    return res || { ok: false };
  }

  async function redeemTopupVoucherUnified(rawCode) {
    const cleanCode = String(rawCode || "").replace(/\s+/g, "").toUpperCase();
    if (cleanCode.length < 6) {
      return { ok: false, error: "Sila masukkan sekurang-kurangnya 6 aksara kod baucar." };
    }

    if (!isSupabaseConfigured()) {
      return callBackend("redeemAiVoucher", { code: cleanCode });
    }

    const sb = getSupabaseClient();
    const sessRes = sb ? await sb.auth.getSession() : null;
    const session = sessRes && sessRes.data ? sessRes.data.session : null;
    if (!session || !session.access_token) {
      return {
        ok: false,
        requiresAuth: true,
        error: "Sila log masuk Google atau E-mel dahulu supaya Token Top-up Kekal disimpan selamat dalam akaun anda (kod anda belum digunakan)."
      };
    }

    const sbRes = await sbRedeemAiTopupVoucher(cleanCode);
    if (sbRes && sbRes.ok) {
      return sbRes;
    }

    const errTxt = String((sbRes && sbRes.error) || "");
    if (!/tidak ditemui/i.test(errTxt)) {
      return sbRes || { ok: false, error: "Kod baucar tidak sah atau telah ditebus." };
    }

    const edgeBase = ((window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.CIKGU_SUPABASE_EDGE_URL) || "https://ktesekiguardgfdgrmlp.supabase.co/functions/v1/cikgu-semak").replace(/\/+$/, "");
    try {
      const resp = await fetch(edgeBase + "/v1/redeem-voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token
        },
        body: JSON.stringify({ code: cleanCode })
      });
      const parsed = await resp.json();
      return parsed || { ok: false, error: "Kod baucar tidak ditemui atau telah ditebus sebelum ini." };
    } catch (e) {
      return { ok: false, error: "Gagal menghubungi pelayan pengesahan baucar. Semak sambungan internet anda." };
    }
  }

  // --- [features/dashboard/tokenWalletController.js] ---
  /**
   * src/features/dashboard/tokenWalletController.js
   * Pengawal Dompet Token AI Pelajar (#tokenWalletDialog): paparan baki tepat (5/hari, 30/bulan, Top-up Kekal),
   * pengawal wajib log masuk sebelum tebus baucar, dan pautan rujukan automatik (had 20/bulan).
   */








  const WALLET_STORAGE_KEY = "etutor_cikgu_daily_tokens_v1";
  const REF_MONTHLY_LIMIT = 20;

  function getMytDayAndMonthKeys() {
    const iso = new Date(Date.now() + 8 * 3600 * 1000).toISOString();
    return { day: iso.slice(0, 10), month: iso.slice(0, 7) };
  }

  function readWalletLocalSnapshot() {
    const { day: nowMyt, month: nowMonth } = getMytDayAndMonthKeys();
    let monthlyRem = 30;
    let dailyFree = 5;
    let paid = 0;
    let trialVis = 2;
    let serverRef = "";
    let refCnt = 0;

    try {
      const raw = localStorage.getItem(WALLET_STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        paid = Math.max(0, Math.floor(Number(p && p.paidBalance) || 0));
        const sameMonth = p && p.monthKey === nowMonth;
        const sameDay = p && p.date === nowMyt;
        monthlyRem = sameMonth && typeof p.freeMonthlyRemaining === "number"
          ? Math.max(0, Math.min(230, Math.floor(p.freeMonthlyRemaining)))
          : 30;
        if (sameDay) {
          const storedDaily = typeof p.freeDailyRemaining === "number" ? p.freeDailyRemaining : p.freeRemaining;
          if (typeof storedDaily === "number") {
            dailyFree = Math.max(0, Math.min(5, Math.min(monthlyRem, Math.floor(storedDaily))));
          } else {
            dailyFree = Math.min(5, monthlyRem);
          }
        } else {
          dailyFree = Math.min(5, monthlyRem);
        }
        if (typeof (p && p.trialVisionRemaining) === "number") trialVis = Math.max(0, Math.floor(p.trialVisionRemaining));
        if (p && p.serverReferralCode) serverRef = String(p.serverReferralCode).trim().toUpperCase();
        if (typeof (p && p.monthlyReferralsCount) === "number") refCnt = Math.max(0, Math.floor(p.monthlyReferralsCount));
      }
    } catch (e) {}

    return {
      date: nowMyt,
      monthKey: nowMonth,
      remaining: dailyFree + paid,
      limit: Math.max(5, 5 + paid),
      paidBalance: paid,
      freeDailyRemaining: dailyFree,
      freeRemaining: dailyFree,
      freeMonthlyRemaining: monthlyRem,
      trialVisionRemaining: trialVis,
      serverReferralCode: serverRef,
      monthlyReferralsCount: refCnt,
      monthlyReferralsLimit: REF_MONTHLY_LIMIT
    };
  }

  function persistAndBroadcastWallet(st) {
    const base = readWalletLocalSnapshot();
    const next = Object.assign(base, st || {});
    const monthlyRem = Math.max(0, Math.min(230, Math.floor(Number(next.freeMonthlyRemaining) || 0)));
    const rawDaily = typeof next.freeDailyRemaining === "number" ? next.freeDailyRemaining : next.freeRemaining;
    const dailyFree = Math.max(0, Math.min(5, Math.min(monthlyRem, Math.floor(Number(rawDaily) || 0))));
    const paid = Math.max(0, Math.floor(Number(next.paidBalance) || 0));

    next.freeMonthlyRemaining = monthlyRem;
    next.freeDailyRemaining = dailyFree;
    next.freeRemaining = dailyFree;
    next.paidBalance = paid;
    next.remaining = dailyFree + paid;
    next.limit = Math.max(5, 5 + paid);

    try {
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    renderWalletBadgeAndModal(next);
    try {
      window.dispatchEvent(new CustomEvent("etutor:wallet-synced", { detail: next }));
      window.dispatchEvent(new CustomEvent("etutor:cikgu-token-updated", { detail: next }));
    } catch (e) {}
    return next;
  }

  function hasActiveSupabaseSessionSyncHint() {
    return Boolean(portalState.supabaseAuthenticated || portalState.sessionToken);
  }

  function renderWalletBadgeAndModal(st) {
    const s = st || readWalletLocalSnapshot();
    const isLoggedIn = hasActiveSupabaseSessionSyncHint();
    const navTxt = document.getElementById("navTokenBalanceText");
    if (navTxt) navTxt.textContent = "Token: " + s.remaining;

    const todayEl = document.getElementById("walletTodayAvailableVal");
    const freeEl = document.getElementById("walletFreeBalanceVal");
    const paidEl = document.getElementById("walletPaidBalanceVal");
    const visEl = document.getElementById("walletVisionTrialVal");
    const refEl = document.getElementById("walletReferralCodeText");
    const refQuotaEl = document.getElementById("walletReferralQuotaBadge");
    const authNotice = document.getElementById("walletAuthRequiredNotice");

    if (todayEl) todayEl.textContent = String(s.remaining);
    if (freeEl) freeEl.textContent = s.freeMonthlyRemaining + " / 30";
    if (paidEl) paidEl.textContent = String(s.paidBalance);
    if (visEl) visEl.textContent = s.paidBalance >= 3 ? "Aktif" : String(s.trialVisionRemaining);
    if (authNotice) authNotice.hidden = isLoggedIn || !isSupabaseConfigured();

    if (refEl) {
      refEl.textContent = (portalState.supabaseAuthenticated && s.serverReferralCode)
        ? s.serverReferralCode
        : "Log Masuk Dahulu";
    }
    if (refQuotaEl) {
      refQuotaEl.textContent = (s.monthlyReferralsCount || 0) + " / " + REF_MONTHLY_LIMIT + " rakan bulan ini";
    }
  }

  async function refreshAiWalletFromServer() {
    try {
      const res = await sbGetMyAiWallet();
      if (res && res.ok) {
        persistAndBroadcastWallet({
          freeDailyRemaining: Number(res.freeDailyRemaining) || 0,
          freeRemaining: Number(res.freeDailyRemaining) || 0,
          freeMonthlyRemaining: Number(res.freeMonthlyRemaining) || 0,
          paidBalance: Number(res.paidBalance) || 0,
          trialVisionRemaining: Number(res.trialVisionRemaining) || 0,
          serverReferralCode: res.referralCode || "",
          monthlyReferralsCount: Number(res.monthlyReferralsCount) || 0,
          monthKey: res.monthKey || getMytDayAndMonthKeys().month,
          date: res.dayKey || getMytDayAndMonthKeys().day
        });
        if (Array.isArray(res.unlockedKeys)) {
          try {
            window.dispatchEvent(new CustomEvent("etutor:server-unlocked-keys", { detail: { keys: res.unlockedKeys } }));
          } catch (e) {}
        }
        return;
      }
    } catch (e) {}
    renderWalletBadgeAndModal(readWalletLocalSnapshot());
  }

  function openTokenWalletDialog() {
    const dlg = document.getElementById("tokenWalletDialog");
    if (!dlg) return;
    const stEl = document.getElementById("aiVoucherStatusMsg");
    if (stEl) stEl.textContent = "";
    renderWalletBadgeAndModal(readWalletLocalSnapshot());
    refreshAiWalletFromServer();
    if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
  }

  function initTokenWalletBindings() {
    const dlg = document.getElementById("tokenWalletDialog");
    const openBtn = document.getElementById("openTokenWalletBtn");
    const closeBtn = document.getElementById("closeTokenWalletBtn");
    const loginBtn = document.getElementById("walletOpenSyncLoginBtn");
    const redeemForm = document.getElementById("redeemAiVoucherForm");
    const copyRefBtn = document.getElementById("copyReferralLinkBtn");

    renderWalletBadgeAndModal(readWalletLocalSnapshot());
    if (openBtn) openBtn.addEventListener("click", openTokenWalletDialog);
    window.addEventListener("etutor:open-token-wallet", openTokenWalletDialog);
    window.addEventListener("etutor:refresh-wallet-requested", refreshAiWalletFromServer);
    window.addEventListener("etutor:cikgu-token-updated", function (ev) {
      if (ev && ev.detail) renderWalletBadgeAndModal(ev.detail);
    });

    if (dlg) {
      bindLightDismissFallback(dlg);
      dlg.addEventListener("cancel", function (ev) { ev.preventDefault(); closeTopLayer(dlg); });
    }
    if (closeBtn && dlg) {
      closeBtn.addEventListener("click", function () { closeTopLayer(dlg); });
    }
    if (loginBtn && dlg) {
      loginBtn.addEventListener("click", async function () {
        if (dlg.open) await closeTopLayer(dlg);
        openSyncDialog();
      });
    }

    document.querySelectorAll(".js-wallet-buy-pack").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const packKey = btn.getAttribute("data-pack") || "tokenFocus";
        startDirectToyyibPayCheckout({ pkgKey: packKey, triggerBtn: btn, parentDialog: dlg });
      });
    });

    if (copyRefBtn) {
      copyRefBtn.addEventListener("click", async function () {
        const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
        const sessRes = sb ? await sb.auth.getSession() : null;
        const hasSess = Boolean(sessRes && sessRes.data && sessRes.data.session);
        const snap = readWalletLocalSnapshot();
        if (!hasSess || !snap.serverReferralCode) {
          if (dlg && dlg.open) await closeTopLayer(dlg);
          openSyncDialog();
          showToast("Log masuk Google / E-mel dahulu untuk mengaktifkan pautan jemputan unik anda.");
          return;
        }
        const url = window.location.origin + window.location.pathname + "?ref=" + encodeURIComponent(snap.serverReferralCode) + "#login";
        try {
          await navigator.clipboard.writeText(url);
          showToast("Pautan jemputan unik disalin! (+10 Token bila rakan log masuk & siap 1 set, had 20/bulan).");
        } catch (e) {
          showToast("Pautan jemputan anda: " + snap.serverReferralCode);
        }
      });
    }

    if (redeemForm) {
      const voucherInp = document.getElementById("aiVoucherCodeInput");
      if (voucherInp) voucherInp.addEventListener("input", function () { voucherInp.setCustomValidity(""); });
      redeemForm.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        const inp = document.getElementById("aiVoucherCodeInput");
        const btn = document.getElementById("redeemAiVoucherBtn");
        const stEl = document.getElementById("aiVoucherStatusMsg");
        if (!inp) return;
        const code = inp.value.trim().toUpperCase();
        if (code.length < 6) {
          inp.setCustomValidity("Sila masukkan sekurang-kurangnya 6 aksara kod baucar.");
          redeemForm.reportValidity();
          inp.focus();
          return;
        }
        inp.setCustomValidity("");
        btn.disabled = true;
        btn.textContent = "Menyemak...";
        if (stEl) stEl.textContent = "";
        try {
          const res = await redeemTopupVoucherUnified(code);
          if (!res || !res.ok) {
            const errMsg = (res && res.error) || "Kod baucar tidak sah atau telah ditebus.";
            if (stEl) { stEl.style.color = "var(--status-danger)"; stEl.textContent = errMsg; }
            showToast(errMsg);
            return;
          }
          const cur = readWalletLocalSnapshot();
          const added = Number(res.addedTokens) || 0;
          persistAndBroadcastWallet({
            paidBalance: typeof res.paidBalance === "number" ? res.paidBalance : (cur.paidBalance + added),
            freeDailyRemaining: typeof res.freeDailyRemaining === "number" ? res.freeDailyRemaining : cur.freeDailyRemaining,
            freeMonthlyRemaining: typeof res.freeMonthlyRemaining === "number" ? res.freeMonthlyRemaining : cur.freeMonthlyRemaining,
            serverReferralCode: res.referralCode || cur.serverReferralCode,
            monthlyReferralsCount: typeof res.monthlyReferralsCount === "number" ? res.monthlyReferralsCount : cur.monthlyReferralsCount
          });
          inp.value = "";
          if (stEl) { stEl.style.color = "var(--grade-emerald)"; stEl.textContent = "Berjaya! +" + added + " Token Top-up Kekal ditambah ke akaun anda."; }
          showToast("+" + added + " Token AI berjaya ditebus!");
        } catch (err) {
          if (stEl) { stEl.style.color = "var(--status-danger)"; stEl.textContent = "Ralat menebus baucar: " + err.message; }
        } finally {
          btn.disabled = false;
          btn.textContent = "Tebus Kod";
        }
      });
    }
  }

  // --- [shared/ui/adsenseController.js] ---
  /**
   * src/shared/ui/adsenseController.js
   * Kawalan pintar Google AdSense: menyekat iklan semasa peperiksaan (#examStage),
   * paparan Admin (#adminView), aplikasi mudah alih Capacitor, dan pemegang Token berbayar.
   */

  const ADSENSE_CLIENT_ID = "ca-pub-7216597758789088";
  const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

  let scriptRequested = false;
  let adsObserverStarted = false;

  function isNativeAppShell() {
    try {
      if (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform()) {
        return true;
      }
    } catch (e) {}
    return document.documentElement.getAttribute("data-phone-app") === "true" ||
      document.documentElement.getAttribute("data-native-store-shell") === "true";
  }

  function shouldSuppressAds() {
    if (isNativeAppShell()) return true;
    if (document.documentElement.getAttribute("data-exam-active") === "true") return true;

    const examStage = document.getElementById("examStage");
    if (examStage && !examStage.hidden) return true;

    const adminView = document.getElementById("adminView");
    if (adminView && !adminView.hidden) return true;
    if ((window.location.hash || "").toLowerCase().startsWith("#admin")) return true;

    try {
      const snap = readWalletLocalSnapshot();
      if (snap && Number(snap.paidBalance) > 0) return true;
    } catch (e) {}

    return false;
  }

  function loadAdSenseOnce() {
    if (scriptRequested) return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      scriptRequested = true;
      return;
    }
    const host = (window.location.hostname || "").toLowerCase();
    if (!/^https?:$/i.test(window.location.protocol) || host === "localhost" || host === "127.0.0.1") {
      return;
    }
    scriptRequested = true;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = ADSENSE_SCRIPT_SRC;
    document.head.appendChild(s);
  }

  function syncAdSenseVisibility() {
    const suppressed = shouldSuppressAds();
    document.documentElement.setAttribute("data-ads-suppressed", suppressed ? "true" : "false");
    if (!suppressed) {
      loadAdSenseOnce();
    }
    return suppressed;
  }

  function initAdSenseController() {
    syncAdSenseVisibility();
    if (adsObserverStarted) return;
    adsObserverStarted = true;

    window.addEventListener("etutor:wallet-synced", syncAdSenseVisibility);
    window.addEventListener("etutor:cikgu-token-updated", syncAdSenseVisibility);
    window.addEventListener("hashchange", syncAdSenseVisibility);

    if (typeof MutationObserver === "function") {
      const obs = new MutationObserver(syncAdSenseVisibility);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-exam-active", "data-phone-app"] });
      ["examStage", "adminView"].forEach(function (id) {
        const node = document.getElementById(id);
        if (node) obs.observe(node, { attributes: true, attributeFilter: ["hidden"] });
      });
    }
  }

  // --- [features/dashboard/tokenUnlockService.js] ---
  /**
   * src/features/dashboard/tokenUnlockService.js
   * Pengurusan buka kunci kekal berasaskan Token (Set Soalan Klon = 2 Token/Set, Nota Bab = 2 Token/Bab).
   */






  if (typeof window !== "undefined") {
    window.addEventListener("etutor:server-unlocked-keys", function (ev) {
      const keys = ev && ev.detail && ev.detail.keys;
      if (Array.isArray(keys)) {
        mergeServerUnlockedKeys(keys);
        if (typeof renderKlonCatalogSection === "function") renderKlonCatalogSection();
      }
    });
  }

  const KLON_UNLOCK_COST = 2;
  const NOTA_UNLOCK_COST = 2;

  function isNotaFreePromoActive(nowMsOverride) {
    const cfg = typeof window !== "undefined" ? window.ETUTOR_CONFIG : null;
    if (!cfg || cfg.NOTA_FREE_PROMO_MODE !== true) return false;
    const untilStr = String(cfg.NOTA_FREE_PROMO_UNTIL || "").trim();
    if (untilStr) {
      const untilMs = Date.parse(untilStr);
      if (!Number.isNaN(untilMs)) {
        const nowMs = typeof nowMsOverride === "number" ? nowMsOverride : Date.now();
        if (nowMs > untilMs) return false;
      }
    }
    return true;
  }

  function getEffectiveNotaUnlockCost(nowMsOverride) {
    return isNotaFreePromoActive(nowMsOverride) ? 0 : NOTA_UNLOCK_COST;
  }

  function loadUnlockedKeysSet() {
    try {
      if (typeof localStorage === "undefined") return new Set();
      const raw = localStorage.getItem(UNLOCKED_CONTENTS_STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr.filter((k) => typeof k === "string" && k.trim()) : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveUnlockedKeysSet(setObj) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(UNLOCKED_CONTENTS_STORAGE_KEY, JSON.stringify(Array.from(setObj).slice(-400)));
    } catch (e) {}
  }

  function mergeServerUnlockedKeys(keys) {
    if (!Array.isArray(keys) || keys.length === 0) return;
    const setObj = loadUnlockedKeysSet();
    keys.forEach((k) => {
      if (typeof k === "string" && k.trim()) setObj.add(k.trim());
    });
    saveUnlockedKeysSet(setObj);
  }

  function isKlonItemUnlocked(item) {
    if (!item || item.category !== "klon") return true;
    if (portalState.sessionToken) return true;
    if (item.inProgress || item.bestScore) return true;
    return loadUnlockedKeysSet().has("klon:" + item.fileId);
  }

  function isNotaItemUnlocked(noteId) {
    if (isNotaFreePromoActive()) return true;
    if (portalState.sessionToken) return true;
    return loadUnlockedKeysSet().has("nota:" + String(noteId || "").trim());
  }

  async function performContentUnlock_(contentType, contentId, title, cost) {
    const cleanId = String(contentId || "").trim();
    const key = contentType + ":" + cleanId;
    if (!cleanId) return false;

    const unlocked = loadUnlockedKeysSet();
    if (unlocked.has(key)) return true;

    try {
      const res = await sbUnlockPortalContent(contentType, cleanId, title);
      if (res && res.ok) {
        unlocked.add(res.unlockedKey || key);
        saveUnlockedKeysSet(unlocked);
        if (!res.alreadyUnlocked && typeof res.freeMonthlyRemaining === "number") {
          persistAndBroadcastWallet({
            freeDailyRemaining: typeof res.freeDailyRemaining === "number" ? Number(res.freeDailyRemaining) : Math.min(5, Number(res.freeMonthlyRemaining) || 0),
            freeRemaining: typeof res.freeDailyRemaining === "number" ? Number(res.freeDailyRemaining) : Math.min(5, Number(res.freeMonthlyRemaining) || 0),
            freeMonthlyRemaining: Number(res.freeMonthlyRemaining) || 0,
            paidBalance: Number(res.paidBalance) || 0
          });
          showToast("Dibuka kekal (-" + cost + " Token): " + (title || cleanId));
        }
        return true;
      }
      if (res && !res.unconfigured && !res.authExpired) {
        showToast((res && res.detail) || (res && res.error) || "Baki token tidak mencukupi (perlu " + cost + " Token).");
        openTokenWalletDialog();
        return false;
      }
    } catch (e) {}

    const snap = readWalletLocalSnapshot();
    if (snap.remaining < cost) {
      showToast("Baki token tidak mencukupi (perlu " + cost + " Token). Sila tebus baucar atau tambah nilai Token!");
      openTokenWalletDialog();
      return false;
    }

    const useFree = Math.min(cost, Math.max(0, snap.freeDailyRemaining));
    const usePaid = cost - useFree;
    persistAndBroadcastWallet({
      freeDailyRemaining: Math.max(0, snap.freeDailyRemaining - useFree),
      freeRemaining: Math.max(0, snap.freeDailyRemaining - useFree),
      freeMonthlyRemaining: Math.max(0, snap.freeMonthlyRemaining - useFree),
      paidBalance: Math.max(0, snap.paidBalance - usePaid)
    });

    unlocked.add(key);
    saveUnlockedKeysSet(unlocked);
    showToast("Dibuka kekal (-" + cost + " Token): " + (title || cleanId));
    return true;
  }

  async function ensureQuizSetUnlocked(item) {
    if (!item || isKlonItemUnlocked(item)) return true;
    return performContentUnlock_("klon", item.fileId, item.cleanTitle || item.setCode || "Set Klon SPM", KLON_UNLOCK_COST);
  }

  async function unlockNotaItem(noteId, title) {
    if (isNotaFreePromoActive()) return true;
    if (isNotaItemUnlocked(noteId)) return true;
    return performContentUnlock_("nota", noteId, title || "Nota Interaktif", NOTA_UNLOCK_COST);
  }

  // --- [features/catalog/deepLinkRouter.js] ---
  /**
   * src/features/catalog/deepLinkRouter.js
   * Penghala pautan dalam (Deep-Link ?set=, ?klon=, ?subject=, ?open=1) dari halaman SEO & kad Klon SPM.
   */





  function hasDeepLinkPortalParams() {
    try {
      if (!window.location || !window.location.search) return false;
      const params = new URLSearchParams(window.location.search);
      return Boolean(
        (params.get("fileId") || "").trim() ||
        (params.get("set") || "").trim() ||
        (params.get("klon") || "").trim() ||
        (params.get("klonSubject") || "").trim() ||
        (params.get("subject") || "").trim() ||
        (params.get("nota") || "").trim() ||
        (params.get("q") || "").trim()
      );
    } catch (e) {
      return false;
    }
  }

  function applyDeepLinkParamsOnce() {
    if (portalState.deepLinkHandled) return;

    let params;
    try {
      params = new URLSearchParams(window.location.search || "");
    } catch (e) {
      portalState.deepLinkHandled = true;
      return;
    }

    const notaParam = (params.get("nota") || "").trim();
    const autoOpen = params.get("open") === "1" || params.get("open") === "true";
    if (notaParam) {
      portalState.deepLinkHandled = true;
      openPortalModuleDropdown("nota_interaktif");
      try {
        history.replaceState(null, "", window.location.pathname + "#portal");
      } catch (e) {}
      if (autoOpen) {
        openNotaChapter(notaParam);
      } else {
        const notaEl = document.getElementById("moduleDropdownNota");
        if (notaEl) {
          setTimeout(function () { notaEl.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
        }
      }
      return;
    }

    const list = portalState.catalog || [];
    if (list.length === 0) return;

    const fileIdParam = (params.get("fileId") || "").trim();
    const titleParam = (params.get("title") || "").trim();
    const setParam = (params.get("set") || "").trim();
    const klonParam = (params.get("klon") || "").trim();
    const klonSubParam = (params.get("klonSubject") || "").trim();
    const subParam = (params.get("subject") || "").trim();
    const qParam = (params.get("q") || "").trim();
    const wantsKlonScroll = window.location.hash.toLowerCase() === "#klon-portal" || Boolean(klonParam) || Boolean(klonSubParam);

    portalState.deepLinkHandled = true;
    if (!fileIdParam && !setParam && !klonParam && !klonSubParam && !subParam && !qParam && !wantsKlonScroll) return;

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
    const titleLower = titleParam.toLowerCase();
    if (fileIdParam) {
      matchedSetItem = list.find(function (c) {
        return String(c.fileId || "") === fileIdParam;
      }) || null;
    }
    if (!matchedSetItem && titleLower) {
      matchedSetItem = list.find(function (c) {
        return String(c.cleanTitle || "").trim().toLowerCase() === titleLower;
      }) || null;
    }
    if (!matchedSetItem && klonParam) {
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
    } else if (!matchedSetItem && setParam) {
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

    if (wantsKlonScroll) {
      openPortalModuleDropdown("klon_spm");
    } else if (setParam || subParam || qParam || fileIdParam) {
      openPortalModuleDropdown("pra_spm");
    }

    try {
      history.replaceState(null, "", window.location.pathname + (wantsKlonScroll ? "#klon-portal" : "#portal"));
    } catch (e) {}

    if (matchedSetItem && autoOpen) {
      if (matchedSetItem.category === "klon") openPortalModuleDropdown("klon_spm");
      openQuizSet(matchedSetItem.fileId, Boolean(matchedSetItem.inProgress), false);
    } else {
      const targetHead = document.getElementById(wantsKlonScroll ? "klonCatalogHeading" : "catalogHeading");
      if (targetHead) {
        setTimeout(function () { targetHead.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
    }
  }

  // --- [features/leaderboard/leaderboardView.js] ---
  /**
   * src/features/leaderboard/leaderboardView.js
   * Pemapar UI Podium Top 3, Jadual Kedudukan Pelajar & Kedudukan Semasa Pengguna.
   */



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

  // --- [features/catalog/catalogView.js] ---
  /**
   * src/features/catalog/catalogView.js
   * Pemapar UI Katalog Klon SPM 2026 & Katalog Bank Soalan Interaktif Harian di dalam Portal Pelajar (#portal).
   */
  const KLON_SUBJECT_META = [
    {
      "group": "teras",
      "klonCode": "KLON 01",
      "kssmCode": "Kod 1103",
      "portalHref": "?klon=1&amp;open=1#portal",
      "subject": "Bahasa Melayu",
      "title": "Klon SPM Bahasa Melayu 2026",
      "descriptionHtml": "20 Soalan Kertas 1 + 14 Soalan Kertas 2 (Tatabahasa, Rumusan &amp; Pemahaman KSSM)",
      "seoSlug": "spm-bahasa-melayu-2026-klon-01",
      "srLabel": " Klon 01 Bahasa Melayu"
    },
    {
      "group": "teras",
      "klonCode": "KLON 02",
      "kssmCode": "Kod 1119",
      "portalHref": "?klon=2&amp;open=1#portal",
      "subject": "Bahasa Inggeris",
      "title": "Klon SPM Bahasa Inggeris 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 8 Soalan Kertas 2 (CEFR Reading &amp; Guided Writing)",
      "seoSlug": "spm-bahasa-inggeris-2026-klon-02",
      "srLabel": " Klon 02 Bahasa Inggeris"
    },
    {
      "group": "teras",
      "klonCode": "KLON 03",
      "kssmCode": "Kod 1249",
      "portalHref": "?klon=3&amp;open=1#portal",
      "subject": "Sejarah",
      "title": "Klon SPM Sejarah 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 9 Soalan Kertas 2 (Struktur &amp; Esei KBAT Tingkatan 4–5)",
      "seoSlug": "spm-sejarah-2026-klon-03",
      "srLabel": " Klon 03 Sejarah"
    },
    {
      "group": "teras",
      "klonCode": "KLON 04",
      "kssmCode": "Kod 1449",
      "portalHref": "?klon=4&amp;open=1#portal",
      "subject": "Matematik",
      "title": "Klon SPM Matematik 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 17 Soalan Kertas 2 (Langkah Kiraan K &amp; Jawapan J)",
      "seoSlug": "spm-matematik-2026-klon-04",
      "srLabel": " Klon 04 Matematik"
    },
    {
      "group": "teras",
      "klonCode": "KLON 05",
      "kssmCode": "Kod 1511",
      "portalHref": "?klon=5&amp;open=1#portal",
      "subject": "Sains",
      "title": "Klon SPM Sains 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 13 Soalan Kertas 2 (Kemahiran Saintifik &amp; Eksperimen)",
      "seoSlug": "spm-sains-2026-klon-05",
      "srLabel": " Klon 05 Sains"
    },
    {
      "group": "teras",
      "klonCode": "KLON 06",
      "kssmCode": "Kod 1223",
      "portalHref": "?klon=6&amp;open=1#portal",
      "subject": "Pendidikan Islam",
      "title": "Klon SPM Pendidikan Islam 2026",
      "descriptionHtml": "20 Soalan Objektif + 5 Soalan Struktur &amp; KBAT (Tilawah, Hadis, Akidah &amp; Fiqh)",
      "seoSlug": "spm-pendidikan-islam-2026-klon-06",
      "srLabel": " Klon 06 Pendidikan Islam"
    },
    {
      "group": "teras",
      "klonCode": "KLON 07",
      "kssmCode": "Kod 1225",
      "portalHref": "?klon=7&amp;open=1#portal",
      "subject": "Pendidikan Moral",
      "title": "Klon SPM Pendidikan Moral 2026",
      "descriptionHtml": "20 Soalan Pemahaman + 9 Soalan Struktur &amp; Esei Nilai Universal KSSM",
      "seoSlug": "spm-pendidikan-moral-2026-klon-07",
      "srLabel": " Klon 07 Pendidikan Moral"
    },
    {
      "group": "sains",
      "klonCode": "KLON 08",
      "kssmCode": "Kod 3472",
      "portalHref": "?klon=8&amp;open=1#portal",
      "subject": "Matematik Tambahan",
      "title": "Klon SPM Matematik Tambahan 2026",
      "descriptionHtml": "20 Soalan Kertas 1 + 30 Soalan Kertas 2 (Kalkulus, Fungsi, Vektor &amp; Taburan)",
      "seoSlug": "spm-matematik-tambahan-2026-klon-08",
      "srLabel": " Klon 08 Matematik Tambahan"
    },
    {
      "group": "sains",
      "klonCode": "KLON 09",
      "kssmCode": "Kod 4531",
      "portalHref": "?klon=9&amp;open=1#portal",
      "subject": "Fizik",
      "title": "Klon SPM Fizik 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 11 Soalan Kertas 2 (Daya, Gelombang, Elektrik &amp; Kuantum)",
      "seoSlug": "spm-fizik-2026-klon-09",
      "srLabel": " Klon 09 Fizik"
    },
    {
      "group": "sains",
      "klonCode": "KLON 10",
      "kssmCode": "Kod 4541",
      "portalHref": "?klon=10&amp;open=1#portal",
      "subject": "Kimia",
      "title": "Klon SPM Kimia 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 11 Soalan Kertas 2 (Mol, Redoks, Sebatian Karbon &amp; Termokimia)",
      "seoSlug": "spm-kimia-2026-klon-10",
      "srLabel": " Klon 10 Kimia"
    },
    {
      "group": "sains",
      "klonCode": "KLON 11",
      "kssmCode": "Kod 4551",
      "portalHref": "?klon=11&amp;open=1#portal",
      "subject": "Biologi",
      "title": "Klon SPM Biologi 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 11 Soalan Kertas 2 (Fisiologi Manusia, Tumbuhan &amp; Genetik)",
      "seoSlug": "spm-biologi-2026-klon-11",
      "srLabel": " Klon 11 Biologi"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 12",
      "kssmCode": "Kod 3756",
      "portalHref": "?klon=12&amp;open=1#portal",
      "subject": "Prinsip Perakaunan",
      "title": "Klon SPM Prinsip Perakaunan 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 6 Soalan Kertas 2 (Penyata Kewangan, Rekonsiliasi &amp; Kelab)",
      "seoSlug": "spm-prinsip-perakaunan-2026-klon-12",
      "srLabel": " Klon 12 Prinsip Perakaunan"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 13",
      "kssmCode": "Kod 3767",
      "portalHref": "?klon=13&amp;open=1#portal",
      "subject": "Ekonomi",
      "title": "Klon SPM Ekonomi 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 7 Soalan Kertas 2 (Pasaran, Keanjalan, Bank &amp; Belanjawan)",
      "seoSlug": "spm-ekonomi-2026-klon-13",
      "srLabel": " Klon 13 Ekonomi"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 14",
      "kssmCode": "Kod 3766",
      "portalHref": "?klon=14&amp;open=1#portal",
      "subject": "Perniagaan",
      "title": "Klon SPM Perniagaan 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 10 Soalan Kertas 2 (Kajian Kes, Pembiayaan &amp; Rancangan)",
      "seoSlug": "spm-perniagaan-2026-klon-14",
      "srLabel": " Klon 14 Perniagaan"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 15",
      "kssmCode": "Kod 2280",
      "portalHref": "?klon=15&amp;open=1#portal",
      "subject": "Geografi",
      "title": "Klon SPM Geografi 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 9 Soalan Kertas 2 (Peta Topografi, Fizikal &amp; Alam Sekitar)",
      "seoSlug": "spm-geografi-2026-klon-15",
      "srLabel": " Klon 15 Geografi"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 16",
      "kssmCode": "Kod 3770",
      "portalHref": "?klon=16&amp;open=1#portal",
      "subject": "Sains Komputer",
      "title": "Klon SPM Sains Komputer 2026",
      "descriptionHtml": "20 Soalan Objektif + 24 Soalan Struktur (Pengaturcaraan, SQL &amp; Pangkalan Data)",
      "seoSlug": "spm-sains-komputer-2026-klon-16",
      "srLabel": " Klon 16 Sains Komputer"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 17",
      "kssmCode": "Kod 3763",
      "portalHref": "?klon=17&amp;open=1#portal",
      "subject": "Reka Cipta",
      "title": "Klon SPM Reka Cipta 2026",
      "descriptionHtml": "20 Soalan Objektif + 24 Soalan Struktur (Proses Reka Bentuk, Bahan &amp; Sistem)",
      "seoSlug": "spm-reka-cipta-2026-klon-17",
      "srLabel": " Klon 17 Reka Cipta"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 18",
      "kssmCode": "Kod 4572",
      "portalHref": "?klon=18&amp;open=1#portal",
      "subject": "Sains Sukan",
      "title": "Klon SPM Sains Sukan 2026",
      "descriptionHtml": "40 Soalan Kertas 1 + 13 Soalan Kertas 2 (Anatomi, Biomekanik &amp; Latihan Sukan)",
      "seoSlug": "spm-sains-sukan-2026-klon-18",
      "srLabel": " Klon 18 Sains Sukan"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 19",
      "kssmCode": "Kod 3769",
      "portalHref": "?klon=19&amp;open=1#portal",
      "subject": "Sains Rumah Tangga",
      "title": "Klon SPM Sains Rumah Tangga 2026",
      "descriptionHtml": "20 Soalan Objektif + 24 Soalan Struktur (Pemakanan, Tekstil &amp; Keusahawanan)",
      "seoSlug": "spm-sains-rumah-tangga-2026-klon-19",
      "srLabel": " Klon 19 Sains Rumah Tangga"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 20",
      "kssmCode": "Kod 5226",
      "portalHref": "?klon=20&amp;open=1#portal",
      "subject": "Tasawwur Islam",
      "title": "Klon SPM Tasawwur Islam 2026",
      "descriptionHtml": "20 Soalan Bahagian A + 6 Soalan Bahagian B (Pandangan Hidup &amp; Sistem Islam)",
      "seoSlug": "spm-tasawwur-islam-2026-klon-20",
      "srLabel": " Klon 20 Tasawwur Islam"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 21",
      "kssmCode": "Kod 5227",
      "portalHref": "?klon=21&amp;open=1#portal",
      "subject": "Pendidikan Al-Quran &amp; As-Sunnah",
      "title": "Klon SPM Pendidikan Al-Quran &amp; As-Sunnah",
      "descriptionHtml": "20 Soalan Objektif + 4 Soalan Subjektif (Ulum Al-Quran, Ulum Hadis &amp; Tamadun)",
      "seoSlug": "spm-pqs-2026-klon-21",
      "srLabel": " Klon 21 Pendidikan Al-Quran dan As-Sunnah"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 22",
      "kssmCode": "Kod 5401",
      "portalHref": "?klon=22&amp;open=1#portal",
      "subject": "Usul al-Din",
      "title": "Klon SPM Usul al-Din 2026",
      "descriptionHtml": "20 Soalan Objektif + 4 Soalan Subjektif KBD (Tauhid, Tafsir, Hadis &amp; Akhlak)",
      "seoSlug": "spm-usuluddin-2026-klon-22",
      "srLabel": " Klon 22 Usul al-Din"
    },
    {
      "group": "elektif",
      "klonCode": "KLON 23",
      "kssmCode": "Kod 2361",
      "portalHref": "?klon=23&amp;open=1#portal",
      "subject": "Bahasa Arab",
      "title": "Klon SPM Bahasa Arab 2026",
      "descriptionHtml": "25 Soalan Qawaid &amp; Balaghah + 11 Soalan Istiab, Ungkapan &amp; Insyak",
      "seoSlug": "spm-bahasa-arab-2026-klon-23",
      "srLabel": " Klon 23 Bahasa Arab"
    }
  ];







  function lookupKlonMeta_(subjectName) {
    const target = String(subjectName || "").replace(/&/g, "&amp;").trim().toLowerCase();
    const raw = String(subjectName || "").trim().toLowerCase();
    return (KLON_SUBJECT_META || []).find(function (m) {
      const ms = String(m.subject || "").trim().toLowerCase();
      return ms === raw || ms === target || ms.replace(/&amp;/g, "&") === raw;
    }) || null;
  }

  function syncLandingKlonCountBadge() {
    const countLabel = document.getElementById("klonCatalogCountLabel");
    if (!countLabel) return;
    const klonCount = (portalState.catalog || []).filter(function (c) { return c.category === "klon"; }).length;
    if (klonCount > 0) {
      countLabel.textContent = klonCount + " set klon dipaparkan";
    }
  }

  function populateSubjectSelectors() {
    const harianSubjects = [];
    const seenHarian = {};
    const allSubjects = [];
    const seenAll = {};

    filterCatalogItemsForStudent(portalState.catalog || []).forEach(function (c) {
      if (c.subject && !seenAll[c.subject]) {
        seenAll[c.subject] = true;
        allSubjects.push(c.subject);
      }
      if (c.category !== "klon" && c.subject && !seenHarian[c.subject]) {
        seenHarian[c.subject] = true;
        harianSubjects.push(c.subject);
      }
    });
    if (portalState.selectedSubject !== "ALL" && !seenHarian[portalState.selectedSubject]) portalState.selectedSubject = "ALL";
    harianSubjects.sort();
    allSubjects.sort();

    const chipRow = document.getElementById("subjectChipsRow");
    if (chipRow) {
      const allOpts = ["ALL"].concat(harianSubjects);
      chipRow.innerHTML = allOpts.map(function (sub) {
        const active = portalState.selectedSubject === sub;
        const label = sub === "ALL" ? "Semua Subjek" : sub;
        return '<button type="button" class="tab-chip js-subject-chip" data-subject="' + escapeHtml(sub) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
      }).join("");
    }

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
    const grpFilter = portalState.klonSelectedGroup || "ALL";

    filterCatalogItemsForStudent(portalState.catalog || []).forEach(function (c) {
      if (c.category !== "klon" || !c.subject) return;
      if (grpFilter !== "ALL") {
        const meta = lookupKlonMeta_(c.subject);
        if (!meta || meta.group !== grpFilter) return;
      }
      if (!seen[c.subject]) {
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
    const klonUnlocked = !isKlon || isKlonItemUnlocked(item);
    let statusBadgeHtml = isKlon
      ? (klonUnlocked
          ? '<span class="status-badge badge-done">Terbuka Kekal</span>'
          : '<span class="status-badge badge-progress">' + ICONS.lock + ' <span class="tabular-nums">' + KLON_UNLOCK_COST + ' Token • Kekal</span></span>')
      : '<span class="status-badge badge-new">Belum Jawab</span>';
    let primaryBtnLabel = isKlon ? (klonUnlocked ? "Jawab Klon" : ("Buka Klon (" + KLON_UNLOCK_COST + " Token)")) : "Mula Latihan";
    let primaryBtnIcon = isKlon && !klonUnlocked ? ICONS.unlock : ICONS.play;
    let primaryBtnClass = "btn-primary";
    let resumeAttr = 'data-resume="0"';

    if (item.inProgress) {
      const ans = item.inProgress.answeredCount || 0;
      const tot = item.inProgress.totalQuestions || 45;
      statusBadgeHtml = '<span class="status-badge badge-progress">' + ICONS.clock + ' <span class="tabular-nums">' + ans + '/' + tot + ' Dijawab</span></span>';
      primaryBtnLabel = "Sambung Semula";
      primaryBtnIcon = ICONS.play;
      primaryBtnClass = "btn-emerald";
      resumeAttr = 'data-resume="1"';
    } else if (item.bestScore) {
      statusBadgeHtml = '<span class="status-badge badge-done">' + ICONS.checkCircle + ' <span class="tabular-nums">' + item.bestScore.percentage + '% • Gred ' + escapeHtml(item.bestScore.grade) + '</span></span>';
      primaryBtnLabel = "Ulang Latihan";
      primaryBtnIcon = ICONS.play;
      primaryBtnClass = "btn-outline";
    }

    const klonMeta = isKlon ? lookupKlonMeta_(item.subject) : null;
    const kssmBadge = klonMeta && klonMeta.kssmCode
      ? '<span class="badge-kssm-code">' + escapeHtml(klonMeta.kssmCode) + '</span>'
      : "";

    const leadBadgeHtml = isKlon
      ? '<span class="badge-klon">' + ICONS.sparkles + ' ' + escapeHtml(item.setCode || "KLON SPM") + '</span><span class="status-badge badge-subject">' + escapeHtml(item.subject) + '</span>' + kssmBadge
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
             primaryBtnIcon + ' <span>' + primaryBtnLabel + '</span>',
      '    </button>',
           renderQuizReportBtnHtml_(item),
      (item.inProgress
        ? '<button type="button" class="btn btn-ghost btn-sm js-open-quiz" data-file-id="' + escapeHtml(item.fileId) + '" data-reset="1" title="Mula semula dari awal">' + ICONS.refresh + '<span class="sr-only">Mula Baharu</span></button>'
        : ''),
      '  </div>',
      '</article>'
    ].join("\n");
  }

  function renderLoadMoreBarHtml_(shownCount, totalCount, moreCls, allCls) {
    if (shownCount >= totalCount) return "";
    return [
      '<div class="catalog-load-more-bar" style="grid-column:1/-1">',
      '  <span class="catalog-load-more-meta tabular-nums">Memaparkan ' + shownCount + ' daripada ' + totalCount + ' set</span>',
      '  <div class="catalog-load-more-actions">',
      '    <button type="button" class="btn btn-primary btn-sm ' + moreCls + '">Papar Lagi (+' + PORTAL_BATCH_SIZE + ' Set)</button>',
      '    <button type="button" class="btn btn-outline btn-sm ' + allCls + '">Papar Semua (' + totalCount + ')</button>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  function renderKlonCatalogSection() {
    const sec = document.getElementById("klonCatalogSection");
    const grid = document.getElementById("klonCatalogCardsGrid");
    const countLabel = document.getElementById("klonCatalogCountLabel");
    if (!sec || !grid) return;

    const allKlon = filterCatalogItemsForStudent(portalState.catalog || [])
      .filter(function (item) { return item.category === "klon"; })
      .slice()
      .sort(function (a, b) {
        return (Number(a.setNumber) || 999) - (Number(b.setNumber) || 999) || String(a.cleanTitle || "").localeCompare(String(b.cleanTitle || ""));
      });

    if (allKlon.length === 0) {
      sec.hidden = true;
      grid.innerHTML = "";
      if (countLabel) countLabel.textContent = "0 set klon dipaparkan";
      return;
    }

    sec.hidden = false;
    const grp = portalState.klonSelectedGroup || "ALL";
    const q = portalState.klonSearchQuery.trim().toLowerCase();
    const filtered = allKlon.filter(function (item) {
      const meta = lookupKlonMeta_(item.subject);
      if (grp !== "ALL" && (!meta || meta.group !== grp)) {
        return false;
      }
      if (portalState.klonSelectedSubject !== "ALL" && item.subject !== portalState.klonSelectedSubject) {
        return false;
      }
      if (portalState.klonSelectedStatus !== "ALL" && item.status !== portalState.klonSelectedStatus) {
        return false;
      }
      if (q) {
        const kssmStr = meta && meta.kssmCode ? meta.kssmCode : "";
        const hay = [item.cleanTitle, item.subject, item.level, item.stateOrSource, item.setCode, kssmStr, "klon"].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    const klonLimit = Number(portalState.klonVisibleLimit) || PORTAL_BATCH_SIZE;
    const visible = q ? filtered : filtered.slice(0, klonLimit);

    if (countLabel) {
      countLabel.textContent = filtered.length === visible.length
        ? (filtered.length + " set klon dipaparkan")
        : ("Memaparkan " + visible.length + " / " + filtered.length + " set klon");
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:32px">Tiada set Klon SPM sepadan dengan carian atau penapis semasa.</div>';
      return;
    }

    grid.innerHTML = visible.map(function (item) {
      return renderQuizCardMarkup_(item, true);
    }).join("\n") + renderLoadMoreBarHtml_(visible.length, filtered.length, "js-load-more-klon", "js-show-all-klon");
  }

  function renderCatalogSection() {
    const grid = document.getElementById("catalogCardsGrid");
    const countLabel = document.getElementById("catalogCountLabel");
    if (!grid) return;

    const q = portalState.searchQuery.trim().toLowerCase();
    const filtered = filterCatalogItemsForStudent(portalState.catalog || []).filter(function (item) {
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

    const harianLimit = Number(portalState.harianVisibleLimit) || PORTAL_BATCH_SIZE;
    const visible = q ? filtered : filtered.slice(0, harianLimit);

    if (countLabel) {
      countLabel.textContent = filtered.length === visible.length
        ? (filtered.length + " set dipaparkan")
        : ("Memaparkan " + visible.length + " / " + filtered.length + " set");
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="bento-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:32px">Tiada set soalan sepadan dengan carian atau penapis semasa.</div>';
      return;
    }

    grid.innerHTML = visible.map(function (item) {
      return renderQuizCardMarkup_(item, false);
    }).join("\n") + renderLoadMoreBarHtml_(visible.length, filtered.length, "js-load-more-harian", "js-show-all-harian");

    if (window.ETutorMotion) window.ETutorMotion.animateCatalogCards();
  }

  // --- [features/study-notes/notaCatalogView.js] ---
  /**
   * src/features/study-notes/notaCatalogView.js
   * Pemapar UI Katalog Nota Interaktif Visual (Desktop #moduleDropdownNota & Tab Telefon #phoneTabKertas).
   */
  const NOTA_CATALOG = [
    {
      "id": "sejarah-t4-bab01",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 1,
      "title": "Warisan Negara Bangsa",
      "subtitle": "Dari Tujuh Kerajaan Alam Melayu hingga Pembesar Empat Lipatan, Dwi-Kanun Bertulis Melaka & Waadat — Lengkap Foto Arkib & Audio ElevenLabs v4",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 24,
      "unitCount": 6,
      "stepCount": 30,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab01.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab01.html"
    },
    {
      "id": "sejarah-t4-bab02-v2",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 2,
      "title": "Kebangkitan Nasionalisme",
      "subtitle": "Edisi Sinematik & Suara AI — Audio Penerangan Auto-Main ElevenLabs v4, Galeri Potret Arkib Wikimedia, Simulasi Mesin Cetak & SFX Tematik",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 28,
      "unitCount": 7,
      "stepCount": 45,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej2-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab02-v2.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab02-v2.html"
    },
    {
      "id": "sejarah-t4-bab03",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 3,
      "title": "Konflik Dunia & Pendudukan Jepun di Negara Kita",
      "subtitle": "Nasionalisme awal, PD1 (1914–1918), PD2 Eropah & Asia Pasifik, serangan & dasar Jepun, Force 136, KMM/KRIS serta Bintang Tiga & Dato' Onn.",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 26,
      "unitCount": 6,
      "stepCount": 43,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej3-u3.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab03.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab03.html"
    },
    {
      "id": "sejarah-t4-bab04",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 4,
      "title": "Era Peralihan Kuasa British di Negara Kita",
      "subtitle": "Subtopik 4.1–4.7 KSSM (48 Langkah Bit-by-Bit) — BMA, Gagasan & Bantahan Malayan Union, UMNO, Penyerahan Sarawak (Rukun 13) & Penyerahan Sabah (SBUB).",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 48,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej4-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab04.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab04.html"
    },
    {
      "id": "sejarah-t4-bab05",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 5,
      "title": "Persekutuan Tanah Melayu 1948",
      "subtitle": "Subtopik 5.1–5.4 KSSM (45 Langkah Bit-by-Bit) — Jawatankuasa Kerja, PUTERA–AMCJA & Perlembagaan Rakyat, Faktor Penubuhan, Ciri-ciri Persekutuan & Kesan Kerjasama Kaum CLC.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 30,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej5-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab05.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab05.html"
    },
    {
      "id": "sejarah-t4-bab06",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 6,
      "title": "Ancaman Komunis dan Perisytiharan Darurat",
      "subtitle": "Subtopik 6.1–6.4 KSSM (46 Langkah Bit-by-Bit) — Kemasukan Pengaruh Komunis, PKM, Perisytiharan Darurat, 9 Usaha Pembanterasan, Rundingan Baling & Penamatan 1960.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej6-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab06.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab06.html"
    },
    {
      "id": "sejarah-t4-bab07",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 7,
      "title": "Usaha ke Arah Kemerdekaan",
      "subtitle": "Subtopik 7.1–7.5 KSSM (45 Langkah Bit-by-Bit) — Idea Negara Merdeka, Jawatankuasa Hubungan Antara Kaum (CLC), Sistem Ahli, Sistem Pendidikan Kebangsaan & Parti Politik.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej7-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab07.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab07.html"
    },
    {
      "id": "sejarah-t4-bab08",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 8,
      "title": "Pilihan Raya",
      "subtitle": "Subtopik 8.1-8.4 KSSM (46 Langkah Bit-by-Bit) — Perkembangan Pilihan Raya (1950-1962), Proses PRU Pertama 1955, Majlis Perundangan Persekutuan & Kabinet Pertama Persekutuan Tanah Melayu.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej8-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab08.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab08.html"
    },
    {
      "id": "sejarah-t4-bab09",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 9,
      "title": "Perlembagaan Persekutuan Tanah Melayu 1957",
      "subtitle": "Subtopik 9.1–9.4 KSSM (46 Langkah Bit-by-Bit) — Rundingan Kemerdekaan London, Suruhanjaya Reid, Penggubalan & Inti Pati Perjanjian PTM 1957.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej9-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab09.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab09.html"
    },
    {
      "id": "sejarah-t4-bab10",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 10,
      "title": "Pemasyhuran Kemerdekaan",
      "subtitle": "Subtopik 10.1–10.5 KSSM (46 Langkah Bit-by-Bit) — Pengertian Kemerdekaan, Persediaan Fizikal & Sambutan, Detik 30–31 Ogos 1957, Kesan Kemerdekaan (Politik, Antarabangsa, Ekonomi, Sosial) & Prinsip Kedaulatan.",
      "editionBadge": "Edisi Peta Kartografi & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sej10-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sejarah-t4-bab10.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab10.html"
    },
    {
      "id": "sejarah-t5-bab01",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 1,
      "title": "Bab 1: Kedaulatan Negara",
      "subtitle": "Subtopik 1.1–1.4 KSSM (37 Langkah Playable) — Takrif 4 Bahasa & 5 Tokoh, 4 Jenis Kedaulatan, 4 Ciri Negara Berdaulat (Peta CC0 Sempadan), Kepentingan Politik-Ekonomi-Sosial-Luar serta Langkah Pemerintah dan Rakyat.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 30,
      "unitCount": 5,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "sej51-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Konsep Kedaulatan — Takrif, Tokoh & 4 Jenis (1.1)",
          "stepTitle": "1.1 Definisi Kedaulatan & Takrif dalam 4 Bahasa",
          "caption": "Animasi 3D: Laman Istana Berdaulat dan Dewan Parlimen Negara dalam sinar fajar",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab01/video/sej51_video_kedaulatan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab01/video/sej51_video_kedaulatan.mp4"
        },
        {
          "unitId": "sej51-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Ciri Negara yang Berdaulat (1.2)",
          "stepTitle": "1.2 Ciri Pertama: Mempunyai Pemerintahan Teratur",
          "caption": "Video Penerangan 15s (BM): Empat ciri negara berdaulat — pemerintahan, sempadan, perundangan dan rakyat",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab01/video/sej51_video_ciri_berdaulat_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab01/video/sej51_video_ciri_berdaulat_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej51-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab01.html"
    },
    {
      "id": "sejarah-t5-bab02",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 2,
      "title": "Bab 2: Perlembagaan Persekutuan",
      "subtitle": "Subtopik 2.1–2.4 KSSM (38 Langkah Bit-by-Bit) — Asas Undang-Undang Melayu & Charter of Justice, Penggubalan 1877–1957 & Suruhanjaya Reid, 4 Ciri Tradisional & 3 Ciri Moden serta Pindaan 1963 dan 1965.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 38,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "sej52-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Latar Belakang Sejarah Perlembagaan Persekutuan (2.1)",
          "stepTitle": "2.1 Asas Pembentukan & Undang-Undang Negeri Melayu Awal",
          "caption": "Video Penerangan 15s (BM): Prinsip keluhuran Perlembagaan Persekutuan, ciri tradisional dan ciri moden negara",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab02/video/sej52_video_perlembagaan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab02/video/sej52_video_perlembagaan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej52-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab02.html"
    },
    {
      "id": "sejarah-t5-bab03",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 3,
      "title": "Bab 3: Raja Berperlembagaan dan Demokrasi Berparlimen",
      "subtitle": "Subtopik 3.1–3.5 KSSM (43 Langkah Bit-by-Bit) — Evolusi Pemerintahan Beraja (Melaka hingga Merdeka), Institusi Majlis Raja-Raja & Mohor Besar, Kedudukan & Kuasa Yang di-Pertuan Agong (Perkara 32), Pilihan Raya, Kebebasan Asasi & Pengasingan Kuasa serta Keunikan Demokrasi Berparlimen.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 43,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sej53-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Latar Belakang Pemerintahan Beraja & Demokrasi (3.1)",
          "stepTitle": "3.1 Pemerintahan Beraja Kesultanan Melaka & Legasi 9 Negeri",
          "caption": "Animasi 3D: Dewan Parlimen dan singgahsana diraja dalam sistem Raja Berperlembagaan",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab03/video/sej53_video_parlimen_raja.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab03/video/sej53_video_parlimen_raja.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej53-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab03.html"
    },
    {
      "id": "sejarah-t5-bab04",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 4,
      "title": "Bab 4: Sistem Persekutuan",
      "subtitle": "Subtopik 4.1–4.4 — Evolusi Negara Bersekutu, Tiga Senarai Kuasa, Sinergi Pusat–Negeri & Keluhuran Perlembagaan",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 39,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "sej54-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Latar Belakang Sistem Persekutuan (4.1)",
          "stepTitle": "4.1 Konsep Persekutuan & Konfederasi Negeri Sembilan (1889–1898)",
          "caption": "Video Penerangan 15s (BM): Pembahagian kuasa Persekutuan, Negeri dan Bersama demi kestabilan rakyat",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab04/video/sej54_video_persekutuan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab04/video/sej54_video_persekutuan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej54-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab04.html"
    },
    {
      "id": "sejarah-t5-bab05",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 5,
      "title": "Bab 5: Pembentukan Malaysia",
      "subtitle": "Subtopik 5.1–5.6 KSSM (42 Langkah Bit-by-Bit) — Konsep Gagasan Malaysia, Perkembangan Idea & 4 Rasional, Reaksi Tempatan & Jiran, JSKM/Cobbold/JAK, MA63 & Pengisytiharan 16 September 1963 serta Diplomasi Menangani Konfrontasi.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 42,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sej55-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Konsep Gagasan Malaysia & Peta Penyatuan 1963",
          "stepTitle": "5.1 Konsep Gagasan Malaysia & Negara Persekutuan Berdaulat",
          "caption": "Video Interaktif: Penggabungan wilayah bekas jajahan British membentuk Persekutuan Malaysia pada tahun 1963",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab05/video/sej55_video_pembentukan_malaysia.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab05/video/sej55_video_pembentukan_malaysia.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej55-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab05.html"
    },
    {
      "id": "sejarah-t5-bab06",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 6,
      "title": "Bab 6: Cabaran Selepas Pembentukan Malaysia",
      "subtitle": "Subtopik 6.1–6.5 KSSM — Cabaran Dalaman Borneo & Krisis Sarawak 1966, Pemisahan Singapura 1965, Ancaman Komunis (RASCOM & Hat Yai 1989), RMK1 (1966–1970) serta Tragedi 13 Mei 1969 & MAGERAN.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 41,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "sej56-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Cabaran Dalaman Malaysia & Krisis Sarawak (6.1)",
          "stepTitle": "6.1 Cabaran Pembangunan & Sosioekonomi Sarawak–Sabah",
          "caption": "Video Penerangan 15s (BM): Cabaran awal selepas pembentukan Malaysia — Singapura, ancaman komunis dan MAGERAN",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab06/video/sej56_video_cabaran_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab06/video/sej56_video_cabaran_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej56-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab06.html"
    },
    {
      "id": "sejarah-t5-bab07",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 7,
      "title": "Bab 7: Membina Kesejahteraan Negara",
      "subtitle": "Subtopik 7.1–7.6 KSSM (44 Langkah Playable) — Perpaduan & Integrasi Nasional, Dasar Pendidikan Kebangsaan, Bahasa Melayu Bahasa Ilmu & Perpaduan, Dasar Kebudayaan Kebangsaan, Sukan Alat Perpaduan serta Rukun Negara Tonggak Kesejahteraan.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sej57-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Perpaduan dan Integrasi Nasional (7.1)",
          "stepTitle": "7.1 Perpaduan Kaum, Integrasi Nasional & Feri Malaysia (1986)",
          "caption": "Video Interaktif: Semangat perpaduan pelbagai kaum dan integrasi nasional sebagai asas kesejahteraan Malaysia",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab07/video/sej57_video_perpaduan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab07/video/sej57_video_perpaduan.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej57-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab07.html"
    },
    {
      "id": "sejarah-t5-bab08",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 8,
      "title": "Bab 8: Membina Kemakmuran Negara",
      "subtitle": "Subtopik 8.1–8.5 — Pembentukan & Pelaksanaan DEB (1970–1990), Pembentukan & Pelaksanaan DPN (1991–2000) serta Pencapaian Sosial dan Ekonomi Negara",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 39,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "sej58-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pembentukan Dasar Ekonomi Baru (8.1)",
          "stepTitle": "8.1 Latar Belakang DEB, MAPEN (Jan 1970) & RRJP1",
          "caption": "Video Penerangan 15s (BM): Matlamat Dasar Ekonomi Baru (DEB) dan Dasar Pembangunan Nasional (DPN)",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab08/video/sej58_video_deb_dpn_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab08/video/sej58_video_deb_dpn_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej58-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab08.html"
    },
    {
      "id": "sejarah-t5-bab09",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 9,
      "title": "Bab 9: Dasar Luar Malaysia",
      "subtitle": "Subtopik 9.1–9.8 KSSM (43 Langkah Bit-by-Bit) — Evolusi Hubungan Luar (424 M–Kini), Wisma Putra & 4 Faktor Penggubalan, PBB (Piagam, Agensi, Pengaman & 5 Tokoh), Komanwel, Cabaran 1970-an, ASEAN & ZOPFAN, NAM serta OIC.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 43,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sej59-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Latar Belakang & Asas Penggubalan Dasar Luar (9.1–9.2)",
          "stepTitle": "9.1 Zaman British & Dua Fasa Dasar Luar Selepas Kemerdekaan",
          "caption": "Animasi 3D: Evolusi dasar luar Malaysia daripada era Wisma Putra hingga kerjasama serantau ASEAN dan ZOPFAN",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab09/video/sej59_video_dasar_luar_asean.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab09/video/sej59_video_dasar_luar_asean.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej59-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab09.html"
    },
    {
      "id": "sejarah-t5-bab10",
      "subject": "Sejarah",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 10,
      "title": "Bab 10: Kecemerlangan Malaysia di Persada Dunia",
      "subtitle": "Subtopik 10.1–10.5 — Isu Global Kontemporari, Peranan Ekonomi Antarabangsa (AFTA & RM3.80), Misi Kemanusiaan (Palestin, Syria & Tsunami), Kelestarian (Langkawi & Antartika) serta Wawasan Masa Hadapan",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sej510-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Malaysia dalam Isu Global Kontemporari (10.1)",
          "stepTitle": "10.1 Penyalahgunaan Dadah & Pertindihan Sempadan",
          "caption": "Animasi 3D: Diplomasi berprinsip Malaysia di persada PBB, ASEAN, kelestarian alam dan wawasan masa hadapan",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sejarah-t5-bab10/video/sej510_video_global_wawasan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sejarah-t5-bab10/video/sej510_video_global_wawasan.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sej510-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/sejarah-t5-bab10.html"
    },
    {
      "id": "bahasa-melayu-t4-tatabahasa",
      "subject": "Bahasa Melayu",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 1,
      "title": "Sistem Bahasa KSSM: Morfologi & Sintaksis (SP 5.1–5.3)",
      "subtitle": "Kata tunggal, majmuk, terbitan, ganda & akronim, golongan kata, frasa, 4 pola ayat dasar, ayat songsang, majmuk serta ragam ayat SPM.",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 22,
      "unitCount": 5,
      "stepCount": 33,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/bm-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/bahasa-melayu-t4-tatabahasa.jpg",
      "htmlPath": "./nota-interaktif/dist/bahasa-melayu-t4-tatabahasa.html"
    },
    {
      "id": "bahasa-inggeris-t4-mod01",
      "subject": "Bahasa Inggeris",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 1,
      "title": "Module 1: Let's Chat (1119 CEFR Grammar & Communication)",
      "subtitle": "Present Simple vs Continuous, Stative Verbs, Comparisons, Past Simple, Used to vs Be/Get Used to, Suffix Nouns (-ion/-ation/-ment) & Informal Email Writing.",
      "editionBadge": "Interactive Multimedia & AI Coach",
      "estimatedMinutes": 22,
      "unitCount": 5,
      "stepCount": 33,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/bi-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/bahasa-inggeris-t4-mod01.jpg",
      "htmlPath": "./nota-interaktif/dist/bahasa-inggeris-t4-mod01.html"
    },
    {
      "id": "matematik-t4-bab01",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 1,
      "title": "Fungsi & Persamaan Kuadratik dalam Satu Pemboleh Ubah",
      "subtitle": "Bentuk am ax^2 + bx + c, kesan pekali parabola, paksi simetri, pemfaktoran, punca graf dan penyelesaian masalah KBAT SPM.",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 22,
      "unitCount": 5,
      "stepCount": 31,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/mat-u2.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/matematik-t4-bab01.jpg",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab01.html"
    },
    {
      "id": "matematik-t4-bab02",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 2,
      "title": "Asas Nombor",
      "subtitle": "Subtopik 2.1 KSSM (31 Langkah Bit-by-Bit) — Digit Sah Asas 2–10, Brahmagupta & Konrad Zuse, Nilai Tempat aⁿ, Nilai Digit & Cerakinan, Pembahagian Berulang & Nilai Tempat, Jambatan Asas p -> 10 -> q, Triplet Pantas Asas 2 <-> Asas 8, Kalkulator Mod BASE, Tambah & Tolak Bentuk Lazim serta KBAT SPM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 30,
      "unitCount": 6,
      "stepCount": 31,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat42-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Asas Nombor, Digit Sah & Nilai Tempat",
          "stepTitle": "Asas Nombor dalam Teknologi Moden & Peraturan Digit Sah",
          "caption": "Video Penerangan 3D: Rahsia asas nombor daripada asas sepuluh kehidupan harian hingga logik binari komputer moden",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab02/video/mat42_video_asas_nombor_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab02/video/mat42_video_asas_nombor_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat42-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab02.html"
    },
    {
      "id": "matematik-t4-bab03",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 3,
      "title": "Bab 3: Penaakulan Logik",
      "subtitle": "Subtopik 3.1–3.2 KSSM (42 Langkah Bit-by-Bit) — Pernyataan Benar/Palsu, Pengkuantiti, Penafian (~p), Pernyataan Majmuk (dan/atau), Implikasi, Akas, Songsangan, Kontrapositif, Contoh Penyangkal, Hujah Deduktif (Bentuk I–III, Sah & Munasabah) serta Hujah Induktif & Masalah KBAT.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 42,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat43-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pernyataan, Pengkuantiti & Penafian (~p)",
          "stepTitle": "3.1 Maksud Pernyataan & Penentuan Nilai Kebenaran",
          "caption": "Video Penerangan (BM): Penaakulan logik dalam perbahasan, pengkomputeran serta asas pernyataan benar dan palsu",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab03/video/mat43_video_logik_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab03/video/mat43_video_logik_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat43-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab03.html"
    },
    {
      "id": "matematik-t4-bab04",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 4,
      "title": "Bab 4: Operasi Set",
      "subtitle": "Subtopik 4.1–4.3 KSSM (40 Langkah Bit-by-Bit) — Persilangan Set (P ∩ Q), Pelengkap Persilangan (P ∩ Q)', Kesatuan Set (P ∪ Q), Pelengkap Kesatuan (P ∪ Q)', Gabungan Operasi Set, Peta Rantau Roman I–VIII & Aplikasi n(A).",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 40,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat44-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Persilangan Set (P ∩ Q) & Kes Khas Rajah Venn",
          "stepTitle": "4.1 Definisi Persilangan Set (P ∩ Q) & Analogi Gerhana",
          "caption": "Video Penerangan Bersuara (BM): Konsep Persilangan Set (P ∩ Q), Kesatuan Set (P ∪ Q) dan Lorekan Rajah Venn",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab04/video/mat44_video_operasi_set_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab04/video/mat44_video_operasi_set_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat44-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab04.html"
    },
    {
      "id": "matematik-t4-bab05",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 5,
      "title": "Bab 5: Rangkaian dalam Teori Graf",
      "subtitle": "Subtopik 5.1 KSSM (35 Langkah Bit-by-Bit) — Bucu V, Tepi E, Darjah d(v), Teorem ∑d = 2E, Graf Mudah vs Berbilang Tepi & Gelung, Graf Terarah vs Tak Terarah, Graf Berpemberat, Subgraf, Pokok Minimum & Masalah Rangkaian Pengangkutan.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 30,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat45-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Asas Rangkaian, Bucu V, Tepi E & Darjah d(v)",
          "stepTitle": "Konsep Graf & Rangkaian Dunia Sebenar (Pengangkutan, Sosial & Sejuk)",
          "caption": "Animasi 3D: Bucu dan tepi saling berhubung membentuk rangkaian graf mudah, berbilang tepi serta gelung",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab05/video/mat45_video_graf_rangkaian.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab05/video/mat45_video_graf_rangkaian.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat45-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab05.html"
    },
    {
      "id": "matematik-t4-bab06",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 6,
      "title": "Bab 6: Ketaksamaan Linear dalam Dua Pemboleh Ubah",
      "subtitle": "Subtopik 6.1–6.2 KSSM (37 Langkah Bit-by-Bit) — Pemodelan Situasi & Penukaran Unit, Tentusah Titik (Atas/Pada/Bawah), Garis Padu vs Sempang, Hukum Pekali Negatif, Pantulan Paksi, Sistem & Rantau Sepunya serta Pengoptimuman Bajet SPM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat46-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pengenalan Ketaksamaan Linear & Pemodelan Situasi",
          "stepTitle": "6.1 Daripada Satu Pemboleh Ubah ke Dua Pemboleh Ubah",
          "caption": "Video Penerangan Bersuara (BM): Garis Sempadan Padu vs Sempang, Tentusah Titik & Rantau Sepunya Sistem Ketaksamaan",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab06/video/mat46_video_ketaksamaan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab06/video/mat46_video_ketaksamaan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat46-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab06.html"
    },
    {
      "id": "matematik-t4-bab07",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 7,
      "title": "Graf Gerakan",
      "subtitle": "Subtopik 7.1–7.2 KSSM (35 Langkah Bit-by-Bit) — Melukis & Mentafsir Graf Jarak-Masa (Kecerunan = Laju, Pegun, Patah Balik, Laju Purata), Graf Laju-Masa (Luas Segi Tiga/Segi Empat/Trapezium = Jarak, Pecutan, Nyahpecutan), Zon Informasi (Skalar vs Vektor) & Masalah Gabungan SPM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat47-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Asas Graf Jarak-Masa & Plot Persamaan",
          "stepTitle": "7.1 Mengenali Paksi Graf Jarak-Masa & Makna Kecerunan",
          "caption": "Video Penerangan Bersuara (BM): Konsep Graf Jarak-Masa, Graf Laju-Masa, Kecerunan dan Luas Di Bawah Graf",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab07/video/mat47_video_graf_gerakan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab07/video/mat47_video_graf_gerakan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat47-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab07.html"
    },
    {
      "id": "matematik-t4-bab08",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 8,
      "title": "Sukatan Serakan Data Tak Terkumpul",
      "subtitle": "Subtopik 8.1–8.2 KSSM (33 Langkah Bit-by-Bit) — Konsep Serakan, Plot Batang-dan-Daun & Plot Titik, Julat, Kuartil (Q1, Q2, Q3) & Kekerapan Longgokan, Varians (σ²) & Sisihan Piawai (σ), Plot Kotak & Pencilan serta Kesan Perubahan Seragam Data.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 33,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat48-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Konsep Serakan, Plot Batang-dan-Daun & Plot Titik",
          "stepTitle": "8.1 Maksud Serakan, Etika Data & Jaringan Kata",
          "caption": "Video Penerangan Bersuara (BM): Konsep Serakan, Plot Batang-dan-Daun, Plot Titik, Kuartil, Plot Kotak & Sisihan Piawai",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab08/video/mat48_video_serakan_tak_terkumpul_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab08/video/mat48_video_serakan_tak_terkumpul_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat48-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab08.html"
    },
    {
      "id": "matematik-t4-bab09",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 9,
      "title": "Kebarangkalian Peristiwa Bergabung",
      "subtitle": "Subtopik 9.1–9.4 KSSM (35 Langkah Bit-by-Bit) — Ruang Sampel S & Pasangan Bertertib, Peristiwa Bersandar vs Tak Bersandar, Gambar Rajah Pokok, Saling Eksklusif vs Bertindih (Venn), Hukum Pendaraban & Penambahan serta Aplikasi KBAT SPM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat49-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Peristiwa Bergabung & Ruang Sampel S",
          "stepTitle": "Teori Kebarangkalian, Maslahat Bab & Peristiwa Bergabung",
          "caption": "Simulasi 3D: Percabangan kebarangkalian peristiwa bergabung melalui lambungan dadu, syiling dan cabutan guli berwarna",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab09/video/mat49_video_kebarangkalian.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab09/video/mat49_video_kebarangkalian.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat49-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab09.html"
    },
    {
      "id": "matematik-t4-bab10",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 10,
      "title": "Matematik Pengguna: Pengurusan Kewangan",
      "subtitle": "Subtopik 10.1 KSSM (30 Langkah Bit-by-Bit) — Lima Proses Pengurusan Kewangan, Matlamat SMART, Penilaian Aset vs Liabiliti, Aliran Tunai Positif/Defisit, Pelaksanaan & Semakan Kemajuan serta Kebolehlaksanaan Jangka Pendek & Panjang.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 30,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat410-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Proses Pengurusan Kewangan & Matlamat SMART",
          "stepTitle": "10.1 Definisi Pengurusan Kewangan, Tokoh BNM & 5 Proses",
          "caption": "Video Penerangan Bersuara (BM): Proses Pengurusan Kewangan, Konsep SMART, Aset vs Liabiliti dan Pengurusan Aliran Tunai",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t4-bab10/video/mat410_video_kewangan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t4-bab10/video/mat410_video_kewangan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat410-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab10.html"
    },
    {
      "id": "matematik-t5-bab01",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 1,
      "title": "Ubahan",
      "subtitle": "Subtopik 1.1–1.3 KSSM (32 Langkah Bit-by-Bit) — Ubahan Langsung y ∝ x^n & Graf Asalan, Ubahan Tercantum & Hukum Charles, Ubahan Songsang y ∝ 1/x^n & Graf Hiperbola, Ubahan Bergabung y ∝ x^m/z^n serta Aplikasi Sains & Kejuruteraan SPM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 32,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat51-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Ubahan Langsung, Pemalar k & Graf Asalan",
          "stepTitle": "1.1 Maksud Ubahan Langsung, Simbol ∝ & Graf Melalui Asalan",
          "caption": "Video Penerangan Bersuara (BM): Konsep Ubahan Langsung (y = kx^n), Ubahan Songsang (y = k/x^n), Graf Hiperbola vs Garis Lurus & Ubahan Bergabung",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab01/video/mat51_video_ubahan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab01/video/mat51_video_ubahan_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat51-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab01.html"
    },
    {
      "id": "matematik-t5-bab02",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 2,
      "title": "Matriks",
      "subtitle": "Subtopik 2.1–2.2 KSSM (35 Langkah Bit-by-Bit) — Mewakilkan Maklumat, Peringkat m × n & Unsur aᵢⱼ, Matriks Sama, Tambah & Tolak, Pendaraban Skalar, Hukum Aritmetik, Pendaraban Matriks (m × n)(n × p), Matriks Identiti I, Matriks Songsang A⁻¹ & Persamaan Linear Serentak.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat52-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pengenalan Matriks, Peringkat m × n & Matriks Sama",
          "stepTitle": "Mewakilkan Maklumat dalam Bentuk Matriks & Jenis Bentuknya",
          "caption": "Simulasi 3D: Transformasi tatasusun nombor dalam grid baris dan lajur serta aplikasi pemetaan matriks",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab02/video/mat52_video_matriks_transformasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab02/video/mat52_video_matriks_transformasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat52-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab02.html"
    },
    {
      "id": "matematik-t5-bab03",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 3,
      "title": "Matematik Pengguna: Insurans",
      "subtitle": "Subtopik 3.1 KSSM (34 Langkah Bit-by-Bit) — Konsep Risiko, Akta Insurans 1996, Prinsip Indemniti, Insurans Hayat vs 5 Insurans Am & Berkelompok, Tarif Motor 2015 + NCD, Deduktibel & Ko-Insurans Harta/Kesihatan.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 34,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat53-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Konsep Risiko, Akta Insurans & Prinsip Indemniti",
          "stepTitle": "Makna Risiko, Kawal Selia BNM & Peranan Aktuari",
          "caption": "Video Penerangan Bersuara: Pengurusan Risiko, Insurans Hayat vs Am & Prinsip Indemniti",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab03/video/mat53_video_insurans_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab03/video/mat53_video_insurans_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat53-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab03.html"
    },
    {
      "id": "matematik-t5-bab04",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 4,
      "title": "Matematik Pengguna: Percukaian",
      "subtitle": "Subtopik 4.1 KSSM (34 Langkah Bit-by-Bit) — Tujuan Percukaian, 5 Jenis Cukai & Kesan Pengelakan, Pendapatan Bercukai & Kadar Progresif, Rebat RM400 & Zakat, Imbangan PCB, Taksiran Bersama vs Berasingan, Cukai Jalan, Pintu, Tanah & SST.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 34,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat54-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Tujuan Percukaian, 5 Jenis Cukai & Pengelakan Cukai",
          "stepTitle": "Makna Percukaian, 4 Tujuan Utama & Kuasa Kutipan",
          "caption": "Video Penerangan Bersuara (BM): Tujuan Percukaian, 5 Jenis Cukai Malaysia, Kadar Progresif & Rebat",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab04/video/mat54_video_percukaian_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab04/video/mat54_video_percukaian_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat54-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab04.html"
    },
    {
      "id": "matematik-t5-bab05",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 5,
      "title": "Kekongruenan, Pembesaran dan Gabungan Transformasi",
      "subtitle": "Subtopik 5.1–5.4 KSSM (31 Langkah Bit-by-Bit) — Kekongruenan Poligon & Segi Tiga (SSS, SAS, ASA, AAS, RHS vs AAA/SSA), Keserupaan & Faktor Skala k (+ & -), Luas Imej k² × Luas Objek, Gabungan Transformasi AB & Kalis Tukar Tertib serta Teselasi Isometri & Corak Escher.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 31,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat55-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Kekongruenan Poligon & Sifat Segi Tiga",
          "stepTitle": "5.1 Makna Kekongruenan, Mercu Tanda Malaysia & Syarat Poligon",
          "caption": "Animasi 3D: Bentuk kongruen mengekalkan saiz serta sudut sepadan dan membentuk pola teselasi rapat",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab05/video/mat55_video_kekongruenan_teselasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab05/video/mat55_video_kekongruenan_teselasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat55-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab05.html"
    },
    {
      "id": "matematik-t5-bab06",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 6,
      "title": "Nisbah dan Graf Fungsi Trigonometri",
      "subtitle": "Subtopik 6.1–6.2 KSSM (35 Langkah Bit-by-Bit) — Bulatan Unit (kos θ, sin θ), 4 Sukuan & Petua ASTC, Sudut Rujukan Sepadan α, Sudut Khas (30°, 45°, 60°) & Sudut Paksi, Persamaan sin/kos/tan θ = k, Graf Asas & Asimptot, Kesan Pemalar a, b, c serta Permodelan Gelombang.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat56-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Bulatan Unit, 4 Sukuan & Nisbah (kos θ, sin θ)",
          "stepTitle": "Bulatan Unit (r = 1), Putaran Lawan Jam & Koordinat (kos θ, sin θ)",
          "caption": "Animasi 3D: Putaran jejari bulatan unit menghasilkan gelombang sinus dan kosinus secara berkala",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab06/video/mat56_video_trigonometri_gelombang.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab06/video/mat56_video_trigonometri_gelombang.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat56-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab06.html"
    },
    {
      "id": "matematik-t5-bab07",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 7,
      "title": "Sukatan Serakan Data Terkumpul",
      "subtitle": "Subtopik 7.1–7.2 KSSM (35 Langkah Bit-by-Bit) — Had & Sempadan Kelas, Histogram & Poligon Kekerapan, 5 Bentuk Taburan, Ogif (Q1, Q2, Q3 & Persentil), Julat & Julat Antara Kuartil, Varians, Sisihan Piawai, Plot Kotak serta Perbandingan Dua Set Data.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 35,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "mat57-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Jadual Kekerapan, Histogram & Poligon Kekerapan",
          "stepTitle": "Selang Kelas, Had, Titik Tengah, Sempadan & Kekerapan Longgokan",
          "caption": "Animasi 3D: Penyusunan data terkumpul kepada histogram, lengkung ogif dan taburan sisihan piawai",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab07/video/mat57_video_sukatan_serakan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab07/video/mat57_video_sukatan_serakan.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat57-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab07.html"
    },
    {
      "id": "matematik-t5-bab08",
      "subject": "Matematik",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 8,
      "title": "Pemodelan Matematik",
      "subtitle": "Subtopik 8.1 KSSM (33 Langkah Bit-by-Bit) — 6 Komponen Pemodelan & Gelung Pemurnian, Terowong SMART & Soalan Terbuka, Kajian Kes Pasar Raya & Bot Sungai, Pemodelan Fungsi Linear, Kuadratik & Eksponen, Faedah Kompaun n Kali, Hipertermia Kubus, Jarak Berhenti & CABAR Jambatan Gantung.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 33,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "mat58-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Konsep Asas & 6 Komponen Pemodelan Matematik",
          "stepTitle": "8.1 Makna Model Matematik, Terowong SMART & Soalan Terbuka",
          "caption": "Video Penerangan Bersuara (BM): Proses 6 Komponen Pemodelan Matematik serta Aplikasi Fungsi Linear, Kuadratik & Eksponen",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/matematik-t5-bab08/video/mat58_video_pemodelan_matematik_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/matematik-t5-bab08/video/mat58_video_pemodelan_matematik_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/mat58-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/matematik-t5-bab08.html"
    },
    {
      "id": "sains-t4-bab01",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 1,
      "title": "Langkah Keselamatan di dalam Makmal",
      "subtitle": "Peralatan perlindungan diri (PPE), pengurusan sisa singki & biologi Kategori A-D, SOP tumpahan kimia/merkuri, dan jenis pemadam kebakaran.",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 20,
      "unitCount": 5,
      "stepCount": 32,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sai-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab01.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab01.html"
    },
    {
      "id": "sains-t4-bab02",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 2,
      "title": "Bantuan Kecemasan (CPR & Heimlich Manoeuvre)",
      "subtitle": "Subtopik 2.1 & 2.2 KSSM — Talian 999, Kaedah & Kepentingan CPR (30:2), Heimlich Manoeuvre & Penyelamatan Diri Sendiri.",
      "editionBadge": "Edisi Interaktif Webflow Bento 3D",
      "estimatedMinutes": 22,
      "unitCount": 5,
      "stepCount": 25,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sai2-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab02.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab02.html"
    },
    {
      "id": "sains-t4-bab03",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 3,
      "title": "Teknik Mengukur Parameter Kesihatan Badan",
      "subtitle": "Subtopik 3.1–3.4 KSSM (48 Langkah Bit-by-Bit) — Termometer 3D, Titik Nadi & Eksperimen 3.1, Sfigmomanometer & CPG 2018, Rumus BMI & Pinggan Sihat Malaysia.",
      "editionBadge": "Edisi Animasi 3D Three.js & Suara AI",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 48,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 0,
      "narratedVideoCount": 0,
      "videos": [],
      "coverIconPath": "./nota-interaktif/assets/icons/sai3-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab03.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab03.html"
    },
    {
      "id": "sains-t4-bab04",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 4,
      "title": "Teknologi Hijau dalam Melestarikan Alam",
      "subtitle": "Subtopik 4.1–4.6 KSSM (45 Langkah Bit-by-Bit) — 4 Tonggak & 7 Sektor, Tenaga Boleh Baharu, Sisa 5R, Pertanian & Perhutanan, Pengangkutan Hijau serta Jejak Karbon.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai4-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Isu Sosiosaintifik & Sektor Tenaga",
          "stepTitle": "Tenaga Boleh Baharu: Solar, Angin, Hidro, Geoterma, Ombak & Biojisim",
          "caption": "Animasi 3D: Penjanaan tenaga boleh baharu daripada turbin angin, panel suria dan empangan hidroelektrik",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab04/video/sai4_video_green_energy.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab04/video/sai4_video_green_energy.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai4-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab04.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab04.html"
    },
    {
      "id": "sains-t4-bab05",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 5,
      "title": "Genetik",
      "subtitle": "Subtopik 5.1–5.5 KSSM (46 Langkah Interaktif) — DNA, Mitosis & Meiosis, Pewarisan Mendel, Mutasi & Kariotip, Kejuruteraan Genetik GMO & Variasi.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 30,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai5-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: DNA, Kromosom, Mitosis & Meiosis",
          "stepTitle": "Kariotip Manusia (46 Kromosom) & 4 Fasa Mitosis (PMAT)",
          "caption": "Animasi 3D: Pergerakan kromosom semasa pembahagian mitosis menghasilkan dua sel anak seiras",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab05/video/sai5_video_mitosis_dna.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab05/video/sai5_video_mitosis_dna.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai5-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab05.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab05.html"
    },
    {
      "id": "sains-t4-bab06",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 6,
      "title": "Sokongan, Pergerakan dan Pertumbuhan",
      "subtitle": "Subtopik 6.1–6.3 KSSM (46 Langkah Bit-by-Bit) — 3 Jenis Rangka & Daya Apungan, Lengkung Ekdisis & Pusat Graviti, Otot Antagonis, Pola Pertumbuhan, Sokongan Tumbuhan & Gelang Tahun.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai6-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Sistem Rangka Manusia, Sendi & Otot Antagonis",
          "stepTitle": "Mekanisme Otot Berantagonis (Biseps & Triseps)",
          "caption": "Animasi 3D: Tindakan berantagonis otot biseps dan triseps semasa membengkok serta meluruskan lengan",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab06/video/sai6_video_antagonistic_arm.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab06/video/sai6_video_antagonistic_arm.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai6-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab06.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab06.html"
    },
    {
      "id": "sains-t4-bab07",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 7,
      "title": "Koordinasi Badan",
      "subtitle": "Subtopik 7.1–7.3 KSSM (46 Langkah Bit-by-Bit) — Sistem Endokrin & 6 Kelenjar Utama, Ketidakseimbangan Hormon, 4 Kategori Dadah, Kesan Alkohol & Minda yang Sihat.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai7-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Sistem Endokrin & 6 Kelenjar Utama",
          "stepTitle": "Cara Tindakan Sistem Endokrin, Hormon & Organ Sasaran",
          "caption": "Animasi 3D: Molekul hormon bergerak melalui salur darah menuju ke sel sasaran",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab07/video/sai7_video_endocrine_hormone.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab07/video/sai7_video_endocrine_hormone.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai7-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab07.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab07.html"
    },
    {
      "id": "sains-t4-bab08",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 8,
      "title": "Unsur dan Bahan",
      "subtitle": "Subtopik 8.1–8.3 KSSM (45 Langkah Bit-by-Bit) — Asas Jirim (Atom, Molekul, Ion & Sifat Fizik), Jadual Berkala Unsur Moden, Susunan Elektron (Z=1–20), Pembentukan Kation & Anion, serta Isotop & Radioisotop.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai8-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Asas Jirim — Atom, Molekul, Ion & Sifat Fizik",
          "stepTitle": "Rencana Sains: 118 Unsur & 3 Zarah Asas Jirim",
          "caption": "Animasi 3D: Nukleus bercas positif mengandungi proton serta neutron dikelilingi petala elektron",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab08/video/sai8_video_atom_isotope.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab08/video/sai8_video_atom_isotope.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai8-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab08.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab08.html"
    },
    {
      "id": "sains-t4-bab09",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 9,
      "title": "Kimia Industri",
      "subtitle": "Subtopik 9.1–9.3 KSSM (45 Langkah Bit-by-Bit) — Aloi & Superkonduktor, 4 Jenis Kaca & Seramik, Polimer, Lateks, Pemvulkanan & Teknologi Getah Terkini.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai9-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pengaloian & 5 Aloi Utama Industri",
          "stepTitle": "Pengaloian: Mengapa Atom Asing Menguatkan Logam Tulen",
          "caption": "Animasi 3D: Atom asing menghalang lapisan atom logam tulen daripada menggelongsor",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab09/video/sai9_video_alloy_lattice.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab09/video/sai9_video_alloy_lattice.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai9-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab09.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab09.html"
    },
    {
      "id": "sains-t4-bab10",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 10,
      "title": "Kimia dalam Perubatan dan Kesihatan",
      "subtitle": "Subtopik 10.1–10.4 KSSM (45 Langkah Bit-by-Bit) — Perubatan Tradisional, Moden & Komplementari, Radikal Bebas, Antioksidan, Eksperimen Pengoksidaan Epal & Produk Kesihatan KKM.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai10-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Radikal Bebas & Mekanisme Bahan Antioksidan",
          "stepTitle": "Bahan Antioksidan: Perisai Penderma Elektron Menentang Pengoksidaan",
          "caption": "Animasi 3D: Molekul antioksidan menderma elektron untuk meneutralkan radikal bebas yang mengancam sel",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab10/video/sai10_video_antioxidant.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab10/video/sai10_video_antioxidant.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai10-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab10.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab10.html"
    },
    {
      "id": "sains-t4-bab11",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 11,
      "title": "Daya dan Gerakan",
      "subtitle": "Subtopik 11.1–11.4 KSSM (46 Langkah Bit-by-Bit) — Gerakan Linear & Pita Detik 50 Hz, Graf s-t dan v-t, Pecutan Graviti & Jatuh Bebas Vakum, serta Jisim, Inersia & Hukum Gerakan Newton Pertama.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai11-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Pecutan Graviti g, Jatuh Bebas & Antigraviti",
          "stepTitle": "Pecutan Graviti (g = 10 m s^-2) & Jatuh Bebas dalam Vakum",
          "caption": "Animasi 3D: Bola keluli dan bulu pelepah jatuh serentak dalam tiub vakum tanpa rintangan udara",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab11/video/sai11_video_freefall_vacuum.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab11/video/sai11_video_freefall_vacuum.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai11-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab11.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab11.html"
    },
    {
      "id": "sains-t4-bab12",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 4,
      "chapterNumber": 12,
      "title": "Tenaga Nuklear",
      "subtitle": "Subtopik 12.1–12.4 KSSM (44 Langkah Bit-by-Bit) — Manfaat vs Risiko, Pembelahan & Pelakuran Nukleus, Reaktor Penjanaan Elektrik, Impak Radiasi & Masa Depan Tenaga Malaysia.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai12-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Pembelahan vs Pelakuran Nukleus",
          "stepTitle": "Pembelahan Nukleus Uranium-235 & Tindak Balas Berantai",
          "caption": "Animasi 3D: Pembelahan nukleus uranium-235 membebaskan tenaga nuklear dan tiga neutron baru",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t4-bab12/video/sai12_video_nuclear_fission.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t4-bab12/video/sai12_video_nuclear_fission.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai12-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t4-bab12.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab12.html"
    },
    {
      "id": "sains-t5-bab01",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 1,
      "title": "Mikroorganisma",
      "subtitle": "Subtopik 1.1–1.3 KSSM (44 Langkah Bit-by-Bit) — Flora Normal & 5 Kumpulan Mikrob, Eksperimen 1.1–1.2 & 5 Faktor Pertumbuhan, Mikrob Berfaedah, Ekoenzim 3:1:10 & Serum Lactobacillus, Teknik Aseptik, Antibiotik & Rawatan Penyakit.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai51-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Dunia Mikroorganisma — Flora Normal & 5 Kumpulan Mikrob",
          "stepTitle": "Pengelasan 5 Kumpulan Mikrob: Fungi, Alga & Protozoa",
          "caption": "Animasi 3D: Kepelbagaian bakteria, yis bertunas dan protozoa bergerak dalam bendalir mikroskop",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab01/video/sai51_video_microbes.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab01/video/sai51_video_microbes.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai51-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab01.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab01.html"
    },
    {
      "id": "sains-t5-bab02",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 2,
      "title": "Nutrisi dan Teknologi Makanan",
      "subtitle": "Subtopik 2.1–2.6 KSSM (45 Langkah Bit-by-Bit) — Gizi Seimbang & Kalori, Nutrien Tumbuhan, Kitar Nitrogen, Pengeluaran Makanan, Pemprosesan Makanan serta Akta & Status Halal.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai52-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Kitar Nitrogen & Keseimbangan Alam",
          "stepTitle": "Kitar Nitrogen: 3 Proses Penambahan Ion Nitrat ke Tanah",
          "caption": "Animasi 3D: Bakteria pengikat nitrogen dalam nodul akar kekacang menukar gas nitrogen kepada nitrat",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab02/video/sai52_video_nitrogen_cycle.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab02/video/sai52_video_nitrogen_cycle.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai52-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab02.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab02.html"
    },
    {
      "id": "sains-t5-bab03",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 3,
      "title": "Kelestarian Alam Sekitar",
      "subtitle": "Subtopik 3.1–3.3 KSSM (44 Langkah Bit-by-Bit) — Jejak & Tapak Tangan Karbon, Cradle-to-Cradle Upcycle & Mikroplastik, 4 Jenis Pencemaran & Eutrofikasi, BOD Metilena Biru, Bebola Lumpur EM, Mikroalga Emisi Negatif & Peranan PBB.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai53-u5",
          "unitNumber": 5,
          "unitTitle": "Unit 5: Teknologi Emisi Negatif Mikroalga & Peranan Global PBB",
          "stepTitle": "Teknologi Emisi Negatif: Mikroalga Marin, Teknologi Hijau & Eco Currency",
          "caption": "Animasi 3D: Teknologi emisi negatif menggunakan mikroalga laut menyerap CO2 atmosfera dan membebaskan oksigen",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab03/video/sai53_video_microalgae_capture.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab03/video/sai53_video_microalgae_capture.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai53-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab03.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab03.html"
    },
    {
      "id": "sains-t5-bab04",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 4,
      "title": "Kadar Tindak Balas",
      "subtitle": "Subtopik 4.1–4.3 KSSM (45 Langkah Bit-by-Bit) — Tindak Balas Cepat vs Perlahan, Kadar Purata & Tangen Seketika, Eksperimen 4.1–4.4 (Suhu, Kepekatan, Saiz Pepejal, Mangkin) & Tekanan Gas, Aplikasi Harian/Enzim, Proses Haber & Proses Sentuh.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai54-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Faktor Suhu & Kepekatan (Eksperimen 4.1 & 4.2)",
          "stepTitle": "5 Faktor Kadar & Eksperimen 4.1: Kesan Suhu (Na2S2O3 + H2SO4)",
          "caption": "Animasi 3D: Peningkatan suhu dan kepekatan mempercepat perlanggaran berkesan antara zarah bahan tindak balas",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab04/video/sai54_video_collision_rate.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab04/video/sai54_video_collision_rate.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai54-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab04.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab04.html"
    },
    {
      "id": "sains-t5-bab05",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 5,
      "title": "Sebatian Karbon",
      "subtitle": "Subtopik 5.1–5.5 KSSM (46 Langkah Bit-by-Bit) — Sebatian Karbon Organik vs Bukan Organik, Kitar Karbon, Penyulingan Berperingkat Petroleum & Alkana/Alkena (n=1..6), Penapaian Etanol 78 °C & Pengesteran, Lemak Tepu/Tak Tepu & Aterosklerosis, Ekstraksi Minyak Sawit, Saponifikasi Sabun (Misel 3D) & Pengurusan Lestari Sifar Sisa.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai55-u5",
          "unitNumber": 5,
          "unitTitle": "Unit 5: Minyak Sawit, Saponifikasi Sabun & Kelestarian Lestari",
          "stepTitle": "Penghasilan Sabun (Saponifikasi) & Mekanisme Pencucian Misel 3D",
          "caption": "Animasi 3D: Molekul sabun hidrofobik dan hidrofilik menanggalkan kotoran berminyak daripada fabrik",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab05/video/sai55_video_soap_micelle.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab05/video/sai55_video_soap_micelle.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai55-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab05.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab05.html"
    },
    {
      "id": "sains-t5-bab06",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 6,
      "title": "Elektrokimia",
      "subtitle": "Subtopik 6.1–6.2 KSSM (45 Langkah Bit-by-Bit) — Sel Elektrolitik, Elektrolit vs Bukan Elektrolit, Eksperimen 6.1–6.4, Siri Elektrokimia, Kepekatan, Jenis Elektrod, 4 Aplikasi Industri, Sel Kimia Ringkas & Sel Buah/Kentang.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai56-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Sel Elektrolitik, Elektrolit & Leburan Ion",
          "stepTitle": "Komponen Sel Elektrolitik & Eksperimen 6.1 (PbBr2 Lebur)",
          "caption": "Animasi 3D: Pergerakan kation dan anion ke katod serta anod semasa proses elektrolisis",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab06/video/sai56_video_electrolysis.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab06/video/sai56_video_electrolysis.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai56-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab06.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab06.html"
    },
    {
      "id": "sains-t5-bab07",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 7,
      "title": "Cahaya dan Optik",
      "subtitle": "Subtopik 7.1–7.2 KSSM (44 Langkah Bit-by-Bit) — Kanta Cembung (Penumpu) vs Kanta Cekung (Pencapah), Aktiviti 7.1–7.2, Jadual 7.1–7.4 Rajah Sinar, Mikroskop Majmuk, Teleskop Astronomi, Kamera DSLR/Telefon Pintar, Kanta Rata & Kanta Air.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai57-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Kanta Cembung, Kanta Cekung & Istilah Optik",
          "stepTitle": "Kanta Cembung (Penumpu) vs Kanta Cekung (Pencapah) & Aktiviti 7.1",
          "caption": "Animasi 3D: Sinar cahaya selari membias melalui kanta cembung dan menumpu tepat pada titik fokus",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab07/video/sai57_video_convex_lens.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab07/video/sai57_video_convex_lens.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai57-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab07.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab07.html"
    },
    {
      "id": "sains-t5-bab08",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 8,
      "title": "Daya dan Tekanan",
      "subtitle": "Subtopik 8.1 KSSM (43 Langkah Bit-by-Bit) — Prinsip Pascal, Sistem Tertutup, Formula Hidraulik F1/A1 = F2/A2, Jek, Brek & Kerusi Gigi, Tiub Venturi, Prinsip Bernoulli, Aerofoil, Penunu Bunsen, Dron & Keselamatan Rel/Laut.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 43,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai58-u4",
          "unitNumber": 4,
          "unitTitle": "Unit 4: Aplikasi Aerofoil, Penunu Bunsen, Dron & Keselamatan",
          "stepTitle": "Bentuk Aerofoil Sayap Kapal Terbang & Sudut Serang (Rajah 8.13)",
          "caption": "Animasi 3D: Aliran udara laju di bahagian atas sayap aerofoil menjana tekanan rendah dan daya angkat ke atas",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab08/video/sai58_video_bernoulli_wing.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab08/video/sai58_video_bernoulli_wing.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai58-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab08.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab08.html"
    },
    {
      "id": "sains-t5-bab09",
      "subject": "Sains",
      "subjectGroup": "teras",
      "form": 5,
      "chapterNumber": 9,
      "title": "Teknologi Angkasa Lepas",
      "subtitle": "Subtopik 9.1–9.2 KSSM (45 Langkah Bit-by-Bit) — 5 Jenis Orbit Satelit (LEO, MEO, HEO, GSO, GEO), Apogi & Perigi, Halaju vs Ketinggian, Pindahan Hohmann, ELV vs RLV, ISS & Mikrograviti, Space Junk, 3 Segmen GPS, Trilaterasi serta Format DMS vs DD.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 0,
      "videos": [
        {
          "unitId": "sai59-u5",
          "unitNumber": 5,
          "unitTitle": "Unit 5: 9.2 Sistem Penentu Sejagat (GPS), Format DMS/DD & Kegunaan",
          "stepTitle": "9.2 Sistem Penentu Sejagat (GPS): Definisi & 3 Segmen Utama",
          "caption": "Animasi 3D: Isyarat tiga atau lebih satelit GPS menentu kedudukan pengguna di permukaan Bumi",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/sains-t5-bab09/video/sai59_video_satellite_gps.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/sains-t5-bab09/video/sai59_video_satellite_gps.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/sai59-u1.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/sains-t5-bab09.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t5-bab09.html"
    },
    {
      "id": "fizik-t4-bab01",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 1,
      "title": "Pengukuran",
      "subtitle": "Metrik vs Imperial, 7 Kuantiti Asas & 10 Terbitan S.I., Skalar & Vektor, 6 Bentuk Graf, Luas Bawah Graf serta Eksperimen 1.1 Bandul Ringkas — Lengkap Foto Arkib & Audio ElevenLabs v4",
      "editionBadge": "Edisi Multimedia & Suara AI",
      "estimatedMinutes": 22,
      "unitCount": 6,
      "stepCount": 28,
      "hasVoice": true,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz-u5",
          "unitNumber": 5,
          "unitTitle": "Eksperimen 1.1 Bandul Ringkas (Amali Wajib)",
          "stepTitle": "Eksperimen 1.1: Menyiasat Hubungan Panjang Bandul (l) dengan Tempoh Ayunan (T)",
          "caption": "Video Penerangan Bersuara (BM): Eksperimen 1.1 Bandul Ringkas — hubungan panjang tali l dengan tempoh ayunan T serta graf T² melawan l",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab01/video/fiz41_video_graf_bandul_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab01/video/fiz41_video_graf_bandul_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz-u5.jpg",
      "chapterBgPath": "./nota-interaktif/assets/chapter-bg/fizik-t4-bab01.jpg",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab01.html"
    },
    {
      "id": "fizik-t4-bab02",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 2,
      "title": "Daya dan Gerakan I",
      "subtitle": "Subtopik 2.1–2.8 KSSM (44 Langkah Bit-by-Bit) — Gerakan Linear, Pita Detik 50 Hz & SUVAT, Graf s-t/v-t/a-t, Jatuh Bebas & Eksperimen 2.1, Inersia & Neraca Inersia, Keabadian Momentum, Daya F=ma, Impuls & Keselamatan Kenderaan serta Berat W=mg.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz42-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Gerakan Linear, Pita Detik 50 Hz & Persamaan SUVAT",
          "stepTitle": "2.1 Gerakan Linear: Jarak vs Sesaran, Laju vs Halaju & Pecutan",
          "caption": "Animasi 3D: Analisis gerakan linear, troli landasan makmal dan keabadian momentum",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab02/video/fiz42_video_daya_gerakan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab02/video/fiz42_video_daya_gerakan.mp4"
        },
        {
          "unitId": "fiz42-u4",
          "unitNumber": 4,
          "unitTitle": "Unit 4: Momentum & Prinsip Keabadian Momentum",
          "stepTitle": "2.5 Konsep Momentum (p = mv) & Prinsip Keabadian Momentum",
          "caption": "Video Penerangan Bersuara (BM): Prinsip Keabadian Momentum perlanggaran serta peranan zon remuk memanjangkan masa hentaman bagi mengurangkan daya impuls",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab02/video/fiz42_video_momentum_impuls_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab02/video/fiz42_video_momentum_impuls_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz42-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab02.html"
    },
    {
      "id": "fizik-t4-bab03",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 3,
      "title": "Kegravitian",
      "subtitle": "Subtopik 3.1–3.3 KSSM (33 Langkah Bit-by-Bit) — Hukum Kegravitian Semesta Newton (F = GMm/r²), Pecutan Graviti g(h), Daya Memusat & Jisim Bumi (M = 4π²r³/GT²), Tiga Hukum Kepler (T² ∝ r³), Satelit Geopegun vs Bukan Geopegun serta Halaju Lepas v = √(2GM/r).",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 33,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz43-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Hukum Kegravitian Semesta Newton & Pecutan Graviti",
          "stepTitle": "3.1 Hukum Kegravitian Semesta Newton (F = GMm / r²)",
          "caption": "Animasi 3D: Tarikan graviti semesta mengikat planet dan satelit dalam orbit mengelilingi jasad pusat",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab03/video/fiz43_video_kegravitian_orbit.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab03/video/fiz43_video_kegravitian_orbit.mp4"
        },
        {
          "unitId": "fiz43-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Tiga Hukum Kepler — Orbit Elips, Luas & Tempoh",
          "stepTitle": "3.2 Hukum Kepler Pertama & Kedua (Elips Dwifokus & Hukum Luas)",
          "caption": "Video Penerangan Bersuara (BM): Hukum Kepler orbit elips dwifokus, luas sama dalam masa sama dan halaju lepas roket",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab03/video/fiz43_video_kepler_halaju_lepas_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab03/video/fiz43_video_kepler_halaju_lepas_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz43-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab03.html"
    },
    {
      "id": "fizik-t4-bab04",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 4,
      "title": "Haba",
      "subtitle": "Subtopik 4.1–4.4 KSSM — Keseimbangan Terma & Penentu Ukuran Termometer, Muatan Haba Tentu (Q = mcΔθ) & Bayu Pantai, Haba Pendam Tentu (Q = ml) & Lengkung Fasa, serta 3 Hukum Gas & Sifar Mutlak (-273°C / 0 K).",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 32,
      "unitCount": 5,
      "stepCount": 34,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 2,
      "videos": [
        {
          "unitId": "fiz44-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Keseimbangan Terma & Penentu Ukuran Termometer",
          "stepTitle": "Sentuhan Terma, Pengaliran Haba & Keseimbangan Terma",
          "caption": "Video Penerangan Bersuara (BM): Pengaliran tenaga haba, keseimbangan terma dan fenomena haba harian",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab04/video/fiz44_video_haba_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab04/video/fiz44_video_haba_narasi.mp4"
        },
        {
          "unitId": "fiz44-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Haba Pendam Tentu & Perubahan Fasa",
          "stepTitle": "Haba Pendam Tentu (l_f vs l_v) & Teori Kinetik Perubahan Fasa",
          "caption": "Video Penerangan Bersuara (BM): Haba Pendam Tentu — mengapa suhu kekal malar semasa peleburan dan pendidihan",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab04/video/fiz44_video_haba_pendam_fasa_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab04/video/fiz44_video_haba_pendam_fasa_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz44-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab04.html"
    },
    {
      "id": "fizik-t4-bab05",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 5,
      "title": "Gelombang",
      "subtitle": "Subtopik 5.1–5.7 KSSM (46 Langkah Bit-by-Bit) — Asas Gelombang & Tangki Riak, Pelembapan & Bandul Barton, Pantulan (i = r), Pembiasan Dalam-Cetek, Pembelauan Celah, Interferens Young (λ = ax/D) serta 7 Jalur Spektrum Elektromagnet.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 46,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz45-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Asas Gelombang, Graf & Tangki Riak",
          "stepTitle": "5.1 Penghasilan Gelombang, Pemindahan Tenaga & Pengelasan",
          "caption": "Animasi 3D: Perambatan gelombang air satah dan membulat di dalam tangki riak makmal",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab05/video/fiz45_video_gelombang_riple.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab05/video/fiz45_video_gelombang_riple.mp4"
        },
        {
          "unitId": "fiz45-u4",
          "unitNumber": 4,
          "unitTitle": "Unit 4: Pembelauan & Interferens Gelombang (Dwicelah Young)",
          "stepTitle": "5.6 Prinsip Superposisi, Sumber Koheren & Nod vs Antinod",
          "caption": "Video Penerangan Bersuara (BM): Interferens Membina dan Memusnah daripada dua sumber koheren dwicelah Young",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab05/video/fiz45_video_interferens_young_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab05/video/fiz45_video_interferens_young_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz45-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab05.html"
    },
    {
      "id": "fizik-t4-bab06",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 4,
      "chapterNumber": 6,
      "title": "Cahaya dan Optik",
      "subtitle": "Subtopik 6.1–6.6 KSSM — Pembiasan Cahaya & Hukum Snell, Dalam Nyata vs Ketara (Eksperimen 6.1–6.2), Pantulan Dalam Penuh & Logamaya/Pelangi/Gentian Optik, Pembentukan Imej & Formula Kanta Nipis (Eksperimen 6.3), Mikroskop Majmuk & Teleskop Astronomi serta Cermin Sfera.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 6,
      "stepCount": 44,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 2,
      "videos": [
        {
          "unitId": "fiz46-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pembiasan Cahaya, Hukum Snell & Dalam Ketara",
          "stepTitle": "Pembiasan Cahaya & Perbezaan Ketumpatan Optik",
          "caption": "Video Penerangan Bersuara (BM): Konsep pembiasan cahaya, Hukum Snell dan aplikasi optik Bab 6",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab06/video/fiz46_video_cahaya_optik_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab06/video/fiz46_video_cahaya_optik_narasi.mp4"
        },
        {
          "unitId": "fiz46-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Pantulan Dalam Penuh & Fenomena Harian",
          "stepTitle": "Syarat Pantulan Dalam Penuh & Sudut Genting (c)",
          "caption": "Video Penerangan Bersuara (BM): Syarat Pantulan Dalam Penuh melebihi sudut genting dan kabel gentian optik",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t4-bab06/video/fiz46_video_pantulan_dalam_penuh_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t4-bab06/video/fiz46_video_pantulan_dalam_penuh_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz46-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab06.html"
    },
    {
      "id": "fizik-t5-bab01",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 1,
      "title": "Daya dan Gerakan II",
      "subtitle": "Subtopik 1.1–1.4 KSSM (40 Langkah Bit-by-Bit) — Daya Paduan & Lif (R = mg ± ma), Leraian Daya & Satah Condong, Keseimbangan Segi Tiga Daya Tertutup, Hukum Hooke (F = kx), Ep = ½kx², Faktor & Susunan Spring.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 40,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 2,
      "videos": [
        {
          "unitId": "fiz51-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Daya Paduan, Vektor & Penimbang Lif",
          "stepTitle": "1.1 Daya Paduan & 4 Situasi Tindakan Dua Daya",
          "caption": "Video Penerangan Bersuara (BM): Konsep daya paduan, tarik tali dan gabungan vektor daya",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab01/video/fiz51_video_daya_paduan_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab01/video/fiz51_video_daya_paduan_narasi.mp4"
        },
        {
          "unitId": "fiz51-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Leraian Daya, Satah Condong & Mesin Rumput",
          "stepTitle": "1.2 Leraian Daya: Komponen Mengufuk (Fx) & Menegak (Fy)",
          "caption": "Video Penerangan Bersuara (BM): Leraian Daya kepada komponen mengufuk dan menegak pada satah condong",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab01/video/fiz51_video_leraian_daya_satah_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab01/video/fiz51_video_leraian_daya_satah_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz51-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab01.html"
    },
    {
      "id": "fizik-t5-bab02",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 2,
      "title": "Tekanan",
      "subtitle": "Subtopik 2.1–2.6 KSSM — Tekanan Cecair (P = hρg), Barometer Atmosfera (760 mm Hg), Manometer Tiub-U & Tolok Bourdon, Prinsip Pascal (F₁/A₁ = F₂/A₂), Prinsip Archimedes (F_B = ρVg) & Prinsip Bernoulli.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 6,
      "stepCount": 45,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 2,
      "videos": [
        {
          "unitId": "fiz52-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Tekanan Cecair, Faktor & Aplikasi Kejuruteraan",
          "stepTitle": "2.1 Tekanan Cecair: Penerbitan P = hρg & Eksperimen 2.1–2.2",
          "caption": "Video Penerangan Bersuara (BM): Pengenalan tekanan bendalir, daya apungan, sistem hidraulik dan aliran Bernoulli",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab02/video/fiz52_video_tekanan_bendalir_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab02/video/fiz52_video_tekanan_bendalir_narasi.mp4"
        },
        {
          "unitId": "fiz52-u4",
          "unitNumber": 4,
          "unitTitle": "Unit 4: Prinsip Pascal & Sistem Pengganda Daya Hidraulik",
          "stepTitle": "2.4 Prinsip Pascal, Omboh Pascal & Sistem Pengganda Daya",
          "caption": "Video Penerangan Bersuara (BM): Prinsip Pascal pengganda daya hidraulik dan Prinsip Bernoulli daya angkat aerofoil",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab02/video/fiz52_video_pascal_bernoulli_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab02/video/fiz52_video_pascal_bernoulli_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz52-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab02.html"
    },
    {
      "id": "fizik-t5-bab03",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 3,
      "title": "Elektrik",
      "subtitle": "Subtopik 3.1–3.4 KSSM (39 Langkah Bit-by-Bit) — Medan Elektrik, Nyalaan Lilin & Bola Polistirena, I = Q/t & V = E/Q, Hukum Ohm & R = ρl/A, Superkonduktor, Litar Kombinasi, d.g.e. & Rintangan Dalam (ε = V + Ir) serta Kuasa & Kos Bil kWj.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 39,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 2,
      "videos": [
        {
          "unitId": "fiz53-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Medan Elektrik, Arus & Beza Keupayaan",
          "stepTitle": "3.1 Medan Elektrik, Kit Serbuk Suji & Kekuatan Medan (E)",
          "caption": "Video Penerangan Bersuara (BM): Medan elektrik, daya ke atas cas ujian, arus I = Q/t dan beza keupayaan V = E/Q",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab03/video/fiz53_video_elektrik_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab03/video/fiz53_video_elektrik_narasi.mp4"
        },
        {
          "unitId": "fiz53-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Daya Gerak Elektrik (d.g.e.) & Rintangan Dalam",
          "stepTitle": "3.3 Daya Gerak Elektrik (ε) vs Beza Keupayaan (V) & Rintangan Dalam (r)",
          "caption": "Video Penerangan Bersuara (BM): Perbezaan daya gerak elektrik (d.g.e.) dan beza keupayaan akibat rintangan dalam sel",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab03/video/fiz53_video_dge_rintangan_dalam_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab03/video/fiz53_video_dge_rintangan_dalam_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz53-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab03.html"
    },
    {
      "id": "fizik-t5-bab04",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 4,
      "title": "Keelektromagnetan",
      "subtitle": "Subtopik 4.1–4.3 KSSM — Medan Lastik & Petua Tangan Kiri Fleming, Motor a.t. & Motor Tanpa Berus, Aruhan Elektromagnet, Hukum Faraday & Hukum Lenz, Petua Tangan Kanan Fleming, Penjana a.u./a.t., Transformer (Vs/Vp = Ns/Np), Kehilangan Tenaga & Grid Penghantaran Voltan Tinggi.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz54-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Daya Magnet ke atas Konduktor, Medan Lastik & Motor a.t.",
          "stepTitle": "4.1 Daya atas Konduktor, Medan Lastik & Petua Tangan Kiri Fleming",
          "caption": "Animasi 3D: Interaksi medan magnet, konduktor pembawa arus, aruhan solenoid dan teras transformer",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab04/video/fiz54_video_keelektromagnetan.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab04/video/fiz54_video_keelektromagnetan.mp4"
        },
        {
          "unitId": "fiz54-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Aruhan Elektromagnet, Hukum Faraday-Lenz & Penjana",
          "stepTitle": "4.2 Aruhan Elektromagnet, Gerakan Relatif & Hukum Faraday",
          "caption": "Video Penerangan Bersuara (BM): Aruhan Elektromagnet, Hukum Lenz menentang gerakan magnet dan prinsip transformer",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab04/video/fiz54_video_aruhan_lenz_transformer_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab04/video/fiz54_video_aruhan_lenz_transformer_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz54-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab04.html"
    },
    {
      "id": "fizik-t5-bab05",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 5,
      "title": "Elektronik",
      "subtitle": "Subtopik 5.1–5.3 KSSM (37 Langkah Bit-by-Bit) — Pancaran Termion & Tiub Sinar Katod (eV = ½mv²), Pesongan Medan Elektrik & Magnet, Semikonduktor Jenis-n/p & Simpang p-n, Rektifikasi Separuh & Penuh (Rektifier Titi 4 Diod) + Kapasitor, serta Transistor npn/pnp, Amplifier β & Suis Automatik LDR/Termistor.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 35,
      "unitCount": 5,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 1,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz55-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Pancaran Termion, Sinar Katod & Tenaga Elektron",
          "stepTitle": "5.1 Revolusi Elektronik, Pancaran Termion & Tiub Vakum",
          "caption": "Video Penerangan Bersuara (BM): Pengenalan elektronik, pancaran termion, diod rektifier dan transistor",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab05/video/fiz55_video_elektronik_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab05/video/fiz55_video_elektronik_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz55-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab05.html"
    },
    {
      "id": "fizik-t5-bab06",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 6,
      "title": "Fizik Nuklear",
      "subtitle": "Subtopik 6.1–6.2 KSSM — Reputan Radioaktif (α, β, γ), Separuh Hayat N = (½)ⁿN₀ & Pentarikhan Usia, Pembelahan U-235 vs Pelakuran Suria, Kecacatan Jisim E = mc², Reaktor Nuklear & Tenaga Alternatif Malaysia.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 34,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz56-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Reputan Radioaktif & Persamaan Alfa, Beta, Gama",
          "stepTitle": "6.1 Reputan Radioaktif, Radioisotop & Tiga Jenis Sinaran",
          "caption": "Animasi 3D: Reputan radioaktif nukleus tidak stabil serta tindak balas pembelahan dan tenaga nuklear",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab06/video/fiz56_video_fizik_nuklear.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab06/video/fiz56_video_fizik_nuklear.mp4"
        },
        {
          "unitId": "fiz56-u2",
          "unitNumber": 2,
          "unitTitle": "Unit 2: Separuh Hayat (T½), Lengkung Eksponen & Aplikasi",
          "stepTitle": "Separuh Hayat (T½), Keaktifan & Simulasi Dadu (Aktiviti 6.3)",
          "caption": "Video Penerangan Bersuara (BM): Separuh Hayat reputan radioaktif dan kecacatan jisim menghasilkan tenaga nuklear",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab06/video/fiz56_video_separuh_hayat_emc2_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab06/video/fiz56_video_separuh_hayat_emc2_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz56-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab06.html"
    },
    {
      "id": "fizik-t5-bab07",
      "subject": "Fizik",
      "subjectGroup": "sains",
      "form": 5,
      "chapterNumber": 7,
      "title": "Fizik Kuantum",
      "subtitle": "Subtopik 7.1–7.3 KSSM (37 Langkah Bit-by-Bit) — Jasad Hitam & Bencana Ultraungu, Kuanta Tenaga Max Planck E=hf, Kedualan Gelombang-Zarah & Panjang Gelombang de Broglie λ=h/p, Mikroskop Elektron, Kuasa Foton P=nhf, Kesan Fotoelektrik, Kit LED h=me/c, Persamaan Einstein hf=W+K_maks, Graf K_maks vs f serta Aplikasi Sel Suria, ISS & Pintu Automatik.",
      "editionBadge": "Edisi Simulasi 3D & Video Interaktif",
      "estimatedMinutes": 34,
      "unitCount": 5,
      "stepCount": 37,
      "hasVoice": false,
      "hasMultimedia": true,
      "videoCount": 2,
      "narratedVideoCount": 1,
      "videos": [
        {
          "unitId": "fiz57-u1",
          "unitNumber": 1,
          "unitTitle": "Unit 1: Jasad Hitam, Bencana Ultraungu & Kuanta Tenaga",
          "stepTitle": "7.1 Jasad Hitam, Graf Sinaran Termal & Pencetusan Idea Kuantum",
          "caption": "Animasi 3D: Pancaran spektrum jasad hitam, paket kuanta foton dan pembebasan fotoelektron dari permukaan logam",
          "hasNarration": false,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab07/video/fiz57_video_fizik_kuantum.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab07/video/fiz57_video_fizik_kuantum.mp4"
        },
        {
          "unitId": "fiz57-u3",
          "unitNumber": 3,
          "unitTitle": "Unit 3: Kesan Fotoelektrik, Kit LED & 4 Ciri Eksperimen",
          "stepTitle": "7.2 Mekanisme Kesan Fotoelektrik & Susunan Radas Sel Foto",
          "caption": "Video Penerangan Bersuara (BM): Kesan Fotoelektrik Einstein — frekuensi ambang, pemancaran serta-merta dan keamatan cahaya",
          "hasNarration": true,
          "localPath": "./nota-interaktif/assets/fizik-t5-bab07/video/fiz57_video_fotoelektrik_einstein_narasi.mp4",
          "r2Url": "https://pub-a078acf7cdf144cdbffaf309be626334.r2.dev/nota-interaktif/assets/fizik-t5-bab07/video/fiz57_video_fotoelektrik_einstein_narasi.mp4"
        }
      ],
      "coverIconPath": "./nota-interaktif/assets/icons/fiz57-u1.jpg",
      "chapterBgPath": "",
      "htmlPath": "./nota-interaktif/dist/fizik-t5-bab07.html"
    }
  ];






  function renderNotaEmptyStateHtml_(isMobile, hasBaseItems) {
    if (hasBaseItems) {
      return isMobile
        ? '<div class="phone-card" style="text-align:center;color:#475569">Tiada nota interaktif sepadan. Bab baharu sedang ditambah secara berperingkat.</div>'
        : '<div class="empty-state"><h3>Tiada Nota Interaktif Sepadan</h3><p>Cuba tukar kata kunci carian atau pilih Semua Subjek. Bab baharu ditambah secara berperingkat.</p></div>';
    }
    const fCode = getActiveFormFilter();
    const title = isLowerSecFormCode(fCode)
      ? ("Kandungan Tingkatan " + escapeHtml(String(fCode).replace(/\D/g, "") || "1") + " Akan Dibuka (Sesi 2027)")
      : "Nota Visual Subjek Pilihan Akan Dibuka (Sesi 2027)";
    const btnCls = isMobile ? "btn btn-primary btn-sm js-phone-ask-cikgu-empty" : "btn btn-primary btn-sm js-open-cikgu-ai-empty";
    const boxCls = isMobile ? "phone-card phone-smart-empty" : "empty-state focus-smart-empty";
    return '<div class="' + boxCls + '"><h3>' + title + '</h3><p>Sementara menanti bab interaktif baharu dibuka, anda boleh tanya atau snap kerja sekolah terus kepada Cikgu AI.</p><button type="button" class="' + btnCls + '">Tanya / Snap Kerja Sekolah Cikgu AI</button></div>';
  }

  function getNotaCatalogList() {
    return Array.isArray(NOTA_CATALOG) ? NOTA_CATALOG : [];
  }

  function loadNotaProgressMap() {
    try {
      if (typeof localStorage === "undefined") return {};
      const raw = localStorage.getItem(NOTA_PROGRESS_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveNotaProgressEntry(noteId, patch) {
    if (!noteId) return {};
    const map = loadNotaProgressMap();
    const prev = map[noteId] && typeof map[noteId] === "object" ? map[noteId] : {};
    map[noteId] = Object.assign({}, prev, patch, { updatedMs: Date.now() });
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(NOTA_PROGRESS_STORAGE_KEY, JSON.stringify(map));
      }
    } catch (e) {}
    return map;
  }

  function populateNotaSubjectChips() {
    const chipRow = document.getElementById("notaSubjectChipsRow");
    if (!chipRow) return;
    const list = filterNotaItemsForStudent(getNotaCatalogList());
    const subjects = ["ALL"].concat(Array.from(new Set(list.map((c) => c.subject).filter(Boolean))));
    if (portalState.notaSelectedSubject !== "ALL" && subjects.indexOf(portalState.notaSelectedSubject) === -1) {
      portalState.notaSelectedSubject = "ALL";
    }
    chipRow.innerHTML = subjects.map(function (sub) {
      const active = portalState.notaSelectedSubject === sub;
      const label = sub === "ALL" ? "Semua Subjek" : sub;
      return '<button type="button" class="tab-chip js-nota-subject-chip" data-subject="' + escapeHtml(sub) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(label) + "</button>";
    }).join("");
  }

  function renderNotaCardMarkup_(item, progressRec) {
    const promoFree = isNotaFreePromoActive();
    const unlocked = isNotaItemUnlocked(item.id);
    const doneUnits = progressRec ? Math.max(0, Number(progressRec.completedUnits) || 0) : 0;
    const totalUnits = Math.max(1, Number(item.unitCount) || 1);
    const masteryPct = progressRec ? Math.min(100, Math.max(0, Number(progressRec.masteryPct) || 0)) : 0;
    const xpEarned = progressRec ? Math.max(0, Number(progressRec.xp) || 0) : 0;

    let statusHtml = promoFree
      ? '<span class="status-badge badge-done">' + ICONS.checkCircle + " 0 Token • Percuma SPM</span>"
      : (unlocked
        ? '<span class="status-badge badge-done">' + ICONS.checkCircle + " Terbuka Kekal</span>"
        : '<span class="status-badge badge-progress">' + ICONS.lock + ' <span class="tabular-nums">' + NOTA_UNLOCK_COST + " Token • Kekal</span></span>");
    if (masteryPct >= 100) {
      statusHtml = '<span class="status-badge badge-done">' + ICONS.trophy + ' <span class="tabular-nums">100% Dikuasai</span></span>';
    } else if (doneUnits > 0 || xpEarned > 0) {
      statusHtml = '<span class="status-badge badge-progress">' + ICONS.flame + ' <span class="tabular-nums">' + masteryPct + "% • " + xpEarned + " XP</span></span>";
    }

    const ctaLabel = masteryPct >= 100
      ? "Ulang Kaji Bab"
      : ((doneUnits > 0 || xpEarned > 0) ? "Sambung Bab" : (promoFree ? "Mula Nota Percuma" : (unlocked ? "Mula Nota Interaktif" : ("Buka Bab (" + NOTA_UNLOCK_COST + " Token)"))));
    const ctaIcon = unlocked || doneUnits > 0 ? ICONS.play : ICONS.unlock;
    const ctaCls = masteryPct >= 100 ? "btn-outline" : (doneUnits > 0 || xpEarned > 0 ? "btn-emerald" : "btn-primary");

    return [
      '<article class="quiz-card nota-chapter-card">',
      '  <div class="nota-card-head">',
      '    <img class="nota-cover-medallion" src="' + escapeHtml(item.coverIconPath) + '" alt="" width="64" height="64">',
      '    <div class="nota-card-head-body">',
      '      <div class="quiz-card-badges">',
      '        <span class="badge-klon">' + ICONS.sparkles + " Ting. " + escapeHtml(item.form) + " • Bab " + escapeHtml(item.chapterNumber) + "</span>",
      '        <span class="status-badge badge-subject">' + escapeHtml(item.subject) + "</span>",
               statusHtml,
      "      </div>",
      '      <h3 class="quiz-card-title">' + escapeHtml(item.title) + "</h3>",
      "    </div>",
      "  </div>",
      '  <p class="nota-sub-desc">' + escapeHtml(item.subtitle) + "</p>",
      '  <div class="nota-meta-pills tabular-nums">',
      '    <span class="nota-edition-pill">' + ICONS.book + " " + totalUnits + " Unit • " + item.stepCount + " Langkah</span>",
      (item.hasVoice ? '<span class="nota-edition-pill">Suara Cikgu AI</span>' : ""),
      '    <span class="nota-edition-pill">~' + escapeHtml(item.estimatedMinutes) + " min</span>",
      "  </div>",
      '  <div class="nota-mastery-wrap">',
      '    <div class="nota-mastery-labels tabular-nums">',
      "      <span>Penguasaan: " + doneUnits + "/" + totalUnits + " unit</span>",
      "      <span>" + masteryPct + "% • " + xpEarned + " XP</span>",
      "    </div>",
      '    <progress class="etutor-progress" max="100" value="' + masteryPct + '" aria-label="Penguasaan ' + escapeHtml(item.title) + '"></progress>',
      "  </div>",
      '  <div class="quiz-card-footer">',
      '    <button type="button" class="btn ' + ctaCls + ' js-open-nota" data-note-id="' + escapeHtml(item.id) + '">',
             ctaIcon + " <span>" + escapeHtml(ctaLabel) + "</span>",
      "    </button>",
      "  </div>",
      "</article>"
    ].join("\n");
  }

  function renderNotaCatalogSection() {
    const grid = document.getElementById("notaCatalogCardsGrid");
    const countLabel = document.getElementById("notaCatalogCountLabel");
    if (!grid) return;

    const list = filterNotaItemsForStudent(getNotaCatalogList());
    const progMap = loadNotaProgressMap();
    const q = String(portalState.notaSearchQuery || "").trim().toLowerCase();
    const subj = portalState.notaSelectedSubject || "ALL";

    const filtered = list.filter(function (item) {
      if (subj !== "ALL" && item.subject !== subj) return false;
      if (q) {
        const hay = [item.subject, "bab " + item.chapterNumber, item.title, item.subtitle].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (countLabel) {
      countLabel.textContent = filtered.length + " bab nota interaktif dipaparkan";
    }

    if (filtered.length === 0) {
      grid.innerHTML = renderNotaEmptyStateHtml_(false, list.length > 0);
      return;
    }

    grid.innerHTML = filtered.map((item) => renderNotaCardMarkup_(item, progMap[item.id])).join("\n");
  }

  function renderPhoneNotaList(phoneUiState, listEl, chipRow) {
    const list = filterNotaItemsForStudent(getNotaCatalogList());
    const subjects = ["ALL"].concat(Array.from(new Set(list.map((c) => c.subject).filter(Boolean))).sort());
    if (phoneUiState.paperSubject !== "ALL" && subjects.indexOf(phoneUiState.paperSubject) === -1) {
      phoneUiState.paperSubject = "ALL";
    }
    if (chipRow) {
      chipRow.innerHTML = subjects.map(function (s) {
        const pressed = phoneUiState.paperSubject === s ? "true" : "false";
        const label = s === "ALL" ? "Semua Subjek" : s;
        return '<button type="button" class="phone-subj-chip js-phone-filter-subj" data-subj="' + escapeHtml(s) + '" aria-pressed="' + pressed + '">' + escapeHtml(label) + "</button>";
      }).join("");
    }
    if (!listEl) return;

    const q = String(phoneUiState.paperSearch || "").trim().toLowerCase();
    const filtered = list.filter(function (item) {
      if (phoneUiState.paperSubject !== "ALL" && item.subject !== phoneUiState.paperSubject) return false;
      if (q) {
        const hay = [item.subject, "bab " + item.chapterNumber, item.title, item.subtitle].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    if (filtered.length === 0) {
      listEl.innerHTML = renderNotaEmptyStateHtml_(true, list.length > 0);
      return;
    }

    const progMap = loadNotaProgressMap();
    const promoFree = isNotaFreePromoActive();
    listEl.innerHTML = filtered.map(function (item) {
      const rec = progMap[item.id] || {};
      const unlocked = isNotaItemUnlocked(item.id);
      const costLabel = promoFree ? "0 Token • Percuma" : (unlocked ? "Dibuka Kekal" : (NOTA_UNLOCK_COST + " Token"));
      const costCls = (promoFree || unlocked) ? "phone-badge-cost" : "phone-badge-cost is-klon";
      const progText = (rec.completedUnits || 0) > 0 || (rec.xp || 0) > 0
        ? ("Penguasaan: " + (rec.masteryPct || 0) + "% • " + (rec.xp || 0) + " XP")
        : (item.unitCount + " Unit • " + item.stepCount + " Langkah" + (item.hasVoice ? " • Suara AI" : ""));

      return [
        '<button type="button" class="phone-paper-card" data-phone-note-id="' + escapeHtml(item.id) + '">',
        '  <div class="phone-nota-card-left">',
        '    <img class="phone-nota-thumb" src="' + escapeHtml(item.coverIconPath) + '" alt="" width="50" height="50">',
        "    <div>",
        '      <div class="phone-paper-badges">',
        '        <span class="phone-badge-code tabular-nums">' + escapeHtml(item.subject + " T" + item.form + " • Bab " + item.chapterNumber) + "</span>",
        '        <span class="' + costCls + '">' + escapeHtml(costLabel) + "</span>",
        "      </div>",
        '      <h3 class="phone-paper-title">' + escapeHtml(item.title) + "</h3>",
        '      <p class="phone-paper-meta tabular-nums">' + escapeHtml(progText) + "</p>",
        "    </div>",
        "  </div>",
        '  <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>',
        "</button>"
      ].join("");
    }).join("");
  }

  if (typeof window !== "undefined") {
    window.addEventListener("etutor:server-unlocked-keys", function () {
      renderNotaCatalogSection();
    });
  }

  // --- [features/catalog/liveCatalogSync.js] ---
  /**
   * src/features/catalog/liveCatalogSync.js
   * Penyegerakan langsung (Live Auto-Update) kiraan & katalog set soalan Google Drive
   * pada halaman utama (etutor.my) dan papan pemuka pelajar (etutor.my/#portal).
   */






  const LIVE_POLL_INTERVAL_MS = 60000;
  const VISIBILITY_STALE_MS = 30000;
  let liveSyncInFlight = false;
  let livePollTimer = null;

  function computeCatalogStats(catalog) {
    const list = Array.isArray(catalog) ? catalog : [];
    let harianCount = 0;
    let klonCount = 0;
    const harianSubs = {};
    const klonSubs = {};
    const allSubs = {};

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item) continue;
      const sub = String(item.subject || "").trim();
      if (sub) allSubs[sub] = true;
      if (item.category === "klon") {
        klonCount++;
        if (sub) klonSubs[sub] = true;
      } else {
        harianCount++;
        if (sub) harianSubs[sub] = true;
      }
    }

    const fingerprint = list
      .map(function (c) { return String(c.fileId || "") + ":" + String(c.updatedMs || ""); })
      .join("|");

    return {
      totalCount: list.length,
      harianCount: harianCount,
      klonCount: klonCount,
      harianSubjectCount: Object.keys(harianSubs).length,
      klonSubjectCount: Object.keys(klonSubs).length,
      totalSubjectCount: Object.keys(allSubs).length,
      fingerprint: fingerprint
    };
  }

  function formatLiveClock_(d) {
    const dt = d || new Date();
    const pad = function (n) { return String(n).padStart(2, "0"); };
    return pad(dt.getHours()) + ":" + pad(dt.getMinutes());
  }

  function applyLiveCountsToDom(stats, syncedAtStr) {
    if (!stats || stats.totalCount <= 0 || typeof document === "undefined") return;

    document.querySelectorAll("[data-live-nav-harian]").forEach(function (el) {
      el.textContent = "Indeks " + stats.harianCount + " Set";
    });

    document.querySelectorAll("[data-live-nav-klon]").forEach(function (el) {
      el.textContent = stats.klonCount > 0 ? ("Klon SPM (" + stats.klonCount + ")") : "Klon SPM";
    });

    document.querySelectorAll("[data-live-footer-klon]").forEach(function (el) {
      el.textContent = stats.klonCount > 0 ? ("Indeks " + stats.klonCount + " Klon SPM") : "Indeks Klon SPM";
    });

    document.querySelectorAll("[data-live-trust-sets]").forEach(function (el) {
      el.textContent = stats.totalCount + "+ Set & Subjek";
    });

    document.querySelectorAll("[data-live-trust-desc]").forEach(function (el) {
      const subCount = Math.max(stats.totalSubjectCount, stats.harianSubjectCount, 1);
      el.textContent = subCount + " Subjek Terpilih";
    });

    document.querySelectorAll("[data-live-showcase-heading]").forEach(function (el) {
      const subCount = Math.max(stats.totalSubjectCount, stats.harianSubjectCount, 1);
      if (stats.klonCount > 0) {
        el.textContent = stats.harianCount + " Set Percubaan & " + stats.klonCount + " Set Klon Merangkumi " + subCount + " Subjek KSSM SPM";
      } else {
        el.textContent = stats.harianCount + " Set Merangkumi " + subCount + " Subjek KSSM SPM Sedia Diakses";
      }
    });

    document.querySelectorAll("[data-live-showcase-btn]").forEach(function (el) {
      el.textContent = "Lihat Indeks " + stats.harianCount + " Set Percubaan \u2192";
    });

    document.querySelectorAll("[data-live-klon-sub-desc]").forEach(function (el) {
      if (stats.klonCount > 0) {
        el.textContent = stats.klonCount + " set merangkumi " + Math.max(1, stats.klonSubjectCount) + " subjek KSSM";
      }
    });

    if (syncedAtStr) {
      document.querySelectorAll("[data-live-sync-badge]").forEach(function (el) {
        el.textContent = "Live \u2022 " + syncedAtStr;
      });
    }
  }

  function recordLiveCatalogSnapshot(catalog) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (list.length === 0) return null;
    const stats = computeCatalogStats(list);
    const syncedAtStr = formatLiveClock_(new Date());

    portalState.catalogFingerprint = stats.fingerprint;
    portalState.lastCatalogSyncMs = Date.now();
    applyLiveCountsToDom(stats, syncedAtStr);

    try {
      const slimItems = list.map(function (c) {
        return {
          fileId: c.fileId,
          fileName: c.fileName,
          category: c.category,
          setCode: c.setCode,
          setNumber: c.setNumber,
          subject: c.subject,
          stateOrSource: c.stateOrSource,
          year: c.year,
          cleanTitle: c.cleanTitle,
          updatedMs: c.updatedMs || 0
        };
      });
      localStorage.setItem(LIVE_CATALOG_CACHE_KEY, JSON.stringify({
        savedAt: Date.now(),
        syncedAtStr: syncedAtStr,
        stats: stats,
        items: slimItems
      }));
    } catch (e) {}

    return stats;
  }

  function hydrateCachedLiveCounts() {
    try {
      const raw = localStorage.getItem(LIVE_CATALOG_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.stats && parsed.stats.totalCount > 0) {
        applyLiveCountsToDom(parsed.stats, parsed.syncedAtStr || "");
      }
    } catch (e) {}
  }

  async function syncCatalogInBackground(forceRefresh) {
    if (liveSyncInFlight) return;
    const examStage = document.getElementById("examStage");
    if (!forceRefresh && examStage && !examStage.hidden) return;

    const hasSession = Boolean(portalState.sessionToken && portalState.user);
    if (!hasSession && !isOpenAccessMode()) return;

    liveSyncInFlight = true;
    try {
      const action = hasSession ? "dashboard" : "publicDashboard";
      const fetchOpts = forceRefresh ? undefined : { priority: "low" };
      const res = await callBackend(action, { forceRefresh: Boolean(forceRefresh) }, fetchOpts);
      if (!res || !res.ok || !Array.isArray(res.catalog)) return;

      const prevFp = portalState.catalogFingerprint;
      const nextStats = computeCatalogStats(res.catalog);
      const changed = nextStats.fingerprint !== prevFp;

      if (!hasSession) {
        portalState.rawOpenCatalog = res.catalog;
        if (res.leaderboard) portalState.rawServerLeaderboard = res.leaderboard;
      }

      recordLiveCatalogSnapshot(res.catalog);

      const dashboardView = document.getElementById("dashboardView");
      const isDashboardVisible = Boolean(dashboardView && !dashboardView.hidden);
      if (isDashboardVisible && (changed || forceRefresh)) {
        if (hasSession) {
          applyDashboardBundle(res);
        } else {
          const bundle = buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard);
          applyDashboardBundle(bundle);
        }
      }
    } catch (e) {
      // Gagal latar belakang senyap — tidak mengganggu pengalaman pengguna
    } finally {
      liveSyncInFlight = false;
    }
  }

  function initLiveCatalogAutoSync() {
    hydrateCachedLiveCounts();

    setTimeout(function () {
      if (Date.now() - portalState.lastCatalogSyncMs > 5000) {
        syncCatalogInBackground(false);
      }
    }, 120);

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && Date.now() - portalState.lastCatalogSyncMs > VISIBILITY_STALE_MS) {
        syncCatalogInBackground(false);
      }
    });

    if (livePollTimer) clearInterval(livePollTimer);
    livePollTimer = setInterval(function () {
      if (!document.hidden) {
        syncCatalogInBackground(false);
      }
    }, LIVE_POLL_INTERVAL_MS);
  }

  // --- [features/dashboard/progressOverviewView.js] ---
  /**
   * src/features/dashboard/progressOverviewView.js
   * Pemapar UI Seksyen Continue Progress, Ringkasan Kemajuan Bento Grid & pengepala pengguna.
   */











  function applyDashboardBundle(res) {
    if (res.user) portalState.user = res.user;
    if (Array.isArray(res.catalog)) {
      portalState.catalog = res.catalog;
      recordLiveCatalogSnapshot(res.catalog);
    }
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
    populateNotaSubjectChips();
    renderNotaCatalogSection();
    syncLandingKlonCountBadge();
    syncPortalDropdownSummaries();

    if (window.ETutorMotion) {
      window.ETutorMotion.playDashboardEntrance();
      window.ETutorMotion.animateProgressCounters(portalState.progressSummary);
    }

    applyDeepLinkParamsOnce();

    try {
      window.dispatchEvent(new CustomEvent("etutor:dashboard-bundle-applied"));
    } catch (e) {}
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
      if (pkgEl) pkgEl.textContent = "Portal Pembelajaran Interaktif";
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
          return '<button type="button" class="weak-pill weak-pill-btn js-weak-topic-drill" data-topic="' + escapeHtml(w.topic) + '">' + ICONS.alert + ' <span>' + escapeHtml(w.topic) + '</span> <strong class="tabular-nums">(' + w.lowestPct + '%)</strong></button>';
        }).join("");
      }
    }
  }

  // --- [features/quiz-engine/topicToNotaMatcher.js] ---
  /**
   * src/features/quiz-engine/topicToNotaMatcher.js
   * Pemadan pintar antara tajuk topik soalan peperiksaan dengan katalog Nota Interaktif Visual.
   */


  const TOPIC_STOPWORDS = new Set([
    "dan", "atau", "yang", "dalam", "di", "ke", "dari", "daripada", "pada", "untuk", "dengan",
    "bab", "tingkatan", "ting", "modul", "module", "unit", "subtopik", "topik", "tema",
    "serta", "antara", "sebagai", "oleh", "terhadap", "spm", "kssm", "t4", "t5",
    "the", "and", "of", "in", "for", "to", "a", "an", "with", "vs"
  ]);

  function normalizeMatchTokens_(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter(function (w) { return w.length >= 3 && !TOPIC_STOPWORDS.has(w); });
  }

  function normalizeSubjectName_(rawSubj) {
    const s = String(rawSubj || "").toLowerCase().trim();
    if (!s) return "";
    if (s.includes("sains") && !s.includes("komputer") && !s.includes("sukan") && !s.includes("rumah")) return "sains";
    if (s.includes("sejarah")) return "sejarah";
    if (s.includes("fizik")) return "fizik";
    if (s.includes("matematik tambahan") || s.includes("add math")) return "matematik tambahan";
    if (s.includes("matematik")) return "matematik";
    if (s.includes("bahasa melayu") || s === "bm") return "bahasa melayu";
    if (s.includes("bahasa inggeris") || s.includes("english") || s === "bi") return "bahasa inggeris";
    return s;
  }

  function extractFormAndChapterHint_(text) {
    const s = String(text || "").toLowerCase();
    const fMatch = s.match(/(?:tingkatan|ting\.?)\s*([45])\b|\bt([45])\b/i);
    const cMatch = s.match(/(?:bab|module|modul)\s*0?(\d{1,2})\b/i);
    return {
      form: fMatch ? Number(fMatch[1] || fMatch[2]) : null,
      chapter: cMatch ? Number(cMatch[1]) : null
    };
  }

  function matchTopicToNota(subject, rawTopic, catalogOverride) {
    const catalog = Array.isArray(catalogOverride) ? catalogOverride : getNotaCatalogList();
    const normSubj = normalizeSubjectName_(subject);
    const topicText = String(rawTopic || "").trim();
    if (!catalog.length || !topicText) return null;

    const sameSubj = catalog.filter(function (item) {
      return !normSubj || normalizeSubjectName_(item.subject) === normSubj;
    });
    if (!sameSubj.length) return null;

    const hints = extractFormAndChapterHint_(topicText);
    const qTokens = normalizeMatchTokens_(topicText);
    let bestItem = null;
    let bestScore = 0;

    sameSubj.forEach(function (item) {
      let score = 0;
      if (hints.form && Number(item.form) === hints.form) score += 12;
      if (hints.chapter && Number(item.chapterNumber) === hints.chapter) {
        score += (hints.form && Number(item.form) === hints.form) ? 55 : 28;
      }

      const titleLow = String(item.title || "").toLowerCase();
      const titleTokens = new Set(normalizeMatchTokens_(item.title));
      const subTokens = new Set(normalizeMatchTokens_(item.subtitle));

      if (titleLow && topicText.toLowerCase().includes(titleLow)) {
        score += 50;
      }

      qTokens.forEach(function (tok) {
        if (titleTokens.has(tok)) {
          score += 25;
        } else if (subTokens.has(tok)) {
          score += 10;
        }
      });

      if (sameSubj.length === 1 && qTokens.length > 0 && score >= 10) {
        score += 15;
      }

      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    });

    if (!bestItem || bestScore < 25) return null;
    return {
      item: bestItem,
      score: bestScore,
      isUnlocked: typeof catalogOverride !== "undefined" ? false : isNotaItemUnlocked(bestItem.id)
    };
  }

  function getSubjectNotesSummary(subject, catalogOverride) {
    const catalog = Array.isArray(catalogOverride) ? catalogOverride : getNotaCatalogList();
    const normSubj = normalizeSubjectName_(subject);
    return catalog
      .filter(function (c) { return c && (!normSubj || normalizeSubjectName_(c.subject) === normSubj); })
      .map(function (c) {
        return {
          id: c.id,
          form: c.form,
          chapterNumber: c.chapterNumber,
          title: c.title
        };
      });
  }

  // --- [features/quiz-engine/examReportArchive.js] ---
  /**
   * src/features/quiz-engine/examReportArchive.js
   * Arkib laporan peperiksaan berbilang percubaan (localStorage + Supabase), pemadan sejarah skor,
   * pengira perbandingan Retest (Before vs After), dan butang Laporan pada kad soalan.
   */








  function readLocalExamReports_() {
    try {
      if (typeof localStorage === "undefined") return [];
      const raw = localStorage.getItem(EXAM_REPORTS_STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(function (x) { return x && x.fileId; }) : [];
    } catch (e) {
      return [];
    }
  }

  function writeLocalExamReports_(list) {
    try {
      if (typeof localStorage === "undefined") return;
      const sorted = (Array.isArray(list) ? list : [])
        .slice()
        .sort(function (a, b) { return (Number(b.completedMs) || 0) - (Number(a.completedMs) || 0); })
        .slice(0, 150);
      localStorage.setItem(EXAM_REPORTS_STORAGE_KEY, JSON.stringify(sorted));
    } catch (e) {}
  }

  function normalizeArchiveRec_(raw) {
    if (!raw || !raw.fileId) return null;
    const pct = Math.max(0, Math.min(100, Math.round(Number(raw.percentage) || 0)));
    const ms = Math.max(1, Number(raw.completedMs) || Date.now());
    return {
      fileId: String(raw.fileId),
      completedMs: ms,
      completedAt: String(raw.completedAt || new Date(ms).toLocaleString("ms-MY")),
      quizTitle: String(raw.quizTitle || "Set Latihan Interaktif").slice(0, 180),
      subject: String(raw.subject || "SPM").slice(0, 80),
      buyerName: String(raw.buyerName || "").slice(0, 80),
      scoreText: String(raw.scoreText || (pct + "%")).slice(0, 50),
      percentage: pct,
      grade: String(raw.grade || computeLocalSpmGrade(pct, true)).slice(0, 10),
      breakdown: String(raw.breakdown || "").slice(0, 220),
      weakTopics: Array.isArray(raw.weakTopics) ? raw.weakTopics.slice(0, 12) : [],
      allTopicStats: Array.isArray(raw.allTopicStats) ? raw.allTopicStats.slice(0, 24) : [],
      paperSplit: raw.paperSplit && typeof raw.paperSplit === "object" ? raw.paperSplit : null,
      wrongQuestions: Array.isArray(raw.wrongQuestions) ? raw.wrongQuestions.slice(0, 18) : [],
      aiAnalysis: raw.aiAnalysis && typeof raw.aiAnalysis === "object" ? raw.aiAnalysis : null
    };
  }

  async function syncReportSnapshotToCloud_(rec) {
    try {
      const sb = getSupabaseClient();
      if (!sb || !isSupabaseConfigured() || !rec) return;
      const sess = await sb.auth.getSession();
      if (!sess || !sess.data || !sess.data.session) return;
      await sb.rpc("save_exam_report_snapshot", {
        p_file_id: rec.fileId,
        p_completed_ms: rec.completedMs,
        p_quiz_title: rec.quizTitle,
        p_subject: rec.subject,
        p_score_text: rec.scoreText,
        p_percentage: rec.percentage,
        p_grade: rec.grade,
        p_breakdown: rec.breakdown,
        p_diagnostics_json: {
          weakTopics: rec.weakTopics,
          allTopicStats: rec.allTopicStats,
          paperSplit: rec.paperSplit,
          wrongQuestions: rec.wrongQuestions
        },
        p_ai_analysis_json: rec.aiAnalysis || null
      });
    } catch (e) {}
  }

  function saveExamReportAttempt(rawRecord) {
    const rec = normalizeArchiveRec_(rawRecord);
    if (!rec) return null;
    const list = readLocalExamReports_();
    const idx = list.findIndex(function (x) {
      return x.fileId === rec.fileId && Math.abs((Number(x.completedMs) || 0) - rec.completedMs) < 1500;
    });
    if (idx >= 0) {
      if (!rec.aiAnalysis && list[idx].aiAnalysis) rec.aiAnalysis = list[idx].aiAnalysis;
      list[idx] = rec;
    } else {
      list.unshift(rec);
    }
    writeLocalExamReports_(list);
    void syncReportSnapshotToCloud_(rec);
    return rec;
  }

  function attachAiAnalysisToAttempt(fileId, completedMs, aiReport) {
    if (!fileId || !aiReport) return null;
    const list = readLocalExamReports_();
    let target = list.find(function (x) {
      return x.fileId === fileId && (!completedMs || Math.abs((Number(x.completedMs) || 0) - Number(completedMs)) < 1500);
    });
    if (!target) {
      const legacy = getAttemptsForFile(fileId)[0];
      if (!legacy) return null;
      target = normalizeArchiveRec_(legacy);
      list.unshift(target);
    }
    target.aiAnalysis = aiReport;
    writeLocalExamReports_(list);
    void syncReportSnapshotToCloud_(target);
    return target;
  }

  function getAttemptsForFile(fileId) {
    if (!fileId) return [];
    const archived = readLocalExamReports_().filter(function (x) { return x.fileId === fileId; });
    const merged = archived.map(normalizeArchiveRec_).filter(Boolean);
    const seenMs = new Set(merged.map(function (r) { return Math.round((Number(r.completedMs) || 0) / 1000); }));

    const legacyPool = [];
    if (Array.isArray(portalState.scores)) legacyPool.push.apply(legacyPool, portalState.scores);
    if (typeof localStorage !== "undefined") {
      try { legacyPool.push.apply(legacyPool, loadOpenScoresList()); } catch (e) {}
    }

    legacyPool.forEach(function (s) {
      if (!s || s.fileId !== fileId) return;
      const ms = Number(s.completedMs) || (s.completedAt ? Date.parse(s.completedAt) : 0) || Date.now();
      const secKey = Math.round(ms / 1000);
      if (seenMs.has(secKey)) return;
      seenMs.add(secKey);
      const n = normalizeArchiveRec_(Object.assign({}, s, { completedMs: ms }));
      if (n) merged.push(n);
    });

    if (merged.length === 0) {
      const catItem = (portalState.catalog || []).find(function (c) { return c.fileId === fileId; });
      if (catItem && catItem.bestScore) {
        const n = normalizeArchiveRec_(catItem.bestScore);
        if (n) merged.push(n);
      }
    }

    merged.sort(function (a, b) { return (Number(b.completedMs) || 0) - (Number(a.completedMs) || 0); });
    return merged;
  }

  function getLatestAttemptForFile(fileId) {
    return getAttemptsForFile(fileId)[0] || null;
  }

  function computeRetestDelta(currentAttempt, prevAttempt) {
    if (!currentAttempt || !prevAttempt) return null;
    const curPct = Math.round(Number(currentAttempt.percentage) || 0);
    const prevPct = Math.round(Number(prevAttempt.percentage) || 0);
    const curTopics = (currentAttempt.allTopicStats && currentAttempt.allTopicStats.length ? currentAttempt.allTopicStats : currentAttempt.weakTopics) || [];
    const prevTopics = (prevAttempt.allTopicStats && prevAttempt.allTopicStats.length ? prevAttempt.allTopicStats : prevAttempt.weakTopics) || [];

    const prevMap = {};
    prevTopics.forEach(function (t) {
      if (t && t.topic) prevMap[String(t.topic).trim().toLowerCase()] = t;
    });

    const topicDiffs = [];
    curTopics.forEach(function (ct) {
      if (!ct || !ct.topic) return;
      const old = prevMap[String(ct.topic).trim().toLowerCase()];
      if (!old) return;
      const fromPct = Math.round(Number(old.percentage) || 0);
      const toPct = Math.round(Number(ct.percentage) || 0);
      const diff = toPct - fromPct;
      const status = (fromPct < 60 && toPct >= 60) ? "mastered" : (toPct < 60 ? "still_weak" : (diff > 0 ? "improved" : "steady"));
      topicDiffs.push({ topic: ct.topic, fromPct: fromPct, toPct: toPct, delta: diff, status: status });
    });

    topicDiffs.sort(function (a, b) { return b.delta - a.delta; });
    return {
      pctDelta: curPct - prevPct,
      fromPct: prevPct,
      toPct: curPct,
      gradeFrom: String(prevAttempt.grade || "—"),
      gradeTo: String(currentAttempt.grade || "—"),
      prevCompletedAt: String(prevAttempt.completedAt || ""),
      topicDiffs: topicDiffs,
      improvedTopics: topicDiffs.filter(function (d) { return d.delta > 0; }).map(function (d) { return d.topic; }),
      stillWeakTopics: topicDiffs.filter(function (d) { return d.toPct < 60; }).map(function (d) { return d.topic; })
    };
  }

  async function hydrateExamReportsFromCloud() {
    try {
      const sb = getSupabaseClient();
      if (!sb || !isSupabaseConfigured()) return false;
      const sess = await sb.auth.getSession();
      if (!sess || !sess.data || !sess.data.session) return false;
      const { data, error } = await sb.rpc("get_my_exam_reports", { p_file_id: "" });
      if (error || !data || !data.ok || !Array.isArray(data.reports)) return false;

      const existing = readLocalExamReports_();
      let changed = false;
      data.reports.forEach(function (remoteRaw) {
        const rem = normalizeArchiveRec_(remoteRaw);
        if (!rem) return;
        const idx = existing.findIndex(function (x) {
          return x.fileId === rem.fileId && Math.abs((Number(x.completedMs) || 0) - rem.completedMs) < 1500;
        });
        if (idx === -1) {
          existing.push(rem);
          changed = true;
        } else if (rem.aiAnalysis && !existing[idx].aiAnalysis) {
          existing[idx].aiAnalysis = rem.aiAnalysis;
          changed = true;
        }
      });
      if (changed) {
        writeLocalExamReports_(existing);
        if (typeof renderKlonCatalogSection === "function") renderKlonCatalogSection();
        if (typeof renderCatalogSection === "function") renderCatalogSection();
        if (typeof renderPhoneKertasTab === "function") renderPhoneKertasTab();
      }
      return changed;
    } catch (e) {
      return false;
    }
  }

  function renderQuizReportBtnHtml_(item) {
    if (!item || !item.bestScore) return "";
    const attempts = getAttemptsForFile(item.fileId);
    const cnt = Math.max(Number(item.attemptCount) || 0, attempts.length || 1);
    const hasAi = attempts.some(function (a) { return Boolean(a && a.aiAnalysis); });
    const badge = cnt > 1 ? (" " + cnt + "×") : "";
    const aiIcon = hasAi ? (" " + ICONS.sparkles) : "";
    return '<button type="button" class="btn btn-outline btn-sm quiz-report-btn js-open-quiz-report" data-file-id="' + escapeHtml(item.fileId) + '" title="Semak laporan keputusan, analisis &amp; banding percubaan">Laporan' + escapeHtml(badge) + aiIcon + "</button>";
  }

  if (typeof window !== "undefined") {
    window.addEventListener("etutor:cloud-synced", function () {
      void hydrateExamReportsFromCloud();
    });
  }

  // --- [features/quiz-engine/examAnalysisService.js] ---
  /**
   * src/features/quiz-engine/examAnalysisService.js
   * Klien perkhidmatan Analisis Pelajar Cikgu AI (2 Token) + Ringkasan WhatsApp.
   */





  const EXAM_ANALYSIS_TOKEN_COST = 2;

  function resolveAnalysisUserKey_() {
    try {
      const raw = localStorage.getItem("etutor_portal_session_v1");
      if (raw) {
        const u = (JSON.parse(raw) || {}).user;
        const uid = u && (u.userId || u.email || u.phone);
        if (uid) return "usr:" + String(uid).trim().toLowerCase();
      }
      const syncEm = localStorage.getItem("etutor_sync_email_v1");
      if (syncEm) return "eml:" + String(syncEm).trim().toLowerCase();
      const cid = localStorage.getItem("etutor_cikgu_client_uid_v1");
      if (cid) return cid;
    } catch (e) {}
    return "dev:" + getOrCreateDeviceId();
  }

  async function resolveAnalysisBearerJwt_() {
    try {
      const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
      if (sb) {
        const res = await sb.auth.getSession();
        const tok = res && res.data && res.data.session && res.data.session.access_token;
        if (tok) return tok;
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
          const p = JSON.parse(localStorage.getItem(k) || "{}");
          if (p && p.access_token) return String(p.access_token);
          if (p && p.currentSession && p.currentSession.access_token) return String(p.currentSession.access_token);
        }
      }
    } catch (e) {}
    return "";
  }

  function resolveAnalysisEndpoints_() {
    const cfg = (typeof window !== "undefined" && window.ETUTOR_CONFIG) || {};
    const edge = String(cfg.CIKGU_SUPABASE_EDGE_URL || "https://ktesekiguardgfdgrmlp.supabase.co/functions/v1/cikgu-semak").replace(/\/+$/, "");
    const modal = String(cfg.CIKGU_MODAL_GPU_URL || "https://hanismathussin96--cikgu-ai-spm.modal.run").replace(/\/+$/, "");
    return [edge, modal].filter(Boolean);
  }

  function syncWalletFromHeaders_(resp, data) {
    const prev = readWalletLocalSnapshot();
    const remHdr = resp && resp.headers ? resp.headers.get("X-Cikgu-Daily-Remaining") : null;
    const paidHdr = resp && resp.headers ? resp.headers.get("X-Cikgu-Paid-Balance") : null;
    const totalAvail = (data && typeof data.daily_remaining === "number")
      ? data.daily_remaining
      : (remHdr !== null && remHdr !== "" && !isNaN(Number(remHdr)) ? Number(remHdr) : null);
    const paid = (data && typeof data.paid_balance === "number")
      ? data.paid_balance
      : (paidHdr !== null && paidHdr !== "" && !isNaN(Number(paidHdr)) ? Number(paidHdr) : prev.paidBalance);
    if (totalAvail === null) return;
    const freeDaily = Math.max(0, Math.min(5, totalAvail - paid));
    const spentDelta = Math.max(0, (prev.freeDailyRemaining || 0) - freeDaily);
    persistAndBroadcastWallet({
      paidBalance: paid,
      freeDailyRemaining: freeDaily,
      freeRemaining: freeDaily,
      freeMonthlyRemaining: Math.max(0, (prev.freeMonthlyRemaining || 0) - spentDelta)
    });
  }

  async function requestExamAiAnalysis(attemptRec, prevDelta) {
    if (!attemptRec || !attemptRec.fileId) {
      return { ok: false, error: "Tiada rekod peperiksaan untuk dianalisis." };
    }
    if (attemptRec.aiAnalysis) {
      return { ok: true, cached: true, analysis: attemptRec.aiAnalysis };
    }

    const snap = readWalletLocalSnapshot();
    if (snap.remaining < EXAM_ANALYSIS_TOKEN_COST) {
      openTokenWalletDialog();
      return {
        ok: false,
        insufficientTokens: true,
        error: "Baki token tidak mencukupi (perlukan " + EXAM_ANALYSIS_TOKEN_COST + " Token). Tambah nilai atau tunggu reset harian."
      };
    }

    const userKey = resolveAnalysisUserKey_();
    const jwt = await resolveAnalysisBearerJwt_();
    const hdrs = { "Content-Type": "application/json", "X-Etutor-User": userKey };
    if (jwt) hdrs.Authorization = "Bearer " + jwt;

    const payload = {
      subjek: attemptRec.subject || "SPM",
      mod: "analisis_peperiksaan",
      sub_id: attemptRec.fileId,
      soalan: "Analisis Peperiksaan: " + (attemptRec.quizTitle || "Set Latihan SPM"),
      nama_pelajar: attemptRec.buyerName || "Pelajar",
      id_pengguna: userKey,
      markah_penuh: 100,
      stream: false,
      max_tokens: 4096,
      analisis_data: {
        subject: attemptRec.subject || "SPM",
        quizTitle: attemptRec.quizTitle || "Set Latihan SPM",
        studentName: attemptRec.buyerName || "Pelajar",
        percentage: attemptRec.percentage,
        grade: attemptRec.grade,
        scoreText: attemptRec.scoreText,
        breakdown: attemptRec.breakdown,
        paperSplit: attemptRec.paperSplit || null,
        allTopicStats: attemptRec.allTopicStats || [],
        weakTopics: attemptRec.weakTopics || [],
        wrongQuestions: attemptRec.wrongQuestions || [],
        availableNotes: getSubjectNotesSummary(attemptRec.subject || ""),
        previousAttempt: prevDelta ? {
          percentage: prevDelta.fromPct,
          grade: prevDelta.gradeFrom,
          completedAt: prevDelta.prevCompletedAt,
          improvedTopics: prevDelta.improvedTopics,
          stillWeakTopics: prevDelta.stillWeakTopics
        } : null
      }
    };

    const endpoints = resolveAnalysisEndpoints_();
    let lastErr = "Sambungan ke Cikgu AI tergendala sebentar (tiada token ditolak).";
    let fallbackAnalysis = null;

    for (let i = 0; i < endpoints.length; i++) {
      try {
        const resp = await fetch(endpoints[i] + "/v1/semak", {
          method: "POST",
          headers: hdrs,
          body: JSON.stringify(payload),
          signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(26000) : undefined
        });
        const data = await resp.json().catch(function () { return {}; });
        if (resp.ok && data && data.analysis) {
          syncWalletFromHeaders_(resp, data);
          const enriched = Object.assign({}, data.analysis, {
            provider: data.provider || "gemini-3.8-flash",
            generatedAt: new Date().toISOString()
          });
          attachAiAnalysisToAttempt(attemptRec.fileId, attemptRec.completedMs, enriched);
          return { ok: true, cached: false, provider: enriched.provider, analysis: enriched };
        }
        if (resp.status === 402 || (data && data.error === "daily_token_limit")) {
          syncWalletFromHeaders_(resp, { daily_remaining: 0, paid_balance: 0 });
          openTokenWalletDialog();
          return { ok: false, insufficientTokens: true, error: data.detail || "Baki token AI tidak mencukupi." };
        }
        if (data && data.fallback_analysis) fallbackAnalysis = data.fallback_analysis;
        if (data && data.detail) lastErr = data.detail;
      } catch (err) {
        lastErr = "Pelayan Cikgu AI sibuk sementara (tiada token ditolak).";
      }
    }

    return { ok: false, error: lastErr, fallbackAnalysis: fallbackAnalysis };
  }

  function buildWhatsAppRevisionSummary(attemptRec, aiReport, retestDelta) {
    if (!attemptRec) return "";
    const lines = [
      "*SLIP KEPUTUSAN & ULANG KAJI eTutor.my*",
      "Calon: " + (attemptRec.buyerName || "Pelajar"),
      "Subjek: " + (attemptRec.subject || "SPM"),
      "Set: " + (attemptRec.quizTitle || "Set Latihan SPM"),
      "Keputusan: *" + attemptRec.percentage + "% (Gred " + attemptRec.grade + ")*"
    ];
    if (retestDelta) {
      const sign = retestDelta.pctDelta > 0 ? "+" : "";
      lines.push("Perbandingan Retest: " + retestDelta.fromPct + "% -> " + retestDelta.toPct + "% (" + sign + retestDelta.pctDelta + "%)");
    }
    const revTopics = (aiReport && Array.isArray(aiReport.tajuk_ulangkaji) && aiReport.tajuk_ulangkaji.length)
      ? aiReport.tajuk_ulangkaji.slice(0, 4).map(function (t, i) { return (i + 1) + ". " + t.tajuk + " (" + t.subtopik_fokus + ")"; })
      : (attemptRec.weakTopics || []).slice(0, 4).map(function (w, i) { return (i + 1) + ". " + w.topic + " (" + w.percentage + "%)"; });
    if (revTopics.length) {
      lines.push("", "*Tajuk Wajib Ulang Kaji:*");
      lines.push.apply(lines, revTopics);
    }
    if (aiReport && Array.isArray(aiReport.pelan_3_hari) && aiReport.pelan_3_hari.length) {
      lines.push("", "*Pelan Tindakan 3 Hari:*");
      aiReport.pelan_3_hari.slice(0, 3).forEach(function (p) {
        lines.push("- " + p.hari + ": " + p.tindakan);
      });
    }
    return lines.join("\n");
  }

  function buildResultSharePayload(attemptRec, displayStudentName) {
    if (!attemptRec) return null;
    const fid = attemptRec.fileId || "";
    return {
      mode: "result",
      studentName: String(displayStudentName || attemptRec.buyerName || "Pelajar").trim(),
      subject: attemptRec.subject || "SPM",
      quizTitle: attemptRec.quizTitle || "Set Latihan SPM",
      percentage: attemptRec.percentage || 0,
      grade: attemptRec.grade || "-",
      breakdown: attemptRec.breakdown || "",
      url: fid ? ("https://etutor.my/?fileId=" + encodeURIComponent(fid) + "&open=1#portal") : "https://etutor.my/#portal"
    };
  }

  // --- [features/quiz-engine/examAnalysisRenderer.js] ---
  /**
   * src/features/quiz-engine/examAnalysisRenderer.js
   * Pemapar UI untuk Pemilih Percubaan, Kad Perbandingan Retest, Topik + Pautan Nota Interaktif,
   * serta Seksyen Analisis Cikgu AI & Pelan Ulang Kaji 3 Hari Bercetak.
   */





  function renderAttemptSwitcher(attempts, activeMs) {
    const bar = document.getElementById("slipAttemptBar");
    if (!bar) return;
    if (!Array.isArray(attempts) || attempts.length < 2) {
      bar.hidden = true;
      bar.innerHTML = "";
      return;
    }
    bar.hidden = false;
    bar.innerHTML = [
      '<span class="slip-attempt-lbl">Sejarah Percubaan (' + attempts.length + '):</span>',
      '<div class="slip-attempt-pills">',
      attempts.slice(0, 6).map(function (a, i) {
        const isAct = Number(a.completedMs) === Number(activeMs);
        const num = attempts.length - i;
        const tag = i === 0 ? "Terkini" : ("#" + num);
        return '<button type="button" class="slip-attempt-pill js-slip-switch-attempt" data-ms="' + escapeHtml(a.completedMs) + '" aria-pressed="' + (isAct ? "true" : "false") + '">' +
          escapeHtml(tag + " • " + a.percentage + "% (" + a.grade + ")") +
          (a.aiAnalysis ? (" " + ICONS.sparkles) : "") +
          "</button>";
      }).join(""),
      "</div>"
    ].join("");
  }

  function renderRetestCompareCard(delta) {
    const box = document.getElementById("slipRetestCompare");
    if (!box) return;
    if (!delta) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const sign = delta.pctDelta > 0 ? "+" : "";
    const cls = delta.pctDelta > 0 ? "is-up" : (delta.pctDelta < 0 ? "is-down" : "is-flat");
    const arrow = delta.pctDelta > 0 ? "▲" : (delta.pctDelta < 0 ? "▼" : "●");
    const pillsHtml = delta.topicDiffs.slice(0, 6).map(function (td) {
      const tSign = td.delta > 0 ? "+" : "";
      const tCls = td.status === "mastered" || td.delta > 0 ? "is-up" : (td.status === "still_weak" ? "is-warn" : "is-flat");
      return '<span class="retest-topic-pill ' + tCls + '">' +
        escapeHtml(td.topic) + ': <strong class="tabular-nums">' + td.fromPct + "% → " + td.toPct + "% (" + tSign + td.delta + "%)</strong>" +
        "</span>";
    }).join("");

    box.hidden = false;
    box.innerHTML = [
      '<div class="retest-compare-head">',
      '  <span>Perbandingan Percubaan Terdahulu (Retest &amp; Compare)</span>',
      '  <span class="retest-delta-badge ' + cls + ' tabular-nums">' + arrow + " " + delta.fromPct + "% (" + escapeHtml(delta.gradeFrom) + ") → " + delta.toPct + "% (" + escapeHtml(delta.gradeTo) + ") • " + sign + delta.pctDelta + "%</span>",
      "</div>",
      (pillsHtml ? '<div class="retest-topic-pills">' + pillsHtml + "</div>" : "")
    ].join("");
  }

  function renderSlipTopicsWithNota(data) {
    const weakListEl = document.getElementById("slipWeakTopics");
    if (!weakListEl) return;
    weakListEl.textContent = "";

    const allStats = Array.isArray(data.allTopicStats) && data.allTopicStats.length ? data.allTopicStats : [];
    const rawList = allStats.length ? allStats : (Array.isArray(data.weakTopics) ? data.weakTopics : []);

    if (rawList.length === 0) {
      const okLi = document.createElement("li");
      okLi.className = "slip-topic-item";
      okLi.setAttribute("data-state", "ok");
      okLi.innerHTML = '<div class="slip-topic-row"><span class="slip-topic-name">Penguasaan kukuh (>= 60%) merentasi semua bab yang diuji.</span><span class="slip-topic-stat">100%</span></div><div class="slip-topic-track"><div class="slip-topic-fill" style="width:100%"></div></div>';
      weakListEl.appendChild(okLi);
      return;
    }

    rawList.slice(0, 12).forEach(function (w) {
      const li = document.createElement("li");
      const wPct = Math.max(0, Math.min(100, Math.round(Number(w.percentage) || 0)));
      const wObt = Math.max(0, Math.round(Number(w.obtained) || 0));
      const wTot = Math.max(1, Math.round(Number(w.total) || 1));
      const isAtt = w.attempted === undefined ? true : Boolean(w.attempted);
      const state = !isAtt ? "unattempted" : (wPct >= 60 ? "ok" : (wPct >= 40 ? "mid" : "weak"));
      li.className = "slip-topic-item";
      li.setAttribute("data-state", state);

      const row = document.createElement("div");
      row.className = "slip-topic-row";
      const nameSpan = document.createElement("span");
      nameSpan.className = "slip-topic-name";
      nameSpan.textContent = String(w.topic || "Topik");
      const statSpan = document.createElement("span");
      statSpan.className = "slip-topic-stat tabular-nums";
      statSpan.textContent = isAtt
        ? (wPct + "% (" + wObt + "/" + wTot + ")" + (wPct < 60 ? " • Ulang Kaji" : ""))
        : ("Belum Dijawab (" + wObt + "/" + wTot + ")");
      row.appendChild(nameSpan);
      row.appendChild(statSpan);

      const track = document.createElement("div");
      track.className = "slip-topic-track";
      const fill = document.createElement("div");
      fill.className = "slip-topic-fill";
      fill.style.width = (isAtt ? Math.max(4, wPct) : 0) + "%";
      track.appendChild(fill);

      li.appendChild(row);
      li.appendChild(track);

      if (wPct < 60) {
        const matched = matchTopicToNota(data.subject || "", w.topic || "");
        const act = document.createElement("div");
        act.className = "slip-topic-action-row";
        if (matched && matched.item) {
          const it = matched.item;
          act.innerHTML =
            '<button type="button" class="slip-nota-btn slip-no-print js-slip-open-nota" data-note-id="' + escapeHtml(it.id) + '">' +
            ICONS.book + ' <span>Buka Nota: T' + escapeHtml(it.form) + ' Bab ' + escapeHtml(it.chapterNumber) + ' — ' + escapeHtml(it.title) +
            (matched.isUnlocked ? " (Terbuka)" : " (2 Token)") +
            "</span></button>" +
            '<span class="slip-print-only-ref">Rujukan Nota eTutor.my: Tingkatan ' + escapeHtml(it.form) + " Bab " + escapeHtml(it.chapterNumber) + " (" + escapeHtml(it.title) + ")</span>";
        } else {
          act.innerHTML =
            '<button type="button" class="slip-cikgu-btn slip-no-print js-slip-ask-cikgu" data-topic="' + escapeHtml(w.topic || "") + '" data-subject="' + escapeHtml(data.subject || "") + '">' +
            ICONS.sparkles + " <span>Tanya Cikgu AI Topik Ini →</span></button>";
        }
        li.appendChild(act);
      }

      weakListEl.appendChild(li);
    });
  }

  function renderAiAnalysisSection(attemptRec, uiState) {
    const sec = document.getElementById("slipAiAnalysisSection");
    if (!sec) return;
    const loading = Boolean(uiState && uiState.loading);
    const errMsg = uiState && uiState.errorMsg ? String(uiState.errorMsg) : "";
    const ai = attemptRec && attemptRec.aiAnalysis;

    if (loading) {
      sec.innerHTML = [
        '<div class="slip-ai-loading">',
        '  <div class="slip-ai-spinner" aria-hidden="true"></div>',
        "  <div><strong>Cikgu AI sedang menganalisis kertas anda...</strong><p>Mengesan punca hilang markah, kelebihan dan menyusun pelan ulang kaji KSSM (3–6 saat).</p></div>",
        "</div>"
      ].join("");
      return;
    }

    if (!ai) {
      const fbHtml = uiState && uiState.fallbackAnalysis ? renderReportMarkup_(uiState.fallbackAnalysis, attemptRec.subject, true) : "";
      sec.innerHTML = [
        '<div class="slip-ai-cta-card slip-no-print">',
        '  <div class="slip-ai-cta-info">',
        '    <div class="slip-ai-cta-title">' + ICONS.sparkles + ' <span>Analisis Mendalam &amp; Pelan Ulang Kaji Cikgu AI</span></div>',
        '    <p class="slip-ai-cta-desc">Dapatkan diagnosis punca hilang markah, kekuatan anda, senarai tajuk keutamaan SPM beserta pautan terus Nota Interaktif, dan jadual ulang kaji 3 hari sedia cetak.</p>',
        (errMsg ? '<p class="slip-ai-err">' + escapeHtml(errMsg) + "</p>" : ""),
        "  </div>",
        '  <button type="button" id="slipAiAnalyzeBtn" class="btn btn-primary slip-ai-btn">Jana Analisis AI (' + EXAM_ANALYSIS_TOKEN_COST + " Token)</button>",
        "</div>",
        fbHtml
      ].join("");
      return;
    }

    sec.innerHTML = renderReportMarkup_(ai, attemptRec.subject, false);
  }

  function renderReportMarkup_(ai, subject, isFallback) {
    const strengths = (ai.kelebihan_pelajar || []).map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("");
    const causes = (ai.punca_hilang_markah || []).map(function (c) { return "<li>" + escapeHtml(c) + "</li>"; }).join("");
    const tips = (ai.tip_teknik_menjawab || []).map(function (t) { return "<li>" + escapeHtml(t) + "</li>"; }).join("");

    const revCards = (ai.tajuk_ulangkaji || []).map(function (r, idx) {
      let noteBtn = "";
      const directId = String(r.nota_id || "").trim();
      const directItem = directId
        ? (getNotaCatalogList().find(function (c) { return c && c.id === directId; }) || null)
        : null;
      const matched = directItem
        ? { item: directItem }
        : matchTopicToNota(subject, (r.tajuk || "") + " " + (r.subtopik_fokus || ""));
      const chosenItem = matched && matched.item ? matched.item : null;
      if (chosenItem && chosenItem.id) {
        const lbl = chosenItem.chapterNumber
          ? ("Buka Nota: T" + chosenItem.form + " Bab " + chosenItem.chapterNumber + " — " + chosenItem.title)
          : "Buka Nota Interaktif";
        const refTxt = chosenItem.chapterNumber
          ? ("Rujukan Nota Interaktif eTutor.my: Tingkatan " + chosenItem.form + " Bab " + chosenItem.chapterNumber + " — " + chosenItem.title)
          : ("Rujukan Nota Interaktif eTutor.my: " + (chosenItem.title || "Nota Interaktif"));
        noteBtn =
          '<button type="button" class="slip-nota-btn slip-no-print js-slip-open-nota" data-note-id="' + escapeHtml(chosenItem.id) + '">' + ICONS.book + " <span>" + escapeHtml(lbl) + "</span></button>" +
          '<span class="slip-print-only-ref">' + escapeHtml(refTxt) + "</span>";
      } else {
        noteBtn =
          '<button type="button" class="slip-cikgu-btn slip-no-print js-slip-ask-cikgu" data-topic="' + escapeHtml(r.tajuk || "") + '" data-subject="' + escapeHtml(subject || "") + '">' + ICONS.sparkles + " <span>Tanya Cikgu AI</span></button>" +
          '<span class="slip-print-only-ref">Cadangan Ulang Kaji: Rujuk Buku Teks KSSM &amp; Tanya Cikgu AI di eTutor.my</span>';
      }
      return [
        '<div class="slip-rev-item">',
        '  <div class="slip-rev-head"><span class="slip-rev-prio">#' + escapeHtml(r.keutamaan || idx + 1) + '</span><strong>' + escapeHtml(r.tajuk) + "</strong></div>",
        '  <div class="slip-rev-sub">Fokus: ' + escapeHtml(r.subtopik_fokus) + "</div>",
        '  <div class="slip-rev-why">' + escapeHtml(r.sebab_fokus) + "</div>",
        '  <div class="slip-rev-act">' + noteBtn + "</div>",
        "</div>"
      ].join("");
    }).join("");

    const planRows = (ai.pelan_3_hari || []).map(function (p) {
      return '<li class="slip-plan-item"><span class="slip-print-chk" aria-hidden="true">☐</span><div><strong>' +
        escapeHtml(p.hari) + ":</strong> " + escapeHtml(p.tindakan) +
        '<div class="slip-plan-target">Sasaran: ' + escapeHtml(p.sasaran) + "</div></div></li>";
    }).join("");

    return [
      '<div class="slip-ai-report">',
      '  <div class="slip-ai-report-head">',
      '    <span>' + (isFallback ? "PELAN ULANG KAJI ASAS (0 TOKEN)" : "LAPORAN PENASIHAT CIKGU AI SPM") + "</span>",
      '    <span class="slip-ai-cached-pill">' + (isFallback ? "Sandaran Pantas" : "Tersimpan • 0 Token Buka Semula") + "</span>",
      "  </div>",
      '  <p class="slip-ai-summary">' + escapeHtml(ai.ringkasan_prestasi || "") + "</p>",
      '  <div class="slip-ai-grid">',
      '    <div class="slip-ai-card is-good"><h4>Kelebihan Anda</h4><ul>' + (strengths || "<li>Usaha konsisten menjawab set latihan.</li>") + "</ul></div>",
      '    <div class="slip-ai-card is-warn"><h4>Punca Markah Hilang</h4><ul>' + (causes || "<li>Perlu ketelitian kata kunci skema.</li>") + "</ul></div>",
      "  </div>",
      '  <div class="slip-ai-block"><h4>Tajuk &amp; Subtopik Wajib Ulang Kaji</h4><div class="slip-rev-list">' + revCards + "</div></div>",
      '  <div class="slip-ai-block"><h4>Pelan Tindakan 3 Hari (Senarai Semak Cetak)</h4><ul class="slip-plan-list">' + planRows + "</ul></div>",
      (tips ? '<div class="slip-ai-card is-tip"><h4>Tip Emas Teknik Menjawab SPM</h4><ul>' + tips + "</ul></div>" : ""),
      "</div>"
    ].join("");
  }

  // --- [features/quiz-engine/parentShareReportService.js] ---
  /**
   * src/features/quiz-engine/parentShareReportService.js
   * Penjana pautan Slip Keputusan Ibu Bapa (Supabase token atau hash baca-sahaja #g=...)
   * serta perkongsian terus ke WhatsApp ibu bapa dengan salinan sandaran papan keratan.
   */


  const PARENT_SHARE_MAX_HASH_LEN = 1400;
  const PARENT_SHARE_RPC_TIMEOUT_MS = 6000;

  function parentShareResolveBaseUrl_() {
    if (typeof window !== "undefined" && window.location) {
      const host = String(window.location.hostname || "").toLowerCase();
      if (host === "localhost" || host === "127.0.0.1") {
        return String(window.location.origin || "https://etutor.my").replace(/\/+$/, "") + "/laporan/";
      }
    }
    return "https://etutor.my/laporan/";
  }

  function parentShareNormalizeTopics_(attemptRec) {
    const weak = Array.isArray(attemptRec && attemptRec.weakTopics) ? attemptRec.weakTopics : [];
    const all = Array.isArray(attemptRec && attemptRec.allTopicStats) ? attemptRec.allTopicStats : [];
    const src = weak.length ? weak : all.filter(function (x) { return x && Number(x.percentage) < 60; });
    return src.filter(function (w) { return w && w.topic; }).slice(0, 4).map(function (w) {
      return {
        t: String(w.topic || "").trim().slice(0, 64),
        p: Math.max(0, Math.min(100, Math.round(Number(w.percentage) || 0))),
        o: Math.max(0, Math.round(Number(w.obtained) || 0)),
        m: Math.max(1, Math.round(Number(w.total) || 1))
      };
    });
  }

  function parentShareToBase64Url_(text) {
    let bytes;
    if (typeof TextEncoder !== "undefined") {
      bytes = new TextEncoder().encode(String(text || ""));
    } else {
      const enc = encodeURIComponent(String(text || "")).replace(/%([0-9A-F]{2})/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      });
      bytes = new Array(enc.length);
      for (let i = 0; i < enc.length; i++) bytes[i] = enc.charCodeAt(i);
    }
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function parentShareEncodeGuestHash_(attemptRec, studentName) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(attemptRec.percentage) || 0)));
    const summary = attemptRec.aiAnalysis && attemptRec.aiAnalysis.ringkasan_prestasi
      ? String(attemptRec.aiAnalysis.ringkasan_prestasi).trim().slice(0, 180)
      : "";
    const payload = {
      n: String(studentName || "Pelajar").trim().slice(0, 60),
      s: String(attemptRec.subject || "SPM").trim().slice(0, 50),
      q: String(attemptRec.quizTitle || "Set Latihan Interaktif").trim().slice(0, 110),
      p: pct,
      g: String(attemptRec.grade || "—").trim().slice(0, 6),
      b: String(attemptRec.breakdown || attemptRec.scoreText || "").trim().slice(0, 120),
      d: String(attemptRec.completedAt || new Date().toLocaleString("ms-MY")).trim().slice(0, 40),
      w: parentShareNormalizeTopics_(attemptRec)
    };
    if (summary) payload.a = summary;

    let encoded = parentShareToBase64Url_(JSON.stringify(payload));
    if (encoded.length <= PARENT_SHARE_MAX_HASH_LEN) return encoded;
    delete payload.a;
    encoded = parentShareToBase64Url_(JSON.stringify(payload));
    while (encoded.length > PARENT_SHARE_MAX_HASH_LEN && payload.w.length > 0) {
      payload.w.pop();
      encoded = parentShareToBase64Url_(JSON.stringify(payload));
    }
    if (encoded.length > PARENT_SHARE_MAX_HASH_LEN) {
      payload.b = payload.b.slice(0, 60);
      payload.q = payload.q.slice(0, 60);
      payload.n = payload.n.slice(0, 40);
      encoded = parentShareToBase64Url_(JSON.stringify(payload));
    }
    return encoded;
  }

  async function parentShareCreateReportUrl_(attemptRec, studentName) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(attemptRec.percentage) || 0)));
    const grade = String(attemptRec.grade || "—").trim().slice(0, 10) || "—";
    try {
      const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
      if (sb && attemptRec.fileId) {
        const sessRes = await sb.auth.getSession();
        const session = sessRes && sessRes.data && sessRes.data.session;
        if (session && session.user) {
          const rpcCall = sb.rpc("create_exam_report_share_link", {
            p_file_id: String(attemptRec.fileId),
            p_completed_ms: Math.max(1, Number(attemptRec.completedMs) || Date.now()),
            p_student_name: studentName,
            p_quiz_title: String(attemptRec.quizTitle || "Set Latihan Interaktif").slice(0, 180),
            p_subject: String(attemptRec.subject || "SPM").slice(0, 80),
            p_score_text: String(attemptRec.scoreText || (pct + "%")).slice(0, 60),
            p_percentage: pct,
            p_grade: grade,
            p_breakdown: String(attemptRec.breakdown || "").slice(0, 220),
            p_diagnostics_json: {
              weakTopics: Array.isArray(attemptRec.weakTopics) ? attemptRec.weakTopics.slice(0, 12) : [],
              allTopicStats: Array.isArray(attemptRec.allTopicStats) ? attemptRec.allTopicStats.slice(0, 24) : [],
              paperSplit: attemptRec.paperSplit || null
            },
            p_ai_analysis_json: attemptRec.aiAnalysis || null
          });
          const res = await Promise.race([
            rpcCall,
            new Promise(function (resolve) { setTimeout(function () { resolve(null); }, PARENT_SHARE_RPC_TIMEOUT_MS); })
          ]);
          if (res && !res.error && res.data && res.data.ok && res.data.shareToken) {
            return { mode: "cloud", url: parentShareResolveBaseUrl_() + "?s=" + encodeURIComponent(String(res.data.shareToken)) };
          }
        }
      }
    } catch (e) {}
    return { mode: "guest", url: parentShareResolveBaseUrl_() + "#g=" + parentShareEncodeGuestHash_(attemptRec, studentName) };
  }

  function parentShareBuildWhatsAppText_(attemptRec, studentName, deltaInfo, shareUrl) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(attemptRec.percentage) || 0)));
    const grade = String(attemptRec.grade || "—").trim() || "—";
    const weakList = parentShareNormalizeTopics_(attemptRec).slice(0, 3);
    const lines = [
      "Assalamualaikum / Salam Sejahtera Ibu Bapa & Penjaga,",
      "",
      "*LAPORAN PRESTASI eTutor.my*",
      "Nama Anak: " + studentName,
      "Subjek: " + (attemptRec.subject || "SPM"),
      "Set: " + (attemptRec.quizTitle || "Set Latihan Interaktif"),
      "Markah & Gred: *" + pct + "% (Gred " + grade + ")*"
    ];
    if (deltaInfo && typeof deltaInfo.fromPct === "number") {
      const sign = deltaInfo.pctDelta > 0 ? "+" : "";
      lines.push("Peningkatan Ujian Semula: " + deltaInfo.fromPct + "% -> " + deltaInfo.toPct + "% (" + sign + deltaInfo.pctDelta + "%)");
    }
    if (weakList.length) {
      lines.push("", "*Topik Perlu Tumpuan:*");
      weakList.forEach(function (w) { lines.push("- " + w.t + " (" + w.p + "%)"); });
    } else {
      lines.push("", "Penguasaan Topik: Semua topik yang dinilai mencapai >= 60%.");
    }
    lines.push("", "Buka Slip Keputusan Rasmi A4 (baca-sahaja & sedia cetak PDF):", shareUrl);
    return lines.join("\n");
  }

  async function parentShareCopyClipboard_(text) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {}
    try {
      if (typeof document === "undefined") return false;
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.parentNode.removeChild(ta);
      return Boolean(ok);
    } catch (e) {
      return false;
    }
  }

  async function openParentWhatsAppReport(attemptRec, displayStudentName, deltaInfo) {
    if (!attemptRec) {
      showToast("Tiada rekod keputusan untuk dihantar ke ibu bapa.");
      return { ok: false };
    }
    const btn = typeof document !== "undefined" ? document.getElementById("sendSlipParentWaBtn") : null;
    if (btn && btn.getAttribute("aria-busy") === "true") return { ok: false };
    if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
    try {
      const studentName = String(displayStudentName || attemptRec.buyerName || "Pelajar").trim().slice(0, 80) || "Pelajar";
      const resolved = await parentShareCreateReportUrl_(attemptRec, studentName);
      const waText = parentShareBuildWhatsAppText_(attemptRec, studentName, deltaInfo, resolved.url);
      await parentShareCopyClipboard_(waText);
      if (typeof window !== "undefined" && typeof window.open === "function") {
        window.open("https://wa.me/?text=" + encodeURIComponent(waText), "_blank", "noopener,noreferrer");
      }
      showToast(
        resolved.mode === "cloud"
          ? "Slip A4 ibu bapa dijana & dibuka di WhatsApp (ringkasan turut disalin)."
          : "Slip baca-sahaja dibuka di WhatsApp & ringkasan turut disalin."
      );
      return { ok: true, mode: resolved.mode, shareUrl: resolved.url };
    } finally {
      if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); }
    }
  }

  // --- [features/quiz-engine/resultSlipModal.js] ---
  /**
   * src/features/quiz-engine/resultSlipModal.js
   * Pengawal dialog Slip Keputusan Rasmi SPM, Hab Diagnostik & Ulang Kaji, Retest Compare & Cetakan PDF.
   */














  const slipModalState = {
    fileId: "",
    attempts: [],
    activeAttempt: null,
    delta: null,
    loading: false,
    errorMsg: "",
    fallbackAnalysis: null
  };

  function resolveGradeTier(pct, grade) {
    const g = String(grade || "").toUpperCase();
    if (pct >= 70 || g.startsWith("A")) return { tier: "emerald", label: g === "A+" ? "Cemerlang Tertinggi" : "Cemerlang" };
    if (pct >= 50 || g.startsWith("B") || g.startsWith("C")) return { tier: "neutral", label: g.startsWith("B") ? "Kepujian" : "Lulus Baik" };
    if (pct >= 40 || g === "D" || g === "E") return { tier: "amber", label: "Lulus Minimum" };
    return { tier: "danger", label: "Perlu Pemulihan" };
  }

  function buildSlipRefNo(data) {
    const raw = String(data.fileId || "ETM") + "|" + String(data.percentage || 0);
    let hash = 0;
    for (let i = 0; i < raw.length; i++) hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
    return "NO. RUJ: ETM-2026-" + Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padStart(6, "0");
  }

  function updatePaperSplitBars(breakdownText) {
    const objBar = document.getElementById("slipBarObj");
    const subBar = document.getElementById("slipBarSub");
    if (!objBar || !subBar) return;
    const objMatch = String(breakdownText || "").match(/Objektif:\s*(\d+)\s*\/\s*(\d+)/i);
    const subMatch = String(breakdownText || "").match(/Subjektif:\s*(\d+)\s*\/\s*(\d+)/i);
    const objVal = objMatch ? Number(objMatch[1]) : 0;
    const subVal = subMatch ? Number(subMatch[1]) : 0;
    const total = objVal + subVal;
    if (total > 0) {
      const objPct = Math.round((objVal / total) * 100);
      objBar.style.width = objPct + "%";
      subBar.style.width = (100 - objPct) + "%";
    } else {
      objBar.style.width = "50%";
      subBar.style.width = "50%";
    }
  }

  function renderSlipAttemptView_(attempt) {
    if (!attempt) return;
    const attempts = slipModalState.attempts || [attempt];
    const idx = attempts.findIndex(function (a) { return Number(a.completedMs) === Number(attempt.completedMs); });
    const prevAttempt = idx >= 0 && idx + 1 < attempts.length ? attempts[idx + 1] : null;
    slipModalState.activeAttempt = attempt;
    slipModalState.delta = computeRetestDelta(attempt, prevAttempt);
    slipModalState.loading = false;
    slipModalState.errorMsg = "";
    slipModalState.fallbackAnalysis = null;

    const isOpenGuest = !portalState.sessionToken && isOpenAccessMode();
    const customNameInput = document.getElementById("slipCustomNameInput");
    const savedOpenName = getOpenStudentName();
    if (customNameInput && isOpenGuest) customNameInput.value = savedOpenName;
    const displayName = isOpenGuest
      ? (savedOpenName || attempt.buyerName || "Pelajar")
      : ((portalState.user && portalState.user.buyerName) || attempt.buyerName || "Pelajar");

    const safePct = Math.max(0, Math.min(100, Math.round(Number(attempt.percentage) || 0)));
    const safeGrade = String(attempt.grade || "—").slice(0, 6);
    const tierInfo = resolveGradeTier(safePct, safeGrade);
    const paperRoot = document.getElementById("slipPaperRoot");
    if (paperRoot) paperRoot.setAttribute("data-tier", tierInfo.tier);
    const arcEl = document.getElementById("slipScoreArc");
    if (arcEl) arcEl.setAttribute("stroke-dashoffset", (314.16 * (1 - safePct / 100)).toFixed(2));
    const refEl = document.getElementById("slipRefNo");
    if (refEl) refEl.textContent = buildSlipRefNo(attempt);
    const gLabelEl = document.getElementById("slipGradeLabel");
    if (gLabelEl) gLabelEl.textContent = tierInfo.label;

    document.getElementById("slipStudentName").textContent = displayName;
    document.getElementById("slipUserId").textContent = (portalState.user && portalState.user.userId) || "";
    document.getElementById("slipQuizTitle").textContent = attempt.quizTitle || "Set Latihan Interaktif";
    document.getElementById("slipSubject").textContent = attempt.subject || "SPM";
    document.getElementById("slipDate").textContent = attempt.completedAt || new Date().toLocaleString("ms-MY");
    document.getElementById("slipScorePct").textContent = safePct + "%";
    document.getElementById("slipGrade").textContent = safeGrade;
    const breakdownText = attempt.breakdown || ("Markah: " + (attempt.scoreText || ""));
    document.getElementById("slipBreakdown").textContent = breakdownText;
    updatePaperSplitBars(breakdownText);

    const retestBtn = document.getElementById("retestSlipBtn");
    if (retestBtn) {
      retestBtn.hidden = !attempt.fileId;
      retestBtn.setAttribute("data-file-id", attempt.fileId || "");
    }

    renderAttemptSwitcher(attempts, attempt.completedMs);
    renderRetestCompareCard(slipModalState.delta);
    renderSlipTopicsWithNota(attempt);
    renderAiAnalysisSection(attempt, slipModalState);
    if (window.ETutorMotion) window.ETutorMotion.animateSlipScore(safePct);
  }

  function bindSlipModalDelegation_(dlg) {
    if (!dlg || dlg.dataset.analysisBound === "1") return;
    dlg.dataset.analysisBound = "1";

    dlg.addEventListener("click", async function (ev) {
      const swBtn = ev.target.closest(".js-slip-switch-attempt");
      if (swBtn) {
        const ms = Number(swBtn.getAttribute("data-ms"));
        const found = (slipModalState.attempts || []).find(function (a) { return Number(a.completedMs) === ms; });
        if (found) renderSlipAttemptView_(found);
        return;
      }

      const notaBtn = ev.target.closest(".js-slip-open-nota");
      if (notaBtn) {
        const noteId = notaBtn.getAttribute("data-note-id");
        if (!noteId) return;
        if (dlg.open) await closeTopLayer(dlg);
        if (portalState.activeQuizFileId) {
          await closeQuizStage();
          await new Promise(function (r) { setTimeout(r, 180); });
        }
        await openNotaChapter(noteId);
        return;
      }

      const cikguBtn = ev.target.closest(".js-slip-ask-cikgu");
      if (cikguBtn) {
        const topic = (cikguBtn.getAttribute("data-topic") || "").trim();
        const subj = (cikguBtn.getAttribute("data-subject") || "").trim();
        if (dlg.open) await closeTopLayer(dlg);
        const isPhone = document.documentElement.getAttribute("data-phone-app") === "true";
        if (isPhone) {
          if (portalState.activeQuizFileId) await closeQuizStage();
          switchPhoneTab("cikgu");
          if (typeof jumpToPhoneCikguTopic === "function") jumpToPhoneCikguTopic(topic);
          return;
        }
        const drawer = window.__CIKGU_AI_INSTANCE__ && window.__CIKGU_AI_INSTANCE__.drawer;
        if (drawer && typeof drawer.openWithPrompt === "function") {
          drawer.openWithPrompt('Assalamualaikum Cikgu, saya nak ulang kaji topik "' + topic + '" yang markah saya rendah tadi. Boleh terangkan isi penting dan kata kunci skema SPM?', subj);
        } else {
          showToast("Sila klik butang Cikgu AI untuk bertanya mengenai topik ini.");
        }
        return;
      }

      if (ev.target.closest("#slipAiAnalyzeBtn")) {
        const cur = slipModalState.activeAttempt;
        if (!cur || slipModalState.loading) return;
        slipModalState.loading = true;
        slipModalState.errorMsg = "";
        renderAiAnalysisSection(cur, slipModalState);
        const res = await requestExamAiAnalysis(cur, slipModalState.delta);
        slipModalState.loading = false;
        if (res && res.ok && res.analysis) {
          cur.aiAnalysis = res.analysis;
          if (portalState.latestSlipData && portalState.latestSlipData.fileId === cur.fileId) {
            portalState.latestSlipData.aiAnalysis = res.analysis;
          }
          renderKlonCatalogSection();
          renderCatalogSection();
          renderPhoneKertasTab();
          showToast(res.cached ? "Laporan AI dimuatkan (0 Token)." : "Analisis Cikgu AI siap (-2 Token).");
        } else {
          slipModalState.errorMsg = (res && res.error) || "Analisis gagal dijana (tiada token ditolak).";
          slipModalState.fallbackAnalysis = (res && res.fallbackAnalysis) || null;
        }
        renderAiAnalysisSection(cur, slipModalState);
        return;
      }

      if (ev.target.closest("#shareSlipSocialBtn")) {
        const payload = buildResultSharePayload(slipModalState.activeAttempt, document.getElementById("slipStudentName")?.textContent);
        if (!payload || !window.ETutorShare) return showToast("Modul kongsi sedang dimuatkan.", true);
        window.ETutorShare.openShareModal(payload);
        return;
      }

      if (ev.target.closest("#copySlipWhatsappBtn")) {
        const cur = slipModalState.activeAttempt;
        const txt = buildWhatsAppRevisionSummary(cur, cur && cur.aiAnalysis, slipModalState.delta);
        if (!txt) return;
        try {
          await navigator.clipboard.writeText(txt);
          showToast("Ringkasan keputusan & tajuk ulang kaji disalin untuk WhatsApp!");
        } catch (e) {
          showToast("Tidak dapat menyalin secara automatik. Gunakan butang Cetak / PDF.", true);
        }
        return;
      }

      if (ev.target.closest("#sendSlipParentWaBtn")) {
        return void openParentWhatsAppReport(slipModalState.activeAttempt, document.getElementById("slipStudentName")?.textContent, slipModalState.delta);
      }

      if (ev.target.closest("#retestSlipBtn")) {
        const fid = (slipModalState.activeAttempt && slipModalState.activeAttempt.fileId) || slipModalState.fileId;
        if (!fid) return;
        if (dlg.open) await closeTopLayer(dlg);
        openQuizSet(fid, false, true);
      }
    });
  }

  function openResultSlipModal(overrideAttempt) {
    const raw = (overrideAttempt && typeof overrideAttempt === "object" && overrideAttempt.fileId)
      ? overrideAttempt
      : portalState.latestSlipData;
    const dlg = document.getElementById("resultSlipDialog");
    if (!raw || !dlg) return;

    bindSlipModalDelegation_(dlg);
    const attempts = getAttemptsForFile(raw.fileId);
    if (!attempts.some(function (a) { return Math.abs((Number(a.completedMs) || 0) - (Number(raw.completedMs) || 0)) < 1500; })) {
      attempts.unshift(raw);
    }
    slipModalState.fileId = raw.fileId;
    slipModalState.attempts = attempts;
    const matched = attempts.find(function (a) {
      return raw.completedMs && Math.abs(Number(a.completedMs) - Number(raw.completedMs)) < 1500;
    }) || attempts[0];

    renderSlipAttemptView_(matched);
    if (!dlg.open) {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    }
  }

  function openSavedReportForFile(fileId, preferredCompletedMs) {
    if (!fileId) return;
    const attempts = getAttemptsForFile(fileId);
    if (!attempts.length) {
      showToast("Belum ada laporan peperiksaan yang disimpan untuk set ini.");
      return;
    }
    const picked = (preferredCompletedMs
      ? attempts.find(function (a) { return Math.abs(Number(a.completedMs) - Number(preferredCompletedMs)) < 1500; })
      : null) || attempts[0];
    portalState.latestSlipData = picked;
    openResultSlipModal(picked);
  }

  function printOfficialSlip() {
    const dlg = document.getElementById("resultSlipDialog");
    let wasModal = false;
    try {
      if (dlg && dlg.open && typeof dlg.matches === "function" && dlg.matches(":modal")) {
        wasModal = true;
        dlg.close();
        dlg.setAttribute("open", "");
      }
    } catch (e) {}

    let cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      document.body.classList.remove("printing-official-slip");
      if (wasModal && dlg) {
        try {
          if (!dlg.matches(":modal")) {
            dlg.removeAttribute("open");
            if (typeof dlg.showModal === "function") dlg.showModal();
            else dlg.setAttribute("open", "");
          }
        } catch (e) {}
      }
    }

    document.body.classList.add("printing-official-slip");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    setTimeout(cleanup, 1500);
  }

  // --- [features/quiz-engine/leaderboardOptInModal.js] ---
  /**
   * src/features/quiz-engine/leaderboardOptInModal.js
   * Pengawal dialog pilihan pelajar sama ada ingin memaparkan markah ke Leaderboard atau mengekalkannya secara peribadi.
   */

  let activeHandlers = null;
  let dialogBound = false;

  function bindLeaderboardOptInDialog(dlg) {
    if (!dlg || dialogBound) return;
    dialogBound = true;
    bindLightDismissFallback(dlg);

    const hideBtn = document.getElementById("lbOptInHideBtn");
    const showBtn = document.getElementById("lbOptInShowBtn");

    if (hideBtn) {
      hideBtn.addEventListener("click", function () {
        const h = activeHandlers;
        activeHandlers = null;
        closeTopLayer(dlg);
        if (h && typeof h.onKeepPrivate === "function") h.onKeepPrivate();
      });
    }

    if (showBtn) {
      showBtn.addEventListener("click", function () {
        const h = activeHandlers;
        activeHandlers = null;
        closeTopLayer(dlg);
        if (h && typeof h.onPublishToLeaderboard === "function") h.onPublishToLeaderboard();
      });
    }

    dlg.addEventListener("cancel", function (ev) {
      ev.preventDefault();
      const h = activeHandlers;
      activeHandlers = null;
      closeTopLayer(dlg);
      if (h && typeof h.onKeepPrivate === "function") h.onKeepPrivate();
    });

    dlg.addEventListener("close", function () {
      const h = activeHandlers;
      activeHandlers = null;
      if (h && typeof h.onKeepPrivate === "function") h.onKeepPrivate();
    });
  }

  function openLeaderboardOptInModal(scoreRecord, handlers) {
    const dlg = document.getElementById("leaderboardOptInDialog");
    if (!dlg) return;
    bindLeaderboardOptInDialog(dlg);

    const summaryEl = document.getElementById("lbOptInScoreSummary");
    if (summaryEl && scoreRecord) {
      const sc = String(scoreRecord.scoreText || (String(scoreRecord.percentage || 0) + "%"));
      const gr = String(scoreRecord.grade || "—");
      summaryEl.textContent = "Keputusan anda: " + sc + " (Gred " + gr + ")";
    }

    activeHandlers = handlers || null;
    if (!dlg.open) {
      if (typeof dlg.showModal === "function") {
        dlg.showModal();
      } else {
        dlg.setAttribute("open", "");
      }
    }
  }

  // --- [features/quiz-engine/quizMobileFitInjector.js] ---
  /**
   * src/features/quiz-engine/quizMobileFitInjector.js
   * Pengawal responsif telefon pihak klien untuk kandungan HTML kuiz dalam <iframe id="examIframe">.
   * Menjamin tiada limpahan melintang ("slide kanan kiri") walaupun kertas dimuatkan daripada GAS/templat lama.
   */

  const QUIZ_MOBILE_FIT_CSS = [
    '<style id="etutor-mobile-fit-css">',
    '  html, body { max-width: 100%; overflow-wrap: break-word; }',
    '  :where(a, code) { overflow-wrap: anywhere; }',
    '  @media (max-width: 1023px) {',
    '    .workspace { grid-template-columns: minmax(0, 1fr) !important; width: 100% !important; max-width: 100% !important; padding-inline: 10px !important; }',
    '    .workspace > * { min-width: 0 !important; max-width: 100% !important; }',
    '  }',
    '  @media (max-width: 768px) {',
    '    .exam-layout { grid-template-columns: minmax(0, 1fr) !important; }',
    '    .exam-layout > * { min-width: 0 !important; max-width: 100% !important; }',
    '    .app-container { width: 100% !important; max-width: 100% !important; padding: 10px !important; }',
    '  }',
    '  .workspace > *, .exam-layout > *, .main-content, .question-card, .q-stem, .mcq-list, .mcq-option,',
    '  .subq-stack, .subq-card, .subq-prompt, .slot-grid, .slot-item, .stimulus-box, .feedback-panel,',
    '  .skema-pre, .etutor-pills-wrap, .etutor-ai-subbox, .etutor-ai-subbox-body, .panel-card, .sidebar-card {',
    '    min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important;',
    '    overflow-wrap: break-word; word-wrap: break-word;',
    '  }',
    '  .mcq-option, .option-btn, .choice-btn { width: 100% !important; max-width: 100% !important; white-space: normal !important; }',
    '  .mcq-option > :not(.mcq-letter) { flex: 1 1 0% !important; min-width: 0 !important; white-space: normal !important; overflow-wrap: break-word !important; }',
    '  .mobile-thumb-bar { grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important; }',
    '  .q-grid { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }',
    '  @media (max-width: 559px) { .compare-pair { grid-template-columns: minmax(0, 1fr) !important; } }',
    '  .q-stem img, .stimulus-box img, .subq-card img, .question-card img, .pdf-diagram-img,',
    '  .q-stem svg, .stimulus-box svg, .subq-card svg, .diagram-box svg, figure svg { max-width: 100% !important; height: auto !important; }',
    '  .table-scroll, .table-wrapper { display: block; width: 100%; max-width: 100% !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch; }',
    '  @media (max-width: 520px) {',
    '    .top-bar-inner { padding: 6px 8px; gap: 5px; }',
    '    .sub-toolbar { padding: 0 10px; gap: 6px; }',
    '    .question-card { padding: 12px !important; }',
    '    .mcq-option { padding: 10px 11px; gap: 9px; font-size: 0.95rem; }',
    '    .subq-top, .slot-label-row { flex-wrap: wrap; }',
    '    input.smart-calc-input { min-width: 0 !important; width: 100%; }',
    '    .mobile-thumb-bar { padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px)); gap: 6px; }',
    '    .mobile-thumb-bar .btn { min-width: 0; padding: 8px 10px; font-size: 0.82rem; }',
    '  }',
    '</style>'
  ].join("\n");

  function injectQuizMobileFitCss(rawHtml) {
    let out = String(rawHtml || "");
    if (!out) return out;

    if (!/<meta[^>]+name=["']viewport["']/i.test(out)) {
      const vpTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">';
      if (/<head[^>]*>/i.test(out)) {
        out = out.replace(/<head([^>]*)>/i, function (m) { return m + "\n" + vpTag; });
      } else {
        out = vpTag + "\n" + out;
      }
    }

    if (!out.includes('id="etutor-mobile-fit-css"')) {
      if (/<\/head>/i.test(out)) {
        out = out.replace(/<\/head>/i, function () { return QUIZ_MOBILE_FIT_CSS + "\n</head>"; });
      } else if (/<body[^>]*>/i.test(out)) {
        out = out.replace(/<body([^>]*)>/i, function (m) { return QUIZ_MOBILE_FIT_CSS + "\n" + m; });
      } else {
        out = QUIZ_MOBILE_FIT_CSS + "\n" + out;
      }
    }

    return out;
  }

  // --- [features/quiz-engine/examStageController.js] ---
  /**
   * src/features/quiz-engine/examStageController.js
   * Pengawal Ruang Peperiksaan (<iframe sandbox srcdoc>), muatan kertas soalan & penyegerakan checkpoint.
   */














  async function openQuizSet(fileId, autoResume, resetStart) {
    const stage = document.getElementById("examStage");
    const iframe = document.getElementById("examIframe");
    const titleEl = document.getElementById("examStageTitle");
    const slipBtn = document.getElementById("openSlipBtn");
    const syncEl = document.getElementById("examSyncStatus");
    const closeBtn = document.getElementById("closeExamStageBtn");
    const shareBtn = document.getElementById("shareExamQuestionBtn");

    if (shareBtn && shareBtn.dataset.bound !== "1") {
      shareBtn.dataset.bound = "1";
      shareBtn.addEventListener("click", function () {
        if (!window.ETutorShare || typeof window.ETutorShare.openShareModal !== "function") {
          showToast("Modul kongsi sedang dimuatkan. Sila cuba sebentar lagi.", true);
          return;
        }
        const fid = portalState.activeQuizFileId || "";
        const activeMeta = (portalState.catalog || []).find(function (c) { return c.fileId === fid; });
        window.ETutorShare.openShareModal({
          mode: "question",
          allowQuestionEdit: true,
          subject: (activeMeta && activeMeta.subject) || "SPM",
          setCode: (activeMeta && activeMeta.setCode) || "",
          quizTitle: (activeMeta && activeMeta.cleanTitle) || (titleEl && titleEl.textContent) || "Set Soalan SPM",
          url: fid ? ("https://etutor.my/?fileId=" + encodeURIComponent(fid) + "&open=1#portal") : "https://etutor.my/#portal"
        });
      });
    }

    const meta = (portalState.catalog || []).find(function (c) { return c.fileId === fileId; });
    if (meta) {
      const wasLocked = !isKlonItemUnlocked(meta);
      if (!(await ensureQuizSetUnlocked(meta))) return;
      if (wasLocked) renderKlonCatalogSection();
    }
    if (titleEl) titleEl.textContent = meta ? meta.cleanTitle : "Memuatkan Set Soalan...";
    if (slipBtn) slipBtn.hidden = true;
    if (closeBtn) closeBtn.hidden = false;
    if (syncEl) syncEl.textContent = "Memuatkan soalan...";

    portalState.activeQuizFileId = fileId;
    portalState.activeNotaId = null;
    portalState.latestSlipData = null;
    stage.hidden = false;
    document.documentElement.setAttribute("data-exam-active", "true");
    document.body.style.overflow = "hidden";
    if (!isNativeCapacitorPlatform() && !portalState.examHistoryPushed && window.history && typeof window.history.pushState === "function") {
      try {
        window.history.pushState({ etutorExamStage: true, fileId: fileId }, "");
        portalState.examHistoryPushed = true;
      } catch (e) {}
    }
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
    iframe.onload = null;
    iframe.removeAttribute("src");
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
      safeQuizHtml = injectQuizMobileFitCss(safeQuizHtml);
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

  async function closeQuizStage(opts) {
    const stage = document.getElementById("examStage");
    const iframe = document.getElementById("examIframe");
    const closeBtn = document.getElementById("closeExamStageBtn");
    const wasNota = Boolean(portalState.activeNotaId);
    await flushPendingProgressNow();
    flushCloudProgressSync();

    if (iframe) {
      iframe.onload = null;
      iframe.removeAttribute("src");
      iframe.srcdoc = "";
    }
    if (closeBtn) closeBtn.hidden = false;
    if (stage) stage.hidden = true;
    document.documentElement.setAttribute("data-exam-active", "false");
    document.documentElement.setAttribute("data-virtual-keyboard", "closed");
    document.body.style.overflow = "";
    portalState.activeQuizFileId = null;
    portalState.activeNotaId = null;
    if (wasNota) renderNotaCatalogSection();

    if (!isNativeCapacitorPlatform() && portalState.examHistoryPushed) {
      const manualClose = !(opts && opts.fromHistoryBack);
      portalState.examHistoryPushed = false;
      if (manualClose && window.history && window.history.state && window.history.state.etutorExamStage) {
        portalState.suppressNextExamPopstate = true;
        window.history.back();
        setTimeout(function () { portalState.suppressNextExamPopstate = false; }, 160);
      }
    } else {
      portalState.examHistoryPushed = false;
    }

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

  // --- [features/quiz-engine/quizMessageHandler.js] ---
  /**
   * src/features/quiz-engine/quizMessageHandler.js
   * Pengendali mesej postMessage selamat daripada iframe kuiz (checkpoint progress, sekatan cetak & tamat kuiz).
   */












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
        scheduleCloudProgressSync();
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
      const completedMsNow = Date.now();
      const safeAllTopics = Array.isArray(msg.allTopicStats) ? msg.allTopicStats.slice(0, 24) : [];
      const safePaperSplit = msg.paperSplit && typeof msg.paperSplit === "object" ? msg.paperSplit : null;
      const safeWrongQuestions = Array.isArray(msg.wrongQuestions) ? msg.wrongQuestions.slice(0, 18) : [];

      portalState.latestSlipData = {
        fileId: portalState.activeQuizFileId,
        completedMs: completedMsNow,
        completedAt: new Date(completedMsNow).toLocaleString("ms-MY"),
        quizTitle: safeTitle,
        subject: safeSubject,
        buyerName: resolvedName,
        scoreText: String(msg.scoreText || (pctSafe + "%")).slice(0, 40),
        percentage: pctSafe,
        grade: gradeSafe,
        breakdown: String(msg.breakdown || "").slice(0, 180),
        weakTopics: safeWeakTopics,
        allTopicStats: safeAllTopics,
        paperSplit: safePaperSplit,
        wrongQuestions: safeWrongQuestions
      };
      saveExamReportAttempt(portalState.latestSlipData);

      const slipBtn = document.getElementById("openSlipBtn");
      if (slipBtn) slipBtn.hidden = false;
      if (window.ETutorMotion) window.ETutorMotion.celebrateQuizCompletion();

      const syncEl = document.getElementById("examSyncStatus");
      if (syncEl) syncEl.textContent = "Keputusan direkodkan: " + pctSafe + "% (" + gradeSafe + ")";

      if (isOpenGuest) {
        const targetFileId = portalState.activeQuizFileId;
        const progMap = loadOpenProgressMap();
        delete progMap[targetFileId];
        saveOpenProgressMap(progMap);

        const scores = loadOpenScoresList();
        scores.push({
          completedAt: new Date().toLocaleString("ms-MY"),
          completedMs: completedMsNow,
          dateOnly: formatLocalDateOnly(new Date()),
          fileId: targetFileId,
          quizTitle: safeTitle,
          subject: safeSubject,
          scoreText: portalState.latestSlipData.scoreText,
          percentage: pctSafe,
          grade: gradeSafe,
          showOnLeaderboard: false,
          weakTopics: safeWeakTopics
        });
        saveOpenScoresList(scores);
        cloudSyncAfterSubmit(targetFileId);

        showToast("Tahniah! Markah " + pctSafe + "% (Gred " + gradeSafe + ") direkodkan secara peribadi.");
        applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));

        openLeaderboardOptInModal(portalState.latestSlipData, {
          onKeepPrivate: function () {
            showToast("Markah disimpan secara peribadi (disorokkan daripada Leaderboard).");
            setTimeout(function () { openResultSlipModal(); }, 160);
          },
          onPublishToLeaderboard: function () {
            const list = loadOpenScoresList();
            let updated = false;
            for (let i = list.length - 1; i >= 0; i--) {
              if (list[i] && list[i].fileId === targetFileId && list[i].completedMs === completedMsNow) {
                list[i].showOnLeaderboard = true;
                updated = true;
                break;
              }
            }
            if (!updated) {
              for (let i = list.length - 1; i >= 0; i--) {
                if (list[i] && list[i].fileId === targetFileId) {
                  list[i].showOnLeaderboard = true;
                  break;
                }
              }
            }
            saveOpenScoresList(list);
            cloudSyncAfterSubmit(targetFileId);
            applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
            showToast("Markah anda kini dipaparkan di Leaderboard.");
            setTimeout(function () { openResultSlipModal(); }, 160);
          }
        });
        return;
      }

      const pinFileId = portalState.activeQuizFileId;
      showToast("Tahniah! Markah " + pctSafe + "% (Gred " + gradeSafe + ") direkodkan secara peribadi.");

      const savePinPromise = callBackend("saveScore", {
        fileId: pinFileId,
        quizTitle: safeTitle,
        subject: safeSubject,
        scoreText: portalState.latestSlipData.scoreText,
        percentage: pctSafe,
        grade: gradeSafe,
        showOnLeaderboard: false,
        weakTopics: safeWeakTopics
      }).then(function (res) {
        if (res && res.ok) {
          applyDashboardBundle(res);
        }
        return res;
      }).catch(function () { return null; });

      openLeaderboardOptInModal(portalState.latestSlipData, {
        onKeepPrivate: function () {
          showToast("Markah disimpan secara peribadi (disorokkan daripada Leaderboard).");
          setTimeout(function () { openResultSlipModal(); }, 160);
        },
        onPublishToLeaderboard: function () {
          savePinPromise.finally(function () {
            callBackend("setScoreLeaderboardVisibility", {
              fileId: pinFileId,
              showOnLeaderboard: true
            }).then(function (res) {
              if (res && res.ok) {
                applyDashboardBundle(res);
              }
              showToast("Markah anda kini dipaparkan di Leaderboard.");
            }).catch(function () {
              showToast("Gagal mengemas kini Leaderboard. Cuba sebentar lagi.", true);
            });
          });
          setTimeout(function () { openResultSlipModal(); }, 160);
        }
      });
    }
  }

  // --- [features/study-notes/notaVideoModal.js] ---
  /**
   * src/features/study-notes/notaVideoModal.js
   * Pengawal dialog pemain video YouTube HanaStudio (selamat di luar #examIframe sandbox).
   */


  function extractSafeYouTubeId(raw) {
    const s = String(raw || "").trim();
    if (!s) return "";
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    const patterns = [
      /(?:youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/]|$)/i,
      /[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)/i,
      /youtube(?:-nocookie)?\.com\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})(?:[?&#/]|$)/i
    ];
    for (let i = 0; i < patterns.length; i++) {
      const m = s.match(patterns[i]);
      if (m && m[1]) return m[1];
    }
    return "";
  }

  function bindNotaVideoCloseCleanup(dlg, slot) {
    if (dlg.dataset.notaVideoBound === "1") return;
    dlg.dataset.notaVideoBound = "1";
    bindLightDismissFallback(dlg);
    dlg.addEventListener("close", function () {
      slot.innerHTML = "";
      dlg.returnValue = "";
    });
  }

  function openNotaYouTubeDialog(opts) {
    const safeId = extractSafeYouTubeId(opts && opts.youtubeId);
    if (!safeId) {
      showToast("ID video YouTube tidak sah.");
      return false;
    }

    const dlg = document.getElementById("notaVideoDialog");
    const slot = document.getElementById("notaVideoFrameSlot");
    const titleEl = document.getElementById("notaVideoDialogTitle");
    const capEl = document.getElementById("notaVideoDialogCaption");
    if (!dlg || !slot) return false;

    bindNotaVideoCloseCleanup(dlg, slot);

    if (titleEl) {
      titleEl.textContent = String((opts && opts.title) || "Video Penerangan HanaStudio");
    }
    if (capEl) {
      const capText = String((opts && opts.caption) || "").trim();
      capEl.textContent = capText;
      capEl.hidden = !capText;
    }

    slot.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.className = "nota-yt-iframe";
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(safeId) + "?rel=0&playsinline=1&autoplay=1";
    iframe.title = String((opts && opts.title) || "Pemain Video YouTube HanaStudio");
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("allowfullscreen", "");
    slot.appendChild(iframe);

    if (!dlg.open && typeof dlg.showModal === "function") {
      dlg.showModal();
    }
    return true;
  }

  // --- [features/study-notes/notaStageController.js] ---
  /**
   * src/features/study-notes/notaStageController.js
   * Pengawal pelancaran Nota Interaktif Visual dalam #examStage (<iframe sandbox>)
   * serta jambatan postMessage (ETUTOR_NOTA_INIT, ETUTOR_NOTA_PROGRESS, COMPLETED, ASK_CIKGU, CLOSE).
   */










  function findNotaById_(noteId) {
    return getNotaCatalogList().find((c) => c.id === noteId) || null;
  }

  function postInitStateToNotaIframe_(iframe, noteId) {
    if (!iframe || !iframe.contentWindow) return;
    const saved = loadNotaProgressMap()[noteId];
    const stateJson = saved && saved.stateJson ? saved.stateJson : "";
    try {
      iframe.contentWindow.postMessage({ type: "ETUTOR_NOTA_INIT", noteId, stateJson }, "*");
    } catch (e) {}
  }

  async function openNotaChapter(noteId) {
    const item = findNotaById_(noteId);
    if (!item) {
      showToast("Bab Nota Interaktif tidak ditemui.");
      return;
    }

    const wasLocked = !isNotaItemUnlocked(item.id);
    const label = item.subject + " T" + item.form + " Bab " + item.chapterNumber + ": " + item.title;
    if (!(await unlockNotaItem(item.id, label))) return;
    if (wasLocked) {
      renderNotaCatalogSection();
      renderPhoneKertasTab();
    }

    const stage = document.getElementById("examStage");
    const iframe = document.getElementById("examIframe");
    const titleEl = document.getElementById("examStageTitle");
    const slipBtn = document.getElementById("openSlipBtn");
    const syncEl = document.getElementById("examSyncStatus");
    const closeBtn = document.getElementById("closeExamStageBtn");
    if (!stage || !iframe) return;

    portalState.activeQuizFileId = null;
    portalState.activeNotaId = item.id;
    portalState.latestSlipData = null;

    if (titleEl) titleEl.textContent = label;
    if (slipBtn) slipBtn.hidden = true;
    if (closeBtn) closeBtn.hidden = true;
    if (syncEl) syncEl.textContent = "Memuatkan nota interaktif...";

    stage.hidden = false;
    document.documentElement.setAttribute("data-exam-active", "true");
    document.body.style.overflow = "hidden";

    if (!isNativeCapacitorPlatform() && !portalState.examHistoryPushed && window.history && typeof window.history.pushState === "function") {
      try {
        window.history.pushState({ etutorExamStage: true, noteId: item.id }, "");
        portalState.examHistoryPushed = true;
      } catch (e) {}
    }
    if (window.ETutorMotion) window.ETutorMotion.playExamStageOpen();

    iframe.removeAttribute("srcdoc");
    iframe.onload = function () {
      if (portalState.activeNotaId !== item.id) return;
      postInitStateToNotaIframe_(iframe, item.id);
      if (syncEl) syncEl.textContent = "Auto-simpan aktif";
    };
    iframe.src = item.htmlPath;
  }

  async function handleNotaStageMessage(event) {
    const iframe = document.getElementById("examIframe");
    if (!iframe || !iframe.contentWindow || !event || event.source !== iframe.contentWindow) return;
    if (event.origin !== "null" && event.origin !== window.location.origin) return;

    const msg = event.data;
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (!msg.type.startsWith("ETUTOR_NOTA_")) return;

    const activeId = portalState.activeNotaId;
    if (!activeId || String(msg.noteId || "") !== String(activeId)) return;

    const item = findNotaById_(activeId);
    const syncEl = document.getElementById("examSyncStatus");

    if (msg.type === "ETUTOR_NOTA_READY") {
      postInitStateToNotaIframe_(iframe, activeId);
      if (syncEl) syncEl.textContent = "Auto-simpan aktif";
      return;
    }

    if (msg.type === "ETUTOR_NOTA_CLOSE") {
      await closeQuizStage();
      return;
    }

    if (msg.type === "ETUTOR_NOTA_OPEN_VIDEO") {
      openNotaYouTubeDialog({
        youtubeId: msg.youtubeId,
        title: msg.title || (item ? item.title : "Video Penerangan HanaStudio"),
        caption: msg.caption || ""
      });
      return;
    }

    if (msg.type === "ETUTOR_NOTA_ASK_CIKGU") {
      const promptText = String(msg.prompt || "").slice(0, 600);
      const subj = (item && item.subject) || String(msg.subject || "Sejarah");
      const isPhone = document.documentElement.getAttribute("data-phone-app") === "true";
      if (isPhone) {
        await closeQuizStage();
        switchPhoneTab("cikgu");
        const inp = document.getElementById("phoneChatInput");
        const sel = document.getElementById("phoneCikguSubjectSelect");
        if (sel && subj) sel.value = subj;
        if (inp) {
          inp.value = promptText;
          inp.focus();
        }
        return;
      }
      const drawer = window.__CIKGU_AI_INSTANCE__ && window.__CIKGU_AI_INSTANCE__.drawer;
      if (drawer && typeof drawer.openWithPrompt === "function") {
        drawer.openWithPrompt(promptText, subj);
      } else {
        showToast("Cikgu AI sedang dimulakan. Sila cuba sebentar lagi.");
      }
      return;
    }

    if (msg.type === "ETUTOR_NOTA_PROGRESS" || msg.type === "ETUTOR_NOTA_COMPLETED") {
      const xp = Math.max(0, Math.round(Number(msg.xp) || 0));
      const completedUnits = Math.max(0, Math.round(Number(msg.completedUnits) || 0));
      const totalUnits = Math.max(1, Math.round(Number(msg.totalUnits) || (item ? item.unitCount : 1)));
      const masteryPct = Math.min(100, Math.max(0, Math.round(Number(msg.masteryPct) || 0)));
      saveNotaProgressEntry(activeId, {
        completedUnits,
        totalUnits,
        masteryPct,
        xp,
        stars: Math.max(0, Number(msg.stars) || 0),
        maxStars: Math.max(3, Number(msg.maxStars) || totalUnits * 3),
        stateJson: String(msg.stateJson || "")
      });
      if (syncEl) {
        syncEl.textContent = "Disimpan • " + xp + " XP • " + completedUnits + "/" + totalUnits + " unit";
      }
      renderNotaCatalogSection();
      renderPhoneKertasTab();
      syncPortalDropdownSummaries();
      if (msg.type === "ETUTOR_NOTA_COMPLETED") {
        showToast("Tahniah! Semua unit " + (item ? item.title : "Nota Interaktif") + " berjaya dikuasai (" + xp + " XP).");
      }
    }
  }

  function bindNotaCatalogEvents() {
    document.addEventListener("click", function (e) {
      const openBtn = e.target.closest(".js-open-nota");
      if (openBtn) {
        const nid = openBtn.getAttribute("data-note-id");
        if (nid) openNotaChapter(nid);
        return;
      }
      const subChip = e.target.closest(".js-nota-subject-chip");
      if (subChip) {
        portalState.notaSelectedSubject = subChip.getAttribute("data-subject") || "ALL";
        document.querySelectorAll(".js-nota-subject-chip").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === subChip ? "true" : "false");
        });
        renderNotaCatalogSection();
      }
    });

    const searchInp = document.getElementById("notaSearchInput");
    if (searchInp) {
      searchInp.addEventListener("input", function () {
        portalState.notaSearchQuery = searchInp.value || "";
        renderNotaCatalogSection();
      });
    }
  }

  // --- [features/auth/sessionController.js] ---
  /**
   * src/features/auth/sessionController.js
   * Pengurusan sesi pembeli berdaftar (simpan token tempatan, pulihkan sesi sedia ada & log keluar).
   */










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
    portalState.phoneGuestActive = false;
    portalState.supabaseAuthenticated = false;
    portalState.pendingKlonScroll = false;
    portalState.pinProgressStateByFileId = {};
    try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
    try { localStorage.removeItem(PHONE_WELCOME_DONE_KEY); } catch (e) {}
    clearSyncLink();
    if (isSupabaseConfigured()) {
      sbSignOut().catch(function () {});
    }
    renderSyncButton();
    document.getElementById("dashboardView").hidden = true;
    document.getElementById("examStage").hidden = true;
    document.body.style.overflow = "";
    if (isPhoneAppLaunchEnv()) {
      try { history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) {}
    } else {
      window.location.hash = "#login";
    }
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

  // --- [features/auth/routeController.js] ---
  /**
   * src/features/auth/routeController.js
   * Penghala paparan utama berasaskan hash URL (#admin, #login, #portal) & Mod Akses Terbuka + Skrin Alu-Aluan Telefon.
   */








  function isHashAdmin() {
    const h = window.location.hash.toLowerCase();
    return h === "#admin" || h.indexOf("#admin?") === 0;
  }

  function isHashLogin() {
    return window.location.hash.toLowerCase() === "#login";
  }

  function isHashPortal() {
    const h = window.location.hash.toLowerCase();
    return h === "#portal" || h === "#klon-portal" || h === "#nota-portal";
  }

  async function syncRouteMode() {
    syncOpenAccessDom();

    const landingView = document.getElementById("landingView");
    const phoneWelcomeView = document.getElementById("phoneWelcomeView");
    const adminView = document.getElementById("adminView");
    const loginView = document.getElementById("loginView");
    const dashboardView = document.getElementById("dashboardView");
    const examStage = document.getElementById("examStage");
    if (!adminView) return;

    if (phoneWelcomeView) phoneWelcomeView.hidden = true;

    if (isHashAdmin()) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = true;
      dashboardView.hidden = true;
      examStage.hidden = true;
      adminView.hidden = false;

      let savedAdminTok = portalState.adminToken;
      if (!savedAdminTok) {
        try { savedAdminTok = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) || ""; } catch (e) {}
      }
      if (savedAdminTok) {
        portalState.adminToken = savedAdminTok;
        try {
          const res = await callAdminBackend("adminDashboard", { adminToken: savedAdminTok });
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
    const wantsKlonScroll = window.location.hash.toLowerCase() === "#klon-portal" || Boolean(portalState.pendingKlonScroll);
    const wantsCountdownScroll = Boolean(portalState.pendingCountdownScroll);
    const wantsNotaScroll = window.location.hash.toLowerCase() === "#nota-portal" || Boolean(portalState.pendingNotaScroll);

    if (portalState.sessionToken && portalState.user) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = true;
      dashboardView.hidden = false;
      if (wantsNotaScroll) {
        portalState.pendingNotaScroll = false;
        if (window.location.hash.toLowerCase() === "#nota-portal") {
          history.replaceState(null, "", window.location.pathname + window.location.search + "#portal");
        }
        openPortalModuleDropdown("nota_interaktif");
        const notaEl = document.getElementById("moduleDropdownNota");
        if (notaEl) setTimeout(function () { notaEl.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
      return;
    }

    const authed = isPortalUserAuthenticated();

    if (isPhoneAppLaunchEnv()) {
      if (isHashLogin()) {
        if (landingElExists(landingView)) landingView.hidden = true;
        dashboardView.hidden = true;
        loginView.hidden = false;
        loadGoogleSignIn();
        if (window.ETutorMotion) window.ETutorMotion.playLoginEntrance();
        return;
      }
      if (isOpenAccessMode() && (authed || isPhoneGuestAllowed())) {
        if (!isHashPortal()) {
          history.replaceState(null, "", window.location.pathname + window.location.search + "#portal");
        }
        portalState.pendingKlonScroll = false;
        portalState.pendingCountdownScroll = false;
        portalState.pendingNotaScroll = false;
        await enterOpenPortal(false);
        return;
      }
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = true;
      dashboardView.hidden = true;
      if (phoneWelcomeView) phoneWelcomeView.hidden = false;
      return;
    }

    const wantsOpenPortal = isOpenAccessMode() && (
      (authed && isHashLogin()) ||
      isHashPortal() ||
      hasDeepLinkPortalParams() ||
      portalState.openPortalActive
    );
    if (wantsOpenPortal) {
      if (isHashLogin() || window.location.hash.toLowerCase() === "#klon-portal" || window.location.hash.toLowerCase() === "#nota-portal") {
        history.replaceState(null, "", window.location.pathname + window.location.search + "#portal");
      }
      portalState.pendingKlonScroll = false;
      portalState.pendingCountdownScroll = false;
      portalState.pendingNotaScroll = false;
      await enterOpenPortal(false);
      if (wantsKlonScroll) {
        openPortalModuleDropdown("klon_spm");
        const klonHead = document.getElementById("klonCatalogHeading");
        if (klonHead) setTimeout(function () { klonHead.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      } else if (wantsCountdownScroll) {
        openPortalModuleDropdown("countdown_spm");
        const cdEl = document.getElementById("moduleDropdownCountdown");
        if (cdEl) setTimeout(function () { cdEl.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      } else if (wantsNotaScroll) {
        openPortalModuleDropdown("nota_interaktif");
        const notaEl = document.getElementById("moduleDropdownNota");
        if (notaEl) setTimeout(function () { notaEl.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
      return;
    }

    if (!isOpenAccessMode() && (isHashPortal() || hasDeepLinkPortalParams())) {
      if (window.location.hash.toLowerCase() === "#klon-portal") portalState.pendingKlonScroll = true;
      if (window.location.hash.toLowerCase() === "#nota-portal") portalState.pendingNotaScroll = true;
      history.replaceState(null, "", window.location.pathname + window.location.search + "#login");
    }

    dashboardView.hidden = true;
    if (isHashLogin() || (isHashPortal() || (!isOpenAccessMode() && hasDeepLinkPortalParams()))) {
      if (landingElExists(landingView)) landingView.hidden = true;
      loginView.hidden = false;
      loadGoogleSignIn();
      if (window.ETutorMotion) window.ETutorMotion.playLoginEntrance();
    } else {
      loginView.hidden = true;
      if (landingElExists(landingView)) {
        landingView.hidden = false;
        const hashId = window.location.hash ? window.location.hash.slice(1) : "";
        if (hashId) {
          const targetSec = document.getElementById(hashId);
          if (targetSec && !targetSec.hidden) setTimeout(function () { targetSec.scrollIntoView(); }, 30);
        }
      }
    }
  }

  function landingElExists(el) {
    return Boolean(el);
  }

  // --- [features/payment/toyyibpayFallbackHelper.js] ---
  /**
   * src/features/payment/toyyibpayFallbackHelper.js
   * Pembantu profil pelajar semasa, penghalaan URL ToyyibPay & fallback WhatsApp Admin bersih.
   */






  function isLocalHostEnv() {
    const h = (typeof window !== "undefined" && window.location && window.location.hostname) || "";
    return /^(localhost|127\.0\.0\.1)$/i.test(h);
  }

  function resolvePaymentBaseUrl(hasJwt) {
    if (isLocalHostEnv() && !hasJwt) return "";
    const cfg = (typeof window !== "undefined" && window.ETUTOR_CONFIG) || {};
    return String(cfg.CIKGU_SUPABASE_EDGE_URL || "").trim().replace(/\/+$/, "");
  }

  async function resolveBearerToken() {
    if (!isSupabaseConfigured()) return "";
    try {
      const sb = getSupabaseClient();
      const res = sb ? await sb.auth.getSession() : null;
      return String(res && res.data && res.data.session ? res.data.session.access_token || "" : "");
    } catch (e) {
      return "";
    }
  }

  async function resolveCurrentCheckoutProfile() {
    let email = "";
    let studentName = "";
    let phone = "";
    try { email = (localStorage.getItem(SYNC_EMAIL_KEY) || "").trim(); } catch (e) {}
    try { studentName = (localStorage.getItem(OPEN_STUDENT_NAME_KEY) || "").trim(); } catch (e) {}

    try {
      const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
      const sessRes = sb ? await sb.auth.getSession() : null;
      const u = sessRes && sessRes.data && sessRes.data.session ? sessRes.data.session.user : null;
      if (u) {
        if (u.email) email = String(u.email).trim();
        const meta = u.user_metadata || {};
        if (!studentName) studentName = String(meta.full_name || meta.name || "").trim();
        phone = String(u.phone || meta.phone || "").trim();
      }
    } catch (e) {}

    if (!email && portalState.user && portalState.user.userId && String(portalState.user.userId).toUpperCase() !== "PELAJAR") {
      email = String(portalState.user.userId).trim();
    }
    if (!studentName && portalState.user && portalState.user.buyerName && String(portalState.user.buyerName).toUpperCase() !== "PELAJAR") {
      studentName = String(portalState.user.buyerName).trim();
    }
    if (!studentName && email) {
      studentName = email.indexOf("@") !== -1 ? email.split("@")[0] : email;
    }
    return { studentName: studentName || "Pelajar", email: email || "pelajar@etutor.my", phone: phone };
  }

  function buildCleanWhatsAppUrl(opts) {
    const plans = opts.plans || {};
    const p = plans[opts.pkgKey] || { code: "PEK_FOKUS_160", name: "Pek Fokus — 160 Token AI Ekspres", price: "RM 15" };
    const refCode = getAttributedReferralCode();
    const lines = [
      "Salam Admin eTutor.my, saya perlukan bantuan tambah nilai Pek Token AI:",
      "",
      "Nama Pelajar: " + opts.studentName,
      "ID / E-mel Akaun: " + opts.userIdInput,
      ...(opts.phoneInput ? ["No. Telefon: " + opts.phoneInput] : []),
      "Pilihan Pek: " + p.name + " (" + p.price + ")",
      ...(refCode ? ["Kod Rujukan Rakan: " + refCode] : []),
      "",
      "Mohon bantuan pengaktifan pek ini ke akaun eTutor.my saya. Terima kasih!"
    ].join("\n");
    const rawWa = ((window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.SALES_WHATSAPP) || "60137327696").replace(/\D/g, "");
    return { waUrl: "https://wa.me/" + (rawWa || "60137327696") + "?text=" + encodeURIComponent(lines), msgText: lines };
  }

  async function openCleanWhatsAppFallback(opts, orderDlg) {
    const built = buildCleanWhatsAppUrl(opts);
    try { await navigator.clipboard.writeText(built.msgText); } catch (e) {}
    if (orderDlg && orderDlg.open) await closeTopLayer(orderDlg);
    window.open(built.waUrl, "_blank", "noopener");
    showToast("Membuka WhatsApp Admin (013-732 7696)...");
  }

  // --- [features/payment/toyyibpayCheckoutService.js] ---
  /**
   * src/features/payment/toyyibpayCheckoutService.js
   * Pembayaran terus 1-klik ToyyibPay (FPX & DuitNow QR), sambung auto selepas log masuk, dan pengesahan pulangan bil.
   */







  const PENDING_ORDER_KEY = "etutor_pending_toyyibpay_order_v1";
  const PENDING_PACK_AFTER_LOGIN_KEY = "etutor_pending_buy_pack_v1";

  const PLAN_TO_PACK_CODE = {
    tokenStarter: "PEK_CUBA_45",
    tokenFocus: "PEK_FOKUS_160",
    tokenSprint: "PEK_PECUTAN_500"
  };

  function isAllowedPaymentRedirectUrl(urlStr) {
    if (!urlStr) return false;
    if (isLocalHostEnv() && urlStr.indexOf("/api/mock-toyyibpay") === 0) return true;
    return /^https:\/\/(?:dev\.)?toyyibpay\.com\/[a-zA-Z0-9_-]+/.test(urlStr);
  }

  async function postCreateToyyibPayBillWithRetry(url, headers, payloadJson) {
    try {
      return await fetch(url, { method: "POST", headers: headers, body: payloadJson });
    } catch (firstErr) {
      await new Promise(function (resolve) { setTimeout(resolve, 700); });
      return await fetch(url, { method: "POST", headers: headers, body: payloadJson });
    }
  }

  async function startToyyibPayCheckout(opts) {
    const jwt = await resolveBearerToken();
    const baseUrl = resolvePaymentBaseUrl(Boolean(jwt));
    if (!baseUrl && !isLocalHostEnv()) {
      showToast("Konfigurasi pelayan pembayaran ToyyibPay tidak lengkap. Sila hubungi sokongan.", true);
      return { ok: false };
    }
    if (!jwt && !isLocalHostEnv()) {
      showToast("Sila log masuk Google atau E-mel dahulu — anda akan terus dibawa ke pembayaran ToyyibPay.");
      if (opts.orderDlg && opts.orderDlg.open) await closeTopLayer(opts.orderDlg);
      openSyncDialog();
      return { ok: false, authRequired: true };
    }

    const packCode = PLAN_TO_PACK_CODE[opts.pkgKey] || "PEK_FOKUS_160";
    const cfg = (typeof window !== "undefined" && window.ETUTOR_CONFIG) || {};
    const headers = { "Content-Type": "application/json" };
    if (jwt) headers.Authorization = "Bearer " + jwt;
    if (cfg.SUPABASE_ANON_KEY) headers.apikey = cfg.SUPABASE_ANON_KEY;

    const btn = opts.submitBtn;
    const origLabel = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Menjana Bil ToyyibPay...";
    }

    try {
      const payloadJson = JSON.stringify({
        packCode: packCode,
        buyerName: opts.studentName,
        buyerEmail: opts.userIdInput,
        buyerPhone: opts.phoneInput || "",
        referralCode: getAttributedReferralCode(),
        returnOrigin: window.location.origin
      });
      const resp = await postCreateToyyibPayBillWithRetry(baseUrl + "/v1/payment/create-bill", headers, payloadJson);
      const data = await resp.json().catch(function () { return {}; });

      if (data && data.authRequired) {
        showToast(data.error || "Sila log masuk akaun dahulu sebelum membuat pembayaran.");
        if (opts.orderDlg && opts.orderDlg.open) await closeTopLayer(opts.orderDlg);
        openSyncDialog();
        return data;
      }
      if (!resp.ok || !data.ok || data.fallbackWhatsApp || !isAllowedPaymentRedirectUrl(data.paymentUrl)) {
        showToast((data && data.error) || "Gagal menjana bil pembayaran ToyyibPay. Sila cuba sebentar lagi.", true);
        return data || { ok: false };
      }

      try {
        sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({
          orderRef: data.orderRef || "", billCode: data.billCode || "", packCode: packCode
        }));
      } catch (e) {}

      if (opts.orderDlg && opts.orderDlg.open) await closeTopLayer(opts.orderDlg);
      showToast("Mengalihkan ke halaman pembayaran selamat ToyyibPay (FPX / DuitNow QR)...");
      window.location.assign(data.paymentUrl);
      return data;
    } catch (err) {
      showToast("Ralat sambungan ke pelayan ToyyibPay (" + ((err && err.message) || "Rangkaian") + "). Sila cuba lagi.", true);
      return { ok: false, error: err && err.message };
    } finally {
      if (btn) {
        btn.disabled = false;
        if (origLabel) btn.textContent = origLabel;
      }
    }
  }

  async function startDirectToyyibPayCheckout(opts) {
    const pkgKey = (opts && opts.pkgKey) || "tokenFocus";
    const directPayUrl = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.PAYMENT_URL) ? window.ETUTOR_CONFIG.PAYMENT_URL.trim() : "";
    if (directPayUrl) { window.open(directPayUrl, "_blank", "noopener"); return { ok: true }; }

    const jwt = await resolveBearerToken();
    if (!jwt && !isLocalHostEnv()) {
      try { sessionStorage.setItem(PENDING_PACK_AFTER_LOGIN_KEY, JSON.stringify({ pkgKey: pkgKey, ts: Date.now() })); } catch (e) {}
      if (opts && opts.parentDialog && opts.parentDialog.open) await closeTopLayer(opts.parentDialog);
      showToast("Sila log masuk Google atau E-mel dahulu — anda akan terus dibawa ke pembayaran ToyyibPay.");
      openSyncDialog();
      return { ok: false, authRequired: true };
    }

    const prof = await resolveCurrentCheckoutProfile();
    const plans = (opts && opts.plans) || (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.PRICING_PLANS) || {};
    showToast("Menghubungkan terus ke ToyyibPay (FPX / DuitNow QR)...");
    return startToyyibPayCheckout({
      studentName: prof.studentName,
      userIdInput: prof.email,
      phoneInput: prof.phone,
      pkgKey: pkgKey,
      plans: plans,
      orderDlg: (opts && opts.parentDialog) || null,
      submitBtn: (opts && opts.triggerBtn) || null
    });
  }

  function initToyyibPayAutoResumeAfterLogin() {
    if (initToyyibPayAutoResumeAfterLogin._bound || typeof window === "undefined") return;
    initToyyibPayAutoResumeAfterLogin._bound = true;

    const tryConsumePendingCheckout = async function () {
      let raw = "";
      try { raw = sessionStorage.getItem(PENDING_PACK_AFTER_LOGIN_KEY) || ""; } catch (e) {}
      if (!raw) return;
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch (e) {}
      if (!parsed || !parsed.pkgKey || (Date.now() - Number(parsed.ts || 0)) > 10 * 60 * 1000) {
        try { sessionStorage.removeItem(PENDING_PACK_AFTER_LOGIN_KEY); } catch (e) {}
        return;
      }
      const jwt = await resolveBearerToken();
      if (!jwt) return;
      try { sessionStorage.removeItem(PENDING_PACK_AFTER_LOGIN_KEY); } catch (e) {}
      await startDirectToyyibPayCheckout({ pkgKey: parsed.pkgKey });
    };

    tryConsumePendingCheckout();
    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb && sb.auth && typeof sb.auth.onAuthStateChange === "function") {
        sb.auth.onAuthStateChange(function (ev, sess) {
          if (ev === "SIGNED_IN" && sess) tryConsumePendingCheckout();
        });
      }
    }
  }

  async function handleToyyibPayReturnIfPresent() {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search || "");
    const hashStr = String(window.location.hash || "");
    const hqIdx = hashStr.indexOf("?");
    const haIdx = hashStr.indexOf("&");
    const hashExtra = hqIdx !== -1 ? hashStr.slice(hqIdx + 1) : (haIdx !== -1 ? hashStr.slice(haIdx + 1) : "");
    const hashParams = new URLSearchParams(hashExtra);
    if (params.get("payment_return") !== "toyyibpay" && hashParams.get("payment_return") !== "toyyibpay") return false;

    let pending = {};
    try { pending = JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY) || "{}"); } catch (e) {}
    const billCode = (params.get("billcode") || params.get("billCode") || hashParams.get("billcode") || hashParams.get("billCode") || pending.billCode || "").trim();
    const orderRef = (params.get("order_id") || params.get("orderRef") || hashParams.get("order_id") || hashParams.get("orderRef") || pending.orderRef || "").trim();
    const statusId = (params.get("status_id") || params.get("statusId") || hashParams.get("status_id") || hashParams.get("statusId") || "").trim();

    try {
      ["payment_return", "billcode", "billCode", "order_id", "orderRef", "status_id", "statusId", "transaction_id", "msg"]
        .forEach(function (k) { params.delete(k); });
      const q = params.toString();
      history.replaceState(null, "", window.location.pathname + (q ? "?" + q : "") + "#portal");
    } catch (e) {}

    const jwt = await resolveBearerToken();
    const baseUrl = resolvePaymentBaseUrl(Boolean(jwt));
    if ((!baseUrl && !isLocalHostEnv()) || (!billCode && !orderRef)) return true;

    try {
      const cfg = (typeof window !== "undefined" && window.ETUTOR_CONFIG) || {};
      const headers = { "Content-Type": "application/json" };
      if (cfg.SUPABASE_ANON_KEY) headers.apikey = cfg.SUPABASE_ANON_KEY;
      const resp = await fetch(baseUrl + "/v1/payment/verify", {
        method: "POST", headers: headers, body: JSON.stringify({ billCode: billCode, orderRef: orderRef, statusId: statusId })
      });
      const res = await resp.json().catch(function () { return {}; });
      if (res && res.ok) {
        try { sessionStorage.removeItem(PENDING_ORDER_KEY); } catch (e) {}
        await refreshAiWalletFromServer();
        const qty = Number(res.addedTokens || 0);
        showToast(qty > 0 ? "Pembayaran disahkan! +" + qty + " Token Top-up Kekal telah dikreditkan ke dompet anda." : "Pembayaran disahkan! Baki Token Top-up Kekal anda telah dikemas kini.");
      } else if (res && res.status === "FAILED") {
        try { sessionStorage.removeItem(PENDING_ORDER_KEY); } catch (e) {}
        showToast(res.error || "Pembayaran FPX dibatalkan. Tiada caj dikenakan.");
      } else {
        await refreshAiWalletFromServer();
        showToast((res && res.error) || "Pembayaran masih disahkan bank. Sila semak dompet anda sebentar lagi.");
      }
    } catch (err) {
      showToast("Gagal menyemak pengesahan bayaran buat sementara. Cuba segarkan halaman.");
    }
    return true;
  }

  // --- [features/landing/orderLeadModal.js] ---
  /**
   * src/features/landing/orderLeadModal.js
   * Pengikat acara Halaman Utama (pautan terus portal, auto-isi ID pengguna & pautan kelulusan Admin pada dialog tempahan).
   */










  async function resolveLoggedInOrderIdentity() {
    let loginId = "";
    let studentName = "";
    try { loginId = (localStorage.getItem(SYNC_EMAIL_KEY) || "").trim(); } catch (e) {}
    studentName = (getOpenStudentName() || "").trim();

    if (!loginId || !studentName) {
      try {
        const sb = getSupabaseClient();
        const sessRes = sb ? await sb.auth.getSession() : null;
        const u = sessRes && sessRes.data && sessRes.data.session ? sessRes.data.session.user : null;
        if (u) {
          if (!loginId && u.email) loginId = String(u.email).trim();
          const meta = u.user_metadata || {};
          if (!studentName) studentName = String(meta.full_name || meta.name || "").trim();
        }
      } catch (e) {}
    }

    if (!loginId) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || "";
          if (k.indexOf("sb-") === 0 && k.slice(-11) === "-auth-token") {
            const parsed = JSON.parse(localStorage.getItem(k) || "{}");
            const u = (parsed && parsed.user) || (parsed && parsed.currentSession && parsed.currentSession.user) || null;
            if (u && u.email) { loginId = String(u.email).trim(); break; }
          }
        }
      } catch (e) {}
    }

    if (!loginId && portalState.user && portalState.user.userId && String(portalState.user.userId).toUpperCase() !== "PELAJAR") {
      loginId = String(portalState.user.userId).trim();
    }
    if (!studentName && portalState.user && portalState.user.buyerName && String(portalState.user.buyerName).toUpperCase() !== "PELAJAR") {
      studentName = String(portalState.user.buyerName).trim();
    }
    if (!studentName && loginId) {
      studentName = loginId.indexOf("@") !== -1 ? loginId.split("@")[0] : loginId;
    }
    return { studentName: studentName, loginId: loginId };
  }

  async function prefillOrderUserFields() {
    const nameInp = document.getElementById("orderStudentName");
    const phoneInp = document.getElementById("orderPhoneInput");
    const authBanner = document.getElementById("orderAuthPrompt");
    const idInfo = await resolveLoggedInOrderIdentity();
    if (nameInp && !nameInp.value.trim() && idInfo.studentName) {
      nameInp.value = idInfo.studentName;
    }
    if (phoneInp && !phoneInp.value.trim() && idInfo.loginId) {
      phoneInp.value = idInfo.loginId;
    }
    if (authBanner) {
      authBanner.hidden = Boolean(idInfo.loginId);
    }
  }

  function initLandingAndOrderBindings() {
    const plans = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.PRICING_PLANS) || {};
    const orderDlg = document.getElementById("orderDialog");
    const closeOrderBtn = document.getElementById("closeOrderDialogBtn");
    const pkgSelect = document.getElementById("orderPackageSelect");
    const planBadge = document.getElementById("orderPlanBadge");
    const orderForm = document.getElementById("orderLeadForm");

    const payBtn = document.getElementById("submitOrderPayBtn");
    const waFallbackBtn = document.getElementById("submitOrderWhatsAppBtn");

    const syncOrderPlanBadge = function () {
      if (!pkgSelect || !planBadge) return;
      const key = pkgSelect.value || "tokenFocus";
      const p = plans[key];
      if (p) {
        planBadge.textContent = p.name + " — " + p.price;
        if (payBtn) payBtn.textContent = "Bayar FPX / DuitNow QR — " + p.price;
      }
    };

    if (pkgSelect) pkgSelect.addEventListener("change", syncOrderPlanBadge);
    window.addEventListener("etutor:prefill-order-modal", prefillOrderUserFields);
    const orderLoginBtn = document.getElementById("orderLoginNowBtn");
    if (orderLoginBtn && orderDlg) {
      orderLoginBtn.addEventListener("click", async function () {
        if (orderDlg.open) await closeTopLayer(orderDlg);
        openSyncDialog();
      });
    }

    if (closeOrderBtn && orderDlg) {
      closeOrderBtn.addEventListener("click", function () { closeTopLayer(orderDlg); });
      orderDlg.addEventListener("cancel", function (ev) { ev.preventDefault(); closeTopLayer(orderDlg); });
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
      const planBtn = e.target.closest(".js-select-plan");
      if (planBtn) {
        e.preventDefault();
        const key = planBtn.getAttribute("data-plan-key") || "tokenFocus";
        startDirectToyyibPayCheckout({
          pkgKey: plans[key] ? key : "tokenFocus",
          triggerBtn: planBtn,
          plans: plans
        });
        return;
      }

      const enterOpen = e.target.closest(".js-enter-open-portal");
      if (enterOpen) {
        e.preventDefault();
        window.location.hash = (isOpenAccessMode() || isPortalUserAuthenticated()) ? "#portal" : "#login";
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const gotoKlonPortal = e.target.closest(".js-goto-klon-portal");
      if (gotoKlonPortal) {
        e.preventDefault();
        if (!isOpenAccessMode() && !isPortalUserAuthenticated()) {
          portalState.pendingKlonScroll = true;
          window.location.hash = "#login";
          syncRouteMode();
          window.scrollTo(0, 0);
          return;
        }
        portalState.pendingKlonScroll = true;
        window.location.hash = "#klon-portal";
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
            if (!isOpenAccessMode()) { window.location.hash = "#login"; syncRouteMode(); window.scrollTo(0, 0); return; }
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
          if (found && found.fileId) openQuizSet(found.fileId, Boolean(found.inProgress), false);
          else {
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
        history.pushState("", document.title, window.location.pathname + window.location.search);
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }

      const backPricing = e.target.closest(".js-back-to-pricing");
      if (backPricing) {
        e.preventDefault();
        window.location.hash = "#pelan-token";
        syncRouteMode();
      }
    });

    if (waFallbackBtn) {
      waFallbackBtn.addEventListener("click", async function () {
        const studentName = (document.getElementById("orderStudentName")?.value || "").trim() || "Pelajar eTutor.my";
        const userIdInput = (document.getElementById("orderPhoneInput")?.value || "").trim() || "Belum dinyatakan";
        const phoneInput = (document.getElementById("orderMobileTelInput")?.value || "").trim();
        const key = (pkgSelect && pkgSelect.value) || "tokenFocus";
        await openCleanWhatsAppFallback({
          studentName: studentName,
          userIdInput: userIdInput,
          phoneInput: phoneInput,
          pkgKey: key,
          plans: plans
        }, orderDlg);
      });
    }

    if (orderForm) {
      orderForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nameInp = document.getElementById("orderStudentName");
        const idInp = document.getElementById("orderPhoneInput");
        const mobileInp = document.getElementById("orderMobileTelInput");
        const studentName = nameInp ? nameInp.value.trim() : "";
        const userIdInput = idInp ? idInp.value.trim() : "";
        const phoneInput = mobileInp ? mobileInp.value.trim() : "";
        const key = (pkgSelect && pkgSelect.value) || "tokenFocus";
        if (studentName.length < 2 || userIdInput.length < 5 || (mobileInp && phoneInput.length < 9)) {
          orderForm.reportValidity();
          return;
        }
        await startToyyibPayCheckout({
          studentName: studentName,
          userIdInput: userIdInput,
          phoneInput: phoneInput,
          pkgKey: key,
          plans: plans,
          orderDlg: orderDlg,
          submitBtn: payBtn
        });
      });
    }
  }

  // --- [features/landing/footerLiveStats.js] ---
  /**
   * src/features/landing/footerLiveStats.js
   * Paparan statistik pengguna portal & pelawat aktif masa nyata (Supabase RPC + Realtime Presence) di footer laman utama.
   */

  let presenceChannel = null;
  let initialized = false;

  function setLiveOnlineText(onlineCount) {
    const el = document.getElementById("footerLiveUsersCount");
    if (!el) return;
    const n = Number(onlineCount);
    if (!Number.isFinite(n) || n < 5) {
      el.textContent = "Aktif 24/7";
    } else {
      el.textContent = n.toLocaleString("ms-MY");
    }
  }

  function setAggregateStat(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const pill = el.closest(".lp-footer-stat-pill");
    const n = Number(value) || 0;
    if (n < 10) {
      if (pill) pill.hidden = true;
      return;
    }
    if (pill) pill.hidden = false;
    el.textContent = n.toLocaleString("ms-MY");
  }

  function getTabPresenceKey() {
    try {
      const existing = sessionStorage.getItem("etutor_presence_key");
      if (existing) return existing;
      const generated = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        ? crypto.randomUUID()
        : ("v_" + Math.random().toString(36).slice(2) + Date.now().toString(36));
      sessionStorage.setItem("etutor_presence_key", generated);
      return generated;
    } catch (_) {
      return "v_" + Math.random().toString(36).slice(2);
    }
  }

  async function refreshAggregateStats(supabase) {
    try {
      const { data, error } = await supabase.rpc("get_public_portal_stats");
      if (error || !data) return null;
      setAggregateStat("footerTotalUsersCount", Number(data.total_users || 0));
      setAggregateStat("footerActive24hCount", Number(data.active_24h || 0));
      setAggregateStat("footerQuizAttemptsCount", Number(data.quiz_attempts || 0));
      return data;
    } catch (_) {
      return null;
    }
  }

  function subscribeLivePresence(supabase, fallbackSessions) {
    if (presenceChannel) return;
    const presenceKey = getTabPresenceKey();
    presenceChannel = supabase.channel("etutor-live-presence", {
      config: {
        presence: { key: presenceKey }
      }
    });

    presenceChannel.on("presence", { event: "sync" }, function () {
      if (!presenceChannel) return;
      const state = presenceChannel.presenceState();
      const onlineCount = Object.keys(state || {}).length;
      setLiveOnlineText(onlineCount);
    });

    presenceChannel.subscribe(async function (status) {
      if (status === "SUBSCRIBED" && presenceChannel) {
        try {
          await presenceChannel.track({
            page: window.location.hash || "landing",
            online_at: new Date().toISOString()
          });
        } catch (_) {}
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        if (typeof fallbackSessions === "number") {
          setLiveOnlineText(fallbackSessions);
        }
      }
    });
  }

  async function initFooterLiveStats() {
    if (initialized) return;
    if (!document.getElementById("footerLiveUsersCount")) return;
    initialized = true;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const stats = await refreshAggregateStats(supabase);
    const fallbackSessions = stats && typeof stats.active_sessions === "number"
      ? stats.active_sessions
      : 1;
    setLiveOnlineText(fallbackSessions);
    subscribeLivePresence(supabase, fallbackSessions);
  }

  // --- [features/landing/landingNotaAnnouncement.js] ---
  /**
   * src/features/landing/landingNotaAnnouncement.js
   * Pengawal pengumuman terapung Nota Interaktif pada halaman pendaratan (#landingView).
   */





  const LP_NOTA_FLOAT_DISMISSED_KEY = "etutor_lp_nota_float_dismissed_v1";

  function moveFocusSafelyOutOfAnnouncement(bar) {
    if (!bar.contains(document.activeElement)) return;
    const fallbackFocus =
      document.querySelector("#landingView .btn-hero-cta:not([hidden])") ||
      document.getElementById("lpHeroHeading");
    if (!fallbackFocus) return;
    if (!fallbackFocus.hasAttribute("tabindex") && fallbackFocus.tagName !== "A" && fallbackFocus.tagName !== "BUTTON") {
      fallbackFocus.setAttribute("tabindex", "-1");
    }
    fallbackFocus.focus({ preventScroll: true });
  }

  function initLandingNotaAnnouncement() {
    const bar = document.getElementById("lpNotaAnnouncement");
    if (!bar) return;

    try {
      if (sessionStorage.getItem(LP_NOTA_FLOAT_DISMISSED_KEY) === "1") {
        bar.hidden = true;
        return;
      }
    } catch (e) {}

    const countEl = document.getElementById("lpNotaFloatCount");
    if (countEl) {
      const count = getNotaCatalogList().length;
      if (count > 0) {
        countEl.textContent = count + (isNotaFreePromoActive() ? " Bab KSSM \u2022 0 Token" : " Bab KSSM");
      }
    }

    const closeBtn = document.getElementById("lpNotaFloatClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        try {
          sessionStorage.setItem(LP_NOTA_FLOAT_DISMISSED_KEY, "1");
        } catch (e) {}

        moveFocusSafelyOutOfAnnouncement(bar);

        const reduceMotion =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
          bar.hidden = true;
          return;
        }

        bar.classList.add("is-dismissing");
        window.setTimeout(function () {
          bar.hidden = true;
          bar.classList.remove("is-dismissing");
        }, 240);
      });
    }

    const ctaLink = document.getElementById("lpNotaFloatCta");
    if (ctaLink) {
      ctaLink.addEventListener("click", function (e) {
        e.preventDefault();
        portalState.pendingNotaScroll = true;
        if (!isOpenAccessMode() && !isPortalUserAuthenticated()) {
          window.location.hash = "#login";
          syncRouteMode();
          window.scrollTo(0, 0);
          return;
        }
        window.location.hash = "#nota-portal";
        syncRouteMode();
      });
    }
  }

  // --- [features/spm-countdown/spmTimeEngine.js] ---
  /**
   * src/features/spm-countdown/spmTimeEngine.js
   * Enjin pengiraan masa Temporal API (Asia/Kuala_Lumpur) berserta sandaran tepat UTC+08:00
   * dan pemformatan tarikh/waktu rasmi Malaysia.
   */
  const SPM_SCHEDULE = {
    "meta": {
      "docRef": "LP/SPM/2026 (18 Ogos 2026)",
      "timeZone": "Asia/Kuala_Lumpur",
      "writtenStart": { "date": "2026-11-23", "hadir": "08:30", "start": "09:00", "label": "Peperiksaan Bertulis & Ujian Mendengar SPM 2026" },
      "writtenEnd": { "date": "2026-12-17", "end": "17:00" },
      "phases": [
        { "id": "bertutur_bm", "label": "Ujian Bertutur BM", "shortDate": "26–29 Okt", "startDate": "2026-10-26", "startTime": "08:00", "endDate": "2026-10-29", "endTime": "16:10" },
        { "id": "bertutur_bi", "label": "Ujian Bertutur BI", "shortDate": "2–5 Nov", "startDate": "2026-11-02", "startTime": "08:00", "endDate": "2026-11-05", "endTime": "16:15" },
        { "id": "amali_sains", "label": "Ujian Amali Sains", "shortDate": "16–18 Nov", "startDate": "2026-11-16", "startTime": "08:00", "endDate": "2026-11-18", "endTime": "14:15" },
        { "id": "bertulis", "label": "Peperiksaan Bertulis", "shortDate": "23 Nov–17 Dis", "startDate": "2026-11-23", "startTime": "09:00", "endDate": "2026-12-17", "endTime": "17:00" }
      ],
      "notices": [
        { "date": "2026-11-24", "type": "notice", "title": "Edaran Kertas 2611/2 PSV", "text": "Calon berdaftar kertas 2611/2 Pendidikan Seni Visual – Ujian Melukis Kertas 2 hendaklah mengambil kertas peperiksaan daripada Ketua Pengawas Peperiksaan pada 24 November 2026 (Selasa)." },
        { "date": "2026-12-11", "type": "holiday", "title": "Cuti Sempena Hari Keputeraan Sultan Selangor", "text": "Tiada kertas peperiksaan bertulis SPM dijadualkan pada Jumaat, 11 Disember 2026." }
      ]
    },
    "presets": {
      "TERAS": ["1103", "1119", "1223", "1225", "1449", "1249", "1511"],
      "SAINS_TULEN": ["1103", "1119", "1223", "1449", "1249", "3472", "4531", "4541", "4551"],
      "AKAUN_PERNIAGAAN": ["1103", "1119", "1223", "1449", "1249", "1511", "3756", "3766", "3767"],
      "IKHTISAS_TEKNIKAL": ["1103", "1119", "1223", "1449", "1249", "1511", "2280", "3770", "3763", "3769", "4572", "2611"],
      "AGAMA_KBD": ["1103", "1119", "1449", "1249", "1511", "2361", "5226", "5227", "5228", "5401", "5402"],
      "ETUTOR_UTAMA": ["1103", "1119", "1223", "1225", "1449", "1249", "1511", "3472", "4531", "4541", "4551", "3756", "3767", "3766", "2280", "3770", "3763", "4572", "3769", "5226", "5227", "5228", "5401", "2361"]
    },
    "subjects": [
      { "code": "1103", "name": "Bahasa Melayu", "stream": "teras", "etutorSubject": "Bahasa Melayu", "papers": [{ "code": "1103/3", "title": "Ujian Bertutur (Kertas 3)", "date": "2026-10-26", "endDate": "2026-10-29", "hadir": "07:40", "start": "08:00", "end": "16:10", "duration": "Sidang 1–3", "type": "bertutur" }, { "code": "1103/4", "title": "Ujian Mendengar (Kertas 4)", "date": "2026-11-23", "hadir": "08:30", "start": "09:00", "end": "09:30", "duration": "30 minit", "type": "mendengar" }, { "code": "1103/1", "title": "Kertas 1", "date": "2026-11-23", "hadir": "10:15", "start": "10:45", "end": "12:45", "duration": "2 jam", "type": "bertulis" }, { "code": "1103/2", "title": "Kertas 2", "date": "2026-11-23", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "1119", "name": "Bahasa Inggeris", "stream": "teras", "etutorSubject": "Bahasa Inggeris", "papers": [{ "code": "1119/3", "title": "Ujian Bertutur (Kertas 3)", "date": "2026-11-02", "endDate": "2026-11-05", "hadir": "07:40", "start": "08:00", "end": "16:15", "duration": "Sidang 1–3", "type": "bertutur" }, { "code": "1119/4", "title": "Ujian Mendengar (Kertas 4)", "date": "2026-11-24", "hadir": "08:30", "start": "09:00", "end": "09:40", "duration": "40 minit", "type": "mendengar" }, { "code": "1119/1", "title": "Kertas 1", "date": "2026-11-24", "hadir": "10:30", "start": "11:00", "end": "12:30", "duration": "1 jam 30 minit", "type": "bertulis" }, { "code": "1119/2", "title": "Kertas 2", "date": "2026-11-24", "hadir": "14:00", "start": "14:30", "end": "16:00", "duration": "1 jam 30 minit", "type": "bertulis" }] },
      { "code": "1223", "name": "Pendidikan Islam", "stream": "teras", "etutorSubject": "Pendidikan Islam", "papers": [{ "code": "1223/1", "title": "Kertas 1", "date": "2026-11-25", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "1225", "name": "Pendidikan Moral", "stream": "teras", "etutorSubject": "Pendidikan Moral", "papers": [{ "code": "1225", "title": "Kertas Peperiksaan", "date": "2026-11-25", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "1449", "name": "Matematik", "stream": "teras", "etutorSubject": "Matematik", "papers": [{ "code": "1449/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-11-26", "hadir": "07:45", "start": "08:15", "end": "09:45", "duration": "1 jam 30 minit", "type": "bertulis" }, { "code": "1449/2", "title": "Kertas 2", "date": "2026-11-26", "hadir": "10:15", "start": "10:45", "end": "13:15", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "1249", "name": "Sejarah", "stream": "teras", "etutorSubject": "Sejarah", "papers": [{ "code": "1249/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-11-30", "hadir": "07:45", "start": "08:15", "end": "09:15", "duration": "1 jam", "type": "bertulis" }, { "code": "1249/2", "title": "Kertas 2", "date": "2026-11-30", "hadir": "10:00", "start": "10:30", "end": "13:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "1511", "name": "Sains", "stream": "teras", "etutorSubject": "Sains", "papers": [{ "code": "1511/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-03", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "1511/2", "title": "Kertas 2", "date": "2026-12-03", "hadir": "10:00", "start": "10:30", "end": "13:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "4531", "name": "Fizik", "stream": "sains", "etutorSubject": "Fizik", "papers": [{ "code": "4531/3", "title": "Ujian Amali Sains (Kertas 3)", "date": "2026-11-16", "hadir": "07:30", "start": "08:00", "end": "13:00", "duration": "45 minit / sidang", "type": "amali" }, { "code": "4531/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-03", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "4531/2", "title": "Kertas 2", "date": "2026-12-03", "hadir": "10:00", "start": "10:30", "end": "13:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "4541", "name": "Kimia", "stream": "sains", "etutorSubject": "Kimia", "papers": [{ "code": "4541/3", "title": "Ujian Amali Sains (Kertas 3)", "date": "2026-11-17", "hadir": "07:30", "start": "08:00", "end": "13:00", "duration": "45 minit / sidang", "type": "amali" }, { "code": "4541/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-15", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "4541/2", "title": "Kertas 2", "date": "2026-12-15", "hadir": "10:15", "start": "10:45", "end": "13:15", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "4551", "name": "Biologi", "stream": "sains", "etutorSubject": "Biologi", "papers": [{ "code": "4551/3", "title": "Ujian Amali Sains (Kertas 3)", "date": "2026-11-18", "hadir": "07:30", "start": "08:00", "end": "13:00", "duration": "45 minit / sidang", "type": "amali" }, { "code": "4551/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-02", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "4551/2", "title": "Kertas 2", "date": "2026-12-02", "hadir": "10:15", "start": "10:45", "end": "13:15", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "4561", "name": "Sains Tambahan", "stream": "sains", "etutorSubject": "", "papers": [{ "code": "4561/3", "title": "Ujian Amali Sains (Kertas 3)", "date": "2026-11-18", "hadir": "07:30", "start": "08:00", "end": "14:15", "duration": "1 jam 30 minit / sidang", "type": "amali" }, { "code": "4561/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-15", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "4561/2", "title": "Kertas 2", "date": "2026-12-15", "hadir": "10:15", "start": "10:45", "end": "13:15", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3472", "name": "Matematik Tambahan", "stream": "sains", "etutorSubject": "Matematik Tambahan", "papers": [{ "code": "3472/1", "title": "Kertas 1", "date": "2026-12-17", "hadir": "07:45", "start": "08:15", "end": "10:15", "duration": "2 jam", "type": "bertulis" }, { "code": "3472/2", "title": "Kertas 2", "date": "2026-12-17", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3729", "name": "Pertanian", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3729/1", "title": "Kertas 1", "date": "2026-11-25", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "2611", "name": "Pendidikan Seni Visual", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "2611/2", "title": "Ujian Melukis Kertas 2", "date": "2026-12-01", "hadir": "07:45", "start": "08:15", "end": "11:15", "duration": "3 jam", "type": "bertulis" }, { "code": "2611/1", "title": "Teori Seni Kertas 1 (Aneka Pilihan)", "date": "2026-12-01", "hadir": "07:45", "start": "12:00", "end": "13:00", "duration": "1 jam", "type": "bertulis" }] },
      { "code": "2621", "name": "Pendidikan Muzik", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "2621/1", "title": "Kertas 1", "date": "2026-12-01", "hadir": "14:00", "start": "14:30", "end": "16:00", "duration": "1 jam 30 minit", "type": "bertulis" }] },
      { "code": "3763", "name": "Reka Cipta", "stream": "ikhtisas", "etutorSubject": "Reka Cipta", "papers": [{ "code": "3763/1", "title": "Kertas 1", "date": "2026-12-01", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3766", "name": "Perniagaan", "stream": "ikhtisas", "etutorSubject": "Perniagaan", "papers": [{ "code": "3766/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-02", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "3766/2", "title": "Kertas 2", "date": "2026-12-02", "hadir": "10:15", "start": "10:45", "end": "13:00", "duration": "2 jam 15 minit", "type": "bertulis" }, { "code": "3766/4", "title": "Kertas 4 (Calon Persendirian)", "date": "2026-12-02", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3769", "name": "Sains Rumah Tangga", "stream": "ikhtisas", "etutorSubject": "Sains Rumah Tangga", "papers": [{ "code": "3769/1", "title": "Kertas 1", "date": "2026-12-03", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3767", "name": "Ekonomi", "stream": "ikhtisas", "etutorSubject": "Ekonomi", "papers": [{ "code": "3767/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-07", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "3767/2", "title": "Kertas 2", "date": "2026-12-07", "hadir": "10:15", "start": "10:45", "end": "13:00", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "3759", "name": "Lukisan Kejuruteraan", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3759/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3771", "name": "Grafik Komunikasi Teknikal", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3771/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "4572", "name": "Sains Sukan", "stream": "ikhtisas", "etutorSubject": "Sains Sukan", "papers": [{ "code": "4572/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-09", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "4572/2", "title": "Kertas 2", "date": "2026-12-09", "hadir": "10:00", "start": "10:30", "end": "13:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3754", "name": "Pengajian Keusahawanan", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3754/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3760", "name": "Pengajian Kejuruteraan Mekanikal", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3760/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3761", "name": "Pengajian Kejuruteraan Awam", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3761/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3762", "name": "Pengajian Kejuruteraan Elektrik dan Elektronik", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3762/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3768", "name": "Asas Kelestarian", "stream": "ikhtisas", "etutorSubject": "", "papers": [{ "code": "3768/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3770", "name": "Sains Komputer", "stream": "ikhtisas", "etutorSubject": "Sains Komputer", "papers": [{ "code": "3770/1", "title": "Kertas 1", "date": "2026-12-10", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "3756", "name": "Prinsip Perakaunan", "stream": "ikhtisas", "etutorSubject": "Prinsip Perakaunan", "papers": [{ "code": "3756/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-14", "hadir": "07:45", "start": "08:15", "end": "09:30", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "3756/2", "title": "Kertas 2", "date": "2026-12-14", "hadir": "10:15", "start": "10:45", "end": "13:15", "duration": "2 jam 30 minit", "type": "bertulis" }, { "code": "3756/4", "title": "Kertas 4 (Calon Persendirian)", "date": "2026-12-14", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "2280", "name": "Geografi", "stream": "ikhtisas", "etutorSubject": "Geografi", "papers": [{ "code": "2280/1", "title": "Kertas 1 (Aneka Pilihan)", "date": "2026-12-16", "hadir": "11:15", "start": "11:45", "end": "13:00", "duration": "1 jam 15 minit", "type": "bertulis" }, { "code": "2280/2", "title": "Kertas 2", "date": "2026-12-16", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5402", "name": "Al-Syariah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5402/1", "title": "Kertas 1", "date": "2026-11-25", "hadir": "07:45", "start": "08:15", "end": "10:30", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "5228", "name": "Pendidikan Syari'ah Islamiah", "stream": "agama", "etutorSubject": "Pendidikan Syariah Islamiah", "papers": [{ "code": "5228", "title": "Kertas Peperiksaan", "date": "2026-11-25", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5304", "name": "Turath Dirasat Islamiah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5304/1", "title": "Kertas 1", "date": "2026-11-25", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5302", "name": "Maharat Al-Quran", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5302/2", "title": "Kertas 2", "date": "2026-11-25", "hadir": "14:00", "start": "14:30", "end": "16:00", "duration": "1 jam 30 minit", "type": "bertulis" }] },
      { "code": "5226", "name": "Tasawwur Islam", "stream": "agama", "etutorSubject": "Tasawwur Islam", "papers": [{ "code": "5226", "title": "Kertas Peperiksaan", "date": "2026-11-30", "hadir": "14:00", "start": "14:30", "end": "17:00", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5404", "name": "Manahij al-'Ulum al-Islamiah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5404/1", "title": "Kertas 1", "date": "2026-12-01", "hadir": "07:45", "start": "08:15", "end": "10:30", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "2361", "name": "Bahasa Arab", "stream": "agama", "etutorSubject": "Bahasa Arab", "papers": [{ "code": "2361/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5403", "name": "Al-Lughah al-Arabiah al-Mu'asirah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5403/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5305", "name": "Turath Bahasa Arab", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5305/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5401", "name": "Usul al-Din", "stream": "agama", "etutorSubject": "Usul al-Din", "papers": [{ "code": "5401/1", "title": "Kertas 1", "date": "2026-12-09", "hadir": "07:45", "start": "08:15", "end": "10:30", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "5227", "name": "Pendidikan Al-Quran dan Al-Sunnah", "stream": "agama", "etutorSubject": "Pendidikan Al-Quran & As-Sunnah", "papers": [{ "code": "5227/1", "title": "Kertas 1", "date": "2026-12-10", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5303", "name": "Turath Al-Quran dan Al-Sunnah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5303/1", "title": "Kertas 1", "date": "2026-12-10", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "5405", "name": "Al-Adab wa al-Balaghah", "stream": "agama", "etutorSubject": "", "papers": [{ "code": "5405/1", "title": "Kertas 1", "date": "2026-12-14", "hadir": "14:00", "start": "14:30", "end": "16:45", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "6351", "name": "Bahasa Cina", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "6351/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:00", "duration": "1 jam 45 minit", "type": "bertulis" }, { "code": "6351/2", "title": "Kertas 2", "date": "2026-12-08", "hadir": "14:00", "start": "14:30", "end": "16:45", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "6354", "name": "Bahasa Tamil", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "6354/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:00", "duration": "1 jam 45 minit", "type": "bertulis" }, { "code": "6354/2", "title": "Kertas 2", "date": "2026-12-08", "hadir": "14:00", "start": "14:30", "end": "16:45", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "6356", "name": "Bahasa Iban", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "6356/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:00", "duration": "1 jam 45 minit", "type": "bertulis" }, { "code": "6356/2", "title": "Kertas 2", "date": "2026-12-08", "hadir": "14:00", "start": "14:30", "end": "16:45", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "6357", "name": "Bahasa Kadazandusun", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "6357/1", "title": "Kertas 1", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:00", "duration": "1 jam 45 minit", "type": "bertulis" }, { "code": "6357/2", "title": "Kertas 2", "date": "2026-12-08", "hadir": "14:00", "start": "14:30", "end": "16:45", "duration": "2 jam 15 minit", "type": "bertulis" }] },
      { "code": "6358", "name": "Bahasa Semai", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "6358", "title": "Kertas Peperiksaan", "date": "2026-12-08", "hadir": "07:45", "start": "08:15", "end": "10:00", "duration": "1 jam 45 minit", "type": "bertulis" }] },
      { "code": "9221", "name": "Bible Knowledge", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "9221", "title": "Kertas Peperiksaan", "date": "2026-12-10", "hadir": "07:45", "start": "08:15", "end": "10:15", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "9378", "name": "Bahasa Punjabi", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "9378", "title": "Kertas Peperiksaan", "date": "2026-12-10", "hadir": "07:45", "start": "08:15", "end": "10:15", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "2206", "name": "Kesusasteraan Inggeris", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "2206", "title": "Kertas Peperiksaan", "date": "2026-12-16", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "2216", "name": "Kesusasteraan Melayu Komunikatif", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "2216/1", "title": "Kertas 1", "date": "2026-12-16", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "9216", "name": "Kesusasteraan Cina", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "9216", "title": "Kertas Peperiksaan", "date": "2026-12-16", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "9217", "name": "Kesusasteraan Tamil", "stream": "bahasa", "etutorSubject": "", "papers": [{ "code": "9217", "title": "Kertas Peperiksaan", "date": "2026-12-16", "hadir": "07:45", "start": "08:15", "end": "10:45", "duration": "2 jam 30 minit", "type": "bertulis" }] },
      { "code": "7101", "name": "Pembinaan Domestik", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7101/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7103", "name": "Kerja Paip Domestik", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7103/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7104", "name": "Pendawaian Domestik", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7104/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7105", "name": "Kimpalan Arka dan Gas", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7105/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7106", "name": "Menservis Automobil", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7106/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7107", "name": "Menservis Motosikal", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7107/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7108", "name": "Menservis Peralatan Penyejukan dan Penyamanan Udara", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7108/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7109", "name": "Menservis Peralatan Elektrik Domestik", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7109/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7110", "name": "Pembuatan Perabot", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7110/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7201", "name": "Rekaan dan Jahitan Pakaian", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7201/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7202", "name": "Katering dan Penyajian", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7202/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7203", "name": "Pemprosesan Makanan", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7203/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7205", "name": "Asuhan dan Pendidikan Awal Kanak-Kanak", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7205/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7207", "name": "Penjagaan Muka dan Penggayaan Rambut", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7207/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7208", "name": "Gerontologi Asas dan Geriatrik", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7208/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7301", "name": "Landskap dan Nurseri", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7301/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7302", "name": "Akuakultur dan Haiwan Rekreasi", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7302/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7303", "name": "Tanaman Makanan", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7303/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7403", "name": "Produksi Multimedia", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7403/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7405", "name": "Produksi Reka Tanda", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7405/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7406", "name": "Hiasan Dalaman", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7406/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] },
      { "code": "7407", "name": "Reka Bentuk Grafik Digital", "stream": "mpv", "etutorSubject": "", "papers": [{ "code": "7407/1", "title": "Kertas 1", "date": "2026-12-07", "hadir": "14:00", "start": "14:30", "end": "16:30", "duration": "2 jam", "type": "bertulis" }] }
    ]
  };
  const MY_TIMEZONE = (SPM_SCHEDULE.meta && SPM_SCHEDULE.meta.timeZone) || "Asia/Kuala_Lumpur";
  const MY_OFFSET_MS = 8 * 60 * 60 * 1000;

  function hasNativeTemporal() {
    return typeof Temporal !== "undefined" && typeof Temporal.Now !== "undefined" && typeof Temporal.PlainDate !== "undefined";
  }

  function getNowEpochMs(overrideMs) {
    if (typeof overrideMs === "number" && !Number.isNaN(overrideMs)) return overrideMs;
    if (hasNativeTemporal()) {
      try { return Temporal.Now.instant().epochMilliseconds; } catch (e) {}
    }
    return Date.now();
  }

  function parseMytToEpochMs(dateStr, timeStr) {
    const cleanTime = (timeStr || "08:00").slice(0, 5);
    if (hasNativeTemporal()) {
      try {
        return Temporal.PlainDate.from(dateStr).toPlainDateTime(cleanTime + ":00").toZonedDateTime(MY_TIMEZONE).epochMilliseconds;
      } catch (e) {}
    }
    const dParts = String(dateStr || "2026-11-23").split("-").map(Number);
    const tParts = cleanTime.split(":").map(Number);
    return Date.UTC(dParts[0], (dParts[1] || 1) - 1, dParts[2] || 1, (tParts[0] || 0) - 8, tParts[1] || 0, 0);
  }

  function getMytDateKey(epochMs) {
    return new Date(epochMs + MY_OFFSET_MS).toISOString().slice(0, 10);
  }

  function formatDurationHumanMs(days, hours, minutes) {
    if (days > 0) return days + " hari " + hours + " jam";
    if (hours > 0) return hours + " jam " + minutes + " minit";
    return Math.max(1, minutes) + " minit";
  }

  function computeCountdownParts(dateStr, timeStr, nowOverrideMs) {
    const cleanTime = (timeStr || "08:00").slice(0, 5);
    const isoTarget = dateStr + "T" + cleanTime + ":00+08:00";

    if (hasNativeTemporal() && typeof nowOverrideMs !== "number") {
      try {
        const nowZdt = Temporal.Now.zonedDateTimeISO(MY_TIMEZONE);
        const targetZdt = Temporal.PlainDate.from(dateStr).toPlainDateTime(cleanTime + ":00").toZonedDateTime(MY_TIMEZONE);
        const dur = nowZdt.until(targetZdt, { largestUnit: "day", smallestUnit: "second" });
        if (dur.sign <= 0) {
          return { sign: dur.sign, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isoTarget: isoTarget, humanLabel: "Tiba masa" };
        }
        let humanLabel = "";
        try {
          humanLabel = dur.toLocaleString("ms-MY", { style: "long" });
        } catch (e) {
          humanLabel = formatDurationHumanMs(dur.days, dur.hours, dur.minutes);
        }
        return {
          sign: 1,
          days: dur.days,
          hours: dur.hours,
          minutes: dur.minutes,
          seconds: dur.seconds,
          totalSeconds: Math.max(0, Math.floor((targetZdt.epochMilliseconds - nowZdt.epochMilliseconds) / 1000)),
          isoTarget: isoTarget,
          humanLabel: humanLabel
        };
      } catch (e) {}
    }

    const nowMs = getNowEpochMs(nowOverrideMs);
    const targetMs = parseMytToEpochMs(dateStr, cleanTime);
    const diffSec = Math.floor((targetMs - nowMs) / 1000);
    if (diffSec <= 0) {
      return { sign: diffSec === 0 ? 0 : -1, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isoTarget: isoTarget, humanLabel: "Tiba masa" };
    }
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    return {
      sign: 1, days: days, hours: hours, minutes: minutes, seconds: seconds,
      totalSeconds: diffSec, isoTarget: isoTarget, humanLabel: formatDurationHumanMs(days, hours, minutes)
    };
  }

  function formatMalayDateShort(dateStr, endDateStr) {
    const fmt = new Intl.DateTimeFormat("ms-MY", { timeZone: MY_TIMEZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const startLabel = fmt.format(new Date(parseMytToEpochMs(dateStr, "12:00")));
    if (!endDateStr || endDateStr === dateStr) return startLabel;
    const endFmt = new Intl.DateTimeFormat("ms-MY", { timeZone: MY_TIMEZONE, day: "numeric", month: "short" });
    return startLabel.replace(/\s+\d{4}$/, "") + " – " + endFmt.format(new Date(parseMytToEpochMs(endDateStr, "12:00"))) + " " + dateStr.slice(0, 4);
  }

  function formatMalayTimeLabel(hhmm) {
    const parts = String(hhmm || "08:00").split(":").map(Number);
    const hh = parts[0] || 0;
    const mm = String(parts[1] || 0).padStart(2, "0");
    const period = hh < 12 ? "pg" : (hh < 14 ? "tgh" : "ptg");
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return h12 + ":" + mm + " " + period;
  }

  // --- [features/spm-countdown/spmCountdownService.js] ---
  /**
   * src/features/spm-countdown/spmCountdownService.js
   * Storan keutamaan Subjek Saya, penilai status kertas SPM 2026 & ringkasan Hero.
   */


  const STREAM_LABELS = {
    ALL: "Semua Aliran",
    teras: "Subjek Teras",
    sains: "Sains Tulen & Add Math",
    ikhtisas: "Elektif Ikhtisas & Teknikal",
    agama: "Pengajian Islam & KBD",
    bahasa: "Bahasa & Kesusasteraan",
    mpv: "Vokasional (MPV)"
  };

  function getDefaultSpmCountdownPrefs() {
    const defaults = (SPM_SCHEDULE.presets && SPM_SCHEDULE.presets.SAINS_TULEN) || ["1103", "1119", "1223", "1449", "1249"];
    return {
      selectedCodes: defaults.slice(),
      stream: "ALL",
      onlyMine: false,
      hideCompleted: false,
      viewMode: "cards",
      heroMode: "written",
      search: ""
    };
  }

  function loadSpmCountdownPrefs() {
    const base = getDefaultSpmCountdownPrefs();
    try {
      if (typeof localStorage === "undefined") return base;
      const raw = localStorage.getItem(SPM_COUNTDOWN_PREFS_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return base;
      return {
        selectedCodes: Array.isArray(parsed.selectedCodes) ? parsed.selectedCodes.map(String) : base.selectedCodes,
        stream: STREAM_LABELS[parsed.stream] ? parsed.stream : "ALL",
        onlyMine: Boolean(parsed.onlyMine),
        hideCompleted: Boolean(parsed.hideCompleted),
        viewMode: parsed.viewMode === "timeline" ? "timeline" : "cards",
        heroMode: parsed.heroMode === "mine" ? "mine" : "written",
        search: ""
      };
    } catch (e) {
      return base;
    }
  }

  function saveSpmCountdownPrefs(prefs) {
    try {
      if (typeof localStorage === "undefined" || !prefs) return;
      localStorage.setItem(SPM_COUNTDOWN_PREFS_KEY, JSON.stringify({
        selectedCodes: Array.isArray(prefs.selectedCodes) ? prefs.selectedCodes : [],
        stream: prefs.stream || "ALL",
        onlyMine: Boolean(prefs.onlyMine),
        hideCompleted: Boolean(prefs.hideCompleted),
        viewMode: prefs.viewMode === "timeline" ? "timeline" : "cards",
        heroMode: prefs.heroMode === "mine" ? "mine" : "written"
      }));
    } catch (e) {}
  }

  function evaluatePaperStatus(paper, nowOverrideMs) {
    const nowMs = getNowEpochMs(nowOverrideMs);
    const startMs = parseMytToEpochMs(paper.date, paper.start);
    const endDate = paper.endDate || paper.date;
    const endMs = parseMytToEpochMs(endDate, paper.end);
    const todayKey = getMytDateKey(nowMs);
    const tomorrowKey = getMytDateKey(nowMs + 86400000);

    let status = "upcoming";
    let statusLabel = "Akan Datang";
    if (nowMs >= endMs) {
      status = "completed";
      statusLabel = "Selesai";
    } else if (nowMs >= startMs) {
      status = "live";
      statusLabel = "Sedang Berlangsung";
    } else if (paper.date === todayKey) {
      status = "today";
      statusLabel = "Hari Ini";
    } else if (paper.date === tomorrowKey) {
      status = "imminent";
      statusLabel = "Esok";
    } else {
      const diffDays = (startMs - nowMs) / 86400000;
      if (diffDays <= 3) {
        status = "imminent";
        statusLabel = "Pecutan Akhir";
      } else if (diffDays <= 7) {
        status = "soon";
        statusLabel = "Minggu Ini";
      }
    }

    return Object.assign({}, paper, {
      startMs: startMs,
      endMs: endMs,
      status: status,
      statusLabel: statusLabel,
      countdownTargetDate: status === "live" ? endDate : paper.date,
      countdownTargetTime: status === "live" ? paper.end : paper.start,
      dateDisplay: formatMalayDateShort(paper.date, paper.endDate),
      timeDisplay: formatMalayTimeLabel(paper.start) + " – " + formatMalayTimeLabel(paper.end),
      hadirDisplay: formatMalayTimeLabel(paper.hadir)
    });
  }

  function getEvaluatedSubjects(prefs, nowOverrideMs) {
    const selectedSet = new Set((prefs && prefs.selectedCodes) || []);
    const out = (SPM_SCHEDULE.subjects || []).map(function (sub) {
      const papers = (sub.papers || []).map(function (p) {
        return evaluatePaperStatus(p, nowOverrideMs);
      }).sort(function (a, b) { return a.startMs - b.startMs; });

      const completedCount = papers.filter(function (p) { return p.status === "completed"; }).length;
      const nextPaper = papers.find(function (p) { return p.status !== "completed"; }) || null;
      const refPaper = nextPaper || papers[papers.length - 1];
      const allCompleted = completedCount === papers.length;

      return {
        code: sub.code,
        name: sub.name,
        stream: sub.stream,
        streamLabel: STREAM_LABELS[sub.stream] || sub.stream,
        etutorSubject: sub.etutorSubject || "",
        selected: selectedSet.has(sub.code),
        papers: papers,
        nextPaper: nextPaper,
        completedCount: completedCount,
        totalCount: papers.length,
        allCompleted: allCompleted,
        urgency: allCompleted ? "completed" : (nextPaper ? nextPaper.status : "upcoming"),
        sortKey: allCompleted ? (9e15 + (refPaper ? refPaper.endMs : 0)) : (nextPaper ? nextPaper.startMs : 9e15)
      };
    });

    out.sort(function (a, b) {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return a.name.localeCompare(b.name, "ms");
    });
    return out;
  }

  function getHeroCountdownSummary(prefs, nowOverrideMs) {
    const nowMs = getNowEpochMs(nowOverrideMs);
    const subjects = getEvaluatedSubjects(prefs, nowMs);
    const meta = SPM_SCHEDULE.meta || {};
    const written = meta.writtenStart || { date: "2026-11-23", start: "09:00", hadir: "08:30", label: "Peperiksaan Bertulis SPM 2026" };
    const writtenStartMs = parseMytToEpochMs(written.date, written.start);
    const writtenEndMs = parseMytToEpochMs((meta.writtenEnd && meta.writtenEnd.date) || "2026-12-17", (meta.writtenEnd && meta.writtenEnd.end) || "17:00");

    const allPapers = [];
    subjects.forEach(function (sub) {
      sub.papers.forEach(function (p) {
        allPapers.push(Object.assign({ subjectCode: sub.code, subjectName: sub.name, selected: sub.selected, etutorSubject: sub.etutorSubject }, p));
      });
    });
    allPapers.sort(function (a, b) { return a.startMs - b.startMs; });

    const myNextPaper = allPapers.find(function (p) { return p.selected && p.status !== "completed"; }) || null;
    const anyNextPaper = allPapers.find(function (p) { return p.status !== "completed"; }) || null;
    const useMine = prefs && prefs.heroMode === "mine" && Boolean(myNextPaper);

    let heroTarget = { date: written.date, time: written.start, title: written.label, subtitle: "Kertas Pertama: 1103/4 Bahasa Melayu (Ujian Mendengar) • Lapor diri 8:30 pg", statusLabel: "Menjelang Peperiksaan Bertulis", finishedAll: false };
    if (useMine) {
      heroTarget = { date: myNextPaper.countdownTargetDate, time: myNextPaper.countdownTargetTime, title: myNextPaper.subjectName + " — " + myNextPaper.title + " (" + myNextPaper.code + ")", subtitle: myNextPaper.dateDisplay + " • Hadir " + myNextPaper.hadirDisplay + " • Masa " + myNextPaper.timeDisplay, statusLabel: myNextPaper.status === "live" ? "Sedang Berlangsung" : "Kertas Pilihan Saya Seterusnya", finishedAll: false };
    } else if (nowMs >= writtenEndMs) {
      heroTarget = { date: written.date, time: written.start, title: "Peperiksaan SPM 2026 Tamat Sepenuhnya", subtitle: "Tahniah kepada semua calon SPM 2026 atas usaha gigih anda!", statusLabel: "Tamat", finishedAll: true };
    } else if (nowMs >= writtenStartMs && anyNextPaper) {
      heroTarget = { date: anyNextPaper.countdownTargetDate, time: anyNextPaper.countdownTargetTime, title: anyNextPaper.subjectName + " — " + anyNextPaper.title + " (" + anyNextPaper.code + ")", subtitle: anyNextPaper.dateDisplay + " • Hadir " + anyNextPaper.hadirDisplay + " • Masa " + anyNextPaper.timeDisplay, statusLabel: anyNextPaper.status === "live" ? "Peperiksaan Sedang Berlangsung" : "Kertas Bertulis Seterusnya", finishedAll: false };
    }

    const phases = (meta.phases || []).map(function (ph) {
      const sMs = parseMytToEpochMs(ph.startDate, ph.startTime);
      const eMs = parseMytToEpochMs(ph.endDate, ph.endTime);
      return Object.assign({}, ph, { state: nowMs >= eMs ? "completed" : (nowMs >= sMs ? "active" : "upcoming") });
    });

    const donePapers = allPapers.filter(function (p) { return p.status === "completed"; }).length;
    return {
      heroTarget: heroTarget,
      heroParts: computeCountdownParts(heroTarget.date, heroTarget.time, nowOverrideMs),
      writtenParts: computeCountdownParts(written.date, written.start, nowOverrideMs),
      myNextPaper: myNextPaper,
      phases: phases,
      subjects: subjects,
      allPapers: allPapers,
      selectedCount: subjects.filter(function (s) { return s.selected; }).length,
      completedPapers: donePapers,
      totalPapers: allPapers.length
    };
  }

  // --- [features/spm-countdown/spmCountdownView.js] ---
  /**
   * src/features/spm-countdown/spmCountdownView.js
   * Pemapar UI Countdown Rasmi SPM 2026 & Peneroka Semua Subjek (Laman Utama & Portal Pelajar).
   * Mematuhi ui-ux-pro-max (sifar emoji, >=44px touch targets, @container cards) & WCAG AA.
   */




  function pad2(n) {
    return String(Math.max(0, Number(n) || 0)).padStart(2, "0");
  }

  function renderStatusBadge(status, label) {
    let icon = ICONS.clock;
    if (status === "completed") icon = ICONS.checkCircle;
    else if (status === "live" || status === "today" || status === "imminent") icon = ICONS.flame;
    else if (status === "soon") icon = ICONS.sparkles;
    return '<span class="spm-status-pill is-' + escapeHtml(status) + '">' + icon + "<span>" + escapeHtml(label) + "</span></span>";
  }

  function renderDigitTiles(dateStr, timeStr, parts, sizeClass) {
    const srText = parts.sign <= 0 ? "Tiba masa peperiksaan" : ("Baki " + parts.humanLabel);
    return [
      '<div class="spm-cd-digits ' + (sizeClass || "") + '" data-cd-digits="1" data-cd-date="' + escapeHtml(dateStr) + '" data-cd-time="' + escapeHtml(timeStr) + '" data-cd-active="' + (parts.sign > 0 ? "1" : "0") + '">',
      '  <span class="sr-only" data-cd-sr>' + escapeHtml(srText) + "</span>",
      '  <div class="spm-digit-box" aria-hidden="true"><strong class="cd-v-d tabular-nums">' + pad2(parts.days) + '</strong><span>Hari</span></div>',
      '  <div class="spm-digit-box" aria-hidden="true"><strong class="cd-v-h tabular-nums">' + pad2(parts.hours) + '</strong><span>Jam</span></div>',
      '  <div class="spm-digit-box" aria-hidden="true"><strong class="cd-v-m tabular-nums">' + pad2(parts.minutes) + '</strong><span>Minit</span></div>',
      '  <div class="spm-digit-box is-sec" aria-hidden="true"><strong class="cd-v-s tabular-nums">' + pad2(parts.seconds) + '</strong><span>Saat</span></div>',
      "</div>"
    ].join("");
  }

  function renderModeSwitchButtons(prefs, hasMine) {
    const isMine = prefs.heroMode === "mine" && hasMine;
    return [
      '<div class="spm-hero-switch" role="group" aria-label="Sasaran kira detik utama">',
      '  <button type="button" class="spm-switch-btn js-spm-hero-mode" data-hero-mode="written" aria-pressed="' + (!isMine ? "true" : "false") + '">Peperiksaan Bertulis (23 Nov)</button>',
      '  <button type="button" class="spm-switch-btn js-spm-hero-mode" data-hero-mode="mine" aria-pressed="' + (isMine ? "true" : "false") + '"' + (hasMine ? "" : " disabled") + ">Subjek Saya Seterusnya</button>",
      "</div>"
    ].join("");
  }

  function renderSpmHeroWidgets(prefs, summary) {
    const target = summary.heroTarget;
    const parts = summary.heroParts;
    const hasMine = Boolean(summary.myNextPaper);

    const lpHero = document.getElementById("lpSpmHeroCard");
    if (lpHero) {
      const phasesHtml = (summary.phases || []).map(function (ph) {
        const icon = ph.state === "completed" ? ICONS.checkCircle : (ph.state === "active" ? ICONS.flame : ICONS.calendar);
        const stTxt = ph.state === "completed" ? "Selesai" : (ph.state === "active" ? "Sedang Berjalan" : "Akan Datang");
        return [
          '<div class="spm-phase-chip is-' + escapeHtml(ph.state) + '">',
          "  " + icon,
          '  <div class="spm-phase-copy"><strong>' + escapeHtml(ph.label) + '</strong><span>' + escapeHtml(ph.shortDate) + " • " + escapeHtml(stTxt) + "</span></div>",
          "</div>"
        ].join("");
      }).join("");

      lpHero.innerHTML = [
        '<div class="spm-hero-top">',
        '  <div class="spm-hero-eyebrow"><span class="spm-live-dot" aria-hidden="true"></span><span>' + escapeHtml(target.statusLabel) + " • " + escapeHtml(SPM_SCHEDULE.meta.docRef) + "</span></div>",
        renderModeSwitchButtons(prefs, hasMine),
        "</div>",
        '<div class="spm-hero-main">',
        '  <div class="spm-hero-copy">',
        '    <h3 class="spm-hero-target-title">' + escapeHtml(target.title) + "</h3>",
        '    <p class="spm-hero-target-sub">' + escapeHtml(target.subtitle) + "</p>",
        '    <div class="spm-hero-meta-row">',
        '      <span class="spm-hero-stat tabular-nums">' + ICONS.checkCircle + " <span>" + summary.completedPapers + "/" + summary.totalPapers + " kertas fasa semasa</span></span>",
        '      <span class="spm-hero-stat tabular-nums">' + ICONS.starSolid + " <span>" + summary.selectedCount + " subjek saya ditanda</span></span>",
        "    </div>",
        "  </div>",
        '  <div class="spm-hero-timer-col">',
        renderDigitTiles(target.date, target.time, parts, "is-hero"),
        '    <div class="spm-hero-cta-row">',
        '      <a href="#portal" class="btn btn-continue-white btn-sm js-open-portal-countdown">' + ICONS.play + "<span>Buka di Portal</span></a>",
        "    </div>",
        "  </div>",
        "</div>",
        '<div class="spm-phases-strip" aria-label="Fasa Peperiksaan SPM 2026">' + phasesHtml + "</div>"
      ].join("\n");
    }

    const ptHero = document.getElementById("portalSpmCountdownHero");
    if (ptHero) {
      const practiceTarget = (prefs.heroMode === "mine" && summary.myNextPaper && summary.myNextPaper.etutorSubject)
        ? summary.myNextPaper.etutorSubject
        : ((summary.myNextPaper && summary.myNextPaper.etutorSubject) || "Bahasa Melayu");
      ptHero.innerHTML = [
        '<div class="spm-portal-hero-left">',
        '  <div class="spm-portal-hero-top">',
        '    <span class="spm-portal-badge"><span class="spm-live-dot" aria-hidden="true"></span> ' + escapeHtml(target.statusLabel) + "</span>",
        renderModeSwitchButtons(prefs, hasMine),
        "  </div>",
        '  <h2 id="portalSpmHeroTitle" class="spm-portal-hero-title">' + escapeHtml(target.title) + "</h2>",
        '  <p class="spm-portal-hero-sub">' + escapeHtml(target.subtitle) + "</p>",
        "</div>",
        '<div class="spm-portal-hero-right">',
        renderDigitTiles(target.date, target.time, parts, "is-portal"),
        '  <div class="spm-portal-hero-actions">',
        '    <button type="button" class="btn btn-continue-white btn-sm js-open-portal-countdown">' + ICONS.calendar + "<span>Semua Subjek &amp; Jadual</span></button>",
        '    <button type="button" class="btn btn-emerald btn-sm js-practice-spm-subject" data-etutor-subject="' + escapeHtml(practiceTarget) + '">' + ICONS.play + "<span>Latih " + escapeHtml(practiceTarget) + "</span></button>",
        "  </div>",
        "</div>"
      ].join("\n");
    }

    const pill = document.getElementById("countdownSummaryPill");
    if (pill) {
      pill.textContent = parts.sign <= 0
        ? "Sedang Berlangsung"
        : (parts.days > 0 ? (parts.days + " hari lagi • 23 Nov") : (parts.hours + "j " + parts.minutes + "m lagi"));
    }
  }

  function filterSubjects(subjects, prefs) {
    const q = String(prefs.search || "").trim().toLowerCase();
    return subjects.filter(function (sub) {
      if (prefs.onlyMine && !sub.selected) return false;
      if (prefs.hideCompleted && sub.allCompleted) return false;
      if (prefs.stream !== "ALL" && sub.stream !== prefs.stream) return false;
      if (q) {
        const paperStr = sub.papers.map(function (p) { return p.code + " " + p.title + " " + p.dateDisplay; }).join(" ");
        const hay = (sub.code + " " + sub.name + " " + sub.streamLabel + " " + paperStr).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function renderSubjectCard(sub) {
    const np = sub.nextPaper;
    const cdHtml = np
      ? '<div class="spm-card-countdown"><div class="spm-card-next-head">' + renderStatusBadge(np.status, np.statusLabel) + '<span class="spm-card-next-name">' + escapeHtml(np.code + " • " + np.title) + "</span></div>" + renderDigitTiles(np.countdownTargetDate, np.countdownTargetTime, computeCountdownParts(np.countdownTargetDate, np.countdownTargetTime), "is-card") + "</div>"
      : '<div class="spm-card-countdown is-done">' + renderStatusBadge("completed", "Semua Kertas Selesai") + '<p class="spm-card-done-note">Semua ' + sub.totalCount + " kertas peperiksaan subjek ini telah tamat.</p></div>";

    const papersHtml = sub.papers.map(function (p) {
      return [
        '<li class="spm-paper-row is-' + escapeHtml(p.status) + '">',
        '  <div class="spm-paper-main"><strong class="tabular-nums">' + escapeHtml(p.code) + "</strong><span>" + escapeHtml(p.title) + "</span></div>",
        '  <div class="spm-paper-meta tabular-nums"><span>' + escapeHtml(p.dateDisplay) + "</span><span>Hadir " + escapeHtml(p.hadirDisplay) + " • " + escapeHtml(p.timeDisplay) + " (" + escapeHtml(p.duration) + ")</span></div>",
        "</li>"
      ].join("");
    }).join("");

    const practiceBtn = sub.etutorSubject
      ? '<button type="button" class="btn btn-primary btn-sm js-practice-spm-subject" data-etutor-subject="' + escapeHtml(sub.etutorSubject) + '">' + ICONS.play + "<span>Latih " + escapeHtml(sub.etutorSubject) + "</span></button>"
      : "";
    const footerHtml = practiceBtn
      ? ('  <footer class="spm-cd-card-foot">' + practiceBtn + "</footer>")
      : "";

    return [
      '<article class="spm-cd-card" data-urgency="' + escapeHtml(sub.urgency) + '" data-sub-code="' + escapeHtml(sub.code) + '">',
      '  <header class="spm-cd-card-head">',
      '    <div class="spm-cd-title-col">',
      '      <div class="spm-cd-code-row"><span class="badge-kssm-code tabular-nums">Kod ' + escapeHtml(sub.code) + '</span><span class="spm-stream-tag">' + escapeHtml(sub.streamLabel) + "</span></div>",
      '      <h4 class="spm-cd-subject-name">' + escapeHtml(sub.name) + "</h4>",
      "    </div>",
      '    <button type="button" class="spm-star-btn js-spm-toggle-sub" data-sub-code="' + escapeHtml(sub.code) + '" aria-pressed="' + (sub.selected ? "true" : "false") + '" aria-label="Tandakan ' + escapeHtml(sub.name) + ' dalam Subjek Saya">' + (sub.selected ? ICONS.starSolid : ICONS.starOutline) + "</button>",
      "  </header>",
      cdHtml,
      '  <ul class="spm-paper-list">' + papersHtml + "</ul>",
      footerHtml,
      "</article>"
    ].filter(Boolean).join("\n");
  }

  function renderTimelineView(filteredSubjects) {
    const byDate = {};
    filteredSubjects.forEach(function (sub) {
      sub.papers.forEach(function (p) {
        if (!byDate[p.date]) byDate[p.date] = { date: p.date, dateDisplay: p.dateDisplay, items: [], notices: [] };
        byDate[p.date].items.push({ sub: sub, paper: p });
      });
    });
    (SPM_SCHEDULE.meta.notices || []).forEach(function (n) {
      if (!byDate[n.date]) byDate[n.date] = { date: n.date, dateDisplay: formatMalayDateShort(n.date), items: [], notices: [] };
      byDate[n.date].notices.push(n);
    });

    const days = Object.keys(byDate).sort().filter(function (dk) {
      return byDate[dk].items.length > 0 || byDate[dk].notices.some(function (n) { return n.type === "holiday"; });
    });
    if (days.length === 0) return "";

    return '<div class="spm-timeline-wrap">' + days.map(function (dk) {
      const grp = byDate[dk];
      grp.items.sort(function (a, b) { return a.paper.startMs - b.paper.startMs || a.paper.code.localeCompare(b.paper.code); });
      const noticesHtml = grp.notices.map(function (n) {
        return '<div class="spm-timeline-notice is-' + escapeHtml(n.type) + '">' + ICONS.alert + "<div><strong>" + escapeHtml(n.title) + ":</strong> " + escapeHtml(n.text) + "</div></div>";
      }).join("");
      const rowsHtml = grp.items.map(function (entry) {
        const sub = entry.sub;
        const p = entry.paper;
        const actBtn = sub.etutorSubject ? '<button type="button" class="btn btn-outline btn-sm js-practice-spm-subject" data-etutor-subject="' + escapeHtml(sub.etutorSubject) + '">' + ICONS.play + "<span>Latih</span></button>" : "";
        return [
          '<div class="spm-tl-row is-' + escapeHtml(p.status) + '">',
          '  <div class="spm-tl-time tabular-nums"><strong>' + escapeHtml(p.timeDisplay) + "</strong><span>Hadir " + escapeHtml(p.hadirDisplay) + " • " + escapeHtml(p.duration) + "</span></div>",
          '  <div class="spm-tl-sub"><span class="badge-kssm-code tabular-nums">' + escapeHtml(p.code) + "</span><strong>" + escapeHtml(sub.name) + "</strong><span class=\"spm-tl-paper\">" + escapeHtml(p.title) + "</span></div>",
          '  <div class="spm-tl-actions">' + renderStatusBadge(p.status, p.statusLabel) + actBtn + "</div>",
          "</div>"
        ].join("");
      }).join("");
      return '<section class="spm-tl-day"><header class="spm-tl-day-head"><h4>' + escapeHtml(grp.dateDisplay) + '</h4><span class="tabular-nums">' + grp.items.length + " kertas</span></header>" + noticesHtml + '<div class="spm-tl-rows">' + rowsHtml + "</div></section>";
    }).join("") + "</div>";
  }

  function renderSpmExplorerMount(prefix, prefs, summary) {
    const wrap = document.getElementById(prefix + "SpmExplorerWrap");
    const mount = document.getElementById(prefix + "SpmMountGrid");
    if (!wrap || !mount) return;

    wrap.querySelectorAll(".js-spm-stream-chip").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-stream") === prefs.stream ? "true" : "false"); });
    wrap.querySelectorAll(".js-spm-toggle-mine").forEach(function (b) { b.setAttribute("aria-pressed", prefs.onlyMine ? "true" : "false"); b.textContent = "Subjek Saya (" + summary.selectedCount + ")"; });
    wrap.querySelectorAll(".js-spm-toggle-hide-done").forEach(function (b) { b.setAttribute("aria-pressed", prefs.hideCompleted ? "true" : "false"); });
    wrap.querySelectorAll(".js-spm-view-mode").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-view-mode") === prefs.viewMode ? "true" : "false"); });

    const filtered = filterSubjects(summary.subjects, prefs);
    const countEl = document.getElementById(prefix + "SpmMatchCount");
    if (countEl) countEl.textContent = filtered.length + " daripada " + summary.subjects.length + " subjek SPM";

    if (filtered.length === 0) {
      mount.innerHTML = '<div class="bento-card" style="text-align:center;color:var(--text-muted);padding:32px">Tiada subjek SPM sepadan dengan penapis atau carian semasa. Cuba matikan tapis "Subjek Saya" atau kosongkan carian.</div>';
      return;
    }

    mount.innerHTML = prefs.viewMode === "timeline" ? renderTimelineView(filtered) : ('<div class="spm-cd-grid">' + filtered.map(renderSubjectCard).join("\n") + "</div>");
    if (window.ETutorMotion && typeof window.ETutorMotion.animateSpmCountdownCards === "function") {
      window.ETutorMotion.animateSpmCountdownCards("#" + prefix + "SpmMountGrid .spm-cd-card");
    }
  }

  function renderAllSpmCountdowns(prefs) {
    const summary = getHeroCountdownSummary(prefs);
    renderSpmHeroWidgets(prefs, summary);
    renderSpmExplorerMount("lp", prefs, summary);
    renderSpmExplorerMount("pt", prefs, summary);
    return summary;
  }

  function tickSpmCountdownDigitsOnly() {
    let needsFullRerender = false;
    document.querySelectorAll("[data-cd-digits][data-cd-date][data-cd-time]").forEach(function (box) {
      const parts = computeCountdownParts(box.getAttribute("data-cd-date"), box.getAttribute("data-cd-time"));
      if (box.getAttribute("data-cd-active") === "1" && parts.sign <= 0) needsFullRerender = true;
      const dEl = box.querySelector(".cd-v-d");
      const hEl = box.querySelector(".cd-v-h");
      const mEl = box.querySelector(".cd-v-m");
      const sEl = box.querySelector(".cd-v-s");
      if (dEl) dEl.textContent = pad2(parts.days);
      if (hEl) hEl.textContent = pad2(parts.hours);
      if (mEl) mEl.textContent = pad2(parts.minutes);
      if (sEl) sEl.textContent = pad2(parts.seconds);
    });
    return needsFullRerender;
  }

  // --- [features/spm-countdown/spmCountdownController.js] ---
  /**
   * src/features/spm-countdown/spmCountdownController.js
   * Pengawal acara Countdown Rasmi SPM 2026: penapis aliran, pratetap, Subjek Saya,
   * jambatan terus ke latihan portal & pengemas kini masa 1-saat.
   */









  let spmPrefs = loadSpmCountdownPrefs();
  let spmTickTimer = null;
  let spmBound = false;

  function announceSpmStatus(message) {
    const el = document.getElementById("spmCountdownLiveAnnouncer");
    if (el && message) el.textContent = message;
  }

  async function navigateToSubjectPractice(subjectName) {
    if (!subjectName) return;
    const authed = isPortalUserAuthenticated();
    if (!authed) {
      const paramKey = subjectName === "Pendidikan Syariah Islamiah" ? "subject" : "klonSubject";
      try {
        history.replaceState(null, "", window.location.pathname + "?" + paramKey + "=" + encodeURIComponent(subjectName) + "#login");
      } catch (e) {}
      portalState.deepLinkHandled = false;
      await syncRouteMode();
      window.scrollTo(0, 0);
      showToast("Log masuk untuk terus menjawab soalan " + subjectName + ".");
      return;
    }

    const dashEl = document.getElementById("dashboardView");
    if (!dashEl || dashEl.hidden) {
      window.location.hash = "#portal";
      await syncRouteMode();
    }

    const catalog = portalState.catalog || [];
    const hasKlon = catalog.some(function (c) {
      return c.category === "klon" && String(c.subject || "").toLowerCase() === subjectName.toLowerCase();
    });

    if (hasKlon) {
      portalState.klonSelectedGroup = "ALL";
      portalState.klonSelectedSubject = subjectName;
      document.querySelectorAll(".js-klon-group-chip").forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-klon-group") === "ALL" ? "true" : "false");
      });
      populateKlonSubjectChips();
      renderKlonCatalogSection();
      openPortalModuleDropdown("klon_spm");
      const target = document.getElementById("klonCatalogHeading");
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      showToast("Memaparkan Set Klon SPM: " + subjectName);
    } else {
      portalState.selectedSubject = subjectName;
      populateSubjectSelectors();
      renderCatalogSection();
      openPortalModuleDropdown("pra_spm");
      const target = document.getElementById("catalogHeading");
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      showToast("Memaparkan Set Percubaan SPM: " + subjectName);
    }
  }

  function syncSearchInputs(value) {
    ["lpSpmSearchInput", "ptSpmSearchInput"].forEach(function (id) {
      const inp = document.getElementById(id);
      if (inp && inp.value !== value) inp.value = value;
    });
  }

  function bindSpmCountdownEvents() {
    if (spmBound) return;
    spmBound = true;

    document.addEventListener("click", async function (e) {
      const streamBtn = e.target.closest(".js-spm-stream-chip");
      if (streamBtn) {
        spmPrefs.stream = streamBtn.getAttribute("data-stream") || "ALL";
        saveSpmCountdownPrefs(spmPrefs);
        const sum = renderAllSpmCountdowns(spmPrefs);
        announceSpmStatus("Menapis aliran " + streamBtn.textContent.trim() + ", " + sum.subjects.length + " subjek tersedia.");
        return;
      }

      const presetBtn = e.target.closest(".js-spm-preset-btn");
      if (presetBtn) {
        const key = presetBtn.getAttribute("data-preset") || "SAINS_TULEN";
        const list = (SPM_SCHEDULE.presets && SPM_SCHEDULE.presets[key]) || [];
        spmPrefs.selectedCodes = list.slice();
        spmPrefs.onlyMine = true;
        spmPrefs.stream = "ALL";
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        announceSpmStatus("Pratetap " + presetBtn.textContent.trim() + " digunakan (" + list.length + " subjek).");
        showToast("Subjek Saya dikemas kini: " + presetBtn.textContent.trim() + " (" + list.length + " subjek)");
        return;
      }

      const toggleSubBtn = e.target.closest(".js-spm-toggle-sub");
      if (toggleSubBtn) {
        const code = toggleSubBtn.getAttribute("data-sub-code");
        if (!code) return;
        const idx = spmPrefs.selectedCodes.indexOf(code);
        if (idx === -1) spmPrefs.selectedCodes.push(code);
        else spmPrefs.selectedCodes.splice(idx, 1);
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        announceSpmStatus(idx === -1 ? "Subjek ditambah ke senarai Subjek Saya." : "Subjek dikeluarkan daripada senarai Subjek Saya.");
        return;
      }

      if (e.target.closest(".js-spm-toggle-mine")) {
        spmPrefs.onlyMine = !spmPrefs.onlyMine;
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        announceSpmStatus(spmPrefs.onlyMine ? "Memaparkan Subjek Saya sahaja." : "Memaparkan semua subjek SPM.");
        return;
      }

      if (e.target.closest(".js-spm-toggle-hide-done")) {
        spmPrefs.hideCompleted = !spmPrefs.hideCompleted;
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        announceSpmStatus(spmPrefs.hideCompleted ? "Kertas selesai disembunyikan." : "Semua kertas dipaparkan.");
        return;
      }

      const viewBtn = e.target.closest(".js-spm-view-mode");
      if (viewBtn) {
        spmPrefs.viewMode = viewBtn.getAttribute("data-view-mode") === "timeline" ? "timeline" : "cards";
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        return;
      }

      const heroBtn = e.target.closest(".js-spm-hero-mode");
      if (heroBtn && !heroBtn.disabled) {
        spmPrefs.heroMode = heroBtn.getAttribute("data-hero-mode") === "mine" ? "mine" : "written";
        saveSpmCountdownPrefs(spmPrefs);
        renderAllSpmCountdowns(spmPrefs);
        return;
      }

      const pracBtn = e.target.closest(".js-practice-spm-subject");
      if (pracBtn) {
        const subName = pracBtn.getAttribute("data-etutor-subject");
        if (subName) await navigateToSubjectPractice(subName);
        return;
      }

      const openCdBtn = e.target.closest(".js-open-portal-countdown");
      if (openCdBtn) {
        e.preventDefault();
        const dashEl = document.getElementById("dashboardView");
        if (dashEl && !dashEl.hidden) {
          openPortalModuleDropdown("countdown_spm");
          const dd = document.getElementById("moduleDropdownCountdown");
          if (dd) setTimeout(function () { dd.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
        } else if (isPortalUserAuthenticated()) {
          portalState.pendingCountdownScroll = true;
          window.location.hash = "#portal";
          syncRouteMode();
        } else {
          const lpEx = document.getElementById("lpSpmExplorerWrap");
          if (lpEx) lpEx.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    document.addEventListener("input", function (e) {
      if (e.target && (e.target.id === "lpSpmSearchInput" || e.target.id === "ptSpmSearchInput")) {
        spmPrefs.search = e.target.value || "";
        syncSearchInputs(spmPrefs.search);
        renderAllSpmCountdowns(spmPrefs);
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && tickSpmCountdownDigitsOnly()) {
        renderAllSpmCountdowns(spmPrefs);
      }
    });
  }

  function initSpmCountdown() {
    spmPrefs = loadSpmCountdownPrefs();
    renderAllSpmCountdowns(spmPrefs);
    bindSpmCountdownEvents();

    if (!spmTickTimer) {
      spmTickTimer = setInterval(function () {
        if (document.hidden) return;
        if (tickSpmCountdownDigitsOnly()) {
          renderAllSpmCountdowns(spmPrefs);
        }
      }, 1000);
    }
  }

  // --- [features/admin/adminApiService.js] ---
  /**
   * src/features/admin/adminApiService.js
   * Penghala komunikasi Admin: /api untuk pratonton tempatan dan Edge Function Supabase /v1/admin untuk produksi.
   */


  function resolveAdminEndpoint() {
    if (typeof window === "undefined") return "";
    const hostName = (window.location && window.location.hostname) ? window.location.hostname : "";
    if (/^(localhost|127\.0\.0\.1)$/i.test(hostName)) {
      return "/api";
    }
    const cfg = window.ETUTOR_CONFIG || {};
    const edgeBase = String(cfg.CIKGU_SUPABASE_EDGE_URL || "").trim().replace(/\/+$/, "");
    if (edgeBase) {
      return edgeBase + "/v1/admin";
    }
    const supaUrl = String(cfg.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    if (supaUrl && isSupabaseConfigured()) {
      return supaUrl + "/functions/v1/cikgu-semak/v1/admin";
    }
    return "";
  }

  async function callAdminBackend(action, payload) {
    const endpoint = resolveAdminEndpoint();
    if (!endpoint) {
      return callBackend(action, payload);
    }
    const reqBody = Object.assign({}, payload || {}, { action: action });
    const headers = { "Content-Type": "application/json" };
    if (endpoint !== "/api") {
      const cfg = window.ETUTOR_CONFIG || {};
      const anonKey = String(cfg.SUPABASE_ANON_KEY || "").trim();
      if (anonKey) {
        headers.apikey = anonKey;
        headers.Authorization = "Bearer " + anonKey;
      }
    }
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reqBody)
    });
    let data = null;
    try {
      data = await resp.json();
    } catch (e) {
      data = null;
    }
    if (!resp.ok) {
      throw new Error((data && data.error) || ("Ralat pelayan Admin (HTTP " + resp.status + ")"));
    }
    return data;
  }

  // --- [features/admin/adminSubjectPicker.js] ---
  /**
   * src/features/admin/adminSubjectPicker.js
   * Pemilih pelbagai subjek KSSM (accessible fieldset + preset pakej) untuk Panel Kawalan Admin.
   */
  const ADMIN_PRESET_SUBJECTS = {
    "TERAS": [
      "Bahasa Melayu",
      "Bahasa Inggeris",
      "Sejarah",
      "Matematik",
      "Sains",
      "Pendidikan Islam",
      "Pendidikan Moral"
    ],
    "SAINS_TULEN": [
      "Biologi",
      "Fizik",
      "Kimia",
      "Matematik Tambahan"
    ],
    "IKHTISAS": [
      "Prinsip Perakaunan",
      "Perniagaan",
      "Ekonomi",
      "Sains Komputer",
      "Geografi",
      "Tasawwur Islam"
    ]
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

  // --- [features/admin/adminAiAuditView.js] ---
  /**
   * src/features/admin/adminAiAuditView.js
   * Paparan Audit Kualiti Semakan AI, Jawapan Pelajar, Ulasan & Prestasi Failover di Panel Admin.
   */


  function renderAdminAiAuditTable() {
    const summaryEl = document.getElementById("admAiQualitySummary");
    const tbody = document.getElementById("adminAiAuditTableBody");
    if (!portalState.adminData) return;

    const q = portalState.adminData.aiQuality || {};
    if (summaryEl) {
      const checks = Number(q.checksToday) || 0;
      const avgSec = ((Number(q.avgLatencyMsToday) || 0) / 1000).toFixed(1);
      const failovers = Number(q.failoversToday) || 0;
      summaryEl.textContent =
        "Hari ini: " + checks + " semakan • Purata " + avgSec + "s • Failover: " + failovers;
    }

    if (!tbody) return;
    const rows = Array.isArray(portalState.adminData.recentAiAudits) ? portalState.adminData.recentAiAudits : [];
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">Belum ada log audit semakan AI direkodkan.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.slice(0, 40).map(function (r) {
      const secStr = ((Number(r.latencyMs) || 0) / 1000).toFixed(1) + "s";
      const usedFo = Boolean(r.usedFailover);
      const badgeCls = usedFo ? "badge-progress" : "badge-done";
      const provText = String(r.provider || "-");
      const markStr = (r.awardedMarks !== null && r.awardedMarks !== undefined && r.awardedMarks !== "")
        ? (escapeHtml(String(r.awardedMarks)) + " / " + escapeHtml(String(r.maxMarks || 0)) + "m")
        : "Bimbingan";
      const studentLabel = r.studentName || "Tetamu";
      const subMeta = [r.subId || "", r.hasImage ? "Gambar" : ""].filter(Boolean).join(" • ");
      const previewFeed = String(r.aiFeedback || "").replace(/\s+/g, " ").trim().slice(0, 95);
      const ansText = String(r.studentAnswer || "").trim() || "(Tiada teks jawapan)";
      const qText = String(r.questionExcerpt || "").trim() || "-";
      const feedText = String(r.aiFeedback || "").trim() || "-";

      return (
        "<tr>" +
          '<td><div class="tabular-nums" style="font-size:0.78rem">' + escapeHtml(r.timestamp || "-") + '</div>' +
          '<div style="font-weight:700;font-size:0.82rem">' + escapeHtml(studentLabel) + "</div>" +
          (r.studentEmail ? '<div style="font-size:0.74rem;color:var(--text-muted)">' + escapeHtml(r.studentEmail) + "</div>" : "") + "</td>" +
          '<td style="font-size:0.8rem"><div style="font-weight:600">' + escapeHtml(r.subject || "SPM") + '</div>' +
          '<div style="font-size:0.74rem;color:var(--text-muted)">' + escapeHtml(r.mode || "auto") + (subMeta ? " &bull; " + escapeHtml(subMeta) : "") + "</div></td>" +
          '<td class="tabular-nums"><span class="status-badge ' + badgeCls + '">' + escapeHtml(provText) + "</span>" +
          '<div style="font-size:0.74rem;color:var(--text-muted);margin-top:4px">' + escapeHtml(secStr) +
          (usedFo && r.failoverReason ? " &bull; " + escapeHtml(r.failoverReason) : "") + "</div></td>" +
          '<td class="tabular-nums" style="font-weight:700;font-size:0.84rem">' + markStr +
          '<div style="font-size:0.72rem;color:var(--text-muted);font-weight:400">-' + (Number(r.tokenCost) || 0) + " tok (" + escapeHtml(r.bucket || "free") + ")</div></td>" +
          '<td style="font-size:0.8rem;min-inline-size:260px;max-inline-size:420px">' +
            "<details>" +
              '<summary style="cursor:pointer;font-weight:600"><span>' + escapeHtml(previewFeed || "Lihat butiran jawapan & ulasan") + "</span></summary>" +
              '<div style="margin-top:8px;padding:8px 10px;border-radius:8px;background:var(--surface-alt,#f8fafc);white-space:pre-wrap;font-size:0.78rem;line-height:1.45">' +
                "<div><strong>Soalan:</strong> " + escapeHtml(qText) + "</div>" +
                '<div style="margin-top:6px"><strong>Jawapan Pelajar:</strong> ' + escapeHtml(ansText) + "</div>" +
                '<div style="margin-top:6px"><strong>Ulasan Cikgu AI:</strong> ' + escapeHtml(feedText) + "</div>" +
              "</div>" +
            "</details>" +
          "</td>" +
        "</tr>"
      );
    }).join("");
  }

  // --- [features/admin/adminTablesView.js] ---
  /**
   * src/features/admin/adminTablesView.js
   * Paparan statistik ekosistem, kutipan RM, bajet AI, dompet token pelajar, peti aduan, eksport CSV & log Admin.
   */





  function toMalaysianWhatsAppNumber(rawId) {
    let digits = String(rawId || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.indexOf("0") === 0) digits = "6" + digits;
    else if (digits.indexOf("1") === 0) digits = "60" + digits;
    return (digits.indexOf("601") === 0 && digits.length >= 10 && digits.length <= 12) ? digits : "";
  }

  function buildCustomerActivationWaText(btnOrStudent) {
    const name = btnOrStudent && btnOrStudent.getAttribute
      ? (btnOrStudent.getAttribute("data-name") || "Pelajar")
      : ((btnOrStudent && (btnOrStudent.displayName || btnOrStudent.fullName)) || "Pelajar");
    const email = btnOrStudent && btnOrStudent.getAttribute
      ? (btnOrStudent.getAttribute("data-email") || "")
      : ((btnOrStudent && btnOrStudent.email) || "");
    const portalUrl = (portalState.adminData && portalState.adminData.portalUrl) || "https://etutor.my/#portal";
    return [
      "Assalamualaikum & Salam Sejahtera " + name + ",",
      "",
      "Makluman akaun eTutor.my anda:",
      "ID / E-mel: " + email,
      "Pautan Portal: " + portalUrl,
      "",
      "Jika ada sebarang pertanyaan, hubungi Admin: 013-732 7696.",
      "Terima kasih!"
    ].join("\n");
  }

  function applyAdminBundle(data) {
    portalState.adminData = data;
    if (typeof data.openAccessMode === "boolean") portalState.openAccessMode = data.openAccessMode;

    const modeBadge = document.getElementById("admPortalModeBadge");
    const modeDesc = document.getElementById("admPortalModeDesc");
    const modeToggleBtn = document.getElementById("admToggleOpenModeBtn");
    if (modeBadge && modeDesc && modeToggleBtn) {
      if (data.openAccessMode) {
        modeBadge.textContent = "MOD TERBUKA AKTIF";
        modeBadge.className = "status-badge badge-done";
        modeDesc.textContent = "Semua pelajar boleh terus meneroka katalog dan mencuba soalan tanpa sekatan akaun wajib.";
        modeToggleBtn.textContent = "Tukar ke Mod Token & Akaun Wajib";
        modeToggleBtn.className = "btn btn-outline";
      } else {
        modeBadge.textContent = "MOD AKAUN & TOKEN AI AKTIF";
        modeBadge.className = "status-badge badge-progress";
        modeDesc.textContent = "Pelajar log masuk melalui Google / E-mel OTP dan menggunakan kuota asas serta Token Top-up Kekal.";
        modeToggleBtn.textContent = "Aktifkan Mod Terbuka (Tanpa Sekatan)";
        modeToggleBtn.className = "btn btn-primary";
      }
    }

    const stats = data.stats || {};
    const studentsList = Array.isArray(data.students) ? data.students : [];
    const totalTopup = Number.isFinite(Number(stats.totalTopupTokens))
      ? Number(stats.totalTopupTokens)
      : studentsList.reduce(function (sum, s) { return sum + (Number(s.paidBalance) || 0); }, 0);

    const setText = function (id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setText("admTotalUsers", String(stats.totalUsers != null ? stats.totalUsers : studentsList.length));
    setText("admActiveUsers", String(stats.activeUsers || 0));
    setText("admTotalTopupTokens", String(totalTopup));
    setText("admMonthRevenueVal", "RM " + (Number(stats.estRevenueMonthMyr) || 0));
    setText("admTodayPlansSub", "Hari ini: " + (Number(stats.plansTodayCount) || 0) + " pelan (RM " + (Number(stats.estRevenueTodayMyr) || 0) + ")");
    setText("admOpenIssuesCount", String(stats.openIssuesCount || 0));
    setText("admTotalScores", String(stats.totalScoreSubmissions || 0));

    const budget = data.aiBudget || {};
    const spentMyr = Number(budget.spentMyr) || 0;
    const capMyr = Number(budget.hardCapMyr) || 2;
    setText("admAiBudgetVal", "RM " + spentMyr.toFixed(2) + " / " + capMyr.toFixed(2));
    setText("admVisionUsedSub", "Snap & Check: " + (Number(budget.freeVisionUsed) || 0) + " / " + (Number(budget.freeVisionCap) || 100));
    const capInp = document.getElementById("admBudgetCapInput");
    const visInp = document.getElementById("admVisionCapInput");
    if (capInp && document.activeElement !== capInp) capInp.value = capMyr.toFixed(2);
    if (visInp && document.activeElement !== visInp) visInp.value = String(budget.freeVisionCap != null ? budget.freeVisionCap : 100);

    const pg = data.paymentGateway || {};
    const payEn = document.getElementById("admPayEnabledInput");
    const paySb = document.getElementById("admPaySandboxInput");
    const payCat = document.getElementById("admPayCategoryInput");
    const paySec = document.getElementById("admPaySecretInput");
    const payBadge = document.getElementById("admPayStatusBadge");
    if (payEn) payEn.checked = Boolean(pg.enabled);
    if (paySb) paySb.checked = Boolean(pg.sandbox);
    if (payCat && document.activeElement !== payCat) payCat.value = String(pg.categoryCode || "");
    if (paySec && pg.hasSecretKey) paySec.placeholder = "Secret Key tersimpan (isi jika mahu tukar)";
    if (payBadge) {
      const ready = Boolean(pg.enabled && pg.categoryCode && pg.hasSecretKey);
      payBadge.textContent = ready ? (pg.sandbox ? "SANDBOX AKTIF" : "PRODUKSI AKTIF") : "BELUM DIKONFIGURASI";
      payBadge.className = "status-badge " + (ready ? "badge-done" : "badge-progress");
    }

    renderAdminUsersTable();
    renderAdminPaymentsTable();
    renderAdminAiAuditTable();
    renderAdminIssuesTable();
    renderAdminLogsTable();
    if (typeof renderAdminRecentVouchers === "function") renderAdminRecentVouchers(data.recentVouchers || []);
  }

  function renderAdminPaymentsTable() {
    const tbody = document.getElementById("adminPaymentsTableBody");
    if (!tbody || !portalState.adminData) return;
    const rows = Array.isArray(portalState.adminData.recentPayments) ? portalState.adminData.recentPayments : [];
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">Belum ada transaksi ToyyibPay direkodkan.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.slice(0, 25).map(function (p) {
      const st = String(p.status || "PENDING").toUpperCase();
      const cls = st === "PAID" ? "badge-done" : (st === "FAILED" ? "badge-progress" : "badge-subject");
      return (
        "<tr>" +
          '<td><div class="tabular-nums" style="font-size:0.78rem">' + escapeHtml(p.paidAt || p.createdAt || "-") + '</div><div class="tabular-nums" style="font-size:0.74rem;color:var(--text-muted)">' + escapeHtml(p.orderRef || "-") + "</div></td>" +
          '<td style="font-size:0.8rem"><div>' + escapeHtml(p.buyerName || "Pelajar") + '</div><div style="color:var(--text-muted)">' + escapeHtml(p.buyerEmail || "-") + "</div></td>" +
          '<td class="tabular-nums"><div style="font-weight:700">' + escapeHtml(p.packCode || "-") + ' (+' + (Number(p.tokensAmount) || 0) + ')</div><div style="font-size:0.76rem;color:var(--text-muted)">RM ' + escapeHtml(String(p.amountMyr || 0)) + "</div></td>" +
          '<td class="tabular-nums" style="font-size:0.78rem"><div>' + escapeHtml(p.billCode || "-") + '</div><div style="color:var(--text-muted)">' + escapeHtml(p.gatewayTxId || "-") + "</div></td>" +
          '<td><span class="status-badge ' + cls + '">' + escapeHtml(st) + "</span></td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderAdminUsersTable() {
    const tbody = document.getElementById("adminUsersTableBody");
    if (!tbody || !portalState.adminData) return;

    const query = (document.getElementById("adminSearchInput")?.value || "").trim().toLowerCase();
    const statusFilter = document.getElementById("adminStatusFilter")?.value || "ALL";
    const source = Array.isArray(portalState.adminData.students) ? portalState.adminData.students : [];

    const filtered = source.filter(function (s) {
      const st = String(s.status || "AKTIF").toUpperCase();
      const paid = Number(s.paidBalance) || 0;
      if (statusFilter === "TOPUP" && paid <= 0) return false;
      if (statusFilter === "AKTIF" && st === "SEKAT") return false;
      if (statusFilter === "SEKAT" && st !== "SEKAT") return false;
      if (!query) return true;
      const displayName = s.displayName || s.fullName || "";
      const uid = s.userId || s.id || "";
      return String(displayName).toLowerCase().includes(query) || String(s.email || "").toLowerCase().includes(query) ||
        String(s.referralCode || "").toLowerCase().includes(query) || String(uid).toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">Tiada akaun pelajar sepadan dengan carian atau penapis.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function (s) {
      const isBlocked = String(s.status || "AKTIF").toUpperCase() === "SEKAT";
      const statusBadge = '<span class="status-badge ' + (isBlocked ? "badge-progress" : "badge-done") + '">' + (isBlocked ? "DISEKAT" : "AKTIF") + "</span>";
      const safeId = escapeHtml(s.userId || s.id || "");
      const safeName = escapeHtml(s.displayName || s.fullName || "Pelajar");
      const safeEmail = escapeHtml(s.email || "-");
      const identAttr = escapeHtml(s.email || s.userId || s.id || "");
      return (
        "<tr>" +
          '<td><div style="font-weight:700;color:var(--text-primary)">' + safeName + "</div>" +
          '<div style="font-size:0.78rem;color:var(--text-muted)">' + safeEmail + '<span class="adm-provider-tag">' + escapeHtml(String(s.authProvider || "google").toUpperCase()) + "</span></div></td>" +
          '<td class="tabular-nums"><div style="font-weight:700;color:var(--brand-primary)">' + (Number(s.paidBalance) || 0) + ' Token Kekal</div>' +
          '<div style="font-size:0.76rem;color:var(--text-muted)">Asas: ' + (s.freeMonthlyRemaining != null ? s.freeMonthlyRemaining : 30) + "/30 bln &bull; " + (s.freeDailyRemaining != null ? s.freeDailyRemaining : 5) + "/5 hari</div></td>" +
          '<td class="tabular-nums"><div style="font-weight:600">' + escapeHtml(s.referralCode || "-") + '</div><div style="font-size:0.76rem;color:var(--text-muted)">Set: ' + (Number(s.completedSets) || 0) + " &bull; Rujuk: " + (Number(s.monthlyReferralsCount) || 0) + "/20</div></td>" +
          "<td>" + statusBadge + '<div style="font-size:0.74rem;color:var(--text-muted);margin-top:4px">' + escapeHtml(s.lastAccess || "Akaun Supabase") + "</div></td>" +
          '<td><div class="admin-row-actions">' +
            '<button type="button" class="btn btn-outline btn-xs js-adm-pick-student" data-ident="' + identAttr + '" data-name="' + safeName + '">Pilih</button>' +
            '<button type="button" class="btn btn-outline btn-xs js-adm-topup" data-uid="' + safeId + '" data-delta="45" data-name="' + safeName + '">+45</button>' +
            '<button type="button" class="btn btn-outline btn-xs js-adm-topup" data-uid="' + safeId + '" data-delta="160" data-name="' + safeName + '">+160</button>' +
            '<button type="button" class="btn btn-outline btn-xs js-adm-topup" data-uid="' + safeId + '" data-delta="500" data-name="' + safeName + '">+500</button>' +
            '<button type="button" class="btn btn-outline btn-xs js-adm-wa-student" data-ident="' + identAttr + '" data-email="' + safeEmail + '" data-name="' + safeName + '">WA</button>' +
            '<button type="button" class="btn ' + (isBlocked ? "btn-primary" : "btn-ghost") + ' btn-xs js-adm-toggle-student" data-uid="' + safeId + '">' + (isBlocked ? "Aktifkan" : "Sekat") + "</button>" +
          "</div></td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderAdminIssuesTable() {
    const tbody = document.getElementById("adminIssuesTableBody");
    if (!tbody || !portalState.adminData) return;
    const issues = Array.isArray(portalState.adminData.recentIssues) ? portalState.adminData.recentIssues : [];
    if (issues.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">Tiada aduan atau laporan isu pelajar buat masa ini.</td></tr>';
      return;
    }
    tbody.innerHTML = issues.map(function (it) {
      const isDone = String(it.status || "BARU").toUpperCase() === "SELESAI";
      return (
        "<tr>" +
          '<td><div class="tabular-nums" style="font-size:0.78rem">' + escapeHtml(it.timestamp || "") + '</div><span class="status-badge ' + (isDone ? "badge-done" : "badge-progress") + '">' + (isDone ? "SELESAI" : "BARU") + "</span></td>" +
          '<td><span class="status-badge badge-subject">' + escapeHtml(it.category || "Umum") + "</span></td>" +
          '<td style="font-size:0.82rem;max-inline-size:320px"><div>' + escapeHtml(it.details || "") + '</div><div style="font-size:0.72rem;color:var(--text-muted)">' + escapeHtml(it.pageUrl || "") + "</div></td>" +
          '<td style="font-size:0.78rem"><div>' + escapeHtml(it.contact || "-") + '</div><div style="color:var(--text-muted)">' + escapeHtml(it.userKey || "Guest") + "</div></td>" +
          '<td><button type="button" class="btn ' + (isDone ? "btn-outline" : "btn-primary") + ' btn-xs js-adm-resolve-issue" data-issue-id="' + escapeHtml(String(it.id || "")) + '">' + (isDone ? "Buka Semula" : "Tanda Selesai") + "</button></td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderAdminLogsTable() {
    const tbody = document.getElementById("adminLogsTableBody");
    if (!tbody || !portalState.adminData) return;
    const logs = portalState.adminData.recentLogs || [];
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">Belum ada log aktiviti terkini.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.slice(0, 40).map(function (log) {
      const evt = String(log.eventType || "");
      const isWarn = evt.includes("SEKAT") || evt.includes("DENIED") || evt.includes("LIMIT") || evt.includes("BLOCK") || evt.includes("FAIL");
      return (
        "<tr>" +
          '<td class="tabular-nums" style="font-size:0.78rem">' + escapeHtml(log.timestamp || "") + "</td>" +
          '<td class="tabular-nums" style="font-weight:600">' + escapeHtml(log.userId || "") + "</td>" +
          '<td><span class="status-badge ' + (isWarn ? "badge-progress" : "badge-done") + '">' + escapeHtml(evt) + "</span></td>" +
          '<td style="font-size:0.76rem;color:var(--text-muted)">' + escapeHtml(log.deviceId || "-") + "</td>" +
          '<td style="font-size:0.8rem">' + escapeHtml(log.details || "") + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function exportAdminStudentsCsv() {
    const list = (portalState.adminData && Array.isArray(portalState.adminData.students)) ? portalState.adminData.students : [];
    if (!list.length) { showToast("Tiada data pelajar untuk dieksport.", true); return; }
    const esc = function (v) {
      let s = String(v == null ? "" : v);
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const rows = [["Nama", "Emel", "Penyedia", "Status", "Token Kekal", "Asas Bulan", "Kod Rujukan", "Set Selesai", "Akses Terakhir"].map(esc).join(",")];
    list.forEach(function (s) {
      rows.push([s.displayName || s.fullName || "", s.email || "", s.authProvider || "", s.status || "", s.paidBalance || 0, s.freeMonthlyRemaining != null ? s.freeMonthlyRemaining : 30, s.referralCode || "", s.completedSets || 0, s.lastAccess || ""].map(esc).join(","));
    });
    const blob = new Blob(["\ufeff" + rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "etutor_pelajar_" + new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    showToast("Senarai " + list.length + " pelajar dieksport ke CSV.");
  }

  // --- [features/admin/adminTableActionsController.js] ---
  /**
   * src/features/admin/adminTableActionsController.js
   * Pengawal tindakan baris jadual pelajar (Pilih, Kredit +45/+160/+500, WhatsApp Terus, Sekat/Aktifkan).
   */




  function bindAdminTableRowActions() {
    document.addEventListener("click", async function (e) {
      const pickBtn = e.target.closest(".js-adm-pick-student");
      if (pickBtn) {
        const ident = pickBtn.getAttribute("data-ident") || "";
        const name = pickBtn.getAttribute("data-name") || "";
        const planInp = document.getElementById("admDirectStudentInput");
        const noteInp = document.getElementById("admVoucherNoteInput");
        const adjInp = document.getElementById("admAdjustStudentInput");
        if (planInp && ident) planInp.value = ident;
        if (noteInp && name) noteInp.value = name;
        if (adjInp && ident) adjInp.value = ident;
        const heading = document.getElementById("adminVoucherHeading");
        if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
        showToast("Akaun " + (ident || name) + " dimuatkan ke borang Admin.");
        return;
      }

      const waBtn = e.target.closest(".js-adm-wa-student");
      if (waBtn) {
        const msg = buildCustomerActivationWaText(waBtn);
        const waPhone = toMalaysianWhatsAppNumber(waBtn.getAttribute("data-ident") || waBtn.getAttribute("data-email") || "");
        const waUrl = waPhone
          ? "https://wa.me/" + waPhone + "?text=" + encodeURIComponent(msg)
          : "https://wa.me/?text=" + encodeURIComponent(msg);
        try { await navigator.clipboard.writeText(msg); } catch (err) {}
        window.open(waUrl, "_blank", "noopener");
        showToast(waPhone ? "Membuka WhatsApp pelajar..." : "Mesej disalin & membuka WhatsApp...");
        return;
      }

      const topupBtn = e.target.closest(".js-adm-topup");
      if (topupBtn) {
        const uid = topupBtn.getAttribute("data-uid");
        const delta = parseInt(topupBtn.getAttribute("data-delta") || "0", 10);
        const name = topupBtn.getAttribute("data-name") || "Pelajar";
        if (!uid || !delta) return;

        topupBtn.disabled = true;
        try {
          const res = await callAdminBackend("adminTopupStudent", {
            adminToken: portalState.adminToken,
            userId: uid,
            delta: delta,
            note: "Kredit pantas Admin (+" + delta + " Token)"
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast("+" + delta + " Token dikreditkan ke akaun " + name + ".");
          } else {
            showToast((res && res.error) || "Gagal mengkreditkan token.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat pelayan semasa mengkreditkan token.", true);
        } finally {
          topupBtn.disabled = false;
        }
        return;
      }

      const toggleBtn = e.target.closest(".js-adm-toggle-student");
      if (toggleBtn) {
        const uid = toggleBtn.getAttribute("data-uid");
        if (!uid) return;
        toggleBtn.disabled = true;
        try {
          const res = await callAdminBackend("adminToggleStudentStatus", {
            adminToken: portalState.adminToken,
            userId: uid
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast("Status akaun pelajar berjaya dikemas kini.");
          } else {
            showToast((res && res.error) || "Gagal menukar status akaun.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat pelayan semasa menukar status akaun.", true);
        } finally {
          toggleBtn.disabled = false;
        }
      }
    });
  }

  // --- [features/admin/adminOpsController.js] ---
  /**
   * src/features/admin/adminOpsController.js
   * Pengawal operasi lanjutan Admin: pelarasan +/- token manual, bajet harian AI, aduan pelajar, segar katalog & eksport CSV.
   */






  function initAdminOpsBindings() {
    const adjustForm = document.getElementById("adminAdjustTokensForm");
    if (adjustForm) {
      adjustForm.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        if (!portalState.adminToken) {
          showToast("Sila log masuk sebagai Admin terlebih dahulu.", true);
          return;
        }
        const idInp = document.getElementById("admAdjustStudentInput");
        const deltaInp = document.getElementById("admAdjustDeltaInput");
        const reasonInp = document.getElementById("admAdjustReasonInput");
        const btn = document.getElementById("admAdjustSubmitBtn");
        const ident = idInp ? idInp.value.trim() : "";
        const delta = parseInt(deltaInp ? deltaInp.value : "0", 10) || 0;
        const reason = reasonInp ? reasonInp.value.trim() : "";
        if (!ident || delta === 0 || !reason) {
          showToast("Sila isi E-mel/ID, jumlah (+/-), dan sebab pelarasan.", true);
          return;
        }
        if (btn) btn.disabled = true;
        try {
          const res = await callAdminBackend("adminAdjustTokens", {
            adminToken: portalState.adminToken,
            studentIdentifier: ident,
            delta: delta,
            note: reason
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            if (deltaInp) deltaInp.value = "";
            if (reasonInp) reasonInp.value = "";
            showToast("Pelarasan " + (delta > 0 ? "+" : "") + delta + " Token untuk " + (res.studentEmail || ident) + " berjaya.");
          } else {
            showToast((res && res.error) || "Gagal melaras baki token.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat sambungan semasa pelarasan token.", true);
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    const budgetForm = document.getElementById("adminAiBudgetForm");
    if (budgetForm) {
      budgetForm.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        if (!portalState.adminToken) return;
        const capInp = document.getElementById("admBudgetCapInput");
        const visInp = document.getElementById("admVisionCapInput");
        const btn = document.getElementById("admSaveBudgetBtn");
        const capVal = Number(capInp ? capInp.value : 2);
        const visVal = parseInt(visInp ? visInp.value : "100", 10);
        if (btn) btn.disabled = true;
        try {
          const res = await callAdminBackend("adminUpdateAiBudget", {
            adminToken: portalState.adminToken,
            hardCapMyr: capVal,
            freeVisionCap: visVal
          });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast("Had bajet harian Cikgu AI (RM " + capVal.toFixed(2) + ") disimpan.");
          } else {
            showToast((res && res.error) || "Gagal menyimpan had bajet AI.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat mengemas kini bajet harian AI.", true);
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    const syncCatBtn = document.getElementById("admForceSyncCatalogBtn");
    if (syncCatBtn) {
      syncCatBtn.addEventListener("click", async function () {
        syncCatBtn.disabled = true;
        try {
          try { localStorage.removeItem(LIVE_CATALOG_CACHE_KEY); } catch (e) {}
          const pubRes = await callBackend("publicDashboard", { forceRefresh: true });
          if (pubRes && pubRes.ok && Array.isArray(pubRes.catalog)) {
            portalState.rawOpenCatalog = pubRes.catalog;
            let cacheMsg = "";
            if (portalState.adminToken) {
              try {
                const syncRes = await callAdminBackend("adminSyncCatalogCache", {
                  adminToken: portalState.adminToken,
                  items: pubRes.catalog
                });
                if (syncRes && syncRes.ok) cacheMsg = " & disegar ke cache Supabase";
              } catch (err) {}
            }
            showToast("Katalog disegar semula (" + pubRes.catalog.length + " set soalan aktif" + cacheMsg + ").");
          } else {
            showToast("Segerakkan katalog selesai.");
          }
        } catch (err) {
          showToast((err && err.message) || "Gagal menyegar semula katalog Drive.", true);
        } finally {
          syncCatBtn.disabled = false;
        }
      });
    }

    const payForm = document.getElementById("adminPaymentConfigForm");
    if (payForm) {
      payForm.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        if (!portalState.adminToken) {
          showToast("Sila log masuk sebagai Admin terlebih dahulu.", true);
          return;
        }
        const enInp = document.getElementById("admPayEnabledInput");
        const sbInp = document.getElementById("admPaySandboxInput");
        const catInp = document.getElementById("admPayCategoryInput");
        const secInp = document.getElementById("admPaySecretInput");
        const btn = document.getElementById("admSavePaymentConfigBtn");
        if (btn) btn.disabled = true;
        try {
          const res = await callAdminBackend("adminSavePaymentConfig", {
            adminToken: portalState.adminToken,
            enabled: Boolean(enInp && enInp.checked),
            sandbox: Boolean(sbInp && sbInp.checked),
            categoryCode: catInp ? catInp.value.trim() : "",
            secretKey: secInp ? secInp.value.trim() : ""
          });
          if (res && res.ok) {
            if (secInp) secInp.value = "";
            applyAdminBundle(res);
            showToast("Tetapan gerbang pembayaran ToyyibPay disimpan.");
          } else {
            showToast((res && res.error) || "Gagal menyimpan tetapan ToyyibPay.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat menyimpan tetapan ToyyibPay.", true);
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    const copyWhBtn = document.getElementById("admCopyWebhookUrlBtn");
    if (copyWhBtn) {
      copyWhBtn.addEventListener("click", async function () {
        const cfg = window.ETUTOR_CONFIG || {};
        const edgeBase = String(cfg.CIKGU_SUPABASE_EDGE_URL || "https://ktesekiguardgfdgrmlp.supabase.co/functions/v1/cikgu-semak").trim().replace(/\/+$/, "");
        const hookUrl = edgeBase + "/v1/payment/toyyibpay-callback";
        try {
          await navigator.clipboard.writeText(hookUrl);
          showToast("URL Webhook ToyyibPay disalin: " + hookUrl);
        } catch (e) {
          showToast("URL Webhook: " + hookUrl);
        }
      });
    }

    const exportBtn = document.getElementById("admExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        exportAdminStudentsCsv();
      });
    }

    document.addEventListener("click", async function (e) {
      const issueBtn = e.target.closest(".js-adm-resolve-issue");
      if (!issueBtn || !portalState.adminToken) return;
      const issueId = issueBtn.getAttribute("data-issue-id");
      if (!issueId) return;
      issueBtn.disabled = true;
      try {
        const res = await callAdminBackend("adminResolveIssue", {
          adminToken: portalState.adminToken,
          issueId: Number(issueId)
        });
        if (res && res.ok) {
          applyAdminBundle(res);
          showToast("Status aduan #" + issueId + " dikemas kini.");
        } else {
          showToast((res && res.error) || "Gagal mengemas kini status aduan.", true);
        }
      } catch (err) {
        showToast((err && err.message) || "Ralat pelayan semasa kemas kini aduan.", true);
      } finally {
        issueBtn.disabled = false;
      }
    });
  }

  // --- [features/admin/adminAuthAndUsersController.js] ---
  /**
   * src/features/admin/adminAuthAndUsersController.js
   * Pengawal pengesahan Admin eTutor.my, ralat log masuk, carian/tapis akaun pelajar & kawalan mod portal.
   */










  function setAdminLoginError(msg) {
    const box = document.getElementById("adminLoginError");
    const txt = document.getElementById("adminLoginErrorText");
    if (!box || !txt) return;
    if (!msg) {
      box.hidden = true;
      txt.textContent = "";
      return;
    }
    txt.textContent = msg;
    box.hidden = false;
  }

  function showAdminView(isLoggedIn) {
    const loginCard = document.getElementById("adminLoginShell");
    const dashCont = document.getElementById("adminDashboardShell");
    if (loginCard) loginCard.hidden = Boolean(isLoggedIn);
    if (dashCont) dashCont.hidden = !isLoggedIn;
  }

  function handleAdminLogout() {
    portalState.adminToken = "";
    portalState.adminData = null;
    try { sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY); } catch (e) {}
    setAdminLoginError("");
    showAdminView(false);
    showToast("Sesi Admin telah ditamatkan.");
  }

  function initAdminPanelBindings() {
    const adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const keyInput = document.getElementById("adminKeyInput");
        const keyVal = keyInput ? keyInput.value.trim() : "";
        if (!keyVal) {
          setAdminLoginError("Sila masukkan Kata Laluan Admin.");
          showToast("Sila masukkan Kata Laluan Admin.", true);
          return;
        }

        setAdminLoginError("");
        setFormBusy(adminLoginForm, true, "Mengesahkan...");
        try {
          const res = await callAdminBackend("adminLogin", { adminKey: keyVal });
          if (res && res.ok) {
            portalState.adminToken = res.adminToken;
            try { sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, res.adminToken); } catch (err) {}
            if (keyInput) keyInput.value = "";
            setAdminLoginError("");
            applyAdminBundle(res);
            showAdminView(true);
            showToast("Log masuk Admin berjaya.");
          } else {
            const errMsg = (res && res.error) || "Kata laluan Admin tidak sah.";
            setAdminLoginError(errMsg);
            showToast(errMsg, true);
          }
        } catch (err) {
          const errMsg = (err && err.message) || "Ralat pengesahan Admin.";
          setAdminLoginError(errMsg);
          showToast(errMsg, true);
        } finally {
          setFormBusy(adminLoginForm, false);
        }
      });
    }

    const exitLink = document.getElementById("exitAdminToStudentLink");
    if (exitLink) {
      exitLink.addEventListener("click", function (e) {
        e.preventDefault();
        history.pushState("", document.title, window.location.pathname);
        syncRouteMode();
        window.scrollTo(0, 0);
      });
    }

    const refreshBtn = document.getElementById("adminRefreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async function () {
        if (!portalState.adminToken) return;
        refreshBtn.disabled = true;
        try {
          const res = await callAdminBackend("adminDashboard", { adminToken: portalState.adminToken });
          if (res && res.ok) {
            applyAdminBundle(res);
            showToast("Data Admin berjaya disegar semula.");
          } else {
            handleAdminLogout();
          }
        } catch (err) {
          showToast((err && err.message) || "Gagal menyegar semula data Admin.", true);
        } finally {
          refreshBtn.disabled = false;
        }
      });
    }

    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", handleAdminLogout);

    const modeToggleBtn = document.getElementById("admToggleOpenModeBtn");
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", async function () {
        if (!portalState.adminToken || !portalState.adminData) return;
        const nextEnabled = !Boolean(portalState.adminData.openAccessMode);
        const msgConfirm = nextEnabled
          ? "Adakah anda pasti mahu menukar portal kepada Mod Terbuka (tanpa sekatan log masuk wajib)?"
          : "Adakah anda pasti mahu mengaktifkan Mod Akaun & Token AI Wajib untuk semua pengguna?";
        if (typeof window.confirm === "function" && !window.confirm(msgConfirm)) return;
        modeToggleBtn.disabled = true;
        try {
          const res = await callAdminBackend("adminSetOpenAccessMode", {
            adminToken: portalState.adminToken,
            enabled: nextEnabled
          });
          if (res && res.ok) {
            setOpenAccessOverride(nextEnabled);
            syncOpenAccessDom();
            applyAdminBundle(res);
            showToast(nextEnabled ? "Mod Terbuka diaktifkan." : "Mod Akaun & Token AI diaktifkan.");
          } else {
            showToast((res && res.error) || "Gagal menukar mod portal.", true);
          }
        } catch (err) {
          showToast((err && err.message) || "Ralat menukar mod portal.", true);
        } finally {
          modeToggleBtn.disabled = false;
        }
      });
    }

    const searchInput = document.getElementById("adminSearchInput");
    if (searchInput) searchInput.addEventListener("input", renderAdminUsersTable);
    const statusFilter = document.getElementById("adminStatusFilter");
    if (statusFilter) statusFilter.addEventListener("change", renderAdminUsersTable);

    bindAdminTableRowActions();
    initAdminOpsBindings();
  }

  // --- [features/admin/adminTokenVoucherController.js] ---
  /**
   * src/features/admin/adminTokenVoucherController.js
   * Pengawal pengaktifan & kredit pelan Token AI terus ke akaun pelajar (tanpa kod baucar) serta mesej pengesahan WhatsApp.
   */




  function buildPlanConfirmationWaText(info) {
    const adminWa = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.ADMIN_WHATSAPP_DISPLAY) || "013-732 7696";
    const portalUrl = window.location.origin + "/#portal";
    return [
      "Terima kasih! Langganan Pek Token AI eTutor.my anda telah DIAKTIFKAN:",
      "",
      "Akaun Pelajar: " + (info.studentEmail || "-"),
      "Kredit Ditambah: +" + (info.addedTokens || 0) + " Token Top-up Kekal",
      "Baki Token Kekal Terkini: " + (info.paidBalance != null ? info.paidBalance : info.addedTokens) + " Token",
      "",
      "Anda boleh terus guna sekarang:",
      "1. Buka " + portalUrl + " dan pastikan anda log masuk menggunakan akaun di atas.",
      "2. Baki Token Top-up Kekal anda sudah dikreditkan secara automatik (tiada kod baucar diperlukan).",
      "",
      "Bantuan Admin WhatsApp: " + adminWa
    ].join("\n");
  }

  function renderAdminRecentVouchers() {
    // Tidak lagi memaparkan jadual baucar; semua pengaktifan pelan direkodkan dalam Log Aktiviti Admin.
  }

  function initAdminVoucherBindings() {
    const form = document.getElementById("adminVoucherForm");
    const studentInp = document.getElementById("admDirectStudentInput");
    const packSel = document.getElementById("admVoucherPackSelect");
    const noteInp = document.getElementById("admVoucherNoteInput");
    const submitBtn = document.getElementById("admGenerateVoucherBtn");
    const outBox = document.getElementById("admGeneratedVoucherBox");
    const outMsg = document.getElementById("admGeneratedVoucherCode");
    const outPack = document.getElementById("admVoucherPackLabel");
    const copyBtn = document.getElementById("admCopyVoucherWaBtn");

    let lastApplied = null;

    try {
      const hashQ = (window.location.hash && window.location.hash.indexOf("?") !== -1)
        ? window.location.hash.slice(window.location.hash.indexOf("?") + 1)
        : "";
      const sp = new URLSearchParams(window.location.search || hashQ || "");
      const preStudent = (sp.get("student") || sp.get("email") || "").trim().slice(0, 120);
      const prePack = (sp.get("pack") || "").trim().toUpperCase();
      const preNote = (sp.get("note") || "").trim().slice(0, 120);
      if (studentInp && preStudent && !studentInp.value) {
        studentInp.value = preStudent;
      }
      if (packSel && ["PEK_CUBA_45", "PEK_FOKUS_160", "PEK_PECUTAN_500"].indexOf(prePack) !== -1) {
        packSel.value = prePack;
      }
      if (noteInp && preNote && !noteInp.value) {
        noteInp.value = preNote;
      }
    } catch (e) {}

    if (form) {
      form.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        if (!portalState.adminToken) {
          showToast("Sila log masuk sebagai Admin terlebih dahulu.", true);
          return;
        }
        const studentIdentifier = studentInp ? studentInp.value.trim() : "";
        const packCode = packSel ? packSel.value : "PEK_FOKUS_160";
        const note = noteInp ? noteInp.value.trim() : "";
        if (!studentIdentifier) {
          showToast("Sila masukkan E-mel atau ID Pelajar.", true);
          if (studentInp) studentInp.focus();
          return;
        }
        if (submitBtn) submitBtn.disabled = true;
        try {
          const res = await callAdminBackend("adminApplyPlan", {
            adminToken: portalState.adminToken,
            studentIdentifier: studentIdentifier,
            packCode: packCode,
            note: note
          });
          if (!res || !res.ok) {
            showToast((res && res.error) || "Gagal mengaktifkan pelan pelajar.", true);
            return;
          }
          lastApplied = {
            studentEmail: res.studentEmail || studentIdentifier,
            studentName: res.studentName || "Pelajar",
            packCode: res.packCode || packCode,
            addedTokens: res.addedTokens || 0,
            paidBalance: res.paidBalance
          };
          if (outBox && outMsg && outPack) {
            outPack.textContent = "+" + lastApplied.addedTokens + " Token";
            outMsg.textContent = lastApplied.studentEmail + " (Baki Kekal: " + (lastApplied.paidBalance != null ? lastApplied.paidBalance : lastApplied.addedTokens) + " Token)";
            outBox.hidden = false;
          }
          applyAdminBundle(res);
          showToast("+" + lastApplied.addedTokens + " Token terus dikreditkan ke " + lastApplied.studentEmail + "!");
        } catch (err) {
          showToast((err && err.message) || "Ralat sambungan pelayan.", true);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async function () {
        if (!lastApplied) return;
        const txt = buildPlanConfirmationWaText(lastApplied);
        try {
          await navigator.clipboard.writeText(txt);
          showToast("Mesej pengesahan WhatsApp berjaya disalin!");
        } catch (e) {
          showToast("Sila salin pengesahan secara manual.");
        }
      });
    }
  }

  // --- [features/dashboard/catalogAndLeaderboardEvents.js] ---
  /**
   * src/features/dashboard/catalogAndLeaderboardEvents.js
   * Pengikat acara penapis Katalog Harian, Katalog Klon SPM, Leaderboard, serta kawalan Slip Keputusan.
   */












  function bindCatalogLeaderboardAndSlipEvents() {
    document.addEventListener("click", async function (e) {
      const weakBtn = e.target.closest(".js-weak-topic-drill");
      if (weakBtn) {
        const topic = (weakBtn.getAttribute("data-topic") || "").trim();
        if (!topic) return;
        const topicLower = topic.toLowerCase();
        const hasMatch = (portalState.catalog || []).some(function (item) {
          return String(item.title || "").toLowerCase().includes(topicLower) ||
            String(item.subject || "").toLowerCase().includes(topicLower);
        });
        const searchInp = document.getElementById("catalogSearchInput");
        const gridEl = document.getElementById("catalogCardsGrid");
        const cikguDrawer = window.__CIKGU_AI_INSTANCE__ && window.__CIKGU_AI_INSTANCE__.drawer;
        if (hasMatch || !cikguDrawer || typeof cikguDrawer.openWithPrompt !== "function") {
          if (searchInp) searchInp.value = topic;
          portalState.searchQuery = topic;
          portalState.selectedSubject = "ALL";
          renderCatalogSection();
          if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          cikguDrawer.openWithPrompt('Assalamualaikum Cikgu, saya masih lemah dalam topik "' + topic + '". Boleh tolong terangkan isi penting dan satu contoh soalan latihan SPM?');
        }
        return;
      }

      const openBtn = e.target.closest(".js-open-quiz");
      if (openBtn) {
        const fid = openBtn.getAttribute("data-file-id");
        const resume = openBtn.getAttribute("data-resume") === "1";
        const reset = openBtn.getAttribute("data-reset") === "1";
        if (fid) openQuizSet(fid, resume, reset);
        return;
      }

      const reportBtn = e.target.closest(".js-open-quiz-report");
      if (reportBtn) {
        const fid = reportBtn.getAttribute("data-file-id");
        if (fid) openSavedReportForFile(fid);
        return;
      }

      if (e.target.closest(".js-load-more-klon")) {
        portalState.klonVisibleLimit = (Number(portalState.klonVisibleLimit) || PORTAL_BATCH_SIZE) + PORTAL_BATCH_SIZE;
        renderKlonCatalogSection();
        return;
      }
      if (e.target.closest(".js-show-all-klon")) {
        portalState.klonVisibleLimit = 9999;
        renderKlonCatalogSection();
        return;
      }
      if (e.target.closest(".js-load-more-harian")) {
        portalState.harianVisibleLimit = (Number(portalState.harianVisibleLimit) || PORTAL_BATCH_SIZE) + PORTAL_BATCH_SIZE;
        renderCatalogSection();
        return;
      }
      if (e.target.closest(".js-show-all-harian")) {
        portalState.harianVisibleLimit = 9999;
        renderCatalogSection();
        return;
      }

      const klonGroupChip = e.target.closest(".js-klon-group-chip");
      if (klonGroupChip) {
        portalState.klonSelectedGroup = klonGroupChip.getAttribute("data-klon-group") || "ALL";
        portalState.klonVisibleLimit = PORTAL_BATCH_SIZE;
        document.querySelectorAll(".js-klon-group-chip").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === klonGroupChip ? "true" : "false");
        });
        populateKlonSubjectChips();
        renderKlonCatalogSection();
        return;
      }

      const subChip = e.target.closest(".js-subject-chip");
      if (subChip) {
        portalState.selectedSubject = subChip.getAttribute("data-subject") || "ALL";
        portalState.harianVisibleLimit = PORTAL_BATCH_SIZE;
        document.querySelectorAll(".js-subject-chip").forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn === subChip ? "true" : "false");
        });
        renderCatalogSection();
        return;
      }

      const klonChip = e.target.closest(".js-klon-subject-chip");
      if (klonChip) {
        portalState.klonSelectedSubject = klonChip.getAttribute("data-subject") || "ALL";
        portalState.klonVisibleLimit = PORTAL_BATCH_SIZE;
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
        portalState.harianVisibleLimit = PORTAL_BATCH_SIZE;
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
        portalState.klonVisibleLimit = PORTAL_BATCH_SIZE;
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

    initPortalModuleDropdowns();
  }

  // --- [features/dashboard/portalEvents.js] ---
  /**
   * src/features/dashboard/portalEvents.js
   * Pengikat acara utama Borang Log Masuk Pelajar, Segar Semula Katalog, Log Keluar & mesej tetingkap.
   */













  function bindEvents() {
    initFormValidation();
    window.addEventListener("message", handleQuizMessage);
    window.addEventListener("message", handleNotaStageMessage);

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


    const shareExpBtn = document.getElementById("shareExperienceBtn");
    if (shareExpBtn) {
      shareExpBtn.addEventListener("click", function () {
        if (!window.ETutorShare || typeof window.ETutorShare.openShareModal !== "function") {
          showToast("Modul kongsi sedang dimuatkan. Sila cuba sebentar lagi.");
          return;
        }
        let refCode = "";
        try {
          const rawW = JSON.parse(localStorage.getItem("etutor_cikgu_daily_tokens_v1") || "{}");
          if (rawW && rawW.serverReferralCode) refCode = String(rawW.serverReferralCode).trim().toUpperCase();
        } catch (e) {}
        const setsEl = document.getElementById("overallSetsDoneText");
        const avgEl = document.getElementById("kpiAvgScore");
        const gradeEl = document.getElementById("kpiAvgGrade");
        const xpEl = document.getElementById("kpiTotalXp");
        const nameEl = document.getElementById("navBuyerName");
        window.ETutorShare.openShareModal({
          mode: "experience",
          studentName: (nameEl && nameEl.textContent.trim()) || "Pelajar SPM",
          setsDoneText: (setsEl && setsEl.textContent.trim()) || "0 set selesai",
          avgScore: (avgEl && avgEl.textContent.trim()) || "0%",
          avgGrade: (gradeEl && gradeEl.textContent.trim()) || "-",
          totalXp: (xpEl && xpEl.textContent.trim()) || "0 XP",
          refCode: refCode,
          url: "https://etutor.my/"
        });
      });
    }

    bindCatalogLeaderboardAndSlipEvents();
    bindNotaCatalogEvents();
    initLandingAndOrderBindings();
    initAdminPanelBindings();
  }

  // --- [features/three-world/threeLoader.js] ---
  /**
   * src/features/three-world/threeLoader.js
   * Pemuat malas Three.js r147 daripada ./vendor/three.min.js (CSP 'self')
   * dengan pengesanan WebGL dan prefers-reduced-motion.
   */

  const ET_THREE_VENDOR_SRC = "./vendor/three.min.js";
  let etThreeWebGlSupportCache_ = null;

  function etThreePrefersReducedMotion() {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? Boolean(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      : false;
  }

  function etThreeSupportsWebGl() {
    if (etThreeWebGlSupportCache_ !== null) return etThreeWebGlSupportCache_;
    if (typeof window === "undefined" || typeof document === "undefined" || typeof window.WebGLRenderingContext === "undefined") {
      return (etThreeWebGlSupportCache_ = false);
    }
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      if (gl && typeof gl.getExtension === "function") {
        const lose = gl.getExtension("WEBGL_lose_context");
        if (lose && typeof lose.loseContext === "function") lose.loseContext();
      }
      return (etThreeWebGlSupportCache_ = Boolean(gl));
    } catch (e) {
      return (etThreeWebGlSupportCache_ = false);
    }
  }

  function etThreeResolveLib_() {
    return window.THREE && typeof window.THREE.WebGLRenderer === "function" ? window.THREE : null;
  }

  function etThreeLoadLibrary() {
    if (typeof window === "undefined" || typeof document === "undefined") return Promise.resolve(null);
    if (!etThreeSupportsWebGl()) return Promise.resolve(null);
    const ready = etThreeResolveLib_();
    if (ready) return Promise.resolve(ready);
    if (window.__etThreeLoadPromise) return window.__etThreeLoadPromise;

    window.__etThreeLoadPromise = new Promise(function (resolve) {
      let settled = false;
      let timerId = 0;
      function finish(lib) {
        if (settled) return;
        settled = true;
        if (timerId) window.clearTimeout(timerId);
        if (!lib) window.__etThreeLoadPromise = null;
        resolve(lib || null);
      }

      let s = document.querySelector('script[data-et-three-loader="1"], script[src*="vendor/three.min.js"]');
      if (s && s.getAttribute("data-et-three-failed") === "1") { finish(null); return; }

      timerId = window.setTimeout(function () { finish(etThreeResolveLib_()); }, 12000);
      const isNew = !s;
      if (isNew) {
        s = document.createElement("script");
        s.src = ET_THREE_VENDOR_SRC;
        s.async = true;
        s.setAttribute("data-et-three-loader", "1");
      } else if (etThreeResolveLib_()) {
        finish(etThreeResolveLib_());
        return;
      }
      s.addEventListener("load", function () { finish(etThreeResolveLib_()); }, { once: true });
      s.addEventListener("error", function () { s.setAttribute("data-et-three-failed", "1"); finish(null); }, { once: true });
      if (isNew) (document.head || document.documentElement || document.body).appendChild(s);
    });
    return window.__etThreeLoadPromise;
  }

  // --- [features/three-world/mascotStage3d.js] ---
  /**
   * src/features/three-world/mascotStage3d.js
   * Pentas Maskot 3D Three.js r147 gaya Duolingo terang: maskot paralaks, topi graduasi,
   * syiling XP & kristal mengorbit, squash & stretch, zarah bertakung, dan sandaran tanpa WebGL.
   */

  const ET_MASCOT3D_IMG_SRC = "./images/hero-student-3d.webp";
  const ET_MASCOT3D_PARTICLE_CAP = 20;
  const ET_MASCOT3D_DEFAULT_SPEECH = "Jom kumpul XP & capai sasaran hari ini!";
  let etMascot3dState_ = null;
  let etMascot3dSpeechText_ = ET_MASCOT3D_DEFAULT_SPEECH;
  let etMascot3dMountSeq_ = 0;

  function etMascot3dClamp_(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function etMascot3dEnsureDom_(containerEl) {
    containerEl.textContent = "";
    const wrap = Object.assign(document.createElement("div"), { className: "et-mascot3d-stage is-fallback", tabIndex: 0 });
    wrap.setAttribute("role", "button");
    wrap.setAttribute("aria-label", "Pentas Maskot eTutor — Klik untuk sorakan");
    wrap.innerHTML = '<div class="et-mascot3d-halo" aria-hidden="true"></div><img class="et-mascot3d-fallback-img" src="' + ET_MASCOT3D_IMG_SRC + '" alt="Maskot eTutor.my" decoding="async"><div id="etMascotSpeechBubble" class="et-mascot3d-speech" role="status" aria-live="polite"></div>';
    const bubble = wrap.querySelector("#etMascotSpeechBubble");
    bubble.textContent = etMascot3dSpeechText_;
    containerEl.appendChild(wrap);
    return { wrap: wrap, bubble: bubble };
  }

  function etMascot3dPopulateScene_(THREE, state, dom, token) {
    const sm = function (c, r, m, em, ei) { return new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, emissive: em || 0, emissiveIntensity: ei || 0 }); };
    const bm = function (c, op, dbl) { return new THREE.MeshBasicMaterial({ color: c, transparent: op < 1, opacity: op, side: dbl ? THREE.DoubleSide : THREE.FrontSide }); };
    const mk = function (geo, mat, rx, px, py, pz) {
      const o = new THREE.Mesh(geo, mat);
      if (rx) o.rotation.x = rx;
      o.position.set(px || 0, py || 0, pz || 0);
      return o;
    };
    const key = new THREE.DirectionalLight(0xffffff, 0.95), rim = new THREE.DirectionalLight(0x93c5fd, 0.45);
    key.position.set(2.8, 4.2, 4.5);
    rim.position.set(-3, 2, -2);
    state.scene.add(new THREE.AmbientLight(0xffffff, 0.92), key, rim);

    const rootGroup = new THREE.Group();
    state.scene.add(rootGroup);
    const glowRing = mk(new THREE.RingGeometry(0.84, 0.97, 48), bm(0x059669, 0.36, true), -Math.PI / 2, 0, -1.03, 0);
    const shadowDisc = mk(new THREE.CircleGeometry(0.75, 32), bm(0x0f172a, 0.14, false), -Math.PI / 2, 0, -1.045, 0);
    rootGroup.add(mk(new THREE.TorusGeometry(1.16, 0.03, 12, 48), sm(0x2563eb, 0.3, 0.1, 0x1d4ed8, 0.28), -Math.PI / 2, 0, -1.04, 0), glowRing, shadowDisc);

    const mascotPivot = new THREE.Group(), mascotMat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.04, side: THREE.DoubleSide });
    const mascotPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75), mascotMat);
    mascotPlane.visible = false;
    mascotPivot.add(mk(new THREE.CircleGeometry(1.06, 40), bm(0xffffff, 0.8, false), 0, 0, 0, -0.14), mk(new THREE.RingGeometry(1.04, 1.1, 40), bm(0xbfdbfe, 0.9, false), 0, 0, 0, -0.13), mascotPlane);
    rootGroup.add(mascotPivot);

    const capGroup = new THREE.Group(), goldMat = sm(0xf59e0b, 0.28, 0.65, 0x78350f, 0.18);
    const board = mk(new THREE.BoxGeometry(0.68, 0.065, 0.68), sm(0x1e3a8a, 0.42, 0.15), 0, 0, 0.09, 0);
    board.rotation.y = Math.PI / 4;
    const tassel = mk(new THREE.CylinderGeometry(0.018, 0.04, 0.3, 8), goldMat, 0, 0.32, -0.04, 0.12);
    tassel.rotation.z = -0.22;
    capGroup.add(board, mk(new THREE.CylinderGeometry(0.2, 0.25, 0.19, 16), sm(0x2563eb, 0.4, 0.12), 0, 0, -0.02, 0), mk(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 12), goldMat, 0, 0, 0.135, 0), tassel);
    capGroup.position.set(1.08, 0.88, 0.22);
    capGroup.rotation.set(0.18, -0.35, -0.14);
    rootGroup.add(capGroup);

    const coinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.045, 20).rotateX(Math.PI / 2), crystalGeo = new THREE.OctahedronGeometry(0.145, 0);
    const coinMat = sm(0xf59e0b, 0.25, 0.72, 0x92400e, 0.2), emMat = sm(0x059669, 0.22, 0.35, 0x047857, 0.26), gcMat = sm(0xf59e0b, 0.24, 0.45, 0xb45309, 0.22), orbiters = [];
    for (let i = 0; i < 3; i++) {
      const coin = new THREE.Mesh(coinGeo, coinMat), crystal = new THREE.Mesh(crystalGeo, i === 1 ? gcMat : emMat);
      rootGroup.add(coin, crystal);
      orbiters.push({ mesh: coin, kind: "coin", angle: (i * Math.PI * 2) / 3, radius: 1.32 + i * 0.11, yBase: -0.45 + i * 0.48, speed: 0.52 + i * 0.08 }, { mesh: crystal, kind: "crystal", angle: ((i + 0.5) * Math.PI * 2) / 3, radius: 1.44 - i * 0.08, yBase: 0.58 - i * 0.46, speed: -0.44 - i * 0.06 });
    }
    const starGeo = new THREE.OctahedronGeometry(0.06, 0), sparkGeo = new THREE.BoxGeometry(0.065, 0.065, 0.02), palette = [0xf59e0b, 0x059669, 0x2563eb], particles = [];
    for (let j = 0; j < ET_MASCOT3D_PARTICLE_CAP; j++) {
      const pMesh = new THREE.Mesh(j % 2 === 0 ? starGeo : sparkGeo, bm(palette[j % 3], 1, false));
      pMesh.material.transparent = true;
      pMesh.visible = false;
      rootGroup.add(pMesh);
      particles.push({ mesh: pMesh, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0.65, spin: 4 });
    }
    const tex = new THREE.TextureLoader().load(ET_MASCOT3D_IMG_SRC, function (loaded) {
      if (!etMascot3dState_ || etMascot3dState_.token !== token) { loaded.dispose(); return; }
      state.pendingTex = null;
      loaded.encoding = THREE.sRGBEncoding;
      loaded.needsUpdate = true;
      if (loaded.image && loaded.image.width && loaded.image.height) mascotPlane.scale.set(loaded.image.width / loaded.image.height, 1, 1);
      mascotMat.map = loaded;
      mascotMat.needsUpdate = true;
      mascotPlane.visible = true;
      dom.wrap.classList.remove("is-fallback");
      dom.wrap.classList.add("is-webgl-ready");
    }, undefined, function () { dom.wrap.classList.add("is-fallback"); });
    tex.encoding = THREE.sRGBEncoding;
    Object.assign(state, { rootGroup: rootGroup, mascotPivot: mascotPivot, capGroup: capGroup, glowRing: glowRing, shadowDisc: shadowDisc, orbiters: orbiters, particles: particles, pendingTex: tex });
  }

  function etMascot3dSyncSize_(s) {
    if (!s || !s.renderer || !s.wrap) return;
    const w = Math.max(120, Math.round(s.wrap.clientWidth)), h = Math.max(120, Math.round(s.wrap.clientHeight));
    if (w === s.lastW && h === s.lastH) return;
    s.lastW = w;
    s.lastH = h;
    s.camera.aspect = w / h;
    s.camera.position.z = w / h < 1.05 ? etMascot3dClamp_(5.3 / Math.max(w / h, 0.72), 5.1, 6.8) : 5.1;
    s.camera.updateProjectionMatrix();
    s.renderer.setSize(w, h, false);
  }

  function etMascot3dStepAnim_(s, dt, t) {
    s.tiltX += (s.targetTiltX - s.tiltX) * Math.min(1, dt * 8);
    s.tiltY += (s.targetTiltY - s.tiltY) * Math.min(1, dt * 8);
    s.rootGroup.rotation.set(-s.tiltY * 0.14, s.tiltX * 0.24, 0);
    s.mascotPivot.position.x = s.tiltX * 0.08;
    let jumpY = 0, scaleY = 1 + Math.sin(t * 2.2) * 0.014;
    if (s.celebrateT > 0) {
      s.celebrateT = Math.max(0, s.celebrateT - dt * 1.45);
      const u = 1 - s.celebrateT;
      jumpY = Math.sin(u * Math.PI) * 0.34;
      scaleY = etMascot3dClamp_(u < 0.22 ? 0.85 : (u < 0.65 ? 1.17 : (u < 0.85 ? 0.91 : 1)), 0.84, 1.18);
    }
    s.mascotPivot.position.y = Math.sin(t * 2.1) * 0.05 + jumpY;
    s.mascotPivot.scale.set(etMascot3dClamp_(1 / Math.sqrt(scaleY), 0.9, 1.1), scaleY, 1);
    s.shadowDisc.scale.set(1.12 - jumpY * 0.55, 0.4 - jumpY * 0.18, 1);
    s.capGroup.rotation.y = -0.35 + t * 0.55;
    s.capGroup.position.y = 0.88 + Math.sin(t * 2.4 + 0.8) * 0.06;
    s.glowRing.material.opacity = 0.32 + Math.sin(t * 2.6) * 0.1;
    for (let i = 0; i < s.orbiters.length; i++) {
      const o = s.orbiters[i], a = o.angle + t * o.speed;
      o.mesh.position.set(Math.cos(a) * o.radius, o.yBase + Math.sin(t * 2.3 + i) * 0.09, Math.sin(a) * 0.72);
      o.mesh.rotation.y = t * (o.kind === "coin" ? 2.4 : 1.5) + i;
      if (o.kind === "crystal") o.mesh.rotation.z = Math.sin(t * 1.7 + i) * 0.25;
    }
    for (let j = 0; j < s.particles.length; j++) {
      const p = s.particles[j];
      if (!p.mesh.visible) continue;
      if ((p.life -= dt) <= 0) { p.mesh.visible = false; continue; }
      p.vy -= 3.2 * dt;
      p.mesh.position.set(p.mesh.position.x + p.vx * dt, p.mesh.position.y + p.vy * dt, p.mesh.position.z + p.vz * dt);
      p.mesh.rotation.z += p.spin * dt;
      p.mesh.material.opacity = etMascot3dClamp_(p.life / p.maxLife, 0, 1);
    }
  }

  function etMascot3dSyncLoop_(s) {
    if (!s || !s.renderer) return;
    if (!s.inView || document.hidden || etThreePrefersReducedMotion()) { if (s.rafId) { window.cancelAnimationFrame(s.rafId); s.rafId = 0; } return; }
    if (s.rafId) return;
    s.lastTs = performance.now();
    function frame(ts) {
      if (!etMascot3dState_ || etMascot3dState_.token !== s.token || !s.inView || document.hidden) { s.rafId = 0; return; }
      const dt = Math.min(0.05, Math.max(0.001, (ts - s.lastTs) / 1000));
      s.lastTs = ts;
      etMascot3dSyncSize_(s);
      etMascot3dStepAnim_(s, dt, ts / 1000);
      s.renderer.render(s.scene, s.camera);
      s.rafId = window.requestAnimationFrame(frame);
    }
    s.rafId = window.requestAnimationFrame(frame);
  }

  async function etMascot3dMount(containerEl, opts) {
    const el = typeof containerEl === "string" ? document.querySelector(containerEl) : containerEl;
    if (!el) return null;
    if (opts && opts.speechText) etMascot3dSpeechText_ = String(opts.speechText);
    if (etMascot3dState_ && etMascot3dState_.container === el && etMascot3dState_.wrap && etMascot3dState_.wrap.isConnected) {
      etMascot3dSetSpeech(etMascot3dSpeechText_);
      return { mode: etMascot3dState_.renderer ? "webgl" : "fallback" };
    }
    etMascot3dDispose();
    const token = ++etMascot3dMountSeq_, dom = etMascot3dEnsureDom_(el);
    const s = { token: token, container: el, wrap: dom.wrap, bubble: dom.bubble, inView: true, rafId: 0, lastTs: 0, lastW: 0, lastH: 0, tiltX: 0, tiltY: 0, targetTiltX: 0, targetTiltY: 0, celebrateT: 0, celebrateTimer: 0, cleanups: [], particles: [], orbiters: [], renderer: null, scene: null, camera: null, pendingTex: null };
    etMascot3dState_ = s;
    const evs = [
      [dom.wrap, "pointermove", function (e) { const r = dom.wrap.getBoundingClientRect(); if (r.width && r.height) { s.targetTiltX = etMascot3dClamp_(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1); s.targetTiltY = etMascot3dClamp_(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1); } }, { passive: true }],
      [dom.wrap, "pointerleave", function () { s.targetTiltX = 0; s.targetTiltY = 0; }, { passive: true }],
      [dom.wrap, "click", function () { etMascot3dCelebrate("tap"); }],
      [dom.wrap, "keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); etMascot3dCelebrate("tap"); } }],
      [document, "visibilitychange", function () { etMascot3dSyncLoop_(s); }]
    ];
    evs.forEach(function (b) { b[0].addEventListener(b[1], b[2], b[3]); });
    s.cleanups.push(function () { evs.forEach(function (b) { b[0].removeEventListener(b[1], b[2], b[3]); }); });
    if (!etThreeSupportsWebGl() || etThreePrefersReducedMotion()) return { mode: "fallback" };
    const THREE = await etThreeLoadLibrary();
    if (!THREE || !etMascot3dState_ || etMascot3dState_.token !== token) return { mode: "fallback" };

    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); } catch (e) { return { mode: "fallback" }; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "et-mascot3d-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    dom.wrap.insertBefore(renderer.domElement, dom.bubble);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.25, 5.1);
    camera.lookAt(0, 0.05, 0);
    Object.assign(s, { renderer: renderer, scene: new THREE.Scene(), camera: camera });
    etMascot3dPopulateScene_(THREE, s, dom, token);

    const addObs = function (Ctor, fn, opt) { if (typeof Ctor === "function") { const o = new Ctor(fn, opt); o.observe(dom.wrap); s.cleanups.push(function () { o.disconnect(); }); } };
    addObs(typeof IntersectionObserver !== "undefined" ? IntersectionObserver : null, function (entries) { s.inView = Boolean(entries[0] && entries[0].isIntersecting); etMascot3dSyncLoop_(s); }, { threshold: 0.05 });
    addObs(typeof ResizeObserver !== "undefined" ? ResizeObserver : null, function () { etMascot3dSyncSize_(s); });
    etMascot3dSyncSize_(s);
    etMascot3dSyncLoop_(s);
    return { mode: "webgl" };
  }

  function etMascot3dCelebrate(kind) {
    const s = etMascot3dState_;
    if (!s || !s.wrap) return;
    if (s.renderer && !etThreePrefersReducedMotion()) {
      s.celebrateT = 1;
      const n = kind === "tap" ? 12 : ET_MASCOT3D_PARTICLE_CAP;
      for (let i = 0; i < n && i < s.particles.length; i++) {
        const p = s.particles[i], th = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.35, spd = 1.4 + Math.random() * 1.4;
        p.mesh.position.set(0, 0.08, 0.24);
        Object.assign(p, { vx: Math.cos(th) * spd, vy: 1.15 + Math.sin(th) * 0.85 + Math.random() * 0.6, vz: (Math.random() - 0.5) * 0.9, life: 0.6 + Math.random() * 0.25, spin: (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 5) });
        p.maxLife = p.life;
        p.mesh.scale.setScalar(kind === "level_up" ? 1.25 : 1);
        p.mesh.material.opacity = 1;
        p.mesh.visible = true;
      }
      return;
    }
    s.wrap.classList.remove("is-celebrating");
    void s.wrap.offsetWidth;
    s.wrap.classList.add("is-celebrating");
    if (s.celebrateTimer) window.clearTimeout(s.celebrateTimer);
    s.celebrateTimer = window.setTimeout(function () { if (s.wrap) s.wrap.classList.remove("is-celebrating"); }, 520);
  }

  function etMascot3dSetSpeech(text) {
    etMascot3dSpeechText_ = String(text || ET_MASCOT3D_DEFAULT_SPEECH);
    const b = (etMascot3dState_ && etMascot3dState_.bubble) || document.getElementById("etMascotSpeechBubble");
    if (b) b.textContent = etMascot3dSpeechText_;
  }

  function etMascot3dDispose() {
    const s = etMascot3dState_;
    etMascot3dState_ = null;
    if (!s) return;
    if (s.rafId) window.cancelAnimationFrame(s.rafId);
    if (s.celebrateTimer) window.clearTimeout(s.celebrateTimer);
    s.cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
    if (s.pendingTex && s.pendingTex.dispose) s.pendingTex.dispose();
    if (s.scene) s.scene.traverse(function (o) {
      if (o.geometry && o.geometry.dispose) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
        if (m && m.map && m.map.dispose) m.map.dispose();
        if (m && m.dispose) m.dispose();
      });
    });
    if (s.renderer) { try { s.renderer.dispose(); } catch (e) {} if (s.renderer.domElement && s.renderer.domElement.parentNode) s.renderer.domElement.parentNode.removeChild(s.renderer.domElement); }
  }

  // --- [features/gamification/gamificationStore.js] ---
  /**
   * src/features/gamification/gamificationStore.js
   * Pusat penyelarasan XP, Tahap, Streak MYT, 3 Misi Harian, Peti Bonus, 6 Lencana SVG & skor Mini-Game 3D.
   */


  const ET_GAMIF_STORAGE_KEY = "etutor_gamification_v1";
  const ET_GAMIF_KSSM_KEY = "etutor_kssm_bab_xp_v1";
  const ET_GAMIF_DAY_LABELS = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];
  const ET_GAMIF_CHEST_XP = 20;

  const ET_GAMIF_QUEST_DEFS = [
    { id: "q_xp", title: "Kumpul 50 XP Hari Ini", target: 50, rewardXp: 25, kind: "xp" },
    { id: "q_bab", title: "Ulang Kaji 1 Bab atau Kuiz", target: 1, rewardXp: 30, kind: "bab" },
    { id: "q_mini", title: "Lengkapkan 1 Sesi Flashcard", target: 1, rewardXp: 40, kind: "mini" }
  ];

  const ET_GAMIF_BADGE_DEFS = [
    { id: "pemula_kssm", name: "Pemula KSSM", desc: "Kumpul XP atau mula ulang kaji bab pertama", tone: "blue" },
    { id: "raja_streak", name: "Raja Streak", desc: "Kekal aktif 3 hari berturut-turut", tone: "amber" },
    { id: "juara_kilat", name: "Juara Flashcard", desc: "Kuasai 1 sesi Flashcard KSSM dengan cemerlang", tone: "indigo" },
    { id: "pengembara_bab", name: "Pengembara Bab", desc: "Teroka sekurang-kurangnya 2 bab KSSM", tone: "emerald" },
    { id: "cikgu_ai_pro", name: "Cikgu AI Pro", desc: "Gunakan bimbingan pintar Cikgu AI", tone: "sky" },
    { id: "skor_a_plus", name: "Skor A+", desc: "Capai markah 85% ke atas dalam kuiz", tone: "gold" }
  ];

  let etGamifEventsBound_ = false;

  function etGamifMytDateStr_(dateInput) {
    const dt = dateInput instanceof Date ? dateInput : new Date();
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit", day: "2-digit"
      }).format(dt);
    } catch (e) { return new Date(dt.getTime() + 8 * 3600000).toISOString().slice(0, 10); }
  }

  function etGamifShiftDate_(dateStr, offsetDays) {
    const p = String(dateStr || "").split("-").map(Number);
    return (p.length === 3 && p[0]) ? new Date(Date.UTC(p[0], p[1] - 1, p[2] + offsetDays)).toISOString().slice(0, 10) : dateStr;
  }

  function etGamifReadJson_(key, fallback) {
    try {
      const raw = (typeof localStorage !== "undefined" && key) ? localStorage.getItem(key) : null;
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (e) { return fallback; }
  }

  function etGamifWriteStore_(rawStore) {
    try { if (typeof localStorage !== "undefined") localStorage.setItem(ET_GAMIF_STORAGE_KEY, JSON.stringify(rawStore)); } catch (e) {}
  }

  function etGamifReadKssmSnapshot_() {
    const data = etGamifReadJson_(ET_GAMIF_KSSM_KEY, {}), chapters = (data.chapters && typeof data.chapters === "object") ? data.chapters : {};
    let sumXp = 0, doneCount = 0;
    Object.keys(chapters).forEach(function (k) {
      const rec = chapters[k];
      if (!rec) return;
      const xp = Math.max(0, Number(rec.earnedXp) || 0);
      sumXp += xp;
      if (xp > 0 || (rec.answers && Object.keys(rec.answers).length > 0)) doneCount++;
    });
    return { kssmXp: Math.max(Number(data.totalXp) || 0, sumXp), kssmChaptersDone: doneCount, chapters: chapters };
  }

  function etGamifReadNotaDone_() {
    const key = (typeof NOTA_PROGRESS_STORAGE_KEY === "string" && NOTA_PROGRESS_STORAGE_KEY) ? NOTA_PROGRESS_STORAGE_KEY : "etutor_nota_progress_v1";
    const map = etGamifReadJson_(key, {});
    return Object.keys(map).filter(function (k) { return map[k] && ((Number(map[k].completedUnits) || 0) > 0 || (Number(map[k].xp) || 0) > 0); }).length;
  }

  function etGamifLoadNormalizedStore_() {
    const todayStr = etGamifMytDateStr_(new Date());
    const raw = etGamifReadJson_(ET_GAMIF_STORAGE_KEY, null);
    const isFresh = !raw;
    const store = Object.assign({
      dailyDate: todayStr, dailyXpEarned: 0, dailyBabCount: 0, dailyMiniCount: 0,
      claimedQuests: {}, claimedChests: {}, questBonusXp: 0, chestBonusXp: 0,
      minigameXp: 0, minigameRuns: 0, minigameBestScore: 0, cikguAiCount: 0,
      bestQuizPct: 0, lastSeenKssmXp: 0, lastSeenPortalXp: 0, portalBaselineDone: false, activeDays: {}, dailyXpHistory: {}
    }, raw || {});
    if (!store.activeDays || typeof store.activeDays !== "object") store.activeDays = {};
    if (!store.dailyXpHistory || typeof store.dailyXpHistory !== "object") store.dailyXpHistory = {};
    if (store.dailyDate !== todayStr) {
      Object.assign(store, { dailyDate: todayStr, dailyXpEarned: 0, dailyBabCount: 0, dailyMiniCount: 0, claimedQuests: {}, claimedChests: {} });
    }
    const scoresKey = (typeof OPEN_SCORES_STORAGE_KEY === "string" && OPEN_SCORES_STORAGE_KEY) ? OPEN_SCORES_STORAGE_KEY : "etutor_open_scores_v1";
    const openScores = etGamifReadJson_(scoresKey, []);
    if (Array.isArray(openScores)) {
      openScores.forEach(function (sc) {
        if (sc && sc.dateOnly) store.activeDays[String(sc.dateOnly).slice(0, 10)] = true;
        if (sc && Number(sc.percentage) > store.bestQuizPct) store.bestQuizPct = Number(sc.percentage);
      });
    }
    if (isFresh) { store.lastSeenKssmXp = etGamifReadKssmSnapshot_().kssmXp; etGamifWriteStore_(store); }
    return { store: store, todayStr: todayStr };
  }

  function etGamifSyncExternalDeltas_(store, todayStr) {
    const kssm = etGamifReadKssmSnapshot_(), ps = portalState.progressSummary, hasPs = Boolean(ps && typeof ps === "object");
    const portalXp = hasPs ? Math.max(0, Number(ps.totalXp) || 0) : 0;
    let dirty = false;
    if (kssm.kssmXp > store.lastSeenKssmXp) {
      store.dailyXpEarned += (kssm.kssmXp - store.lastSeenKssmXp);
      store.dailyBabCount += 1; store.activeDays[todayStr] = true; store.lastSeenKssmXp = kssm.kssmXp; dirty = true;
    } else if (kssm.kssmXp < store.lastSeenKssmXp) { store.lastSeenKssmXp = kssm.kssmXp; dirty = true; }
    if (hasPs && !store.portalBaselineDone) {
      store.portalBaselineDone = true; store.lastSeenPortalXp = portalXp; dirty = true;
    } else if (hasPs && portalXp > store.lastSeenPortalXp) {
      store.dailyXpEarned += (portalXp - store.lastSeenPortalXp);
      store.dailyBabCount += 1; store.activeDays[todayStr] = true; store.lastSeenPortalXp = portalXp; dirty = true;
    } else if (hasPs && portalXp < store.lastSeenPortalXp) { store.lastSeenPortalXp = portalXp; dirty = true; }
    if (dirty) etGamifWriteStore_(store);
    return { kssm: kssm, portalXp: portalXp, ps: ps || {} };
  }

  function etGamifCalcStreak_(activeDays, todayStr) {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      if (activeDays[etGamifShiftDate_(todayStr, -i)]) count++;
      else if (i > 0) break;
    }
    return count;
  }

  function etGamifBuildWeekDays_(activeDays, todayStr, xpHist) {
    const p = todayStr.split("-").map(Number), dow = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    const monOffset = dow === 0 ? -6 : 1 - dow;
    const hist = xpHist && typeof xpHist === "object" ? xpHist : {};
    return ET_GAMIF_DAY_LABELS.map(function (lbl, idx) {
      const key = etGamifShiftDate_(todayStr, monOffset + idx);
      const active = Boolean(activeDays[key]);
      return { key: key, label: lbl, active: active, isToday: key === todayStr, xp: Number(hist[key]) || (active ? 35 : 0) };
    });
  }

  function etGamifGetState() {
    const loaded = etGamifLoadNormalizedStore_(), store = loaded.store, todayStr = loaded.todayStr;
    const ext = etGamifSyncExternalDeltas_(store, todayStr);
    const totalXp = ext.portalXp + ext.kssm.kssmXp + store.questBonusXp + store.chestBonusXp + store.minigameXp;
    const level = Math.floor(totalXp / 250) + 1, xpIntoLevel = totalXp % 250;
    const streakDays = Math.max(Number(ext.ps.streakDays) || 0, etGamifCalcStreak_(store.activeDays, todayStr));
    const notaDone = etGamifReadNotaDone_(), completedSets = Math.max(0, Number(ext.ps.completedSets) || 0);
    const bestPct = Math.max(store.bestQuizPct, Number(ext.ps.averageScore) || 0);

    const quests = ET_GAMIF_QUEST_DEFS.map(function (q) {
      const rawProg = q.kind === "xp" ? store.dailyXpEarned : (q.kind === "bab" ? store.dailyBabCount : store.dailyMiniCount);
      const progress = Math.min(q.target, Math.max(0, rawProg)), claimed = Boolean(store.claimedQuests[q.id]);
      return { id: q.id, title: q.title, target: q.target, progress: progress, rewardXp: q.rewardXp, claimed: claimed, ready: !claimed && progress >= q.target };
    });

    const unlockedMap = {
      pemula_kssm: totalXp >= 10 || ext.kssm.kssmChaptersDone >= 1 || completedSets >= 1 || store.minigameRuns >= 1 || notaDone >= 1,
      raja_streak: streakDays >= 3,
      juara_kilat: store.minigameRuns >= 1 && (store.minigameBestScore >= 30 || store.minigameRuns >= 2),
      pengembara_bab: (ext.kssm.kssmChaptersDone + notaDone) >= 2,
      cikgu_ai_pro: store.cikguAiCount >= 1,
      skor_a_plus: bestPct >= 85
    };
    const badges = ET_GAMIF_BADGE_DEFS.map(function (b) { return Object.assign({}, b, { unlocked: Boolean(unlockedMap[b.id]) }); });

    return {
      todayMyt: todayStr, totalXp: totalXp, portalXp: ext.portalXp, kssmXp: ext.kssm.kssmXp,
      minigameXp: store.minigameXp, questBonusXp: store.questBonusXp, chestBonusXp: store.chestBonusXp,
      level: level, xpIntoLevel: xpIntoLevel, xpNextLevel: 250, levelPct: Math.round((xpIntoLevel / 250) * 100),
      streakDays: streakDays, weekDays: etGamifBuildWeekDays_(store.activeDays, todayStr, store.dailyXpHistory),
      quests: quests, badges: badges, minigameRuns: store.minigameRuns, minigameBestScore: store.minigameBestScore,
      chestClaimedToday: Boolean(store.claimedChests.daily_chest), kssmChapters: ext.kssm.chapters
    };
  }

  function etGamifEmit_(state) {
    if (typeof window !== "undefined") { try { window.dispatchEvent(new CustomEvent("etutor:gamification-updated", { detail: state })); } catch (e) {} }
  }

  function etGamifRecordEvent(type, payload) {
    const loaded = etGamifLoadNormalizedStore_(), store = loaded.store;
    const p = payload && typeof payload === "object" ? payload : {}, t = String(type || "").trim();
    store.activeDays[loaded.todayStr] = true;
    if (t === "minigame_complete" || t === "flashcard_complete") {
      const sc = Math.max(0, Number(p.accuracy || p.score) || 0);
      const xp = Number.isFinite(Number(p.xp)) ? Math.max(0, Math.round(Number(p.xp))) : Math.min(80, Math.max(10, Math.round(sc / 4)));
      store.minigameXp += xp; store.minigameRuns += 1;
      store.minigameBestScore = Math.max(store.minigameBestScore, sc || 80);
      store.dailyMiniCount += 1; store.dailyXpEarned += xp;
      store.dailyXpHistory[loaded.todayStr] = (Number(store.dailyXpHistory[loaded.todayStr]) || 0) + xp;
    } else if (t === "bab_review" || t === "nota_progress" || t === "kssm_bab") {
      const xpAdd = Math.max(0, Number(p.xp) || 10);
      store.dailyBabCount += 1; store.dailyXpEarned += xpAdd;
      store.dailyXpHistory[loaded.todayStr] = (Number(store.dailyXpHistory[loaded.todayStr]) || 0) + xpAdd;
    } else if (t === "quiz_complete" || t === "spm_quiz_complete") {
      const xpAdd = Math.max(0, Number(p.xp) || 20);
      store.dailyBabCount += 1; store.dailyXpEarned += xpAdd;
      store.dailyXpHistory[loaded.todayStr] = (Number(store.dailyXpHistory[loaded.todayStr]) || 0) + xpAdd;
      if (Number(p.percentage) > store.bestQuizPct) store.bestQuizPct = Number(p.percentage);
    } else if (t === "cikgu_ai_used") {
      store.cikguAiCount += 1;
    } else if (t === "xp_earned") {
      const xpAdd = Math.max(0, Number(p.xp) || 0);
      store.dailyXpEarned += xpAdd;
      store.dailyXpHistory[loaded.todayStr] = (Number(store.dailyXpHistory[loaded.todayStr]) || 0) + xpAdd;
    }
    etGamifWriteStore_(store);
    const next = etGamifGetState(); etGamifEmit_(next);
    return next;
  }

  function etGamifClaimQuest(questId) {
    const loaded = etGamifLoadNormalizedStore_(), store = loaded.store;
    const def = ET_GAMIF_QUEST_DEFS.find(function (q) { return q.id === questId; }), snap = etGamifGetState();
    const liveQ = def && snap.quests.find(function (q) { return q.id === questId; });
    if (!def || !liveQ || liveQ.claimed || liveQ.progress < liveQ.target) return { ok: false, xpAdded: 0, state: snap };
    store.claimedQuests[questId] = true; store.questBonusXp += def.rewardXp; store.activeDays[loaded.todayStr] = true;
    etGamifWriteStore_(store);
    const next = etGamifGetState(); etGamifEmit_(next);
    if (typeof etMascot3dCelebrate === "function") { try { etMascot3dCelebrate("reward"); } catch (e) {} }
    return { ok: true, xpAdded: def.rewardXp, state: next };
  }

  function etGamifClaimChest(chestId) {
    const id = String(chestId || "daily_chest").trim() || "daily_chest";
    const loaded = etGamifLoadNormalizedStore_(), store = loaded.store;
    if (store.claimedChests[id]) return { ok: false, alreadyClaimed: true, xpAdded: 0, state: etGamifGetState() };
    store.claimedChests[id] = true; store.chestBonusXp += ET_GAMIF_CHEST_XP; store.dailyXpEarned += ET_GAMIF_CHEST_XP;
    store.activeDays[loaded.todayStr] = true;
    etGamifWriteStore_(store);
    const next = etGamifGetState(); etGamifEmit_(next);
    if (typeof etMascot3dCelebrate === "function") { try { etMascot3dCelebrate("reward"); } catch (e) {} }
    return { ok: true, xpAdded: ET_GAMIF_CHEST_XP, state: next };
  }

  function etGamifInit() {
    const state = etGamifGetState();
    if (typeof window !== "undefined" && !etGamifEventsBound_) {
      etGamifEventsBound_ = true;
      const syncFn = function () { etGamifEmit_(etGamifGetState()); };
      window.addEventListener("etutor:dashboard-bundle-applied", syncFn);
      window.addEventListener("storage", function (ev) { if (ev && (ev.key === ET_GAMIF_KSSM_KEY || ev.key === ET_GAMIF_STORAGE_KEY)) syncFn(); });
      window.addEventListener("focus", syncFn);
    }
    return state;
  }

  // --- [features/minigame/minigameEngine.js] ---
  /**
   * src/features/minigame/minigameEngine.js
   * Enjin simulasi tulen bebas DOM/WebGL bagi permainan mini "Lompatan Kristal KSSM".
   * Menguatkuasakan invarian anti-idle, anti-hold-only, anti-mashing, skor kausal & entiti terhad.
   */

  const ET_MINI_PALETTE_ROLES = {
    background: "#EFF6FF",
    pillar: "#FFFFFF",
    protagonist: "#2563EB",
    protagonistDark: "#1E3A8A",
    targetSafe: "#059669",
    rewardGold: "#F59E0B",
    dangerWarning: "#DC2626"
  };

  const ET_MINI_CFG = {
    defaultSeed: 20270104,
    chargeDuration: 1.35,
    shortTapRatio: 0.14,
    minJumpDist: 2.05,
    maxJumpDist: 7.70,
    flightDuration: 0.42,
    arcHeightBase: 1.45,
    bullseyeRatio: 0.28,
    maxCombo: 4,
    hitStopMs: 45,
    bufferWindowSec: 0.12,
    quizBonus: 50,
    edgeGapMin: 3.25,
    edgeGapMax: 4.35,
    maxPillars: 10
  };

  function etMiniMulberry32(seed) {
    let a = (seed >>> 0) || ET_MINI_CFG.defaultSeed;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function etMiniEngCreatePillar_(id, x, radius, scored) {
    return { id: id, x: Number(x.toFixed(4)), radius: Number(radius.toFixed(4)), isGolden: id > 0 && id % 5 === 0, scored: Boolean(scored), quizResolved: id === 0 };
  }

  function etMiniEngComputeArc_(startX, targetX, arcHeight, steps) {
    const pts = [], count = steps || 9;
    for (let i = 1; i <= count; i++) {
      const t = i / count;
      pts.push({ x: startX + (targetX - startX) * t, y: 4 * arcHeight * t * (1 - t) });
    }
    return pts;
  }

  function etMiniCreateEngine(opts) {
    const cfg = ET_MINI_CFG;
    let rng = etMiniMulberry32((opts && opts.seed) || cfg.defaultSeed);
    let state = null;

    function radiusForIndex_(idx) { return Math.max(0.62, 0.95 - 0.04 * Math.sqrt(Math.max(0, idx))); }

    function ensureAndPrunePillars_() {
      while (state.pillars.length === 0 || state.pillars[state.pillars.length - 1].id < state.pillarId + 4) {
        const prev = state.pillars[state.pillars.length - 1], nextId = prev.id + 1, nextR = radiusForIndex_(nextId);
        const edgeGap = cfg.edgeGapMin + rng() * (cfg.edgeGapMax - cfg.edgeGapMin);
        state.pillars.push(etMiniEngCreatePillar_(nextId, prev.x + prev.radius + edgeGap + nextR, nextR, false));
      }
      while (state.pillars.length > cfg.maxPillars || (state.pillars.length > 6 && state.pillars[0].id < state.pillarId - 2)) {
        state.pillars.shift();
      }
      if (state.pillars.length > state.maxActiveEntities) state.maxActiveEntities = state.pillars.length;
    }

    function reset(newSeed) {
      const useSeed = (typeof newSeed === "number" && Number.isFinite(newSeed)) ? (newSeed >>> 0) : ((opts && opts.seed) || cfg.defaultSeed);
      rng = etMiniMulberry32(useSeed);
      state = {
        seed: useSeed, phase: "grounded", score: 0, combo: 1, bestCombo: 1, pillarId: 0,
        chargeRatio: 0, collapseRatio: 0, failCause: "", gameOver: false, quizGateActive: false,
        hitStopMs: 0, bufferedHold: false, acceptedInputs: 0, rejectedInputs: 0,
        duplicateTargetScores: 0, targetIdsScored: [], quizAnswered: 0, quizCorrect: 0, maxActiveEntities: 1,
        flightStartX: 0, flightTargetX: 0, flightElapsed: 0, flightArcHeight: cfg.arcHeightBase,
        avatar: { x: 0, y: 0, vx: 0, vy: 0 }, pillars: [etMiniEngCreatePillar_(0, 0, radiusForIndex_(0), true)], lastEvent: null
      };
      ensureAndPrunePillars_();
      return getTelemetry();
    }

    function resolveLanding_() {
      state.avatar.x = state.flightTargetX;
      state.avatar.y = 0; state.avatar.vx = 0; state.avatar.vy = 0;
      const hit = state.pillars.find(function (p) { return Math.abs(state.avatar.x - p.x) <= p.radius; });
      if (!hit) {
        state.phase = "gameover"; state.gameOver = true; state.failCause = "gap_miss"; state.combo = 1;
        state.lastEvent = { type: "fail", cause: "gap_miss", x: state.avatar.x, seq: state.acceptedInputs };
        return;
      }
      if (hit.scored) { state.duplicateTargetScores += 1; state.phase = "grounded"; return; }
      hit.scored = true; state.pillarId = hit.id; state.targetIdsScored.push(hit.id); state.collapseRatio = 0;

      const dx = state.avatar.x - hit.x;
      const isBullseye = Math.abs(dx) <= cfg.bullseyeRatio * hit.radius;
      let delta = 5;
      if (isBullseye) {
        delta = 15 * state.combo;
        state.combo = Math.min(cfg.maxCombo, state.combo + 1);
        if (state.combo > state.bestCombo) state.bestCombo = state.combo;
        state.hitStopMs = cfg.hitStopMs;
      } else { state.combo = 1; }
      state.score += delta;
      ensureAndPrunePillars_();

      if (hit.isGolden && !hit.quizResolved) {
        state.quizGateActive = true; state.phase = "quiz"; state.bufferedHold = false;
        state.lastEvent = { type: "quiz_gate", pillarId: hit.id, delta: delta, isBullseye: isBullseye };
        return;
      }
      state.phase = "grounded";
      state.lastEvent = { type: "land", pillarId: hit.id, delta: delta, isBullseye: isBullseye, dx: dx };
    }

    function subStep_(dt) {
      if (state.phase === "gameover") return;
      if (state.hitStopMs > 0) {
        state.hitStopMs = Math.max(0, state.hitStopMs - dt * 1000);
        if (state.hitStopMs === 0 && state.bufferedHold && state.phase === "grounded") {
          state.phase = "charging"; state.chargeRatio = 0; state.bufferedHold = false;
        }
        return;
      }
      if (state.quizGateActive || state.phase === "quiz") return;
      if (state.phase === "airborne") {
        state.flightElapsed += dt;
        const t = Math.min(1, state.flightElapsed / cfg.flightDuration), prevX = state.avatar.x, prevY = state.avatar.y;
        state.avatar.x = state.flightStartX + (state.flightTargetX - state.flightStartX) * t;
        state.avatar.y = 4 * state.flightArcHeight * t * (1 - t);
        state.avatar.vx = (state.avatar.x - prevX) / Math.max(dt, 0.001);
        state.avatar.vy = (state.avatar.y - prevY) / Math.max(dt, 0.001);
        if (t >= 1) resolveLanding_();
        return;
      }
      if (state.bufferedHold && state.phase === "grounded") {
        state.phase = "charging"; state.chargeRatio = 0; state.bufferedHold = false;
      }
      state.collapseRatio = Math.min(1, state.collapseRatio + 0.25 * Math.sqrt(1 + 0.18 * state.pillarId) * dt);
      if (state.collapseRatio >= 1) {
        state.phase = "gameover"; state.gameOver = true; state.failCause = "collapse";
        state.lastEvent = { type: "fail", cause: "collapse", pillarId: state.pillarId };
        return;
      }
      if (state.phase === "charging") {
        state.chargeRatio += dt / cfg.chargeDuration;
        if (state.chargeRatio >= 1) {
          state.chargeRatio = 1; state.phase = "gameover"; state.gameOver = true; state.failCause = "overcharge_slip";
          state.lastEvent = { type: "fail", cause: "overcharge_slip", pillarId: state.pillarId };
        }
      }
    }

    function step(dtSec) {
      let rem = Math.min(5, Math.max(0, Number(dtSec) || 0));
      while (rem > 0.000001 && !state.gameOver) { const slice = Math.min(0.02, rem); subStep_(slice); rem -= slice; }
      return getTelemetry();
    }

    function pressStart() {
      if (state.phase === "grounded" && state.hitStopMs <= 0) {
        state.phase = "charging"; state.chargeRatio = 0; state.acceptedInputs += 1; return true;
      }
      if ((state.phase === "grounded" && state.hitStopMs > 0) || (state.phase === "airborne" && (cfg.flightDuration - state.flightElapsed) <= cfg.bufferWindowSec)) {
        state.bufferedHold = true; state.acceptedInputs += 1; return true;
      }
      state.rejectedInputs += 1; return false;
    }

    function pressEnd() {
      if (state.phase === "airborne" || (state.phase === "grounded" && state.bufferedHold)) { state.bufferedHold = false; return false; }
      if (state.phase !== "charging") return false;
      const ratio = state.chargeRatio, dist = cfg.minJumpDist + ratio * (cfg.maxJumpDist - cfg.minJumpDist);
      state.flightStartX = state.avatar.x; state.flightTargetX = state.avatar.x + dist;
      state.flightElapsed = 0; state.flightArcHeight = cfg.arcHeightBase + 0.95 * ratio;
      state.chargeRatio = 0; state.phase = "airborne";
      state.lastEvent = { type: "jump", ratio: ratio, pillarId: state.pillarId };
      return true;
    }

    function answerQuiz(isCorrect) {
      if (!state.quizGateActive || state.phase !== "quiz" || state.gameOver) return false;
      const cur = state.pillars.find(function (p) { return p.id === state.pillarId; });
      if (cur) cur.quizResolved = true;
      state.quizGateActive = false; state.quizAnswered += 1; state.collapseRatio = 0;
      if (isCorrect) { state.score += cfg.quizBonus; state.quizCorrect += 1; state.lastEvent = { type: "quiz_correct", delta: cfg.quizBonus, pillarId: state.pillarId }; }
      else { state.combo = 1; state.lastEvent = { type: "quiz_wrong", delta: 0, pillarId: state.pillarId }; }
      state.phase = "grounded";
      return true;
    }

    function getJumpPreview() {
      if (state.phase !== "charging") return null;
      const targetX = state.avatar.x + cfg.minJumpDist + state.chargeRatio * (cfg.maxJumpDist - cfg.minJumpDist);
      return { targetX: targetX, points: etMiniEngComputeArc_(state.avatar.x, targetX, cfg.arcHeightBase + 0.95 * state.chargeRatio, 9) };
    }

    function getTelemetry() {
      const nextP = state.pillars.find(function (p) { return p.id === state.pillarId + 1; }) || null;
      return {
        phase: state.phase, score: state.score, combo: state.combo, bestCombo: state.bestCombo,
        pillarId: state.pillarId, nextPillarId: nextP ? nextP.id : state.pillarId + 1,
        chargeRatio: Number(state.chargeRatio.toFixed(4)), collapseRatio: Number(state.collapseRatio.toFixed(4)),
        failCause: state.failCause, gameOver: state.gameOver, isAirborne: state.phase === "airborne",
        quizGateActive: state.quizGateActive, hitStopMs: Number(state.hitStopMs.toFixed(1)),
        activeEntities: state.pillars.length, maxActiveEntities: state.maxActiveEntities,
        duplicateTargetScores: state.duplicateTargetScores, targetIdsScored: state.targetIdsScored.slice(),
        acceptedInputs: state.acceptedInputs, rejectedInputs: state.rejectedInputs,
        quizAnswered: state.quizAnswered, quizCorrect: state.quizCorrect
      };
    }

    function getState() {
      return {
        seed: state.seed, telemetry: getTelemetry(), avatar: Object.assign({}, state.avatar),
        pillars: state.pillars.map(function (p) { return Object.assign({}, p); }),
        jumpPreview: getJumpPreview(), lastEvent: state.lastEvent
      };
    }

    reset((opts && opts.seed) || cfg.defaultSeed);
    return { reset: reset, pressStart: pressStart, pressEnd: pressEnd, step: step, answerQuiz: answerQuiz, getTelemetry: getTelemetry, getState: getState };
  }

  // --- [features/minigame/minigameAudio.js] ---
  /**
   * src/features/minigame/minigameAudio.js
   * Penjana kesan bunyi Web Audio prosedural untuk Lompatan Kristal KSSM (sifar aset luar).
   */

  let etMiniSfxCtx_ = null;
  let etMiniSfxMuted_ = false;
  let etMiniSfxLastTickBand_ = -1;

  function etMiniSfxEnsureCtx_() {
    if (etMiniSfxMuted_ || typeof window === "undefined") return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!etMiniSfxCtx_) {
      try { etMiniSfxCtx_ = new AC(); } catch (e) { return null; }
    }
    if (etMiniSfxCtx_.state === "suspended" && typeof etMiniSfxCtx_.resume === "function") {
      etMiniSfxCtx_.resume().catch(function () {});
    }
    return etMiniSfxCtx_;
  }

  function etMiniSfxTone_(freqA, freqB, durSec, type, vol, delaySec) {
    const ctx = etMiniSfxEnsureCtx_();
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime + (delaySec || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freqA, t0);
      if (freqB && freqB !== freqA) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqB), t0 + durSec);
      }
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(vol || 0.08, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + durSec + 0.015);
    } catch (e) {}
  }

  function etMiniSfxCharge(ratio) {
    if (ratio <= 0) { etMiniSfxLastTickBand_ = -1; return; }
    const band = ratio >= 0.85 ? 4 : (ratio >= 0.65 ? 3 : (ratio >= 0.4 ? 2 : (ratio >= 0.16 ? 1 : 0)));
    if (band > etMiniSfxLastTickBand_) {
      etMiniSfxLastTickBand_ = band;
      const freq = 260 + band * 115;
      etMiniSfxTone_(freq, freq * 1.08, 0.055, band >= 4 ? "triangle" : "sine", band >= 4 ? 0.09 : 0.05, 0);
    }
  }

  function etMiniSfxJump() {
    etMiniSfxLastTickBand_ = -1;
    etMiniSfxTone_(270, 560, 0.11, "sine", 0.08, 0);
  }

  function etMiniSfxLand(isBullseye, combo) {
    etMiniSfxLastTickBand_ = -1;
    if (isBullseye) {
      const base = 523.25 * Math.pow(1.12246, Math.min(4, Math.max(0, (combo || 1) - 1)));
      etMiniSfxTone_(base, base * 1.25, 0.12, "triangle", 0.1, 0);
      etMiniSfxTone_(base * 1.5, base * 1.5, 0.16, "sine", 0.08, 0.055);
    } else {
      etMiniSfxTone_(210, 145, 0.09, "triangle", 0.075, 0);
    }
  }

  function etMiniSfxQuiz(kind) {
    if (kind === "open") {
      etMiniSfxTone_(523, 523, 0.08, "sine", 0.07, 0);
      etMiniSfxTone_(659, 659, 0.08, "sine", 0.07, 0.07);
      etMiniSfxTone_(784, 987, 0.14, "triangle", 0.08, 0.14);
      return;
    }
    if (kind === "correct") {
      etMiniSfxTone_(587, 587, 0.09, "triangle", 0.09, 0);
      etMiniSfxTone_(880, 1046, 0.18, "triangle", 0.1, 0.08);
      return;
    }
    etMiniSfxTone_(330, 247, 0.16, "sawtooth", 0.05, 0);
  }

  function etMiniSfxFail(cause) {
    etMiniSfxLastTickBand_ = -1;
    if (cause === "overcharge_slip") {
      etMiniSfxTone_(720, 190, 0.22, "sawtooth", 0.07, 0);
    } else if (cause === "collapse") {
      etMiniSfxTone_(150, 58, 0.28, "triangle", 0.11, 0);
    } else {
      etMiniSfxTone_(390, 130, 0.24, "sine", 0.085, 0);
    }
  }

  function etMiniSfxSetMuted(muted) {
    etMiniSfxMuted_ = Boolean(muted);
    return etMiniSfxMuted_;
  }

  function etMiniSfxIsMuted() {
    return etMiniSfxMuted_;
  }

  // --- [features/minigame/minigameScene3d.js] ---
  /**
   * src/features/minigame/minigameScene3d.js
   * Pemapar Three.js r147 (sRGBEncoding + bayang lembut + cincin pra-amaran + zarah bertakung)
   * berserta sandaran rendering Canvas 2D jika WebGL tidak tersedia.
   */

  const ET_MINI3D_PARTICLE_CAP = 24;
  const ET_MINI3D_PILLAR_POOL = 12;
  let etMini3dCtx_ = null;

  function etMini3dResolveLoader_() {
    if (typeof etThreeLoadLibrary === "function") return etThreeLoadLibrary;
    if (typeof window !== "undefined" && typeof window.etThreeLoadLibrary === "function") return window.etThreeLoadLibrary;
    if (typeof window === "undefined") return null;
    return function () {
      if (window.THREE) return Promise.resolve(window.THREE);
      if (window.__etThreeLoadPromise) return window.__etThreeLoadPromise;
      window.__etThreeLoadPromise = new Promise(function (resolve) {
        const s = document.createElement("script"); s.src = "./vendor/three.min.js"; s.async = true;
        s.onload = function () { resolve(window.THREE || null); }; s.onerror = function () { resolve(null); };
        document.head.appendChild(s);
      });
      return window.__etThreeLoadPromise;
    };
  }
  function etMini3dHasWebGl_() {
    if (typeof etThreeSupportsWebGl === "function") return etThreeSupportsWebGl();
    if (typeof window !== "undefined" && typeof window.etThreeSupportsWebGl === "function") return window.etThreeSupportsWebGl();
    try { const c = document.createElement("canvas"); return Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; }
  }
  function etMini3dLerp_(a, b, t) { return a + (b - a) * Math.min(1, Math.max(0, t)); }
  function etMini3dChargeHex_(r) { return r >= 0.85 ? 0xDC2626 : (r >= 0.65 ? 0xF59E0B : 0x2563EB); }
  function etMini3dChargeCss_(r) { return r >= 0.85 ? "#DC2626" : (r >= 0.65 ? "#F59E0B" : "#2563EB"); }

  function etMini3dSetupThree_(ctx, THREE) {
    if (ctx.disposed || !ctx.host) return;
    const w = Math.max(240, ctx.host.clientWidth || 640), h = Math.max(220, ctx.host.clientHeight || 360);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h);
    renderer.domElement.className = "et-mini-3d-canvas";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEFF6FF); scene.fog = new THREE.Fog(0xEFF6FF, 16, 40);
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
    camera.position.set(2.4, 5.1, 8.8);
    scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xCBD5E1, 0.92));

    const dir = new THREE.DirectionalLight(0xFFFFFF, 0.88);
    dir.position.set(6, 12, 7); dir.castShadow = true; dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 1; dir.shadow.camera.far = 36;
    const d = 11;
    dir.shadow.camera.left = -d; dir.shadow.camera.right = d; dir.shadow.camera.top = d; dir.shadow.camera.bottom = -d;
    scene.add(dir, dir.target);

    const avRoot = new THREE.Group(), avMesh = new THREE.Group();
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.28, 16), new THREE.MeshStandardMaterial({ color: 0x2563EB, roughness: 0.32 }));
    crown.position.y = 0.14; crown.castShadow = true;
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.08, 0.76), new THREE.MeshStandardMaterial({ color: 0x1E3A8A, roughness: 0.28 }));
    board.position.y = 0.31; board.rotation.y = Math.PI / 4; board.castShadow = true;
    const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), new THREE.MeshStandardMaterial({ color: 0xF59E0B, emissive: 0xB45309, emissiveIntensity: 0.3 }));
    tassel.position.set(0.32, 0.25, 0.24); avMesh.add(crown, board, tassel);

    const chargeMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.9 });
    const chargeRing = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.055, 8, 28), chargeMat);
    chargeRing.rotation.x = Math.PI / 2; chargeRing.position.y = 0.04; chargeRing.visible = false;
    avRoot.add(avMesh, chargeRing); scene.add(avRoot);

    const collapseMat = new THREE.MeshBasicMaterial({ color: 0xDC2626, side: THREE.DoubleSide, transparent: true, opacity: 0.52 });
    const collapseRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 1, 28), collapseMat);
    collapseRing.rotation.x = -Math.PI / 2; collapseRing.position.y = 0.025; collapseRing.visible = false; scene.add(collapseRing);

    const pilGeo = new THREE.CylinderGeometry(1, 1.06, 4.2, 20), rimGeo = new THREE.TorusGeometry(1, 0.04, 8, 28);
    const bullGeo = new THREE.RingGeometry(0.18, 0.28, 24), crysGeo = new THREE.OctahedronGeometry(0.32, 0);
    const matPil = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.35 }), matRim = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.4 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xF59E0B, emissive: 0xB45309, emissiveIntensity: 0.28, roughness: 0.25 });
    const matBull = new THREE.MeshBasicMaterial({ color: 0x059669, side: THREE.DoubleSide });
    const pillars = [];
    for (let i = 0; i < ET_MINI3D_PILLAR_POOL; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(pilGeo, matPil); body.position.y = -2.1; body.castShadow = true; body.receiveShadow = true;
      const rim = new THREE.Mesh(rimGeo, matRim); rim.rotation.x = Math.PI / 2; rim.position.y = -0.01;
      const goldRim = new THREE.Mesh(rimGeo, matGold); goldRim.rotation.x = Math.PI / 2; goldRim.position.y = -0.01;
      const bull = new THREE.Mesh(bullGeo, matBull); bull.rotation.x = -Math.PI / 2; bull.position.y = 0.018;
      const crys = new THREE.Mesh(crysGeo, matGold); crys.position.y = 0.92; crys.castShadow = true;
      g.add(body, rim, goldRim, bull, crys); g.visible = false; scene.add(g);
      pillars.push({ group: g, rim: rim, goldRim: goldRim, bull: bull, crys: crys });
    }

    const aimDots = [], dotGeo = new THREE.SphereGeometry(0.085, 8, 8), dotMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.82 });
    for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(dotGeo, dotMat); m.visible = false; scene.add(m); aimDots.push(m); }
    const particles = [], pGeo = new THREE.OctahedronGeometry(0.085, 0);
    for (let i = 0; i < ET_MINI3D_PARTICLE_CAP; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0x059669, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(pGeo, mat); mesh.visible = false; scene.add(mesh);
      particles.push({ mesh: mesh, mat: mat, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0.52 });
    }
    if (ctx.canvas2d) ctx.canvas2d.hidden = true;
    ctx.host.appendChild(renderer.domElement);
    ctx.gl = { renderer: renderer, scene: scene, camera: camera, dir: dir, avRoot: avRoot, avMesh: avMesh, chargeRing: chargeRing, chargeMat: chargeMat, collapseRing: collapseRing, collapseMat: collapseMat, pillars: pillars, aimDots: aimDots, dotMat: dotMat, particles: particles };
    ctx.mode = "webgl";
    etMini3dResize();
  }

  function etMini3dSpawnBurst_(ctx, x, y, hex, count) {
    const n = Math.min(count || 12, ET_MINI3D_PARTICLE_CAP);
    for (let k = 0; k < n; k++) {
      const ang = (k / n) * Math.PI * 2 + (k % 2) * 0.25, spd = 1.6 + (k % 4) * 0.7;
      if (ctx.gl) {
        const slot = ctx.gl.particles.find(function (p) { return p.life <= 0; });
        if (slot) {
          slot.mesh.position.set(x, y + 0.18, 0); slot.mat.color.setHex(hex);
          slot.vx = Math.cos(ang) * spd; slot.vy = 2.0 + (k % 3) * 0.9; slot.vz = Math.sin(ang) * spd;
          slot.life = 0.52; slot.maxLife = 0.52; slot.mesh.visible = true;
        }
      }
      if (ctx.p2d.length < ET_MINI3D_PARTICLE_CAP) {
        ctx.p2d.push({ x: x, y: y + 0.2, vx: Math.cos(ang) * spd, vy: 2.2 + (k % 3) * 0.8, hex: "#" + hex.toString(16).padStart(6, "0"), life: 0.52 });
      }
    }
  }

  function etMini3dProcessEvent_(ctx, state) {
    const ev = state && state.lastEvent;
    if (!ev || ev === ctx.lastEventRef) return;
    ctx.lastEventRef = ev;
    if (ev.type === "jump") { ctx.scaleY = 1.24; return; }
    if (ev.type === "land" || ev.type === "quiz_gate") {
      ctx.scaleY = ev.isBullseye ? 0.72 : 0.82; ctx.camKick = Math.min(0.14, ev.isBullseye ? 0.13 : 0.05);
      etMini3dSpawnBurst_(ctx, state.avatar.x, 0, ev.isBullseye ? 0x059669 : 0x60A5FA, ev.isBullseye ? 16 : 8);
    } else if (ev.type === "quiz_correct") {
      ctx.scaleY = 1.18; ctx.camKick = 0.11;
      etMini3dSpawnBurst_(ctx, state.avatar.x, 0.3, 0xF59E0B, 18);
    } else if (ev.type === "fail") {
      ctx.failT = 0; ctx.camKick = 0.14;
      etMini3dSpawnBurst_(ctx, state.avatar.x, state.avatar.y, 0xDC2626, 14);
    }
  }

  function etMini3dFailPose_(ctx, tel, dt) {
    if (!tel.gameOver) { ctx.failT = 0; return { dx: 0, dy: 0, rz: 0, pDrop: 0 }; }
    ctx.failT += dt;
    if (tel.failCause === "overcharge_slip") return { dx: ctx.failT * 1.9, dy: -ctx.failT * ctx.failT * 7, rz: -ctx.failT * 8.5, pDrop: 0 };
    if (tel.failCause === "collapse") { const d = -Math.min(2.8, ctx.failT * 4.2); return { dx: 0, dy: d, rz: Math.sin(ctx.failT * 9) * 0.25, pDrop: d }; }
    return { dx: 0, dy: -Math.min(3.5, ctx.failT * 5.2), rz: -0.65, pDrop: 0 };
  }

  function etMini3dRenderGl_(ctx, state, dt) {
    const g = ctx.gl, tel = state.telemetry, fp = etMini3dFailPose_(ctx, tel, dt);
    const curPil = state.pillars.find(function (p) { return p.id === tel.pillarId; });
    const jitter = (!tel.gameOver && tel.collapseRatio > 0.6) ? Math.sin(ctx.elapsed * 42) * 0.035 * tel.collapseRatio : 0;
    g.pillars.forEach(function (slot, idx) {
      const p = state.pillars[idx];
      if (!p) { slot.group.visible = false; return; }
      const isCur = p.id === tel.pillarId;
      slot.group.visible = true; slot.group.position.set(p.x + (isCur ? jitter : 0), isCur ? fp.pDrop : 0, 0);
      slot.group.scale.set(p.radius, 1, p.radius);
      slot.rim.visible = !p.isGolden; slot.goldRim.visible = p.isGolden; slot.bull.visible = p.id > tel.pillarId;
      slot.crys.visible = p.isGolden && !p.quizResolved;
      slot.crys.rotation.y = ctx.elapsed * 2.2; slot.crys.position.y = 0.9 + Math.sin(ctx.elapsed * 3.1) * 0.1;
    });
    if (curPil && !tel.gameOver && tel.collapseRatio > 0.02 && !tel.isAirborne) {
      const cr = Math.max(0.06, Math.min(1, tel.collapseRatio) * curPil.radius);
      g.collapseRing.visible = true; g.collapseRing.position.set(curPil.x + jitter, 0.025, 0); g.collapseRing.scale.set(cr, cr, 1);
      g.collapseMat.color.setHex(tel.collapseRatio >= 0.7 ? 0xDC2626 : (tel.collapseRatio >= 0.4 ? 0xF59E0B : 0x94A3B8));
    } else { g.collapseRing.visible = false; }

    const sy = tel.phase === "charging" ? etMini3dLerp_(1.0, 0.72, tel.chargeRatio) : ctx.scaleY, sx = 1 / Math.sqrt(Math.max(0.68, sy));
    g.avRoot.position.set(state.avatar.x + fp.dx, Math.max(-3.6, state.avatar.y + fp.dy), 0);
    g.avMesh.scale.set(sx, sy, sx); g.avMesh.rotation.z = fp.rz; g.avMesh.rotation.y = tel.isAirborne ? ctx.elapsed * 5.2 : 0;
    if (tel.phase === "charging") {
      const rs = (0.55 + tel.chargeRatio * 0.75) * (tel.chargeRatio >= 0.85 ? (1 + Math.sin(ctx.elapsed * 26) * 0.14) : 1);
      g.chargeRing.visible = true; g.chargeRing.scale.set(rs, rs, 1); g.chargeMat.color.setHex(etMini3dChargeHex_(tel.chargeRatio));
    } else { g.chargeRing.visible = false; }

    const pts = state.jumpPreview && state.jumpPreview.points;
    g.dotMat.color.setHex(etMini3dChargeHex_(tel.chargeRatio));
    g.aimDots.forEach(function (dot, i) { if (pts && pts[i]) { dot.visible = true; dot.position.set(pts[i].x, pts[i].y + 0.12, 0); } else { dot.visible = false; } });
    g.particles.forEach(function (p) {
      if (p.life <= 0) { p.mesh.visible = false; return; }
      p.life -= dt; p.vy -= 7.8 * dt;
      p.mesh.position.x += p.vx * dt; p.mesh.position.y += p.vy * dt; p.mesh.position.z += p.vz * dt;
      const ratio = Math.max(0, p.life / p.maxLife); p.mesh.scale.setScalar(ratio); p.mat.opacity = ratio;
    });

    ctx.camX = etMini3dLerp_(ctx.camX, state.avatar.x + 2.4, Math.min(1, dt * 6.5));
    g.camera.position.set(ctx.camX + 0.8, 5.1 - ctx.camKick, 8.8); g.camera.lookAt(ctx.camX + 0.6, 0.55 - ctx.camKick * 0.5, 0);
    g.dir.position.set(ctx.camX + 5, 12, 7); g.dir.target.position.set(ctx.camX, 0, 0);
    g.renderer.render(g.scene, g.camera);
  }

  function etMini3dRender2d_(ctx, state, dt) {
    const c = ctx.canvas2d, g = c && c.getContext && c.getContext("2d");
    if (!c || !g) return;
    const w = c.width, h = c.height, tel = state.telemetry, fp = etMini3dFailPose_(ctx, tel, dt);
    ctx.camX = etMini3dLerp_(ctx.camX, state.avatar.x + 2.1, Math.min(1, dt * 6.5));
    const sc = Math.min(w / 11.5, h / 6.8), baseY = h * 0.68 + ctx.camKick * 28, toX = function (wx) { return w * 0.24 + (wx - ctx.camX + 2.1) * sc; };
    g.fillStyle = ET_MINI_PALETTE_ROLES.background; g.fillRect(0, 0, w, h);

    state.pillars.forEach(function (p) {
      const px = toX(p.x), rw = p.radius * sc, py = baseY + (p.id === tel.pillarId ? -fp.pDrop * sc : 0);
      g.fillStyle = "#E2E8F0"; g.fillRect(px - rw, py, rw * 2, h - py);
      g.fillStyle = "#FFFFFF"; g.fillRect(px - rw, py - 8, rw * 2, 16);
      g.strokeStyle = p.isGolden ? "#F59E0B" : "#CBD5E1"; g.lineWidth = 3; g.strokeRect(px - rw, py - 8, rw * 2, 16);
      if (p.id > tel.pillarId) { g.fillStyle = "#059669"; g.fillRect(px - rw * 0.28, py - 8, rw * 0.56, 6); }
      if (p.isGolden && !p.quizResolved) {
        g.fillStyle = "#F59E0B"; g.beginPath(); g.moveTo(px, py - 46); g.lineTo(px + 12, py - 30); g.lineTo(px, py - 14); g.lineTo(px - 12, py - 30); g.closePath(); g.fill();
      }
      if (p.id === tel.pillarId && !tel.gameOver && tel.collapseRatio > 0.02) {
        g.strokeStyle = tel.collapseRatio >= 0.7 ? "#DC2626" : "#F59E0B"; g.lineWidth = 3;
        g.beginPath(); g.ellipse(px, py, rw * tel.collapseRatio, 6, 0, 0, Math.PI * 2); g.stroke();
      }
    });
    if (state.jumpPreview && state.jumpPreview.points) {
      g.fillStyle = etMini3dChargeCss_(tel.chargeRatio);
      state.jumpPreview.points.forEach(function (pt) { g.beginPath(); g.arc(toX(pt.x), baseY - pt.y * sc, 4, 0, Math.PI * 2); g.fill(); });
    }
    const ax = toX(state.avatar.x + fp.dx), ay = baseY - (state.avatar.y + fp.dy) * sc;
    if (tel.phase === "charging") {
      g.strokeStyle = etMini3dChargeCss_(tel.chargeRatio); g.lineWidth = 4;
      g.beginPath(); g.arc(ax, ay - 12, 18 + tel.chargeRatio * 18, 0, Math.PI * 2 * tel.chargeRatio); g.stroke();
    }
    const sy = tel.phase === "charging" ? etMini3dLerp_(1, 0.72, tel.chargeRatio) : ctx.scaleY;
    g.fillStyle = "#2563EB"; g.fillRect(ax - 12 / sy, ay - 22 * sy, 24 / sy, 20 * sy);
    g.fillStyle = "#1E3A8A"; g.fillRect(ax - 18 / sy, ay - 28 * sy, 36 / sy, 7);
    for (let i = ctx.p2d.length - 1; i >= 0; i--) {
      const pt = ctx.p2d[i]; pt.life -= dt; pt.vy -= 7.8 * dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt;
      if (pt.life <= 0) { ctx.p2d.splice(i, 1); continue; }
      g.fillStyle = pt.hex; g.fillRect(toX(pt.x) - 3, baseY - pt.y * sc - 3, 6, 6);
    }
  }

  function etMini3dMount(containerEl) {
    etMini3dDispose();
    if (!containerEl) return "none";
    const c2d = document.createElement("canvas"); c2d.className = "et-mini-2d-canvas"; containerEl.appendChild(c2d);
    const ctx = { host: containerEl, canvas2d: c2d, gl: null, mode: "canvas2d", disposed: false, camX: 2.2, camKick: 0, scaleY: 1, elapsed: 0, failT: 0, lastEventRef: null, p2d: [], ro: null };
    etMini3dCtx_ = ctx; etMini3dResize();
    if (typeof ResizeObserver === "function") { ctx.ro = new ResizeObserver(function () { etMini3dResize(); }); ctx.ro.observe(containerEl); }
    const loader = etMini3dResolveLoader_();
    if (etMini3dHasWebGl_() && loader) {
      Promise.resolve(loader()).then(function (THREE) { if (THREE && etMini3dCtx_ === ctx && !ctx.disposed) etMini3dSetupThree_(ctx, THREE); }).catch(function () {});
    }
    return ctx.mode;
  }

  function etMini3dRender(state, dtSec) {
    const ctx = etMini3dCtx_;
    if (!ctx || ctx.disposed || !state) return;
    const dt = Math.min(0.05, Math.max(0.001, Number(dtSec) || 0.016));
    ctx.elapsed += dt; etMini3dProcessEvent_(ctx, state);
    ctx.scaleY = etMini3dLerp_(ctx.scaleY, 1.0, Math.min(1, dt * 11)); ctx.camKick = etMini3dLerp_(ctx.camKick, 0, Math.min(1, dt * 12));
    if (ctx.gl) etMini3dRenderGl_(ctx, state, dt); else etMini3dRender2d_(ctx, state, dt);
  }
  function etMini3dResize() {
    const ctx = etMini3dCtx_;
    if (!ctx || !ctx.host) return;
    const w = Math.max(240, ctx.host.clientWidth || 640), h = Math.max(220, ctx.host.clientHeight || 360);
    if (ctx.canvas2d) { ctx.canvas2d.width = w; ctx.canvas2d.height = h; }
    if (ctx.gl) { ctx.gl.camera.aspect = w / h; ctx.gl.camera.updateProjectionMatrix(); ctx.gl.renderer.setSize(w, h); }
  }
  function etMini3dGetMode() { return etMini3dCtx_ ? etMini3dCtx_.mode : "none"; }
  function etMini3dDispose() {
    const ctx = etMini3dCtx_;
    if (!ctx) return;
    ctx.disposed = true; if (ctx.ro) ctx.ro.disconnect();
    if (ctx.gl) {
      ctx.gl.scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material && typeof o.material.dispose === "function") o.material.dispose(); });
      ctx.gl.renderer.dispose();
    }
    if (ctx.host) ctx.host.innerHTML = "";
    etMini3dCtx_ = null;
  }

  // --- [features/minigame/minigameModalController.js] ---
  /**
   * src/features/minigame/minigameModalController.js
   * Pengawal dialog #etMinigameDialog: input satu butang (Space/pointer),
   * Soalan Kilat KSSM mengikut profil tingkatan/subjek, & penyegerakan XP ke gamificationStore.
   */






  const ET_MINIMODAL_BEST_KEY = "etutor_minigame_best_v1";
  const ET_MINIMODAL_QUIZ_BANK = [
    { form: "T4", subject: "Sains", q: "Apakah fungsi utama termometer inframerah tanpa sentuhan?", opts: ["Mengukur suhu badan melalui sinaran inframerah", "Mengukur tekanan darah arteri", "Menentukan indeks jisim badan"], ans: 0 },
    { form: "T4", subject: "Sains", q: "Resusitasi Kardiopulmonari (CPR) menggabungkan tekanan dada dengan...", opts: ["Balutan kain anduh", "Bantuan pernafasan mulut ke mulut", "Suntikan insulin"], ans: 1 },
    { form: "T5", subject: "Sains", q: "Mikroorganisma manakah membantu pengikatan nitrogen dalam nodul akar kekacang?", opts: ["Virus HIV", "Plasmodium sp.", "Rhizobium sp."], ans: 2 },
    { form: "T1", subject: "Sains", q: "Alat radas manakah paling jitu menyukat isi padu cecair tetap 25.0 cm3?", opts: ["Pipet", "Bikar", "Kelalang kon"], ans: 0 },
    { form: "T2", subject: "Sains", q: "Apakah unit SI yang digunakan untuk mengukur daya?", opts: ["Joule (J)", "Newton (N)", "Watt (W)"], ans: 1 },
    { form: "T3", subject: "Sains", q: "Bahagian neuron manakah membawa impuls keluar dari badan sel?", opts: ["Dendrit", "Sinaps", "Akson"], ans: 2 },
    { form: "T4", subject: "Matematik", q: "Bagi graf fungsi kuadratik ax^2 + bx + c = 0 dengan a < 0, bentuknya ialah...", opts: ["Terbuka ke bawah (titik maksimum)", "Terbuka ke atas (titik minimum)", "Garis lurus mendatar"], ans: 0 },
    { form: "T5", subject: "Matematik", q: "Dua pemboleh ubah y dan x dikatakan berubah secara langsung apabila...", opts: ["y = k / x", "y = kx", "x + y = k"], ans: 1 },
    { form: "T1", subject: "Matematik", q: "Berapakah hasil darab bagi (-4) x (-6)?", opts: ["-24", "-10", "+24"], ans: 2 },
    { form: "T2", subject: "Matematik", q: "Apakah rumus kecerunan garis lurus m melalui dua titik?", opts: ["(y2 - y1) / (x2 - x1)", "(x2 - x1) / (y2 - y1)", "(x1 + x2) / 2"], ans: 0 },
    { form: "T3", subject: "Matematik", q: "Permudahkan 3^4 x 3^2 menggunakan hukum indeks.", opts: ["3^8", "3^6", "9^6"], ans: 1 },
    { form: "T4", subject: "Sejarah", q: "Apakah maksud konsep 'Daulat' dalam Kesultanan Melayu Melaka?", opts: ["Cukai perdagangan pelabuhan", "Perjanjian luar negeri", "Kekuasaan tertinggi raja terhadap negeri dan rakyat"], ans: 2 },
    { form: "T5", subject: "Sejarah", q: "Prinsip Rukun Negara manakah menekankan keadilan undang-undang untuk semua?", opts: ["Kedaulatan Undang-undang", "Kepercayaan kepada Tuhan", "Kesopanan dan Kesusilaan"], ans: 0 },
    { form: "T4", subject: "Bahasa Melayu", q: "Pilih kata majmuk mantap yang dieja RAPAT.", opts: ["terimakasih", "tanggungjawab", "keretapi"], ans: 1 },
    { form: "T5", subject: "Bahasa Inggeris", q: "Which relative pronoun is grammatically correct right after a preposition?", opts: ["The friend with who I study", "The friend with that I study", "The friend with whom I study"], ans: 2 },
    { form: "T3", subject: "Geografi", q: "Jenis tumbuhan semula jadi utama di kawasan bersaliran baik di Malaysia ialah...", opts: ["Hutan Hujan Tropika", "Hutan Konifer", "Hutan Tundra"], ans: 0 },
    { form: "T4", subject: "Pendidikan Islam", q: "Hukum menuntut ilmu fardu ain ke atas setiap Muslim ialah...", opts: ["Sunat Muakkad", "Wajib", "Harus"], ans: 1 },
    { form: "T1", subject: "Bahasa Melayu", q: "Pilih ayat pasif kata ganti nama diri pertama yang betul.", opts: ["Buku itu telah disemak oleh saya.", "Buku itu telah menyemak saya.", "Buku itu telah saya semak."], ans: 2 }
  ];
  const ET_MINIMODAL_FAIL_TEXT = {
    collapse: ["Tiang Runtuh!", "Tiang batu retak sebelum kamu melompat. Cas dan lepas lebih pantas!"],
    overcharge_slip: ["Terlebih Cas — Tergelincir!", "Kuasa lompatan mencapai 100% dan watak tergelincir dari puncak tiang."],
    gap_miss: ["Lompatan Tersasar!", "Jarak lompatan terlalu pendek atau melepasi sasaran tiang."]
  };
  const etMiniModalState = {
    bound: false, engine: null, rafId: 0, lastTs: 0, bestScore: 0,
    runId: 0, runRecorded: false, activeQuiz: null, lastEventRef: null, quizCursor: 0
  };

  function etMiniModalReadBest_() {
    try { return Math.max(0, Number(localStorage.getItem(ET_MINIMODAL_BEST_KEY)) || 0); } catch (e) { return 0; }
  }
  function etMiniModalSaveBest_(val) {
    etMiniModalState.bestScore = Math.max(etMiniModalState.bestScore, val);
    try { localStorage.setItem(ET_MINIMODAL_BEST_KEY, String(etMiniModalState.bestScore)); } catch (e) {}
  }
  function etMiniModalSetText_(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }

  function etMiniModalPickQuestion_(pillarId) {
    let profile = null;
    try { profile = typeof getStudentProfile === "function" ? getStudentProfile() : null; } catch (e) {}
    const forms = (profile && Array.isArray(profile.learningForms) && profile.learningForms.length) ? profile.learningForms : [(profile && profile.currentForm) || "T5"];
    const subs = (profile && Array.isArray(profile.selectedSubjects)) ? profile.selectedSubjects.map(function (s) { return s.toLowerCase(); }) : [];
    let pool = ET_MINIMODAL_QUIZ_BANK.filter(function (it) { return forms.indexOf(it.form) !== -1 && (subs.length === 0 || subs.indexOf(it.subject.toLowerCase()) !== -1); });
    if (pool.length === 0) pool = ET_MINIMODAL_QUIZ_BANK.filter(function (it) { return forms.indexOf(it.form) !== -1; });
    if (pool.length === 0) pool = ET_MINIMODAL_QUIZ_BANK;
    const idx = (etMiniModalState.quizCursor + Math.floor((pillarId || 5) / 5)) % pool.length;
    etMiniModalState.quizCursor += 1;
    return pool[idx];
  }

  function etMiniModalSyncGlobalState_(dlg, tel) {
    if (typeof window !== "undefined") window.__ETUTOR_MINIGAME_STATE__ = Object.assign({ open: Boolean(dlg && dlg.open), renderer: etMini3dGetMode() }, tel);
  }

  function etMiniModalRenderQuiz_(qItem) {
    etMiniModalState.activeQuiz = qItem;
    const card = document.getElementById("etMiniQuizCard"), optsEl = document.getElementById("etMiniQuizOptions");
    if (!card || !optsEl) return;
    etMiniModalSetText_("etMiniQuizTag", qItem.form.replace("T", "Tingkatan ") + " • " + qItem.subject);
    etMiniModalSetText_("etMiniQuizQuestion", qItem.q);
    optsEl.innerHTML = qItem.opts.map(function (opt, i) {
      return '<button type="button" class="et-mini-quiz-opt" data-mini-opt="' + i + '">' + escapeHtml(opt) + "</button>";
    }).join("");
    card.hidden = false;
    etMiniSfxQuiz("open");
  }

  function etMiniModalHandleGameOver_(tel) {
    if (etMiniModalState.runRecorded) return;
    etMiniModalState.runRecorded = true;
    etMiniModalSaveBest_(tel.score);
    const xp = tel.score > 0 ? Math.max(5, Math.min(60, Math.round(tel.score / 4))) : 0;
    const copy = ET_MINIMODAL_FAIL_TEXT[tel.failCause] || ET_MINIMODAL_FAIL_TEXT.gap_miss;
    etMiniModalSetText_("etMiniOverTitle", copy[0]);
    etMiniModalSetText_("etMiniOverDesc", copy[1]);
    etMiniModalSetText_("etMiniOverScore", String(tel.score));
    etMiniModalSetText_("etMiniOverBest", String(etMiniModalState.bestScore));
    etMiniModalSetText_("etMiniOverPillars", String(tel.pillarId));
    etMiniModalSetText_("etMiniOverXp", "+" + xp + " XP");
    etMiniModalSetText_("etMiniHudBest", String(etMiniModalState.bestScore));
    const card = document.getElementById("etMiniOverCard"), qCard = document.getElementById("etMiniQuizCard");
    if (card) card.hidden = false;
    if (qCard) qCard.hidden = true;
    if (xp > 0) {
      if (typeof etGamifRecordEvent === "function") etGamifRecordEvent("minigame_complete", { score: tel.score, xp: xp });
      else if (typeof window !== "undefined" && typeof window.etGamifRecordEvent === "function") window.etGamifRecordEvent("minigame_complete", { score: tel.score, xp: xp });
    }
  }

  function etMiniModalSyncHud_(snap) {
    const tel = snap.telemetry, hint = document.getElementById("etMiniControlsHint");
    etMiniModalSetText_("etMiniHudScore", String(tel.score));
    etMiniModalSetText_("etMiniHudCombo", "x" + tel.combo);
    etMiniModalSetText_("etMiniHudBest", String(Math.max(etMiniModalState.bestScore, tel.score)));
    if (hint) hint.hidden = tel.pillarId > 0 || tel.phase === "charging" || tel.gameOver;
    if (tel.phase === "charging") etMiniSfxCharge(tel.chargeRatio);
    if (snap.lastEvent && snap.lastEvent !== etMiniModalState.lastEventRef) {
      etMiniModalState.lastEventRef = snap.lastEvent;
      const ev = snap.lastEvent;
      if (ev.type === "jump") etMiniSfxJump();
      else if (ev.type === "land") etMiniSfxLand(ev.isBullseye, tel.combo);
      else if (ev.type === "quiz_gate") { etMiniSfxLand(ev.isBullseye, tel.combo); etMiniModalRenderQuiz_(etMiniModalPickQuestion_(ev.pillarId)); }
      else if (ev.type === "fail") etMiniSfxFail(ev.cause);
    }
    if (tel.gameOver) etMiniModalHandleGameOver_(tel);
  }

  function etMiniModalLoop_(ts) {
    const dlg = document.getElementById("etMinigameDialog");
    if (!dlg || !dlg.open || !etMiniModalState.engine) { etMiniModalState.rafId = 0; return; }
    const dt = etMiniModalState.lastTs ? Math.min(0.05, Math.max(0.001, (ts - etMiniModalState.lastTs) / 1000)) : 0.016;
    etMiniModalState.lastTs = ts;
    etMiniModalState.engine.step(dt);
    const snap = etMiniModalState.engine.getState();
    etMini3dRender(snap, dt);
    etMiniModalSyncHud_(snap);
    etMiniModalSyncGlobalState_(dlg, snap.telemetry);
    etMiniModalState.rafId = requestAnimationFrame(etMiniModalLoop_);
  }

  function etMiniModalStartNewRun_() {
    const seed = Date.now() >>> 0;
    etMiniModalState.runId += 1;
    if (!etMiniModalState.engine) etMiniModalState.engine = etMiniCreateEngine({ seed: seed });
    else etMiniModalState.engine.reset(seed);
    etMiniModalState.runRecorded = false; etMiniModalState.activeQuiz = null;
    etMiniModalState.lastEventRef = null; etMiniModalState.lastTs = 0;
    const qCard = document.getElementById("etMiniQuizCard"), oCard = document.getElementById("etMiniOverCard");
    if (qCard) qCard.hidden = true;
    if (oCard) oCard.hidden = true;
    const snap = etMiniModalState.engine.getState();
    etMini3dRender(snap, 0.016); etMiniModalSyncHud_(snap);
    etMiniModalSyncGlobalState_(document.getElementById("etMinigameDialog"), snap.telemetry);
  }

  function etMiniModalBind_() {
    if (etMiniModalState.bound) return;
    etMiniModalState.bound = true;
    const dlg = document.getElementById("etMinigameDialog"), host = document.getElementById("etMiniCanvasHost");
    if (!dlg) return;
    bindLightDismissFallback(dlg);
    dlg.addEventListener("close", function () {
      etMiniModalState.runId += 1;
      if (etMiniModalState.rafId) cancelAnimationFrame(etMiniModalState.rafId);
      etMiniModalState.rafId = 0; etMini3dDispose();
      if (etMiniModalState.engine) etMiniModalSyncGlobalState_(dlg, etMiniModalState.engine.getTelemetry());
    });
    if (host) {
      host.addEventListener("pointerdown", function (e) {
        if ((e.button && e.button !== 0) || !etMiniModalState.engine) return;
        const tel = etMiniModalState.engine.getTelemetry();
        if (tel.quizGateActive || tel.gameOver) return;
        etMiniModalState.engine.pressStart();
      });
      window.addEventListener("pointerup", function () { if (dlg.open && etMiniModalState.engine) etMiniModalState.engine.pressEnd(); });
      window.addEventListener("pointercancel", function () { if (dlg.open && etMiniModalState.engine) etMiniModalState.engine.pressEnd(); });
    }
    window.addEventListener("keydown", function (e) {
      if (!dlg.open || e.code !== "Space" || e.repeat || !etMiniModalState.engine) return;
      const tel = etMiniModalState.engine.getTelemetry();
      if (tel.quizGateActive || tel.gameOver) return;
      e.preventDefault(); etMiniModalState.engine.pressStart();
    });
    window.addEventListener("keyup", function (e) {
      if (!dlg.open || e.code !== "Space" || !etMiniModalState.engine) return;
      e.preventDefault(); etMiniModalState.engine.pressEnd();
    });
    dlg.addEventListener("click", function (e) {
      if (e.target.closest("#etMiniCloseBtn") || e.target.closest("#etMiniDoneBtn")) { closeTopLayer(dlg); return; }
      if (e.target.closest("#etMiniRetryBtn")) { etMiniModalStartNewRun_(); return; }
      const muteBtn = e.target.closest("#etMiniMuteBtn");
      if (muteBtn) {
        const m = etMiniSfxSetMuted(!etMiniSfxIsMuted());
        muteBtn.setAttribute("aria-pressed", m ? "true" : "false");
        const wave = document.getElementById("etMiniSoundWave");
        if (wave) wave.style.opacity = m ? "0.2" : "1";
        return;
      }
      const optBtn = e.target.closest("[data-mini-opt]");
      if (optBtn && etMiniModalState.activeQuiz && etMiniModalState.engine) {
        const ok = Number(optBtn.getAttribute("data-mini-opt")) === etMiniModalState.activeQuiz.ans;
        const curRunId = etMiniModalState.runId;
        optBtn.classList.add(ok ? "is-correct" : "is-wrong");
        etMiniSfxQuiz(ok ? "correct" : "wrong");
        etMiniModalState.activeQuiz = null;
        setTimeout(function () {
          if (curRunId !== etMiniModalState.runId) return;
          const qCard = document.getElementById("etMiniQuizCard");
          if (qCard) qCard.hidden = true;
          if (etMiniModalState.engine) etMiniModalState.engine.answerQuiz(ok);
        }, 360);
      }
    });
  }

  function etMiniModalOpen() {
    const dlg = document.getElementById("etMinigameDialog"), host = document.getElementById("etMiniCanvasHost");
    if (!dlg || !host) return false;
    etMiniModalBind_(); etMiniModalState.bestScore = etMiniModalReadBest_();
    if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
    etMini3dMount(host); etMini3dResize(); etMiniModalStartNewRun_();
    if (!etMiniModalState.rafId) etMiniModalState.rafId = requestAnimationFrame(etMiniModalLoop_);
    host.focus();
    return true;
  }

  function etMiniModalClose() { const d = document.getElementById("etMinigameDialog"); if (d && d.open) closeTopLayer(d); }
  function etMiniModalInit() { etMiniModalBind_(); if (typeof window !== "undefined") window.etMiniModalOpen = etMiniModalOpen; }

  // --- [features/flashcards/flashcardDeckLoader.js] ---
  /**
   * src/features/flashcards/flashcardDeckLoader.js
   * Pemuat dek kad imbas KSSM T1-T5 dari ./data/flashcards-kssm.json berserta dek sandaran luar talian.
   */

  const ET_FC_DATA_URL = "./data/flashcards-kssm.json";
  const ET_FC_FALLBACK_CARDS = [
    { id: "fb-bm-1", form: 1, subject: "Bahasa Melayu", bab: 1, chapterTitle: "Amalan Gaya Hidup Sihat", type: "Konsep", front: "Bezakan ejaan 'baharu' dengan 'baru' dalam ayat rasmi.", back: "'Baharu' untuk benda/idea terkini (kasut baharu); 'baru' untuk tempoh masa singkat (baru tiba).", tip: "Kata adjektif menerima imbuhan atau merujuk sifat terkini ialah 'baharu'." },
    { id: "fb-mat-1", form: 1, subject: "Matematik", bab: 1, chapterTitle: "Nombor Nisbah", type: "Soalan Kilat", front: "Berapakah hasil darab bagi (-4) x (-6)?", back: "+24 (negatif darab negatif menghasilkan positif).", tip: "Tanda sama menghasilkan nilai positif; tanda berlainan menghasilkan negatif." },
    { id: "fb-sn-1", form: 1, subject: "Sains", bab: 1, chapterTitle: "Pengenalan Penyiasatan Saintifik", type: "Soalan Kilat", front: "Alat radas manakah paling jitu menyukat isi padu cecair tetap 25.0 cm3?", back: "Pipet (menyukat isi padu tetap dengan kejituan tinggi).", tip: "Bikar hanya untuk menganggar isi padu, manakala buret untuk isi padu titratan berubah." },
    { id: "fb-sej-1", form: 1, subject: "Sejarah", bab: 1, chapterTitle: "Mengenali Sejarah", type: "Konsep", front: "Nyatakan dua perbezaan utama Sumber Primer dan Sumber Sekunder.", back: "Sumber primer ialah bahan asal belum ditafsir (fosil, manuskrip); sumber sekunder ialah bahan penulisan hasil kajian (buku, jurnal).", tip: "Ingat: Primer = asli; Sekunder = olahan pengkaji." },
    { id: "fb-mat-2", form: 2, subject: "Matematik", bab: 1, chapterTitle: "Pola dan Jujukan", type: "Konsep", front: "Apakah maksud Nombor Fibonacci dalam jujukan nombor?", back: "Jujukan yang setiap sebutan selepas dua sebutan pertama ialah hasil tambah dua sebutan sebelumnya (0, 1, 1, 2, 3, 5, 8...).", tip: "Semak dua nombor berturutan sebelumnya sebelum menentukan sebutan seterusnya." },
    { id: "fb-sn-2", form: 2, subject: "Sains", bab: 1, chapterTitle: "Biodiversiti", type: "Konsep", front: "Senaraikan 5 kumpulan haiwan vertebrata.", back: "Ikan, Amfibia, Reptilia, Burung, dan Mamalia.", tip: "Vertebrata mempunyai tulang belakang manakala invertebrata tiada tulang belakang." },
    { id: "fb-mat-3", form: 3, subject: "Matematik", bab: 1, chapterTitle: "Indeks", type: "Soalan Kilat", front: "Permudahkan a^m x a^n menggunakan hukum indeks.", back: "a^(m + n) (asas sama didarab, indeks ditambah).", tip: "Pastikan asas kedua-dua sebutan adalah sama sebelum menambah indeks." },
    { id: "fb-sn-3", form: 3, subject: "Sains", bab: 1, chapterTitle: "Rangsangan dan Gerak Balas", type: "Konsep", front: "Apakah peranan akson dalam sel neuron manusia?", back: "Membawa impuls saraf keluar dari badan sel ke neuron lain atau efektor.", tip: "Dendrit menerima impuls masuk; Akson membawa impuls keluar." },
    { id: "fb-mat-4", form: 4, subject: "Matematik", bab: 1, chapterTitle: "Fungsi dan Persamaan Kuadratik", type: "Konsep", front: "Bagi graf ax^2 + bx + c = 0 apabila a < 0, nyatakan bentuk graf dan jenis titik pegunnya.", back: "Graf melengkung ke bawah (bentuk senyum terbalik) dengan satu titik maksimum.", tip: "a > 0 bentuk U (titik minimum); a < 0 bentuk n (titik maksimum)." },
    { id: "fb-sej-4", form: 4, subject: "Sejarah", bab: 1, chapterTitle: "Warisan Negara Bangsa", type: "Konsep", front: "Apakah maksud konsep 'Daulat' dalam Kesultanan Melayu Melaka?", back: "Kekuasaan tertinggi seseorang sultan terhadap negeri dan rakyatnya.", tip: "Daulat diperkukuh dengan alat kebesaran diraja dan adat istiadat." },
    { id: "fb-mat-5", form: 5, subject: "Matematik", bab: 1, chapterTitle: "Ubahan", type: "Soalan Kilat", front: "Jika y berubah secara langsung dengan kuasa dua x, tuliskan persamaan ubahannya.", back: "y = kx^2 (dengan k ialah pemalar).", tip: "Ubahan langsung meletakkan pemboleh ubah di pengangka bersama pemalar k." },
    { id: "fb-sn-5", form: 5, subject: "Sains", bab: 1, chapterTitle: "Mikroorganisma", type: "Soalan Kilat", front: "Mikroorganisma manakah membantu pengikatan nitrogen dalam nodul akar kekacang?", back: "Bakteria Rhizobium sp. (menukar gas nitrogen kepada nitrat).", tip: "Pokok kekacang memberi perlindungan manakala Rhizobium membekalkan sebatian nitrogen." }
  ];

  let etFcCache_ = null;
  let etFcPromise_ = null;

  function etFcShuffle_(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function etFcLoadCards() {
    if (Array.isArray(etFcCache_)) return Promise.resolve(etFcCache_);
    if (etFcPromise_) return etFcPromise_;
    if (typeof fetch !== "function") return Promise.resolve(ET_FC_FALLBACK_CARDS);
    etFcPromise_ = fetch(ET_FC_DATA_URL)
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (data) {
        const list = data && Array.isArray(data.cards) && data.cards.length ? data.cards : ET_FC_FALLBACK_CARDS;
        etFcCache_ = list;
        return list;
      })
      .catch(function () { return ET_FC_FALLBACK_CARDS; })
      .finally(function () { etFcPromise_ = null; });
    return etFcPromise_;
  }

  function etFcListSubjects(allCards, formNum) {
    const f = Number(formNum) || 0;
    const src = f >= 1 && f <= 5 ? allCards.filter(function (c) { return Number(c.form) === f; }) : allCards;
    return Array.from(new Set(src.map(function (c) { return c.subject; }).filter(Boolean))).sort();
  }

  function etFcBuildSessionDeck(allCards, formNum, subjectFilter, profileSubjects, count) {
    const maxN = Math.max(4, Number(count) || 8);
    const f = Number(formNum) || 5;
    const sub = String(subjectFilter || "ALL");
    let pool = allCards.filter(function (c) { return Number(c.form) === f; });
    if (sub !== "ALL") {
      const subPool = pool.filter(function (c) { return c.subject === sub; });
      if (subPool.length) pool = subPool;
    } else if (Array.isArray(profileSubjects) && profileSubjects.length) {
      const pref = pool.filter(function (c) { return profileSubjects.indexOf(c.subject) !== -1; });
      if (pref.length >= 4) pool = pref;
    }
    if (!pool.length) pool = allCards.slice();
    return etFcShuffle_(pool).slice(0, maxN);
  }

  // --- [features/flashcards/flashcardModalController.js] ---
  /**
   * src/features/flashcards/flashcardModalController.js
   * Pengawal dialog #etFlashcardDialog: kad terbalik interaktif KSSM T1-T5,
   * ulangan berjarak ('Ulang Semula' vs 'Sudah Ingat! +10 XP'), kombo & segerak XP.
   */







  const ET_FC_SESSION_SIZE = 8;
  const etFcState = {
    bound: false, cards: [], queue: [], activeCard: null, totalCards: 0,
    mastered: 0, misses: 0, combo: 0, bestCombo: 0, sessionXp: 0,
    flipped: false, formNum: 5, subjectFilter: "ALL", sessionDone: false
  };

  function etFcSetText_(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
  function etFcGetEl_(id) { return document.getElementById(id); }

  function etFcResolveDefaultForm_() {
    let profile = null;
    try { profile = typeof getStudentProfile === "function" ? getStudentProfile() : null; } catch (e) {}
    const active = typeof getActiveFormFilter === "function" ? getActiveFormFilter() : "";
    const raw = active && active !== "ALL" ? active : ((profile && profile.currentForm) || "T5");
    const num = Number(String(raw).replace(/\D/g, "")) || 5;
    return { formNum: Math.max(1, Math.min(5, num)), subjects: (profile && Array.isArray(profile.selectedSubjects)) ? profile.selectedSubjects : [] };
  }

  function etFcSyncHud_() {
    const curIdx = Math.min(etFcState.totalCards, etFcState.mastered + 1);
    etFcSetText_("etFcCounterBadge", "Kad " + curIdx + " / " + Math.max(1, etFcState.totalCards));
    etFcSetText_("etFcComboBadge", "Kombo x" + etFcState.combo);
    etFcSetText_("etFcXpBadge", "+" + etFcState.sessionXp + " XP");
    const pct = etFcState.totalCards ? Math.round((etFcState.mastered / etFcState.totalCards) * 100) : 0;
    const fill = etFcGetEl_("etFcProgressFill");
    if (fill) fill.style.width = pct + "%";
  }

  function etFcSyncFlipUi_(isFlipped) {
    etFcState.flipped = Boolean(isFlipped);
    const btn = etFcGetEl_("etFcCardBtn"), flipRow = etFcGetEl_("etFcFlipRow"), rateRow = etFcGetEl_("etFcRateRow");
    if (btn) {
      btn.classList.toggle("is-flipped", etFcState.flipped);
      btn.setAttribute("aria-pressed", etFcState.flipped ? "true" : "false");
    }
    if (flipRow) flipRow.hidden = etFcState.flipped;
    if (rateRow) rateRow.hidden = !etFcState.flipped;
  }

  function etFcRenderCurrentCard_() {
    const stage = etFcGetEl_("etFcStage"), sum = etFcGetEl_("etFcSummary");
    if (!etFcState.queue.length) {
      if (stage) stage.hidden = true;
      if (sum) sum.hidden = false;
      const totalAttempts = Math.max(1, etFcState.mastered + etFcState.misses);
      const acc = Math.round((etFcState.mastered / totalAttempts) * 100);
      etFcSetText_("etFcSumMastered", etFcState.mastered + " / " + etFcState.totalCards);
      etFcSetText_("etFcSumAccuracy", acc + "%");
      etFcSetText_("etFcSumCombo", "x" + etFcState.bestCombo);
      etFcSetText_("etFcSumXp", "+" + etFcState.sessionXp + " XP");
      if (!etFcState.sessionDone) {
        etFcState.sessionDone = true;
        if (typeof etGamifRecordEvent === "function") {
          etGamifRecordEvent("flashcard_complete", { mastered: etFcState.mastered, accuracy: acc, bestCombo: etFcState.bestCombo, xp: etFcState.sessionXp });
        }
        if (typeof etMascot3dCelebrate === "function") { try { etMascot3dCelebrate("reward"); } catch (e) {} }
        if (typeof showToast === "function") showToast("Hebat! Sesi Flashcard tamat (+" + etFcState.sessionXp + " XP).");
      }
      return;
    }

    const card = etFcState.queue[0];
    etFcState.activeCard = card;
    if (stage) stage.hidden = false;
    if (sum) sum.hidden = true;
    etFcSyncFlipUi_(false);
    etFcSetText_("etFcFrontMeta", card.subject + " • Ting. " + card.form + " • Bab " + card.bab);
    etFcSetText_("etFcBackMeta", card.subject + " • Bab " + card.bab);
    etFcSetText_("etFcTypeTag", card.type || "Konsep");
    etFcSetText_("etFcChapterTitle", card.chapterTitle || "");
    etFcSetText_("etFcFrontText", card.front || "");
    etFcSetText_("etFcBackText", card.back || "");
    etFcSetText_("etFcTipText", card.tip || "Fokus pada kata kunci jawapan mengikut DSKP KSSM.");
    etFcSyncHud_();
  }

  function etFcSyncSelectors_(allCards) {
    const formSel = etFcGetEl_("etFcFormSelect"), subSel = etFcGetEl_("etFcSubjectSelect");
    if (formSel) formSel.value = String(etFcState.formNum);
    if (!subSel) return;
    const subs = etFcListSubjects(allCards, etFcState.formNum);
    subSel.innerHTML = '<option value="ALL">Subjek Pilihan / Semua</option>' +
      subs.map(function (s) { return '<option value="' + s.replace(/"/g, "&quot;") + '">' + s + "</option>"; }).join("");
    if (subs.indexOf(etFcState.subjectFilter) === -1) etFcState.subjectFilter = "ALL";
    subSel.value = etFcState.subjectFilter;
  }

  function etFcStartSession_() {
    const resolved = etFcResolveDefaultForm_();
    const deck = etFcBuildSessionDeck(etFcState.cards, etFcState.formNum, etFcState.subjectFilter, resolved.subjects, ET_FC_SESSION_SIZE);
    etFcState.queue = deck.slice();
    etFcState.totalCards = deck.length;
    etFcState.mastered = 0;
    etFcState.misses = 0;
    etFcState.combo = 0;
    etFcState.bestCombo = 0;
    etFcState.sessionXp = 0;
    etFcState.sessionDone = false;
    etFcRenderCurrentCard_();
  }

  function etFcAnswer_(known) {
    if (!etFcState.queue.length || !etFcState.flipped) return;
    const cur = etFcState.queue.shift();
    if (known) {
      etFcState.mastered += 1;
      etFcState.combo += 1;
      etFcState.bestCombo = Math.max(etFcState.bestCombo, etFcState.combo);
      const gain = etFcState.combo >= 3 ? 15 : 10;
      etFcState.sessionXp += gain;
      try { if (typeof etMiniSfxLand === "function") etMiniSfxLand(etFcState.combo >= 3, etFcState.combo); } catch (e) {}
    } else {
      etFcState.misses += 1;
      etFcState.combo = 0;
      const insertAt = Math.min(3, etFcState.queue.length);
      etFcState.queue.splice(insertAt, 0, cur);
      try { if (typeof etMiniSfxQuiz === "function") etMiniSfxQuiz("wrong"); } catch (e) {}
    }
    etFcRenderCurrentCard_();
  }

  function etFcFlip_() {
    if (!etFcState.queue.length) return;
    etFcSyncFlipUi_(!etFcState.flipped);
    try { if (typeof etMiniSfxQuiz === "function") etMiniSfxQuiz("open"); } catch (e) {}
  }

  function etFcBind_() {
    if (etFcState.bound) return;
    etFcState.bound = true;
    const dlg = etFcGetEl_("etFlashcardDialog");
    if (!dlg) return;
    bindLightDismissFallback(dlg);

    dlg.addEventListener("click", function (e) {
      if (e.target.closest("#etFcCloseBtn") || e.target.closest("#etFcDoneBtn")) { closeTopLayer(dlg); return; }
      if (e.target.closest("#etFcCardBtn") || e.target.closest("#etFcFlipBtn")) { etFcFlip_(); return; }
      if (e.target.closest("#etFcKnowBtn")) { etFcAnswer_(true); return; }
      if (e.target.closest("#etFcAgainBtn")) { etFcAnswer_(false); return; }
      if (e.target.closest("#etFcRestartBtn")) { etFcStartSession_(); return; }
      const muteBtn = e.target.closest("#etFcMuteBtn");
      if (muteBtn && typeof etMiniSfxSetMuted === "function" && typeof etMiniSfxIsMuted === "function") {
        const m = etMiniSfxSetMuted(!etMiniSfxIsMuted());
        muteBtn.setAttribute("aria-pressed", m ? "true" : "false");
        const wave = etFcGetEl_("etFcSoundWave");
        if (wave) wave.style.opacity = m ? "0.2" : "1";
      }
    });

    const formSel = etFcGetEl_("etFcFormSelect"), subSel = etFcGetEl_("etFcSubjectSelect");
    if (formSel) formSel.addEventListener("change", function () {
      etFcState.formNum = Math.max(1, Math.min(5, Number(formSel.value) || 5));
      etFcSyncSelectors_(etFcState.cards);
      etFcStartSession_();
    });
    if (subSel) subSel.addEventListener("change", function () {
      etFcState.subjectFilter = subSel.value || "ALL";
      etFcStartSession_();
    });

    window.addEventListener("keydown", function (e) {
      if (!dlg.open) return;
      if (e.code === "Space") {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === "SELECT") return;
        e.preventDefault(); etFcFlip_();
      } else if (e.key === "ArrowRight" && etFcState.flipped) {
        e.preventDefault(); etFcAnswer_(true);
      } else if (e.key === "ArrowLeft" && etFcState.flipped) {
        e.preventDefault(); etFcAnswer_(false);
      }
    });
  }

  async function etFlashcardModalOpen(opts) {
    const dlg = etFcGetEl_("etFlashcardDialog");
    if (!dlg) return false;
    etFcBind_();
    const def = etFcResolveDefaultForm_();
    etFcState.formNum = (opts && opts.formNum) ? Number(opts.formNum) : def.formNum;
    etFcState.subjectFilter = (opts && opts.subject) ? String(opts.subject) : "ALL";
    if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
    etFcState.cards = await etFcLoadCards();
    etFcSyncSelectors_(etFcState.cards);
    etFcStartSession_();
    const cardBtn = etFcGetEl_("etFcCardBtn");
    if (cardBtn) cardBtn.focus();
    return true;
  }

  function etFlashcardModalClose() { const d = etFcGetEl_("etFlashcardDialog"); if (d && d.open) closeTopLayer(d); }
  function etFlashcardModalInit() {
    etFcBind_();
    if (typeof window !== "undefined") window.etFlashcardModalOpen = etFlashcardModalOpen;
    if (typeof document !== "undefined" && !document.documentElement.dataset.etFcGlobalTrigger) {
      document.documentElement.dataset.etFcGlobalTrigger = "1";
      document.addEventListener("click", function (e) {
        const btn = e.target.closest(".js-open-flashcard, [data-open-flashcard]");
        if (btn) etFlashcardModalOpen();
      });
    }
  }

  // --- [features/gamification/eduquestSvgArt.js] ---
  /**
   * src/features/gamification/eduquestSvgArt.js
   * Pembina grafik SVG pelbagai warna berkilat ala EduQuest (Perisai Tahap, 6 Lencana Hex & Ikon HUD).
   */

  function etEqLevelCrestSvg(level) {
    const lvl = Math.max(1, Number(level) || 1);
    return '<svg class="et-eq-crest-svg" viewBox="0 0 44 48" aria-hidden="true">' +
      '<defs><linearGradient id="eqCrestG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#4338ca"/></linearGradient>' +
      '<linearGradient id="eqRimG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>' +
      '<path d="M22 3L39 10v13c0 11-7 18-17 22C12 41 5 34 5 23V10L22 3z" fill="url(#eqCrestG)" stroke="url(#eqRimG)" stroke-width="2.6"/>' +
      '<text x="22" y="18" text-anchor="middle" fill="#fde68a" font-size="7.2" font-weight="900" font-family="system-ui,sans-serif">TAHAP</text>' +
      '<text x="22" y="32" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900" font-family="system-ui,sans-serif">' + lvl + "</text></svg>";
  }

  function etEqBadgeArtSvg(badgeId, unlocked) {
    const locked = !unlocked;
    const palettes = {
      pemula_kssm: { a: "#fb923c", b: "#c2410c", rim: "#fde047", ico: '<polygon points="24 14 27 20 34 21 29 26 30 33 24 29.5 18 33 19 26 14 21 21 20" fill="#fef08a" stroke="#fff" stroke-width="1"/>' },
      raja_streak: { a: "#f59e0b", b: "#b91c1c", rim: "#fde68a", ico: '<path d="M25 12c.5 4.2 4.5 6.4 5.4 10.6.8 3.6-1.9 7.4-6.4 7.4-4.2 0-7-3.4-5.7-7.7.8-2.6 2.5-4 3.4-6.1 1.2 1.8 2.4 2.3 3.2 1.5-.3-2.1-.1-3.9.1-5.7z" fill="#fef3c7"/>' },
      juara_kilat: { a: "#8b5cf6", b: "#4338ca", rim: "#c4b5fd", ico: '<polygon points="26 12 16 25 23.5 25 22 36 32 23 24.5 23" fill="#fde047"/>' },
      pengembara_bab: { a: "#10b981", b: "#047857", rim: "#a7f3d0", ico: '<path d="M15 16h7a2 2 0 012 2v13h-8a1.5 1.5 0 01-1.5-1.5V16zm18 0h-7a2 2 0 00-2 2v13h8a1.5 1.5 0 001.5-1.5V16z" fill="#ecfdf5"/>' },
      cikgu_ai_pro: { a: "#38bdf8", b: "#1d4ed8", rim: "#bae6fd", ico: '<rect x="15" y="16" width="18" height="13" rx="4" fill="#e0f2fe"/><circle cx="20.5" cy="22.5" r="2" fill="#0369a1"/><circle cx="27.5" cy="22.5" r="2" fill="#0369a1"/><path d="M24 12v4" stroke="#bae6fd" stroke-width="2.2" stroke-linecap="round"/>' },
      skor_a_plus: { a: "#eab308", b: "#92400e", rim: "#fef08a", ico: '<path d="M14 29l2.5-11 7.5 5 7.5-5 2.5 11H14zm2 3h16" fill="#fef9c3"/>' }
    };
    const cfg = palettes[badgeId] || palettes.pemula_kssm;
    const gId = "eqB_" + String(badgeId || "def").replace(/[^a-z0-9]/gi, "");
    const grad = '<linearGradient id="' + gId + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + cfg.a + '" stop-opacity="' + (locked ? "0.42" : "1") + '"/><stop offset="100%" stop-color="' + cfg.b + '" stop-opacity="' + (locked ? "0.62" : "1") + '"/></linearGradient>';
    const lockOverlay = locked ? '<g transform="translate(15 15) scale(0.55)"><circle cx="24" cy="24" r="16" fill="rgba(8,21,51,0.88)" stroke="#94a3b8" stroke-width="2.5"/><rect x="17" y="22" width="14" height="10" rx="2.5" fill="#e2e8f0"/><path d="M20 22v-3a4 4 0 018 0v3" fill="none" stroke="#e2e8f0" stroke-width="2.5"/></g>' : "";
    return '<svg class="et-eq-badge-svg" viewBox="0 0 48 48" aria-hidden="true"><defs>' + grad + "</defs>" +
      '<polygon points="24 3 42 13.2 42 34.8 24 45 6 34.8 6 13.2" fill="url(#' + gId + ')" stroke="' + (locked ? "#64748b" : cfg.rim) + '" stroke-width="2.6"/>' +
      cfg.ico + lockOverlay + "</svg>";
  }

  function etEqIconSvg(name) {
    const icons = {
      flame: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12.5 2c.4 3.8 4 5.8 5 9.4.6 2.2.2 4.8-1.4 6.6A6 6 0 016.5 17.5c-1.4-1.9-1.5-4.5-.3-6.6.8-1.5 2-2.6 2.5-4.3 1 1.4 2.1 1.9 2.8 1.3-.3-2.2.2-4.2 1-5.9z" fill="#fb923c"/><path d="M12 10.5c.3 1.7 1.9 2.8 2.2 4.5a2.6 2.6 0 01-4.8 1.2c-.6-1-.4-2.3.5-3.4.5.5 1 .7 1.5.4-.1-.9.2-1.8.6-2.7z" fill="#fde047"/></svg>',
      gem: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><polygon points="6 4 18 4 22 9 12 21 2 9" fill="#38bdf8" stroke="#bae6fd" stroke-width="1.4"/><polygon points="6 4 18 4 15 9 9 9" fill="#7dd3fc"/></svg>',
      cards: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="6" width="13" height="15" rx="2.5" fill="rgba(255,255,255,0.18)"/><rect x="8" y="3" width="13" height="15" rx="2.5"/></svg>',
      chest: '<svg viewBox="0 0 32 28" width="28" height="24" aria-hidden="true"><rect x="3" y="9" width="26" height="16" rx="3.5" fill="#d97706" stroke="#fde047" stroke-width="1.8"/><path d="M4 10c0-4 5-7 12-7s12 3 12 7" fill="#f59e0b" stroke="#fde047" stroke-width="1.6"/><rect x="3" y="13" width="26" height="3" fill="#78350f"/><rect x="13" y="11" width="6" height="7" rx="1.5" fill="#fde047"/></svg>',
      star: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3" fill="#fbbf24"/></svg>',
      starDim: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3" fill="#475569"/></svg>',
      check: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ffffff" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      book: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"/></svg>',
      camera: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h3l2-3h6l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.5"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4m-5-17h10v5a5 5 0 01-10 0V4zM7 6H4v2a3 3 0 003 3m10-5h3v2a3 3 0 01-3 3"/></svg>',
      map: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21" stroke-linejoin="round"/><line x1="8" y1="3" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="21"/></svg>',
      gear: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path stroke-linecap="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
      crown1: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#fef08a" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" fill="#78350f" font-size="11" font-weight="900">1</text></svg>',
      crown2: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#cbd5e1" stroke="#f8fafc" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" fill="#1e293b" font-size="11" font-weight="900">2</text></svg>',
      crown3: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#fde68a" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" fill="#451a03" font-size="11" font-weight="900">3</text></svg>'
    };
    return icons[name] || icons.star;
  }

  // --- [features/gamification/eduquestClearance.js] ---
  /**
   * src/features/gamification/eduquestClearance.js
   * Pengiraan status clearance gabungan KSSM + Nota Interaktif, bintang (0-3) & penukar subjek aktif EduQuest.
   */

  const ET_EQ_SUBJ_KEY = "etutor_eduquest_subject_v1";
  const ET_EQ_NOTA_KEY = "etutor_nota_progress_v1";
  const ET_EQ_KSSM_URL = "./kssm/manifest.json";
  const ET_EQ_NOTA_URL = "./nota-interaktif/manifest.json";

  const ET_EQ_SUBJ_DEFS = [
    { name: "Bahasa Melayu", short: "BM", slug: "bahasa-melayu", world: "Kepulauan Melayu", theme: "bm", img: "./images/game-map/world-bm.jpg" },
    { name: "Bahasa Inggeris", short: "BI", slug: "bahasa-inggeris", world: "Taman Pustaka Bahasa", theme: "bi", img: "./images/game-map/world-bi.jpg" },
    { name: "Matematik", short: "Matematik", slug: "matematik", world: "Kota Geometri & Nombor", theme: "math", img: "./images/game-map/world-math.jpg" },
    { name: "Sains", short: "Sains", slug: "sains", world: "Makmal Sains Pintar", theme: "sains", img: "./images/game-map/world-sains.jpg" },
    { name: "Sejarah", short: "Sejarah", slug: "sejarah", world: "Kota Warisan & Manuskrip", theme: "sejarah", img: "./images/game-map/world-sejarah.jpg" },
    { name: "Pendidikan Islam", short: "P. Islam", slug: "pendidikan-islam", world: "Taman Cahaya Ilmu", theme: "pi", img: "./images/game-map/world-pi.jpg" },
    { name: "Geografi", short: "Geografi", slug: "geografi", world: "Lembah Peta & Kompas", theme: "geo", img: "./images/game-map/world-geo.jpg" },
    { name: "Fizik", short: "Fizik", slug: "fizik", world: "Stesen Daya & Tenaga", theme: "sains", img: "./images/game-map/world-sains.jpg" },
    { name: "Kimia", short: "Kimia", slug: "kimia", world: "Makmal Molekul & Reaksi", theme: "sains", img: "./images/game-map/world-sains.jpg" },
    { name: "Biologi", short: "Biologi", slug: "biologi", world: "Taman Sel & Ekosistem", theme: "geo", img: "./images/game-map/world-geo.jpg" },
    { name: "Matematik Tambahan", short: "Add Math", slug: "matematik-tambahan", world: "Menara Kalkulus & Vektor", theme: "math", img: "./images/game-map/world-math.jpg" },
    { name: "Pendidikan Moral", short: "P. Moral", slug: "pendidikan-moral", world: "Balai Etika & Integriti", theme: "sejarah", img: "./images/game-map/world-sejarah.jpg" }
  ];
  const ET_EQ_UPPER_SLUGS = ["fizik", "kimia", "biologi", "matematik-tambahan", "pendidikan-moral"];

  let etEqManifestCache_ = null;
  let etEqManifestPromise_ = null;

  function etEqGetSubjDef(nameOrSlug) {
    const q = String(nameOrSlug || "").trim().toLowerCase();
    return ET_EQ_SUBJ_DEFS.find(function (d) {
      return d.name.toLowerCase() === q || d.slug === q || d.short.toLowerCase() === q;
    }) || ET_EQ_SUBJ_DEFS[2];
  }

  function etEqGetValidSubjects(formNum) {
    const n = Number(formNum) || 5;
    return ET_EQ_SUBJ_DEFS.filter(function (d) {
      if (d.slug === "geografi") return n <= 3;
      if (ET_EQ_UPPER_SLUGS.indexOf(d.slug) !== -1) return n >= 4;
      return true;
    });
  }

  function etEqGetActiveSubject(profile, formNum) {
    const valid = etEqGetValidSubjects(formNum);
    let saved = "";
    try {
      if (typeof localStorage !== "undefined") saved = localStorage.getItem(ET_EQ_SUBJ_KEY) || "";
    } catch (e) {}
    const fromSaved = valid.find(function (d) { return d.name === saved || d.slug === saved; });
    if (fromSaved) return fromSaved;
    const picked = (profile && Array.isArray(profile.selectedSubjects)) ? profile.selectedSubjects : [];
    const fromProfile = valid.find(function (d) { return picked.indexOf(d.name) !== -1; });
    return fromProfile || valid.find(function (d) { return d.slug === "matematik"; }) || valid[0];
  }

  function etEqSetActiveSubject(nameOrSlug) {
    const def = etEqGetSubjDef(nameOrSlug);
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(ET_EQ_SUBJ_KEY, def.name);
    } catch (e) {}
    return def;
  }

  function etEqCalcChapterStars(rec) {
    const xp = rec ? Math.max(0, Number(rec.earnedXp) || 0) : 0;
    if (xp >= 80) return 3;
    if (xp >= 50) return 2;
    return xp > 0 ? 1 : 0;
  }

  function etEqCalcNotaStars(rec, unitCount) {
    if (!rec || typeof rec !== "object") return 0;
    const done = Math.max(0, Number(rec.completedUnits) || 0);
    const tot = Math.max(1, Number(rec.totalUnits) || Number(unitCount) || 6);
    const pct = (done / tot) * 100;
    const xp = Math.max(0, Number(rec.xp) || 0);
    if (pct >= 80) return 3;
    if (pct >= 50) return 2;
    return (done > 0 || xp > 0) ? 1 : 0;
  }

  function etEqReadNotaProgress_() {
    try {
      if (typeof localStorage === "undefined") return {};
      const raw = localStorage.getItem(ET_EQ_NOTA_KEY);
      const p = raw ? JSON.parse(raw) : {};
      return p && typeof p === "object" ? p : {};
    } catch (e) { return {}; }
  }

  function etEqLoadManifest() {
    if (etEqManifestCache_) return Promise.resolve(etEqManifestCache_);
    if (etEqManifestPromise_) return etEqManifestPromise_;
    if (typeof fetch !== "function") return Promise.resolve({ kssm: [], nota: [] });
    const grab = function (url) {
      return fetch(url).then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; });
    };
    etEqManifestPromise_ = Promise.all([grab(ET_EQ_KSSM_URL), grab(ET_EQ_NOTA_URL)])
      .then(function (res) {
        const kList = res[0] && Array.isArray(res[0].chapters) ? res[0].chapters : (Array.isArray(res[0]) ? res[0] : []);
        const nList = res[1] && Array.isArray(res[1].chapters) ? res[1].chapters : (Array.isArray(res[1]) ? res[1] : []);
        etEqManifestCache_ = { kssm: kList, nota: nList };
        return etEqManifestCache_;
      })
      .finally(function () { etEqManifestPromise_ = null; });
    return etEqManifestPromise_;
  }

  function etEqGetCachedManifest() {
    return etEqManifestCache_ || { kssm: [], nota: [] };
  }

  function etEqComputeClearance(formNum, subjectNameOrSlug, kssmMap, manifestBundle) {
    const num = Number(formNum) || 5;
    const def = etEqGetSubjDef(subjectNameOrSlug);
    const map = kssmMap && typeof kssmMap === "object" ? kssmMap : {};
    const notaProg = etEqReadNotaProgress_();
    const bundle = manifestBundle && !Array.isArray(manifestBundle) ? manifestBundle : etEqGetCachedManifest();
    const kList = Array.isArray(bundle.kssm) ? bundle.kssm : [];
    const nList = Array.isArray(bundle.nota) ? bundle.nota : [];

    const byBab = {};
    kList.forEach(function (c) {
      if (Number(c.form) === num && String(c.subjectSlug || "") === def.slug) {
        const b = Number(c.bab) || 1;
        byBab[b] = byBab[b] || { bab: b };
        byBab[b].kssm = c;
      }
    });
    nList.forEach(function (n) {
      if (Number(n.form) === num && String(n.subject || "").toLowerCase() === def.name.toLowerCase()) {
        const b = Number(n.chapterNumber) || 1;
        byBab[b] = byBab[b] || { bab: b };
        byBab[b].nota = n;
      }
    });

    let babs = Object.keys(byBab).map(Number).sort(function (a, b) { return a - b; });
    if (!babs.length && ET_EQ_UPPER_SLUGS.indexOf(def.slug) === -1) {
      [1, 2].forEach(function (b) {
        byBab[b] = { bab: b, kssm: { form: num, subject: def.name, subjectSlug: def.slug, bab: b, title: "Bab " + b + " " + def.name, url: "/kssm/tingkatan-" + num + "/" + def.slug + "/bab-" + b + "/", playableNoteId: "" } };
      });
      babs = [1, 2];
    }

    let clearedCount = 0, fullStarCount = 0, totalStars = 0, totalVideos = 0;
    const chapters = babs.map(function (b) {
      const slot = byBab[b], k = slot.kssm, n = slot.nota;
      const key = def.slug + "-t" + num + "-bab-" + b;
      const kRec = map[key] || null;
      const notaId = (n && n.id) || (k && k.playableNoteId) || "";
      const nRec = notaId ? (notaProg[notaId] || null) : null;
      const kXp = kRec ? Math.max(0, Number(kRec.earnedXp) || 0) : 0;
      const nXp = nRec ? Math.max(0, Number(nRec.xp) || 0) : 0;
      const stars = Math.max(etEqCalcChapterStars(kRec), etEqCalcNotaStars(nRec, n && n.unitCount));
      const earnedXp = Math.max(kXp, nXp);
      const videoCount = (n && Number(n.videoCount)) || 0;
      totalVideos += videoCount;
      if (stars > 0 || earnedXp > 0) clearedCount += 1;
      if (stars === 3) fullStarCount += 1;
      totalStars += stars;
      const isNotaOnly = !k && Boolean(notaId);
      const tajukId = notaId || key;
      const href = "./eduquest/?form=" + num + "&subject=" + encodeURIComponent(def.slug) + "&tajuk=" + encodeURIComponent(tajukId);
      return {
        key: key, bab: b, notaId: notaId, isNotaOnly: isNotaOnly, videoCount: videoCount,
        title: (n && n.title) || (k && k.title) || ("Bab " + b),
        href: href, earnedXp: earnedXp, stars: stars,
        isCleared: stars > 0 || earnedXp > 0, isFull: stars === 3
      };
    });

    const totalChapters = chapters.length;
    const maxStars = totalChapters * 3;
    const pct = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;
    return {
      formNum: num, subject: def, chapters: chapters, totalChapters: totalChapters,
      clearedCount: clearedCount, fullStarCount: fullStarCount, totalStars: totalStars,
      maxStars: maxStars, pct: pct, totalVideos: totalVideos,
      nextChapter: chapters.find(function (c) { return c.stars < 3; }) || chapters[0],
      eduquestHref: "./eduquest/?form=" + num + "&subject=" + encodeURIComponent(def.slug)
    };
  }

  // --- [features/gamification/questPathView.js] ---
  /**
   * src/features/gamification/questPathView.js
   * Kad Status Clearance EduQuest & Penukar Subjek di #portal (#etQuestPathStage).
   */







  let etQuestPathEventsBound_ = false;
  let etQuestManifestRequested_ = false;

  function etQuestPathLaunchFlashcard_() {
    if (typeof window !== "undefined" && typeof window.etFlashcardModalOpen === "function") {
      window.etFlashcardModalOpen();
      return;
    }
    showToast("Arena Flashcard sedang dimuatkan...");
  }

  function etQuestStarsHtml_(stars) {
    return '<span class="et-eq-pin-stars">' +
      [1, 2, 3].map(function (n) { return etEqIconSvg(n <= stars ? "star" : "starDim"); }).join("") +
      "</span>";
  }

  function etQuestPathRender() {
    const host = document.getElementById("etQuestPathStage");
    if (!host) return;
    const profile = getStudentProfile();
    const active = getActiveFormFilter();
    const formCode = active && active !== "ALL" ? active : (profile.currentForm || "T5");
    const formNum = Number(String(formCode).replace(/\D/g, "")) || 5;
    const gState = etGamifGetState();
    const activeSubj = etEqGetActiveSubject(profile, formNum);
    const validSubjs = etEqGetValidSubjects(formNum);
    const manifest = etEqGetCachedManifest();

    if ((!manifest || (!manifest.kssm.length && !manifest.nota.length)) && !etQuestManifestRequested_) {
      etQuestManifestRequested_ = true;
      etEqLoadManifest().then(function () { etQuestPathRender(); });
    }

    const clr = etEqComputeClearance(formNum, activeSubj.slug, gState.kssmChapters, manifest);
    const chestDone = Boolean(gState.chestClaimedToday);
    const barPct = Math.max(8, clr.pct);

    const subjPillsHtml = validSubjs.map(function (s) {
      const isAct = s.slug === clr.subject.slug;
      return '<button type="button" class="et-eq-subj-pill' + (isAct ? " is-active" : "") +
        '" data-qpath-subj="' + escapeHtml(s.slug) + '">' + escapeHtml(s.short) + "</button>";
    }).join("");

    const previewLimit = clr.chapters.length > 6 ? 5 : 6;
    const chapChipsList = clr.chapters.slice(0, previewLimit).map(function (ch) {
      const cls = ch.isFull ? "is-full" : (ch.isCleared ? "is-partial" : "");
      const statusTxt = ch.isFull ? "Penuh" : (ch.isCleared ? "Boleh Ulang" : "Belum");
      const inner = '<div class="et-eq-clr-chip-top"><strong>Bab ' + ch.bab + "</strong><span>" + statusTxt + "</span></div>" +
        '<div class="et-eq-clr-chip-stars">' + etQuestStarsHtml_(ch.stars) + "</div>";
      return '<a class="et-eq-clr-chip ' + cls + ' js-qpath-bab-link" href="' + escapeHtml(ch.href) + '">' + inner + "</a>";
    });
    if (clr.chapters.length > 6) {
      chapChipsList.push(
        '<a class="et-eq-clr-chip" href="' + escapeHtml(clr.eduquestHref) + '">' +
        '  <div class="et-eq-clr-chip-top"><strong>+' + (clr.chapters.length - 5) + ' Lagi</strong><span>EduQuest &rarr;</span></div>' +
        '  <div class="et-eq-clr-chip-top"><span>Lihat ' + clr.totalChapters + " bab</span></div></a>"
      );
    }
    const chapChipsHtml = chapChipsList.join("");

    host.innerHTML = [
      '<div class="et-eq-map-card is-seamless" data-eq-theme="' + escapeHtml(clr.subject.theme) + '">',
      '  <img class="et-eq-clr-bg-img" src="' + escapeHtml(clr.subject.img) + '" alt="' + escapeHtml(clr.subject.world) + '" decoding="async">',
      '  <div class="et-eq-clr-content">',
      '    <div class="et-eq-map-head">',
      '      <div class="et-eq-map-title-wrap"><span class="et-eq-map-kicker">STATUS CLEARANCE EDUQUEST &bull; TINGKATAN ' + formNum + "</span>",
      '        <h3>' + escapeHtml(clr.subject.world) + " &bull; " + escapeHtml(clr.subject.name) + "</h3></div>",
      '      <div class="et-eq-map-prog"><div class="et-eq-map-prog-track"><span style="width:' + barPct + '%"></span></div>' +
        '<strong class="tabular-nums">' + clr.totalStars + "/" + clr.maxStars + " Bintang (" + clr.pct + "%)</strong></div>",
      "    </div>",
      '    <div class="et-eq-subj-bar" role="group" aria-label="Pilih Subjek EduQuest">' + subjPillsHtml + "</div>",
      '    <div class="et-eq-clr-cta-row">',
      '      <a class="et-eq-play-cta is-clr-cta" href="' + escapeHtml(clr.eduquestHref) + '">' + etEqIconSvg("map") + "<span>Buka EduQuest " + escapeHtml(clr.subject.short) + " &rarr;</span></a>",
      (clr.totalVideos > 0 ? '      <span class="et-eq-clr-pct-pill tabular-nums">' + clr.totalVideos + " Video Penerangan</span>" : ""),
      '      <span class="et-eq-clr-pct-pill tabular-nums">' + clr.clearedCount + "/" + clr.totalChapters + " Bab &bull; " + clr.pct + "%</span>",
      "    </div>",
      '    <div class="et-eq-clr-body">',
      '      <div class="et-eq-clr-stats">',
      '        <div class="et-eq-clr-stat"><span>Bab Selesai</span><strong class="tabular-nums">' + clr.clearedCount + " / " + clr.totalChapters + "</strong></div>",
      '        <div class="et-eq-clr-stat"><span>Bintang Terkumpul</span><strong class="tabular-nums">' + clr.totalStars + " / " + clr.maxStars + " ★</strong></div>",
      '        <div class="et-eq-clr-stat"><span>Bab Penuh 3★</span><strong class="tabular-nums">' + clr.fullStarCount + " / " + clr.totalChapters + "</strong></div>",
      "      </div>",
      '      <div class="et-eq-clr-chips">' + chapChipsHtml + "</div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("\n");

    etQuestPathBindEvents_();
  }

  function etQuestPathBindEvents_() {
    if (etQuestPathEventsBound_ || typeof document === "undefined") return;
    etQuestPathEventsBound_ = true;
    document.addEventListener("click", function (e) {
      const subjBtn = e.target.closest("[data-qpath-subj]");
      if (subjBtn) {
        etEqSetActiveSubject(subjBtn.getAttribute("data-qpath-subj"));
        etQuestPathRender();
        return;
      }
      if (e.target.closest(".js-qpath-start-flashcard")) {
        etQuestPathLaunchFlashcard_();
        return;
      }
      const chestBtn = e.target.closest(".js-qpath-claim-chest");
      if (chestBtn) {
        const cid = chestBtn.getAttribute("data-chest-id") || "daily_chest";
        const res = etGamifClaimChest(cid);
        if (res && res.ok) showToast("Tahniah! Peti Bonus Harian dibuka (+" + res.xpAdded + " XP).");
        else showToast("Peti Bonus Harian hari ini sudah dituntut. Kembali esok!");
        return;
      }
      if (e.target.closest(".js-qpath-goto-latihan")) {
        setActiveWorkspaceTab("latihan");
        const target = document.getElementById("moduleDropdownKlon") || document.querySelector(".portal-modules-stack");
        if (target) setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
      }
    });
  }

  // --- [features/gamification/gamificationSidebarView.js] ---
  /**
   * src/features/gamification/gamificationSidebarView.js
   * HUD Permainan Atas (#etTopGameHud), Rel Kiri Misi & Lencana (#etGamifLeftRail)
   * dan Rel Kanan Liga Emas, Carta Mingguan & Ganjaran Streak (#etGamifRightRail).
   */








  let etGamifSideEventsBound_ = false;
  let etGamifSideActiveNav_ = "path";

  function etGamifSideFormInfo_(profile) {
    const f = getActiveFormFilter();
    const num = Number(String(f && f !== "ALL" ? f : (profile.currentForm || "T5")).replace(/\D/g, "")) || 5;
    return { num: num, label: f === "ALL" ? "Semua Tingkatan" : "Tingkatan " + num };
  }

  function etGamifRenderTopHud_(gState) {
    const hud = document.getElementById("etTopGameHud");
    if (!hud) return;
    const pct = Math.max(8, Number(gState.levelPct) || 0);
    hud.innerHTML = [
      '<div class="et-eq-hud-xpbox">',
      '  ' + etEqLevelCrestSvg(gState.level),
      '  <div class="et-eq-hud-barwrap">',
      '    <div class="et-eq-hud-xprow"><strong class="tabular-nums">Tahap ' + gState.level + '</strong><span class="tabular-nums">' + gState.xpIntoLevel + " / " + gState.xpNextLevel + " XP</span></div>",
      '    <div class="et-eq-hud-track"><span style="width:' + pct + '%"></span></div>',
      "  </div>",
      "</div>",
      '<div class="et-eq-hud-chip is-streak tabular-nums">' + etEqIconSvg("flame") + "<span>" + gState.streakDays + " Hari Streak</span></div>"
    ].join("");
  }

  function etGamifBuildQuestAction_(q, formNum) {
    if (q.claimed) return '<span class="et-gamif-q-done">' + etEqIconSvg("check") + " Selesai</span>";
    if (q.ready) return '<button type="button" class="et-eq-btn-claim js-gamif-claim-quest" data-quest-id="' + escapeHtml(q.id) + '">TUNTUT +' + q.rewardXp + "</button>";
    if (q.id === "q_mini") return '<button type="button" class="et-eq-btn-go" data-open-flashcard="1">MULA</button>';
    if (q.id === "q_bab") return '<a class="et-eq-btn-go" href="./kssm/tingkatan-' + formNum + '/">MULA</a>';
    return '<span class="et-gamif-q-prog tabular-nums">' + q.progress + "/" + q.target + "</span>";
  }

  function etGamifSideRenderLeft_(profile, gState) {
    const leftEl = document.getElementById("etGamifLeftRail");
    if (!leftEl) return;
    const fInfo = etGamifSideFormInfo_(profile);
    const tab = portalState.activeWorkspaceTab || "belajar";
    const curNav = tab === "latihan" ? "latihan" : (tab === "kemajuan" ? "kemajuan" : "path");
    const navDefs = [
      { id: "path", label: "EduQuest", icon: etEqIconSvg("map") },
      { id: "flashcard", label: "Main Flashcard", icon: etEqIconSvg("cards") },
      { id: "latihan", label: "Latihan Kertas", icon: etEqIconSvg("trophy") },
      { id: "settings", label: "Tetapan", icon: etEqIconSvg("gear") }
    ];
    const navHtml = navDefs.map(function (it) {
      const active = it.id === curNav;
      return '<button type="button" class="et-gamif-nav-btn' + (active ? " is-active" : "") + '" data-gamif-nav="' + it.id + '">' +
        '<span class="et-gamif-nav-ico">' + it.icon + "</span><span>" + escapeHtml(it.label) + "</span></button>";
    }).join("");

    const questsHtml = gState.quests.map(function (q) {
      const pct = Math.min(100, Math.round((q.progress / Math.max(1, q.target)) * 100));
      return '<div class="et-gamif-quest-row' + (q.claimed ? " is-claimed" : "") + '">' +
        '<div class="et-gamif-quest-top"><div class="et-eq-q-meta"><strong>' + escapeHtml(q.title) + '</strong><span>+' + q.rewardXp + " XP</span></div>" +
        etGamifBuildQuestAction_(q, fInfo.num) + "</div>" +
        '<div class="et-gamif-mini-bar"><span style="width:' + pct + '%"></span></div></div>';
    }).join("");

    const unlocked = gState.badges.filter(function (b) { return b.unlocked; }).length;
    const badgesHtml = gState.badges.map(function (b) {
      return '<div class="et-gamif-badge-tile' + (b.unlocked ? " is-unlocked" : " is-locked") + '" title="' + escapeHtml(b.desc) + '">' +
        etEqBadgeArtSvg(b.id, b.unlocked) + "<span>" + escapeHtml(b.name) + "</span></div>";
    }).join("");

    leftEl.innerHTML = [
      '<nav class="et-gamif-nav-card et-eq-glass" aria-label="Navigasi Permainan">' + navHtml + "</nav>",
      '<section class="et-gamif-card et-eq-glass" aria-label="Misi Harian">',
      '  <div class="et-gamif-card-head"><h3>MISI HARIAN</h3><span>MYT</span></div>',
      '  <div class="et-gamif-quests-list">' + questsHtml + "</div>",
      "</section>",
      '<section class="et-gamif-card et-eq-glass" aria-label="Lencana Saya">',
      '  <div class="et-gamif-card-head"><h3>LENCANA SAYA</h3><span class="tabular-nums">' + unlocked + "/6</span></div>",
      '  <div class="et-gamif-badges-grid">' + badgesHtml + "</div>",
      "</section>"
    ].join("\n");
  }

  function etGamifResolveLeagueEntries_(profile, gState) {
    const real = (portalState.leaderboard && Array.isArray(portalState.leaderboard.entries)) ? portalState.leaderboard.entries : [];
    if (real.length > 0) return { rows: real.slice(0, 5), isDemo: false };
    const myName = (profile && profile.displayName) || "Anda";
    const myXp = Math.max(0, Number(gState.totalXp) || 0);
    const sample = [
      { rank: 1, displayName: "Aisyah Humaira", xp: Math.max(2450, myXp + 420), isCurrentUser: false },
      { rank: 2, displayName: "Daniel Hakim", xp: Math.max(1880, myXp + 180), isCurrentUser: false },
      { rank: 3, displayName: myName + " (Anda)", xp: myXp, isCurrentUser: true },
      { rank: 4, displayName: "Nadia Syafiqah", xp: Math.max(420, Math.round(myXp * 0.72)), isCurrentUser: false }
    ];
    return { rows: sample, isDemo: true };
  }

  function etGamifSideRenderRight_(profile, gState) {
    const rightEl = document.getElementById("etGamifRightRail");
    if (!rightEl) return;
    const league = etGamifResolveLeagueEntries_(profile, gState);
    const lbHtml = league.rows.map(function (e, i) {
      const rnk = Number(e.rank || i + 1);
      const crown = rnk <= 3 ? etEqIconSvg("crown" + rnk) : '<span class="et-gamif-lb-rank tabular-nums">' + rnk + "</span>";
      return '<div class="et-gamif-lb-row' + (e.isCurrentUser ? " is-me" : "") + '">' +
        crown + '<span class="et-gamif-lb-name">' + escapeHtml(e.displayName || "Pelajar") + "</span>" +
        '<strong class="et-gamif-lb-xp tabular-nums">' + Number(e.xp || 0).toLocaleString("en-MY") + " XP</strong></div>";
    }).join("");

    const maxWeekXp = Math.max(60, Math.max.apply(null, gState.weekDays.map(function (d) { return Number(d.xp) || 0; })));
    const weekBarsHtml = gState.weekDays.map(function (d) {
      const hPct = Math.max(14, Math.min(100, Math.round(((Number(d.xp) || (d.active ? 35 : 8)) / maxWeekXp) * 100)));
      return '<div class="et-eq-wbar-col' + (d.active ? " is-active" : "") + (d.isToday ? " is-today" : "") + '" title="' + escapeHtml(d.label) + ": " + (d.xp || 0) + ' XP">' +
        '<div class="et-eq-wbar-track"><span style="height:' + hPct + '%"></span></div>' +
        '<span class="et-eq-wbar-lbl">' + escapeHtml(d.label) + "</span></div>";
    }).join("");

    const chestDone = Boolean(gState.chestClaimedToday);
    rightEl.innerHTML = [
      '<section class="et-gamif-card et-eq-glass" aria-label="Liga Kedudukan">',
      '  <div class="et-gamif-card-head"><h3>LIGA EMAS</h3><button type="button" class="et-gamif-link-btn js-gamif-goto-lb">Lihat Penuh &rarr;</button></div>',
      '  <div class="et-gamif-lb-list">' + lbHtml + "</div>",
      (league.isDemo ? '<p class="et-gamif-lb-empty">Sertai kuiz rasmi untuk naik carta mingguan.</p>' : ""),
      "</section>",
      '<section class="et-gamif-card et-eq-glass" aria-label="Kemajuan Mingguan">',
      '  <div class="et-gamif-card-head"><h3>KEMAJUAN MINGGUAN</h3><span>7 Hari</span></div>',
      '  <div class="et-eq-wbar-grid">' + weekBarsHtml + "</div>",
      "</section>",
      '<button type="button" class="et-gamif-card et-eq-glass et-eq-reward-chest js-qpath-claim-chest" data-chest-id="daily_chest">',
      '  <div class="et-eq-reward-copy"><span class="et-eq-reward-kicker">GANJARAN STREAK</span><strong>' + (chestDone ? "Peti Harian Dibuka" : "Tuntut Peti Bonus +20 XP") + "</strong></div>",
      '  <span class="et-eq-reward-ico">' + etEqIconSvg("chest") + "</span>",
      "</button>"
    ].join("\n");
  }

  function etGamifSideBindEvents_() {
    if (etGamifSideEventsBound_ || typeof document === "undefined") return;
    etGamifSideEventsBound_ = true;
    document.addEventListener("click", function (e) {
      if (e.target.closest(".js-gamif-open-settings")) { openStudentSettingsDialog(); return; }
      const claimBtn = e.target.closest(".js-gamif-claim-quest");
      if (claimBtn) {
        const res = etGamifClaimQuest(claimBtn.getAttribute("data-quest-id"));
        if (res && res.ok) showToast("Misi harian dituntut! +" + res.xpAdded + " XP ditambah.");
        return;
      }
      if (e.target.closest(".js-gamif-goto-lb")) {
        setActiveWorkspaceTab("kemajuan");
        const lbEl = document.getElementById("moduleDropdownLeaderboard");
        if (lbEl) setTimeout(function () { lbEl.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
        return;
      }
      const navBtn = e.target.closest("[data-gamif-nav]");
      if (!navBtn) return;
      const navId = navBtn.getAttribute("data-gamif-nav");
      etGamifSideActiveNav_ = navId;
      if (navId === "flashcard") {
        if (typeof window.etFlashcardModalOpen === "function") window.etFlashcardModalOpen();
      } else if (navId === "settings") {
        openStudentSettingsDialog();
      } else if (navId === "latihan") {
        setActiveWorkspaceTab("latihan");
        const el = document.querySelector(".portal-modules-stack");
        if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
      } else if (navId === "nota") {
        setActiveWorkspaceTab("belajar");
        const el = document.getElementById("kssmQuickCardsHost") || document.getElementById("moduleDropdownNota");
        if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
      } else {
        setActiveWorkspaceTab("belajar");
        const el = document.getElementById("etQuestPathStage");
        if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 40);
      }
    });
  }

  function etGamifSideRender() {
    const profile = getStudentProfile();
    const gState = etGamifGetState();
    etGamifRenderTopHud_(gState);
    etGamifSideRenderLeft_(profile, gState);
    etGamifSideRenderRight_(profile, gState);
    etGamifSideBindEvents_();
  }

  // --- [features/mobile-app/phoneGamificationView.js] ---
  /**
   * src/features/mobile-app/phoneGamificationView.js
   * Peta Pulau Pengembaraan EduQuest Potret, Misi Harian, Lencana Warna-Warni,
   * Liga Emas, Kemajuan Mingguan & Hab Bab 1-2 KSSM T1-T5 dalam #phoneAppShell.
   */








  let etPhoneGamifBound_ = false;
  let etPhoneManifestRequested_ = false;

  function etPhoneGamifParseFormNum_(activeForm, profile) {
    const raw = activeForm && activeForm !== "ALL" ? activeForm : ((profile && profile.currentForm) || "T5");
    const m = String(raw).toUpperCase().match(/T([1-5])/);
    return m ? Number(m[1]) : 5;
  }

  function etPhoneGamifRenderKssm_() {
    const host = document.getElementById("phoneKssmQuickCardsHost");
    if (host) host.hidden = true;
  }

  function etPhoneGamifSyncKpis_(g) {
    const ps = portalState.progressSummary || {};
    const xpEl = document.getElementById("phoneKpiXp"), stEl = document.getElementById("phoneKpiStreak");
    const bestXp = Math.max(Number(ps.totalXp) || 0, Number(g.totalXp) || 0);
    const bestSt = Math.max(Number(ps.streakDays) || 0, Number(g.streakDays) || 0);
    if (xpEl) xpEl.textContent = bestXp.toLocaleString("en-MY") + " XP";
    if (stEl) stEl.textContent = bestSt + " Hari";
  }

  function etPhoneGamifPin_(x, y, label, opts) {
    const starsHtml = '<span class="et-eq-pin-stars">' + [1, 2, 3].map(function (n) { return etEqIconSvg(n <= (opts.stars || 1) ? "star" : "starDim"); }).join("") + "</span>";
    const topMark = opts.done
      ? '<span class="et-eq-pin-check">' + etEqIconSvg("check") + "</span>"
      : (opts.active ? '<span class="et-eq-pin-avatar"><img src="./images/hero-student-3d.webp" alt="Penjelajah" width="34" height="34"></span>' : "");
    const cls = "et-eq-island-pin is-portrait-pin " + (opts.done ? "is-done" : (opts.active ? "is-active" : "is-open"));
    const inner = topMark + '<span class="et-eq-pin-tag">' + escapeHtml(label) + "</span>" + starsHtml;
    const style = "left:" + x + "%;top:" + y + "%";
    if (opts.href) return '<a class="' + cls + '" style="' + style + '" href="' + escapeHtml(opts.href) + '">' + inner + "</a>";
    return '<button type="button" class="' + cls + '" style="' + style + '" ' + (opts.attr || "") + ">" + inner + "</button>";
  }

  function etPhoneGamifQuestBtn_(q, formNum) {
    if (q.claimed) return '<span class="et-quest-done">Selesai</span>';
    if (q.ready) return '<button type="button" class="et-eq-btn-claim" data-phone-claim-quest="' + escapeHtml(q.id) + '">TUNTUT +' + q.rewardXp + "</button>";
    if (q.id === "q_mini") return '<button type="button" class="et-eq-btn-go" data-open-flashcard="1">MULA</button>';
    if (q.id === "q_bab") return '<a class="et-eq-btn-go" href="./kssm/tingkatan-' + formNum + '/">MULA</a>';
    return '<span class="et-quest-prog-num">' + q.progress + "/" + q.target + "</span>";
  }

  function renderPhoneGamificationView() {
    const host = document.getElementById("phoneGamifHubHost");
    const profile = getStudentProfile();
    const activeForm = getActiveFormFilter();
    const formNum = etPhoneGamifParseFormNum_(activeForm, profile);
    const g = etGamifGetState();
    etPhoneGamifSyncKpis_(g);
    etPhoneGamifRenderKssm_(profile, activeForm);
    if (!host) return;

    const activeSubj = etEqGetActiveSubject(profile, formNum);
    const validSubjs = etEqGetValidSubjects(formNum);
    const manifest = etEqGetCachedManifest();
    if ((!manifest || (!manifest.kssm.length && !manifest.nota.length)) && !etPhoneManifestRequested_) {
      etPhoneManifestRequested_ = true;
      etEqLoadManifest().then(function () { renderPhoneGamificationView(); });
    }
    const clr = etEqComputeClearance(formNum, activeSubj.slug, g.kssmChapters, manifest);
    const chestDone = Boolean(g.chestClaimedToday);

    const subjPills = validSubjs.map(function (s) {
      return '<button type="button" class="et-eq-subj-pill' + (s.slug === clr.subject.slug ? " is-active" : "") +
        '" data-phone-eq-subj="' + escapeHtml(s.slug) + '">' + escapeHtml(s.short) + "</button>";
    }).join("");

    const chapChips = clr.chapters.slice(0, 4).map(function (ch) {
      const starsHtml = '<span class="et-eq-pin-stars">' + [1, 2, 3].map(function (n) { return etEqIconSvg(n <= ch.stars ? "star" : "starDim"); }).join("") + "</span>";
      const statusTxt = ch.isFull ? "Penuh" : (ch.isCleared ? "Ulang" : "Belum");
      const inner = '<div class="et-eq-clr-chip-top"><strong>Bab ' + ch.bab + "</strong><span>" + statusTxt + "</span></div>" + starsHtml;
      return '<a class="et-eq-clr-chip ' + (ch.isFull ? "is-full" : (ch.isCleared ? "is-partial" : "")) + '" href="' + escapeHtml(ch.href) + '">' + inner + "</a>";
    }).join("");

    const questsHtml = (Array.isArray(g.quests) ? g.quests : []).map(function (q) {
      const qPct = Math.min(100, Math.round((q.progress / Math.max(1, q.target)) * 100));
      return '<div class="et-quest-row"><div class="et-quest-row-top"><span>' + escapeHtml(q.title) + "</span>" + etPhoneGamifQuestBtn_(q, formNum) +
        '</div><div class="et-quest-mini-track"><div class="et-quest-mini-fill" style="width:' + qPct + '%"></div></div></div>';
    }).join("");

    const badgesList = Array.isArray(g.badges) ? g.badges : [];
    const badgesHtml = badgesList.map(function (b) {
      return '<div class="et-badge-tile' + (b.unlocked ? " is-unlocked" : "") + '" title="' + escapeHtml(b.desc) + '">' +
        etEqBadgeArtSvg(b.id, b.unlocked) + '<div class="et-badge-name">' + escapeHtml(b.name) + "</div></div>";
    }).join("");

    const lbRaw = (portalState.leaderboard && Array.isArray(portalState.leaderboard.entries) && portalState.leaderboard.entries.length)
      ? portalState.leaderboard.entries.slice(0, 4)
      : [{ rank: 1, displayName: "Aisyah Humaira", xp: Math.max(2450, g.totalXp + 420) }, { rank: 2, displayName: "Daniel Hakim", xp: Math.max(1880, g.totalXp + 180) }, { rank: 3, displayName: (profile.displayName || "Anda") + " (Anda)", xp: g.totalXp, isCurrentUser: true }];
    const lbHtml = lbRaw.map(function (e, i) {
      const rnk = Number(e.rank || i + 1);
      return '<div class="et-gamif-lb-row' + (e.isCurrentUser ? " is-me" : "") + '">' + (rnk <= 3 ? etEqIconSvg("crown" + rnk) : "<span>#" + rnk + "</span>") +
        '<span class="et-gamif-lb-name">' + escapeHtml(e.displayName || "Pelajar") + '</span><strong class="et-gamif-lb-xp tabular-nums">' + Number(e.xp || 0).toLocaleString("en-MY") + " XP</strong></div>";
    }).join("");

    const daysList = Array.isArray(g.weekDays) ? g.weekDays : [];
    const maxW = Math.max(60, Math.max.apply(null, daysList.map(function (d) { return Number(d.xp) || 0; })));
    const weekHtml = daysList.map(function (d) {
      const hPct = Math.max(14, Math.min(100, Math.round(((Number(d.xp) || (d.active ? 35 : 8)) / maxW) * 100)));
      return '<div class="et-eq-wbar-col' + (d.active ? " is-active" : "") + (d.isToday ? " is-today" : "") + '"><div class="et-eq-wbar-track"><span style="height:' + hPct + '%"></span></div><span class="et-eq-wbar-lbl">' + escapeHtml(d.label) + "</span></div>";
    }).join("");

    host.innerHTML = [
      '<div class="et-eq-map-card is-phone is-seamless" data-eq-theme="' + escapeHtml(clr.subject.theme) + '">',
      '  <img class="et-eq-clr-bg-img" src="' + escapeHtml(clr.subject.img) + '" alt="' + escapeHtml(clr.subject.world) + '" decoding="async">',
      '  <div class="et-eq-clr-content">',
      '    <div class="et-eq-map-head"><div class="et-eq-map-title-wrap"><span class="et-eq-map-kicker">CLEARANCE EDUQUEST &bull; TING. ' + formNum + '</span><h3>' + escapeHtml(clr.subject.world) + '</h3></div><strong class="et-eq-map-badge-cnt tabular-nums">' + clr.totalStars + "/" + clr.maxStars + " ★</strong></div>",
      '    <div class="et-eq-subj-bar" role="group" aria-label="Pilih Subjek EduQuest">' + subjPills + "</div>",
      '    <div class="et-eq-clr-cta-row">',
      '      <a class="et-eq-play-cta is-phone-block" style="margin:0;inline-size:100%;text-decoration:none" href="' + escapeHtml(clr.eduquestHref) + '">' + etEqIconSvg("map") + "<span>BUKA EDUQUEST " + escapeHtml(clr.subject.short.toUpperCase()) + " &rarr;</span></a>",
      (clr.totalVideos > 0 ? '      <span class="et-eq-clr-pct-pill tabular-nums">' + clr.totalVideos + " Video Penerangan</span>" : ""),
      "    </div>",
      '    <div class="et-eq-clr-body">',
      '      <div class="et-eq-clr-chips">' + chapChips + "</div>",
      '      <div class="et-eq-clr-actions">',
      '        <button type="button" class="et-eq-bar-btn is-gold" style="flex:1" data-open-flashcard="1">' + etEqIconSvg("cards") + "<span>Main Flashcard</span></button>",
      '        <button type="button" class="et-eq-chest-inline' + (chestDone ? " is-claimed" : "") + '" data-phone-claim-chest="daily_chest">' + etEqIconSvg("chest") + "<span>" + (chestDone ? "Dibuka" : "+20 XP") + "</span></button>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>",
      '<div class="et-gamif-card et-eq-glass"><div class="et-gamif-card-head"><strong>MISI HARIAN</strong><span class="et-gamif-meta">MYT</span></div>' + questsHtml + "</div>",
      '<div class="et-gamif-card et-eq-glass"><div class="et-gamif-card-head"><strong>LENCANA SAYA</strong><span class="et-gamif-meta">' + badgesList.filter(function (b) { return b.unlocked; }).length + '/6</span></div><div class="et-badge-grid">' + badgesHtml + "</div></div>",
      '<div class="et-gamif-card et-eq-glass"><div class="et-gamif-card-head"><strong>LIGA EMAS &amp; MINGGUAN</strong><span class="et-gamif-meta">7 Hari</span></div><div class="et-gamif-lb-list">' + lbHtml + '</div><div class="et-eq-wbar-grid" style="margin-top:10px">' + weekHtml + "</div></div>"
    ].join("");
  }

  function initPhoneGamificationView() {
    renderPhoneGamificationView();
    if (etPhoneGamifBound_) return;
    etPhoneGamifBound_ = true;

    const host = document.getElementById("phoneGamifHubHost");
    if (host) {
      host.addEventListener("click", function (e) {
        const subjBtn = e.target.closest("[data-phone-eq-subj]");
        if (subjBtn) {
          etEqSetActiveSubject(subjBtn.getAttribute("data-phone-eq-subj"));
          renderPhoneGamificationView();
          return;
        }
        const qBtn = e.target.closest("[data-phone-claim-quest]");
        if (qBtn) {
          const res = etGamifClaimQuest(qBtn.getAttribute("data-phone-claim-quest"));
          if (res && res.ok) {
            etMascot3dCelebrate("reward");
            showToast("Misi selesai! +" + res.xpAdded + " XP dikreditkan.");
          }
          return;
        }
        if (e.target.closest("[data-phone-claim-chest]")) {
          const res = etGamifClaimChest("daily_chest");
          if (res && res.ok) {
            etMascot3dCelebrate("reward");
            showToast("Tahniah! Peti Bonus Harian dibuka (+" + res.xpAdded + " XP).");
          } else showToast("Peti Bonus Harian sudah dibuka hari ini.");
          return;
        }
        if (e.target.closest("[data-open-flashcard]")) {
          if (typeof window.etFlashcardModalOpen === "function") window.etFlashcardModalOpen();
          else etGamifRecordEvent("flashcard_complete", { xp: 20 });
          return;
        }
        if (e.target.closest("[data-phone-jump-quiz]")) {
          const btn = document.getElementById("phonePrimaryQuizBtn");
          if (btn) btn.click();
        }
      });
    }

    ["etutor:gamification-updated", "etutor:student-profile-updated", "etutor:dashboard-bundle-applied", "etutor:phone-home-synced"].forEach(function (ev) {
      window.addEventListener(ev, renderPhoneGamificationView);
    });
    if (typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(max-width: 767px)");
      const onMq = function () { window.dispatchEvent(new CustomEvent("etutor:mascot-host-changed")); };
      if (typeof mq.addEventListener === "function") mq.addEventListener("change", onMq);
      else if (typeof mq.addListener === "function") mq.addListener(onMq);
    }
  }

  // --- [features/study-notes/kssmBabQuickCards.js] ---
  /**
   * src/features/study-notes/kssmBabQuickCards.js
   * Kad pantas Hab Bab 1-2 KSSM (0 Token) pada tab Belajar ruang kerja pelajar #portal.
   */

  const KSSM_QUICK_CARDS_HOST_ID = "kssmQuickCardsHost";
  const KSSM_QUICK_CARDS_STYLE_ID = "kssmQuickCardsStyle";
  const KSSM_QUICK_CARDS_MANIFEST_URL = "./kssm/manifest.json";
  const KSSM_QUICK_CARDS_XP_KEY = "etutor_kssm_bab_xp_v1";

  let kssmQuickCardsCache_ = null;
  let kssmQuickCardsPromise_ = null;
  let kssmQuickCardsLastArgs_ = null;

  function kssmQuickCardsEscape_(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function kssmQuickCardsParseFormNum_(activeForm, profile) {
    const code = String(activeForm && activeForm !== "ALL" ? activeForm : (profile && profile.currentForm) || "").toUpperCase();
    const m = code.match(/^T([1-5])$/);
    return m ? Number(m[1]) : 0;
  }

  function kssmQuickCardsReadXp_() {
    try {
      if (typeof localStorage === "undefined") return 0;
      const raw = localStorage.getItem(KSSM_QUICK_CARDS_XP_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed.totalXp === "number" ? parsed.totalXp : 0;
    } catch (_) { return 0; }
  }

  function kssmQuickCardsEnsureStyle_() {
    if (typeof document === "undefined" || document.getElementById(KSSM_QUICK_CARDS_STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = KSSM_QUICK_CARDS_STYLE_ID;
    st.textContent = ".kssm-qc-wrap{margin:12px 0 16px;padding:16px;border-radius:16px;border:1.5px solid #bfdbfe;background:linear-gradient(135deg,#eff6ff 0%,#ecfdf5 100%)}.kssm-qc-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}.kssm-qc-title{margin:0;font-family:var(--font-heading,'Lexend',sans-serif);font-size:1.02rem;color:#1e3a8a}.kssm-qc-badges{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.kssm-qc-pill{font-size:.74rem;font-weight:700;padding:3px 9px;border-radius:999px;background:#059669;color:#fff}.kssm-qc-pill.is-xp{background:#d97706}.kssm-qc-all{font-size:.8rem;font-weight:700;color:#2563eb;text-decoration:none}.kssm-qc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}.kssm-qc-card{display:flex;flex-direction:column;gap:4px;padding:11px 12px;border-radius:12px;border:1px solid #cbd5e1;background:#fff;text-decoration:none;color:#0f172a;transition:border-color .14s ease}.kssm-qc-card:hover{border-color:#2563eb}.kssm-qc-meta{font-size:.73rem;font-weight:800;color:#2563eb;text-transform:uppercase}.kssm-qc-name{font-size:.86rem;font-weight:700;color:#1e3a8a;line-height:1.35}.kssm-qc-foot{font-size:.74rem;color:#475569;margin-top:auto}";
    if (document.head) document.head.appendChild(st);
  }

  function kssmQuickCardsEnsureHost_(notaEl) {
    if (typeof document === "undefined") return null;
    let host = document.getElementById(KSSM_QUICK_CARDS_HOST_ID);
    if (host) return host;
    host = document.createElement("section");
    host.id = KSSM_QUICK_CARDS_HOST_ID;
    host.className = "kssm-qc-wrap";
    host.setAttribute("aria-label", "Hab Bab 1 hingga 2 KSSM");
    if (notaEl && notaEl.parentNode) notaEl.parentNode.insertBefore(host, notaEl);
    else {
      const emptyEl = document.getElementById("focusEmptyStateCard");
      if (emptyEl && emptyEl.parentNode) emptyEl.parentNode.insertBefore(host, emptyEl.nextSibling);
    }
    return host;
  }

  function kssmQuickCardsLoadManifest_() {
    if (Array.isArray(kssmQuickCardsCache_)) return Promise.resolve(kssmQuickCardsCache_);
    if (kssmQuickCardsPromise_) return kssmQuickCardsPromise_;
    if (typeof fetch !== "function") return Promise.resolve([]);
    kssmQuickCardsPromise_ = fetch(KSSM_QUICK_CARDS_MANIFEST_URL)
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.chapters) ? data.chapters : []);
        kssmQuickCardsCache_ = list;
        return list;
      })
      .catch(() => [])
      .finally(() => { kssmQuickCardsPromise_ = null; });
    return kssmQuickCardsPromise_;
  }

  function kssmQuickCardsPaint_(host, items, formNum, profile, showAll) {
    const formItems = items.filter((it) => Number(it.form) === formNum);
    if (!formItems.length) { host.hidden = true; return; }
    const pickedSet = new Set((!showAll && profile && Array.isArray(profile.selectedSubjects)) ? profile.selectedSubjects : []);
    const matched = pickedSet.size > 0 ? formItems.filter((it) => pickedSet.has(it.subject)) : [];
    const visible = (matched.length > 0 ? matched : formItems).slice(0, 8);
    const xp = kssmQuickCardsReadXp_();
    const xpHtml = xp > 0 ? `<span class="kssm-qc-pill is-xp">${xp} XP</span>` : "";
    const cardsHtml = visible.map((ch) => {
      const href = "./" + String(ch.url || "").replace(/^\/+/, "");
      return `<a class="kssm-qc-card" href="${kssmQuickCardsEscape_(href)}"><span class="kssm-qc-meta">${kssmQuickCardsEscape_(ch.subject)} • Bab ${Number(ch.bab)}</span><span class="kssm-qc-name">${kssmQuickCardsEscape_(ch.title)}</span><span class="kssm-qc-foot">${Number(ch.mcqCount) || 10} MCQ + ${Number(ch.essayCount) || 2} Kertas 2</span></a>`;
    }).join("");
    host.innerHTML = `<div class="kssm-qc-head"><h3 class="kssm-qc-title">Hab Bab 1–2 KSSM Tingkatan ${formNum} (Percuma • 0 Token)</h3><div class="kssm-qc-badges"><span class="kssm-qc-pill">0 Token</span>${xpHtml}<a class="kssm-qc-all" href="./kssm/tingkatan-${formNum}/">Semua Subjek T${formNum}</a></div></div><div class="kssm-qc-grid">${cardsHtml}</div>`;
    host.hidden = false;
  }
  function renderKssmQuickCardsForWorkspace(profile, activeForm, showAll, activeTab, notaEl) {
    if (typeof document === "undefined") return;
    const host = kssmQuickCardsEnsureHost_(notaEl);
    if (!host) return;
    const formNum = kssmQuickCardsParseFormNum_(activeForm, profile);
    if (activeTab !== "belajar" || !formNum) { host.hidden = true; return; }
    kssmQuickCardsEnsureStyle_();
    kssmQuickCardsLastArgs_ = { profile, activeForm, showAll, activeTab, notaEl };
    if (Array.isArray(kssmQuickCardsCache_)) { kssmQuickCardsPaint_(host, kssmQuickCardsCache_, formNum, profile, showAll); return; }
    host.hidden = true;
    kssmQuickCardsLoadManifest_().then((items) => {
      if (!items.length || !kssmQuickCardsLastArgs_) return;
      const latest = kssmQuickCardsLastArgs_;
      const latestForm = kssmQuickCardsParseFormNum_(latest.activeForm, latest.profile);
      if (latest.activeTab === "belajar" && latestForm) kssmQuickCardsPaint_(host, items, latestForm, latest.profile, latest.showAll);
    });
  }

  // --- [features/dashboard/focusWorkspaceController.js] ---
  /**
   * src/features/dashboard/focusWorkspaceController.js
   * Pengawal Ruang Kerja Fokus Diperibadikan (#focusWorkspaceHeader, #focusMissionCard, #focusEmptyStateCard)
   * bagi paparan desktop #dashboardView mengikut tingkatan, subjek pilihan & sasaran harian pelajar.
   */












  const FW_VALID_TABS_ = ["belajar", "latihan", "kemajuan"];
  let fwEventsBound_ = false;
  let fwMascotHostEl_ = null;
  let fwDashObserverBound_ = false;
  const FW_SVG_CAM_ = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h3l2-3h6l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const FW_SVG_BOOK_ = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"/></svg>';
  const FW_SVG_PLAY_ = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4" stroke-linejoin="round"/></svg>';

  function fwFormShortLabel_(code) {
    if (code === "ALL") return "Semua";
    const num = String(code || "").replace(/\D/g, "");
    return num ? ("Ting. " + num) : "Ting. 5";
  }
  function fwFormLongLabel_(code) {
    if (code === "ALL") return "Semua Tingkatan";
    const num = String(code || "").replace(/\D/g, "");
    return num ? ("Tingkatan " + num) : "Tingkatan 5";
  }
  function fwResolveDisplayName_(profile) {
    const raw = (profile && profile.displayName) || (portalState.user && portalState.user.buyerName) || getOpenStudentName() || "";
    const clean = String(raw || "").trim();
    return (!clean || clean === "Pelajar Contoh (Disekat Lalai)") ? "Pelajar" : clean;
  }

  function fwOpenCikguAi_(promptText, subjectHint) {
    if (typeof etGamifRecordEvent === "function") etGamifRecordEvent("cikgu_ai_used", {});
    const msg = promptText || "Assalamualaikum Cikgu, bantu saya dengan soalan kerja sekolah ini.";
    const launcher = document.querySelector(".cikgu-ai-launcher, #cikgu-fab-btn");
    const drawer = window.__CIKGU_AI_INSTANCE__ && window.__CIKGU_AI_INSTANCE__.drawer;
    if (drawer && typeof drawer.openWithPrompt === "function") {
      try { drawer.openWithPrompt(msg, subjectHint || ""); return; } catch (e) {}
    }
    if (launcher && typeof launcher.click === "function") { launcher.click(); return; }
    const fab = document.getElementById("cikguAiFab"), dr = document.getElementById("cikguAiDrawer");
    if (drawer && drawer.rootEl) drawer.rootEl.hidden = false;
    if (fab && (!dr || dr.hidden) && typeof fab.click === "function") fab.click();
    if (dr) dr.hidden = false;
    const chatInput = document.getElementById("cikguAiChatInput");
    if (chatInput) { if (msg && !chatInput.value) chatInput.value = msg; chatInput.focus(); }
  }

  function fwRenderWorkspaceHeader_(profile, activeForm, showAll, activeTab) {
    const headerEl = document.getElementById("focusWorkspaceHeader");
    if (!headerEl) return;
    const name = fwResolveDisplayName_(profile);
    const greeting = profile.role === "ibu_bapa" ? ("Pantauan " + name) : ("Hai, " + name + "!");
    const forms = Array.isArray(profile.learningForms) && profile.learningForms.length > 0 ? profile.learningForms : [profile.currentForm || "T5"];
    const pillCodes = forms.length > 1 ? forms.concat(["ALL"]) : forms;
    const selCount = Array.isArray(profile.selectedSubjects) ? profile.selectedSubjects.length : 0;
    const goalMins = Number(profile.dailyGoalMinutes) || 15;
    const pillsHtml = pillCodes.map(function (code) {
      const active = activeForm === code;
      return '<button type="button" class="et-form-pill' + (active ? " is-active" : "") + '" data-form-code="' + escapeHtml(code) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(fwFormShortLabel_(code)) + "</button>";
    }).join("");

    headerEl.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap"><div>',
      '<h2 style="margin:0;font-size:clamp(1.12rem,1rem + 0.5vw,1.38rem);color:#0f172a">' + escapeHtml(greeting) + "</h2>",
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px"><span class="et-onb-count-pill">' + escapeHtml(fwFormLongLabel_(profile.currentForm)) + '</span><span class="et-onb-rec-badge">Sasaran: ' + goalMins + " min/hari</span></div>",
      '</div><div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px" role="group" aria-label="Skop Subjek">',
      '<button type="button" class="tab-chip js-ws-show-all-chip" data-scope="mine" aria-pressed="' + (!showAll ? "true" : "false") + '">Subjek Saya (' + selCount + ")</button>",
      '<button type="button" class="tab-chip js-ws-show-all-chip" data-scope="all" aria-pressed="' + (showAll ? "true" : "false") + '">Tunjuk Semua 23 Subjek</button>',
      "</div></div>",
      '<div class="et-form-switcher" role="group" aria-label="Penukar Tingkatan Pembelajaran">' + pillsHtml + "</div>",
      '<div class="et-workspace-tabs" role="tablist" aria-label="Bahagian Ruang Kerja Fokus">',
      '<button type="button" id="wsTabBelajar" class="et-ws-tab" data-ws-tab="belajar" role="tab" aria-selected="' + (activeTab === "belajar") + '" aria-pressed="' + (activeTab === "belajar") + '">Belajar &amp; Nota</button>',
      '<button type="button" id="wsTabLatihan" class="et-ws-tab" data-ws-tab="latihan" role="tab" aria-selected="' + (activeTab === "latihan") + '" aria-pressed="' + (activeTab === "latihan") + '">Latihan &amp; Kertas</button>',
      '<button type="button" id="wsTabKemajuan" class="et-ws-tab" data-ws-tab="kemajuan" role="tab" aria-selected="' + (activeTab === "kemajuan") + '" aria-pressed="' + (activeTab === "kemajuan") + '">Kemajuan &amp; Slip</button>',
      "</div>"
    ].join("\n");
  }

  function fwRenderMissionCard_(profile, activeForm) {
    const cardEl = document.getElementById("focusMissionCard");
    if (!cardEl) return;
    const hasSpm = hasAnySpmLearningForm(profile);
    const goalMins = Number(profile.dailyGoalMinutes) || 15;
    const inProg = Array.isArray(portalState.inProgress) && portalState.inProgress[0] ? portalState.inProgress[0] : null;
    const activeTab = portalState.activeWorkspaceTab || "belajar";
    if (activeTab === "belajar" && !(inProg && hasSpm)) {
      cardEl.hidden = true;
      cardEl.innerHTML = "";
      return;
    }
    cardEl.hidden = false;
    let eyebrow = "Misi Belajar Hari Ini • Sasaran " + goalMins + " min/hari";
    let title = "Terokai Nota Interaktif Visual Mengikut Bab";
    let desc = "Fokus langkah demi langkah bersama penerangan audio Cikgu AI dan latihan pantas.";
    let primaryBtnHtml = '<button type="button" class="btn btn-primary btn-sm js-ws-go-tab" data-ws-target="belajar">' + FW_SVG_BOOK_ + "<span>Mula Nota Bab</span></button>";

    if (inProg && hasSpm) {
      eyebrow = "Sambung Latihan • Sasaran " + goalMins + " min/hari";
      title = inProg.quizTitle || "Set Latihan Interaktif";
      desc = (inProg.answeredCount || 0) + " / " + (inProg.totalQuestions || 45) + " soalan siap — teruskan untuk menyiapkan sasaran harian anda.";
      primaryBtnHtml = '<button type="button" class="btn btn-primary btn-sm js-open-quiz" data-file-id="' + escapeHtml(inProg.fileId) + '" data-resume="1">' + FW_SVG_PLAY_ + "<span>Sambung Latihan</span></button>";
    } else if (!hasSpm) {
      const fNum = Number(String(activeForm && activeForm !== "ALL" ? activeForm : (profile.currentForm || "T1")).replace(/\D/g, "")) || 1;
      eyebrow = "Misi " + fwFormLongLabel_(activeForm) + " • Sasaran " + goalMins + " min/hari";
      title = "Kuasai Nota, Latih Tubi Bab 1–2 & Flashcard " + fwFormShortLabel_(activeForm);
      desc = "Hab KSSM " + fwFormLongLabel_(activeForm) + " aktif! Mulakan Flashcard (+10 XP) atau semak kerja sekolah dengan Cikgu AI.";
      primaryBtnHtml = '<a class="btn btn-primary btn-sm" href="./kssm/tingkatan-' + fNum + '/">' + FW_SVG_BOOK_ + "<span>Buka Hab Bab 1–2</span></a>";
    } else if (profile.studyFocus === "pecutan_exam") {
      eyebrow = "Misi Pecutan Peperiksaan • Sasaran " + goalMins + " min/hari";
      title = "Latihan Topikal Klon & Kertas Percubaan Negeri";
      desc = "Jawab 1 set latihan berpandukan subjek pilihan anda dan semak analisis markah terus.";
      primaryBtnHtml = '<button type="button" class="btn btn-primary btn-sm js-ws-go-tab" data-ws-target="latihan">' + FW_SVG_PLAY_ + "<span>Mula Latihan Topikal</span></button>";
    } else if (profile.studyFocus === "kerja_sekolah") {
      eyebrow = "Misi Bimbingan Kerja Sekolah • Sasaran " + goalMins + " min/hari";
      title = "Semak Soalan Sukar Bersama Cikgu AI";
      desc = "Muat naik soalan atau rujuk Nota Interaktif Visual mengikut topik semasa anda.";
      primaryBtnHtml = '<button type="button" class="btn btn-primary btn-sm js-ws-go-tab" data-ws-target="belajar">' + FW_SVG_BOOK_ + "<span>Mula Nota Bab</span></button>";
    }

    cardEl.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">',
      '  <div style="min-inline-size:0;flex:1 1 280px">',
      '    <div style="font-size:0.74rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#1e3a8a">' + escapeHtml(eyebrow) + "</div>",
      '    <h3 style="margin:4px 0;font-size:1.05rem;color:#0f172a">' + escapeHtml(title) + "</h3>",
      '    <p style="margin:0;font-size:0.84rem;color:#475569">' + escapeHtml(desc) + "</p>",
      "  </div>",
      '  <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">',
      "    " + primaryBtnHtml,
      '    <button type="button" id="wsSnapCikguBtn" class="btn btn-emerald btn-sm js-open-cikgu-ai-empty">' + FW_SVG_CAM_ + "<span>Snap Kerja Sekolah Cikgu AI</span></button>",
      "  </div>",
      "</div>"
    ].join("\n");
  }

  function fwSetEmptyCard_(title, desc, showAllBtn) {
    const emptyCard = document.getElementById("focusEmptyStateCard");
    if (!emptyCard) return;
    emptyCard.hidden = false;
    emptyCard.innerHTML = [
      '<span class="et-onb-soon-badge">Sesi 2027</span>',
      '<h3 style="margin:0;font-size:1.05rem;color:#0f172a">' + escapeHtml(title) + "</h3>",
      '<p style="margin:0;font-size:0.86rem;color:#475569">' + escapeHtml(desc) + "</p>",
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">',
      '  <button type="button" class="btn btn-primary btn-sm js-open-cikgu-ai-empty">' + FW_SVG_CAM_ + "<span>Tanya / Snap Kerja Sekolah Cikgu AI</span></button>",
      (showAllBtn ? '  <button type="button" class="btn btn-outline btn-sm js-ws-show-all-chip" data-scope="all">Tunjuk Semua 23 Subjek</button>' : ""),
      "</div>"
    ].join("\n");
  }

  function fwSyncModuleVisibility_(profile, activeForm, showAll, activeTab) {
    const customizerBar = document.getElementById("portalCustomizerBar");
    if (customizerBar) customizerBar.hidden = true;
    const hasSpm = hasAnySpmLearningForm(profile);
    const cdHero = document.getElementById("portalSpmCountdownHero");
    if (cdHero) cdHero.hidden = !hasSpm;

    const mods = {
      klon: document.getElementById("moduleDropdownKlon"), pra: document.getElementById("moduleDropdownPraSpm"),
      nota: document.getElementById("moduleDropdownNota"), prog: document.getElementById("moduleDropdownProgress"),
      lb: document.getElementById("moduleDropdownLeaderboard"), cd: document.getElementById("moduleDropdownCountdown"),
      flash: document.getElementById("moduleDropdownFlashcard")
    };
    Object.keys(mods).forEach(function (k) { if (mods[k]) { mods[k].hidden = true; mods[k].open = false; } });
    const emptyCard = document.getElementById("focusEmptyStateCard");
    if (emptyCard) emptyCard.hidden = true;

    const kqHost = document.getElementById("kssmQuickCardsHost");
    if (kqHost) kqHost.hidden = true;
    if (activeTab === "belajar") {
      return;
    }
    if (activeTab === "latihan") {
      if (hasSpm) {
        if (mods.klon) { mods.klon.hidden = false; mods.klon.open = true; }
        if (mods.pra) mods.pra.hidden = false;
        const rawCat = Array.isArray(portalState.catalog) ? portalState.catalog : [];
        if (rawCat.length > 0 && filterCatalogItemsForStudent(rawCat).length === 0) {
          fwSetEmptyCard_("Tiada Set Latihan Sepadan dengan Subjek Pilihan", "Cuba aktifkan semua 23 subjek atau tanya Cikgu AI untuk latihan tambahan.", !showAll);
        }
      } else {
        fwSetEmptyCard_("Latihan UPSA & UASA Sesi 2027 Akan Dibuka", "Set kertas interaktif untuk " + fwFormLongLabel_(activeForm) + " sedang disediakan untuk Sesi 2027. Gunakan Cikgu AI untuk bimbingan segera.", false);
      }
      return;
    }
    if (mods.prog) { mods.prog.hidden = false; mods.prog.open = true; }
    if (mods.lb) { mods.lb.hidden = false; mods.lb.open = true; }
    if (hasSpm && mods.cd) mods.cd.hidden = false;
  }

  function fwSyncMascotStage_(profile, activeForm) {
    const phoneMount = document.getElementById("phoneMascotStageMount");
    const deskMount = document.getElementById("etMascotStageMount");
    const mountEl = (phoneMount && phoneMount.offsetParent !== null) ? phoneMount : deskMount;
    const dashEl = document.getElementById("dashboardView");
    if (!mountEl || !dashEl || dashEl.hidden) return;
    const name = fwResolveDisplayName_(profile);
    const subs = Array.isArray(profile && profile.selectedSubjects) ? profile.selectedSubjects : [];
    const topSubj = subs[0] || "KSSM";
    const msg = name === "Pelajar"
      ? ("Jom kuasai " + topSubj + " (" + fwFormShortLabel_(activeForm) + ") hari ini!")
      : ("Hai " + name + "! Jom teruskan momentum " + topSubj + "!");
    if ((fwMascotHostEl_ !== mountEl || !mountEl.childElementCount) && typeof etMascot3dMount === "function") {
      fwMascotHostEl_ = mountEl;
      try { etMascot3dMount(mountEl, { studentName: name, subject: topSubj, form: activeForm }); } catch (e) {}
    } else if (typeof etMascot3dMount !== "function" && !mountEl.childElementCount) {
      mountEl.innerHTML = '<img src="./images/hero-student-3d.webp" alt="Maskot Cikgu eTutor" width="112" height="112" style="object-fit:contain"><p id="etMascotSpeechBubble" style="margin:6px 12px 10px;font-size:.78rem;font-weight:700;color:#1e3a8a;text-align:center">' + escapeHtml(msg) + "</p>";
    }
    if (typeof etMascot3dSetSpeech === "function") {
      try { etMascot3dSetSpeech(msg); } catch (e) {}
    }
  }

  function renderFocusWorkspaceUi() {
    const profile = getStudentProfile();
    const activeForm = getActiveFormFilter();
    const showAll = getShowAllSubjectsOverride();
    const activeTab = FW_VALID_TABS_.indexOf(portalState.activeWorkspaceTab) !== -1 ? portalState.activeWorkspaceTab : "belajar";
    portalState.activeWorkspaceTab = activeTab;
    fwRenderWorkspaceHeader_(profile, activeForm, showAll, activeTab);
    fwRenderMissionCard_(profile, activeForm);
    fwSyncModuleVisibility_(profile, activeForm, showAll, activeTab);
    fwSyncMascotStage_(profile, activeForm);
    if (typeof etQuestPathRender === "function") etQuestPathRender();
    if (typeof etGamifSideRender === "function") etGamifSideRender();
  }

  function setActiveWorkspaceTab(tabId) {
    portalState.activeWorkspaceTab = FW_VALID_TABS_.indexOf(tabId) !== -1 ? tabId : "belajar";
    renderFocusWorkspaceUi();
  }

  function initFocusWorkspace() {
    if (typeof etGamifInit === "function") etGamifInit();
    renderFocusWorkspaceUi();
    const dashEl = document.getElementById("dashboardView");
    if (dashEl && !fwDashObserverBound_ && typeof MutationObserver === "function") {
      fwDashObserverBound_ = true;
      new MutationObserver(function () {
        if (!dashEl.hidden) fwSyncMascotStage_(getStudentProfile(), getActiveFormFilter());
      }).observe(dashEl, { attributes: true, attributeFilter: ["hidden"] });
    }
    if (fwEventsBound_) return;
    fwEventsBound_ = true;
    document.addEventListener("click", function (e) {
      if (e.target.closest("#openStudentSettingsBtn") || e.target.closest(".js-ws-open-settings")) { openStudentSettingsDialog(); return; }
      const formPill = e.target.closest("#focusWorkspaceHeader .et-form-pill");
      if (formPill) { setActiveFormFilter(formPill.getAttribute("data-form-code") || "T5"); return; }
      const showAllBtn = e.target.closest(".js-ws-show-all-chip");
      if (showAllBtn) { setShowAllSubjectsOverride(showAllBtn.getAttribute("data-scope") === "all"); return; }
      const tabBtn = e.target.closest("[data-ws-tab]");
      if (tabBtn) { setActiveWorkspaceTab(tabBtn.getAttribute("data-ws-tab")); return; }
      const goTabBtn = e.target.closest(".js-ws-go-tab");
      if (goTabBtn) {
        setActiveWorkspaceTab(goTabBtn.getAttribute("data-ws-target") || "belajar");
        const stack = document.querySelector(".portal-modules-stack");
        if (stack) stack.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (e.target.closest(".js-open-cikgu-ai-empty")) {
        fwOpenCikguAi_("Assalamualaikum Cikgu, bantu saya dengan kerja sekolah atau topik " + fwFormLongLabel_(getActiveFormFilter()) + ".");
      }
    });
    window.addEventListener("etutor:student-profile-updated", function () {
      renderHeaderUser(); populateSubjectSelectors(); populateKlonSubjectChips();
      renderKlonCatalogSection(); renderCatalogSection();
      populateNotaSubjectChips(); renderNotaCatalogSection(); renderFocusWorkspaceUi();
    });
    window.addEventListener("etutor:dashboard-bundle-applied", renderFocusWorkspaceUi);
    window.addEventListener("etutor:mascot-host-changed", function () {
      fwSyncMascotStage_(getStudentProfile(), getActiveFormFilter());
    });
    window.addEventListener("etutor:gamification-updated", function () {
      if (typeof etQuestPathRender === "function") etQuestPathRender();
      if (typeof etGamifSideRender === "function") etGamifSideRender();
    });
  }

  // --- [features/cloud-sync/cloudSyncStorage.js] ---
  /**
   * src/features/cloud-sync/cloudSyncStorage.js
   * Pengurusan token pautan Cloud Sync tempatan & algoritma gabungan rekod awan ke storan pelayar.
   */





  const syncUi = {
    busy: false,
    pulledOnce: false,
    otpEmail: "",
    loginOtpEmail: "",
    gsiReady: false,
    googleRawNonce: "",
    otpAbortCtrl: null
  };

  function getSyncLink() {
    try {
      const t = localStorage.getItem(SYNC_TOKEN_KEY);
      if (!t) return null;
      return {
        token: t,
        email: localStorage.getItem(SYNC_EMAIL_KEY) || "",
        leaderboardId: localStorage.getItem(SYNC_LB_ID_KEY) || "",
        aksesPakej: localStorage.getItem(SYNC_PAKEJ_KEY) || "ALL"
      };
    } catch (e) { return null; }
  }

  function setSyncLink(token, email, meta) {
    try {
      localStorage.setItem(SYNC_TOKEN_KEY, token);
      localStorage.setItem(SYNC_EMAIL_KEY, email || "");
      if (meta && meta.leaderboardId) localStorage.setItem(SYNC_LB_ID_KEY, meta.leaderboardId);
      if (meta && meta.aksesPakej) localStorage.setItem(SYNC_PAKEJ_KEY, meta.aksesPakej);
    } catch (e) {}
  }

  function clearSyncLink() {
    try {
      localStorage.removeItem(SYNC_TOKEN_KEY);
      localStorage.removeItem(SYNC_EMAIL_KEY);
      localStorage.removeItem(SYNC_LAST_KEY);
      localStorage.removeItem(SYNC_LB_ID_KEY);
      localStorage.removeItem(SYNC_PAKEJ_KEY);
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
    if (!Array.isArray(portalState.rawOpenCatalog) || portalState.rawOpenCatalog.length === 0) return;
    applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
  }

  // --- [features/cloud-sync/cloudSyncAuth.js] ---
  /**
   * src/features/cloud-sync/cloudSyncAuth.js
   * Pengangkutan penyegerakan awan (Supabase & GAS fallback), pengesahan Google Sign-In & kemas kini UI.
   */














  function renderSyncButton() {
    const btn = document.getElementById("syncProgressBtn");
    const link = getSyncLink();
    const landingLbl = document.querySelector("#landingLoginBtn [data-login-label]");
    if (landingLbl) landingLbl.textContent = link && link.email ? link.email.split("@")[0] : "Log Masuk";
    renderHeaderUser();
    if (btn) {
      const label = btn.querySelector("[data-sync-label]");
      if (label) label.textContent = link ? "Sync Progress" : "Simpan Progress";
      btn.setAttribute("data-linked", link ? "true" : "false");
      btn.title = link ? ("Disambungkan: " + link.email) : "Simpan progress ke awan supaya boleh disambung di peranti lain";
    }
    const st = document.getElementById("syncDialogLinked");
    const form = document.getElementById("syncDialogLogin");
    if (st) st.hidden = !link;
    if (form) form.hidden = Boolean(link);
    const em = document.getElementById("syncLinkedEmail");
    if (em) em.textContent = link ? link.email : "";
    const pkgEl = document.getElementById("syncLinkedPackage");
    if (pkgEl) {
      const pkg = link && link.aksesPakej ? link.aksesPakej : "";
      pkgEl.textContent = pkg ? ("Pakej Aktif: " + (pkg.toUpperCase() === "ALL" ? "Semua Subjek SPM" : pkg)) : "";
      pkgEl.hidden = !pkg;
    }
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
      const payload = {
        syncToken: link.token,
        name: getOpenStudentName(),
        scores: loadOpenScoresList().slice(-250),
        progress: Object.keys(progMap).map(function (k) { return progMap[k]; }),
        completedFileIds: opts.completedFileId ? [opts.completedFileId] : []
      };
      const res = isSupabaseConfigured()
        ? await sbSyncStudentBundle(payload)
        : await callBackend("syncPush", payload);

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
      setSyncLink(res.syncToken || link.token, res.email || link.email, {
        leaderboardId: res.leaderboardId || link.leaderboardId,
        aksesPakej: res.aksesPakej || link.aksesPakej
      });
      mergeRemoteIntoLocal(res);
      try { localStorage.setItem(SYNC_LAST_KEY, res.syncedAt || new Date().toLocaleString("ms-MY")); } catch (e) {}

      if (isSupabaseConfigured()) {
        try {
          const lb = await sbFetchLeaderboard(portalState.lbPeriod, portalState.lbSubject, res.leaderboardId || "", res.name || "");
          if (lb && lb.ok) portalState.rawServerLeaderboard = lb.leaderboard;
        } catch (e) {}
      } else if (res.newScoresAdded) {
        try {
          const lb = await callBackend("getLeaderboard", { period: portalState.lbPeriod, subject: portalState.lbSubject });
          if (lb && lb.ok) portalState.rawServerLeaderboard = lb.leaderboard;
        } catch (e) {}
      }
      refreshOpenDashboardIfIdle();
      renderSyncButton();
      refreshAiWalletFromServer();
      tryClaimPendingReferralBonus().catch(function () {});
      try { window.dispatchEvent(new CustomEvent("etutor:cloud-synced")); } catch (e) {}
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

  async function onSyncLoggedIn(res, opts) {
    opts = opts || {};
    portalState.supabaseAuthenticated = true;
    setSyncLink(res.syncToken, res.email, {
      leaderboardId: res.leaderboardId,
      aksesPakej: res.aksesPakej
    });
    mergeRemoteIntoLocal(res);
    renderSyncButton();
    setSyncDialogMsg("");
    if (!opts.skipSyncPush) {
      await syncNow({ silent: true });
    } else {
      refreshAiWalletFromServer();
      tryClaimPendingReferralBonus().catch(function () {});
      try { window.dispatchEvent(new CustomEvent("etutor:cloud-synced")); } catch (e) {}
    }
    refreshOpenDashboardIfIdle();
    if (!opts.quietToast) {
      showToast("Disambungkan sebagai " + res.email + ". Progress anda kini disegerakkan.");
    }
    const dlg = document.getElementById("syncDialog");
    if (dlg && dlg.open) closeTopLayer(dlg);

    const loginView = document.getElementById("loginView");
    const landingEl = document.getElementById("landingView");
    const dashEl = document.getElementById("dashboardView");
    const isFromLogin = Boolean(loginView && !loginView.hidden);
    const isFromLanding = Boolean(landingEl && !landingEl.hidden);
    const isDashHidden = !dashEl || dashEl.hidden;
    const h = (window.location.hash || "").toLowerCase();

    if (isOpenAccessMode() && (isFromLogin || isFromLanding || (isDashHidden && (h === "#login" || h === "#portal" || h === "#klon-portal")))) {
      const wantsKlon = Boolean(portalState.pendingKlonScroll) || h === "#klon-portal";
      portalState.pendingKlonScroll = false;
      window.location.hash = wantsKlon ? "#klon-portal" : "#portal";
      await enterOpenPortal(false);
      return;
    }
    if (!isOpenAccessMode() && isFromLogin) {
      portalState.supabaseAuthenticated = true;
      portalState.user = { userId: res.email, buyerName: res.name || res.email.split("@")[0], aksesPakej: res.aksesPakej || "ALL" };
      if (landingEl) landingEl.hidden = true;
      loginView.hidden = true;
      document.getElementById("dashboardView").hidden = false;
      if (portalState.rawOpenCatalog.length === 0) {
        portalState.rawOpenCatalog = getCachedCatalogFallback();
      }
      applyDashboardBundle(buildOpenDashboardBundle(portalState.rawOpenCatalog, portalState.rawServerLeaderboard));
    }
  }

  function renderGsiButtonSlots() {
    if (!syncUi.gsiReady || !window.google || !google.accounts || !google.accounts.id) return;
    ["syncGoogleBtn", "loginGoogleGsiBtn"].forEach(function (slotId) {
      const holder = document.getElementById(slotId);
      if (!holder || holder.offsetParent === null) return;
      const w = Math.max(220, Math.min(380, (holder.parentElement ? holder.parentElement.clientWidth : 320) || 320));
      holder.innerHTML = "";
      try {
        google.accounts.id.renderButton(holder, { theme: "outline", size: "large", text: "continue_with", shape: "pill", width: w });
      } catch (e) {}
    });
  }

  function loadGoogleSignIn() {
    const cid = window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.GOOGLE_CLIENT_ID;
    const sbActive = isSupabaseConfigured();
    const holder = document.getElementById("syncGoogleBtn");
    const wrap = document.getElementById("syncGoogleWrap");
    const oauthSyncBtn = document.getElementById("syncGoogleOAuthBtn");
    const webView = isRestrictedInAppWebView();

    if (oauthSyncBtn) oauthSyncBtn.hidden = !sbActive || webView;
    if (wrap && (cid || sbActive)) wrap.hidden = false;
    if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return;
    if (!cid || !holder || (typeof google !== "undefined" && google.script) || webView) return;

    async function init() {
      if (syncUi.gsiReady) {
        renderGsiButtonSlots();
        return;
      }
      if (syncUi.gsiInitializing || !window.google || !google.accounts || !google.accounts.id) return;
      syncUi.gsiInitializing = true;
      try {
        const gsiOpts = {
          client_id: cid,
          callback: async function (resp) {
            setSyncDialogMsg("Mengesahkan akaun Google...");
            try {
              const res = isSupabaseConfigured()
                ? await sbSignInWithGoogleIdToken(resp.credential, syncUi.googleRawNonce)
                : await callBackend("googleSignIn", { idToken: resp.credential });
              if (res && res.ok) await onSyncLoggedIn(res);
              else setSyncDialogMsg((res && res.error) || "Pengesahan Google gagal.", true);
            } catch (e) {
              setSyncDialogMsg("Ralat rangkaian. Cuba lagi.", true);
            }
          }
        };
        if (sbActive) {
          const noncePair = await generateGoogleNoncePair();
          syncUi.googleRawNonce = noncePair.rawNonce;
          gsiOpts.nonce = noncePair.hashedNonce;
        }
        google.accounts.id.initialize(gsiOpts);
        syncUi.gsiReady = true;
        syncUi.renderGsi = renderGsiButtonSlots;
        renderGsiButtonSlots();
      } finally {
        syncUi.gsiInitializing = false;
      }
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
    if (!dlg.open) dlg.showModal();
    loadGoogleSignIn();
    if (syncUi.renderGsi) syncUi.renderGsi();
  }

  // --- [features/cloud-sync/cloudSyncEvents.js] ---
  /**
   * src/features/cloud-sync/cloudSyncEvents.js
   * Pengikat acara modal Cloud Sync (OTP 6-digit, WebOTP AbortController, light-dismiss) & auto-sync.
   */










  function stopSmsOtpListener() {
    if (syncUi.otpAbortCtrl) {
      try { syncUi.otpAbortCtrl.abort(); } catch (e) {}
      syncUi.otpAbortCtrl = null;
    }
  }

  async function startSmsOtpListener(otpInputEl, otpFormEl) {
    if (!otpInputEl || typeof window === "undefined" || !("OTPCredential" in window)) return;
    stopSmsOtpListener();
    const ac = new AbortController();
    syncUi.otpAbortCtrl = ac;
    try {
      const otp = await navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: ac.signal
      });
      if (!otp || !otp.code) return;
      otpInputEl.value = otp.code;
      if (otpFormEl && typeof otpFormEl.requestSubmit === "function") {
        otpFormEl.requestSubmit();
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
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
      const syncTrigger = e.target.closest(".js-open-sync-dialog");
      if (!syncTrigger) return;
      if (syncTrigger.id === "landingLoginBtn" && !isPortalUserAuthenticated()) {
        window.location.hash = "#login";
        syncRouteMode();
        window.scrollTo(0, 0);
        return;
      }
      openSyncDialog();
    });

    const dlg = document.getElementById("syncDialog");
    const closeBtn = document.getElementById("syncDialogClose");
    if (dlg) {
      bindLightDismissFallback(dlg);
      dlg.addEventListener("close", stopSmsOtpListener);
      dlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
        stopSmsOtpListener();
        closeTopLayer(dlg);
      });
    }
    if (closeBtn && dlg) {
      closeBtn.addEventListener("click", function () {
        stopSmsOtpListener();
        closeTopLayer(dlg);
      });
    }

    const emailForm = document.getElementById("syncEmailForm");
    if (emailForm) {
      emailForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const input = document.getElementById("syncEmailInput");
        const submit = emailForm.querySelector("button[type=submit]");
        const email = String((input && input.value) || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          setSyncDialogMsg("Sila masukkan e-mel yang sah.", true);
          return;
        }
        if (submit) submit.disabled = true;
        setSyncDialogMsg("Menghantar kod...");
        try {
          const res = isSupabaseConfigured()
            ? await sbRequestEmailOtp(email)
            : await callBackend("requestEmailOtp", { email: email });
          if (res && res.ok) {
            syncUi.otpEmail = email;
            document.getElementById("syncStepEmail").hidden = true;
            document.getElementById("syncStepCode").hidden = false;
            const ci = document.getElementById("syncCodeInput");
            const cf = document.getElementById("syncCodeForm");
            if (ci) { ci.value = ""; ci.focus(); }
            startSmsOtpListener(ci, cf);
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
        stopSmsOtpListener();
        const code = String((document.getElementById("syncCodeInput") || {}).value || "").replace(/\D/g, "");
        const submit = codeForm.querySelector("button[type=submit]");
        if (code.length !== 6) { setSyncDialogMsg("Masukkan kod 6 digit.", true); return; }
        if (submit) submit.disabled = true;
        try {
          const res = isSupabaseConfigured()
            ? await sbVerifyEmailOtp(syncUi.otpEmail, code)
            : await callBackend("verifyEmailOtp", { email: syncUi.otpEmail, code: code });
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
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        stopSmsOtpListener();
        document.getElementById("syncStepCode").hidden = true;
        document.getElementById("syncStepEmail").hidden = false;
        setSyncDialogMsg("");
      });
    }

    const nowBtn = document.getElementById("syncNowBtn");
    if (nowBtn) {
      nowBtn.addEventListener("click", async function () {
        nowBtn.disabled = true;
        await syncNow({ silent: false });
        nowBtn.disabled = false;
      });
    }

    const outBtn = document.getElementById("syncSignOutBtn");
    if (outBtn) {
      outBtn.addEventListener("click", async function () {
        if (isSupabaseConfigured()) {
          try { await sbSignOut(); } catch (e) {}
        }
        portalState.supabaseAuthenticated = false;
        portalState.openPortalActive = false;
        clearSyncLink();
        renderSyncButton();
        if (dlg && dlg.open) closeTopLayer(dlg);
        const dashEl = document.getElementById("dashboardView");
        if (dashEl && !dashEl.hidden) {
          dashEl.hidden = true;
          window.location.hash = "#login";
          syncRouteMode();
        }
        showToast("Anda telah log keluar daripada sesi awan.");
      });
    }
  }

  let cloudProgressTimer = null;

  function scheduleCloudProgressSync() {
    if (!getSyncLink()) return;
    clearTimeout(cloudProgressTimer);
    cloudProgressTimer = setTimeout(function () {
      cloudProgressTimer = null;
      if (getSyncLink()) syncNow({ silent: true });
    }, 10000);
  }

  function flushCloudProgressSync() {
    if (cloudProgressTimer) {
      clearTimeout(cloudProgressTimer);
      cloudProgressTimer = null;
    }
    if (getSyncLink()) syncNow({ silent: true });
  }

  function cloudSyncAfterSubmit(fileId) {
    if (cloudProgressTimer) {
      clearTimeout(cloudProgressTimer);
      cloudProgressTimer = null;
    }
    if (getSyncLink()) {
      if (syncUi.busy) {
        setTimeout(function () { cloudSyncAfterSubmit(fileId); }, 450);
        return;
      }
      syncNow({ silent: true, completedFileId: fileId });
      return;
    }
    const btn = document.getElementById("syncProgressBtn");
    if (btn) btn.setAttribute("data-nudge", "true");
  }

  function maybeAutoPull() {
    if (syncUi.pulledOnce || !getSyncLink()) return;
    syncUi.pulledOnce = true;
    syncNow({ silent: true });
  }

  // --- [features/auth/unifiedAuthController.js] ---
  /**
   * src/features/auth/unifiedAuthController.js
   * Pengawal Log Masuk Bersepadu: Google Sign-In (One-Tap + OAuth PKCE), WebView Guard, OTP E-mel & Tebus PIN.
   */














  function setLoginAlert(msg, isError) {
    const box = document.getElementById("loginAlertBox");
    const txt = document.getElementById("loginAlertText");
    if (!box || !txt) return;
    if (!msg) {
      box.hidden = true;
      txt.textContent = "";
      return;
    }
    txt.textContent = msg;
    box.hidden = false;
    box.className = "alert-banner " + (isError === false ? "sync-dialog-msg" : "alert-danger");
    if (isError !== false && window.ETutorMotion) {
      window.ETutorMotion.shakeLoginAlert();
    }
  }

  function setupInAppWebViewGuard() {
    const restricted = isRestrictedInAppWebView();
    const loginNotice = document.getElementById("inAppWebViewNotice");
    const syncNotice = document.getElementById("syncWebViewNotice");
    const loginGoogleSec = document.getElementById("loginGoogleSection");
    if (loginNotice) loginNotice.hidden = !restricted;
    if (syncNotice) syncNotice.hidden = !restricted;
    if (loginGoogleSec) loginGoogleSec.hidden = restricted;

    document.addEventListener("click", async function (e) {
      const copyBtn = e.target.closest(".js-copy-portal-url");
      if (!copyBtn) return;
      const targetUrl = "https://etutor.my/";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(targetUrl);
        }
        showToast("Pautan etutor.my disalin! Buka dalam Chrome atau Safari.");
      } catch (err) {
        showToast("Buka https://etutor.my/ terus dalam Chrome atau Safari.");
      }
    });
  }

  function bindLoginModeTabsAndOtp() {
    const tabBtns = document.querySelectorAll("[data-auth-tab]");
    const pinPanel = document.getElementById("loginTabPanelPin");
    const otpPanel = document.getElementById("loginTabPanelOtp");
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const target = btn.getAttribute("data-auth-tab");
        tabBtns.forEach(function (b) {
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        if (pinPanel) pinPanel.hidden = target !== "pin";
        if (otpPanel) otpPanel.hidden = target !== "otp";
        setLoginAlert("");
        if (target !== "otp") stopSmsOtpListener();
      });
    });

    const reqForm = document.getElementById("loginOtpRequestForm");
    const verForm = document.getElementById("loginOtpVerifyForm");
    if (reqForm) {
      reqForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const emailEl = document.getElementById("loginOtpEmailInput");
        const sendBtn = document.getElementById("loginOtpSendBtn");
        const email = String((emailEl && emailEl.value) || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          setLoginAlert("Sila masukkan alamat e-mel yang sah.", true);
          return;
        }
        if (sendBtn) sendBtn.disabled = true;
        setLoginAlert("Menghantar kod pengesahan 6-digit...", false);
        try {
          const res = isSupabaseConfigured()
            ? await sbRequestEmailOtp(email)
            : await callBackend("requestEmailOtp", { email: email });
          if (res && res.ok) {
            syncUi.loginOtpEmail = email;
            reqForm.hidden = true;
            if (verForm) verForm.hidden = false;
            const codeEl = document.getElementById("loginOtpCodeInput");
            if (codeEl) { codeEl.value = ""; codeEl.focus(); }
            startSmsOtpListener(codeEl, verForm);
            setLoginAlert(res.message || "Kod 6 digit telah dihantar ke e-mel anda.", false);
          } else {
            setLoginAlert((res && res.error) || "Gagal menghantar kod e-mel.", true);
          }
        } catch (err) {
          setLoginAlert("Ralat rangkaian. Cuba sebentar lagi.", true);
        } finally {
          if (sendBtn) sendBtn.disabled = false;
        }
      });
    }

    if (verForm) {
      verForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        stopSmsOtpListener();
        const code = String((document.getElementById("loginOtpCodeInput") || {}).value || "").replace(/\D/g, "");
        const verBtn = document.getElementById("loginOtpVerifyBtn");
        if (code.length !== 6) {
          setLoginAlert("Sila masukkan kod 6 digit yang sah.", true);
          return;
        }
        if (verBtn) verBtn.disabled = true;
        try {
          const res = isSupabaseConfigured()
            ? await sbVerifyEmailOtp(syncUi.loginOtpEmail, code)
            : await callBackend("verifyEmailOtp", { email: syncUi.loginOtpEmail, code: code });
          if (res && res.ok) {
            await onSyncLoggedIn(res);
          } else {
            setLoginAlert((res && res.error) || "Kod tidak sah atau tamat tempoh.", true);
          }
        } catch (err) {
          setLoginAlert("Ralat rangkaian. Cuba lagi.", true);
        } finally {
          if (verBtn) verBtn.disabled = false;
        }
      });
    }

    const backBtn = document.getElementById("loginOtpBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        stopSmsOtpListener();
        if (verForm) verForm.hidden = true;
        if (reqForm) reqForm.hidden = false;
        setLoginAlert("");
      });
    }
  }

  function bindGoogleOAuthAndPinRedeemButtons() {
    ["loginGoogleOAuthBtn", "syncGoogleOAuthBtn"].forEach(function (btnId) {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener("click", async function () {
        if (isSupabaseConfigured()) {
          const res = await sbSignInWithGoogleRedirect("#portal");
          if (res && !res.ok) {
            if (btnId.startsWith("sync")) setSyncDialogMsg(res.error, true);
            else setLoginAlert(res.error, true);
          }
          return;
        }
        if (window.google && google.accounts && google.accounts.id) {
          google.accounts.id.prompt();
          return;
        }
        setLoginAlert("Log masuk Google memerlukan konfigurasi Supabase atau Client ID aktif.", true);
      });
    });

    const pinRedeemForm = document.getElementById("syncPinRedeemForm");
    if (pinRedeemForm) {
      pinRedeemForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const uidEl = document.getElementById("syncPinUserIdInput");
        const pinEl = document.getElementById("syncPinCodeInput");
        const submitBtn = document.getElementById("syncPinSubmitBtn");
        const buyerId = String((uidEl && uidEl.value) || "").trim();
        const pin = String((pinEl && pinEl.value) || "").trim();
        if (buyerId.length < 5 || pin.length < 4) {
          setSyncDialogMsg("Masukkan ID Pembeli & Kod PIN yang sah.", true);
          return;
        }
        if (submitBtn) submitBtn.disabled = true;
        setSyncDialogMsg("Mengesahkan Kod PIN...");
        try {
          const sb = getSupabaseClient();
          const sess = sb ? await sb.auth.getSession() : null;
          const hasSbAuth = Boolean(sess && sess.data && sess.data.session);
          if (hasSbAuth) {
            const redeemRes = await sbRedeemBuyerPin(buyerId, pin, portalState.deviceId);
            if (!redeemRes || !redeemRes.ok) {
              setSyncDialogMsg((redeemRes && redeemRes.error) || "Kod PIN tidak sah.", true);
              return;
            }
            await syncNow({ silent: true });
            const dlg = document.getElementById("syncDialog");
            if (dlg) closeTopLayer(dlg);
            showToast("Kod PIN berjaya ditebus & dipautkan ke akaun anda!");
            return;
          }

          const loginRes = await callBackend("login", { userId: buyerId, pin: pin });
          if (!loginRes || !loginRes.ok) {
            setSyncDialogMsg((loginRes && loginRes.error) || "ID atau Kod PIN tidak sah.", true);
            return;
          }
          portalState.sessionToken = loginRes.sessionToken;
          saveSessionLocally(loginRes.sessionToken, loginRes.user);
          const dlg = document.getElementById("syncDialog");
          if (dlg) closeTopLayer(dlg);
          const landingEl = document.getElementById("landingView");
          const loginView = document.getElementById("loginView");
          if (landingEl) landingEl.hidden = true;
          if (loginView) loginView.hidden = true;
          document.getElementById("dashboardView").hidden = false;
          applyDashboardBundle(loginRes);
          showToast("Log masuk Kod PIN berjaya!");
        } catch (err) {
          setSyncDialogMsg("Ralat rangkaian semasa mengesahkan PIN.", true);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  }

  async function hydrateSupabaseAuthSession() {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabaseClient();
    if (!sb) return;
    let lastSyncedToken = "";

    async function syncFromSession(session) {
      if (!session || !session.user) return;
      if (lastSyncedToken === session.access_token && getSyncLink()) return;
      lastSyncedToken = session.access_token;
      const u = session.user;
      const email = String(u.email || "").trim().toLowerCase();
      const meta = u.user_metadata || {};
      const fullName = String(meta.full_name || meta.name || (email ? email.split("@")[0] : "")).trim();
      portalState.supabaseAuthenticated = true;
      setSyncLink(session.access_token, email, {});
      if (fullName && !getOpenStudentName()) setOpenStudentName(fullName);
      const loginEl = document.getElementById("loginView");
      if ((loginEl && !loginEl.hidden) || isHashLogin() || isHashPortal() || hasDeepLinkPortalParams()) {
        await onSyncLoggedIn({ ok: true, syncToken: session.access_token, email: email, name: fullName }, { skipSyncPush: true, quietToast: true });
      }
      const bundle = await sbSyncStudentBundle({});
      if (bundle && bundle.ok) {
        await onSyncLoggedIn(bundle, { skipSyncPush: true, quietToast: true });
      }
    }

    try {
      const sessRes = await sb.auth.getSession();
      const session = sessRes && sessRes.data ? sessRes.data.session : null;
      if (session) await syncFromSession(session);
    } catch (e) {}

    sb.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_IN" && session) {
        syncFromSession(session);
      } else if (event === "SIGNED_OUT") {
        lastSyncedToken = "";
        portalState.supabaseAuthenticated = false;
        clearSyncLink();
        renderSyncButton();
      }
    });
  }

  function initUnifiedAuth() {
    setupInAppWebViewGuard();
    bindLoginModeTabsAndOtp();
    bindGoogleOAuthAndPinRedeemButtons();
    loadGoogleSignIn();
    hydrateSupabaseAuthSession();
  }

  // --- [features/aduan/issueController.js] ---
  /**
   * src/features/aduan/issueController.js
   * Pengendali interaksi borang Aduan / Laporkan Isu eTutor.
   */
  function bindIssueReportingEvents() {
    const openBtn = document.getElementById("openIssueModalBtn");
    const closeBtn = document.getElementById("closeIssueModalBtn");
    const dialog = document.getElementById("issueDialog");
    const submitBtn = document.getElementById("submitIssueBtn");
    const detailsInput = document.getElementById("issueDetailsInput");
    const contactInput = document.getElementById("issueContactInput");
    const successToast = document.getElementById("issueToastSuccess");

    if (!openBtn || !dialog || !submitBtn) return;

    openBtn.addEventListener("click", function () {
      if (successToast) successToast.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        <span>Hantar Laporan</span>
      `;
      dialog.showModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dialog.close();
      });
    }

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    submitBtn.addEventListener("click", async function () {
      const details = (detailsInput && detailsInput.value.trim()) || "";
      if (!details) {
        alert("Sila masukkan sedikit keterangan isu yang anda hadapi.");
        if (detailsInput) detailsInput.focus();
        return;
      }

      const selectedRadio = document.querySelector('input[name="issueCategory"]:checked');
      const cat = (selectedRadio && selectedRadio.value) || "Umum";
      const contact = (contactInput && contactInput.value.trim()) || "Anonim";
      const currentUrl = window.location.href;
      const currentUser = (portalState.user && (portalState.user.userId || portalState.user.buyerName)) || "Guest";
      const devId = (portalState.user && portalState.user.deviceId) || "";

      submitBtn.disabled = true;
      submitBtn.textContent = "Menghantar laporan...";

      try {
        if (isSupabaseConfigured()) {
          const sb = getSupabaseClient();
          if (sb) {
            await sb.rpc("submit_issue_report", {
              p_category: cat,
              p_details: details,
              p_contact: contact,
              p_page_url: currentUrl,
              p_user_key: currentUser
            });
          }
        }
      } catch (err) {}

      try {
        await callBackend("reportIssue", {
          kategori: cat,
          keterangan: details,
          kontak: contact,
          pageUrl: currentUrl,
          userId: currentUser,
          deviceId: devId
        });
      } catch (err) {
        // Teruskan walaupun di luar talian
      }

      if (successToast) successToast.style.display = "block";
      submitBtn.textContent = "Laporan Dihantar";

      setTimeout(function () {
        dialog.close();
        if (detailsInput) detailsInput.value = "";
      }, 1600);
    });
  }

  // --- [features/mobile-app/pwaInstallController.js] ---
  /**
   * src/features/mobile-app/pwaInstallController.js
   * Pendaftaran Service Worker pintar (dilencongkan apabila dalam Capacitor asli)
   * serta aliran pemasangan PWA berpandukan modern-web-guidance (navigator.install & beforeinstallprompt).
   */


  const PWA_DISMISS_STORAGE_KEY = "etutor_pwa_banner_dismissed_v1";
  let deferredInstallPromptEvent = null;
  let pwaFlowBound = false;

  function isStandaloneAppMode() {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    );
  }

  function isIosSafariBrowser() {
    if (typeof navigator === "undefined") return false;
    const ua = String(navigator.userAgent || "");
    const isIos = /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return isIos && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
  }

  function registerSmartServiceWorker() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (isNativeCapacitorPlatform()) return;

    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(function () {});
    });
  }

  function shouldShowInstallBanner() {
    if (isNativeCapacitorPlatform() || isStandaloneAppMode()) return false;
    try {
      if (sessionStorage.getItem(PWA_DISMISS_STORAGE_KEY) === "1") return false;
    } catch (e) {}
    return true;
  }

  function initPwaInstallFlow() {
    registerSmartServiceWorker();
    if (pwaFlowBound) return;
    pwaFlowBound = true;

    const bannerEl = document.getElementById("mobileInstallBanner");
    const installBtn = document.getElementById("installPwaBtn");
    const dismissBtn = document.getElementById("dismissInstallBannerBtn");
    const statusEl = document.getElementById("installPwaStatus");
    const iosDlg = document.getElementById("iosInstallHelpDialog");
    const closeIosBtn = document.getElementById("closeIosInstallHelpBtn");

    if (iosDlg) {
      bindLightDismissFallback(iosDlg);
      iosDlg.addEventListener("cancel", function (ev) {
        ev.preventDefault();
        closeTopLayer(iosDlg);
      });
    }
    if (closeIosBtn && iosDlg) {
      closeIosBtn.addEventListener("click", function () { closeTopLayer(iosDlg); });
    }

    if (!bannerEl || !installBtn) return;

    const supportsWebInstall = typeof Navigator !== "undefined" &&
      Navigator.prototype &&
      typeof Navigator.prototype.install === "function";
    const iosNeedsGuide = isIosSafariBrowser() && !isStandaloneAppMode();

    const revealIfEligible = function () {
      if (shouldShowInstallBanner() && (supportsWebInstall || deferredInstallPromptEvent || iosNeedsGuide)) {
        bannerEl.hidden = false;
      } else {
        bannerEl.hidden = true;
      }
    };

    if (supportsWebInstall || iosNeedsGuide) {
      revealIfEligible();
    }

    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault();
      deferredInstallPromptEvent = event;
      if (!supportsWebInstall) revealIfEligible();
    });

    window.addEventListener("appinstalled", function () {
      deferredInstallPromptEvent = null;
      bannerEl.hidden = true;
      if (statusEl) statusEl.textContent = "Aplikasi eTutor.my berjaya dipasang.";
    });

    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        bannerEl.hidden = true;
        try { sessionStorage.setItem(PWA_DISMISS_STORAGE_KEY, "1"); } catch (e) {}
      });
    }

    installBtn.addEventListener("click", async function () {
      if (installBtn.getAttribute("aria-disabled") === "true") return;

      if (!supportsWebInstall && !deferredInstallPromptEvent && iosNeedsGuide && iosDlg) {
        if (!iosDlg.open && typeof iosDlg.showModal === "function") iosDlg.showModal();
        return;
      }

      installBtn.setAttribute("aria-disabled", "true");
      try {
        if (supportsWebInstall) {
          await navigator.install();
          if (statusEl) statusEl.textContent = "Aplikasi telah dipasang atau dibuka.";
          bannerEl.hidden = true;
        } else if (deferredInstallPromptEvent) {
          const promptEvent = deferredInstallPromptEvent;
          deferredInstallPromptEvent = null;
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;
          if (statusEl) {
            statusEl.textContent = (choice && choice.outcome === "accepted")
              ? "Aplikasi berjaya dipasang."
              : "Pemasangan dibatalkan.";
          }
          if (!deferredInstallPromptEvent) bannerEl.hidden = true;
        }
      } catch (err) {
        if (err && err.name === "AbortError") {
          if (statusEl) statusEl.textContent = "Pemasangan dibatalkan.";
        } else if (statusEl) {
          statusEl.textContent = "Pemasangan tidak dapat dimulakan.";
        }
      } finally {
        installBtn.removeAttribute("aria-disabled");
      }
    });
  }

  // --- [features/mobile-app/phonePersonalizationView.js] ---
  /**
   * src/features/mobile-app/phonePersonalizationView.js
   * Pemeta HUD pemain & penukar tingkatan Aplikasi Telefon (#phonePersonalBar) serta pintasan Cikgu AI.
   */







  let ppBindingsReady_ = false;
  const PP_SVG_GEAR_ = etEqIconSvg("gear");
  const PP_SVG_CAM_ = etEqIconSvg("camera");

  function ppFormShortLabel_(code) {
    if (code === "ALL") return "Semua";
    const num = String(code || "").replace(/\D/g, "");
    return num ? ("Ting. " + num) : "Ting. 5";
  }

  function ppFocusLabel_(focus) {
    if (focus === "kerja_sekolah") return "Kerja Sekolah Cikgu AI";
    if (focus === "pecutan_exam") return "Pecutan Peperiksaan";
    return "Belajar Ikut Bab";
  }

  function ppResolveName_(profile) {
    const raw = (profile && profile.displayName) || (portalState.user && portalState.user.buyerName) || getOpenStudentName() || "";
    const clean = String(raw || "").trim();
    if (!clean || clean === "Pelajar Contoh (Disekat Lalai)") return "Pelajar";
    return clean;
  }

  function ppJumpToPhoneCikguTab_(prefillPrompt) {
    const cikguNavBtn = document.querySelector('#mobileBottomNav [data-phone-tab="cikgu"]');
    if (cikguNavBtn) cikguNavBtn.click();
    const chatInput = document.getElementById("phoneChatInput");
    if (chatInput) {
      if (prefillPrompt && !chatInput.value.trim()) chatInput.value = prefillPrompt;
      setTimeout(function () { chatInput.focus(); }, 60);
    }
  }

  function ppSyncPersonalBar_(profile, activeForm) {
    const bar = document.getElementById("phonePersonalBar");
    if (!bar) return;
    const name = ppResolveName_(profile);
    const greeting = profile.role === "ibu_bapa" ? ("Pantauan " + name) : ("Hai, " + name + "!");
    const forms = Array.isArray(profile.learningForms) && profile.learningForms.length > 0 ? profile.learningForms : [profile.currentForm || "T5"];
    const pillCodes = forms.length > 1 ? forms.concat(["ALL"]) : forms;
    const goalMins = Number(profile.dailyGoalMinutes) || 15;
    const g = typeof etGamifGetState === "function" ? etGamifGetState() : { level: 1, xpIntoLevel: 0, xpNextLevel: 250, levelPct: 0, streakDays: 0 };
    const pct = Math.max(8, Number(g.levelPct) || 0);

    const pillsHtml = pillCodes.map(function (code) {
      const active = activeForm === code;
      return '<button type="button" class="et-form-pill' + (active ? " is-active" : "") + '" data-phone-form-code="' + escapeHtml(code) + '" aria-pressed="' + (active ? "true" : "false") + '">' + escapeHtml(ppFormShortLabel_(code)) + "</button>";
    }).join("");

    bar.innerHTML = [
      '<div class="et-pg-hud-top">',
      '  <div class="et-pg-hud-id">',
      '    ' + etEqLevelCrestSvg(g.level),
      '    <div style="min-inline-size:0"><div class="et-pg-greet">' + escapeHtml(greeting) + '</div><div class="et-pg-submeta">' + escapeHtml(ppFormShortLabel_(profile.currentForm)) + " • Sasaran " + goalMins + " min/hari</div></div>",
      "  </div>",
      '  <div class="et-pg-hud-right">',
      '    <span class="et-streak-pill tabular-nums">' + etEqIconSvg("flame") + "<span>" + g.streakDays + " Hari</span></span>",
      '    <button type="button" id="phoneQuickSettingsBtn" class="et-onb-icon-btn" aria-label="Tetapan Pembelajaran">' + PP_SVG_GEAR_ + "</button>",
      "  </div>",
      "</div>",
      '<div class="et-pg-hud-xp"><div class="et-xp-nums"><strong class="tabular-nums">' + (g.totalXp || 0) + ' XP</strong><span class="tabular-nums">' + g.xpIntoLevel + " / " + g.xpNextLevel + ' XP</span></div><div class="et-xp-track"><div class="et-xp-fill" style="width:' + pct + '%"></div></div></div>',
      '<div class="et-form-switcher" role="group" aria-label="Penukar Tingkatan Telefon">' + pillsHtml + "</div>",
      '<div class="et-pg-quick-acts">',
      '  <button type="button" id="phoneSnapWorkQuickBtn" class="et-pg-act-btn is-emerald js-phone-snap-cikgu">' + PP_SVG_CAM_ + "<span>Snap Kerja Sekolah</span></button>",
      '  <button type="button" class="et-pg-act-btn is-gold" data-open-flashcard="1">' + etEqIconSvg("cards") + "<span>Main Flashcard</span></button>",
      "</div>"
    ].join("\n");
  }

  function ppSyncHomeSubjectsAndHero_(profile, activeForm, hasSpm) {
    const cdStrip = document.getElementById("phoneCountdownStripBtn");
    if (cdStrip) cdStrip.hidden = !hasSpm;
    const formNum = Number(String(activeForm && activeForm !== "ALL" ? activeForm : (profile.currentForm || "T5")).replace(/\D/g, "")) || 5;

    const subRow = document.getElementById("phoneHomeSubjectsRow");
    if (subRow) {
      const catalog = Array.isArray(portalState.catalog) ? portalState.catalog : [];
      const scoped = filterCatalogItemsForStudent(catalog);
      let subs = Array.from(new Set(scoped.map(function (c) { return c.subject; }).filter(Boolean))).sort().slice(0, 8);
      if (subs.length === 0 && Array.isArray(profile.selectedSubjects) && profile.selectedSubjects.length > 0 && !getShowAllSubjectsOverride()) {
        subs = profile.selectedSubjects.slice(0, 8);
      }
      subRow.innerHTML = subs.map(function (s) {
        if (hasSpm) return '<button type="button" class="phone-subj-chip js-phone-quick-subj" data-subj="' + escapeHtml(s) + '">' + escapeHtml(s) + "</button>";
        return '<a class="phone-subj-chip" href="./kssm/tingkatan-' + formNum + '/">' + escapeHtml(s) + "</a>";
      }).join("");
    }

    const hasInProg = Array.isArray(portalState.inProgress) && portalState.inProgress.length > 0;
    if (!hasSpm && !hasInProg) {
      const badgeEl = document.getElementById("phoneHeroBadge");
      const subjEl = document.getElementById("phoneHeroSubject");
      const titleEl = document.getElementById("phoneHeroTitle");
      const metaEl = document.getElementById("phoneHeroMeta");
      const ctaEl = document.getElementById("phonePrimaryQuizBtnText");
      if (badgeEl) badgeEl.textContent = "Hab KSSM • 0 Token";
      if (subjEl) subjEl.textContent = ppFormShortLabel_(activeForm);
      if (titleEl) titleEl.textContent = "Nota & Latih Tubi Bab 1–2 " + ppFormShortLabel_(activeForm);
      if (metaEl) metaEl.textContent = "10 soalan MCQ (+10 XP) & 2 soalan Kertas 2 KSSM sedia dijawab sekarang.";
      if (ctaEl) ctaEl.textContent = "Buka Hab Bab 1–2 " + ppFormShortLabel_(activeForm);
    }
  }

  function ppSyncAccountSettingsCard_(profile) {
    const sumEl = document.getElementById("phoneLearningSettingsSummary");
    if (!sumEl) return;
    const formsText = (Array.isArray(profile.learningForms) && profile.learningForms.length > 0 ? profile.learningForms : [profile.currentForm || "T5"]).map(ppFormShortLabel_).join(", ");
    const subjCount = Array.isArray(profile.selectedSubjects) ? profile.selectedSubjects.length : 0;
    const goalMins = Number(profile.dailyGoalMinutes) || 15;
    sumEl.innerHTML = [
      '<div class="phone-wallet-stats" style="margin-bottom:0">',
      '  <div><span>Tingkatan Semasa</span><strong>' + escapeHtml(ppFormShortLabel_(profile.currentForm)) + "</strong></div>",
      '  <div><span>Fokus Tingkatan</span><strong>' + escapeHtml(formsText) + "</strong></div>",
      '  <div><span>Subjek Pilihan</span><strong class="tabular-nums">' + subjCount + " Subjek</strong></div>",
      '  <div><span>Sasaran Harian</span><strong class="tabular-nums">' + goalMins + " min • " + escapeHtml(ppFocusLabel_(profile.studyFocus)) + "</strong></div>",
      "</div>"
    ].join("");
  }

  function syncPhonePersonalizationUi() {
    const profile = getStudentProfile();
    const activeForm = getActiveFormFilter();
    const hasSpm = hasAnySpmLearningForm(profile);
    ppSyncPersonalBar_(profile, activeForm);
    ppSyncHomeSubjectsAndHero_(profile, activeForm, hasSpm);
    ppSyncAccountSettingsCard_(profile);
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("etutor:phone-home-synced"));
  }

  function initPhonePersonalizationBindings() {
    syncPhonePersonalizationUi();
    if (ppBindingsReady_) return;
    ppBindingsReady_ = true;

    const shell = document.getElementById("phoneAppShell");
    if (shell) {
      shell.addEventListener("click", function (e) {
        if (e.target.closest("#phoneQuickSettingsBtn") || e.target.closest("#phoneOpenSettingsBtn")) {
          openStudentSettingsDialog();
          return;
        }
        const formBtn = e.target.closest("[data-phone-form-code]");
        if (formBtn) { setActiveFormFilter(formBtn.getAttribute("data-phone-form-code") || "T5"); return; }
        if (e.target.closest(".js-phone-snap-cikgu") || e.target.closest(".js-phone-ask-cikgu-empty")) {
          ppJumpToPhoneCikguTab_("Assalamualaikum Cikgu, bantu saya dengan soalan kerja sekolah ini.");
          return;
        }
        if (e.target.closest("#phonePrimaryQuizBtn")) {
          const profile = getStudentProfile();
          const hasSpm = hasAnySpmLearningForm(profile);
          const hasInProg = Array.isArray(portalState.inProgress) && portalState.inProgress.length > 0;
          if (!hasSpm && !hasInProg) {
            const activeForm = getActiveFormFilter();
            const fNum = Number(String(activeForm && activeForm !== "ALL" ? activeForm : (profile.currentForm || "T1")).replace(/\D/g, "")) || 1;
            window.location.href = "./kssm/tingkatan-" + fNum + "/";
          }
        }
      });
    }

    window.addEventListener("etutor:student-profile-updated", syncPhonePersonalizationUi);
    window.addEventListener("etutor:gamification-updated", syncPhonePersonalizationUi);
  }

  // --- [features/mobile-app/phoneAppViewRenderer.js] ---
  /**
   * src/features/mobile-app/phoneAppViewRenderer.js
   * Pemeta DOM langsung bagi 4 tab Aplikasi Telefon (#phoneAppShell) serta kandungan
   * 3 dialog Bottom Sheet (<dialog>: Pratonton Kertas, Leaderboard, dan Jadual SPM 2026).
   */










  const phoneUiState = {
    activeTab: "utama",
    paperCategory: "harian",
    paperSubject: "ALL",
    paperSearch: "",
    selectedFileId: "",
    lbPeriod: "all",
    primaryQuizFileId: ""
  };

  function renderPhoneHeaderAndNavTokens(snapshot) {
    const snap = snapshot || readWalletLocalSnapshot();
    const rem = snap && typeof snap.remaining === "number" ? snap.remaining : 30;
    const topTxt = document.getElementById("phoneHeaderTokenText");
    const navBadge = document.getElementById("mobileNavTokenBadge");
    if (topTxt) topTxt.textContent = rem + " Token";
    if (navBadge) navBadge.textContent = String(rem);
  }

  function renderPhoneHomeTab() {
    const cdEl = document.getElementById("phoneCountdownText");
    if (cdEl) {
      const parts = computeCountdownParts("2026-11-23", "08:00");
      cdEl.textContent = parts.sign > 0
        ? ("SPM 2026: " + parts.days + " hari " + parts.hours + " jam lagi")
        : "Peperiksaan Bertulis SPM 2026 Sedang Berlangsung";
    }

    const ps = portalState.progressSummary || {};
    const doneEl = document.getElementById("phoneKpiDone");
    const gradeEl = document.getElementById("phoneKpiGrade");
    const streakEl = document.getElementById("phoneKpiStreak");
    const xpEl = document.getElementById("phoneKpiXp");
    if (doneEl) doneEl.textContent = String(ps.completedSets || 0);
    if (gradeEl) gradeEl.textContent = ps.averageGrade || "—";
    if (streakEl) streakEl.textContent = (ps.streakDays || 0) + " Hari";
    if (xpEl) xpEl.textContent = Number(ps.totalXp || 0).toLocaleString("en-MY") + " XP";

    const catalog = filterCatalogItemsForStudent(Array.isArray(portalState.catalog) ? portalState.catalog : []);
    const activeProg = Array.isArray(portalState.inProgress) && portalState.inProgress[0] ? portalState.inProgress[0] : null;
    const fallbackItem = catalog.find(function (c) { return c.category !== "klon"; }) || catalog[0] || null;

    const badgeEl = document.getElementById("phoneHeroBadge");
    const subjEl = document.getElementById("phoneHeroSubject");
    const titleEl = document.getElementById("phoneHeroTitle");
    const metaEl = document.getElementById("phoneHeroMeta");
    const progEl = document.getElementById("phoneHeroProgress");
    const ctaEl = document.getElementById("phonePrimaryQuizBtnText");

    if (activeProg) {
      phoneUiState.primaryQuizFileId = activeProg.fileId;
      const ans = Math.max(0, Number(activeProg.answeredCount) || 0);
      const tot = Math.max(1, Number(activeProg.totalQuestions) || 40);
      if (badgeEl) badgeEl.textContent = "Sedang Dijawab";
      if (subjEl) subjEl.textContent = activeProg.subject || "SPM";
      if (titleEl) titleEl.textContent = activeProg.quizTitle || "Set Latihan Terakhir";
      if (metaEl) metaEl.textContent = ans + " / " + tot + " soalan siap • Disimpan " + (activeProg.updatedAt || "tadi");
      if (progEl) { progEl.max = tot; progEl.value = Math.min(ans, tot); }
      if (ctaEl) ctaEl.textContent = "Sambung Menjawab Kuiz";
    } else if (fallbackItem) {
      phoneUiState.primaryQuizFileId = fallbackItem.fileId;
      if (badgeEl) badgeEl.textContent = fallbackItem.category === "klon" ? "Set Klon SPM" : "Set Pra-SPM Negeri";
      if (subjEl) subjEl.textContent = fallbackItem.subject || "SPM";
      if (titleEl) titleEl.textContent = fallbackItem.cleanTitle || "Set Latihan Interaktif";
      if (metaEl) metaEl.textContent = "Skema automatik KSSM & Slip Keputusan Rasmi selepas tamat.";
      if (progEl) { progEl.max = 40; progEl.value = 0; }
      if (ctaEl) ctaEl.textContent = "Mula Menjawab Kuiz";
    } else {
      phoneUiState.primaryQuizFileId = "";
    }

    const weakArr = Array.isArray(ps.weakTopics) ? ps.weakTopics : [];
    const weakTop = weakArr[0] || null;
    const wTitle = document.getElementById("phoneWeakTopicTitle");
    const wMeta = document.getElementById("phoneWeakTopicMeta");
    const wBtn = document.getElementById("phoneAskWeakTopicBtn");
    if (weakTop && wTitle && wMeta && wBtn) {
      wTitle.textContent = weakTop.topic + " (" + weakTop.lowestPct + "%)";
      wMeta.textContent = "Skor terkini di bawah 60%. Ulang kaji terus langkah demi langkah bersama Cikgu AI.";
      wBtn.setAttribute("data-weak-topic", weakTop.topic);
    } else if (wBtn) {
      wBtn.setAttribute("data-weak-topic", "Terangkan teknik menjawab soalan KBAT Kertas 2 agar mendapat markah penuh.");
    }

    const subRow = document.getElementById("phoneHomeSubjectsRow");
    if (subRow) {
      const subs = Array.from(new Set(catalog.map(function (c) { return c.subject; }).filter(Boolean))).sort().slice(0, 8);
      subRow.innerHTML = subs.map(function (s) {
        return '<button type="button" class="phone-subj-chip js-phone-quick-subj" data-subj="' + escapeHtml(s) + '">' + escapeHtml(s) + "</button>";
      }).join("");
    }
    syncPhonePersonalizationUi();
  }

  function renderPhoneKertasTab() {
    const catalog = filterCatalogItemsForStudent(Array.isArray(portalState.catalog) ? portalState.catalog : []);
    const isHarian = phoneUiState.paperCategory === "harian";
    const isKlon = phoneUiState.paperCategory === "klon";
    const isNota = phoneUiState.paperCategory === "nota";
    const hBtn = document.getElementById("phoneSegHarianBtn");
    const kBtn = document.getElementById("phoneSegKlonBtn");
    const nBtn = document.getElementById("phoneSegNotaBtn");
    if (hBtn) hBtn.setAttribute("aria-pressed", isHarian ? "true" : "false");
    if (kBtn) kBtn.setAttribute("aria-pressed", isKlon ? "true" : "false");
    if (nBtn) nBtn.setAttribute("aria-pressed", isNota ? "true" : "false");

    const harianCount = catalog.filter(function (c) { return c.category !== "klon"; }).length;
    const klonCount = catalog.filter(function (c) { return c.category === "klon"; }).length;
    const hcEl = document.getElementById("phoneSegHarianCount");
    const kcEl = document.getElementById("phoneSegKlonCount");
    const ncEl = document.getElementById("phoneSegNotaCount");
    if (hcEl) hcEl.textContent = harianCount + " set • 0T";
    if (kcEl) kcEl.textContent = klonCount + " set • 2T";
    if (ncEl) ncEl.textContent = filterNotaItemsForStudent(getNotaCatalogList()).length + " bab • 2T";
    if (isNota) {
      renderPhoneNotaList(phoneUiState, document.getElementById("phonePaperList"), document.getElementById("phonePaperSubjectsRow"));
      return;
    }

    const catItems = catalog.filter(function (c) {
      return isHarian ? c.category !== "klon" : c.category === "klon";
    });
    const subjects = ["ALL"].concat(Array.from(new Set(catItems.map(function (c) { return c.subject; }).filter(Boolean))).sort());
    if (phoneUiState.paperSubject !== "ALL" && subjects.indexOf(phoneUiState.paperSubject) === -1) {
      phoneUiState.paperSubject = "ALL";
    }

    const chipRow = document.getElementById("phonePaperSubjectsRow");
    if (chipRow) {
      chipRow.innerHTML = subjects.map(function (s) {
        const pressed = phoneUiState.paperSubject === s ? "true" : "false";
        const label = s === "ALL" ? "Semua Subjek" : s;
        return '<button type="button" class="phone-subj-chip js-phone-filter-subj" data-subj="' + escapeHtml(s) + '" aria-pressed="' + pressed + '">' + escapeHtml(label) + "</button>";
      }).join("");
    }

    const q = phoneUiState.paperSearch.trim().toLowerCase();
    const filtered = catItems.filter(function (item) {
      if (phoneUiState.paperSubject !== "ALL" && item.subject !== phoneUiState.paperSubject) return false;
      if (q) {
        const hay = [item.cleanTitle, item.subject, item.setCode, item.stateOrSource].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    const listEl = document.getElementById("phonePaperList");
    if (!listEl) return;
    if (filtered.length === 0) {
      listEl.innerHTML = catalog.length === 0
        ? '<div class="phone-card phone-smart-empty"><h3>Latihan UPSA &amp; UASA Sesi 2027 Akan Dibuka</h3><p>Sementara menanti set soalan baharu, tanya atau snap gambar kerja sekolah dengan Cikgu AI.</p><button type="button" class="btn btn-primary btn-sm js-phone-ask-cikgu-empty">Tanya / Snap Kerja Sekolah Cikgu AI</button></div>'
        : '<div class="phone-card" style="text-align:center;color:#475569">Tiada set kertas soalan sepadan dengan penapis semasa.</div>';
      return;
    }

    listEl.innerHTML = filtered.slice(0, 60).map(function (item) {
      const isKlon = item.category === "klon";
      const unlocked = !isKlon || isKlonItemUnlocked(item);
      const costLabel = isKlon ? (unlocked ? "Dibuka Kunci" : (KLON_UNLOCK_COST + " Token")) : "0 Token";
      const costCls = isKlon && !unlocked ? "phone-badge-cost is-klon" : "phone-badge-cost";
      const progText = item.inProgress
        ? ((item.inProgress.answeredCount || 0) + "/" + (item.inProgress.totalQuestions || 40) + " soalan dijawab")
        : (item.bestScore ? ("Terbaik: " + item.bestScore.percentage + "% (" + escapeHtml(item.bestScore.grade) + ")") : (item.stateOrSource || "Sedia dijawab"));

      return [
        '<button type="button" class="phone-paper-card" data-phone-file-id="' + escapeHtml(item.fileId) + '">',
        '  <div>',
        '    <div class="phone-paper-badges">',
        '      <span class="phone-badge-code tabular-nums">' + escapeHtml((item.setCode || (isKlon ? "KLON" : "SET")) + " • " + item.subject) + "</span>",
        '      <span class="' + costCls + '">' + escapeHtml(costLabel) + "</span>",
        "    </div>",
        '    <h3 class="phone-paper-title">' + escapeHtml(item.cleanTitle) + "</h3>",
        '    <p class="phone-paper-meta tabular-nums">' + escapeHtml(progText) + "</p>",
        "  </div>",
        '  <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>',
        "</button>"
      ].join("");
    }).join("");
  }

  function renderPhoneAkaunTab() {
    const lnk = getSyncLink();
    const displayName = getOpenStudentName() || (portalState.user && portalState.user.buyerName) || (lnk && lnk.email ? lnk.email.split("@")[0] : "Pelajar eTutor");
    const avatarEl = document.getElementById("phoneUserAvatar");
    const nameEl = document.getElementById("phoneUserName");
    const statusEl = document.getElementById("phoneUserStatusBadge");
    const devEl = document.getElementById("phoneDeviceIdText");
    if (avatarEl) avatarEl.textContent = String(displayName || "E").trim().charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = displayName;
    if (statusEl) {
      statusEl.textContent = portalState.supabaseAuthenticated ? "Akaun Awan Disahkan" : (portalState.sessionToken ? "Akses PIN Berdaftar" : "Mod Tetamu Aktif");
    }
    if (devEl) devEl.textContent = "ID Peranti: " + getOrCreateDeviceId();

    const s = readWalletLocalSnapshot();
    const setText = function (id, val) { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText("phoneWalletReadyVal", "Sedia Guna: " + s.remaining + " Token");
    setText("phoneWalletDailyVal", s.freeDailyRemaining + " / 5");
    setText("phoneWalletMonthlyVal", s.freeMonthlyRemaining + " / 30");
    setText("phoneWalletPaidVal", String(s.paidBalance));
    setText("phoneWalletVisionVal", s.paidBalance >= 3 ? "Aktif" : (s.trialVisionRemaining + " Percubaan"));
    setText("phoneReferralCodeVal", (portalState.supabaseAuthenticated && s.serverReferralCode) ? s.serverReferralCode : "Log Masuk Dahulu");
    setText("phoneReferralQuotaVal", (s.monthlyReferralsCount || 0) + " / 20 rakan bulan ini");

    const dangerCard = document.getElementById("phoneAccountDangerCard");
    if (dangerCard) dangerCard.hidden = !Boolean(portalState.supabaseAuthenticated || portalState.sessionToken);
  }

  function populatePhonePaperDialog(fileId) {
    phoneUiState.selectedFileId = fileId;
    const item = (portalState.catalog || []).find(function (c) { return c.fileId === fileId; });
    if (!item) return false;
    const isKlon = item.category === "klon";
    const unlocked = !isKlon || isKlonItemUnlocked(item);
    document.getElementById("phoneSheetBadge").textContent = isKlon ? (unlocked ? "Set Klon SPM • Dibuka Kekal" : ("Set Klon SPM • " + KLON_UNLOCK_COST + " Token")) : "Pra-SPM Negeri • 0 Token";
    document.getElementById("phonePaperDialogTitle").textContent = item.cleanTitle;
    document.getElementById("phoneSheetMeta").textContent = item.subject + (item.stateOrSource ? " • " + item.stateOrSource : "");
    document.getElementById("phoneSheetProgress").textContent = item.inProgress
      ? ("Kemajuan disimpan: " + (item.inProgress.answeredCount || 0) + " / " + (item.inProgress.totalQuestions || 40) + " soalan")
      : (item.bestScore ? ("Rekod terbaik: " + item.bestScore.percentage + "% (Gred " + item.bestScore.grade + ")") : "Belum dijawab lagi.");
    document.getElementById("phoneConfirmStartQuizBtn").textContent = item.inProgress ? "Sambung Menjawab" : (unlocked ? "Mula Menjawab Sekarang" : ("Buka Kunci Kekal (" + KLON_UNLOCK_COST + " Token) & Mula"));
    const viewRepBtn = document.getElementById("phoneViewReportBtn");
    if (viewRepBtn) viewRepBtn.hidden = !Boolean(item.bestScore);
    const restartBtn = document.getElementById("phoneRestartQuizBtn");
    if (restartBtn) restartBtn.hidden = !Boolean(item.inProgress);
    return true;
  }

  function populatePhoneLeaderboardDialog() {
    const lb = portalState.leaderboard || { entries: [], myStanding: null };
    document.querySelectorAll(".js-phone-lb-period").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-phone-lb-period") === phoneUiState.lbPeriod ? "true" : "false");
    });
    const listEl = document.getElementById("phoneLbList");
    if (listEl) {
      const entries = Array.isArray(lb.entries) ? lb.entries : [];
      listEl.innerHTML = entries.length === 0
        ? '<p style="color:#475569;text-align:center;margin:12px 0">Belum ada rekod markah dihantar.</p>'
        : entries.map(function (e) {
            return '<div class="phone-lb-row"><div><strong>#' + e.rank + " " + escapeHtml(e.displayName) + (e.isCurrentUser ? " (Anda)" : "") + '</strong><div style="font-size:0.74rem;color:#475569" class="tabular-nums">' + e.setsCompleted + " set • Purata " + e.averageScore + '%</div></div><strong class="tabular-nums" style="color:var(--brand-primary)">' + Number(e.xp).toLocaleString("en-MY") + " XP</strong></div>";
          }).join("");
    }
  }

  function populatePhoneScheduleDialog() {
    const parts = computeCountdownParts("2026-11-23", "08:00");
    const hero = document.getElementById("phoneSchedHero");
    if (hero) {
      hero.textContent = parts.sign > 0
        ? ("Peperiksaan Bertulis SPM 2026 bermula dalam " + parts.days + " hari " + parts.hours + " jam (23 Nov – 17 Dis 2026)")
        : "Peperiksaan Bertulis SPM 2026 (23 Nov – 17 Dis 2026)";
    }
    const listEl = document.getElementById("phoneSchedList");
    if (listEl && SPM_SCHEDULE && Array.isArray(SPM_SCHEDULE.subjects)) {
      const rows = [];
      SPM_SCHEDULE.subjects.slice(0, 12).forEach(function (subj) {
        const p = (subj.papers || [])[0];
        if (!p) return;
        rows.push('<div class="phone-sched-row"><div><strong>' + escapeHtml(p.code + " " + subj.name) + '</strong><div style="font-size:0.74rem;color:#475569">' + escapeHtml(p.title) + '</div></div><span class="tabular-nums" style="font-weight:700;color:var(--brand-primary)">' + escapeHtml(formatMalayDateShort(p.date, p.endDate) + " • " + formatMalayTimeLabel(p.start)) + "</span></div>");
      });
      listEl.innerHTML = rows.join("");
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("etutor:student-profile-updated", function () { renderPhoneHomeTab(); renderPhoneKertasTab(); renderPhoneAkaunTab(); });
  }

  // --- [features/mobile-app/phoneCikguChatController.js] ---
  /**
   * src/features/mobile-app/phoneCikguChatController.js
   * Pengawal Tab Chat Cikgu AI Aplikasi Telefon: mesej teks (1T), snap Kertas 2 (3T),
   * kemasan Mod Hibrid taktil Duolingo, perlindungan XSS/Matematik, dan IME-safe Enter submit.
   */



  const SNAP_IMAGE_TOKEN_COST = 3;
  const TEXT_CHAT_TOKEN_COST = 1;
  const PHONE_HYB_SVG_STAR = '<svg class="phone-hyb-star" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 14.9 8.6 22 9.3 16.6 14 18.2 21 12 17.3 5.8 21 7.4 14 2 9.3 9.1 8.6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const PHONE_HYB_SVG_CHK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  const PHONE_HYB_SVG_EYE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  const phoneChatState = {
    subject: "Matematik", isStreaming: false, hybridMode: false, pendingHintStage: "bimbing",
    lastHomeworkQuestion: "", pendingImage: null, history: [],
    messages: [{ role: "bot", subject: "Umum", time: "Sekarang", text: "Hai! Saya Cikgu AI eTutor SPM.\n\nTaip soalan (1 Token) atau tekan ikon kamera di kiri untuk semak foto jalan kerja Kertas 2 anda (3 Token)." }]
  };

  function formatSafeCikguHtml(rawText) {
    let safe = escapeHtml(String(rawText || ""));
    safe = safe.replace(/\*\*\[([^\]]+)\]\*\*/g, function (_, title) {
      const up = title.toUpperCase();
      const cls = /PETUNJUK|SEMAKAN|PEMBETULAN/.test(up) ? "is-sec-hint" : (/GILIRAN/.test(up) ? "is-sec-try" : (/JALAN KERJA|TIP/.test(up) ? "is-sec-full" : "is-sec-kssm"));
      return '<div class="cikgu-ai-sec-badge ' + cls + '">' + title + "</div>";
    });
    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    safe = safe.replace(/\[(\d+\s*(?:m|markah))\]/gi, '<span class="cikgu-ai-mark-pill">$1</span>');
    return safe.split(/\r?\n/).map(function (line) {
      const t = line.trim();
      if (!t) return '<div style="height:6px"></div>';
      if (/^[-•]\s+/.test(t)) return '<div style="padding-left:10px">• ' + t.replace(/^[-•]\s+/, "") + "</div>";
      return '<p style="margin:0 0 4px">' + line + "</p>";
    }).join("");
  }

  function nowTimeShort() {
    try { return new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit", hour12: false }); } catch (e) { return "Kini"; }
  }

  function syncChatImageBarAndCost() {
    const bar = document.getElementById("phoneChatImageBar");
    const thumb = document.getElementById("phoneChatImageThumb");
    const nameEl = document.getElementById("phoneChatImageName");
    const costEl = document.getElementById("phoneChatCostBadge");
    const img = phoneChatState.pendingImage;
    if (bar && thumb && nameEl) {
      if (img) { thumb.src = img.dataUrl; nameEl.textContent = img.name || "jawapan_kertas2.jpg"; bar.hidden = false; }
      else { thumb.removeAttribute("src"); bar.hidden = true; }
    }
    if (costEl) costEl.textContent = (img ? SNAP_IMAGE_TOKEN_COST : TEXT_CHAT_TOKEN_COST) + "T";
  }

  function syncPhoneHybridUi() {
    const togBtn = document.getElementById("phoneHybridModeBtn");
    const bar = document.getElementById("phoneHybridStageBar");
    const inp = document.getElementById("phoneChatInput");
    const isHyb = Boolean(phoneChatState.hybridMode);
    const isCheck = isHyb && phoneChatState.pendingHintStage === "semak_cubaan";
    if (togBtn) togBtn.setAttribute("aria-pressed", isHyb ? "true" : "false");
    if (bar) bar.hidden = !isCheck;
    if (inp) inp.placeholder = isCheck ? "Taip cubaan jawapan..." : (isHyb ? "Taip soalan bimbingan..." : "Tanya Cikgu AI atau taip jawapan...");
  }

  function buildPhoneHybridHead(m) {
    const stg = String(m.hintStage || "bimbing");
    const step = stg === "jalan_kerja_penuh" ? 3 : (stg === "semak_cubaan" ? 2 : 1);
    const pct = step === 3 ? 100 : (step === 2 ? 66 : 33);
    const dots = [1, 2, 3].map(function (n) { return '<span class="phone-hyb-stepdot is-d' + n + (step >= n ? " is-on" : "") + '"></span>'; }).join("");
    return '<div class="phone-hyb-head"><div class="phone-hyb-top"><img src="./images/hero-student-3d.webp" alt="" class="phone-hyb-avatar" width="32" height="32" decoding="async"><div class="phone-hyb-pills"><span class="phone-hyb-pill is-brand">Cikgu AI • ' + escapeHtml(m.subject || phoneChatState.subject) + '</span><span class="phone-hyb-pill is-online"><span class="phone-hyb-online-dot"></span>Online</span><span class="phone-hyb-pill is-tutor">AI Tutor</span></div><span class="phone-hyb-time tabular-nums">' + escapeHtml(m.time) + '</span></div><div class="phone-hyb-prog" aria-label="Kemajuan bimbingan Langkah ' + step + ' dari 3"><span class="phone-hyb-prog-lbl">Langkah ' + step + ' dari 3</span>' + PHONE_HYB_SVG_STAR + '<div class="phone-hyb-track"><div class="phone-hyb-fill" style="width:' + pct + '%"></div>' + dots + '</div><span class="phone-hyb-pct tabular-nums">(' + pct + '%)</span></div></div>';
  }

  function renderPhoneChatMessages() {
    const box = document.getElementById("phoneChatMessages");
    if (!box) return;
    box.innerHTML = phoneChatState.messages.map(function (m, idx) {
      if (m.role === "user") {
        return '<div class="phone-msg-row is-user"><div class="phone-msg-bubble">' +
          (m.imageUrl ? '<img src="' + escapeHtml(m.imageUrl) + '" alt="Lampiran jawapan murid" class="phone-msg-img">' : "") +
          "<div>" + formatSafeCikguHtml(m.text) + '</div><div class="phone-msg-foot tabular-nums"><span>' + escapeHtml(m.time) + "</span><span>• -" + (m.cost || TEXT_CHAT_TOKEN_COST) + " Token</span></div></div></div>";
      }
      const isHyb = m.mod === "bimbing_kerja_sekolah";
      const showHyb = isHyb && (m.hintStage === "bimbing" || m.hintStage === "semak_cubaan") && !m.isStreaming;
      const headHtml = isHyb ? buildPhoneHybridHead(m) : '<div class="phone-msg-head"><span>Cikgu AI • ' + escapeHtml(m.subject || phoneChatState.subject) + '</span><span class="tabular-nums">' + escapeHtml(m.time) + "</span></div>";
      const hybHtml = showHyb ? ('<div class="phone-hyb-actions"><button type="button" class="phone-hyb-btn is-check" data-phone-hyb-action="semak_cubaan" data-msg-idx="' + idx + '">' + PHONE_HYB_SVG_CHK + '<span>Semak Cubaan Saya</span></button><button type="button" class="phone-hyb-btn is-reveal" data-phone-hyb-action="jalan_kerja_penuh" data-msg-idx="' + idx + '">' + PHONE_HYB_SVG_EYE + "<span>Tunjuk Jalan Kerja Penuh</span></button></div>") : "";
      return '<div class="phone-msg-row is-bot' + (isHyb ? " is-hybrid-bot" : "") + '"><div class="phone-msg-bubble">' + headHtml + '<div class="phone-msg-body">' + formatSafeCikguHtml(m.text) + "</div>" + hybHtml + "</div></div>";
    }).join("");
    setTimeout(function () { box.scrollTop = box.scrollHeight; }, 20);
  }

  function compressPhoneImageFile(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("Gagal membaca gambar.")); };
      reader.onload = function () {
        const img = new Image();
        img.onerror = function () { reject(new Error("Format gambar tidak disokong.")); };
        img.onload = function () {
          const scale = Math.min(1, 1280 / Math.max(img.width || 1, img.height || 1));
          const w = Math.max(1, Math.round((img.width || 1) * scale));
          const h = Math.max(1, Math.round((img.height || 1) * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve({ dataUrl: dataUrl, base64: dataUrl.split(",")[1] || "", mime: "image/jpeg", name: file.name || "jawapan_kertas2.jpg" });
        };
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  async function submitPhoneCikguTurn(turnOpts) {
    if (phoneChatState.isStreaming) return;
    const inputEl = document.getElementById("phoneChatInput");
    const sendBtn = document.getElementById("phoneChatSendBtn");
    const subjSel = document.getElementById("phoneCikguSubjectSelect");
    if (!inputEl) return;

    const opts = turnOpts && typeof turnOpts === "object" ? turnOpts : {};
    const hasImg = Boolean(phoneChatState.pendingImage && phoneChatState.pendingImage.base64);
    const rawText = opts.displayText ? String(opts.displayText).trim() : inputEl.value.trim();
    if (!rawText && !hasImg) { inputEl.focus(); return; }

    const needTok = hasImg ? SNAP_IMAGE_TOKEN_COST : TEXT_CHAT_TOKEN_COST;
    const snap = readWalletLocalSnapshot();
    if (snap.remaining < needTok) {
      showToast("Baki token AI tidak mencukupi (perlu " + needTok + " Token).");
      openTokenWalletDialog();
      return;
    }

    const subj = (subjSel && subjSel.value) || phoneChatState.subject || "auto";
    const promptText = rawText || "Sila semak dan berikan markah mengikut skema LPM bagi gambar jawapan ini.";
    const reqMod = opts.mod ? String(opts.mod) : (phoneChatState.hybridMode ? "bimbing_kerja_sekolah" : (hasImg ? "semak_gambar" : "auto"));
    const reqStage = reqMod === "bimbing_kerja_sekolah" ? String(opts.tahap_bimbingan || phoneChatState.pendingHintStage || "bimbing") : "";
    if (reqMod === "bimbing_kerja_sekolah" && reqStage === "bimbing") phoneChatState.lastHomeworkQuestion = promptText;
    if (phoneChatState.pendingHintStage === "semak_cubaan") { phoneChatState.pendingHintStage = "bimbing"; syncPhoneHybridUi(); }

    const imgCopy = phoneChatState.pendingImage ? Object.assign({}, phoneChatState.pendingImage) : null;
    if (!opts.displayText) { inputEl.value = ""; inputEl.style.height = "auto"; }
    phoneChatState.pendingImage = null;
    syncChatImageBarAndCost();

    phoneChatState.messages.push({
      role: "user", subject: subj, time: nowTimeShort(),
      text: promptText, imageUrl: imgCopy ? imgCopy.dataUrl : "", cost: needTok
    });
    const hwQ = String(opts.homeworkQuestion || phoneChatState.lastHomeworkQuestion || promptText);
    const botMsg = { role: "bot", subject: subj, time: nowTimeShort(), text: "Cikgu sedang meneliti soalan anda...", mod: reqMod, hintStage: reqStage, homeworkQuestion: hwQ, isStreaming: true };
    phoneChatState.messages.push(botMsg);
    phoneChatState.isStreaming = true;
    if (sendBtn) sendBtn.disabled = true;
    renderPhoneChatMessages();

    try {
      const aiApi = window.__CIKGU_AI_INSTANCE__;
      if (!aiApi || !aiApi.client) throw new Error("Pelayan Cikgu AI sedang dimulakan. Sila cuba sebentar lagi.");
      if (aiApi.warmupMachine && aiApi.warmupMachine.status !== "ready" && !hasImg) await aiApi.warmupMachine.greetCikgu();

      let acc = "";
      const semakBody = {
        subjek: subj, mod: reqMod,
        soalan: (reqMod === "bimbing_kerja_sekolah" && reqStage !== "bimbing" ? hwQ : promptText).slice(0, 5500),
        jawapan_pelajar: reqMod === "bimbing_kerja_sekolah" && reqStage === "semak_cubaan" ? promptText.slice(0, 3500) : (hasImg ? promptText.slice(0, 3500) : ""),
        imej_base64: hasImg ? imgCopy.base64.slice(0, 255000) : "", imej_mime: hasImg ? imgCopy.mime : "image/jpeg",
        sesi_sudah_sapa: phoneChatState.history.length > 0, sejarah_sembang: phoneChatState.history.slice(-6),
        markah_penuh: hasImg ? 6 : 4, max_tokens: hasImg ? 520 : 360
      };
      if (reqMod === "bimbing_kerja_sekolah") semakBody.tahap_bimbingan = reqStage || "bimbing";
      const streamRes = await aiApi.client.streamSemak(semakBody, {
        onMeta: function (meta) {
          if (meta && meta.mod) botMsg.mod = meta.mod;
          if (meta && meta.tahap_bimbingan) botMsg.hintStage = meta.tahap_bimbingan;
        },
        onToken: function (tok) { acc += tok; botMsg.text = acc; renderPhoneChatMessages(); }
      });

      if (acc.trim()) {
        botMsg.text = acc.trim();
        phoneChatState.history.push({ role: "user", content: promptText.slice(0, 500) }, { role: "assistant", content: acc.trim().slice(0, 700) });
        if (!streamRes || !streamRes.syncedFromHeaders) {
          const cur = readWalletLocalSnapshot();
          const useFree = Math.min(needTok, Math.max(0, cur.freeDailyRemaining));
          persistAndBroadcastWallet({
            freeDailyRemaining: Math.max(0, cur.freeDailyRemaining - useFree),
            freeRemaining: Math.max(0, cur.freeDailyRemaining - useFree),
            freeMonthlyRemaining: Math.max(0, cur.freeMonthlyRemaining - useFree),
            paidBalance: Math.max(0, cur.paidBalance - (needTok - useFree))
          });
        }
      }
    } catch (err) {
      botMsg.mod = "";
      botMsg.text = "Maaf, semakan tidak dapat diselesaikan buat masa ini (" + ((err && err.message) || "Ralat rangkaian") + "). Token anda tidak dipotong.";
    } finally {
      botMsg.isStreaming = false;
      phoneChatState.isStreaming = false;
      if (sendBtn) sendBtn.disabled = false;
      renderPhoneChatMessages();
    }
  }

  function jumpToPhoneCikguTopic(topicText, subj) {
    const inputEl = document.getElementById("phoneChatInput");
    const subjSel = document.getElementById("phoneCikguSubjectSelect");
    if (subj && subjSel) {
      for (let i = 0; i < subjSel.options.length; i++) {
        if (subjSel.options[i].value === subj) { subjSel.value = subj; break; }
      }
    }
    if (inputEl) { inputEl.value = "Cikgu, bantu saya faham topik ini: " + String(topicText || ""); inputEl.focus(); }
  }

  function initPhoneCikguChat() {
    const sel = document.getElementById("phoneCikguSubjectSelect");
    const cfgSubjs = (window.ETUTOR_CONFIG && window.ETUTOR_CONFIG.DEFAULT_SUBJECTS) || ["Bahasa Melayu", "Bahasa Inggeris", "Sejarah", "Matematik", "Sains", "Fizik", "Kimia", "Biologi", "Matematik Tambahan"];
    if (sel && sel.options.length === 0) {
      sel.innerHTML = cfgSubjs.map(function (s) { return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + "</option>"; }).join("");
      sel.value = phoneChatState.subject;
      sel.addEventListener("change", function () { phoneChatState.subject = sel.value; });
    }
    const form = document.getElementById("phoneChatForm");
    const inputEl = document.getElementById("phoneChatInput");
    const fileEl = document.getElementById("phoneChatFileInput");
    const snapBtn = document.getElementById("phoneSnapBtn");
    const rmImgBtn = document.getElementById("phoneRemoveImageBtn");
    const clearBtn = document.getElementById("phoneClearChatBtn");
    const hybBtn = document.getElementById("phoneHybridModeBtn");
    const hybCancel = document.getElementById("phoneHybridStageCancelBtn");
    const msgBox = document.getElementById("phoneChatMessages");

    if (hybBtn) hybBtn.addEventListener("click", function () { phoneChatState.hybridMode = !phoneChatState.hybridMode; phoneChatState.pendingHintStage = "bimbing"; syncPhoneHybridUi(); });
    if (hybCancel) hybCancel.addEventListener("click", function () { phoneChatState.pendingHintStage = "bimbing"; syncPhoneHybridUi(); });
    if (msgBox) {
      msgBox.addEventListener("click", function (ev) {
        const actBtn = ev.target.closest("[data-phone-hyb-action]");
        if (!actBtn) return;
        const act = actBtn.getAttribute("data-phone-hyb-action");
        if (act === "semak_cubaan") {
          phoneChatState.hybridMode = true; phoneChatState.pendingHintStage = "semak_cubaan";
          syncPhoneHybridUi(); if (inputEl) inputEl.focus();
        } else if (act === "jalan_kerja_penuh") {
          const msg = phoneChatState.messages[Number(actBtn.getAttribute("data-msg-idx"))];
          submitPhoneCikguTurn({ mod: "bimbing_kerja_sekolah", tahap_bimbingan: "jalan_kerja_penuh", displayText: "Tunjuk jalan kerja penuh bagi soalan ini.", homeworkQuestion: (msg && msg.homeworkQuestion) || phoneChatState.lastHomeworkQuestion });
        }
      });
    }
    if (snapBtn && fileEl) snapBtn.addEventListener("click", function () { fileEl.click(); });
    if (rmImgBtn) rmImgBtn.addEventListener("click", function () { phoneChatState.pendingImage = null; if (fileEl) fileEl.value = ""; syncChatImageBarAndCost(); });
    if (fileEl) {
      fileEl.addEventListener("change", async function () {
        const f = fileEl.files && fileEl.files[0];
        if (!f) return;
        try { phoneChatState.pendingImage = await compressPhoneImageFile(f); syncChatImageBarAndCost(); showToast("Gambar sedia disemak (3 Token apabila dihantar)."); }
        catch (err) { showToast((err && err.message) || "Gagal memproses gambar."); }
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", function () { phoneChatState.history = []; phoneChatState.pendingHintStage = "bimbing"; phoneChatState.messages = [phoneChatState.messages[0]]; syncPhoneHybridUi(); renderPhoneChatMessages(); });
    document.querySelectorAll("[data-cikgu-prompt]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-cikgu-hybrid") === "1") { phoneChatState.hybridMode = true; phoneChatState.pendingHintStage = "bimbing"; syncPhoneHybridUi(); }
        if (inputEl) { inputEl.value = btn.getAttribute("data-cikgu-prompt") || ""; inputEl.focus(); }
      });
    });
    if (inputEl && form) {
      let lastCompositionEndAt = null;
      inputEl.addEventListener("compositionend", function (ev) { lastCompositionEndAt = ev.timeStamp; });
      inputEl.addEventListener("input", function () { inputEl.style.height = "auto"; inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px"; });
      inputEl.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          if (ev.isComposing || ev.keyCode === 229) return;
          if (lastCompositionEndAt !== null && Math.abs(ev.timeStamp - lastCompositionEndAt) < 50) return;
          form.requestSubmit();
        }
      });
    }
    if (form) form.addEventListener("submit", function (ev) { ev.preventDefault(); submitPhoneCikguTurn(); });
    syncPhoneHybridUi();
    syncChatImageBarAndCost();
    renderPhoneChatMessages();
  }

  // --- [features/mobile-app/phoneAppEvents.js] ---
  /**
   * src/features/mobile-app/phoneAppEvents.js
   * Pengikat acara DOM bagi Aplikasi Telefon 4-Tab (#phoneAppShell, #mobileBottomNav)
   * serta kawalan 3 Bottom Sheet <dialog> (Pratonton Kertas, Leaderboard, Jadual SPM).
   */















  function switchPhoneTab(tabName) {
    const valid = ["utama", "kertas", "cikgu", "akaun"].indexOf(tabName) !== -1 ? tabName : "utama";
    phoneUiState.activeTab = valid;
    ["utama", "kertas", "cikgu", "akaun"].forEach(function (t) {
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      const panel = document.getElementById("phoneTab" + cap);
      if (panel) panel.hidden = t !== valid;
    });
    const nav = document.getElementById("mobileBottomNav");
    if (nav) {
      nav.querySelectorAll("[data-phone-tab]").forEach(function (btn) {
        if (btn.getAttribute("data-phone-tab") === valid) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      });
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function bindPhoneDialogControls() {
    [
      ["phonePaperDialog", "closePhonePaperDialogBtn"],
      ["phoneLeaderboardDialog", "closePhoneLbDialogBtn"],
      ["phoneScheduleDialog", "closePhoneSchedDialogBtn"]
    ].forEach(function (pair) {
      const dlg = document.getElementById(pair[0]);
      const closeBtn = document.getElementById(pair[1]);
      if (dlg) {
        bindLightDismissFallback(dlg);
        dlg.addEventListener("cancel", function (ev) { ev.preventDefault(); closeTopLayer(dlg); });
      }
      if (dlg && closeBtn) closeBtn.addEventListener("click", function () { closeTopLayer(dlg); });
    });

    const startBtn = document.getElementById("phoneConfirmStartQuizBtn");
    const viewRepBtn = document.getElementById("phoneViewReportBtn");
    const resetBtn = document.getElementById("phoneRestartQuizBtn");
    const paperDlg = document.getElementById("phonePaperDialog");
    if (startBtn) {
      startBtn.addEventListener("click", async function () {
        const fId = phoneUiState.selectedFileId;
        if (paperDlg && paperDlg.open) await closeTopLayer(paperDlg);
        if (fId) openQuizSet(fId, true, false);
      });
    }
    if (viewRepBtn) {
      viewRepBtn.addEventListener("click", async function () {
        const fId = phoneUiState.selectedFileId;
        if (paperDlg && paperDlg.open) await closeTopLayer(paperDlg);
        if (fId) openSavedReportForFile(fId);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", async function () {
        const fId = phoneUiState.selectedFileId;
        if (paperDlg && paperDlg.open) await closeTopLayer(paperDlg);
        if (fId) openQuizSet(fId, false, true);
      });
    }

    document.querySelectorAll(".js-phone-lb-period").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        phoneUiState.lbPeriod = btn.getAttribute("data-phone-lb-period") || "all";
        populatePhoneLeaderboardDialog();
        try {
          const res = await callBackend("getLeaderboard", { period: phoneUiState.lbPeriod, subject: "ALL" });
          if (res && res.ok && res.leaderboard) {
            portalState.leaderboard = res.leaderboard;
            populatePhoneLeaderboardDialog();
          }
        } catch (e) {}
      });
    });
  }

  async function handlePhoneReferralShare() {
    const sb = isSupabaseConfigured() ? getSupabaseClient() : null;
    const sess = sb ? await sb.auth.getSession() : null;
    const snap = readWalletLocalSnapshot();
    if (!sess || !sess.data || !sess.data.session || !snap.serverReferralCode) {
      openSyncDialog();
      showToast("Log masuk Google / E-mel dahulu untuk mengaktifkan pautan jemputan unik anda.");
      return;
    }
    const shareUrl = "https://etutor.my/?ref=" + encodeURIComponent(snap.serverReferralCode) + "#portal";
    if (navigator.share) {
      try { await navigator.share({ title: "eTutor.my SPM", text: "Jom ulang kaji SPM & dapatkan +10 Token Cikgu AI:", url: shareUrl }); return; } catch (err) {}
    }
    try { await navigator.clipboard.writeText(shareUrl); showToast("Pautan jemputan disalin! (+10 Token apabila rakan siap 1 set)."); } catch (err) { showToast("Kod anda: " + snap.serverReferralCode); }
  }

  function bindPhoneShellInteractions({ onOpenWalletShield } = {}) {
    const nav = document.getElementById("mobileBottomNav");
    if (nav) {
      nav.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-phone-tab]");
        if (btn) switchPhoneTab(btn.getAttribute("data-phone-tab"));
      });
    }
    const shell = document.getElementById("phoneAppShell");
    if (!shell) return;

    shell.addEventListener("click", async function (e) {
      if (e.target.closest("#phoneHeaderTokenBtn") || e.target.closest("#phoneOpenWalletBtn")) {
        if (typeof onOpenWalletShield === "function") onOpenWalletShield();
        openTokenWalletDialog();
        return;
      }
      if (e.target.closest("#phonePrimaryQuizBtn") && phoneUiState.primaryQuizFileId) {
        openQuizSet(phoneUiState.primaryQuizFileId, true, false);
        return;
      }
      const weakBtn = e.target.closest("#phoneAskWeakTopicBtn");
      if (weakBtn) { switchPhoneTab("cikgu"); jumpToPhoneCikguTopic(weakBtn.getAttribute("data-weak-topic") || ""); return; }
      const quickSub = e.target.closest(".js-phone-quick-subj");
      if (quickSub) { phoneUiState.paperSubject = quickSub.getAttribute("data-subj") || "ALL"; switchPhoneTab("kertas"); renderPhoneKertasTab(); return; }
      const catBtn = e.target.closest("[data-phone-cat]");
      if (catBtn) { phoneUiState.paperCategory = catBtn.getAttribute("data-phone-cat") || "harian"; renderPhoneKertasTab(); return; }
      const subjBtn = e.target.closest(".js-phone-filter-subj");
      if (subjBtn) { phoneUiState.paperSubject = subjBtn.getAttribute("data-subj") || "ALL"; renderPhoneKertasTab(); return; }
      const notaCardBtn = e.target.closest("[data-phone-note-id]");
      if (notaCardBtn) {
        const nid = notaCardBtn.getAttribute("data-phone-note-id");
        if (nid) openNotaChapter(nid);
        return;
      }
      const paperBtn = e.target.closest("[data-phone-file-id]");
      if (paperBtn) {
        const fId = paperBtn.getAttribute("data-phone-file-id");
        if (fId && populatePhonePaperDialog(fId)) {
          const dlg = document.getElementById("phonePaperDialog");
          if (dlg && typeof dlg.showModal === "function") dlg.showModal();
        }
        return;
      }
      if (e.target.closest("#phoneOpenAuthBtn") || e.target.closest("#phoneOpenSyncBtn")) { openSyncDialog(); return; }
      if (e.target.closest("#phoneOpenLeaderboardBtn")) {
        populatePhoneLeaderboardDialog();
        const dlg = document.getElementById("phoneLeaderboardDialog");
        if (dlg && typeof dlg.showModal === "function") dlg.showModal();
        return;
      }
      if (e.target.closest("#phoneCountdownStripBtn") || e.target.closest("#phoneOpenScheduleBtn")) {
        populatePhoneScheduleDialog();
        const dlg = document.getElementById("phoneScheduleDialog");
        if (dlg && typeof dlg.showModal === "function") dlg.showModal();
        return;
      }
      if (e.target.closest("#phoneOpenIssueBtn")) { const d = document.getElementById("issueDialog"); if (d && d.showModal) d.showModal(); return; }
      if (e.target.closest("#phoneDeleteAccountBtn")) { const d = document.getElementById("deleteAccountDialog"); if (d && d.showModal) d.showModal(); return; }
      if (e.target.closest("#phoneShareReferralBtn")) await handlePhoneReferralShare();
    });

    const searchEl = document.getElementById("phonePaperSearchInput");
    if (searchEl) searchEl.addEventListener("input", function () { phoneUiState.paperSearch = searchEl.value || ""; renderPhoneKertasTab(); });

    const pillEl = document.getElementById("phoneWelcomeCountdownPill");
    if (pillEl) {
      const p = computeCountdownParts("2026-11-23", "08:00");
      pillEl.textContent = p.sign > 0 ? ("SPM 2026 • " + p.days + " Hari Lagi") : "Peperiksaan SPM 2026 Sedang Berlangsung";
    }

    const startGuestBtn = document.getElementById("phoneWelcomeStartGuestBtn");
    if (startGuestBtn) {
      startGuestBtn.addEventListener("click", async function () {
        markPhoneWelcomeCompleted(true);
        try { history.replaceState(null, "", window.location.pathname + window.location.search + "#portal"); } catch (e) {}
        await syncRouteMode();
        switchPhoneTab("utama");
      });
    }

    const welcomeLoginBtn = document.getElementById("phoneWelcomeLoginBtn");
    if (welcomeLoginBtn) {
      welcomeLoginBtn.addEventListener("click", async function () {
        window.location.hash = "#login";
        await syncRouteMode();
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  }

  // --- [features/mobile-app/mobileAppController.js] ---
  /**
   * src/features/mobile-app/mobileAppController.js
   * Pengawal Teras Aplikasi Telefon: pelindung polisi gedung Apple 3.1.1 / 3.1.3(b),
   * butang Back perkakasan Android / PWA, dan mod fokus papan kekunci maya.
   */







  const MOBILE_DIALOG_IDS = [
    "deleteAccountDialog",
    "iosInstallHelpDialog",
    "phonePaperDialog",
    "phoneLeaderboardDialog",
    "phoneScheduleDialog",
    "tokenWalletDialog",
    "resultSlipDialog",
    "syncDialog",
    "issueDialog",
    "orderDialog"
  ];
  let mobileAppBound = false;

  function isPhoneAppRuntime() {
    if (isNativeCapacitorPlatform()) return true;
    if (typeof window === "undefined") return false;
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      const q = new URLSearchParams(window.location.search || "");
      if (q.get("phoneApp") === "1" || q.get("storeShell") === "1") return true;
    } catch (e) {}
    return false;
  }

  function isStoreShellEnvActive() {
    if (isNativeCapacitorPlatform()) return true;
    if (typeof window === "undefined") return false;
    try {
      const q = new URLSearchParams(window.location.search || "");
      if (q.get("storeShell") === "1") return true;
    } catch (e) {}
    return document.documentElement.getAttribute("data-native-store-shell") === "true";
  }

  function syncNativeStorePaymentShield() {
    if (typeof document === "undefined" || !document.documentElement) return;
    const storeMode = isStoreShellEnvActive();
    const cfg = (typeof window !== "undefined" && window.ETUTOR_CONFIG) ? window.ETUTOR_CONFIG : {};
    document.documentElement.setAttribute("data-native-store-shell", storeMode ? "true" : "false");
    document.documentElement.setAttribute("data-allow-native-voucher", cfg.allowNativeVoucher === true ? "true" : "false");
    document.documentElement.setAttribute("data-phone-app", isPhoneAppRuntime() ? "true" : "false");

    const dangerRow = document.getElementById("walletAccountDangerRow");
    if (dangerRow) {
      dangerRow.hidden = !Boolean(portalState.supabaseAuthenticated || portalState.sessionToken);
    }
  }

  function closeTopmostOpenDialog() {
    for (let i = 0; i < MOBILE_DIALOG_IDS.length; i++) {
      const dlg = document.getElementById(MOBILE_DIALOG_IDS[i]);
      if (dlg && dlg.open) {
        closeTopLayer(dlg);
        return true;
      }
    }
    return false;
  }

  function bindMobileBackNavigation() {
    if (isNativeCapacitorPlatform()) {
      const appPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
      if (appPlugin && typeof appPlugin.addListener === "function") {
        appPlugin.addListener("backButton", async function () {
          if (closeTopmostOpenDialog()) return;
          const stage = document.getElementById("examStage");
          if (stage && !stage.hidden) {
            await closeQuizStage({ fromHistoryBack: true });
            return;
          }
          if (phoneUiState.activeTab !== "utama") {
            switchPhoneTab("utama");
            return;
          }
          if (typeof appPlugin.minimizeApp === "function") appPlugin.minimizeApp();
        });
      }
      return;
    }

    window.addEventListener("popstate", async function () {
      if (portalState.suppressNextExamPopstate) {
        portalState.suppressNextExamPopstate = false;
        return;
      }
      if (closeTopmostOpenDialog()) return;
      const stage = document.getElementById("examStage");
      if (stage && !stage.hidden) {
        portalState.examHistoryPushed = false;
        await closeQuizStage({ fromHistoryBack: true });
      }
    });
  }

  function bindVirtualKeyboardFocusGuard() {
    const root = document.documentElement;
    let baselineHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const isTextEntryEl = function (el) {
      if (!el) return false;
      if (el.isContentEditable) return true;
      const tag = String(el.tagName || "").toUpperCase();
      if (tag === "TEXTAREA" || tag === "SELECT") return true;
      if (tag !== "INPUT") return false;
      return ["checkbox", "radio", "button", "submit", "reset", "range", "file"].indexOf(String(el.type || "text").toLowerCase()) === -1;
    };
    document.addEventListener("focusin", function (e) {
      if (isTextEntryEl(e.target)) root.setAttribute("data-virtual-keyboard", "open");
    });
    document.addEventListener("focusout", function () {
      setTimeout(function () {
        if (!isTextEntryEl(document.activeElement)) root.setAttribute("data-virtual-keyboard", "closed");
      }, 80);
    });
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        if (window.innerHeight > baselineHeight) baselineHeight = window.innerHeight;
        const ratio = window.visualViewport.height / Math.max(1, baselineHeight);
        root.setAttribute("data-virtual-keyboard", ratio < 0.76 ? "open" : "closed");
      });
    }
  }

  function refreshAllPhoneViews(snapshot) {
    syncNativeStorePaymentShield();
    renderPhoneHeaderAndNavTokens(snapshot);
    renderPhoneHomeTab();
    renderPhoneKertasTab();
    renderPhoneAkaunTab();
  }

  function initMobileAppExperience() {
    if (mobileAppBound) return;
    mobileAppBound = true;

    syncNativeStorePaymentShield();
    initPhoneCikguChat();
    bindCapacitorOAuthDeepLinkListener();
    bindAccountDeletionEvents();
    bindPhoneDialogControls();
    bindPhoneShellInteractions({ onOpenWalletShield: syncNativeStorePaymentShield });
    bindMobileBackNavigation();
    bindVirtualKeyboardFocusGuard();
    refreshAllPhoneViews();

    window.addEventListener("etutor:dashboard-bundle-applied", function () { refreshAllPhoneViews(); });
    window.addEventListener("etutor:wallet-synced", function (ev) { refreshAllPhoneViews(ev && ev.detail); });
    window.addEventListener("etutor:cikgu-token-updated", function (ev) { refreshAllPhoneViews(ev && ev.detail); });
    window.addEventListener("etutor:server-unlocked-keys", function () { renderPhoneKertasTab(); });
    window.addEventListener("etutor:open-token-wallet", syncNativeStorePaymentShield);

    const statusBar = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar;
    if (isNativeCapacitorPlatform() && statusBar && typeof statusBar.setBackgroundColor === "function") {
      statusBar.setBackgroundColor({ color: "#121e48" }).catch(function () {});
    }
  }

  // --- [main.js] ---
  /**
   * src/main.js
   * Pintu masuk permulaan aplikasi Portal eTutor.my (mengikat semua modul ciri pada DOMContentLoaded).
   */





























  document.addEventListener("DOMContentLoaded", async function () {
    initTokenReferralCapture();
    initStudentProfileStore();
    syncOpenAccessDom();
    bindEvents();
    initStudentOnboardingWizard();
    initStudentSettingsDialog();
    etGamifInit();
    etMiniModalInit();
    etFlashcardModalInit();
    initFocusWorkspace();
    initTokenWalletBindings();
    initAdminVoucherBindings();
    bindCloudSyncEvents();
    initUnifiedAuth();
    bindIssueReportingEvents();
    initLiveCatalogAutoSync();
    initFooterLiveStats();
    initLandingNotaAnnouncement();
    initSpmCountdown();
    initPwaInstallFlow();
    initMobileAppExperience();
    initPhonePersonalizationBindings();
    initPhoneGamificationView();
    initAdSenseController();
    initToyyibPayAutoResumeAfterLogin();
    void hydrateExamReportsFromCloud();

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

    try {
      if (new URLSearchParams(window.location.search || "").get("payment_return") === "toyyibpay" && !window.location.hash) {
        window.location.hash = "#portal";
      }
    } catch (e) {}

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
    await handleToyyibPayReturnIfPresent();
  });
})();
