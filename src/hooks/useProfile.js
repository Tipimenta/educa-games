import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileService } from '../services/profile';

export function useProfile(options = {}) {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileService.get,
    retry: false,
    // Atualiza apenas quando houver invalidação explícita
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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