import { axiosInstance } from './api';
const PATH = '/v1/classroom';

const unwrap = (response) => response?.data ?? response;

export const classroomsService = {
  listAvailable: async () => {
    const response = await axiosInstance.get(`${PATH}/availableClasses`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

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

    const response = await axiosInstance.get(`${PATH}?${params.toString()}`);
    const data = unwrap(response);
    const pageData = data?.data ?? data;
    return pageData;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    const data = unwrap(response);
    return data?.data ?? data;
  },

  create: async (data) => {
    const response = await axiosInstance.post(`${PATH}/create`, data);
    const res = unwrap(response);
    return res?.data ?? res;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`${PATH}/${id}`, data);
    return unwrap(response);
  },

  attachCourses: async (classroomId, courseIds = []) => {
    const body = { ids: Array.isArray(courseIds) ? courseIds : [] };
    const response = await axiosInstance.post(`${PATH}/${classroomId}/courses`, body);
    return unwrap(response);
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`${PATH}/${id}`);
    return unwrap(response);
  },

  detachCourse: async (classroomId, courseId) => {
    const response = await axiosInstance.delete(`${PATH}/${classroomId}/courses/${courseId}`);
    return unwrap(response);
  },
  
  listCoursesByClassroom: async ({
    classroomId,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'title',
    sortDir = 'ASC',
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortDir,
    });
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`${PATH}/${classroomId}/courses?${params.toString()}`);
    const data = unwrap(response);
    const pageData = data?.data ?? data;
    return pageData;
  },
};
