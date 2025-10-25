const API_BASE = '/api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Mapeamento de erros técnicos para mensagens amigáveis
const mapTechnicalErrorToUserMessage = (technicalMessage) => {
  const msg = (technicalMessage ?? '').toString().toLowerCase();

  const includesAny = (text, keywords) => keywords.some((k) => text.includes(k));

  // Preservar mensagens originalmente direcionadas ao usuário
  const preserve = [
    'email ou senha incorretos',
    'credenciais inválidas',
    'validation',
    'required',
    'já existe',
    'não encontrado',
    'expirado',
    'inválido',
  ];
  if (includesAny(msg, preserve)) {
    return technicalMessage;
  }

  if (msg.includes('invalid cors request')) {
    return 'Servidor indisponível ou erro ao se comunicar com o servidor.';
  }

  // Mapeamentos simplificados por categorias
  const mappings = [
    {
      keywords: ['cors', 'cross-origin'],
      message: 'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.',
    },
    {
      keywords: ['network', 'fetch'],
      message: 'Problema de conexão. Verifique sua internet e tente novamente.',
    },
    {
      keywords: ['timeout'],
      message: 'A conexão demorou muito para responder. Tente novamente.',
    },
    {
      keywords: ['500', 'internal server error'],
      message: 'Erro interno do servidor. Tente novamente em alguns minutos.',
    },
  ];

  const found = mappings.find((m) => includesAny(msg, m.keywords));
  if (found) {
    return found.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export const extractErrorMessage = (errorData) => {
  if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    // Para múltiplos erros, mapear cada um individualmente
    const mappedErrors = errorData.errors.map((error) => mapTechnicalErrorToUserMessage(error));
    return mappedErrors.join('\n');
  }

  if (errorData.message) {
    return mapTechnicalErrorToUserMessage(errorData.message);
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(extractErrorMessage(error));
  }
  return response.json();
};

// Helpers fetch
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

// =====================
// Modo Mock
// =====================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const makeResponse = (json, status = 200) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

let api;

if (USE_MOCKS) {
  const MOCK_USER = {
    id: 1,
    name: 'Usuário Mock',
    email: 'mock@educagames.com',
    role: 'student',
  };

  api = {
    auth: {
      login: async (email, password) => {
        await delay(200);
        // Simula credenciais inválidas
        if (!email || !password) {
          return makeResponse({ message: 'Credenciais inválidas.' }, 400);
        }
        return makeResponse({ message: 'ok' }, 200);
      },
      logout: async () => {
        await delay(100);
        return makeResponse({ message: 'ok' }, 200);
      },
      getMe: async () => {
        await delay(150);
        return { data: MOCK_USER };
      },
      register: async (userData) => {
        await delay(250);
        const created = { id: 999, ...userData, role: userData.role || 'student' };
        return makeResponse(created, 201);
      },
    },
  };
} else {
  api = {
    auth: {
      login: (email, password) => authPost('/auth/login', { email, password }),
      logout: () => authPost('/auth/logout', {}),
      getMe: () => get('/auth/me'),
      register: (userData) => post('/auth/register', userData),
    },
  };
}

export { api, del, get, post, put };
