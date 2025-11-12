import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { coursesService } from '../services';

export function useCourses(options = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useCourse(id) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => coursesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coursesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
