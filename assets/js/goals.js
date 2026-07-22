/* ══════════════════════════════════════
   KwandaData — Personal Goals Wallet
   - User creates named goals with a fixed target amount
   - User manually transfers money from the Hello Wallet into a goal
   - Deleting a goal refunds its saved balance to the Hello Wallet
   - All interactions use an in-page modal (NOT prompt()/confirm()/alert()),
     since native browser dialogs are unreliable or blocked entirely on
     mobile browsers, in-app browsers (WhatsApp/Instagram/etc.), and
     home-screen/standalone web apps.
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

/* ══════════════════════════════════════
   In-page modal (replaces prompt/confirm/alert)
══════════════════════════════════════ */

function ensureGoalModalStyles() {
  if (document.getElementById('kw-modal-styles')) return;
  var style = document.createElement('style');
  style.id = 'kw-modal-styles';
  style.textContent =
    '#kw-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;}' +
    '.kw-modal{background:#fff;border-radius:18px;padding:20px;width:100%;max-width:360px;max-height:85vh;overflow-y:auto;-webkit-overflow-scrolling:touch;}' +
    '.kw-modal h3{font-size:16px;font-weight:700;color:var(--text-primary);margin:0 0 6px;}' +
    '.kw-modal label{display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin:12px 0 4px;}' +
    '.kw-modal label:first-of-type{margin-top:0;}' +
    '.kw-modal input[type="text"],.kw-modal input[type="number"]{width:100%;padding:11px 12px;border-radius:10px;border:1px solid var(--border);font-size:16px;box-sizing:border-box;}' +
    '.kw-modal-error{color:#ef4444;font-size:12px;margin-top:10px;min-height:14px;}' +
    '.kw-modal-actions{display:flex;gap:10px;margin-top:18px;}' +
    '.kw-modal-actions button{flex:1;padding:12px;border-radius:20px;border:none;font-size:14px;font-weight:700;cursor:pointer;touch-action:manipulation;}' +
    '.kw-modal-cancel{background:#f3f4f6;color:var(--text-primary);}' +
    '.kw-modal-confirm{background:var(--primary);color:#fff;}' +
    '.kw-modal-method{display:flex;gap:10px;margin-top:14px;}' +
    '.kw-modal-method label{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:10px;border:1.5px solid var(--border);font-size:13px;font-weight:600;color:var(--text-primary);margin:0;cursor:pointer;touch-action:manipulation;}' +
    '.kw-modal-method input{margin:0;}';
  document.head.appendChild(style);
}

function closeGoalModal() {
  var el = document.getElementById('kw-modal-overlay');
  if (el) el.remove();
}

// ── Open a modal. bodyHTML is the form content; onConfirm(overlayEl, showError) runs
//    when Confirm is tapped — call showError(msg) to show a validation message and
//    keep the modal open, or closeGoalModal() + do the real work to finish. ──
function openGoalModal(titleText, bodyHTML, onConfirm, confirmLabel) {
  ensureGoalModalStyles();
  closeGoalModal();

  var overlay = document.createElement('div');
  overlay.id = 'kw-modal-overlay';
  overlay.innerHTML =
    '<div class="kw-modal">' +
      '<h3>' + titleText + '</h3>' +
      bodyHTML +
      '<p class="kw-modal-error" id="kw-modal-error"></p>' +
      '<div class="kw-modal-actions">' +
        '<button type="button" class="kw-modal-cancel" id="kw-modal-cancel">Cancel</button>' +
        '<button type="button" class="kw-modal-confirm" id="kw-modal-confirm">' + (confirmLabel || 'Confirm') + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeGoalModal(); });
  document.getElementById('kw-modal-cancel').addEventListener('click', closeGoalModal);
  document.getElementById('kw-modal-confirm').addEventListener('click', function() {
    onConfirm(overlay, function(msg) {
      var errEl = document.getElementById('kw-modal-error');
      if (errEl) errEl.textContent = msg;
    });
  });

  return overlay;
}

// ── A simple "OK only" info modal, used for success messages and dead-end notices ──
function showGoalInfoModal(titleText, bodyHTML) {
  openGoalModal(titleText, bodyHTML, function() { closeGoalModal(); }, 'OK');
}

/* ══════════════════════════════════════
   Core actions (validated + called after modal confirmation)
══════════════════════════════════════ */

// ── Create a new goal with a fixed target amount ──
function createGoal(name, target) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  name   = (name || '').trim();
  target = parseFloat(target);
  if (!name || isNaN(target) || target <= 0) return;

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
  if (isNaN(amount) || amount <= 0) return;
  if (amount > (user.balance || 0)) return;

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var remaining = goal.target - goal.saved;
  if (amount > remaining) return;

  user.balance = (user.balance || 0) - amount;
  updateUserRecord(user);

  goal.saved += amount;
  saveGoals(user.email, goals);

  if (typeof window.addTransaction === 'function') {
    window.addTransaction('transferred', 'ti-target-arrow', 'Transferred to goal: ' + goal.name, -amount);
  }

  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
  if (typeof window.loadHomeUserData === 'function') window.loadHomeUserData();
  if (typeof window.loadWalletBalance === 'function') window.loadWalletBalance();
}

// ── Delete a goal, refunding its saved balance back to the Hello Wallet (after confirm) ──
function performGoalDelete(goalId) {
  var user = getGoalsUser();
  if (!user) return;

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

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

// ── Redeem some/all of a goal's saved balance for a unique code ──
function redeemGoal(goalId, amount) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return;

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal || goal.saved <= 0 || amount > goal.saved) return;

  goal.saved -= amount;
  saveGoals(user.email, goals);

  var code = generateGoalRedemptionCode();
  saveGoalRedemption(user.email, goalId, goal.name, amount, { method: 'code', code: code });

  if (typeof window.addTransaction === 'function') {
    window.addTransaction('redeemed', 'ti-target-arrow', 'Redeemed goal: ' + goal.name, amount);
  }

  renderPersonalGoals();
  renderGoalRedemptions();

  showGoalInfoModal(
    '✅ Redeemed!',
    '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Goal: ' + goal.name + '</p>' +
    '<p style="font-size:13px;color:var(--text-muted);margin:0 0 10px;">Amount: R ' + window.formatAmt(amount) + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0 0 4px;">Your code:</p>' +
    '<p style="font-size:18px;font-weight:700;letter-spacing:1px;color:var(--text-primary);margin:0 0 10px;">' + code + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Use this code toward buying your goal.</p>'
  );
}

// ── Redeem some/all of a goal's saved balance as a bank/e-wallet payout request ──
function redeemGoalBankPayout(goalId, amount, bankDetails) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return;

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal || goal.saved <= 0 || amount > goal.saved) return;
  if (!bankDetails.bankName || !bankDetails.accountHolder || !bankDetails.accountNumber) return;

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

  showGoalInfoModal(
    '✅ Payout requested!',
    '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Goal: ' + goal.name + '</p>' +
    '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Amount: R ' + window.formatAmt(amount) + '</p>' +
    '<p style="font-size:13px;color:var(--text-muted);margin:0 0 10px;">To: ' + bankDetails.bankName + ' •••• ' + bankDetails.accountNumber.slice(-4) + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0 0 4px;">Reference:</p>' +
    '<p style="font-size:16px;font-weight:700;letter-spacing:0.5px;color:var(--text-primary);margin:0 0 10px;">' + reference + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Your payout is being processed.</p>'
  );
}

/* ══════════════════════════════════════
   Modal-driven flows (replace the old prompt()-based versions)
══════════════════════════════════════ */

// ── Create a new goal ──
function promptCreateGoal() {
  openGoalModal(
    'Create New Goal',
    '<label for="kw-goal-name">Goal name</label>' +
    '<input type="text" id="kw-goal-name" placeholder="e.g. New Phone, Rent" />' +
    '<label for="kw-goal-target">Target amount (R)</label>' +
    '<input type="number" id="kw-goal-target" placeholder="0.00" min="1" step="0.01" inputmode="decimal" />',
    function(modal, showError) {
      var name   = document.getElementById('kw-goal-name').value;
      var target = document.getElementById('kw-goal-target').value;
      if (!name || !name.trim()) { showError('Please enter a goal name.'); return; }
      if (!target || parseFloat(target) <= 0) { showError('Please enter a valid target amount.'); return; }
      closeGoalModal();
      createGoal(name, target);
    },
    'Create Goal'
  );
}

// ── Fund a specific goal from the Hello Wallet ──
function promptFundGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var remaining = goal.target - goal.saved;

  openGoalModal(
    'Fund "' + goal.name + '"',
    '<p style="font-size:12px;color:var(--text-muted);margin:0 0 2px;">Hello Wallet balance: R ' + window.formatAmt(user.balance || 0) + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Still needed: R ' + window.formatAmt(remaining) + '</p>' +
    '<label for="kw-fund-amount">Amount to transfer (R)</label>' +
    '<input type="number" id="kw-fund-amount" placeholder="0.00" min="1" step="0.01" inputmode="decimal" />',
    function(modal, showError) {
      var amount = parseFloat(document.getElementById('kw-fund-amount').value);
      if (!amount || amount <= 0) { showError('Please enter a valid amount.'); return; }
      if (amount > (user.balance || 0)) { showError('Not enough balance in your Hello Wallet.'); return; }
      if (amount > remaining) { showError('That would go over the goal target. You only need R ' + window.formatAmt(remaining) + ' more.'); return; }
      closeGoalModal();
      fundGoal(goalId, amount);
    },
    'Transfer'
  );
}

// ── Redeem a specific goal's saved balance — choose code or bank/e-wallet payout ──
function promptRedeemGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  if (goal.saved <= 0) {
    showGoalInfoModal('Redeem Goal', '<p style="font-size:13px;color:var(--text-muted);margin:0;">No saved balance to redeem for this goal yet.</p>');
    return;
  }

  var body =
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Saved balance: R ' + window.formatAmt(goal.saved) + '</p>' +
    '<label for="kw-redeem-amount">Amount to redeem (R)</label>' +
    '<input type="number" id="kw-redeem-amount" placeholder="0.00" min="1" step="0.01" inputmode="decimal" />' +
    '<div class="kw-modal-method">' +
      '<label><input type="radio" name="kw-redeem-method" value="code" checked/> Get a code</label>' +
      '<label><input type="radio" name="kw-redeem-method" value="bank"/> Bank / e-wallet</label>' +
    '</div>' +
    '<div id="kw-bank-fields" style="display:none;">' +
      '<label for="kw-bank-name">Bank / e-wallet name</label>' +
      '<input type="text" id="kw-bank-name" placeholder="e.g. Capitec, TymeBank" />' +
      '<label for="kw-bank-holder">Account holder name</label>' +
      '<input type="text" id="kw-bank-holder" placeholder="Full name" />' +
      '<label for="kw-bank-number">Account number</label>' +
      '<input type="text" id="kw-bank-number" placeholder="Account number" inputmode="numeric" />' +
    '</div>';

  var overlay = openGoalModal(
    'Redeem "' + goal.name + '"',
    body,
    function(modal, showError) {
      var amount = parseFloat(document.getElementById('kw-redeem-amount').value);
      var method = modal.querySelector('input[name="kw-redeem-method"]:checked').value;

      if (!amount || amount <= 0) { showError('Please enter a valid amount.'); return; }
      if (amount > goal.saved) { showError('Not enough saved. Available: R ' + window.formatAmt(goal.saved)); return; }

      if (method === 'code') {
        closeGoalModal();
        redeemGoal(goalId, amount);
      } else {
        var bankName = document.getElementById('kw-bank-name').value.trim();
        var holder   = document.getElementById('kw-bank-holder').value.trim();
        var number   = document.getElementById('kw-bank-number').value.trim();
        if (!bankName || !holder || !number) { showError('Please fill in all bank/e-wallet details.'); return; }
        closeGoalModal();
        redeemGoalBankPayout(goalId, amount, { bankName: bankName, accountHolder: holder, accountNumber: number });
      }
    },
    'Redeem'
  );

  overlay.addEventListener('change', function(e) {
    if (e.target.name === 'kw-redeem-method') {
      document.getElementById('kw-bank-fields').style.display = e.target.value === 'bank' ? 'block' : 'none';
    }
  });
}

// ── Delete a goal, refunding its saved balance back to the Hello Wallet ──
function deleteGoal(goalId) {
  var user = getGoalsUser();
  if (!user) { navigateTo('sign-in'); return; }

  var goals = getGoals(user.email);
  var goal  = goals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  openGoalModal(
    'Delete "' + goal.name + '"?',
    '<p style="font-size:13px;color:var(--text-muted);margin:0;">Any saved balance (R ' + window.formatAmt(goal.saved) + ') will be returned to your Hello Wallet.</p>',
    function() {
      closeGoalModal();
      performGoalDelete(goalId);
    },
    'Delete'
  );
}

/* ══════════════════════════════════════
   Rendering
══════════════════════════════════════ */

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
      + '<button onclick="promptFundGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--primary);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;">Fund</button>'
      + (g.saved > 0 ? '<button onclick="promptRedeemGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--accent-green);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;">Redeem</button>' : '')
      + '<button onclick="deleteGoal(\'' + g.id + '\')" style="padding:9px 14px;border-radius:20px;background:#fee2e2;color:#ef4444;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;"><i class="ti ti-trash"></i></button>'
      + '</div>'
      + '</div>';
  }).join('');
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
window.renderGoalRedemptions = renderGoalRedemptions;
window.initPersonalGoals     = initPersonalGoals;