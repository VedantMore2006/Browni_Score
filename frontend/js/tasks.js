(async function () {
  const auth = requireAuth(['member', 'coordinator', 'admin']);
  if (!auth) return;

  document.getElementById('sidebar').innerHTML = buildSidebar('/tasks.html', auth.role);
  document.getElementById('user-chip').textContent = `${auth.name} · ${auth.role.toUpperCase()}`;

  let memberNames = {};
  try {
    if (auth.role !== 'member') {
      const members = await api.listMembers();
      memberNames = Object.fromEntries(members.map((m) => [m.id, m.name]));
    }
  } catch (e) {}

  function assignerName(id) {
    return memberNames[id] || `Staff #${id}`;
  }

  async function render() {
    const tasks = await api.listTasks();
    const body = document.getElementById('tasks-body');
    const empty = document.getElementById('tasks-empty');

    if (tasks.length === 0) {
      body.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    body.innerHTML = tasks
      .map(
        (t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${t.title}</td>
        <td>${t.duration_hrs}</td>
        <td>${formatDate(t.deadline)}</td>
        <td>${assignerName(t.assigned_by)}</td>
        <td>${statusChip(t.status)}</td>
        <td>${t.points_awarded || '—'}</td>
        <td>
          ${
            auth.role === 'member' && t.status === 'pending'
              ? `<button class="btn" data-complete="${t.id}">Claim Quest Clear</button>`
              : ''
          }
        </td>
      </tr>
    `
      )
      .join('');

    body.querySelectorAll('[data-complete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
        try {
          await api.completeTask(btn.dataset.complete);
          await render();
        } catch (err) {
          alert(err.message);
          btn.disabled = false;
          btn.textContent = 'Claim Quest Clear';
        }
      });
    });
  }

  render();
})();
