import { BarChart3, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockJobs, mockChartData } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const recentJobs = mockJobs.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Monitor your scraping pipeline at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Jobs" value={126} icon={BarChart3} trend="+12 today" index={0} />
        <StatsCard title="Successful" value={118} icon={CheckCircle2} trend="93.6% rate" variant="success" index={1} />
        <StatsCard title="Failed" value={8} icon={XCircle} trend="6.4% rate" variant="destructive" index={2} />
        <StatsCard title="Avg Response" value="2.4s" icon={Clock} trend="-0.3s vs last week" variant="warning" index={3} />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16, ease: [0.2, 0, 0, 1] }}
        className="rounded-lg border border-border bg-card p-5"
      >
        <h2 className="text-[13px] font-medium text-foreground">Success Rate — Last 7 Days</h2>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(216,100%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(216,100%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#a1a1a1', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a1a1a1', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(240,4%,9%)',
                  border: '1px solid hsl(240,4%,16%)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#ededed'
                }}
              />
              <Area type="monotone" dataKey="success" stroke="hsl(216,100%,50%)" fill="url(#successGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="failed" stroke="hsl(0,100%,62%)" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        className="rounded-lg border border-border bg-card"
      >
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-[13px] font-medium text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate(`/history`)}
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-surface-alt"
            >
              <div className="flex items-center gap-4 min-w-0">
                <StatusBadge status={job.status} />
                <span className="truncate font-mono text-[13px] text-foreground">{job.url}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{job.duration}ms</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(job.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
