import { BarChart3, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockJobs } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const recentJobs = mockJobs.slice(0, 5);

  const totalJobs = mockJobs.length;
  const successJobs = mockJobs.filter((j) => j.status === "success").length;
  const failedJobs = mockJobs.filter((j) => j.status === "failed").length;
  const successRate = ((successJobs / totalJobs) * 100).toFixed(1);
  const avgDuration = (mockJobs.reduce((a, j) => a + j.duration, 0) / totalJobs / 1000).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground text-balance">Overview</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Monitor your data extraction pipeline at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Jobs" value={totalJobs} icon={BarChart3} trend="+3 today" index={0} />
        <StatsCard title="Successful" value={successJobs} icon={CheckCircle2} trend={`${successRate}% rate`} variant="success" index={1} />
        <StatsCard title="Failed" value={failedJobs} icon={XCircle} trend={`${(100 - parseFloat(successRate)).toFixed(1)}% rate`} variant="destructive" index={2} />
        <StatsCard title="Success Rate" value={`${successRate}%`} icon={TrendingUp} trend="+2.1% vs last week" variant="success" index={3} />
        <StatsCard title="Avg Time" value={`${avgDuration}s`} icon={Clock} trend="-0.3s vs last week" variant="warning" index={4} />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        className="rounded-xl border border-border bg-card shadow-sm"
      >
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-[13px] font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => navigate("/history")}
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4 min-w-0">
                <StatusBadge status={job.status} />
                <span className="truncate font-mono text-[13px] text-foreground">{job.url}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{job.duration}ms</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(job.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
