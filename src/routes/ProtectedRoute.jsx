import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { ROLES } from '../constants/roles';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading, checkSession } = useContext(AuthContext);

  useEffect(() => {
    if (!user && !loading) {
      checkSession();
    }
  }, [user, loading, checkSession]);

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
