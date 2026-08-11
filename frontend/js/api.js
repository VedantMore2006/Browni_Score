const API_BASE = 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('vv_token');
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('vv_token');
    localStorage.removeItem('vv_role');
    localStorage.removeItem('vv_member_id');
    localStorage.removeItem('vv_name');
    window.location.href = '/index.html';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch (e) {}
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

const api = {
  login: (username, password) =>
    apiRequest('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => apiRequest('/members/me'),
  listMembers: () => apiRequest('/members'),
  getMember: (id) => apiRequest(`/members/${id}`),
  createMember: (payload) => apiRequest('/members', { method: 'POST', body: payload }),
  updateMember: (id, payload) => apiRequest(`/members/${id}`, { method: 'PATCH', body: payload }),
  deactivateMember: (id) => apiRequest(`/members/${id}/deactivate`, { method: 'POST' }),
  resetPassword: (id, new_password) =>
    apiRequest(`/members/${id}/reset-password`, { method: 'POST', body: { new_password } }),
  auditLog: (id) => apiRequest(`/members/${id}/audit-log`),

  listTasks: () => apiRequest('/tasks'),
  createTask: (payload) => apiRequest('/tasks', { method: 'POST', body: payload }),
  completeTask: (id) => apiRequest(`/tasks/${id}/complete`, { method: 'POST' }),
  rateTask: (id, rating) => apiRequest(`/tasks/${id}/rate`, { method: 'POST', body: { rating } }),

  logPoints: (payload) => apiRequest('/points', { method: 'POST', body: payload }),
  memberPointLog: (id) => apiRequest(`/points/member/${id}`),

  issueWarning: (payload) => apiRequest('/warnings', { method: 'POST', body: payload }),
  memberWarnings: (id) => apiRequest(`/warnings/member/${id}`),

  leaderboardWeekly: () => apiRequest('/leaderboard/weekly'),
  leaderboardMonthly: () => apiRequest('/leaderboard/monthly'),
  heroOfMonth: () => apiRequest('/leaderboard/hero-of-month'),

  adminAlerts: () => apiRequest('/admin/alerts'),
};
