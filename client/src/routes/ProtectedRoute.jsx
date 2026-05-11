import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const persistedToken = localStorage.getItem('accessToken');

  if (!isAuthenticated && !token && !persistedToken) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
