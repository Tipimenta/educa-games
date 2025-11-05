import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../constants';
import { AuthContext } from '../context';
import { presentError } from '../services';
import { useAuthUser, useLogin, useLogout, useRegister } from './useAuthQuery';
import { useToast } from './useToast';

export const useAuth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(AuthContext);
  const { showToast } = useToast();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const { refetch: refetchUser } = useAuthUser({ enabled: false });

  const login = async (email, password) => {
    setErrorMessage('');
    try {
      await loginMutation.mutateAsync({ email, password });
      const result = await refetchUser();
      const user = result.data;

      if (user && (user.id || user.userId)) {
        const normalizedUser = user.userId && !user.id ? { ...user, id: user.userId } : user;
        setUser(normalizedUser);
        const role = normalizedUser.role;
        const normalizedRole = role.toLowerCase();

        if (normalizedRole === ROLES.INSTRUCTOR) {
          navigate('/instructor/manage-classes');
        } else if (normalizedRole === ROLES.STUDENT) {
          navigate('/dashboard');
        } else if (normalizedRole === ROLES.ADMIN) {
          navigate('/admin/manage-instructors');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMessage('Login bem-sucedido, mas não foi possível obter os dados do usuário.');
        setUser(null);
        navigate('/login');
      }
    } catch (err) {
      const status = err?.status || 500;
      const errData = err?.data || { message: err?.message || 'Erro ao fazer login' };

      if (status >= 400 && status < 500) {
        presentError({ status, errData, setInline: setErrorMessage, showToast });
      } else {
        showToast({
          message: 'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.',
          type: 'error',
        });
        setErrorMessage('');
      }
      console.error('Erro de login:', err);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (err) {
      console.error('Erro no logout:', err);
      setUser(null);
      navigate('/login');
    }
  };

  const register = async (userData) => {
    setErrorMessage('');
    try {
      const result = await registerMutation.mutateAsync(userData);
      setUser(result);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.status || 500;
      const errData = err?.data || {};

      if (status >= 400 && status < 500) {
        presentError({
          status,
          errData,
          setInline: setErrorMessage,
          showToast,
        });
      } else {
        showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
        setErrorMessage('');
      }
      console.error('Erro no cadastro:', err);
    }
  };

  return { login, logout, register, errorMessage };
};
