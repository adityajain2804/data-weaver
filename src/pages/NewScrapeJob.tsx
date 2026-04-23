import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Globe, Loader2, CheckCircle2, XCircle, ChevronDown, Info, Download, Package, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { mockProductData } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { DLTPipeline, type LayerStatus } from "@/components/DLTPipeline";
import { ScheduleBuilder, type ExecutionMode, type ScheduleConfig } from "@/components/ScheduleBuilder";

type ScrapeStatus = "idle" | "running" | "success" | "error";

const DATA_FIELDS = [
  { id: "product_name", label: "Product Name", default: true },
  { id: "price", label: "Price", default: true },
  { id: "mrp", label: "MRP", default: false },
  { id: "discount", label: "Discount %", default: false },
  { id: "product_url", label: "Product URL", default: true, mandatory: true },
  { id: "image_url", label: "Image URL", default: true },
  { id: "brand", label: "Brand", default: false },
  { id: "rating", label: "Rating", default: false },
  { id: "availability", label: "Availability", default: false },
];

const CRAWL_DEPTHS = [
  { value: "shallow", label: "Shallow — Single page only" },
  { value: "medium", label: "Medium — Up to 3 levels" },
  { value: "deep", label: "Deep — Full site crawl" },
];

export default function NewScrapeJob() {
  const [url, setUrl] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["product_url"]);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("shallow");
  const [resultLimit, setResultLimit] = useState("50");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [status, setStatus] = useState<ScrapeStatus>("idle");
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "json">("cards");
  const [bronzeStatus, setBronzeStatus] = useState<LayerStatus>("pending");
  const [silverStatus, setSilverStatus] = useState<LayerStatus>("pending");
  const [goldStatus, setGoldStatus] = useState<LayerStatus>("pending");
  const [showPipeline, setShowPipeline] = useState(false);

  const userSelected = selectedFields.filter((f) => f !== "product_url");
  const usingDefaults = userSelected.length === 0;

  // Apply defaults when nothing is selected
  const activeFields = usingDefaults
    ? DATA_FIELDS.filter((f) => f.default).map((f) => f.id)
    : selectedFields;

  const toggleField = (fieldId: string) => {
    if (fieldId === "product_url") return; // mandatory
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    );
  };

  const resetPipeline = () => {
    setBronzeStatus("pending");
    setSilverStatus("pending");
    setGoldStatus("pending");
  };

  const handleRun = () => {
    if (!url) {
      toast.error("Please enter a target URL");
      return;
    }
    setStatus("running");
    setShowResults(false);
    resetPipeline();
    setShowPipeline(true);
    toast.info("Scrape job started…");

    const fail = Math.random() < 0.15;

    // Bronze: start immediately
    setBronzeStatus("processing");
    setTimeout(() => {
      setBronzeStatus("completed");
      // Silver: start after bronze
      setSilverStatus("processing");
      setTimeout(() => {
        if (fail) {
          setSilverStatus("pending");
          setStatus("error");
          toast.error("Scrape failed — please retry");
          return;
        }
        setSilverStatus("completed");
        // Gold: start after silver
        setGoldStatus("processing");
        setTimeout(() => {
          setGoldStatus("completed");
          setStatus("success");
          setShowResults(true);
          toast.success("Data extracted successfully!");
        }, 1200);
      }, 1400);
    }, 1200);
  };

  const handleRetry = () => {
    setStatus("idle");
    resetPipeline();
    setShowPipeline(false);
    setTimeout(handleRun, 100);
  };

  const cardAnim = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">New Scrape Job</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Configure what data to extract and run.</p>
      </div>

      {/* Section 1: Target URL */}
      <motion.div {...cardAnim} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="text-[13px] font-semibold text-foreground">Target URL</h2>
        </div>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/products"
            className="border-border bg-background pl-10 font-mono text-[13px] placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </motion.div>

      {/* Section 2: Data Fields */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.04 }} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <h2 className="text-[13px] font-semibold text-foreground">Select Data Fields</h2>
          </div>
          {usingDefaults && (
            <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1">
              <Info className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-medium text-primary">Using Basic preset</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DATA_FIELDS.map((field) => {
            const checked = activeFields.includes(field.id);
            return (
              <label
                key={field.id}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] transition-all cursor-pointer ${
                  checked
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:bg-muted/50"
                } ${field.mandatory ? "opacity-90" : ""}`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleField(field.id)}
                  disabled={field.mandatory}
                  className="h-3.5 w-3.5"
                />
                <span className="text-[12px] font-medium">{field.label}</span>
                {field.mandatory && (
                  <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-primary">Required</span>
                )}
              </label>
            );
          })}
        </div>
      </motion.div>

      {/* Section 3: Category + Filters */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.08 }} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-[13px] font-semibold text-foreground">Filters</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Sofa"
              className="border-border bg-background text-[13px] placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Min Price</label>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="border-border bg-background text-[13px] font-mono placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Max Price</label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="99999"
              className="border-border bg-background text-[13px] font-mono placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </motion.div>

      {/* Section 4: Advanced (collapsible) */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.12 }} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
        >
          <span className="text-[13px] font-semibold text-foreground">Advanced Controls</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {advancedOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border px-5 py-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Crawl Depth</label>
                  <select
                    value={crawlDepth}
                    onChange={(e) => setCrawlDepth(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    {CRAWL_DEPTHS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Result Limit</label>
                  <Input
                    type="number"
                    value={resultLimit}
                    onChange={(e) => setResultLimit(e.target.value)}
                    placeholder="50"
                    className="border-border bg-background text-[13px] font-mono placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Run Button */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.16 }}>
        <Button
          onClick={handleRun}
          disabled={!url || status === "running"}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-semibold h-12 rounded-xl shadow-sm"
        >
          {status === "running" ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping in progress…</>
          ) : (
            <><Play className="mr-2 h-4 w-4" strokeWidth={1.5} /> Run Scrape Job</>
          )}
        </Button>
      </motion.div>

      {/* Status Indicator */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 shadow-sm"
          >
            {status === "running" && (
              <>
                <div className="h-2 w-2 rounded-full bg-primary animate-live-pulse" />
                <span className="text-[13px] text-foreground">Scraping in progress…</span>
                <div className="ml-auto h-1.5 flex-1 max-w-32 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 2.8, ease: "linear" }}
                  />
                </div>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-[13px] text-success font-medium">Data extracted — {mockProductData.length} items found</span>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-[13px] text-destructive font-medium">Scrape failed — Connection timeout</span>
                <Button onClick={handleRetry} variant="outline" size="sm" className="ml-auto text-[11px]">
                  Retry
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DLT Pipeline Visualization */}
      <AnimatePresence>
        {showPipeline && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DLTPipeline
              bronzeStatus={bronzeStatus}
              silverStatus={silverStatus}
              goldStatus={goldStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h2 className="text-[13px] font-semibold text-foreground">Results</h2>
              <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                {(["cards", "json"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-md px-3 py-1 text-[11px] font-medium transition-all ${
                      viewMode === mode
                        ? "bg-card text-foreground shadow-sm"
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
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-border bg-background p-4 space-y-2.5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">{product.title}</p>
                          <p className="text-[11px] text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-base font-semibold text-primary">{product.price}</span>
                          {activeFields.includes("mrp") && (
                            <span className="font-mono text-[11px] text-muted-foreground line-through">{product.mrp}</span>
                          )}
                        </div>
                        <StatusBadge status={product.availability === "In Stock" ? "success" : product.availability === "Low Stock" ? "pending" : "failed"} />
                      </div>
                      {activeFields.includes("discount") && (
                        <span className="inline-block rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">{product.discount} off</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-[12px] text-foreground">
                  {JSON.stringify(mockProductData, null, 2)}
                </pre>
              )}
            </div>

            <div className="flex gap-2 border-t border-border px-5 py-3">
              <Button variant="outline" size="sm" className="text-[11px] border-border text-muted-foreground hover:text-foreground">
                <Download className="mr-1.5 h-3 w-3" /> Download JSON
              </Button>
              <Button variant="outline" size="sm" className="text-[11px] border-border text-muted-foreground hover:text-foreground">
                <Download className="mr-1.5 h-3 w-3" /> Download CSV
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
