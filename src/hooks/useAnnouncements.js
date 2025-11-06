import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { announcementsService } from '../services';

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: announcementsService.list,
  });
}

export function useAnnouncement(id) {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => announcementsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => announcementsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', variables.id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announcementsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}
