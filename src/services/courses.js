import { axiosInstance } from './api';

export const coursesService = {
  list: async () => {
    const response = await axiosInstance.get('/courses');
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/courses', data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/courses/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/courses/${id}`);
    return response;
  },
};
