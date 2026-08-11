(async function () {
  const auth = requireAuth(['member', 'coordinator', 'admin']);
  if (!auth) return;

  document.getElementById('sidebar').innerHTML = buildSidebar('/leaderboard.html', auth.role);
  document.getElementById('user-chip').textContent = `${auth.name} · ${auth.role.toUpperCase()}`;

  const listEl = document.getElementById('leaderboard-list');
  const heroEl = document.getElementById('hero-banner');
  const tabs = document.querySelectorAll('.tab');
  let currentTab = 'weekly';

  function frameClass(idx) {
    if (idx === 0) return 'top-1';
    if (idx === 1) return 'top-2';
    if (idx === 2) return 'top-3';
    return '';
  }

  function pointsFor(m, tab) {
    return tab === 'weekly' ? m.points_this_week : m.points_this_month;
  }

  async function render(tab) {
    currentTab = tab;
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));

    const [members, heroes] = await Promise.all([
      tab === 'weekly' ? api.leaderboardWeekly() : api.leaderboardMonthly(),
      api.heroOfMonth(),
    ]);

    if (tab === 'weekly' && members.length > 0) {
      const hero = members[0];
      heroEl.innerHTML = `
        <div class="hero-banner">
          <span style="font-size:32px;">👑</span>
          <div>
            <div class="card-title" style="margin-bottom:4px;">Hero of the Week</div>
            <div class="display glow-text-purple" style="font-size:20px;">${hero.name} — ${hero.points_this_week} pts</div>
          </div>
        </div>
      `;
    } else if (tab === 'monthly' && heroes.length > 0) {
      heroEl.innerHTML = `
        <div class="hero-banner">
          <span style="font-size:32px;">👑</span>
          <div>
            <div class="card-title" style="margin-bottom:4px;">Hero of the Month (300+ pts)</div>
            <div class="display glow-text-purple" style="font-size:20px;">
              ${heroes.map((h) => `${h.name} (${h.points_this_month})`).join(', ')}
            </div>
          </div>
        </div>
      `;
    } else {
      heroEl.innerHTML = '';
    }

    if (members.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No members ranked yet</div>';
      return;
    }

    listEl.innerHTML = members
      .map(
        (m, idx) => `
      <div class="leaderboard-row ${frameClass(idx)}">
        <div class="lb-position">${idx + 1}</div>
        <div>${rankBadgeHtml(m.rank, 'sm')}</div>
        <div>
          <div>${m.name}</div>
          <div style="color:var(--text-dim); font-size:12px;">${RANK_LABELS[m.rank]}</div>
        </div>
        <div class="display" style="font-size:18px;">${pointsFor(m, tab)} pts</div>
        <div class="streak-flame ${m.streak_presence > 0 ? 'active' : ''}">
          🔥 ${m.streak_presence}
        </div>
      </div>
    `
      )
      .join('');
  }

  tabs.forEach((t) => t.addEventListener('click', () => render(t.dataset.tab)));

  render('weekly');
})();
