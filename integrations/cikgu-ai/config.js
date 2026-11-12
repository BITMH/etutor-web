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
  // Pelayan Google Cloud Run (Singapura):
  cloudRunUrl:
    globalCfg.CIKGU_CLOUD_RUN_URL ||
    "https://cikgu-ai-spm-afaauenp7q-as.a.run.app",

  // Pelayan Modal GPU NVIDIA T4:
  modalGpuUrl:
    globalCfg.CIKGU_MODAL_GPU_URL ||
    "https://hanismathussin96--cikgu-ai-spm.modal.run",

  // URL Pelayan Utama mengikut fasa (Auto-Switch selepas 3 bulan):
  // 10 Nov 2026 - 10 Feb 2027: Google Cloud Run ($300 Percuma)
  // Mulai 11 Feb 2027 ke atas: Beralih automatik ke Modal.com
  get primaryCloudRunUrl() {
    if (isLocalHost && globalCfg.CIKGU_LOCAL_DEV === true) return "http://127.0.0.1:8080";
    return isGcpTrialActive() ? this.cloudRunUrl : this.modalGpuUrl;
  },

  // URL Pelayan Sandaran mengikut fasa (Auto-Switch sebaliknya):
  get backupHfSpacesUrl() {
    return isGcpTrialActive() ? this.modalGpuUrl : this.cloudRunUrl;
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

export function loadRuntimeEndpoints() {
  try {
    const mode = localStorage.getItem(CIKGU_STORAGE_KEYS.ROUTING_MODE) || "auto";
    const primary = DEFAULT_CIKGU_CONFIG.primaryCloudRunUrl;
    const backup = DEFAULT_CIKGU_CONFIG.backupHfSpacesUrl;
    return {
      mode,
      primaryUrl: primary.replace(/\/+$/, ""),
      backupUrl: backup.replace(/\/+$/, "")
    };
  } catch {
    return {
      mode: "auto",
      primaryUrl: DEFAULT_CIKGU_CONFIG.primaryCloudRunUrl.replace(/\/+$/, ""),
      backupUrl: DEFAULT_CIKGU_CONFIG.backupHfSpacesUrl.replace(/\/+$/, "")
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
      if (parsed && parsed.date === today && typeof parsed.remaining === "number") {
        const lim = Number(parsed.limit) || DAILY_AI_TOKEN_LIMIT;
        const rem = Math.max(0, Math.min(lim, Math.floor(parsed.remaining)));
        return { date: today, remaining: rem, limit: lim };
      }
    }
  } catch {
    // abaikan
  }
  return { date: today, remaining: DAILY_AI_TOKEN_LIMIT, limit: DAILY_AI_TOKEN_LIMIT };
}

export function saveDailyTokenState(remaining, limit = DAILY_AI_TOKEN_LIMIT) {
  const today = getMytDateKey();
  const safeLim = Math.max(1, Number(limit) || DAILY_AI_TOKEN_LIMIT);
  const safeRem = Math.max(0, Math.min(safeLim, Math.floor(Number(remaining))));
  const next = { date: today, remaining: safeRem, limit: safeLim };
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
  return next;
}
