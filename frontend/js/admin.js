// Shared admin script — wires whichever admin page is currently loaded
// based on which DOM elements are present.
(async function () {
  const auth = requireAuth(['admin', 'coordinator']);
  if (!auth) return;

  const activePath = window.location.pathname;
  document.getElementById('sidebar').innerHTML = buildSidebar(activePath, auth.role);
  document.getElementById('user-chip').textContent = `${auth.name} · ${auth.role.toUpperCase()}`;

  if (document.getElementById('team-body')) await initAdminDashboard();
  if (document.getElementById('members-body')) await initMembersPage();
  if (document.getElementById('assign-task-form')) await initAssignTasksPage();

  // ---------------- Admin Dashboard ----------------
  async function initAdminDashboard() {
    if (auth.role !== 'admin') {
      window.location.href = '/dashboard.html';
      return;
    }

    const [members, tasks, alerts, weekly, heroesMonth] = await Promise.all([
      api.listMembers(),
      api.listTasks(),
      api.adminAlerts(),
      api.leaderboardWeekly(),
      api.heroOfMonth(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dueTodayCount = (memberId) =>
      tasks.filter((t) => {
        if (t.assigned_to !== memberId || !t.deadline) return false;
        const d = new Date(t.deadline);
        return d >= today && d < tomorrow;
      }).length;

    document.getElementById('team-body').innerHTML = members
      .map(
        (m) => `
      <tr>
        <td>${m.name}</td>
        <td>${rankBadgeHtml(m.rank, 'sm')}</td>
        <td>${m.points_total}</td>
        <td>🔥 ${m.streak_presence}</td>
        <td>${dueTodayCount(m.id)}</td>
        <td>${statusChip(m.status)}</td>
        <td>
          <button class="btn" data-add="${m.id}" data-name="${m.name}">Add</button>
          <button class="btn btn-danger" data-deduct="${m.id}" data-name="${m.name}">Deduct</button>
          <button class="btn btn-purple" data-warn="${m.id}" data-name="${m.name}">Warn</button>
        </td>
      </tr>
    `
      )
      .join('');

    document.querySelectorAll('[data-add]').forEach((btn) =>
      btn.addEventListener('click', () => openPointModal(btn.dataset.add, btn.dataset.name, 'earn'))
    );
    document.querySelectorAll('[data-deduct]').forEach((btn) =>
      btn.addEventListener('click', () => openPointModal(btn.dataset.deduct, btn.dataset.name, 'deduct'))
    );
    document.querySelectorAll('[data-warn]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        const reason = prompt(`Reason for warning ${btn.dataset.name}?`);
        if (reason === null) return;
        try {
          await api.issueWarning({ member_id: parseInt(btn.dataset.warn, 10), reason });
          window.location.reload();
        } catch (err) {
          alert(err.message);
        }
      })
    );

    // Alerts
    const alertsPanel = document.getElementById('alerts-panel');
    const alertItems = [
      ...alerts.low_points.map((m) => `⚠ ${m.name} is below 100 pts (${m.points_total})`),
      ...alerts.two_warnings.map((m) => `⚠ ${m.name} has 2 warnings — one more triggers suspension`),
      ...alerts.overdue_tasks.map((t) => `⚠ Task "${t.title}" is overdue`),
    ];
    alertsPanel.innerHTML =
      alertItems.length > 0
        ? alertItems.map((a) => `<div class="alert-item">${a}</div>`).join('')
        : '<div class="empty-state">No alerts — all clear</div>';

    // Heroes
    const heroesPanel = document.getElementById('heroes-panel');
    const weeklyHero = weekly[0];
    heroesPanel.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="card-title">Weekly Hero</div>
        ${
          weeklyHero
            ? `<div class="display glow-text-purple">👑 ${weeklyHero.name} — ${weeklyHero.points_this_week} pts</div>`
            : '<div class="empty-state">No data yet</div>'
        }
      </div>
      <div>
        <div class="card-title">Monthly Heroes (300+ pts)</div>
        ${
          heroesMonth.length > 0
            ? heroesMonth
                .map((h) => `<div class="rank-badge rank-SS rank-badge-sm" style="margin-right:8px;">SS</div>${h.name} (${h.points_this_month})<br>`)
                .join('')
            : '<div class="empty-state">No hero of the month yet</div>'
        }
      </div>
    `;
  }

  let modalContext = null;
  function openPointModal(memberId, memberName, eventType) {
    modalContext = { memberId: parseInt(memberId, 10), eventType };
    document.getElementById('modal-title').textContent = `${eventType === 'earn' ? 'Add' : 'Deduct'} Points — ${memberName}`;
    document.getElementById('modal-backdrop').style.display = 'flex';
  }

  const modalConfirm = document.getElementById('modal-confirm');
  const modalCancel = document.getElementById('modal-cancel');
  if (modalConfirm) {
    modalConfirm.addEventListener('click', async () => {
      const category = document.getElementById('modal-category').value;
      const points = parseInt(document.getElementById('modal-points').value, 10);
      const reason = document.getElementById('modal-reason').value;
      try {
        await api.logPoints({
          member_id: modalContext.memberId,
          event_type: modalContext.eventType,
          category,
          points,
          reason,
        });
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    });
  }
  if (modalCancel) {
    modalCancel.addEventListener('click', () => {
      document.getElementById('modal-backdrop').style.display = 'none';
    });
  }

  // ---------------- Member Management ----------------
  async function initMembersPage() {
    if (auth.role !== 'admin') {
      window.location.href = '/dashboard.html';
      return;
    }

    async function renderMembers() {
      const members = await api.listMembers();
      document.getElementById('members-body').innerHTML = members
        .map(
          (m) => `
        <tr>
          <td>${m.name}</td>
          <td>${m.username}</td>
          <td>${m.role}</td>
          <td>${statusChip(m.status)}</td>
          <td>${formatDateShort(m.joined_date)}</td>
          <td>
            <button class="btn" data-reset="${m.id}">Reset PW</button>
            <button class="btn btn-danger" data-deactivate="${m.id}" ${m.status !== 'active' ? 'disabled' : ''}>Deactivate</button>
          </td>
        </tr>
      `
        )
        .join('');

      document.querySelectorAll('[data-reset]').forEach((btn) =>
        btn.addEventListener('click', async () => {
          const pw = prompt('New password (min 8 chars):');
          if (!pw) return;
          try {
            await api.resetPassword(btn.dataset.reset, pw);
            alert('Password reset');
          } catch (err) {
            alert(err.message);
          }
        })
      );
      document.querySelectorAll('[data-deactivate]').forEach((btn) =>
        btn.addEventListener('click', async () => {
          if (!confirm('Deactivate this member?')) return;
          try {
            await api.deactivateMember(btn.dataset.deactivate);
            await renderMembers();
          } catch (err) {
            alert(err.message);
          }
        })
      );
    }

    document.getElementById('add-member-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('new-name').value.trim();
      const username = document.getElementById('new-username').value.trim();
      const password = document.getElementById('new-password').value;
      const role = document.getElementById('new-role').value;
      const errEl = document.getElementById('add-member-error');
      errEl.style.display = 'none';
      try {
        await api.createMember({ name, username, password, role });
        e.target.reset();
        await renderMembers();
      } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    });

    await renderMembers();
  }

  // ---------------- Task Assignment ----------------
  async function initAssignTasksPage() {
    const members = await api.listMembers();
    const select = document.getElementById('assign-to');
    select.innerHTML = members.map((m) => `<option value="${m.id}">${m.name}</option>`).join('');

    async function renderActiveTasks() {
      const tasks = await api.listTasks();
      const active = tasks.filter((t) => t.status !== 'rated');
      const memberNames = Object.fromEntries(members.map((m) => [m.id, m.name]));

      document.getElementById('active-tasks-body').innerHTML = active
        .map(
          (t) => `
        <tr>
          <td>${t.title}</td>
          <td>${memberNames[t.assigned_to] || t.assigned_to}</td>
          <td>${formatDate(t.deadline)}</td>
          <td>${t.priority}</td>
          <td>${statusChip(t.status)}</td>
          <td>
            ${
              t.status === 'completed'
                ? `<select data-rate="${t.id}">
                    <option value="">Rate...</option>
                    <option value="needs_revision">Needs Revision (+3)</option>
                    <option value="meets">Meets Expectation (+5)</option>
                    <option value="exceeds">Exceeds Expectation (+8)</option>
                  </select>`
                : '—'
            }
          </td>
        </tr>
      `
        )
        .join('');

      document.querySelectorAll('[data-rate]').forEach((sel) =>
        sel.addEventListener('change', async () => {
          if (!sel.value) return;
          try {
            await api.rateTask(sel.dataset.rate, sel.value);
            await renderActiveTasks();
          } catch (err) {
            alert(err.message);
          }
        })
      );
    }

    document.getElementById('assign-task-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title').value.trim();
      const duration_hrs = parseFloat(document.getElementById('task-duration').value) || 0;
      const deadline = document.getElementById('task-deadline').value
        ? new Date(document.getElementById('task-deadline').value).toISOString()
        : null;
      const priority = parseInt(document.getElementById('task-priority').value, 10);
      const assigned_to = parseInt(select.value, 10);
      const errEl = document.getElementById('assign-task-error');
      errEl.style.display = 'none';

      try {
        await api.createTask({ title, duration_hrs, deadline, priority, assigned_to });
        e.target.reset();
        await renderActiveTasks();
      } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    });

    await renderActiveTasks();
  }
})();
