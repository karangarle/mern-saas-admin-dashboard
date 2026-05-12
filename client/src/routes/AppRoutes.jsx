import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AuthLayout from '../pages/auth/AuthLayout.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';
import DashboardHome from '../pages/dashboard/DashboardHome.jsx';
import Users from '../pages/dashboard/Users.jsx';
import Profile from '../pages/dashboard/Profile.jsx';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → redirect to app */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Public-only routes (redirect to /app if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Protected routes — any authenticated user */}
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />

            {/* Admin + Manager only */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
              <Route path="users" element={<Users />} />
            </Route>
          </Route>
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
