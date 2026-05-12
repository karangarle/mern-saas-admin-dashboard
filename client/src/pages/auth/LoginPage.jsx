import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks.js';
import { loginUser } from '../../redux/features/auth/authSlice.js';
import { notify } from './ToastNotifications.jsx';

// Role-based redirect map
const ROLE_REDIRECT = {
  admin: '/app/users',
  manager: '/app/users',
  user: '/app',
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const from = location.state?.from?.pathname || null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');

    try {
      const result = await dispatch(loginUser(values)).unwrap();
      notify({ message: 'Welcome back. Your workspace is ready.' });

      // If there's a saved "from" path use it, otherwise redirect by role
      const role = result?.user?.role || 'user';
      const destination = from || ROLE_REDIRECT[role] || '/app';
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error || 'Unable to sign in. Please try again.';
      setServerError(message);
      notify({ type: 'error', message });
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Secure login</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in to manage your SaaS dashboard.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {serverError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700" htmlFor="login-password">
              Password
            </label>
            <Link
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
              to="/auth/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New to the platform?{' '}
        <Link className="font-semibold text-slate-950 hover:text-teal-700" to="/auth/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
