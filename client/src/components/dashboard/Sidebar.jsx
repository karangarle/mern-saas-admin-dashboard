import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks.js';

const primaryNavigation = [
  { name: 'Overview', href: '/app', icon: 'grid', roles: ['admin', 'manager', 'user'] },
  { name: 'Users', href: '/app/users', icon: 'users', roles: ['admin', 'manager'] },
  { name: 'Projects', href: '/app/projects', icon: 'layers', roles: ['admin', 'manager', 'user'] },
  { name: 'Reports', href: '/app/reports', icon: 'chart', roles: ['admin', 'manager', 'user'] },
  { name: 'Billing', href: '/app/billing', icon: 'card', roles: ['admin'] },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/app/settings', icon: 'settings' },
  { name: 'Support', href: '/app/support', icon: 'help' },
];

function Icon({ name }) {
  const common = 'h-4 w-4';

  if (name === 'users') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === 'layers') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </svg>
    );
  }

  if (name === 'chart') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16V9" />
        <path d="M12 16V6" />
        <path d="M16 16v-4" />
      </svg>
    );
  }

  if (name === 'card') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  if (name === 'settings') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2.4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.24.62.82 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    );
  }

  if (name === 'help') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.7 2.7 0 0 1 5.1 1.3c0 1.8-1.7 2.2-2.3 3.2" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}

function NavigationGroup({ items, onClose }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          end={item.href === '/app'}
          onClick={onClose}
          className={({ isActive }) => [
            'group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
            isActive
              ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white',
          ].join(' ')}
        >
          <Icon name={item.icon} />
          <span>{item.name}</span>
          {item.badge && (
            <span className="ml-auto rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAppSelector((state) => state.auth);

  const filteredPrimaryNav = primaryNavigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'US';

  // Helper for image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendUrl}${url}`;
  };

  const userImageUrl = getImageUrl(user?.profileImage?.url);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/95 px-4 py-4 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-200 dark:border-white/10 dark:bg-slate-950/95 lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand Section */}
        <div className="flex h-12 items-center justify-between">
          <NavLink to="/app" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
              MS
            </span>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold leading-5 text-slate-950 dark:text-white">
                MERN SaaS
              </span>
              <span className="block truncate text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Admin Console
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Workspace Indicator */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">Acme Workspace</p>
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">Production environment</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-6 flex-1 space-y-8 overflow-y-auto pr-1 custom-scrollbar">
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Main Menu
            </p>
            <NavigationGroup items={filteredPrimaryNav} onClose={onClose} />
          </div>

          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Management
            </p>
            <NavigationGroup items={secondaryNavigation} onClose={onClose} />
          </div>
        </div>

        {/* Footer User Section */}
        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50/50 p-2 dark:bg-white/[0.02]">
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
              {userImageUrl ? (
                <img src={userImageUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
