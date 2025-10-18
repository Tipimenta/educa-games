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

          if (role === ROLES.INSTRUCTOR) {
            navigate('/Admin/Courses');
          } else if (role === ROLES.STUDENT) {
            navigate('/Dashboard');
          } else {
            navigate('/Dashboard');
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
          console.error('Error response is not JSON:', errorText);
          errData = { message: errorText || 'Erro desconhecido do servidor.' };
        }
        setErrorMessage(extractErrorMessage(errData));
      }
    } catch (err) {
      setErrorMessage('Erro de rede ou servidor indisponível.');
      console.error(err);
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
