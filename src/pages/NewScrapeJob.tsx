import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Globe, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { mockProductData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

type ScrapeStatus = "idle" | "running" | "success" | "error";

export default function NewScrapeJob() {
  const [url, setUrl] = useState("");
  const [jsRendering, setJsRendering] = useState(true);
  const [status, setStatus] = useState<ScrapeStatus>("idle");
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<"json" | "cards">("cards");

  const handleRun = () => {
    if (!url) return;
    setStatus("running");
    setShowResults(false);
    setTimeout(() => {
      const success = Math.random() > 0.2;
      setStatus(success ? "success" : "error");
      if (success) setShowResults(true);
    }, 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">New Scrape Job</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Configure and launch a new scraping task.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="space-y-5 rounded-lg border border-border bg-card p-5"
      >
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Target URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/products"
                className="border-border bg-background pl-10 font-mono text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">JavaScript Rendering</p>
            <p className="text-[11px] text-muted-foreground">Enable Playwright for dynamic content</p>
          </div>
          <Switch checked={jsRendering} onCheckedChange={setJsRendering} />
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRun}
          disabled={!url || status === "running"}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          {status === "running" ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping...</>
          ) : (
            <><Play className="mr-2 h-4 w-4" strokeWidth={1.5} /> Run Scrape Job</>
          )}
        </Button>

        {/* Status Indicator */}
        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3"
          >
            {status === "running" && (
              <>
                <div className="h-2 w-2 rounded-full bg-primary animate-live-pulse" />
                <span className="text-[13px] text-foreground">Scraping in progress...</span>
                <div className="ml-auto h-1 flex-1 max-w-32 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                  />
                </div>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-[13px] text-success">Scrape completed — 5 items extracted</span>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-[13px] text-destructive">Scrape failed — Connection timeout</span>
              </>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-[13px] font-medium text-foreground">Results</h2>
            <div className="flex gap-1">
              {(["cards", "json"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
                    viewMode === mode
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "cards" ? "Cards" : "JSON"}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {viewMode === "cards" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mockProductData.map((product, i) => (
                  <div key={i} className="rounded-md border border-border bg-background p-4 space-y-2">
                    <p className="text-[13px] font-medium text-foreground">{product.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-semibold text-primary">{product.price}</span>
                      <StatusBadge status={product.availability === "In Stock" ? "success" : product.availability === "Low Stock" ? "pending" : "failed"} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="max-h-80 overflow-auto rounded-md border border-border bg-background p-4 font-mono text-[12px] text-foreground">
                {JSON.stringify(mockProductData, null, 2)}
              </pre>
            )}
          </div>

          <div className="border-t border-border px-5 py-3">
            <Button variant="outline" size="sm" className="text-[11px] border-border text-muted-foreground hover:text-foreground">
              Download JSON
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
