export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}) {
  const safeTotalPages = Math.max(totalPages, 1);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1)
    .filter((item) => item === 1 || item === safeTotalPages || Math.abs(item - page) <= 1);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-white">{start}</span> to{' '}
        <span className="font-medium text-slate-900 dark:text-white">{end}</span> of{' '}
        <span className="font-medium text-slate-900 dark:text-white">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Previous
        </button>

        {pages.map((item, index) => {
          const previous = pages[index - 1];
          const showGap = previous && item - previous > 1;

          return (
            <span key={item} className="inline-flex items-center gap-2">
              {showGap && <span className="text-slate-400">...</span>}
              <button
                type="button"
                onClick={() => onPageChange?.(item)}
                className={[
                  'min-w-9 rounded-md px-3 py-1.5 font-medium',
                  item === page
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10',
                ].join(' ')}
              >
                {item}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange?.(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Next
        </button>
      </div>
    </div>
  );
}
