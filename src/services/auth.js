import { api, axiosInstance } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const extractData = (response) => {
  const userData = response?.data || response;
  const normalized =
    userData?.userId && !userData.id ? { ...userData, id: userData.userId } : userData;
  if (normalized?.role) {
    normalized.role = normalized.role.toLowerCase();
  }
  // Preserva o array classes se existir
  if (userData?.classes) {
    normalized.classes = userData.classes;
  }
  return normalized;
};

const extractInvite = (response) => {
  const inviteData = response?.data;

  if (!inviteData?.email) {
    return {
      invite: null,
      message: response?.message ?? null,
    };
  }

  const invite = {
    email: inviteData.email,
    role: inviteData.role?.toLowerCase() || inviteData.role,
  };

  // Inclui className quando disponível (para convites de estudante)
  if (inviteData.className) {
    invite.className = inviteData.className;
  }

  // Inclui requiresSignup quando disponível
  if (inviteData.requiresSignup !== undefined) {
    invite.requiresSignup = inviteData.requiresSignup;
  }

  return {
    invite,
    message: response?.message ?? null,
  };
};
const extractMessage = (response) => response?.message ?? response ?? null;

export const authService = {
  login: async (email, password) => {
    if (USE_MOCKS) {
      return api.auth.login(email, password);
    }
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response;
  },

  logout: async () => {
    if (USE_MOCKS) {
      return api.auth.logout();
    }
    const response = await axiosInstance.post('/auth/logout', {});
    return response;
  },

  getMe: async () => {
    if (USE_MOCKS) {
      const response = await api.auth.getMe();
      return extractData(response);
    }
    const response = await axiosInstance.get('/auth/me');
    return extractData(response);
  },

  register: async (userData) => {
    if (USE_MOCKS) {
      return api.auth.register(userData);
    }
    const response = await axiosInstance.post('/auth/register', userData);
    return response;
  },

  validateInvite: async (token) => {
    if (USE_MOCKS) {
      throw { status: 404, data: { message: 'Mock não implementado para validateInvite' } };
    }
    const response = await axiosInstance.get(`/auth/validate-invite?token=${token}`);
    return extractInvite(response);
  },

  completeSignup: async (payload) => {
    if (USE_MOCKS) {
      throw { status: 404, data: { message: 'Mock não implementado para completeSignup' } };
    }
    const response = await axiosInstance.post('/auth/complete-signup', payload);
    return extractMessage(response);
  },

  selectClass: async (classId) => {
    if (USE_MOCKS) {
      throw { status: 404, data: { message: 'Mock não implementado para selectClass' } };
    }
    const response = await axiosInstance.post('/auth/select-class', { classId });
    return extractData(response);
  },
};
