import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useToast } from '../../../hooks';
import { NetworkError, UnauthorizedError, ValidationError } from '../../../lib/errors';
import { api, presentError } from '../../../services';

export const useInviteValidation = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [inviteToken, setInviteToken] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const validateInvite = useCallback(
    async (token) => {
      setIsLoadingInvite(true);
      setInviteError('');
      try {
        const response_data = await api.auth.validateInvite(token);

        const inviteInfo = response_data?.data;
        const backendMessage = response_data?.message;

        if (!inviteInfo || !inviteInfo.email) {
          setInviteData(null);
          setInviteError(backendMessage || 'Convite inválido ou expirado.');
          return null;
        }

        setInviteData(inviteInfo);
        setInviteError('');
        return inviteInfo;
      } catch (error) {
        if (error instanceof NetworkError) {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setInviteError('');
        } else if (error instanceof UnauthorizedError) {
          setInviteError('Sessão expirada. Faça login novamente.');
        } else if (error instanceof ValidationError || error?.status) {
          presentError({
            status: error.status || 400,
            errData: error.data || { message: error.message },
            setInline: (msg) => setInviteError(msg),
            showToast,
          });
        } else {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setInviteError('');
        }
        return null;
      } finally {
        setIsLoadingInvite(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('invite');

    if (!window.__lastInviteTokenRef) {
      window.__lastInviteTokenRef = { value: null };
    }
    const last = window.__lastInviteTokenRef;

    if (token && token !== last.value) {
      last.value = token;
      setInviteToken(token);
      validateInvite(token);
    } else if (!token) {
      setInviteError(
        'Acesso negado. Esta página só pode ser acessada através de um convite válido.'
      );
    }
  }, [searchParams, validateInvite]);

  return {
    inviteToken,
    inviteData,
    isLoadingInvite,
    inviteError,
  };
};
