import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks.js';

/**
 * RoleRoute — wraps routes that require specific roles.
 * Props:
 *   allowedRoles: string[]  e.g. ['admin'] or ['admin','manager']
 *
 * Behaviour:
 *   - Not authenticated → redirect to /auth/login (with return path)
 *   - Authenticated but wrong role → redirect to /unauthorized
 *   - Authenticated + correct role → render <Outlet />
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
  const persistedToken = localStorage.getItem('accessToken');

  // Not logged in at all
  if (!isAuthenticated && !token && !persistedToken) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // Logged in but insufficient role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
