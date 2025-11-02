import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../constants';
import { AuthContext } from '../context';
import { api, presentError } from '../services';
import { useToast } from './useToast';

export const useAuth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(AuthContext);
  const { showToast } = useToast();

  const login = async (email, password) => {
    setErrorMessage('');
    try {
      const res = await api.auth.login(email, password);

      const clonedRes = res.clone();

      if (res.ok) {
        const userData = await api.auth.getMe();

        if (userData && userData.data) {
          setUser(userData.data);
          const role = userData.data.role;

          const normalizedRole = role.toLowerCase();

          if (normalizedRole === ROLES.INSTRUCTOR) {
            navigate('/instructor/manage-courses');
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
      } else {
        const contentType = res.headers.get('Content-Type');
        let errData = {};
        if (contentType && contentType.includes('application/json')) {
          errData = await clonedRes.json().catch(() => ({}));
        } else {
          const errorText = await clonedRes.text();
          errData = { message: errorText || 'Erro desconhecido do servidor.' };
        }

        presentError({ status: res.status, errData, setInline: setErrorMessage, showToast });
      }
    } catch (err) {
      let userFriendlyMessage =
        'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.';

      if (err.message) {
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('cors') || errorMsg.includes('cross-origin')) {
          userFriendlyMessage =
            'Não foi possível conectar ao servidor. Tente novamente em alguns instantes.';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          userFriendlyMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
        } else if (errorMsg.includes('timeout')) {
          userFriendlyMessage = 'A conexão demorou muito para responder. Tente novamente.';
        }
      }

      showToast({ message: userFriendlyMessage, type: 'error' });
      setErrorMessage('');
      console.error('Erro de login:', err);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const register = async (userData) => {
    setErrorMessage('');
    try {
      const res = await api.auth.register(userData);

      if (res && typeof res.ok === 'boolean') {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          navigate('/dashboard');
        } else {
          const errData = await res.json().catch(() => ({}));
          presentError({ status: res.status, errData, setInline: setErrorMessage, showToast });
        }
      } else {
        setUser(res);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err?.status) {
        presentError({
          status: err.status,
          errData: err.data || {},
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
