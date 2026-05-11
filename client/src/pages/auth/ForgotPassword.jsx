import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';

export default function ForgotPassword() {
  const [resetUrl, setResetUrl] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    setResetUrl('');

    try {
      const { data } = await apiClient.post('/auth/forgot-password', values);
      setResetUrl(data.data?.resetUrl || '');
      toast.success(data.message || 'Reset instructions generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to request reset link');
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
      <Toaster position="top-right" />

      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Password recovery</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Forgot password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your email to generate a secure reset link.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Generating link...' : 'Send reset link'}
        </button>
      </form>

      {resetUrl && (
        <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
          Development reset link:{' '}
          <Link className="font-semibold underline" to={new URL(resetUrl).pathname}>
            Open reset page
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        Remembered your password?{' '}
        <Link className="font-semibold text-slate-950 hover:text-teal-700" to="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
