(async function () {
  const auth = requireAuth(['member', 'coordinator', 'admin']);
  if (!auth) return;

  document.getElementById('sidebar').innerHTML = buildSidebar('/point-log.html', auth.role);
  document.getElementById('user-chip').textContent = `${auth.name} · ${auth.role.toUpperCase()}`;

  let memberNames = {};
  try {
    if (auth.role !== 'member') {
      const members = await api.listMembers();
      memberNames = Object.fromEntries(members.map((m) => [m.id, m.name]));
    }
  } catch (e) {}

  function loggerName(id) {
    return memberNames[id] || (id === auth.memberId ? auth.name : `Staff #${id}`);
  }

  const logs = await api.memberPointLog(auth.memberId);
  const body = document.getElementById('log-body');
  const empty = document.getElementById('log-empty');

  if (logs.length === 0) {
    empty.style.display = 'block';
    return;
  }

  body.innerHTML = logs
    .map(
      (l) => `
    <tr>
      <td>${formatDate(l.timestamp)}</td>
      <td class="chip chip-${l.event_type}">${l.event_type}</td>
      <td>${l.category}</td>
      <td>${l.event_type === 'earn' ? '+' : '-'}${l.points}</td>
      <td>${l.reason || '—'}</td>
      <td>${loggerName(l.logged_by)}</td>
    </tr>
  `
    )
    .join('');
})();
