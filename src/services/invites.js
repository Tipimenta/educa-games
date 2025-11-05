import { api, axiosInstance } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const invitesService = {
  send: async (email) => {
    if (USE_MOCKS) {
      return api.invite.send(email);
    }
    const response = await axiosInstance.post('/invite/send', { email });
    return response;
  },

  list: async ({ page = 0, size = 10, search = '', sortBy = 'email', sortDir = 'ASC', classroomId = null }) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortDir,
    });
    if (search) {
      params.append('search', search);
    }
    if (classroomId) {
      params.append('classroomId', String(classroomId));
    }
    const response = await axiosInstance.get(`/invite?${params}`);
    const pageData = response?.data || response;
    return {
      content: pageData?.content || [],
      totalElements: pageData?.totalElements || 0,
      totalPages: pageData?.totalPages || 0,
      size: pageData?.size || size,
      number: pageData?.number || page,
      first: pageData?.first ?? true,
      last: pageData?.last ?? false,
    };
  },

  resend: async (id) => {
    const response = await axiosInstance.post(`/invites/${id}/resend`);
    return response;
  },

  remove: async (id) => {
    const response = await axiosInstance.delete('/invite', { data: { id } });
    return response;
  },
};
