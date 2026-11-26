(function () {
  "use strict";

  var R = window.ETGuruRubric;
  var Api = window.ETGuruApi;

  function normSubj(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function buildItemsByType(manifests, cls, type, qText) {
    var formNum = Number(String((cls && cls.formCode) || "T5").replace(/\D/g, "")) || 5;
    var slug = (cls && cls.subjectSlug) || "";
    var subjLow = normSubj(cls && cls.subject);
    var q = normSubj(qText);

    if (type === "klon_spm" || type === "trial_spm") {
      var raw = (type === "klon_spm" ? manifests.klon : manifests.trial) || [];
      var bySubj = raw.filter(function (x) { return normSubj(x.subject) === subjLow; });
      var pool = bySubj.length ? bySubj : raw;
      if (q) {
        pool = pool.filter(function (x) {
          return normSubj(x.title + " " + x.subject + " " + x.setCode + " " + x.stateOrSource).indexOf(q) !== -1;
        });
      }
      return pool.slice(0, 80).map(function (x) {
        var meta = [x.setCode, x.stateOrSource, x.year].filter(Boolean).join(" • ");
        return {
          val: x.fileId,
          label: x.title + (meta ? " (" + meta + ")" : ""),
          title: x.title,
          dskp: "SPM " + x.subject + (x.setCode ? " • " + x.setCode : ""),
          cfg: { fileId: x.fileId, category: type === "klon_spm" ? "klon" : "harian", setTitle: x.title, subject: x.subject }
        };
      });
    }

    if (type === "eduquest_nota") {
      var notes = (manifests.nota || []).filter(function (n) {
        return Number(n.form) === formNum && normSubj(n.subject) === subjLow;
      }).sort(function (a, b) { return (Number(a.chapterNumber) || 1) - (Number(b.chapterNumber) || 1); });
      return notes.map(function (n) {
        var bab = Number(n.chapterNumber) || 1;
        return {
          val: n.id,
          label: "Bab " + bab + ": " + n.title,
          title: "Nota Interaktif Bab " + bab + ": " + n.title,
          dskp: "KSSM T" + formNum + " Bab " + bab,
          cfg: { form: formNum, subjectSlug: slug, bab: bab, chapterKey: slug + "-t" + formNum + "-bab-" + bab, notaId: n.id, minStars: 2 }
        };
      });
    }

    var kssm = (manifests.kssm || []).filter(function (k) {
      return Number(k.form) === formNum && k.subjectSlug === slug;
    }).sort(function (a, b) { return (Number(a.bab) || 1) - (Number(b.bab) || 1); });
    return kssm.map(function (k) {
      var bab = Number(k.bab) || 1;
      var key = slug + "-t" + formNum + "-bab-" + bab;
      return {
        val: key,
        label: "Bab " + bab + ": " + k.title,
        title: "Ujian Topikal " + (formNum <= 3 ? "UASA" : "SPM") + " Bab " + bab + ": " + k.title,
        dskp: "KSSM T" + formNum + " Bab " + bab,
        cfg: { form: formNum, subjectSlug: slug, bab: bab, chapterKey: key, notaId: k.playableNoteId || "", minStars: 2 }
      };
    });
  }

  function renderItemOptions(state, cls, type, qText) {
    var sel = document.getElementById("tskItemSel");
    var lbl = document.getElementById("tskItemLbl");
    var searchWrap = document.getElementById("tskSearchWrap");
    if (!sel || !lbl) return [];

    var isSet = (type === "klon_spm" || type === "trial_spm");
    if (searchWrap) searchWrap.hidden = !isSet;
    lbl.textContent = type === "eduquest_nota" ? "Pilih Bab Nota Interaktif"
      : (type === "klon_spm" ? "Pilih Set Soalan Klon SPM"
      : (type === "trial_spm" ? "Pilih Set Trial / Percubaan SPM" : "Pilih Bab Ujian Topikal"));

    var items = buildItemsByType(state.manifests || {}, cls, type, qText);
    sel.innerHTML = items.length ? items.map(function (it, idx) {
      return '<option value="' + idx + '">' + R.esc(it.label) + "</option>";
    }).join("") : '<option value="">Tiada set automatik — isi tajuk manual di bawah</option>';
    return items;
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
    var isUasa = Number(String(cls.formCode || "T5").replace(/\D/g, "")) <= 3;
    var klonCnt = (state.manifests && state.manifests.klon) ? state.manifests.klon.length : 0;
    var trialCnt = (state.manifests && state.manifests.trial) ? state.manifests.trial.length : 0;

    var listHtml = (detail.assignments || []).length ? detail.assignments.map(function (a) {
      var subs = (detail.submissions || []).filter(function (s) { return s.assignmentId === a.id; });
      var doneCnt = subs.filter(function (s) { return s.status === "submitted" || s.status === "graded"; }).length;
      return '<article class="g-card">' +
        '  <div class="g-row-between"><span class="g-pill g-pill-blue">' + R.esc(a.assignmentType.replace(/_/g, " ").toUpperCase()) + '</span><span class="g-muted">' + doneCnt + " / " + (detail.students || []).length + " Hantar</span></div>" +
        '  <h3 style="margin-top:8px">' + R.esc(a.title) + "</h3>" +
        '  <p class="g-muted">' + R.esc(a.dskpRef || cls.subject) + (a.dueAt ? " &bull; Tamat: " + R.esc(String(a.dueAt).slice(0, 10)) : "") + "</p>" +
        '  <div class="g-row-end" style="margin-top:10px"><button type="button" class="g-btn g-btn-sm g-btn-primary" data-grade-assign="' + R.esc(a.id) + '">Semak &amp; Nilai TP</button></div>' +
        "</article>";
    }).join("") : '<div class="g-card"><p class="g-muted">Belum ada tugasan diberi kepada kelas ini.</p></div>';

    host.innerHTML =
      '<div class="g-grid-2" style="align-items:start">' +
      '  <form id="guruCreateTaskForm" class="g-card g-stack">' +
      '    <span class="g-eyebrow">Agihan 4 Jenis Kerja eTutor</span>' +
      "    <h2>Beri Tugasan: " + R.esc(cls.className) + " (" + R.esc(cls.subject) + ")</h2>" +
      '    <div class="g-grid-2">' +
      '      <div><label class="g-label" for="tskType">Jenis Tugasan</label><select id="tskType" class="g-input">' +
      '        <option value="ujian_topikal">Ujian Topikal (' + (isUasa ? "UASA" : "SPM") + ' — 10 MCQ)</option>' +
      '        <option value="eduquest_nota">Nota Interaktif Playable (EduQuest)</option>' +
      '        <option value="klon_spm">Soalan Klon SPM (' + klonCnt + ' Set)</option>' +
      '        <option value="trial_spm">Soalan Trial / Percubaan SPM (' + trialCnt + ' Set)</option>' +
      '        <option value="kertas_2_snap">Soalan Kertas 2 / Berstruktur</option>' +
      "      </select></div>" +
      '      <div><label class="g-label" for="tskKind">Tujuan Pentaksiran</label><select id="tskKind" class="g-input">' +
      '        <option value="pbd_topikal">Pentaksiran PBD (TP1–TP6)</option>' +
      '        <option value="' + (isUasa ? "ujian_uasa" : "ujian_spm") + '">Ujian Format ' + (isUasa ? "UASA" : "SPM") + "</option>" +
      '        <option value="latihan">Latihan / Kerja Rumah</option>' +
      "      </select></div>" +
      "    </div>" +
      '    <div id="tskSearchWrap" hidden><label class="g-label" for="tskSearchInput">Cari Set Soalan (Negeri / Kod / Tahun)</label><input id="tskSearchInput" type="search" class="g-input" placeholder="cth: Klon 03, Selangor, SBP, 2025..."></div>' +
      '    <div><label class="g-label" id="tskItemLbl" for="tskItemSel">Pilih Bab Ujian Topikal</label><select id="tskItemSel" class="g-input"></select></div>' +
      '    <div><label class="g-label" for="tskTitleInput">Tajuk Tugasan *</label><input id="tskTitleInput" class="g-input" maxlength="160" required></div>' +
      '    <div class="g-grid-2">' +
      '      <div><label class="g-label" for="tskDskpInput">Rujukan DSKP / Kertas</label><input id="tskDskpInput" class="g-input" maxlength="200"></div>' +
      '      <div><label class="g-label" for="tskDueInput">Tarikh Akhir (Pilihan)</label><input id="tskDueInput" type="date" class="g-input"></div>' +
      "    </div>" +
      '    <div><label class="g-label" for="tskInstrInput">Arahan Tambahan untuk Murid</label><textarea id="tskInstrInput" class="g-input g-textarea" placeholder="cth: Siapkan sebelum Jumaat untuk rekod PBD kelas."></textarea></div>' +
      '    <button type="submit" class="g-btn g-btn-emerald">Hantar Tugasan ke Kelas</button>' +
      "  </form>" +
      '  <div class="g-stack">' + listHtml + "</div>" +
      "</div>";

    var curItems = renderItemOptions(state, cls, "ujian_topikal", "");
    function syncTitleFromSel() {
      var sel = document.getElementById("tskItemSel");
      var idx = sel && sel.value !== "" ? Number(sel.value) : -1;
      var it = idx >= 0 ? curItems[idx] : null;
      var tIn = document.getElementById("tskTitleInput");
      var dIn = document.getElementById("tskDskpInput");
      if (it && tIn) { tIn.value = it.title; if (dIn) dIn.value = it.dskp; }
    }
    syncTitleFromSel();

    var typeSel = document.getElementById("tskType");
    var searchIn = document.getElementById("tskSearchInput");
    var itemSel = document.getElementById("tskItemSel");
    if (typeSel) {
      typeSel.addEventListener("change", function () {
        if (searchIn) searchIn.value = "";
        curItems = renderItemOptions(state, cls, typeSel.value, "");
        syncTitleFromSel();
      });
    }
    if (searchIn) {
      searchIn.addEventListener("input", function () {
        curItems = renderItemOptions(state, cls, typeSel ? typeSel.value : "klon_spm", searchIn.value);
        syncTitleFromSel();
      });
    }
    if (itemSel) itemSel.addEventListener("change", syncTitleFromSel);

    var form = document.getElementById("guruCreateTaskForm");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var idx = itemSel && itemSel.value !== "" ? Number(itemSel.value) : -1;
        var picked = idx >= 0 ? curItems[idx] : null;
        var dueVal = document.getElementById("tskDueInput").value;
        var res = await Api.createAssignment({
          p_class_id: cls.id,
          p_title: document.getElementById("tskTitleInput").value,
          p_instructions: document.getElementById("tskInstrInput").value,
          p_assignment_type: typeSel ? typeSel.value : "ujian_topikal",
          p_assessment_kind: document.getElementById("tskKind").value,
          p_dskp_ref: document.getElementById("tskDskpInput").value,
          p_target_config: picked ? picked.cfg : { form: Number(String(cls.formCode || "T5").replace(/\D/g, "")) || 5, subjectSlug: cls.subjectSlug },
          p_due_at: dueVal ? (dueVal + "T23:59:59+08:00") : null
        });
        if (!res || !res.ok) return window.ETGuru.toast((res && res.error) || "Gagal mencipta tugasan.");
        window.ETGuru.toast("Tugasan berjaya dihantar ke kelas!");
        await window.ETGuru.selectClass(cls.id);
      });
    }

    host.querySelectorAll("[data-grade-assign]").forEach(function (btn) {
      btn.addEventListener("click", function () { window.ETGuru.openGradingFor(btn.getAttribute("data-grade-assign")); });
    });
  }

  window.ETGuruAssignments = { renderTasksTab: renderTasksTab };
})();
