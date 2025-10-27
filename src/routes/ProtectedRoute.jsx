import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { ROLES } from '../constants';
import { AuthContext } from '../context';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

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
