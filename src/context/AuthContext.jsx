import { createContext, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthUser } from '../hooks/useAuthQuery';

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const location = useLocation();
  const [explicitUser, setExplicitUser] = useState(null);
  const isLoggingOutRef = useRef(false);

  const isPublicPath = useMemo(() => {
    const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
    const pathname = location.pathname;
    return publicPaths.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)));
  }, [location.pathname]);

  const shouldFetchUser = !isPublicPath && !isLoggingOutRef.current;

  const {
    data: queryUser,
    isLoading: loading,
    refetch,
  } = useAuthUser({
    enabled: shouldFetchUser,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const user = explicitUser !== null ? explicitUser : queryUser;

  const setUser = (newUser) => {
    if (newUser === null) {
      isLoggingOutRef.current = true;
      setExplicitUser(null);
    } else {
      isLoggingOutRef.current = false;
      setExplicitUser(newUser);
      if (!isPublicPath) {
        refetch();
      }
    }
  };

  useEffect(() => {
    if (isPublicPath) {
      isLoggingOutRef.current = false;
    }
  }, [isPublicPath]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading: isPublicPath ? false : loading }}>
      {children}
    </AuthContext.Provider>
  );
}
