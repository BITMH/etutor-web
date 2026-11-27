(function (global) {
  const CikguAjar = (global.CikguAjar = global.CikguAjar || {});

  const CAMERA_PRESETS = {
    overview: { scale: 1, x: 0, y: 0, label: '100% · Papan Utama' },
    equation: { scale: 1.08, x: -10, y: 22, label: '108% · Fokus Konsep' },
    graph: { scale: 1.07, x: 8, y: 16, label: '107% · Fokus Visual' },
    'mascot-spotlight': { scale: 1.1, x: -18, y: -6, label: '110% · Cikgu Ajar' }
  };

  function loadScriptOnce(src) {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
      if (existing) {
        resolve(true);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-dynamic-src', src);
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  class BoardEngine {
    constructor(opts) {
      this.viewportEl = opts.viewportEl;
      this.stageEl = opts.stageEl;
      this.headingEl = opts.headingEl;
      this.underlinePath = opts.underlinePath;
      this.boardContentEl = opts.boardContentEl;
      this.mascotLayerEl = opts.mascotLayerEl;
      this.subtitleWordsEl = opts.subtitleWordsEl;
      this.cameraLabelEl = opts.cameraLabelEl;
      this.skipBtn = opts.skipBtn;
      this.mascot = opts.mascot;

      this.voiceEnabled = true;
      this.playbackRate = 1.0;
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;

      this.seqToken = 0;
      this.activeTimers = [];
      this.activeAudio = null;
      this.rafId = null;
      this.analyser = null;
      this.analyserData = null;
      this.audioCtx = null;

      this.isPanning = false;
      this.dragStart = { x: 0, y: 0 };

      this.commonClips = {};
      this.deckClips = {};
      this.loadedDeckManifests = new Set();
      this.audioIndex = null;
      this.commonReady = false;

      this._bindCanvasControls(opts);
    }

    async loadAudioIndex() {
      if (this.audioIndex) return this.audioIndex;
      if (global.CIKGU_AJAR_AUDIO_INDEX) {
        this.audioIndex = global.CIKGU_AJAR_AUDIO_INDEX;
        return this.audioIndex;
      }
      if (global.location && global.location.protocol === 'file:') {
        await loadScriptOnce('audio/audio-index.js');
        this.audioIndex = global.CIKGU_AJAR_AUDIO_INDEX || { hasCommon: false, decks: [] };
        return this.audioIndex;
      }
      try {
        const res = await fetch('audio/audio-index.json');
        if (res.ok) {
          this.audioIndex = await res.json();
          global.CIKGU_AJAR_AUDIO_INDEX = this.audioIndex;
          return this.audioIndex;
        }
      } catch (e) {}
      this.audioIndex = { hasCommon: false, decks: [] };
      return this.audioIndex;
    }

    async loadCommonManifest() {
      if (this.commonReady) return;
      const idx = await this.loadAudioIndex();
      if (global.CIKGU_AJAR_COMMON_AUDIO && global.CIKGU_AJAR_COMMON_AUDIO.clips) {
        this.commonClips = Object.assign({}, global.CIKGU_AJAR_COMMON_AUDIO.clips);
        this.commonReady = true;
        return;
      }
      if (!idx || !idx.hasCommon) {
        this.commonReady = true;
        return;
      }
      if (global.location && global.location.protocol === 'file:') {
        await loadScriptOnce('audio/common/manifest.js');
        if (global.CIKGU_AJAR_COMMON_AUDIO && global.CIKGU_AJAR_COMMON_AUDIO.clips) {
          this.commonClips = Object.assign({}, global.CIKGU_AJAR_COMMON_AUDIO.clips);
        }
        this.commonReady = true;
        return;
      }
      try {
        const res = await fetch('audio/common/manifest.json');
        if (res.ok) {
          const data = await res.json();
          if (data && data.clips) {
            this.commonClips = Object.assign({}, data.clips);
          }
        }
      } catch (e) {}
      this.commonReady = true;
    }

    async loadDeckManifest(deckId, hasCustomAudio) {
      await this.loadCommonManifest();
      this.deckClips = {};
      if (!deckId) return;

      const globalDeckMap = global.CIKGU_AJAR_DECK_AUDIO || {};
      if (globalDeckMap[deckId] && globalDeckMap[deckId].clips) {
        this.deckClips = Object.assign({}, globalDeckMap[deckId].clips);
        return;
      }

      const idxData = this.audioIndex || global.CIKGU_AJAR_AUDIO_INDEX;
      const inIndex = idxData && Array.isArray(idxData.decks) && idxData.decks.includes(deckId);
      if (!inIndex && !hasCustomAudio) {
        return;
      }
      if (idxData && Array.isArray(idxData.decks) && !inIndex) {
        return;
      }

      if (global.location && global.location.protocol === 'file:') {
        await loadScriptOnce(`audio/${deckId}/manifest.js`);
        const afterMap = global.CIKGU_AJAR_DECK_AUDIO || {};
        if (afterMap[deckId] && afterMap[deckId].clips) {
          this.deckClips = Object.assign({}, afterMap[deckId].clips);
        } else if (global.CIKGU_AJAR_AUDIO && global.CIKGU_AJAR_AUDIO.clips) {
          this.deckClips = Object.assign({}, global.CIKGU_AJAR_AUDIO.clips);
        }
        return;
      }

      if (this.loadedDeckManifests.has(deckId) && globalDeckMap[deckId]) {
        this.deckClips = Object.assign({}, globalDeckMap[deckId].clips);
        return;
      }

      try {
        const res = await fetch(`audio/${deckId}/manifest.json`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.clips) {
            global.CIKGU_AJAR_DECK_AUDIO = global.CIKGU_AJAR_DECK_AUDIO || {};
            global.CIKGU_AJAR_DECK_AUDIO[deckId] = data;
            this.loadedDeckManifests.add(deckId);
            this.deckClips = Object.assign({}, data.clips);
          }
        }
      } catch (e) {}
    }

    getClipMeta(audioId, fallbackAudioId) {
      if (audioId && this.deckClips[audioId]) return this.deckClips[audioId];
      if (audioId && this.commonClips[audioId]) return this.commonClips[audioId];
      if (fallbackAudioId && this.deckClips[fallbackAudioId]) return this.deckClips[fallbackAudioId];
      if (fallbackAudioId && this.commonClips[fallbackAudioId]) return this.commonClips[fallbackAudioId];
      return null;
    }

    _bindCanvasControls(opts) {
      if (opts.zoomInBtn) {
        opts.zoomInBtn.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.setCameraTransform(Math.min(1.8, this.zoom + 0.15), this.panX, this.panY, 'Zum Manual');
        });
      }
      if (opts.zoomOutBtn) {
        opts.zoomOutBtn.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.setCameraTransform(Math.max(0.65, this.zoom - 0.15), this.panX, this.panY, 'Zum Manual');
        });
      }
      if (opts.zoomResetBtn) {
        opts.zoomResetBtn.addEventListener('click', () => {
          CikguAjar.SFX.play('pop');
          this.focusCamera('overview');
        });
      }

      this.viewportEl.addEventListener(
        'wheel',
        (ev) => {
          ev.preventDefault();
          const delta = ev.deltaY < 0 ? 0.1 : -0.1;
          const nextZoom = Math.min(1.8, Math.max(0.65, +(this.zoom + delta).toFixed(2)));
          this.setCameraTransform(nextZoom, this.panX, this.panY, 'Paparan Bebas');
        },
        { passive: false }
      );

      this.viewportEl.addEventListener('pointerdown', (ev) => {
        if (ev.target.closest('button, input, label, select, .bottom-dock, .wb-toolbar, .top-bar')) return;
        this.isPanning = true;
        this.viewportEl.classList.add('is-panning');
        this.dragStart = { x: ev.clientX - this.panX, y: ev.clientY - this.panY };
      });

      global.addEventListener('pointermove', (ev) => {
        if (!this.isPanning) return;
        this.panX = ev.clientX - this.dragStart.x;
        this.panY = ev.clientY - this.dragStart.y;
        this._applyTransform('Seret');
      });

      global.addEventListener('pointerup', () => {
        if (!this.isPanning) return;
        this.isPanning = false;
        this.viewportEl.classList.remove('is-panning');
      });
    }

    setCameraTransform(scale, x, y, labelOverride) {
      this.zoom = Math.min(1.8, Math.max(0.65, scale));
      this.panX = x;
      this.panY = y;
      this._applyTransform(labelOverride);
    }

    focusCamera(presetName) {
      const isNarrow = global.innerWidth <= 640;
      const p = CAMERA_PRESETS[presetName] || CAMERA_PRESETS.overview;
      const scale = isNarrow && p.scale > 1 ? 1.02 : p.scale;
      const x = isNarrow ? 0 : p.x;
      const y = isNarrow ? 0 : p.y;
      this.zoom = scale;
      this.panX = x;
      this.panY = y;
      this._applyTransform(p.label);
    }

    _applyTransform(labelText) {
      this.stageEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
      if (this.cameraLabelEl) {
        const pct = Math.round(this.zoom * 100);
        this.cameraLabelEl.textContent = labelText && labelText.includes('%') ? labelText : `${pct}% · ${labelText || ''}`;
      }
    }

    setHeading(text, underlineColor) {
      if (text !== undefined && text !== null) {
        this.headingEl.textContent = text;
        this.headingEl.classList.remove('is-slam');
        void this.headingEl.offsetWidth;
        this.headingEl.classList.add('is-slam');
      }
      if (underlineColor) {
        this.underlinePath.setAttribute('stroke', underlineColor);
      }
      this.underlinePath.classList.remove('is-drawing');
      void this.underlinePath.offsetWidth;
      this.underlinePath.classList.add('is-drawing');
    }

    setSpotlight(dimBoard) {
      this.boardContentEl.classList.toggle('is-dimmed', Boolean(dimBoard));
      this.mascotLayerEl.classList.toggle('is-spotlight', Boolean(dimBoard));
    }

    _stopAudioAndRaf() {
      if (this.rafId) {
        global.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.activeAudio) {
        try {
          this.activeAudio.pause();
          this.activeAudio.src = '';
        } catch (e) {}
        this.activeAudio = null;
      }
    }

    cancelSequence() {
      this.seqToken += 1;
      this.activeTimers.forEach((t) => global.clearTimeout(t));
      this.activeTimers = [];
      this._stopAudioAndRaf();
      this.mascot.stopTalking();
      if (this.skipBtn) this.skipBtn.classList.add('is-hidden');
    }

    _renderWords(text) {
      const words = (text || '').trim().split(/\s+/).filter(Boolean);
      this.subtitleWordsEl.innerHTML = '';
      const spans = words.map((w) => {
        const span = document.createElement('span');
        span.className = 'sub-word';
        span.textContent = w;
        this.subtitleWordsEl.appendChild(span);
        return span;
      });
      return { words, spans };
    }

    _highlightWordIndex(spans, idx) {
      spans.forEach((el, i) => {
        el.classList.toggle('is-active', i === idx);
        el.classList.toggle('is-spoken', i <= idx);
      });
    }

    _resolveAudioUrl(filePath) {
      if (!filePath) return '';
      if (/^https?:\/\//i.test(filePath)) return filePath;
      const base = (global.CIKGU_AJAR_AUDIO_BASE_URL || '').trim();
      if (!base) return filePath;
      return `${base.replace(/\/+$/, '')}/${filePath.replace(/^\/+/, '')}`;
    }

    _isCrossOriginUrl(url) {
      if (!url) return false;
      try {
        const parsed = new URL(url, global.location && global.location.href ? global.location.href : 'http://localhost/');
        return Boolean(global.location && global.location.origin && parsed.origin !== global.location.origin);
      } catch (e) {
        return /^https?:\/\//i.test(url);
      }
    }

    _ensureAudioAnalyser(audioEl) {
      try {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return false;
        if (!this.audioCtx) this.audioCtx = new AudioCtx();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
        const src = this.audioCtx.createMediaElementSource(audioEl);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);
        src.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        return true;
      } catch (e) {
        this.analyser = null;
        return false;
      }
    }

    _sampleRMS() {
      if (!this.analyser || !this.analyserData) return 0;
      this.analyser.getByteTimeDomainData(this.analyserData);
      let sum = 0;
      for (let i = 0; i < this.analyserData.length; i++) {
        const v = (this.analyserData[i] - 128) / 128;
        sum += v * v;
      }
      return Math.sqrt(sum / this.analyserData.length);
    }

    playSequence(beats, onComplete, opts = {}) {
      this.cancelSequence();
      const token = this.seqToken;
      let index = 0;

      if (this.skipBtn) {
        this.skipBtn.classList.toggle('is-hidden', !opts.skippable);
        this.skipBtn.onclick = () => {
          CikguAjar.SFX.play('pop');
          const lastBeat = beats[beats.length - 1];
          this.cancelSequence();
          if (lastBeat && typeof lastBeat.onEnter === 'function') lastBeat.onEnter(this);
          this.setSpotlight(false);
          this.focusCamera('overview');
          if (typeof onComplete === 'function') onComplete();
        };
      }

      const runNext = () => {
        if (token !== this.seqToken) return;
        if (index >= beats.length) {
          this.mascot.stopTalking();
          if (this.skipBtn) this.skipBtn.classList.add('is-hidden');
          if (typeof onComplete === 'function') onComplete();
          return;
        }
        const beat = beats[index++];
        this._runBeat(beat, token, runNext);
      };

      runNext();
    }

    _runBeat(beat, token, done) {
      if (token !== this.seqToken) return;

      if (beat.heading !== undefined) {
        this.setHeading(beat.heading, beat.underlineColor || '#F97316');
      } else if (beat.underlineColor) {
        this.setHeading(null, beat.underlineColor);
      }

      this.mascot.setMood(beat.mood || 'explaining', beat.lookAt || 'board');
      this.setSpotlight(Boolean(beat.dimBoard));
      if (beat.camera) this.focusCamera(beat.camera);
      if (beat.sfx) CikguAjar.SFX.play(beat.sfx);
      if (typeof beat.onEnter === 'function') beat.onEnter(this);

      const clipMeta = this.getClipMeta(beat.audioId, beat.fallbackAudioId);
      const text = beat.text || (clipMeta && clipMeta.text) || '';
      const { words, spans } = this._renderWords(text);

      let finished = false;
      const finishBeat = () => {
        if (finished || token !== this.seqToken) return;
        finished = true;
        this._stopAudioAndRaf();
        spans.forEach((s) => {
          s.classList.remove('is-active');
          s.classList.add('is-spoken');
        });
        this.mascot.stopTalking();
        const pauseMs = beat.pauseAfterMs !== undefined ? beat.pauseAfterMs : 180;
        const t = global.setTimeout(() => {
          if (token === this.seqToken) done();
        }, pauseMs);
        this.activeTimers.push(t);
      };

      if (this.voiceEnabled && clipMeta && clipMeta.file) {
        const resolvedUrl = this._resolveAudioUrl(clipMeta.file);
        const crossOrigin = this._isCrossOriginUrl(resolvedUrl);
        const audio = new Audio(resolvedUrl);
        audio.playbackRate = this.playbackRate;
        this.activeAudio = audio;
        // Skip AudioContext AnalyserNode for cross-origin R2 MP3s to avoid CORS audio muting/blocking
        const hasAnalyser = crossOrigin ? false : this._ensureAudioAnalyser(audio);
        this.mascot.startTalking(!hasAnalyser);

        const wordTimings = clipMeta.words || [];
        const totalDur = (clipMeta.duration || Math.max(1.8, words.length * 0.3)) / this.playbackRate;

        const tick = () => {
          if (finished || token !== this.seqToken) return;
          const cur = audio.currentTime || 0;
          if (hasAnalyser) {
            this.mascot.updateFromAmplitude(this._sampleRMS());
          }
          if (spans.length) {
            let activeIdx = 0;
            if (wordTimings.length && wordTimings.length === spans.length) {
              for (let i = 0; i < wordTimings.length; i++) {
                if (cur >= wordTimings[i].start) activeIdx = i;
              }
            } else {
              const dur = audio.duration || clipMeta.duration || totalDur;
              const ratio = dur > 0 ? Math.min(0.999, cur / dur) : 0;
              activeIdx = Math.floor(ratio * spans.length);
            }
            this._highlightWordIndex(spans, activeIdx);
          }
          this.rafId = global.requestAnimationFrame(tick);
        };

        audio.addEventListener('ended', finishBeat, { once: true });
        audio.addEventListener('error', () => this._runSilentPacing(spans, totalDur * 1000, token, finishBeat), { once: true });

        const watchdog = global.setTimeout(() => {
          if (!finished && token === this.seqToken && audio.paused) {
            this._runSilentPacing(spans, totalDur * 1000, token, finishBeat);
          }
        }, 450);
        this.activeTimers.push(watchdog);

        audio.play().then(() => {
          if (token === this.seqToken) {
            this.rafId = global.requestAnimationFrame(tick);
          }
        }).catch(() => {
          this._runSilentPacing(spans, totalDur * 1000, token, finishBeat);
        });
        return;
      }

      const fallbackMs =
        beat.durationMs ||
        ((clipMeta && clipMeta.duration ? clipMeta.duration * 1000 : Math.max(1800, words.length * 290 + 420)) /
          this.playbackRate);
      this._runSilentPacing(spans, fallbackMs, token, finishBeat);
    }

    _runSilentPacing(spans, durationMs, token, onDone) {
      this._stopAudioAndRaf();
      this.mascot.startTalking(true);
      const stepMs = Math.max(135, (durationMs - 200) / Math.max(1, spans.length));
      spans.forEach((_, i) => {
        const wt = global.setTimeout(() => {
          if (token === this.seqToken) this._highlightWordIndex(spans, i);
        }, Math.round(i * stepMs));
        this.activeTimers.push(wt);
      });
      const endTimer = global.setTimeout(onDone, durationMs);
      this.activeTimers.push(endTimer);
    }

    playInstantClip(audioId, text, mood, sfx, fallbackAudioId) {
      this.cancelSequence();
      this.mascot.setMood(mood || 'explaining', 'board');
      this.setSpotlight(false);
      if (sfx) CikguAjar.SFX.play(sfx);
      const clipMeta = this.getClipMeta(audioId, fallbackAudioId);
      const display = text || (clipMeta && clipMeta.text) || '';
      const { spans } = this._renderWords(display);
      spans.forEach((s) => s.classList.add('is-spoken'));

      if (this.voiceEnabled && clipMeta && clipMeta.file) {
        const resolvedUrl = this._resolveAudioUrl(clipMeta.file);
        const crossOrigin = this._isCrossOriginUrl(resolvedUrl);
        const audio = new Audio(resolvedUrl);
        audio.playbackRate = this.playbackRate;
        this.activeAudio = audio;
        // Skip AudioContext AnalyserNode for cross-origin R2 MP3s to avoid CORS audio muting/blocking
        const hasAnalyser = crossOrigin ? false : this._ensureAudioAnalyser(audio);
        this.mascot.startTalking(!hasAnalyser);
        const loop = () => {
          if (this.activeAudio !== audio) return;
          if (hasAnalyser) this.mascot.updateFromAmplitude(this._sampleRMS());
          this.rafId = global.requestAnimationFrame(loop);
        };
        audio.addEventListener(
          'ended',
          () => {
            this._stopAudioAndRaf();
            this.mascot.stopTalking();
          },
          { once: true }
        );
        audio.addEventListener(
          'error',
          () => {
            this._stopAudioAndRaf();
            this.mascot.stopTalking();
          },
          { once: true }
        );
        audio.play().then(() => {
          this.rafId = global.requestAnimationFrame(loop);
        }).catch(() => this.mascot.stopTalking());
      }
    }
  }

  CikguAjar.Engine = BoardEngine;
  CikguAjar.loadScriptOnce = loadScriptOnce;
})(window);
