(async function () {
  const auth = requireAuth(['member', 'coordinator', 'admin']);
  if (!auth) return;

  document.getElementById('sidebar').innerHTML = buildSidebar('/dashboard.html', auth.role);
  document.getElementById('user-chip').textContent = `${auth.name} · ${auth.role.toUpperCase()}`;

  function startOfWeek() {
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday start
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  try {
    const [me, tasks, logs, weekly] = await Promise.all([
      api.me(),
      api.listTasks(),
      api.memberPointLog(requireAuth().memberId),
      api.leaderboardWeekly(),
    ]);

    // Rank card
    document.getElementById('rank-badge-slot').innerHTML = rankBadgeHtml(me.rank);
    document.getElementById('rank-label').textContent = RANK_LABELS[me.rank] || '';
    animateCountUp(document.getElementById('points-total'), me.points_total);
    const toNext = pointsToNextRank(me.points_total);
    const pct = Math.max(5, Math.min(100, 100 - (toNext / 50) * 100));
    document.getElementById('rank-progress').style.width = `${pct}%`;
    document.getElementById('rank-next-text').textContent =
      toNext > 0 ? `${toNext} pts to next rank` : 'Max rank achieved';

    // Streaks
    const presenceEl = document.getElementById('presence-streak');
    const taskStreakEl = document.getElementById('task-streak');
    presenceEl.querySelector('span:last-child').textContent = `Presence Streak: ${me.streak_presence} wk`;
    taskStreakEl.querySelector('span:last-child').textContent = `Task Reporting Streak: ${me.streak_task_reporting} wk`;
    if (me.streak_presence > 0) presenceEl.classList.add('active');
    if (me.streak_task_reporting > 0) taskStreakEl.classList.add('active');

    // Point summary (approx from log, current week)
    const weekStart = startOfWeek();
    const weekLogs = logs.filter((l) => new Date(l.timestamp) >= weekStart);
    const earned = weekLogs.filter((l) => l.event_type === 'earn').reduce((s, l) => s + l.points, 0);
    const lost = weekLogs.filter((l) => l.event_type === 'deduct').reduce((s, l) => s + l.points, 0);
    document.getElementById('earned-week').textContent = earned;
    const netEl = document.getElementById('net-week');
    netEl.textContent = earned - lost;
    netEl.className = `stat-value ${earned - lost >= 0 ? 'positive' : 'negative'}`;
    document.getElementById('monthly-total').textContent = me.points_this_month;

    // Mini leaderboard
    const idx = weekly.findIndex((m) => m.id === me.id);
    document.getElementById('mini-leaderboard').innerHTML =
      idx >= 0
        ? `<div class="stat-value glow-text-blue">#${idx + 1}</div><div style="color:var(--text-dim); font-size:13px;">of ${weekly.length} hunters this week</div>`
        : '<div class="empty-state">No ranking yet</div>';

    // Today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const todayTasks = tasks.filter((t) => {
      if (t.assigned_to !== me.id || !t.deadline) return false;
      const d = new Date(t.deadline);
      return d >= today && d < tomorrow;
    });

    const taskContainer = document.getElementById('today-tasks');
    if (todayTasks.length === 0) {
      taskContainer.innerHTML = '<div class="empty-state">No tasks due today</div>';
    } else {
      taskContainer.innerHTML = todayTasks
        .map(
          (t) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div>
            <div>${t.title}</div>
            <div style="color:var(--text-dim); font-size:12px;">${t.duration_hrs}h · Priority ${t.priority}</div>
          </div>
          ${statusChip(t.status)}
        </div>
      `
        )
        .join('');
    }

    // Recent point log
    const logContainer = document.getElementById('recent-log');
    const recent = logs.slice(0, 10);
    if (recent.length === 0) {
      logContainer.innerHTML = '<div class="empty-state">No point events yet</div>';
    } else {
      logContainer.innerHTML = recent
        .map(
          (l) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div>
            <div>${l.reason || l.category}</div>
            <div style="color:var(--text-dim); font-size:12px;">${formatDate(l.timestamp)}</div>
          </div>
          <div class="chip chip-${l.event_type}">${l.event_type === 'earn' ? '+' : '-'}${l.points}</div>
        </div>
      `
        )
        .join('');
    }
  } catch (err) {
    console.error(err);
  }
})();
