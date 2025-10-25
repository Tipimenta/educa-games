const API_BASE = '/api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Mapeamento de erros técnicos para mensagens amigáveis
const mapTechnicalErrorToUserMessage = (technicalMessage) => {
  const message = technicalMessage.toLowerCase();

  // Caso específico: mensagem técnica "Invalid CORS request"
  if (message.includes('invalid cors request')) {
    return 'Servidor indisponível ou erro ao se comunicar com o servidor.';
  }

  // Mapeamento de erros estruturado
  const errorMappings = [
    {
      // Erros de CORS
      condition: (msg) => msg.includes('cors') || msg.includes('cross-origin'),
      message: 'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.',
    },
    {
      // Erros de rede
      condition: (msg) => msg.includes('network') || msg.includes('fetch'),
      message: 'Problema de conexão. Verifique sua internet e tente novamente.',
    },
    {
      // Erros de timeout
      condition: (msg) => msg.includes('timeout'),
      message: 'A conexão demorou muito para responder. Tente novamente.',
    },
    {
      // Erros de servidor
      condition: (msg) => msg.includes('500') || msg.includes('internal server error'),
      message: 'Erro interno do servidor. Tente novamente em alguns minutos.',
    },
  ];

  // Verificar se é um erro que deve preservar a mensagem original
  const preserveOriginalMessage = [
    'email ou senha incorretos',
    'credenciais inválidas',
    'validation',
    'required',
    // Removemos o genérico "invalid" para evitar capturar a frase técnica de CORS
    'já existe',
    'não encontrado',
    'expirado',
    'inválido',
  ].some((keyword) => message.includes(keyword));

  if (preserveOriginalMessage) {
    return technicalMessage;
  }

  // Aplicar mapeamentos estruturados
  const mapping = errorMappings.find(({ condition }) => condition(message));
  if (mapping) {
    return mapping.message;
  }

  // Fallback para erros não mapeados
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

export { del, get, post, put };
export { api };
