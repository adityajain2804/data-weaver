import { cn } from "@/lib/utils";

const statusConfig = {
  success: { label: "Success", className: "bg-success/10 text-success" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
  running: { label: "Running", className: "bg-primary/10 text-primary" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": status === "success",
        "bg-destructive": status === "failed",
        "bg-primary animate-live-pulse": status === "running",
        "bg-warning": status === "pending",
      })} />
      {config.label}
    </span>
  );
}
