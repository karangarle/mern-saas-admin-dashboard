import { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAppSelector } from '../../redux/hooks.js';
import apiClient from '../../services/apiClient.js';
import Pagination from '../../components/common/Pagination.jsx';
import UserTable from '../../components/tables/UserTable.jsx';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  isActive: true,
};

const getErrorMessage = (error) => (
  error.response?.data?.errors?.[0]?.message
  || error.response?.data?.message
  || 'Something went wrong'
);

export default function Users() {
  // ── Current user role ───────────────────────────────────────────────────────
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';

  // ── State ───────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState('');

  // ── Debounce search ─────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
      setPagination((current) => ({ ...current, page: 1 }));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const queryParams = useMemo(() => ({
    page: pagination.page,
    limit: pagination.limit,
    search: debouncedSearch,
    role: filters.role,
    status: filters.status,
  }), [debouncedSearch, filters.role, filters.status, pagination.limit, pagination.page]);

  // ── Fetch users ─────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (signal) => {
    setLoading(true);
    setListError('');
    try {
      const { data } = await apiClient.get('/users', { params: queryParams, signal });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      if (error.name === 'CanceledError') return;
      const message = getErrorMessage(error);
      setListError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(initialForm);
    setEditingUser(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    if (name !== 'search') setPagination((current) => ({ ...current, page: 1 }));
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (user) => {
    if (!isAdmin) return; // guard: only admin can edit
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
  };

  // ── Create / Update ─────────────────────────────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) return; // guard
    setSaving(true);
    try {
      if (editingUser) {
        const { password, ...payload } = form;
        await apiClient.patch(`/users/${editingUser.id}`, payload);
        toast.success('User updated successfully');
      } else {
        await apiClient.post('/users', form);
        toast.success('User created successfully');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (user) => {
    if (!isAdmin) return; // guard
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
    try {
      await apiClient.delete(`/users/${user.id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const setPage = (page) => {
    setPagination((current) => ({
      ...current,
      page: Math.min(Math.max(page, 1), current.totalPages),
    }));
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            User management
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isAdmin
              ? 'Create, update, search, and manage user access across the dashboard.'
              : 'Browse and search all dashboard users. Contact an admin to make changes.'}
          </p>
        </div>

        {/* Role badge */}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isAdmin
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
            : 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300'
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isAdmin ? 'Admin — Full Access' : 'Manager — Read Only'}
        </span>
      </div>

      {/* Manager read-only notice */}
      {isManager && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Read-only access.</span> Managers can view all users but cannot create, edit, or delete accounts. Contact an admin to make changes.
          </p>
        </div>
      )}

      <section className={`grid gap-6 ${isAdmin ? 'xl:grid-cols-[0.9fr_1.4fr]' : ''}`}>

        {/* ── Create / Edit form (admin only) ──────────────────────────────── */}
        {isAdmin && (
          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
            onSubmit={handleSubmit}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                  {editingUser ? 'Edit user' : 'Create user'}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingUser ? 'Update profile and access.' : 'Invite a dashboard user.'}
                </p>
              </div>
              {editingUser && (
                <button
                  type="button"
                  className="text-sm font-medium text-slate-500 hover:text-slate-950 dark:hover:text-white"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                <input
                  name="name"
                  id="user-form-name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  minLength="2"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>

              {/* Email */}
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                <input
                  name="email"
                  id="user-form-email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>

              {/* Password (create only) */}
              {!editingUser && (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                  <input
                    name="password"
                    id="user-form-password"
                    type="password"
                    value={form.password}
                    onChange={handleFormChange}
                    required
                    minLength="8"
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-slate-500">Uppercase · lowercase · number · symbol</p>
                </label>
              )}

              {/* Role + Active */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</span>
                  <select
                    name="role"
                    id="user-form-role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>

                <label className="mt-7 flex h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-white/10">
                  <input
                    name="isActive"
                    id="user-form-active"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-slate-300 text-slate-950"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
                </label>
              </div>

              <button
                type="submit"
                id="user-form-submit"
                disabled={saving}
                className="h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
              >
                {saving ? 'Saving...' : editingUser ? 'Update user' : 'Create user'}
              </button>
            </div>
          </form>
        )}

        {/* ── Users list + filters ─────────────────────────────────────────── */}
        <section className="space-y-4">
          {/* Filters */}
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-3">
            <label className="relative">
              <span className="sr-only">Search users</span>
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search name or email"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-9 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
              {loading && (
                <span className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
              )}
            </label>

            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {listError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {listError}
            </div>
          )}

          {/* Table — pass role flags */}
          <UserTable
            users={users}
            loading={loading}
            canEdit={isAdmin}
            canDelete={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            isLoading={loading}
            onPageChange={setPage}
          />
        </section>
      </section>
    </div>
  );
}
