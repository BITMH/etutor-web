(function () {
  "use strict";

  var R = window.ETGuruRubric;

  function csvCell(v) {
    return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  }

  function renderReportsTab(state) {
    var host = document.getElementById("guruTabReports");
    if (!host) return;
    var detail = state.classDetail;
    if (!detail || !detail.classInfo) {
      host.innerHTML = '<div class="g-card"><p class="g-muted">Pilih kelas terlebih dahulu untuk melihat Matriks PBD dan laporan guru.</p></div>';
      return;
    }

    var cls = detail.classInfo;
    var students = detail.students || [];
    var assigns = (detail.assignments || []).slice().reverse();
    var subs = detail.submissions || [];

    var printMeta = document.getElementById("guruPrintMeta");
    if (printMeta) {
      var prof = state.profile || {};
      printMeta.textContent = (prof.schoolName || "") + " • Guru: " + (prof.displayName || "") + " • Kelas: " + cls.className + " (" + cls.subject + ")";
    }

    var doneSubs = subs.filter(function (s) { return s.status === "submitted" || s.status === "graded"; });
    var pctDone = subs.length ? Math.round((doneSubs.length / subs.length) * 100) : 0;
    var scored = subs.filter(function (s) { return s.teacherScore !== null || s.quizPercentage != null || s.autoMcqScore !== null; });
    var avgPct = scored.length ? Math.round(scored.reduce(function (sum, s) {
      if (s.teacherScore !== null) return sum + (Number(s.teacherScore) / Math.max(1, Number(s.teacherMaxScore || 10))) * 100;
      if (s.quizPercentage != null) return sum + Number(s.quizPercentage);
      return sum + (Number(s.autoMcqScore || 0) / Math.max(1, Number(s.autoMcqTotal || 10))) * 100;
    }, 0) / scored.length) : 0;

    var tpReady = subs.filter(function (s) { return Number(s.teacherTp || R.suggestTpClient(s) || 0) >= 3; }).length;
    var tpNeedHelp = subs.filter(function (s) {
      var tp = Number(s.teacherTp || R.suggestTpClient(s) || 0);
      return tp > 0 && tp <= 2;
    }).length;

    var headCols = assigns.map(function (a, i) {
      return '<th title="' + R.esc(a.title) + '">T' + (i + 1) + ": " + R.esc(String(a.title || "").slice(0, 18)) + "</th>";
    }).join("");

    var bodyRows = students.length ? students.map(function (st, idx) {
      var cells = assigns.map(function (a) {
        var sub = subs.find(function (s) { return s.assignmentId === a.id && s.studentId === st.studentId; });
        var tp = sub && (sub.teacherTp || R.suggestTpClient(sub));
        var hasQuiz = sub && sub.quizPercentage != null;
        var sc = sub && (sub.teacherScore !== null ? sub.teacherScore : (hasQuiz ? sub.quizPercentage : sub.autoMcqScore));
        var mx = sub ? (sub.teacherMaxScore || (hasQuiz ? 100 : (sub.autoMcqTotal || 10))) : 10;
        if (!sub || (sub.status === "not_started" && !tp)) return '<td><span class="g-muted">—</span></td>';
        var pillCls = tp >= 5 ? "g-pill-green" : (tp >= 3 ? "g-pill-blue" : "g-pill-amber");
        var scoreLbl = sc !== null && sc !== undefined ? (mx === 100 ? (" (" + sc + "%)") : (" (" + sc + "/" + mx + ")")) : "";
        var label = (sub.teacherTp ? "TP" + tp : (tp ? "~TP" + tp : "Hantar")) + scoreLbl;
        return '<td><span class="g-pill ' + pillCls + '">' + R.esc(label) + "</span></td>";
      }).join("");
      return "<tr><td>" + (idx + 1) + "</td><td><strong>" + R.esc(st.studentName) + "</strong></td>" + cells + "</tr>";
    }).join("") : '<tr><td colspan="' + (assigns.length + 2) + '" class="g-muted">Tiada pelajar dalam kelas ini.</td></tr>';

    host.innerHTML =
      '<div class="g-stack">' +
      '  <div class="g-grid-4">' +
      '    <div class="g-kpi-card"><div class="g-kpi-lbl">Kadar Siap Kelas</div><div class="g-kpi-val">' + pctDone + "%</div></div>" +
      '    <div class="g-kpi-card"><div class="g-kpi-lbl">Purata Skor</div><div class="g-kpi-val">' + avgPct + "%</div></div>" +
      '    <div class="g-kpi-card"><div class="g-kpi-lbl">Capai TP3 – TP6</div><div class="g-kpi-val" style="color:var(--g-emerald)">' + tpReady + " Rekod</div></div>" +
      '    <div class="g-kpi-card"><div class="g-kpi-lbl">Perlu Bimbingan (TP1–TP2)</div><div class="g-kpi-val" style="color:var(--g-amber)">' + tpNeedHelp + " Rekod</div></div>" +
      "  </div>" +
      '  <div class="g-card g-stack">' +
      '    <div class="g-row-between">' +
      '      <div><span class="g-eyebrow">Rekod Eviden &amp; Rujukan idMe / SPPB</span><h2>Matriks PBD: ' + R.esc(cls.className) + " (" + R.esc(cls.subject) + ")</h2></div>" +
      '      <div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '        <button type="button" id="guruExportCsvBtn" class="g-btn g-btn-sm g-btn-emerald">Muat Turun CSV PBD (Excel)</button>' +
      '        <button type="button" id="guruPrintPdfBtn" class="g-btn g-btn-sm g-btn-outline">Cetak / Simpan PDF Eviden</button>' +
      "      </div>" +
      "    </div>" +
      '    <div class="g-table-wrap"><table class="g-table"><thead><tr><th>#</th><th>Nama Pelajar</th>' + headCols + "</tr></thead><tbody>" + bodyRows + "</tbody></table></div>" +
      '    <p class="g-muted">Nota: Label <strong>TPx</strong> bermaksud telah disahkan oleh guru; <strong>~TPx</strong> ialah cadangan automatik sistem sebelum pengesahan guru.</p>' +
      "  </div>" +
      "</div>";

    var csvBtn = document.getElementById("guruExportCsvBtn");
    if (csvBtn) csvBtn.addEventListener("click", function () { exportPbdCsv(state); });
    var prtBtn = document.getElementById("guruPrintPdfBtn");
    if (prtBtn) prtBtn.addEventListener("click", function () { window.print(); });
  }

  function exportPbdCsv(state) {
    var detail = state.classDetail;
    if (!detail || !detail.classInfo) return;
    var cls = detail.classInfo;
    var assigns = (detail.assignments || []).slice().reverse();
    var subs = detail.submissions || [];
    var lines = [["Kelas", "Subjek", "Nama Pelajar", "Tugasan / Bab", "Rujukan DSKP", "Status", "Skor", "Markah Penuh", "Nota Interaktif", "Bintang EduQuest", "Cadangan TP", "TP Disahkan Guru", "Komen & Eviden Guru", "Tarikh Disahkan"].map(csvCell).join(",")];

    (detail.students || []).forEach(function (st) {
      assigns.forEach(function (a) {
        var s = subs.find(function (x) { return x.assignmentId === a.id && x.studentId === st.studentId; }) || {};
        var sugTp = R.suggestTpClient(s);
        lines.push([
          cls.className, cls.subject, st.studentName, a.title, a.dskpRef || "",
          s.status || "not_started",
          s.teacherScore !== null && s.teacherScore !== undefined ? s.teacherScore : (s.quizPercentage != null ? s.quizPercentage : (s.autoMcqScore != null ? s.autoMcqScore : "")),
          s.teacherMaxScore || (s.quizPercentage != null ? 100 : (s.autoMcqTotal || "")),
          s.notaCompleted ? "Siap" : "Belum",
          s.eduquestStars || 0,
          sugTp ? "TP" + sugTp : "",
          s.teacherTp ? "TP" + s.teacherTp : "",
          s.teacherFeedback || "",
          s.gradedAt ? String(s.gradedAt).slice(0, 10) : ""
        ].map(csvCell).join(","));
      });
    });

    var blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "PBD_" + String(cls.className || "kelas").replace(/\s+/g, "_") + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    window.ETGuru.toast("Fail CSV PBD berjaya dimuat turun!");
  }

  window.ETGuruReports = { renderReportsTab: renderReportsTab };
})();
