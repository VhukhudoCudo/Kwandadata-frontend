/* ══════════════════════════════════════
   KwandaData — Wallet JS
══════════════════════════════════════ */

function initWallet() {
  loadWalletBalance();
  renderTransactions('all');
  if (typeof window.renderCampaignWallets === 'function') window.renderCampaignWallets();
}

function loadWalletBalance() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) return;

  const balanceEl = document.querySelector('.wallet-amount');
  if (balanceEl) balanceEl.textContent = window.formatRand((user.balance || 0));

  const bonusEl = document.querySelector('.bonus-amount');
  if (bonusEl) bonusEl.textContent = window.formatRand((user.bonus || 0));

  const dataEl = document.querySelector('.data-balance');
  if (dataEl) dataEl.textContent = (user.dataBalance || 0).toFixed(0) + ' MB';
}

function getUserTransactions() {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) return [];
  var key = 'kwanda_transactions_' + user.email;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function filterTransactions(value) {
  renderTransactions(value);
}

function renderTransactions(filter) {
  const container = document.getElementById('tx-list');
  if (!container) return;

  const all      = getUserTransactions();
  const filtered = filter === 'all' ? all : all.filter(function(tx) { return tx.type === filter; });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tx-empty" style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;"><i class="ti ti-inbox" style="font-size:28px;display:block;margin-bottom:8px;opacity:0.4;"></i>No transactions yet.</div>';
    return;
  }

  container.innerHTML = filtered.map(function(tx) {
    var positive = tx.amount > 0;
    return '<div class="tx-item" data-type="' + tx.type + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">'
      + '<div class="tx-icon" style="width:38px;height:38px;border-radius:10px;background:' + (positive ? '#dcfce7' : '#fee2e2') + ';display:flex;align-items:center;justify-content:center;font-size:18px;color:' + (positive ? 'var(--accent-green)' : '#ef4444') + ';flex-shrink:0;"><i class="ti ' + tx.icon + '"></i></div>'
      + '<div class="tx-info" style="flex:1;"><h4 style="font-size:13px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">' + tx.title + '</h4>'
      + '<p style="font-size:11px;color:var(--text-muted);margin:0;">' + tx.time + '</p></div>'
      + '<span class="tx-amount" style="font-size:14px;font-weight:700;color:' + (positive ? 'var(--accent-green)' : '#ef4444') + ';">'
      + (positive ? '+R ' : '-R ') + window.formatAmt(Math.abs(tx.amount))
      + '</span></div>';
  }).join('');
}

function addTransaction(type, icon, title, amount) {
  const stored = localStorage.getItem('kwanda_current_user');
  const user   = stored ? JSON.parse(stored) : null;
  if (!user) return;

  var key          = 'kwanda_transactions_' + user.email;
  var transactions = JSON.parse(localStorage.getItem(key) || '[]');

  var now  = new Date();
  var time = now.toLocaleTimeString('en-ZA', { hour:'2-digit', minute:'2-digit' });

  transactions.unshift({
    id     : Date.now(),
    type   : type,
    icon   : icon,
    title  : title,
    time   : 'Today, ' + time,
    amount : type === 'redeemed' ? -Math.abs(amount) : Math.abs(amount),
  });

  localStorage.setItem(key, JSON.stringify(transactions));

  if (document.getElementById('tx-list')) renderTransactions('all');
}

export { initWallet, filterTransactions, addTransaction };
window.initWallet         = initWallet;
window.filterTransactions = filterTransactions;
window.addTransaction     = addTransaction;