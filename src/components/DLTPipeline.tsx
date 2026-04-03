import { motion } from "framer-motion";
import { Database, ArrowRight, CheckCircle2, Loader2, Clock, BarChart3, FlaskConical, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export type LayerStatus = "pending" | "processing" | "completed";

interface DLTPipelineProps {
  bronzeStatus: LayerStatus;
  silverStatus: LayerStatus;
  goldStatus: LayerStatus;
}

const statusIcon = (status: LayerStatus) => {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (status === "processing") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
};

const statusLabel = (status: LayerStatus) => {
  if (status === "completed") return "Processed";
  if (status === "processing") return "Processing…";
  return "Pending";
};

const layers = [
  { id: "bronze", label: "Bronze", subtitle: "Raw Data", icon: Database, accentColor: "#CD7F32" },
  { id: "silver", label: "Silver", subtitle: "Curated Data", icon: FlaskConical, accentColor: "#8B9DAF" },
  { id: "gold", label: "Gold", subtitle: "Aggregated Data", icon: Layers, accentColor: "#DAA520" },
] as const;

export function DLTPipeline({ bronzeStatus, silverStatus, goldStatus }: DLTPipelineProps) {
  const statuses: Record<string, LayerStatus> = { bronze: bronzeStatus, silver: silverStatus, gold: goldStatus };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <h2 className="text-[13px] font-semibold text-foreground">DLT Pipeline</h2>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-5 py-4">
        {layers.map((layer, i) => {
          const status = statuses[layer.id];
          const Icon = layer.icon;
          return (
            <div key={layer.id} className="flex items-center gap-3 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className={cn(
                  "relative flex flex-col items-center gap-3 rounded-xl border-2 px-5 py-5 min-w-[120px] transition-all duration-500",
                  status === "processing" && "border-primary shadow-md",
                  status === "completed" && "border-success/40",
                  status === "pending" && "border-border"
                )}
                style={{
                  backgroundColor: status !== "pending"
                    ? `${layer.accentColor}10`
                    : undefined,
                }}
              >
                {status === "processing" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/30"
                    animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card shadow-sm border border-border">
                  <Icon className="h-6 w-6" style={{ color: layer.accentColor }} />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{layer.label}</p>
                  <p className="text-[11px] text-muted-foreground">{layer.subtitle}</p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-card border border-border px-2.5 py-1">
                  {statusIcon(status)}
                  <span className={cn(
                    "text-[10px] font-medium",
                    status === "completed" && "text-success",
                    status === "processing" && "text-primary",
                    status === "pending" && "text-muted-foreground"
                  )}>
                    {statusLabel(status)}
                  </span>
                </div>
              </motion.div>

              {i < layers.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 0.2 }}
                >
                  <ArrowRight className={cn(
                    "h-5 w-5 transition-colors duration-500",
                    status === "completed" ? "text-success" : "text-muted-foreground/40"
                  )} />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {goldStatus === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-6 border-t border-border pt-4"
        >
          {["Streaming Analytics", "Data Science / ML", "BI & Reporting"].map((dest) => (
            <div key={dest} className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[11px] text-muted-foreground">{dest}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
