import { motion } from "framer-motion";
import { Database, ArrowRight, CheckCircle2, Loader2, Clock, BarChart3, FlaskConical, Layers } from "lucide-react";

export type LayerStatus = "pending" | "processing" | "completed";

interface PipelineLayer {
  id: string;
  label: string;
  subtitle: string;
  status: LayerStatus;
  color: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
}

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

export function DLTPipeline({ bronzeStatus, silverStatus, goldStatus }: DLTPipelineProps) {
  const layers: PipelineLayer[] = [
    {
      id: "bronze",
      label: "Bronze",
      subtitle: "Raw Data",
      status: bronzeStatus,
      color: "hsl(30 60% 50%)",
      bgClass: "bg-[hsl(30_60%_50%/0.08)]",
      borderClass: bronzeStatus === "processing" ? "border-[hsl(30_60%_50%)] shadow-[0_0_12px_hsl(30_60%_50%/0.2)]" : bronzeStatus === "completed" ? "border-success/40" : "border-border",
      icon: <Database className="h-6 w-6 text-[hsl(30,60%,50%)]" />,
    },
    {
      id: "silver",
      label: "Silver",
      subtitle: "Curated Data",
      status: silverStatus,
      color: "hsl(220 20% 60%)",
      bgClass: "bg-[hsl(220_20%_60%/0.08)]",
      borderClass: silverStatus === "processing" ? "border-[hsl(220_20%_60%)] shadow-[0_0_12px_hsl(220_20%_60%/0.2)]" : silverStatus === "completed" ? "border-success/40" : "border-border",
      icon: <FlaskConical className="h-6 w-6 text-[hsl(220,20%,60%)]" />,
    },
    {
      id: "gold",
      label: "Gold",
      subtitle: "Aggregated Data",
      status: goldStatus,
      color: "hsl(45 80% 50%)",
      bgClass: "bg-[hsl(45_80%_50%/0.08)]",
      borderClass: goldStatus === "processing" ? "border-[hsl(45_80%_50%)] shadow-[0_0_12px_hsl(45_80%_50%/0.2)]" : goldStatus === "completed" ? "border-success/40" : "border-border",
      icon: <Layers className="h-6 w-6 text-[hsl(45,80%,50%)]" />,
    },
  ];

  const arrowColor = (fromStatus: LayerStatus) =>
    fromStatus === "completed" ? "text-success" : "text-muted-foreground/40";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <h2 className="text-[13px] font-semibold text-foreground">DLT Pipeline</h2>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
        {layers.map((layer, i) => (
          <div key={layer.id} className="flex items-center gap-2 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.3 }}
              className={`relative flex flex-col items-center gap-3 rounded-xl border-2 ${layer.borderClass} ${layer.bgClass} px-5 py-5 min-w-[120px] transition-all duration-500`}
            >
              {/* Pulse ring when processing */}
              {layer.status === "processing" && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-primary/30"
                  animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card shadow-sm border border-border">
                {layer.icon}
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{layer.label}</p>
                <p className="text-[11px] text-muted-foreground">{layer.subtitle}</p>
              </div>

              {/* Status chip */}
              <div className="flex items-center gap-1.5 rounded-full bg-card border border-border px-2.5 py-1">
                {statusIcon(layer.status)}
                <span className={`text-[10px] font-medium ${
                  layer.status === "completed" ? "text-success" :
                  layer.status === "processing" ? "text-primary" :
                  "text-muted-foreground"
                }`}>
                  {statusLabel(layer.status)}
                </span>
              </div>
            </motion.div>

            {/* Arrow between layers */}
            {i < layers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.2 }}
              >
                <ArrowRight className={`h-5 w-5 ${arrowColor(layer.status)} transition-colors duration-500`} />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Output destinations */}
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
