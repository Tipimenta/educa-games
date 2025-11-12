import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { studentsService } from '../services';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsService.getById(id),
    enabled: !!id,
  });
}

export function useClassroomStudents(options = {}) {
  const {
    classroomId,
    active,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'name',
    sortDir = 'ASC',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['students', 'classroom', { classroomId, active, page, size, search, sortBy, sortDir }],
    queryFn: () => studentsService.getByClassroom({ classroomId, active, page, size, search, sortBy, sortDir }),
    enabled: !!classroomId && typeof active === 'boolean' && enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateClassroomStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, id, active }) => studentsService.updateClassroomStatus({ classroomId, id, active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', 'classroom'] });
    },
  });
}

export function useRemoveClassroomStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, id }) => studentsService.removeFromClassroom({ classroomId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', 'classroom'] });
    },
  });
}
