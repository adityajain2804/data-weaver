import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "destructive" | "warning";
  index?: number;
}

const variantMap = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  destructive: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
};

export function StatsCard({ title, value, icon: Icon, trend, variant = "default", index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.2, 0, 0, 1] as [number, number, number, number] }}
      className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${variantMap[variant]}`}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {trend && <p className="mt-1 text-[11px] text-muted-foreground">{trend}</p>}
    </motion.div>
  );
}
