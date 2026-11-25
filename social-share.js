/* AUTO-GENERATED DARIPADA src/features/social-share/ OLEH scripts/build-frontend.mjs */
(function () {
  "use strict";

  // --- [features/social-share/shareTextBuilder.js] ---
  /**
   * src/features/social-share/shareTextBuilder.js
   * Penjana teks perkongsian berformat (gambar + isi + pautan di bahagian bawah)
   * merentas 4 mod: keputusan, soalan, artikel blog dan pengalaman belajar.
   */

  const REF_PATTERN = /^ET[A-Z0-9]{6,12}$/;

  function buildShareUrlWithRef(baseUrl, refCode) {
    const fallback = "https://etutor.my/";
    const raw = String(baseUrl || fallback).trim() || fallback;
    const cleanRef = String(refCode || "").trim().toUpperCase();
    if (!REF_PATTERN.test(cleanRef)) return raw;
    try {
      const u = new URL(raw, "https://etutor.my");
      if (!u.searchParams.has("ref")) u.searchParams.set("ref", cleanRef);
      return u.toString();
    } catch (e) {
      return raw;
    }
  }

  function cleanSingleLine(val, maxLen) {
    const s = String(val || "").replace(/\s+/g, " ").trim();
    return maxLen && s.length > maxLen ? s.slice(0, maxLen - 3).trim() + "..." : s;
  }

  function buildResultCopy(p, url) {
    const who = p.hideName ? "Calon SPM 2026" : (cleanSingleLine(p.studentName, 60) || "Pelajar");
    const subject = cleanSingleLine(p.subject, 50) || "SPM";
    const quizTitle = cleanSingleLine(p.quizTitle, 110) || "Set Latihan SPM";
    const pct = Math.max(0, Math.min(100, Math.round(Number(p.percentage) || 0)));
    const grade = cleanSingleLine(p.grade, 8) || "-";
    const breakdown = cleanSingleLine(p.breakdown, 120);
    const note = String(p.experienceNote || "").trim();

    const lines = [
      "*Keputusan Latihan SPM - eTutor.my*",
      "Calon: " + who,
      "Subjek: " + subject,
      "Set: " + quizTitle,
      "Skor: " + pct + "% (Gred " + grade + ")"
    ];
    if (breakdown) lines.push(breakdown);
    if (note) lines.push("", "Pengalaman saya: " + note);
    lines.push(
      "",
      "Boleh kalahkan skor ini? Cuba jawab kertas yang sama secara percuma lengkap skema di sini:",
      url
    );
    const shortText = "Skor " + pct + "% (Gred " + grade + ") untuk " + subject + " (" + quizTitle + ") di eTutor.my. Cuba set sama percuma: " + url;
    return { title: "Keputusan " + subject + " " + pct + "% (" + grade + ")", fullText: lines.join("\n"), shortText, url };
  }

  function buildQuestionCopy(p, url) {
    const subject = cleanSingleLine(p.subject, 50) || "SPM";
    const setLabel = cleanSingleLine(p.setCode || p.quizTitle, 90) || "Set Percubaan SPM";
    const topic = cleanSingleLine(p.topic, 80);
    const marks = Number(p.marks) > 0 ? " [" + Math.round(Number(p.marks)) + " Markah]" : "";
    const qText = String(p.questionText || "").trim();
    const opts = Array.isArray(p.options) ? p.options.filter(Boolean).slice(0, 5) : [];
    const letters = ["A", "B", "C", "D", "E"];

    const lines = ["*Cabaran Soalan SPM: " + subject + " (" + setLabel + ")*"];
    if (topic) lines.push("Topik: " + topic + marks);
    if (qText) {
      lines.push("", qText);
      if (opts.length > 0) {
        lines.push("");
        opts.forEach(function (opt, idx) {
          lines.push((letters[idx] || String(idx + 1)) + ". " + cleanSingleLine(opt, 180));
        });
      }
    } else {
      lines.push("", "Jom uji penguasaan topik KSSM dalam set " + cleanSingleLine(p.quizTitle || setLabel, 100) + ".");
    }
    lines.push(
      "",
      "Boleh jawab soalan SPM ini? Semak skema penuh dan cuba kertas percuma di sini:",
      url
    );

    const hookQ = qText ? cleanSingleLine(qText, 120) : ("Set " + setLabel);
    const shortText = "Cabaran " + subject + ": " + hookQ + " Jawab & semak skema penuh: " + url;
    return { title: "Cabaran Soalan SPM " + subject, fullText: lines.join("\n"), shortText, url };
  }

  function buildBlogCopy(p, url) {
    const heading = cleanSingleLine(p.title, 120) || "Tips & Panduan SPM";
    const author = cleanSingleLine(p.authorName, 50) || "Cikgu eTutor";
    const blocks = Array.isArray(p.articleBlocks) ? p.articleBlocks : [];
    const lines = ["*" + heading + "*", "Oleh " + author + " | Panduan Calon SPM 2026", ""];

    if (p.intro) lines.push(String(p.intro).trim(), "");
    if (p.reminder) lines.push("*Pesan Cikgu:* " + String(p.reminder).trim(), "");

    blocks.forEach(function (blk) {
      if (!blk) return;
      if (blk.heading) lines.push("*" + cleanSingleLine(blk.heading, 120) + "*");
      (blk.items || []).forEach(function (item) {
        if (item) lines.push(String(item).trim());
      });
      lines.push("");
    });

    if (p.closingNote) lines.push("*Kata Semangat Cikgu:* " + String(p.closingNote).trim(), "");
    lines.push("Baca di web, tanda checklist interaktif & mula latihan Trial percuma:", url);

    const hook = cleanSingleLine(p.intro || heading, 160);
    const shortText = heading + " - " + hook + " Baca panduan penuh: " + url;
    return { title: heading, fullText: lines.join("\n").replace(/\n{3,}/g, "\n\n"), shortText, url };
  }

  function buildExperienceCopy(p, url) {
    const who = p.hideName ? "Calon SPM 2026" : (cleanSingleLine(p.studentName, 60) || "Pelajar SPM");
    const setsDone = cleanSingleLine(p.setsDoneText, 60) || "Aktif berlatih";
    const avgScore = cleanSingleLine(p.avgScore, 16) || "-";
    const avgGrade = cleanSingleLine(p.avgGrade, 10) || "-";
    const xpText = cleanSingleLine(p.totalXp, 24) || "0 XP";
    const defaultNote = "Seronok ulang kaji guna eTutor.my sebab terus dapat semak skema jawapan, kenal pasti bab lemah dan baca nota interaktif terus di telefon.";
    const note = String(p.experienceNote || "").trim() || defaultNote;

    const lines = [
      "*Pengalaman & Kemajuan Ulang Kaji SPM*",
      "Pelajar: " + who,
      "Set Selesai: " + setsDone,
      "Purata Skor: " + avgScore + " (Gred " + avgGrade + ") | " + xpText,
      "",
      '"' + note + '"',
      "",
      "Jom ulang kaji soalan percubaan SPM dan nota interaktif secara percuma di sini:",
      url
    ];
    const shortText = "Rekod ulang kaji SPM di eTutor.my: " + setsDone + ", purata " + avgScore + " (" + avgGrade + "). Cuba percuma: " + url;
    return { title: "Rekod Ulang Kaji SPM - " + who, fullText: lines.join("\n"), shortText, url };
  }

  function buildShareCopy(payload) {
    const p = payload || {};
    const url = buildShareUrlWithRef(p.url || window.location.href, p.refCode);
    if (p.mode === "result") return buildResultCopy(p, url);
    if (p.mode === "question") return buildQuestionCopy(p, url);
    if (p.mode === "blog") return buildBlogCopy(p, url);
    return buildExperienceCopy(p, url);
  }

  // --- [features/social-share/shareCardCanvas.js] ---
  /**
   * src/features/social-share/shareCardCanvas.js
   * Penjana kad gambar PNG rasmi bersaiz 1080x1350 melalui HTML5 Canvas.
   */

  const CARD_W = 1080;
  const CARD_H = 1350;
  const FONT_STACK = '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif';

  function drawRoundRect(ctx, x, y, w, h, r, fillStyle, strokeStyle, lineW) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
    if (strokeStyle) { ctx.lineWidth = lineW || 2; ctx.strokeStyle = strokeStyle; ctx.stroke(); }
  }

  function wrapTextLines(ctx, text, maxWidth, maxLines) {
    const paragraphs = String(text || "").split(/\r?\n/);
    const out = [];
    for (let pi = 0; pi < paragraphs.length; pi++) {
      const words = paragraphs[pi].trim().split(/\s+/).filter(Boolean);
      if (!words.length) continue;
      let line = "";
      for (let wi = 0; wi < words.length; wi++) {
        const test = line ? line + " " + words[wi] : words[wi];
        if (ctx.measureText(test).width > maxWidth && line) {
          out.push(line);
          line = words[wi];
          if (maxLines && out.length >= maxLines) break;
        } else { line = test; }
      }
      if (maxLines && out.length >= maxLines) {
        const last = out[maxLines - 1] || "";
        out[maxLines - 1] = last.length > 4 ? last.slice(0, last.length - 3) + "..." : last + "...";
        return out.slice(0, maxLines);
      }
      if (line) out.push(line);
      if (maxLines && out.length >= maxLines) return out.slice(0, maxLines);
    }
    return out;
  }

  function drawLines(ctx, lines, x, startY, lineHeight) {
    lines.forEach(function (ln, idx) { ctx.fillText(ln, x, startY + idx * lineHeight); });
    return startY + lines.length * lineHeight;
  }

  function loadSafeImage(url) {
    return new Promise(function (resolve) {
      if (!url) { resolve(null); return; }
      const img = new Image();
      try {
        if (new URL(url, window.location.href).origin !== window.location.origin) img.crossOrigin = "anonymous";
      } catch (e) {}
      const timer = setTimeout(function () { resolve(null); }, 2500);
      img.onload = function () { clearTimeout(timer); resolve(img); };
      img.onerror = function () { clearTimeout(timer); resolve(null); };
      img.src = url;
    });
  }

  function drawCardShell(ctx, badgeLabel, badgeBg, shortUrl, ctaLabel) {
    const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(0.45, "#121e48");
    bgGrad.addColorStop(1, "#1e3a8a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    ctx.fillStyle = "rgba(37, 99, 235, 0.16)";
    ctx.beginPath();
    ctx.arc(960, 140, 260, 0, Math.PI * 2);
    ctx.fill();

    drawRoundRect(ctx, 64, 56, 62, 62, 16, "#059669");
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 32px " + FONT_STACK;
    ctx.textBaseline = "middle";
    ctx.fillText("eT", 75, 89);

    ctx.font = "800 38px " + FONT_STACK;
    ctx.fillText("eTutor.my", 142, 78);
    ctx.font = "500 21px " + FONT_STACK;
    ctx.fillStyle = "#93c5fd";
    ctx.fillText("Portal Ulang Kaji Interaktif SPM", 142, 110);

    ctx.font = "700 22px " + FONT_STACK;
    const pillW = Math.min(390, ctx.measureText(badgeLabel).width + 52);
    drawRoundRect(ctx, CARD_W - 64 - pillW, 62, pillW, 48, 24, badgeBg || "#059669");
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(badgeLabel, CARD_W - 64 - pillW / 2, 87);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    drawRoundRect(ctx, 64, 1170, CARD_W - 128, 124, 24, "#0b132b", "rgba(147, 197, 253, 0.35)", 2);
    ctx.fillStyle = "#34d399";
    ctx.font = "800 26px " + FONT_STACK;
    ctx.fillText(ctaLabel || "Cuba percuma lengkap skema KSSM:", 96, 1222);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 23px " + FONT_STACK;
    const displayUrl = String(shortUrl || "etutor.my").replace(/^https?:\/\//i, "");
    ctx.fillText(wrapTextLines(ctx, displayUrl, CARD_W - 200, 1)[0] || "etutor.my", 96, 1264);
  }

  function drawResultBody(ctx, p) {
    drawRoundRect(ctx, 64, 160, CARD_W - 128, 976, 30, "#ffffff");
    const pct = Math.max(0, Math.min(100, Math.round(Number(p.percentage) || 0)));
    const grade = String(p.grade || "-").slice(0, 6);
    const accent = pct >= 70 ? "#059669" : (pct >= 50 ? "#2563eb" : "#d97706");

    drawRoundRect(ctx, 108, 210, 260, 260, 130, "#f0fdf4", accent, 10);
    ctx.textAlign = "center";
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 76px " + FONT_STACK;
    ctx.fillText(pct + "%", 238, 336);
    ctx.fillStyle = accent;
    ctx.font = "800 34px " + FONT_STACK;
    ctx.fillText("GRED " + grade, 238, 396);
    ctx.textAlign = "left";

    ctx.fillStyle = "#64748b";
    ctx.font = "700 24px " + FONT_STACK;
    ctx.fillText("CALON SPM 2026", 408, 248);
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 38px " + FONT_STACK;
    const who = p.hideName ? "Calon SPM 2026" : (p.studentName || "Pelajar");
    ctx.fillText(wrapTextLines(ctx, who, 560, 1)[0] || "Pelajar", 408, 298);
    ctx.fillStyle = "#2563eb";
    ctx.font = "700 26px " + FONT_STACK;
    ctx.fillText(wrapTextLines(ctx, p.subject || "SPM", 560, 1)[0], 408, 348);
    ctx.fillStyle = "#334155";
    ctx.font = "600 26px " + FONT_STACK;
    drawLines(ctx, wrapTextLines(ctx, p.quizTitle || "Set Latihan SPM", 560, 3), 408, 396, 36);

    drawRoundRect(ctx, 108, 520, CARD_W - 216, 110, 20, "#f8fafc", "#cbd5e1", 2);
    ctx.fillStyle = "#475569";
    ctx.font = "700 22px " + FONT_STACK;
    ctx.fillText("PECAHAN MARKAH", 138, 562);
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 26px " + FONT_STACK;
    ctx.fillText(wrapTextLines(ctx, p.breakdown || ("Markah Penuh: " + pct + "%"), CARD_W - 276, 1)[0], 138, 604);

    const note = String(p.experienceNote || "").trim() || "Jom banding skor kita! Buka set kertas percubaan SPM ini secara percuma dan semak jawapan automatik.";
    drawRoundRect(ctx, 108, 668, CARD_W - 216, 412, 24, "#eff6ff", "#bfdbfe", 2);
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "800 25px " + FONT_STACK;
    ctx.fillText("CATATAN PELAJAR", 142, 718);
    ctx.fillStyle = "#1e293b";
    ctx.font = "600 32px " + FONT_STACK;
    drawLines(ctx, wrapTextLines(ctx, note, CARD_W - 284, 6), 142, 774, 46);
  }

  function drawQuestionBody(ctx, p) {
    drawRoundRect(ctx, 64, 160, CARD_W - 128, 976, 30, "#ffffff");
    ctx.fillStyle = "#1d4ed8";
    ctx.font = "800 25px " + FONT_STACK;
    const metaTop = [p.subject || "SPM", p.setCode || "", p.marks ? p.marks + " Markah" : ""].filter(Boolean).join("  |  ");
    ctx.fillText(wrapTextLines(ctx, metaTop, CARD_W - 200, 1)[0], 108, 224);
    if (p.topic) {
      ctx.fillStyle = "#475569";
      ctx.font = "600 23px " + FONT_STACK;
      ctx.fillText(wrapTextLines(ctx, "Topik: " + p.topic, CARD_W - 200, 1)[0], 108, 264);
    }
    const qRaw = String(p.questionText || "").trim() || ("Uji penguasaan anda dalam set " + (p.quizTitle || p.setCode || "Percubaan SPM") + ". Klik pautan di bawah untuk mula menjawab.");
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 32px " + FONT_STACK;
    let cursorY = drawLines(ctx, wrapTextLines(ctx, qRaw, CARD_W - 216, 9), 108, 326, 44) + 22;
    const opts = Array.isArray(p.options) ? p.options.filter(Boolean).slice(0, 4) : [];
    const letters = ["A", "B", "C", "D"];
    opts.forEach(function (opt, idx) {
      if (cursorY > 1010) return;
      const textLine = (letters[idx] || String(idx + 1)) + ". " + String(opt).replace(/\s+/g, " ").trim();
      ctx.font = "600 25px " + FONT_STACK;
      const optWrapped = wrapTextLines(ctx, textLine, CARD_W - 264, 2);
      const boxH = 34 + optWrapped.length * 32;
      drawRoundRect(ctx, 108, cursorY, CARD_W - 216, boxH, 16, "#f8fafc", "#e2e8f0", 2);
      ctx.fillStyle = "#1e293b";
      drawLines(ctx, optWrapped, 132, cursorY + 38, 32);
      cursorY += boxH + 14;
    });
    if (opts.length === 0) {
      const boxY = Math.max(cursorY + 20, 790);
      drawRoundRect(ctx, 108, boxY, CARD_W - 216, 170, 22, "#ecfdf5", "#a7f3d0", 2);
      ctx.fillStyle = "#065f46";
      ctx.font = "800 29px " + FONT_STACK;
      ctx.fillText("Anda rasa jawapannya apa?", 142, boxY + 64);
      ctx.font = "600 24px " + FONT_STACK;
      ctx.fillText("Semak skema pemarkahan KSSM terus pada pautan di bawah.", 142, boxY + 110);
    }
  }

  function drawBlogBody(ctx, p, coverImg) {
    drawRoundRect(ctx, 64, 160, CARD_W - 128, 976, 30, "#ffffff");
    const imgX = 104, imgY = 198, imgW = CARD_W - 208, imgH = 490;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 22);
    ctx.clip();
    if (coverImg) { ctx.drawImage(coverImg, imgX, imgY, imgW, imgH); }
    else {
      const g = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
      g.addColorStop(0, "#1e3a8a"); g.addColorStop(1, "#059669");
      ctx.fillStyle = g; ctx.fillRect(imgX, imgY, imgW, imgH);
    }
    ctx.restore();
    ctx.fillStyle = "#2563eb";
    ctx.font = "800 24px " + FONT_STACK;
    ctx.fillText((p.category || "PANDUAN CIKGU SPM").toUpperCase(), 108, 742);
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 42px " + FONT_STACK;
    const nextY = drawLines(ctx, wrapTextLines(ctx, p.title || "Tips & Panduan SPM", CARD_W - 216, 3), 108, 800, 54);
    const boxY = Math.max(nextY + 12, 950);
    drawRoundRect(ctx, 108, boxY, CARD_W - 216, 154, 20, "#fffbeb", "#fcd34d", 2);
    ctx.fillStyle = "#92400e";
    ctx.font = "700 24px " + FONT_STACK;
    drawLines(ctx, wrapTextLines(ctx, "Pesan Cikgu: " + String(p.reminder || p.intro || "").trim(), CARD_W - 264, 3), 134, boxY + 40, 36);
  }

  function drawExperienceBody(ctx, p) {
    drawRoundRect(ctx, 64, 160, CARD_W - 128, 976, 30, "#ffffff");
    const who = p.hideName ? "Calon SPM 2026" : (p.studentName || "Pelajar SPM");
    ctx.fillStyle = "#64748b";
    ctx.font = "700 24px " + FONT_STACK;
    ctx.fillText("CATATAN PERJALANAN SPM", 108, 224);
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 42px " + FONT_STACK;
    ctx.fillText(wrapTextLines(ctx, who, CARD_W - 216, 1)[0], 108, 280);
    const tiles = [
      { lbl: "SET SELESAI", val: p.setsDoneText || "0 set", bg: "#eff6ff", col: "#1d4ed8" },
      { lbl: "PURATA / GRED", val: (p.avgScore || "0%") + " (" + (p.avgGrade || "-") + ")", bg: "#ecfdf5", col: "#047857" },
      { lbl: "MATA XP", val: p.totalXp || "0 XP", bg: "#fffbeb", col: "#b45309" }
    ];
    tiles.forEach(function (t, i) {
      const ty = 324 + i * 124;
      drawRoundRect(ctx, 108, ty, CARD_W - 216, 102, 20, t.bg);
      ctx.fillStyle = "#475569"; ctx.font = "700 21px " + FONT_STACK; ctx.fillText(t.lbl, 140, ty + 40);
      ctx.fillStyle = t.col; ctx.font = "800 34px " + FONT_STACK; ctx.fillText(wrapTextLines(ctx, t.val, CARD_W - 280, 1)[0], 140, ty + 82);
    });
    const note = String(p.experienceNote || "").trim() || "Ulang kaji jadi lebih tersusun sebab terus nampak bab lemah dan boleh buka nota interaktif serta skema jawapan di telefon.";
    drawRoundRect(ctx, 108, 720, CARD_W - 216, 366, 24, "#f8fafc", "#cbd5e1", 2);
    ctx.fillStyle = "#1e3a8a"; ctx.font = "800 24px " + FONT_STACK; ctx.fillText("KONGSI PENGALAMAN", 142, 770);
    ctx.fillStyle = "#0f172a"; ctx.font = "600 31px " + FONT_STACK;
    drawLines(ctx, wrapTextLines(ctx, note, CARD_W - 284, 5), 142, 826, 46);
  }

  async function renderShareCard(payload, resolvedUrl) {
    const p = payload || {};
    const canvas = document.createElement("canvas");
    canvas.width = CARD_W; canvas.height = CARD_H;
    const ctx = canvas.getContext("2d");
    const meta = {
      result: ["KEPUTUSAN SPM", "#059669", "Cuba kalahkan skor ini percuma di:"],
      question: ["CABARAN SOALAN", "#2563eb", "Jawab & semak skema penuh di:"],
      blog: ["TIPS CIKGU SPM", "#d97706", "Baca artikel & checklist penuh di:"],
      experience: ["REKOD BELAJAR", "#059669", "Ulang kaji Trial SPM percuma di:"]
    }[p.mode] || ["ETUTOR SPM", "#059669", "Ulang kaji percuma di:"];
    drawCardShell(ctx, meta[0], meta[1], resolvedUrl, meta[2]);
    if (p.mode === "result") drawResultBody(ctx, p);
    else if (p.mode === "question") drawQuestionBody(ctx, p);
    else if (p.mode === "blog") drawBlogBody(ctx, p, await loadSafeImage(p.coverImageUrl));
    else drawExperienceBody(ctx, p);

    let dataUrl = "", blob = null;
    try {
      dataUrl = canvas.toDataURL("image/png");
      blob = await new Promise(function (res) { canvas.toBlob(res, "image/png"); });
    } catch (e) {}
    const filename = "etutor-" + (p.mode || "kongsi") + "-spm.png";
    const file = blob && typeof File === "function" ? new File([blob], filename, { type: "image/png" }) : null;
    return { dataUrl, blob, file, filename };
  }

  // --- [features/social-share/shareActions.js] ---
  /**
   * src/features/social-share/shareActions.js
   * Pengendali perkongsian medsos: Web Share API (gambar + teks + pautan),
   * WhatsApp, Telegram, muat turun kad PNG dan salin teks penuh ke papan keratan.
   */

  async function copyTextToClipboard(text) {
    const clean = String(text || "");
    if (!clean) return false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(clean);
        return true;
      }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = clean;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.parentNode.removeChild(ta);
      return Boolean(ok);
    } catch (e) {
      return false;
    }
  }

  function downloadPngBlob(blob, dataUrl, filename) {
    const name = filename || "etutor-kad-spm.png";
    let href = dataUrl || "";
    let objUrl = "";
    if (blob && typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      objUrl = URL.createObjectURL(blob);
      href = objUrl;
    }
    if (!href) return false;
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    if (objUrl) setTimeout(function () { URL.revokeObjectURL(objUrl); }, 2500);
    return true;
  }

  async function shareNativeWithImage(opts) {
    const { file, blob, dataUrl, filename, title, text } = opts || {};
    if (file && navigator.share && navigator.canShare) {
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: title || "eTutor.my SPM", text: text || "" });
          return { ok: true, method: "native_file" };
        }
      } catch (err) {
        if (err && err.name === "AbortError") return { ok: false, aborted: true };
      }
    }
    downloadPngBlob(blob, dataUrl, filename);
    const copied = await copyTextToClipboard(text);
    return { ok: true, fallbackUsed: true, copied };
  }

  function buildWhatsAppSafeText(fullText, url) {
    const raw = String(fullText || "");
    if (encodeURIComponent(raw).length <= 3600) return raw;
    const suffix = "\n\nBaca panduan penuh & tanda checklist di laman web:\n" + String(url || "");
    const sliceLen = Math.max(400, 1100);
    return raw.slice(0, sliceLen).trim() + "..." + suffix;
  }

  function openWhatsAppShare(fullText, url) {
    const safeText = buildWhatsAppSafeText(fullText, url);
    window.open("https://wa.me/?text=" + encodeURIComponent(safeText), "_blank", "noopener,noreferrer");
  }

  function openTelegramShare(url, fullText) {
    const body = String(fullText || "").replace(String(url || ""), "").trim().slice(0, 800);
    window.open(
      "https://t.me/share/url?url=" + encodeURIComponent(url || "") + "&text=" + encodeURIComponent(body),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function openXShare(shortText) {
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(shortText || ""), "_blank", "noopener,noreferrer");
  }

  // --- [features/social-share/socialShareModalController.js] ---
  /**
   * src/features/social-share/socialShareModalController.js
   * Pengawal dialog kongsi bersepadu (#etutorSocialShareDialog) + pengikat butang
   * halaman statik SEO (/tips-spm/, /soalan-percubaan-spm/, /soalan-klon-spm/).
   */



  const shareState = { payload: null, copy: null, card: null, debounceTimer: null, statusTimer: null };

  function setShareStatus(msg, isError) {
    const el = document.getElementById("etShareStatusMsg");
    if (!el) return;
    el.textContent = msg || "";
    el.hidden = !msg;
    el.setAttribute("data-error", isError ? "true" : "false");
    clearTimeout(shareState.statusTimer);
    if (msg) shareState.statusTimer = setTimeout(function () { el.hidden = true; }, 4500);
  }

  async function refreshShareArtifacts() {
    if (!shareState.payload) return;
    const copy = buildShareCopy(shareState.payload);
    shareState.copy = copy;
    const ta = document.getElementById("etShareTextPreview");
    if (ta) ta.value = copy.fullText;
    const imgEl = document.getElementById("etSharePreviewImg");
    if (imgEl) imgEl.style.opacity = "0.55";
    const card = await renderShareCard(shareState.payload, copy.url);
    shareState.card = card;
    if (imgEl && card.dataUrl) { imgEl.src = card.dataUrl; imgEl.style.opacity = "1"; }
  }

  function createModalMarkup() {
    const dlg = document.createElement("dialog");
    dlg.id = "etutorSocialShareDialog";
    dlg.className = "et-share-dialog";
    dlg.setAttribute("closedby", "any");
    dlg.setAttribute("aria-labelledby", "etShareHeading");
    dlg.innerHTML = [
      '<div class="et-share-head"><div><h2 id="etShareHeading" class="et-share-title">Kongsi Ke Media Sosial</h2><p class="et-share-sub">Kad gambar PNG dijana automatik bersama teks penuh dan pautan.</p></div><button type="button" id="etShareCloseBtn" class="btn btn-outline btn-sm">Tutup</button></div>',
      '<div class="et-share-layout">',
      '  <div class="et-share-preview-pane"><img id="etSharePreviewImg" alt="Pratonton Kad Gambar eTutor" width="540" height="675"></div>',
      '  <div class="et-share-controls-pane">',
      '    <label id="etShareHideNameRow" class="et-share-check" hidden><input type="checkbox" id="etShareHideNameChk"><span>Sembunyikan nama penuh pada kad &amp; teks</span></label>',
      '    <div id="etShareNoteWrap" class="et-share-field" hidden><label id="etShareNoteLabel" for="etShareNoteInput">Catatan pengalaman anda (pilihan)</label><textarea id="etShareNoteInput" class="et-share-textarea" rows="3" maxlength="320" placeholder="Contoh: Alhamdulillah meningkat berbanding set lalu..."></textarea></div>',
      '    <div class="et-share-field"><label for="etShareTextPreview">Teks &amp; Pautan Yang Akan Dikongsi (Boleh Disunting)</label><textarea id="etShareTextPreview" class="et-share-textarea et-share-copybox" rows="7"></textarea></div>',
      '    <div class="et-share-actions-grid"><button type="button" id="etShareNativeBtn" class="btn btn-emerald et-share-btn-wide">Kongsi Gambar + Teks</button><button type="button" id="etShareWaBtn" class="btn btn-outline">WhatsApp</button><button type="button" id="etShareTgBtn" class="btn btn-outline">Telegram</button><button type="button" id="etShareCopyBtn" class="btn btn-outline">Salin Teks + Link</button><button type="button" id="etShareDownloadBtn" class="btn btn-outline">Muat Turun Gambar</button></div>',
      '    <p id="etShareStatusMsg" class="et-share-status" role="status" hidden></p>',
      '  </div>',
      '</div>'
    ].join("");
    document.body.appendChild(dlg);
    return dlg;
  }

  function bindModalControls(dlg) {
    if (!dlg || dlg.dataset.bound === "1") return;
    dlg.dataset.bound = "1";
    dlg.querySelector("#etShareCloseBtn").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });
    dlg.querySelector("#etShareHideNameChk").addEventListener("change", function (ev) {
      if (!shareState.payload) return;
      shareState.payload.hideName = Boolean(ev.target.checked);
      refreshShareArtifacts();
    });
    dlg.querySelector("#etShareNoteInput").addEventListener("input", function (ev) {
      if (!shareState.payload) return;
      if (shareState.payload.mode === "question" && shareState.payload.allowQuestionEdit) shareState.payload.questionText = ev.target.value;
      else shareState.payload.experienceNote = ev.target.value;
      clearTimeout(shareState.debounceTimer);
      shareState.debounceTimer = setTimeout(refreshShareArtifacts, 240);
    });

    const currentText = function () {
      const el = dlg.querySelector("#etShareTextPreview");
      return (el && el.value) || (shareState.copy && shareState.copy.fullText) || "";
    };

    dlg.querySelector("#etShareNativeBtn").addEventListener("click", async function () {
      const c = shareState.card || {};
      const res = await shareNativeWithImage({ file: c.file, blob: c.blob, dataUrl: c.dataUrl, filename: c.filename, title: shareState.copy && shareState.copy.title, text: currentText() });
      if (res && res.fallbackUsed) setShareStatus("Gambar dimuat turun dan teks + pautan telah disalin. Tampal terus di Facebook, IG atau WhatsApp Web.");
      else if (res && res.ok) setShareStatus("Berjaya dibuka di menu kongsi peranti anda.");
    });
    dlg.querySelector("#etShareWaBtn").addEventListener("click", function () {
      openWhatsAppShare(currentText(), shareState.copy && shareState.copy.url);
      setShareStatus("WhatsApp dibuka bersama teks dan pautan. Anda juga boleh muat turun kad gambar jika mahu.");
    });
    dlg.querySelector("#etShareTgBtn").addEventListener("click", function () {
      openTelegramShare(shareState.copy && shareState.copy.url, currentText());
    });
    dlg.querySelector("#etShareCopyBtn").addEventListener("click", async function () {
      const ok = await copyTextToClipboard(currentText());
      setShareStatus(ok ? "Teks penuh dan pautan disalin ke papan keratan!" : "Gagal menyalin teks.", !ok);
    });
    dlg.querySelector("#etShareDownloadBtn").addEventListener("click", function () {
      const c = shareState.card || {};
      const ok = downloadPngBlob(c.blob, c.dataUrl, c.filename);
      setShareStatus(ok ? "Kad gambar PNG disimpan untuk IG Story, TikTok atau Facebook." : "Kad gambar belum bersedia.", !ok);
    });
  }

  async function openShareModal(payload) {
    const dlg = document.getElementById("etutorSocialShareDialog") || createModalMarkup();
    bindModalControls(dlg);
    shareState.payload = Object.assign({ hideName: false, experienceNote: "" }, payload || {});
    const isIdentityMode = shareState.payload.mode === "result" || shareState.payload.mode === "experience";
    dlg.querySelector("#etShareHideNameRow").hidden = !isIdentityMode;
    dlg.querySelector("#etShareHideNameChk").checked = Boolean(shareState.payload.hideName);

    const noteWrap = dlg.querySelector("#etShareNoteWrap");
    const noteLbl = dlg.querySelector("#etShareNoteLabel");
    const noteInp = dlg.querySelector("#etShareNoteInput");
    noteWrap.hidden = !(isIdentityMode || shareState.payload.allowQuestionEdit);
    noteLbl.textContent = shareState.payload.mode === "question"
      ? "Tampal atau taip soalan pilihan untuk kad gambar (pilihan)"
      : "Catatan pengalaman anda (pilihan)";
    noteInp.placeholder = shareState.payload.mode === "question"
      ? "Taip atau tampal petikan soalan SPM dari skrin untuk dipaparkan atas kad..."
      : "Tulis catatan ringkas pengalaman anda belajar set ini...";
    noteInp.value = shareState.payload.mode === "question"
      ? (shareState.payload.questionText || "")
      : (shareState.payload.experienceNote || "");

    setShareStatus("");
    if (!dlg.open) {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    }
    await refreshShareArtifacts();
  }

  function readCanonicalUrl() {
    const link = document.querySelector('link[rel="canonical"]');
    return (link && link.href) || window.location.href;
  }

  function extractBlogPayload() {
    const art = document.querySelector("article.seo-hero-box");
    if (!art) return null;
    const h1 = art.querySelector("h1");
    const img = art.querySelector(".tips-hero-figure img");
    const authorEl = art.querySelector(".tips-author-pill");
    const catEl = art.querySelector(".status-badge.badge-subject");
    const remEl = art.querySelector(".seo-reminder-box");
    const closingEl = art.querySelectorAll(".seo-reminder-box")[1];
    const introEl = art.querySelector(".tips-hero-figure ~ p") || art.querySelector("p");

    const sections = [];
    art.querySelectorAll("section").forEach(function (sec) {
      const sh = sec.querySelector("h2");
      const items = [];
      sec.querySelectorAll("p, li, .tips-cmp-bad, .tips-cmp-good, .tips-time-step").forEach(function (n) {
        const txt = n.textContent.replace(/\s+/g, " ").trim();
        if (txt) items.push("- " + txt);
      });
      if (sh || items.length) sections.push({ heading: sh ? sh.textContent.trim() : "", items });
    });

    return {
      mode: "blog",
      title: h1 ? h1.textContent.trim() : document.title,
      authorName: authorEl ? authorEl.textContent.replace(/Ditulis oleh/i, "").trim() : "Cikgu eTutor",
      category: catEl ? catEl.textContent.trim() : "Tips Exam SPM",
      coverImageUrl: img ? img.src : "",
      intro: introEl ? introEl.textContent.trim() : "",
      reminder: remEl ? remEl.textContent.replace(/Pesan Cikgu eTutor:/i, "").trim() : "",
      closingNote: closingEl ? closingEl.textContent.replace(/Kata Semangat Cikgu:/i, "").trim() : "",
      articleBlocks: sections,
      url: readCanonicalUrl()
    };
  }

  function extractQuestionPayload(articleEl) {
    const h1 = document.getElementById("setMainHeading");
    const crumbs = document.querySelectorAll(".seo-breadcrumb li");
    const subject = crumbs.length >= 5 ? crumbs[4].textContent.trim() : "SPM";
    const setCode = crumbs.length >= 7 ? crumbs[6].textContent.trim() : "";
    const headText = articleEl.querySelector("div") ? articleEl.querySelector("div").textContent : "";
    const marksMatch = headText.match(/\[(\d+)\s*Markah\]/i);
    const qPara = articleEl.querySelector("p");
    const opts = Array.from(articleEl.querySelectorAll(".seo-preview-opts li")).map(function (li) {
      return li.textContent.replace(/^[A-E0-9]+\.\s*/i, "").trim();
    });
    return {
      mode: "question",
      subject,
      setCode,
      quizTitle: h1 ? h1.textContent.trim() : "",
      topic: headText.replace(/Contoh\s*\d+\s*[^a-zA-Z0-9]*|\[\d+\s*Markah\]/gi, "").trim(),
      marks: marksMatch ? Number(marksMatch[1]) : 0,
      questionText: qPara ? qPara.textContent.trim() : "",
      options: opts,
      url: readCanonicalUrl()
    };
  }

  function bindSeoShareButtons() {
    if (document.documentElement.dataset.etShareBound === "1") return;
    document.documentElement.dataset.etShareBound = "1";
    document.addEventListener("click", async function (ev) {
      const blogBtn = ev.target.closest("[data-et-share-blog]");
      if (blogBtn) {
        const p = extractBlogPayload();
        if (!p) return;
        const action = blogBtn.getAttribute("data-et-share-action") || "modal";
        if (action === "whatsapp") openWhatsAppShare(buildShareCopy(p).fullText, p.url);
        else if (action === "copy") {
          const ok = await copyTextToClipboard(buildShareCopy(p).fullText);
          blogBtn.textContent = ok ? "Disalin + Pautan!" : "Gagal Salin";
          setTimeout(function () { blogBtn.textContent = "Salin Posting Penuh + Link"; }, 2600);
        } else openShareModal(p);
        return;
      }
      const qBtn = ev.target.closest("[data-et-share-question]");
      if (qBtn) {
        const itemEl = qBtn.closest("article.seo-preview-item");
        if (itemEl) openShareModal(extractQuestionPayload(itemEl));
        return;
      }
      if (ev.target.closest("[data-et-share-set]")) {
        const firstQ = document.querySelector("article.seo-preview-item");
        if (firstQ) openShareModal(extractQuestionPayload(firstQ));
        else openShareModal({ mode: "question", subject: "SPM", quizTitle: (document.getElementById("setMainHeading") || {}).textContent || document.title, url: readCanonicalUrl() });
      }
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindSeoShareButtons);
    else bindSeoShareButtons();
  }

  window.ETutorShare = { openShareModal, bindSeoShareButtons };
})();
