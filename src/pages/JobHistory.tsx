import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { mockJobs, mockLogs, mockProductData } from "@/lib/mock-data";
import type { ScrapeJob } from "@/lib/mock-data";

export default function JobHistory() {
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const [search, setSearch] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"logs" | "results">("logs");

  const filtered = mockJobs
    .filter((j) => filter === "all" || j.status === filter)
    .filter((j) => j.url.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Job History</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Browse and inspect past scraping jobs.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by URL..."
            className="border-border bg-card pl-10 text-[13px] text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "success", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface-alt"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="rounded-lg border border-border bg-card"
      >
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_140px_100px] gap-4 border-b border-border px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>URL</span>
          <span>Status</span>
          <span>Timestamp</span>
          <span>Duration</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((job) => (
            <div key={job.id}>
              <button
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="grid w-full grid-cols-[1fr_100px_140px_100px] gap-4 items-center px-5 py-3 text-left transition-colors hover:bg-surface-alt"
              >
                <span className="truncate font-mono text-[13px] text-foreground">{job.url}</span>
                <StatusBadge status={job.status} />
                <span className="text-[12px] text-muted-foreground">
                  {new Date(job.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-muted-foreground tabular-nums">{job.duration}ms</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedJob === job.id ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                </div>
              </button>

              {/* Expanded Detail */}
              {expandedJob === job.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border bg-background"
                >
                  <div className="flex gap-1 border-b border-border px-5 py-2">
                    {(["logs", "results"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setDetailTab(tab)}
                        className={`rounded-md px-3 py-1 text-[11px] font-medium capitalize transition-colors ${
                          detailTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-64 overflow-auto p-4">
                    {detailTab === "logs" ? (
                      <div className="space-y-0.5 font-mono text-[12px]">
                        {mockLogs.map((log, i) => (
                          <div key={i} className="flex gap-3 rounded px-2 py-0.5 hover:bg-surface-alt">
                            <span className="shrink-0 text-muted-foreground">{log.timestamp}</span>
                            <span className={
                              log.level === "error" ? "text-destructive" :
                              log.level === "warning" ? "text-warning" :
                              log.level === "success" ? "text-success" :
                              "text-foreground"
                            }>
                              {log.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="font-mono text-[12px] text-foreground">
                        {JSON.stringify(mockProductData, null, 2)}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
