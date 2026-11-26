(function () {
  "use strict";

  var R = window.ETGuruRubric;
  var Api = window.ETGuruApi;

  function buildChapterOptions(manifests, cls) {
    var formNum = Number(String((cls && cls.formCode) || "T5").replace(/\D/g, "")) || 5;
    var slug = (cls && cls.subjectSlug) || "";
    var byBab = {};

    ((manifests && manifests.kssm) || []).forEach(function (k) {
      if (Number(k.form) === formNum && k.subjectSlug === slug) {
        var b = Number(k.bab) || 1;
        byBab[b] = byBab[b] || { bab: b, title: k.title, dskp: "KSSM T" + formNum + " Bab " + b };
        byBab[b].kssm = k;
      }
    });
    ((manifests && manifests.nota) || []).forEach(function (n) {
      if (Number(n.form) === formNum && String(n.subject || "").toLowerCase() === String((cls && cls.subject) || "").toLowerCase()) {
        var b = Number(n.chapterNumber) || 1;
        byBab[b] = byBab[b] || { bab: b, title: n.title, dskp: "KSSM T" + formNum + " Bab " + b };
        byBab[b].nota = n;
      }
    });

    return Object.keys(byBab).map(Number).sort(function (a, b) { return a - b; }).map(function (b) {
      var item = byBab[b];
      var key = slug + "-t" + formNum + "-bab-" + b;
      return {
        bab: b,
        chapterKey: key,
        notaId: (item.nota && item.nota.id) || (item.kssm && item.kssm.playableNoteId) || "",
        title: item.title || ("Bab " + b),
        hasKssm: Boolean(item.kssm),
        hasNota: Boolean(item.nota),
        dskp: item.dskp
      };
    });
  }

  function renderTasksTab(state) {
    var host = document.getElementById("guruTabTasks");
    if (!host) return;
    var detail = state.classDetail;
    if (!detail || !detail.classInfo) {
      host.innerHTML = '<div class="g-card"><p class="g-muted">Sila cipta atau pilih kelas di tab <strong>Kelas Saya</strong> dahulu untuk memberi tugasan.</p></div>';
      return;
    }

    var cls = detail.classInfo;
    var formNum = Number(String(cls.formCode || "T5").replace(/\D/g, "")) || 5;
    var isUasa = formNum <= 3;
    var chaps = buildChapterOptions(state.manifests, cls);
    var chapOpts = chaps.length ? chaps.map(function (c) {
      var tag = (c.hasKssm ? " [Ujian Topikal]" : "") + (c.hasNota ? " [Nota Playable]" : "");
      return '<option value="' + R.esc(c.chapterKey) + '" data-bab="' + c.bab + '" data-notaid="' + R.esc(c.notaId) + '" data-title="' + R.esc(c.title) + '" data-dskp="' + R.esc(c.dskp) + '">Bab ' + c.bab + ": " + R.esc(c.title) + tag + "</option>";
    }).join("") : '<option value="">Tiada bab automatik — isi tajuk manual di bawah</option>';

    var listHtml = (detail.assignments || []).length ? detail.assignments.map(function (a) {
      var subs = (detail.submissions || []).filter(function (s) { return s.assignmentId === a.id; });
      var doneCnt = subs.filter(function (s) { return s.status === "submitted" || s.status === "graded"; }).length;
      return '<article class="g-card">' +
        '  <div class="g-row-between"><span class="g-pill g-pill-blue">' + R.esc(a.assessmentKind.toUpperCase().replace("_", " ")) + '</span><span class="g-muted">' + doneCnt + " / " + (detail.students || []).length + " Hantar</span></div>" +
        '  <h3 style="margin-top:8px">' + R.esc(a.title) + "</h3>" +
        '  <p class="g-muted">' + R.esc(a.dskpRef || cls.subject) + (a.dueAt ? " &bull; Tamat: " + R.esc(String(a.dueAt).slice(0, 10)) : "") + "</p>" +
        '  <div class="g-row-end" style="margin-top:10px"><button type="button" class="g-btn g-btn-sm g-btn-primary" data-grade-assign="' + R.esc(a.id) + '">Semak &amp; Nilai TP</button></div>' +
        "</article>";
    }).join("") : '<div class="g-card"><p class="g-muted">Belum ada tugasan diberi kepada kelas ini.</p></div>';

    host.innerHTML =
      '<div class="g-grid-2" style="align-items:start">' +
      '  <form id="guruCreateTaskForm" class="g-card g-stack">' +
      '    <span class="g-eyebrow">Agihan Kerja Rumah &amp; Pentaksiran</span>' +
      "    <h2>Beri Tugasan: " + R.esc(cls.className) + " (" + R.esc(cls.subject) + ")</h2>" +
      '    <div class="g-grid-2">' +
      '      <div><label class="g-label" for="tskType">Jenis Tugasan</label><select id="tskType" class="g-input">' +
      '        <option value="ujian_topikal">Ujian Topikal (' + (isUasa ? "UASA" : "SPM") + ' — 10 MCQ Auto-Semak)</option>' +
      '        <option value="eduquest_nota">Nota Interaktif + EduQuest (Bintang)</option>' +
      '        <option value="kertas_2_snap">Soalan Kertas 2 / Berstruktur</option>' +
      "      </select></div>" +
      '      <div><label class="g-label" for="tskKind">Tujuan Pentaksiran</label><select id="tskKind" class="g-input">' +
      '        <option value="pbd_topikal">Pentaksiran PBD (TP1–TP6)</option>' +
      '        <option value="' + (isUasa ? "ujian_uasa" : "ujian_spm") + '">Ujian Topikal Format ' + (isUasa ? "UASA" : "SPM") + "</option>" +
      '        <option value="latihan">Latihan / Kerja Rumah Harian</option>' +
      "      </select></div>" +
      "    </div>" +
      '    <div><label class="g-label" for="tskChapterSel">Pilih Bab KSSM (Auto-Semak)</label><select id="tskChapterSel" class="g-input">' + chapOpts + "</select></div>" +
      '    <div><label class="g-label" for="tskTitleInput">Tajuk Tugasan *</label><input id="tskTitleInput" class="g-input" maxlength="160" required></div>' +
      '    <div class="g-grid-2">' +
      '      <div><label class="g-label" for="tskDskpInput">Rujukan DSKP / Standard</label><input id="tskDskpInput" class="g-input" placeholder="cth: KSSM T5 Bab 1" maxlength="200"></div>' +
      '      <div><label class="g-label" for="tskDueInput">Tarikh Akhir (Pilihan)</label><input id="tskDueInput" type="date" class="g-input"></div>' +
      "    </div>" +
      '    <div><label class="g-label" for="tskInstrInput">Arahan Tambahan untuk Murid</label><textarea id="tskInstrInput" class="g-input g-textarea" placeholder="cth: Fahami Nota Interaktif dahulu dan capai sekurang-kurangnya 7/10 pada Ujian Topikal."></textarea></div>' +
      '    <button type="submit" class="g-btn g-btn-emerald">Hantar Tugasan ke Kelas</button>' +
      "  </form>" +
      '  <div class="g-stack">' + listHtml + "</div>" +
      "</div>";

    syncTaskFormDefaults(cls, isUasa);
    bindTasksEvents(host, cls, isUasa);
  }

  function syncTaskFormDefaults(cls, isUasa) {
    var chSel = document.getElementById("tskChapterSel");
    var typeSel = document.getElementById("tskType");
    var titleIn = document.getElementById("tskTitleInput");
    var dskpIn = document.getElementById("tskDskpInput");
    if (!chSel || !titleIn) return;
    var opt = chSel.options[chSel.selectedIndex];
    var bab = opt ? opt.getAttribute("data-bab") : "";
    var chTitle = opt ? opt.getAttribute("data-title") : "";
    var prefix = typeSel && typeSel.value === "eduquest_nota" ? "Nota & EduQuest" : ("Ujian Topikal " + (isUasa ? "UASA" : "SPM"));
    if (bab && chTitle) {
      titleIn.value = prefix + " Bab " + bab + ": " + chTitle;
      if (dskpIn) dskpIn.value = opt.getAttribute("data-dskp") || ("KSSM " + cls.formCode + " " + cls.subject + " Bab " + bab);
    } else if (!titleIn.value) {
      titleIn.value = prefix + " • " + cls.subject;
    }
  }

  function bindTasksEvents(host, cls, isUasa) {
    var chSel = document.getElementById("tskChapterSel");
    var typeSel = document.getElementById("tskType");
    if (chSel) chSel.addEventListener("change", function () { syncTaskFormDefaults(cls, isUasa); });
    if (typeSel) typeSel.addEventListener("change", function () { syncTaskFormDefaults(cls, isUasa); });

    var form = document.getElementById("guruCreateTaskForm");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var opt = chSel && chSel.options[chSel.selectedIndex];
        var dueVal = document.getElementById("tskDueInput").value;
        var cfg = {
          form: Number(String(cls.formCode || "T5").replace(/\D/g, "")) || 5,
          subjectSlug: cls.subjectSlug,
          bab: Number(opt && opt.getAttribute("data-bab")) || 1,
          chapterKey: (chSel && chSel.value) || "",
          notaId: (opt && opt.getAttribute("data-notaid")) || "",
          minStars: 2
        };
        var res = await Api.createAssignment({
          p_class_id: cls.id,
          p_title: document.getElementById("tskTitleInput").value,
          p_instructions: document.getElementById("tskInstrInput").value,
          p_assignment_type: typeSel ? typeSel.value : "ujian_topikal",
          p_assessment_kind: document.getElementById("tskKind").value,
          p_dskp_ref: document.getElementById("tskDskpInput").value,
          p_target_config: cfg,
          p_due_at: dueVal ? (dueVal + "T23:59:59+08:00") : null
        });
        if (!res || !res.ok) return window.ETGuru.toast((res && res.error) || "Gagal mencipta tugasan.");
        window.ETGuru.toast("Tugasan berjaya dihantar ke kelas!");
        await window.ETGuru.selectClass(cls.id);
      });
    }

    host.querySelectorAll("[data-grade-assign]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.ETGuru.openGradingFor(btn.getAttribute("data-grade-assign"));
      });
    });
  }

  window.ETGuruAssignments = { renderTasksTab: renderTasksTab };
})();
