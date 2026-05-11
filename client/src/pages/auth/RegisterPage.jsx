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
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
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
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Create workspace</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start securely</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create your admin profile and enter the dashboard.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {serverError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
          {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
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
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
                message: 'Use uppercase, lowercase, number, and symbol',
              },
            })}
          />
          {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>}
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
