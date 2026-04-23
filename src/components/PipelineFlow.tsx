import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, AlertCircle, CheckCircle2, Loader2, BarChart3 } from "lucide-react";
import { StageCard } from "@/components/StageCard";
import { usePipelineStatus } from "@/hooks/usePipelineStatus";

interface PipelineFlowProps {
  jobId: string | null;
  onRetry?: () => void;
}

export function PipelineFlow({ jobId, onRetry }: PipelineFlowProps) {
  const { stages, overallStatus } = usePipelineStatus(jobId);

  const arrowActive = (from: "bronze" | "silver", to: "silver" | "gold") =>
    stages[from].status === "completed" && stages[to].status === "processing";

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {overallStatus !== "pending" && (
          <motion.div
            key={overallStatus}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium ${
              overallStatus === "running"
                ? "bg-primary/10 border-primary/20 text-primary"
                : overallStatus === "completed"
                ? "bg-success/10 border-success/30 text-success"
                : overallStatus === "failed"
                ? "bg-destructive/10 border-destructive/20 text-destructive"
                : overallStatus === "stopped"
                ? "bg-muted/30 border-border text-muted-foreground"
                : ""
            }`}
          >
            {overallStatus === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {overallStatus === "completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
            {overallStatus === "failed" && <AlertCircle className="h-3.5 w-3.5" />}
            {overallStatus === "stopped" && <AlertCircle className="h-3.5 w-3.5" />}
            <span>
              {overallStatus === "running" && "Pipeline running — data flowing through layers"}
              {overallStatus === "completed" && "All stages complete — data ready for analysis"}
              {overallStatus === "failed" && "Pipeline failed — check stage details below"}
              {overallStatus === "stopped" && "Pipeline stopped — no further processing"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Horizontal flow */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_36px_1fr_36px_1fr] items-center gap-1">
        <StageCard stage="bronze" {...stages.bronze} onRetry={onRetry} />
        <FlowArrow direction="right" active={arrowActive("bronze", "silver")} done={stages.silver.status === "completed" || stages.gold.status !== "pending"} />
        <StageCard stage="silver" {...stages.silver} onRetry={onRetry} />
        <FlowArrow direction="right" active={arrowActive("silver", "gold")} done={stages.gold.status === "completed"} />
        <StageCard stage="gold" {...stages.gold} onRetry={onRetry} />
      </div>

      {/* Mobile: Vertical flow */}
      <div className="flex flex-col gap-1 sm:hidden">
        <StageCard stage="bronze" {...stages.bronze} onRetry={onRetry} />
        <FlowArrow direction="down" active={arrowActive("bronze", "silver")} done={stages.silver.status !== "pending"} />
        <StageCard stage="silver" {...stages.silver} onRetry={onRetry} />
        <FlowArrow direction="down" active={arrowActive("silver", "gold")} done={stages.gold.status !== "pending"} />
        <StageCard stage="gold" {...stages.gold} onRetry={onRetry} />
      </div>

      <div className="grid grid-cols-3 text-center gap-1 pt-1">
        {["Streaming Analytics", "Data Science / ML", "BI & Reporting"].map((label) => (
          <p key={label} className="text-[10px] text-muted-foreground">
            <span className="mr-1 text-primary">●</span>{label}
          </p>
        ))}
      </div>
    </div>
  );
}

function FlowArrow({ direction, active, done }: { direction: "right" | "down"; active: boolean; done: boolean; }) {
  const Icon = direction === "right" ? ArrowRight : ArrowDown;
  return (
    <div className={`flex items-center justify-center ${direction === "down" ? "py-0.5" : ""}`}>
      <motion.div
        animate={active ? { opacity: [0.4, 1, 0.4], scale: [1, 1.15, 1] } : {}}
        transition={active ? { duration: 1.2, repeat: Infinity } : {}}
      >
        <Icon
          className={`transition-colors duration-300 ${
            active ? "text-primary h-5 w-5"
            : done ? "text-success h-4 w-4"
            : "text-muted-foreground/30 h-4 w-4"
          }`}
        />
      </motion.div>
    </div>
  );
}

export function PipelineSummaryStrip({ jobId, jobUrl }: { jobId: string; jobUrl?: string; }) {
  const { stages } = usePipelineStatus(jobId);
  const stageList = [
    { key: "bronze" as const, label: "B" },
    { key: "silver" as const, label: "S" },
    { key: "gold" as const, label: "G" },
  ];
  return (
    <div className="flex items-center gap-3">
      <BarChart3 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      {jobUrl && <span className="truncate font-mono text-[11px] text-muted-foreground max-w-[160px]">{jobUrl}</span>}
      <div className="flex items-center gap-1 ml-auto">
        {stageList.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1">
            <span
              title={`${s.key}: ${stages[s.key].status}`}
              className={`inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold ${
                stages[s.key].status === "completed" ? "bg-success/15 text-success"
              : stages[s.key].status === "processing" ? "bg-primary/10 text-primary"
              : stages[s.key].status === "failed" ? "bg-destructive/10 text-destructive"
              : "bg-muted/50 text-muted-foreground/50"
              }`}
            >
              {s.label}
            </span>
            {i < 2 && <span className="text-[9px] text-muted-foreground/30">›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
