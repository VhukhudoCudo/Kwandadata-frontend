/* ══════════════════════════════════════
   KwandaData — Home JS
══════════════════════════════════════ */

import { apiFetch } from './api.js';

// ── Get current user ──
function getUser() {
  var stored = localStorage.getItem("kwanda_current_user");
  return stored ? JSON.parse(stored) : null;
}

// ── Format Rand (with comma-grouped thousands, e.g. R 1,200,000.00) ──
function formatRand(value) {
  var n = Number(value);
  if (isNaN(n)) n = 0;
  return "R " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
window.formatRand = formatRand;

// ── Format a plain amount with comma-grouped thousands, no "R " prefix
//    (for use where "R" is already part of a surrounding label string) ──
function formatAmt(value) {
  var n = Number(value);
  if (isNaN(n)) n = 0;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
window.formatAmt = formatAmt;

// ── Init Home ──
function initHome() {
  loadHomeUserData();
  setHomeGreeting();
  if (typeof window.renderCampaignWallets === 'function') window.renderCampaignWallets();
  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
}


// ── Load user data into home page ──
async function loadHomeUserData() {
  var user = getUser();
  if (!user) return;

  var nameEl = document.querySelector(".home-name");
  if (nameEl) nameEl.textContent = "Hello, " + user.firstName + " 👋";

  try {
    var wallet = await apiFetch('/wallet/balance');

    var balanceEl = document.querySelector(".wallet-amount");
    if (balanceEl) balanceEl.textContent = formatRand(wallet.balance || 0);

    var bonusEl = document.querySelector(".bonus-amount");
    if (bonusEl) bonusEl.textContent = formatRand(wallet.bonusBalance || 0);

    var dataEl = document.querySelector(".data-balance");
    if (dataEl) dataEl.textContent = Number(wallet.dataBalance || 0).toFixed(0) + " MB";
  } catch (err) {
    console.error('Failed to load wallet balance:', err.message);
  }
}

// ── Set greeting based on time ──
function setHomeGreeting() {
  var greetingEl = document.querySelector(".home-greeting");
  if (!greetingEl) return;
  var hour = new Date().getHours();
  if (hour >= 5 && hour < 12)       greetingEl.textContent = "Good morning ☀️";
  else if (hour >= 12 && hour < 17) greetingEl.textContent = "Good afternoon 🌤️";
  else if (hour >= 17 && hour < 21) greetingEl.textContent = "Good evening 🌇";
  else                               greetingEl.textContent = "Good night 🌙";
}

// ── Init Profile ──
function initProfile() {
  var user = getUser();

  var nameEl   = document.querySelector(".profile-name");
  var emailEl  = document.querySelector(".profile-email");
  var avatarEl = document.querySelector(".profile-avatar");

  if (!user) {
    if (nameEl)   nameEl.textContent   = "Guest User";
    if (emailEl)  emailEl.textContent  = "Not signed in";
    if (avatarEl) avatarEl.textContent = "G";
    return;
  }

  if (nameEl)   nameEl.textContent   = user.firstName + " " + user.lastName;
  if (emailEl)  emailEl.textContent  = user.email;
  if (avatarEl) avatarEl.textContent = user.firstName.charAt(0).toUpperCase();
}

// ── Init Edit Profile ──
function initEditProfile() {
  var user = getUser();
  if (!user) return;

  var fields = {
    "edit-first-name" : user.firstName,
    "edit-last-name"  : user.lastName,
    "edit-email"      : user.email,
    "edit-phone"      : user.phone,
    "edit-dob"        : user.dob,
    "edit-gender"     : user.gender,
    "edit-race"       : user.race,
    "edit-language"   : user.language,
    "edit-province"   : user.province,
    "edit-region"     : user.region,
    "edit-employment" : user.employment,
  };

  Object.entries(fields).forEach(function(entry) {
    var id    = entry[0];
    var value = entry[1];
    var el    = document.getElementById(id);
    if (el && value) el.value = value;
  });

  var avatarEl = document.querySelector(".profile-avatar");
  if (avatarEl && user.firstName) {
    avatarEl.textContent = user.firstName.charAt(0).toUpperCase();
  }
}

// ── Save Profile ──
function saveProfile() {
  var user = getUser();
  if (!user) return;

  var oldEmail = user.email;
  var newEmail = document.getElementById("edit-email") ? document.getElementById("edit-email").value.trim().toLowerCase() : user.email;

  // Prevent switching to an email another account already uses
  if (newEmail !== oldEmail) {
    var allUsersCheck = JSON.parse(localStorage.getItem("kwanda_users") || "[]");
    var collision = allUsersCheck.find(function(u) { return (u.email || "").toLowerCase() === newEmail; });
    if (collision) {
      alert("That email is already in use by another account.");
      return;
    }
  }

  user.firstName  = document.getElementById("edit-first-name")  ? document.getElementById("edit-first-name").value.trim()  : user.firstName;
  user.lastName   = document.getElementById("edit-last-name")   ? document.getElementById("edit-last-name").value.trim()   : user.lastName;
  user.email      = newEmail;
  user.phone      = document.getElementById("edit-phone")       ? document.getElementById("edit-phone").value.trim()       : user.phone;
  user.dob        = document.getElementById("edit-dob")         ? document.getElementById("edit-dob").value                : user.dob;
  user.gender     = document.getElementById("edit-gender")      ? document.getElementById("edit-gender").value             : user.gender;
  user.race       = document.getElementById("edit-race")        ? document.getElementById("edit-race").value               : user.race;
  user.language   = document.getElementById("edit-language")    ? document.getElementById("edit-language").value           : user.language;
  user.province   = document.getElementById("edit-province")    ? document.getElementById("edit-province").value           : user.province;
  user.region     = document.getElementById("edit-region")      ? document.getElementById("edit-region").value.trim()      : user.region;
  user.employment = document.getElementById("edit-employment")  ? document.getElementById("edit-employment").value         : user.employment;

  localStorage.setItem("kwanda_current_user", JSON.stringify(user));

  // Keep kwanda_users in sync — without this, future logins keep checking
  // the OLD stored details and fail even with the new/correct ones.
  // The session copy has no password field, so merge rather than overwrite.
  var allUsers = JSON.parse(localStorage.getItem("kwanda_users") || "[]");
  var idx = allUsers.findIndex(function(u) { return (u.email || "").toLowerCase() === (oldEmail || "").toLowerCase(); });
  if (idx !== -1) {
    var existingPassword = allUsers[idx].password;
    allUsers[idx] = Object.assign({}, allUsers[idx], user, { password: existingPassword });
    localStorage.setItem("kwanda_users", JSON.stringify(allUsers));
  }

  // If the email changed, migrate this user's wallet/goals data to the new key
  // so nothing gets orphaned under the old email.
  if (newEmail !== oldEmail) {
    ['kwanda_campaign_wallet_', 'kwanda_campaign_redemptions_', 'kwanda_goals_', 'kwanda_goals_redemptions_'].forEach(function(prefix) {
      var oldVal = localStorage.getItem(prefix + oldEmail);
      if (oldVal !== null) {
        localStorage.setItem(prefix + newEmail, oldVal);
        localStorage.removeItem(prefix + oldEmail);
      }
    });
  }

  alert("Profile updated successfully!");
  navigateTo("profile");
}

// ── Save Notification Settings ──
function saveNotifSettings() {
  var settings = {
    tasks    : document.getElementById("notif-tasks")    ? document.getElementById("notif-tasks").checked    : true,
    earned   : document.getElementById("notif-earned")   ? document.getElementById("notif-earned").checked   : true,
    redeem   : document.getElementById("notif-redeem")   ? document.getElementById("notif-redeem").checked   : true,
    referral : document.getElementById("notif-referral") ? document.getElementById("notif-referral").checked : true,
    weekly   : document.getElementById("notif-weekly")   ? document.getElementById("notif-weekly").checked   : true,
    promo    : document.getElementById("notif-promo")    ? document.getElementById("notif-promo").checked    : false,
  };
  localStorage.setItem("kwanda_notif_settings", JSON.stringify(settings));
}

// ── Init Notifications ──
function initNotifications() {
  var stored = localStorage.getItem("kwanda_notif_settings");
  if (stored) {
    var settings = JSON.parse(stored);
    Object.keys(settings).forEach(function(key) {
      var el = document.getElementById("notif-" + key);
      if (el) el.checked = settings[key];
    });
  }
  loadUserAnnouncements();
}

async function loadUserAnnouncements() {
  var container = document.getElementById("user-announcements");
  if (!container) return;

  var announcements = [];
  try {
    var data = await apiFetch('/announcements');
    announcements = data.announcements || [];
  } catch (err) {
    console.error('Failed to load announcements:', err.message);
  }

  if (announcements.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>No announcements yet</div>";
    return;
  }
  container.innerHTML = announcements.map(function(a) {
    var date = new Date(a.createdAt).toLocaleString("en-ZA");
    return "<div style='background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:8px;border:1px solid var(--border);border-left:3px solid var(--primary);'>"
      + "<p style='font-size:13px;font-weight:700;color:var(--text-primary);margin:0 0 4px;'>" + a.title + "</p>"
      + "<p style='font-size:12px;color:var(--text-muted);margin:0 0 4px;line-height:1.5;'>" + a.message + "</p>"
      + "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + date + "</p>"
      + "</div>";
  }).join("");
}

// ── Change Password ──
function changePassword() {
  var currentPw    = document.getElementById("current-pw")     ? document.getElementById("current-pw").value     : "";
  var newPw        = document.getElementById("new-pw")         ? document.getElementById("new-pw").value         : "";
  var confirmNewPw = document.getElementById("confirm-new-pw") ? document.getElementById("confirm-new-pw").value : "";
  var errorEl      = document.getElementById("pw-error");
  var successEl    = document.getElementById("pw-success");

  if (errorEl)   errorEl.textContent   = "";
  if (successEl) successEl.textContent = "";

  if (!currentPw || !newPw || !confirmNewPw) {
    if (errorEl) errorEl.textContent = "Please fill in all fields.";
    return;
  }

  var stored   = localStorage.getItem("kwanda_users");
  var allUsers = stored ? JSON.parse(stored) : [];
  var user     = getUser();
  var match    = allUsers.find(function(u) { return u.email === user.email && u.password === currentPw; });

  if (!match) {
    if (errorEl) errorEl.textContent = "Current password is incorrect.";
    return;
  }
  if (newPw.length < 6) {
    if (errorEl) errorEl.textContent = "New password must be at least 6 characters.";
    return;
  }
  if (newPw !== confirmNewPw) {
    if (errorEl) errorEl.textContent = "New passwords do not match.";
    return;
  }

  match.password = newPw;
  localStorage.setItem("kwanda_users", JSON.stringify(allUsers));
  if (successEl) successEl.textContent = "Password updated successfully!";
}

// ── Update wallet balance ──
function updateHomeBalance(newBalance) {
  var balanceEl = document.querySelector(".wallet-amount");
  if (balanceEl) balanceEl.textContent = formatRand(newBalance);
  var user = getUser();
  if (user) {
    user.balance = newBalance;
    localStorage.setItem("kwanda_current_user", JSON.stringify(user));

    // Persist to the master users list too, so it carries over next
    // time this user logs in (login re-reads from kwanda_users)
    var stored   = localStorage.getItem("kwanda_users");
    var allUsers = stored ? JSON.parse(stored) : [];
    var idx      = allUsers.findIndex(function(u) { return u.email === user.email; });
    if (idx !== -1) {
      allUsers[idx].balance = newBalance;
      localStorage.setItem("kwanda_users", JSON.stringify(allUsers));
    }
  }
}

window.initHome              = initHome;
window.initProfile           = initProfile;
window.initEditProfile       = initEditProfile;
window.saveProfile           = saveProfile;
window.saveNotifSettings     = saveNotifSettings;
window.initNotifications     = initNotifications;
window.loadUserAnnouncements = loadUserAnnouncements;
window.changePassword        = changePassword;
window.updateHomeBalance     = updateHomeBalance;

export { initHome };