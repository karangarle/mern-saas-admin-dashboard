import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks.js';
import { registerUser } from '../../redux/features/auth/authSlice.js';
import { notify } from './ToastNotifications.jsx';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await dispatch(registerUser(values)).unwrap();
      notify({ message: 'Account created. Welcome to your dashboard.' });
      navigate('/app', { replace: true });
    } catch (error) {
      const message = error || 'Unable to create your account. Please try again.';
      setServerError(message);
      notify({ type: 'error', message });
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
          Create workspace
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Start securely
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create your account and enter the dashboard.
        </p>
      </div>

      {/* Role info banner */}
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <div className="text-xs leading-5 text-sky-800">
          <p className="font-semibold">This creates a regular user account.</p>
          <p className="mt-0.5 text-sky-700">
            Admins and Managers are created by the system administrator via the
            dashboard's <span className="font-semibold">User Management</span> panel.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {serverError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="register-name">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="register-email">
            Email address
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
                message: 'Use uppercase, lowercase, number, and symbol',
              },
            })}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">
            Min 8 chars · uppercase · lowercase · number · symbol
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-semibold text-slate-950 hover:text-teal-700" to="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
