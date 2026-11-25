/**
 * public-web/integrations/cikgu-ai/ui/fab-draggable.js
 * Pengawal seret & lekat tepi (Messenger Chat-Head) untuk butang FAB Cikgu AI.
 */

const FAB_STORAGE_KEY = "etutor_cikgu_fab_pos_v1";
const FAB_DRAG_THRESHOLD = 6;
const FAB_TOP_MIN = 64;

function clampVal(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    Boolean(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

function readStoredFabPos() {
  try {
    const raw = localStorage.getItem(FAB_STORAGE_KEY);
    if (!raw) return { side: "right", yRatio: 1 };
    const parsed = JSON.parse(raw);
    const side = parsed && parsed.side === "left" ? "left" : "right";
    const yRatio = Number.isFinite(Number(parsed && parsed.yRatio))
      ? clampVal(Number(parsed.yRatio), 0, 1)
      : 1;
    return { side, yRatio };
  } catch {
    return { side: "right", yRatio: 1 };
  }
}

function saveStoredFabPos(side, yRatio) {
  try {
    localStorage.setItem(
      FAB_STORAGE_KEY,
      JSON.stringify({ side: side === "left" ? "left" : "right", yRatio: clampVal(yRatio, 0, 1) })
    );
  } catch {}
}

function getSafeBounds(fabBtnEl) {
  const vw = Math.max(280, window.innerWidth || document.documentElement.clientWidth || 390);
  const vh = Math.max(320, window.innerHeight || document.documentElement.clientHeight || 844);
  const examCompact = document.body.classList.contains("is-exam-stage-open") && vw <= 1023;
  const size = Math.max(44, Math.round((fabBtnEl && fabBtnEl.offsetWidth) || (examCompact ? 46 : 56)));
  const margin = vw <= 767 ? 12 : 20;

  let bottomSafe = 20;
  const nav = document.getElementById("mobileBottomNav");
  if (nav && window.getComputedStyle(nav).display !== "none") {
    const navRect = nav.getBoundingClientRect();
    const navH = navRect && navRect.height > 0 ? navRect.height : 66;
    bottomSafe = Math.max(84, Math.ceil(navH) + 14);
  } else if (examCompact) {
    bottomSafe = 72;
  }

  return {
    vw,
    vh,
    size,
    margin,
    minX: margin,
    maxX: Math.max(margin, vw - size - margin),
    minY: FAB_TOP_MIN,
    maxY: Math.max(FAB_TOP_MIN, vh - bottomSafe - size)
  };
}

export function attachDraggableCikguFab(rootEl, fabWrapEl, fabBtnEl) {
  let curX = 0;
  let curY = 0;
  let curSide = "right";
  let curSize = 56;
  let isDragging = false;
  let moved = false;
  let activePointerId = null;
  let startClientX = 0;
  let startClientY = 0;
  let originX = 0;
  let originY = 0;
  let suppressClickUntil = 0;
  let snapTimer = 0;
  let syncRaf = 0;

  function applyPos(x, y, side, animate) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    curX = rx;
    curY = ry;
    curSide = side === "left" ? "left" : "right";
    fabWrapEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    fabWrapEl.dataset.dock = curSide;
    rootEl.dataset.dock = curSide;
    if (snapTimer) {
      clearTimeout(snapTimer);
      snapTimer = 0;
    }
    if (animate && !prefersReducedMotion()) {
      fabWrapEl.classList.add("is-snapping");
      snapTimer = setTimeout(() => {
        fabWrapEl.classList.remove("is-snapping");
        snapTimer = 0;
      }, 340);
    } else {
      fabWrapEl.classList.remove("is-snapping");
    }
    window.__ETUTOR_CIKGU_FAB_STATE__ = {
      x: rx,
      y: ry,
      side: curSide,
      size: curSize,
      isDragging
    };
  }

  function syncBounds() {
    if (isDragging) return;
    const b = getSafeBounds(fabBtnEl);
    const stored = readStoredFabPos();
    curSize = b.size;
    const targetX = stored.side === "left" ? b.minX : b.maxX;
    const span = Math.max(0, b.maxY - b.minY);
    const targetY = b.minY + span * stored.yRatio;
    applyPos(targetX, targetY, stored.side, false);
  }

  function scheduleSync() {
    if (syncRaf) return;
    syncRaf = window.requestAnimationFrame(() => {
      syncRaf = 0;
      syncBounds();
    });
  }

  fabBtnEl.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    activePointerId = e.pointerId;
    startClientX = e.clientX;
    startClientY = e.clientY;
    originX = curX;
    originY = curY;
    moved = false;
    try {
      fabBtnEl.setPointerCapture(e.pointerId);
    } catch {}
  });

  fabBtnEl.addEventListener("pointermove", (e) => {
    if (activePointerId !== e.pointerId) return;
    const dx = e.clientX - startClientX;
    const dy = e.clientY - startClientY;
    if (!moved && Math.hypot(dx, dy) < FAB_DRAG_THRESHOLD) return;
    if (!moved) {
      moved = true;
      isDragging = true;
      fabWrapEl.classList.add("is-dragging");
      const tip = rootEl.querySelector("#cikguAiTooltip");
      if (tip) tip.hidden = true;
    }
    const b = getSafeBounds(fabBtnEl);
    curSize = b.size;
    const nx = clampVal(originX + dx, b.minX, b.maxX);
    const ny = clampVal(originY + dy, b.minY, b.maxY);
    const hoverSide = nx + b.size / 2 < b.vw / 2 ? "left" : "right";
    applyPos(nx, ny, hoverSide, false);
  });

  function finishDrag(e) {
    if (activePointerId !== e.pointerId) return;
    activePointerId = null;
    isDragging = false;
    fabWrapEl.classList.remove("is-dragging");
    try {
      if (fabBtnEl.hasPointerCapture && fabBtnEl.hasPointerCapture(e.pointerId)) {
        fabBtnEl.releasePointerCapture(e.pointerId);
      }
    } catch {}
    if (moved) {
      const b = getSafeBounds(fabBtnEl);
      curSize = b.size;
      const side = curX + b.size / 2 < b.vw / 2 ? "left" : "right";
      const snapX = side === "left" ? b.minX : b.maxX;
      const clampY = clampVal(curY, b.minY, b.maxY);
      const span = Math.max(1, b.maxY - b.minY);
      const yRatio = b.maxY > b.minY ? clampVal((clampY - b.minY) / span, 0, 1) : 1;
      saveStoredFabPos(side, yRatio);
      applyPos(snapX, clampY, side, true);
      suppressClickUntil = Date.now() + 360;
    } else if (window.__ETUTOR_CIKGU_FAB_STATE__) {
      window.__ETUTOR_CIKGU_FAB_STATE__.isDragging = false;
    }
  }

  fabBtnEl.addEventListener("pointerup", finishDrag);
  fabBtnEl.addEventListener("pointercancel", finishDrag);

  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("orientationchange", scheduleSync, { passive: true });
  if (window.MutationObserver) {
    const obs = new MutationObserver(scheduleSync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    ["dashboardView", "examStage"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el, { attributes: true, attributeFilter: ["hidden"] });
    });
  }

  syncBounds();
  window.requestAnimationFrame(syncBounds);

  return {
    wasRecentlyDragged: () => Date.now() < suppressClickUntil,
    syncBounds
  };
}
