// app.js - KwandaData Main App File
import './auth.js';
import './advertiser.js';
import { initHome } from './home.js';
import { initEarn, switchTab, startTask } from './earn.js';
import { initWallet, filterTransactions } from './wallet.js';
import { initRedeem, handleRedeem } from './redeem.js';
import { initAdmin, updateChart } from './admin.js';
 import Chart from 'chart.js/auto';
 window.Chart = Chart;

const PAGES = {};

PAGES['splash'] = `<div class="splash-screen"><div class="splash-bubble splash-bubble-1"></div><div class="splash-bubble splash-bubble-2"></div><div class="splash-bubble splash-bubble-3"></div><div class="splash-center"><div class="splash-logo"><svg viewBox="0 0 48 48" fill="none"><path d="M10 36 L20 12 L28 28 L34 18 L42 36" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h1 class="splash-title">KwandaData&trade;</h1><p class="splash-tagline">Connect. Earn. Empower Communities.</p><p class="splash-sub">Turning Participation into Opportunity</p></div><div class="splash-actions"><p style="font-family:sans-serif;font-size:12px;color:#9089cc;text-align:center;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">I am a</p><div style="display:flex;gap:12px;margin-bottom:12px;"><button onclick="navigateTo('create-account')" style="flex:1;padding:15px;border-radius:20px;background:#fff;color:#2d1b8e;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:22px;">👤</span><span>User</span><span style="font-size:10px;font-weight:500;color:#9089cc;">Earn money</span></button><button onclick="navigateTo('advertiser-login')" style="flex:1;padding:15px;border-radius:20px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:22px;">🏢</span><span>Advertiser</span><span style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.8);">Run campaigns</span></button></div><button onclick="navigateTo('sign-in')" style="width:100%;padding:14px;border-radius:30px;background:transparent;color:#fff;font-size:14px;font-weight:600;border:1.5px solid rgba(255,255,255,0.3);cursor:pointer;font-family:sans-serif;">Already have an account? Sign In</button><button class="btn-link">Learn More</button></div><div class="splash-bar"></div></div>`;

PAGES['create-account'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('splash')"><i class="ti ti-arrow-left"></i></button><h1>Create Account</h1><p>Join KwandaData and start earning</p></div><div class="auth-body"><div class="name-row"><div class="form-group"><label for="first-name">First Name</label><input type="text" id="first-name" placeholder="John"/></div><div class="form-group"><label for="last-name">Last Name</label><input type="text" id="last-name" placeholder="Doe"/></div></div><div class="form-group"><label for="reg-email">Email Address</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="reg-email" placeholder="john@example.com"/></div></div><div class="form-group"><label for="reg-phone">Phone Number</label><div class="input-wrap has-icon-left"><i class="ti ti-phone"></i><input type="tel" id="reg-phone" placeholder="+27 000 000 0000"/></div></div><div class="form-group"><label for="reg-dob">Date of Birth</label><div class="input-wrap has-icon-left"><i class="ti ti-calendar"></i><input type="date" id="reg-dob" onchange="calcAge(this.value)"/></div></div><div class="form-group"><label for="reg-age">Age</label><div class="input-wrap has-icon-left"><i class="ti ti-user"></i><input type="number" id="reg-age" placeholder="Auto-calculated" min="1" max="120" readonly style="background:#f5f6fa;cursor:not-allowed;"/></div></div><div class="form-group"><label for="reg-gender">Gender</label><select id="reg-gender" class="form-select"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="non-binary">Non-binary</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><div class="form-group"><label for="reg-race">Race</label><select id="reg-race" class="form-select"><option value="">Select race</option><option value="black-african"> African</option><option value="coloured">Coloured</option><option value="indian-asian">Indian/Asian</option><option value="white">White</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><div class="form-group"><label for="reg-language">Home Language</label><select id="reg-language" class="form-select"><option value="">Select language</option><option value="zulu">isiZulu</option><option value="xhosa">isiXhosa</option><option value="afrikaans">Afrikaans</option><option value="english">English</option><option value="northern-sotho">Sepedi</option><option value="tswana">Setswana</option><option value="sotho">Sesotho</option><option value="tsonga">Xitsonga</option><option value="swati">siSwati</option><option value="venda">Tshivenda</option><option value="ndebele">isiNdebele</option></select></div><div class="form-group"><label for="reg-province">Province</label><select id="reg-province" class="form-select"><option value="">Select province</option><option value="eastern-cape">Eastern Cape</option><option value="free-state">Free State</option><option value="gauteng">Gauteng</option><option value="kwazulu-natal">KwaZulu-Natal</option><option value="limpopo">Limpopo</option><option value="mpumalanga">Mpumalanga</option><option value="north-west">North West</option><option value="northern-cape">Northern Cape</option><option value="western-cape">Western Cape</option></select></div><div class="form-group"><label for="reg-region">Region / City</label><div class="input-wrap has-icon-left"><i class="ti ti-map-pin"></i><input type="text" id="reg-region" placeholder="e.g. Soweto, Sandton"/></div></div><div class="form-group"><label for="reg-employment">Employment Status</label><select id="reg-employment" class="form-select"><option value="">Select status</option><option value="employed-full-time">Employed Full-time</option><option value="employed-part-time">Employed Part-time</option><option value="self-employed">Self-employed</option><option value="unemployed">Unemployed</option><option value="student">Student</option><option value="retired">Retired</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><div class="form-group"><label for="reg-password">Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="reg-password" placeholder="Create a password"/><i class="ti ti-eye icon-right" onclick="togglePassword('reg-password', this)"></i></div></div><div class="form-group"><label for="reg-confirm">Confirm Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="reg-confirm" placeholder="Repeat your password"/><i class="ti ti-eye icon-right" onclick="togglePassword('reg-confirm', this)"></i></div></div><div class="form-group"><label for="reg-referral">Referral Code (Optional)</label><div class="input-wrap has-icon-left"><i class="ti ti-gift"></i><input type="text" id="reg-referral" placeholder="Enter referral code if you have one"/></div></div><div class="terms-row"><input type="checkbox" id="terms"/><label for="terms">I agree to the <a href="#" onclick="navigateTo('terms')">Terms of Service</a> and <a href="#" onclick="navigateTo('privacy')">Privacy Policy</a></label></div><p class="auth-error" id="reg-error"></p><button class="btn-purple" onclick="handleRegister()">Create Account</button><p class="auth-footer">Already have an account? <span onclick="navigateTo('sign-in')">Sign In</span></p></div></div>`;

PAGES['sign-in'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('splash')"><i class="ti ti-arrow-left"></i></button><h1>Welcome Back</h1><p>Sign in to your KwandaData account</p></div><div class="auth-body"><div class="form-group"><label for="login-email">Email Address</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="login-email" placeholder="john@example.com"/></div></div><div class="form-group"><label for="login-password">Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="login-password" placeholder="Enter your password"/><i class="ti ti-eye icon-right" onclick="togglePassword('login-password', this)"></i></div></div><p class="forgot-link" onclick="navigateTo('forgot-password')">Forgot Password?</p><p class="auth-error" id="login-error"></p><button class="btn-purple" onclick="handleLogin()">Sign In</button><div class="auth-divider"><span></span><p>or continue with</p><span></span></div><div class="social-row"><button class="social-btn" onclick="handleGoogleLogin()"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Google</button><button class="social-btn" onclick="handleFacebookLogin()"><svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook</button></div><p class="auth-footer">Don't have an account? <span onclick="navigateTo('create-account')">Create Account</span></p></div></div>`;

PAGES['home'] = `<div class="home-screen"><div class="home-header"><div><p class="home-greeting">Good morning</p><h2 class="home-name">Hello</h2></div><div style="display:flex;align-items:center;gap:8px;"><button class="notif-btn" onclick="navigateTo('notifications')" style="cursor:pointer;"><i class="ti ti-bell"></i><span class="notif-dot"></span></button><button onclick="logout()" style="background:#fee2e2;border:none;border-radius:20px;padding:8px 14px;display:flex;align-items:center;gap:6px;cursor:pointer;"><i class="ti ti-logout" style="color:#ef4444;font-size:16px;"></i><span style="color:#ef4444;font-size:13px;font-weight:600;">Log Out</span></button></div></div><div class="page-scroll"><div class="wallet-card"><div><p class="wallet-label">Hello Wallet</p><p class="wallet-amount">R 0.00</p><p class="wallet-sub">Available Balance</p></div><div class="wallet-icon"><i class="ti ti-wallet"></i></div></div><div class="bonus-card"><div><p class="bonus-label">Pending Bonus</p><p class="bonus-amount">R 0.00</p></div><div class="bonus-icon"><i class="ti ti-clock"></i></div></div><div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:14px;padding:14px 18px;margin:10px 16px 0;display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:2px;">📶 Ready-to-Use Data Balance</p><p class="data-balance" style="font-size:22px;font-weight:700;color:#fff;">0 MB</p><p style="font-size:11px;color:rgba(255,255,255,0.7);">Ready to redeem as data</p></div><div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;"><i class="ti ti-wifi"></i></div></div><div class="section"><p class="section-title">Quick Actions</p><div class="quick-actions"><div class="action-card" onclick="navigateTo('earn')"><div class="action-icon green"><i class="ti ti-database"></i></div><h3>Earn</h3><p>Complete activities to earn data</p></div><div class="action-card" onclick="navigateTo('wallet')"><div class="action-icon purple"><i class="ti ti-wallet"></i></div><h3>My Wallet</h3><p>View balance and history</p></div><div class="action-card" onclick="navigateTo('redeem')"><div class="action-icon violet"><i class="ti ti-refresh"></i></div><h3>Redeem / Use</h3><p>Redeem data or use on partners</p></div><div class="action-card" onclick="navigateTo('refer')"><div class="action-icon orange"><i class="ti ti-users"></i></div><h3>Refer &amp; Earn</h3><p>Invite friends and earn more</p></div></div></div><div class="section"><div class="section-header"><p class="section-title">Recent Activity</p></div><div id="home-recent-activity"><div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px;">No activity yet</div></div></div><div class="highlights"><h2>Key Highlights</h2><div class="highlights-grid"><div class="highlight-item"><div class="highlight-icon" style="background:var(--primary);"><i class="ti ti-shield-check"></i></div><h4>Participate</h4><p>Engage in activities that matter.</p></div><div class="highlight-item"><div class="highlight-icon" style="background:var(--accent-green);"><i class="ti ti-gift"></i></div><h4>Earn</h4><p>Earn data for your participation.</p></div><div class="highlight-item"><div class="highlight-icon" style="background:var(--accent-blue);"><i class="ti ti-wallet"></i></div><h4>Store</h4><p>Your earnings safely in wallet.</p></div><div class="highlight-item"><div class="highlight-icon" style="background:var(--accent-orange);"><i class="ti ti-transfer"></i></div><h4>Redeem</h4><p>Use or convert your data easily.</p></div><div class="highlight-item"><div class="highlight-icon" style="background:var(--accent-purple);"><i class="ti ti-users"></i></div><h4>Grow</h4><p>Invite others and unlock more.</p></div></div></div><div class="kwanda-footer">KwandaData&trade; - Turning Participation into Opportunity</div></div><nav class="bottom-nav"><button class="nav-item active" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item" onclick="navigateTo('donate')"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['earn'] = `<div class="earn-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h2>Earn Data</h2></div><button class="icon-btn"><i class="ti ti-info-circle"></i></button></div><div class="page-scroll"><div class="earn-banner"><p>Complete activities and earn data into your wallet</p><span class="earn-banner-icon">🎁</span></div><div class="earn-tabs"><button class="earn-tab active" id="tab-all" onclick="switchTab(this)">All</button><button class="earn-tab" id="tab-tasks" onclick="switchTab(this)">Tasks</button><button class="earn-tab" id="tab-surveys" onclick="switchTab(this)">Surveys</button><button class="earn-tab" id="tab-offers" onclick="switchTab(this)">Offers</button><button class="earn-tab" id="tab-videos" onclick="switchTab(this)">Videos</button></div><div id="task-list"></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item active"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item" onclick="navigateTo('donate')"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['wallet'] = `<div class="wallet-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h2>My Wallet</h2></div><button class="icon-btn"><i class="ti ti-world"></i></button></div><div class="page-scroll"><div class="wallet-card"><div><p class="wallet-label">Available Balance</p><p class="wallet-amount">R 0.00</p><p class="wallet-sub">KwandaData Wallet</p></div><div class="wallet-icon"><i class="ti ti-wallet"></i></div></div><div class="bonus-card"><div><p class="bonus-label">Pending Bonus</p><p class="bonus-amount">R 0.00</p></div><div class="bonus-icon"><i class="ti ti-gift"></i></div></div><div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:14px;padding:14px 18px;margin:10px 16px 0;display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:2px;">📶 Ready-to-Use Data Balance</p><p class="data-balance" style="font-size:22px;font-weight:700;color:#fff;">0 MB</p><p style="font-size:11px;color:rgba(255,255,255,0.7);">Ready to redeem as data</p></div><div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;"><i class="ti ti-wifi"></i></div></div><div class="section"><div class="section-header"><p class="section-title">Transaction History</p><select class="tx-filter" onchange="filterTransactions(this.value)"><option value="all">All</option><option value="earned">Earned</option><option value="redeemed">Redeemed</option></select></div><div class="tx-list" id="tx-list"></div></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item active"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item" onclick="navigateTo('donate')"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['redeem'] = `<div class="redeem-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h2>Redeem / Use</h2></div><button class="icon-btn"><i class="ti ti-info-circle"></i></button></div><div class="page-scroll"><div class="wallet-card"><div><p class="wallet-label">Your Balance</p><p class="wallet-amount">R 0.00</p></div><div class="wallet-icon"><i class="ti ti-cloud-upload"></i></div></div><div class="section"><div class="section-header"><p class="section-title">Redeem Data</p></div></div><div class="redeem-option" onclick="handleRedeem('airtime')"><div class="redeem-icon violet"><i class="ti ti-device-mobile"></i></div><div class="redeem-info"><h4>Airtime</h4><p>Buy airtime with your earnings</p></div><i class="ti ti-chevron-right redeem-arrow"></i></div><div class="redeem-option" onclick="handleRedeem('data-bundle')"><div class="redeem-icon blue"><i class="ti ti-wifi"></i></div><div class="redeem-info"><h4>Data Bundle</h4><p>Buy a data bundle</p></div><i class="ti ti-chevron-right redeem-arrow"></i></div><div class="redeem-option" onclick="handleRedeem('partner-apps')"><div class="redeem-icon green"><i class="ti ti-apps"></i></div><div class="redeem-info"><h4>Partner Apps</h4><p>Spend on partner platforms</p></div><i class="ti ti-chevron-right redeem-arrow"></i></div><div class="redeem-option" onclick="handleRedeem('cash-out')"><div class="redeem-icon red"><i class="ti ti-banknote"></i></div><div class="redeem-info"><h4>Cash Out</h4><p>Withdraw to your bank account</p></div><i class="ti ti-chevron-right redeem-arrow"></i></div><div class="section"><div class="section-header"><p class="section-title">📶 Data Balance</p></div></div><div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);border-radius:14px;padding:16px 18px;margin:0 16px 16px;display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:2px;">Ready-to-Use Data</p><p class="data-balance-redeem" style="font-size:24px;font-weight:700;color:#fff;">0 MB</p><p style="font-size:11px;color:rgba(255,255,255,0.7);">Redeem as data bundle to your number</p></div><i class="ti ti-wifi" style="font-size:32px;color:rgba(255,255,255,0.6);"></i></div><div style="padding:0 16px 16px;"><button onclick="redeemDataBundle()" style="width:100%;padding:13px;border-radius:30px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;">Redeem Data Bundle</button></div><div class="section"><div class="section-header"><p class="section-title">Recent Redemptions</p></div><div class="redemption-list" id="redemption-list"></div></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item active"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item" onclick="navigateTo('donate')"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['refer'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h1>Refer &amp; Earn</h1><p>Invite friends and earn more data</p></div><div class="auth-body"><div style="background:linear-gradient(135deg,#6c63ff,#2d1b8e);border-radius:18px;padding:24px;text-align:center;color:#fff;margin-bottom:8px;"><i class="ti ti-users" style="font-size:40px;margin-bottom:12px;display:block;"></i><h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Invite Friends</h2><p style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.5;">Share your referral code and earn R 5.00 for every friend who joins KwandaData.</p></div><div style="background:#fff;border-radius:14px;padding:16px;border:1.5px solid var(--border);"><p style="font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Your Referral Code</p><div style="display:flex;align-items:center;gap:10px;"><p id="user-referral-code" style="font-size:24px;font-weight:700;color:var(--primary);letter-spacing:4px;flex:1;">...</p><button onclick="copyReferralCode()" style="padding:8px 16px;border-radius:10px;background:var(--primary);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;">Copy</button></div></div><button class="btn-purple" onclick="shareReferralCode()">Share with Friends</button><div style="background:#fff;border-radius:14px;padding:16px;border:1.5px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">How it works</p><div style="display:flex;flex-direction:column;gap:12px;"><div style="display:flex;align-items:center;gap:12px;"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">1</div><p style="font-size:13px;color:var(--text-muted);">Share your referral code with friends</p></div><div style="display:flex;align-items:center;gap:12px;"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">2</div><p style="font-size:13px;color:var(--text-muted);">Friend signs up using your code</p></div><div style="display:flex;align-items:center;gap:12px;"><div style="width:32px;height:32px;border-radius:50%;background:var(--accent-green);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">3</div><p style="font-size:13px;color:var(--text-muted);">You both earn R 5.00 instantly!</p></div></div></div></div></div>`;

PAGES['profile'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h1>My Profile</h1><p>Manage your account</p></div><div class="auth-body"><div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px 0;"><div class="profile-avatar" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#2d1b8e);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:700;">?</div><h2 class="profile-name" style="font-size:20px;font-weight:700;color:var(--text-primary);">Loading...</h2><p class="profile-email" style="font-size:13px;color:var(--text-muted);">...</p></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;"><div onclick="navigateTo('edit-profile')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-user-edit" style="font-size:18px;color:var(--primary);"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Edit Profile</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="navigateTo('notifications')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-bell" style="font-size:18px;color:var(--primary);"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Notifications</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="navigateTo('security')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-shield-lock" style="font-size:18px;color:var(--primary);"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Security</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="navigateTo('admin')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-layout-dashboard" style="font-size:18px;color:var(--primary);"></i><span style="font-size:14px;font-weight:600;color:var(--primary);">Admin Dashboard</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="logout()" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-logout" style="font-size:18px;color:#ef4444;"></i><span style="font-size:14px;font-weight:600;color:#ef4444;">Sign Out</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item active"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['edit-profile'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('profile')"><i class="ti ti-arrow-left"></i></button><h1>Edit Profile</h1><p>Update your personal information</p></div><div class="auth-body"><div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 0 16px;"><div class="profile-avatar" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6c63ff,#2d1b8e);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:700;">?</div><button style="background:none;border:none;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer;">Change Photo</button></div><div class="name-row"><div class="form-group"><label for="edit-first-name">First Name</label><input type="text" id="edit-first-name" placeholder="John"/></div><div class="form-group"><label for="edit-last-name">Last Name</label><input type="text" id="edit-last-name" placeholder="Doe"/></div></div><div class="form-group"><label for="edit-email">Email Address</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="edit-email" placeholder="john@example.com"/></div></div><div class="form-group"><label for="edit-phone">Phone Number</label><div class="input-wrap has-icon-left"><i class="ti ti-phone"></i><input type="tel" id="edit-phone" placeholder="+27 000 000 0000"/></div></div><div class="form-group"><label for="edit-dob">Date of Birth</label><div class="input-wrap has-icon-left"><i class="ti ti-calendar"></i><input type="date" id="edit-dob"/></div></div><div class="form-group"><label for="edit-gender">Gender</label><select id="edit-gender" class="form-select"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="non-binary">Non-binary</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><div class="form-group"><label for="edit-race">Race</label><select id="edit-race" class="form-select"><option value="">Select race</option><option value="black-african">Black African</option><option value="coloured">Coloured</option><option value="indian-asian">Indian/Asian</option><option value="white">White</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><div class="form-group"><label for="edit-language">Home Language</label><select id="edit-language" class="form-select"><option value="">Select language</option><option value="zulu">isiZulu</option><option value="xhosa">isiXhosa</option><option value="afrikaans">Afrikaans</option><option value="english">English</option><option value="northern-sotho">Sepedi</option><option value="tswana">Setswana</option><option value="sotho">Sesotho</option><option value="tsonga">Xitsonga</option><option value="swati">siSwati</option><option value="venda">Tshivenda</option><option value="ndebele">isiNdebele</option></select></div><div class="form-group"><label for="edit-province">Province</label><select id="edit-province" class="form-select"><option value="">Select province</option><option value="eastern-cape">Eastern Cape</option><option value="free-state">Free State</option><option value="gauteng">Gauteng</option><option value="kwazulu-natal">KwaZulu-Natal</option><option value="limpopo">Limpopo</option><option value="mpumalanga">Mpumalanga</option><option value="north-west">North West</option><option value="northern-cape">Northern Cape</option><option value="western-cape">Western Cape</option></select></div><div class="form-group"><label for="edit-region">Region / City</label><div class="input-wrap has-icon-left"><i class="ti ti-map-pin"></i><input type="text" id="edit-region" placeholder="e.g. Soweto, Sandton"/></div></div><div class="form-group"><label for="edit-employment">Employment Status</label><select id="edit-employment" class="form-select"><option value="">Select status</option><option value="employed-full-time">Employed Full-time</option><option value="employed-part-time">Employed Part-time</option><option value="self-employed">Self-employed</option><option value="unemployed">Unemployed</option><option value="student">Student</option><option value="retired">Retired</option><option value="prefer-not-to-say">Prefer not to say</option></select></div><p class="auth-error" id="edit-error"></p><button class="btn-purple" onclick="saveProfile()">Save Changes</button><p class="auth-footer"><span onclick="navigateTo('profile')">Cancel</span></p></div></div>`;

PAGES['notifications'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('profile')"><i class="ti ti-arrow-left"></i></button><h1>Notifications</h1><p>Manage your notification preferences</p></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;"><div style="padding:16px 18px;border-bottom:1px solid var(--border);"><p style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Push Notifications</p><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">New Tasks Available</p><p style="font-size:12px;color:var(--text-muted);">Get notified when new tasks are added</p></div><label class="toggle-switch"><input type="checkbox" id="notif-tasks" checked onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">Data Earned</p><p style="font-size:12px;color:var(--text-muted);">Get notified when you earn data</p></div><label class="toggle-switch"><input type="checkbox" id="notif-earned" checked onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">Redemption Updates</p><p style="font-size:12px;color:var(--text-muted);">Get notified about redemption status</p></div><label class="toggle-switch"><input type="checkbox" id="notif-redeem" checked onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div><div style="display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">Referral Rewards</p><p style="font-size:12px;color:var(--text-muted);">Get notified when friends join</p></div><label class="toggle-switch"><input type="checkbox" id="notif-referral" checked onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div></div><div style="padding:16px 18px;"><p style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Email Notifications</p><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">Weekly Summary</p><p style="font-size:12px;color:var(--text-muted);">Receive weekly earnings summary</p></div><label class="toggle-switch"><input type="checkbox" id="notif-weekly" checked onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div><div style="display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:14px;font-weight:600;color:var(--text-primary);">Promotions &amp; Offers</p><p style="font-size:12px;color:var(--text-muted);">Receive special offers and promotions</p></div><label class="toggle-switch"><input type="checkbox" id="notif-promo" onchange="saveNotifSettings()"/><span class="toggle-slider"></span></label></div></div></div><div style="margin-top:12px;"><p style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">KwandaData Announcements</p><div id="user-announcements"><div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px;">No announcements yet</div></div></div></div></div>`;

PAGES['security'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('profile')"><i class="ti ti-arrow-left"></i></button><h1>Security</h1><p>Manage your account security</p></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;margin-bottom:12px;"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Change Password</p><div class="form-group"><label for="current-pw">Current Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="current-pw" placeholder="Enter current password"/><i class="ti ti-eye icon-right" onclick="togglePassword('current-pw', this)"></i></div></div><div class="form-group" style="margin-top:12px;"><label for="new-pw">New Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="new-pw" placeholder="Enter new password"/><i class="ti ti-eye icon-right" onclick="togglePassword('new-pw', this)"></i></div></div><div class="form-group" style="margin-top:12px;"><label for="confirm-new-pw">Confirm New Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="confirm-new-pw" placeholder="Repeat new password"/><i class="ti ti-eye icon-right" onclick="togglePassword('confirm-new-pw', this)"></i></div></div><p class="auth-error" id="pw-error" style="margin-top:8px;"></p><p id="pw-success" style="font-size:12px;color:var(--accent-green);text-align:center;min-height:16px;margin-top:4px;"></p><button class="btn-purple" style="margin-top:12px;" onclick="changePassword()">Update Password</button></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);">Two-Factor Authentication</p><p style="font-size:12px;color:var(--text-muted);margin-top:2px;">Add extra security to your account</p></div><label class="toggle-switch"><input type="checkbox" id="two-factor"/><span class="toggle-slider"></span></label></div></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Active Sessions</p><div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);"><div style="width:36px;height:36px;background:var(--bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--primary);"><i class="ti ti-device-laptop"></i></div><div style="flex:1;"><p style="font-size:13px;font-weight:600;color:var(--text-primary);">This Device</p><p style="font-size:11px;color:var(--text-muted);">Windows - Chrome - Active now</p></div><span style="font-size:11px;color:var(--accent-green);font-weight:600;">Current</span></div><button onclick="logout()" style="width:100%;margin-top:14px;padding:12px;border-radius:12px;background:#fff;border:1.5px solid var(--danger);color:var(--danger);font-size:14px;font-weight:600;cursor:pointer;">Sign Out All Devices</button></div></div></div>`;

PAGES['forgot-password'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('sign-in')"><i class="ti ti-arrow-left"></i></button><h1>Forgot Password</h1><p>Reset your KwandaData password</p></div><div class="auth-body"><div style="background:linear-gradient(135deg,#6c63ff,#2d1b8e);border-radius:18px;padding:20px;text-align:center;color:#fff;margin-bottom:16px;"><i class="ti ti-lock-open" style="font-size:40px;margin-bottom:10px;display:block;"></i><p style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.5;">Enter your registered email address and we will send you a link to reset your password.</p></div><div class="form-group"><label for="reset-email">Email Address</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="reset-email" placeholder="john@example.com"/></div></div><p class="auth-error" id="reset-error"></p><p id="reset-success" style="font-size:13px;color:var(--accent-green);text-align:center;min-height:16px;"></p><button class="btn-purple" onclick="handleForgotPassword()">Send Reset Link</button><p class="auth-footer"><span onclick="navigateTo('sign-in')">Back to Sign In</span></p></div></div>`;

PAGES['terms'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="history.back()"><i class="ti ti-arrow-left"></i></button><h1>Terms of Service</h1><p>Last updated: January 2025</p></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;display:flex;flex-direction:column;gap:16px;"><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">1. Acceptance of Terms</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">By registering and using KwandaData, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">2. Eligibility</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">You must be at least 18 years old and a resident of South Africa to use KwandaData.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">3. Earnings & Fees</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">All earnings are subject to a 15% administration fee. 30% of your net earnings are automatically allocated to your data balance. The remaining 55% goes to your wallet balance.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">4. Redemption Policy</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Wallet balances can be redeemed for airtime, data bundles, partner app credits, or cash. Minimum redemption amounts apply.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">5. Referral Programme</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Referral bonuses are credited once the referred user completes their first activity.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">6. Account Termination</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">KwandaData reserves the right to suspend or terminate accounts that violate these terms.</p></div></div></div></div>`;

PAGES['privacy'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="history.back()"><i class="ti ti-arrow-left"></i></button><h1>Privacy Policy</h1><p>Last updated: January 2025</p></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;display:flex;flex-direction:column;gap:16px;"><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">1. Information We Collect</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">We collect personal information including your name, email, phone, date of birth, gender, race, language, province, region, and employment status.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">2. How We Use Your Information</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Your information is used to manage your account, process earnings and redemptions, and improve our services. We do not sell your personal information.</p></div><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">3. Your Rights (POPIA)</p><p style="font-size:13px;color:var(--text-muted);line-height:1.6;">You have the right to access, correct, or delete your personal information. Contact us at privacy@kwandadata.co.za.</p></div></div></div></div>`;


// ── PART 3 - Paste this AFTER Part 2 ──

PAGES['admin'] = `<div class="admin-screen"><div class="admin-header"><button class="icon-btn"><i class="ti ti-menu-2"></i></button><h2>Admin Dashboard</h2><button class="icon-btn" style="position:relative;"><i class="ti ti-bell"></i><span class="notif-dot"></span></button></div><div class="page-scroll"><div class="stat-grid"><div class="stat-card"><div class="stat-icon blue"><i class="ti ti-users"></i></div><p class="stat-label">Total Users</p><p class="stat-value">0</p></div><div class="stat-card"><div class="stat-icon green"><i class="ti ti-user-check"></i></div><p class="stat-label">Active Today</p><p class="stat-value">0</p></div><div class="stat-card"><div class="stat-icon orange"><i class="ti ti-check"></i></div><p class="stat-label">Activities Completed</p><p class="stat-value">0</p></div></div><div class="chart-container"><div class="chart-header"><p class="chart-title">Platform Overview</p><select class="chart-period" onchange="updateChart(this.value)"><option value="week">This Week</option><option value="month">This Month</option><option value="year">This Year</option></select></div><canvas id="admin-chart" height="120"></canvas></div><div class="section" style="margin-top:12px;"><div class="section-header"><p class="section-title">Recent Activities</p><span class="section-link">View all</span></div><div class="admin-activity-list" id="admin-activity-list"></div></div></div><nav class="admin-nav"><button class="admin-nav-item active" onclick="navigateTo('admin')"><i class="ti ti-layout-dashboard"></i><span>Overview</span></button><button class="admin-nav-item" onclick="navigateTo('admin-users')"><i class="ti ti-users"></i><span>Users</span></button><button class="admin-nav-item" onclick="navigateTo('admin-activities')"><i class="ti ti-list-check"></i><span>Activities</span></button><button class="admin-nav-item" onclick="navigateTo('admin-wallets')"><i class="ti ti-wallet"></i><span>Wallets</span></button><button class="admin-nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button></nav></div>`;

PAGES['admin-users'] = `<div class="admin-screen"><div class="admin-header"><button class="icon-btn" onclick="navigateTo('admin')"><i class="ti ti-arrow-left"></i></button><h2>Users</h2><button class="icon-btn" onclick="initAdminUsers()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="padding:16px;"><div class="input-wrap has-icon-left" style="margin-bottom:8px;"><i class="ti ti-search"></i><input type="text" id="user-search" placeholder="Search users..." oninput="searchUsers(this.value)"/></div></div><div id="users-list" style="padding:0 16px;"></div></div><nav class="admin-nav"><button class="admin-nav-item" onclick="navigateTo('admin')"><i class="ti ti-layout-dashboard"></i><span>Overview</span></button><button class="admin-nav-item active"><i class="ti ti-users"></i><span>Users</span></button><button class="admin-nav-item" onclick="navigateTo('admin-activities')"><i class="ti ti-list-check"></i><span>Activities</span></button><button class="admin-nav-item" onclick="navigateTo('admin-wallets')"><i class="ti ti-wallet"></i><span>Wallets</span></button><button class="admin-nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button></nav></div>`;

PAGES['admin-activities'] = `<div class="admin-screen"><div class="admin-header"><button class="icon-btn" onclick="navigateTo('admin')"><i class="ti ti-arrow-left"></i></button><h2>Activities</h2><button class="icon-btn"><i class="ti ti-filter"></i></button></div><div class="page-scroll"><div style="padding:16px 16px 8px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;"><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="act-total" style="font-size:22px;font-weight:700;color:var(--primary);">0</p><p style="font-size:11px;color:var(--text-muted);">Total Activities</p></div><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="act-rate" style="font-size:22px;font-weight:700;color:var(--accent-green);">0%</p><p style="font-size:11px;color:var(--text-muted);">Completion Rate</p></div></div></div><div style="padding:0 16px;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Recent Activities</p><div id="activities-list"><div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;">No activities yet</div></div></div></div><nav class="admin-nav"><button class="admin-nav-item" onclick="navigateTo('admin')"><i class="ti ti-layout-dashboard"></i><span>Overview</span></button><button class="admin-nav-item" onclick="navigateTo('admin-users')"><i class="ti ti-users"></i><span>Users</span></button><button class="admin-nav-item active"><i class="ti ti-list-check"></i><span>Activities</span></button><button class="admin-nav-item" onclick="navigateTo('admin-wallets')"><i class="ti ti-wallet"></i><span>Wallets</span></button><button class="admin-nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button></nav></div>`;

PAGES['admin-wallets'] = `<div class="admin-screen"><div class="admin-header"><button class="icon-btn" onclick="navigateTo('admin')"><i class="ti ti-arrow-left"></i></button><h2>Wallets</h2><button class="icon-btn" onclick="initAdminWallets()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="padding:16px 16px 8px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;"><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="total-wallet" style="font-size:22px;font-weight:700;color:var(--primary);">R 0.00</p><p style="font-size:11px;color:var(--text-muted);">Total Distributed</p></div><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="total-data" style="font-size:22px;font-weight:700;color:var(--accent-orange);">R 0.00</p><p style="font-size:11px;color:var(--text-muted);">Total Data Balance</p></div></div></div><div style="padding:0 16px;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">User Wallets</p><div id="wallets-list" style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;"></div></div></div><nav class="admin-nav"><button class="admin-nav-item" onclick="navigateTo('admin')"><i class="ti ti-layout-dashboard"></i><span>Overview</span></button><button class="admin-nav-item" onclick="navigateTo('admin-users')"><i class="ti ti-users"></i><span>Users</span></button><button class="admin-nav-item" onclick="navigateTo('admin-activities')"><i class="ti ti-list-check"></i><span>Activities</span></button><button class="admin-nav-item active"><i class="ti ti-wallet"></i><span>Wallets</span></button><button class="admin-nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button></nav></div>`;

PAGES['donate'] = `<div class="redeem-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('home')"><i class="ti ti-arrow-left"></i></button><h2>Donate</h2></div><button class="icon-btn"><i class="ti ti-info-circle"></i></button></div><div class="page-scroll"><div style="background:linear-gradient(135deg,#ef4444,#b91c1c);margin:16px;border-radius:18px;padding:20px;display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:13px;color:rgba(255,255,255,0.85);margin-bottom:4px;">Your Balance</p><p class="donate-balance" style="font-size:28px;font-weight:700;color:#fff;">R 0.00</p></div><i class="ti ti-heart" style="font-size:40px;color:rgba(255,255,255,0.8);"></i></div><div class="section"><div class="section-header"><p class="section-title">Donate to a Contact Number</p></div></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;margin:0 16px 16px;"><div class="form-group" style="margin-bottom:14px;"><label style="font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Recipient Phone Number</label><div class="input-wrap has-icon-left"><i class="ti ti-phone"></i><input type="tel" id="donate-phone" placeholder="+27 000 000 0000" style="width:100%;padding:13px 14px 13px 40px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:14px;outline:none;box-sizing:border-box;"/></div></div><div class="form-group" style="margin-bottom:14px;"><label style="font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Amount (R)</label><div class="input-wrap has-icon-left"><i class="ti ti-currency-rand"></i><input type="number" id="donate-amount" placeholder="Enter amount" min="1" style="width:100%;padding:13px 14px 13px 40px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:14px;outline:none;box-sizing:border-box;"/></div></div><div class="form-group" style="margin-bottom:14px;"><label style="font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Message (Optional)</label><textarea id="donate-message" placeholder="Add a message to the recipient..." style="width:100%;padding:13px 14px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:14px;outline:none;box-sizing:border-box;resize:none;height:80px;font-family:sans-serif;"></textarea></div><p id="donate-error" style="font-size:12px;color:#ef4444;text-align:center;min-height:16px;margin-bottom:8px;"></p><button onclick="submitDonate()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Donate Now</button></div><div class="section"><div class="section-header"><p class="section-title">Share Referral Code</p></div></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;margin:0 16px 16px;"><p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;line-height:1.5;">Invite friends using your referral code and you both earn R 5.00 when they join!</p><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;"><p id="user-referral-code" style="font-size:24px;font-weight:700;color:var(--primary);letter-spacing:4px;flex:1;">...</p><button onclick="copyReferralCode()" style="padding:8px 16px;border-radius:10px;background:var(--primary);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;">Copy</button></div><button onclick="shareReferralCode()" style="width:100%;padding:13px;border-radius:30px;background:linear-gradient(135deg,#2d1b8e,#534AB7);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;"><i class="ti ti-share" style="margin-right:6px;"></i>Share Referral Code</button></div><div class="section"><div class="section-header"><p class="section-title">Recent Donations</p></div><div id="donate-history" style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;padding:4px 16px;margin:0 16px;"><div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px;">No donations yet</div></div></div><div style="height:20px;"></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('home')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('earn')"><i class="ti ti-database"></i><span>Earn</span></button><button class="nav-item" onclick="navigateTo('wallet')"><i class="ti ti-wallet"></i><span>Wallet</span></button><button class="nav-item" onclick="navigateTo('redeem')"><i class="ti ti-refresh"></i><span>Redeem</span></button><button class="nav-item active"><i class="ti ti-heart"></i><span>Donate</span></button></nav></div>`;

PAGES['advertiser-forgot-password'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-login')"><i class="ti ti-arrow-left"></i></button><h1>Forgot Password</h1><p>Reset your advertiser account password</p></div><div class="auth-body"><div style="background:#fff7ed;border-radius:18px;padding:20px;text-align:center;margin-bottom:16px;border:1px solid #fed7aa;"><i class="ti ti-lock-open" style="font-size:40px;color:#f97316;margin-bottom:10px;display:block;"></i><p style="font-size:13px;color:#c2410c;line-height:1.5;">Enter your registered business email and we will send you a reset link.</p></div><div class="form-group"><label for="adv-reset-email">Business Email</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="adv-reset-email" placeholder="company@example.com"/></div></div><p class="auth-error" id="adv-reset-error"></p><p id="adv-reset-success" style="font-size:13px;color:var(--accent-green);text-align:center;min-height:16px;"></p><button onclick="handleAdvertiserForgotPassword()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Send Reset Link</button><p class="auth-footer"><span onclick="navigateTo('advertiser-login')" style="color:#f97316;">Back to Sign In</span></p></div></div>`;

PAGES['advertiser-notifications'] = `<div class="auth-screen"><div class="auth-header"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-arrow-left"></i></button><h1>Notifications</h1><p>Campaign updates and alerts</p></div><div class="auth-body"><div id="adv-notifications-list"><div style="text-align:center;padding:32px;color:var(--text-muted);"><i class="ti ti-bell-off" style="font-size:40px;display:block;margin-bottom:12px;opacity:0.4;"></i><p style="font-size:14px;font-weight:600;">No notifications yet</p><p style="font-size:12px;margin-top:4px;">Campaign updates will appear here</p></div></div></div></div>`;

PAGES['advertiser-login'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('splash')"><i class="ti ti-arrow-left"></i></button><div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;"><div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">🏢</div><div><h1 style="font-size:22px;font-weight:700;color:#fff;margin:0;">Advertiser Login</h1><p style="font-size:13px;color:rgba(255,255,255,0.8);margin:0;">Access your campaign dashboard</p></div></div></div><div class="auth-body"><div style="background:#fff7ed;border-radius:12px;padding:12px 16px;border:1px solid #fed7aa;display:flex;align-items:center;gap:10px;"><i class="ti ti-building-store" style="font-size:20px;color:#f97316;"></i><p style="font-size:13px;color:#c2410c;margin:0;">Business Portal — Run campaigns, reach thousands of users.</p></div><div class="form-group"><label for="adv-login-email">Business Email</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="adv-login-email" placeholder="company@example.com"/></div></div><div class="form-group"><label for="adv-login-password">Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-login-password" placeholder="Enter your password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-login-password', this)"></i></div></div><p class="forgot-link" onclick="navigateTo('advertiser-forgot-password')" style="text-align:right;font-size:13px;color:#f97316;cursor:pointer;margin-bottom:8px;">Forgot Password?</p><p class="auth-error" id="adv-login-error"></p><button onclick="handleAdvertiserLogin()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Sign In</button><div class="auth-divider"><span></span><p>New to KwandaData?</p><span></span></div><button onclick="navigateTo('advertiser-register')" style="width:100%;padding:14px;border-radius:30px;background:#fff;color:#f97316;font-size:14px;font-weight:700;border:2px solid #f97316;cursor:pointer;">Create Business Account</button><p class="auth-footer">Back to <span onclick="navigateTo('sign-in')" style="color:var(--primary);">User Login</span></p></div></div>`;
PAGES['advertiser-register'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-login')"><i class="ti ti-arrow-left"></i></button><h1>Create Business Account</h1><p>Register your company on KwandaData</p></div><div class="auth-body"><div class="form-group"><label for="adv-company">Company Name</label><div class="input-wrap has-icon-left"><i class="ti ti-building"></i><input type="text" id="adv-company" placeholder="Enter your company name"/></div></div><div class="form-group"><label for="adv-industry">Industry</label><select id="adv-industry" class="form-select"><option value="">Select industry</option><option value="telecom">Telecommunications</option><option value="banking">Banking & Finance</option><option value="retail">Retail</option><option value="media">Media & Entertainment</option><option value="healthcare">Healthcare</option><option value="education">Education</option><option value="technology">Technology</option><option value="fmcg">FMCG</option><option value="other">Other</option></select></div><div class="form-group"><label for="adv-contact">Contact Person</label><div class="input-wrap has-icon-left"><i class="ti ti-user"></i><input type="text" id="adv-contact" placeholder="Full name"/></div></div><div class="form-group"><label for="adv-phone">Phone Number</label><div class="input-wrap has-icon-left"><i class="ti ti-phone"></i><input type="tel" id="adv-phone" placeholder="+27 000 000 0000"/></div></div><div class="form-group"><label for="adv-email">Business Email</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="adv-email" placeholder="company@example.com"/></div></div><div class="form-group"><label for="adv-reg-number">Company Registration Number</label><div class="input-wrap has-icon-left"><i class="ti ti-id-badge"></i><input type="text" id="adv-reg-number" placeholder="e.g. 2021/123456/07"/></div></div><div class="form-group"><label for="adv-password">Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-password" placeholder="Create a password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-password', this)"></i></div></div><div class="form-group"><label for="adv-confirm">Confirm Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-confirm" placeholder="Repeat your password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-confirm', this)"></i></div></div><div class="terms-row"><input type="checkbox" id="adv-terms" style="accent-color:#f97316;"/><label for="adv-terms">I agree to the <a href="#" onclick="navigateTo('terms')" style="color:#f97316;">Terms of Service</a> and <a href="#" onclick="navigateTo('privacy')" style="color:#f97316;">Privacy Policy</a></label></div><p class="auth-error" id="adv-reg-error"></p><button onclick="handleAdvertiserRegister()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Create Business Account</button><p class="auth-footer">Already registered? <span onclick="navigateTo('advertiser-login')" style="color:#f97316;">Sign In</span></p></div></div>`;

// ── CONTINUE TO PART 4 ──
PAGES['advertiser-register'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-login')"><i class="ti ti-arrow-left"></i></button><h1>Create Business Account</h1><p>Register your company on KwandaData</p></div><div class="auth-body"><div class="form-group"><label for="adv-company">Company Name</label><div class="input-wrap has-icon-left"><i class="ti ti-building"></i><input type="text" id="adv-company" placeholder="Enter your company name"/></div></div><div class="form-group"><label for="adv-industry">Industry</label><select id="adv-industry" class="form-select" onchange="toggleOtherIndustry(this.value)"><option value="">Select industry</option><option value="telecom">Telecommunications</option><option value="banking">Banking & Finance</option><option value="retail">Retail</option><option value="media">Media & Entertainment</option><option value="healthcare">Healthcare</option><option value="education">Education</option><option value="technology">Technology</option><option value="fmcg">FMCG</option><option value="other">Other</option></select><div id="other-industry-wrap" style="display:none;margin-top:8px;"><div class="input-wrap has-icon-left"><i class="ti ti-pencil"></i><input type="text" id="adv-industry-other" placeholder="Type your industry..."/></div></div></div><div class="form-group"><label for="adv-contact">Contact Person</label><div class="input-wrap has-icon-left"><i class="ti ti-user"></i><input type="text" id="adv-contact" placeholder="Full name"/></div></div><div class="form-group"><label for="adv-phone">Phone Number</label><div class="input-wrap has-icon-left"><i class="ti ti-phone"></i><input type="tel" id="adv-phone" placeholder="+27 000 000 0000"/></div></div><div class="form-group"><label for="adv-email">Business Email</label><div class="input-wrap has-icon-left"><i class="ti ti-mail"></i><input type="email" id="adv-email" placeholder="company@example.com"/></div></div><div class="form-group"><label for="adv-reg-number">Company Registration Number</label><div class="input-wrap has-icon-left"><i class="ti ti-id-badge"></i><input type="text" id="adv-reg-number" placeholder="e.g. 2021/123456/07"/></div></div><div class="form-group"><label for="adv-password">Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-password" placeholder="Create a password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-password', this)"></i></div></div><div class="form-group"><label for="adv-confirm">Confirm Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-confirm" placeholder="Repeat your password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-confirm', this)"></i></div></div><div class="terms-row"><input type="checkbox" id="adv-terms" style="accent-color:#f97316;"/><label for="adv-terms">I agree to the <a href="#" onclick="navigateTo('terms')" style="color:#f97316;">Terms of Service</a> and <a href="#" onclick="navigateTo('privacy')" style="color:#f97316;">Privacy Policy</a></label></div><p class="auth-error" id="adv-reg-error"></p><button onclick="handleAdvertiserRegister()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Create Business Account</button><p class="auth-footer">Already registered? <span onclick="navigateTo('advertiser-login')" style="color:#f97316;">Sign In</span></p></div></div>`;

function toggleOtherIndustry(val) {
  var wrap = document.getElementById('other-industry-wrap');
  if (wrap) wrap.style.display = val === 'other' ? 'block' : 'none';
}
window.toggleOtherIndustry = toggleOtherIndustry;
PAGES['advertiser-dashboard'] = `<div class="home-screen"><div class="home-header"><div><p class="home-greeting" id="adv-greeting">Good morning</p><h2 class="home-name" id="adv-company-name">Loading...</h2></div><div style="display:flex;align-items:center;gap:8px;"><button class="notif-btn" onclick="navigateTo('advertiser-notifications')"><i class="ti ti-bell"></i></button><button onclick="advertiserLogout()" style="background:#fee2e2;border:none;border-radius:20px;padding:8px 12px;display:flex;align-items:center;gap:5px;cursor:pointer;"><i class="ti ti-logout" style="color:#ef4444;font-size:15px;"></i><span style="color:#ef4444;font-size:12px;font-weight:600;">Log Out</span></button></div></div><div class="page-scroll"><div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:18px;padding:20px 22px;margin:16px;display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:12px;color:rgba(255,255,255,0.75);margin-bottom:4px;">Campaign Budget</p><p id="adv-budget" style="font-size:30px;font-weight:700;color:#fff;">R 0.00</p><p style="font-size:12px;color:rgba(255,255,255,0.7);">Available Balance</p></div><div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;"><i class="ti ti-speakerphone"></i></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 16px 16px;"><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="adv-total-campaigns" style="font-size:24px;font-weight:700;color:#f97316;">0</p><p style="font-size:12px;color:var(--text-muted);">Total Campaigns</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="adv-active-campaigns" style="font-size:24px;font-weight:700;color:var(--accent-green);">0</p><p style="font-size:12px;color:var(--text-muted);">Active Campaigns</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="adv-total-completions" style="font-size:24px;font-weight:700;color:var(--primary);">0</p><p style="font-size:12px;color:var(--text-muted);">Total Completions</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="adv-total-spent" style="font-size:24px;font-weight:700;color:#ef4444;">R 0.00</p><p style="font-size:12px;color:var(--text-muted);">Total Spent</p></div></div><div class="section"><p class="section-title">Quick Actions</p><div class="quick-actions"><div class="action-card" onclick="navigateTo('advertiser-create-campaign')"><div class="action-icon orange"><i class="ti ti-plus"></i></div><h3>New Campaign</h3><p>Create a new campaign</p></div><div class="action-card" onclick="navigateTo('advertiser-campaigns')"><div class="action-icon purple"><i class="ti ti-speakerphone"></i></div><h3>My Campaigns</h3><p>View all campaigns</p></div><div class="action-card" onclick="navigateTo('advertiser-analytics')"><div class="action-icon blue"><i class="ti ti-chart-bar"></i></div><h3>Analytics</h3><p>View performance</p></div><div class="action-card" onclick="navigateTo('advertiser-billing')"><div class="action-icon green"><i class="ti ti-credit-card"></i></div><h3>Top Up</h3><p>Manage your budget</p></div></div></div><div class="section"><div class="section-header"><p class="section-title">Recent Campaigns</p><span class="section-link" onclick="navigateTo('advertiser-campaigns')" style="color:#f97316;">View all ›</span></div><div id="adv-recent-campaigns"><div style="text-align:center;padding:24px;color:var(--text-muted);"><i class="ti ti-speakerphone" style="font-size:32px;display:block;margin-bottom:8px;opacity:0.4;"></i><p style="font-size:13px;">No campaigns yet</p></div></div></div></div><nav class="bottom-nav"><button class="nav-item active" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('advertiser-campaigns')"><i class="ti ti-speakerphone"></i><span>Campaigns</span></button><button class="nav-item" onclick="navigateTo('advertiser-create-campaign')"><i class="ti ti-plus"></i><span>Create</span></button><button class="nav-item" onclick="navigateTo('advertiser-analytics')"><i class="ti ti-chart-bar"></i><span>Analytics</span></button><button class="nav-item" onclick="navigateTo('advertiser-profile')"><i class="ti ti-user"></i><span>Profile</span></button></nav></div>`;

PAGES['advertiser-create-campaign'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-arrow-left"></i></button><h1>Create Campaign</h1><p>Set up your new campaign</p></div><div class="auth-body"><div class="form-group"><label for="camp-name">Campaign Name</label><div class="input-wrap has-icon-left"><i class="ti ti-speakerphone"></i><input type="text" id="camp-name" placeholder="Enter your campaign name"/></div></div><div class="form-group"><label for="camp-type">Activity Type</label><select id="camp-type" class="form-select" onchange="updateCampPrice()"><option value="">Select activity type</option><option value="survey">Survey — R 15.00 per completion</option><option value="video">Watch Video — R 5.00 per completion</option><option value="quiz">Quiz — R 8.00 per completion</option><option value="download">Download App — R 20.00 per completion</option><option value="signup">Sign Up / Register — R 25.00 per completion</option></select></div><div class="form-group"><label for="camp-description">Campaign Description</label><textarea id="camp-description" placeholder="Describe what users need to do..." style="width:100%;padding:13px 14px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:14px;outline:none;box-sizing:border-box;resize:none;height:80px;font-family:sans-serif;"></textarea></div><div class="form-group"><label for="camp-budget">Total Budget (R)</label><div class="input-wrap has-icon-left"><i class="ti ti-currency-rand"></i><input type="number" id="camp-budget" placeholder="Minimum R 500" min="500" oninput="updateCampPrice()"/></div></div><div style="background:#fff7ed;border-radius:12px;padding:14px;border:1.5px solid #fed7aa;margin-bottom:4px;"><p style="font-size:11px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Pricing Summary</p><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><p style="font-size:13px;color:var(--text-muted);">Price per completion</p><p id="camp-price-display" style="font-size:13px;font-weight:700;color:var(--primary);">Select activity type</p></div><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><p style="font-size:13px;color:var(--text-muted);">Estimated completions</p><p id="camp-completions" style="font-size:13px;font-weight:700;color:var(--primary);">—</p></div><div style="border-top:1px solid #fed7aa;padding-top:8px;display:flex;justify-content:space-between;"><p style="font-size:13px;font-weight:700;color:var(--text-primary);">Total Cost</p><p id="camp-total-cost" style="font-size:13px;font-weight:700;color:#f97316;">—</p></div></div><div class="name-row"><div class="form-group"><label for="camp-start">Start Date</label><div class="input-wrap has-icon-left"><i class="ti ti-calendar"></i><input type="date" id="camp-start"/></div></div><div class="form-group"><label for="camp-end">End Date</label><div class="input-wrap has-icon-left"><i class="ti ti-calendar"></i><input type="date" id="camp-end"/></div></div></div><div class="form-group"><label for="camp-target">Target Users</label><select id="camp-target" class="form-select"><option value="all">National</option><option value="gauteng">Gauteng</option><option value="western-cape">Western Cape</option><option value="kwazulu-natal">KwaZulu-Natal</option><option value="eastern-cape">Eastern Cape</option><option value="limpopo">Limpopo</option><option value="mpumalanga">Mpumalanga</option><option value="north-west">North West</option><option value="northern-cape">Northern Cape</option><option value="free-state">Free State</option></select></div><p class="auth-error" id="camp-error"></p><button onclick="submitCampaign()" style="width:100%;padding:15px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;">Submit for Approval</button><p style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:8px;">Your campaign will be reviewed before going live</p></div></div>`;
PAGES['advertiser-campaigns'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-arrow-left"></i></button><h2>My Campaigns</h2></div><button class="icon-btn" onclick="initAdvertiserCampaigns()"><i class="ti ti-refresh"></i></button></div><div style="display:flex;gap:8px;padding:12px 16px;background:#fff;overflow-x:auto;border-bottom:1px solid var(--border);"><button onclick="filterCampaigns('all')" id="filter-all" style="padding:7px 16px;border-radius:20px;background:#f97316;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">All</button><button onclick="filterCampaigns('pending')" id="filter-pending" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Pending</button><button onclick="filterCampaigns('active')" id="filter-active" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Active</button><button onclick="filterCampaigns('paused')" id="filter-paused" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Paused</button><button onclick="filterCampaigns('completed')" id="filter-completed" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Completed</button></div><div class="page-scroll"><div id="campaigns-list" style="padding:16px;display:flex;flex-direction:column;gap:12px;"></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item active"><i class="ti ti-speakerphone"></i><span>Campaigns</span></button><button class="nav-item" onclick="navigateTo('advertiser-create-campaign')"><i class="ti ti-plus"></i><span>Create</span></button><button class="nav-item" onclick="navigateTo('advertiser-analytics')"><i class="ti ti-chart-bar"></i><span>Analytics</span></button><button class="nav-item" onclick="navigateTo('advertiser-profile')"><i class="ti ti-user"></i><span>Profile</span></button></nav></div>`;

PAGES['advertiser-analytics'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-arrow-left"></i></button><h2>Analytics</h2></div><button class="icon-btn" onclick="initAdvertiserAnalytics()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px 16px 0;"><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);"><div style="width:36px;height:36px;border-radius:10px;background:#fff7ed;display:flex;align-items:center;justify-content:center;font-size:18px;color:#f97316;margin-bottom:8px;"><i class="ti ti-eye"></i></div><p style="font-size:11px;color:var(--text-muted);">Total Impressions</p><p id="analytics-impressions" style="font-size:22px;font-weight:700;color:var(--text-primary);">0</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);"><div style="width:36px;height:36px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:18px;color:#22c55e;margin-bottom:8px;"><i class="ti ti-check"></i></div><p style="font-size:11px;color:var(--text-muted);">Completions</p><p id="analytics-completions" style="font-size:22px;font-weight:700;color:var(--text-primary);">0</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);"><div style="width:36px;height:36px;border-radius:10px;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--primary);margin-bottom:8px;"><i class="ti ti-click"></i></div><p style="font-size:11px;color:var(--text-muted);">Click-Through Rate</p><p id="analytics-rate" style="font-size:22px;font-weight:700;color:var(--text-primary);">0%</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);"><div style="width:36px;height:36px;border-radius:10px;background:#fee2e2;display:flex;align-items:center;justify-content:center;font-size:18px;color:#ef4444;margin-bottom:8px;"><i class="ti ti-currency-rand"></i></div><p style="font-size:11px;color:var(--text-muted);">Budget Spent</p><p id="analytics-spent" style="font-size:22px;font-weight:700;color:var(--text-primary);">R 0.00</p></div></div><div style="padding:20px 16px 0;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Audience Reach</p><p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Who your campaigns are reaching across the platform</p><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;"><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="analytics-dau" style="font-size:18px;font-weight:700;color:var(--text-primary);">0</p><p style="font-size:10px;color:var(--text-muted);">Daily Active</p></div><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="analytics-mau" style="font-size:18px;font-weight:700;color:var(--text-primary);">0</p><p style="font-size:10px;color:var(--text-muted);">Monthly Active</p></div><div style="background:#fff;border-radius:12px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="analytics-total-users" style="font-size:18px;font-weight:700;color:var(--text-primary);">0</p><p style="font-size:10px;color:var(--text-muted);">Total Users</p></div></div><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><p style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:10px;">User Demographics</p><div id="analytics-demographics"></div></div></div><div style="padding:20px 16px 0;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Engagement</p><p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">How often and how long users engage</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div style="background:#fff;border-radius:12px;padding:14px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:9px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:16px;color:#3b82f6;margin-bottom:8px;"><i class="ti ti-repeat"></i></div><p style="font-size:11px;color:var(--text-muted);">Session Frequency</p><p id="analytics-freq" style="font-size:15px;font-weight:700;color:var(--text-primary);">—</p></div><div style="background:#fff;border-radius:12px;padding:14px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:9px;background:#fff7ed;display:flex;align-items:center;justify-content:center;font-size:16px;color:#f97316;margin-bottom:8px;"><i class="ti ti-clock"></i></div><p style="font-size:11px;color:var(--text-muted);">Avg. Session Length</p><p id="analytics-duration" style="font-size:15px;font-weight:700;color:var(--text-primary);">—</p></div></div><div style="background:#fff;border-radius:12px;padding:14px;border:1px solid var(--border);margin-top:10px;"><div style="display:flex;justify-content:space-between;align-items:center;"><div><p style="font-size:11px;color:var(--text-muted);">Retention Rate</p><p id="analytics-retention" style="font-size:20px;font-weight:700;color:var(--text-primary);">—</p></div><div style="width:36px;height:36px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:18px;color:#22c55e;"><i class="ti ti-user-check"></i></div></div><p id="analytics-retention-sub" style="font-size:11px;color:var(--text-muted);margin-top:6px;">No activity recorded yet</p></div></div><div style="background:#fff;border-radius:14px;margin:20px 16px 0;padding:16px;border:1px solid var(--border);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;"><p style="font-size:14px;font-weight:700;color:var(--text-primary);">Performance Overview</p><select onchange="updateAdvChart(this.value)" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border);font-size:12px;color:var(--text-muted);background:#fff;outline:none;"><option value="week">This Week</option><option value="month">This Month</option></select></div><canvas id="adv-chart" height="120"></canvas></div><div style="padding:20px 16px 0;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Campaign Breakdown</p><div id="analytics-breakdown"></div></div><div style="padding:20px 16px 16px;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Attribution</p><p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Which campaigns drove new users to KwandaData</p><div id="analytics-attribution"></div></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('advertiser-campaigns')"><i class="ti ti-speakerphone"></i><span>Campaigns</span></button><button class="nav-item" onclick="navigateTo('advertiser-create-campaign')"><i class="ti ti-plus"></i><span>Create</span></button><button class="nav-item active"><i class="ti ti-chart-bar"></i><span>Analytics</span></button><button class="nav-item" onclick="navigateTo('advertiser-profile')"><i class="ti ti-user"></i><span>Profile</span></button></nav></div>`;

PAGES['advertiser-billing'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-profile')"><i class="ti ti-arrow-left"></i></button><h1>Top Up</h1><p>Manage your campaign budget</p></div><div class="auth-body"><div style="background:linear-gradient(135deg,#f97316,#ea580c);border-radius:18px;padding:20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><div><p style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:4px;">Available Budget</p><p id="billing-balance" style="font-size:30px;font-weight:700;color:#fff;">R 0.00</p><p style="font-size:11px;color:rgba(255,255,255,0.7);">Ready for campaigns</p></div><div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;"><i class="ti ti-credit-card"></i></div></div><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Top Up Budget</p><p style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Quick Select</p><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;"><button onclick="setTopUpAmount(500)" style="padding:10px;border-radius:10px;background:#fff7ed;border:1.5px solid #f97316;color:#f97316;font-size:13px;font-weight:700;cursor:pointer;">R 500</button><button onclick="setTopUpAmount(1000)" style="padding:10px;border-radius:10px;background:#fff;border:1.5px solid var(--border);color:var(--text-muted);font-size:13px;font-weight:700;cursor:pointer;">R 1,000</button><button onclick="setTopUpAmount(5000)" style="padding:10px;border-radius:10px;background:#fff;border:1.5px solid var(--border);color:var(--text-muted);font-size:13px;font-weight:700;cursor:pointer;">R 5,000</button></div><div class="form-group"><label for="topup-amount">Custom Amount (R)</label><div class="input-wrap has-icon-left"><i class="ti ti-currency-rand"></i><input type="number" id="topup-amount" placeholder="Enter amount" min="500"/></div></div><p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Minimum top-up: R 500.00</p><button onclick="handleTopUp()" style="width:100%;padding:14px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;">Top Up Now</button></div><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Top Up History</p><div id="billing-history"><div style="text-align:center;padding:16px;color:var(--text-muted);"><i class="ti ti-receipt" style="font-size:32px;display:block;margin-bottom:8px;opacity:0.4;"></i><p style="font-size:13px;">No top-up history yet</p></div></div></div></div></div>`;

PAGES['advertiser-profile'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-arrow-left"></i></button><div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div id="adv-profile-avatar" style="width:72px;height:72px;border-radius:18px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:30px;color:#fff;font-weight:700;">?</div><h2 id="adv-profile-name" style="font-size:18px;font-weight:700;color:#fff;margin:0;">Loading...</h2><p id="adv-profile-email" style="font-size:13px;color:rgba(255,255,255,0.8);margin:0;">...</p><span style="font-size:11px;font-weight:600;color:#f97316;background:#fff;padding:4px 14px;border-radius:20px;">Advertiser Account</span></div></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;margin-bottom:12px;"><div style="padding:12px 16px;background:#fff7ed;border-bottom:1px solid var(--border);"><p style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">Company Information</p></div><div style="padding:14px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--border);"><p style="font-size:13px;color:var(--text-muted);">Industry</p><p id="adv-profile-industry" style="font-size:13px;font-weight:600;color:var(--text-primary);">—</p></div><div style="padding:14px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--border);"><p style="font-size:13px;color:var(--text-muted);">Contact Person</p><p id="adv-profile-contact" style="font-size:13px;font-weight:600;color:var(--text-primary);">—</p></div><div style="padding:14px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--border);"><p style="font-size:13px;color:var(--text-muted);">Phone</p><p id="adv-profile-phone" style="font-size:13px;font-weight:600;color:var(--text-primary);">—</p></div><div style="padding:14px 16px;display:flex;justify-content:space-between;"><p style="font-size:13px;color:var(--text-muted);">Reg Number</p><p id="adv-profile-reg" style="font-size:13px;font-weight:600;color:var(--text-primary);">—</p></div></div><div style="background:#fff;border-radius:14px;border:1px solid var(--border);overflow:hidden;"><div onclick="navigateTo('advertiser-billing')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-credit-card" style="font-size:18px;color:#f97316;"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Top Up & Budget</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="navigateTo('advertiser-security')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-shield-lock" style="font-size:18px;color:#f97316;"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Security</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="navigateTo('terms')" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-file-text" style="font-size:18px;color:#f97316;"></i><span style="font-size:14px;font-weight:600;color:var(--text-primary);">Terms of Service</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div><div onclick="advertiserLogout()" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ti-logout" style="font-size:18px;color:#ef4444;"></i><span style="font-size:14px;font-weight:600;color:#ef4444;">Sign Out</span></div><i class="ti ti-chevron-right" style="color:#ccc;"></i></div></div></div><nav class="bottom-nav"><button class="nav-item" onclick="navigateTo('advertiser-dashboard')"><i class="ti ti-home"></i><span>Home</span></button><button class="nav-item" onclick="navigateTo('advertiser-campaigns')"><i class="ti ti-speakerphone"></i><span>Campaigns</span></button><button class="nav-item" onclick="navigateTo('advertiser-create-campaign')"><i class="ti ti-plus"></i><span>Create</span></button><button class="nav-item" onclick="navigateTo('advertiser-analytics')"><i class="ti ti-chart-bar"></i><span>Analytics</span></button><button class="nav-item active"><i class="ti ti-user"></i><span>Profile</span></button></nav></div>`;

PAGES['advertiser-security'] = `<div class="auth-screen"><div class="auth-header" style="background:linear-gradient(160deg,#7c2d12 0%,#ea580c 100%);"><div class="auth-header-bubble auth-header-bubble-1"></div><div class="auth-header-bubble auth-header-bubble-2"></div><button class="auth-back-btn" onclick="navigateTo('advertiser-profile')"><i class="ti ti-arrow-left"></i></button><h1>Security</h1><p>Change your account password</p></div><div class="auth-body"><div style="background:#fff;border-radius:14px;border:1px solid var(--border);padding:16px 18px;margin-bottom:12px;"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Change Password</p><div class="form-group"><label for="adv-current-pw">Current Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-current-pw" placeholder="Enter current password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-current-pw', this)"></i></div></div><div class="form-group" style="margin-top:12px;"><label for="adv-new-pw">New Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-new-pw" placeholder="Enter new password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-new-pw', this)"></i></div></div><div class="form-group" style="margin-top:12px;"><label for="adv-confirm-pw">Confirm New Password</label><div class="input-wrap has-icon-both"><i class="ti ti-lock"></i><input type="password" id="adv-confirm-pw" placeholder="Repeat new password"/><i class="ti ti-eye icon-right" onclick="togglePassword('adv-confirm-pw', this)"></i></div></div><p class="auth-error" id="adv-pw-error" style="margin-top:8px;"></p><p id="adv-pw-success" style="font-size:12px;color:var(--accent-green);text-align:center;min-height:16px;margin-top:4px;"></p><button onclick="changeAdvertiserPassword()" style="width:100%;margin-top:12px;padding:13px;border-radius:30px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;">Update Password</button></div></div></div>`;

// ── PART 5 - Paste this AFTER Part 4 ──

// ══════════════════════════════════════
// ADMIN PANEL — Campaigns card fixed to go to admin-campaigns-mgmt
// ══════════════════════════════════════
PAGES['admin-panel'] = `<div class="home-screen"><div class="home-header"><div><p class="home-greeting">Admin Panel</p><h2 class="home-name">KwandaData Admin</h2></div><button onclick="advertiserLogout()" style="background:#fee2e2;border:none;border-radius:20px;padding:8px 12px;display:flex;align-items:center;gap:5px;cursor:pointer;"><i class="ti ti-logout" style="color:#ef4444;font-size:15px;"></i><span style="color:#ef4444;font-size:12px;font-weight:600;">Log Out</span></button></div><div class="page-scroll"><div style="padding:16px 16px 0;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;"><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="admin-panel-total" style="font-size:24px;font-weight:700;color:var(--primary);">0</p><p style="font-size:12px;color:var(--text-muted);">Total Campaigns</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="admin-panel-pending" style="font-size:24px;font-weight:700;color:#f97316;">0</p><p style="font-size:12px;color:var(--text-muted);">Pending Approval</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="admin-panel-active" style="font-size:24px;font-weight:700;color:#22c55e;">0</p><p style="font-size:12px;color:var(--text-muted);">Active Campaigns</p></div><div style="background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);text-align:center;"><p id="admin-panel-advertisers" style="font-size:24px;font-weight:700;color:#3b82f6;">0</p><p style="font-size:12px;color:var(--text-muted);">Total Advertisers</p></div></div></div><div class="section" style="padding:0 16px;"><p class="section-title" style="margin-bottom:12px;">Admin Controls</p><div class="quick-actions"><div class="action-card" onclick="navigateTo('admin-users-mgmt')"><div class="action-icon blue"><i class="ti ti-users"></i></div><h3>User Management</h3><p>View, suspend, adjust users</p></div><div class="action-card" onclick="navigateTo('admin-campaigns-mgmt')"><div class="action-icon orange"><i class="ti ti-speakerphone"></i></div><h3>Campaigns</h3><p>Approve or reject campaigns</p></div><div class="action-card" onclick="navigateTo('admin-advertisers-mgmt')"><div class="action-icon green"><i class="ti ti-building-store"></i></div><h3>Advertisers</h3><p>Manage advertiser accounts</p></div><div class="action-card" onclick="navigateTo('admin-analytics')"><div class="action-icon purple"><i class="ti ti-chart-bar"></i></div><h3>Analytics</h3><p>Platform-wide stats</p></div><div class="action-card" onclick="navigateTo('admin-announcements')"><div class="action-icon blue"><i class="ti ti-speakerphone"></i></div><h3>Announcements</h3><p>Notify users and advertisers</p></div><div class="action-card" onclick="navigateTo('admin-settings')"><div class="action-icon orange"><i class="ti ti-settings"></i></div><h3>App Settings</h3><p>Pricing, fees and maintenance</p></div><div class="action-card" onclick="navigateTo('admin-financial')"><div class="action-icon green"><i class="ti ti-cash"></i></div><h3>Financial</h3><p>Fees, payouts and export</p></div></div></div></div></div>`;

// ══════════════════════════════════════
// NEW PAGE: admin-campaigns-mgmt
// ══════════════════════════════════════
PAGES['admin-campaigns-mgmt'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>Campaign Management</h2></div><button class="icon-btn" onclick="initAdminCampaignsMgmt()"><i class="ti ti-refresh"></i></button></div><div style="display:flex;gap:8px;padding:12px 16px;background:#fff;overflow-x:auto;border-bottom:1px solid var(--border);"><button onclick="filterAdminCampaigns('pending')" id="admin-filter-pending" style="padding:7px 16px;border-radius:20px;background:#f97316;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Pending</button><button onclick="filterAdminCampaigns('active')" id="admin-filter-active" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Active</button><button onclick="filterAdminCampaigns('all')" id="admin-filter-all" style="padding:7px 16px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">All</button></div><div class="page-scroll"><div style="padding:16px 16px 0;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;"><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="camp-mgmt-total" style="font-size:22px;font-weight:700;color:var(--primary);">0</p><p style="font-size:11px;color:var(--text-muted);">Total Campaigns</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="camp-mgmt-pending" style="font-size:22px;font-weight:700;color:#f97316;">0</p><p style="font-size:11px;color:var(--text-muted);">Pending Approval</p></div></div></div><div id="admin-campaigns-list" style="padding:0 16px 16px;"></div></div></div>`;

PAGES['admin-users-mgmt'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>User Management</h2></div><button class="icon-btn" onclick="initAdminUsersMgmt()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="padding:16px 16px 0;"><div class="input-wrap has-icon-left" style="margin-bottom:14px;"><i class="ti ti-search"></i><input type="text" id="user-search-admin" placeholder="Search by name or email..." oninput="searchAdminUsers(this.value)"/></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;"><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="admin-total-users" style="font-size:22px;font-weight:700;color:var(--primary);">0</p><p style="font-size:11px;color:var(--text-muted);">Total Users</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="admin-active-users" style="font-size:22px;font-weight:700;color:#22c55e;">0</p><p style="font-size:11px;color:var(--text-muted);">Active</p></div></div></div><div id="admin-users-list" style="padding:0 16px 16px;"></div></div></div>`;

PAGES['admin-advertisers-mgmt'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>Advertiser Management</h2></div><button class="icon-btn" onclick="initAdminAdvertisersMgmt()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="padding:16px 16px 0;"><div class="input-wrap has-icon-left" style="margin-bottom:14px;"><i class="ti ti-search"></i><input type="text" id="adv-search-admin" placeholder="Search by company or email..." oninput="searchAdminAdvertisers(this.value)"/></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;"><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="admin-total-advs" style="font-size:22px;font-weight:700;color:var(--primary);">0</p><p style="font-size:11px;color:var(--text-muted);">Total Advertisers</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="admin-active-advs" style="font-size:22px;font-weight:700;color:#22c55e;">0</p><p style="font-size:11px;color:var(--text-muted);">Active</p></div></div></div><div id="admin-advertisers-list" style="padding:0 16px 16px;"></div></div></div>`;

PAGES['admin-announcements'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>Announcements</h2></div></div><div class="page-scroll"><div style="padding:16px;"><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);margin-bottom:16px;"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Send New Announcement</p><div style="margin-bottom:10px;"><p style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Send To</p><div style="display:flex;gap:8px;"><button onclick="selectAudience('users')" id="aud-users" style="flex:1;padding:8px;border-radius:10px;background:var(--primary);color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer;">Users</button><button onclick="selectAudience('advertisers')" id="aud-advertisers" style="flex:1;padding:8px;border-radius:10px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;">Advertisers</button><button onclick="selectAudience('all')" id="aud-all" style="flex:1;padding:8px;border-radius:10px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;">All</button></div></div><div class="form-group"><label for="ann-title">Title</label><div class="input-wrap has-icon-left"><i class="ti ti-speakerphone"></i><input type="text" id="ann-title" placeholder="Announcement title..."/></div></div><div class="form-group"><label for="ann-message">Message</label><textarea id="ann-message" placeholder="Write your announcement..." style="width:100%;padding:13px 14px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:14px;outline:none;box-sizing:border-box;resize:none;height:90px;font-family:sans-serif;"></textarea></div><p class="auth-error" id="ann-error"></p><button onclick="sendAnnouncement()" style="width:100%;padding:13px;border-radius:30px;background:linear-gradient(135deg,var(--primary),#2d1b8e);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;">Send Announcement</button></div><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Past Announcements</p><div id="announcements-list"></div></div></div></div>`;

PAGES['admin-financial'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>Financial Control</h2></div><button class="icon-btn" onclick="initAdminFinancial()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px 16px 0;"><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="fin-total-fees" style="font-size:20px;font-weight:700;color:var(--primary);">R 0.00</p><p style="font-size:11px;color:var(--text-muted);">Total Admin Fees</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="fin-adv-spend" style="font-size:20px;font-weight:700;color:#f97316;">R 0.00</p><p style="font-size:11px;color:var(--text-muted);">Advertiser Spend</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="fin-user-wallets" style="font-size:20px;font-weight:700;color:#22c55e;">R 0.00</p><p style="font-size:11px;color:var(--text-muted);">User Wallets</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);text-align:center;"><p id="fin-data-balances" style="font-size:20px;font-weight:700;color:#3b82f6;">0 MB</p><p style="font-size:11px;color:var(--text-muted);">Data Balances</p></div></div><div style="padding:16px;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Advertiser Statements</p><div id="fin-transactions"></div></div><div style="padding:0 16px 8px;display:flex;gap:10px;"><button onclick="exportFinancialSummary()" style="flex:1;padding:11px;border-radius:20px;background:linear-gradient(135deg,var(--primary),#2d1b8e);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;"><i class="ti ti-download" style="margin-right:5px;"></i>Export Financial Summary</button></div><div style="padding:16px;"><p style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Users By Region</p><div id="fin-users-region"></div></div><div style="padding:0 16px 24px;"><button onclick="exportUsersByRegion()" style="width:100%;padding:11px;border-radius:20px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;"><i class="ti ti-download" style="margin-right:5px;"></i>Export Users By Region</button></div></div></div>`;

var selectedAudience = 'users';

function selectAudience(type) {
  selectedAudience = type;
  var ids = ['users', 'advertisers', 'all'];
  ids.forEach(function(id) {
    var btn = document.getElementById('aud-' + id);
    if (!btn) return;
    if (id === type) {
      btn.style.background = 'var(--primary)';
      btn.style.color = '#fff';
      btn.style.border = 'none';
    } else {
      btn.style.background = '#fff';
      btn.style.color = 'var(--text-muted)';
      btn.style.border = '1px solid var(--border)';
    }
  });
}

function sendAnnouncement() {
  var title   = document.getElementById('ann-title')   ? document.getElementById('ann-title').value.trim()   : '';
  var message = document.getElementById('ann-message') ? document.getElementById('ann-message').value.trim() : '';
  var errorEl = document.getElementById('ann-error');
  if (errorEl) errorEl.textContent = '';
  if (!title)   { if (errorEl) errorEl.textContent = 'Please enter a title.';   return; }
  if (!message) { if (errorEl) errorEl.textContent = 'Please enter a message.'; return; }

  var announcement = {
    id: Date.now().toString(),
    title: title,
    message: message,
    audience: selectedAudience,
    date: new Date().toLocaleString('en-ZA'),
    sentBy: 'Admin'
  };

  var stored = JSON.parse(localStorage.getItem('kwanda_announcements') || '[]');
  stored.unshift(announcement);
  localStorage.setItem('kwanda_announcements', JSON.stringify(stored));

  document.getElementById('ann-title').value   = '';
  document.getElementById('ann-message').value = '';
  selectAudience('users');

  loadAnnouncements();
  alert('✅ Announcement sent to: ' + (selectedAudience === 'all' ? 'Everyone' : selectedAudience));
}

function loadAnnouncements() {
  var container = document.getElementById('announcements-list');
  if (!container) return;
  var stored = JSON.parse(localStorage.getItem('kwanda_announcements') || '[]');
  if (stored.length === 0) {
    container.innerHTML = "<div style='text-align:center;padding:24px;color:var(--text-muted);'><i class='ti ti-bell-off' style='font-size:32px;display:block;margin-bottom:8px;opacity:0.4;'></i><p style='font-size:13px;'>No announcements yet</p></div>";
    return;
  }
  container.innerHTML = stored.map(function(a) {
    var audienceLabel = a.audience === 'all' ? 'Everyone' : a.audience === 'users' ? 'Users' : 'Advertisers';
    return "<div style='background:#fff;border-radius:14px;padding:14px;border:1px solid var(--border);margin-bottom:10px;'><div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;'><p style='font-size:14px;font-weight:700;color:var(--text-primary);'>" + a.title + "</p><span style='font-size:11px;background:#ede9fe;color:#2d1b8e;padding:2px 8px;border-radius:10px;font-weight:600;white-space:nowrap;'>" + audienceLabel + "</span></div><p style='font-size:13px;color:var(--text-muted);margin-bottom:6px;'>" + a.message + "</p><p style='font-size:11px;color:var(--text-muted);'>" + a.date + "</p></div>";
  }).join('');
}

function initAdminAnnouncements() {
  selectedAudience = 'users';
  loadAnnouncements();
}

window.selectAudience        = selectAudience;
window.sendAnnouncement      = sendAnnouncement;
window.loadAnnouncements     = loadAnnouncements;
window.initAdminAnnouncements = initAdminAnnouncements;
PAGES['admin-settings'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>App Settings</h2></div><button class="icon-btn" onclick="initAdminSettings()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="padding:16px;display:flex;flex-direction:column;gap:14px;"><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Campaign Pricing (R per completion)</p><div style="display:flex;flex-direction:column;gap:10px;"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Survey</label><input type="number" id="price-survey" value="15" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Watch Video</label><input type="number" id="price-video" value="5" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Quiz</label><input type="number" id="price-quiz" value="8" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Download App</label><input type="number" id="price-download" value="20" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Sign Up</label><input type="number" id="price-signup" value="25" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div></div><button onclick="savePricing()" style="width:100%;margin-top:12px;padding:11px;border-radius:30px;background:linear-gradient(135deg,var(--primary),#2d1b8e);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;">Save Pricing</button></div><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">Earnings Split</p><div style="display:flex;flex-direction:column;gap:10px;"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Admin Fee %</label><input type="number" id="split-admin" value="15" min="0" max="50" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><label style="font-size:13px;color:var(--text-muted);flex:1;">Auto Data Split %</label><input type="number" id="split-data" value="30" min="0" max="80" style="width:90px;text-align:right;padding:8px;border-radius:8px;border:1px solid var(--border);font-size:13px;"/></div><div style="background:var(--bg);border-radius:8px;padding:10px;"><p style="font-size:12px;color:var(--text-muted);margin:0;">Wallet receives the remaining % after admin fee and data split.</p></div></div><button onclick="saveSplitSettings()" style="width:100%;margin-top:12px;padding:11px;border-radius:30px;background:linear-gradient(135deg,var(--primary),#2d1b8e);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;">Save Split Settings</button></div><div style="background:#fff;border-radius:14px;padding:16px;border:1px solid var(--border);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin:0;">Maintenance Mode</p><p style="font-size:12px;color:var(--text-muted);margin:0;">Show a message to all users</p></div><label class="toggle-switch"><input type="checkbox" id="maintenance-toggle" onchange="toggleMaintenance(this.checked)"/><span class="toggle-slider"></span></label></div><div class="form-group"><label for="maintenance-msg">Maintenance Message</label><textarea id="maintenance-msg" placeholder="e.g. We are currently performing scheduled maintenance." style="width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid var(--border);background:#fff;font-size:13px;outline:none;box-sizing:border-box;resize:none;height:80px;font-family:sans-serif;"></textarea></div><button onclick="saveMaintenanceSettings()" style="width:100%;padding:11px;border-radius:30px;background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;font-size:13px;font-weight:700;border:none;cursor:pointer;">Save Maintenance Settings</button></div></div></div></div>`;

PAGES['maintenance'] = `<div class="splash-screen"><div class="splash-bubble splash-bubble-1"></div><div class="splash-bubble splash-bubble-2"></div><div class="splash-bubble splash-bubble-3"></div><div class="splash-center"><div class="splash-logo"><i class="ti ti-tools" style="font-size:48px;color:#fff;"></i></div><h1 class="splash-title">Under Maintenance</h1><p class="splash-tagline">We will be back shortly</p><p id="maintenance-message" class="splash-sub" style="margin-top:12px;padding:0 24px;text-align:center;"></p></div></div>`;

PAGES['admin-analytics'] = `<div class="home-screen"><div class="subpage-header"><div class="subpage-left"><button class="icon-btn" onclick="navigateTo('admin-panel')"><i class="ti ti-arrow-left"></i></button><h2>Platform Analytics</h2></div><button class="icon-btn" onclick="initAdminAnalytics()"><i class="ti ti-refresh"></i></button></div><div class="page-scroll"><div style="display:flex;gap:8px;padding:12px 16px;overflow-x:auto;"><button onclick="filterAnalytics('today')" id="analytics-today" style="padding:6px 14px;border-radius:20px;background:var(--primary);color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;">Today</button><button onclick="filterAnalytics('week')" id="analytics-week" style="padding:6px 14px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;cursor:pointer;white-space:nowrap;">This Week</button><button onclick="filterAnalytics('month')" id="analytics-month" style="padding:6px 14px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;cursor:pointer;white-space:nowrap;">This Month</button><button onclick="filterAnalytics('all')" id="analytics-all" style="padding:6px 14px;border-radius:20px;background:#fff;color:var(--text-muted);border:1px solid var(--border);font-size:12px;cursor:pointer;white-space:nowrap;">All Time</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-bottom:14px;"><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#dbeafe;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-users" style="font-size:16px;color:#3b82f6;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Total Users</p><p id="pa-users" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">0</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-list-check" style="font-size:16px;color:#22c55e;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Tasks Completed</p><p id="pa-tasks" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">0</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#fff7ed;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-wallet" style="font-size:16px;color:#f97316;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Total User Wallets</p><p id="pa-wallets" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">R 0.00</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-building-store" style="font-size:16px;color:#ef4444;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Advertiser Budgets</p><p id="pa-adv-budgets" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">R 0.00</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#ede9fe;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-building-store" style="font-size:16px;color:#6c63ff;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Total Advertisers</p><p id="pa-advertisers" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">0</p></div><div style="background:#fff;border-radius:14px;padding:12px;border:1px solid var(--border);"><div style="width:32px;height:32px;border-radius:8px;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><i class="ti ti-speakerphone" style="font-size:16px;color:#22c55e;"></i></div><p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Active Campaigns</p><p id="pa-campaigns" style="font-size:20px;font-weight:700;color:var(--text-primary);margin:0;">0</p></div></div><div style="background:#fff;border-radius:14px;margin:0 16px 16px;padding:16px;border:1px solid var(--border);"><p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">User Registrations</p><canvas id="pa-chart" height="120"></canvas></div></div></div>`;


function initAdminFinancial() {
  var allUsers      = JSON.parse(localStorage.getItem('kwanda_users')       || '[]');
  var allAdvs       = JSON.parse(localStorage.getItem('kwanda_advertisers') || '[]');
  var allCampaigns  = JSON.parse(localStorage.getItem('kwanda_campaigns')   || '[]');
  var adminFees     = JSON.parse(localStorage.getItem('_k_fees')            || '{"t":0,"count":0}');

  var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
  set('fin-total-fees',    'R ' + (adminFees.t || 0).toFixed(2));

  var totalUserWallets = allUsers.reduce(function(sum, u) { return sum + (u.balance || 0); }, 0);
  var totalDataBal     = allUsers.reduce(function(sum, u) { return sum + (u.dataBalance || 0); }, 0);
  set('fin-paid-users',    'R ' + totalUserWallets.toFixed(2));
  set('fin-user-wallets',  'R ' + totalUserWallets.toFixed(2));
  set('fin-data-balances', totalDataBal.toFixed(0) + ' MB');

  var totalAdvSpend = allCampaigns.reduce(function(sum, c) { return sum + (c.totalCharged || c.budget || 0); }, 0);
  set('fin-adv-spend', 'R ' + totalAdvSpend.toFixed(2));

  // Advertiser statements
  var container = document.getElementById('fin-transactions');
  if (container) {
    if (allAdvs.length === 0) {
      container.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>No advertisers yet</div>";
    } else {
      container.innerHTML = allAdvs.map(function(adv) {
        var advCampaigns = allCampaigns.filter(function(c) { return c.advertiserId === adv.id; });
        var totalSpent   = advCampaigns.reduce(function(sum, c) { return sum + (c.totalCharged || c.budget || 0); }, 0);
        var totalAdmin   = advCampaigns.reduce(function(sum, c) { return sum + (c.adminFee || 0); }, 0);
        var totalVAT     = advCampaigns.reduce(function(sum, c) { return sum + (c.vat || 0); }, 0);
        return "<div style='background:#f9fafb;border-radius:12px;padding:14px;border:1px solid var(--border);margin-bottom:10px;'>" +
          "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'>" +
          "<div><p style='font-size:14px;font-weight:700;color:var(--text-primary);margin:0;'>" + (adv.company || adv.email) + "</p>" +
          "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + adv.email + "</p></div>" +
          "<span style='font-size:12px;font-weight:700;color:#ef4444;'>R " + totalSpent.toFixed(2) + "</span></div>" +
          "<div style='display:flex;gap:8px;font-size:11px;color:var(--text-muted);margin-bottom:10px;'>" +
          "<span>Campaigns: " + advCampaigns.length + "</span><span>|</span>" +
          "<span>Admin Fee: R " + totalAdmin.toFixed(2) + "</span><span>|</span>" +
          "<span>VAT: R " + totalVAT.toFixed(2) + "</span></div>" +
          "<button onclick=\"downloadAdvStatement('" + adv.id + "')\" style='width:100%;padding:9px;border-radius:20px;background:linear-gradient(135deg,#2d1b8e,#534AB7);color:#fff;font-size:12px;font-weight:700;border:none;cursor:pointer;'>" +
          "<i class=\"ti ti-download\" style=\"margin-right:5px;\"></i>Download Monthly Statement</button></div>";
      }).join('');
    }
  }

  // Users by region
  var regionContainer = document.getElementById('fin-users-region');
  if (regionContainer) {
    var provinces = {
      'gauteng':'Gauteng','western-cape':'Western Cape','kwazulu-natal':'KwaZulu-Natal',
      'eastern-cape':'Eastern Cape','limpopo':'Limpopo','mpumalanga':'Mpumalanga',
      'north-west':'North West','northern-cape':'Northern Cape','free-state':'Free State','':'Not Specified'
    };
    var grouped = {};
    allUsers.forEach(function(u) {
      var prov = u.province || '';
      if (!grouped[prov]) grouped[prov] = [];
      grouped[prov].push(u);
    });
    if (allUsers.length === 0) {
      regionContainer.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>No users yet</div>";
    } else {
      var html = '';
      Object.keys(provinces).forEach(function(provKey) {
        var users = grouped[provKey] || [];
        if (users.length === 0) return;
        var provName = provinces[provKey];
        html += "<div style='margin-bottom:12px;'>";
        html += "<div style='display:flex;justify-content:space-between;align-items:center;background:#f3f4f6;border-radius:8px;padding:8px 12px;margin-bottom:6px;'>";
        html += "<p style='font-size:13px;font-weight:700;color:var(--text-primary);margin:0;'>" + provName + "</p>";
        html += "<span style='font-size:12px;font-weight:600;color:var(--primary);background:#ede9fe;padding:2px 10px;border-radius:10px;'>" + users.length + " users</span></div>";
        users.forEach(function(u) {
          html += "<div style='display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border);'>";
          html += "<div><p style='font-size:13px;font-weight:600;color:var(--text-primary);margin:0;'>" + (u.firstName || '') + " " + (u.lastName || '') + "</p>";
          html += "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + (u.region || 'N/A') + " · " + (u.email || '') + "</p></div>";
          html += "<p style='font-size:12px;font-weight:700;color:#22c55e;margin:0;'>R " + (u.balance || 0).toFixed(2) + "</p></div>";
        });
        html += "</div>";
      });
      regionContainer.innerHTML = html;
    }
  }
}

window.initAdminFinancial  = initAdminFinancial;
function initAdminAnalytics() {
  filterAnalytics('today');
}

function filterAnalytics(period) {
  // Update tab buttons
  var periods = ['today', 'week', 'month', 'all'];
  periods.forEach(function(p) {
    var btn = document.getElementById('analytics-' + p);
    if (!btn) return;
    if (p === period) {
      btn.style.background = 'var(--primary)';
      btn.style.color = '#fff';
      btn.style.border = 'none';
    } else {
      btn.style.background = '#fff';
      btn.style.color = 'var(--text-muted)';
      btn.style.border = '1px solid var(--border)';
    }
  });

  // Load data from localStorage
  var allUsers      = JSON.parse(localStorage.getItem('kwanda_users')       || '[]');
  var allAdvs       = JSON.parse(localStorage.getItem('kwanda_advertisers') || '[]');
  var allCampaigns  = JSON.parse(localStorage.getItem('kwanda_campaigns')   || '[]');

  // Filter by period
  var now   = new Date();
  var users = allUsers;

  if (period !== 'all') {
    var cutoff = new Date();
    if (period === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      cutoff.setDate(now.getDate() - 30);
    }
    users = allUsers.filter(function(u) {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= cutoff;
    });
  }

  // Calculate stats
  var totalWallets  = allUsers.reduce(function(sum, u) { return sum + (u.balance || 0); }, 0);
  var totalAdvBudgets = allAdvs.reduce(function(sum, a) { return sum + (a.budget || 0); }, 0);
  var activeCampaigns = allCampaigns.filter(function(c) { return c.status === 'active'; }).length;
  var totalTasks    = allUsers.reduce(function(sum, u) { return sum + (u.tasksCompleted || 0); }, 0);

  // Update UI
  var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
  set('pa-users',       users.length);
  set('pa-tasks',       totalTasks);
  set('pa-wallets',     'R ' + totalWallets.toFixed(2));
  set('pa-adv-budgets', 'R ' + totalAdvBudgets.toFixed(2));
  set('pa-advertisers', allAdvs.length);
  set('pa-campaigns',   activeCampaigns);

  // Draw chart
  drawAnalyticsChart(period, allUsers);
}

function drawAnalyticsChart(period, allUsers) {
  var canvas = document.getElementById('pa-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // Build labels and data
  var labels = [];
  var data   = [];

  if (period === 'today') {
    for (var h = 0; h < 24; h += 4) {
      labels.push(h + ':00');
      data.push(allUsers.filter(function(u) {
        if (!u.createdAt) return false;
        var d = new Date(u.createdAt);
        var now = new Date();
        return d.toDateString() === now.toDateString() && d.getHours() >= h && d.getHours() < h + 4;
      }).length);
    }
  } else if (period === 'week') {
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (var i = 6; i >= 0; i--) {
      var day = new Date();
      day.setDate(day.getDate() - i);
      labels.push(days[day.getDay()]);
      data.push(allUsers.filter(function(u) {
        if (!u.createdAt) return false;
        return new Date(u.createdAt).toDateString() === day.toDateString();
      }).length);
    }
  } else if (period === 'month') {
    for (var w = 4; w >= 1; w--) {
      labels.push('Week ' + (5 - w));
      var wStart = new Date(); wStart.setDate(wStart.getDate() - w * 7);
      var wEnd   = new Date(); wEnd.setDate(wEnd.getDate() - (w - 1) * 7);
      data.push(allUsers.filter(function(u) {
        if (!u.createdAt) return false;
        var d = new Date(u.createdAt);
        return d >= wStart && d < wEnd;
      }).length);
    }
  } else {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (var m = 0; m < 12; m++) {
      labels.push(months[m]);
      data.push(allUsers.filter(function(u) {
        if (!u.createdAt) return false;
        return new Date(u.createdAt).getMonth() === m;
      }).length);
    }
  }

  // Clear and draw
  if (window._paChart) { window._paChart.destroy(); }
  window._paChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'New Users',
        data: data,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
}

window.initAdminAnalytics = initAdminAnalytics;
window.filterAnalytics    = filterAnalytics;
PAGES['onboarding'] = `<div style="width:100%;min-height:100vh;display:flex;flex-direction:column;overflow:hidden;"><div id="onboarding-slides" style="display:flex;transition:transform 0.4s ease;width:300%;"><div class="onboarding-slide" style="width:33.333%;min-height:100vh;background:linear-gradient(160deg,#1a1060,#2d1b8e);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;box-sizing:border-box;"><div style="width:120px;height:120px;background:rgba(255,255,255,0.15);border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:56px;margin-bottom:32px;">📋</div><h1 style="font-family:sans-serif;font-size:28px;font-weight:700;color:#fff;margin:0 0 16px;text-align:center;">Participate</h1><p style="font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.7;text-align:center;margin:0;">Complete surveys, watch videos and answer quizzes from top brands and companies.</p></div><div class="onboarding-slide" style="width:33.333%;min-height:100vh;background:linear-gradient(160deg,#065f46,#059669);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;box-sizing:border-box;"><div style="width:120px;height:120px;background:rgba(255,255,255,0.15);border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:56px;margin-bottom:32px;">💰</div><h1 style="font-family:sans-serif;font-size:28px;font-weight:700;color:#fff;margin:0 0 16px;text-align:center;">Earn</h1><p style="font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.7;text-align:center;margin:0;">Get paid in Rands directly to your wallet. 30% automatically goes to your data balance.</p></div><div class="onboarding-slide" style="width:33.333%;min-height:100vh;background:linear-gradient(160deg,#7c2d12,#ea580c);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;box-sizing:border-box;"><div style="width:120px;height:120px;background:rgba(255,255,255,0.15);border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:56px;margin-bottom:32px;">🎁</div><h1 style="font-family:sans-serif;font-size:28px;font-weight:700;color:#fff;margin:0 0 16px;text-align:center;">Redeem</h1><p style="font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.7;text-align:center;margin:0;">Buy airtime, data bundles, spend on partner apps or cash out to your bank account.</p></div></div><div style="position:fixed;bottom:0;left:0;right:0;padding:32px 32px 48px;display:flex;flex-direction:column;align-items:center;gap:20px;"><div style="display:flex;gap:8px;" id="onboarding-dots"><div style="width:24px;height:6px;border-radius:3px;background:#fff;" id="dot-0"></div><div style="width:8px;height:6px;border-radius:3px;background:rgba(255,255,255,0.4);" id="dot-1"></div><div style="width:8px;height:6px;border-radius:3px;background:rgba(255,255,255,0.4);" id="dot-2"></div></div><button id="onboarding-btn" onclick="nextOnboardingSlide()" style="width:100%;max-width:320px;padding:16px;border-radius:30px;background:#fff;color:#1a1060;font-size:16px;font-weight:700;border:none;cursor:pointer;font-family:sans-serif;">Next</button><button onclick="skipOnboarding()" style="background:none;border:none;color:rgba(255,255,255,0.7);font-size:14px;cursor:pointer;font-family:sans-serif;">Skip</button></div></div>`;

PAGES['loading'] = `<div style="width:100%;min-height:100vh;background:linear-gradient(160deg,#1a1060 0%,#2d1b8e 50%,#1a1060 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;"><div style="width:80px;height:80px;background:linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.1));border-radius:22px;display:flex;align-items:center;justify-content:center;"><svg width="44" height="44" viewBox="0 0 48 48" fill="none"><path d="M10 36 L20 12 L28 28 L34 18 L42 36" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div style="text-align:center;"><h1 style="font-family:sans-serif;font-size:26px;font-weight:700;color:#fff;margin:0 0 6px;">KwandaData&trade;</h1><p style="font-family:sans-serif;font-size:13px;color:rgba(255,255,255,0.7);margin:0;">Connect. Earn. Empower Communities.</p></div><div style="width:140px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;overflow:hidden;"><div id="loading-bar" style="width:0%;height:100%;background:#fff;border-radius:2px;transition:width 1.2s ease;"></div></div></div>`;

// ── PART 6 (FINAL) - Paste this AFTER Part 5 ──

// Navigation
let currentPage = null;

function navigateTo(pageName) {
  if (!PAGES[pageName]) { console.log('page not found:', pageName); return; }
  const app = document.getElementById('app');
  app.innerHTML = PAGES[pageName];
  currentPage = pageName;
  window.scrollTo(0, 0);
  history.pushState({ page: pageName }, '', '#' + pageName);
  const fn = 'init' + pageName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  if (typeof window[fn] === 'function') {
    requestAnimationFrame(function() { window[fn](); });
  }
}

window.addEventListener('popstate', e => { if (e.state && e.state.page) navigateTo(e.state.page); });

function togglePassword(id, icon) {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
  icon.className = el.type === 'password' ? 'ti ti-eye icon-right' : 'ti ti-eye-off icon-right';
}
function showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
function clearError(id) { const el = document.getElementById(id); if (el) el.textContent = ''; }
function formatMB(v) { return 'R ' + Number(v).toFixed(2); }
function getVal(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

// ── Activity tracking (powers advertiser analytics: demographics, DAU/MAU,
//    retention, session frequency, attribution). Logs a lightweight event
//    plus rolls up per-user "active day" and "last active" info. ──
function logActivity(type, campaignId, extra) {
  try {
    var now = new Date();
    var entry = {
      type: type,
      campaignId: campaignId || null,
      userId: null,
      age: null,
      gender: null,
      province: null,
      ts: now.getTime(),
      day: now.toISOString().slice(0, 10)
    };
    var cu = localStorage.getItem('kwanda_current_user');
    var user = cu ? JSON.parse(cu) : null;
    if (user) {
      entry.userId   = user.email;
      entry.age      = user.age;
      entry.gender   = user.gender;
      entry.province = user.province;
    }
    if (extra) { for (var k in extra) { entry[k] = extra[k]; } }

    var log = JSON.parse(localStorage.getItem('kwanda_activity_log') || '[]');
    log.push(entry);
    if (log.length > 5000) log = log.slice(log.length - 5000);
    localStorage.setItem('kwanda_activity_log', JSON.stringify(log));

    if (user) {
      var stored   = localStorage.getItem('kwanda_users');
      var allUsers = stored ? JSON.parse(stored) : [];
      var idx      = allUsers.findIndex(function(u) { return u.email === user.email; });
      if (idx !== -1) {
        var days = allUsers[idx].activeDays || [];
        if (days.indexOf(entry.day) === -1) days.push(entry.day);
        if (days.length > 120) days = days.slice(days.length - 120);
        allUsers[idx].activeDays   = days;
        allUsers[idx].lastActiveAt = entry.ts;
        if (!allUsers[idx].createdAt) allUsers[idx].createdAt = entry.ts;
        localStorage.setItem('kwanda_users', JSON.stringify(allUsers));
      }
    }
  } catch (e) { /* analytics logging must never break the app */ }
}
window.logActivity = logActivity;

function copyReferralCode() {
  var code = getUserReferralCode();
  navigator.clipboard.writeText(code).then(function() { alert("Referral code copied: " + code); });
}
function getUserReferralCode() {
  var stored = localStorage.getItem("kwanda_current_user");
  var user   = stored ? JSON.parse(stored) : null;
  return user && user.referralCode ? user.referralCode : "KWANDA00";
}
function shareReferralCode() {
  var code = getUserReferralCode();
  if (navigator.share) {
    navigator.share({ title:"Join KwandaData", text:"Use my referral code " + code + " and we both earn!", url: window.location.href });
  } else {
    alert("Share this code with friends: " + code);
  }
}
function initRefer() {
  var codeEl = document.getElementById("user-referral-code");
  if (codeEl) codeEl.textContent = getUserReferralCode();
}

function submitDonate() {
  var phoneEl   = document.getElementById("donate-phone");
  var amountEl  = document.getElementById("donate-amount");
  var messageEl = document.getElementById("donate-message");
  var errorEl   = document.getElementById("donate-error");
  var phone     = phoneEl   ? phoneEl.value.trim()   : "";
  var amount    = parseFloat(amountEl ? amountEl.value : "0");
  var message   = messageEl ? messageEl.value.trim() : "";

  if (errorEl) errorEl.textContent = "";
  if (!phone)                       { if (errorEl) errorEl.textContent = "Please enter a recipient phone number."; return; }
  if (isNaN(amount) || amount <= 0) { if (errorEl) errorEl.textContent = "Please enter an amount to donate.";    return; }
  if (amount < 1)                   { if (errorEl) errorEl.textContent = "Minimum donation is R 1.00.";           return; }

  var stored  = localStorage.getItem("kwanda_current_user");
  var user    = stored ? JSON.parse(stored) : null;
  var balance = user ? (user.balance || 0) : 0;

  if (amount > balance) { if (errorEl) errorEl.textContent = "Not enough balance. Your balance is R " + balance.toFixed(2) + "."; return; }

  var receiverData   = amount * 0.30;
  var receiverWallet = amount * 0.70;

  if (user) {
    user.balance = balance - amount;
    localStorage.setItem("kwanda_current_user", JSON.stringify(user));
  }

  var allUsersStored = localStorage.getItem("kwanda_users");
  var allUsers       = allUsersStored ? JSON.parse(allUsersStored) : [];
  var receiverIndex  = allUsers.findIndex(function(u) { return u.phone === phone; });
  if (receiverIndex !== -1) {
    allUsers[receiverIndex].balance     = (allUsers[receiverIndex].balance     || 0) + receiverWallet;
    allUsers[receiverIndex].dataBalance = (allUsers[receiverIndex].dataBalance || 0) + receiverData;
    localStorage.setItem("kwanda_users", JSON.stringify(allUsers));
  }

  var balEl = document.querySelector(".donate-balance");
  if (balEl) balEl.textContent = "R " + (balance - amount).toFixed(2);

  var historyEl = document.getElementById("donate-history");
  if (historyEl) {
    var now     = new Date();
    var date    = now.toLocaleDateString("en-ZA", { day:"numeric", month:"long", year:"numeric" });
    var emptyEl = historyEl.querySelector('div[style*="text-align:center"]');
    if (emptyEl) emptyEl.remove();
    var newItem = document.createElement("div");
    newItem.style.cssText = "display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);";
    newItem.innerHTML = "<div style='width:38px;height:38px;background:#fee2e2;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#ef4444;flex-shrink:0;'><i class='ti ti-phone'></i></div>"
      + "<div style='flex:1;'><p style='font-size:13px;font-weight:600;color:var(--text-primary);'>" + phone + "</p>"
      + "<p style='font-size:11px;color:var(--text-muted);'>" + date + "</p>"
      + (message ? "<p style='font-size:11px;color:var(--text-muted);font-style:italic;'>" + message + "</p>" : "")
      + "</div><div style='text-align:right;'>"
      + "<p style='font-size:14px;font-weight:700;color:#ef4444;'>-R " + amount.toFixed(2) + "</p>"
      + "<span style='font-size:11px;font-weight:600;color:#166534;background:#dcfce7;padding:3px 10px;border-radius:20px;'>Success</span></div>";
    historyEl.insertBefore(newItem, historyEl.firstChild);
  }

  if (phoneEl)   phoneEl.value   = "";
  if (amountEl)  amountEl.value  = "";
  if (messageEl) messageEl.value = "";

  alert("Donation sent to " + phone + "\nTotal: R " + amount.toFixed(2) + "\nYour balance: R " + (balance - amount).toFixed(2));
}

function initDonate() {
  var stored  = localStorage.getItem("kwanda_current_user");
  var user    = stored ? JSON.parse(stored) : null;
  var balance = user ? (user.balance || 0) : 0;
  var balEl   = document.querySelector(".donate-balance");
  if (balEl) balEl.textContent = "R " + balance.toFixed(2);
  var codeEl = document.getElementById("user-referral-code");
  if (codeEl) codeEl.textContent = getUserReferralCode();
}

function calcAge(dob) {
  if (!dob) return;
  var today     = new Date();
  var birthDate = new Date(dob);
  var age       = today.getFullYear() - birthDate.getFullYear();
  var month     = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
  var ageInput = document.getElementById("reg-age");
  if (ageInput) ageInput.value = age;
}

function handleForgotPassword() {
  var email     = document.getElementById("reset-email") ? document.getElementById("reset-email").value.trim() : "";
  var errorEl   = document.getElementById("reset-error");
  var successEl = document.getElementById("reset-success");
  if (errorEl)   errorEl.textContent   = "";
  if (successEl) successEl.textContent = "";
  if (!email) { if (errorEl) errorEl.textContent = "Please enter your email address."; return; }
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) { if (errorEl) errorEl.textContent = "Please enter a valid email address."; return; }
  var stored   = localStorage.getItem("kwanda_users");
  var allUsers = stored ? JSON.parse(stored) : [];
  var exists   = allUsers.find(function(u) { return u.email === email; });
  if (!exists) { if (errorEl) errorEl.textContent = "No account found with this email address."; return; }
  if (successEl) successEl.textContent = "✅ Password reset link sent to " + email + ". Please check your inbox.";
  var btn = document.querySelector(".btn-purple");
  if (btn) { btn.textContent = "Link Sent!"; btn.disabled = true; btn.style.background = "#22c55e"; }
}

function initAdminUsers() {
  var stored    = localStorage.getItem("kwanda_users");
  var allUsers  = stored ? JSON.parse(stored) : [];
  var container = document.getElementById("users-list");
  if (!container) return;
  if (allUsers.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px 16px;color:var(--text-muted);"><i class="ti ti-users-off" style="font-size:40px;display:block;margin-bottom:12px;"></i><p style="font-size:14px;font-weight:600;">No users registered yet</p></div>';
    return;
  }
  var colors = ["linear-gradient(135deg,#6c63ff,#2d1b8e)","linear-gradient(135deg,#f97316,#ef4444)","linear-gradient(135deg,#22c55e,#16a34a)","linear-gradient(135deg,#3b82f6,#1d4ed8)","linear-gradient(135deg,#9089cc,#6c63ff)"];
  container.innerHTML = allUsers.map(function(user, index) {
    var color      = colors[index % colors.length];
    var letter     = user.firstName ? user.firstName.charAt(0).toUpperCase() : "?";
    var name       = (user.firstName || "") + " " + (user.lastName || "");
    var province   = user.province   ? user.province.replace(/-/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();}) : "N/A";
    var employment = user.employment ? user.employment.replace(/-/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();}) : "N/A";
    return '<div style="background:#fff;border-radius:14px;padding:14px 16px;margin-bottom:10px;border:1px solid var(--border);">'
      + '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">'
      + '<div style="width:42px;height:42px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:700;flex-shrink:0;">' + letter + '</div>'
      + '<div style="flex:1;"><p style="font-size:14px;font-weight:600;color:var(--text-primary);">' + name + '</p>'
      + '<p style="font-size:12px;color:var(--text-muted);">' + user.email + '</p></div>'
      + '<span style="font-size:11px;font-weight:600;color:var(--accent-green);background:#dcfce7;padding:4px 10px;border-radius:20px;">Active</span></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">'
      + '<div style="background:var(--bg);border-radius:8px;padding:6px 10px;"><p style="font-size:10px;color:var(--text-muted);">Phone</p><p style="font-size:12px;font-weight:600;color:var(--text-primary);">' + (user.phone||"N/A") + '</p></div>'
      + '<div style="background:var(--bg);border-radius:8px;padding:6px 10px;"><p style="font-size:10px;color:var(--text-muted);">Province</p><p style="font-size:12px;font-weight:600;color:var(--text-primary);">' + province + '</p></div>'
      + '<div style="background:var(--bg);border-radius:8px;padding:6px 10px;"><p style="font-size:10px;color:var(--text-muted);">Employment</p><p style="font-size:12px;font-weight:600;color:var(--text-primary);">' + employment + '</p></div>'
      + '<div style="background:var(--bg);border-radius:8px;padding:6px 10px;"><p style="font-size:10px;color:var(--text-muted);">Wallet Balance</p><p style="font-size:12px;font-weight:600;color:var(--primary);">R ' + (user.balance||0).toFixed(2) + '</p></div>'
      + '</div></div>';
  }).join('');
}

function searchUsers(query) {
  var stored   = localStorage.getItem("kwanda_users");
  var allUsers = stored ? JSON.parse(stored) : [];
  var filtered = allUsers.filter(function(u) {
    var name = ((u.firstName||"") + " " + (u.lastName||"")).toLowerCase();
    return name.includes(query.toLowerCase()) || (u.email||"").toLowerCase().includes(query.toLowerCase());
  });
  var container = document.getElementById("users-list");
  if (!container) return;
  if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;">No users found.</div>'; return; }
  var temp = JSON.stringify(allUsers);
  localStorage.setItem("kwanda_users", JSON.stringify(filtered));
  initAdminUsers();
  localStorage.setItem("kwanda_users", temp);
}

function initAdminWallets() {
  var stored        = localStorage.getItem("kwanda_users");
  var allUsers      = stored ? JSON.parse(stored) : [];
  var container     = document.getElementById("wallets-list");
  var totalWalletEl = document.getElementById("total-wallet");
  var totalDataEl   = document.getElementById("total-data");
  if (!container) return;
  var totalWallet = 0, totalData = 0;
  allUsers.forEach(function(u) { totalWallet += (u.balance||0); totalData += (u.dataBalance||0); });
  if (totalWalletEl) totalWalletEl.textContent = "R " + totalWallet.toFixed(2);
  if (totalDataEl)   totalDataEl.textContent   = "R " + totalData.toFixed(2);
  if (allUsers.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px 16px;color:var(--text-muted);"><i class="ti ti-wallet-off" style="font-size:40px;display:block;margin-bottom:12px;"></i><p style="font-size:14px;font-weight:600;">No wallets yet</p></div>';
    return;
  }
  var colors = ["linear-gradient(135deg,#6c63ff,#2d1b8e)","linear-gradient(135deg,#f97316,#ef4444)","linear-gradient(135deg,#22c55e,#16a34a)","linear-gradient(135deg,#3b82f6,#1d4ed8)","linear-gradient(135deg,#9089cc,#6c63ff)"];
  container.innerHTML = allUsers.map(function(user, index) {
    var color  = colors[index % colors.length];
    var letter = user.firstName ? user.firstName.charAt(0).toUpperCase() : "?";
    var name   = (user.firstName||"") + " " + (user.lastName||"");
    return '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);">'
      + '<div style="width:38px;height:38px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;font-weight:700;flex-shrink:0;">' + letter + '</div>'
      + '<div style="flex:1;"><p style="font-size:13px;font-weight:600;color:var(--text-primary);">' + name + '</p>'
      + '<p style="font-size:11px;color:var(--text-muted);">' + (user.email||"") + '</p></div>'
      + '<div style="text-align:right;"><p style="font-size:13px;font-weight:700;color:var(--primary);">R ' + (user.balance||0).toFixed(2) + '</p>'
      + '<p style="font-size:11px;color:var(--accent-blue);">📶 R ' + (user.dataBalance||0).toFixed(2) + '</p></div></div>';
  }).join('');
}

function updateAdminStats() {
  var stored   = localStorage.getItem("kwanda_users");
  var allUsers = stored ? JSON.parse(stored) : [];
  document.querySelectorAll(".stat-card").forEach(function(card) {
    var label = card.querySelector(".stat-label");
    var value = card.querySelector(".stat-value");
    if (label && value && label.textContent === "Total Users") value.textContent = allUsers.length.toLocaleString();
  });
}

var currentSlide = 0;
function nextOnboardingSlide() {
  var slides = document.getElementById("onboarding-slides");
  var btn    = document.getElementById("onboarding-btn");
  if (!slides) return;
  if (currentSlide < 2) {
    currentSlide++;
    slides.style.transform = "translateX(-" + (currentSlide * 33.333) + "%)";
    for (var i = 0; i < 3; i++) {
      var dot = document.getElementById("dot-" + i);
      if (dot) { dot.style.width = i===currentSlide?"24px":"8px"; dot.style.background = i===currentSlide?"#fff":"rgba(255,255,255,0.4)"; }
    }
    if (currentSlide === 2 && btn) btn.textContent = "Get Started";
  } else { skipOnboarding(); }
}
function skipOnboarding() {
  localStorage.setItem("kwanda_onboarding_done", "true");
  currentSlide = 0;
  navigateTo("splash");
}

// Expose globals
window.navigateTo         = navigateTo;
window.togglePassword     = togglePassword;
window.showError          = showError;
window.clearError         = clearError;
window.formatMB           = formatMB;
window.getVal             = getVal;
window.switchTab          = switchTab;
window.startTask          = startTask;
window.filterTransactions = filterTransactions;
window.handleRedeem       = handleRedeem;
window.updateChart        = updateChart;
window.copyReferralCode   = copyReferralCode;
window.shareReferralCode  = shareReferralCode;
window.submitDonate       = submitDonate;
window.calcAge            = calcAge;
window.getUserReferralCode  = getUserReferralCode;
window.initRefer            = initRefer;
window.nextOnboardingSlide  = nextOnboardingSlide;
window.skipOnboarding       = skipOnboarding;
window.handleForgotPassword = handleForgotPassword;
window.initAdminUsers       = initAdminUsers;
window.searchUsers          = searchUsers;
window.initAdminWallets     = initAdminWallets;
window.updateAdminStats     = updateAdminStats;
window.initDonate           = initDonate;

// Start app
document.addEventListener('DOMContentLoaded', function() {
  var settings    = JSON.parse(localStorage.getItem("kwanda_app_settings") || "{}");
  var maintenance = settings.maintenance || { enabled: false, message: "" };
  if (maintenance.enabled) {
    navigateTo('maintenance');
    var msgEl = document.getElementById("maintenance-message");
    if (msgEl) msgEl.textContent = maintenance.message || "We are currently performing scheduled maintenance.";
    return;
  }
  var hash = window.location.hash.replace('#', '');
  navigateTo(PAGES[hash] ? hash : 'splash');
});



 

// Add this code at the END of your initAdminFinancial function, before the closing }

  // Display users by region
  var regionContainer = document.getElementById('fin-users-region');
  if (regionContainer) {
    var allUsersForRegion = JSON.parse(localStorage.getItem('kwanda_users') || '[]');
    var provinces = {
      'gauteng':       'Gauteng',
      'western-cape':  'Western Cape',
      'kwazulu-natal': 'KwaZulu-Natal',
      'eastern-cape':  'Eastern Cape',
      'limpopo':       'Limpopo',
      'mpumalanga':    'Mpumalanga',
      'north-west':    'North West',
      'northern-cape': 'Northern Cape',
      'free-state':    'Free State',
      '':              'Not Specified'
    };

    var grouped = {};
    allUsersForRegion.forEach(function(u) {
      var prov = u.province || '';
      if (!grouped[prov]) grouped[prov] = [];
      grouped[prov].push(u);
    });

    if (allUsersForRegion.length === 0) {
      regionContainer.innerHTML = "<div style='text-align:center;padding:16px;color:var(--text-muted);font-size:13px;'>No users yet</div>";
    } else {
      var html = '';
      Object.keys(provinces).forEach(function(provKey) {
        var users = grouped[provKey] || [];
        if (users.length === 0) return;
        var provName = provinces[provKey];
        html += "<div style='margin-bottom:12px;'>";
        html += "<div style='display:flex;justify-content:space-between;align-items:center;background:#f3f4f6;border-radius:8px;padding:8px 12px;margin-bottom:6px;'>";
        html += "<p style='font-size:13px;font-weight:700;color:var(--text-primary);margin:0;'>" + provName + "</p>";
        html += "<span style='font-size:12px;font-weight:600;color:var(--primary);background:#ede9fe;padding:2px 10px;border-radius:10px;'>" + users.length + " users</span></div>";
        users.forEach(function(u) {
          html += "<div style='display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border);'>";
          html += "<div><p style='font-size:13px;font-weight:600;color:var(--text-primary);margin:0;'>" + (u.firstName || '') + " " + (u.lastName || '') + "</p>";
          html += "<p style='font-size:11px;color:var(--text-muted);margin:0;'>" + (u.region || 'N/A') + " · " + (u.email || '') + "</p></div>";
          html += "<p style='font-size:12px;font-weight:700;color:#22c55e;margin:0;'>R " + (u.balance || 0).toFixed(2) + "</p></div>";
        });
        html += "</div>";
      });
      regionContainer.innerHTML = html;
    }
  }

function exportFinancialSummary() {
  var allAdvs      = JSON.parse(localStorage.getItem('kwanda_advertisers') || '[]');
  var allCampaigns = JSON.parse(localStorage.getItem('kwanda_campaigns')   || '[]');
  var allUsers     = JSON.parse(localStorage.getItem('kwanda_users')       || '[]');
  var adminFees    = JSON.parse(localStorage.getItem('_k_fees')            || '{"t":0,"count":0}');
  var now          = new Date();

  var lines = [];
  lines.push("========================================");
  lines.push("   KWANDADATA FULL FINANCIAL SUMMARY    ");
  lines.push("========================================");
  lines.push("Generated:      " + now.toLocaleString("en-ZA"));
  lines.push("Period:         All Time");
  lines.push("========================================");
  lines.push("");
  lines.push("PLATFORM OVERVIEW");
  lines.push("----------------------------------------");
  lines.push("Total Users:          " + allUsers.length);
  lines.push("Total Advertisers:    " + allAdvs.length);
  lines.push("Total Campaigns:      " + allCampaigns.length);
  lines.push("Active Campaigns:     " + allCampaigns.filter(function(c) { return c.status === 'active'; }).length);
  lines.push("Total Admin Fees:     R " + (adminFees.t || 0).toFixed(2));
  lines.push("");

  // User wallets
  var totalWallets  = allUsers.reduce(function(sum, u) { return sum + (u.balance || 0); }, 0);
  var totalData     = allUsers.reduce(function(sum, u) { return sum + (u.dataBalance || 0); }, 0);
  lines.push("Total User Wallets:   R " + totalWallets.toFixed(2));
  lines.push("Total Data Balances:  " + totalData.toFixed(0) + " MB");
  lines.push("");

  // Per advertiser breakdown
  lines.push("========================================");
  lines.push("ADVERTISER BREAKDOWN");
  lines.push("========================================");

  if (allAdvs.length === 0) {
    lines.push("No advertisers yet.");
  } else {
    allAdvs.forEach(function(adv, i) {
      var advCampaigns  = allCampaigns.filter(function(c) { return c.advertiserId === adv.id; });
      var totalBudget   = advCampaigns.reduce(function(sum, c) { return sum + (c.budget || 0); }, 0);
      var totalAdmin    = advCampaigns.reduce(function(sum, c) { return sum + (c.adminFee || 0); }, 0);
      var totalVAT      = advCampaigns.reduce(function(sum, c) { return sum + (c.vat || 0); }, 0);
      var totalCharged  = advCampaigns.reduce(function(sum, c) { return sum + (c.totalCharged || c.budget || 0); }, 0);

      lines.push("");
      lines.push((i + 1) + ". " + (adv.company || adv.email));
      lines.push("   Email:            " + adv.email);
      lines.push("   Campaigns:        " + advCampaigns.length);
      lines.push("   Campaign Budgets: R " + totalBudget.toFixed(2));
      lines.push("   Admin Fees (15%): R " + totalAdmin.toFixed(2));
      lines.push("   VAT (15%):        R " + totalVAT.toFixed(2));
      lines.push("   Total Charged:    R " + totalCharged.toFixed(2));
      lines.push("   Current Balance:  R " + (adv.budget || 0).toFixed(2));
      lines.push("   ----------------------------------------");
    });
  }

  // Totals
  var grandBudget  = allCampaigns.reduce(function(sum, c) { return sum + (c.budget || 0); }, 0);
  var grandAdmin   = allCampaigns.reduce(function(sum, c) { return sum + (c.adminFee || 0); }, 0);
  var grandVAT     = allCampaigns.reduce(function(sum, c) { return sum + (c.vat || 0); }, 0);
  var grandCharged = allCampaigns.reduce(function(sum, c) { return sum + (c.totalCharged || c.budget || 0); }, 0);

  lines.push("");
  lines.push("========================================");
  lines.push("GRAND TOTALS");
  lines.push("========================================");
  lines.push("Total Campaign Budgets: R " + grandBudget.toFixed(2));
  lines.push("Total Admin Fees:       R " + grandAdmin.toFixed(2));
  lines.push("Total VAT Collected:    R " + grandVAT.toFixed(2));
  lines.push("Total Charged:          R " + grandCharged.toFixed(2));
  lines.push("========================================");
  lines.push("KwandaData - Turning Participation into Opportunity");
  lines.push("support@kwandadata.co.za");
  lines.push("========================================");

  var content = lines.join("\n");
  var blob = new Blob([content], { type: "text/plain" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "KwandaData_Financial_Summary_" + now.toISOString().slice(0, 10) + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.exportFinancialSummary = exportFinancialSummary;

function exportUsersByRegion() {
  var allUsers = JSON.parse(localStorage.getItem('kwanda_users') || '[]');
  var now      = new Date();

  // Group users by province
  var provinces = {
    'gauteng':       'Gauteng',
    'western-cape':  'Western Cape',
    'kwazulu-natal': 'KwaZulu-Natal',
    'eastern-cape':  'Eastern Cape',
    'limpopo':       'Limpopo',
    'mpumalanga':    'Mpumalanga',
    'north-west':    'North West',
    'northern-cape': 'Northern Cape',
    'free-state':    'Free State',
    '':              'Not Specified'
  };

  var grouped = {};
  allUsers.forEach(function(u) {
    var prov = u.province || '';
    if (!grouped[prov]) grouped[prov] = [];
    grouped[prov].push(u);
  });

  var lines = [];
  lines.push("========================================");
  lines.push("   KWANDADATA USERS BY REGION REPORT    ");
  lines.push("========================================");
  lines.push("Generated:    " + now.toLocaleString("en-ZA"));
  lines.push("Total Users:  " + allUsers.length);
  lines.push("========================================");
  lines.push("");

  Object.keys(provinces).forEach(function(provKey) {
    var users = grouped[provKey] || [];
    if (users.length === 0) return;
    var provName = provinces[provKey];

    lines.push("----------------------------------------");
    lines.push(provName.toUpperCase() + " (" + users.length + " users)");
    lines.push("----------------------------------------");

    users.forEach(function(u, i) {
      lines.push((i + 1) + ". " + (u.firstName || '') + " " + (u.lastName || ''));
      lines.push("   Email:       " + (u.email || 'N/A'));
      lines.push("   Region/City: " + (u.region || 'N/A'));
      lines.push("   Province:    " + (provName));
      lines.push("   Gender:      " + (u.gender || 'N/A'));
      lines.push("   Employment:  " + (u.employment || 'N/A'));
      lines.push("   Balance:     R " + (u.balance || 0).toFixed(2));
      lines.push("   Data:        " + (u.dataBalance || 0).toFixed(0) + " MB");
      lines.push("");
    });
  });

  lines.push("========================================");
  lines.push("PROVINCE SUMMARY");
  lines.push("========================================");
  Object.keys(provinces).forEach(function(provKey) {
    var users = grouped[provKey] || [];
    if (users.length === 0) return;
    lines.push(provinces[provKey] + ": " + users.length + " users");
  });
  lines.push("========================================");
  lines.push("KwandaData - Turning Participation into Opportunity");
  lines.push("support@kwandadata.co.za");
  lines.push("========================================");

  var content = lines.join("\n");
  var blob = new Blob([content], { type: "text/plain" });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement("a");
  a.href     = url;
  a.download = "KwandaData_Users_By_Region_" + now.toISOString().slice(0, 10) + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.exportUsersByRegion = exportUsersByRegion;

function downloadAdvStatement(advId) {
  var allAdvs      = JSON.parse(localStorage.getItem('kwanda_advertisers') || '[]');
  var allCampaigns = JSON.parse(localStorage.getItem('kwanda_campaigns')   || '[]');
  var adv          = allAdvs.find(function(a) { return a.id === advId; });
  if (!adv) { alert('Advertiser not found.'); return; }

  var advCampaigns = allCampaigns.filter(function(c) { return c.advertiserId === advId; });
  var now          = new Date();

  var lines = [];
  lines.push("========================================");
  lines.push("   KWANDADATA MONTHLY BILLING STATEMENT ");
  lines.push("========================================");
  lines.push("Advertiser:   " + (adv.company || adv.email));
  lines.push("Email:        " + adv.email);
  lines.push("Generated:    " + now.toLocaleString("en-ZA"));
  lines.push("Period:       " + now.toLocaleString("en-ZA", { month: "long", year: "numeric" }));
  lines.push("========================================");
  lines.push("");

  if (advCampaigns.length === 0) {
    lines.push("No campaigns this period.");
  } else {
    advCampaigns.forEach(function(c, i) {
      lines.push((i + 1) + ". " + (c.name || 'Campaign'));
      lines.push("   Type:          " + (c.type || 'N/A'));
      lines.push("   Status:        " + (c.status || 'N/A'));
      lines.push("   Budget:        R " + (c.budget || 0).toFixed(2));
      lines.push("   Admin Fee:     R " + (c.adminFee || 0).toFixed(2));
      lines.push("   VAT (15%):     R " + (c.vat || 0).toFixed(2));
      lines.push("   Total Charged: R " + (c.totalCharged || c.budget || 0).toFixed(2));
      lines.push("");
    });
  }

  var totalBudget  = advCampaigns.reduce(function(sum, c) { return sum + (c.budget || 0); }, 0);
  var totalAdmin   = advCampaigns.reduce(function(sum, c) { return sum + (c.adminFee || 0); }, 0);
  var totalVAT     = advCampaigns.reduce(function(sum, c) { return sum + (c.vat || 0); }, 0);
  var totalCharged = advCampaigns.reduce(function(sum, c) { return sum + (c.totalCharged || c.budget || 0); }, 0);

  lines.push("========================================");
  lines.push("TOTALS");
  lines.push("========================================");
  lines.push("Campaign Budgets: R " + totalBudget.toFixed(2));
  lines.push("Admin Fees:       R " + totalAdmin.toFixed(2));
  lines.push("VAT Collected:    R " + totalVAT.toFixed(2));
  lines.push("Total Charged:    R " + totalCharged.toFixed(2));
  lines.push("Current Balance:  R " + (adv.budget || 0).toFixed(2));
  lines.push("========================================");
  lines.push("KwandaData - Turning Participation into Opportunity");
  lines.push("support@kwandadata.co.za");
  lines.push("========================================");

  var content = lines.join("\n");
  var blob    = new Blob([content], { type: "text/plain" });
  var url     = URL.createObjectURL(blob);
  var a       = document.createElement("a");
  a.href      = url;
  a.download  = "Statement_" + (adv.company || advId) + "_" + now.toISOString().slice(0, 7) + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.downloadAdvStatement = downloadAdvStatement;