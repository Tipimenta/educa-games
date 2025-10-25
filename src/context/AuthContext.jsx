import { createContext, useState } from 'react';

import { api } from '../services';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const checkSession = async () => {
    if (isLoggingOut || hasLoggedOut) return;
    setLoading(true);
    try {
      const response = await api.auth.getMe();
      if (response === null) {
        setUser(null);
      } else if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error.message === 'Erro desconhecido') {
        // Suprime o log para o estado esperado de sessão inválida
        setUser(null);
      } else {
        console.error('Fluxo de autenticação falhou:', error);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkSession,
        isLoggingOut,
        setIsLoggingOut,
        hasLoggedOut,
        setHasLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
