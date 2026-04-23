import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, RefreshCw, AlertTriangle, Clock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StageStatus } from "@/hooks/usePipelineStatus";

interface StageCardProps {
  stage: "bronze" | "silver" | "gold";
  status: StageStatus;
  recordCount?: number | null;
  processingTimeSec?: number | null;
  lastUpdated?: string | null;
  errorMessage?: string | null;
  onRetry?: () => void;
}

const STAGE_CONFIG = {
  bronze: {
    label: "Bronze",
    sublabel: "Raw Data",
    emoji: "🏺",
    activeBorder: "border-amber-400/60 dark:border-amber-500/40",
    activeBg: "bg-amber-50/80 dark:bg-amber-950/20",
    glow: "rgba(217,119,6,0.25)",
  },
  silver: {
    label: "Silver",
    sublabel: "Curated Data",
    emoji: "⚗️",
    activeBorder: "border-sky-400/60 dark:border-sky-500/40",
    activeBg: "bg-sky-50/80 dark:bg-sky-950/20",
    glow: "rgba(14,165,233,0.25)",
  },
  gold: {
    label: "Gold",
    sublabel: "Aggregated Data",
    emoji: "✨",
    activeBorder: "border-yellow-400/60 dark:border-yellow-500/40",
    activeBg: "bg-yellow-50/80 dark:bg-yellow-950/20",
    glow: "rgba(234,179,8,0.25)",
  },
} as const;

const STATUS_CONFIG: Record<StageStatus, { label: string; icon: React.ReactNode; textClass: string }> = {
  pending: { label: "Pending", icon: null, textClass: "text-muted-foreground" },
  processing: { label: "Processing…", icon: <Loader2 className="h-3 w-3 animate-spin" />, textClass: "text-primary" },
  completed: { label: "Processed", icon: <CheckCircle2 className="h-3 w-3" />, textClass: "text-success" },
  failed: { label: "Failed", icon: <XCircle className="h-3 w-3" />, textClass: "text-destructive" },
  blocked: { label: "Blocked", icon: <AlertTriangle className="h-3 w-3" />, textClass: "text-muted-foreground/60" },
};

export function StageCard({
  stage, status, recordCount, processingTimeSec, lastUpdated, errorMessage, onRetry,
}: StageCardProps) {
  const sc = STAGE_CONFIG[stage];
  const st = STATUS_CONFIG[status];
  const isProcessing = status === "processing";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";
  const isBlocked = status === "blocked";

  return (
    <motion.div
      animate={isProcessing
        ? { boxShadow: [`0 0 0px ${sc.glow}`, `0 0 16px ${sc.glow}`, `0 0 0px ${sc.glow}`] }
        : { boxShadow: "0 0 0px rgba(0,0,0,0)" }
      }
      transition={isProcessing ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
      className={cn(
        "relative flex flex-col items-center rounded-xl border p-4 text-center transition-all duration-300 min-h-[160px]",
        isProcessing && `${sc.activeBorder} ${sc.activeBg}`,
        isCompleted && "border-success/30 bg-success/5",
        isFailed && "border-destructive/40 bg-destructive/5",
        isBlocked && "border-border bg-muted/20 opacity-50",
        !isProcessing && !isCompleted && !isFailed && !isBlocked && "border-border bg-card",
      )}
    >
      {isProcessing && (
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}

      <span className="text-3xl mb-2 select-none" role="img" aria-label={sc.label}>{sc.emoji}</span>

      <p className="text-[13px] font-semibold text-foreground leading-tight">{sc.label}</p>
      <p className="text-[11px] text-muted-foreground mb-3">{sc.sublabel}</p>

      <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", st.textClass,
        isCompleted && "bg-success/10",
        isProcessing && "bg-primary/10",
        isFailed && "bg-destructive/10",
        isBlocked && "bg-muted/50",
        !isCompleted && !isProcessing && !isFailed && !isBlocked && "bg-muted/50",
      )}>
        {st.icon}
        {st.label}
      </div>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 w-full rounded-lg border border-border/50 bg-background/70 p-2 space-y-1 text-left"
        >
          {recordCount != null && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Database className="h-3 w-3 shrink-0" />
              <span><span className="font-semibold text-foreground tabular-nums">{recordCount.toLocaleString()}</span> records</span>
            </div>
          )}
          {processingTimeSec != null && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span><span className="font-semibold text-foreground tabular-nums">{processingTimeSec}s</span> elapsed</span>
            </div>
          )}
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="tabular-nums">{new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          )}
        </motion.div>
      )}

      {isFailed && errorMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 w-full rounded-lg bg-destructive/10 px-2 py-1.5 text-left text-[10px] text-destructive leading-relaxed"
        >
          {errorMessage}
        </motion.p>
      )}

      {isFailed && onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="mt-2 h-6 px-2.5 text-[10px] border-destructive/40 text-destructive hover:bg-destructive/10 shadow-none"
        >
          <RefreshCw className="mr-1 h-3 w-3" /> Retry
        </Button>
      )}
    </motion.div>
  );
}
