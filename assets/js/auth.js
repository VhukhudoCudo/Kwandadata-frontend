/* ══════════════════════════════════════
   KwandaData — Auth JS
   - Register (Create Account)
   - Login (Sign In)
   - Google & Facebook login
   - Form validation
══════════════════════════════════════ */

import { apiFetch, setToken } from './api.js';

// ── Simple in-memory user store ──
const users = [];

// ── Handle Register ──
async function handleRegister() {

  // Get all field values
  const firstName  = getVal('first-name');
  const lastName   = getVal('last-name');
  const email      = getVal('reg-email').toLowerCase();
  const phone      = getVal('reg-phone');
  const networkSel = getVal('reg-network');
  const network    = networkSel === 'other' ? getVal('reg-network-other') : networkSel;
  const dob        = getVal('reg-dob');
  const age        = getVal('reg-age');
  const gender     = getVal('reg-gender');
  const race       = getVal('reg-race');
  const language   = getVal('reg-language');
  const province   = getVal('reg-province');
  const region     = getVal('reg-region');
  const employment = getVal('reg-employment');
  const password   = getVal('reg-password');
  const confirm    = getVal('reg-confirm');
  const terms      = document.getElementById('terms');

  // Clear previous errors
  clearError('reg-error');

  // ── Validation ──

  if (!firstName || !lastName) {
    showError('reg-error', 'Please enter your first and last name.');
    return;
  }

  if (!isValidEmail(email)) {
    showError('reg-error', 'Please enter a valid email address.');
    return;
  }

  if (!phone) {
    showError('reg-error', 'Please enter your phone number.');
    return;
  }

  if (!networkSel) {
    showError('reg-error', 'Please select your network provider.');
    return;
  }

  if (networkSel === 'other' && !network) {
    showError('reg-error', 'Please type your network provider.');
    return;
  }

  if (!dob) {
    showError('reg-error', 'Please enter your date of birth.');
    return;
  }

  if (!age) {
    showError('reg-error', 'Please enter your age.');
    return;
  }

  if (!gender) {
    showError('reg-error', 'Please select your gender.');
    return;
  }

  if (!race) {
    showError('reg-error', 'Please select your race.');
    return;
  }

  if (!language) {
    showError('reg-error', 'Please select your home language.');
    return;
  }

  if (!province) {
    showError('reg-error', 'Please select your province.');
    return;
  }

  if (!region) {
    showError('reg-error', 'Please enter your region or city.');
    return;
  }

  if (!employment) {
    showError('reg-error', 'Please select your employment status.');
    return;
  }

  if (password.length < 6) {
    showError('reg-error', 'Password must be at least 6 characters.');
    return;
  }

  if (password !== confirm) {
    showError('reg-error', 'Passwords do not match.');
    return;
  }

  if (!terms.checked) {
    showError('reg-error', 'Please accept the Terms of Service.');
    return;
  }

  // Check email not already registered, and pick up any referral code entered
  const referralInput = document.getElementById('reg-referral');
  const referralCode  = referralInput ? referralInput.value.trim() : '';

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phone,
        network,
        dob,
        gender,
        language,
        province,
        region,
        employment,
        usedReferralOf: referralCode || undefined,
      }),
    });

    setToken(data.token);
    localStorage.setItem('kwanda_current_user', JSON.stringify(data.user));

    if (typeof window.logActivity === 'function') window.logActivity('register', null);

    navigateTo('home');
  } catch (err) {
    showError('reg-error', err.message || 'Registration failed. Please try again.');
  }
}

// ── Handle Login ──
async function handleLogin() {

  const email    = getVal('login-email').toLowerCase();
  const password = getVal('login-password');

  clearError('login-error');

  if (!isValidEmail(email)) {
    showError('login-error', 'Please enter a valid email address.');
    return;
  }

  if (!password) {
    showError('login-error', 'Please enter your password.');
    return;
  }

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    localStorage.setItem('kwanda_current_user', JSON.stringify(data.user));

    if (typeof window.logActivity === 'function') window.logActivity('login', null);

    navigateTo('home');
  } catch (err) {
    showError('login-error', err.message || 'Incorrect email or password.');
  }
}

// ── Handle Google Login ──
function handleGoogleLogin() {
  alert('Google login coming soon!');
}

// ── Handle Facebook Login ──
function handleFacebookLogin() {
  alert('Facebook login coming soon!');
}

// ── Email validation ──
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ── Get current logged in user ──
function getCurrentUser() {
  const stored = localStorage.getItem('kwanda_current_user');
  return stored ? JSON.parse(stored) : null;
}

// ── Log out ──
function logout() {
  localStorage.removeItem('kwanda_current_user');
  setToken(null);
  navigateTo('splash');
}

// ── Expose to window ──
window.handleRegister      = handleRegister;
window.handleLogin         = handleLogin;
window.handleGoogleLogin   = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.getCurrentUser      = getCurrentUser;
window.logout              = logout;