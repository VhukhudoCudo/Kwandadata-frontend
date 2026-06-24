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
}

function loadRedeemBalance() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) return;
  const balanceEl = document.querySelector('.wallet-amount');
  if (balanceEl) balanceEl.textContent = 'R ' + (user.balance || 0).toFixed(2);
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

  // Save to redemption history
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
    alert('Not enough balance.\n' + option.title + ' requires at least R ' + option.minMB.toFixed(2) + '.\nYour balance: R ' + balance.toFixed(2));
    return;
  }

  const input = prompt('Redeem: ' + option.title + ' | Balance: R ' + balance.toFixed(2) + ' | Min: R ' + option.minMB.toFixed(2) + ' | Enter amount (R):');
  if (input === null) return;

  const amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount < option.minMB) { alert('Minimum for ' + option.title + ' is R ' + option.minMB.toFixed(2) + '.'); return; }
  if (amount > balance) { alert('Not enough balance. Your balance: R ' + balance.toFixed(2)); return; }

  const newBalance = balance - amount;
  user.balance = newBalance;
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  // Update in users list too
  const allUsersStored = localStorage.getItem('kwanda_users');
  const allUsers = allUsersStored ? JSON.parse(allUsersStored) : [];
  const idx = allUsers.findIndex(function(u) { return u.email === user.email; });
  if (idx !== -1) {
    allUsers[idx].balance = newBalance;
    localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
  }

  // Save to redemption history
  saveRedemptionRecord(user.email, option.title, 'R ' + amount.toFixed(2));

  loadRedeemBalance();
  renderRedemptions();
  if (typeof addTransaction === 'function') addTransaction('redeemed', 'ti-refresh', option.title, amount);

  alert('✅ Redemption successful!\n' + option.title + ': R ' + amount.toFixed(2) + '\nRemaining balance: R ' + newBalance.toFixed(2));
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

export { initRedeem, handleRedeem };
window.initRedeem       = initRedeem;
window.redeemDataBundle = redeemDataBundle;
window.handleRedeem     = handleRedeem;
window.renderRedemptions = renderRedemptions;