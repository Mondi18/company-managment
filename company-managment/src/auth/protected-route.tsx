import { Navigate } from 'react-router-dom';
import { useAuth } from './use-auth';

const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/employees-list" replace />;
  }

  return children;
};

export default ProtectedRoute;