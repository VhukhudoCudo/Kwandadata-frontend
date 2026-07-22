/* ══════════════════════════════════════
   KwandaData - Advertiser JS
   Full clean version
══════════════════════════════════════ */
/* ══════════════════════════════════════
   KwandaData - Advertiser JS
   Full clean version
══════════════════════════════════════ */

import { apiFetch, setToken } from './api.js';

var CAMPAIGN_PRICES = { "survey":15.00, "video":5.00, "quiz":8.00, "download":20.00, "signup":25.00 };

function getAdvertiserSession() {
  var s = localStorage.getItem("kwanda_advertiser_session");
  return s ? JSON.parse(s) : null;
}
function isAdminSession() {
  var adv = getAdvertiserSession();
  return adv && adv.role === 'ADMIN';
}
function advertiserLogout() {
  localStorage.removeItem("kwanda_advertiser_session");
  setToken(null);
  navigateTo("splash");
}
function getAdvertiserCampaigns(advId) {
  var s   = localStorage.getItem("kwanda_campaigns");
  var all = s ? JSON.parse(s) : [];
  return all.filter(function(c) { return c.advertiserId === advId; });
}
async function handleAdvertiserLogin() {
  var email    = document.getElementById("adv-login-email")    ? document.getElementById("adv-login-email").value.trim() : "";
  var password = document.getElementById("adv-login-password") ? document.getElementById("adv-login-password").value     : "";
  var errorEl  = document.getElementById("adv-login-error");
  if (errorEl) errorEl.textContent = "";
  if (!email)    { if (errorEl) errorEl.textContent = "Please enter your business email."; return; }
  if (!password) { if (errorEl) errorEl.textContent = "Please enter your password.";       return; }

  try {
    var data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.user.role !== 'ADVERTISER' && data.user.role !== 'ADMIN') {
      if (errorEl) errorEl.textContent = "This account is not registered as a business or admin account.";
      return;
    }

    setToken(data.token);
    localStorage.setItem("kwanda_advertiser_session", JSON.stringify(data.user));

    if (data.user.role === 'ADMIN') {
      navigateTo("admin-panel");
    } else {
      navigateTo("advertiser-dashboard");
    }
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Incorrect email or password.";
  }
}

function handleAdvertiserRegister() {
  var company  = document.getElementById("adv-company")    ? document.getElementById("adv-company").value.trim()    : "";
  var industry = document.getElementById("adv-industry")   ? document.getElementById("adv-industry").value           : "";
  var contact  = document.getElementById("adv-contact")    ? document.getElementById("adv-contact").value.trim()    : "";
  var phone    = document.getElementById("adv-phone")      ? document.getElementById("adv-phone").value.trim()      : "";
  var email    = document.getElementById("adv-email")      ? document.getElementById("adv-email").value.trim()      : "";
  var password = document.getElementById("adv-password")   ? document.getElementById("adv-password").value           : "";
  var confirm  = document.getElementById("adv-confirm")    ? document.getElementById("adv-confirm").value            : "";
  var terms    = document.getElementById("adv-terms");
  var errorEl  = document.getElementById("adv-reg-error");
  if (errorEl) errorEl.textContent = "";
  if (!company)  { if (errorEl) errorEl.textContent = "Please enter your company name.";                return; }
  if (!industry) { if (errorEl) errorEl.textContent = "Please select your industry.";                   return; }
  if (!contact)  { if (errorEl) errorEl.textContent = "Please enter the contact person name.";          return; }
  if (!phone)    { if (errorEl) errorEl.textContent = "Please enter your phone number.";                return; }
  if (!email || email.indexOf("@") === -1) { if (errorEl) errorEl.textContent = "Please enter a valid business email."; return; }
  if (password.length < 6)  { if (errorEl) errorEl.textContent = "Password must be at least 6 characters."; return; }
  if (password !== confirm)  { if (errorEl) errorEl.textContent = "Passwords do not match.";            return; }
  if (!terms || !terms.checked) { if (errorEl) errorEl.textContent = "Please accept the Terms of Service."; return; }
  var stored      = localStorage.getItem("kwanda_advertisers");
  var advertisers = stored ? JSON.parse(stored) : [];
  var exists      = advertisers.find(function(a) { return a.email === email; });
  if (exists) { if (errorEl) errorEl.textContent = "An account with this email already exists."; return; }
  var newAdv = { id:Date.now().toString(), company:company, industry:industry, contact:contact, phone:phone, email:email, password:password, budget:0, status:"active", createdAt:new Date().toISOString() };
  advertisers.push(newAdv);
  localStorage.setItem("kwanda_advertisers", JSON.stringify(advertisers));
  var session = Object.assign({}, newAdv);
  delete session.password;
  localStorage.setItem("kwanda_advertiser_session", JSON.stringify(session));
  alert("Business account created! Welcome to KwandaData, " + company + "!");
  navigateTo("advertiser-dashboard");
}

async function initAdvertiserDashboard() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  if (adv.role === 'ADMIN') { navigateTo("admin-panel"); return; }
  var greetingEl = document.getElementById("adv-greeting");
  var hour = new Date().getHours();
  if (greetingEl) {
    if (hour >= 5 && hour < 12)       greetingEl.textContent = "Good morning";
    else if (hour >= 12 && hour < 17) greetingEl.textContent = "Good afternoon";
    else if (hour >= 17 && hour < 21) greetingEl.textContent = "Good evening";
    else                               greetingEl.textContent = "Good night";
  }
  var nameEl = document.getElementById("adv-company-name");
  if (nameEl) nameEl.textContent = (adv.firstName && adv.lastName) ? (adv.firstName + " " + adv.lastName) : "Advertiser";
  var campaigns  = await getAdvertiserCampaigns(adv.id);
  var active     = campaigns.filter(function(c) { return c.status === "active"; });
  var totalSpent = campaigns.reduce(function(sum, c) { return sum + Number(c.spent || 0); }, 0);
  var el = function(id) { return document.getElementById(id); };
  if (el("adv-total-campaigns"))   el("adv-total-campaigns").textContent  = campaigns.length;
  if (el("adv-active-campaigns"))  el("adv-active-campaigns").textContent = active.length;
  if (el("adv-total-spent"))       el("adv-total-spent").textContent      = window.formatRand(totalSpent);
  loadRecentCampaigns(adv.id);
}

function loadRecentCampaigns(advId) {
  var container = document.getElementById("adv-recent-campaigns");
  if (!container) return;
  var campaigns = cachedAdvCampaigns.slice(0, 3);
  if (campaigns.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:24px;color:var(--text-muted);'><i class='ti ti-speakerphone' style='font-size:32px;display:block;margin-bottom:8px;opacity:0.4;'></i><p style='font-size:13px;'>No campaigns yet</p></div>";
    return;
  }
  var sc = { active:"#22c55e", draft:"#9089cc", paused:"#9089cc", completed:"#3b82f6" };
  var sb = { active:"#dcfce7", draft:"#ede9fe", paused:"#ede9fe", completed:"#dbeafe" };
  var statusLabel = { active:"Active", draft:"Draft", paused:"Paused", completed:"Completed" };
  container.innerHTML = campaigns.map(function(c) {
    var color = sc[c.status]||"#9089cc"; var bg = sb[c.status]||"#ede9fe";
    var remaining = Number(c.budget||0) - Number(c.spent||0);
    return "<div style='background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:10px;border:1px solid var(--border);'><div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'><p style='font-size:14px;font-weight:700;color:var(--text-primary);'>" + c.title + "</p><span style='font-size:11px;font-weight:600;color:" + color + ";background:" + bg + ";padding:3px 10px;border-radius:20px;'>" + (statusLabel[c.status] || c.status) + "</span></div><div style='display:flex;gap:16px;'><p style='font-size:12px;color:var(--text-muted);'>Spent: <strong>R " + window.formatAmt(Number(c.spent||0)) + "</strong></p><p style='font-size:12px;color:var(--text-muted);'>Remaining: <strong style='color:#22c55e;'>R " + window.formatAmt(remaining) + "</strong></p></div></div>";
  }).join("");
}

function updateCampPrice() {
  var typeEl   = document.getElementById("camp-type");
  var budgetEl = document.getElementById("camp-budget");
  if (!typeEl) return;
  var type   = typeEl.value;
  var price  = CAMPAIGN_PRICES[type] || 0;
  var budget = parseFloat(budgetEl ? budgetEl.value : "0") || 0;
  var comps  = price > 0 && budget > 0 ? Math.floor(budget / price) : 0;
  var el = function(id) { return document.getElementById(id); };
  if (el("camp-price-display")) el("camp-price-display").textContent = price > 0 ? window.formatRand(price) : "Select activity type";
  if (el("camp-completions"))   el("camp-completions").textContent   = comps > 0 ? comps + " users" : "-";
  if (el("camp-total-cost"))    el("camp-total-cost").textContent    = budget > 0 ? window.formatRand(budget) : "-";
}

async function submitCampaign() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  var el      = function(id) { return document.getElementById(id); };
  var name    = el("camp-name")        ? el("camp-name").value.trim()        : "";
  var type    = el("camp-type")        ? el("camp-type").value                : "";
  var desc    = el("camp-description") ? el("camp-description").value.trim() : "";
  var budget  = parseFloat(el("camp-budget") ? el("camp-budget").value : "0");
  var start   = el("camp-start")       ? el("camp-start").value               : "";
  var end     = el("camp-end")         ? el("camp-end").value                 : "";
  var target  = el("camp-target")      ? el("camp-target").value              : "all";
  var errorEl = el("camp-error");
  if (errorEl) errorEl.textContent = "";
  if (!name)                         { if (errorEl) errorEl.textContent = "Please enter a campaign name.";        return; }
  if (!type)                         { if (errorEl) errorEl.textContent = "Please select an activity type.";      return; }
  if (!desc)                         { if (errorEl) errorEl.textContent = "Please enter a campaign description."; return; }
  if (isNaN(budget) || budget < 5000) { if (errorEl) errorEl.textContent = "Minimum budget is R 5,000.00.";       return; }
  if (!start)                        { if (errorEl) errorEl.textContent = "Please select a start date.";          return; }
  if (!end)                          { if (errorEl) errorEl.textContent = "Please select an end date.";           return; }
  if (start >= end)                  { if (errorEl) errorEl.textContent = "End date must be after start date.";   return; }

  // Calculate fees the same way the backend will (20% admin fee, 15% VAT, both on the budget alone)
  var adminFee    = budget * 0.20;
  var vat         = budget * 0.15;
  var totalCharge = budget + adminFee + vat;

  var confirmed = confirm(
    "Campaign Cost Breakdown\n\n" +
    "Campaign Budget:    R " + window.formatAmt(budget) + "\n" +
    "Admin Fee (20%):    R " + window.formatAmt(adminFee) + "\n" +
    "VAT (15%):          R " + window.formatAmt(vat) + "\n" +
    "─────────────────────────\n" +
    "Total Charged:      R " + window.formatAmt(totalCharge) + "\n\n" +
    "Do you want to proceed? This will create and launch the campaign immediately."
  );
  if (!confirmed) return;

  var price = CAMPAIGN_PRICES[type] || 0;

  try {
    var campResult = await apiFetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify({ title: name, description: desc, targeting: target, budget }),
    });
    var campaignId = campResult.campaign.id;

    await apiFetch(`/campaigns/${campaignId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: name, description: desc, type, reward: price }),
    });

    await apiFetch(`/campaigns/${campaignId}/launch`, { method: 'PATCH' });

    alert(
      "Campaign created and launched!\n\n" +
      "Campaign Budget:    R " + window.formatAmt(budget) + "\n" +
      "Admin Fee (20%):    R " + window.formatAmt(campResult.campaign.adminFee) + "\n" +
      "VAT (15%):          R " + window.formatAmt(campResult.campaign.vat) + "\n" +
      "─────────────────────────\n" +
      "Total Charged:      R " + window.formatAmt(campResult.campaign.totalCharged) + "\n\n" +
      "Your campaign is now live."
    );
    navigateTo("advertiser-campaigns");
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message || "Could not create this campaign. Please try again.";
  }
}
var currentCampaignFilter = "all";

async function initAdvertiserCampaigns() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  currentCampaignFilter = "all";
  await getAdvertiserCampaigns(adv.id);
  renderCampaignsList(adv.id, "all");
}

function filterCampaigns(status) {
  var adv = getAdvertiserSession();
  if (!adv) return;
  currentCampaignFilter = status;
  ["all","draft","active","paused","completed"].forEach(function(s) {
    var btn = document.getElementById("filter-" + s);
    if (btn) { btn.style.background = s===status?"#f97316":"#fff"; btn.style.color = s===status?"#fff":"var(--text-muted)"; btn.style.border = s===status?"none":"1px solid var(--border)"; }
  });
  renderCampaignsList(adv.id, status);
}

function renderCampaignsList(advId, filter) {
  var container = document.getElementById("campaigns-list");
  if (!container) return;
  var campaigns = cachedAdvCampaigns;
  var filtered  = filter === "all" ? campaigns : campaigns.filter(function(c) { return c.status === filter; });
  if (filtered.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:40px 16px;color:var(--text-muted);'><i class='ti ti-speakerphone' style='font-size:40px;display:block;margin-bottom:12px;opacity:0.3;'></i><p style='font-size:14px;font-weight:600;'>No campaigns found</p></div>";
    return;
  }
  var sc = { active:"#22c55e", draft:"#9089cc", paused:"#9089cc", completed:"#3b82f6" };
  var sb = { active:"#dcfce7", draft:"#ede9fe", paused:"#ede9fe", completed:"#dbeafe" };
  var statusLabel = { active:"Active", draft:"Draft", paused:"Paused", completed:"Completed" };
  container.innerHTML = filtered.map(function(c) {
    var color = sc[c.status]||"#9089cc"; var bg = sb[c.status]||"#ede9fe";
    var spent     = Number(c.spent||0);
    var budget    = Number(c.budget||0);
    var remaining = budget - spent;
    var firstTask = (c.tasks && c.tasks[0]) || {};
    var statsHtml = c.status==="draft"
      ? "<div style='background:#ede9fe;border-radius:8px;padding:10px;text-align:center;margin-bottom:12px;'><i class='ti ti-alert-circle' style='color:#6c63ff;margin-right:4px;'></i><span style='font-size:12px;color:#6c63ff;font-weight:600;'>Draft — this campaign hasn't launched yet.</span></div>"
      : c.status==="paused"
      ? "<div style='background:#ede9fe;border-radius:8px;padding:10px;text-align:center;margin-bottom:12px;'><i class='ti ti-player-pause' style='color:#6c63ff;margin-right:4px;'></i><span style='font-size:12px;color:#6c63ff;font-weight:600;'>Paused by KwandaData admin.</span></div>"
      : "<div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;'><div style='background:var(--bg);border-radius:8px;padding:8px;text-align:center;'><p style='font-size:10px;color:var(--text-muted);'>Spent</p><p style='font-size:16px;font-weight:700;color:#ef4444;'>R " + window.formatAmt(spent) + "</p></div><div style='background:var(--bg);border-radius:8px;padding:8px;text-align:center;'><p style='font-size:10px;color:var(--text-muted);'>Remaining</p><p style='font-size:16px;font-weight:700;color:#22c55e;'>R " + window.formatAmt(remaining) + "</p></div></div>";
    var launchHtml = c.status==="draft" ? "<button onclick=\"launchDraftCampaign('"+c.id+"')\" style='width:100%;padding:10px;border-radius:10px;background:linear-gradient(135deg,#6c63ff,#2d1b8e);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;'>Launch Campaign</button>" : "";
    var unavailableHtml = (c.status==="active") ? "<p style='font-size:11px;color:var(--text-muted);text-align:center;margin-top:8px;'>Pause / stop / add budget aren't available yet.</p>" : "";
    return "<div style='background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);'><div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;'><div style='flex:1;'><p style='font-size:15px;font-weight:700;color:var(--text-primary);'>" + c.title + "</p><p style='font-size:12px;color:var(--text-muted);margin-top:2px;'>" + (firstTask.type ? firstTask.type.charAt(0).toUpperCase() + firstTask.type.slice(1) + " - R " + window.formatAmt(firstTask.reward) + " per completion" : "") + "</p></div><span style='font-size:11px;font-weight:600;color:" + color + ";background:" + bg + ";padding:4px 12px;border-radius:20px;flex-shrink:0;'>" + (statusLabel[c.status] || c.status) + "</span></div>" + statsHtml + launchHtml + unavailableHtml + "</div>";
  }).join("");
}

async function launchDraftCampaign(campId) {
  try {
    await apiFetch(`/campaigns/${campId}/launch`, { method: 'PATCH' });
    alert("Campaign launched!");
    initAdvertiserCampaigns();
  } catch (err) {
    alert(err.message || "Could not launch this campaign. Please try again.");
  }
}

function goToTopUpForCampaign(campId) {
  alert("Adding budget to a campaign isn't available yet.");
}

function addCampaignBudget(campId) {
  alert("Adding budget to a campaign isn't available yet.");
}

function pauseCampaign(campId) {
  alert("Pausing a campaign yourself isn't available yet — contact KwandaData support if you need a campaign paused.");
}

function resumeCampaign(campId) {
  alert("Resuming a campaign isn't available yet — contact KwandaData support.");
}

function stopCampaign(campId) {
  alert("Stopping a campaign with a refund isn't available yet — contact KwandaData support.");
}

var advChartInstance = null;

// ── Data helpers ──
function getActivityLog() {
  return JSON.parse(localStorage.getItem('kwanda_activity_log') || '[]');
}
function getAllUsersData() {
  return JSON.parse(localStorage.getItem('kwanda_users') || '[]');
}

// ── Advertiser self-service: download who completed their campaigns ──
function downloadCampaignParticipants() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo('advertiser-login'); return; }

  var campaigns = getAdvertiserCampaigns(adv.id);
  if (campaigns.length === 0) {
    alert('You have no campaigns yet.');
    return;
  }

  var campaignMap = {};
  campaigns.forEach(function(c) { campaignMap[c.id] = c; });

  var users = getAllUsersData();
  var userMap = {};
  users.forEach(function(u) { userMap[u.email] = u; });

  var log = getActivityLog();
  var rows = log.filter(function(entry) {
    return entry.type === 'campaign' && entry.campaignId && campaignMap[entry.campaignId];
  });

  if (rows.length === 0) {
    alert('No participants yet for your campaigns.');
    return;
  }

  var lines = ['User ID,User Name,Campaign,Amount (R),Date'];
  rows.forEach(function(entry) {
    var camp   = campaignMap[entry.campaignId];
    var user   = userMap[entry.userId] || {};
    var name   = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'Unknown';
    var date   = entry.day || (entry.ts ? new Date(entry.ts).toISOString().slice(0, 10) : '');
    var amount = camp ? Number(camp.price).toFixed(2) : '0.00';
    var safeName = '"' + name.replace(/"/g, '""') + '"';
    var safeCamp = '"' + (camp ? camp.name : 'Unknown').replace(/"/g, '""') + '"';
    lines.push([entry.userId || '', safeName, safeCamp, amount, date].join(','));
  });

  var content = lines.join('\n');
  var blob    = new Blob([content], { type: 'text/csv' });
  var url     = URL.createObjectURL(blob);
  var a       = document.createElement('a');
  a.href      = url;
  a.download  = 'Campaign_Participants_' + (adv.company || adv.id) + '_' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
window.downloadCampaignParticipants = downloadCampaignParticipants;
function ageBucket(age) {
  var n = parseInt(age, 10);
  if (isNaN(n)) return 'Unknown';
  if (n < 18) return 'Under 18';
  if (n <= 24) return '18–24';
  if (n <= 34) return '25–34';
  if (n <= 44) return '35–44';
  if (n <= 54) return '45–54';
  return '55+';
}
function prettyLabel(str) {
  if (!str) return 'Unknown';
  return String(str).replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function initAdvertiserAnalytics() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }

  var campaigns  = getAdvertiserCampaigns(adv.id);
  var campIds    = campaigns.map(function(c) { return c.id; });
  var log        = getActivityLog();
  var campEvents = log.filter(function(e) { return e.type === 'campaign' && campIds.indexOf(e.campaignId) !== -1; });

  var totalComp  = campaigns.reduce(function(sum, c) { return sum + (c.completions||0); }, 0);
  var totalSpent = campaigns.reduce(function(sum, c) { return sum + (c.spent||0); }, 0);
  var totalImpr  = campaigns.reduce(function(sum, c) { return sum + (c.impressions||0); }, 0);
  var ctr        = totalImpr > 0 ? Math.round((totalComp / totalImpr) * 1000) / 10 : 0;

  var el = function(id) { return document.getElementById(id); };
  if (el("analytics-impressions")) el("analytics-impressions").textContent = totalImpr.toLocaleString();
  if (el("analytics-completions")) el("analytics-completions").textContent = totalComp.toLocaleString();
  if (el("analytics-rate"))        el("analytics-rate").textContent        = ctr + "%";
  if (el("analytics-spent"))       el("analytics-spent").textContent       = window.formatRand(totalSpent);

  renderDemographics(campEvents);
  renderActiveUsers();
  renderSessionMetrics();
  renderRetention(campEvents);
  drawAdvChart("week");
  renderAnalyticsBreakdown(campaigns);
  renderAttribution(campaigns, log);
}

// ── 1. User Demographics — age, gender, location of users who engaged with this advertiser's campaigns ──
function renderDemographics(campEvents) {
  var container = document.getElementById("analytics-demographics");
  if (!container) return;

  var seen = {}, uniqueUsers = [];
  campEvents.forEach(function(e) {
    if (e.userId && !seen[e.userId]) { seen[e.userId] = true; uniqueUsers.push(e); }
  });

  if (uniqueUsers.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:20px;color:var(--text-muted);'><i class='ti ti-users' style='font-size:28px;display:block;margin-bottom:6px;opacity:0.4;'></i><p style='font-size:12px;'>Demographic data appears once users complete your campaigns.</p></div>";
    return;
  }

  var ageCounts = {}, genderCounts = {}, provinceCounts = {};
  uniqueUsers.forEach(function(u) {
    var a = ageBucket(u.age);      ageCounts[a] = (ageCounts[a]||0) + 1;
    var g = u.gender || 'unknown'; genderCounts[g] = (genderCounts[g]||0) + 1;
    var p = u.province || 'unknown'; provinceCounts[p] = (provinceCounts[p]||0) + 1;
  });

  function bars(counts) {
    var total = uniqueUsers.length;
    return Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; }).map(function(k) {
      var pct = total > 0 ? Math.round((counts[k] / total) * 100) : 0;
      return "<div style='margin-bottom:9px;'><div style='display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;'><span style='color:var(--text-primary);font-weight:600;'>" + prettyLabel(k) + "</span><span style='color:var(--text-muted);'>" + counts[k] + " (" + pct + "%)</span></div><div style='background:var(--bg);border-radius:6px;height:6px;overflow:hidden;'><div style='background:#f97316;height:100%;width:" + pct + "%;border-radius:6px;'></div></div></div>";
    }).join("");
  }

  container.innerHTML =
    "<p style='font-size:11px;color:var(--text-muted);margin-bottom:12px;'>Based on " + uniqueUsers.length + " unique user" + (uniqueUsers.length===1?"":"s") + " reached</p>" +
    "<div style='margin-bottom:16px;'><p style='font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;'>Age</p>" + bars(ageCounts) + "</div>" +
    "<div style='margin-bottom:16px;'><p style='font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;'>Gender</p>" + bars(genderCounts) + "</div>" +
    "<div><p style='font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;'>Location (Province)</p>" + bars(provinceCounts) + "</div>";
}

// ── 2. Active Users — platform-wide DAU / MAU, to gauge overall app engagement ──
function renderActiveUsers() {
  var users = getAllUsersData();
  var now = Date.now();
  var oneDay = 24*60*60*1000, thirtyDays = 30*oneDay;
  var dau = users.filter(function(u) { return u.lastActiveAt && (now - u.lastActiveAt) <= oneDay; }).length;
  var mau = users.filter(function(u) { return u.lastActiveAt && (now - u.lastActiveAt) <= thirtyDays; }).length;

  var el = function(id) { return document.getElementById(id); };
  if (el("analytics-dau"))         el("analytics-dau").textContent = dau.toLocaleString();
  if (el("analytics-mau"))         el("analytics-mau").textContent = mau.toLocaleString();
  if (el("analytics-total-users")) el("analytics-total-users").textContent = users.length.toLocaleString();
}

// ── 3. Session Duration & Frequency ──
function renderSessionMetrics() {
  var users = getAllUsersData();
  var withActivity = users.filter(function(u) { return u.activeDays && u.activeDays.length > 0; });
  var avgFreq = withActivity.length > 0
    ? withActivity.reduce(function(s, u) { return s + u.activeDays.length; }, 0) / withActivity.length
    : 0;

  var log = getActivityLog();
  var relevant = log.filter(function(e) { return e.type === 'task' || e.type === 'campaign'; });
  var durationMap = { videos:1, surveys:5, tasks:2, offers:3, sponsored:3 };
  var totalMinutes = relevant.reduce(function(sum, e) {
    var cat = e.taskCategory || (e.type === 'campaign' ? 'sponsored' : 'tasks');
    return sum + (durationMap[cat] || 2);
  }, 0);
  var avgDuration = relevant.length > 0 ? (totalMinutes / relevant.length) : 0;

  var el = function(id) { return document.getElementById(id); };
  if (el("analytics-freq"))     el("analytics-freq").textContent     = withActivity.length ? avgFreq.toFixed(1) + " active days / user" : "—";
  if (el("analytics-duration")) el("analytics-duration").textContent = relevant.length ? "~" + avgDuration.toFixed(1) + " min / activity" : "—";
}

// ── 4. Retention Rate — % of users who came back to THIS advertiser's
//    campaign(s) more than once (i.e. completed a campaign activity,
//    then came back on a separate occasion and did so again) ──
function renderRetention(campEvents) {
  var el = function(id) { return document.getElementById(id); };

  var byUser = {};
  (campEvents || []).forEach(function(e) {
    if (!e.userId) return;
    if (!byUser[e.userId]) byUser[e.userId] = { days: {}, visits: 0 };
    byUser[e.userId].days[e.day] = true;
    byUser[e.userId].visits += 1;
  });

  var userIds = Object.keys(byUser);
  // "Returned" = engaged with the campaign on more than one separate
  // occasion (a different day, or more than one completion overall).
  var returning = userIds.filter(function(uid) {
    var u = byUser[uid];
    return Object.keys(u.days).length > 1 || u.visits > 1;
  });
  var rate = userIds.length > 0 ? Math.round((returning.length / userIds.length) * 100) : 0;

  if (el("analytics-retention"))     el("analytics-retention").textContent     = userIds.length ? rate + "%" : "—";
  if (el("analytics-retention-sub")) el("analytics-retention-sub").textContent = userIds.length ? (returning.length + " of " + userIds.length + " users came back to this campaign") : "No campaign activity recorded yet";
}

// ── 5. Ad Impressions & CTR — see initAdvertiserAnalytics tiles + per-campaign breakdown below ──

function drawAdvChart(period) {
  var canvas = document.getElementById("adv-chart");
  if (!canvas || typeof Chart === "undefined") return;
  var adv = getAdvertiserSession();
  if (!adv) return;
  var campIds = getAdvertiserCampaigns(adv.id).map(function(c) { return c.id; });
  var log = getActivityLog();
  var campEvents = log.filter(function(e) { return e.type === 'campaign' && campIds.indexOf(e.campaignId) !== -1; });

  if (advChartInstance) { advChartInstance.destroy(); advChartInstance = null; }

  var labels = [], data = [];
  var now = new Date();
  if (period === "week") {
    var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now); d.setDate(now.getDate() - i);
      var key = d.toISOString().slice(0, 10);
      labels.push(dayNames[d.getDay()]);
      data.push(campEvents.filter(function(e) { return e.day === key; }).length);
    }
  } else {
    labels = ["Week 1","Week 2","Week 3","Week 4"];
    data = [0,0,0,0];
    campEvents.forEach(function(e) {
      var daysAgo = Math.floor((now.getTime() - e.ts) / 86400000);
      var w = Math.floor(daysAgo / 7);
      if (w >= 0 && w < 4) data[3 - w]++;
    });
  }

  advChartInstance = new Chart(canvas.getContext("2d"), {
    type:"bar", data:{ labels:labels, datasets:[{ data:data, backgroundColor:"rgba(249,115,22,0.7)", borderColor:"#f97316", borderWidth:2, borderRadius:6 }] },
    options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false }, ticks:{ font:{ size:11 }, color:"#9089cc" } }, y:{ grid:{ color:"#f0f0f8" }, ticks:{ font:{ size:11 }, color:"#9089cc", precision:0 } } } }
  });
}

function updateAdvChart(period) { drawAdvChart(period); }

function renderAnalyticsBreakdown(campaigns) {
  var container = document.getElementById("analytics-breakdown");
  if (!container) return;
  if (!campaigns || campaigns.length === 0) {
    container.innerHTML = "<div style='background:#fff;border-radius:14px;padding:24px;border:1px solid var(--border);text-align:center;color:var(--text-muted);'><i class='ti ti-chart-bar' style='font-size:32px;display:block;margin-bottom:8px;opacity:0.4;'></i><p style='font-size:13px;'>No campaign data yet</p></div>";
    return;
  }
  container.innerHTML = campaigns.map(function(c) {
    var pct  = c.budget > 0 ? Math.round(((c.spent||0)/c.budget)*100) : 0;
    var impr = c.impressions || 0;
    var comp = c.completions || 0;
    var ctr  = impr > 0 ? Math.round((comp/impr)*1000)/10 : 0;
    return "<div style='background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border:1px solid var(--border);'><div style='display:flex;justify-content:space-between;margin-bottom:8px;'><p style='font-size:13px;font-weight:600;color:var(--text-primary);'>" + c.name + "</p><p style='font-size:13px;font-weight:700;color:#f97316;'>" + comp + " completions</p></div><div style='background:var(--bg);border-radius:6px;height:8px;overflow:hidden;'><div style='background:#f97316;height:100%;width:" + pct + "%;border-radius:6px;'></div></div><div style='display:flex;justify-content:space-between;margin-top:6px;'><p style='font-size:11px;color:var(--text-muted);'>" + impr + " impressions · " + ctr + "% CTR</p><p style='font-size:11px;color:var(--text-muted);'>Budget used: " + pct + "%</p></div></div>";
  }).join("");
}

// ── 6. Attribution — which campaign was a user's first-ever activity on KwandaData (drove their acquisition) ──
function renderAttribution(campaigns, log) {
  var container = document.getElementById("analytics-attribution");
  if (!container) return;
  if (!campaigns.length) {
    container.innerHTML = "<div style='background:#fff;border-radius:14px;padding:24px;border:1px solid var(--border);text-align:center;color:var(--text-muted);'><i class='ti ti-target-arrow' style='font-size:28px;display:block;margin-bottom:6px;opacity:0.4;'></i><p style='font-size:12px;'>No campaigns yet</p></div>";
    return;
  }

  var campIds = campaigns.map(function(c) { return c.id; });
  var firstByUser = {};
  log.forEach(function(e) {
    if (!e.userId) return;
    if (!firstByUser[e.userId] || e.ts < firstByUser[e.userId].ts) firstByUser[e.userId] = e;
  });

  var acquisitionCounts = {};
  campIds.forEach(function(id) { acquisitionCounts[id] = 0; });
  Object.keys(firstByUser).forEach(function(uid) {
    var e = firstByUser[uid];
    if (e.type === 'campaign' && campIds.indexOf(e.campaignId) !== -1) acquisitionCounts[e.campaignId]++;
  });

  container.innerHTML = campaigns.map(function(c) {
    var count = acquisitionCounts[c.id] || 0;
    return "<div style='background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:8px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;'><div><p style='font-size:13px;font-weight:600;color:var(--text-primary);'>" + c.name + "</p><p style='font-size:11px;color:var(--text-muted);'>" + (c.completions||0) + " total actions driven</p></div><div style='text-align:right;'><p style='font-size:17px;font-weight:700;color:#f97316;'>" + count + "</p><p style='font-size:10px;color:var(--text-muted);'>new users acquired</p></div></div>";
  }).join("") + "<p style='font-size:11px;color:var(--text-muted);text-align:center;margin-top:4px;'>Shown when a campaign was a user's first-ever activity on KwandaData.</p>";
}

function initAdvertiserProfile() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  var el = function(id) { return document.getElementById(id); };
  if (el("adv-profile-avatar"))   el("adv-profile-avatar").textContent   = adv.company ? adv.company.charAt(0).toUpperCase() : "?";
  if (el("adv-profile-name"))     el("adv-profile-name").textContent     = adv.company || "Company";
  if (el("adv-profile-email"))    el("adv-profile-email").textContent    = adv.email   || "";
  var industryMap = { "telecom":"Telecommunications","banking":"Banking & Finance","retail":"Retail","media":"Media & Entertainment","healthcare":"Healthcare","education":"Education","technology":"Technology","fmcg":"FMCG","other":"Other" };
  if (el("adv-profile-industry")) el("adv-profile-industry").textContent = industryMap[adv.industry] || adv.industry || "-";
  if (el("adv-profile-contact"))  el("adv-profile-contact").textContent  = adv.contact || "-";
  if (el("adv-profile-phone"))    el("adv-profile-phone").textContent    = adv.phone   || "-";
}

function initAdvertiserBilling() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  var balEl = document.getElementById("billing-balance");
  if (balEl) balEl.textContent = window.formatRand((adv.budget||0));
  loadBillingHistory(adv.id);
  renderLaunchCampaignCard(adv);
}

function renderLaunchCampaignCard(adv) {
  var card = document.getElementById("launch-campaign-card");
  if (!card) return;
  var campId = localStorage.getItem("kwanda_pending_launch_" + adv.id);
  if (!campId) { card.innerHTML = ""; return; }
  var stored    = localStorage.getItem("kwanda_campaigns");
  var campaigns = stored ? JSON.parse(stored) : [];
  var camp      = campaigns.find(function(c) { return c.id === campId && c.status === "unpaid"; });
  if (!camp) { localStorage.removeItem("kwanda_pending_launch_" + adv.id); card.innerHTML = ""; return; }
  card.innerHTML = "<div style='background:#ede9fe;border-radius:14px;padding:16px;border:1.5px solid #6c63ff;margin-bottom:14px;'>" +
    "<p style='font-size:11px;font-weight:700;color:#2d1b8e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;'><i class='ti ti-speakerphone' style='margin-right:4px;'></i>Campaign Awaiting Payment</p>" +
    "<p style='font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px;'>" + camp.name + "</p>" +
    "<p style='font-size:13px;color:var(--text-muted);margin-bottom:10px;'>Total to pay: <strong style='color:#2d1b8e;'>R " + window.formatAmt((camp.totalCharged||0)) + "</strong></p>" +
    "<button onclick=\"launchCampaign()\" style='width:100%;padding:13px;border-radius:30px;background:linear-gradient(135deg,#6c63ff,#2d1b8e);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;'>Launch Campaign</button>" +
    "</div>";
}

function launchCampaign() {
  var adv = getAdvertiserSession();
  if (!adv) return;
  var campId = localStorage.getItem("kwanda_pending_launch_" + adv.id);
  if (!campId) return;
  var stored    = localStorage.getItem("kwanda_campaigns");
  var campaigns = stored ? JSON.parse(stored) : [];
  var campIndex = campaigns.findIndex(function(c) { return c.id === campId && c.status === "unpaid"; });
  if (campIndex === -1) { localStorage.removeItem("kwanda_pending_launch_" + adv.id); renderLaunchCampaignCard(adv); return; }
  var camp = campaigns[campIndex];

  var advStored   = localStorage.getItem("kwanda_advertisers");
  var advertisers = advStored ? JSON.parse(advStored) : [];
  var advIndex    = advertisers.findIndex(function(a) { return a.id === adv.id; });
  var available   = advIndex !== -1 ? (advertisers[advIndex].budget || 0) : 0;

  if (available < camp.totalCharged) {
    alert("Insufficient budget to launch this campaign.\n\nTotal Due:  R " + window.formatAmt(camp.totalCharged) + "\nAvailable:  R " + window.formatAmt(available) + "\n\nTop up first, then launch.");
    return;
  }

  // Deduct total charge from advertiser budget
  advertisers[advIndex].budget = available - camp.totalCharged;
  localStorage.setItem("kwanda_advertisers", JSON.stringify(advertisers));
  adv.budget = advertisers[advIndex].budget;
  localStorage.setItem("kwanda_advertiser_session", JSON.stringify(adv));

  // Move campaign to pending (awaiting admin approval)
  campaigns[campIndex].status = "pending";
  localStorage.setItem("kwanda_campaigns", JSON.stringify(campaigns));

  // Save to billing history
  var billingHistory = JSON.parse(localStorage.getItem("kwanda_billing_" + adv.id) || "[]");
  billingHistory.unshift({
    type: "campaign",
    campaignName: camp.name,
    budget: camp.budget,
    adminFee: camp.adminFee,
    vat: camp.vat,
    amount: camp.totalCharged,
    date: new Date().toLocaleString("en-ZA"),
    status: "charged"
  });
  localStorage.setItem("kwanda_billing_" + adv.id, JSON.stringify(billingHistory));

  localStorage.removeItem("kwanda_pending_launch_" + adv.id);

  var balEl = document.getElementById("billing-balance");
  if (balEl) balEl.textContent = window.formatRand((adv.budget||0));
  loadBillingHistory(adv.id);
  renderLaunchCampaignCard(adv);

  alert("Campaign launched! It's now awaiting KwandaData approval.");
}

function setTopUpAmount(amount) {
  var input = document.getElementById("topup-amount");
  if (input) input.value = amount;
}

function handleTopUp() {
  var adv = getAdvertiserSession();
  if (!adv) return;
  var amountEl = document.getElementById("topup-amount");
  var amount   = parseFloat(amountEl ? amountEl.value : "0");
  if (isNaN(amount) || amount < 5000) { alert("Minimum top-up amount is R 5,000.00"); return; }
  var stored      = localStorage.getItem("kwanda_advertisers");
  var advertisers = stored ? JSON.parse(stored) : [];
  var index       = advertisers.findIndex(function(a) { return a.id === adv.id; });
  if (index !== -1) {
    advertisers[index].budget = (advertisers[index].budget||0) + amount;
    localStorage.setItem("kwanda_advertisers", JSON.stringify(advertisers));
    adv.budget = advertisers[index].budget;
    localStorage.setItem("kwanda_advertiser_session", JSON.stringify(adv));
  }
  var history = JSON.parse(localStorage.getItem("kwanda_billing_" + adv.id) || "[]");
  history.unshift({ type:"topup", amount:amount, date:new Date().toLocaleString("en-ZA"), status:"success" });
  localStorage.setItem("kwanda_billing_" + adv.id, JSON.stringify(history));
  if (amountEl) amountEl.value = "";
  var balEl = document.getElementById("billing-balance");
  if (balEl) balEl.textContent = window.formatRand((adv.budget||0));
  loadBillingHistory(adv.id);
  alert("Budget topped up! Added: R " + window.formatAmt(amount) + " | New Balance: R " + window.formatAmt((adv.budget||0)));
}

function loadBillingHistory(advId) {
  var container = document.getElementById("billing-history");
  if (!container) return;
  var history = JSON.parse(localStorage.getItem("kwanda_billing_" + advId) || "[]");
  if (history.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);'><i class='ti ti-receipt' style='font-size:32px;display:block;margin-bottom:8px;opacity:0.4;'></i><p style='font-size:13px;'>No billing history yet</p></div>";
    return;
  }
  container.innerHTML = history.map(function(h, index) {
    var isTopup = h.type === "topup";
    var detail = "";
    if (!isTopup && h.adminFee) {
      detail = "<p style='font-size:10px;color:var(--text-muted);'>Admin Fee: R " + window.formatAmt((h.adminFee||0)) + " | VAT: R " + window.formatAmt((h.vat||0)) + "</p>";
    }
    var downloadBtn = !isTopup ? "<button onclick='downloadCampaignStatement(" + index + ")' style='margin-top:6px;padding:5px 12px;border-radius:20px;background:#ede9fe;color:#2d1b8e;border:none;font-size:11px;font-weight:600;cursor:pointer;'><i class=\"ti ti-download\" style=\"margin-right:4px;\"></i>Download</button>" : "";
    return "<div style='padding:12px 0;border-bottom:1px solid var(--border);'><div style='display:flex;justify-content:space-between;align-items:flex-start;'><div><p style='font-size:13px;font-weight:600;color:var(--text-primary);'>" + (isTopup ? "Budget Top Up" : (h.campaignName || "Campaign Charge")) + "</p><p style='font-size:11px;color:var(--text-muted);'>" + h.date + "</p>" + detail + downloadBtn + "</div><div style='text-align:right;'><p style='font-size:14px;font-weight:700;color:" + (isTopup ? "#22c55e" : "#ef4444") + ";'>" + (isTopup ? "+" : "-") + window.formatRand(h.amount) + "</p><span style='font-size:11px;color:#166634;background:#dcfce7;padding:2px 8px;border-radius:10px;'>" + h.status + "</span></div></div></div>";
  }).join("");
}

function downloadCampaignStatement(index) {
  var adv = getAdvertiserSession();
  if (!adv) return;
  var history = JSON.parse(localStorage.getItem("kwanda_billing_" + adv.id) || "[]");
  var h = history[index];
  if (!h) return;

  var lines = [];
  lines.push("========================================");
  lines.push("      KWANDADATA CAMPAIGN STATEMENT     ");
  lines.push("========================================");
  lines.push("Company:        " + (adv.company || "N/A"));
  lines.push("Email:          " + (adv.email || "N/A"));
  lines.push("Date Issued:    " + new Date().toLocaleDateString("en-ZA"));
  lines.push("========================================");
  lines.push("");
  lines.push("Campaign:       " + (h.campaignName || "N/A"));
  lines.push("Date Charged:   " + h.date);
  lines.push("Status:         " + h.status);
  lines.push("");
  lines.push("----------------------------------------");
  lines.push("Campaign Budget:    R " + window.formatAmt((h.budget || 0)));
  lines.push("Admin Fee (15%):    R " + window.formatAmt((h.adminFee || 0)));
  lines.push("VAT (15%):          R " + window.formatAmt((h.vat || 0)));
  lines.push("----------------------------------------");
  lines.push("Total Charged:      R " + window.formatAmt(h.amount));
  lines.push("========================================");
  lines.push("Thank you for advertising with KwandaData");
  lines.push("support@kwandadata.co.za");
  lines.push("========================================");

  var content = lines.join("\n");
  var blob = new Blob([content], { type: "text/plain" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "KwandaData_" + (h.campaignName || "Campaign").replace(/\s+/g, "_") + "_Statement.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.downloadCampaignStatement = downloadCampaignStatement;
function downloadBillingStatement() {
  var adv = getAdvertiserSession();
  if (!adv) return;
  var history = JSON.parse(localStorage.getItem("kwanda_billing_" + adv.id) || "[]");

  var lines = [];
  lines.push("========================================");
  lines.push("        KWANDADATA BILLING STATEMENT    ");
  lines.push("========================================");
  lines.push("Company:   " + (adv.company || "N/A"));
  lines.push("Email:     " + (adv.email || "N/A"));
  lines.push("Date:      " + new Date().toLocaleDateString("en-ZA"));
  lines.push("========================================");
  lines.push("");

  var totalCharged = 0;
  var totalTopUp = 0;

  history.forEach(function(h) {
    var isTopup = h.type === "topup";
    lines.push("Date:      " + h.date);
    lines.push("Type:      " + (isTopup ? "Budget Top Up" : "Campaign Charge"));
    if (!isTopup) {
      lines.push("Campaign:  " + (h.campaignName || "N/A"));
      lines.push("Budget:    R " + window.formatAmt((h.budget || h.amount)));
      lines.push("Admin Fee (15%): R " + window.formatAmt((h.adminFee || 0)));
      lines.push("VAT (15%): R " + window.formatAmt((h.vat || 0)));
      lines.push("Total Charged: R " + window.formatAmt(h.amount));
      totalCharged += h.amount;
    } else {
      lines.push("Amount:    R " + window.formatAmt(h.amount));
      totalTopUp += h.amount;
    }
    lines.push("Status:    " + h.status);
    lines.push("----------------------------------------");
  });

  lines.push("");
  lines.push("========================================");
  lines.push("SUMMARY");
  lines.push("========================================");
  lines.push("Total Top Ups:     R " + window.formatAmt(totalTopUp));
  lines.push("Total Charged:     R " + window.formatAmt(totalCharged));
  lines.push("Current Balance:   R " + window.formatAmt((adv.budget || 0)));
  lines.push("========================================");
  lines.push("Thank you for advertising with KwandaData");
  lines.push("support@kwandadata.co.za");
  lines.push("========================================");

  var content = lines.join("\n");
  var blob = new Blob([content], { type: "text/plain" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "KwandaData_Statement_" + new Date().toISOString().slice(0,10) + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.downloadBillingStatement = downloadBillingStatement;

function initAdminPanel() {
  if (!isAdminSession()) { navigateTo("advertiser-login"); return; }
  loadAdminPanelStats();
}

function loadAdminPanelStats() {
  var stored      = localStorage.getItem("kwanda_campaigns");
  var campaigns   = stored ? JSON.parse(stored) : [];
  var advStored   = localStorage.getItem("kwanda_advertisers");
  var advertisers = advStored ? JSON.parse(advStored) : [];
  var pending = campaigns.filter(function(c) { return c.status==="pending"; });
  var active  = campaigns.filter(function(c) { return c.status==="active"; });
  var el = function(id) { return document.getElementById(id); };
  if (el("admin-panel-total"))       el("admin-panel-total").textContent       = campaigns.length;
  if (el("admin-panel-pending"))     el("admin-panel-pending").textContent     = pending.length;
  if (el("admin-panel-active"))      el("admin-panel-active").textContent      = active.length;
  if (el("admin-panel-advertisers")) el("admin-panel-advertisers").textContent = advertisers.length;
}

// ── NEW: Admin Campaigns Management ──
function initAdminCampaignsMgmt() {
  if (!isAdminSession()) { navigateTo("advertiser-login"); return; }
  loadAdminPanelStats();
  var stored    = localStorage.getItem("kwanda_campaigns");
  var campaigns = stored ? JSON.parse(stored) : [];
  var totalEl   = document.getElementById("camp-mgmt-total");
  var pendingEl = document.getElementById("camp-mgmt-pending");
  if (totalEl)   totalEl.textContent   = campaigns.length;
  if (pendingEl) pendingEl.textContent = campaigns.filter(function(c){ return c.status==="pending"; }).length;
  filterAdminCampaigns("pending");
}

function filterAdminCampaigns(status) {
  ["pending","active","all"].forEach(function(f) {
    var btn = document.getElementById("admin-filter-" + f);
    if (btn) { btn.style.background = f===status?"#f97316":"#fff"; btn.style.color = f===status?"#fff":"var(--text-muted)"; btn.style.border = f===status?"none":"1px solid var(--border)"; }
  });
  renderAdminCampaigns(status);
}

function renderAdminCampaigns(filter) {
  var container = document.getElementById("admin-campaigns-list");
  if (!container) return;
  var stored    = localStorage.getItem("kwanda_campaigns");
  var campaigns = stored ? JSON.parse(stored) : [];
  var filtered  = filter==="all" ? campaigns : campaigns.filter(function(c) { return c.status===filter; });
  if (filtered.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:32px;color:var(--text-muted);'><i class='ti ti-speakerphone' style='font-size:40px;display:block;margin-bottom:12px;opacity:0.3;'></i><p style='font-size:14px;font-weight:600;'>No campaigns found</p></div>";
    return;
  }
  var sc = { active:"#22c55e", pending:"#f97316", paused:"#9089cc", rejected:"#ef4444", completed:"#3b82f6" };
  var sb = { active:"#dcfce7", pending:"#fff7ed", paused:"#ede9fe", rejected:"#fee2e2", completed:"#dbeafe" };
  container.innerHTML = filtered.map(function(c) {
    var color     = sc[c.status]||"#9089cc";
    var bg        = sb[c.status]||"#ede9fe";
    var isPending = c.status==="pending";
    return "<div style='background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid var(--border);'>"
      + "<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;'><div style='flex:1;'><p style='font-size:15px;font-weight:700;color:var(--text-primary);'>" + c.name + "</p><p style='font-size:12px;color:var(--text-muted);margin-top:2px;'>By: " + c.companyName + "</p><p style='font-size:12px;color:var(--text-muted);'>" + c.type + " - R " + window.formatAmt(c.price) + " per completion | Budget: R " + window.formatAmt(c.budget) + "</p></div><span style='font-size:11px;font-weight:600;color:" + color + ";background:" + bg + ";padding:4px 12px;border-radius:20px;flex-shrink:0;'>" + c.status.charAt(0).toUpperCase() + c.status.slice(1) + "</span></div>"
      + "<p style='font-size:12px;color:var(--text-muted);margin-bottom:10px;padding:8px;background:var(--bg);border-radius:8px;'>" + c.desc + "</p>"
      + (isPending ? "<div style='display:flex;gap:8px;'><button onclick=\"adminApproveCampaign('" + c.id + "')\" style='flex:1;padding:11px;border-radius:10px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;'>Approve</button><button onclick=\"adminRejectCampaign('" + c.id + "')\" style='flex:1;padding:11px;border-radius:10px;background:#fff;border:1.5px solid #ef4444;color:#ef4444;font-size:13px;font-weight:700;cursor:pointer;'>Reject</button></div>" : "")
      + "</div>";
  }).join("");
}

function adminApproveCampaign(campId) {
  if (!confirm("Approve this campaign? It will go live immediately.")) return;
  updateCampaignStatus(campId, "active");
  alert("Campaign approved and is now live!");
  initAdminCampaignsMgmt();
}

function adminRejectCampaign(campId) {
  if (!confirm("Reject this campaign?")) return;
  updateCampaignStatus(campId, "rejected");
  alert("Campaign rejected.");
  initAdminCampaignsMgmt();
}

function initAdminUsersMgmt() {
  if (!isAdminSession()) { navigateTo("advertiser-login"); return; }
  var stored   = localStorage.getItem("kwanda_users");
  var users    = stored ? JSON.parse(stored) : [];
  var active   = users.filter(function(u) { return u.status !== "suspended"; });
  var totalEl  = document.getElementById("admin-total-users");
  var activeEl = document.getElementById("admin-active-users");
  if (totalEl)  totalEl.textContent  = users.length;
  if (activeEl) activeEl.textContent = active.length;
  renderAdminUsersList(users);
}

function searchAdminUsers(query) {
  var stored = localStorage.getItem("kwanda_users");
  var users  = stored ? JSON.parse(stored) : [];
  var q      = query.toLowerCase();
  var filtered = q ? users.filter(function(u) {
    return ((u.firstName||"") + " " + (u.lastName||"")).toLowerCase().includes(q) || (u.email||"").toLowerCase().includes(q);
  }) : users;
  renderAdminUsersList(filtered);
}

function renderAdminUsersList(users) {
  var container = document.getElementById("admin-users-list");
  if (!container) return;
  if (users.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:32px;color:var(--text-muted);'><i class='ti ti-users-off' style='font-size:40px;display:block;margin-bottom:12px;opacity:0.3;'></i><p style='font-size:14px;font-weight:600;'>No users found</p></div>";
    return;
  }
  var colors = ["linear-gradient(135deg,#6c63ff,#2d1b8e)","linear-gradient(135deg,#f97316,#ea580c)","linear-gradient(135deg,#22c55e,#16a34a)","linear-gradient(135deg,#3b82f6,#1d4ed8)","linear-gradient(135deg,#ef4444,#b91c1c)"];
  container.innerHTML = users.map(function(u, i) {
    var name      = (u.firstName||"") + " " + (u.lastName||"");
    var letter    = u.firstName ? u.firstName.charAt(0).toUpperCase() : "?";
    var color     = colors[i % colors.length];
    var suspended = u.status === "suspended";
    var statusLabel = suspended
      ? "<span style='font-size:11px;font-weight:600;color:#ef4444;background:#fee2e2;padding:3px 10px;border-radius:20px;'>Suspended</span>"
      : "<span style='font-size:11px;font-weight:600;color:#22c55e;background:#dcfce7;padding:3px 10px;border-radius:20px;'>Active</span>";
    var actionBtn = suspended
      ? "<button onclick=\"reinstateUser('" + u.email + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid #22c55e;color:#22c55e;font-size:12px;font-weight:600;cursor:pointer;'>Reinstate</button>"
      : "<button onclick=\"suspendUser('" + u.email + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid #ef4444;color:#ef4444;font-size:12px;font-weight:600;cursor:pointer;'>Suspend</button>";
    return "<div style='background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:12px;border:1px solid var(--border);'>"
      + "<div style='display:flex;align-items:center;gap:12px;margin-bottom:10px;'>"
      + "<div style='width:40px;height:40px;border-radius:50%;background:" + color + ";display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;font-weight:700;flex-shrink:0;'>" + letter + "</div>"
      + "<div style='flex:1;'><p style='font-size:14px;font-weight:600;color:var(--text-primary);'>" + name + "</p><p style='font-size:12px;color:var(--text-muted);'>" + (u.email||"") + "</p></div>"
      + statusLabel + "</div>"
      + "<div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;'>"
      + "<div style='background:var(--bg);border-radius:8px;padding:8px;'><p style='font-size:10px;color:var(--text-muted);'>Wallet Balance</p><p style='font-size:14px;font-weight:700;color:var(--primary);'>R " + window.formatAmt((u.balance||0)) + "</p></div>"
      + "<div style='background:var(--bg);border-radius:8px;padding:8px;'><p style='font-size:10px;color:var(--text-muted);'>Data Balance</p><p style='font-size:14px;font-weight:700;color:#3b82f6;'>R " + window.formatAmt((u.dataBalance||0)) + "</p></div>"
      + "</div>"
      + "<div style='display:flex;gap:8px;'>"
      + "<button onclick=\"adjustUserBalance('" + u.email + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid var(--primary);color:var(--primary);font-size:12px;font-weight:600;cursor:pointer;'>Adjust Balance</button>"
      + actionBtn + "</div></div>";
  }).join("");
}

function suspendUser(email) {
  if (!confirm("Suspend user " + email + "?")) return;
  var stored = localStorage.getItem("kwanda_users");
  var users  = stored ? JSON.parse(stored) : [];
  var index  = users.findIndex(function(u) { return u.email === email; });
  if (index !== -1) { users[index].status = "suspended"; localStorage.setItem("kwanda_users", JSON.stringify(users)); }
  alert("User suspended.");
  initAdminUsersMgmt();
}

function reinstateUser(email) {
  var stored = localStorage.getItem("kwanda_users");
  var users  = stored ? JSON.parse(stored) : [];
  var index  = users.findIndex(function(u) { return u.email === email; });
  if (index !== -1) { users[index].status = "active"; localStorage.setItem("kwanda_users", JSON.stringify(users)); }
  alert("User reinstated.");
  initAdminUsersMgmt();
}

function adjustUserBalance(email) {
  var stored = localStorage.getItem("kwanda_users");
  var users  = stored ? JSON.parse(stored) : [];
  var user   = users.find(function(u) { return u.email === email; });
  if (!user) return;
  var input = prompt("Adjust wallet for " + user.firstName + "\nCurrent: R " + window.formatAmt((user.balance||0)) + "\nEnter new balance (R):");
  if (input === null) return;
  var newBal = parseFloat(input);
  if (isNaN(newBal) || newBal < 0) { alert("Please enter a valid amount."); return; }
  var index = users.findIndex(function(u) { return u.email === email; });
  if (index !== -1) { users[index].balance = newBal; localStorage.setItem("kwanda_users", JSON.stringify(users)); }
  alert("Balance updated to R " + window.formatAmt(newBal));
  initAdminUsersMgmt();
}

function initAdminAdvertisersMgmt() {
  if (!isAdminSession()) { navigateTo("advertiser-login"); return; }
  var stored = localStorage.getItem("kwanda_advertisers");
  var advs   = stored ? JSON.parse(stored) : [];
  var active = advs.filter(function(a) { return a.status !== "suspended"; });
  var totalEl  = document.getElementById("admin-total-advs");
  var activeEl = document.getElementById("admin-active-advs");
  if (totalEl)  totalEl.textContent  = advs.length;
  if (activeEl) activeEl.textContent = active.length;
  renderAdminAdvertisersList(advs);
}

function searchAdminAdvertisers(query) {
  var stored = localStorage.getItem("kwanda_advertisers");
  var advs   = stored ? JSON.parse(stored) : [];
  var q      = query.toLowerCase();
  var filtered = q ? advs.filter(function(a) {
    return (a.company||"").toLowerCase().includes(q) || (a.email||"").toLowerCase().includes(q);
  }) : advs;
  renderAdminAdvertisersList(filtered);
}

function renderAdminAdvertisersList(advs) {
  var container = document.getElementById("admin-advertisers-list");
  if (!container) return;
  if (advs.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:32px;color:var(--text-muted);'><i class='ti ti-building-off' style='font-size:40px;display:block;margin-bottom:12px;opacity:0.3;'></i><p style='font-size:14px;font-weight:600;'>No advertisers found</p></div>";
    return;
  }
  var colors = ["linear-gradient(135deg,#f97316,#ea580c)","linear-gradient(135deg,#3b82f6,#1d4ed8)","linear-gradient(135deg,#22c55e,#16a34a)","linear-gradient(135deg,#9089cc,#6c63ff)","linear-gradient(135deg,#ef4444,#b91c1c)"];
  var industryMap = { "telecom":"Telecommunications","banking":"Banking & Finance","retail":"Retail","media":"Media & Entertainment","healthcare":"Healthcare","education":"Education","technology":"Technology","fmcg":"FMCG","other":"Other" };
  container.innerHTML = advs.map(function(a, i) {
    var letter    = a.company ? a.company.charAt(0).toUpperCase() : "?";
    var color     = colors[i % colors.length];
    var suspended = a.status === "suspended";
    var industry  = industryMap[a.industry] || a.industry || "—";
    var campaigns = JSON.parse(localStorage.getItem("kwanda_campaigns")||"[]").filter(function(c) { return c.advertiserId === a.id; });
    var statusLabel = suspended
      ? "<span style='font-size:11px;font-weight:600;color:#ef4444;background:#fee2e2;padding:3px 10px;border-radius:20px;'>Suspended</span>"
      : "<span style='font-size:11px;font-weight:600;color:#22c55e;background:#dcfce7;padding:3px 10px;border-radius:20px;'>Active</span>";
    var actionBtn = suspended
      ? "<button onclick=\"reinstateAdvertiser('" + a.id + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid #22c55e;color:#22c55e;font-size:12px;font-weight:600;cursor:pointer;'>Reinstate</button>"
      : "<button onclick=\"suspendAdvertiser('" + a.id + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid #ef4444;color:#ef4444;font-size:12px;font-weight:600;cursor:pointer;'>Suspend</button>";
    return "<div style='background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:12px;border:1px solid var(--border);'>"
      + "<div style='display:flex;align-items:center;gap:12px;margin-bottom:10px;'>"
      + "<div style='width:44px;height:44px;border-radius:12px;background:" + color + ";display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:700;flex-shrink:0;'>" + letter + "</div>"
      + "<div style='flex:1;'><p style='font-size:14px;font-weight:600;color:var(--text-primary);'>" + (a.company||"—") + "</p><p style='font-size:12px;color:var(--text-muted);'>" + (a.email||"") + "</p><p style='font-size:11px;color:var(--text-muted);'>" + industry + "</p></div>"
      + statusLabel + "</div>"
      + "<div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;'>"
      + "<div style='background:var(--bg);border-radius:8px;padding:8px;'><p style='font-size:10px;color:var(--text-muted);'>Budget</p><p style='font-size:14px;font-weight:700;color:#f97316;'>R " + window.formatAmt((a.budget||0)) + "</p></div>"
      + "<div style='background:var(--bg);border-radius:8px;padding:8px;'><p style='font-size:10px;color:var(--text-muted);'>Campaigns</p><p style='font-size:14px;font-weight:700;color:var(--primary);'>" + campaigns.length + "</p></div>"
      + "</div>"
      + "<div style='display:flex;gap:8px;'>"
      + "<button onclick=\"adjustAdvertiserBudget('" + a.id + "')\" style='flex:1;padding:9px;border-radius:10px;background:#fff;border:1.5px solid #f97316;color:#f97316;font-size:12px;font-weight:600;cursor:pointer;'>Adjust Budget</button>"
      + actionBtn + "</div></div>";
  }).join("");
}

function suspendAdvertiser(advId) {
  if (!confirm("Suspend this advertiser?")) return;
  var stored = localStorage.getItem("kwanda_advertisers");
  var advs   = stored ? JSON.parse(stored) : [];
  var index  = advs.findIndex(function(a) { return a.id === advId; });
  if (index !== -1) { advs[index].status = "suspended"; localStorage.setItem("kwanda_advertisers", JSON.stringify(advs)); }
  var campStored = localStorage.getItem("kwanda_campaigns");
  var campaigns  = campStored ? JSON.parse(campStored) : [];
  campaigns = campaigns.map(function(c) { if (c.advertiserId === advId && c.status === "active") c.status = "paused"; return c; });
  localStorage.setItem("kwanda_campaigns", JSON.stringify(campaigns));
  alert("Advertiser suspended.");
  initAdminAdvertisersMgmt();
}

function reinstateAdvertiser(advId) {
  var stored = localStorage.getItem("kwanda_advertisers");
  var advs   = stored ? JSON.parse(stored) : [];
  var index  = advs.findIndex(function(a) { return a.id === advId; });
  if (index !== -1) { advs[index].status = "active"; localStorage.setItem("kwanda_advertisers", JSON.stringify(advs)); }
  alert("Advertiser reinstated.");
  initAdminAdvertisersMgmt();
}

function adjustAdvertiserBudget(advId) {
  var stored = localStorage.getItem("kwanda_advertisers");
  var advs   = stored ? JSON.parse(stored) : [];
  var adv    = advs.find(function(a) { return a.id === advId; });
  if (!adv) return;
  var input = prompt("Adjust budget for " + adv.company + "\nCurrent: R " + window.formatAmt((adv.budget||0)) + "\nEnter new budget (R):");
  if (input === null) return;
  var newBudget = parseFloat(input);
  if (isNaN(newBudget) || newBudget < 0) { alert("Please enter a valid amount."); return; }
  var index = advs.findIndex(function(a) { return a.id === advId; });
  if (index !== -1) { advs[index].budget = newBudget; localStorage.setItem("kwanda_advertisers", JSON.stringify(advs)); }
  alert("Budget updated to R " + window.formatAmt(newBudget));
  initAdminAdvertisersMgmt();
}

function changeAdvertiserPassword() {
  var currentPw = document.getElementById("adv-current-pw")  ? document.getElementById("adv-current-pw").value  : "";
  var newPw     = document.getElementById("adv-new-pw")      ? document.getElementById("adv-new-pw").value      : "";
  var confirmPw = document.getElementById("adv-confirm-pw")  ? document.getElementById("adv-confirm-pw").value  : "";
  var errorEl   = document.getElementById("adv-pw-error");
  var successEl = document.getElementById("adv-pw-success");
  if (errorEl)   errorEl.textContent   = "";
  if (successEl) successEl.textContent = "";
  if (!currentPw) { if (errorEl) errorEl.textContent = "Please enter your current password."; return; }
  if (!newPw)     { if (errorEl) errorEl.textContent = "Please enter a new password.";         return; }
  if (newPw.length < 6) { if (errorEl) errorEl.textContent = "New password must be at least 6 characters."; return; }
  if (newPw !== confirmPw) { if (errorEl) errorEl.textContent = "Passwords do not match."; return; }
  var adv         = getAdvertiserSession();
  if (!adv) { navigateTo("advertiser-login"); return; }
  var stored      = localStorage.getItem("kwanda_advertisers");
  var advertisers = stored ? JSON.parse(stored) : [];
  var index       = advertisers.findIndex(function(a) { return a.email === adv.email && a.password === currentPw; });
  if (index === -1) { if (errorEl) errorEl.textContent = "Current password is incorrect."; return; }
  advertisers[index].password = newPw;
  localStorage.setItem("kwanda_advertisers", JSON.stringify(advertisers));
  if (successEl) successEl.textContent = "Password updated successfully!";
  if (document.getElementById("adv-current-pw")) document.getElementById("adv-current-pw").value = "";
  if (document.getElementById("adv-new-pw"))     document.getElementById("adv-new-pw").value     = "";
  if (document.getElementById("adv-confirm-pw")) document.getElementById("adv-confirm-pw").value = "";
}

// ── Live-update: as users complete activities (possibly in another
//    browser tab), refresh whichever advertiser screen is currently
//    open so "Remaining", "Spent", and analytics figures (including
//    campaign retention) stay current without the advertiser needing
//    to navigate away and back. ──
window.addEventListener("storage", function(e) {
  if (["kwanda_campaigns", "kwanda_advertisers", "kwanda_activity_log", "kwanda_users"].indexOf(e.key) === -1) return;
  var adv = getAdvertiserSession();
  if (!adv) return;

  if (document.getElementById("campaigns-list")) {
    renderCampaignsList(adv.id, currentCampaignFilter);
  }
  if (document.getElementById("adv-recent-campaigns")) {
    initAdvertiserDashboard();
  }
  if (document.getElementById("analytics-retention")) {
    initAdvertiserAnalytics();
  }
  if (document.getElementById("billing-balance")) {
    var stored      = localStorage.getItem("kwanda_advertisers");
    var advertisers = stored ? JSON.parse(stored) : [];
    var fresh        = advertisers.find(function(a) { return a.id === adv.id; });
    var balEl = document.getElementById("billing-balance");
    if (balEl && fresh) balEl.textContent = window.formatRand((fresh.budget || 0));
  }
});

window.handleAdvertiserLogin    = handleAdvertiserLogin;
window.handleAdvertiserRegister = handleAdvertiserRegister;
window.getAdvertiserSession     = getAdvertiserSession;
window.advertiserLogout         = advertiserLogout;
window.getAdvertiserCampaigns   = getAdvertiserCampaigns;
window.initAdvertiserDashboard  = initAdvertiserDashboard;
window.updateCampPrice          = updateCampPrice;
window.submitCampaign           = submitCampaign;
window.initAdvertiserCampaigns  = initAdvertiserCampaigns;
window.filterCampaigns          = filterCampaigns;
window.pauseCampaign            = pauseCampaign;
window.resumeCampaign           = resumeCampaign;
window.stopCampaign             = stopCampaign;
window.addCampaignBudget        = addCampaignBudget;
window.initAdvertiserAnalytics  = initAdvertiserAnalytics;
window.updateAdvChart           = updateAdvChart;
window.initAdvertiserProfile    = initAdvertiserProfile;
window.initAdvertiserBilling    = initAdvertiserBilling;
window.setTopUpAmount           = setTopUpAmount;
window.handleTopUp              = handleTopUp;
window.goToTopUpForCampaign     = goToTopUpForCampaign;
window.launchDraftCampaign      = launchDraftCampaign;
window.launchCampaign           = launchCampaign;
window.renderLaunchCampaignCard = renderLaunchCampaignCard;
window.initAdminPanel           = initAdminPanel;
window.initAdminCampaignsMgmt   = initAdminCampaignsMgmt;
window.filterAdminCampaigns     = filterAdminCampaigns;
window.adminApproveCampaign     = adminApproveCampaign;
window.adminRejectCampaign      = adminRejectCampaign;
window.initAdminUsersMgmt       = initAdminUsersMgmt;
window.searchAdminUsers         = searchAdminUsers;
window.suspendUser              = suspendUser;
window.reinstateUser            = reinstateUser;
window.adjustUserBalance        = adjustUserBalance;
window.initAdminAdvertisersMgmt = initAdminAdvertisersMgmt;
window.searchAdminAdvertisers   = searchAdminAdvertisers;
window.suspendAdvertiser        = suspendAdvertiser;
window.reinstateAdvertiser      = reinstateAdvertiser;
window.adjustAdvertiserBudget   = adjustAdvertiserBudget;
window.changeAdvertiserPassword = changeAdvertiserPassword;

function handleAdvertiserForgotPassword() {
  var email     = document.getElementById("adv-reset-email")    ? document.getElementById("adv-reset-email").value.trim()    : "";
  var errorEl   = document.getElementById("adv-reset-error");
  var successEl = document.getElementById("adv-reset-success");
  if (errorEl)   errorEl.textContent   = "";
  if (successEl) successEl.textContent = "";
  if (!email) { if (errorEl) errorEl.textContent = "Please enter your business email."; return; }
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) { if (errorEl) errorEl.textContent = "Please enter a valid email address."; return; }
  var stored      = localStorage.getItem("kwanda_advertisers");
  var advertisers = stored ? JSON.parse(stored) : [];
  var exists      = advertisers.find(function(a) { return a.email === email; });
  if (!exists) { if (errorEl) errorEl.textContent = "No advertiser account found with this email."; return; }
  if (successEl) successEl.textContent = "✅ Password reset link sent to " + email + ". Please check your inbox.";
  var btn = document.querySelector("button[onclick='handleAdvertiserForgotPassword()']");
  if (btn) { btn.textContent = "Link Sent!"; btn.disabled = true; btn.style.background = "#22c55e"; }
}

window.handleAdvertiserForgotPassword = handleAdvertiserForgotPassword;

/* ══════════════════════════════════════
   Campaign Objective Wallet — advertiser-side code redemption
   Codes are stored per-user under kwanda_campaign_redemptions_<email>.
   Advertisers don't know which user holds a code, so we scan all
   regular users to find a match, then confirm it belongs to this
   advertiser before marking it redeemed.
══════════════════════════════════════ */

// ── Search every user's redemption history for a matching code ──
function findCampaignRedemptionByCode(code) {
  var usersStored = localStorage.getItem('kwanda_users');
  var allUsers     = usersStored ? JSON.parse(usersStored) : [];

  for (var i = 0; i < allUsers.length; i++) {
    var email   = allUsers[i].email;
    var key     = 'kwanda_campaign_redemptions_' + email;
    var history = JSON.parse(localStorage.getItem(key) || '[]');

    for (var j = 0; j < history.length; j++) {
      if (history[j].code === code) {
        return { email: email, key: key, index: j, record: history[j] };
      }
    }
  }
  return null;
}

// ── Advertiser confirms a customer's code ──
function confirmCampaignCode() {
  var adv = getAdvertiserSession();
  if (!adv) { navigateTo('advertiser-login'); return; }

  var input = document.getElementById('adv-redeem-code-input');
  var code  = input ? input.value.trim().toUpperCase() : '';
  if (!code) { alert('Please enter a code.'); return; }

  var found = findCampaignRedemptionByCode(code);
  if (!found) { alert('Code not found. Please check it and try again.'); return; }

  if (found.record.advertiserId !== adv.id) {
    alert('This code was not issued for your company.');
    return;
  }
  if (found.record.status === 'redeemed') {
    alert('This code has already been redeemed on ' + found.record.date + '.');
    return;
  }

  found.record.status     = 'redeemed';
  found.record.redeemedAt = new Date().toLocaleString('en-ZA');

  var history = JSON.parse(localStorage.getItem(found.key) || '[]');
  history[found.index] = found.record;
  localStorage.setItem(found.key, JSON.stringify(history));

  if (input) input.value = '';

  alert(
    '✅ Code confirmed!\n\n' +
    'Amount: R ' + window.formatAmt(found.record.amount) + '\n' +
    'Customer: ' + found.email + '\n\n' +
    'You may now complete the purchase.'
  );

  renderAdvPendingCodes();
}

// ── List codes still pending for this advertiser, across all users ──
function renderAdvPendingCodes() {
  var container = document.getElementById('adv-pending-codes-list');
  if (!container) return;

  var adv = getAdvertiserSession();
  if (!adv) { container.innerHTML = ''; return; }

  var usersStored = localStorage.getItem('kwanda_users');
  var allUsers     = usersStored ? JSON.parse(usersStored) : [];
  var pending      = [];

  allUsers.forEach(function(u) {
    var key     = 'kwanda_campaign_redemptions_' + u.email;
    var history = JSON.parse(localStorage.getItem(key) || '[]');
    history.forEach(function(r) {
      if (r.advertiserId === adv.id && r.status === 'pending') {
        pending.push(Object.assign({}, r, { userEmail: u.email }));
      }
    });
  });

  if (pending.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-ticket-off" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No pending codes right now.</div>';
    return;
  }

  container.innerHTML = pending.map(function(r) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + r.code + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0;">' + r.userEmail + ' &bull; ' + r.date + '</p></div>'
      + '<p style="font-size:14px;font-weight:700;color:#f97316;margin:0;">R ' + window.formatAmt(r.amount) + '</p>'
      + '</div>';
  }).join('');
}

// ── Init the Redeem Code page ──
function initAdvertiserRedeemCode() {
  renderAdvPendingCodes();
}

window.confirmCampaignCode   = confirmCampaignCode;
window.initAdvertiserRedeemCode = initAdvertiserRedeemCode;