// api.js - shared helper for talking to the KwandaData backend

const API_BASE = 'http://localhost:4000/api';

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