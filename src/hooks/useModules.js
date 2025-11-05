import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { modulesService } from '../services';

export function useModules(courseId) {
  return useQuery({
    queryKey: courseId ? ['modules', courseId] : ['modules'],
    queryFn: () => modulesService.list(courseId),
  });
}

export function useModule(id) {
  return useQuery({
    queryKey: ['modules', id],
    queryFn: () => modulesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modulesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => modulesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['modules', variables.id] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modulesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
}
