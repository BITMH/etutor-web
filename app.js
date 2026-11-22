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
    suppressNextExamPopstate: false
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
    const progRows = Array.isArray(pinDashData && pinDashData.inProgress) ? pinDashData.inProgress : [];

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

    const fileIdParam = (params.get("fileId") || "").trim();
    const titleParam = (params.get("title") || "").trim();
    const setParam = (params.get("set") || "").trim();
    const klonParam = (params.get("klon") || "").trim();
    const klonSubParam = (params.get("klonSubject") || "").trim();
    const subParam = (params.get("subject") || "").trim();
    const qParam = (params.get("q") || "").trim();
    const autoOpen = params.get("open") === "1" || params.get("open") === "true";
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

    (portalState.catalog || []).forEach(function (c) {
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
      "coverIconPath": "./nota-interaktif/assets/icons/sej-u2.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/sej2-u1.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/sej3-u3.jpg",
      "htmlPath": "./nota-interaktif/dist/sejarah-t4-bab03.html"
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
      "coverIconPath": "./nota-interaktif/assets/icons/bm-u1.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/bi-u1.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/mat-u2.jpg",
      "htmlPath": "./nota-interaktif/dist/matematik-t4-bab01.html"
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
      "coverIconPath": "./nota-interaktif/assets/icons/sai-u1.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/sai2-u1.jpg",
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
      "coverIconPath": "./nota-interaktif/assets/icons/sai3-u1.jpg",
      "htmlPath": "./nota-interaktif/dist/sains-t4-bab03.html"
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
      "coverIconPath": "./nota-interaktif/assets/icons/fiz-u5.jpg",
      "htmlPath": "./nota-interaktif/dist/fizik-t4-bab01.html"
    }
  ];





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
    const list = getNotaCatalogList();
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
    const unlocked = isNotaItemUnlocked(item.id);
    const doneUnits = progressRec ? Math.max(0, Number(progressRec.completedUnits) || 0) : 0;
    const totalUnits = Math.max(1, Number(item.unitCount) || 1);
    const masteryPct = progressRec ? Math.min(100, Math.max(0, Number(progressRec.masteryPct) || 0)) : 0;
    const xpEarned = progressRec ? Math.max(0, Number(progressRec.xp) || 0) : 0;

    let statusHtml = unlocked
      ? '<span class="status-badge badge-done">' + ICONS.checkCircle + " Terbuka Kekal</span>"
      : '<span class="status-badge badge-progress">' + ICONS.lock + ' <span class="tabular-nums">' + NOTA_UNLOCK_COST + " Token • Kekal</span></span>";
    if (masteryPct >= 100) {
      statusHtml = '<span class="status-badge badge-done">' + ICONS.trophy + ' <span class="tabular-nums">100% Dikuasai</span></span>';
    } else if (doneUnits > 0 || xpEarned > 0) {
      statusHtml = '<span class="status-badge badge-progress">' + ICONS.flame + ' <span class="tabular-nums">' + masteryPct + "% • " + xpEarned + " XP</span></span>";
    }

    const ctaLabel = masteryPct >= 100
      ? "Ulang Kaji Bab"
      : ((doneUnits > 0 || xpEarned > 0) ? "Sambung Bab" : (unlocked ? "Mula Nota Interaktif" : ("Buka Bab (" + NOTA_UNLOCK_COST + " Token)")));
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

    const list = getNotaCatalogList();
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
      grid.innerHTML = '<div class="empty-state"><h3>Tiada Nota Interaktif Sepadan</h3><p>Cuba tukar kata kunci carian atau pilih Semua Subjek. Bab baharu ditambah secara berperingkat.</p></div>';
      return;
    }

    grid.innerHTML = filtered.map((item) => renderNotaCardMarkup_(item, progMap[item.id])).join("\n");
  }

  function renderPhoneNotaList(phoneUiState, listEl, chipRow) {
    const list = getNotaCatalogList();
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
      listEl.innerHTML = '<div class="phone-card" style="text-align:center;color:#475569">Tiada nota interaktif sepadan. Bab baharu sedang ditambah secara berperingkat.</div>';
      return;
    }

    const progMap = loadNotaProgressMap();
    listEl.innerHTML = filtered.map(function (item) {
      const rec = progMap[item.id] || {};
      const unlocked = isNotaItemUnlocked(item.id);
      const costLabel = unlocked ? "Dibuka Kekal" : (NOTA_UNLOCK_COST + " Token");
      const costCls = unlocked ? "phone-badge-cost" : "phone-badge-cost is-klon";
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
          return '<button type="button" class="weak-pill weak-pill-btn js-weak-topic-drill" data-topic="' + escapeHtml(w.topic) + '">' + ICONS.alert + ' <span>' + escapeHtml(w.topic) + '</span> <strong class="tabular-nums">(' + w.lowestPct + '%)</strong></button>';
        }).join("");
      }
    }
  }

  // --- [features/quiz-engine/resultSlipModal.js] ---
  /**
   * src/features/quiz-engine/resultSlipModal.js
   * Pengawal dialog Slip Keputusan Rasmi SPM dan fungsi cetakan slip rasmi.
   */



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
    const safeGrade = String(data.grade || "—").slice(0, 6);
    const tierInfo = resolveGradeTier(safePct, safeGrade);
    const paperRoot = document.getElementById("slipPaperRoot");
    if (paperRoot) paperRoot.setAttribute("data-tier", tierInfo.tier);

    const arcEl = document.getElementById("slipScoreArc");
    if (arcEl) arcEl.setAttribute("stroke-dashoffset", (314.16 * (1 - safePct / 100)).toFixed(2));

    const refEl = document.getElementById("slipRefNo");
    if (refEl) refEl.textContent = buildSlipRefNo(data);
    const gLabelEl = document.getElementById("slipGradeLabel");
    if (gLabelEl) gLabelEl.textContent = tierInfo.label;

    document.getElementById("slipStudentName").textContent = displayStudentName;
    document.getElementById("slipUserId").textContent = (portalState.user && portalState.user.userId) || "";
    document.getElementById("slipQuizTitle").textContent = data.quizTitle || "Set Latihan Interaktif";
    document.getElementById("slipSubject").textContent = data.subject || "SPM";
    document.getElementById("slipDate").textContent = new Date().toLocaleString("ms-MY");
    document.getElementById("slipScorePct").textContent = safePct + "%";
    document.getElementById("slipGrade").textContent = safeGrade;
    const breakdownText = data.breakdown || ("Markah: " + (data.scoreText || ""));
    document.getElementById("slipBreakdown").textContent = breakdownText;
    updatePaperSplitBars(breakdownText);

    const weakListEl = document.getElementById("slipWeakTopics");
    weakListEl.textContent = "";
    const wt = Array.isArray(data.weakTopics) ? data.weakTopics : [];
    if (wt.length === 0) {
      const okLi = document.createElement("li");
      okLi.className = "slip-topic-item";
      okLi.setAttribute("data-state", "ok");
      okLi.innerHTML = "<div class=\"slip-topic-row\"><span class=\"slip-topic-name\">Penguasaan kukuh (>= 60%) merentasi semua bab yang diuji.</span><span class=\"slip-topic-stat\">100%</span></div><div class=\"slip-topic-track\"><div class=\"slip-topic-fill\" style=\"width:100%\"></div></div>";
      weakListEl.appendChild(okLi);
    } else {
      wt.forEach(function (w) {
        const li = document.createElement("li");
        const wPct = Math.max(0, Math.min(100, Math.round(Number(w.percentage) || 0)));
        const wObt = Math.max(0, Math.round(Number(w.obtained) || 0));
        const wTot = Math.max(1, Math.round(Number(w.total) || 1));
        const isAttempted = w.attempted === undefined ? true : Boolean(w.attempted);
        const state = !isAttempted ? "unattempted" : (wPct >= 60 ? "ok" : (wPct >= 40 ? "mid" : "weak"));
        li.className = "slip-topic-item";
        li.setAttribute("data-state", state);

        const row = document.createElement("div");
        row.className = "slip-topic-row";
        const nameSpan = document.createElement("span");
        nameSpan.className = "slip-topic-name";
        nameSpan.textContent = String(w.topic || "Topik");
        const statSpan = document.createElement("span");
        statSpan.className = "slip-topic-stat tabular-nums";
        statSpan.textContent = isAttempted
          ? (wPct + "% (" + wObt + "/" + wTot + ")" + (wPct < 60 ? " • Ulang Kaji" : ""))
          : ("Belum Dijawab (" + wObt + "/" + wTot + ")");
        row.appendChild(nameSpan);
        row.appendChild(statSpan);

        const track = document.createElement("div");
        track.className = "slip-topic-track";
        const fill = document.createElement("div");
        fill.className = "slip-topic-fill";
        fill.style.width = (isAttempted ? Math.max(4, wPct) : 0) + "%";
        track.appendChild(fill);

        li.appendChild(row);
        li.appendChild(track);
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
        countEl.textContent = count + " Bab KSSM";
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


    bindCatalogLeaderboardAndSlipEvents();
    bindNotaCatalogEvents();
    initLandingAndOrderBindings();
    initAdminPanelBindings();
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

    const catalog = Array.isArray(portalState.catalog) ? portalState.catalog : [];
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
  }

  function renderPhoneKertasTab() {
    const catalog = Array.isArray(portalState.catalog) ? portalState.catalog : [];
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
    if (ncEl) ncEl.textContent = getNotaCatalogList().length + " bab • 2T";
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
      listEl.innerHTML = '<div class="phone-card" style="text-align:center;color:#475569">Tiada set kertas soalan sepadan dengan penapis semasa.</div>';
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
    const displayName = (portalState.user && portalState.user.buyerName) || getOpenStudentName() || (lnk && lnk.email ? lnk.email.split("@")[0] : "Pelajar eTutor");
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

  // --- [features/mobile-app/phoneCikguChatController.js] ---
  /**
   * src/features/mobile-app/phoneCikguChatController.js
   * Pengawal Tab Chat Cikgu AI Aplikasi Telefon: mesej teks (1 Token), muat naik / tangkap
   * gambar Kertas 2 (kekal 3 Token), perlindungan XSS/Matematik, dan IME-safe Enter submit.
   */



  const SNAP_IMAGE_TOKEN_COST = 3;
  const TEXT_CHAT_TOKEN_COST = 1;

  const phoneChatState = {
    subject: "Matematik",
    isStreaming: false,
    pendingImage: null,
    history: [],
    messages: [{
      role: "bot",
      subject: "Umum",
      time: "Sekarang",
      text: "Hai! Saya Cikgu AI eTutor SPM.\n\nTaip soalan (1 Token) atau tekan ikon kamera di kiri untuk semak foto jalan kerja Kertas 2 anda (3 Token)."
    }]
  };

  function formatSafeCikguHtml(rawText) {
    let safe = escapeHtml(String(rawText || ""));
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
    try { return new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit", hour12: false }); }
    catch (e) { return "Kini"; }
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

  function renderPhoneChatMessages() {
    const box = document.getElementById("phoneChatMessages");
    if (!box) return;
    box.innerHTML = phoneChatState.messages.map(function (m) {
      if (m.role === "user") {
        return [
          '<div class="phone-msg-row is-user"><div class="phone-msg-bubble">',
          m.imageUrl ? ('<img src="' + escapeHtml(m.imageUrl) + '" alt="Lampiran jawapan murid" class="phone-msg-img">') : "",
          '<div>' + formatSafeCikguHtml(m.text) + "</div>",
          '<div class="phone-msg-foot tabular-nums"><span>' + escapeHtml(m.time) + "</span><span>• -" + (m.cost || TEXT_CHAT_TOKEN_COST) + " Token</span></div>",
          "</div></div>"
        ].join("");
      }
      return [
        '<div class="phone-msg-row is-bot"><div class="phone-msg-bubble">',
        '<div class="phone-msg-head"><span>Cikgu AI • ' + escapeHtml(m.subject || phoneChatState.subject) + '</span><span class="tabular-nums">' + escapeHtml(m.time) + "</span></div>",
        '<div class="phone-msg-body">' + formatSafeCikguHtml(m.text) + "</div>",
        "</div></div>"
      ].join("");
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
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          resolve({ dataUrl: dataUrl, base64: dataUrl.split(",")[1] || "", mime: "image/jpeg", name: file.name || "jawapan_kertas2.jpg" });
        };
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  async function submitPhoneCikguTurn() {
    if (phoneChatState.isStreaming) return;
    const inputEl = document.getElementById("phoneChatInput");
    const sendBtn = document.getElementById("phoneChatSendBtn");
    const subjSel = document.getElementById("phoneCikguSubjectSelect");
    if (!inputEl) return;

    const hasImg = Boolean(phoneChatState.pendingImage && phoneChatState.pendingImage.base64);
    const rawText = inputEl.value.trim();
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
    const imgCopy = phoneChatState.pendingImage ? Object.assign({}, phoneChatState.pendingImage) : null;

    inputEl.value = "";
    inputEl.style.height = "auto";
    phoneChatState.pendingImage = null;
    syncChatImageBarAndCost();

    phoneChatState.messages.push({
      role: "user", subject: subj, time: nowTimeShort(),
      text: promptText, imageUrl: imgCopy ? imgCopy.dataUrl : "", cost: needTok
    });
    const botMsg = { role: "bot", subject: subj, time: nowTimeShort(), text: "Cikgu sedang meneliti soalan anda..." };
    phoneChatState.messages.push(botMsg);
    phoneChatState.isStreaming = true;
    if (sendBtn) sendBtn.disabled = true;
    renderPhoneChatMessages();

    try {
      const aiApi = window.__CIKGU_AI_INSTANCE__;
      if (!aiApi || !aiApi.client) throw new Error("Pelayan Cikgu AI sedang dimulakan. Sila cuba sebentar lagi.");
      if (aiApi.warmupMachine && aiApi.warmupMachine.status !== "ready" && !hasImg) await aiApi.warmupMachine.greetCikgu();

      let acc = "";
      const streamRes = await aiApi.client.streamSemak({
        subjek: subj, mod: hasImg ? "semak_gambar" : "auto",
        soalan: promptText.slice(0, 5500), jawapan_pelajar: hasImg ? promptText.slice(0, 3500) : "",
        imej_base64: hasImg ? imgCopy.base64.slice(0, 255000) : "", imej_mime: hasImg ? imgCopy.mime : "image/jpeg",
        sesi_sudah_sapa: phoneChatState.history.length > 0, sejarah_sembang: phoneChatState.history.slice(-6),
        markah_penuh: hasImg ? 6 : 4, max_tokens: hasImg ? 520 : 360
      }, { onToken: function (tok) { acc += tok; botMsg.text = acc; renderPhoneChatMessages(); } });

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
      botMsg.text = "Maaf, semakan tidak dapat diselesaikan buat masa ini (" + ((err && err.message) || "Ralat rangkaian") + "). Token anda tidak dipotong.";
    } finally {
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
    if (clearBtn) clearBtn.addEventListener("click", function () { phoneChatState.history = []; phoneChatState.messages = [phoneChatState.messages[0]]; renderPhoneChatMessages(); });
    document.querySelectorAll("[data-cikgu-prompt]").forEach(function (btn) {
      btn.addEventListener("click", function () { if (inputEl) { inputEl.value = btn.getAttribute("data-cikgu-prompt") || ""; inputEl.focus(); } });
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
    const resetBtn = document.getElementById("phoneRestartQuizBtn");
    const paperDlg = document.getElementById("phonePaperDialog");
    if (startBtn) {
      startBtn.addEventListener("click", async function () {
        const fId = phoneUiState.selectedFileId;
        if (paperDlg && paperDlg.open) await closeTopLayer(paperDlg);
        if (fId) openQuizSet(fId, true, false);
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
    syncOpenAccessDom();
    bindEvents();
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
    initAdSenseController();
    initToyyibPayAutoResumeAfterLogin();

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
