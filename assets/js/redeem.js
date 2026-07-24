/* ══════════════════════════════════════
   KwandaData — Redeem JS
══════════════════════════════════════ */

import { apiFetch } from './api.js';

const REDEEM_OPTIONS = {
  'airtime'      : { title:'Airtime',      minAmt: 2,  backendType: 'airtime' },
  'data-bundle'  : { title:'Data Bundle',  minAmt: 5,  backendType: 'data'    },
  'partner-apps' : { title:'Partner Apps', minAmt: 2,  backendType: null      }, // no backend support yet
  'cash-out'     : { title:'Cash Out',     minAmt: 20, backendType: 'cash'    },
};

async function initRedeem() {
  await loadRedeemBalance();
  await renderRedemptions();
  await renderCampaignWallets();
  await renderCampaignCodes();
}

async function loadRedeemBalance() {
  try {
    const wallet = await apiFetch('/wallet/balance');
    const balanceEl = document.querySelector('.wallet-amount');
    if (balanceEl) balanceEl.textContent = window.formatRand(wallet.balance || 0);
    const dataEl = document.querySelector('.data-balance-redeem');
    if (dataEl) dataEl.textContent = Number(wallet.dataBalance || 0).toFixed(0) + ' MB';
  } catch (err) {
    console.error('Failed to load balance:', err.message);
  }
}

async function redeemDataBundle() {
  let wallet;
  try {
    wallet = await apiFetch('/wallet/balance');
  } catch (err) {
    alert(err.message);
    return;
  }

  const dataMB = Number(wallet.dataBalance) || 0;
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

  try {
    await apiFetch('/redeem', {
      method: 'POST',
      body: JSON.stringify({ type: 'data', amount, details: { phone } }),
    });

    await loadRedeemBalance();
    await renderRedemptions();
    if (typeof window.addTransaction === 'function') window.addTransaction();

    showToast('Data bundle redemption submitted — pending approval.', 'success');
  } catch (err) {
    alert(err.message || 'Could not submit this redemption. Please try again.');
  }
}

async function handleRedeem(type) {
  const option = REDEEM_OPTIONS[type];
  if (!option) return;

  if (!option.backendType) {
    alert(option.title + ' is coming soon!');
    return;
  }

  let wallet;
  try {
    wallet = await apiFetch('/wallet/balance');
  } catch (err) {
    alert(err.message);
    return;
  }

  const balance = option.backendType === 'data' ? Number(wallet.dataBalance) : Number(wallet.balance);

  if (balance < option.minAmt) {
    alert('Not enough balance.\n' + option.title + ' requires at least ' + (option.backendType === 'data' ? option.minAmt + 'MB' : 'R ' + window.formatAmt(option.minAmt)) + '.\nYour balance: ' + (option.backendType === 'data' ? balance.toFixed(0) + 'MB' : 'R ' + window.formatAmt(balance)));
    return;
  }

  const input = prompt('Redeem: ' + option.title + ' | Balance: ' + (option.backendType === 'data' ? balance.toFixed(0) + 'MB' : 'R ' + window.formatAmt(balance)) + ' | Enter amount:');
  if (input === null) return;

  const amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount < option.minAmt) { alert('Minimum for ' + option.title + ' is ' + option.minAmt + '.'); return; }
  if (amount > balance) { alert('Not enough balance.'); return; }

  try {
    await apiFetch('/redeem', {
      method: 'POST',
      body: JSON.stringify({ type: option.backendType, amount }),
    });

    await loadRedeemBalance();
    await renderRedemptions();
    if (typeof window.addTransaction === 'function') window.addTransaction();

    showToast(option.title + ' redemption submitted — pending approval.', 'success');
  } catch (err) {
    alert(err.message || 'Could not submit this redemption. Please try again.');
  }
}

// ── Render the user's own redemption history from the backend ──
async function renderRedemptions() {
  const container = document.getElementById('redemption-list');
  if (!container) return;

  let redemptions = [];
  try {
    const data = await apiFetch('/redeem');
    redemptions = data.redemptions || [];
  } catch (err) {
    console.error('Failed to load redemptions:', err.message);
  }

  if (redemptions.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemptions yet.</div>';
    return;
  }

  const STATUS_STYLE = {
    pending: { color: '#92400e', bg: '#fef3c7' },
    fulfilled: { color: '#166534', bg: '#dcfce7' },
    rejected: { color: '#991b1b', bg: '#fee2e2' },
  };

  container.innerHTML = redemptions.map(function(r) {
    var style = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
    var date = new Date(r.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    var title = r.type.charAt(0).toUpperCase() + r.type.slice(1);
    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + title + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0;">' + date + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 2px;">' + (r.type === 'data' ? Number(r.amount).toFixed(0) + 'MB' : window.formatRand(r.amount)) + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:' + style.color + ';background:' + style.bg + ';padding:2px 8px;border-radius:10px;">' + (r.status.charAt(0).toUpperCase() + r.status.slice(1)) + '</span>'
      + '</div></div>';
  }).join('');
}

/* ══════════════════════════════════════
   Campaign Objective Wallet
   - Summary card, always visible
   - Per-company breakdown listed below it
   - Redeemed for a unique code, confirmed in-store by the advertiser
══════════════════════════════════════ */

async function renderCampaignWallets() {
  const totalEl = document.getElementById('campaign-wallet-total');
  const listEl  = document.getElementById('campaign-wallet-list');

  let wallets = [];
  try {
    const data = await apiFetch('/campaign-wallet');
    wallets = data.wallets || [];
  } catch (err) {
    console.error('Failed to load campaign wallets:', err.message);
  }

  var total = wallets.reduce(function(sum, w) { return sum + Number(w.balance); }, 0);
  if (totalEl) totalEl.textContent = window.formatRand(total);

  if (!listEl) return;

  if (wallets.length === 0) {
    listEl.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-building-store" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No campaign rewards yet. Complete sponsored tasks to earn company-specific rewards.</div>';
    return;
  }

  listEl.innerHTML = wallets.map(function(w) {
    var companyName = w.advertiser.firstName + ' ' + w.advertiser.lastName;
    return '<div class="redeem-option" onclick="redeemCampaignBalance(\'' + w.advertiserId + '\')">'
      + '<div class="redeem-icon orange"><i class="ti ti-building-store"></i></div>'
      + '<div class="redeem-info"><h4>' + companyName + '</h4><p>Available: R ' + window.formatAmt(w.balance) + '</p></div>'
      + '<i class="ti ti-chevron-right redeem-arrow"></i>'
      + '</div>';
  }).join('');
}

async function redeemCampaignBalance(advertiserId) {
  let wallets = [];
  try {
    const data = await apiFetch('/campaign-wallet');
    wallets = data.wallets || [];
  } catch (err) {
    alert(err.message);
    return;
  }

  const entry = wallets.find(function(w) { return w.advertiserId === advertiserId; });
  if (!entry || Number(entry.balance) <= 0) {
    alert('No balance available to redeem for this company.');
    return;
  }

  const companyName = entry.advertiser.firstName + ' ' + entry.advertiser.lastName;
  const balance = Number(entry.balance);

  if (balance < 20) {
    alert('Minimum redemption is R20. Available: R ' + window.formatAmt(balance) + '. Keep earning to reach the minimum.');
    return;
  }

  var input = prompt(
    'Redeem Campaign Reward — ' + companyName +
    '\nAvailable: R ' + window.formatAmt(balance) +
    '\nMinimum redemption: R20' +
    '\nEnter amount to redeem:'
  );
  if (!input) return;

  var amount = parseFloat(input);
  if (isNaN(amount) || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (amount < 20) { alert('Minimum redemption is R20.'); return; }
  if (amount > balance) { alert('Not enough balance. Available: R ' + window.formatAmt(balance)); return; }

  try {
    const result = await apiFetch('/campaign-wallet/redeem', {
      method: 'POST',
      body: JSON.stringify({ advertiserId, amount }),
    });

    await renderCampaignWallets();
    await renderCampaignCodes();

    alert(
      '✅ Redeemed!\n\n' +
      'Company: ' + companyName + '\n' +
      'Amount: R ' + window.formatAmt(amount) + '\n\n' +
      'Your code:\n' + result.code.code + '\n\n' +
      'Show this code at ' + companyName + ' to complete your purchase.'
    );
  } catch (err) {
    alert(err.message || 'Could not redeem this balance. Please try again.');
  }
}

async function renderCampaignCodes() {
  const container = document.getElementById('campaign-codes-list');
  if (!container) return;

  let codes = [];
  try {
    const data = await apiFetch('/campaign-wallet/codes');
    codes = data.codes || [];
  } catch (err) {
    console.error('Failed to load campaign codes:', err.message);
  }

  if (codes.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-ticket" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No redemption codes yet.</div>';
    return;
  }

  container.innerHTML = codes.map(function(c) {
    var statusColor = c.status === 'redeemed' ? '#166534' : '#92400e';
    var statusBg    = c.status === 'redeemed' ? '#dcfce7' : '#fef3c7';
    var date = new Date(c.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return '<div class="redemption-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="redemption-info"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + date + '</h4>'
      + '<p style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:var(--text-primary);margin:0;">' + c.code + '</p></div>'
      + '<div class="redemption-right" style="text-align:right;">'
      + '<p class="amount" style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 4px;">R ' + window.formatAmt(c.amount) + '</p>'
      + '<span style="font-size:11px;font-weight:600;color:' + statusColor + ';background:' + statusBg + ';padding:2px 8px;border-radius:10px;">' + (c.status.charAt(0).toUpperCase() + c.status.slice(1)) + '</span>'
      + '</div></div>';
  }).join('');
}

async function initCampaignWallet() {
  await renderCampaignWallets();
  await renderCampaignCodes();
}

export { initRedeem, handleRedeem };
window.initRedeem              = initRedeem;
window.redeemDataBundle        = redeemDataBundle;
window.handleRedeem            = handleRedeem;
window.renderRedemptions       = renderRedemptions;
window.renderCampaignWallets   = renderCampaignWallets;
window.redeemCampaignBalance   = redeemCampaignBalance;
window.renderCampaignCodes     = renderCampaignCodes;
window.initCampaignWallet      = initCampaignWallet;