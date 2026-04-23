import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Globe, ChevronDown, Info, Package, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ScheduleBuilder, type ExecutionMode, type ScheduleConfig } from "@/components/ScheduleBuilder";
import { createJob } from "@/lib/job-store";

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
  { value: "shallow", label: "Shallow — Single page only", depth: 1 },
  { value: "medium", label: "Medium — Up to 3 levels", depth: 3 },
  { value: "deep", label: "Deep — Full site crawl", depth: 50 },
];

export default function NewScrapeJob() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["product_url"]);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("shallow");
  const [resultLimit, setResultLimit] = useState("50");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("trigger");
  const [schedule, setSchedule] = useState<ScheduleConfig>(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    const startAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return {
      startAt,
      recurrence: "daily",
      weekDays: [1, 2, 3, 4, 5],
      intervalHours: 6,
      cronExpression: "0 9 * * 1-5",
      durationMinutes: 30,
      maxRunsPerWeek: 35,
    };
  });

  const userSelected = selectedFields.filter((f) => f !== "product_url");
  const usingDefaults = userSelected.length === 0;
  const activeFields = usingDefaults
    ? DATA_FIELDS.filter((f) => f.default).map((f) => f.id)
    : selectedFields;

  const toggleField = (fieldId: string) => {
    if (fieldId === "product_url") return;
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    );
  };

  const handleRun = () => {
    if (!url) {
      toast.error("Please enter a target URL");
      return;
    }

    if (executionMode === "schedule") {
      if (!schedule.startAt) {
        toast.error("Please choose a start date & time");
        return;
      }
      const startLabel = new Date(schedule.startAt).toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      toast.success(`Schedule saved — first run ${startLabel}`);
      return;
    }

    const depth = CRAWL_DEPTHS.find((d) => d.value === crawlDepth)?.depth ?? 1;
    const job = createJob({
      url,
      selectedFields: activeFields,
      crawl_depth: depth,
      category: category || undefined,
      concurrency: Number(resultLimit) || 50,
      modular: true,
    });
    toast.success("Scrape job created — opening monitor");
    navigate(`/job/${job.id}`);
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

      {/* Section 3: Filters */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.08 }} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-[13px] font-semibold text-foreground">Filters</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Category</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Sofa" className="border-border bg-background text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Min Price</label>
            <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="border-border bg-background text-[13px] font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Max Price</label>
            <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="99999" className="border-border bg-background text-[13px] font-mono" />
          </div>
        </div>
      </motion.div>

      {/* Section 4: Advanced */}
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
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
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
                  <Input type="number" value={resultLimit} onChange={(e) => setResultLimit(e.target.value)} placeholder="50" className="border-border bg-background text-[13px] font-mono" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Section 5: Execution mode + Scheduling */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.14 }} className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <ScheduleBuilder
          mode={executionMode}
          onModeChange={setExecutionMode}
          config={schedule}
          onConfigChange={setSchedule}
        />
      </motion.div>

      {/* Run / Schedule Button */}
      <motion.div {...cardAnim} transition={{ ...cardAnim.transition, delay: 0.18 }}>
        <Button
          onClick={handleRun}
          disabled={!url}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-semibold h-12 rounded-xl shadow-sm"
        >
          {executionMode === "schedule" ? (
            <><CalendarClock className="mr-2 h-4 w-4" strokeWidth={1.5} /> Save Schedule</>
          ) : (
            <><Play className="mr-2 h-4 w-4" strokeWidth={1.5} /> Run Scrape Job</>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
