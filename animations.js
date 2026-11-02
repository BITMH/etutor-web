/**
 * animations.js
 * Enjin Koreografi Animasi Portal eTutor.my berasaskan Anime.js v4.5.0
 * (https://github.com/juliangarnier/anime)
 *
 * Prinsip Prestasi & Aksesibiliti (ui-ux-pro-max + modern-web-guidance):
 * 1. Hanya menganimasikan sifat kompositor GPU (`opacity`, `translateX`, `translateY`, `scale`, `rotate`)
 *    serta pembolehubah CSS / kaunter angka — sifar susun atur bergegar (CLS = 0).
 * 2. Menghormati `prefers-reduced-motion: reduce` secara dinamik tanpa memaksa `0.01ms` global.
 * 3. Degradasi anggun (graceful fallback) jika skrip CDN disekat oleh rangkaian sekolah.
 */

(function () {
  "use strict";

  const reducedMotionQuery =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  let ambientAnimations = [];
  const lastNumericValues = {
    ringPct: 0,
    avgScore: 0,
    totalXp: 0,
    streakDays: 0
  };

  function prefersReducedMotion() {
    return Boolean(reducedMotionQuery && reducedMotionQuery.matches);
  }

  function getAnime() {
    if (typeof window !== "undefined" && window.anime && typeof window.anime.animate === "function") {
      return window.anime;
    }
    return null;
  }

  function clearInlineTransform(targets) {
    const A = getAnime();
    if (A && typeof A.cleanInlineStyles === "function") {
      try {
        A.cleanInlineStyles(targets);
        return;
      } catch (e) {}
    }
    const list =
      typeof targets === "string"
        ? document.querySelectorAll(targets)
        : targets instanceof Element
          ? [targets]
          : Array.isArray(targets) || NodeList.prototype.isPrototypeOf(targets)
            ? targets
            : [];
    Array.from(list).forEach(function (el) {
      if (el && el.style) {
        el.style.removeProperty("transform");
        el.style.removeProperty("opacity");
        el.style.removeProperty("translate");
        el.style.removeProperty("scale");
      }
    });
  }

  // ==========================================================================
  // 1. SKRIN LOG MASUK: Lukisan Vektor SVG + Kemasukan Kad + Orb Ambien Lembut
  // ==========================================================================
  function startLoginAmbientOrbs() {
    stopLoginAmbientOrbs();
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const orbs = document.querySelectorAll(".login-bg-orbs .orb");
    if (!orbs.length) return;

    const configs = [
      { x: [-18, 22], y: [-14, 18], scale: [1, 1.08], dur: 6800 },
      { x: [20, -24], y: [16, -16], scale: [1.05, 0.96], dur: 7600 },
      { x: [-12, 16], y: [18, -12], scale: [0.96, 1.06], dur: 8200 }
    ];

    orbs.forEach(function (orb, idx) {
      const cfg = configs[idx % configs.length];
      const anim = A.animate(orb, {
        translateX: cfg.x,
        translateY: cfg.y,
        scale: cfg.scale,
        duration: cfg.dur,
        alternate: true,
        loop: true,
        ease: "inOutSine"
      });
      ambientAnimations.push(anim);
    });
  }

  function stopLoginAmbientOrbs() {
    ambientAnimations.forEach(function (anim) {
      try {
        if (anim && typeof anim.cancel === "function") anim.cancel();
        else if (anim && typeof anim.pause === "function") anim.pause();
      } catch (e) {}
    });
    ambientAnimations = [];
  }

  function playLoginEntrance() {
    const A = getAnime();
    startLoginAmbientOrbs();
    if (!A || prefersReducedMotion()) return;

    const card = document.querySelector("#loginView .login-card");
    if (!card) return;

    const tl = A.createTimeline({
      defaults: { ease: "outExpo" }
    });

    tl.add(card, {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.98, 1],
      duration: 560,
      onComplete: function () {
        clearInlineTransform(card);
      }
    }, 0);

    // Lukis garisan ikon topi graduasi SVG menggunakan createDrawable Anime.js v4
    const brandPaths = document.querySelectorAll("#loginView .brand-logo-box path");
    if (brandPaths.length && typeof A.createDrawable === "function") {
      try {
        tl.add(A.createDrawable(brandPaths), {
          draw: ["0 0", "0 1"],
          duration: 720,
          ease: "inOutQuad"
        }, 80);
      } catch (e) {}
    }

    const fields = document.querySelectorAll(
      "#loginView #loginHeading, #loginView .login-subtitle, #loginView .form-field, #loginView #loginSubmitBtn"
    );
    if (fields.length) {
      tl.add(fields, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 440,
        delay: A.stagger(55),
        onComplete: function () {
          clearInlineTransform(fields);
        }
      }, 120);
    }
  }

  function shakeLoginAlert() {
    const A = getAnime();
    const alertBox = document.getElementById("loginAlertBox");
    const card = document.querySelector("#loginView .login-card");
    if (!A || prefersReducedMotion()) return;

    if (alertBox && !alertBox.hidden) {
      A.animate(alertBox, {
        opacity: [0, 1],
        scale: [0.97, 1],
        duration: 240,
        ease: "outCubic"
      });
    }
    if (card) {
      A.animate(card, {
        translateX: [0, -9, 9, -6, 6, -3, 3, 0],
        duration: 420,
        ease: "outQuad",
        onComplete: function () {
          clearInlineTransform(card);
        }
      });
    }
  }

  // ==========================================================================
  // 2. MUKA DEPAN PELAJAR: Bento Stagger, Kaunter Angka & Continue Progress
  // ==========================================================================
  function playDashboardEntrance() {
    stopLoginAmbientOrbs();
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const topbar = document.querySelector(".portal-topbar");
    const continueCards = document.querySelectorAll("#continueProgressSection:not([hidden]) .continue-card");
    const bentoCards = document.querySelectorAll(".bento-grid > .bento-card:not([hidden])");

    const tl = A.createTimeline({
      defaults: { ease: "outQuart" }
    });

    if (topbar) {
      tl.add(topbar, {
        opacity: [0, 1],
        translateY: [-14, 0],
        duration: 380,
        onComplete: function () {
          clearInlineTransform(topbar);
        }
      }, 0);
    }

    if (continueCards.length) {
      const springEase = typeof A.spring === "function" ? A.spring({ bounce: 0.22, duration: 540 }) : "outExpo";
      tl.add(continueCards, {
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.985, 1],
        duration: 520,
        delay: A.stagger(75),
        ease: springEase,
        onComplete: function () {
          clearInlineTransform(continueCards);
        }
      }, 80);
    }

    if (bentoCards.length) {
      tl.add(bentoCards, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 460,
        delay: A.stagger(70),
        onComplete: function () {
          clearInlineTransform(bentoCards);
        }
      }, 140);
    }
  }

  function animateProgressCounters(ps) {
    if (!ps) return;
    const A = getAnime();

    const targetRing = Math.max(0, Math.min(100, Number(ps.completionPercentage) || 0));
    const targetAvg = Math.max(0, Math.min(100, Number(ps.averageScore) || 0));
    const targetXp = Math.max(0, Number(ps.totalXp) || 0);
    const targetStreak = Math.max(0, Number(ps.streakDays) || 0);

    const ringEl = document.getElementById("overallProgressRing");
    const ringTextEl = document.getElementById("overallProgressPct");
    const avgEl = document.getElementById("kpiAvgScore");
    const xpEl = document.getElementById("kpiTotalXp");
    const streakEl = document.getElementById("kpiStreakDays");

    if (!A || prefersReducedMotion()) {
      lastNumericValues.ringPct = targetRing;
      lastNumericValues.avgScore = targetAvg;
      lastNumericValues.totalXp = targetXp;
      lastNumericValues.streakDays = targetStreak;
      return;
    }

    const stateObj = {
      ringPct: lastNumericValues.ringPct,
      avgScore: lastNumericValues.avgScore,
      totalXp: lastNumericValues.totalXp,
      streakDays: lastNumericValues.streakDays
    };

    lastNumericValues.ringPct = targetRing;
    lastNumericValues.avgScore = targetAvg;
    lastNumericValues.totalXp = targetXp;
    lastNumericValues.streakDays = targetStreak;

    A.animate(stateObj, {
      ringPct: targetRing,
      avgScore: targetAvg,
      totalXp: targetXp,
      streakDays: targetStreak,
      duration: 920,
      ease: "outExpo",
      onUpdate: function () {
        const r = Math.round(stateObj.ringPct);
        const a = Math.round(stateObj.avgScore);
        const x = Math.round(stateObj.totalXp);
        const s = Math.round(stateObj.streakDays);

        if (ringEl) {
          ringEl.value = r;
          ringEl.style.setProperty("--ring-pct", String(r));
        }
        if (ringTextEl) ringTextEl.textContent = r + "%";
        if (avgEl) avgEl.textContent = a + "%";
        if (xpEl) xpEl.textContent = x.toLocaleString("en-MY") + " XP";
        if (streakEl) streakEl.textContent = s + " Hari";
      }
    });

    // Animasikan cip topik lemah jika wujud
    const weakPills = document.querySelectorAll("#weakTopicsBanner:not([hidden]) .weak-pill");
    if (weakPills.length) {
      A.animate(weakPills, {
        opacity: [0, 1],
        scale: [0.92, 1],
        duration: 360,
        delay: A.stagger(55),
        ease: "outBack",
        onComplete: function () {
          clearInlineTransform(weakPills);
        }
      });
    }
  }

  // ==========================================================================
  // 3. LEADERBOARD: Podium Top 3 Spring + Baris Jadual Berperingkat
  // ==========================================================================
  function animateLeaderboardUpdate() {
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const podiumTiles = document.querySelectorAll("#leaderboardPodium:not([hidden]) .podium-tile");
    if (podiumTiles.length) {
      const springEase = typeof A.spring === "function" ? A.spring({ bounce: 0.28, duration: 560 }) : "outBack";
      A.animate(podiumTiles, {
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.95, 1],
        delay: A.stagger(80),
        ease: springEase,
        onComplete: function () {
          clearInlineTransform(podiumTiles);
        }
      });

      const medals = document.querySelectorAll("#leaderboardPodium:not([hidden]) .podium-medal");
      if (medals.length) {
        A.animate(medals, {
          scale: [0.65, 1],
          rotate: [-12, 0],
          duration: 500,
          delay: A.stagger(80, { start: 90 }),
          ease: "outBack",
          onComplete: function () {
            clearInlineTransform(medals);
          }
        });
      }
    }

    const rows = document.querySelectorAll("#leaderboardTableBody tr");
    if (rows.length) {
      A.animate(rows, {
        opacity: [0, 1],
        translateX: [-12, 0],
        duration: 360,
        delay: A.stagger(36, { start: 80 }),
        ease: "outCubic",
        onComplete: function () {
          clearInlineTransform(rows);
        }
      });
    }

    const myFooter = document.querySelector("#myStandingFooter:not([hidden])");
    if (myFooter) {
      A.animate(myFooter, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 380,
        delay: 180,
        ease: "outCubic",
        onComplete: function () {
          clearInlineTransform(myFooter);
        }
      });
    }
  }

  // ==========================================================================
  // 4. KATALOG SOALAN: Stagger Kad Semasa Muatan & Penapisan Subjek/Status
  // ==========================================================================
  function animateCatalogCards() {
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const cards = document.querySelectorAll("#catalogCardsGrid .quiz-card");
    if (!cards.length) return;

    A.remove(cards);
    A.animate(cards, {
      opacity: [0, 1],
      translateY: [16, 0],
      scale: [0.985, 1],
      duration: 380,
      delay: A.stagger(38, { start: 15 }),
      ease: "outQuart",
      onComplete: function () {
        clearInlineTransform(cards);
      }
    });
  }

  // ==========================================================================
  // 5. RUANG PEPERIKSAAN, SAMBUTAN TAMAT KUIZ & SLIP KEPUTUSAN RASMI
  // ==========================================================================
  function playExamStageOpen() {
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const stage = document.getElementById("examStage");
    const bar = document.querySelector("#examStage .exam-stage-bar");
    if (stage && !stage.hidden) {
      A.animate(stage, {
        opacity: [0, 1],
        duration: 240,
        ease: "outQuad",
        onComplete: function () {
          clearInlineTransform(stage);
        }
      });
    }
    if (bar) {
      A.animate(bar, {
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 320,
        ease: "outCubic",
        onComplete: function () {
          clearInlineTransform(bar);
        }
      });
    }
  }

  function celebrateQuizCompletion() {
    const A = getAnime();
    if (!A || prefersReducedMotion()) return;

    const slipBtn = document.getElementById("openSlipBtn");
    if (slipBtn && !slipBtn.hidden) {
      const springEase = typeof A.spring === "function" ? A.spring({ bounce: 0.42, duration: 620 }) : "outBack";
      A.animate(slipBtn, {
        scale: [0.78, 1],
        opacity: [0, 1],
        ease: springEase,
        onComplete: function () {
          clearInlineTransform(slipBtn);
        }
      });

      // Percikan partikel vektor ringan pada kompositor GPU (auto-lupus 950ms)
      const rect = slipBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const container = document.createElement("div");
      container.className = "confetti-burst-layer";
      container.setAttribute("aria-hidden", "true");

      const palette = ["#2563eb", "#059669", "#f59e0b", "#38bdf8", "#10b981"];
      const particles = [];

      for (let i = 0; i < 18; i++) {
        const dot = document.createElement("span");
        dot.className = "confetti-dot";
        dot.style.left = originX + "px";
        dot.style.top = originY + "px";
        dot.style.backgroundColor = palette[i % palette.length];
        container.appendChild(dot);
        particles.push(dot);
      }
      document.body.appendChild(container);

      A.animate(particles, {
        translateX: function () {
          return A.random(-110, 110);
        },
        translateY: function () {
          return A.random(-65, 95);
        },
        scale: [1.15, 0],
        rotate: function () {
          return A.random(-180, 180);
        },
        opacity: [1, 0],
        duration: 880,
        delay: A.stagger(18),
        ease: "outQuart",
        onComplete: function () {
          container.remove();
        }
      });
    }
  }

  function animateSlipScore(targetPct) {
    const A = getAnime();
    const scoreEl = document.getElementById("slipScorePct");
    const gradeEl = document.getElementById("slipGrade");
    if (!A || prefersReducedMotion() || !scoreEl) return;

    const endVal = Math.max(0, Math.min(100, Number(targetPct) || 0));
    const tracker = { val: 0 };
    A.animate(tracker, {
      val: endVal,
      duration: 760,
      ease: "outExpo",
      onUpdate: function () {
        scoreEl.textContent = Math.round(tracker.val) + "%";
      }
    });

    if (gradeEl) {
      A.animate(gradeEl, {
        scale: [0.7, 1],
        opacity: [0, 1],
        duration: 460,
        delay: 140,
        ease: "outBack",
        onComplete: function () {
          clearInlineTransform(gradeEl);
        }
      });
    }
  }

  function animateToastIn(el) {
    const A = getAnime();
    if (!A || prefersReducedMotion() || !el) return;
    A.remove(el);
    A.animate(el, {
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.97, 1],
      duration: 280,
      ease: "outCubic",
      onComplete: function () {
        clearInlineTransform(el);
      }
    });
  }

  // Pantau perubahan keutamaan gerakan sistem secara langsung
  if (reducedMotionQuery && typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", function (ev) {
      if (ev.matches) stopLoginAmbientOrbs();
    });
  }

  window.ETutorMotion = {
    prefersReducedMotion: prefersReducedMotion,
    playLoginEntrance: playLoginEntrance,
    stopLoginAmbientOrbs: stopLoginAmbientOrbs,
    shakeLoginAlert: shakeLoginAlert,
    playDashboardEntrance: playDashboardEntrance,
    animateProgressCounters: animateProgressCounters,
    animateLeaderboardUpdate: animateLeaderboardUpdate,
    animateCatalogCards: animateCatalogCards,
    playExamStageOpen: playExamStageOpen,
    celebrateQuizCompletion: celebrateQuizCompletion,
    animateSlipScore: animateSlipScore,
    animateToastIn: animateToastIn
  };
})();
