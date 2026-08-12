/* ============================================================
   Vitals&Vectors — Dashboard Sandbox JS (standalone)
   Track B: completely separate from js/dashboard.js
   ============================================================ */

(async function () {

  /* ── Auth check ─────────────────────────────────────────── */
  const auth = requireAuth(['member', 'coordinator', 'admin']);
  if (!auth) return;

  /* ── Helpers ────────────────────────────────────────────── */
  const RANK_TABLE = [
    { code: 'E',  lo: 0,   hi: 99,  label: 'Unranked Hunter', color: '#8A93A8' },
    { code: 'D',  lo: 100, hi: 149, label: 'Bronze Hunter',   color: '#CD7F32' },
    { code: 'C',  lo: 150, hi: 199, label: 'Iron Hunter',     color: '#B0B0B0' },
    { code: 'B',  lo: 200, hi: 249, label: 'Silver Hunter',   color: '#4FC3F7' },
    { code: 'A',  lo: 250, hi: 299, label: 'Gold Hunter',     color: '#FFD700' },
    { code: 'S',  lo: 300, hi: 399, label: 'Platinum Hunter', color: '#00E5FF' },
    { code: 'SS', lo: 400, hi: null,label: 'Shadow Monarch',  color: '#9A7BFF' },
  ];

  function rankFor(pts) {
    return RANK_TABLE.find(r => r.hi === null ? pts >= r.lo : pts >= r.lo && pts <= r.hi)
        || RANK_TABLE[0];
  }

  function ptsToNext(pts) {
    const idx = RANK_TABLE.findIndex(r => r.hi === null ? pts >= r.lo : pts >= r.lo && pts <= r.hi);
    if (idx < 0 || idx === RANK_TABLE.length - 1) return 0;
    return RANK_TABLE[idx + 1].lo - pts;
  }

  function rankProgress(pts) {
    const r = rankFor(pts);
    if (!r.hi) return 100;
    const range = r.hi - r.lo;
    const done  = pts - r.lo;
    return Math.min(100, Math.round((done / range) * 100));
  }

  function chipHtml(status) {
    const map = {
      pending:     ['chip-pending',   'Pending'],
      in_progress: ['chip-progress',  'In Progress'],
      completed:   ['chip-completed', 'Completed'],
      rated:       ['chip-rated',     'Rated'],
    };
    const [cls, label] = map[status] || ['chip-pending', status];
    return `<span class="chip ${cls}">${label}</span>`;
  }

  function timeAgo(ts) {
    if (!ts) return '—';
    const diff = Date.now() - new Date(ts + 'Z').getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  function fmtDeadline(dt) {
    if (!dt) return '—';
    return new Date(dt + (dt.includes('T') ? 'Z' : '')).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  function animateCount(el, target) {
    const start = 0;
    const dur = 600;
    const step = (ts) => {
      if (!animateCount._start) animateCount._start = ts;
      const p = Math.min((ts - animateCount._start) / dur, 1);
      el.textContent = Math.round(start + (target - start) * p);
      if (p < 1) requestAnimationFrame(step);
      else animateCount._start = null;
    };
    requestAnimationFrame(step);
  }

  /* ── Nav setup ──────────────────────────────────────────── */
  document.getElementById('nav-name').textContent = auth.name;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('vv_token');
    localStorage.removeItem('vv_role');
    localStorage.removeItem('vv_id');
    localStorage.removeItem('vv_name');
    window.location.href = '../index.html';
  });

  /* ── Timestamp ──────────────────────────────────────────── */
  const now = new Date();
  document.getElementById('page-timestamp').textContent =
    `// ${now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} — ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;

  /* ── Fetch all data in parallel ─────────────────────────── */
  let member, tasks, logs, allMembers, weeklyLb;

  try {
    [member, tasks, logs, allMembers, weeklyLb] = await Promise.all([
      api.getMe(),
      api.myTasks(),
      api.myPointLogs(),
      api.listMembers(),
      api.leaderboardWeekly(),
    ]);
  } catch (e) {
    showToast('Failed to load dashboard data', 'error');
    return;
  }

  /* ── Rank card ──────────────────────────────────────────── */
  const rank = rankFor(member.points_total);
  const hex  = document.getElementById('rank-hex');
  hex.textContent = rank.code;
  hex.className   = `rank-hex r-${rank.code}`;

  document.getElementById('rank-title').textContent = rank.label;
  document.getElementById('rank-pts').textContent   = `${member.points_total} pts`;
  document.getElementById('rank-bar').style.width   = `${rankProgress(member.points_total)}%`;
  document.getElementById('rank-total').textContent = member.points_total;
  document.getElementById('nav-rank').textContent   = rank.code;

  const toNext = ptsToNext(member.points_total);
  document.getElementById('rank-next').textContent =
    toNext > 0 ? `${toNext} pts to next rank` : '— Max rank achieved —';

  /* Equipped title based on rank */
  const titles = { E:'Unranked', D:'Bronze Hunter', C:'Iron Hunter', B:'Silver Hunter', A:'Gold Hunter', S:'Platinum Hunter', SS:'Shadow Monarch' };
  if (rank.code !== 'E') {
    document.getElementById('equipped-row').style.display = 'flex';
    document.getElementById('equipped-val').textContent   = titles[rank.code];
  }

  /* ── Stats strip ─────────────────────────────────────────── */
  const myPos = weeklyLb.findIndex(m => m.id === member.id);
  document.getElementById('stat-position').textContent = myPos >= 0 ? `#${myPos + 1}` : '—';

  const earnedWeek = member.points_this_week || 0;
  document.getElementById('stat-week').textContent  = `+${earnedWeek}`;
  document.getElementById('stat-month').textContent = member.points_this_month || 0;
  document.getElementById('stat-net').textContent   = `+${earnedWeek}`;

  /* ── Streaks ─────────────────────────────────────────────── */
  document.getElementById('streak-presence').textContent = member.streak_presence || 0;
  document.getElementById('streak-task').textContent     = member.streak_task_reporting || 0;

  const buffList = document.getElementById('buff-list');
  buffList.innerHTML = '';

  const p = member.streak_presence || 0;
  const t = member.streak_task_reporting || 0;

  buffList.innerHTML = `
    <div class="buff-row ${p > 0 ? 'active' : 'inactive'}">
      <span>⚡</span> Presence streak — ${p > 0 ? `${p} week${p > 1 ? 's' : ''} active (+${p * 10} pts/wk)` : 'Inactive'}
    </div>
    <div class="buff-row ${t > 0 ? 'active' : 'inactive'}">
      <span>🔥</span> Task streak — ${t > 0 ? `${t} week${t > 1 ? 's' : ''} active (+${t * 10} pts/wk)` : 'Inactive'}
    </div>
  `;

  /* ── Today's tasks ───────────────────────────────────────── */
  const todayEl = document.getElementById('today-tasks');
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const tmrw    = new Date(today); tmrw.setDate(today.getDate() + 1);

  const todayTasks = (tasks || []).filter(t => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline + (t.deadline.includes('T') ? 'Z' : ''));
    return d >= today && d < tmrw;
  });

  if (todayTasks.length === 0) {
    todayEl.innerHTML = '<div class="empty-state">No quests due today. Stay prepared.</div>';
  } else {
    todayEl.innerHTML = todayTasks.map(t => `
      <div class="quest-item">
        <div class="quest-left">
          <div class="quest-title">${t.title}</div>
          <div class="quest-meta">${t.duration_hrs}h · Due ${fmtDeadline(t.deadline)}</div>
        </div>
        ${chipHtml(t.status)}
      </div>
    `).join('');
  }

  /* ── Recent point log ────────────────────────────────────── */
  const logEl  = document.getElementById('recent-log');
  const recent = (logs || []).slice(0, 10);

  if (recent.length === 0) {
    logEl.innerHTML = '<div class="empty-state">No recent activity found.</div>';
  } else {
    logEl.innerHTML = recent.map(l => `
      <div class="log-item">
        <div class="log-left">
          <div class="log-reason">${l.reason || l.category}</div>
          <div class="log-time">${timeAgo(l.timestamp)}</div>
        </div>
        <div class="log-pts ${l.event_type}">${l.event_type === 'earn' ? '+' : '−'}${l.points}</div>
      </div>
    `).join('');
  }

  /* ── Trophy cabinet ──────────────────────────────────────── */
  const trophies = [
    { icon: '🏅', name: 'First Login',    unlocked: true },
    { icon: '🔥', name: 'Week Streak',    unlocked: (member.streak_presence || 0) >= 1 },
    { icon: '⚡', name: '2-Week Streak',  unlocked: (member.streak_presence || 0) >= 2 },
    { icon: '🏆', name: 'Hero of Week',   unlocked: member.points_this_week > 50 },
    { icon: '👑', name: 'Hero of Month',  unlocked: (member.points_this_month || 0) >= 300 },
    { icon: '💎', name: 'Shadow Monarch', unlocked: rank.code === 'SS' },
    { icon: '📋', name: 'Quest Master',   unlocked: (tasks || []).filter(t => t.status === 'rated').length >= 5 },
    { icon: '🌟', name: 'Top Performer',  unlocked: myPos === 0 },
  ];

  document.getElementById('trophy-grid').innerHTML = trophies.map(tr => `
    <div class="trophy-item ${tr.unlocked ? 'unlocked' : 'locked'}">
      <div class="trophy-icon">${tr.icon}</div>
      <div class="trophy-name">${tr.name}</div>
    </div>
  `).join('');

  /* ── Mini leaderboard ────────────────────────────────────── */
  const lbEl = document.getElementById('mini-leaderboard');
  const top  = weeklyLb.slice(0, 8);

  if (top.length === 0) {
    lbEl.innerHTML = '<div class="empty-state">No ranking data yet.</div>';
  } else {
    const posClass = (i) => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const badge    = (r) => {
      const rr = rankFor(r.points_total);
      return `<div class="lb-badge" style="border-color:${rr.color};color:${rr.color}">${rr.code}</div>`;
    };
    lbEl.innerHTML = top.map((m, i) => `
      <div class="lb-row">
        <div class="lb-pos ${posClass(i)}">${i + 1}</div>
        ${badge(m)}
        <div class="lb-name-block">
          <div class="lb-name">${m.name}</div>
          ${m.id === member.id ? '<div class="lb-you">You</div>' : ''}
        </div>
        <div class="lb-pts">${m.points_this_week || 0}</div>
      </div>
    `).join('');
  }

  /* ── Team Hunter Chart ───────────────────────────────────── */
  buildChart(allMembers, member.id);

})();

/* ── Chart builder ──────────────────────────────────────────── */
function buildChart(members, myId) {
  if (!members || members.length === 0) return;

  const RANK_TABLE = [
    { code: 'E',  lo: 0,   hi: 99,  label: 'Unranked Hunter', color: '#8A93A8' },
    { code: 'D',  lo: 100, hi: 149, label: 'Bronze Hunter',   color: '#CD7F32' },
    { code: 'C',  lo: 150, hi: 199, label: 'Iron Hunter',     color: '#B0B0B0' },
    { code: 'B',  lo: 200, hi: 249, label: 'Silver Hunter',   color: '#4FC3F7' },
    { code: 'A',  lo: 250, hi: 299, label: 'Gold Hunter',     color: '#FFD700' },
    { code: 'S',  lo: 300, hi: 399, label: 'Platinum Hunter', color: '#00E5FF' },
    { code: 'SS', lo: 400, hi: null,label: 'Shadow Monarch',  color: '#9A7BFF' },
  ];

  function rankFor(pts) {
    return RANK_TABLE.find(r => r.hi === null ? pts >= r.lo : pts >= r.lo && pts <= r.hi) || RANK_TABLE[0];
  }

  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  const sorted  = [...members].sort((a, b) => b.points_total - a.points_total);
  const labels  = sorted.map(m => m.name.split(' ')[0]);
  const points  = sorted.map(m => m.points_total);
  const ranks   = sorted.map(m => rankFor(m.points_total));
  const colors  = ranks.map(r => r.color + 'BB');
  const borders = ranks.map(r => r.color);

  /* Threshold annotation lines */
  const thresholds = [
    { y: 100, label: 'D Rank', color: '#CD7F32' },
    { y: 200, label: 'B Rank', color: '#4FC3F7' },
    { y: 300, label: 'S Rank / Hero', color: '#00E5FF' },
    { y: 400, label: 'SS Rank', color: '#9A7BFF' },
  ];

  const ctx = document.getElementById('hunter-chart').getContext('2d');

  /* Custom plugin: draw avatars above bars */
  const avatarPlugin = {
    id: 'avatarPlugin',
    afterDatasetsDraw(chart) {
      const { ctx: c, data } = chart;
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((bar, i) => {
        const x   = bar.x;
        const y   = bar.y;
        const r   = 14;
        const name  = sorted[i].name;
        const color = ranks[i].color;
        const init  = initials(name);

        c.save();
        c.beginPath();
        c.arc(x, y - r - 4, r, 0, Math.PI * 2);
        c.fillStyle = color + '33';
        c.strokeStyle = color;
        c.lineWidth = 1.5;
        c.fill();
        c.stroke();
        c.clip();

        c.fillStyle = color;
        c.font = 'bold 10px Bebas Neue, sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(init, x, y - r - 4);
        c.restore();
      });
    }
  };

  /* Threshold lines plugin */
  const thresholdPlugin = {
    id: 'thresholdPlugin',
    beforeDatasetsDraw(chart) {
      const { ctx: c, chartArea: { left, right }, scales: { y } } = chart;
      thresholds.forEach(th => {
        const yPos = y.getPixelForValue(th.y);
        if (yPos < chart.chartArea.top || yPos > chart.chartArea.bottom) return;
        c.save();
        c.beginPath();
        c.setLineDash([4, 6]);
        c.strokeStyle = th.color + '44';
        c.lineWidth   = 1;
        c.moveTo(left, yPos);
        c.lineTo(right, yPos);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = th.color + '88';
        c.font = '9px Inter, sans-serif';
        c.textAlign = 'right';
        c.fillText(th.label, right - 4, yPos - 3);
        c.restore();
      });
    }
  };

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data:            points,
        backgroundColor: colors,
        borderColor:     borders,
        borderWidth:     2,
        borderRadius:    6,
        borderSkipped:   false,
        hoverBackgroundColor: borders.map(c => c + 'EE'),
        hoverBorderColor:     borders,
        hoverBorderWidth:     2,
      }]
    },
    plugins: [avatarPlugin, thresholdPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart',
      },
      layout: {
        padding: { top: 36, bottom: 0 }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },  /* custom tooltip below */
      },
      scales: {
        x: {
          grid: { display: false },
          border: { color: 'rgba(79,195,247,0.08)' },
          ticks: {
            color: '#8A8AA3',
            font: { family: 'Inter', size: 11 },
          }
        },
        y: {
          min: 0,
          suggestedMax: Math.max(450, Math.max(...points) + 50),
          grid: {
            color: 'rgba(79,195,247,0.05)',
            drawTicks: false,
          },
          border: { dash: [4, 4], color: 'transparent' },
          ticks: {
            color: '#4A4A6A',
            font: { family: 'Inter', size: 10 },
            padding: 8,
          }
        }
      },
      onHover(evt, elements) {
        const tip = document.getElementById('chart-tooltip');
        if (!elements || elements.length === 0) {
          tip.style.display = 'none';
          return;
        }
        const idx = elements[0].index;
        const m   = sorted[idx];
        const r   = ranks[idx];
        tip.style.display = 'block';
        tip.style.left    = `${evt.native.clientX + 14}px`;
        tip.style.top     = `${evt.native.clientY - 70}px`;
        document.getElementById('tip-rank').textContent = r.code;
        document.getElementById('tip-rank').style.color = r.color;
        document.getElementById('tip-name').textContent = m.name;
        document.getElementById('tip-pts').textContent  = `${m.points_total} pts`;
        document.getElementById('tip-label').textContent = r.label;
      }
    }
  });

  /* Hide tooltip when mouse leaves canvas */
  document.getElementById('hunter-chart').addEventListener('mouseleave', () => {
    document.getElementById('chart-tooltip').style.display = 'none';
  });
}
