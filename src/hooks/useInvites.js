import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invitesService } from '../services';

export function useInvites(options = {}) {
  const {
    page = 0,
    size = 10,
    search = '',
    sortBy = 'email',
    sortDir = 'ASC',
    classroomId = null,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['invites', { page, size, search, sortBy, sortDir, classroomId }],
    queryFn: () => invitesService.list({ page, size, search, sortBy, sortDir, classroomId }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useSendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesService.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
}

export function useResendInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesService.resend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
}

export function useRemoveInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
    },
  });
}

export function useInstructorInvites(options = {}) {
  const {
    page = 0,
    size = 10,
    search = '',
    sortBy = 'email',
    sortDir = 'ASC',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['invites', 'instructor', { page, size, search, sortBy, sortDir }],
    queryFn: () => invitesService.list({ page, size, search, sortBy, sortDir, classroomId: null }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}
