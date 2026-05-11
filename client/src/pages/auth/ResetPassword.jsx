import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async ({ password }) => {
    try {
      const { data } = await apiClient.patch(`/auth/reset-password/${token}`, { password });
      toast.success(data.message || 'Password reset successfully');
      window.setTimeout(() => navigate('/auth/login', { replace: true }), 700);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
      <Toaster position="top-right" />

      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">Secure reset</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Create new password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use a strong password to protect your workspace.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            New password
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

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200"
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="h-12 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Back to{' '}
        <Link className="font-semibold text-slate-950 hover:text-teal-700" to="/auth/login">
          sign in
        </Link>
      </p>
    </div>
  );
}
