/**
 * public-web/integrations/cikgu-ai/config.js
 * Konfigurasi terasing untuk modul Cikgu AI SPM (23 Subjek) dengan Dwi-Awan Auto-Failover.
 */

export const CIKGU_STORAGE_KEYS = {
  ROUTING_MODE: "etutor_cikgu_routing_mode_v1",
  PRIMARY_URL: "etutor_cikgu_cloudrun_url_v1",
  BACKUP_URL: "etutor_cikgu_hfspaces_url_v1",
  SELECTED_SUBJECT: "etutor_cikgu_subject_v1",
  DAILY_TOKENS: "etutor_cikgu_daily_tokens_v1",
  CLIENT_UID: "etutor_cikgu_client_uid_v1"
};

export const DAILY_AI_TOKEN_LIMIT = 30;

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const globalCfg =
  typeof window !== "undefined" && window.ETUTOR_CONFIG ? window.ETUTOR_CONFIG : {};

// Tarikh tamat tempoh promosi kredit $300 Google Cloud: Tepat 3 Bulan (10 Feb 2027)
export const GCP_TRIAL_EXPIRY_MS = new Date("2027-02-10T23:59:59+08:00").getTime();

export function isGcpTrialActive() {
  return Date.now() < GCP_TRIAL_EXPIRY_MS;
}

export const DEFAULT_CIKGU_CONFIG = {
  // Pelayan Utama: Supabase Edge Function (0ms cold-start, 500k panggilan percuma/bulan):
  supabaseEdgeUrl:
    globalCfg.CIKGU_SUPABASE_EDGE_URL ||
    "https://ktesekiguardgfdgrmlp.supabase.co/functions/v1/cikgu-semak",

  // Pelayan Sandaran Darurat: Modal GPU NVIDIA T4 (Qwen 3.5 GGUF, tidur pada kos $0):
  modalGpuUrl:
    globalCfg.CIKGU_MODAL_GPU_URL ||
    "https://hanismathussin96--cikgu-ai-spm.modal.run",

  get primaryCloudRunUrl() {
    if (isLocalHost && globalCfg.CIKGU_LOCAL_DEV === true) return "http://127.0.0.1:8080";
    return this.supabaseEdgeUrl;
  },

  // URL Pelayan Sandaran Auto-Failover (hanya dipanggil jika Supabase gagal / penyedia API habis):
  get backupHfSpacesUrl() {
    return this.modalGpuUrl;
  },

  warmupTimeoutMs: 38000,
  failoverCooldownMs: 15 * 60 * 1000,
  silentPrewarmDelayMs: 1800,

  subjects: [
    "Sejarah",
    "Bahasa Melayu",
    "Bahasa Inggeris",
    "Matematik",
    "Sains",
    "Pendidikan Islam",
    "Pendidikan Moral",
    "Prinsip Perakaunan",
    "Perniagaan",
    "Ekonomi",
    "Sains Komputer",
    "Geografi",
    "Tasawwur Islam",
    "Biologi",
    "Fizik",
    "Kimia",
    "Matematik Tambahan",
    "Sains Sukan",
    "Sains Rumah Tangga",
    "Pendidikan Al-Quran dan As-Sunnah",
    "Reka Cipta",
    "Usul al-Din",
    "Bahasa Arab"
  ]
};

const LOCAL_LOOPBACK_RE = /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/i;

export function loadRuntimeEndpoints() {
  const defaultPrimary = DEFAULT_CIKGU_CONFIG.primaryCloudRunUrl.replace(/\/+$/, "");
  const defaultBackup = DEFAULT_CIKGU_CONFIG.backupHfSpacesUrl.replace(/\/+$/, "");
  try {
    const mode = localStorage.getItem(CIKGU_STORAGE_KEYS.ROUTING_MODE) || "auto";
    const storedPrimary = (localStorage.getItem(CIKGU_STORAGE_KEYS.PRIMARY_URL) || "").trim();
    const storedBackup = (localStorage.getItem(CIKGU_STORAGE_KEYS.BACKUP_URL) || "").trim();
    const primary = LOCAL_LOOPBACK_RE.test(storedPrimary) ? storedPrimary : defaultPrimary;
    const backup = LOCAL_LOOPBACK_RE.test(storedBackup) ? storedBackup : defaultBackup;
    return {
      mode,
      primaryUrl: primary.replace(/\/+$/, ""),
      backupUrl: backup.replace(/\/+$/, "")
    };
  } catch {
    return {
      mode: "auto",
      primaryUrl: defaultPrimary,
      backupUrl: defaultBackup
    };
  }
}

export function saveRuntimeEndpoints({ mode, primaryUrl, backupUrl }) {
  try {
    if (mode) localStorage.setItem(CIKGU_STORAGE_KEYS.ROUTING_MODE, mode);
    if (typeof primaryUrl === "string" && primaryUrl.trim()) {
      localStorage.setItem(CIKGU_STORAGE_KEYS.PRIMARY_URL, primaryUrl.trim().replace(/\/+$/, ""));
    }
    if (typeof backupUrl === "string" && backupUrl.trim()) {
      localStorage.setItem(CIKGU_STORAGE_KEYS.BACKUP_URL, backupUrl.trim().replace(/\/+$/, ""));
    }
  } catch {
    // Abaikan jika pelayar dalam mod privasi ketat
  }
}

export function getMytDateKey() {
  const nowMyt = new Date(Date.now() + 8 * 3600 * 1000);
  return nowMyt.toISOString().slice(0, 10);
}

export function resolveCikguUserKey() {
  try {
    const rawSession = localStorage.getItem("etutor_portal_session_v1");
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      const u = parsed && parsed.user;
      const uid = u && (u.userId || u.email || u.phone);
      if (uid && String(uid).trim()) return `usr:${String(uid).trim().toLowerCase()}`;
    }
  } catch {
    // abaikan
  }

  try {
    const syncEmail = localStorage.getItem("etutor_sync_email_v1");
    if (syncEmail && syncEmail.trim()) return `eml:${syncEmail.trim().toLowerCase()}`;
  } catch {
    // abaikan
  }

  try {
    let cid = localStorage.getItem(CIKGU_STORAGE_KEYS.CLIENT_UID);
    if (!cid) {
      const rand =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      cid = `dev:${rand}`;
      localStorage.setItem(CIKGU_STORAGE_KEYS.CLIENT_UID, cid);
    }
    return cid;
  } catch {
    return "dev:ephemeral";
  }
}

export function resolveSupabaseAccessToken() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || "";
      if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const parsed = JSON.parse(localStorage.getItem(k) || "{}");
        if (parsed && parsed.access_token) return String(parsed.access_token);
        if (parsed && parsed.currentSession && parsed.currentSession.access_token) {
          return String(parsed.currentSession.access_token);
        }
      }
    }
  } catch {
    // abaikan
  }
  return "";
}

const tokenSubscribers = new Set();

export function onDailyTokenChange(fn) {
  if (typeof fn === "function") tokenSubscribers.add(fn);
  return () => tokenSubscribers.delete(fn);
}

export function loadDailyTokenState() {
  const today = getMytDateKey();
  try {
    const raw = localStorage.getItem(CIKGU_STORAGE_KEYS.DAILY_TOKENS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.paidBalance === "number") {
        const paid = Math.max(0, Math.floor(parsed.paidBalance));
        const sameDay = parsed.date === today;
        const lim = Number(parsed.limit) || DAILY_AI_TOKEN_LIMIT;
        const freeRem = sameDay && typeof parsed.freeRemaining === "number"
          ? Math.max(0, Math.min(lim, Math.floor(parsed.freeRemaining)))
          : DAILY_AI_TOKEN_LIMIT;
        const rem = sameDay && typeof parsed.remaining === "number"
          ? Math.max(0, Math.floor(parsed.remaining))
          : freeRem + paid;
        return { date: today, remaining: rem, limit: lim, paidBalance: paid, freeRemaining: freeRem };
      }
      if (parsed && parsed.date === today && typeof parsed.remaining === "number") {
        const lim = Number(parsed.limit) || DAILY_AI_TOKEN_LIMIT;
        const rem = Math.max(0, Math.min(lim, Math.floor(parsed.remaining)));
        return { date: today, remaining: rem, limit: lim, paidBalance: 0, freeRemaining: rem };
      }
    }
  } catch {
    // abaikan
  }
  return { date: today, remaining: DAILY_AI_TOKEN_LIMIT, limit: DAILY_AI_TOKEN_LIMIT, paidBalance: 0, freeRemaining: DAILY_AI_TOKEN_LIMIT };
}

export function saveDailyTokenState(remaining, limit = DAILY_AI_TOKEN_LIMIT, extra = null) {
  const today = getMytDateKey();
  const prev = loadDailyTokenState();
  const safePaid = extra && typeof extra.paidBalance === "number"
    ? Math.max(0, Math.floor(extra.paidBalance))
    : (prev.paidBalance || 0);
  const safeLim = Math.max(1, Number(limit) || DAILY_AI_TOKEN_LIMIT);
  const maxAllowed = Math.max(safeLim + safePaid, Number(remaining) || 0);
  const safeRem = Math.max(0, Math.min(maxAllowed, Math.floor(Number(remaining))));
  const safeFree = extra && typeof extra.freeRemaining === "number"
    ? Math.max(0, Math.floor(extra.freeRemaining))
    : Math.max(0, safeRem - safePaid);
  const next = { date: today, remaining: safeRem, limit: safeLim, paidBalance: safePaid, freeRemaining: safeFree };
  try {
    localStorage.setItem(CIKGU_STORAGE_KEYS.DAILY_TOKENS, JSON.stringify(next));
  } catch {
    // abaikan
  }
  tokenSubscribers.forEach((fn) => {
    try {
      fn(next);
    } catch {
      // abaikan
    }
  });
  try {
    if (typeof window !== "undefined" && typeof CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("etutor:cikgu-token-updated", { detail: next }));
    }
  } catch {
    // abaikan
  }
  return next;
}
