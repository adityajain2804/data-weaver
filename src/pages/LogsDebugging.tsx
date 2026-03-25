import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Filter } from "lucide-react";
import { mockLogs } from "@/lib/mock-data";

const levels = ["all", "info", "success", "warning", "error"] as const;

export default function LogsDebugging() {
  const [levelFilter, setLevelFilter] = useState<typeof levels[number]>("all");

  const filtered = mockLogs.filter((l) => levelFilter === "all" || l.level === levelFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Logs & Debugging</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Inspect Playwright steps, errors, and network activity.</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <div className="flex gap-1">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                levelFilter === level ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface-alt"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Log viewer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="rounded-lg border border-border bg-card"
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Terminal className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[13px] font-medium text-foreground">Console Output</span>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">{filtered.length} entries</span>
        </div>

        <div className="max-h-[500px] overflow-auto p-1">
          <div className="space-y-0">
            {filtered.map((log, i) => (
              <div
                key={i}
                className="flex gap-4 rounded px-4 py-1 font-mono text-[12px] transition-colors hover:bg-surface-alt"
              >
                <span className="shrink-0 text-muted-foreground tabular-nums">{log.timestamp}</span>
                <span className={`shrink-0 w-16 text-right uppercase text-[10px] font-semibold ${
                  log.level === "error" ? "text-destructive" :
                  log.level === "warning" ? "text-warning" :
                  log.level === "success" ? "text-success" :
                  "text-muted-foreground"
                }`}>
                  {log.level}
                </span>
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
        </div>
      </motion.div>
    </div>
  );
}
