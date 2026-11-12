/**
 * public-web/integrations/cikgu-ai/ui/widget-template.js
 * Pembina templat DOM bersih & minimalis bagi laci sembang Cikgu AI serta FAB terapung.
 */

export function buildCikguDrawerTemplate(endpoints, isAdminRoute) {
  return `
    <div class="cikgu-ai-drawer" id="cikguAiDrawer" hidden>
      <div class="cikgu-ai-header">
        <div class="cikgu-ai-brand">
          <div class="cikgu-ai-avatar" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          </div>
          <div>
            <h2 class="cikgu-ai-title">Cikgu AI</h2>
            <p class="cikgu-ai-subtitle">
              <span class="cikgu-ai-online-dot"></span>
              <span id="cikguAiStatusSub">Sedia membantu</span>
            </p>
          </div>
        </div>
        <div class="cikgu-ai-hdr-actions">
          <span class="cikgu-ai-token-pill" id="cikguAiTokenPill" title="Kuota harian dikongsi bersama Semak Jawapan AI Kertas 2 (reset 12:00 tengah malam MYT)">30/30 Token</span>
          <button type="button" class="cikgu-ai-icon-btn" id="cikguAiSettingsBtn" title="Tetapan Pelayan (Admin)" ${isAdminRoute ? "" : "hidden"}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button type="button" class="cikgu-ai-icon-btn" id="cikguAiCloseBtn" aria-label="Tutup">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div class="cikgu-ai-admin-panel" id="cikguAiAdminPanel" hidden>
        <div class="cikgu-ai-admin-grid">
          <div class="cikgu-ai-admin-status" id="cikguAiAdminStatusBox">
            Status pelayan dwi-awan percuma.
          </div>
          <div class="cikgu-ai-admin-row">
            <label for="cikguAiRouteMode">Mod Penghalaan:</label>
            <select id="cikguAiRouteMode">
              <option value="auto"${endpoints.mode === "auto" ? " selected" : ""}>Auto-Failover (Modal GPU → Cloud Run)</option>
              <option value="cloud-run"${endpoints.mode === "cloud-run" ? " selected" : ""}>Utama Sahaja (Modal GPU)</option>
              <option value="hf-spaces"${endpoints.mode === "hf-spaces" ? " selected" : ""}>Sandaran Sahaja (Cloud Run)</option>
            </select>
          </div>
          <div class="cikgu-ai-admin-row">
            <label for="cikguAiPrimaryInput">URL Utama:</label>
            <input id="cikguAiPrimaryInput" type="url" value="${endpoints.primaryUrl}">
          </div>
          <div class="cikgu-ai-admin-row">
            <label for="cikguAiBackupInput">URL Sandaran:</label>
            <input id="cikguAiBackupInput" type="url" value="${endpoints.backupUrl}">
          </div>
          <div style="display:flex; gap:6px; margin-top:2px;">
            <button type="button" class="cikgu-ai-tts-btn" id="cikguAiCheckHealthBtn">Semak Kesihatan</button>
            <button type="button" class="cikgu-ai-tts-btn" id="cikguAiSaveEndpointsBtn" style="background:#059669;color:#fff;border-color:#059669;">Simpan</button>
          </div>
        </div>
      </div>

      <div class="cikgu-ai-feed" id="cikguAiFeed">
        <div class="cikgu-ai-msg cikgu-ai-msg-bot" id="cikguAiWelcomeBubble">
          Assalamualaikum &amp; salam sejahtera! Ada bahagian soalan pada skrin yang kurang jelas, atau nak Cikgu semakkan jawapan kamu? Mulakan dengan sapaan dan tulis di bawah ya.
        </div>
      </div>

      <form class="cikgu-ai-composer" id="cikguAiForm">
        <textarea
          id="cikguAiChatInput"
          class="cikgu-ai-chat-input"
          rows="1"
          placeholder="Tanya Cikgu..."
        ></textarea>
        <button type="button" class="cikgu-ai-mic-btn" id="cikguAiMicBtn" title="Input Suara">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        </button>
        <button type="submit" class="cikgu-ai-submit-btn" id="cikguAiSubmitBtn" aria-label="Hantar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    </div>

    <div class="cikgu-ai-fab-wrap">
      <div class="cikgu-ai-tooltip" id="cikguAiTooltip" hidden>
        <span>Perlukan bantuan soalan ini? Tanya Cikgu AI</span>
        <button type="button" class="cikgu-ai-tooltip-close" id="cikguAiTooltipClose" aria-label="Tutup">✕</button>
      </div>
      <button type="button" class="cikgu-ai-fab" id="cikguAiFab" aria-label="Buka Cikgu AI">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
        <span class="cikgu-ai-pulse-dot"></span>
      </button>
    </div>
  `;
}
