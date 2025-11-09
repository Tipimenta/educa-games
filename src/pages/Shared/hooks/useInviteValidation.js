import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useToast } from '../../../hooks';
import { useValidateInvite } from '../../../hooks/useAuthQuery';
import { extractErrorMessage, presentError } from '../../../services';

export const useInviteValidation = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const lastTokenRef = useRef(null);
  const [inviteError, setInviteError] = useState('');

  const token = useMemo(
    () => searchParams.get('token') || searchParams.get('invite'),
    [searchParams]
  );

  const {
    data: normalized,
    isLoading: isLoadingInvite,
    mutate: validateInvite,
  } = useValidateInvite({
    onError: (err) => {
      const status = err?.status || 500;
      const errData = err?.data || { message: err?.message };
      const errorMessage = errData?.message || err?.message || '';

      if (status >= 500) {
        showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
        setInviteError('');
      } else if (status === 401) {
        setInviteError('Sessão expirada. Faça login novamente.');
      } else if (status === 409 && errorMessage.toLowerCase().includes('convite')) {
        const backendMessage = extractErrorMessage(errData);
        setInviteError(backendMessage);
      } else {
        presentError({
          status,
          errData,
          setInline: (msg) => setInviteError(msg),
          showToast,
        });
      }
    },
  });

  useEffect(() => {
    if (token) {
      if (token !== lastTokenRef.current) {
        lastTokenRef.current = token;
        setInviteError('');
        validateInvite(token);
      } else if (!normalized && !isLoadingInvite) {
        validateInvite(token);
      }
    } else {
      setInviteError(
        'Acesso negado. Esta página só pode ser acessada através de um convite válido.'
      );
    }
  }, [token, validateInvite, normalized, isLoadingInvite]);

  const inviteData = useMemo(() => {
    if (!normalized) return null;
    const inviteInfo = normalized?.invite;
    if (!inviteInfo || !inviteInfo.email) {
      const backendMessage = normalized?.message;
      if (backendMessage && !inviteError) {
        setInviteError(backendMessage || 'Convite inválido ou expirado.');
      }
      return null;
    }
    const normalizedRole = inviteInfo.role?.toLowerCase() || inviteInfo.role;
    const data = {
      email: inviteInfo.email,
      role: normalizedRole,
    };
    // Inclui className quando disponível (para convites de estudante)
    if (inviteInfo.className) {
      data.className = inviteInfo.className;
    }
    // Inclui requiresSignup quando disponível
    if (inviteInfo.requiresSignup !== undefined) {
      data.requiresSignup = inviteInfo.requiresSignup;
    }
    return data;
  }, [normalized, inviteError]);

  return {
    inviteToken: token,
    inviteData,
    isLoadingInvite,
    inviteError,
  };
};
