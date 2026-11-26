/**
 * public-web/integrations/cikgu-ai/ui/snap-photo-helper.js
 * Pembantu Snap / Muat Naik Gambar Kerja Sekolah bagi widget Cikgu AI versi desktop.
 */

export const SNAP_IMAGE_TOKEN_COST = 3;
export const TEXT_CHAT_TOKEN_COST = 1;

const SVG_CAM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const SVG_CLOSE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

export function buildSnapImageBarMarkup() {
  return `
    <div class="cikgu-ai-image-bar" id="cikguAiImageBar" hidden>
      <img id="cikguAiImageThumb" class="cikgu-ai-image-thumb" alt="Pratonton gambar kerja sekolah" width="40" height="40">
      <div class="cikgu-ai-image-meta">
        <strong id="cikguAiImageName">kerja_sekolah.jpg</strong>
        <span>Semakan Gambar &bull; 3 Token</span>
      </div>
      <button type="button" class="cikgu-ai-img-rm" id="cikguAiRemoveImgBtn" aria-label="Buang lampiran gambar" title="Buang gambar">
        ${SVG_CLOSE}
      </button>
    </div>
  `;
}

export function buildSnapComposerControlsMarkup() {
  return `
    <input type="file" id="cikguAiFileInput" accept="image/*" hidden>
    <button type="button" class="cikgu-ai-snap-btn" id="cikguAiSnapBtn" title="Snap / Muat Naik Gambar Kerja Sekolah (3 Token)" aria-label="Muat naik gambar kerja sekolah">
      ${SVG_CAM}
    </button>
  `;
}

export function compressDesktopImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca fail gambar."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format gambar tidak disokong."));
      img.onload = () => {
        const scale = Math.min(1, 1280 / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || 1) * scale));
        const h = Math.max(1, Math.round((img.height || 1) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve({
          dataUrl,
          base64: dataUrl.split(",")[1] || "",
          mime: "image/jpeg",
          name: (file && file.name) || "kerja_sekolah.jpg"
        });
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

export function attachDesktopSnapPhotoHandlers(drawer) {
  if (!drawer || !drawer.rootEl) return;
  const root = drawer.rootEl;
  const drawerEl = root.querySelector("#cikguAiDrawer");
  const snapBtn = root.querySelector("#cikguAiSnapBtn");
  const fileInput = root.querySelector("#cikguAiFileInput");
  const imageBar = root.querySelector("#cikguAiImageBar");
  const thumbEl = root.querySelector("#cikguAiImageThumb");
  const nameEl = root.querySelector("#cikguAiImageName");
  const removeBtn = root.querySelector("#cikguAiRemoveImgBtn");
  const chatInput = root.querySelector("#cikguAiChatInput");
  const modeHint = root.querySelector("#cikguAiModeHint");
  const statusSub = root.querySelector("#cikguAiStatusSub");

  const syncImageUi = () => {
    const img = drawer.pendingImage;
    if (imageBar && thumbEl && nameEl) {
      if (img && img.dataUrl) {
        thumbEl.src = img.dataUrl;
        nameEl.textContent = img.name || "kerja_sekolah.jpg";
        imageBar.hidden = false;
      } else {
        thumbEl.removeAttribute("src");
        imageBar.hidden = true;
      }
    }
    if (snapBtn) snapBtn.classList.toggle("has-image", Boolean(img && img.dataUrl));
    if (modeHint) {
      modeHint.textContent = img
        ? "Gambar sedia dihantar (3 Token)"
        : (drawer.hybridMode ? "Aktif: Petunjuk Langkah 1 dahulu" : "Mod pantas biasa");
    }
  };

  const handleFile = async (file) => {
    if (!file || !String(file.type || "").startsWith("image/")) return;
    try {
      drawer.pendingImage = await compressDesktopImageFile(file);
      syncImageUi();
      if (statusSub) statusSub.textContent = "Gambar sedia disemak Cikgu AI";
      if (chatInput) chatInput.focus();
    } catch (err) {
      if (statusSub) statusSub.textContent = String((err && err.message) || "Gagal memproses gambar");
    }
  };

  drawer.syncImagePreviewUi = syncImageUi;
  drawer.clearPendingImage = () => {
    drawer.pendingImage = null;
    if (fileInput) fileInput.value = "";
    syncImageUi();
  };
  drawer.openSnapPhotoPicker = () => {
    if (snapBtn) {
      snapBtn.classList.remove("is-attn");
      void snapBtn.offsetWidth;
      snapBtn.classList.add("is-attn");
      setTimeout(() => snapBtn.classList.remove("is-attn"), 1800);
    }
    if (statusSub) statusSub.textContent = "Pilih atau tampal (Ctrl+V) gambar kerja sekolah";
    if (fileInput) fileInput.click();
  };

  if (snapBtn && fileInput) {
    snapBtn.addEventListener("click", () => fileInput.click());
  }
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) void handleFile(f);
    });
  }
  if (removeBtn) {
    removeBtn.addEventListener("click", () => drawer.clearPendingImage());
  }
  if (chatInput) {
    chatInput.addEventListener("paste", (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith("image/")) {
          const f = items[i].getAsFile();
          if (f) {
            e.preventDefault();
            void handleFile(f);
            break;
          }
        }
      }
    });
  }
  if (drawerEl) {
    drawerEl.addEventListener("dragover", (e) => {
      if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files")) e.preventDefault();
    });
    drawerEl.addEventListener("drop", (e) => {
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && String(f.type || "").startsWith("image/")) {
        e.preventDefault();
        void handleFile(f);
      }
    });
  }
  syncImageUi();
}
