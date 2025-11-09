import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileService } from '../services/profile';

export function useProfile(options = {}) {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileService.get,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useUpdateProfile(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    ...options,
  });
}