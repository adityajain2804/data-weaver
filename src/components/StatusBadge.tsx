import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status?: string;
};

const STATUS_STYLES: Record<string, { label: string; className: string; dot: string }> = {
  success:    { label: "Completed", className: "bg-success/15 text-success", dot: "bg-success" },
  completed:  { label: "Completed", className: "bg-success/15 text-success", dot: "bg-success" },
  pending:    { label: "Pending",   className: "bg-warning/15 text-warning", dot: "bg-warning" },
  queued:     { label: "Queued",    className: "bg-warning/15 text-warning", dot: "bg-warning" },
  running:    { label: "Running",   className: "bg-primary/10 text-primary", dot: "bg-primary animate-live-pulse" },
  processing: { label: "Running",   className: "bg-primary/10 text-primary", dot: "bg-primary animate-live-pulse" },
  failed:     { label: "Failed",    className: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  cancelled:  { label: "Cancelled", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  stopped:    { label: "Stopped",   className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || "pending").toLowerCase();
  const config = STATUS_STYLES[normalized] ?? {
    label: normalized || "Unknown",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
