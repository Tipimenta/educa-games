import { axiosInstance } from './api';

export const studentsService = {
  list: async () => {
    const response = await axiosInstance.get('/students');
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response;
  },

  getByClass: async (classId) => {
    const response = await axiosInstance.get(`/students?classId=${classId}`);
    return response;
  },
};
