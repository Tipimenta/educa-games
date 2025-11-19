import { axiosInstance } from './api';
const PATH = '/v1/course';

const unwrap = (response) => response?.data ?? response;

export const coursesService = {
  list: async () => {
    const response = await axiosInstance.get(PATH);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  create: async (payload) => {
    const body = {
      title: payload?.title ?? '',
      description: payload?.description ?? '',
      classroomId: Array.isArray(payload?.assignedClasses)
        ? payload.assignedClasses[0] ?? null
        : payload?.classroomId ?? null,
    };
    const response = await axiosInstance.post(PATH, body);
    const data = unwrap(response);
    return data;
  },

  update: async (id, data) => {
    // Backend atual não expõe update; manter assinatura para futuro
    const response = await axiosInstance.put(`${PATH}/${id}`, data);
    return unwrap(response);
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(PATH, { data: { id } });
    return unwrap(response);
  },
};
