import axios from 'axios';

import {
  initialActiveInstructors,
  initialAnnouncements,
  initialClasses,
  initialCourses,
  initialInactiveInstructors,
  initialModules,
  initialStudents,
} from '../mocks/data';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const MOCK_USER_ROLE = (import.meta.env.VITE_MOCK_USER_ROLE || 'student').toLowerCase();
const VALID_ROLES = ['student', 'instructor', 'admin'];
const _RESOLVED_MOCK_ROLE = VALID_ROLES.includes(MOCK_USER_ROLE) ? MOCK_USER_ROLE : 'student';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getMockResponse = async (method, fullUrl, config) => {
  await delay(150 + Math.random() * 100);
  const searchParams = new URLSearchParams(fullUrl.split('?')[1] || '');

  if (method === 'get') {
    if (fullUrl.includes('/classrooms')) {
      const idMatch = fullUrl.match(/\/classrooms\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialClasses.find((c) => c.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }
      return { data: initialClasses, status: 200 };
    }

    if (fullUrl.includes('/courses')) {
      const idMatch = fullUrl.match(/\/courses\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialCourses.find((c) => c.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }
      return { data: initialCourses, status: 200 };
    }

    if (fullUrl.includes('/modules')) {
      const idMatch = fullUrl.match(/\/modules\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialModules.find((m) => m.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }

      const courseId = searchParams.get('courseId');
      if (courseId) {
        const filtered = initialModules.filter((m) => m.courseId === parseInt(courseId));
        return { data: filtered, status: 200 };
      }

      return { data: initialModules, status: 200 };
    }

    if (fullUrl.includes('/students')) {
      const idMatch = fullUrl.match(/\/students\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialStudents.find((s) => s.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }

      const classId = searchParams.get('classId');
      if (classId) {
        const filtered = initialStudents.filter((s) => s.classId === parseInt(classId));
        return { data: filtered, status: 200 };
      }

      return { data: initialStudents, status: 200 };
    }

    if (fullUrl.includes('/announcements')) {
      const idMatch = fullUrl.match(/\/announcements\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialAnnouncements.find((a) => a.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }
      return { data: initialAnnouncements, status: 200 };
    }

    if (fullUrl.includes('/user/instructors')) {
      const active = searchParams.get('active');
      const page = parseInt(searchParams.get('page') || '0');
      const size = parseInt(searchParams.get('size') || '10');
      const search = searchParams.get('search') || '';

      let data = active === 'true' ? initialActiveInstructors : initialInactiveInstructors;

      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(
          (i) =>
            i.name?.toLowerCase().includes(lowerSearch) ||
            i.email?.toLowerCase().includes(lowerSearch)
        );
      }

      const totalElements = data.length;
      const totalPages = Math.ceil(totalElements / size);
      const start = page * size;
      const end = start + size;
      const paginatedData = data.slice(start, end);

      return {
        data: {
          content: paginatedData,
          totalElements,
          totalPages,
          size,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
        },
        status: 200,
      };
    }

    if (fullUrl.includes('/invite') && !fullUrl.includes('/invite/send')) {
      const page = parseInt(searchParams.get('page') || '0');
      const size = parseInt(searchParams.get('size') || '10');
      const search = searchParams.get('search') || '';

      let data = [];

      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter((i) => i.email?.toLowerCase().includes(lowerSearch));
      }

      const totalElements = data.length;
      const totalPages = Math.ceil(totalElements / size);
      const start = page * size;
      const end = start + size;
      const paginatedData = data.slice(start, end);

      return {
        data: {
          content: paginatedData,
          totalElements,
          totalPages,
          size,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
        },
        status: 200,
      };
    }
  }

  if (method === 'post' || method === 'put' || method === 'delete') {
    if (
      fullUrl.includes('/courses') ||
      fullUrl.includes('/modules') ||
      fullUrl.includes('/classrooms') ||
      fullUrl.includes('/announcements') ||
      fullUrl.includes('/students') ||
      (fullUrl.includes('/users') && !fullUrl.includes('/auth'))
    ) {
      return {
        data: { id: Date.now(), ...config.data, message: 'Sucesso' },
        status: method === 'post' ? 201 : method === 'delete' ? 204 : 200,
      };
    }
  }

  return null;
};

if (USE_MOCKS) {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const { method, url } = config;
      const fullUrl = url || '';
      const mockResponse = await getMockResponse(method?.toLowerCase(), fullUrl, config);

      if (mockResponse) {
        config.adapter = () => {
          return Promise.resolve({
            data: mockResponse.data,
            status: mockResponse.status,
            statusText: 'OK',
            headers: {},
            config,
          });
        };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      throw {
        status,
        data: data || {},
        message: data?.message || error.message,
      };
    } else if (error.request) {
      throw {
        status: 0,
        data: {},
        message: 'Erro ao se comunicar com o servidor',
      };
    } else {
      throw {
        status: 500,
        data: {},
        message: error.message || 'Erro desconhecido',
      };
    }
  }
);

export const extractErrorMessage = (errorData = {}) => {
  if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join('\n');
  }
  if (typeof errorData.message === 'string' && errorData.message.trim().length > 0) {
    return errorData.message;
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

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

  if (isCorsError(status, errData)) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  if (status === 409) {
    showToast({ message: msg || 'Conflito ao processar a solicitação', type: 'error' });
    setInline('');
    return;
  }

  if (status >= 500) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  setInline(msg);
};

const extractData = (response) => response?.data ?? response;
const extractInvite = (response) => {
  const invite = response?.data ?? response;
  if (!invite?.email) {
    return {
      invite: null,
      message: response?.message ?? null,
    };
  }
  const inviteData = {
    email: invite.email,
    role: invite.role?.toLowerCase() || invite.role,
  };
  // Inclui className quando disponível (para convites de estudante)
  if (invite.className) {
    inviteData.className = invite.className;
  }
  // Inclui requiresSignup quando disponível
  if (invite.requiresSignup !== undefined) {
    inviteData.requiresSignup = invite.requiresSignup;
  }
  return {
    invite: inviteData,
    message: response?.message ?? null,
  };
};
const extractMessage = (response) => response?.message ?? response ?? null;

let api;

if (USE_MOCKS) {
  let SELECTED_MOCK_USER = null;

  const DEFAULT_STUDENT_SHAPE = {
    name: 'Ana Coder',
    email: 'aluno@email.com',
    classId: 1,
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
        if (!email || !password) {
          throw { status: 400, data: { message: 'Credenciais inválidas.' } };
        }

        const normalized = String(email).trim().toLowerCase();
        if (normalized === DEFAULT_STUDENT_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeStudentUser();
          return { message: 'ok' };
        }
        if (normalized === DEFAULT_INSTRUCTOR_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeInstructorUser();
          return { message: 'ok' };
        }

        if (normalized === DEFAULT_ADMIN_SHAPE.email.toLowerCase()) {
          SELECTED_MOCK_USER = makeAdminUser();
          return { message: 'ok' };
        }

        throw { status: 401, data: { message: 'Usuário não encontrado.' } };
      },
      logout: async () => {
        await delay(100);
        SELECTED_MOCK_USER = null;
        return { message: 'ok' };
      },
      getMe: async () => {
        await delay(150);
        if (!SELECTED_MOCK_USER) {
          throw { status: 401, data: { message: 'Não autorizado. Faça login para continuar.' } };
        }
        return SELECTED_MOCK_USER;
      },
      register: async (userData) => {
        await delay(250);
        const created = { id: 999, ...userData, role: userData.role || 'student' };
        return created;
      },
    },
    invite: {
      send: async (_email) => {
        await delay(300);
        return { success: true, message: 'Convite enviado com sucesso' };
      },
    },
  };
} else {
  api = {
    auth: {
      login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response;
      },
      logout: async () => {
        const response = await axiosInstance.post('/auth/logout', {});
        return response;
      },
      getMe: async () => {
        const response = await axiosInstance.get('/auth/me');
        return extractData(response);
      },
      register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response;
      },
      validateInvite: async (token) => {
        const response = await axiosInstance.get(`/auth/validate-invite?token=${token}`);
        return extractInvite(response);
      },
      completeSignup: async (payload) => {
        const response = await axiosInstance.post('/auth/complete-signup', payload);
        return extractMessage(response);
      },
    },
    invite: {
      send: async (email) => {
        const response = await axiosInstance.post('/invite/send', { email });
        return response;
      },
    },
  };
}

export { api, axiosInstance };
