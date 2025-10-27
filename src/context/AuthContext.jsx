import PropTypes from 'prop-types';
import { createContext, useEffect, useRef, useState } from 'react';

import { UnauthorizedError } from '../lib/errors';
import { api } from '../services/api';

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const checkSession = async () => {
      try {
        const response = await api.auth.getMe();
        setUser(response.data);
      } catch (error) {
        if (error instanceof UnauthorizedError || error?.status === 401) {
          setUser(null);
        } else {
          console.error('Erro ao verificar sessão:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    const path = window.location?.pathname || '';
    const publicPaths = ['/login', '/cadastro', '/recuperar-senha', '/redefinir-senha'];
    if (publicPaths.some((p) => path.startsWith(p))) {
      setLoading(false);
      return;
    }

    checkSession();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
