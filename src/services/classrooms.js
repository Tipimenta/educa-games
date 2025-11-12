import { axiosInstance } from './api';

const unwrap = (response) => response?.data ?? response;

export const classroomsService = {

  listByInstructor: async ({
    active,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'name',
    sortDir = 'ASC',
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortDir,
    });
    if (typeof active === 'boolean') params.set('active', String(active));
    if (search) params.set('search', search);

    const response = await axiosInstance.get(`/classroom?${params.toString()}`);
    const data = unwrap(response);
    const pageData = data?.data ?? data;
    return pageData;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/classroom/${id}`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/classroom/create', data);
    const res = unwrap(response);
    return res?.data ?? res;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/classroom/${id}`, data);
    return unwrap(response);
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/classroom/${id}`);
    return unwrap(response);
  },
};
