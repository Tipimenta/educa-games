import { useContext, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';

import { ROLES } from '../constants';
import { AuthContext } from '../context';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading, checkSession, isLoggingOut, hasLoggedOut } = useContext(AuthContext);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!hasCheckedRef.current && !user && !loading && !isLoggingOut && !hasLoggedOut) {
      hasCheckedRef.current = true;
      checkSession();
    }
  }, [user, loading, isLoggingOut, hasLoggedOut, checkSession]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  // Normalizar o role para minúsculas para comparação
  const normalizedUserRole = user.role.toLowerCase();

  if (!allowedRoles.includes(normalizedUserRole))
    return (
      <Navigate
        to={normalizedUserRole === ROLES.INSTRUCTOR ? '/admin/manage-courses' : '/dashboard'}
        replace
      />
    );

  return children;
};

export default ProtectedRoute;
