(function (global) {
  const CikguAjar = (global.CikguAjar = global.CikguAjar || {});

  function esc(val) {
    return String(val === undefined || val === null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightClass(tone) {
    if (tone === 'orange') return 'is-highlight-orange';
    if (tone === 'teal') return 'is-highlight-teal';
    if (tone === 'coral') return 'is-highlight-coral';
    if (tone === 'dim') return 'is-dim-term';
    return '';
  }

  /* ================= COORDINATE GRAPH HELPERS ================= */
  function mapX(x) {
    return 170 + x * 34;
  }

  function mapY(y) {
    return 125 - y * 16;
  }

  function buildParabolaPath(a, b, c) {
    const pts = [];
    for (let x = -4.2; x <= 4.21; x += 0.2) {
      const y = a * x * x + b * x + c;
      if (y >= -6.2 && y <= 7.2) {
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }

  function renderGraphSVG(cfg) {
    let gridLines = '';
    for (let gx = -4; gx <= 4; gx++) {
      const px = mapX(gx);
      gridLines += `<line x1="${px}" y1="16" x2="${px}" y2="224" stroke="rgba(30,36,48,0.08)" stroke-width="1"/>`;
      if (gx !== 0 && gx % 2 === 0) {
        gridLines += `<text x="${px}" y="140" text-anchor="middle" font-size="10" font-family="JetBrains Mono, monospace" fill="#64748B">${gx}</text>`;
      }
    }
    for (let gy = -5; gy <= 6; gy++) {
      const py = mapY(gy);
      gridLines += `<line x1="22" y1="${py}" x2="318" y2="${py}" stroke="rgba(30,36,48,0.08)" stroke-width="1"/>`;
      if (gy !== 0 && gy % 2 === 0) {
        gridLines += `<text x="160" y="${py + 3}" text-anchor="end" font-size="10" font-family="JetBrains Mono, monospace" fill="#64748B">${gy}</text>`;
      }
    }

    let curvesSvg = '';
    (cfg.curves || []).forEach((crv) => {
      const d = buildParabolaPath(crv.a, crv.b || 0, crv.c || 0);
      const cls = crv.animate ? 'parabola-draw' : '';
      const dash = crv.dashed ? 'stroke-dasharray="7 5"' : '';
      const stroke = esc(crv.color || '#4F46E5');
      curvesSvg += `<path class="${cls}" d="${d}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" ${dash}/>`;

      if (crv.label) {
        const lx = crv.labelX !== undefined ? mapX(crv.labelX) : 252;
        const ly = crv.labelY !== undefined ? mapY(crv.labelY) : 34;
        curvesSvg += `<rect x="${lx - 38}" y="${ly - 13}" width="76" height="20" rx="8" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.8"/>`;
        curvesSvg += `<text x="${lx}" y="${ly + 1}" text-anchor="middle" font-size="11" font-weight="700" font-family="JetBrains Mono, monospace" fill="${stroke}">${esc(crv.label)}</text>`;
      }
    });

    let markersSvg = '';
    if (cfg.showVertex && cfg.curves && cfg.curves[0]) {
      const { a, b = 0, c = 0 } = cfg.curves[0];
      if (Math.abs(a) > 0.01) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        if (vy >= -5.5 && vy <= 6.5) {
          const px = mapX(vx);
          const py = mapY(vy);
          const tag = a > 0 ? 'MIN' : 'MAKS';
          const tagColor = a > 0 ? '#0D9488' : '#F97316';
          markersSvg += `<circle cx="${px}" cy="${py}" r="5.5" fill="${tagColor}" stroke="#fff" stroke-width="2"/>`;
          markersSvg += `<rect x="${px + 8}" y="${py - 11}" width="42" height="18" rx="6" fill="${tagColor}"/>`;
          markersSvg += `<text x="${px + 29}" y="${py + 2}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${tag}</text>`;
        }
      }
    }

    if (cfg.showIntercept !== undefined && cfg.showIntercept !== null) {
      const py = mapY(cfg.showIntercept);
      const sign = cfg.showIntercept >= 0 ? '+' : '';
      markersSvg += `<circle cx="170" cy="${py}" r="6" fill="#0D9488" stroke="#fff" stroke-width="2"/>`;
      markersSvg += `<rect x="179" y="${py - 10}" width="54" height="19" rx="6" fill="#CCFBF1" stroke="#0D9488" stroke-width="1.5"/>`;
      markersSvg += `<text x="206" y="${py + 3}" text-anchor="middle" font-size="10.5" font-weight="800" font-family="JetBrains Mono, monospace" fill="#0F766E">(0,${sign}${cfg.showIntercept})</text>`;
    }

    if (cfg.elevatorC !== undefined && cfg.elevatorC !== null) {
      const ey = mapY(cfg.elevatorC);
      markersSvg += `
        <g>
          <line x1="154" y1="26" x2="154" y2="216" stroke="#0D9488" stroke-width="2" stroke-dasharray="3 3" opacity="0.55"/>
          <rect x="142" y="${ey - 10}" width="22" height="20" rx="5" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
          <text x="153" y="${ey + 4}" text-anchor="middle" font-size="11">🛗</text>
        </g>
      `;
    }

    if (cfg.heightCompare) {
      const hc = typeof cfg.heightCompare === 'object' ? cfg.heightCompare : {};
      const xVal = hc.x !== undefined ? hc.x : 2;
      const y1Val = hc.y1 !== undefined ? hc.y1 : 2;
      const lbl1 = hc.label1 || 'y=2';
      const lbl2 = hc.label2 || '↑ y=12!';
      const x2 = mapX(xVal);
      const yWide = mapY(y1Val);
      const yZero = mapY(0);
      markersSvg += `
        <line x1="${x2}" y1="${yZero}" x2="${x2}" y2="${yWide}" stroke="#0D9488" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${x2}" cy="${yWide}" r="5" fill="#0D9488"/>
        <text x="${x2 + 8}" y="${yWide + 4}" font-size="10.5" font-weight="800" fill="#0F766E">${esc(lbl1)}</text>
        <line x1="${x2 - 6}" y1="${yZero}" x2="${x2 - 6}" y2="22" stroke="#F43F5E" stroke-width="4" stroke-dasharray="4 3"/>
        <text x="${x2 - 12}" y="30" text-anchor="end" font-size="10.5" font-weight="800" fill="#BE123C">${esc(lbl2)}</text>
      `;
    }

    return `
      <svg class="graph-svg" viewBox="0 0 340 235" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Graf fungsi kuadratik">
        ${gridLines}
        <line x1="20" y1="125" x2="322" y2="125" stroke="#1E2430" stroke-width="2.2"/>
        <polygon points="324,125 316,121 316,129" fill="#1E2430"/>
        <text x="324" y="117" font-size="11" font-weight="800" font-style="italic" fill="#1E2430">x</text>

        <line x1="170" y1="226" x2="170" y2="14" stroke="#1E2430" stroke-width="2.2"/>
        <polygon points="170,12 166,20 174,20" fill="#1E2430"/>
        <text x="179" y="21" font-size="11" font-weight="800" font-style="italic" fill="#1E2430">f(x)</text>
        ${curvesSvg}
        ${markersSvg}
      </svg>
    `;
  }

  /* ================= ANALOGY SVGs ================= */
  function renderAnalogySVG(type) {
    if (type === 'fountain') {
      return `
        <svg class="analogy-svg" viewBox="0 0 240 105" xmlns="http://www.w3.org/2000/svg">
          <rect x="75" y="76" width="90" height="18" rx="6" fill="#CBD5E1" stroke="#334155" stroke-width="2"/>
          <path d="M 120 76 Q 120 18 175 74" fill="none" stroke="#0EA5E9" stroke-width="4" stroke-dasharray="6 4" stroke-linecap="round"/>
          <path d="M 120 76 Q 120 18 65 74" fill="none" stroke="#0EA5E9" stroke-width="4" stroke-dasharray="6 4" stroke-linecap="round"/>
          <circle cx="120" cy="30" r="6" fill="#F97316" stroke="#fff" stroke-width="2"/>
          <text x="120" y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#C2410C">PUNCAK MAKSIMUM (∩)</text>
        </svg>
      `;
    }
    if (type === 'elevator') {
      return `
        <svg class="analogy-svg" viewBox="0 0 240 105" xmlns="http://www.w3.org/2000/svg">
          <rect x="42" y="12" width="44" height="82" rx="6" fill="#F1F5F9" stroke="#334155" stroke-width="2"/>
          <line x1="64" y1="14" x2="64" y2="92" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 3"/>
          <rect x="48" y="34" width="32" height="24" rx="5" fill="#FEF3C7" stroke="#D97706" stroke-width="2.2"/>
          <text x="64" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="#92400E">+c</text>
          <path d="M 105 24 L 105 74" stroke="#0D9488" stroke-width="3" stroke-linecap="round"/>
          <polygon points="105,16 100,26 110,26" fill="#0D9488"/>
          <polygon points="105,82 100,72 110,72" fill="#0D9488"/>
          <path d="M 135 64 Q 175 18 215 64" fill="none" stroke="#4F46E5" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="175" cy="41" r="4.5" fill="#0D9488"/>
        </svg>
      `;
    }
    if (type === 'rocket-hammock') {
      return `
        <svg class="analogy-svg" viewBox="0 0 240 105" xmlns="http://www.w3.org/2000/svg">
          <path d="M 42 18 Q 58 95 74 18" fill="none" stroke="#F43F5E" stroke-width="3.5" stroke-linecap="round"/>
          <text x="58" y="96" text-anchor="middle" font-size="10.5" font-weight="800" fill="#BE123C">3x² Sempit</text>
          <path d="M 116 32 Q 170 88 224 32" fill="none" stroke="#0D9488" stroke-width="4" stroke-linecap="round"/>
          <line x1="116" y1="24" x2="116" y2="80" stroke="#64748B" stroke-width="3"/>
          <line x1="224" y1="24" x2="224" y2="80" stroke="#64748B" stroke-width="3"/>
          <text x="170" y="96" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0F766E">0.5x² Lebar</text>
        </svg>
      `;
    }
    if (type === 'trap' || type === 'shield') {
      return `
        <svg class="analogy-svg" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M 120 10 L 160 24 V 48 C 160 68 140 80 120 84 C 100 80 80 68 80 48 V 24 Z" fill="#FEF3C7" stroke="#D97706" stroke-width="3"/>
          <path d="M 106 46 L 116 56 L 136 34" fill="none" stroke="#0D9488" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
    if (type === 'balance') {
      return `
        <svg class="analogy-svg" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
          <line x1="120" y1="16" x2="120" y2="78" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="88" y1="78" x2="152" y2="78" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
          <line x1="60" y1="30" x2="180" y2="30" stroke="#4F46E5" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="60" cy="48" r="14" fill="#FFE4E6" stroke="#F43F5E" stroke-width="2.5"/>
          <circle cx="180" cy="48" r="14" fill="#CCFBF1" stroke="#0D9488" stroke-width="2.5"/>
        </svg>
      `;
    }
    return `
      <svg class="analogy-svg" viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="45" r="34" fill="#ECFDF5" stroke="#10B981" stroke-width="3"/>
        <path d="M 103 46 L 115 58 L 139 32" fill="none" stroke="#059669" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  /* ================= TEMPLATE 1: GRAPH-SLIDER ================= */
  function renderEquationBar(eq) {
    if (!eq) return '<div class="eq-main"><span>Papan Fungsi</span></div>';
    let termsHtml = '';
    if (Array.isArray(eq.terms) && eq.terms.length) {
      termsHtml = eq.terms
        .map((t) => {
          const cls = highlightClass(t.highlight);
          return `<span class="eq-term ${cls}">${esc(t.text)}</span>`;
        })
        .join('');
    } else if (eq.expression) {
      termsHtml = `<span>${esc(eq.expression)}</span>`;
    }
    const prefix = eq.prefix ? `<span>${esc(eq.prefix)}</span>` : '';
    const pill = eq.promptPill ? `<span class="eq-prompt-pill">${esc(eq.promptPill)}</span>` : '';
    return `
      <div class="eq-main">${prefix}${termsHtml}</div>
      ${pill}
    `;
  }

  function renderGraphSlider(els, board) {
    els.topCard.className = 'sketch-card equation-card';
    els.topCard.innerHTML = renderEquationBar(board.equation);
    els.mainVisualCard.className = 'sketch-card graph-card';
    els.mainVisualCard.innerHTML = renderGraphSVG(board.graph || { curves: [] });
  }

  /* ================= TEMPLATE 2: SPLIT-TRAP ================= */
  function renderTopBanner(els, title, promptPill) {
    els.topCard.className = 'sketch-card question-banner';
    els.topCard.innerHTML = `
      <div class="qb-text">${esc(title || '')}</div>
      ${promptPill ? `<span class="eq-prompt-pill">${esc(promptPill)}</span>` : ''}
    `;
  }

  function renderSplitTrap(els, board, state) {
    renderTopBanner(els, board.question || board.title || 'Bandingkan Salah vs Betul', board.promptPill || 'Awas Perangkap!');
    els.mainVisualCard.className = 'sketch-card split-trap-card';

    const wrong = board.wrongSide || {};
    const right = board.rightSide || {};
    const isMasked = Boolean(board.maskRightUntilSolved && !(state && state.revealed));
    const COLOR_TOKENS = new Set(['coral', 'teal', 'orange', 'dim']);
    const wrongHlText = wrong.highlight && !COLOR_TOKENS.has(wrong.highlight) ? wrong.highlight : '';
    const rightHlText = right.highlight && !COLOR_TOKENS.has(right.highlight) ? right.highlight : '';

    els.mainVisualCard.innerHTML = `
      <div class="split-trap-grid">
        <div class="trap-col is-wrong-col">
          <span class="trap-badge is-wrong-badge">${esc(wrong.badge || 'SALAH ❌')}</span>
          <h3 class="trap-col-title">${esc(wrong.title || 'Perangkap Lazim')}</h3>
          <p class="trap-col-body">${esc(wrong.body || '')}</p>
          ${wrongHlText ? `<div class="trap-highlight is-wrong-hl">${esc(wrongHlText)}</div>` : ''}
        </div>
        <div class="trap-col is-right-col ${isMasked ? 'is-masked' : ''}">
          <span class="trap-badge is-right-badge">${esc(right.badge || 'BETUL ✓')}</span>
          ${
            isMasked
              ? `<h3 class="trap-col-title">Konsep Sebenar?</h3>
                 <p class="trap-col-body">Pilih jawapan yang tepat di bawah untuk dedahkan kunci betul!</p>
                 <div class="trap-highlight is-locked-hl">🔒 Terkunci</div>`
              : `<h3 class="trap-col-title">${esc(right.title || 'Fakta Tepat')}</h3>
                 <p class="trap-col-body">${esc(right.body || '')}</p>
                 ${rightHlText ? `<div class="trap-highlight is-right-hl">${esc(rightHlText)}</div>` : ''}`
          }
        </div>
      </div>
    `;
  }

  /* ================= TEMPLATE 3: FORMULA-STEPS ================= */
  function renderFormulaSteps(els, board, state) {
    renderTopBanner(els, board.title || board.given || 'Langkah Penyelesaian', board.promptPill || 'Ikut Langkah');
    els.mainVisualCard.className = 'sketch-card formula-steps-card';

    const revealed = Boolean(state && state.revealed);
    const givenHtml = board.given
      ? `<div class="formula-given"><span class="given-tag">Diberi</span><code>${esc(board.given)}</code></div>`
      : '';

    const stepsHtml = (board.steps || [])
      .map((st, idx) => {
        const masked = Boolean(st.hiddenUntilSolved && !revealed);
        const hlCls = !masked ? highlightClass(st.highlight) : '';
        return `
          <div class="formula-step-item ${hlCls} ${masked ? 'is-masked' : ''}">
            <span class="step-num-badge">${esc(st.num !== undefined ? st.num : idx + 1)}</span>
            <div class="step-content">
              <div class="step-label">${esc(st.label || `Langkah ${idx + 1}`)}</div>
              <div class="step-expr">${masked ? '🔒 Selesaikan soalan untuk buka langkah ini' : esc(st.expr || '')}</div>
            </div>
          </div>
        `;
      })
      .join('');

    els.mainVisualCard.innerHTML = `
      ${givenHtml}
      <div class="formula-steps-list">${stepsHtml}</div>
    `;
  }

  /* ================= TEMPLATE 4: DIAGRAM-PIN ================= */
  function buildConceptDiagramSVG(type) {
    if (type === 'cell') {
      return `
        <path d="M 48 90 Q 46 28 160 28 Q 274 28 272 90 Q 274 152 160 152 Q 46 152 48 90 Z" fill="#ECFDF5" stroke="#0D9488" stroke-width="4"/>
        <path d="M 58 90 Q 56 38 160 38 Q 264 38 262 90 Q 264 142 160 142 Q 56 142 58 90 Z" fill="#D1FAE5" stroke="#059669" stroke-width="2" stroke-dasharray="5 3"/>
        <circle cx="150" cy="90" r="28" fill="#E0E7FF" stroke="#4F46E5" stroke-width="3"/>
        <circle cx="150" cy="90" r="10" fill="#4F46E5"/>
        <ellipse cx="222" cy="70" rx="20" ry="11" fill="#FFEDD5" stroke="#F97316" stroke-width="2.2"/>
        <ellipse cx="96" cy="112" rx="18" ry="10" fill="#FEF3C7" stroke="#D97706" stroke-width="2.2"/>
      `;
    }
    if (type === 'circuit') {
      return `
        <rect x="60" y="34" width="200" height="112" rx="12" fill="none" stroke="#1E2430" stroke-width="3.5"/>
        <rect x="130" y="22" width="60" height="24" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
        <text x="160" y="38" text-anchor="middle" font-size="11" font-weight="800" fill="#92400E">PERINTANG R</text>
        <circle cx="160" cy="146" r="16" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.5"/>
        <text x="160" y="150" text-anchor="middle" font-size="11" font-weight="800" fill="#1E40AF">V</text>
        <line x1="60" y1="80" x2="60" y2="100" stroke="#F43F5E" stroke-width="6"/>
      `;
    }
    if (type === 'wave') {
      return `
        <line x1="28" y1="90" x2="294" y2="90" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M 30 90 Q 70 22 110 90 T 190 90 T 270 90" fill="none" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="56" x2="70" y2="90" stroke="#F97316" stroke-width="2.5" stroke-dasharray="3 3"/>
        <line x1="70" y1="36" x2="230" y2="36" stroke="#0D9488" stroke-width="2.5"/>
      `;
    }
    if (type === 'atom') {
      return `
        <ellipse cx="160" cy="90" rx="92" ry="34" transform="rotate(24 160 90)" fill="none" stroke="#4F46E5" stroke-width="2.2" opacity="0.7"/>
        <ellipse cx="160" cy="90" rx="92" ry="34" transform="rotate(-24 160 90)" fill="none" stroke="#0D9488" stroke-width="2.2" opacity="0.7"/>
        <circle cx="160" cy="90" r="22" fill="#FEE2E2" stroke="#EF4444" stroke-width="2.5"/>
        <circle cx="153" cy="85" r="7" fill="#EF4444"/>
        <circle cx="167" cy="95" r="7" fill="#F97316"/>
        <circle cx="88" cy="60" r="6" fill="#4F46E5"/>
        <circle cx="232" cy="120" r="6" fill="#0D9488"/>
      `;
    }
    if (type === 'force') {
      return `
        <line x1="24" y1="138" x2="296" y2="138" stroke="#334155" stroke-width="3"/>
        <rect x="120" y="78" width="80" height="58" rx="8" fill="#E0E7FF" stroke="#1E2430" stroke-width="3"/>
        <path d="M 205 107 L 270 107" stroke="#0D9488" stroke-width="5" stroke-linecap="round"/>
        <polygon points="282,107 268,99 268,115" fill="#0D9488"/>
        <path d="M 115 107 L 60 107" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"/>
        <polygon points="48,107 62,99 62,115" fill="#F43F5E"/>
      `;
    }
    if (type === 'geo-map') {
      return `
        <rect x="28" y="20" width="264" height="140" rx="14" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2.2"/>
        <path d="M 55 110 Q 95 45 148 74 T 246 58 Q 270 92 238 134 Q 170 144 108 128 Z" fill="#DCFCE7" stroke="#16A34A" stroke-width="2.5"/>
        <path d="M 112 68 Q 145 96 175 118" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
      `;
    }
    // Generic concept hub
    return `
      <circle cx="160" cy="90" r="36" fill="#EEF2FF" stroke="#4F46E5" stroke-width="3"/>
      <circle cx="72" cy="52" r="22" fill="#FFF7ED" stroke="#F97316" stroke-width="2.5"/>
      <circle cx="248" cy="52" r="22" fill="#ECFDF5" stroke="#0D9488" stroke-width="2.5"/>
      <circle cx="72" cy="132" r="22" fill="#FFF1F2" stroke="#F43F5E" stroke-width="2.5"/>
      <circle cx="248" cy="132" r="22" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
      <line x1="92" y1="62" x2="128" y2="76" stroke="#64748B" stroke-width="2.2" stroke-dasharray="4 3"/>
      <line x1="228" y1="62" x2="192" y2="76" stroke="#64748B" stroke-width="2.2" stroke-dasharray="4 3"/>
      <line x1="92" y1="122" x2="128" y2="106" stroke="#64748B" stroke-width="2.2" stroke-dasharray="4 3"/>
      <line x1="228" y1="122" x2="192" y2="106" stroke="#64748B" stroke-width="2.2" stroke-dasharray="4 3"/>
    `;
  }

  function renderDiagramPin(els, board) {
    renderTopBanner(els, board.title || 'Rajah Berlabel', board.promptPill || 'Klik pin untuk semak');
    els.mainVisualCard.className = 'sketch-card diagram-pin-card';

    const pins = Array.isArray(board.pins) ? board.pins : [];
    const baseSvg = buildConceptDiagramSVG(board.diagramType || 'concept-hub');
    const usesPercent = pins.length > 0 && pins.every((p) => Number(p.x) <= 100 && Number(p.y) <= 100);

    const pinsSvg = pins
      .map((p, idx) => {
        const rawX = Number(p.x);
        const rawY = Number(p.y);
        const scaledX = usesPercent && Number.isFinite(rawX) ? (rawX / 100) * 320 : rawX;
        const scaledY = usesPercent && Number.isFinite(rawY) ? (rawY / 100) * 180 : rawY;
        const px = Math.max(24, Math.min(296, Number.isFinite(scaledX) ? scaledX : 70 + idx * 80));
        const py = Math.max(24, Math.min(156, Number.isFinite(scaledY) ? scaledY : 90));
        const col = esc(p.color || '#4F46E5');
        const ring = p.highlight ? `<circle cx="${px}" cy="${py}" r="18" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="3 3"/>` : '';
        return `
          <g class="svg-pin-group" data-pin-idx="${idx}" style="cursor:pointer;">
            ${ring}
            <circle cx="${px}" cy="${py}" r="12" fill="${col}" stroke="#FFFFFF" stroke-width="2.5"/>
            <text x="${px}" y="${py + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#FFFFFF">${idx + 1}</text>
          </g>
        `;
      })
      .join('');

    const pinChips = pins
      .map((p, idx) => {
        const col = esc(p.color || '#4F46E5');
        return `
          <button type="button" class="pin-chip ${p.highlight ? 'is-active' : ''}" data-pin-idx="${idx}" style="border-color:${col}">
            <span class="pin-dot" style="background:${col}">${idx + 1}</span>
            <span>${esc(p.label || `Titik ${idx + 1}`)}</span>
          </button>
        `;
      })
      .join('');

    const firstPin = pins.find((p) => p.highlight) || pins[0];
    const initialDetail = firstPin ? `${firstPin.label}: ${firstPin.detail || ''}` : 'Sentuh mana-mana pin pada rajah.';

    els.mainVisualCard.innerHTML = `
      <div class="diagram-wrap">
        <svg class="diagram-svg" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(board.title || 'Rajah konsep')}">
          ${baseSvg}
          ${pinsSvg}
        </svg>
        <div class="pin-chips-row">${pinChips}</div>
        <div id="diagram-pin-detail" class="diagram-pin-detail">${esc(initialDetail)}</div>
      </div>
    `;

    const detailEl = els.mainVisualCard.querySelector('#diagram-pin-detail');
    els.mainVisualCard.querySelectorAll('[data-pin-idx]').forEach((node) => {
      node.addEventListener('click', () => {
        const idx = Number(node.getAttribute('data-pin-idx'));
        const pin = pins[idx];
        if (!pin || !detailEl) return;
        CikguAjar.SFX.play('pop');
        detailEl.textContent = `${pin.label}: ${pin.detail || ''}`;
        els.mainVisualCard.querySelectorAll('.pin-chip').forEach((c) => {
          c.classList.toggle('is-active', Number(c.getAttribute('data-pin-idx')) === idx);
        });
      });
    });
  }

  /* ================= TEMPLATE 5: TIMELINE-GRAMMAR ================= */
  function renderTimelineGrammar(els, board, state) {
    renderTopBanner(els, board.title || 'Rantaian Konsep & Bahasa', board.promptPill || 'Susunan & Struktur');
    els.mainVisualCard.className = 'sketch-card timeline-grammar-card';
    const revealed = Boolean(state && state.revealed);

    if (board.variant === 'grammar') {
      const tokensHtml = (board.tokens || [])
        .map((tk) => {
          const masked = Boolean(tk.hiddenUntilSolved && !revealed);
          const hlCls = !masked ? highlightClass(tk.highlight) : '';
          return `
            <div class="grammar-token ${hlCls} ${masked ? 'is-masked' : ''}">
              <span class="grammar-word">${masked ? '???' : esc(tk.text || '')}</span>
              ${tk.role ? `<span class="grammar-role">${esc(tk.role)}</span>` : ''}
            </div>
          `;
        })
        .join('');

      const noteHtml = board.ruleNote
        ? `<div class="grammar-rule-note">${esc(board.ruleNote)}</div>`
        : '';

      els.mainVisualCard.innerHTML = `
        <div class="grammar-tokens">${tokensHtml}</div>
        ${noteHtml}
      `;
      return;
    }

    // Default: chronological cause-effect timeline
    const eventsHtml = (board.events || [])
      .map((ev, idx) => {
        const masked = Boolean(ev.hiddenUntilSolved && !revealed);
        const hlCls = !masked ? highlightClass(ev.highlight) : '';
        return `
          <div class="timeline-item ${hlCls} ${masked ? 'is-masked' : ''}">
            <div class="timeline-year">${esc(ev.year || `Fasa ${idx + 1}`)}</div>
            <div class="timeline-body">
              <div class="timeline-title">${masked ? '🔒 Kesan / Peristiwa?' : esc(ev.title || '')}</div>
              <div class="timeline-detail">${masked ? 'Jawab untuk buka rantaian kronologi ini.' : esc(ev.detail || '')}</div>
            </div>
          </div>
        `;
      })
      .join('');

    els.mainVisualCard.innerHTML = `<div class="timeline-chain">${eventsHtml}</div>`;
  }

  /* ================= DISPATCHER & MERGE ================= */
  function mergeBoard(baseBoard, patch) {
    if (!patch) return baseBoard || {};
    const merged = Object.assign({}, baseBoard || {}, patch);
    if (baseBoard && baseBoard.equation && patch.equation) {
      merged.equation = Object.assign({}, baseBoard.equation, patch.equation);
    }
    if (baseBoard && baseBoard.graph && patch.graph) {
      merged.graph = Object.assign({}, baseBoard.graph, patch.graph);
    }
    if (baseBoard && baseBoard.wrongSide && patch.wrongSide) {
      merged.wrongSide = Object.assign({}, baseBoard.wrongSide, patch.wrongSide);
    }
    if (baseBoard && baseBoard.rightSide && patch.rightSide) {
      merged.rightSide = Object.assign({}, baseBoard.rightSide, patch.rightSide);
    }
    return merged;
  }

  function renderCardBoard(templateName, els, board, state) {
    const t = templateName || 'split-trap';
    if (t === 'graph-slider') {
      renderGraphSlider(els, board);
    } else if (t === 'formula-steps') {
      renderFormulaSteps(els, board, state);
    } else if (t === 'diagram-pin') {
      renderDiagramPin(els, board, state);
    } else if (t === 'timeline-grammar') {
      renderTimelineGrammar(els, board, state);
    } else {
      renderSplitTrap(els, board, state);
    }
  }

  function showAnalogy(analogyEl, analogy) {
    if (!analogy) {
      hideAnalogy(analogyEl);
      return;
    }
    analogyEl.classList.remove('is-hidden');
    analogyEl.innerHTML = `
      <span class="analogy-tag">${esc(analogy.tag || 'Analogi SPM')}</span>
      <h3 class="analogy-title">${esc(analogy.title || '')}</h3>
      ${renderAnalogySVG(analogy.svgType || 'mastery')}
      <p class="analogy-desc">${esc(analogy.desc || '')}</p>
    `;
  }

  function hideAnalogy(analogyEl) {
    analogyEl.classList.add('is-hidden');
    analogyEl.innerHTML = '';
  }

  CikguAjar.Templates = {
    esc,
    mergeBoard,
    renderCardBoard,
    renderGraphSVG,
    renderAnalogySVG,
    showAnalogy,
    hideAnalogy
  };
})(window);
