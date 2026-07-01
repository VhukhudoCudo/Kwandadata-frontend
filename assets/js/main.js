/* ══════════════════════════════════════
   KwandaData — Main JS
   - Navigation
   - Page templates
   - Shared utility functions
══════════════════════════════════════ */

// ── Page templates ──
const PAGES = {

  // ── Splash ──
  'splash': `
    <div class="splash-screen">
      <div class="splash-bubble splash-bubble-1"></div>
      <div class="splash-bubble splash-bubble-2"></div>
      <div class="splash-bubble splash-bubble-3"></div>
      <div class="splash-center">
        <div class="splash-logo">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="2" y="2" width="44" height="44" rx="10" fill="#1b1340"/>
            <path d="M17 12 L17 36" stroke="#34d9c4" stroke-width="4" stroke-linecap="round"/>
            <path d="M17 24 L31 12" stroke="#34d9c4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 25.5 L33.5 36" stroke="#f4717e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="splash-title">KwandaData&trade;</h1>
        <p class="splash-tagline">Connect. Earn. Empower Communities.</p>
        <p class="splash-sub">Turning Participation into Opportunity</p>
      </div>
      <div class="splash-actions">
        <button class="btn-primary" onclick="navigateTo('create-account')">Create Account</button>
        <button class="btn-outline" onclick="navigateTo('sign-in')">Sign In</button>
        <button class="btn-link">Learn More</button>
      </div>
      <div class="splash-bar"></div>
    </div>
  `,

  // ── Create Account ──
  'create-account': `
    <div class="auth-screen">
      <div class="auth-header">
        <div class="auth-header-bubble auth-header-bubble-1"></div>
        <div class="auth-header-bubble auth-header-bubble-2"></div>
        <button class="auth-back-btn" onclick="navigateTo('splash')">
          <i class="ti ti-arrow-left"></i>
        </button>
        <h1>Create Account</h1>
        <p>Join KwandaData and start earning</p>
      </div>
      <div class="auth-body">
        <div class="name-row">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="John" />
          </div>
          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" placeholder="Doe" />
          </div>
        </div>
        <div class="form-group">
          <label for="reg-email">Email Address</label>
          <div class="input-wrap has-icon-left">
            <i class="ti ti-mail"></i>
            <input type="email" id="reg-email" placeholder="john@example.com" />
          </div>
        </div>
        <div class="form-group">
          <label for="reg-phone">Phone Number</label>
          <div class="input-wrap has-icon-left">
            <i class="ti ti-phone"></i>
            <input type="tel" id="reg-phone" placeholder="+27 000 000 0000" />
          </div>
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <div class="input-wrap has-icon-both">
            <i class="ti ti-lock"></i>
            <input type="password" id="reg-password" placeholder="Create a password" />
            <i class="ti ti-eye icon-right" onclick="togglePassword('reg-password', this)"></i>
          </div>
        </div>
        <div class="form-group">
          <label for="reg-confirm">Confirm Password</label>
          <div class="input-wrap has-icon-both">
            <i class="ti ti-lock"></i>
            <input type="password" id="reg-confirm" placeholder="Repeat your password" />
            <i class="ti ti-eye icon-right" onclick="togglePassword('reg-confirm', this)"></i>
          </div>
        </div>
        <div class="terms-row">
          <input type="checkbox" id="terms" />
          <label for="terms">I agree to the
            <a href="#">Terms of Service</a> and
            <a href="#">Privacy Policy</a>
          </label>
        </div>
        <p class="auth-error" id="reg-error"></p>
        <button class="btn-purple" onclick="handleRegister()">Create Account</button>
        <p class="auth-footer">Already have an account?
          <span onclick="navigateTo('sign-in')">Sign In</span>
        </p>
      </div>
    </div>
  `,

  // ── Sign In ──
  'sign-in': `
    <div class="auth-screen">
      <div class="auth-header">
        <div class="auth-header-bubble auth-header-bubble-1"></div>
        <div class="auth-header-bubble auth-header-bubble-2"></div>
        <button class="auth-back-btn" onclick="navigateTo('splash')">
          <i class="ti ti-arrow-left"></i>
        </button>
        <h1>Welcome Back</h1>
        <p>Sign in to your KwandaData account</p>
      </div>
      <div class="auth-body">
        <div class="form-group">
          <label for="login-email">Email Address</label>
          <div class="input-wrap has-icon-left">
            <i class="ti ti-mail"></i>
            <input type="email" id="login-email" placeholder="john@example.com" />
          </div>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <div class="input-wrap has-icon-both">
            <i class="ti ti-lock"></i>
            <input type="password" id="login-password" placeholder="Enter your password" />
            <i class="ti ti-eye icon-right" onclick="togglePassword('login-password', this)"></i>
          </div>
        </div>
        <p class="forgot-link">Forgot Password?</p>
        <p class="auth-error" id="login-error"></p>
        <button class="btn-purple" onclick="handleLogin()">Sign In</button>
        <div class="auth-divider">
          <span></span><p>or continue with</p><span></span>
        </div>
        <div class="social-row">
          <button class="social-btn" onclick="handleGoogleLogin()">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button class="social-btn" onclick="handleFacebookLogin()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
        <p class="auth-footer">Don't have an account?
          <span onclick="navigateTo('create-account')">Create Account</span>
        </p>
      </div>
    </div>
  `,

  // ── Home ──
  'home': `
    <div class="home-screen">
      <div class="home-header">
        <div>
          <p class="home-greeting">Good morning</p>
          <h2 class="home-name">Hello, Thabo 👋</h2>
        </div>
        <button class="notif-btn">
          <i class="ti ti-bell"></i>
          <span class="notif-dot"></span>
        </button>
      </div>
      <div class="page-scroll">
        <div class="wallet-card">
          <div>
            <p class="wallet-label">Hello Wallet</p>
            <p class="wallet-amount">250 MB</p>
            <p class="wallet-sub">Available Balance</p>
          </div>
          <div class="wallet-icon"><i class="ti ti-wallet"></i></div>
        </div>
        <div class="bonus-card">
          <div>
            <p class="bonus-label">Pending Bonus</p>
            <p class="bonus-amount">50 MB</p>
          </div>
          <div class="bonus-icon"><i class="ti ti-clock"></i></div>
        </div>
        <div class="section">
          <p class="section-title">Quick Actions</p>
          <div class="quick-actions">
            <div class="action-card" onclick="navigateTo('earn')">
              <div class="action-icon green"><i class="ti ti-database"></i></div>
              <h3>Earn Data</h3>
              <p>Complete activities to earn data</p>
            </div>
            <div class="action-card" onclick="navigateTo('wallet')">
              <div class="action-icon purple"><i class="ti ti-wallet"></i></div>
              <h3>My Wallet</h3>
              <p>View balance and history</p>
            </div>
            <div class="action-card" onclick="navigateTo('redeem')">
              <div class="action-icon violet"><i class="ti ti-refresh"></i></div>
              <h3>Redeem / Use</h3>
              <p>Redeem data or use on partners</p>
            </div>
            <div class="action-card">
              <div class="action-icon orange"><i class="ti ti-users"></i></div>
              <h3>Refer &amp; Earn</h3>
              <p>Invite friends and earn more</p>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="section-title">Recent Activity</p>
            <span class="section-link">+20 MB</span>
          </div>
          <div class="activity-item">
            <div class="activity-icon"><i class="ti ti-file-check"></i></div>
            <div class="activity-info">
              <h4>Survey Completed</h4>
              <p>Today, 10:30 AM</p>
            </div>
            <i class="ti ti-chevron-right activity-arrow"></i>
          </div>
        </div>
        <div class="highlights">
          <h2>Key Highlights</h2>
          <div class="highlights-grid">
            <div class="highlight-item">
              <div class="highlight-icon" style="background:var(--primary);">
                <i class="ti ti-shield-check"></i>
              </div>
              <h4>Participate</h4>
              <p>Engage in activities that matter.</p>
            </div>
            <div class="highlight-item">
              <div class="highlight-icon" style="background:var(--accent-green);">
                <i class="ti ti-gift"></i>
              </div>
              <h4>Earn</h4>
              <p>Earn data for your participation.</p>
            </div>
            <div class="highlight-item">
              <div class="highlight-icon" style="background:var(--accent-blue);">
                <i class="ti ti-wallet"></i>
              </div>
              <h4>Store</h4>
              <p>Your earnings safely in wallet.</p>
            </div>
            <div class="highlight-item">
              <div class="highlight-icon" style="background:var(--accent-orange);">
                <i class="ti ti-transfer"></i>
              </div>
              <h4>Redeem</h4>
              <p>Use or convert your data easily.</p>
            </div>
            <div class="highlight-item">
              <div class="highlight-icon" style="background:var(--accent-purple);">
                <i class="ti ti-users"></i>
              </div>
              <h4>Grow</h4>
              <p>Invite others and unlock more.</p>
            </div>
          </div>
        </div>
        <div class="kwanda-footer">
          KwandaData&trade; – Turning Participation into Opportunity
        </div>
      </div>
      <nav class="bottom-nav">
        <button class="nav-item active" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button>
        <button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button>
        <button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button>
        <button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button>
        <button class="nav-item" onclick="navigateTo('profile')"><i class="ti ti-user"></i><span>Profile</span></button>
      </nav>
    </div>
  `,

  // ── Earn ──
  'earn': `
    <div class="earn-screen">
      <div class="subpage-header">
        <div class="subpage-left">
          <button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button>
          <h2>Earn Data</h2>
        </div>
        <button class="icon-btn"><i class="ti ti-info-circle"></i></button>
      </div>
      <div class="page-scroll">
        <div class="earn-banner">
          <p>Complete activities and<br/>earn data into your wallet</p>
          <span class="earn-banner-icon">🎁</span>
        </div>
        <div class="earn-tabs">
          <button class="earn-tab active" onclick="switchTab(this)">All</button>
          <button class="earn-tab" onclick="switchTab(this)">Tasks</button>
          <button class="earn-tab" onclick="switchTab(this)">Surveys</button>
          <button class="earn-tab" onclick="switchTab(this)">Offers</button>
          <button class="earn-tab" onclick="switchTab(this)">Videos</button>
        </div>
        <div id="task-list"></div>
      </div>
      <nav class="bottom-nav">
        <button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button>
        <button class="nav-item active" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button>
        <button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button>
        <button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button>
        <button class="nav-item" onclick="navigateTo('profile')"><i class="ti ti-user"></i><span>Profile</span></button>
      </nav>
    </div>
  `,

  // ── Wallet ──
  'wallet': `
    <div class="wallet-screen">
      <div class="subpage-header">
        <div class="subpage-left">
          <button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button>
          <h2>My Wallet</h2>
        </div>
        <button class="icon-btn"><i class="ti ti-world"></i></button>
      </div>
      <div class="page-scroll">
        <div class="wallet-card">
          <div>
            <p class="wallet-label">Available Balance</p>
            <p class="wallet-amount">250 MB</p>
            <p class="wallet-sub">Hello Wallet</p>
          </div>
          <div class="wallet-icon"><i class="ti ti-wallet"></i></div>
        </div>
        <div class="bonus-card">
          <div>
            <p class="bonus-label">Pending Bonus</p>
            <p class="bonus-amount">50 MB</p>
          </div>
          <div class="bonus-icon"><i class="ti ti-gift"></i></div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="section-title">Transaction History</p>
            <select class="tx-filter" onchange="filterTransactions(this.value)">
              <option value="all">All</option>
              <option value="earned">Earned</option>
              <option value="redeemed">Redeemed</option>
            </select>
          </div>
          <div class="tx-list" id="tx-list"></div>
        </div>
      </div>
      <nav class="bottom-nav">
        <button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button>
        <button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button>
        <button class="nav-item active" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button>
        <button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button>
        <button class="nav-item" onclick="navigateTo('profile')"><i class="ti ti-user"></i><span>Profile</span></button>
      </nav>
    </div>
  `,

  // ── Redeem ──
  'redeem': `
    <div class="redeem-screen">
      <div class="subpage-header">
        <div class="subpage-left">
          <button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button>
          <h2>Redeem / Use</h2>
        </div>
        <button class="icon-btn"><i class="ti ti-info-circle"></i></button>
      </div>
      <div class="page-scroll">
        <div class="wallet-card">
          <div>
            <p class="wallet-label">Your Balance</p>
            <p class="wallet-amount">250 MB</p>
          </div>
          <div class="wallet-icon"><i class="ti ti-cloud-upload"></i></div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="section-title">Redeem Data</p>
          </div>
        </div>
        <div class="redeem-option" onclick="handleRedeem('airtime')">
          <div class="redeem-icon violet"><i class="ti ti-device-mobile"></i></div>
          <div class="redeem-info"><h4>Airtime</h4><p>Use data to get airtime</p></div>
          <i class="ti ti-chevron-right redeem-arrow"></i>
        </div>
        <div class="redeem-option" onclick="handleRedeem('data-bundle')">
          <div class="redeem-icon blue"><i class="ti ti-wifi"></i></div>
          <div class="redeem-info"><h4>Data Bundle</h4><p>Convert to data bundle</p></div>
          <i class="ti ti-chevron-right redeem-arrow"></i>
        </div>
        <div class="redeem-option" onclick="handleRedeem('partner-apps')">
          <div class="redeem-icon green"><i class="ti ti-apps"></i></div>
          <div class="redeem-info"><h4>Partner Apps</h4><p>Use on partner platforms</p></div>
          <i class="ti ti-chevron-right redeem-arrow"></i>
        </div>
        <div class="redeem-option" onclick="handleRedeem('donate')">
          <div class="redeem-icon red"><i class="ti ti-heart"></i></div>
          <div class="redeem-info"><h4>Donate Data</h4><p>Donate to others</p></div>
          <i class="ti ti-chevron-right redeem-arrow"></i>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="section-title">Recent Redemptions</p>
          </div>
          <div class="redemption-list" id="redemption-list"></div>
        </div>
      </div>
      <nav class="bottom-nav">
        <button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button>
        <button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button>
        <button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button>
        <button class="nav-item active" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button>
        <button class="nav-item" onclick="navigateTo('profile')"><i class="ti ti-user"></i><span>Profile</span></button>
      </nav>
    </div>
  `,

  // ── Admin ──
  'admin': `
    <div class="admin-screen">
      <div class="admin-header">
        <button class="icon-btn"><i class="ti ti-menu-2"></i></button>
        <h2>Admin Dashboard</h2>
        <button class="icon-btn" style="position:relative;">
          <i class="ti ti-bell"></i>
          <span class="notif-dot"></span>
        </button>
      </div>
      <div class="page-scroll">
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon blue"><i class="ti ti-users"></i></div>
            <p class="stat-label">Total Users</p>
            <p class="stat-value">12,458</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="ti ti-user-check"></i></div>
            <p class="stat-label">Active Today</p>
            <p class="stat-value">1,245</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><i class="ti ti-database"></i></div>
            <p class="stat-label">Data Distributed</p>
            <p class="stat-value">245 GB</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><i class="ti ti-check"></i></div>
            <p class="stat-label">Activities Completed</p>
            <p class="stat-value">8,742</p>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <p class="chart-title">Platform Overview</p>
            <select class="chart-period" onchange="updateChart(this.value)">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <canvas id="admin-chart" height="120"></canvas>
        </div>
        <div class="section" style="margin-top:12px;">
          <div class="section-header">
            <p class="section-title">Recent Activities</p>
            <span class="section-link">View all ›</span>
          </div>
          <div class="admin-activity-list" id="admin-activity-list"></div>
        </div>
      </div>
      <nav class="admin-nav">
        <button class="admin-nav-item active"><i class="ti ti-layout-dashboard"></i><span>Overview</span></button>
        <button class="admin-nav-item"><i class="ti ti-users"></i><span>Users</span></button>
        <button class="admin-nav-item"><i class="ti ti-list-check"></i><span>Activities</span></button>
        <button class="admin-nav-item"><i class="ti ti-wallet"></i><span>Wallets</span></button>
        <button class="admin-nav-item" onclick="navigateTo('home')"><i class="ti ti-logout"></i><span>Exit</span></button>
      </nav>
    </div>
  `,

};

// ── Current page tracker ──
let currentPage = null;

// ── Navigate to a page ──
function navigateTo(pageName) {

  if (!PAGES[pageName]) {
    console.error(`Page "${pageName}" not found.`);
    return;
  }

  if (currentPage === pageName) return;

  // Inject page HTML
  const app = document.getElementById('app');
  app.innerHTML = PAGES[pageName];

  currentPage = pageName;
  window.scrollTo(0, 0);

  // Call page init function if it exists
  const initFn = 'init' + capitalize(pageName);
  if (typeof window[initFn] === 'function') {
    window[initFn]();
  }

  history.pushState({ page: pageName }, '', '#' + pageName);
}

// ── Browser back button ──
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) navigateTo(e.state.page);
});

// ── Capitalize helper ──
function capitalize(str) {
  return str.split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

// ── Toggle password visibility ──
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'ti ti-eye-off icon-right';
  } else {
    input.type = 'password';
    icon.className = 'ti ti-eye icon-right';
  }
}

// ── Show / clear error ──
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

// ── Format MB ──
function formatMB(value) {
  return value.toLocaleString() + ' MB';
}

// ── Get input value ──
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── App start ──
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  navigateTo(hash && PAGES[hash] ? hash : 'splash');
});