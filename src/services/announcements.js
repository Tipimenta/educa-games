import { axiosInstance } from './api';

const PATH = '/v1/announcements';

export const announcementsService = {
  list: async () => {
    const response = await axiosInstance.get(PATH);
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await axiosInstance.post(PATH, data);
    return response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`${PATH}/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`${PATH}/${id}`);
    return response;
  },
};
