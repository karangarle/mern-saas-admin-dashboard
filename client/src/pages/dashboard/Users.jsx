import { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import apiClient from '../../services/apiClient.js';
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
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [form, setForm] = useState(initialForm);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const queryParams = useMemo(() => ({
    page: pagination.page,
    limit: pagination.limit,
    search: filters.search,
    role: filters.role,
    status: filters.status,
  }), [filters, pagination.limit, pagination.page]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await apiClient.get('/users', { params: queryParams });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingUser(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  const handleDelete = async (user) => {
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

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            User management
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create, update, search, and manage user access across the dashboard.
          </p>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
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
              <button type="button" className="text-sm font-medium text-slate-500 hover:text-slate-950 dark:hover:text-white" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                minLength="2"
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            {!editingUser && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleFormChange}
                  required
                  minLength="8"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500">Use uppercase, lowercase, number, and symbol.</p>
              </label>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</span>
                <select
                  name="role"
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
              disabled={saving}
              className="h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
            >
              {saving ? 'Saving...' : editingUser ? 'Update user' : 'Create user'}
            </button>
          </div>
        </form>

        <section className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-3">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search users"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-200 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
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

          <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing page <span className="font-semibold text-slate-950 dark:text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-950 dark:text-white">{pagination.totalPages}</span>, total{' '}
              <span className="font-semibold text-slate-950 dark:text-white">{pagination.total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage(pagination.page - 1)}
                className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
                className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
