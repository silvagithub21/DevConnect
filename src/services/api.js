const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ─── Helper ───────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('devconnect_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Erro desconhecido.');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Profile ──────────────────────────────────────────────────
export const profileAPI = {
  get:    ()     => request('/profile'),
  update: (body) => request('/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// ─── Projects ─────────────────────────────────────────────────
export const projectsAPI = {
  feed:   ()     => request('/projects'),
  mine:   ()     => request('/projects/mine'),
  create: (body) => request('/projects',        { method: 'POST',   body: JSON.stringify(body) }),
  update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id)   => request(`/projects/${id}`,  { method: 'DELETE' }),
  like:   (id)   => request(`/projects/${id}/like`, { method: 'POST' }),
};
