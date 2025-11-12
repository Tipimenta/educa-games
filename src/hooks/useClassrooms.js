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
