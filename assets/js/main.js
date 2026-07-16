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
        <img src="data:image/png;base64,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" alt="KwandaData" class="splash-logo-img"/>
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
        <div class="bonus-card bonus-card-green">
          <div>
            <p class="bonus-label">📶 Ready-to-Use Data Balance</p>
            <p class="bonus-amount data-balance">0 MB</p>
            <p class="wallet-sub">Ready to redeem as data</p>
          </div>
          <div class="bonus-icon"><i class="ti ti-wifi"></i></div>
        </div>
        <div class="wallet-card">
          <div>
            <p class="wallet-label">Campaign Objective Wallet</p>
            <p class="wallet-amount" id="campaign-wallet-total">R 0.00</p>
            <p class="wallet-sub">Redeemable with specific companies</p>
          </div>
          <div class="wallet-icon"><i class="ti ti-building-store"></i></div>
        </div>
        <div class="section">
          <div class="section-header">
            <p class="section-title">By Company</p>
          </div>
          <div id="campaign-wallet-list"></div>
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