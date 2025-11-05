import { axiosInstance } from './api';

export const modulesService = {
  list: async (courseId) => {
    const url = courseId ? `/modules?courseId=${courseId}` : '/modules';
    const response = await axiosInstance.get(url);
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/modules/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/modules', data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/modules/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/modules/${id}`);
    return response;
  },
};
