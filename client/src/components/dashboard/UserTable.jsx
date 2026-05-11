const roleStyles = {
  admin: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  manager: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  user: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
};

export default function UserTable({
  users = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
          <thead className="bg-slate-50 dark:bg-white/[0.03]">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">User</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Joined</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                        {user.name?.slice(0, 2).toUpperCase() || 'US'}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">{user.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${roleStyles[user.role] || roleStyles.user}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className={user.isActive ? 'text-sm font-medium text-emerald-600 dark:text-emerald-300' : 'text-sm font-medium text-slate-400'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        onClick={() => onEdit?.(user)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        onClick={() => onDelete?.(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
