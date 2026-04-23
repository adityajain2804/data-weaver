import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Package, StopCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PipelineFlow } from "@/components/PipelineFlow";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";
import { getJob, stopJob, subscribeJobs } from "@/lib/job-store";
import { mockProductData, type ProductDataItem, type ScrapeJob } from "@/lib/mock-data";
import { toast } from "sonner";

export default function JobMonitor() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [, force] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductDataItem | null>(null);

  useEffect(() => subscribeJobs(() => force((n) => n + 1)), []);
  const job: ScrapeJob | undefined = useMemo(
    () => (jobId ? getJob(jobId) : undefined),
    [jobId, force]
  );

  if (!jobId || !job) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to history
        </Button>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-[13px] text-muted-foreground">
          Job not found.
        </div>
      </div>
    );
  }

  const handleStop = () => {
    stopJob(job.id);
    toast.success("Stop request sent");
  };

  const showResults = job.status === "completed";
  const products = mockProductData;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <Button variant="ghost" size="sm" className="h-7 -ml-2 px-2 text-[12px] text-muted-foreground" onClick={() => navigate("/history")}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Job Monitor</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-muted-foreground">#{job.id}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="truncate font-mono text-[12px] text-foreground max-w-[420px]">{job.url}</span>
            <StatusBadge status={job.status} />
          </div>
        </div>
        {(job.status === "running" || job.status === "pending") && (
          <Button variant="outline" size="sm" onClick={handleStop} className="border-destructive/40 text-destructive hover:bg-destructive/10">
            <StopCircle className="mr-1.5 h-3.5 w-3.5" /> Stop Job
          </Button>
        )}
      </div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">DLT Pipeline</h2>
          <span className="text-[11px] text-muted-foreground">Bronze → Silver → Gold</span>
        </div>
        <PipelineFlow jobId={job.id} />
      </motion.div>

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-[13px] font-semibold text-foreground">Results · {products.length} items</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-[11px] h-7">
                <Download className="mr-1 h-3 w-3" /> CSV
              </Button>
              <Button variant="outline" size="sm" className="text-[11px] h-7 border-primary/30 text-primary hover:bg-primary/10">
                <Download className="mr-1 h-3 w-3" /> Parquet
              </Button>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => {
              const dropped = p.priceChangePct < 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className="group rounded-lg border border-border bg-background p-3 text-left space-y-2 transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <div className="flex items-start gap-2">
                    <div className="h-9 w-9 rounded bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-foreground leading-tight group-hover:text-primary transition-colors truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{p.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono text-sm font-semibold text-primary tabular-nums">{p.price}</span>
                      <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-semibold ${dropped ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                        {dropped ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                        {Math.abs(p.priceChangePct).toFixed(1)}%
                      </span>
                    </div>
                    <StatusBadge status={p.availability === "In Stock" ? "completed" : "pending"} />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      <ProductDetailDialog
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
}
