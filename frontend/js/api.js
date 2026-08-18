// frontend/js/api.js
// Shared API client for Vitals&Vectors — all pages import this.
// Public endpoints: no token. Admin endpoints: Bearer token from localStorage.

const BASE = 'http://localhost:8000';

// ── Auth helpers ─────────────────────────────────────────────────────────────
function getToken()   { return localStorage.getItem('vv_token'); }
function setToken(t)  { localStorage.setItem('vv_token', t); }
function clearToken() { localStorage.removeItem('vv_token'); }
function isLoggedIn() { return !!getToken(); }

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

function jsonHeaders() {
  return { 'Content-Type': 'application/json' };
}

// ── Response handler ─────────────────────────────────────────────────────────
async function handleResponse(res) {
  if (res.ok) return res.json();
  let err;
  try {
    err = await res.json();
  } catch (_) {
    err = { detail: `HTTP ${res.status}` };
  }
  throw new Error(err.detail || `HTTP ${res.status}`);
}

// ── Error display helper ─────────────────────────────────────────────────────
function showApiError(err) {
  const msg = err?.message || 'Something went wrong. Please try again.';
  // Use showToast if defined on the page, else fall back to console
  if (typeof showToast === 'function') {
    showToast(msg, 'error');
  } else {
    console.error('[API Error]', msg);
  }
}

// ── Public API ───────────────────────────────────────────────────────────────
const api = {

  // Members
  getMembers:      ()    => fetch(`${BASE}/members`).then(handleResponse),
  getMember:       (id)  => fetch(`${BASE}/members/${id}`).then(handleResponse),
  getMemberByName: (n)   => fetch(`${BASE}/members/by-name/${encodeURIComponent(n)}`).then(handleResponse),

  // Tasks
  getTasks: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
    ).toString();
    return fetch(`${BASE}/tasks${q ? '?' + q : ''}`).then(handleResponse);
  },
  getTask: (id) => fetch(`${BASE}/tasks/${id}`).then(handleResponse),

  // Points (public read)
  getAllPointLogs: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
    ).toString();
    return fetch(`${BASE}/points/all${q ? '?' + q : ''}`).then(handleResponse);
  },

  // Leaderboard
  leaderboardWeekly:  () => fetch(`${BASE}/leaderboard/weekly`).then(handleResponse),
  leaderboardMonthly: () => fetch(`${BASE}/leaderboard/monthly`).then(handleResponse),
  heroOfMonth:        () => fetch(`${BASE}/leaderboard/hero-of-month`).then(handleResponse),

  // Projects
  getProjects:    ()    => fetch(`${BASE}/projects`).then(handleResponse),
  getProject:     (id)  => fetch(`${BASE}/projects/${id}`).then(handleResponse),

  // Warnings (public read)
  getMemberWarnings: (id) => fetch(`${BASE}/warnings/member/${id}`).then(handleResponse),

  // Health
  health: () => fetch(`${BASE}/health`).then(handleResponse),

  // ── Admin API (require token) ──────────────────────────────────────────────

  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ username, password })
    }).then(handleResponse),

  // Members (admin write)
  createMember:     (body)     => fetch(`${BASE}/members`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  updateMember:     (id, body) => fetch(`${BASE}/members/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  deactivateMember: (id)       => fetch(`${BASE}/members/${id}/deactivate`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  resetPassword:    (id, pw)   => fetch(`${BASE}/members/${id}/reset-password`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ new_password: pw }) }).then(handleResponse),
  changeMyPassword: (cur, nw)  => fetch(`${BASE}/members/me/password`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ current_password: cur, new_password: nw }) }).then(handleResponse),

  // Tasks (admin write)
  createTask:   (body)       => fetch(`${BASE}/tasks`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  completeTask: (id)         => fetch(`${BASE}/tasks/${id}/complete`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  rateTask:     (id, rating) => fetch(`${BASE}/tasks/${id}/rate`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ rating }) }).then(handleResponse),

  // Points (admin write)
  logPoints: (body) => fetch(`${BASE}/points`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Warnings (admin write)
  issueWarning: (body) => fetch(`${BASE}/warnings`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handleResponse),

  // Admin dashboard
  adminAlerts:     ()      => fetch(`${BASE}/admin/alerts`, { headers: authHeaders() }).then(handleResponse),
  resetWeekly:     ()      => fetch(`${BASE}/admin/reset-weekly`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  resetMonthly:    ()      => fetch(`${BASE}/admin/reset-monthly`, { method: 'POST', headers: authHeaders() }).then(handleResponse),
  confirmHeroWeek: (id, note = '') => fetch(`${BASE}/admin/confirm-hero-week`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ member_id: id, period: 'week', note }) }).then(handleResponse),
  confirmHeroMonth:(id, note = '') => fetch(`${BASE}/admin/confirm-hero-month`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ member_id: id, period: 'month', note }) }).then(handleResponse),
  seedMembers:     ()      => fetch(`${BASE}/admin/seed-members`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ confirm: true }) }).then(handleResponse),
  getAuditLog:     (id)    => fetch(`${BASE}/members/${id}/audit-log`, { headers: authHeaders() }).then(handleResponse),
};

// Expose globals so pages can use them without module imports
window.api = api;
window.getToken = getToken;
window.setToken = setToken;
window.clearToken = clearToken;
window.isLoggedIn = isLoggedIn;
window.showApiError = showApiError;
