import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute - User:', user);
  console.log('PrivateRoute - Allowed Roles:', allowedRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth');
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not allowed. Redirecting to home.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;