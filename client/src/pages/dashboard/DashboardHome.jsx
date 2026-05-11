import RevenueChart from '../../components/charts/RevenueChart.jsx';
import UserStatsChart from '../../components/charts/UserStatsChart.jsx';
import StatsCard from '../../components/dashboard/StatsCard.jsx';

const stats = [
  {
    title: 'Total revenue',
    value: '$128.4k',
    change: '12.8%',
    trend: 'up',
    description: 'Recurring revenue from active SaaS accounts.',
  },
  {
    title: 'Active users',
    value: '24,892',
    change: '9.4%',
    trend: 'up',
    description: 'Users active across all workspaces this month.',
  },
  {
    title: 'Churn rate',
    value: '1.8%',
    change: '0.6%',
    trend: 'down',
    description: 'Subscription churn compared with last month.',
  },
  {
    title: 'Conversion',
    value: '7.2%',
    change: '2.1%',
    trend: 'up',
    description: 'Trial accounts converted to paid subscriptions.',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 62000 },
  { month: 'Feb', revenue: 69000 },
  { month: 'Mar', revenue: 81000 },
  { month: 'Apr', revenue: 78400 },
  { month: 'May', revenue: 92000 },
  { month: 'Jun', revenue: 103000 },
  { month: 'Jul', revenue: 98000 },
  { month: 'Aug', revenue: 116000 },
  { month: 'Sep', revenue: 121000 },
  { month: 'Oct', revenue: 128400 },
];

const userStatsData = [
  { week: 'W1', active: 5400, newUsers: 820 },
  { week: 'W2', active: 6100, newUsers: 960 },
  { week: 'W3', active: 6800, newUsers: 1140 },
  { week: 'W4', active: 7350, newUsers: 1280 },
  { week: 'W5', active: 7900, newUsers: 1370 },
  { week: 'W6', active: 8600, newUsers: 1490 },
];

const recentActivity = [
  {
    title: 'Enterprise plan upgraded',
    description: 'Acme Workspace moved to annual billing.',
    time: '8 min ago',
  },
  {
    title: 'New admin invited',
    description: 'Priya Sharma joined the operations team.',
    time: '24 min ago',
  },
  {
    title: 'Usage alert resolved',
    description: 'API request volume returned to normal range.',
    time: '1 hr ago',
  },
  {
    title: 'Report exported',
    description: 'Monthly revenue report was downloaded.',
    time: '2 hrs ago',
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Analytics
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Business overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Monitor revenue, user growth, and operational activity across your SaaS workspace.
          </p>
        </div>

        <button
          type="button"
          className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/70 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:shadow-none dark:hover:bg-white/10"
        >
          Export
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <RevenueChart data={revenueData} />
        <UserStatsChart data={userStatsData} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Latest operational events across the workspace.
          </p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/10">
          {recentActivity.map((item) => (
            <div key={item.title} className="flex gap-4 px-5 py-4">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.12)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <time className="shrink-0 text-xs font-medium text-slate-400">{item.time}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
