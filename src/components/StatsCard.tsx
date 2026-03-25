import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "destructive" | "warning";
  index?: number;
}

const variantStyles = {
  default: "text-primary",
  success: "text-success",
  destructive: "text-destructive",
  warning: "text-warning",
};

export function StatsCard({ title, value, icon: Icon, trend, variant = "default", index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.2, 0, 0, 1] }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <Icon className={cn("h-4 w-4", variantStyles[variant])} strokeWidth={1.5} />
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-[11px] font-medium", variantStyles[variant])}>{trend}</p>
      )}
    </motion.div>
  );
}
