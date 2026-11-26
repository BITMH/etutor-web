(function () {
  "use strict";

  var R = window.ETGuruRubric;
  var Api = window.ETGuruApi;

  function statusPill(st) {
    if (st === "graded") return '<span class="g-pill g-pill-green">Disahkan Guru</span>';
    if (st === "ai_checked") return '<span class="g-pill g-pill-blue">Pra-Semak AI</span>';
    if (st === "submitted") return '<span class="g-pill g-pill-blue">Telah Hantar</span>';
    if (st === "in_progress") return '<span class="g-pill g-pill-amber">Sedang Buat</span>';
    return '<span class="g-pill g-pill-red">Belum Mula</span>';
  }

  function renderGradingTab(state) {
    var host = document.getElementById("guruTabGrading");
    if (!host) return;
    var detail = state.classDetail;
    var assigns = (detail && detail.assignments) || [];
    if (!detail || !assigns.length) {
      host.innerHTML = '<div class="g-card"><p class="g-muted">Tiada tugasan untuk disemak dalam kelas ini. Sila beri tugasan di tab <strong>Beri Tugasan &amp; Ujian</strong>.</p></div>';
      return;
    }

    var activeAid = state.activeAssignmentId && assigns.some(function (a) { return a.id === state.activeAssignmentId; })
      ? state.activeAssignmentId : assigns[0].id;
    state.activeAssignmentId = activeAid;
    var activeAssign = assigns.find(function (a) { return a.id === activeAid; }) || assigns[0];

    var selOpts = assigns.map(function (a) {
      return '<option value="' + R.esc(a.id) + '"' + (a.id === activeAid ? " selected" : "") + ">" + R.esc(a.title) + "</option>";
    }).join("");

    var subs = (detail.submissions || []).filter(function (s) { return s.assignmentId === activeAid; });
    var rowsHtml = subs.length ? subs.map(function (sub) {
      var sugTp = R.suggestTpClient(sub);
      var curTp = sub.teacherTp ? Number(sub.teacherTp) : null;
      var hasQuiz = sub.quizPercentage !== null && sub.quizPercentage !== undefined;
      var buktiHtml = "";
      if (hasQuiz) {
        var weakArr = Array.isArray(sub.weakTopics) ? sub.weakTopics.slice(0, 2).map(function (w) { return w.topic; }).filter(Boolean) : [];
        buktiHtml = "<div>Skor: <strong>" + R.esc(sub.quizScoreText || (sub.quizPercentage + "%")) + "</strong> (" + R.esc(sub.quizPercentage + "% &bull; " + (sub.quizGrade || "-")) + ")</div>" +
          (weakArr.length ? '<div class="g-muted">Lemah: ' + R.esc(weakArr.join(", ")) + "</div>" : "");
      } else if (sub.progressAnswered) {
        buktiHtml = '<div class="g-muted">Sedang buat: <strong>' + Number(sub.progressAnswered) + " / " + Number(sub.progressTotal || 40) + "</strong> soalan</div>";
      } else {
        var mcqTxt = (sub.autoMcqScore !== null && sub.autoMcqScore !== undefined) ? (sub.autoMcqScore + " / " + (sub.autoMcqTotal || 10)) : "—";
        buktiHtml = "<div>MCQ: <strong>" + R.esc(mcqTxt) + '</strong></div><div class="g-muted">Nota: ' + (sub.notaCompleted ? "Siap" : "Belum") + " &bull; " + Number(sub.eduquestStars || 0) + "/3 ★</div>";
      }
      var scoreVal = (sub.teacherScore !== null && sub.teacherScore !== undefined)
        ? sub.teacherScore : (hasQuiz ? sub.quizPercentage : ((sub.autoMcqScore !== null && sub.autoMcqScore !== undefined) ? sub.autoMcqScore : ""));
      var maxVal = sub.teacherMaxScore || (hasQuiz ? 100 : (sub.autoMcqTotal || 10));

      var tpBtns = [1, 2, 3, 4, 5, 6].map(function (n) {
        var cls = curTp === n ? "is-active" : (sugTp === n ? "is-suggested" : "");
        return '<button type="button" class="g-tp-btn ' + cls + '" data-tp-pick="' + n + '" data-sid="' + R.esc(sub.studentId) + '">TP' + n + "</button>";
      }).join("");

      return '<tr data-sub-row="' + R.esc(sub.studentId) + '">' +
        '  <td><strong>' + R.esc(sub.studentName) + '</strong><div style="margin-top:4px">' + statusPill(sub.status) + "</div></td>" +
        "  <td>" + buktiHtml + "</td>" +
        '  <td><div class="g-muted" style="margin-bottom:4px">Cadangan: <strong>' + (sugTp ? "TP" + sugTp : "Belum cukup data") + '</strong></div><div class="g-tp-group">' + tpBtns + "</div></td>" +
        '  <td><input type="number" step="0.5" min="0" max="100" class="g-input g-input-sm" style="width:74px" data-score-in="' + R.esc(sub.studentId) + '" value="' + R.esc(scoreVal) + '" placeholder="Skor"> / ' + R.esc(maxVal) +
        '    <input type="hidden" data-max-in="' + R.esc(sub.studentId) + '" value="' + R.esc(maxVal) + '">' +
        '    <input type="hidden" data-tp-val="' + R.esc(sub.studentId) + '" value="' + R.esc(curTp || sugTp || "") + '">' +
        "  </td>" +
        '  <td><input type="text" class="g-input g-input-sm" data-fb-in="' + R.esc(sub.studentId) + '" value="' + R.esc(sub.teacherFeedback) + '" placeholder="Komen / Catatan PBD..."></td>' +
        '  <td style="text-align:right"><button type="button" class="g-btn g-btn-sm g-btn-emerald" data-save-grade="' + R.esc(sub.studentId) + '">Sahkan</button></td>' +
        "</tr>";
    }).join("") : '<tr><td colspan="6" class="g-muted">Tiada pelajar aktif dalam kelas ini.</td></tr>';

    host.innerHTML =
      '<div class="g-card g-stack">' +
      '  <div class="g-row-between">' +
      '    <div><span class="g-eyebrow">Semakan &amp; Pentaksiran PBD</span><h2>' + R.esc(activeAssign.title) + '</h2><p class="g-muted">' + R.esc(activeAssign.dskpRef || "DSKP KSSM") + "</p></div>" +
      '    <div style="min-width:260px"><label class="g-label" for="gradeAssignSel">Pilih Tugasan</label><select id="gradeAssignSel" class="g-input g-input-sm">' + selOpts + "</select></div>" +
      "  </div>" +
      R.renderTpLegendHtml() +
      '  <div class="g-table-wrap"><table class="g-table"><thead><tr><th>Pelajar</th><th>Bukti Automatik</th><th>Tahap Penguasaan (TP1–TP6)</th><th>Markah</th><th>Komen &amp; Eviden Guru</th><th style="text-align:right">Simpan</th></tr></thead><tbody>' + rowsHtml + "</tbody></table></div>" +
      "</div>";

    bindGradingEvents(host, state, activeAid);
  }

  function bindGradingEvents(host, state, activeAid) {
    var sel = document.getElementById("gradeAssignSel");
    if (sel) {
      sel.addEventListener("change", function () {
        state.activeAssignmentId = sel.value;
        renderGradingTab(state);
      });
    }

    host.querySelectorAll("[data-tp-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sid = btn.getAttribute("data-sid");
        var tp = btn.getAttribute("data-tp-pick");
        var hidden = host.querySelector('[data-tp-val="' + sid + '"]');
        if (hidden) hidden.value = tp;
        host.querySelectorAll('[data-tp-pick][data-sid="' + sid + '"]').forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });

    host.querySelectorAll("[data-save-grade]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var sid = btn.getAttribute("data-save-grade");
        var scEl = host.querySelector('[data-score-in="' + sid + '"]');
        var mxEl = host.querySelector('[data-max-in="' + sid + '"]');
        var tpEl = host.querySelector('[data-tp-val="' + sid + '"]');
        var fbEl = host.querySelector('[data-fb-in="' + sid + '"]');
        var scRaw = scEl && scEl.value !== "" ? Number(scEl.value) : null;
        var mxRaw = mxEl ? Number(mxEl.value || 10) : 10;
        var tpRaw = tpEl && tpEl.value ? Number(tpEl.value) : null;
        var fb = fbEl ? fbEl.value : "";

        btn.disabled = true;
        var res = await Api.gradeSubmission({
          p_assignment_id: activeAid,
          p_student_id: sid,
          p_teacher_score: scRaw,
          p_teacher_max_score: mxRaw,
          p_teacher_tp: tpRaw,
          p_teacher_feedback: fb,
          p_evidence_note: tpRaw ? ("Disahkan TP" + tpRaw + " oleh guru") : ""
        });
        btn.disabled = false;
        if (!res || !res.ok) return window.ETGuru.toast((res && res.error) || "Gagal menyimpan semakan.");
        window.ETGuru.toast("Semakan & TP berjaya disahkan!");
        await window.ETGuru.selectClass(state.activeClassId);
      });
    });
  }

  window.ETGuruGrading = { renderGradingTab: renderGradingTab };
})();
