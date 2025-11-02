const API_BASE = '/api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const MOCK_USER_ROLE = (import.meta.env.VITE_MOCK_USER_ROLE || 'student').toLowerCase();
const VALID_ROLES = ['student', 'instructor', 'admin'];
const RESOLVED_MOCK_ROLE = VALID_ROLES.includes(MOCK_USER_ROLE) ? MOCK_USER_ROLE : 'student';

// Extração simples das mensagens vindas do backend (sem mapeamentos)
export const extractErrorMessage = (errorData = {}) => {
  if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join('\n');
  }
  if (typeof errorData.message === 'string' && errorData.message.trim().length > 0) {
    return errorData.message;
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

// Apresentação: 4xx inline; 5xx toast genérico
// Padronização extra: 403 com mensagem de CORS vira toast genérico
export const isCorsError = (status, errDataOrMsg) => {
  const rawMsg =
    typeof errDataOrMsg === 'string' ? errDataOrMsg : extractErrorMessage(errDataOrMsg);
  const lower = (rawMsg || '').toLowerCase();
  return (
    status === 403 &&
    (lower.includes('cors') ||
      lower.includes('cross-origin') ||
      lower.includes('invalid cors request'))
  );
};

export const presentError = ({ status, errData, setInline, showToast }) => {
  const msg = extractErrorMessage(errData);

  // 403 com mensagens de CORS: toast genérico
  if (isCorsError(status, errData)) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  // 409 Conflict: toast com mensagem do backend
  if (status === 409) {
    showToast({ message: msg || 'Conflito ao processar a solicitação', type: 'error' });
    setInline('');
    return;
  }

  // 5xx: toast genérico
  if (status >= 500) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  // Demais 4xx: inline
  setInline(msg);
};

import { ApiError, NetworkError, UnauthorizedError, ValidationError } from '../lib/errors';
const handleResponse = async (response) => {
  if (!response.ok) {
    let errData = {};
    let rawText = '';
    try {
      errData = await response.json();
      rawText = (errData && (errData.message || errData.error || errData.detail)) || '';
    } catch {
      // Fallback para respostas não-JSON (ex.: "Invalid CORS request")
      try {
        const text = await response.text();
        rawText = text || '';
        if (text) errData = { message: text };
      } catch {
        errData = {};
        rawText = '';
      }
    }

    const msgLower = rawText.toString().toLowerCase();
    const isCors403 =
      response.status === 403 &&
      (msgLower.includes('cors') ||
        msgLower.includes('cross-origin') ||
        msgLower.includes('invalid cors request'));

    if (response.status >= 500 || isCors403) {
      const netErr = new NetworkError('Erro ao se comunicar com o servidor');
      netErr.status = response.status;
      netErr.data = errData;
      throw netErr;
    }

    if (response.status === 401) {
      throw new UnauthorizedError('Não autorizado. Faça login para continuar.', errData);
    }

    if (response.status >= 400 && response.status < 500) {
      const message = extractErrorMessage(errData);
      const ve = new ValidationError(message, errData);
      ve.status = response.status;
      throw ve;
    }

    const message = extractErrorMessage(errData);
    throw new ApiError(message, response.status, errData);
  }

  // Em sucesso, tentar JSON; se não houver corpo, retornar objeto vazio
  try {
    return await response.json();
  } catch {
    return {};
  }
};

// Helpers fetch (converter falhas de rede em NetworkError)
const get = (url) =>
  fetch(`${API_BASE}${url}`, {
    credentials: 'include',
  })
    .then(handleResponse)
    .catch((e) => {
      if (e && (e.name === 'TypeError' || /Failed to fetch/i.test(e?.message || ''))) {
        const netErr = new NetworkError('Erro ao se comunicar com o servidor');
        netErr.data = { message: e?.message };
        throw netErr;
      }
      throw e;
    });

const post = (url, data) =>
  fetch(`${API_BASE}${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .catch((e) => {
      if (e && (e.name === 'TypeError' || /Failed to fetch/i.test(e?.message || ''))) {
        const netErr = new NetworkError('Erro ao se comunicar com o servidor');
        netErr.data = { message: e?.message };
        throw netErr;
      }
      throw e;
    });

const put = (url, data) =>
  fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .catch((e) => {
      if (e && (e.name === 'TypeError' || /Failed to fetch/i.test(e?.message || ''))) {
        const netErr = new NetworkError('Erro ao se comunicar com o servidor');
        netErr.data = { message: e?.message };
        throw netErr;
      }
      throw e;
    });

const del = (url) =>
  fetch(`${API_BASE}${url}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(handleResponse)
    .catch((e) => {
      if (e && (e.name === 'TypeError' || /Failed to fetch/i.test(e?.message || ''))) {
        const netErr = new NetworkError('Erro ao se comunicar com o servidor');
        netErr.data = { message: e?.message };
        throw netErr;
      }
      throw e;
    });

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
  // Sessão atual simulada (preenchida no login e limpa no logout)
  let SELECTED_MOCK_USER = null;

  // Estrutura adicional para estudante, alinhada com src/mocks/data.js
  const DEFAULT_STUDENT_SHAPE = {
    name: 'Ana Coder',
    email: 'aluno@email.com',
    turmaId: 1,
    score: 190,
    previousScore: 150,
    loginStreak: 3,
    lastLogin: '2025-10-07',
    currentModuleId: 1,
    progress: {
      completedLessons: new Set([1]),
      finalizedQuizzes: new Set(),
      dailyBonusDay: null,
    },
  };

  const DEFAULT_INSTRUCTOR_SHAPE = {
    name: 'Instrutor Mock',
    email: 'instrutor@email.com',
  };

  const DEFAULT_ADMIN_SHAPE = {
    name: 'Administrador Mock',
    email: 'admin@email.com',
  };

  const makeStudentUser = () => ({ id: 1, role: 'student', ...DEFAULT_STUDENT_SHAPE });
  const makeInstructorUser = () => ({ id: 900, role: 'instructor', ...DEFAULT_INSTRUCTOR_SHAPE });
  const makeAdminUser = () => ({ id: 901, role: 'admin', ...DEFAULT_ADMIN_SHAPE });

  api = {
    auth: {
      login: async (email, password) => {
        await delay(200);
        // Credenciais básicas: aceita somente os usuários mock conhecidos
        if (!email || !password) {
          return makeResponse({ message: 'Credenciais inválidas.' }, 400);
        }

        const normalized = String(email).trim().toLowerCase();
        if (normalized === DEFAULT_STUDENT_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeStudentUser();
          return makeResponse({ message: 'ok' }, 200);
        }
        if (normalized === DEFAULT_INSTRUCTOR_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeInstructorUser();
          return makeResponse({ message: 'ok' }, 200);
        }

        if (normalized === DEFAULT_ADMIN_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeAdminUser();
          return makeResponse({ message: 'ok' }, 200);
        }

        // Usuário não encontrado
        return makeResponse({ message: 'Usuário não encontrado.' }, 401);
      },
      logout: async () => {
        await delay(100);
        SELECTED_MOCK_USER = null;
        return makeResponse({ message: 'ok' }, 200);
      },
      getMe: async () => {
        await delay(150);
        if (!SELECTED_MOCK_USER) {
          // Sem sessão mock ativa: comporta-se como não autenticado
          const err = new UnauthorizedError('Não autorizado. Faça login para continuar.');
          err.status = 401;
          throw err;
        }
        return { data: SELECTED_MOCK_USER };
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
      validateInvite: (token) => get(`/auth/validate-invite?token=${token}`),
      completeSignup: (payload) => post('/auth/complete-signup', payload),
    },
  };
}

export { api, del, get, post, put };
