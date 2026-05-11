import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks.js';

export default function PrivateRoute() {
  const location = useLocation();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const persistedToken = localStorage.getItem('accessToken');

  if (!isAuthenticated && !token && !persistedToken) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
