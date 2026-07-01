/* ══════════════════════════════════════
   KwandaData — Earn JS
   - 15% admin fee
   - 30% auto data allocation
   - 55% to wallet
══════════════════════════════════════ */

let ADMIN_FEE_PERCENT  = 15;
let DATA_SPLIT_PERCENT = 30;
const MB_PER_RAND        = 5;  // R 1.00 = 5MB

const TASKS = [
  {
    id       : 1,
    category : 'videos',
    icon     : 'ti-player-play',
    color    : 'blue',
    title    : 'Watch a short video',
    desc     : 'Watch and earn money',
    duration : '~ 1 min',
    reward   : 2.00,
  },
  {
    id       : 2,
    category : 'surveys',
    icon     : 'ti-file-text',
    color    : 'green',
    title    : 'Complete a Survey',
    desc     : 'Share your opinion',
    duration : '~ 5 min',
    reward   : 10.00,
  },
  {
    id       : 3,
    category : 'tasks',
    icon     : 'ti-help-circle',
    color    : 'purple',
    title    : 'Daily Quiz',
    desc     : 'Answer quiz questions',
    duration : '~ 2 min',
    reward   : 3.00,
  },
  {
    id       : 4,
    category : 'offers',
    icon     : 'ti-tag',
    color    : 'orange',
    title    : 'Partner Offer',
    desc     : 'Check out this offer',
    duration : '~ varies',
    reward   : 15.00,
    isMax    : true,
  },
];

// ── Calculate earnings split ──
function calculateSplit(grossReward) {
  const adminFee     = grossReward * (ADMIN_FEE_PERCENT / 100);
  const afterFee     = grossReward - adminFee;
  const dataRands    = afterFee * (DATA_SPLIT_PERCENT / 100);
  const dataMB       = dataRands * MB_PER_RAND;  // Convert to MB
  const walletAmount = afterFee - dataRands;
  return {
    gross    : grossReward,
    adminFee : adminFee,
    afterFee : afterFee,
    dataRands: dataRands,
    dataMB   : dataMB,
    wallet   : walletAmount,
  };
}

let activeTab = 'all';

function initEarn() {
  // Load admin-set prices and splits if available
  var settings = JSON.parse(localStorage.getItem("kwanda_app_settings") || "{}");
  if (settings.prices) {
    TASKS[0].reward = settings.prices.video    || 2.00;
    TASKS[1].reward = settings.prices.survey   || 10.00;
    TASKS[2].reward = settings.prices.quiz     || 3.00;
    TASKS[3].reward = settings.prices.download || 15.00;
  }
  if (settings.splits) {
    ADMIN_FEE_PERCENT  = settings.splits.admin || 15;
    DATA_SPLIT_PERCENT = settings.splits.data  || 30;
  }
  bumpCampaignImpressions();
  renderTasks('all');
}

// ── Each time a user is shown their sponsored/active campaigns, count it
//    as an ad impression for those campaigns (real, not simulated). ──
function bumpCampaignImpressions() {
  try {
    var stored = localStorage.getItem('kwanda_campaigns');
    var all    = stored ? JSON.parse(stored) : [];
    var changed = false;
    all.forEach(function(c) {
      if (c.status === 'active') {
        c.impressions = (c.impressions || 0) + 1;
        changed = true;
      }
    });
    if (changed) localStorage.setItem('kwanda_campaigns', JSON.stringify(all));
  } catch (e) {}
}

function switchTab(tabBtn) {
  document.querySelectorAll('.earn-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  tabBtn.classList.add('active');
  const tabName = tabBtn.textContent.trim().toLowerCase();
  activeTab = tabName;
  renderTasks(tabName);
}

function renderTasks(tab) {
  const container = document.getElementById('task-list');
  if (!container) return;

  const filtered = tab === 'all'
    ? TASKS
    : TASKS.filter(task => task.category === tab);

  // Get active advertiser campaigns
  const storedCamps = localStorage.getItem('kwanda_campaigns');
  const allCampaigns = storedCamps ? JSON.parse(storedCamps) : [];
  const activeCamps  = allCampaigns.filter(c => c.status === 'active');

  if (filtered.length === 0 && activeCamps.length === 0) {
    container.innerHTML = `<div class="tx-empty"><i class="ti ti-inbox"></i>No tasks available.</div>`;
    return;
  }

  // Build campaign task cards from already loaded campaigns
  const campCards = activeCamps.map(camp => {
    return `
      <div class="task-item" id="camp-${camp.id}" style="border-left:3px solid #f97316;">
        <div class="task-icon orange">
          <i class="ti ti-speakerphone"></i>
        </div>
        <div class="task-info">
          <h4>${camp.name}</h4>
          <p>${camp.desc}</p>
          <span class="task-duration" style="color:#f97316;font-weight:600;">Sponsored by ${camp.companyName}</span>
        </div>
        <div class="task-right">
          <span class="task-reward">R ${window.formatAmt(camp.price)}</span>
          <button class="btn-small" style="background:#f97316;" onclick="startCampaignTask('${camp.id}')">Start</button>
        </div>
      </div>
    `;
  }).join('');

  // Always show sponsored tasks on all tabs
  const sponsoredSection = activeCamps.length > 0
    ? `<div style="padding:8px 0 4px;margin-top:8px;"><p style="font-size:12px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:0.5px;padding:0 4px;">🏢 Sponsored Tasks</p></div>` + campCards
    : '';

  container.innerHTML = filtered.map(task => {
    return `
      <div class="task-item" id="task-${task.id}">
        <div class="task-icon ${task.color}">
          <i class="ti ${task.icon}"></i>
        </div>
        <div class="task-info">
          <h4>${task.title}</h4>
          <p>${task.desc}</p>
          <span class="task-duration">${task.duration}</span>
        </div>
        <div class="task-right">
          <span class="task-reward">
            ${task.isMax ? 'Up to ' : ''}R ${window.formatAmt(task.reward)}
          </span>
          <button class="btn-small" onclick="startTask(${task.id})">Start</button>
        </div>
      </div>
    `;
  }).join('') + sponsoredSection;
}

function startTask(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;

  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) { navigateTo('sign-in'); return; }

  const split = calculateSplit(task.reward);

  // Update wallet balance (Rands)
  user.balance     = (user.balance   || 0) + split.wallet;
  // Update data balance (MB)
  user.dataBalance = (user.dataBalance || 0) + split.dataMB;
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  // Track privately (not shown in user-facing admin)
  try {
    var adminStats  = JSON.parse(localStorage.getItem('_k_fees') || '{"t":0,"count":0}');
    adminStats.t     = (adminStats.t     || 0) + split.adminFee;
    adminStats.count = (adminStats.count || 0) + 1;
    localStorage.setItem('_k_fees', JSON.stringify(adminStats));
  } catch(e) {}

  if (typeof window.logActivity === 'function') window.logActivity('task', null, { taskCategory: task.category });

  // Disable start button (silent visual confirmation instead of a popup)
  const btn = document.querySelector(`#task-${taskId} .btn-small`);
  if (btn) {
    btn.textContent      = 'Done';
    btn.disabled         = true;
    btn.style.background = '#22c55e';
  }

  // Update home balance if visible
  const balEl  = document.querySelector('.wallet-amount');
  const dataEl = document.querySelector('.data-balance');
  if (balEl)  balEl.textContent  = window.formatRand(user.balance);
  if (dataEl) dataEl.textContent = window.formatRand(user.dataBalance);
}


function startCampaignTask(campId) {
  const stored    = localStorage.getItem('kwanda_campaigns');
  const campaigns = stored ? JSON.parse(stored) : [];
  const camp      = campaigns.find(c => c.id === campId);
  if (!camp) return;

  const user = localStorage.getItem('kwanda_current_user');
  const currentUser = user ? JSON.parse(user) : null;
  if (!currentUser) { navigateTo('sign-in'); return; }

  const split = calculateSplit(camp.price);

  // Credit user
  currentUser.balance     = (currentUser.balance     || 0) + split.wallet;
  currentUser.dataBalance = (currentUser.dataBalance || 0) + split.dataMB;
  localStorage.setItem('kwanda_current_user', JSON.stringify(currentUser));

  // Update campaign stats
  const index = campaigns.findIndex(c => c.id === campId);
  if (index !== -1) {
    campaigns[index].completions = (campaigns[index].completions || 0) + 1;
    campaigns[index].spent       = (campaigns[index].spent       || 0) + camp.price;
    // Check if budget exhausted
    if (campaigns[index].spent >= campaigns[index].budget) {
      campaigns[index].status = 'completed';
    }
    localStorage.setItem('kwanda_campaigns', JSON.stringify(campaigns));
  }

  // Track admin fee privately
  try {
    var adminStats  = JSON.parse(localStorage.getItem('_k_fees') || '{"t":0,"count":0}');
    adminStats.t     = (adminStats.t     || 0) + split.adminFee;
    adminStats.count = (adminStats.count || 0) + 1;
    localStorage.setItem('_k_fees', JSON.stringify(adminStats));
  } catch(e) {}

  if (typeof window.logActivity === 'function') window.logActivity('campaign', campId);

  // Disable button (silent visual confirmation instead of a popup)
  const btn = document.querySelector(`#camp-${campId} .btn-small`);
  if (btn) {
    btn.textContent      = 'Done';
    btn.disabled         = true;
    btn.style.background = '#22c55e';
  }
}


function releasePendingBonus(user) {
  if (!user.pendingBonus || user.pendingBonus <= 0) return;
  if (user.tasksCompleted > 0) return; // already released on a previous task

  const REFERRAL_BONUS = user.pendingBonus;
  const adminFee       = REFERRAL_BONUS * 0.15;
  const afterFee       = REFERRAL_BONUS - adminFee;
  const dataMB         = afterFee * 0.30 * MB_PER_RAND;
  const walletAmt      = afterFee * 0.55;

  // Credit new user
  user.balance     = (user.balance     || 0) + walletAmt;
  user.dataBalance = (user.dataBalance || 0) + dataMB;
  user.pendingBonus = 0;
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  // Update in allUsers
  var allStored = localStorage.getItem('kwanda_users');
  var allUsers  = allStored ? JSON.parse(allStored) : [];
  var idx       = allUsers.findIndex(function(u) { return u.email === user.email; });
  if (idx !== -1) {
    allUsers[idx].balance     = user.balance;
    allUsers[idx].dataBalance = user.dataBalance;
    allUsers[idx].pendingBonus = 0;

    // Also release referrer's pending bonus
    if (user.usedReferralOf) {
      var referrerIdx = allUsers.findIndex(function(u) { return u.referralCode === user.usedReferralOf; });
      if (referrerIdx !== -1 && allUsers[referrerIdx].pendingBonus > 0) {
        var rBonus     = allUsers[referrerIdx].pendingBonus;
        var rAdminFee  = rBonus * 0.15;
        var rAfterFee  = rBonus - rAdminFee;
        var rDataMB    = rAfterFee * 0.30 * MB_PER_RAND;
        var rWallet    = rAfterFee * 0.55;
        allUsers[referrerIdx].balance     = (allUsers[referrerIdx].balance     || 0) + rWallet;
        allUsers[referrerIdx].dataBalance = (allUsers[referrerIdx].dataBalance || 0) + rDataMB;
        allUsers[referrerIdx].pendingBonus = 0;

        // Track admin fees
        try {
          var af = JSON.parse(localStorage.getItem('_k_fees') || '{"t":0,"count":0}');
          af.t = (af.t||0) + rAdminFee + adminFee;
          localStorage.setItem('_k_fees', JSON.stringify(af));
        } catch(e) {}
      }
    }

    localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
  }

  alert('🎉 Referral bonus released!\n\nYou completed your first task!\n📶 Data bonus: ' + dataMB.toFixed(0) + 'MB\n💰 Wallet bonus: R ' + window.formatAmt(walletAmt) + '\n\nYour referrer also received their bonus!');
}

export { initEarn, switchTab, startTask };
window.initEarn  = initEarn;
window.switchTab = switchTab;
window.startTask            = startTask;
window.startCampaignTask    = startCampaignTask;
window.releasePendingBonus  = releasePendingBonus;