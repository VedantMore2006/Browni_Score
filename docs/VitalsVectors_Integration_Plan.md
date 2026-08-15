# Vitals&Vectors — Frontend ↔ Backend Integration Plan
## pages_reworked → production wiring guide

---

## Backend API — complete endpoint inventory

| Method | Endpoint | Auth required | Who can call |
|---|---|---|---|
| POST | `/auth/login` | No | Everyone |
| GET | `/members` | Yes | Coordinator/Admin: all members; Member: own only |
| GET | `/members/me` | Yes | Everyone |
| GET | `/members/{id}` | Yes | Admin/Coordinator; Member: own only |
| POST | `/members` | Yes | Admin only |
| PATCH | `/members/{id}` | Yes | Admin only |
| POST | `/members/{id}/deactivate` | Yes | Admin only |
| POST | `/members/{id}/reset-password` | Yes | Admin only |
| GET | `/members/{id}/audit-log` | Yes | Admin only |
| GET | `/tasks` | Yes | Member: own; Coordinator/Admin: all |
| POST | `/tasks` | Yes | Coordinator/Admin |
| POST | `/tasks/{id}/complete` | Yes | Assigned member, Coordinator, Admin |
| POST | `/tasks/{id}/rate` | Yes | Coordinator/Admin |
| POST | `/points` | Yes | Coordinator/Admin |
| GET | `/points/member/{id}` | Yes | Own logs; Admin: any member |
| GET | `/leaderboard/weekly` | Yes | Everyone |
| GET | `/leaderboard/monthly` | Yes | Everyone |
| GET | `/leaderboard/hero-of-month` | Yes | Everyone |
| POST | `/warnings` | Yes | Admin only |
| GET | `/warnings/member/{id}` | Yes | Own warnings; Admin: any |
| GET | `/admin/alerts` | Yes | Coordinator/Admin |
| GET | `/health` | No | Everyone |

**NOT in backend (no endpoint exists):**
- Attendance (Premises app integration — placeholder)
- Settings / change-password for self (member changing own password)
- Hero of Week endpoint (weekly leaderboard top-1 is manual)
- Streak auto-calculation (presence streak, 85% weekly bonus — manual only for now)
- Flex-day tracking
- Notifications

---

## pages_reworked — file-by-file status

---

### `index.html` — Login page
**Status: UI done, backend call MISSING**

What exists in the file:
- Full styled login form (username + password fields, submit button)
- CSS fully styled, Solo Leveling theme, looks complete
- JavaScript: form submit handler exists but calls `alert()` instead of the API

**What needs to be wired:**
```javascript
// REPLACE the mock submit with:
async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    showError('Invalid credentials');
    return;
  }
  const data = await res.json();
  localStorage.setItem('vv_token',   data.access_token);
  localStorage.setItem('vv_role',    data.role);
  localStorage.setItem('vv_id',      data.member_id);
  localStorage.setItem('vv_name',    data.name);
  window.location.href = 'dashboard.html';
}
```

---

### `dashboard.html` — Command Centre
**Status: UI done (dummy data), backend calls MISSING**

What exists in the file:
- Full layout: rank card with hexagon badge, stats strip (4 cards), Chart.js team bar chart, today's tasks, recent point log, streak buffs
- Chart.js loaded from CDN — chart renders with hardcoded dummy member data
- Sidebar present, collapsible logic works
- All data is hardcoded (mock names, mock points, mock tasks)

**What needs to be wired:**

| UI element | Backend endpoint | Fields to use |
|---|---|---|
| Rank hexagon + title | `GET /members/me` | `rank`, compute label from rank |
| Total points (large number) | `GET /members/me` | `points_total` |
| Progress bar to next rank | `GET /members/me` | `points_total` → compute % |
| Points this week | `GET /members/me` | `points_this_week` |
| Points this month | `GET /members/me` | `points_this_month` |
| Presence streak | `GET /members/me` | `streak_presence` |
| Task streak | `GET /members/me` | `streak_task_reporting` |
| Team bar chart | `GET /members` | all members: `name`, `points_total`, `rank` |
| Today's tasks | `GET /tasks` | filter by deadline = today |
| Recent point log | `GET /points/member/{id}` | last 10 entries |
| Sidebar user name/rank | `localStorage` `vv_name`, `vv_role` + `/members/me` for rank |
| Weekly position (stat card) | `GET /leaderboard/weekly` | find own position in array |

**Dummy items to keep as placeholder (no backend yet):**
- "Streak bonus" auto-calculation → show `streak_presence` and `streak_task_reporting` from DB but note these are not auto-updated yet
- 85% weekly completion bonus → placeholder label only

---

### `tasks.html` — Quest Manager
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Task table with columns: Sr No, Title, Duration, Deadline, Assigned By, Priority, Status, Points, Action
- "Mark Complete" button per row (calls `alert()` mock)
- Coordinator view tab exists (hardcoded toggle)
- Assign Task modal exists with form fields (calls `alert()` mock)
- Rate task dropdown exists (calls `alert()` mock)

**What needs to be wired:**

| Action | Backend endpoint | Request body |
|---|---|---|
| Load my tasks (member) | `GET /tasks` | — |
| Load all tasks (coord/admin) | `GET /tasks` | — (backend auto-filters by role) |
| Mark task complete | `POST /tasks/{id}/complete` | — |
| Assign new task | `POST /tasks` | `{title, duration_hrs, deadline, priority, assigned_to}` |
| Rate task | `POST /tasks/{id}/rate` | `{rating: "needs_revision" / "meets" / "exceeds"}` |
| Load members (for assign dropdown) | `GET /members` | — |

**Field mapping — TaskOut schema:**
```
id, title, duration_hrs, deadline, priority (1/2/3),
assigned_to (member id), assigned_by (member id),
status (pending/in_progress/completed/rated),
rating (null/needs_revision/meets/exceeds),
points_awarded, created_at, completed_at
```

**Note:** `assigned_by` is a member ID not a name. Frontend needs to resolve it:
- Fetch all members once, build a `{ id → name }` map, use to display "Assigned by: Debaditya"

---

### `point-log.html` — Point History
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Table with columns: Date & Time, Category, Points, Reason, Logged By
- Filter chips: All / Attendance / Task / Learning / Content / Streak / Conduct
- 3 summary stat cards: Total Earned / Total Deducted / Net Balance (all hardcoded)
- Pagination UI present (hardcoded)
- Sparkline mini-charts in summary cards (Chart.js, dummy data)

**What needs to be wired:**

| UI element | Backend endpoint | Fields |
|---|---|---|
| Point log table | `GET /points/member/{id}` | all PointLogOut entries |
| Category filter | client-side filter on `category` field | — |
| Total earned this month | compute from logs | sum where `event_type == "earn"` |
| Total deducted this month | compute from logs | sum where `event_type == "deduct"` |
| Net balance | `GET /members/me` → `points_total` | — |
| Logged By name | resolve `logged_by` (member id) → name via member map | — |

**PointLogOut schema:**
```
id, member_id, event_type (earn/deduct), category,
points, reason, logged_by (member id), timestamp
```

**Placeholder (no backend):**
- Sparkline charts → keep as dummy or remove; no time-series data endpoint exists

---

### `leaderboard.html` — Hunter Rankings
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Two tabs: This Week / This Month (tab switch works client-side)
- Top 3 podium cards (gold/silver/bronze, hardcoded)
- Full leaderboard table (rank badge, name, points, streak, hero badge)
- "You" row highlighting logic (hardcoded to specific position)
- Scoring period date display (hardcoded)

**What needs to be wired:**

| UI element | Backend endpoint | Fields |
|---|---|---|
| Weekly leaderboard | `GET /leaderboard/weekly` | sorted by `points_this_week` |
| Monthly leaderboard | `GET /leaderboard/monthly` | sorted by `points_this_month` |
| Hero of Month badge | `GET /leaderboard/hero-of-month` | members with `points_this_month >= 300` |
| Hero of Week | client-side: top of `/leaderboard/weekly` | first entry = hero |
| "You" row | compare `member.id` with `localStorage.getItem('vv_id')` | — |
| Streak display | `streak_presence` + `streak_task_reporting` from MemberOut | — |
| Top 3 podium | first 3 entries of whichever leaderboard is active | — |

---

### `attendance.html` — Attendance
**Status: UI done (full dummy data), NO backend endpoint**

What exists:
- Today's member card grid (hardcoded members list with Present/Absent/Late chips)
- Detail panel (slide-in modal) with Premises-style table: Date / Check-In / Check-Out / Duration / Status / Override
- Filter tabs: Today / Past Week / Past Month
- Pagination row: "Total Records: N | Page X of Y"
- "Log" button per member card (calls `alert()` mock)
- Sidebar collapse works

**Backend status:** No attendance endpoint exists in FastAPI. The Premises app is the data source but not yet integrated.

**What to do in frontend:**
1. Keep all dummy data as-is
2. Add a clearly visible yellow/amber placeholder banner at the top of the page:
```html
<div class="placeholder-banner">
  ⚠ ATTENDANCE DATA SOURCE NOT CONNECTED
  This page displays mock data. Live data will be fetched from the Premises app
  once the integration endpoint is built. — Backend: /attendance (pending)
</div>
```
3. The "Log" button should show a toast: "Attendance logging endpoint not yet implemented"
4. Keep the entire UI functional with mock data for design review purposes

---

### `rules.html` — System Rules
**Status: Fully static, NO backend needed**

What exists:
- Full rulebook content in styled cards
- All rules hardcoded as HTML content
- No API calls needed or expected

**Action:** None. This page is complete. Copy to `frontend/rules.html` as-is.

---

### `settings.html` — Settings
**Status: UI done, backend calls MISSING**

What exists:
- Profile display section (name, username, role, rank, join date — all hardcoded)
- Change Password form (current password, new password, confirm — calls `alert()` mock)
- Admin section: Reset member password (member select + new password — calls `alert()` mock)

**What needs to be wired:**

| Action | Backend endpoint | Notes |
|---|---|---|
| Load own profile | `GET /members/me` | populate name, username, role, joined_date, rank |
| Change own password | ❌ NO ENDPOINT | See note below |
| Admin reset member password | `POST /members/{id}/reset-password` | body: `{new_password}` |
| Load members list (admin) | `GET /members` | for reset-password dropdown |

**⚠ Missing backend endpoint — Change own password:**
The backend has `POST /members/{id}/reset-password` but it's admin-only (`require_role("admin")`).
There is NO endpoint for a member to change their own password.

**Frontend placeholder for this:**
```html
<!-- Show this in the change-password form -->
<div class="placeholder-note">
  ⚠ Self-service password change endpoint not yet implemented in backend.
  Contact admin to reset your password.
  — Endpoint needed: PATCH /members/me/password
</div>
```

**Backend addition needed:**
```python
# Add to backend/routes/members.py
@router.patch("/me/password")
def change_own_password(
    payload: schemas.ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: models.Member = Depends(get_current_user),
):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"status": "password updated"}

# Add to schemas.py
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
```

---

### `admin_dashboard.html` → `admin/dashboard.html`
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Alert banner (hardcoded "3 ACTIVE ALERTS")
- 3 quick-stat cards: Members below 100pts / Members with 2 warnings / Overdue tasks (all hardcoded)
- Team overview table (hardcoded members, rank, points, status, action buttons)
- Alerts & Heroes section (hardcoded)
- Add/Deduct Points modal (calls `alert()` mock)
- Issue Warning modal (calls `alert()` mock)

**What needs to be wired:**

| UI element | Backend endpoint | Fields |
|---|---|---|
| Alert counts | `GET /admin/alerts` | `low_points.length`, `two_warnings.length`, `overdue_tasks.length` |
| Low points members | `GET /admin/alerts` | `low_points[]` |
| 2-warnings members | `GET /admin/alerts` | `two_warnings[]` |
| Overdue tasks | `GET /admin/alerts` | `overdue_tasks[]` |
| Team overview table | `GET /members` | all members: name, rank, points, streak, status |
| Add points | `POST /points` | `{member_id, event_type:"earn", category, points, reason}` |
| Deduct points | `POST /points` | `{member_id, event_type:"deduct", category, points, reason}` |
| Issue warning | `POST /warnings` | `{member_id, reason, valid_reason_accepted}` |
| Hero of Week | `GET /leaderboard/weekly` → first entry | display top scorer |
| Hero of Month | `GET /leaderboard/hero-of-month` | members above 300pts |

---

### `admin_members.html` → `admin/members.html`
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Add Hunter form (name, username, password, role select) — calls `alert()` mock
- All Hunters table with search, pagination — fully hardcoded data
- Edit / Deactivate / Reset buttons per row — call `alert()` mock

**What needs to be wired:**

| Action | Backend endpoint | Body |
|---|---|---|
| Load all members | `GET /members` | — |
| Create member | `POST /members` | `{name, username, password, role}` |
| Edit member | `PATCH /members/{id}` | `{name?, role?, status?}` |
| Deactivate member | `POST /members/{id}/deactivate` | — |
| Reset password | `POST /members/{id}/reset-password` | `{new_password}` |
| View audit log | `GET /members/{id}/audit-log` | returns `{point_logs[], warnings[]}` |

---

### `admin_assign-tasks.html` → `admin/assign-tasks.html`
**Status: UI done (dummy data), backend calls MISSING**

What exists:
- Assign Quest form (title, duration, deadline, priority, assign-to select) — calls `alert()` mock
- Active Quests table — hardcoded data
- Rate task dropdown per completed task row — calls `alert()` mock

**What needs to be wired:**

| Action | Backend endpoint | Body |
|---|---|---|
| Load all tasks | `GET /tasks` | — |
| Load members (for assign-to dropdown) | `GET /members` | — |
| Create task | `POST /tasks` | `{title, duration_hrs, deadline, priority, assigned_to}` |
| Rate task | `POST /tasks/{id}/rate` | `{rating}` |

---

## Summary table — what's real vs placeholder

| Page | UI | Backend wired | Placeholder needed |
|---|---|---|---|
| `index.html` | ✅ Complete | ❌ Login not wired | No — just wire it |
| `dashboard.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `tasks.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `point-log.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `leaderboard.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `attendance.html` | ✅ Complete | ❌ No endpoint | ✅ Banner + toast |
| `rules.html` | ✅ Complete | ✅ None needed | None |
| `settings.html` | ✅ Complete | ❌ Partial | ✅ Change-own-password note |
| `admin/dashboard.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `admin/members.html` | ✅ Complete | ❌ All dummy | No — wire all |
| `admin/assign-tasks.html` | ✅ Complete | ❌ All dummy | No — wire all |

---

## Files to copy from pages_reworked → frontend

```
pages_reworked/index.html              → frontend/index.html
pages_reworked/dashboard.html          → frontend/dashboard.html
pages_reworked/tasks.html              → frontend/tasks.html
pages_reworked/point-log.html          → frontend/point-log.html
pages_reworked/leaderboard.html        → frontend/leaderboard.html
pages_reworked/attendance.html         → frontend/attendance.html
pages_reworked/rules.html              → frontend/rules.html
pages_reworked/settings.html           → frontend/settings.html
pages_reworked/admin_dashboard.html    → frontend/admin/dashboard.html
pages_reworked/admin_members.html      → frontend/admin/members.html
pages_reworked/admin_assign-tasks.html → frontend/admin/assign-tasks.html
```

Fix these paths after copying (all nav links in pages_reworked are relative to pages_reworked/):
- All `href="dashboard.html"` → `href="../dashboard.html"` (inside admin/ pages)
- All `href="admin/dashboard.html"` → stays for non-admin pages
- All `href="../dashboard.html"` in admin pages → keep as-is

---

## JS utility functions needed in frontend/js/

These are currently missing from `api.js` and `utils.js` but needed by every new page:

### `api.js` — add these functions
```javascript
const BASE = 'http://localhost:8000';

function getToken() { return localStorage.getItem('vv_token'); }
function authHeaders() { return { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }; }

const api = {
  // Auth
  login: (username, password) => fetch(`${BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username,password}) }),

  // Members
  getMe:         ()     => fetch(`${BASE}/members/me`,          { headers: authHeaders() }).then(r => r.json()),
  listMembers:   ()     => fetch(`${BASE}/members`,             { headers: authHeaders() }).then(r => r.json()),
  getMember:     (id)   => fetch(`${BASE}/members/${id}`,       { headers: authHeaders() }).then(r => r.json()),
  createMember:  (body) => fetch(`${BASE}/members`,             { method:'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  updateMember:  (id, body) => fetch(`${BASE}/members/${id}`,   { method:'PATCH', headers: authHeaders(), body: JSON.stringify(body) }),
  deactivate:    (id)   => fetch(`${BASE}/members/${id}/deactivate`, { method:'POST', headers: authHeaders() }),
  resetPassword: (id, newPw) => fetch(`${BASE}/members/${id}/reset-password`, { method:'POST', headers: authHeaders(), body: JSON.stringify({new_password: newPw}) }),
  auditLog:      (id)   => fetch(`${BASE}/members/${id}/audit-log`, { headers: authHeaders() }).then(r => r.json()),

  // Tasks
  listTasks:      ()        => fetch(`${BASE}/tasks`,                  { headers: authHeaders() }).then(r => r.json()),
  createTask:     (body)    => fetch(`${BASE}/tasks`,                  { method:'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  completeTask:   (id)      => fetch(`${BASE}/tasks/${id}/complete`,   { method:'POST', headers: authHeaders() }),
  rateTask:       (id, rating) => fetch(`${BASE}/tasks/${id}/rate`,   { method:'POST', headers: authHeaders(), body: JSON.stringify({rating}) }),

  // Points
  logPoints:     (body) => fetch(`${BASE}/points`,                    { method:'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  pointLog:      (id)   => fetch(`${BASE}/points/member/${id}`,       { headers: authHeaders() }).then(r => r.json()),

  // Leaderboard
  leaderboardWeekly:  () => fetch(`${BASE}/leaderboard/weekly`,         { headers: authHeaders() }).then(r => r.json()),
  leaderboardMonthly: () => fetch(`${BASE}/leaderboard/monthly`,        { headers: authHeaders() }).then(r => r.json()),
  heroOfMonth:        () => fetch(`${BASE}/leaderboard/hero-of-month`,  { headers: authHeaders() }).then(r => r.json()),

  // Warnings
  issueWarning:  (body) => fetch(`${BASE}/warnings`,                   { method:'POST', headers: authHeaders(), body: JSON.stringify(body) }),
  memberWarnings:(id)   => fetch(`${BASE}/warnings/member/${id}`,      { headers: authHeaders() }).then(r => r.json()),

  // Admin
  alerts: () => fetch(`${BASE}/admin/alerts`, { headers: authHeaders() }).then(r => r.json()),
};
```

### `utils.js` — add these functions
```javascript
// Auth guard — call at top of every page's script
function requireAuth(allowedRoles = []) {
  const token = localStorage.getItem('vv_token');
  const role  = localStorage.getItem('vv_role');
  if (!token) { window.location.href = '/index.html'; return null; }
  if (allowedRoles.length && !allowedRoles.includes(role)) { window.location.href = '/dashboard.html'; return null; }
  return { token, role, id: parseInt(localStorage.getItem('vv_id')), name: localStorage.getItem('vv_name') };
}

// Rank system
const RANKS = [
  { code:'E',  lo:0,   hi:99,  label:'Unranked Hunter', color:'#8A93A8' },
  { code:'D',  lo:100, hi:149, label:'Bronze Hunter',   color:'#CD7F32' },
  { code:'C',  lo:150, hi:199, label:'Iron Hunter',     color:'#B0B0B0' },
  { code:'B',  lo:200, hi:249, label:'Silver Hunter',   color:'#4FC3F7' },
  { code:'A',  lo:250, hi:299, label:'Gold Hunter',     color:'#FFD700' },
  { code:'S',  lo:300, hi:399, label:'Platinum Hunter', color:'#00E5FF' },
  { code:'SS', lo:400, hi:null,label:'Shadow Monarch',  color:'#9A7BFF' },
];

function rankFor(pts) {
  return RANKS.find(r => r.hi === null ? pts >= r.lo : pts >= r.lo && pts <= r.hi) || RANKS[0];
}

function ptsToNextRank(pts) {
  const idx = RANKS.findIndex(r => r.hi === null ? pts >= r.lo : pts >= r.lo && pts <= r.hi);
  if (idx < 0 || idx === RANKS.length - 1) return 0;
  return RANKS[idx + 1].lo - pts;
}

function rankProgress(pts) {
  const r = rankFor(pts);
  if (!r.hi) return 100;
  return Math.min(100, Math.round(((pts - r.lo) / (r.hi - r.lo)) * 100));
}

// Helpers
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(); }
function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff/60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id='toast-container'; c.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px'; document.body.appendChild(c); }
  const t = document.createElement('div');
  const colors = { success:'#00E5FF', error:'#FF1744', info:'#4FC3F7' };
  t.style.cssText = `padding:10px 18px;border-radius:6px;font-size:13px;border:1px solid ${colors[type]};color:${colors[type]};background:${colors[type]}18;animation:fadeIn 0.3s ease`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function buildMemberMap(members) {
  return Object.fromEntries(members.map(m => [m.id, m.name]));
}
```

---

## Backend additions needed (minor)

| What | Where | Priority |
|---|---|---|
| `PATCH /members/me/password` — self password change | `routes/members.py` | Medium |
| `GET /leaderboard/hero-of-week` — return top weekly scorer | `routes/leaderboard.py` | Low (can derive client-side) |
| Attendance endpoints — will come later from Premises | New file `routes/attendance.py` | Later |

---

## Recommended build order

1. Copy all `pages_reworked/` files to `frontend/` (fix paths)
2. Rewrite `frontend/js/api.js` with the full API wrapper above
3. Rewrite `frontend/js/utils.js` with the full helper set above
4. Wire `index.html` login (easiest, 20 lines)
5. Wire `dashboard.html` (fetch me + members + tasks + points)
6. Wire `tasks.html` (fetch tasks, mark complete, assign, rate)
7. Wire `point-log.html` (fetch point log, filter client-side)
8. Wire `leaderboard.html` (fetch weekly + monthly + hero)
9. Wire `admin/dashboard.html` (alerts + team table + point/warning modals)
10. Wire `admin/members.html` (CRUD members)
11. Wire `admin/assign-tasks.html` (create + rate tasks)
12. Wire `settings.html` (load profile; admin reset password)
13. Add placeholder banner to `attendance.html`
14. Add backend `PATCH /members/me/password` endpoint

---

*Integration plan v1.0 — all pages_reworked UI is production-ready. Only backend wiring and path fixes are needed.*
