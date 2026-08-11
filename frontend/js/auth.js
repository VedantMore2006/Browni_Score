(function () {
  const existingToken = localStorage.getItem('vv_token');
  if (existingToken) {
    window.location.href = '/dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Authenticating...';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
      const data = await api.login(username, password);
      localStorage.setItem('vv_token', data.access_token);
      localStorage.setItem('vv_role', data.role);
      localStorage.setItem('vv_member_id', data.member_id);
      localStorage.setItem('vv_name', data.name);
      window.location.href = '/dashboard.html';
    } catch (err) {
      errorEl.textContent = err.message || 'Login failed';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Enter the System';
    }
  });
})();
