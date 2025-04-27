// src/components/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/auth" />;

  if (requiredRole && user.role !== requiredRole && user.role=="client") return <Navigate to="/feedback" />;
  if (requiredRole && user.role !== requiredRole && user.role=="admin") return <Navigate to="/admin" />;
  return children;
};

export default PrivateRoute;
