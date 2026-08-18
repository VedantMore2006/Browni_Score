// ─── SIDEBAR COLLAPSE ─────────────────────────────────
document.getElementById('collapseBtn').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  const ic = document.getElementById('collapseIcon');
  sb.classList.toggle('collapsed');
  ic.innerHTML = sb.classList.contains('collapsed')
    ? '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="14 9 17 12 14 15"/>'
    : '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="16 15 13 12 16 9"/>';
});

// ─── API DATA (replaces mock arrays) ───────────────────
const TODAY = new Date().toISOString().slice(0, 10);

// Will be populated from API
let PROJECTS = [];
let ALL_TASKS = [];
let MEMBERS = [];


// (populated async)
const RANK_COLORS = { ss:'#9A7BFF', s:'#00E5FF', a:'#FFD700', b:'#4FC3F7', c:'#B0B0B0', d:'#CD7F32', e:'#8A93A8' };

// Attendance today — Premises integration pending; keep as mock
let ATTENDANCE_TODAY = [];

// Task trend — computed from real tasks (last 7 days by created_at)
let TASK_TREND = [];

// ─── API → local shape adapters ────────────────────────
function adaptMember(m) {
  return {
    name: m.name,
    init: m.name.slice(0, 2).toUpperCase(),
    pts_week:  m.points_this_week,
    pts_month: m.points_this_month,
    streak:    m.streak_presence,
    rank:      m.rank.toLowerCase(),
    warnings:  m.warnings_count,
    status:    m.status,
  };
}

function adaptTask(t) {
  return {
    id:         t.id,
    projectId:  t.project_id,
    title:      t.title,
    lead:       t.project_lead_name || t.assigned_by_name,
    assignedTo: t.assigned_to_name,
    duration:   t.duration_hrs,
    deadline:   t.deadline ? t.deadline.slice(0, 10) : null,
    priority:   t.priority,
    status:     t.status,
    rating:     t.rating,
    points:     t.points_awarded,
  };
}

function buildTaskTrend(tasks) {
  // Build last-7-days snapshot from actual task statuses
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    days.push({
      date: ds,
      completed:   tasks.filter(t => (t.status === 'completed' || t.status === 'rated')).length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      pending:     tasks.filter(t => t.status === 'pending').length,
      overdue:     tasks.filter(t => t.deadline && t.deadline < ds && t.status !== 'completed' && t.status !== 'rated').length,
    });
  }
  return days;
}

// ─── CHART.JS HELPERS (ported from tasks.html) ─────────
if (!Chart.registry.plugins.get('centerText')) {
  Chart.register({
    id: 'centerText',
    afterDraw(chart) {
      const cfg = chart.config.options.plugins.centerText;
      if (!cfg) return;
      const { ctx, chartArea: { width, height, left, top } } = chart;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "700 20px 'Bebas Neue', sans-serif";
      ctx.fillStyle = cfg.color || '#e8f4ff';
      ctx.fillText(cfg.value, left + width / 2, top + height / 2 - 8);
      ctx.font = "700 9px 'Rajdhani', sans-serif";
      ctx.fillStyle = '#8899aa';
      ctx.fillText(cfg.label, left + width / 2, top + height / 2 + 10);
      ctx.restore();
    }
  });
}

function makeDonut(canvasId, labels, values, colors, centerValue, centerLabel) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '72%',
      plugins: { legend: { display: false }, centerText: { value: centerValue, label: centerLabel } }
    }
  });
}

function renderLegend(containerId, rows) {
  document.getElementById(containerId).innerHTML = rows.map(r => `
    <div class="legend-row">
      <div class="legend-dot" style="background:${r.color}"></div>
      <div class="legend-name">${r.name}</div>
      <div class="legend-val">${r.val}</div>
    </div>
  `).join('');
}

function priorityChip(p) {
  if (p === 1) return '<span class="chip chip-high">High</span>';
  if (p === 2) return '<span class="chip chip-medium">Medium</span>';
  return '<span class="chip chip-low">Low</span>';
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function medal(i) {
  return ['🥇', '🥈', '🥉'][i] || `#${i + 1}`;
}

// ─── RENDER FUNCTIONS ───────────────────────────────────
function renderKPIs() {
  const doneTasks = ALL_TASKS.filter(t => t.status === 'completed' || t.status === 'rated').length;
  const pct = ALL_TASKS.length ? Math.round(doneTasks / ALL_TASKS.length * 100) : 0;
  document.getElementById('kpi-members').innerText = MEMBERS.length;
  document.getElementById('kpi-projects').innerText = PROJECTS.length;
  document.getElementById('kpi-tasks').innerText = ALL_TASKS.length;
  document.getElementById('kpi-completed').innerText = doneTasks;
  document.getElementById('kpi-completed-pct').innerText = `${pct}% overall completion`;
}

let taskTrendChart = null;
function renderTaskTrendChart() {
  const ctx = document.getElementById('taskTrendChart').getContext('2d');
  if (taskTrendChart) { taskTrendChart.destroy(); taskTrendChart = null; }

  const series = [
    { key: 'completed', label: 'Completed', color: '#00e676' },
    { key: 'in_progress', label: 'In Progress', color: '#00c8ff' },
    { key: 'pending', label: 'Pending', color: '#f5a623' },
    { key: 'overdue', label: 'Overdue', color: '#ff3b5c' },
  ];

  taskTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: TASK_TREND.map(d => fmtDate(d.date)),
      datasets: series.map(s => ({
        label: s.label,
        data: TASK_TREND.map(d => d[s.key]),
        borderColor: s.color,
        backgroundColor: s.color,
        pointBackgroundColor: s.color,
        pointRadius: 3,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top', align: 'end',
          labels: { color: '#8899aa', font: { family: 'Rajdhani', size: 11, weight: '600' }, boxWidth: 10, usePointStyle: true, pointStyle: 'circle' }
        },
        tooltip: {
          backgroundColor: 'rgba(8,15,30,0.95)', borderColor: 'rgba(0,200,255,0.3)', borderWidth: 1,
          titleColor: '#00c8ff', bodyColor: '#8899aa',
          titleFont: { family: 'Orbitron', size: 11, weight: '700' },
          bodyFont: { family: 'Rajdhani', size: 12, weight: '600' },
          padding: 10,
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8899aa', font: { family: 'Rajdhani', size: 11, weight: '600' } } },
        y: { min: 0, grid: { color: 'rgba(0,200,255,0.05)' }, border: { display: false }, ticks: { color: '#445566', font: { family: 'Share Tech Mono', size: 10 }, stepSize: 4 } }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}

let attendanceChart = null;
function renderAttendanceDonut() {
  const counts = { present: 0, late: 0, absent: 0, on_leave: 0 };
  ATTENDANCE_TODAY.forEach(a => counts[a.status]++);
  const total = ATTENDANCE_TODAY.length;

  if (attendanceChart) { attendanceChart.destroy(); attendanceChart = null; }
  attendanceChart = makeDonut('attendanceChart',
    ['Present', 'Late', 'Absent', 'On Leave'],
    [counts.present, counts.late, counts.absent, counts.on_leave],
    ['#00e676', '#f5a623', '#ff3b5c', '#8899aa'],
    counts.present, 'PRESENT');

  const pct = n => total ? Math.round(n / total * 100) : 0;
  renderLegend('attendanceLegend', [
    { color: '#00e676', name: 'Present', val: `${counts.present} (${pct(counts.present)}%)` },
    { color: '#f5a623', name: 'Late', val: `${counts.late} (${pct(counts.late)}%)` },
    { color: '#ff3b5c', name: 'Absent', val: `${counts.absent} (${pct(counts.absent)}%)` },
    { color: '#8899aa', name: 'On Leave', val: `${counts.on_leave} (${pct(counts.on_leave)}%)` },
  ]);

  document.getElementById('attendanceRate').innerText = `${pct(counts.present)}%`;
}

function renderProjectOverview() {
  const projectProgress = PROJECTS.map(p => {
    const pTasks = ALL_TASKS.filter(t => t.projectId === p.id);
    const done = pTasks.filter(t => t.status === 'completed' || t.status === 'rated').length;
    return { p, total: pTasks.length, pct: pTasks.length ? Math.round(done / pTasks.length * 100) : 0 };
  }).filter(x => x.total > 0).sort((a, b) => b.pct - a.pct);

  document.getElementById('projectOverviewList').innerHTML = projectProgress.map(x => `
    <div class="dist-row">
      <div class="dist-label" style="color:${x.p.color}" title="${x.p.name}">${x.p.name}</div>
      <div class="dist-bar-track"><div class="dist-bar-fill" style="width:${x.pct}%; background:${x.p.color}"></div></div>
      <div class="dist-count">${x.pct}%</div>
    </div>
  `).join('');
}

function renderTopPerformers(containerId, key) {
  const sorted = [...MEMBERS].sort((a, b) => b[key] - a[key]).slice(0, 5);
  const max = sorted[0] ? sorted[0][key] : 1;
  document.getElementById(containerId).innerHTML = sorted.map((m, i) => {
    const color = RANK_COLORS[m.rank] || '#8899aa';
    const barPct = max ? Math.round(m[key] / max * 100) : 0;
    return `
      <div class="perf-row" onclick="window.location.href='hunter.html?name=' + encodeURIComponent('${m.name}')">
        <div class="perf-medal">${medal(i)}</div>
        <div class="perf-avatar" style="background:${color}22; border-color:${color}; color:${color}">${m.init}</div>
        <div class="perf-mid">
          <div class="perf-name">${m.name}</div>
          <div class="perf-bar-track"><div class="perf-bar-fill" style="width:${barPct}%; background:${color}"></div></div>
        </div>
        <div class="perf-pts">${m[key]} pts</div>
      </div>
    `;
  }).join('');
}

function renderUpcomingDeadlines() {
  const upcoming = ALL_TASKS
    .filter(t => t.status !== 'completed' && t.status !== 'rated' && t.deadline >= TODAY)
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 6);

  document.getElementById('upcomingList').innerHTML = upcoming.map(t => `
    <div class="ud-row">
      <div class="ud-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
      <div class="ud-date">${fmtDate(t.deadline)}</div>
      <div class="ud-info"><b>${t.title}</b> <span class="ud-member">(${t.assignedTo})</span></div>
      ${priorityChip(t.priority)}
    </div>
  `).join('');
}

let priorityChart = null;
function renderPriorityDonut() {
  const high = ALL_TASKS.filter(t => t.priority === 1).length;
  const medium = ALL_TASKS.filter(t => t.priority === 2).length;
  const low = ALL_TASKS.filter(t => t.priority !== 1 && t.priority !== 2 && t.priority != null).length;
  const none = ALL_TASKS.filter(t => t.priority == null).length;
  const total = ALL_TASKS.length;

  if (priorityChart) { priorityChart.destroy(); priorityChart = null; }
  priorityChart = makeDonut('priorityChart',
    ['High', 'Medium', 'Low', 'No Priority'],
    [high, medium, low, none],
    ['#ff3b5c', '#00c8ff', '#445566', '#2a2a3a'],
    total, 'TOTAL TASKS');

  const pct = n => total ? Math.round(n / total * 100) : 0;
  renderLegend('priorityLegend', [
    { color: '#ff3b5c', name: 'High Priority', val: `${high} (${pct(high)}%)` },
    { color: '#00c8ff', name: 'Medium Priority', val: `${medium} (${pct(medium)}%)` },
    { color: '#445566', name: 'Low Priority', val: `${low} (${pct(low)}%)` },
    { color: '#2a2a3a', name: 'No Priority', val: `${none} (${pct(none)}%)` },
  ]);
}

function init() {
  renderKPIs();
  renderTaskTrendChart();
  renderAttendanceDonut();
  renderProjectOverview();
  renderTopPerformers('perfWeekList', 'pts_week');
  renderTopPerformers('perfMonthList', 'pts_month');
  renderUpcomingDeadlines();
  renderPriorityDonut();
}

// ─── LOAD REAL DATA ─────────────────────────────────────
async function loadData() {
  try {
    const [rawMembers, rawTasks, rawProjects] = await Promise.all([
      fetch('http://localhost:8000/members').then(r => r.json()),
      fetch('http://localhost:8000/tasks').then(r => r.json()),
      fetch('http://localhost:8000/projects').then(r => r.json()),
    ]);

    MEMBERS   = rawMembers.map(adaptMember);
    ALL_TASKS = rawTasks.map(adaptTask);
    PROJECTS  = rawProjects;
    TASK_TREND = buildTaskTrend(ALL_TASKS);

    // Attendance still mocked — Premises not integrated
    ATTENDANCE_TODAY = MEMBERS.map(m => ({ name: m.name, status: 'present' }));

    init();
  } catch (e) {
    console.error('[Dashboard] API load failed:', e);
    // Render with empty arrays so UI at least shows zeroes
    init();
  }
}

loadData();

// Redraw charts if this page is restored from the browser's back/forward
// cache (bfcache) instead of being freshly loaded — canvases aren't
// reliably repainted on bfcache restore otherwise.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) loadData();
});
