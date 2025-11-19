import axios from 'axios';

import {
  initialActiveInstructors,
  initialAnnouncements,
  initialClasses,
  initialCourses,
  initialInactiveInstructors,
  initialModules,
  initialPendingInvites,
  initialStudents,
} from '../mocks/data';
import { paginate, sortArray } from '../utils/pagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

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
    // Paginação de módulos com suporte a courseId e busca por título
    if (fullUrl.includes('/module/page')) {
      const page = parseInt(searchParams.get('page') || '0');
      const size = parseInt(searchParams.get('size') || '10');
      const search = searchParams.get('search') || '';
      const sortBy = searchParams.get('sortBy') || 'title';
      const sortDir = searchParams.get('sortDir') || 'ASC';
      const courseIdParam = searchParams.get('courseId');

      let data = initialModules.slice();
      if (courseIdParam) {
        const cid = parseInt(courseIdParam);
        data = data.filter((m) => m.courseId === cid);
      }
      if (search) {
        const lower = search.toLowerCase();
        data = data.filter((m) => (m.title || '').toLowerCase().includes(lower));
      }
      const key = sortBy === 'title' ? 'title' : 'title';
      data = sortArray(data, key, sortDir);

      const pageResponse = paginate(data, page, size);

      return {
        data: {
          content: pageResponse.content,
          totalElements: pageResponse.totalElements,
          totalPages: pageResponse.totalPages,
          size: pageResponse.size,
          number: pageResponse.number,
          first: pageResponse.first,
          last: pageResponse.last,
        },
        status: 200,
      };
    }
    if (fullUrl.includes('/classroom')) {
      if (fullUrl.includes('/availableClasses')) {
        const available = initialClasses.filter((c) => !!c.active);
        return { data: available, status: 200 };
      }
      const idMatch = fullUrl.match(/\/classroom\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        if (fullUrl.includes('/students')) {
          const page = parseInt(searchParams.get('page') || '0');
          const size = parseInt(searchParams.get('size') || '10');
          const search = searchParams.get('search') || '';
          const sortBy = searchParams.get('sortBy') || 'name';
          const sortDir = searchParams.get('sortDir') || 'ASC';
          const activeParam = searchParams.get('active');
          let data = initialStudents.filter((s) => s.classId === id);
          if (activeParam !== null) {
            const mustBeActive = activeParam === 'true';
            data = data.filter((s) => !!s.active === mustBeActive);
          }
          if (search) {
            const lowerSearch = search.toLowerCase();
            data = data.filter(
              (s) =>
                s.name?.toLowerCase().includes(lowerSearch) ||
                s.email?.toLowerCase().includes(lowerSearch)
            );
          }
          const key = sortBy === 'createdAt' ? 'createdAt' : 'name';
          data = sortArray(data, key, sortDir);
          const pageResponse = paginate(data, page, size);
          return {
            data: {
              content: pageResponse.content,
              totalElements: pageResponse.totalElements,
              totalPages: pageResponse.totalPages,
              size: pageResponse.size,
              number: pageResponse.number,
              first: pageResponse.first,
              last: pageResponse.last,
            },
            status: 200,
          };
        }
        if (fullUrl.includes('/courses')) {
          const page = parseInt(searchParams.get('page') || '0');
          const size = parseInt(searchParams.get('size') || '10');
          const search = searchParams.get('search') || '';
          const sortBy = searchParams.get('sortBy') || 'title';
          const sortDir = searchParams.get('sortDir') || 'ASC';
          let data = initialCourses.filter(
            (c) => Array.isArray(c.assignedClasses) && c.assignedClasses.includes(id)
          );
          if (search) {
            const lowerSearch = search.toLowerCase();
            data = data.filter(
              (c) =>
                c.title?.toLowerCase().includes(lowerSearch) ||
                c.description?.toLowerCase().includes(lowerSearch)
            );
          }
          const key = sortBy === 'createdAt' ? 'createdAt' : 'title';
          data = sortArray(data, key, sortDir);
          const pageResponse = paginate(data, page, size);
          return {
            data: {
              content: pageResponse.content,
              totalElements: pageResponse.totalElements,
              totalPages: pageResponse.totalPages,
              size: pageResponse.size,
              number: pageResponse.number,
              first: pageResponse.first,
              last: pageResponse.last,
            },
            status: 200,
          };
        }
        const item = initialClasses.find((c) => c.id === id);
        return { data: { message: null, data: item || null }, status: item ? 200 : 404 };
      }
      const activeParam = searchParams.get('active');
      const page = parseInt(searchParams.get('page') || '0');
      const size = parseInt(searchParams.get('size') || '10');
      const search = searchParams.get('search') || '';
      const sortBy = searchParams.get('sortBy') || 'name';
      const sortDir = searchParams.get('sortDir') || 'ASC';

      let data = initialClasses.slice();
      if (activeParam !== null) {
        const mustBeActive = activeParam === 'true';
        data = data.filter((c) => !!c.active === mustBeActive);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter((c) => c.name?.toLowerCase().includes(lowerSearch));
      }
      const key = sortBy === 'createdAt' ? 'createdAt' : 'name';
      data = sortArray(data, key, sortDir);

      const pageResponse = paginate(data, page, size);

      return {
        data: {
          message: null,
          data: pageResponse,
        },
        status: 200,
      };
    }

    if (fullUrl.includes('/course')) {
      const idMatch = fullUrl.match(/\/course\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = initialCourses.find((c) => c.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }
      return { data: initialCourses, status: 200 };
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

    if (fullUrl.includes('/module')) {
      const idMatch = fullUrl.match(/\/module\/(\d+)/);
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

      const pageResponse = paginate(data, page, size);

      return {
        data: {
          content: pageResponse.content,
          totalElements: pageResponse.totalElements,
          totalPages: pageResponse.totalPages,
          size: pageResponse.size,
          number: pageResponse.number,
          first: pageResponse.first,
          last: pageResponse.last,
        },
        status: 200,
      };
    }

    if (
      fullUrl.includes('/user') &&
      !fullUrl.includes('/user/instructors') &&
      !fullUrl.includes('/user/profile')
    ) {
      const combinedUsers = [];
      initialActiveInstructors.forEach((i) => {
        combinedUsers.push({
          id: i.id,
          name: i.name,
          email: i.email,
          role: 'instructor',
          active: true,
        });
      });
      initialInactiveInstructors.forEach((i) => {
        combinedUsers.push({
          id: i.id,
          name: i.name,
          email: i.email,
          role: 'instructor',
          active: false,
        });
      });
      initialStudents.forEach((s) => {
        combinedUsers.push({
          id: s.id,
          name: s.name,
          email: s.email,
          role: 'student',
          active: !!s.active,
        });
      });
      combinedUsers.push({
        id: 901,
        name: 'Administrador Mock',
        email: 'admin@email.com',
        role: 'admin',
        active: true,
      });

      const idMatch = fullUrl.match(/\/user\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const item = combinedUsers.find((u) => u.id === id);
        return { data: item || null, status: item ? 200 : 404 };
      }

      return { data: combinedUsers, status: 200 };
    }

    if (fullUrl.includes('/invite') && !fullUrl.includes('/invite/send')) {
      const page = parseInt(searchParams.get('page') || '0');
      const size = parseInt(searchParams.get('size') || '10');
      const search = searchParams.get('search') || '';
      const classroomId = searchParams.get('classroomId');

      let data = initialPendingInvites.slice();
      if (classroomId) {
        const cid = parseInt(classroomId);
        data = data.filter((i) => i.classroomId === cid);
      }

      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter((i) => i.email?.toLowerCase().includes(lowerSearch));
      }

      const pageResponse = paginate(data, page, size);

      return {
        data: {
          content: pageResponse.content,
          totalElements: pageResponse.totalElements,
          totalPages: pageResponse.totalPages,
          size: pageResponse.size,
          number: pageResponse.number,
          first: pageResponse.first,
          last: pageResponse.last,
        },
        status: 200,
      };
    }
  }

  if (method === 'post') {
    if (fullUrl.includes('/classroom')) {
      const idMatch = fullUrl.match(/\/classroom\/(\d+)/);
      if (idMatch && fullUrl.endsWith('/courses')) {
        const classroomId = parseInt(idMatch[1]);
        const ids = (config?.data?.ids ?? []).map((x) => parseInt(x));
        ids.forEach((cid) => {
          const course = initialCourses.find((c) => c.id === cid);
          if (course) {
            course.assignedClasses = Array.isArray(course.assignedClasses)
              ? course.assignedClasses
              : [];
            if (!course.assignedClasses.includes(classroomId)) {
              course.assignedClasses.push(classroomId);
            }
          }
        });
        return { data: { message: null, data: null }, status: 204 };
      }
    }
  }

  if (method === 'delete') {
    if (fullUrl.includes('/classroom')) {
      const match = fullUrl.match(/\/classroom\/(\d+)\/courses\/(\d+)/);
      if (match) {
        const classroomId = parseInt(match[1]);
        const courseId = parseInt(match[2]);
        const course = initialCourses.find((c) => c.id === courseId);
        if (course && Array.isArray(course.assignedClasses)) {
          course.assignedClasses = course.assignedClasses.filter((clId) => clId !== classroomId);
        }
        return { data: { message: null, data: null }, status: 204 };
      }
    }
  }

  if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
    if (method === 'post' && fullUrl.includes('/invite/resend')) {
      return { data: { message: 'Convite reenviado com sucesso' }, status: 200 };
    }
    if (method === 'delete' && fullUrl.includes('/invite')) {
      return { data: { message: 'Convite removido com sucesso' }, status: 204 };
    }
    if (method === 'post' && fullUrl.includes('/classroom/create')) {
      const name = (config?.data?.name || 'Nova Turma').toString();
      const nowIso = new Date().toISOString();
      const created = { id: Date.now(), name, active: true, createdAt: nowIso };
      return { data: { message: 'Turma criada com sucesso', data: created }, status: 201 };
    }
    if (method === 'patch' && /\/classroom\/\d+\/students\/status/.test(fullUrl)) {
      const idMatch = fullUrl.match(/\/classroom\/(\d+)/);
      const classroomId = idMatch ? parseInt(idMatch[1]) : undefined;
      const payload = config?.data || {};
      const occurrenceId =
        typeof payload?.id === 'string' ? parseInt(payload.id) : Number(payload?.id);
      const active = Boolean(payload?.status);

      if (Number.isFinite(classroomId) && Number.isFinite(occurrenceId)) {
        const idx = initialStudents.findIndex(
          (s) => s.id === occurrenceId && s.classId === classroomId
        );
        if (idx >= 0) {
          initialStudents[idx] = { ...initialStudents[idx], active };
        }
      }
      return { data: { message: 'Status atualizado com sucesso' }, status: 200 };
    }
    if (method === 'delete' && /\/classroom\/\d+\/students$/.test(fullUrl)) {
      const idMatch = fullUrl.match(/\/classroom\/(\d+)/);
      const classroomId = idMatch ? parseInt(idMatch[1]) : undefined;
      const payload = config?.data || {};
      const occurrenceId =
        typeof payload?.id === 'string' ? parseInt(payload.id) : Number(payload?.id);
      if (Number.isFinite(classroomId) && Number.isFinite(occurrenceId)) {
        const idx = initialStudents.findIndex(
          (s) => s.id === occurrenceId && s.classId === classroomId
        );
        if (idx >= 0) {
          initialStudents.splice(idx, 1);
          return { data: { message: 'Removido com sucesso' }, status: 200 };
        }
        return { data: { message: 'Não encontrado' }, status: 404 };
      }
      return { data: { message: 'Requisição inválida' }, status: 400 };
    }
    if (
      fullUrl.includes('/course') ||
      fullUrl.includes('/modules') ||
      fullUrl.includes('/classroom') ||
      fullUrl.includes('/announcements') ||
      fullUrl.includes('/students') ||
      (fullUrl.includes('/user') && !fullUrl.includes('/auth'))
    ) {
      const isNoContent = method === 'delete' || method === 'patch';
      return {
        data: isNoContent
          ? { message: 'Sucesso', data: null }
          : { id: Date.now(), ...config.data, message: 'Sucesso' },
        status: isNoContent ? 204 : method === 'post' ? 201 : 200,
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
  const safeMsg = import.meta.env.DEV ? msg : 'Ocorreu um erro inesperado. Tente novamente.';

  if (isCorsError(status, errData)) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  if (status === 409) {
    const isDuplicateError =
      msg.toLowerCase().includes('duplicate') ||
      msg.toLowerCase().includes('already exists') ||
      msg.toLowerCase().includes('já existe');

    const conflictMsg = isDuplicateError
      ? 'O recurso já existe. Tente novamente.'
      : import.meta.env.DEV
        ? msg || 'Conflito ao processar a solicitação'
        : 'Conflito ao processar a solicitação';

    showToast({ message: conflictMsg, type: 'error' });
    setInline(import.meta.env.DEV ? msg : '');
    return;
  }

  if (status >= 500) {
    showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
    setInline('');
    return;
  }

  setInline(safeMsg);
};

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
  api = {};
}

export { api, axiosInstance };
