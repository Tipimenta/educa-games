import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { classroomsService } from '../services';

export function useClassrooms(options = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['classrooms', 'all'],
    queryFn: async () => {
      const [activePage, inactivePage] = await Promise.all([
        classroomsService.listByInstructor({ active: true, page: 0, size: 1000, search: '', sortBy: 'name', sortDir: 'ASC' }),
        classroomsService.listByInstructor({ active: false, page: 0, size: 1000, search: '', sortBy: 'name', sortDir: 'ASC' }),
      ]);
      const activeClasses = activePage?.content ?? [];
      const inactiveClasses = inactivePage?.content ?? [];
      return [...activeClasses, ...inactiveClasses];
    },
    enabled,
  });
}

export function useClassroom(id) {
  return useQuery({
    queryKey: ['classrooms', id],
    queryFn: () => classroomsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => classroomsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['classrooms', variables.id] });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

export function useAvailableClasses(options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['classrooms', 'available'],
    queryFn: classroomsService.listAvailable,
    enabled,
  });
}

export function useClassroomCourses(options = {}) {
  const {
    classroomId,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'title',
    sortDir = 'ASC',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['courses', 'classroom', { classroomId, page, size, search, sortBy, sortDir }],
    queryFn: () => classroomsService.listCoursesByClassroom({ classroomId, page, size, search, sortBy, sortDir }),
    enabled: !!classroomId && enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useDetachCourseFromClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, courseId }) => classroomsService.detachCourse(classroomId, courseId),
    onSuccess: () => {
      // Atualiza listagem de cursos por turma e detalhes de turmas
      queryClient.invalidateQueries({ queryKey: ['courses', 'classroom'] });
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}

export function useAttachCoursesToClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, courseIds }) => classroomsService.attachCourses(classroomId, courseIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'classroom'] });
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}
