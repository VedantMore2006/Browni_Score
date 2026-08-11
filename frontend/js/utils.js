const RANK_LABELS = {
  E: 'Unranked Hunter',
  D: 'Bronze Hunter',
  C: 'Iron Hunter',
  B: 'Silver Hunter',
  A: 'Gold Hunter',
  S: 'Platinum Hunter',
  SS: 'Shadow Monarch',
};

const RANK_THRESHOLDS = [
  ['E', 0, 99],
  ['D', 100, 149],
  ['C', 150, 199],
  ['B', 200, 249],
  ['A', 250, 299],
  ['S', 300, 399],
  ['SS', 400, Infinity],
];

function pointsToNextRank(points) {
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    const [code, lo, hi] = RANK_THRESHOLDS[i];
    if (points >= lo && points <= hi) {
      if (i === RANK_THRESHOLDS.length - 1) return 0;
      return RANK_THRESHOLDS[i + 1][1] - points;
    }
  }
  return 0;
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusChip(status) {
  return `<span class="chip chip-${status}">${status.replace('_', ' ')}</span>`;
}

function requireAuth(allowedRoles) {
  const token = localStorage.getItem('vv_token');
  const role = localStorage.getItem('vv_role');
  if (!token) {
    window.location.href = '/index.html';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    window.location.href = '/dashboard.html';
    return null;
  }
  return {
    token,
    role,
    memberId: parseInt(localStorage.getItem('vv_member_id'), 10),
    name: localStorage.getItem('vv_name'),
  };
}

function logout() {
  localStorage.removeItem('vv_token');
  localStorage.removeItem('vv_role');
  localStorage.removeItem('vv_member_id');
  localStorage.removeItem('vv_name');
  window.location.href = '/index.html';
}

function animateCountUp(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (target - start) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function rankBadgeHtml(rank, size) {
  const cls = size === 'sm' ? 'rank-badge rank-badge-sm' : 'rank-badge';
  return `<span class="${cls} rank-${rank}">${rank}</span>`;
}

function buildSidebar(active, role) {
  const links = [
    { href: '/dashboard.html', label: 'Dashboard', roles: ['member', 'coordinator', 'admin'] },
    { href: '/tasks.html', label: 'Task Sheet', roles: ['member', 'coordinator', 'admin'] },
    { href: '/leaderboard.html', label: 'Leaderboard', roles: ['member', 'coordinator', 'admin'] },
    { href: '/point-log.html', label: 'Point Log', roles: ['member', 'coordinator', 'admin'] },
    { href: '/rules.html', label: 'Rules', roles: ['member', 'coordinator', 'admin'] },
    { href: '/admin/assign-tasks.html', label: 'Assign Tasks', roles: ['coordinator', 'admin'] },
    { href: '/admin/dashboard.html', label: 'Admin Panel', roles: ['admin'] },
    { href: '/admin/members.html', label: 'Members', roles: ['admin'] },
  ];

  const items = links
    .filter((l) => l.roles.includes(role))
    .map(
      (l) =>
        `<a class="nav-link ${l.href === active ? 'active' : ''}" href="${l.href}">${l.label}</a>`
    )
    .join('');

  return `
    <div class="sidebar-logo">VITALS<span>&VECTORS</span></div>
    ${items}
    <a class="nav-link" href="#" onclick="logout(); return false;">Log Out</a>
  `;
}
