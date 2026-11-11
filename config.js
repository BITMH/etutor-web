/**
 * config.js
 * Konfigurasi Endpoint Backend Google Apps Script & Tetapan Jualan untuk domain etutor.my.
 * Fail ini dikemas kini secara automatik oleh arahan `npm run deploy` (bahagian GAS_WEB_APP_URL).
 */
window.ETUTOR_CONFIG = {
  // URL Web App Google Apps Script Produksi
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxQakzUqQG5AO2Q6tWDBs1AJ39WNqeir29G3zMyLC69FaUd_A-703i28-P98Ap-Q2Ql/exec",
  BRAND_NAME: "eTutor.my",

  // Endpoint Pelayan Cikgu AI SPM (Google Cloud Run Always Free + Model Hugging Face Hub Percuma)
  CIKGU_CLOUD_RUN_URL: "https://cikgu-ai-spm-afaauenp7q-as.a.run.app",
  CIKGU_HF_MODEL_REPO: "https://huggingface.co/BITMH/cikgu-spm-qwen35-gguf",

  // Suis Utama Mod Akses Portal:
  //   true  = Mod Akses Terbuka (Log Masuk OFF & Pakej Harga OFF — pelajar terus masuk Bank Soalan)
  //   false = Mod Langganan Berdaftar (Log Masuk PIN + Had 2 Peranti + Pakej Harga ON)
  // Boleh juga ditukar terus secara langsung melalui Panel Kawalan Admin (#admin) pada tahun hadapan.
  OPEN_ACCESS_MODE: true,

  // Google Sign-In untuk Cloud Sync (pilihan). Kosongkan = hanya e-mel OTP.
  // Isi dengan OAuth Web Client ID (https://console.cloud.google.com/apis/credentials, Authorized JS origin: https://etutor.my)
  // dan tetapkan nilai SAMA pada Script Property `GOOGLE_CLIENT_ID` di Apps Script.
  GOOGLE_CLIENT_ID: "610931574453-20o71gsc6fk7brnv9evgcb5tr4i4p289.apps.googleusercontent.com",

  SUPPORT_CONTACT: "Sokongan WhatsApp Admin eTutor.my (013-732 7696)",
  ADMIN_WHATSAPP_DISPLAY: "013-732 7696",

  // Tetapan Penutupan Jualan & Sokongan Langsung WhatsApp Admin (format antarabangsa tanpa '+'):
  SALES_WHATSAPP: "60137327696",
  PAYMENT_URL: "",

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
    single: {
      code: "PAKEJ_FOKUS",
      name: "Pas Fokus Subjek",
      price: "RM 29",
      period: "akses penuh sehingga tamat SPM",
      badge: "Pilihan Ulang Kaji Terfokus"
    },
    allAccess: {
      code: "PAKEJ_SEMUA_SUBJEK",
      name: "Pas Penuh Semua Subjek SPM",
      price: "RM 59",
      originalPrice: "RM 120",
      period: "sekali bayar • akses penuh sehingga SPM",
      badge: "Paling Popular • Jimat 50%"
    },
    family: {
      code: "PAKEJ_KELUARGA",
      name: "Pas Kembar / Adik-Beradik (2 Akaun)",
      price: "RM 99",
      originalPrice: "RM 240",
      period: "2 ID Pelajar berasingan • 4 peranti",
      badge: "Terbaik Untuk Ibu Bapa"
    }
  }
};
