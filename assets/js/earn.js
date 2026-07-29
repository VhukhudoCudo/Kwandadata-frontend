/* ══════════════════════════════════════
   KwandaData — Earn JS
   Tasks are real campaign tasks fetched from the backend.
   The backend computes the earnings split (admin fee / data /
   Campaign Objective wallet / main wallet) — the frontend just
   displays what comes back.

   Video tasks play inside the app (YouTube or a direct video file).
   The reward is claimed automatically the instant the video actually
   finishes — there is no "did you watch it?" confirmation step, since
   that can't be trusted. Every task (video or otherwise) also enforces
   a max of 2 completions on the backend, so once two users have done
   an activity it disappears for everyone else.
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

    const isLinkTask = !!(task.content && task.content.link);
    let buttonHtml;
    if (task.completed) {
      buttonHtml = `<button class="btn-small" style="background:#22c55e;" disabled>Done</button>`;
    } else if (task.type === 'video' && isLinkTask) {
      buttonHtml = `<button class="btn-small" onclick="openVideoTask('${task.id}')">Watch & Earn</button>`;
    } else if (task.type === 'quiz' && isLinkTask) {
      buttonHtml = `<button class="btn-small" onclick="openQuizTask('${task.id}')">Start Quiz</button>`;
    } else if (isLinkTask) {
      buttonHtml = `<button class="btn-small" onclick="goToTaskLink('${task.id}')">Go & Earn</button>`;
    } else {
      buttonHtml = `<button class="btn-small" onclick="startTask('${task.id}')">Start</button>`;
    }

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

async function goToTaskLink(taskId) {
  const task = currentTasks.find(t => t.id === taskId);
  const link = task && task.content && task.content.link;
  if (link) {
    window.open(link, '_blank');
  }

  const btn = document.querySelector(`#task-${taskId} .btn-small`);
  if (btn) {
    btn.textContent = "I've done this";
    btn.setAttribute('onclick', `startTask('${taskId}')`);
  }
}

/* ══════════════════════════════════════
   Quiz flow — opens the link in a new tab, then requires a minimum
   amount of time to pass in-app before the reward can be claimed.
   No real question/answer tracking — this is a time-gate, not scoring.
══════════════════════════════════════ */

const QUIZ_MIN_SECONDS = 30;
let quizCountdownInterval = null;

function ensureQuizModalStyles() {
  if (document.getElementById('kw-quiz-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'kw-quiz-modal-styles';
  style.textContent =
    '#kw-quiz-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;}' +
    '.kw-quiz-modal{background:#fff;border-radius:16px;padding:20px;width:100%;max-width:360px;text-align:center;}' +
    '.kw-quiz-modal h3{font-size:15px;font-weight:700;color:var(--text-primary);margin:0 0 8px;}' +
    '.kw-quiz-timer{font-size:36px;font-weight:700;color:var(--primary);margin:14px 0;}' +
    '.kw-quiz-hint{font-size:12px;color:var(--text-muted);margin-bottom:16px;line-height:1.5;}' +
    '.kw-quiz-actions{display:flex;flex-direction:column;gap:10px;}' +
    '.kw-quiz-actions button{padding:12px;border-radius:20px;border:none;font-size:14px;font-weight:700;cursor:pointer;}' +
    '.kw-quiz-close{background:#f3f4f6;color:var(--text-primary);}' +
    '.kw-quiz-claim{background:#9ca3af;color:#fff;}' +
    '.kw-quiz-claim.kw-quiz-claim-ready{background:linear-gradient(135deg,#22c55e,#16a34a);}';
  document.head.appendChild(style);
}

function closeQuizModal() {
  if (quizCountdownInterval) { clearInterval(quizCountdownInterval); quizCountdownInterval = null; }
  const el = document.getElementById('kw-quiz-modal-overlay');
  if (el) el.remove();
}

function openQuizTask(taskId) {
  const task = currentTasks.find(t => t.id === taskId);
  const link = task && task.content && task.content.link;
  if (!link) return;

  window.open(link, '_blank');

  ensureQuizModalStyles();
  closeQuizModal();

  const overlay = document.createElement('div');
  overlay.id = 'kw-quiz-modal-overlay';
  overlay.innerHTML =
    `<div class="kw-quiz-modal">
      <h3>${task.title}</h3>
      <p class="kw-quiz-hint">The quiz opened in a new tab. Complete it there, then come back here to claim your reward.</p>
      <div class="kw-quiz-timer" id="kw-quiz-timer">${QUIZ_MIN_SECONDS}s</div>
      <div class="kw-quiz-actions">
        <button type="button" class="kw-quiz-claim" id="kw-quiz-claim-btn" disabled>Please wait...</button>
        <button type="button" class="kw-quiz-close" id="kw-quiz-close-btn">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('kw-quiz-close-btn').addEventListener('click', closeQuizModal);
  document.getElementById('kw-quiz-claim-btn').addEventListener('click', () => {
    closeQuizModal();
    startTask(taskId);
  });

  let remaining = QUIZ_MIN_SECONDS;
  quizCountdownInterval = setInterval(() => {
    remaining -= 1;
    const timerEl = document.getElementById('kw-quiz-timer');
    if (timerEl) timerEl.textContent = remaining + 's';

    if (remaining <= 0) {
      clearInterval(quizCountdownInterval);
      quizCountdownInterval = null;
      const claimBtn = document.getElementById('kw-quiz-claim-btn');
      if (claimBtn) {
        claimBtn.disabled = false;
        claimBtn.textContent = 'Claim Reward';
        claimBtn.className = 'kw-quiz-claim kw-quiz-claim-ready';
      }
      if (timerEl) timerEl.textContent = 'Ready!';
    }
  }, 1000);
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

    return result;
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Start';
    }
    alert(err.message || 'Could not complete this task. Please try again.');
    return null;
  }
}

/* ══════════════════════════════════════
   Video player modal — the reward claims automatically the instant
   the video actually ends. No manual "I watched it" button exists,
   since that step can't be trusted.
══════════════════════════════════════ */

let youtubeApiLoadingPromise = null;
let videoRewardClaimed = false;

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (youtubeApiLoadingPromise) return youtubeApiLoadingPromise;

  youtubeApiLoadingPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
      if (typeof prevCallback === 'function') prevCallback();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return youtubeApiLoadingPromise;
}

function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function ensureVideoModalStyles() {
  if (document.getElementById('kw-video-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'kw-video-modal-styles';
  style.textContent =
    '#kw-video-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;}' +
    '.kw-video-modal{background:#fff;border-radius:16px;padding:16px;width:100%;max-width:420px;}' +
    '.kw-video-modal h3{font-size:15px;font-weight:700;color:var(--text-primary);margin:0 0 10px;}' +
    '.kw-video-wrap{position:relative;width:100%;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#000;margin-bottom:14px;}' +
    '.kw-video-wrap iframe,.kw-video-wrap video{position:absolute;top:0;left:0;width:100%;height:100%;border:none;}' +
    '.kw-video-hint{font-size:12px;color:var(--text-muted);text-align:center;margin-bottom:12px;}' +
    '.kw-video-close-only{width:100%;padding:12px;border-radius:20px;border:none;font-size:14px;font-weight:700;cursor:pointer;background:#f3f4f6;color:var(--text-primary);}';
  document.head.appendChild(style);
}

function closeVideoModal() {
  const el = document.getElementById('kw-video-modal-overlay');
  if (el) el.remove();
}

async function handleVideoEnded(taskId) {
  if (videoRewardClaimed) return; // guard against duplicate end events
  videoRewardClaimed = true;

  const hint = document.getElementById('kw-video-hint');
  if (hint) hint.textContent = 'Video complete — claiming your reward...';

  const result = await startTask(taskId);

  if (result) {
    const hint2 = document.getElementById('kw-video-hint');
    if (hint2) hint2.textContent = '✅ Reward claimed! You can close this now.';
  }
}

function openVideoTask(taskId) {
  const task = currentTasks.find(t => t.id === taskId);
  const link = task && task.content && task.content.link;
  if (!link) return;

  videoRewardClaimed = false;
  ensureVideoModalStyles();
  closeVideoModal();

  const ytId = extractYouTubeId(link);
  const playerAreaHtml = ytId
    ? `<div class="kw-video-wrap"><div id="kw-yt-player"></div></div>`
    : `<div class="kw-video-wrap"><video id="kw-video-el" controls playsinline><source src="${link}"></video></div>`;

  const overlay = document.createElement('div');
  overlay.id = 'kw-video-modal-overlay';
  overlay.innerHTML =
    `<div class="kw-video-modal">
      <h3>${task.title}</h3>
      ${playerAreaHtml}
      <p class="kw-video-hint" id="kw-video-hint">Watch the whole video — your reward is claimed automatically once it ends.</p>
      <button type="button" class="kw-video-close-only" id="kw-video-close-btn">Close</button>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('kw-video-close-btn').addEventListener('click', () => {
    closeVideoModal();
    renderTasks(activeTab); // refresh in case the reward was claimed while the modal was open
  });

  if (ytId) {
    loadYouTubeApi().then(() => {
      if (!document.getElementById('kw-yt-player')) return; // modal was closed before the API finished loading
      new window.YT.Player('kw-yt-player', {
        videoId: ytId,
        playerVars: { rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleVideoEnded(taskId);
            }
          },
        },
      });
    });
  } else {
    const videoEl = document.getElementById('kw-video-el');
    if (videoEl) {
      videoEl.addEventListener('ended', () => handleVideoEnded(taskId));
    }
  }
}

export { initEarn, switchTab, startTask, goToTaskLink, openVideoTask, openQuizTask };
window.initEarn       = initEarn;
window.switchTab      = switchTab;
window.startTask      = startTask;
window.goToTaskLink   = goToTaskLink;
window.openVideoTask  = openVideoTask;
window.openQuizTask   = openQuizTask;