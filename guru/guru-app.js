(function () {
  "use strict";

  var Api = window.ETGuruApi;
  var Auth = window.ETGuruAuth;
  var R = window.ETGuruRubric;

  var state = {
    profile: null,
    classes: [],
    activeClassId: "",
    classDetail: null,
    activeTab: "classes",
    activeAssignmentId: "",
    manifests: { kssm: [], nota: [] }
  };

  function toast(msg) {
    var el = document.getElementById("guruToast");
    if (!el) return;
    el.textContent = String(msg || "");
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 3400);
  }

  function switchTab(tab) {
    state.activeTab = tab;
    document.querySelectorAll("[data-guru-tab]").forEach(function (b) {
      var active = b.getAttribute("data-guru-tab") === tab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
    document.getElementById("guruTabClasses").hidden = tab !== "classes";
    document.getElementById("guruTabTasks").hidden = tab !== "tasks";
    document.getElementById("guruTabGrading").hidden = tab !== "grading";
    document.getElementById("guruTabReports").hidden = tab !== "reports";
    renderActiveTab();
  }

  function renderActiveTab() {
    if (state.activeTab === "classes") window.ETGuruClasses.renderClassesTab(state);
    else if (state.activeTab === "tasks") window.ETGuruAssignments.renderTasksTab(state);
    else if (state.activeTab === "grading") window.ETGuruGrading.renderGradingTab(state);
    else if (state.activeTab === "reports") window.ETGuruReports.renderReportsTab(state);
  }

  function syncClassPicker() {
    var sel = document.getElementById("guruActiveClassSelect");
    if (!sel) return;
    var active = (state.classes || []).filter(function (c) { return !c.isArchived; });
    if (!active.length) {
      sel.innerHTML = '<option value="">Tiada kelas aktif</option>';
      return;
    }
    if (!state.activeClassId || !active.some(function (c) { return c.id === state.activeClassId; })) {
      state.activeClassId = active[0].id;
    }
    sel.innerHTML = active.map(function (c) {
      return '<option value="' + R.esc(c.id) + '"' + (c.id === state.activeClassId ? " selected" : "") + ">" + R.esc(c.className + " • " + c.subject) + "</option>";
    }).join("");
  }

  async function selectClass(classId) {
    state.activeClassId = classId || "";
    syncClassPicker();
    if (!state.activeClassId) {
      state.classDetail = null;
      renderActiveTab();
      return;
    }
    var res = await Api.getClassDetail(state.activeClassId);
    state.classDetail = (res && res.ok) ? res : null;
    renderActiveTab();
  }

  async function reloadClasses(preferClassId) {
    var res = await Api.listClasses();
    state.classes = (res && res.ok && Array.isArray(res.classes)) ? res.classes : [];
    if (preferClassId) state.activeClassId = preferClassId;
    syncClassPicker();
    await selectClass(state.activeClassId);
  }

  function openGradingFor(assignmentId) {
    state.activeAssignmentId = assignmentId || "";
    switchTab("grading");
  }

  async function bootstrapApp() {
    var sb = Api.getSb();
    if (!sb) {
      Auth.showScreen("login");
      return;
    }
    var sessRes = await sb.auth.getSession();
    var sess = sessRes && sessRes.data ? sessRes.data.session : null;
    if (!sess || !sess.user) {
      Auth.showScreen("login");
      return;
    }
    var profRes = await Api.getTeacherProfile();
    if (!profRes || !profRes.ok) {
      Auth.showScreen("login");
      return;
    }
    state.profile = profRes.profile;
    if (!state.profile.teacherOnboardingCompleted) {
      Auth.showScreen("onboarding", state.profile, false);
      return;
    }
    Auth.showScreen("app", state.profile, false);
    state.manifests = await Api.loadContentManifests();
    await reloadClasses("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    Auth.bindAuthEvents(bootstrapApp);
    document.querySelectorAll("[data-guru-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () { switchTab(btn.getAttribute("data-guru-tab")); });
    });
    var clsSel = document.getElementById("guruActiveClassSelect");
    if (clsSel) {
      clsSel.addEventListener("change", function () { selectClass(clsSel.value); });
    }
    bootstrapApp();
  });

  window.ETGuru = {
    get profile() { return state.profile; },
    toast: toast,
    reloadClasses: reloadClasses,
    selectClass: selectClass,
    openGradingFor: openGradingFor
  };
})();
