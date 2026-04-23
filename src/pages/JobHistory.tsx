import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ChevronDown, Download, Package, TrendingDown, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockJobs, mockProductData, type ProductDataItem } from "@/lib/mock-data";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";

export default function JobHistory() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [resultView, setResultView] = useState<"cards" | "json">("cards");
  const [selectedProduct, setSelectedProduct] = useState<ProductDataItem | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Job History</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">View past extraction jobs and their results.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="grid grid-cols-[80px_1fr_auto_auto_auto_auto] gap-4 border-b border-border bg-muted/50 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Job ID</span>
          <span>URL</span>
          <span>Fields</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-border">
          {mockJobs.map((job) => (
            <div key={job.id}>
              <div className="grid grid-cols-[80px_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 transition-colors hover:bg-muted/30">
                <span className="font-mono text-[12px] text-muted-foreground">{job.id.replace("job-", "#")}</span>
                <span className="truncate font-mono text-[12px] text-foreground">{job.url}</span>
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {(job.selectedFields || []).slice(0, 3).map((f) => (
                    <span key={f} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{f}</span>
                  ))}
                  {(job.selectedFields || []).length > 3 && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-primary">+{(job.selectedFields || []).length - 3}</span>
                  )}
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{job.category || "—"}</span>
                <StatusBadge status={job.status} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="text-[11px] text-muted-foreground hover:text-foreground h-7 px-2"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  {expandedJob === job.id ? "Close" : "View"}
                  <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${expandedJob === job.id ? "rotate-180" : ""}`} />
                </Button>
              </div>

              <AnimatePresence>
                {expandedJob === job.id && job.status === "success" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-foreground">Extracted Data</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
                            {(["cards", "json"] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setResultView(mode)}
                                className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-all ${
                                  resultView === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                                }`}
                              >
                                {mode === "cards" ? "Cards" : "JSON"}
                              </button>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 border-border">
                            <Download className="mr-1 h-3 w-3" /> Export
                          </Button>
                        </div>
                      </div>

                      {resultView === "cards" ? (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {mockProductData.slice(0, 3).map((product, i) => {
                            const dropped = product.priceChangePct < 0;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedProduct(product)}
                                className="group rounded-lg border border-border bg-card p-3 space-y-1.5 text-left transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <p className="text-[12px] font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                                    {product.title}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-mono text-sm font-semibold text-primary tabular-nums">{product.price}</span>
                                    <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-semibold ${dropped ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                                      {dropped ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                                      {Math.abs(product.priceChangePct).toFixed(1)}%
                                    </span>
                                  </div>
                                  <StatusBadge status={product.availability === "In Stock" ? "success" : "pending"} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-[11px] text-foreground">
                          {JSON.stringify(mockProductData.slice(0, 3), null, 2)}
                        </pre>
                      )}
                    </div>
                  </motion.div>
                )}
                {expandedJob === job.id && job.status === "failed" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-destructive/5 px-5 py-4">
                      <p className="text-[12px] font-medium text-destructive">{job.error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      <ProductDetailDialog
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
}
