import { axiosInstance } from './api';

export const announcementsService = {
  list: async () => {
    const response = await axiosInstance.get('/announcements');
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/announcements/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/announcements', data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/announcements/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/announcements/${id}`);
    return response;
  },
};
