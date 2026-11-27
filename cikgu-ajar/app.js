(function (global) {
  const CikguAjar = (global.CikguAjar = global.CikguAjar || {});
  const T = CikguAjar.Templates;

  const XP_STORAGE_KEY = 'cikgu_ajar_xp_v1';
  const SUBJECT_ORDER = [
    'Matematik',
    'Matematik Tambahan',
    'Fizik',
    'Kimia',
    'Biologi',
    'Sains',
    'Sejarah',
    'Bahasa Melayu',
    'Bahasa Inggeris',
    'Pendidikan Islam',
    'Pendidikan Moral',
    'Geografi'
  ];

  const SUBJECT_COLORS = {
    Matematik: '#4F46E5',
    'Matematik Tambahan': '#7C3AED',
    Fizik: '#0284C7',
    Kimia: '#0D9488',
    Biologi: '#16A34A',
    Sains: '#059669',
    Sejarah: '#D97706',
    'Bahasa Melayu': '#E11D48',
    'Bahasa Inggeris': '#2563EB',
    'Pendidikan Islam': '#047857',
    'Pendidikan Moral': '#9333EA',
    Geografi: '#EA580C'
  };

  const SUBJECT_WORLD_BG = {
    Matematik: 'assets/bg/world/world-math.jpg',
    'Matematik Tambahan': 'assets/bg/world/world-math.jpg',
    Fizik: 'assets/bg/world/world-sains.jpg',
    Kimia: 'assets/bg/world/world-sains.jpg',
    Biologi: 'assets/bg/world/world-sains.jpg',
    Sains: 'assets/bg/world/world-sains.jpg',
    Sejarah: 'assets/bg/world/world-sejarah.jpg',
    'Bahasa Melayu': 'assets/bg/world/world-bm.jpg',
    'Bahasa Inggeris': 'assets/bg/world/world-bi.jpg',
    'Pendidikan Islam': 'assets/bg/world/world-pi.jpg',
    'Pendidikan Moral': 'assets/bg/world/world-pi.jpg',
    Geografi: 'assets/bg/world/world-geo.jpg'
  };

  function readSavedXP() {
    try {
      const raw = global.localStorage.getItem(XP_STORAGE_KEY);
      const n = parseInt(raw, 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function saveXP(val) {
    try {
      global.localStorage.setItem(XP_STORAGE_KEY, String(val));
    } catch (e) {}
  }

  class CikguAjarApp {
    constructor() {
      this.xp = readSavedXP();
      this.catalog = null;
      this.decksCache = {};
      this.selectedForm = 'Semua';
      this.selectedSubject = 'Semua';
      this.searchQuery = '';

      // Active deck state
      this.activeDeck = null;
      this.activeDeckMeta = null;
      this.cardIdx = 0;
      this.completedSet = new Set();
      this.srPendingSet = new Set();
      this.wrongCount = {};
      this.sandboxState = {};
      this.sandboxWon = false;

      this.els = {
        catalogView: document.getElementById('catalog-view'),
        lessonView: document.getElementById('lesson-view'),
        catalogBgImg: document.getElementById('catalog-bg-img'),
        catalogMascotHost: document.getElementById('catalog-mascot-host'),
        catalogStatsLine: document.getElementById('catalog-stats-line'),
        catalogCountBadge: document.getElementById('catalog-count-badge'),
        catalogXpVal: document.getElementById('catalog-xp-val'),
        catalogSearch: document.getElementById('catalog-search'),
        formFilters: document.getElementById('form-filters'),
        subjectFilters: document.getElementById('subject-filters'),
        catalogStatus: document.getElementById('catalog-status'),
        catalogGrid: document.getElementById('catalog-grid'),

        stageBgImg: document.getElementById('stage-bg-img'),
        btnBackCatalog: document.getElementById('btn-back-catalog'),
        topicBadge: document.getElementById('topic-badge'),
        stagePills: document.getElementById('stage-pills'),
        srBadge: document.getElementById('sr-badge'),
        xpVal: document.getElementById('xp-val'),
        btnSpeed: document.getElementById('btn-speed'),
        btnSound: document.getElementById('btn-sound'),
        btnReplay: document.getElementById('btn-replay'),

        topCard: document.getElementById('top-card'),
        mainVisualCard: document.getElementById('main-visual-card'),
        analogyCard: document.getElementById('analogy-card'),
        controlsArea: document.getElementById('controls-area')
      };

      if (this.els.catalogMascotHost) {
        this.catalogMascot = new CikguAjar.Mascot(this.els.catalogMascotHost);
        this.catalogMascot.setMood('neutral', 'front');
      }
      this.mascot = new CikguAjar.Mascot(document.getElementById('mascot-host'));
      this.engine = new CikguAjar.Engine({
        viewportEl: document.getElementById('viewport'),
        stageEl: document.getElementById('board-stage'),
        headingEl: document.getElementById('board-heading'),
        underlinePath: document.getElementById('heading-underline-path'),
        boardContentEl: document.getElementById('board-content'),
        mascotLayerEl: document.getElementById('mascot-layer'),
        subtitleWordsEl: document.getElementById('subtitle-words'),
        cameraLabelEl: document.getElementById('camera-label'),
        skipBtn: document.getElementById('btn-skip'),
        zoomInBtn: document.getElementById('btn-zoom-in'),
        zoomOutBtn: document.getElementById('btn-zoom-out'),
        zoomResetBtn: document.getElementById('btn-zoom-reset'),
        mascot: this.mascot
      });

      this._syncXpUI();
      this._bindEvents();
      this._init();
    }

    async _init() {
      await this.engine.loadCommonManifest();
      await this._loadCatalog();
      this._renderFilters();
      this._renderCatalogGrid();

      // Deep link support (#deck=matematik-t4-bab01)
      const hash = global.location.hash || '';
      const m = hash.match(/deck=([a-z0-9\-_]+)/i);
      if (m && m[1]) {
        await this.openDeck(m[1]);
      }
    }

    async _loadCatalog() {
      if (global.CIKGU_AJAR_CATALOG && Array.isArray(global.CIKGU_AJAR_CATALOG.decks)) {
        this.catalog = global.CIKGU_AJAR_CATALOG;
        return;
      }
      if (global.location && global.location.protocol === 'file:') {
        await CikguAjar.loadScriptOnce('decks/catalog.js');
        if (global.CIKGU_AJAR_CATALOG) {
          this.catalog = global.CIKGU_AJAR_CATALOG;
          return;
        }
      }
      try {
        const res = await fetch('decks/catalog.json');
        if (res.ok) {
          this.catalog = await res.json();
          return;
        }
      } catch (e) {}

      // Fallback if catalog.js wasn't loaded over HTTP
      await CikguAjar.loadScriptOnce('decks/catalog.js');
      if (global.CIKGU_AJAR_CATALOG) {
        this.catalog = global.CIKGU_AJAR_CATALOG;
      } else {
        this.catalog = { subjects: SUBJECT_ORDER, forms: ['T1', 'T2', 'T3', 'T4', 'T5'], decks: [] };
      }
    }

    async _loadDeckData(deckId) {
      if (this.decksCache[deckId]) return this.decksCache[deckId];

      const globalDecks = global.CIKGU_AJAR_DECKS || {};
      if (globalDecks[deckId]) {
        this.decksCache[deckId] = globalDecks[deckId];
        return globalDecks[deckId];
      }

      if (global.location && global.location.protocol === 'file:') {
        await CikguAjar.loadScriptOnce(`decks/${deckId}.js`);
        const loaded = (global.CIKGU_AJAR_DECKS || {})[deckId];
        if (loaded) {
          this.decksCache[deckId] = loaded;
          return loaded;
        }
      }

      try {
        const res = await fetch(`decks/${deckId}.json`);
        if (res.ok) {
          const data = await res.json();
          this.decksCache[deckId] = data;
          return data;
        }
      } catch (e) {}

      await CikguAjar.loadScriptOnce(`decks/${deckId}.js`);
      const fallback = (global.CIKGU_AJAR_DECKS || {})[deckId];
      if (fallback) {
        this.decksCache[deckId] = fallback;
        return fallback;
      }
      return null;
    }

    _bindEvents() {
      this.els.catalogSearch.addEventListener('input', (ev) => {
        this.searchQuery = (ev.target.value || '').trim().toLowerCase();
        this._renderCatalogGrid();
      });

      this.els.btnBackCatalog.addEventListener('click', () => {
        CikguAjar.SFX.play('pop');
        this.showCatalog();
      });

      this.els.btnSpeed.addEventListener('click', () => {
        const next = this.engine.playbackRate === 1.0 ? 1.25 : 1.0;
        this.engine.playbackRate = next;
        this.els.btnSpeed.textContent = `${next}×`;
        CikguAjar.SFX.play('pop');
      });

      this.els.btnSound.addEventListener('click', () => {
        const next = !this.engine.voiceEnabled;
        this.engine.voiceEnabled = next;
        CikguAjar.SFX.muted = !next;
        this.els.btnSound.classList.toggle('is-muted', !next);
        this.els.btnSound.setAttribute('aria-pressed', String(next));
        this.els.btnSound.querySelector('.sound-icon').textContent = next ? '🔊' : '🔇';
        if (!next) this.engine.cancelSequence();
        else CikguAjar.SFX.play('pop');
      });

      this.els.btnReplay.addEventListener('click', () => {
        CikguAjar.SFX.play('pop');
        this.loadCard(this.cardIdx);
      });
    }

    _syncXpUI() {
      this.els.xpVal.textContent = String(this.xp);
      this.els.catalogXpVal.textContent = String(this.xp);
    }

    _awardXP(amount) {
      this.xp += amount;
      saveXP(this.xp);
      this._syncXpUI();
      const pill = this.els.xpVal.parentElement;
      pill.classList.remove('is-pop');
      void pill.offsetWidth;
      pill.classList.add('is-pop');
    }

    /* ================= CATALOG UI ================= */
    _renderFilters() {
      const decks = (this.catalog && this.catalog.decks) || [];
      const forms = ['Semua', 'T1', 'T2', 'T3', 'T4', 'T5'];

      this.els.formFilters.innerHTML = forms
        .map((f) => {
          const active = this.selectedForm === f ? 'is-active' : '';
          const label = f === 'Semua' ? 'Semua' : `Tingkatan ${f.slice(1)}`;
          return `<button type="button" class="filter-chip ${active}" data-form="${T.esc(f)}">${T.esc(label)}</button>`;
        })
        .join('');

      this.els.formFilters.querySelectorAll('[data-form]').forEach((btn) => {
        btn.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.selectedForm = btn.getAttribute('data-form');
          this._renderFilters();
          this._renderCatalogGrid();
        });
      });

      const presentSubjects = new Set(decks.map((d) => d.subject).filter(Boolean));
      const orderedSubjects = SUBJECT_ORDER.filter((s) => presentSubjects.has(s) || !decks.length);
      presentSubjects.forEach((s) => {
        if (!orderedSubjects.includes(s)) orderedSubjects.push(s);
      });

      const subjOptions = ['Semua'].concat(orderedSubjects);
      this.els.subjectFilters.innerHTML = subjOptions
        .map((s) => {
          const active = this.selectedSubject === s ? 'is-active' : '';
          const label = s === 'Semua' ? 'Semua Subjek' : s;
          return `<button type="button" class="filter-chip ${active}" data-subject="${T.esc(s)}">${T.esc(label)}</button>`;
        })
        .join('');

      this.els.subjectFilters.querySelectorAll('[data-subject]').forEach((btn) => {
        btn.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.selectedSubject = btn.getAttribute('data-subject');
          this._renderFilters();
          this._updateCatalogBackdrop();
          this._renderCatalogGrid();
        });
      });
      this._updateCatalogBackdrop();
    }

    _updateCatalogBackdrop() {
      if (!this.els.catalogBgImg) return;
      const catalogWorld = this.catalog && this.catalog.worldBg;
      const targetBg =
        this.selectedSubject !== 'Semua'
          ? (catalogWorld && catalogWorld[this.selectedSubject]) || SUBJECT_WORLD_BG[this.selectedSubject] || 'assets/bg/world/world-math.jpg'
          : (catalogWorld && catalogWorld.Matematik) || 'assets/bg/world/world-math.jpg';
      if (this.els.catalogBgImg.getAttribute('src') !== targetBg) {
        this.els.catalogBgImg.classList.add('is-swapping');
        this.els.catalogBgImg.setAttribute('src', targetBg);
        global.setTimeout(() => {
          if (this.els.catalogBgImg) this.els.catalogBgImg.classList.remove('is-swapping');
        }, 220);
      }
    }

    _getFilteredDecks() {
      const decks = (this.catalog && this.catalog.decks) || [];
      return decks.filter((d) => {
        if (this.selectedForm !== 'Semua' && d.form !== this.selectedForm) return false;
        if (this.selectedSubject !== 'Semua' && d.subject !== this.selectedSubject) return false;
        if (this.searchQuery) {
          const hay = `${d.title || ''} ${d.shortTitle || ''} ${d.subject || ''} ${d.form || ''} bab ${d.bab || ''} ${d.summary || ''}`.toLowerCase();
          if (!hay.includes(this.searchQuery)) return false;
        }
        return true;
      });
    }

    _renderCatalogGrid() {
      const allDecks = (this.catalog && this.catalog.decks) || [];
      const filtered = this._getFilteredDecks();
      const idxDecks = new Set((this.engine.audioIndex && this.engine.audioIndex.decks) || []);
      const totalCards = allDecks.reduce((acc, d) => acc + (Number(d.cardCount) || 4), 0);

      this.els.catalogCountBadge.textContent = `${allDecks.length} Bab KSSM`;
      if (this.els.catalogStatsLine) {
        this.els.catalogStatsLine.textContent = `${allDecks.length} Bab KSSM · ${totalCards} Kad Interaktif · 100% Suara BM`;
      }
      this.els.catalogStatus.textContent =
        filtered.length === allDecks.length
          ? `Menunjukkan kesemua ${allDecks.length} bab interaktif`
          : `Menunjukkan ${filtered.length} daripada ${allDecks.length} bab`;

      if (!filtered.length) {
        this.els.catalogGrid.innerHTML = `
          <div class="empty-catalog sketch-card">
            <h3>Tiada bab ditemui</h3>
            <p>Cuba ubah penapis Tingkatan, Subjek atau kata kunci carian.</p>
          </div>
        `;
        return;
      }

      this.els.catalogGrid.innerHTML = filtered
        .map((d) => {
          const subjColor = SUBJECT_COLORS[d.subject] || '#4F46E5';
          const hasAudio = Boolean(d.hasCustomAudio || idxDecks.has(d.deckId));
          const audioBadge = hasAudio
            ? '<span class="deck-badge is-audio">🎙️ Suara Penuh</span>'
            : '<span class="deck-badge is-common-audio">🔊 Audio Pintar</span>';
          const tmpls = Array.isArray(d.templates) ? d.templates.slice(0, 2).join(' · ') : '';
          const thumbSrc = d.thumbnail || `assets/thumbs/${d.deckId}.svg`;
          const bgStrip = d.bgPhoto || SUBJECT_WORLD_BG[d.subject] || 'assets/bg/world/world-math.jpg';
          return `
            <article class="deck-card sketch-card" data-deck-id="${T.esc(d.deckId)}">
              <div class="deck-thumb-wrap">
                <img class="deck-thumb-strip" loading="lazy" src="${T.esc(bgStrip)}" alt="" aria-hidden="true" />
                <img class="deck-thumb-img" loading="lazy" src="${T.esc(thumbSrc)}" alt="${T.esc(d.title || d.shortTitle || d.deckId)}" />
                <div class="deck-thumb-overlay">
                  ${audioBadge}
                </div>
              </div>
              <div class="deck-card-body">
                <div class="deck-badges">
                  <span class="deck-badge is-subj" style="background:${subjColor}18;color:${subjColor};border-color:${subjColor}44">${T.esc(d.subject || '')}</span>
                  ${d.bab ? `<span class="deck-badge is-bab">Bab ${T.esc(d.bab)}</span>` : ''}
                </div>
                <h2 class="deck-card-title">${T.esc(d.title || d.shortTitle || d.deckId)}</h2>
                <p class="deck-card-summary">${T.esc(d.summary || 'Kad kilat interaktif dengan penerangan papan putih Cikgu AI.')}</p>
                <div class="deck-card-footer">
                  <span class="deck-meta">${T.esc(d.cardCount || 4)} Kad${tmpls ? ` · ${T.esc(tmpls)}` : ''}</span>
                  <button type="button" class="primary-btn deck-launch-btn" data-launch="${T.esc(d.deckId)}">Mula Belajar →</button>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      this.els.catalogGrid.querySelectorAll('[data-launch]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          CikguAjar.SFX.play('pop');
          this.openDeck(btn.getAttribute('data-launch'));
        });
      });

      this.els.catalogGrid.querySelectorAll('.deck-card').forEach((card) => {
        card.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.openDeck(card.getAttribute('data-deck-id'));
        });
      });
    }

    showCatalog() {
      this.engine.cancelSequence();
      this.els.lessonView.classList.add('is-hidden');
      this.els.catalogView.classList.remove('is-hidden');
      if (global.history && global.history.replaceState) {
        global.history.replaceState(null, '', '#');
      }
    }

    async openDeck(deckId) {
      const meta = ((this.catalog && this.catalog.decks) || []).find((d) => d.deckId === deckId) || { deckId };
      const deck = await this._loadDeckData(deckId);
      if (!deck || !Array.isArray(deck.cards) || !deck.cards.length) {
        this.els.catalogStatus.textContent = `Dek "${deckId}" gagal dimuatkan.`;
        return;
      }

      this.activeDeck = deck;
      this.activeDeckMeta = meta;
      this.cardIdx = 0;
      this.completedSet = new Set();
      this.srPendingSet = new Set();
      this.wrongCount = {};
      this.sandboxState = {};
      this.sandboxWon = false;

      const hasAudio = Boolean(meta.hasCustomAudio || deck.hasCustomAudio);
      await this.engine.loadDeckManifest(deckId, hasAudio);

      if (this.els.stageBgImg) {
        const bgUrl =
          meta.bgPhoto ||
          deck.bgPhoto ||
          SUBJECT_WORLD_BG[deck.subject || meta.subject] ||
          'assets/bg/world/world-math.jpg';
        this.els.stageBgImg.setAttribute('src', bgUrl);
      }

      const formLabel = deck.form || meta.form || '';
      const babLabel = deck.bab || meta.bab ? `Bab ${deck.bab || meta.bab}` : '';
      this.els.topicBadge.textContent = [deck.subject || meta.subject, formLabel, babLabel].filter(Boolean).join(' · ');

      this._buildStagePills();
      this.els.catalogView.classList.add('is-hidden');
      this.els.lessonView.classList.remove('is-hidden');
      if (global.history && global.history.replaceState) {
        global.history.replaceState(null, '', `#deck=${encodeURIComponent(deckId)}`);
      }

      this.loadCard(0);
    }

    /* ================= LESSON LOOP ================= */
    _buildStagePills() {
      const cards = (this.activeDeck && this.activeDeck.cards) || [];
      this.els.stagePills.innerHTML = cards
        .map(
          (c, i) => `
          <button class="stage-pill ${i === 0 ? 'is-active' : ''}" data-stage="${i}" type="button">
            <span class="pill-num">${i + 1}</span>
            <span class="pill-label">${T.esc(c.pillLabel || `Kad ${i + 1}`)}</span>
          </button>
        `
        )
        .join('');

      this.els.stagePills.querySelectorAll('.stage-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.loadCard(Number(pill.getAttribute('data-stage')));
        });
      });
    }

    _updateHeaderState() {
      this.els.stagePills.querySelectorAll('.stage-pill').forEach((pill, i) => {
        pill.classList.toggle('is-active', i === this.cardIdx);
        pill.classList.toggle('is-done', this.completedSet.has(i));
      });
      this.els.srBadge.classList.toggle('is-hidden', this.srPendingSet.size === 0);
    }

    _getCardBoard(card, patch) {
      return T.mergeBoard(card.board || {}, patch);
    }

    loadCard(idx, isSrRetry = false) {
      const cards = (this.activeDeck && this.activeDeck.cards) || [];
      if (idx < 0 || idx >= cards.length) return;

      this.cardIdx = idx;
      if (isSrRetry) {
        this.wrongCount[idx] = 0;
      }
      this._updateHeaderState();
      this.engine.cancelSequence();
      this.engine.setSpotlight(false);
      this.engine.focusCamera('overview');

      const card = cards[idx];
      T.hideAnalogy(this.els.analogyCard);

      if (card.mode === 'sandbox' && card.sandbox) {
        this._initSandboxCard(card, idx);
      } else {
        this._initMcqCard(card, idx);
      }
    }

    /* ================= SANDBOX CARD (GRAPH-SLIDER) ================= */
    _initSandboxCard(card, idx) {
      const sb = card.sandbox;
      this.sandboxState = {
        a: sb.initialA !== undefined ? sb.initialA : 1,
        c: sb.initialC !== undefined ? sb.initialC : -1
      };
      this.sandboxWon = false;

      this._renderSandboxBoard(card);
      this._renderSandboxControls(card, idx);

      if (card.board && card.board.analogy) {
        T.showAnalogy(this.els.analogyCard, card.board.analogy);
      }

      const intro = card.intro || {};
      this.engine.playSequence([
        {
          heading: card.heading || `Kad ${idx + 1}`,
          underlineColor: card.underlineColor || '#4F46E5',
          mood: intro.mood || 'explaining',
          lookAt: intro.lookAt || 'board',
          camera: intro.camera || 'overview',
          audioId: intro.audioId,
          text: intro.text || intro.spokenText || ''
        }
      ]);
    }

    _renderSandboxBoard(card) {
      const a = this.sandboxState.a;
      const c = this.sandboxState.c;
      const cStr = c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`;
      const aTone = a === 0 ? 'coral' : a > 0 ? 'teal' : 'orange';
      const x2Tone = a === 0 ? 'dim' : null;
      const curveColor = a === 0 ? '#F43F5E' : a > 0 ? '#0D9488' : '#F97316';

      const board = this._getCardBoard(card, {
        equation: {
          prefix: 'f(x) =',
          terms: [
            { text: String(a), highlight: aTone },
            { text: 'x²', highlight: x2Tone },
            { text: cStr, highlight: 'teal' }
          ],
          promptPill: (card.board && card.board.equation && card.board.equation.promptPill) || 'Seret a & c untuk uji graf'
        },
        graph: {
          curves: [{ a, b: 0, c, color: curveColor, dashed: a === 0 }],
          showVertex: a !== 0,
          showIntercept: c,
          elevatorC: c
        }
      });

      T.renderCardBoard('graph-slider', this.els, board, { revealed: true });
    }

    _checkRule(rule) {
      if (!rule) return false;
      const val = this.sandboxState[rule.param];
      if (rule.op === '>=') return val >= rule.value;
      if (rule.op === '<=') return val <= rule.value;
      if (rule.op === '>') return val > rule.value;
      if (rule.op === '<') return val < rule.value;
      return val === rule.value;
    }

    _renderSandboxControls(card, idx) {
      const sb = card.sandbox;
      const sliders = sb.sliders || [
        { key: 'a', label: 'a', min: -3, max: 3, step: 0.5 },
        { key: 'c', label: 'c', min: -4, max: 4, step: 1 }
      ];
      const missions = sb.missions || [];
      const allMet = missions.length > 0 && missions.every((m) => this._checkRule(m.rule));

      const slidersHtml = sliders
        .map((sl) => {
          const val = this.sandboxState[sl.key];
          const disp = sl.key === 'c' && val >= 0 ? `+${val}` : String(val);
          return `
            <label class="slider-group">
              <span class="slider-label">${T.esc(sl.label)} = <span id="val-${T.esc(sl.key)}">${T.esc(disp)}</span></span>
              <input id="slider-${T.esc(sl.key)}" class="slider-input" type="range" min="${sl.min}" max="${sl.max}" step="${sl.step}" value="${val}" />
            </label>
          `;
        })
        .join('');

      const missionsHtml = missions
        .map((m) => {
          const met = this._checkRule(m.rule);
          return `<span id="chip-${T.esc(m.id)}" class="check-chip ${met ? 'is-met' : ''}">${T.esc(m.label)}</span>`;
        })
        .join('');

      this.els.controlsArea.innerHTML = `
        <div class="sandbox-dock">
          <div class="sliders-wrap">${slidersHtml}</div>
          <div id="sb-mission" class="mission-strip ${allMet ? 'is-complete' : ''}">
            <span>Misi:</span>
            ${missionsHtml}
          </div>
          <button id="sb-next-btn" type="button" class="primary-btn">Kad Seterusnya →</button>
        </div>
      `;

      sliders.forEach((sl) => {
        const input = document.getElementById(`slider-${sl.key}`);
        const valSpan = document.getElementById(`val-${sl.key}`);
        input.addEventListener('input', () => {
          const prevVal = this.sandboxState[sl.key];
          const nextVal = sl.step < 1 ? parseFloat(input.value) : parseInt(input.value, 10);
          this.sandboxState[sl.key] = nextVal;
          valSpan.textContent = sl.key === 'c' && nextVal >= 0 ? `+${nextVal}` : String(nextVal);
          this._renderSandboxBoard(card);

          const metAll = missions.length > 0 && missions.every((m) => this._checkRule(m.rule));
          missions.forEach((m) => {
            const chip = document.getElementById(`chip-${m.id}`);
            if (chip) chip.classList.toggle('is-met', this._checkRule(m.rule));
          });
          const strip = document.getElementById('sb-mission');
          if (strip) strip.classList.toggle('is-complete', metAll);

          if (metAll && !this.sandboxWon) {
            this.sandboxWon = true;
            if (!this.completedSet.has(idx)) {
              this.completedSet.add(idx);
              this._awardXP(10);
            }
            this._updateHeaderState();
            const win = card.win || {};
            this.engine.playSequence([
              {
                heading: win.heading || 'Misi Berjaya! +10 XP',
                underlineColor: win.underlineColor || '#0D9488',
                mood: win.mood || 'celebrating',
                lookAt: 'front',
                sfx: win.sfx || 'xp',
                audioId: win.audioId || 'fast_win_2',
                fallbackAudioId: 'fast_win_2',
                text: win.text || 'Cantik! Pemeriksa pun senyum tengok jawapan ni.'
              }
            ]);
            return;
          }

          if (sb.zeroTrigger && sl.key === sb.zeroTrigger.param && nextVal === sb.zeroTrigger.value && prevVal !== sb.zeroTrigger.value) {
            this.engine.playInstantClip(
              sb.zeroTrigger.audioId,
              sb.zeroTrigger.text,
              sb.zeroTrigger.mood || 'shocked',
              sb.zeroTrigger.sfx || 'boing'
            );
          } else if (sl.key === 'c') {
            CikguAjar.SFX.play('pop');
            this.mascot.setMood('explaining', 'board');
          }
        });
      });

      document.getElementById('sb-next-btn').addEventListener('click', () => {
        CikguAjar.SFX.play('pop');
        this._advanceAfter(idx);
      });
    }

    /* ================= MCQ CARD ================= */
    _initMcqCard(card, idx) {
      T.renderCardBoard(card.template, this.els, this._getCardBoard(card), { revealed: false });
      if (card.board && card.board.analogy && card.board.showInitialAnalogy) {
        T.showAnalogy(this.els.analogyCard, card.board.analogy);
      }
      this._renderMcqButtons(card, idx, {});

      const intro = card.intro || {};
      this.engine.playSequence([
        {
          heading: card.heading || `Kad ${idx + 1}`,
          underlineColor: card.underlineColor || '#4F46E5',
          mood: intro.mood || 'thinking',
          lookAt: intro.lookAt || 'board',
          camera: intro.camera || 'overview',
          audioId: intro.audioId,
          text: intro.text || intro.spokenText || ''
        }
      ]);
    }

    _renderMcqButtons(card, idx, opts) {
      const choices = card.choices || [];
      const cards = (this.activeDeck && this.activeDeck.cards) || [];
      const isLast = idx >= cards.length - 1;
      const monoStyle = card.template === 'graph-slider' && idx === cards.length - 1;

      this.els.controlsArea.innerHTML = '';

      choices.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        if (monoStyle) btn.style.fontFamily = 'var(--font-mono)';
        btn.textContent = c.label;
        if (opts.solved && c.correct) btn.classList.add('is-correct');
        if (opts.wrongId === c.id) btn.classList.add('is-wrong');
        btn.disabled = Boolean(opts.locked);
        btn.addEventListener('click', () => this._handleChoice(card, idx, c));
        this.els.controlsArea.appendChild(btn);
      });

      if (opts.solved) {
        if (!isLast) {
          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'primary-btn';
          nextBtn.textContent = idx === cards.length - 2 ? 'Kad Terakhir →' : 'Kad Seterusnya →';
          nextBtn.addEventListener('click', () => {
            CikguAjar.SFX.play('pop');
            this._advanceAfter(idx);
          });
          this.els.controlsArea.appendChild(nextBtn);
        } else {
          const retryIdx = Array.from(this.srPendingSet).find((id) => id !== idx) ?? Array.from(this.srPendingSet)[0];
          if (retryIdx !== undefined) {
            const revBtn = document.createElement('button');
            revBtn.type = 'button';
            revBtn.className = 'ghost-btn';
            revBtn.textContent = `Ulang Kad Silap (Kad ${retryIdx + 1}) ↻`;
            revBtn.addEventListener('click', () => {
              CikguAjar.SFX.play('pop');
              this.loadCard(retryIdx, true);
            });
            this.els.controlsArea.appendChild(revBtn);
          }

          const againBtn = document.createElement('button');
          againBtn.type = 'button';
          againBtn.className = 'primary-btn';
          againBtn.textContent = '↺ Ulang Dek';
          againBtn.addEventListener('click', () => {
            CikguAjar.SFX.play('pop');
            this.loadCard(0);
          });
          this.els.controlsArea.appendChild(againBtn);

          const backBtn = document.createElement('button');
          backBtn.type = 'button';
          backBtn.className = 'choice-btn';
          backBtn.textContent = '← Katalog';
          backBtn.addEventListener('click', () => {
            CikguAjar.SFX.play('pop');
            this.showCatalog();
          });
          this.els.controlsArea.appendChild(backBtn);
        }
      }
    }

    _advanceAfter(idx) {
      const cards = (this.activeDeck && this.activeDeck.cards) || [];
      const next = idx + 1;
      if (next < cards.length) {
        this.loadCard(next);
      } else {
        const retryId = Array.from(this.srPendingSet)[0];
        if (retryId !== undefined) this.loadCard(retryId, true);
        else this.showCatalog();
      }
    }

    _handleChoice(card, idx, choice) {
      const cards = (this.activeDeck && this.activeDeck.cards) || [];
      const isLast = idx >= cards.length - 1;

      if (choice.correct) {
        const firstTryClean = (this.wrongCount[idx] || 0) === 0;
        if (!this.completedSet.has(idx)) {
          this.completedSet.add(idx);
          this._awardXP(10);
        }
        if (firstTryClean && this.srPendingSet.has(idx)) {
          this.srPendingSet.delete(idx);
        }
        this._updateHeaderState();
        this._renderMcqButtons(card, idx, { locked: true, solved: true });

        const win = card.win || {};
        const fallbackWinId = isLast ? 'fast_win_3' : `fast_win_${(idx % 2) + 1}`;
        const defaultWinText = isLast
          ? 'Padu habis! Bab ini beres. Tambah sepuluh XP!'
          : 'Padu! Tambah sepuluh XP. Jom kad seterusnya!';

        this.engine.playSequence(
          [
            {
              heading: win.heading || 'Padu! +10 XP',
              underlineColor: win.underlineColor || '#0D9488',
              mood: win.mood || 'celebrating',
              lookAt: 'front',
              camera: 'overview',
              sfx: win.sfx || (isLast ? 'chime' : 'xp'),
              audioId: win.audioId || fallbackWinId,
              fallbackAudioId: fallbackWinId,
              text: win.text || defaultWinText,
              onEnter: () => {
                T.renderCardBoard(card.template, this.els, this._getCardBoard(card, win.boardPatch), { revealed: true });
                if (win.analogy) {
                  T.showAnalogy(this.els.analogyCard, win.analogy);
                } else if (isLast && this.activeDeck && this.activeDeck.mastery) {
                  T.showAnalogy(this.els.analogyCard, {
                    tag: this.activeDeck.mastery.tag || 'Kad Rumus SPM',
                    title: this.activeDeck.mastery.title || 'Rumusan Bab',
                    desc: this.activeDeck.mastery.desc || '',
                    svgType: 'mastery'
                  });
                }
              }
            }
          ],
          () => {
            this.mascot.setMood('celebrating', 'front');
            this._renderMcqButtons(card, idx, { solved: true });
          }
        );
        return;
      }

      // Wrong answer path -> schedule spaced repetition
      this.wrongCount[idx] = (this.wrongCount[idx] || 0) + 1;
      this.srPendingSet.add(idx);
      this._updateHeaderState();

      // 2nd+ mistake -> Calm (lightbulb) reassuring mode
      if (this.wrongCount[idx] >= 2) {
        this._renderMcqButtons(card, idx, { locked: true, wrongId: choice.id });
        const calm = card.calmHint || {};
        const fallbackCalmId = `calm_hint_${(idx % 2) + 1}`;
        this.engine.playSequence(
          [
            {
              heading: calm.heading || 'Jom Semak Perlahan-lahan',
              underlineColor: calm.underlineColor || '#0D9488',
              mood: 'calm',
              lookAt: 'front',
              camera: 'overview',
              sfx: calm.sfx || 'chalk',
              audioId: calm.audioId || fallbackCalmId,
              fallbackAudioId: fallbackCalmId,
              text:
                calm.text ||
                'Tak apa geng, ramai calon keliru kat sini. Cuba semak kata kunci pada papan dan bandingkan semula pilihan.',
              onEnter: () => {
                if (calm.boardPatch) {
                  T.renderCardBoard(card.template, this.els, this._getCardBoard(card, calm.boardPatch), { revealed: false });
                }
                if (calm.analogy) {
                  T.showAnalogy(this.els.analogyCard, calm.analogy);
                }
              }
            }
          ],
          () => this._renderMcqButtons(card, idx, { wrongId: choice.id }),
          { skippable: true }
        );
        return;
      }

      // 1st mistake -> Reactive whiteboard sequence (shocked -> deadpan -> explaining)
      this._renderMcqButtons(card, idx, { locked: true, wrongId: choice.id });
      const seq = Array.isArray(choice.wrongSequence) && choice.wrongSequence.length
        ? choice.wrongSequence
        : this._buildFallbackWrongSequence(card, choice);

      const beats = seq.map((step, bIdx) => ({
        heading: step.heading || (bIdx === 0 ? 'EH KEJAP?!' : 'Semak Konsep Betul'),
        underlineColor: step.underlineColor || (bIdx === 0 ? '#F97316' : bIdx === 1 ? '#F43F5E' : '#0D9488'),
        mood: step.mood || (bIdx === 0 ? 'shocked' : bIdx === 1 ? 'deadpan' : 'explaining'),
        lookAt: step.lookAt || (step.dimBoard ? 'front' : 'board'),
        camera: step.camera || (step.dimBoard ? 'mascot-spotlight' : 'overview'),
        dimBoard: Boolean(step.dimBoard),
        sfx: step.sfx || (bIdx === 0 ? 'boing' : bIdx === seq.length - 1 ? 'chalk' : null),
        audioId: step.audioId || (bIdx === 0 ? 'trap_react_1' : 'trap_react_2'),
        fallbackAudioId: bIdx === 0 ? 'trap_react_1' : 'trap_react_2',
        text: step.text || step.spokenText || '',
        onEnter: () => {
          if (step.boardPatch) {
            T.renderCardBoard(card.template, this.els, this._getCardBoard(card, step.boardPatch), {
              revealed: Boolean(step.revealBoard)
            });
          }
          if (step.analogy) {
            T.showAnalogy(this.els.analogyCard, step.analogy);
          } else if (step.hideAnalogy) {
            T.hideAnalogy(this.els.analogyCard);
          }
        }
      }));

      this.engine.playSequence(
        beats,
        () => {
          this.engine.setSpotlight(false);
          this.engine.focusCamera('overview');
          this._renderMcqButtons(card, idx, { wrongId: choice.id });
        },
        { skippable: true }
      );
    }

    _buildFallbackWrongSequence(card, choice) {
      const analogy = (card.win && card.win.analogy) || (card.board && card.board.analogy) || {
        tag: 'Awas Perangkap!',
        title: 'Elak Kesilapan Lazim',
        desc: 'Semak fakta teras di papan sebelum pilih semula.',
        svgType: 'trap'
      };
      return [
        {
          heading: 'EH KEJAP?!',
          underlineColor: '#F97316',
          mood: 'shocked',
          lookAt: 'board',
          camera: 'equation',
          sfx: 'boing',
          audioId: 'trap_react_1',
          text: `Eh kejap! "${choice.label}" tu perangkap klasik peperiksaan!`
        },
        {
          heading: 'Jom Betulkan Konsep',
          underlineColor: '#0D9488',
          mood: 'explaining',
          lookAt: 'front',
          camera: 'mascot-spotlight',
          dimBoard: true,
          sfx: 'chalk',
          audioId: 'trap_react_2',
          text: (card.calmHint && card.calmHint.text) || 'Lihat semula papan putih dan kenal pasti petunjuk utama. Cuba lagi!',
          analogy
        }
      ];
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    CikguAjar.app = new CikguAjarApp();
  });
})(window);
