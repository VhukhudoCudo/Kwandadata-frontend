/* ══════════════════════════════════════
   KwandaData — Redeem JS
══════════════════════════════════════ */

const REDEEM_OPTIONS = {
  'airtime'      : { title:'Airtime',      minMB: 2   },
  'data-bundle'  : { title:'Data Bundle',  minMB: 5   },
  'partner-apps' : { title:'Partner Apps', minMB: 2   },
  'cash-out'     : { title:'Cash Out',     minMB: 20  },
};

function initRedeem() {
  loadRedeemBalance();
  renderRedemptions();
  renderCampaignWallets();
  renderCampaignCodes();
}

function loadRedeemBalance() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) return;
  const balanceEl = document.querySelector('.wallet-amount');
  if (balanceEl) balanceEl.textContent = window.formatRand((user.balance || 0));
  const dataEl = document.querySelector('.data-balance-redeem');
  if (dataEl) dataEl.textContent = (user.dataBalance || 0).toFixed(0) + ' MB';
}

function redeemDataBundle() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) { navigateTo('sign-in'); return; }

  const dataMB = user.dataBalance || 0;
  if (dataMB < 50) {
    alert('Minimum data redemption is 50MB. Your balance: ' + dataMB.toFixed(0) + 'MB');
    return;
  }

  const phone = prompt('Redeem Data Bundle - Your data balance: ' + dataMB.toFixed(0) + 'MB - Enter phone number to receive data bundle:');
  if (!phone) return;

  const input = prompt('How many MB to redeem? Min 50MB. Available: ' + dataMB.toFixed(0) + 'MB');
  if (!input) return;

  const amount = parseFloat(input);
  if (isNaN(amount) || amount < 50) { alert('Minimum redemption is 50MB.'); return; }
  if (amount > dataMB) { alert('Not enough data balance. Available: ' + dataMB.toFixed(0) + 'MB'); return; }

  user.dataBalance = dataMB - amount;
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  const allUsersStored = localStorage.getItem('kwanda_users');
  const allUsers = allUsersStored ? JSON.parse(allUsersStored) : [];
  const idx = allUsers.findIndex(function(u) { return u.email === user.email; });
  if (idx !== -1) { 
    allUsers[idx].dataBalance = user.dataBalance;
    localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
  }

  saveRedemptionRecord(user.email, 'Data Bundle', amount + 'MB');

  loadRedeemBalance();
  renderRedemptions();
  alert('Data bundle redeemed!\n' + amount.toFixed(0) + 'MB sent to ' + phone + '\nRemaining data: ' + user.dataBalance.toFixed(0) + 'MB');
}

function handleRedeem(type) {
  const option = REDEEM_OPTIONS[type];
  if (!option) return;

  const stored  = localStorage.getItem('kwanda_current_user');
  const user    = stored ? JSON.parse(stored) : null;
  if (!user) { navigateTo('sign-in'); return; }

  const balance = user.balance || 0;

  if (balance < option.minMB) {
    alert('Not enough balance.\n' + option.title + ' requires at least R ' + window.formatAmt(option.minMB) + '.\nYour balance: R ' + window.formatAmt(balance));
    return;
  }

  const input = prompt('Redeem: ' + option.title + ' | Balance: R ' + window.formatAmt(balance) + ' | Min: R ' + window.formatAmt(option.minMB) + ' | Enter amount (R):');
  if (input === null) return;

  const amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount < option.minMB) { alert('Minimum for ' + option.title + ' is R ' + window.formatAmt(option.minMB) + '.'); return; }
  if (amount > balance) { alert('Not enough balance. Your balance: R ' + window.formatAmt(balance)); return; }

  const newBalance = balance - amount;
  user.balance = newBalance;
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  const allUsersStored = localStorage.getItem('kwanda_users');
  const allUsers = allUsersStored ? JSON.parse(allUsersStored) : [];
  const idx = allUsers.findIndex(function(u) { return u.email === user.email; });
  if (idx !== -1) {
    allUsers[idx].balance = newBalance;
    localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
  }

  saveRedemptionRecord(user.email, option.title, window.formatRand(amount));

  loadRedeemBalance();
  renderRedemptions();
  if (typeof addTransaction === 'function') addTransaction('redeemed', 'ti-refresh', option.title, amount);

  alert('✅ Redemption successful!\n' + option.title + ': R ' + window.formatAmt(amount) + '\nRemaining balance: R ' + window.formatAmt(newBalance));
}

// ── Save redemption to localStorage history ──
function saveRedemptionRecord(userEmail, title, displayAmount) {
  var key     = 'kwanda_redemptions_' + userEmail;
  var history = JSON.parse(localStorage.getItem(key) || '[]');
  var now     = new Date();
  var date    = now.toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' });
  var time    = now.toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' });
  history.unshift({ title: title, date: date + ' • ' + time, amount: displayAmount, status: 'success' });
  localStorage.setItem(key, JSON.stringify(history));
}

// ── Render redemptions from localStorage only ──
function renderRedemptions() {
  const container = document.getElementById('redemption-list');
  if (!container) return;

  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) { container.innerHTML = ''; return; }

  var key     = 'kwanda_redemptions_' + user.email;
  var history = JSON.parse(localStorage.getItem(key) || '[]');

  if (history.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemptions yet.</div>';
    return;
  }

  container.innerHTML = history.map(function(r) {
    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + r.title + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0;">' + r.date + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 2px;">' + r.amount + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:#166534;background:#dcfce7;padding:2px 8px;border-radius:10px;">' + r.status.charAt(0).toUpperCase() + r.status.slice(1) + '</span>'
      + '</div></div>';
  }).join('');
}

/* ══════════════════════════════════════
   Campaign Objective Wallet
   - Summary card (like Balance/Bonus), always visible
   - Per-company breakdown listed below it
   - Redeemed for a unique code, shown to that company's
     shop to complete a purchase
══════════════════════════════════════ */

// ── Render the Campaign Objective Wallet total + per-company breakdown ──
function renderCampaignWallets() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;

  const totalEl = document.getElementById('campaign-wallet-total');
  const listEl  = document.getElementById('campaign-wallet-list');

  if (!user) {
    if (totalEl) totalEl.textContent = window.formatRand(0);
    if (listEl)  listEl.innerHTML = '';
    return;
  }

  var key    = 'kwanda_campaign_wallet_' + user.email;
  var wallet = JSON.parse(localStorage.getItem(key) || '{}');

  var entries = Object.keys(wallet).map(function(advId) {
    return {
      advertiserId: advId,
      companyName : wallet[advId].companyName,
      balance     : wallet[advId].balance || 0,
    };
  }).filter(function(e) { return e.balance > 0; });

  // Update the summary card total
  var total = entries.reduce(function(sum, e) { return sum + e.balance; }, 0);
  if (totalEl) totalEl.textContent = window.formatRand(total);

  // Update the per-company breakdown list
  if (!listEl) return;

  if (entries.length === 0) {
    listEl.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-building-store" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No campaign rewards yet. Complete sponsored tasks to earn company-specific rewards.</div>';
    return;
  }

  listEl.innerHTML = entries.map(function(e) {
    return '<div class="redeem-option" onclick="redeemCampaignBalance(\'' + e.advertiserId + '\')">'
      + '<div class="redeem-icon orange"><i class="ti ti-building-store"></i></div>'
      + '<div class="redeem-info"><h4>' + e.companyName + '</h4><p>Available: R ' + window.formatAmt(e.balance) + '</p></div>'
      + '<i class="ti ti-chevron-right redeem-arrow"></i>'
      + '</div>';
  }).join('');
}

// ── Redeem some/all of a company's balance for a code ──
function redeemCampaignBalance(advertiserId) {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) { navigateTo('sign-in'); return; }

  var key    = 'kwanda_campaign_wallet_' + user.email;
  var wallet = JSON.parse(localStorage.getItem(key) || '{}');
  var entry  = wallet[advertiserId];

  if (!entry || entry.balance <= 0) {
    alert('No balance available to redeem for this company.');
    return;
  }

  var input = prompt(
    'Redeem Campaign Reward — ' + entry.companyName +
    '\nAvailable: R ' + window.formatAmt(entry.balance) +
    '\nEnter amount to redeem:'
  );
  if (!input) return;

  var amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount > entry.balance) { alert('Not enough balance. Available: R ' + window.formatAmt(entry.balance)); return; }

  entry.balance -= amount;
  wallet[advertiserId] = entry;
  localStorage.setItem(key, JSON.stringify(wallet));

  var code = generateRedemptionCode();
  saveCampaignRedemption(user.email, advertiserId, entry.companyName, amount, code);

  renderCampaignWallets();
  renderCampaignCodes();

  alert(
    '✅ Redeemed!\n\n' +
    'Company: ' + entry.companyName + '\n' +
    'Amount: R ' + window.formatAmt(amount) + '\n\n' +
    'Your code:\n' + code + '\n\n' +
    'Show this code at ' + entry.companyName + ' to complete your purchase.'
  );
}

// ── Generate a unique-looking redemption code ──
function generateRedemptionCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
  var code  = 'KW-';
  for (var i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ── Save a campaign redemption code to localStorage history ──
function saveCampaignRedemption(email, advertiserId, companyName, amount, code) {
  var key     = 'kwanda_campaign_redemptions_' + email;
  var history = JSON.parse(localStorage.getItem(key) || '[]');
  var now     = new Date();
  var date    = now.toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' });
  var time    = now.toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' });

  history.unshift({
    advertiserId: advertiserId,
    companyName : companyName,
    amount      : amount,
    code        : code,
    status      : 'pending', // becomes 'redeemed' once the shop confirms it (future step)
    date        : date + ' • ' + time,
  });

  localStorage.setItem(key, JSON.stringify(history));
}

// ── Render the user's list of generated campaign codes ──
function renderCampaignCodes() {
  const container = document.getElementById('campaign-codes-list');
  if (!container) return;

  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) { container.innerHTML = ''; return; }

  var key     = 'kwanda_campaign_redemptions_' + user.email;
  var history = JSON.parse(localStorage.getItem(key) || '[]');

  if (history.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-ticket" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemption codes yet.</div>';
    return;
  }

  container.innerHTML = history.map(function(r) {
    var statusColor = r.status === 'redeemed' ? '#166534' : '#92400e';
    var statusBg    = r.status === 'redeemed' ? '#dcfce7' : '#fef3c7';
    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + r.companyName + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">' + r.date + '</p>'
      + '<p style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:var(--text-primary);margin:0;">' + r.code + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 4px;">R ' + window.formatAmt(r.amount) + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:' + statusColor + ';background:' + statusBg + ';padding:2px 8px;border-radius:10px;">' + (r.status.charAt(0).toUpperCase() + r.status.slice(1)) + '</span>'
      + '</div></div>';
  }).join('');
}

export { initRedeem, handleRedeem };
window.initRedeem              = initRedeem;
window.redeemDataBundle        = redeemDataBundle;
window.handleRedeem            = handleRedeem;
window.renderRedemptions       = renderRedemptions;
window.renderCampaignWallets   = renderCampaignWallets;
window.redeemCampaignBalance   = redeemCampaignBalance;
window.renderCampaignCodes     = renderCampaignCodes;