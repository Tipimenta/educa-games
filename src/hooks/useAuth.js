import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../constants/roles';
import { AuthContext } from '../context/AuthContext';
import { api, extractErrorMessage } from '../services/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(AuthContext);

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

          // Normalizar o role para minúsculas para comparação
          const normalizedRole = role.toLowerCase();

          if (normalizedRole === ROLES.INSTRUCTOR) {
            navigate('/admin/manage-courses');
          } else if (normalizedRole === ROLES.STUDENT) {
            navigate('/dashboard');
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
        setErrorMessage(extractErrorMessage(errData));
      }
    } catch (err) {
      // Tratar erros de rede e CORS de forma mais específica
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

      setErrorMessage(userFriendlyMessage);
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

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        navigate('/dashboard');
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(extractErrorMessage(errData));
      }
    } catch (err) {
      setErrorMessage('Erro de rede ou servidor indisponível.');
      console.error(err);
    }
  };

  return { login, logout, register, errorMessage };
};
