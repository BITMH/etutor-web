(function () {
  "use strict";

  var R = window.ETGuruRubric;
  var Api = window.ETGuruApi;

  function renderClassesTab(state) {
    var host = document.getElementById("guruTabClasses");
    if (!host) return;
    var prof = state.profile || {};
    var formOpts = ["T1", "T2", "T3", "T4", "T5"].map(function (f) {
      var sel = (Array.isArray(prof.teacherForms) && prof.teacherForms.indexOf(f) !== -1) ? " selected" : "";
      return '<option value="' + f + '"' + sel + ">Tingkatan " + f.slice(1) + "</option>";
    }).join("");
    var subjOpts = R.SUBJECTS.map(function (s) {
      var sel = (Array.isArray(prof.teacherSubjects) && prof.teacherSubjects[0] === s.name) ? " selected" : "";
      return '<option value="' + R.esc(s.slug) + '" data-name="' + R.esc(s.name) + '"' + sel + ">" + R.esc(s.name) + "</option>";
    }).join("");

    var activeClasses = (state.classes || []).filter(function (c) { return !c.isArchived; });
    var cardsHtml = activeClasses.length ? activeClasses.map(function (c) {
      var isSel = state.activeClassId === c.id;
      var shareUrl = "https://etutor.my/?join=" + encodeURIComponent(c.joinCode) + "#portal";
      var waTxt = "Assalamualaikum & salam sejahtera. Sila sertai kelas eTutor.my (" + c.className + " - " + c.subject + ") menggunakan Kod Kelas: " + c.joinCode + " atau tekan pautan ini: " + shareUrl;
      var waHref = "https://wa.me/?text=" + encodeURIComponent(waTxt);
      return '<article class="g-card" style="' + (isSel ? "border-color:var(--g-blue);border-width:2px" : "") + '">' +
        '  <div class="g-row-between"><span class="g-pill g-pill-blue">Tingkatan ' + R.esc(String(c.formCode || "").slice(1)) + '</span><span class="g-code-badge">' + R.esc(c.joinCode) + "</span></div>" +
        '  <h3 style="margin-top:8px">' + R.esc(c.className) + '</h3>' +
        '  <p class="g-muted">' + R.esc(c.subject) + " &bull; " + Number(c.studentCount || 0) + " Pelajar &bull; " + Number(c.assignmentCount || 0) + " Tugasan</p>" +
        '  <div class="g-row-between" style="margin-top:12px">' +
        '    <div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '      <button type="button" class="g-btn g-btn-sm ' + (isSel ? "g-btn-primary" : "g-btn-outline") + '" data-select-class="' + R.esc(c.id) + '">' + (isSel ? "Kelas Dipilih" : "Urus Kelas") + "</button>" +
        '      <button type="button" class="g-btn g-btn-sm g-btn-outline" data-copy-code="' + R.esc(c.joinCode) + '">Salin Kod</button>' +
        '      <a class="g-btn g-btn-sm g-btn-emerald" href="' + R.esc(waHref) + '" target="_blank" rel="noopener">WhatsApp</a>' +
        "    </div>" +
        '    <button type="button" class="g-btn g-btn-sm g-btn-ghost" data-archive-class="' + R.esc(c.id) + '">Arkib</button>' +
        "  </div>" +
        "</article>";
    }).join("") : '<div class="g-card"><p class="g-muted">Belum ada kelas aktif. Cipta kelas pertama anda menggunakan borang di sebelah.</p></div>';

    var detail = state.classDetail;
    var rosterHtml = "";
    if (detail && detail.classInfo && detail.classInfo.id === state.activeClassId) {
      var stRows = (detail.students || []).length ? detail.students.map(function (st, idx) {
        return "<tr><td>" + (idx + 1) + "</td><td><strong>" + R.esc(st.studentName) + "</strong></td><td>" +
          R.esc(String(st.joinedAt || "").slice(0, 10)) + '</td><td style="text-align:right">' +
          '<button type="button" class="g-btn g-btn-sm g-btn-danger" data-remove-student="' + R.esc(st.studentId) + '">Keluarkan</button></td></tr>';
      }).join("") : '<tr><td colspan="4" class="g-muted">Belum ada pelajar menyertai kelas ini. Kongsikan Kod Kelas <strong>' + R.esc(detail.classInfo.joinCode) + "</strong> kepada pelajar anda.</td></tr>";

      rosterHtml = '<div class="g-card" style="margin-top:16px">' +
        '  <div class="g-row-between" style="margin-bottom:10px"><h3>Senarai Pelajar: ' + R.esc(detail.classInfo.className) + '</h3><span class="g-code-badge">Kod: ' + R.esc(detail.classInfo.joinCode) + "</span></div>" +
        '  <div class="g-table-wrap"><table class="g-table"><thead><tr><th>#</th><th>Nama Pelajar</th><th>Tarikh Sertai</th><th style="text-align:right">Tindakan</th></tr></thead><tbody>' + stRows + "</tbody></table></div>" +
        "</div>";
    }

    host.innerHTML =
      '<div class="g-grid-2" style="align-items:start">' +
      '  <div class="g-stack">' + cardsHtml + "</div>" +
      '  <form id="guruCreateClassForm" class="g-card g-stack">' +
      '    <span class="g-eyebrow">Cipta Kelas Baharu</span>' +
      "    <h2>Tambah Kelas &amp; Jana Kod</h2>" +
      '    <div><label class="g-label" for="clsNameInput">Nama Kelas *</label><input id="clsNameInput" class="g-input" placeholder="cth: 5 Alpha / 3 Cemerlang" maxlength="80" required></div>' +
      '    <div class="g-grid-2">' +
      '      <div><label class="g-label" for="clsFormInput">Tingkatan</label><select id="clsFormInput" class="g-input">' + formOpts + "</select></div>" +
      '      <div><label class="g-label" for="clsSubjInput">Subjek</label><select id="clsSubjInput" class="g-input">' + subjOpts + "</select></div>" +
      "    </div>" +
      '    <button type="submit" class="g-btn g-btn-primary">Cipta Kelas &amp; Jana Kod</button>' +
      "  </form>" +
      "</div>" + rosterHtml;

    bindClassesEvents(host, state);
  }

  function bindClassesEvents(host, state) {
    var form = document.getElementById("guruCreateClassForm");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var selSub = document.getElementById("clsSubjInput");
        var subjName = selSub.options[selSub.selectedIndex].getAttribute("data-name") || selSub.value;
        var res = await Api.createClass({
          p_class_name: document.getElementById("clsNameInput").value,
          p_form_code: document.getElementById("clsFormInput").value,
          p_subject: subjName,
          p_subject_slug: selSub.value,
          p_academic_year: 2026
        });
        if (!res || !res.ok) return window.ETGuru.toast((res && res.error) || "Gagal cipta kelas.");
        window.ETGuru.toast("Kelas dicipta! Kod: " + res.joinCode);
        await window.ETGuru.reloadClasses(res.classId);
      });
    }

    host.querySelectorAll("[data-select-class]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.ETGuru.selectClass(btn.getAttribute("data-select-class"));
      });
    });

    host.querySelectorAll("[data-copy-code]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var code = btn.getAttribute("data-copy-code");
        var txt = "Sertai kelas eTutor.my dengan Kod Kelas: " + code + " di https://etutor.my/?join=" + code + "#portal";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () { window.ETGuru.toast("Kod & pautan kelas disalin!"); });
        } else {
          window.ETGuru.toast("Kod kelas: " + code);
        }
      });
    });

    host.querySelectorAll("[data-archive-class]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = btn.getAttribute("data-archive-class");
        if (!window.confirm("Arkibkan kelas ini? Tugasan terdahulu kekal disimpan.")) return;
        var res = await Api.archiveClass(id, true);
        if (res && res.ok) {
          window.ETGuru.toast("Kelas diarkibkan.");
          await window.ETGuru.reloadClasses("");
        }
      });
    });

    host.querySelectorAll("[data-remove-student]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var sid = btn.getAttribute("data-remove-student");
        if (!window.confirm("Keluarkan pelajar ini daripada kelas?")) return;
        var res = await Api.removeStudent(state.activeClassId, sid);
        if (res && res.ok) {
          window.ETGuru.toast("Pelajar dikeluarkan.");
          await window.ETGuru.selectClass(state.activeClassId);
        }
      });
    });
  }

  window.ETGuruClasses = { renderClassesTab: renderClassesTab };
})();
