import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { classroomsService } from '../services';

export function useClassrooms() {
  return useQuery({
    queryKey: ['classrooms'],
    queryFn: classroomsService.list,
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
