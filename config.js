/**
 * config.js
 * Konfigurasi Endpoint Backend Google Apps Script & Tetapan Jualan untuk domain etutor.my.
 * Fail ini dikemas kini secara automatik oleh arahan `npm run deploy` (bahagian GAS_WEB_APP_URL).
 */
window.ETUTOR_CONFIG = {
  // URL Web App Google Apps Script Produksi
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxQakzUqQG5AO2Q6tWDBs1AJ39WNqeir29G3zMyLC69FaUd_A-703i28-P98Ap-Q2Ql/exec",
  BRAND_NAME: "eTutor.my",
  SUPPORT_CONTACT: "Pasukan Sokongan Akademik eTutor.my",

  // Tetapan Penutupan Jualan (Landing Page):
  // Masukkan nombor WhatsApp jualan anda dalam format antarabangsa tanpa '+' (cth: "60123456789")
  // atau masukkan pautan terus ToyyibPay / Billplz / OnPay pada PAYMENT_URL jika mahu bayaran terus.
  SALES_WHATSAPP: "",
  PAYMENT_URL: "",

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
