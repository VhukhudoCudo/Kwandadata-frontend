/* ══════════════════════════════════════
   KwandaData — Earn JS
   Tasks are real campaign tasks fetched from the backend.
   The backend computes the earnings split (admin fee / data /
   Campaign Objective wallet / main wallet) — the frontend just
   displays what comes back.
══════════════════════════════════════ */

import { apiFetch } from './api.js';

let activeTab = 'all';
let currentTasks = [];

async function initEarn() {
  try {
    const data = await apiFetch('/earn/tasks');
    currentTasks = data.tasks || [];
  } catch (err) {
    console.error('Failed to load tasks:', err.message);
    currentTasks = [];
  }
  renderTasks(activeTab);
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

const TAB_TYPE_MAP = {
  tasks: ['quiz'],
  surveys: ['survey'],
  offers: ['download', 'signup'],
  videos: ['video'],
};

function renderTasks(tab) {
  const container = document.getElementById('task-list');
  if (!container) return;

  const allowedTypes = TAB_TYPE_MAP[tab];
  const filtered = tab === 'all'
    ? currentTasks
    : currentTasks.filter(task => allowedTypes && allowedTypes.includes(task.type));

  if (filtered.length === 0) {
    container.innerHTML = `<div class="tx-empty"><i class="ti ti-inbox"></i>No tasks available right now — check back soon.</div>`;
    return;
  }

  container.innerHTML = filtered.map(task => {
    const sponsored = task.campaign
      ? `<span class="task-duration" style="color:#f97316;font-weight:600;">Sponsored by ${task.campaign.advertiser.firstName} ${task.campaign.advertiser.lastName}</span>`
      : `<span class="task-duration">${task.type}</span>`;

    const buttonHtml = task.completed
      ? `<button class="btn-small" style="background:#22c55e;" disabled>Done</button>`
      : `<button class="btn-small" onclick="startTask('${task.id}')">Start</button>`;

    return `
      <div class="task-item" id="task-${task.id}" ${task.campaign ? 'style="border-left:3px solid #f97316;"' : ''}>
        <div class="task-icon ${task.campaign ? 'orange' : 'blue'}">
          <i class="ti ${task.campaign ? 'ti-speakerphone' : 'ti-file-text'}"></i>
        </div>
        <div class="task-info">
          <h4>${task.title}</h4>
          <p>${task.description}</p>
          ${sponsored}
        </div>
        <div class="task-right">
          <span class="task-reward">R ${window.formatAmt(task.reward)}</span>
          ${buttonHtml}
        </div>
      </div>
    `;
  }).join('');
}

async function startTask(taskId) {
  const btn = document.querySelector(`#task-${taskId} .btn-small`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = '...';
  }

  try {
    const result = await apiFetch(`/earn/tasks/${taskId}/complete`, { method: 'POST' });

    if (typeof window.logActivity === 'function') window.logActivity('task', null);

    if (btn) {
      btn.textContent = 'Done';
      btn.style.background = '#22c55e';
    }

    // Mark it completed locally so switching tabs doesn't re-show "Start"
    const task = currentTasks.find(t => t.id === taskId);
    if (task) task.completed = true;

    // Refresh the home balance display if that function is available
    if (typeof window.initHome === 'function') window.initHome();

    if (typeof window.addTransaction === 'function') {
      const taskTitle = task ? task.title : 'Task';
      window.addTransaction('earned', task && task.campaign ? 'ti-speakerphone' : 'ti-file-text', taskTitle, result.walletShare);
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Start';
    }
    alert(err.message || 'Could not complete this task. Please try again.');
  }
}

export { initEarn, switchTab, startTask };
window.initEarn   = initEarn;
window.switchTab  = switchTab;
window.startTask  = startTask;