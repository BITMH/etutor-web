(function () {
  "use strict";

  function byId(id) { return document.getElementById(id); }
  function setText(id, val) { const n = byId(id); if (n) n.textContent = String(val == null ? "" : val); }
  function mk(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined) n.textContent = String(txt);
    return n;
  }

  function resolveGradeTier(pct, grade) {
    const g = String(grade || "").toUpperCase();
    if (pct >= 70 || g.startsWith("A")) return { tier: "emerald", label: g === "A+" ? "Cemerlang Tertinggi" : "Cemerlang" };
    if (pct >= 50 || g.startsWith("B") || g.startsWith("C")) return { tier: "neutral", label: g.startsWith("B") ? "Kepujian" : "Lulus Baik" };
    if (pct >= 40 || g === "D" || g === "E") return { tier: "amber", label: "Lulus Minimum" };
    return { tier: "danger", label: "Perlu Pemulihan" };
  }

  function updatePaperSplit(breakdownText, paperSplit) {
    const objBar = byId("slipBarObj"), subBar = byId("slipBarSub");
    if (!objBar || !subBar) return;
    const objM = String(breakdownText || "").match(/Objektif:\s*(\d+)\s*\/\s*(\d+)/i);
    const subM = String(breakdownText || "").match(/Subjektif:\s*(\d+)\s*\/\s*(\d+)/i);
    let objVal = objM ? Number(objM[1]) : 0, subVal = subM ? Number(subM[1]) : 0;
    if (objVal + subVal === 0 && paperSplit && typeof paperSplit === "object") {
      objVal = Number(paperSplit.objObtained || paperSplit.obj || 0);
      subVal = Number(paperSplit.subObtained || paperSplit.sub || 0);
    }
    const total = objVal + subVal;
    const objPct = total > 0 ? Math.round((objVal / total) * 100) : 50;
    objBar.style.width = objPct + "%";
    subBar.style.width = (100 - objPct) + "%";
  }

  function appendTopicBar(listEl, name, statText, state, widthPct) {
    const li = mk("li", "slip-topic-item");
    li.setAttribute("data-state", state);
    const row = mk("div", "slip-topic-row");
    row.append(mk("span", "slip-topic-name", name), mk("span", "slip-topic-stat tabular-nums", statText));
    const track = mk("div", "slip-topic-track");
    const fill = mk("div", "slip-topic-fill");
    fill.style.width = widthPct + "%";
    track.appendChild(fill);
    li.append(row, track);
    listEl.appendChild(li);
  }

  function renderTopics(report) {
    const listEl = byId("slipTopicsList");
    if (!listEl) return;
    listEl.textContent = "";
    const allStats = Array.isArray(report.allTopicStats) && report.allTopicStats.length ? report.allTopicStats : [];
    const items = allStats.length ? allStats : (Array.isArray(report.weakTopics) ? report.weakTopics : []);
    if (!items.length) {
      return appendTopicBar(listEl, "Penguasaan kukuh (>= 60%) merentasi semua topik yang dinilai.", "Baik", "ok", 100);
    }
    items.slice(0, 14).forEach(function (it) {
      if (!it || typeof it !== "object") return;
      const pct = Math.max(0, Math.min(100, Math.round(Number(it.percentage) || 0)));
      const obt = Math.max(0, Math.round(Number(it.obtained) || 0));
      const tot = Math.max(1, Math.round(Number(it.total) || 1));
      const att = it.attempted === undefined ? true : Boolean(it.attempted);
      const state = !att ? "unattempted" : (pct >= 60 ? "ok" : (pct >= 40 ? "mid" : "weak"));
      const stat = att ? (pct + "% (" + obt + "/" + tot + ")" + (pct < 60 ? " • Ulang Kaji" : "")) : ("Belum Dijawab (" + obt + "/" + tot + ")");
      appendTopicBar(listEl, String(it.topic || "Topik"), stat, state, att ? Math.max(4, pct) : 0);
    });
  }

  function makeBulletCard(cls, headingText, listItems) {
    if (!Array.isArray(listItems) || !listItems.length) return null;
    const card = mk("div", "slip-ai-card " + cls);
    card.appendChild(mk("h3", "", headingText));
    const ul = mk("ul");
    listItems.slice(0, 6).forEach(function (t) { ul.appendChild(mk("li", "", String(t || ""))); });
    card.appendChild(ul);
    return card;
  }

  function renderAiSection(ai) {
    const sec = byId("slipAiSection");
    if (!sec) return;
    sec.textContent = "";
    if (!ai || typeof ai !== "object") { sec.hidden = true; return; }
    const wrap = mk("div", "slip-ai-report");
    const head = mk("div", "slip-ai-report-head");
    const hTitle = mk("span", "", "RINGKASAN ANALISIS CIKGU AI SPM");
    hTitle.id = "slipAiHeading";
    head.append(hTitle, mk("span", "slip-ai-pill", "Paparan Ibu Bapa"));
    wrap.appendChild(head);
    if (ai.ringkasan_prestasi) wrap.appendChild(mk("p", "slip-ai-summary", ai.ringkasan_prestasi));

    const gCard = makeBulletCard("is-good", "Kelebihan Pelajar", ai.kelebihan_pelajar);
    const wCard = makeBulletCard("is-warn", "Punca Markah Hilang", ai.punca_hilang_markah);
    if (gCard || wCard) {
      const grid = mk("div", "slip-ai-grid");
      if (gCard) grid.appendChild(gCard);
      if (wCard) grid.appendChild(wCard);
      wrap.appendChild(grid);
    }
    if (Array.isArray(ai.tajuk_ulangkaji) && ai.tajuk_ulangkaji.length) {
      const blk = mk("div", "slip-ai-block");
      blk.appendChild(mk("h3", "", "Tajuk Keutamaan Ulang Kaji"));
      const ul = mk("ul", "slip-plan-list");
      ai.tajuk_ulangkaji.slice(0, 4).forEach(function (r, idx) {
        if (!r || typeof r !== "object") return;
        const li = mk("li", "slip-plan-item"), box = mk("div");
        box.append(mk("strong", "", "#" + (r.keutamaan || idx + 1) + " " + String(r.tajuk || "Topik")));
        if (r.subtopik_fokus) box.appendChild(mk("div", "", "Fokus: " + String(r.subtopik_fokus)));
        li.appendChild(box);
        ul.appendChild(li);
      });
      blk.appendChild(ul);
      wrap.appendChild(blk);
    }
    if (Array.isArray(ai.pelan_3_hari) && ai.pelan_3_hari.length) {
      const blk = mk("div", "slip-ai-block");
      blk.appendChild(mk("h3", "", "Pelan Tindakan 3 Hari (Ulang Kaji)"));
      const ul = mk("ul", "slip-plan-list");
      ai.pelan_3_hari.slice(0, 4).forEach(function (step) {
        if (!step || typeof step !== "object") return;
        const li = mk("li", "slip-plan-item"), chk = mk("span", "slip-chk-box"), box = mk("div");
        chk.setAttribute("aria-hidden", "true");
        box.append(mk("strong", "", String(step.hari || "Hari") + ": "), document.createTextNode(String(step.tindakan || "")));
        if (step.sasaran) box.appendChild(mk("div", "", "Sasaran: " + String(step.sasaran)));
        li.append(chk, box);
        ul.appendChild(li);
      });
      blk.appendChild(ul);
      wrap.appendChild(blk);
    }
    const tipCard = makeBulletCard("is-tip", "Tip Teknik Menjawab SPM", ai.tip_teknik_menjawab);
    if (tipCard) wrap.appendChild(tipCard);
    sec.appendChild(wrap);
    sec.hidden = false;
  }

  function showError(title, message) {
    if (byId("laporanStatusBox")) byId("laporanStatusBox").hidden = true;
    if (byId("laporanSlipRoot")) byId("laporanSlipRoot").hidden = true;
    if (byId("laporanPrintBtn")) byId("laporanPrintBtn").hidden = true;
    setText("laporanErrorTitle", title || "Slip Keputusan Tidak Ditemui");
    setText("laporanErrorText", message || "Pautan laporan tidak sah atau telah tamat tempoh.");
    if (byId("laporanErrorBox")) byId("laporanErrorBox").hidden = false;
  }

  function renderSlip(report, modeLabel) {
    const slipRoot = byId("laporanSlipRoot");
    if (!slipRoot) return;
    const pct = Math.max(0, Math.min(100, Math.round(Number(report.percentage) || 0)));
    const grade = String(report.grade || "—").trim().slice(0, 6) || "—";
    const tier = resolveGradeTier(pct, grade);
    const studentName = String(report.studentName || "Pelajar").trim() || "Pelajar";
    const subject = String(report.subject || "SPM").trim() || "SPM";
    slipRoot.setAttribute("data-tier", tier.tier);
    const arcEl = byId("slipScoreArc");
    if (arcEl) arcEl.setAttribute("stroke-dashoffset", (314.16 * (1 - pct / 100)).toFixed(2));
    setText("slipModeBadge", modeLabel || "SLIP BACA-SAHAJA IBU BAPA");
    setText("slipScorePct", pct + "%");
    setText("slipGrade", grade);
    setText("slipGradeLabel", tier.label);
    setText("slipStudentName", studentName);
    setText("slipSubject", subject);
    setText("slipQuizTitle", String(report.quizTitle || "Set Latihan Interaktif").trim() || "Set Latihan Interaktif");
    setText("slipDate", report.completedAt || "—");
    const breakdown = String(report.breakdown || "").trim() || ("Markah: " + String(report.scoreText || (pct + "%")));
    setText("slipBreakdown", breakdown);
    updatePaperSplit(breakdown, report.paperSplit);
    const sharedCell = byId("slipSharedMetaCell");
    if (sharedCell) {
      sharedCell.hidden = !report.sharedAt;
      if (report.sharedAt) setText("slipSharedAt", report.sharedAt);
    }
    renderTopics(report);
    renderAiSection(report.aiAnalysis);
    document.title = "Slip Keputusan: " + studentName + " (" + subject + ") | eTutor.my";
    if (byId("laporanStatusBox")) byId("laporanStatusBox").hidden = true;
    if (byId("laporanErrorBox")) byId("laporanErrorBox").hidden = true;
    slipRoot.hidden = false;
    if (byId("laporanPrintBtn")) byId("laporanPrintBtn").hidden = false;
  }

  function decodeBase64UrlJson(rawHash) {
    const clean = String(rawHash || "").trim().replace(/-/g, "+").replace(/_/g, "/");
    if (!clean || clean.length > 4000 || !/^[A-Za-z0-9+/=]+$/.test(clean)) return null;
    const bin = atob(clean.length % 4 ? clean + "====".slice(clean.length % 4) : clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const jsonStr = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { fatal: true }).decode(bytes) : decodeURIComponent(escape(bin));
    return JSON.parse(jsonStr);
  }

  function mapGuestPayload(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const weakTopics = Array.isArray(raw.w) ? raw.w.filter(Boolean).map(function (it) {
      return {
        topic: String(it.t || it.topic || "Topik"),
        percentage: Number(it.p !== undefined ? it.p : it.percentage) || 0,
        obtained: Number(it.o !== undefined ? it.o : it.obtained) || 0,
        total: Math.max(1, Number(it.m !== undefined ? it.m : it.total) || 1),
        attempted: true
      };
    }) : [];
    const aiObj = (typeof raw.a === "string" && raw.a.trim()) ? { ringkasan_prestasi: raw.a.trim() } : (raw.a && typeof raw.a === "object" ? raw.a : null);
    return {
      studentName: String(raw.n || "Pelajar"), subject: String(raw.s || "SPM"),
      quizTitle: String(raw.q || "Set Latihan Interaktif"), percentage: Number(raw.p) || 0,
      grade: String(raw.g || "—"), breakdown: String(raw.b || ""), scoreText: String(raw.b || ""),
      completedAt: String(raw.d || ""), weakTopics: weakTopics, allTopicStats: [], paperSplit: null, aiAnalysis: aiObj, sharedAt: ""
    };
  }

  async function loadCloudReport(shareToken) {
    if (!/^[a-f0-9]{16,64}$/i.test(shareToken)) {
      return showError("Pautan Laporan Tidak Sah", "Format token pautan tidak sah. Sila minta pelajar berkongsi semula pautan Slip Ibu Bapa.");
    }
    const cfg = window.ETUTOR_CONFIG || {};
    const baseUrl = String(cfg.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    const anonKey = String(cfg.SUPABASE_ANON_KEY || "").trim();
    if (!baseUrl || !anonKey) return showError("Konfigurasi Pelayan Tidak Lengkap", "Sambungan pangkalan data laporan tidak tersedia buat masa ini.");
    try {
      const resp = await fetch(baseUrl + "/rest/v1/rpc/get_shared_exam_report", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: anonKey, Authorization: "Bearer " + anonKey },
        body: JSON.stringify({ p_share_token: shareToken })
      });
      const data = await resp.json().catch(function () { return null; });
      if (!resp.ok || !data || !data.ok || !data.report) {
        return showError("Laporan Tidak Ditemui", (data && data.error) || "Laporan ini tidak ditemui atau telah dipadam.");
      }
      renderSlip(data.report, "SLIP RASMI DISAHKAN");
    } catch (err) {
      showError("Ralat Rangkaian", "Gagal mencapai pelayan laporan. Sila semak sambungan internet dan muat semula halaman.");
    }
  }

  function initLaporanViewer() {
    const printBtn = byId("laporanPrintBtn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
    const shareToken = String(new URLSearchParams(window.location.search || "").get("s") || "").trim();
    if (shareToken) return void loadCloudReport(shareToken);
    const guestB64 = String(new URLSearchParams(String(window.location.hash || "").replace(/^#/, "")).get("g") || "").trim();
    if (guestB64) {
      try {
        const mapped = mapGuestPayload(decodeBase64UrlJson(guestB64));
        if (!mapped) return showError("Data Slip Tidak Lengkap", "Kandungan pautan ringkas ini tidak dapat dibaca.");
        return renderSlip(mapped, "SLIP BACA-SAHAJA (MOD TETAMU)");
      } catch (e) {
        return showError("Pautan Slip Rosak", "Pautan slip keputusan ini terpotong atau tidak sah.");
      }
    }
    showError("Tiada Pautan Laporan", "Sila buka pautan terus daripada mesej WhatsApp Slip Ibu Bapa yang dihantar oleh anak anda.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLaporanViewer);
  else initLaporanViewer();
})();