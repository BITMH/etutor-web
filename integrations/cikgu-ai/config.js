/**
 * public-web/integrations/cikgu-ai/config.js
 * Konfigurasi terasing untuk modul Cikgu AI SPM (23 Subjek) dengan Dwi-Awan Auto-Failover.
 */

export const CIKGU_STORAGE_KEYS = {
  ROUTING_MODE: "etutor_cikgu_routing_mode_v1",
  PRIMARY_URL: "etutor_cikgu_cloudrun_url_v1",
  BACKUP_URL: "etutor_cikgu_hfspaces_url_v1",
  SELECTED_SUBJECT: "etutor_cikgu_subject_v1"
};

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const globalCfg =
  typeof window !== "undefined" && window.ETUTOR_CONFIG ? window.ETUTOR_CONFIG : {};

export const DEFAULT_CIKGU_CONFIG = {
  // URL Pelayan Utama: Google Cloud Run (Singapura asia-southeast1 - 4 vCPU / 8 GiB Always Free)
  // Hanya guna 127.0.0.1:8080 jika CIKGU_LOCAL_DEV diaktifkan secara eksplisit pada config.js
  primaryCloudRunUrl:
    isLocalHost && globalCfg.CIKGU_LOCAL_DEV === true
      ? "http://127.0.0.1:8080"
      : globalCfg.CIKGU_CLOUD_RUN_URL ||
        "https://cikgu-ai-spm-afaauenp7q-as.a.run.app",

  // URL Pelayan Sandaran Automatik: Hugging Face Spaces Docker (diisi jika HF Spaces aktif)
  backupHfSpacesUrl:
    globalCfg.CIKGU_HF_SPACES_URL ||
    "",

  warmupTimeoutMs: 38000,
  failoverCooldownMs: 15 * 60 * 1000, // Kekal pada HF Spaces selama 15 minit jika Cloud Run sibuk/over-quota
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
    const storedPrimary = localStorage.getItem(CIKGU_STORAGE_KEYS.PRIMARY_URL) || "";
    const isLegacyPrimary = storedPrimary.includes("cikgu-ai-spm-asia-southeast1.a.run.app");
    const primary =
      (!isLegacyPrimary && storedPrimary) || DEFAULT_CIKGU_CONFIG.primaryCloudRunUrl;
    const storedBackup = localStorage.getItem(CIKGU_STORAGE_KEYS.BACKUP_URL) || "";
    const isUnprovisionedDefaultSpace =
      storedBackup.includes("bitmh-cikgu-ai-spm.hf.space") && !DEFAULT_CIKGU_CONFIG.backupHfSpacesUrl;
    const backup =
      (!isUnprovisionedDefaultSpace && storedBackup) || DEFAULT_CIKGU_CONFIG.backupHfSpacesUrl;
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
