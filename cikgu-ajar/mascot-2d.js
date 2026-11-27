(function (global) {
  const CikguAjar = (global.CikguAjar = global.CikguAjar || {});

  /* Web Audio SFX */
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    ensureCtx() {
      if (this.muted) return null;
      const AudioCtx = global.AudioContext || global.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(function () {});
      }
      return this.ctx;
    }

    play(name) {
      if (this.muted || !name) return;
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (name === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (name === 'boing') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(145, now + 0.22);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (name === 'chalk') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (name === 'xp' || name === 'chime') {
        const notes = name === 'xp' ? [587.33, 880.0] : [523.25, 659.25, 783.99, 1046.5];
        notes.forEach(function (freq, idx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.085, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.28);
        });
      }
    }
  }

  /* 2D Rigged SVG Mascot faithful to eTutor.my's hero-student-3d.png */
  const VISEMES = {
    closed: 'M 117 134 Q 130 137 143 134',
    small: 'M 122 132 Q 130 142 138 132 Q 130 130 122 132 Z',
    mid: 'M 118 130 Q 130 146 142 130 Q 130 128 118 130 Z',
    wide: 'M 115 129 Q 130 151 145 129 Q 130 126 115 129 Z',
    o: 'M 124 134 A 6 7 0 1 0 136 134 A 6 7 0 1 0 124 134 Z',
    smile: 'M 115 131 Q 130 144 145 131'
  };

  class Mascot2D {
    constructor(hostEl) {
      this.hostEl = hostEl;
      this.mood = 'neutral';
      this.talking = false;
      this.fallbackTimer = null;
      this.visemeIdx = 0;
      this._render();
    }

    _render() {
      this.hostEl.innerHTML = `
        <svg class="mascot-svg" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maskot 2D Cikgu AI eTutor.my">
          <ellipse cx="130" cy="284" rx="64" ry="11" fill="rgba(30, 36, 48, 0.14)"/>

          <!-- Emotion Overlays -->
          <g id="m-ov-shock" style="display:none;">
            <g class="ov-puff-l" opacity="0.88">
              <circle cx="48" cy="54" r="13" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
              <circle cx="62" cy="48" r="10" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
            </g>
            <g class="ov-puff-r" opacity="0.88">
              <circle cx="212" cy="54" r="13" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
              <circle cx="198" cy="48" r="10" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
            </g>
            <g class="ov-shock-pop" transform="translate(184, 14)">
              <path d="M 6 0 Q 12 10 22 10" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
              <path d="M 28 0 Q 22 10 12 10" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
              <path d="M 6 24 Q 12 14 22 14" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
              <path d="M 28 24 Q 22 14 12 14" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
            </g>
          </g>

          <g id="m-ov-deadpan" style="display:none;">
            <rect x="178" y="18" width="58" height="30" rx="14" fill="#FFFFFF" stroke="#1E2430" stroke-width="2.4"/>
            <path d="M 188 47 L 178 58 L 196 48 Z" fill="#FFFFFF" stroke="#1E2430" stroke-width="2.2" stroke-linejoin="round"/>
            <circle class="ov-dot-1" cx="195" cy="33" r="3.3" fill="#1E2430"/>
            <circle class="ov-dot-2" cx="207" cy="33" r="3.3" fill="#1E2430"/>
            <circle class="ov-dot-3" cx="219" cy="33" r="3.3" fill="#1E2430"/>
          </g>

          <g id="m-ov-think" style="display:none;">
            <circle cx="202" cy="34" r="17" fill="#EEF2FF" stroke="#4F46E5" stroke-width="2.4"/>
            <text x="202" y="41" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="21" fill="#4F46E5">?</text>
          </g>

          <g id="m-ov-celebrate" style="display:none;">
            <g class="ov-sparkle" transform="translate(42, 34)">
              <path d="M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z" fill="#F59E0B"/>
            </g>
            <g class="ov-sparkle" transform="translate(194, 24)">
              <path d="M 14 0 L 18 10 L 28 14 L 18 18 L 14 28 L 10 18 L 0 14 L 10 10 Z" fill="#10B981"/>
            </g>
          </g>

          <g id="m-ov-calm" style="display:none;">
            <circle cx="202" cy="36" r="18" fill="#ECFDF5" stroke="#0D9488" stroke-width="2.4"/>
            <text x="202" y="42" text-anchor="middle" font-size="18">💡</text>
          </g>

          <!-- Main Character Rig -->
          <g id="m-rig" class="mascot-bob">
            <!-- Neck -->
            <path d="M 114 148 L 146 148 L 146 174 L 114 174 Z" fill="#C97E58" stroke="#1E2430" stroke-width="2.4"/>
            <path d="M 114 150 Q 130 163 146 150 L 146 158 Q 130 170 114 158 Z" fill="#A96443"/>

            <!-- White Tee + Open Navy Shirt -->
            <path d="M 74 172 Q 130 162 186 172 L 188 274 L 72 274 Z" fill="#F8FAFC" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M 70 170 Q 94 162 114 166 L 106 274 L 56 274 Q 58 205 70 170 Z" fill="#334E7B" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M 190 170 Q 166 162 146 166 L 154 274 L 204 274 Q 202 205 190 170 Z" fill="#334E7B" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M 114 166 L 96 196 L 112 204 L 118 172 Z" fill="#263C63" stroke="#1E2430" stroke-width="2.2" stroke-linejoin="round"/>
            <path d="M 146 166 L 164 196 L 148 204 L 142 172 Z" fill="#263C63" stroke="#1E2430" stroke-width="2.2" stroke-linejoin="round"/>
            <circle cx="110" cy="218" r="2.6" fill="#1E293B"/>
            <circle cx="109" cy="242" r="2.6" fill="#1E293B"/>
            <circle cx="150" cy="218" r="2.6" fill="#1E293B"/>
            <circle cx="151" cy="242" r="2.6" fill="#1E293B"/>

            <!-- Arms + Tablet (Dynamic pose group) -->
            <g id="m-arms-tablet">
              <path d="M 62 182 Q 36 218 52 246 L 90 250 L 94 232 L 72 228 Q 68 212 76 194 Z" fill="#2B426B" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
              <path d="M 198 182 Q 224 218 208 246 L 170 250 L 166 232 L 188 228 Q 192 212 184 194 Z" fill="#2B426B" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
              <rect x="82" y="210" width="96" height="66" rx="10" transform="rotate(-6 130 243)" fill="#E2E8F0" stroke="#1E2430" stroke-width="2.5"/>
              <rect x="88" y="216" width="84" height="54" rx="6" transform="rotate(-6 130 243)" fill="#CBD5E1"/>
              <circle cx="96" cy="224" r="3" fill="#334155"/>
              <text x="130" y="248" text-anchor="middle" transform="rotate(-6 130 243)" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="#334E7B">eTutor</text>
              <ellipse cx="86" cy="248" rx="14" ry="10" fill="#D9946C" stroke="#1E2430" stroke-width="2.3"/>
              <ellipse cx="174" cy="242" rx="14" ry="10" fill="#D9946C" stroke="#1E2430" stroke-width="2.3"/>
            </g>

            <!-- Head Group -->
            <g id="m-head">
              <ellipse cx="77" cy="108" rx="9" ry="14" fill="#D48860" stroke="#1E2430" stroke-width="2.4"/>
              <ellipse cx="183" cy="108" rx="9" ry="14" fill="#D48860" stroke="#1E2430" stroke-width="2.4"/>
              <path d="M 82 86 Q 82 44 130 44 Q 178 44 178 86 L 176 116 Q 174 156 130 158 Q 86 156 84 116 Z" fill="#DDA07A" stroke="#1E2430" stroke-width="2.6"/>
              <ellipse cx="98" cy="122" rx="9" ry="5" fill="#E07A5F" opacity="0.28"/>
              <ellipse cx="162" cy="122" rx="9" ry="5" fill="#E07A5F" opacity="0.28"/>
              <path d="M 126 116 Q 130 123 135 117" fill="none" stroke="#9C5B3D" stroke-width="2.4" stroke-linecap="round"/>

              <!-- Swept Dark Hair -->
              <path d="M 78 96 Q 74 44 118 32 Q 158 22 180 46 Q 190 66 182 98 Q 176 74 162 66 Q 136 58 104 66 Q 86 72 78 96 Z" fill="#181B22" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
              <path d="M 108 42 Q 134 34 158 46" fill="none" stroke="#333A48" stroke-width="3" stroke-linecap="round"/>

              <!-- Eyes -->
              <g class="eye-blink">
                <ellipse cx="108" cy="100" rx="10.5" ry="10.5" fill="#FFFFFF" stroke="#1E2430" stroke-width="2.2"/>
                <circle id="m-pupil-l" cx="109" cy="100" r="5.6" fill="#1E1B18"/>
                <circle id="m-glint-l" cx="111.5" cy="97.5" r="2" fill="#FFFFFF"/>

                <ellipse cx="152" cy="100" rx="10.5" ry="10.5" fill="#FFFFFF" stroke="#1E2430" stroke-width="2.2"/>
                <circle id="m-pupil-r" cx="151" cy="100" r="5.6" fill="#1E1B18"/>
                <circle id="m-glint-r" cx="153.5" cy="97.5" r="2" fill="#FFFFFF"/>
              </g>

              <!-- Deadpan Eyelids -->
              <g id="m-lids" style="display:none;">
                <path d="M 97 93 L 119 93 L 118 100 L 98 100 Z" fill="#DDA07A" stroke="#1E2430" stroke-width="2"/>
                <path d="M 141 93 L 163 93 L 162 100 L 142 100 Z" fill="#DDA07A" stroke="#1E2430" stroke-width="2"/>
              </g>

              <!-- Happy Arc Eyes -->
              <g id="m-happy-eyes" style="display:none;">
                <circle cx="108" cy="100" r="11" fill="#DDA07A"/>
                <circle cx="152" cy="100" r="11" fill="#DDA07A"/>
                <path d="M 98 102 Q 108 91 118 102" fill="none" stroke="#181B22" stroke-width="3.2" stroke-linecap="round"/>
                <path d="M 142 102 Q 152 91 162 102" fill="none" stroke="#181B22" stroke-width="3.2" stroke-linecap="round"/>
              </g>

              <!-- Expressive Brows -->
              <path id="m-brow-l" d="M 94 84 Q 108 79 120 84" fill="none" stroke="#181B22" stroke-width="4.4" stroke-linecap="round"/>
              <path id="m-brow-r" d="M 140 84 Q 152 79 166 84" fill="none" stroke="#181B22" stroke-width="4.4" stroke-linecap="round"/>

              <!-- Mouth -->
              <path id="m-mouth" d="${VISEMES.smile}" fill="none" stroke="#1E2430" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </g>
        </svg>
      `;

      this.els = {
        shock: this.hostEl.querySelector('#m-ov-shock'),
        deadpan: this.hostEl.querySelector('#m-ov-deadpan'),
        think: this.hostEl.querySelector('#m-ov-think'),
        celebrate: this.hostEl.querySelector('#m-ov-celebrate'),
        calm: this.hostEl.querySelector('#m-ov-calm'),
        pupilL: this.hostEl.querySelector('#m-pupil-l'),
        pupilR: this.hostEl.querySelector('#m-pupil-r'),
        glintL: this.hostEl.querySelector('#m-glint-l'),
        glintR: this.hostEl.querySelector('#m-glint-r'),
        lids: this.hostEl.querySelector('#m-lids'),
        happyEyes: this.hostEl.querySelector('#m-happy-eyes'),
        browL: this.hostEl.querySelector('#m-brow-l'),
        browR: this.hostEl.querySelector('#m-brow-r'),
        mouth: this.hostEl.querySelector('#m-mouth'),
        head: this.hostEl.querySelector('#m-head'),
        arms: this.hostEl.querySelector('#m-arms-tablet')
      };
    }

    setMood(mood, lookAt) {
      this.mood = mood || 'neutral';
      const e = this.els;
      e.shock.style.display = 'none';
      e.deadpan.style.display = 'none';
      e.think.style.display = 'none';
      e.celebrate.style.display = 'none';
      e.calm.style.display = 'none';
      e.lids.style.display = 'none';
      e.happyEyes.style.display = 'none';
      e.head.setAttribute('transform', '');
      e.arms.setAttribute('transform', '');

      let dx = 0;
      let dy = 0;
      if (lookAt === 'board') {
        dx = -3.0;
        dy = -0.5;
      } else if (lookAt === 'side') {
        dx = -3.6;
        dy = 0.5;
      }
      e.pupilL.setAttribute('cx', 109 + dx);
      e.pupilL.setAttribute('cy', 100 + dy);
      e.pupilR.setAttribute('cx', 151 + dx);
      e.pupilR.setAttribute('cy', 100 + dy);
      e.glintL.setAttribute('cx', 111.5 + dx);
      e.glintL.setAttribute('cy', 97.5 + dy);
      e.glintR.setAttribute('cx', 153.5 + dx);
      e.glintR.setAttribute('cy', 97.5 + dy);

      if (this.mood === 'shocked') {
        e.shock.style.display = 'block';
        e.browL.setAttribute('d', 'M 94 78 L 119 86');
        e.browR.setAttribute('d', 'M 141 86 L 166 78');
        e.head.setAttribute('transform', 'rotate(-2 130 120)');
        e.arms.setAttribute('transform', 'translate(0, -6)');
        if (!this.talking) this.setViseme('o');
      } else if (this.mood === 'deadpan') {
        e.deadpan.style.display = 'block';
        e.lids.style.display = 'block';
        e.pupilL.setAttribute('cx', 105.5);
        e.pupilR.setAttribute('cx', 147.5);
        e.browL.setAttribute('d', 'M 94 84 L 119 84');
        e.browR.setAttribute('d', 'M 141 84 L 166 84');
        if (!this.talking) this.setViseme('closed');
      } else if (this.mood === 'thinking') {
        e.think.style.display = 'block';
        e.browL.setAttribute('d', 'M 94 84 Q 108 81 120 84');
        e.browR.setAttribute('d', 'M 140 77 Q 152 73 166 80');
        e.head.setAttribute('transform', 'rotate(2.5 130 120)');
        if (!this.talking) this.setViseme('small');
      } else if (this.mood === 'celebrating') {
        e.celebrate.style.display = 'block';
        e.happyEyes.style.display = 'block';
        e.browL.setAttribute('d', 'M 94 77 Q 108 71 120 77');
        e.browR.setAttribute('d', 'M 140 77 Q 152 71 166 77');
        e.arms.setAttribute('transform', 'translate(0, -7)');
        if (!this.talking) this.setViseme('smile');
      } else if (this.mood === 'calm') {
        e.calm.style.display = 'block';
        e.browL.setAttribute('d', 'M 94 82 Q 108 77 120 82');
        e.browR.setAttribute('d', 'M 140 82 Q 152 77 166 82');
        if (!this.talking) this.setViseme('smile');
      } else {
        e.browL.setAttribute('d', 'M 94 84 Q 108 79 120 84');
        e.browR.setAttribute('d', 'M 140 84 Q 152 79 166 84');
        if (!this.talking) this.setViseme('smile');
      }
    }

    setViseme(key) {
      const d = VISEMES[key] || VISEMES.closed;
      this.els.mouth.setAttribute('d', d);
      const isLine = key === 'closed' || key === 'smile';
      this.els.mouth.setAttribute('fill', isLine ? 'none' : '#7F1D1D');
    }

    updateFromAmplitude(rms) {
      if (!this.talking) return;
      if (rms < 0.015) this.setViseme('closed');
      else if (rms < 0.045) this.setViseme('small');
      else if (rms < 0.095) this.setViseme('mid');
      else this.setViseme(this.mood === 'shocked' ? 'o' : 'wide');
    }

    startTalking(useFallbackTimer) {
      this.stopTalking();
      this.talking = true;
      if (useFallbackTimer) {
        this.fallbackTimer = global.setInterval(() => {
          const seq = ['small', 'mid', 'wide', 'mid', 'o', 'closed'];
          this.visemeIdx = (this.visemeIdx + 1) % seq.length;
          this.setViseme(seq[this.visemeIdx]);
        }, 125);
      }
    }

    stopTalking() {
      this.talking = false;
      if (this.fallbackTimer) {
        global.clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      if (this.mood === 'shocked') this.setViseme('o');
      else if (this.mood === 'deadpan') this.setViseme('closed');
      else this.setViseme('smile');
    }
  }

  CikguAjar.SFX = new SoundFX();
  CikguAjar.Mascot = Mascot2D;
})(window);
