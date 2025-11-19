import { axiosInstance } from './api';

const PATH = '/v1/announcements';

const unwrap = (response) => response?.data ?? response;

export const announcementsService = {
  list: async () => {
    const response = await axiosInstance.get(PATH);
    const data = unwrap(response);
    return data?.data ?? data ?? [];
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  create: async (data) => {
    const response = await axiosInstance.post(PATH, data);
    const result = unwrap(response);
    return result?.data ?? result;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`${PATH}/${id}`, data);
    const result = unwrap(response);
    return result?.data ?? result;
  },

  delete: async (id) => {
    await axiosInstance.delete(`${PATH}/${id}`);
  },
};
