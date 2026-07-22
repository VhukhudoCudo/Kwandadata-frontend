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

import { apiFetch } from './api.js';

// Cache of the last-fetched goals list, so modal prompts can read a goal's
// current saved/target synchronously without an extra round trip.
let cachedGoals = [];

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

function showGoalInfoModal(titleText, bodyHTML) {
  openGoalModal(titleText, bodyHTML, function() { closeGoalModal(); }, 'OK');
}

/* ══════════════════════════════════════
   Core actions — all call the real backend
══════════════════════════════════════ */

async function createGoal(name, target) {
  name   = (name || '').trim();
  target = parseFloat(target);
  if (!name || isNaN(target) || target <= 0) return;

  try {
    await apiFetch('/goals', {
      method: 'POST',
      body: JSON.stringify({ name, target }),
    });
    await renderPersonalGoals();
  } catch (err) {
    alert(err.message || 'Could not create this goal. Please try again.');
  }
}

async function fundGoal(goalId, amount) {
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return;

  try {
    await apiFetch(`/goals/${goalId}/fund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });

    if (typeof window.addTransaction === 'function') window.addTransaction();

    await renderPersonalGoals();
    if (typeof window.loadHomeUserData === 'function') window.loadHomeUserData();
    if (typeof window.loadWalletBalance === 'function') window.loadWalletBalance();
  } catch (err) {
    alert(err.message || 'Could not transfer to this goal. Please try again.');
  }
}

async function performGoalDelete(goalId) {
  try {
    await apiFetch(`/goals/${goalId}`, { method: 'DELETE' });

    if (typeof window.addTransaction === 'function') window.addTransaction();

    await renderPersonalGoals();
    if (typeof window.loadHomeUserData === 'function') window.loadHomeUserData();
    if (typeof window.loadWalletBalance === 'function') window.loadWalletBalance();
  } catch (err) {
    alert(err.message || 'Could not delete this goal. Please try again.');
  }
}

async function redeemGoal(goalId, amount) {
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return;

  try {
    const result = await apiFetch(`/goals/${goalId}/redeem`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });

    const goal = cachedGoals.find(function(g) { return g.id === goalId; });
    const goalName = goal ? goal.name : 'your goal';

    await renderPersonalGoals();
    await renderGoalRedemptions();

    showGoalInfoModal(
      '✅ Redeemed!',
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Goal: ' + goalName + '</p>' +
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 10px;">Amount: R ' + window.formatAmt(amount) + '</p>' +
      '<p style="font-size:12px;color:var(--text-muted);margin:0 0 4px;">Your code:</p>' +
      '<p style="font-size:18px;font-weight:700;letter-spacing:1px;color:var(--text-primary);margin:0 0 10px;">' + result.code.code + '</p>' +
      '<p style="font-size:12px;color:var(--text-muted);margin:0;">Use this code toward buying your goal.</p>'
    );
  } catch (err) {
    alert(err.message || 'Could not redeem this goal. Please try again.');
  }
}

async function redeemGoalBankPayout(goalId, amount, bankDetails) {
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return;
  if (!bankDetails.bankName || !bankDetails.accountHolder || !bankDetails.accountNumber) return;

  try {
    await apiFetch(`/goals/${goalId}/redeem-bank`, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        bankName: bankDetails.bankName,
        accountHolder: bankDetails.accountHolder,
        accountNumber: bankDetails.accountNumber,
      }),
    });

    const goal = cachedGoals.find(function(g) { return g.id === goalId; });
    const goalName = goal ? goal.name : 'your goal';

    await renderPersonalGoals();
    await renderGoalRedemptions();

    showGoalInfoModal(
      '✅ Payout requested!',
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Goal: ' + goalName + '</p>' +
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 4px;">Amount: R ' + window.formatAmt(amount) + '</p>' +
      '<p style="font-size:13px;color:var(--text-muted);margin:0 0 10px;">To: ' + bankDetails.bankName + ' •••• ' + bankDetails.accountNumber.slice(-4) + '</p>' +
      '<p style="font-size:12px;color:var(--text-muted);margin:0;">Your payout is now pending admin approval.</p>'
    );
  } catch (err) {
    alert(err.message || 'Could not submit this payout request. Please try again.');
  }
}

/* ══════════════════════════════════════
   Modal-driven flows
══════════════════════════════════════ */

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

async function promptFundGoal(goalId) {
  var goal = cachedGoals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var wallet;
  try {
    wallet = await apiFetch('/wallet/balance');
  } catch (err) {
    alert(err.message);
    return;
  }

  var balance   = Number(wallet.balance) || 0;
  var remaining = Number(goal.target) - Number(goal.saved);

  openGoalModal(
    'Fund "' + goal.name + '"',
    '<p style="font-size:12px;color:var(--text-muted);margin:0 0 2px;">Hello Wallet balance: R ' + window.formatAmt(balance) + '</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Still needed: R ' + window.formatAmt(remaining) + '</p>' +
    '<label for="kw-fund-amount">Amount to transfer (R)</label>' +
    '<input type="number" id="kw-fund-amount" placeholder="0.00" min="1" step="0.01" inputmode="decimal" />',
    function(modal, showError) {
      var amount = parseFloat(document.getElementById('kw-fund-amount').value);
      if (!amount || amount <= 0) { showError('Please enter a valid amount.'); return; }
      if (amount > balance) { showError('Not enough balance in your Hello Wallet.'); return; }
      if (amount > remaining) { showError('That would go over the goal target. You only need R ' + window.formatAmt(remaining) + ' more.'); return; }
      closeGoalModal();
      fundGoal(goalId, amount);
    },
    'Transfer'
  );
}

function promptRedeemGoal(goalId) {
  var goal = cachedGoals.find(function(g) { return g.id === goalId; });
  if (!goal) return;

  var saved = Number(goal.saved);

  if (saved <= 0) {
    showGoalInfoModal('Redeem Goal', '<p style="font-size:13px;color:var(--text-muted);margin:0;">No saved balance to redeem for this goal yet.</p>');
    return;
  }

  var body =
    '<p style="font-size:12px;color:var(--text-muted);margin:0;">Saved balance: R ' + window.formatAmt(saved) + '</p>' +
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
      if (amount > saved) { showError('Not enough saved. Available: R ' + window.formatAmt(saved)); return; }

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

function deleteGoal(goalId) {
  var goal = cachedGoals.find(function(g) { return g.id === goalId; });
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

async function renderPersonalGoals() {
  var totalEl = document.getElementById('goals-wallet-total');
  var listEl  = document.getElementById('personal-goals-list');

  try {
    const data = await apiFetch('/goals');
    cachedGoals = data.goals || [];
  } catch (err) {
    console.error('Failed to load goals:', err.message);
    cachedGoals = [];
  }

  var total = cachedGoals.reduce(function(sum, g) { return sum + Number(g.saved); }, 0);
  if (totalEl) totalEl.textContent = window.formatRand(total);

  if (!listEl) return;

  if (cachedGoals.length === 0) {
    listEl.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-target-arrow" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No goals yet. Create one to start saving.</div>';
    return;
  }

  listEl.innerHTML = cachedGoals.map(function(g) {
    var saved  = Number(g.saved);
    var target = Number(g.target);
    var pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
    return '<div class="tx-item" style="display:block;padding:14px 0;border-bottom:1px solid var(--border);">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      + '<h4 style="font-size:14px;font-weight:600;color:var(--text-primary);margin:0;">' + g.name + '</h4>'
      + '<span style="font-size:12px;font-weight:700;color:var(--text-muted);">' + pct + '%</span>'
      + '</div>'
      + '<div style="width:100%;height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:8px;">'
      + '<div style="width:' + pct + '%;height:100%;background:var(--accent-green);border-radius:4px;"></div>'
      + '</div>'
      + '<p style="font-size:12px;color:var(--text-muted);margin:0 0 10px;">R ' + window.formatAmt(saved) + ' saved of R ' + window.formatAmt(target) + '</p>'
      + '<div style="display:flex;gap:8px;">'
      + '<button onclick="promptFundGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--primary);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;">Fund</button>'
      + (saved > 0 ? '<button onclick="promptRedeemGoal(\'' + g.id + '\')" style="flex:1;padding:9px;border-radius:20px;background:var(--accent-green);color:#fff;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;">Redeem</button>' : '')
      + '<button onclick="deleteGoal(\'' + g.id + '\')" style="padding:9px 14px;border-radius:20px;background:#fee2e2;color:#ef4444;font-size:12px;font-weight:600;border:none;cursor:pointer;touch-action:manipulation;"><i class="ti ti-trash"></i></button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ── Combine code redemptions and bank payout requests into one history list ──
async function renderGoalRedemptions() {
  var container = document.getElementById('goal-redemptions-list');
  if (!container) return;

  var codes = [];
  var payouts = [];

  try {
    const codesData = await apiFetch('/goals/redemptions/codes');
    codes = (codesData.codes || []).map(function(c) {
      return {
        goalName: c.goalName,
        amount: c.amount,
        createdAt: c.createdAt,
        kind: 'code',
        code: c.code,
      };
    });
  } catch (err) {
    console.error('Failed to load goal codes:', err.message);
  }

  try {
    const redemptionsData = await apiFetch('/redeem');
    payouts = (redemptionsData.redemptions || [])
      .filter(function(r) { return r.type === 'goal_payout'; })
      .map(function(r) {
        return {
          goalName: r.details && r.details.goalName,
          amount: r.amount,
          createdAt: r.createdAt,
          kind: 'bank',
          status: r.status,
          bankName: r.details && r.details.bankName,
          accountNumber: r.details && r.details.accountNumber,
        };
      });
  } catch (err) {
    console.error('Failed to load goal payouts:', err.message);
  }

  var history = codes.concat(payouts).sort(function(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (history.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-ticket" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemptions yet.</div>';
    return;
  }

  container.innerHTML = history.map(function(r) {
    var date = new Date(r.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    var statusColor, statusBg, statusLabel, subLine;
    if (r.kind === 'code') {
      statusColor = '#1d4ed8'; statusBg = '#dbeafe'; statusLabel = 'Code';
      subLine = r.code;
    } else {
      statusColor = r.status === 'fulfilled' ? '#166534' : (r.status === 'rejected' ? '#991b1b' : '#92400e');
      statusBg    = r.status === 'fulfilled' ? '#dcfce7' : (r.status === 'rejected' ? '#fee2e2' : '#fef3c7');
      statusLabel = r.status.charAt(0).toUpperCase() + r.status.slice(1);
      subLine = r.bankName + ' •••• ' + (r.accountNumber || '').slice(-4);
    }

    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + (r.goalName || 'Goal') + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">' + date + '</p>'
      + '<p style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:var(--text-primary);margin:0;">' + subLine + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 4px;">R ' + window.formatAmt(r.amount) + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:' + statusColor + ';background:' + statusBg + ';padding:2px 8px;border-radius:10px;">' + statusLabel + '</span>'
      + '</div></div>';
  }).join('');
}

// Kept for backward compatibility with app.js's import — returns the last-fetched
// goals list synchronously from cache rather than making a fresh network call.
function getGoals() {
  return cachedGoals;
}

async function initPersonalGoals() {
  await renderPersonalGoals();
  await renderGoalRedemptions();
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