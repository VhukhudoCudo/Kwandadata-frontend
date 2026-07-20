/* ══════════════════════════════════════
   KwandaData — Auth JS
   - Register (Create Account)
   - Login (Sign In)
   - Google & Facebook login
   - Form validation
══════════════════════════════════════ */

// ── Simple in-memory user store ──
const users = [];

// ── Handle Register ──
function handleRegister() {

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

  // Check email not already registered
  const stored  = localStorage.getItem('kwanda_users');
  const allUsers = stored ? JSON.parse(stored) : [];
  const exists  = allUsers.find(u => (u.email || '').toLowerCase() === email);
  if (exists) {
    showError('reg-error', 'An account with this email already exists.');
    return;
  }

  // ── Build user object ──
  // ── Generate unique referral code ──
  function generateReferralCode(first, last) {
    var prefix = (first.charAt(0) + last.charAt(0)).toUpperCase();
    var random = Math.floor(1000 + Math.random() * 9000);
    return "KW" + prefix + random;
  }

  const newUser = {
    firstName,
    lastName,
    email,
    phone,
    network,
    dob,
    age,
    gender,
    race,
    language,
    province,
    region,
    employment,
    password,
    balance      : 0,
    bonus        : 0,
    dataBalance  : 0,
    referralCode : generateReferralCode(firstName, lastName),
    createdAt    : Date.now(),
    activeDays   : [],
  };

  // ── Save user ──
  allUsers.push(newUser);
  localStorage.setItem('kwanda_users', JSON.stringify(allUsers));

  // ── Save session (without password) ──
  const session = { ...newUser };
  delete session.password;
  localStorage.setItem('kwanda_current_user', JSON.stringify(session));

  if (typeof window.logActivity === 'function') window.logActivity('register', null);

  // ── Process referral bonus if referral code was used ──
  const referralInput = document.getElementById('reg-referral');
  const referralCode  = referralInput ? referralInput.value.trim() : '';

  if (referralCode) {
    const REFERRAL_BONUS = 5.00;

    // Find referrer by referral code
    const referrerIndex = allUsers.findIndex(u => u.referralCode === referralCode);
    if (referrerIndex !== -1) {
      // Add pending bonus to referrer - activates when new user completes first task
      allUsers[referrerIndex].pendingBonus = (allUsers[referrerIndex].pendingBonus || 0) + REFERRAL_BONUS;
      allUsers[referrerIndex].pendingReferral = email; // track who triggered it

      // Also add pending bonus to new user
      const newUserIndex = allUsers.findIndex(u => u.email === email);
      if (newUserIndex !== -1) {
        allUsers[newUserIndex].pendingBonus    = REFERRAL_BONUS;
        allUsers[newUserIndex].usedReferralOf  = referralCode;
      }

      localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
      alert('Referral code applied! R 5.00 bonus is pending for both you and your referrer. It will be released when you complete your first task.');
    }
  }

  // Navigate to home
  navigateTo('home');
}

// ── Handle Login ──
function handleLogin() {

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

  const stored   = localStorage.getItem('kwanda_users');
  const allUsers = stored ? JSON.parse(stored) : [];

  const user = allUsers.find(
    u => (u.email || '').toLowerCase() === email && u.password === password
  );

  if (!user) {
    showError('login-error', 'Incorrect email or password.');
    return;
  }

  // Save session without password
  const session = { ...user };
  delete session.password;
  localStorage.setItem('kwanda_current_user', JSON.stringify(session));

  if (typeof window.logActivity === 'function') window.logActivity('login', null);

  navigateTo('home');
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
  navigateTo('splash');
}

// ── Expose to window ──
window.handleRegister      = handleRegister;
window.handleLogin         = handleLogin;
window.handleGoogleLogin   = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.getCurrentUser      = getCurrentUser;
window.logout              = logout;