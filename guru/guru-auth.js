(function () {
  "use strict";

  var R = window.ETGuruRubric;
  var Api = window.ETGuruApi;
  var pendingEmail = "";

  function setMsg(text, isErr) {
    var el = document.getElementById("guruAuthMsg");
    if (!el) return;
    el.textContent = text || "";
    el.className = isErr ? "g-error-msg" : "g-status-msg";
    el.hidden = !text;
  }

  function renderOnboardingChoices(profile) {
    var stateSel = document.getElementById("onbGuruState");
    var formsBox = document.getElementById("onbFormsGroup");
    var subjsBox = document.getElementById("onbSubjectsGroup");
    if (!stateSel || !formsBox || !subjsBox) return;

    var curState = (profile && profile.teacherState) || "Johor";
    stateSel.innerHTML = R.STATES.map(function (st) {
      return '<option value="' + R.esc(st) + '"' + (st === curState ? " selected" : "") + ">" + R.esc(st) + "</option>";
    }).join("");

    var selForms = (profile && Array.isArray(profile.teacherForms)) ? profile.teacherForms : ["T4", "T5"];
    formsBox.innerHTML = ["T1", "T2", "T3", "T4", "T5"].map(function (f) {
      var chk = selForms.indexOf(f) !== -1 ? " checked" : "";
      return '<label class="g-check-chip"><input type="checkbox" name="onbForm" value="' + f + '"' + chk + "><span>Tingkatan " + f.slice(1) + "</span></label>";
    }).join("");

    var selSubjs = (profile && Array.isArray(profile.teacherSubjects)) ? profile.teacherSubjects : [];
    subjsBox.innerHTML = R.SUBJECTS.map(function (s) {
      var chk = selSubjs.indexOf(s.name) !== -1 ? " checked" : "";
      return '<label class="g-check-chip"><input type="checkbox" name="onbSubject" value="' + R.esc(s.name) + '"' + chk + "><span>" + R.esc(s.name) + "</span></label>";
    }).join("");

    var nameIn = document.getElementById("onbGuruName");
    var schoolIn = document.getElementById("onbGuruSchool");
    if (nameIn && profile && profile.displayName) nameIn.value = profile.displayName;
    if (schoolIn && profile && profile.schoolName) schoolIn.value = profile.schoolName;
  }

  function showScreen(name, profile, allowCancel) {
    var loginEl = document.getElementById("guruLoginView");
    var onbEl = document.getElementById("guruOnboardingView");
    var appEl = document.getElementById("guruAppView");
    var editBtn = document.getElementById("guruEditProfileBtn");
    var outBtn = document.getElementById("guruLogoutBtn");
    var cancelBtn = document.getElementById("guruOnbCancelBtn");

    if (loginEl) loginEl.hidden = name !== "login";
    if (onbEl) onbEl.hidden = name !== "onboarding";
    if (appEl) appEl.hidden = name !== "app";
    if (editBtn) editBtn.hidden = name !== "app";
    if (outBtn) outBtn.hidden = name === "login";
    if (cancelBtn) cancelBtn.hidden = !allowCancel;

    if (name === "onboarding") renderOnboardingChoices(profile || {});
    if (profile) {
      var metaEl = document.getElementById("guruHeaderMeta");
      if (metaEl && profile.displayName) {
        metaEl.textContent = profile.displayName + (profile.schoolName ? " • " + profile.schoolName : "");
      }
    }
  }

  function bindAuthEvents(onReadyApp) {
    var googleBtn = document.getElementById("guruGoogleBtn");
    var otpForm = document.getElementById("guruOtpForm");
    var verifyForm = document.getElementById("guruVerifyOtpForm");
    var onbForm = document.getElementById("guruOnbForm");
    var logoutBtn = document.getElementById("guruLogoutBtn");
    var editBtn = document.getElementById("guruEditProfileBtn");
    var cancelBtn = document.getElementById("guruOnbCancelBtn");

    if (googleBtn) {
      googleBtn.addEventListener("click", async function () {
        var sb = Api.getSb();
        if (!sb) return setMsg("Supabase belum dikonfigurasi.", true);
        setMsg("Membuka log masuk Google...");
        var redir = window.location.origin + window.location.pathname;
        var res = await sb.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: redir, queryParams: { prompt: "select_account" } }
        });
        if (res.error) setMsg(res.error.message || "Gagal membuka log masuk Google.", true);
      });
    }

    if (otpForm) {
      otpForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var sb = Api.getSb();
        var email = String(document.getElementById("guruEmailInput").value || "").trim().toLowerCase();
        if (!sb || !email) return;
        setMsg("Menghantar kod OTP 6 digit...");
        var res = await sb.auth.signInWithOtp({ email: email, options: { shouldCreateUser: true } });
        if (res.error) return setMsg(res.error.message || "Gagal menghantar kod.", true);
        pendingEmail = email;
        verifyForm.hidden = false;
        setMsg("Kod 6 digit telah dihantar ke " + email + ". Semak juga folder Spam.");
      });
    }

    if (verifyForm) {
      verifyForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var sb = Api.getSb();
        var code = String(document.getElementById("guruOtpCodeInput").value || "").replace(/\D/g, "");
        if (!sb || !pendingEmail || code.length < 6) return setMsg("Masukkan kod 6 digit yang sah.", true);
        setMsg("Mengesahkan kod...");
        var res = await sb.auth.verifyOtp({ email: pendingEmail, token: code, type: "email" });
        if (res.error || !res.data || !res.data.session) {
          return setMsg((res.error && res.error.message) || "Kod tidak sah atau tamat tempoh.", true);
        }
        setMsg("");
        onReadyApp();
      });
    }

    if (onbForm) {
      onbForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var errEl = document.getElementById("guruOnbError");
        errEl.hidden = true;
        var forms = Array.prototype.slice.call(onbForm.querySelectorAll('input[name="onbForm"]:checked')).map(function (x) { return x.value; });
        var subjs = Array.prototype.slice.call(onbForm.querySelectorAll('input[name="onbSubject"]:checked')).map(function (x) { return x.value; });
        var res = await Api.completeOnboarding({
          p_display_name: document.getElementById("onbGuruName").value,
          p_school_name: document.getElementById("onbGuruSchool").value,
          p_teacher_state: document.getElementById("onbGuruState").value,
          p_teacher_forms: forms,
          p_teacher_subjects: subjs
        });
        if (!res || !res.ok) {
          errEl.textContent = (res && res.error) || "Gagal menyimpan profil guru.";
          errEl.hidden = false;
          return;
        }
        window.ETGuru.toast("Profil guru disimpan!");
        onReadyApp();
      });
    }

    if (editBtn) editBtn.addEventListener("click", function () { showScreen("onboarding", window.ETGuru.profile, true); });
    if (cancelBtn) cancelBtn.addEventListener("click", function () { showScreen("app", window.ETGuru.profile, false); });
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        var sb = Api.getSb();
        if (sb) await sb.auth.signOut();
        showScreen("login");
      });
    }
  }

  window.ETGuruAuth = { showScreen: showScreen, bindAuthEvents: bindAuthEvents };
})();
