/* ══════════════════════════════════════
   KwandaData — Personal Goals Wallet
   - User creates named goals with a fixed target amount
   - User manually transfers money from the Hello Wallet into a goal
   - Deleting a goal refunds its saved balance to the Hello Wallet
══════════════════════════════════════ */

// ── Get current user ──
function getGoalsUser() {
  var stored = localStorage.getItem('kwanda_current_user');
  return stored ? JSON.parse(stored) : null;
}

// ── Read the goals list for a given email ──
function getGoals(email) {
  var key = 'kwanda_goals_' + email;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// ── Persist the goals list for a given email ──
function saveGoals(email, goals) {
  var key = 'kwanda_goals_' + email;
  localStorage.setItem(key, JSON.stringify(goals));
}

// ── Create a new goal with a fixed target amount ──
function createGoal(name, target) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  name   = (name || '').trim();
  target = parseFloat(target);

  if (!name) { alert('Please enter a goal name.'); return; }
  if (isNaN(target) || target <= 0) { alert('Please enter a valid target amount.'); return; }

  var goals = getGoals(user.email);
  goals.unshift({
    id     : 'goal_' + Date.now(),
    name   : name,
    target : target,
    saved  : 0,
  });
  saveGoals(user.email, goals);

  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
}

// ── Transfer an amount from the Hello Wallet (user.balance) into a goal ──
function fundGoal(goalId, amount) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount > (user.balance || 0)) {
    alert('Not enough balance in your Hello Wallet. Available: ' + window.formatRand(user.balance || 0));
    return;
  }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) { alert('Goal not found.'); return; }

  var remaining = goal.target - goal.saved;
  if (amount > remaining) {
    alert('That would go over the goal target. You only need R ' + window.formatAmt(remaining) + ' more.');
    return;
  }

  // Deduct from main wallet
  user.balance = (user.balance || 0) - amount;
  updateUserRecord(user);

  // Add to goal
  goal.saved += amount;
  saveGoals(user.email, goals);

  // Log transaction
  if (typeof window.addTransaction === 'function') {
    window.addTransaction('transferred', 'ti-target-arrow', 'Transferred to goal: ' + goal.name, -amount);
  }

  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
  if (typeof window.loadHomeUserData === 'function') window.loadHomeUserData();
  if (typeof window.loadWalletBalance === 'function') window.loadWalletBalance();
}

// ── Delete a goal, refunding its saved balance back to the Hello Wallet ──
function deleteGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) { alert('Goal not found.'); return; }

  if (!confirm('Delete "' + goal.name + '"? Any saved balance (R ' + window.formatAmt(goal.saved) + ') will be returned to your Hello Wallet.')) {
    return;
  }

  if (goal.saved > 0) {
    user.balance = (user.balance || 0) + goal.saved;
    updateUserRecord(user);

    if (typeof window.addTransaction === 'function') {
      window.addTransaction('earned', 'ti-target-arrow', 'Goal deleted, refunded: ' + goal.name, goal.saved);
    }
  }

  goals = goals.filter(function(g) { return g.id !== goalId; });
  saveGoals(user.email, goals);

  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
  if (typeof window.loadHomeUserData === 'function') window.loadHomeUserData();
  if (typeof window.loadWalletBalance === 'function') window.loadWalletBalance();
}

// ── Persist an updated user object to both kwanda_current_user and kwanda_users ──
function updateUserRecord(user) {
  localStorage.setItem('kwanda_current_user', JSON.stringify(user));

  var all = JSON.parse(localStorage.getItem('kwanda_users') || '[]');
  var idx = all.findIndex(function(u) { return u.email === user.email; });
  if (idx !== -1) {
    all[idx] = user;
    localStorage.setItem('kwanda_users', JSON.stringify(all));
  }
}

// ── Prompt-based flow: create a new goal ──
function promptCreateGoal() {
  var name = prompt('Goal name (e.g. "New Phone", "Rent"):');
  if (!name) return;

  var targetInput = prompt('Target amount for "' + name + '" (R):');
  if (!targetInput) return;

  createGoal(name, targetInput);
}

// ── Prompt-based flow: fund a specific goal from the Hello Wallet ──
function promptFundGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var remaining = goal.target - goal.saved;
  var input = prompt(
    'Transfer to "' + goal.name + '"' +
    '\nHello Wallet balance: ' + window.formatRand(user.balance || 0) +
    '\nStill needed: R ' + window.formatAmt(remaining) +
    '\nEnter amount to transfer:'
  );
  if (!input) return;

  fundGoal(goalId, input);
}

// ── Render the Personal Goals Wallet summary card + goal list ──
function renderPersonalGoals() {
  var user = getGoalsUser();

  var totalEl = document.getElementById('goals-wallet-total');
  var listEl  = document.getElementById('personal-goals-list');

  if (!user) {
    if (totalEl) totalEl.textContent = window.formatRand(0);
    if (listEl)  listEl.innerHTML = '';
    return;
  }

  var goals = getGoals(user.email);
  var total = goals.reduce(function(sum, g) { return sum + g.saved; }, 0);
  if (totalEl) totalEl.textContent = window.formatRand(total);

  if (!listEl) return;

  if (goals.length === 0) {
    listEl.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-target-arrow" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No goals yet. Create one to start saving.</div>';
    return;
  }

  listEl.innerHTML = goals.map(function(g) {
    var pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
    return '<div class="tx-item" style="display:block;padding:14px 0;border-bottom:1px solid var(--border);">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      + '<h4 style="font-size:14px;font-weight:600;color:var(--text-primary);margin:0;">' + g.name + '</h4>'
      + '<span style="font-size:12px;font-weight:700;color:var(--text-muted);">' + pct + '%</span>'
      + '</div>'
      + '<div style="width:100%;height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:8px;">'
      + '<div style="width:' + pct + '%;height:100%;background:var(--accent-green);border-radius:4px;"></div>'
      + '</div>'
      + '<p style="font-size:12px;color:var(--text-muted);margin:0 0 10px;">R ' + window.formatAmt(g.saved) + ' saved of R ' + window.formatAmt(g.target) + '</p>'
      + '<div style="display:flex;gap:8px;">'
      + '<button onclick="promptFundGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--primary);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;">Fund</button>'
      + (g.saved > 0 ? '<button onclick="promptRedeemGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--accent-green);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;">Redeem</button>' : '')
      + '<button onclick="deleteGoal(\'' + g.id + '\')" style="padding:9px 14px;border-radius:20px;background:#fee2e2;color:#ef4444;font-size:12px;font-weight:600;border:none;cursor:pointer;"><i class="ti ti-trash"></i></button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ── Redeem some/all of a goal's saved balance for a unique code ──
function redeemGoal(goalId, amount) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) { alert('Goal not found.'); return; }

  if (goal.saved <= 0) { alert('No saved balance to redeem for this goal.'); return; }
  if (amount > goal.saved) { alert('Not enough saved. Available: R ' + window.formatAmt(goal.saved)); return; }

  goal.saved -= amount;
  saveGoals(user.email, goals);

  var code = generateGoalRedemptionCode();
  saveGoalRedemption(user.email, goalId, goal.name, amount, { method: 'code', code: code });

  if (typeof window.addTransaction === 'function') {
    window.addTransaction('redeemed', 'ti-target-arrow', 'Redeemed goal: ' + goal.name, amount);
  }

  renderPersonalGoals();
  renderGoalRedemptions();

  alert(
    '✅ Redeemed!\n\n' +
    'Goal: ' + goal.name + '\n' +
    'Amount: R ' + window.formatAmt(amount) + '\n\n' +
    'Your code:\n' + code + '\n\n' +
    'Use this code toward buying your goal.'
  );
}

// ── Redeem some/all of a goal's saved balance as a bank/e-wallet payout request ──
function redeemGoalBankPayout(goalId, amount, bankDetails) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) { alert('Goal not found.'); return; }

  if (goal.saved <= 0) { alert('No saved balance to redeem for this goal.'); return; }
  if (amount > goal.saved) { alert('Not enough saved. Available: R ' + window.formatAmt(goal.saved)); return; }

  if (!bankDetails.bankName || !bankDetails.accountHolder || !bankDetails.accountNumber) {
    alert('Please provide complete bank/e-wallet details.');
    return;
  }

  goal.saved -= amount;
  saveGoals(user.email, goals);

  var reference = generateGoalPayoutReference();
  saveGoalRedemption(user.email, goalId, goal.name, amount, {
    method     : 'bank_payout',
    reference  : reference,
    bankDetails: bankDetails,
  });

  if (typeof window.addTransaction === 'function') {
    window.addTransaction('redeemed', 'ti-target-arrow', 'Payout requested for goal: ' + goal.name, amount);
  }

  renderPersonalGoals();
  renderGoalRedemptions();

  alert(
    '✅ Payout requested!\n\n' +
    'Goal: ' + goal.name + '\n' +
    'Amount: R ' + window.formatAmt(amount) + '\n' +
    'To: ' + bankDetails.bankName + ' •••• ' + bankDetails.accountNumber.slice(-4) + '\n\n' +
    'Reference: ' + reference + '\n\n' +
    'Your payout is being processed.'
  );
}

// ── Prompt-based flow: redeem a specific goal's saved balance (choose code or bank payout) ──
function promptRedeemGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  if (goal.saved <= 0) { alert('No saved balance to redeem for this goal yet.'); return; }

  var choice = prompt(
    'Redeem "' + goal.name + '" — Saved balance: R ' + window.formatAmt(goal.saved) +
    '\n\nHow would you like to redeem it?' +
    '\nType "code" for a redemption code, or "bank" to pay out to your bank/e-wallet:'
  );
  if (!choice) return;
  choice = choice.trim().toLowerCase();

  if (choice === 'code') {
    var input = prompt('Enter amount to redeem for a code (Available: R ' + window.formatAmt(goal.saved) + '):');
    if (!input) return;
    redeemGoal(goalId, input);
  } else if (choice === 'bank') {
    promptRedeemGoalBank(goalId);
  } else {
    alert('Please type "code" or "bank".');
  }
}

// ── Prompt-based flow: collect bank/e-wallet details for a payout ──
function promptRedeemGoalBank(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var input = prompt('Enter amount to pay out (Available: R ' + window.formatAmt(goal.saved) + '):');
  if (!input) return;

  var bankName = prompt('Bank / e-wallet provider name:');
  if (!bankName) return;

  var accountHolder = prompt('Account holder name:');
  if (!accountHolder) return;

  var accountNumber = prompt('Account number:');
  if (!accountNumber) return;

  redeemGoalBankPayout(goalId, input, {
    bankName      : bankName.trim(),
    accountHolder : accountHolder.trim(),
    accountNumber : accountNumber.trim(),
  });
}

// ── Generate a unique-looking redemption code (same format as Campaign Wallet codes) ──
function generateGoalRedemptionCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
  var code  = 'KW-';
  for (var i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ── Generate a payout reference number for bank/e-wallet requests ──
function generateGoalPayoutReference() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var ref   = 'KW-PAY-';
  for (var i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// ── Save a goal redemption to localStorage history (code or bank payout) ──
function saveGoalRedemption(email, goalId, goalName, amount, details) {
  var key     = 'kwanda_goals_redemptions_' + email;
  var history = JSON.parse(localStorage.getItem(key) || '[]');
  var now     = new Date();
  var date    = now.toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' });
  var time    = now.toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' });

  var record = {
    goalId  : goalId,
    goalName: goalName,
    amount  : amount,
    method  : details.method,
    status  : details.method === 'bank_payout' ? 'processing' : 'pending',
    date    : date + ' • ' + time,
  };

  if (details.method === 'code') {
    record.code = details.code;
  } else {
    record.reference   = details.reference;
    record.bankDetails = details.bankDetails; // demo-only, no real payment rail behind this yet
  }

  history.unshift(record);
  localStorage.setItem(key, JSON.stringify(history));
}

// ── Render the user's list of goal redemptions (codes + bank payout requests) ──
function renderGoalRedemptions() {
  var container = document.getElementById('goal-redemptions-list');
  if (!container) return;

  var user = getGoalsUser();
  if (!user) { container.innerHTML = ''; return; }

  var key     = 'kwanda_goals_redemptions_' + user.email;
  var history = JSON.parse(localStorage.getItem(key) || '[]');

  if (history.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-ticket" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemptions yet.</div>';
    return;
  }

  container.innerHTML = history.map(function(r) {
    var statusColor = r.status === 'redeemed' ? '#166534' : (r.status === 'processing' ? '#1d4ed8' : '#92400e');
    var statusBg    = r.status === 'redeemed' ? '#dcfce7' : (r.status === 'processing' ? '#dbeafe' : '#fef3c7');
    var subLine     = r.method === 'bank_payout'
      ? (r.bankDetails.bankName + ' •••• ' + r.bankDetails.accountNumber.slice(-4) + ' — Ref: ' + r.reference)
      : r.code;

    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + r.goalName + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">' + r.date + '</p>'
      + '<p style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:var(--text-primary);margin:0;">' + subLine + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 4px;">R ' + window.formatAmt(r.amount) + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:' + statusColor + ';background:' + statusBg + ';padding:2px 8px;border-radius:10px;">' + (r.status.charAt(0).toUpperCase() + r.status.slice(1)) + '</span>'
      + '</div></div>';
  }).join('');
}

// ── Init the dedicated Personal Goals Wallet page ──
function initPersonalGoals() {
  renderPersonalGoals();
  renderGoalRedemptions();
}

export { createGoal, fundGoal, deleteGoal, getGoals, promptCreateGoal, promptFundGoal, renderPersonalGoals, redeemGoal, redeemGoalBankPayout, promptRedeemGoal, renderGoalRedemptions, initPersonalGoals };
window.createGoal            = createGoal;
window.fundGoal              = fundGoal;
window.deleteGoal            = deleteGoal;
window.getGoals              = getGoals;
window.promptCreateGoal      = promptCreateGoal;
window.promptFundGoal        = promptFundGoal;
window.renderPersonalGoals   = renderPersonalGoals;
window.redeemGoal            = redeemGoal;
window.redeemGoalBankPayout  = redeemGoalBankPayout;
window.promptRedeemGoal      = promptRedeemGoal;
window.promptRedeemGoalBank  = promptRedeemGoalBank;
window.renderGoalRedemptions = renderGoalRedemptions;
window.initPersonalGoals     = initPersonalGoals;