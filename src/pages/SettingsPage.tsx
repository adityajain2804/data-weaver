import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [timeout, setTimeout_] = useState("30");
  const [retries, setRetries] = useState("3");
  const [retryDelay, setRetryDelay] = useState("1000");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Configure scraping defaults and behavior.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="space-y-6 rounded-lg border border-border bg-card p-5"
      >
        {/* Timeout */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Page Load Timeout (seconds)</label>
          <Input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout_(e.target.value)}
            className="max-w-xs border-border bg-background font-mono text-[13px] text-foreground"
          />
          <p className="text-[11px] text-muted-foreground">Maximum time to wait for page load before failing.</p>
        </div>

        {/* Retries */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Max Retries</label>
          <Input
            type="number"
            value={retries}
            onChange={(e) => setRetries(e.target.value)}
            className="max-w-xs border-border bg-background font-mono text-[13px] text-foreground"
          />
          <p className="text-[11px] text-muted-foreground">Number of retry attempts on failure.</p>
        </div>

        {/* Retry Delay */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Retry Delay (ms)</label>
          <Input
            type="number"
            value={retryDelay}
            onChange={(e) => setRetryDelay(e.target.value)}
            className="max-w-xs border-border bg-background font-mono text-[13px] text-foreground"
          />
          <p className="text-[11px] text-muted-foreground">Delay between retry attempts.</p>
        </div>

        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all">
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}
