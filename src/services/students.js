import { axiosInstance } from './api';
const PATH = '/v1/students';
const CLASSROOM_PATH = '/v1/classroom';

export const studentsService = {
  list: async () => {
    const response = await axiosInstance.get(PATH);
    return response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${PATH}/${id}`);
    return response;
  },

  getByClassroomAndId: async (classroomId, studentId) => {
    const response = await axiosInstance.get(`${CLASSROOM_PATH}/${classroomId}/students/${studentId}`);
    return response?.data || response;
  },

  getByClassroom: async ({
    classroomId,
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

    const response = await axiosInstance.get(
      `${CLASSROOM_PATH}/${classroomId}/students?${params.toString()}`
    );
    const pageData = response?.data || response;
    return {
      content: pageData?.content || [],
      totalElements: pageData?.totalElements || 0,
      totalPages: pageData?.totalPages || 0,
      size: pageData?.size || size,
      number: pageData?.number || page,
      first: pageData?.first ?? true,
      last: pageData?.last ?? false,
    };
  },

  updateClassroomStatus: async ({ classroomId, id, active }) => {
    const response = await axiosInstance.patch(`${CLASSROOM_PATH}/${classroomId}/students/status`, {
      id,
      status: active,
    });
    return response;
  },

  removeFromClassroom: async ({ classroomId, id }) => {
    const response = await axiosInstance.delete(`${CLASSROOM_PATH}/${classroomId}/students`, {
      data: { id },
    });
    return response;
  },
};
