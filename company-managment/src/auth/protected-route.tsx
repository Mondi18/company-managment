import { useAuth } from './use-auth';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../data/type';

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role!)) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;