import { getPlainText } from '../utils/text';
import { axiosInstance } from './api';

const PATH = '/v1/module';

const unwrap = (response) => response?.data ?? response;

export const modulesService = {
  _sanitizePayload: (data) => {
    const payload = { ...(data || {}) };
    if (Array.isArray(payload.lessons)) {
      payload.lessons = payload.lessons.map((lesson) => {
        const copy = { ...(lesson || {}) };
        const plain = getPlainText(copy.description || '').trim();
        if (!plain) {
          delete copy.description;
        }
        return copy;
      });
    }
    return payload;
  },

  list: async (courseId, options = {}) => {
    const { page = 0, size = 10, search = '', sortBy = 'createdAt', sortDir = 'DESC' } = options;

    const params = new URLSearchParams();
    if (courseId) params.set('courseId', String(courseId));
    if (search) params.set('search', search);
    params.set('page', String(page));
    params.set('size', String(size));
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);

    const url = `${PATH}?${params.toString()}`;
    const response = await axiosInstance.get(url);
    const data = unwrap(response);
    const result = data?.data ?? data;

    return {
      content: result?.content || [],
      totalElements: result?.totalElements || 0,
      totalPages: result?.totalPages || 0,
      size: result?.size || size,
      number: result?.number || page,
      first: result?.first ?? true,
      last: result?.last ?? false,
    };
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  create: async (data) => {
    const body = modulesService._sanitizePayload(data);
    const response = await axiosInstance.post(PATH, body);
    const res = unwrap(response);
    return res?.data ?? res;
  },

  update: async (id, data) => {
    const body = modulesService._sanitizePayload(data);
    const response = await axiosInstance.put(`${PATH}/${id}`, body);
    return unwrap(response);
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`${PATH}/${id}`);
    return unwrap(response);
  },

  addLessons: async (moduleId, lessons, files = null) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify({ lessons })], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }
    const response = await axiosInstance.post(`${PATH}/${moduleId}/lessons`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrap(response);
  },

  updateLessons: async (moduleId, lessons, files = null) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify({ lessons })], { type: 'application/json' }));

    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('files', file);
        }
      });
    }

    const response = await axiosInstance.put(`${PATH}/${moduleId}/lessons`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrap(response);
  },

  createQuiz: async (moduleId, quiz) => {
    const response = await axiosInstance.post(`${PATH}/${moduleId}/quiz`, quiz);
    return unwrap(response);
  },

  updateQuiz: async (moduleId, quiz) => {
    const response = await axiosInstance.put(`${PATH}/${moduleId}/quiz`, quiz);
    return unwrap(response);
  },
};
