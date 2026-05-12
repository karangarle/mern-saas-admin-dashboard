import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks.js';

export default function UnauthorizedPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <svg
            className="h-8 w-8 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Heading */}
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
          Access Denied
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          403 — Unauthorized
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {user
            ? `Your account (${user.role}) doesn't have permission to view this page.`
            : 'You must be logged in to access this page.'}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/app"
            id="unauthorized-go-home"
            className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/auth/login"
            id="unauthorized-sign-in"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Sign in as different user
          </Link>
        </div>
      </div>
    </div>
  );
}
