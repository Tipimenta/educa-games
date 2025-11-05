import { axiosInstance } from './api';

export const classroomsService = {
  list: async () => {
    const response = await axiosInstance.get('/classrooms');
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/classrooms/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/classrooms', data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/classrooms/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/classrooms/${id}`);
    return response;
  },
};
