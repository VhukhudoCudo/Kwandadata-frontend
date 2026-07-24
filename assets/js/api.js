// api.js - shared helper for talking to the KwandaData backend

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:4000/api'
  : 'https://kwandadata-backend.onrender.com/api';

function getToken() {
  return localStorage.getItem('kwanda_token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('kwanda_token', token);
  } else {
    localStorage.removeItem('kwanda_token');
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export { API_BASE, getToken, setToken, apiFetch };

// ── Toast notifications ──
// A small, non-blocking banner that shows briefly at the top of the screen
// and disappears on its own — used instead of alert() for success/info
// messages so the user doesn't have to tap "OK" to continue.
function ensureToastStyles() {
  if (document.getElementById('kw-toast-styles')) return;
  var style = document.createElement('style');
  style.id = 'kw-toast-styles';
  style.textContent =
    '#kw-toast-container{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:8px;align-items:center;width:100%;max-width:400px;padding:0 16px;pointer-events:none;}' +
    '.kw-toast{background:#1f2937;color:#fff;padding:12px 18px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.2);opacity:0;transform:translateY(-12px);transition:opacity 0.25s ease,transform 0.25s ease;max-width:100%;text-align:center;}' +
    '.kw-toast.kw-toast-show{opacity:1;transform:translateY(0);}' +
    '.kw-toast-success{background:#166534;}' +
    '.kw-toast-error{background:#991b1b;}';
  document.head.appendChild(style);
}

function showToast(message, type) {
  ensureToastStyles();
  var container = document.getElementById('kw-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'kw-toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'kw-toast' + (type ? ' kw-toast-' + type : '');
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(function() { toast.classList.add('kw-toast-show'); });

  setTimeout(function() {
    toast.classList.remove('kw-toast-show');
    setTimeout(function() { toast.remove(); }, 250);
  }, 2800);
}

window.showToast = showToast;
export { showToast };