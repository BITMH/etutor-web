/**
 * config.js
 * Konfigurasi Endpoint Backend Google Apps Script & Tetapan Jualan untuk domain etutor.my.
 * Fail ini dikemas kini secara automatik oleh arahan `npm run deploy` (bahagian GAS_WEB_APP_URL).
 */
window.ETUTOR_CONFIG = {
  // URL Web App Google Apps Script Produksi
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxQakzUqQG5AO2Q6tWDBs1AJ39WNqeir29G3zMyLC69FaUd_A-703i28-P98Ap-Q2Ql/exec",
  BRAND_NAME: "eTutor.my",

  // Konfigurasi Supabase (Auth + PostgreSQL Cloud Sync & Leaderboard):
  // Kosongkan ("") untuk kekal guna mod sandaran GAS/Lokal; isi kedua-duanya untuk aktifkan Supabase serta-merta.
  SUPABASE_URL: "https://ktesekiguardgfdgrmlp.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_-VuEWlM2SSKoAelLidXZyw_et9gDZnW",

  // Endpoint Pelayan Cikgu AI SPM (Utama: Supabase Edge Function -> Sandaran Darurat: Modal GPU Qwen 3.5)
  CIKGU_CHATBOT_ENABLED: true,
  CIKGU_SUPABASE_EDGE_URL: "https://ktesekiguardgfdgrmlp.supabase.co/functions/v1/cikgu-semak",
  CIKGU_MODAL_GPU_URL: "https://hanismathussin96--cikgu-ai-spm.modal.run",
  CIKGU_HF_MODEL_REPO: "https://huggingface.co/BITMH/cikgu-spm-qwen35-gguf",

  // Suis Utama Mod Akses Portal:
  //   true  = Mod Akses Terbuka (Log Masuk OFF & Pakej Harga OFF — pelajar terus masuk Bank Soalan)
  //   false = Mod Langganan Berdaftar (Log Masuk PIN + Had 2 Peranti + Pakej Harga ON)
  // Boleh juga ditukar terus secara langsung melalui Panel Kawalan Admin (#admin) pada tahun hadapan.
  OPEN_ACCESS_MODE: true,

  // Promosi Kemuncak SPM 2026: true = semua 35 bab Nota Interaktif 0 Token (Percuma);
  // Tukar kepada false selepas tamat SPM untuk kembali ke kadar asal (2 Token/Bab).
  NOTA_FREE_PROMO_MODE: true,
  // Tarikh luput automatik promosi 0 Token Nota Interaktif (waktu Malaysia UTC+08:00).
  // Sebaik melepasi tarikh ini, portal automatik kembali ke kadar asal (2 Token/Bab).
  NOTA_FREE_PROMO_UNTIL: "2026-12-17T23:59:59+08:00",

  // Google Sign-In untuk Cloud Sync (pilihan). Kosongkan = hanya e-mel OTP.
  // Isi dengan OAuth Web Client ID (https://console.cloud.google.com/apis/credentials, Authorized JS origin: https://etutor.my)
  // dan tetapkan nilai SAMA pada Script Property `GOOGLE_CLIENT_ID` di Apps Script.
  GOOGLE_CLIENT_ID: "610931574453-20o71gsc6fk7brnv9evgcb5tr4i4p289.apps.googleusercontent.com",

  SUPPORT_CONTACT: "Sokongan WhatsApp Admin eTutor.my (013-732 7696)",
  ADMIN_WHATSAPP_DISPLAY: "013-732 7696",

  // Tetapan Penutupan Jualan & Sokongan Langsung WhatsApp Admin (format antarabangsa tanpa '+'):
  SALES_WHATSAPP: "60137327696",
  PAYMENT_URL: "",

  // Polisi Gedung Aplikasi (Apple Guideline 3.1.1 & 3.1.3(b)):
  // Kekalkan false supaya borang tebus baucar kekal tersembunyi dalam binaan asli Capacitor (App Store / Play Store).
  allowNativeVoucher: false,

  // Senarai Subjek Standard SPM (digabungkan secara dinamik dengan subjek sebenar di Google Drive)
  DEFAULT_SUBJECTS: [
    "Bahasa Melayu",
    "Bahasa Inggeris",
    "Sejarah",
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
  ],

  PRICING_PLANS: {
    tokenStarter: {
      code: "PEK_CUBA_45",
      name: "Pek Cuba — 45 Token AI Ekspres",
      price: "RM 5",
      tokens: 45,
      period: "sah sehingga tamat SPM • Snap & Check aktif"
    },
    tokenFocus: {
      code: "PEK_FOKUS_160",
      name: "Pek Fokus — 160 Token AI Ekspres",
      price: "RM 15",
      tokens: 160,
      period: "jimat 12% • sah sehingga tamat SPM"
    },
    tokenSprint: {
      code: "PEK_PECUTAN_500",
      name: "Pek Pecutan SPM — 500 Token AI Ekspres",
      price: "RM 39",
      tokens: 500,
      period: "jimat 30% • sah sehingga tamat SPM"
    }
  }
};
