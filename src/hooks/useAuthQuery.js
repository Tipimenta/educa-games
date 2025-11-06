import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authService } from '../services';

export function useAuthUser(options = {}) {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.cancelQueries({ queryKey: ['auth', 'me'] });
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useValidateInvite(options = {}) {
  return useMutation({
    mutationFn: authService.validateInvite,
    ...options,
  });
}

export function useCompleteSignup() {
  return useMutation({
    mutationFn: authService.completeSignup,
  });
}
