// ─── SIDEBAR COLLAPSE ─────────────────────────────────
document.getElementById('collapseBtn').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  const ic = document.getElementById('collapseIcon');
  sb.classList.toggle('collapsed');
  ic.innerHTML = sb.classList.contains('collapsed')
    ? '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="14 9 17 12 14 15"/>'
    : '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="16 15 13 12 16 9"/>';
});

// ─── MOCK DATA ─────────────────────────────────────────
const TODAY = '2026-08-16';

const PROJECTS = [
  { id: 'mindspace', name: 'MindSpace', lead: 'Ganesh', members: ['Vedant', 'Nakul', 'Ashutosh', 'Nandini', 'Prerna', 'Swapnil', 'Krishna'], color: '#4FC3F7' },
  { id: 'neurovi', name: 'NeuroVisualisAI', lead: 'Ganesh', members: ['Vedant', 'Nakul', 'Ashutosh', 'Swapnil'], color: '#4FC3F7' },
  { id: 'nutrisure', name: 'NutriSure', lead: 'Deepavali', members: ['Vishal', 'Vedant', 'Prem'], color: '#00E5FF' },
  { id: 'solobeauty', name: 'SoloBeauty', lead: 'Santosh', members: ['Prem', 'Prerna'], color: '#9A7BFF' },
  { id: 'skillsense', name: 'SkillSense', lead: 'Swapnil', members: ['Komal', 'Deepavali', 'Ashutosh', 'Shreya', 'Prem'], color: '#FFB300' },
  { id: 'lms', name: 'LMS', lead: 'Swapnil', members: ['Prem', 'Swapnil', 'Komal', 'Shreya'], color: '#FFB300' },
  { id: 'website', name: 'Website', lead: 'Debaditya', members: ['Suraj', 'Ashutosh', 'Umesh'], color: '#FF1744' },
  { id: 'socialmedia', name: 'LinkedIn / Social Media', lead: 'Debaditya', members: ['Ashutosh', 'Suraj'], color: '#FF1744' },
  { id: 'ezest', name: 'E-Zest', lead: 'Santosh', members: ['Ganesh', 'Vedant', 'Nikita', 'Nakul', 'Prerna', 'Ashutosh', 'Swapnil', 'Nandini'], color: '#9A7BFF' },
  { id: 'funday', name: 'Fun Day', lead: 'Nikita', members: ['Deepavali', 'Prerna'], color: '#00E5FF' },
  { id: 'demoday', name: 'Demo Day', lead: 'Deepavali', members: ['Prerna'], color: '#00E5FF' },
  { id: 'learningtime', name: 'Learning Time', lead: 'Vedant', members: [], color: '#4FC3F7' },
  { id: 'premises', name: 'Premises', lead: 'Deepavali', members: ['Prem'], color: '#00E5FF' },
];

const ALL_TASKS = [
  { id:1,  projectId:'mindspace',   title:'Implement user onboarding flow',    lead:'Ganesh',    assignedTo:'Vedant',   deadline:'2026-08-20', priority:1, status:'in_progress', rating:null },
  { id:2,  projectId:'mindspace',   title:'Fix session timeout bug',            lead:'Ganesh',    assignedTo:'Nakul',    deadline:'2026-08-16', priority:1, status:'completed',   rating:null },
  { id:3,  projectId:'mindspace',   title:'Design dashboard wireframes',        lead:'Ganesh',    assignedTo:'Nandini',  deadline:'2026-08-18', priority:2, status:'rated',       rating:'exceeds' },
  { id:4,  projectId:'neurovi',     title:'Train classification model v2',      lead:'Ganesh',    assignedTo:'Ashutosh', deadline:'2026-08-22', priority:1, status:'in_progress', rating:null },
  { id:5,  projectId:'neurovi',     title:'Write model evaluation report',      lead:'Ganesh',    assignedTo:'Vedant',   deadline:'2026-08-19', priority:2, status:'pending',     rating:null },
  { id:6,  projectId:'nutrisure',   title:'Build nutrition tracking API',       lead:'Deepavali', assignedTo:'Prem',     deadline:'2026-08-21', priority:1, status:'in_progress', rating:null },
  { id:7,  projectId:'nutrisure',   title:'Create meal recommendation logic',   lead:'Deepavali', assignedTo:'Vishal',   deadline:'2026-08-17', priority:2, status:'rated',       rating:'meets' },
  { id:8,  projectId:'solobeauty',  title:'Product catalogue UI',               lead:'Santosh',   assignedTo:'Prem',     deadline:'2026-08-20', priority:2, status:'pending',     rating:null },
  { id:9,  projectId:'skillsense',  title:'Course module drag-and-drop',        lead:'Swapnil',   assignedTo:'Komal',    deadline:'2026-08-18', priority:1, status:'completed',   rating:null },
  { id:10, projectId:'skillsense',  title:'Integrate payment gateway',          lead:'Swapnil',   assignedTo:'Ashutosh', deadline:'2026-08-23', priority:1, status:'pending',     rating:null },
  { id:11, projectId:'lms',         title:'Student progress dashboard',         lead:'Swapnil',   assignedTo:'Shreya',   deadline:'2026-08-19', priority:2, status:'rated',       rating:'needs_revision' },
  { id:12, projectId:'website',     title:'SEO meta tags for all pages',        lead:'Debaditya', assignedTo:'Suraj',    deadline:'2026-08-16', priority:2, status:'completed',   rating:null },
  { id:13, projectId:'website',     title:'Contact form backend integration',   lead:'Debaditya', assignedTo:'Ashutosh', deadline:'2026-08-20', priority:1, status:'in_progress', rating:null },
  { id:14, projectId:'socialmedia', title:'Draft 4 LinkedIn posts for August',  lead:'Debaditya', assignedTo:'Suraj',    deadline:'2026-08-17', priority:2, status:'rated',       rating:'exceeds' },
  { id:15, projectId:'ezest',       title:'Workshop logistics planning',         lead:'Santosh',   assignedTo:'Prerna',   deadline:'2026-08-22', priority:2, status:'pending',     rating:null },
  { id:16, projectId:'funday',      title:'Finalize venue and schedule',        lead:'Nikita',    assignedTo:'Deepavali',deadline:'2026-08-18', priority:1, status:'in_progress', rating:null },
  { id:17, projectId:'demoday',     title:'Prepare stakeholder presentations',  lead:'Deepavali', assignedTo:'Prerna',   deadline:'2026-08-25', priority:1, status:'pending',     rating:null },
  { id:18, projectId:'premises',    title:'Test attendance sync feature',       lead:'Deepavali', assignedTo:'Prem',     deadline:'2026-08-19', priority:1, status:'completed',   rating:null },
  { id:19, projectId:'mindspace',   title:'Setup analytics tracking dashboard', lead:'Ganesh',    assignedTo:'Krishna',  deadline:'2026-08-21', priority:2, status:'in_progress', rating:null },
  { id:20, projectId:'website',     title:'Update laboratory documentation',    lead:'Debaditya', assignedTo:'Umesh',    deadline:'2026-08-22', priority:2, status:'pending',     rating:null },
];

// Real team roster with points data (matches leaderboard.html / point-log.html)
const MEMBERS = [
  { name: 'Ganesh', init: 'GA', pts_week: 70, pts_month: 320, streak: 4, rank: 's', warnings: 0, status: 'active' },
  { name: 'Debaditya', init: 'DE', pts_week: 65, pts_month: 298, streak: 3, rank: 'a', warnings: 0, status: 'active' },
  { name: 'Deepavali', init: 'DW', pts_week: 58, pts_month: 260, streak: 3, rank: 'a', warnings: 0, status: 'active' },
  { name: 'Nandini', init: 'NA', pts_week: 55, pts_month: 245, streak: 3, rank: 'b', warnings: 0, status: 'active' },
  { name: 'Swapnil', init: 'SW', pts_week: 48, pts_month: 220, streak: 2, rank: 'b', warnings: 0, status: 'active' },
  { name: 'Suraj', init: 'SU', pts_week: 45, pts_month: 210, streak: 2, rank: 'b', warnings: 0, status: 'active' },
  { name: 'Santosh', init: 'SA', pts_week: 40, pts_month: 195, streak: 2, rank: 'c', warnings: 1, status: 'active' },
  { name: 'Nikita', init: 'NK', pts_week: 38, pts_month: 185, streak: 2, rank: 'c', warnings: 0, status: 'active' },
  { name: 'Vedant', init: 'VE', pts_week: 35, pts_month: 170, streak: 2, rank: 'c', warnings: 0, status: 'active' },
  { name: 'Nakul', init: 'NC', pts_week: 30, pts_month: 155, streak: 1, rank: 'c', warnings: 0, status: 'active' },
  { name: 'Ashutosh', init: 'AS', pts_week: 28, pts_month: 140, streak: 1, rank: 'd', warnings: 1, status: 'active' },
  { name: 'Vishal', init: 'VS', pts_week: 25, pts_month: 130, streak: 1, rank: 'd', warnings: 0, status: 'active' },
  { name: 'Komal', init: 'KO', pts_week: 22, pts_month: 118, streak: 1, rank: 'd', warnings: 0, status: 'active' },
  { name: 'Prerna', init: 'PR', pts_week: 20, pts_month: 110, streak: 1, rank: 'd', warnings: 2, status: 'active' },
  { name: 'Shreya', init: 'SH', pts_week: 18, pts_month: 100, streak: 0, rank: 'd', warnings: 0, status: 'active' },
  { name: 'Prem', init: 'PM', pts_week: 15, pts_month: 88, streak: 0, rank: 'e', warnings: 0, status: 'active' },
  { name: 'Krishna', init: 'KR', pts_week: 12, pts_month: 72, streak: 0, rank: 'e', warnings: 2, status: 'active' },
  { name: 'Umesh', init: 'UM', pts_week: 8, pts_month: 45, streak: 0, rank: 'e', warnings: 0, status: 'active' },
];

const RANK_COLORS = { ss:'#9A7BFF', s:'#00E5FF', a:'#FFD700', b:'#4FC3F7', c:'#B0B0B0', d:'#CD7F32', e:'#8A93A8' };

// Attendance today — one entry per MEMBERS roster member (mock; no real
// Premises-app integration yet, see docs/SYSTEM_CONTEXT.md).
const ATTENDANCE_TODAY = MEMBERS.map(m => {
  let status = 'present';
  if (m.name === 'Shreya') status = 'late';
  if (m.name === 'Umesh') status = 'absent';
  if (m.name === 'Krishna') status = 'on_leave';
  return { name: m.name, status };
});

// 7-day task-status trend — no per-day history array exists yet anywhere
// in the codebase, so this is mocked to converge on today's real ALL_TASKS
// totals on the last day.
const TASK_TREND = [
  { date: '2026-08-10', completed: 3, in_progress: 2, pending: 6, overdue: 1 },
  { date: '2026-08-11', completed: 4, in_progress: 3, pending: 6, overdue: 1 },
  { date: '2026-08-12', completed: 5, in_progress: 3, pending: 5, overdue: 1 },
  { date: '2026-08-13', completed: 6, in_progress: 4, pending: 5, overdue: 0 },
  { date: '2026-08-14', completed: 7, in_progress: 4, pending: 5, overdue: 0 },
  { date: '2026-08-15', completed: 7, in_progress: 5, pending: 5, overdue: 0 },
  { date: '2026-08-16', completed: 8, in_progress: 5, pending: 5, overdue: 0 },
];

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

init();

// Redraw charts if this page is restored from the browser's back/forward
// cache (bfcache) instead of being freshly loaded — canvases aren't
// reliably repainted on bfcache restore otherwise.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) init();
});
