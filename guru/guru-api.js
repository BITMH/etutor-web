(function () {
  "use strict";

  var cachedClient = null;
  var cachedManifests = null;

  function getSb() {
    if (cachedClient) return cachedClient;
    var cfg = window.ETUTOR_CONFIG || {};
    var url = String(cfg.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    var key = String(cfg.SUPABASE_ANON_KEY || "").trim();
    if (!url || !key || !window.supabase || typeof window.supabase.createClient !== "function") {
      return null;
    }
    cachedClient = window.supabase.createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" }
    });
    return cachedClient;
  }

  async function callRpc(name, params) {
    var sb = getSb();
    if (!sb) return { ok: false, error: "Supabase belum dikonfigurasi." };
    var res = await sb.rpc(name, params || {});
    if (res.error) return { ok: false, error: res.error.message || "Ralat pelayan." };
    return res.data || { ok: false, error: "Tiada respons." };
  }

  async function loadContentManifests() {
    if (cachedManifests) return cachedManifests;
    function grab(url) {
      return fetch(url).then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; });
    }
    var out = await Promise.all([grab("../kssm/manifest.json"), grab("../nota-interaktif/manifest.json")]);
    cachedManifests = {
      kssm: out[0] && Array.isArray(out[0].chapters) ? out[0].chapters : [],
      nota: out[1] && Array.isArray(out[1].chapters) ? out[1].chapters : []
    };
    return cachedManifests;
  }

  window.ETGuruApi = {
    getSb: getSb,
    getTeacherProfile: function () { return callRpc("get_teacher_profile"); },
    completeOnboarding: function (p) { return callRpc("complete_teacher_onboarding", p); },
    listClasses: function () { return callRpc("teacher_list_classes"); },
    createClass: function (p) { return callRpc("teacher_create_class", p); },
    archiveClass: function (classId, archived) {
      return callRpc("teacher_archive_class", { p_class_id: classId, p_archived: archived });
    },
    removeStudent: function (classId, studentId) {
      return callRpc("teacher_remove_student", { p_class_id: classId, p_student_id: studentId });
    },
    createAssignment: function (p) { return callRpc("teacher_create_assignment", p); },
    getClassDetail: function (classId) { return callRpc("teacher_get_class_detail", { p_class_id: classId }); },
    gradeSubmission: function (p) { return callRpc("teacher_grade_submission", p); },
    loadContentManifests: loadContentManifests
  };
})();
