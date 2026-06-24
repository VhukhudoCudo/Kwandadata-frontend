/* ══════════════════════════════════════
   KwandaData — Admin JS
   - User registrations count
   - Current user own activity summary
   - Nothing about app earnings
══════════════════════════════════════ */

let adminChartInstance = null;

const CHART_DATA = {
  week: {
    labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data   : [3200, 4100, 3800, 5200, 4800, 6100, 5700],
  },
  month: {
    labels : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data   : [18000, 22000, 19500, 25000],
  },
  year: {
    labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    data   : [45000,52000,48000,61000,58000,67000,72000,69000,75000,71000,80000,88000],
  },
};

// ── Init Admin ──
function initAdmin() {
  loadAdminStats();
  drawAdminChart('week');
  renderAdminActivities();
  updateAdminStats();
}

// ── Load admin stats ──
function loadAdminStats() {
  var stored   = localStorage.getItem('kwanda_users');
  var allUsers = stored ? JSON.parse(stored) : [];

  var statMap = {
    'Total Users'          : allUsers.length.toLocaleString(),
    'Active Today'         : allUsers.length > 0 ? allUsers.length.toLocaleString() : '0',
    'Activities Completed' : (8742 + allUsers.length).toLocaleString(),
  };

  document.querySelectorAll('.stat-card').forEach(function(card) {
    var label   = card.querySelector('.stat-label');
    var valueEl = card.querySelector('.stat-value');
    if (label && valueEl && statMap[label.textContent.trim()]) {
      valueEl.textContent = statMap[label.textContent.trim()];
    }
  });
}

// ── Update admin stats ──
function updateAdminStats() {
  var stored   = localStorage.getItem('kwanda_users');
  var allUsers = stored ? JSON.parse(stored) : [];

  document.querySelectorAll('.stat-card').forEach(function(card) {
    var label   = card.querySelector('.stat-label');
    var valueEl = card.querySelector('.stat-value');
    if (!label || !valueEl) return;
    if (label.textContent.trim() === 'Total Users') {
      valueEl.textContent = allUsers.length.toLocaleString();
    }
    if (label.textContent.trim() === 'Active Today') {
      valueEl.textContent = allUsers.length > 0 ? allUsers.length.toLocaleString() : '0';
    }
  });
}

// ── Draw admin chart ──
function drawAdminChart(period) {
  var canvas = document.getElementById('admin-chart');
  if (!canvas) return;

  if (adminChartInstance) {
    adminChartInstance.destroy();
    adminChartInstance = null;
  }

  var ctx  = canvas.getContext('2d');
  var data = CHART_DATA[period];

  adminChartInstance = new Chart(ctx, {
    type : 'line',
    data : {
      labels   : data.labels,
      datasets : [{
        data                 : data.data,
        borderColor          : '#2d1b8e',
        backgroundColor      : 'rgba(45,27,142,0.08)',
        borderWidth          : 2.5,
        pointBackgroundColor : '#2d1b8e',
        pointRadius          : 4,
        pointHoverRadius     : 6,
        fill                 : true,
        tension              : 0.4,
      }],
    },
    options : {
      responsive : true,
      plugins    : {
        legend  : { display: false },
        tooltip : {
          callbacks : {
            label : function(ctx) {
              return ' ' + ctx.parsed.y.toLocaleString() + ' users';
            },
          },
        },
      },
      scales : {
        x : {
          grid  : { display: false },
          ticks : { font: { size: 11 }, color: '#9089cc' },
        },
        y : {
          grid  : { color: '#f0f0f8' },
          ticks : {
            font     : { size: 11 },
            color    : '#9089cc',
            callback : function(value) {
              return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
            },
          },
        },
      },
    },
  });
}

// ── Update chart by period ──
function updateChart(period) {
  drawAdminChart(period);
}

// ── Render recent activities ──
// Shows only:
// 1. New user registration count
// 2. Current logged in user's own activity summary
function renderAdminActivities() {
  var container = document.getElementById('admin-activity-list');
  if (!container) return;

  var activities = [];

  // ── 1. New user registrations count ──
  var stored   = localStorage.getItem('kwanda_users');
  var allUsers = stored ? JSON.parse(stored) : [];

  activities.push({
    icon  : 'ti-user-plus',
    title : 'New User Registrations',
    time  : allUsers.length === 0 ? 'No users yet' : 'Total registered',
    delta : '+' + allUsers.length,
    type  : 'positive',
  });

  // ── 2. Current user own activity summary ──
  var sessionStored = localStorage.getItem('kwanda_current_user');
  var currentUser   = sessionStored ? JSON.parse(sessionStored) : null;

  if (currentUser) {
    // Tasks completed by this user
    var feeData     = JSON.parse(localStorage.getItem('_k_fees') || '{"count":0}');
    var taskCount   = feeData.count || 0;

    if (taskCount > 0) {
      activities.push({
        icon  : 'ti-list-check',
        title : 'Tasks Completed',
        time  : 'By you on this session',
        delta : '+' + taskCount,
        type  : 'positive',
      });
    } else {
      activities.push({
        icon  : 'ti-list-check',
        title : 'Tasks Completed',
        time  : 'Complete tasks to earn',
        delta : '0',
        type  : 'positive',
      });
    }

    // Current user wallet balance
    activities.push({
      icon  : 'ti-wallet',
      title : 'Your Wallet Balance',
      time  : 'Current session',
      delta : 'R ' + (currentUser.balance || 0).toFixed(2),
      type  : 'positive',
    });

    // Current user data balance
    activities.push({
      icon  : 'ti-wifi',
      title : 'Your Data Balance',
      time  : 'Current session',
      delta : 'R ' + (currentUser.dataBalance || 0).toFixed(2),
      type  : 'positive',
    });
  } else {
    activities.push({
      icon  : 'ti-login',
      title : 'No Active Session',
      time  : 'Sign in to see your activity',
      delta : '—',
      type  : 'positive',
    });
  }

  container.innerHTML = activities.map(function(activity) {
    return '<div class="admin-activity-item">'
      + '<div class="admin-activity-icon"><i class="ti ' + activity.icon + '"></i></div>'
      + '<div class="admin-activity-info">'
      + '<h4>' + activity.title + '</h4>'
      + '<p>' + activity.time + '</p>'
      + '</div>'
      + '<span class="admin-activity-delta ' + activity.type + '">'
      + activity.delta + ' ›</span>'
      + '</div>';
  }).join('');
}

// ── Auto refresh every 30 seconds ──
setInterval(function() {
  if (document.getElementById('admin-activity-list')) {
    updateAdminStats();
    renderAdminActivities();
  }
}, 30000);

export { initAdmin, updateChart };
window.initAdmin   = initAdmin;
window.updateChart = updateChart;