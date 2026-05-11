import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks.js';

export default function PublicRoute() {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const persistedToken = localStorage.getItem('accessToken');

  if (isAuthenticated || token || persistedToken) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
