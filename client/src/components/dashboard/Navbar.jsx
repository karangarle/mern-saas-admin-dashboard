import { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.js';
import { logout, logoutUser } from '../../redux/features/auth/authSlice.js';
import { authService } from '../../services/authService.js';

export default function Navbar({ onMenuClick }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');

      window.setTimeout(async () => {
        await dispatch(logoutUser());
        dispatch(logout());
        navigate('/auth/login', { replace: true });
      }, 650);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Helper to format image URL (handle local storage vs cloudinary)
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendUrl}${url}`;
  };

  const userImageUrl = getImageUrl(user?.profileImage?.url);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/80">
      <Toaster position="top-right" />
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Workspace
          </p>
          <h1 className="truncate text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
            Admin Dashboard
          </h1>
        </div>

        <div className="hidden h-10 min-w-72 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition-colors duration-200 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 md:flex">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="truncate">Search users, reports, settings</span>
          <span className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:border-white/10 dark:bg-slate-900">
            /
          </span>
        </div>

        <button
          type="button"
          className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/60 transition-colors duration-200 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:shadow-none dark:hover:bg-white/10 sm:inline-flex"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </button>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="View notifications"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 shadow-sm shadow-slate-200/60 transition-all duration-200 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:hover:bg-white/10"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <div className="grid h-7 w-7 place-items-center overflow-hidden rounded-md bg-slate-950 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-950">
              {userImageUrl ? (
                <img src={userImageUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {user?.name || 'User'}
            </span>
            <svg
              className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 transition-all duration-200 dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
              <div className="mb-2 border-b border-slate-100 px-3 py-2 dark:border-white/5">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
                <p className="mt-1 inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                  {user?.role}
                </p>
              </div>

              <Link
                to="/app/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Edit Profile
              </Link>

              <Link
                to="/app/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings
              </Link>

              <button
                type="button"
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
