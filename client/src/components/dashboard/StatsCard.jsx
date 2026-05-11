export default function StatsCard({ title, value, change, trend = 'up', description }) {
  const isPositive = trend === 'up';

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>

        <span
          className={[
            'inline-flex shrink-0 items-center rounded-md px-2 py-1 text-xs font-semibold',
            isPositive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
          ].join(' ')}
        >
          {isPositive ? '+' : '-'}
          {change}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </article>
  );
}
