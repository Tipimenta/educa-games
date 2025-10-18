const API_BASE = '/api';

export const extractErrorMessage = (errorData) => {
  if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join('\n');
  }

  if (errorData.message) {
    return errorData.message;
  }

  return 'Erro desconhecido';
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(extractErrorMessage(error));
  }
  return response.json();
};

const get = (url) =>
  fetch(`${API_BASE}${url}`, {
    credentials: 'include',
  }).then(handleResponse);

const post = (url, data) =>
  fetch(`${API_BASE}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

const put = (url, data) =>
  fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

const del = (url) =>
  fetch(`${API_BASE}${url}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then(handleResponse);

// Sem handleResponse para não interferir no login e logout
const authPost = (url, data) =>
  fetch(`${API_BASE}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const api = {
  auth: {
    login: (email, password) => authPost('/auth/login', { email, password }),
    logout: () => authPost('/auth/logout', {}),
    getMe: () => get('/auth/me'),
  },
};
