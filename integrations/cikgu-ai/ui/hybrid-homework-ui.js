/**
 * public-web/integrations/cikgu-ai/ui/hybrid-homework-ui.js
 * Pembina UI Mod Bimbing Dulu (*Bimbing Dulu, Buka Penuh Bila Perlu*) bergaya taktil Duolingo.
 */

const SVG_BULB = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>';
const SVG_CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const SVG_KEY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
const SVG_STAR = '<svg class="cikgu-ai-hyb-star" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 14.9 8.6 22 9.3 16.6 14 18.2 21 12 17.3 5.8 21 7.4 14 2 9.3 9.1 8.6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const SVG_BOOK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"/></svg>';
const SVG_TARGET = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>';

export function buildHybridModeBarMarkup(isHybrid = false) {
  const pressed = isHybrid ? "true" : "false";
  const activeCls = isHybrid ? " is-active" : "";
  const hint = isHybrid ? "Aktif: Petunjuk Langkah 1 dahulu" : "Mod pantas biasa";
  return `
    <div class="cikgu-ai-mode-bar">
      <button type="button" id="cikguAiHybridToggle" class="cikgu-ai-hyb-toggle${activeCls}" aria-pressed="${pressed}" title="Bimbing langkah demi langkah dahulu sebelum jawapan penuh">
        ${SVG_BULB}
        <span>Mod Bimbing Dulu</span>
      </button>
      <span class="cikgu-ai-mode-hint" id="cikguAiModeHint">${hint}</span>
    </div>
  `;
}

export function buildHybridStagePillMarkup() {
  return `
    <div class="cikgu-ai-stage-pill" id="cikguAiStagePill" hidden>
      <span id="cikguAiStagePillText">Menyemak cubaan kamu — taip langkah di bawah</span>
      <button type="button" class="cikgu-ai-stage-cancel" id="cikguAiStageCancelBtn" aria-label="Batal semakan cubaan">Batal</button>
    </div>
  `;
}

export function syncHybridComposerUi(rootEl, { hybridMode = false, pendingHintStage = "bimbing" } = {}) {
  if (!rootEl) return;
  const toggleBtn = rootEl.querySelector("#cikguAiHybridToggle");
  const modeHint = rootEl.querySelector("#cikguAiModeHint");
  const stagePill = rootEl.querySelector("#cikguAiStagePill");
  const stageTxt = rootEl.querySelector("#cikguAiStagePillText");
  const inputEl = rootEl.querySelector("#cikguAiChatInput");

  const isHybrid = Boolean(hybridMode);
  const isCheckAttempt = isHybrid && pendingHintStage === "semak_cubaan";

  if (toggleBtn) {
    toggleBtn.setAttribute("aria-pressed", isHybrid ? "true" : "false");
    toggleBtn.classList.toggle("is-active", isHybrid);
  }
  if (modeHint) {
    modeHint.textContent = isHybrid ? "Aktif: Petunjuk Langkah 1 dahulu" : "Mod pantas biasa";
  }
  if (stagePill) {
    stagePill.hidden = !isCheckAttempt;
  }
  if (stageTxt && isCheckAttempt) {
    stageTxt.textContent = "Mod Semak Cubaan Saya — hantar jawapan percubaan kamu";
  }
  if (inputEl) {
    inputEl.placeholder = isCheckAttempt ? "Taip cubaan jawapan..." : (isHybrid ? "Taip soalan bimbingan..." : "Tanya Cikgu...");
  }
}

function resolveHybridProgress(stage) {
  if (stage === "jalan_kerja_penuh") return { step: 3, pct: 100 };
  if (stage === "semak_cubaan") return { step: 2, pct: 66 };
  return { step: 1, pct: 33 };
}

function buildHybridCardHeader(stage) {
  const { step, pct } = resolveHybridProgress(stage);
  const dots = [1, 2, 3].map((n) => `<span class="cikgu-ai-hyb-stepdot is-d${n}${step >= n ? " is-on" : ""}"></span>`).join("");
  const head = document.createElement("div");
  head.className = "cikgu-ai-hyb-head";
  head.innerHTML =
    `<div class="cikgu-ai-hyb-top"><img src="./images/hero-student-3d.webp" alt="" class="cikgu-ai-hyb-avatar" width="32" height="32" decoding="async">` +
    `<div class="cikgu-ai-hyb-pills"><span class="cikgu-ai-hyb-pill is-brand">Cikgu AI &bull; Mod Bimbing</span><span class="cikgu-ai-hyb-pill is-online"><span class="cikgu-ai-hyb-dot"></span>Online</span><span class="cikgu-ai-hyb-pill is-tutor">AI Tutor</span></div></div>` +
    `<div class="cikgu-ai-hyb-prog" aria-label="Kemajuan bimbingan Langkah ${step} dari 3"><span class="cikgu-ai-hyb-prog-lbl">Langkah ${step} dari 3</span>${SVG_STAR}<div class="cikgu-ai-hyb-track"><div class="cikgu-ai-hyb-fill" style="width:${pct}%"></div>${dots}</div><span class="cikgu-ai-hyb-pct">(${pct}%)</span></div>`;
  return head;
}

function decorateHybridSectionBadges(botBubble) {
  botBubble.querySelectorAll(".cikgu-ai-sec-badge").forEach((badge) => {
    if (badge.dataset.hybStyled === "1") return;
    badge.dataset.hybStyled = "1";
    const txt = (badge.textContent || "").toUpperCase();
    let cls = "is-sec-kssm";
    let ico = SVG_BOOK;
    if (/PETUNJUK|SEMAKAN|PEMBETULAN/.test(txt)) { cls = "is-sec-hint"; ico = SVG_BULB; }
    else if (/GILIRAN/.test(txt)) { cls = "is-sec-try"; ico = SVG_TARGET; }
    else if (/JALAN KERJA|TIP/.test(txt)) { cls = "is-sec-full"; ico = SVG_CHECK; }
    badge.classList.add(cls);
    const span = document.createElement("span");
    span.className = "cikgu-ai-sec-ico";
    span.innerHTML = ico;
    badge.prepend(span);
  });
}

export function appendHybridActionButtons({
  botBubble,
  drawerInstance,
  meta,
  homeworkQuestion,
  onCheckAttempt,
  onRevealFull
}) {
  if (!botBubble || !meta) return;
  const resMod = String(meta.mod || "");
  const resStage = String(meta.tahap_bimbingan || "");
  const isBlocked =
    meta.sahsiah_signal === "sapaan_sahaja" || meta.sahsiah_signal === "biadab_tegah";
  const isHybridTurn =
    resMod === "bimbing_kerja_sekolah" || (Boolean(drawerInstance && drawerInstance.hybridMode) && !resMod);

  if (isBlocked || !isHybridTurn) return;

  botBubble.classList.add("is-hybrid-bot");
  if (!botBubble.querySelector(".cikgu-ai-hyb-head")) {
    botBubble.prepend(buildHybridCardHeader(resStage));
  }
  decorateHybridSectionBadges(botBubble);

  if (resStage === "jalan_kerja_penuh") return;

  const wrap = document.createElement("div");
  wrap.className = "cikgu-ai-hyb-actions";

  const checkBtn = document.createElement("button");
  checkBtn.type = "button";
  checkBtn.className = "cikgu-ai-hyb-btn is-check";
  checkBtn.innerHTML = `${SVG_CHECK}<span>Semak Cubaan Saya</span>`;

  const revealBtn = document.createElement("button");
  revealBtn.type = "button";
  revealBtn.className = "cikgu-ai-hyb-btn is-reveal";
  revealBtn.innerHTML = `${SVG_KEY}<span>Tunjuk Jalan Kerja Penuh</span>`;

  checkBtn.addEventListener("click", () => {
    if (typeof onCheckAttempt === "function") onCheckAttempt();
  });

  revealBtn.addEventListener("click", () => {
    checkBtn.disabled = true;
    revealBtn.disabled = true;
    if (typeof onRevealFull === "function") onRevealFull(homeworkQuestion);
  });

  wrap.appendChild(checkBtn);
  wrap.appendChild(revealBtn);
  botBubble.appendChild(wrap);
}

export function applyHybridDeepLinkFromUrl(drawer) {
  if (!drawer || typeof window === "undefined" || !window.location) return;
  let params;
  try { params = new URLSearchParams(window.location.search || ""); } catch { return; }
  const cMode = (params.get("cikguMode") || "").trim();
  const cPrompt = (params.get("cikguPrompt") || "").trim();
  const cSubj = (params.get("cikguSubjek") || params.get("subject") || "").trim();
  if (cMode !== "bimbing_kerja_sekolah" && !cPrompt) return;
  if (cMode === "bimbing_kerja_sekolah" || (cPrompt && cMode !== "auto")) {
    drawer.setHybridMode(true, "bimbing");
  }
  const openNow = () => {
    if (drawer._deepLinkConsumed || !drawer.rootEl) return;
    drawer._deepLinkConsumed = true;
    drawer.openWithPrompt(cPrompt, cSubj);
  };
  const dash = document.getElementById("dashboardView");
  const stage = document.getElementById("examStage");
  if (((!dash && !stage) || (dash && !dash.hidden) || (stage && !stage.hidden)) && drawer.rootEl && !drawer.rootEl.hidden) {
    openNow();
    return;
  }
  if (typeof MutationObserver === "function" && drawer.rootEl) {
    const obs = new MutationObserver(() => {
      if (drawer.rootEl && !drawer.rootEl.hidden) { obs.disconnect(); openNow(); }
    });
    obs.observe(drawer.rootEl, { attributes: true, attributeFilter: ["hidden"] });
  }
}
