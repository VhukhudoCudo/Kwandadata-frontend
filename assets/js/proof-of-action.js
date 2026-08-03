/* ══════════════════════════════════════
   KwandaData — Proof of Campaign Action Wallet
   - 10% of campaign video-task earnings sits here pending, tagged to the
     video's advertiser/brand
   - User uploads a purchase receipt photo; backend auto-verifies the brand
     via Claude vision and releases the money to Hello Wallet on a match
   - Unredeemed entries auto-forfeit to admin after 30 days
══════════════════════════════════════ */

import { apiFetch } from './api.js';

let cachedEntries = [];
let uploadingEntryId = null;

function daysLeft(expiresAt) {
  var ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

async function initProofOfAction() {
  var totalEl = document.getElementById('poa-total-pending');
  var referralEl = document.getElementById('poa-referral-stats');
  var listEl = document.getElementById('poa-entries-list');
  var historyEl = document.getElementById('poa-history-list');

  try {
    var data = await apiFetch('/proof-of-action');
    cachedEntries = data.entries || [];

    if (totalEl) totalEl.textContent = window.formatRand(data.totalPending || 0);

    if (referralEl) {
      var stats = data.referralStats || { usersReferred: 0, totalEarned: 0 };
      referralEl.innerHTML = '<b>' + stats.usersReferred + '</b> friend' + (stats.usersReferred === 1 ? '' : 's') +
        ' referred &middot; <b>' + window.formatRand(stats.totalEarned) + '</b> earned (already in your Hello Wallet)';
    }

    renderPendingEntries(listEl);
    renderHistory(historyEl);
  } catch (err) {
    console.error('Failed to load Proof of Campaign Action wallet:', err.message);
    if (listEl) listEl.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>Could not load this wallet right now.</div>";
  }
}

function renderPendingEntries(container) {
  if (!container) return;
  var pending = cachedEntries.filter(function(e) { return e.status === 'pending'; });

  if (pending.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:20px;color:var(--text-muted);'><i class='ti ti-receipt' style='font-size:32px;display:block;margin-bottom:8px;opacity:0.4;'></i><p style='font-size:13px;'>Nothing pending. Watch a campaign video to start earning here.</p></div>";
    return;
  }

  container.innerHTML = pending.map(function(e) {
    var left = daysLeft(e.expiresAt);
    return "<div style='background:#fff;border-radius:14px;padding:14px 16px;border:1px solid var(--border);margin-bottom:10px;'>" +
      "<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;'>" +
      "<div><p style='font-size:14px;font-weight:700;color:var(--text-primary);margin:0 0 2px;'>" + e.brandName + "</p>" +
      "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + left + " day" + (left === 1 ? '' : 's') + " left to redeem</p></div>" +
      "<p style='font-size:16px;font-weight:700;color:var(--accent-orange, #f97316);margin:0;'>" + window.formatRand(e.amount) + "</p>" +
      "</div>" +
      "<button onclick=\"promptUploadReceipt('" + e.id + "')\" style='width:100%;padding:11px;border-radius:20px;background:linear-gradient(135deg,var(--primary),#2d1b8e);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;'><i class=\"ti ti-camera\" style=\"margin-right:6px;\"></i>Upload Purchase Receipt</button>" +
      "<div id='poa-status-" + e.id + "' style='font-size:12px;text-align:center;margin-top:8px;min-height:14px;'></div>" +
      "</div>";
  }).join('');
}

function renderHistory(container) {
  if (!container) return;
  var history = cachedEntries.filter(function(e) { return e.status !== 'pending'; });

  if (history.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>No history yet</div>";
    return;
  }

  container.innerHTML = history.map(function(e) {
    var isReleased = e.status === 'released';
    var date = new Date(e.releasedAt || e.forfeitedAt || e.createdAt).toLocaleDateString('en-ZA');
    return "<div style='padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;'>" +
      "<div><p style='font-size:13px;font-weight:600;color:var(--text-primary);margin:0;'>" + e.brandName + "</p>" +
      "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + date + "</p></div>" +
      "<p style='font-size:13px;font-weight:700;margin:0;color:" + (isReleased ? '#166534' : '#ef4444') + ";'>" +
      (isReleased ? '+ ' : 'Forfeited ') + window.formatRand(e.amount) + "</p></div>";
  }).join('');
}

function promptUploadReceipt(entryId) {
  uploadingEntryId = entryId;
  var input = document.getElementById('poa-file-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.id = 'poa-file-input';
    input.style.display = 'none';
    input.addEventListener('change', handleReceiptFileSelected);
    document.body.appendChild(input);
  }
  input.value = '';
  input.click();
}
window.promptUploadReceipt = promptUploadReceipt;

function handleReceiptFileSelected(e) {
  var file = e.target.files && e.target.files[0];
  if (!file || !uploadingEntryId) return;
  var entryId = uploadingEntryId;

  var statusEl = document.getElementById('poa-status-' + entryId);
  if (statusEl) { statusEl.style.color = 'var(--text-muted)'; statusEl.textContent = 'Checking your receipt...'; }

  var reader = new FileReader();
  reader.onload = async function() {
    try {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      var mediaType = file.type || 'image/jpeg';

      var result = await apiFetch('/proof-of-action/' + entryId + '/verify-receipt', {
        method: 'POST',
        body: JSON.stringify({ image: base64, mediaType: mediaType }),
      });

      window.showToast(result.message || 'Receipt confirmed!', 'success');
      initProofOfAction();
    } catch (err) {
      if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = err.message; }
      else window.showToast(err.message, 'error');
    }
  };
  reader.onerror = function() {
    if (statusEl) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'Could not read that photo. Please try again.'; }
  };
  reader.readAsDataURL(file);
}

window.initProofOfAction = initProofOfAction;
export { initProofOfAction };