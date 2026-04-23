import { BarChart3, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PipelineSummaryStrip } from "@/components/PipelineFlow";
import { listJobs, subscribeJobs } from "@/lib/job-store";
import type { ScrapeJob } from "@/lib/mock-data";

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ScrapeJob[]>(listJobs());

  useEffect(() => {
    setJobs(listJobs());
    return subscribeJobs(() => setJobs(listJobs()));
  }, []);

  const recentJobs = jobs.slice(0, 5);
  const totalJobs = jobs.length;
  const successJobs = jobs.filter((j) => j.status === "completed" || j.status === "success").length;
  const failedJobs = jobs.filter((j) => j.status === "failed").length;
  const successRate = totalJobs > 0 ? ((successJobs / totalJobs) * 100).toFixed(1) : "0.0";
  const completedDurations = jobs.filter((j) => j.duration > 0).map((j) => j.duration);
  const avgDuration = completedDurations.length > 0
    ? (completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length / 1000).toFixed(1)
    : "0.0";

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
              onClick={() => navigate(`/job/${job.id}`)}
              className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <StatusBadge status={job.status} />
                <span className="truncate font-mono text-[13px] text-foreground">{job.url}</span>
              </div>
              <div className="hidden md:block w-[200px] shrink-0">
                <PipelineSummaryStrip jobId={job.id} />
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                {new Date(job.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
