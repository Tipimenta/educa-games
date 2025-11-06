import { axiosInstance } from './api';

export const usersService = {
  list: async () => {
    const response = await axiosInstance.get('/users');
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response;
  },

  listInstructors: async ({
    active,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'email',
    sortDir = 'ASC',
  }) => {
    const params = new URLSearchParams({
      active: String(active),
      page: String(page),
      size: String(size),
      sortBy,
      sortDir,
    });
    if (search) {
      params.append('search', search);
    }
    const response = await axiosInstance.get(`/user/instructors?${params}`);
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

  create: async (data) => {
    const response = await axiosInstance.post('/users', data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.put('/user/status', { id, status });
    return response;
  },

  deleteInstructor: async (id) => {
    const response = await axiosInstance.delete('/user/instructors', { data: { id } });
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response;
  },
};
