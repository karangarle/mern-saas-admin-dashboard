import { Link, Outlet } from 'react-router-dom';
import ToastNotifications from './ToastNotifications.jsx';

const metrics = [
  { label: 'Uptime', value: '99.9%' },
  { label: 'Teams', value: '2.4k' },
  { label: 'Reports', value: '18m' },
];

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <ToastNotifications />

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden px-10 py-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.24),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_54%,#111827_100%)]" />
          <div className="absolute inset-x-10 top-28 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-sm font-black text-slate-950">
                MS
              </span>
              <span className="text-sm font-semibold tracking-wide text-slate-200">
                MERN SaaS Admin
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-teal-200">
              Executive command center
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Secure access for modern operations teams.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
              Manage users, insights, and SaaS workflows from a focused admin experience built for production teams.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            {metrics.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  MS
                </span>
                <span className="text-sm font-semibold text-slate-800">MERN SaaS Admin</span>
              </Link>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
