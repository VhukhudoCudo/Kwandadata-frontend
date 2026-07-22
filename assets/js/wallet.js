/* ══════════════════════════════════════
   KwandaData — Wallet JS
══════════════════════════════════════ */

import { apiFetch } from './api.js';

const TYPE_ICONS = {
  earned: 'ti-arrow-down-circle',
  redeemed: 'ti-arrow-up-circle',
  refund: 'ti-rotate',
  transferred: 'ti-transfer',
};

async function initWallet() {
  await loadWalletBalance();
  await renderTransactions('all');
  if (typeof window.renderCampaignWallets === 'function') window.renderCampaignWallets();
  if (typeof window.renderPersonalGoals === 'function') window.renderPersonalGoals();
}

async function loadWalletBalance() {
  try {
    const wallet = await apiFetch('/wallet/balance');

    const balanceEl = document.querySelector('.wallet-amount');
    if (balanceEl) balanceEl.textContent = window.formatRand(wallet.balance || 0);

    const bonusEl = document.querySelector('.bonus-amount');
    if (bonusEl) bonusEl.textContent = window.formatRand(wallet.bonusBalance || 0);

    const dataEl = document.querySelector('.data-balance');
    if (dataEl) dataEl.textContent = (wallet.dataBalance || 0).toFixed(0) + ' MB';
  } catch (err) {
    console.error('Failed to load wallet balance:', err.message);
  }
}

function filterTransactions(value) {
  renderTransactions(value);
}

async function renderTransactions(filter) {
  const container = document.getElementById('tx-list');
  if (!container) return;

  let transactions = [];
  try {
    const query = filter && filter !== 'all' ? `?type=${encodeURIComponent(filter)}` : '';
    const data = await apiFetch(`/wallet/transactions${query}`);
    transactions = data.transactions || [];
  } catch (err) {
    console.error('Failed to load transactions:', err.message);
  }

  if (transactions.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No transactions yet.</div>';
    return;
  }

  container.innerHTML = transactions.map(function(tx) {
    var amount = Number(tx.amount);
    var positive = amount > 0;
    var icon = TYPE_ICONS[tx.type] || 'ti-file-text';
    var time = new Date(tx.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    return '<div class="tx-item" data-type="' + tx.type + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="tx-icon" style="width:38px;height:38px;border-radius:10px;background:' + (positive ? '#dcfce7' : '#fee2e2') + ';display:flex;align-items:center;justify-content:center;font-size:18px;color:' + (positive ? 'var(--accent-green)' : '#ef4444') + ';flex-shrink:0;"><i class="ti ' + icon + '"></i></div>'
      + '<div class="tx-info" style="flex:1;"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + tx.title + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0;">' + time + '</p></div>'
      + '<span class="tx-amount" style="font-size:14px;font-weight:700;color:' + (positive ? 'var(--accent-green)' : '#ef4444') + ';">'
      + (positive ? '+R ' : '-R ') + window.formatAmt(Math.abs(amount))
      + '</span></div>';
  }).join('');
}

// Kept for backward compatibility with other files that call this after an
// action — the backend already recorded the real transaction, so this just
// refreshes the visible list from the backend rather than faking a new row.
function addTransaction() {
  if (document.getElementById('tx-list')) renderTransactions('all');
}

export { initWallet, filterTransactions, addTransaction };
window.initWallet         = initWallet;
window.filterTransactions = filterTransactions;
window.addTransaction     = addTransaction;