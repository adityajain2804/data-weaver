import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar as CalIcon, Repeat, Zap, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export type ExecutionMode = "trigger" | "schedule";
export type Recurrence = "daily" | "weekly" | "interval" | "custom";

export interface ScheduleConfig {
  startAt: string; // datetime-local value
  recurrence: Recurrence;
  weekDays: number[]; // 0..6 for weekly
  intervalHours: number; // for interval
  cronExpression: string; // for custom
  durationMinutes: number;
  maxRunsPerWeek: number;
}

interface ScheduleBuilderProps {
  mode: ExecutionMode;
  onModeChange: (m: ExecutionMode) => void;
  config: ScheduleConfig;
  onConfigChange: (c: ScheduleConfig) => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleBuilder({
  mode,
  onModeChange,
  config,
  onConfigChange,
}: ScheduleBuilderProps) {
  const update = <K extends keyof ScheduleConfig>(key: K, value: ScheduleConfig[K]) =>
    onConfigChange({ ...config, [key]: value });

  const toggleDay = (d: number) => {
    const next = config.weekDays.includes(d)
      ? config.weekDays.filter((x) => x !== d)
      : [...config.weekDays, d].sort();
    update("weekDays", next);
  };

  const nextRuns = useMemo(() => computeNextRuns(config, 5), [config]);

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <CalIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <h2 className="text-[13px] font-semibold text-foreground">Execution</h2>
      </div>

      <div
        role="tablist"
        aria-label="Execution mode"
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1"
      >
        <ModeTab
          active={mode === "trigger"}
          onClick={() => onModeChange("trigger")}
          icon={<Zap className="h-3.5 w-3.5" strokeWidth={1.5} />}
          label="Trigger Now"
          hint="Run once immediately"
        />
        <ModeTab
          active={mode === "schedule"}
          onClick={() => onModeChange("schedule")}
          icon={<Repeat className="h-3.5 w-3.5" strokeWidth={1.5} />}
          label="Schedule"
          hint="Run on a recurring plan"
        />
      </div>

      {mode === "schedule" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 rounded-lg border border-border bg-background/50 p-4"
        >
          {/* Start at */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date & time">
              <Input
                type="datetime-local"
                value={config.startAt}
                onChange={(e) => update("startAt", e.target.value)}
                className="border-border bg-background text-[13px]"
              />
            </Field>
            <Field label="Recurrence">
              <select
                value={config.recurrence}
                onChange={(e) => update("recurrence", e.target.value as Recurrence)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-[13px] text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="interval">Interval</option>
                <option value="custom">Custom (cron)</option>
              </select>
            </Field>
          </div>

          {/* Recurrence-specific */}
          {config.recurrence === "weekly" && (
            <Field label="Run on these days">
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => {
                  const active = config.weekDays.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={DAY_LABELS[i]}
                      aria-pressed={active}
                      onClick={() => toggleDay(i)}
                      className={`h-8 w-8 rounded-md border text-[11px] font-semibold transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          {config.recurrence === "interval" && (
            <Field label="Interval (hours)">
              <Input
                type="number"
                min={1}
                max={168}
                value={config.intervalHours}
                onChange={(e) => update("intervalHours", Number(e.target.value) || 1)}
                className="border-border bg-background font-mono text-[13px]"
              />
            </Field>
          )}

          {config.recurrence === "custom" && (
            <Field label="Cron expression" hint="e.g. 0 */6 * * * (every 6 hours)">
              <Input
                value={config.cronExpression}
                onChange={(e) => update("cronExpression", e.target.value)}
                placeholder="0 9 * * 1-5"
                className="border-border bg-background font-mono text-[13px]"
              />
            </Field>
          )}

          {/* Duration + Max runs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Duration per run (minutes)">
              <Input
                type="number"
                min={1}
                value={config.durationMinutes}
                onChange={(e) => update("durationMinutes", Number(e.target.value) || 1)}
                className="border-border bg-background font-mono text-[13px]"
              />
            </Field>
            <Field label="Max runs per week">
              <Input
                type="number"
                min={1}
                max={500}
                value={config.maxRunsPerWeek}
                onChange={(e) => update("maxRunsPerWeek", Number(e.target.value) || 1)}
                className="border-border bg-background font-mono text-[13px]"
              />
            </Field>
          </div>

          {/* Smart preview */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold text-primary">
                Next 5 scheduled runs
              </span>
            </div>
            {nextRuns.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                Configure the schedule above to preview upcoming runs.
              </p>
            ) : (
              <ol className="space-y-1">
                {nextRuns.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-md bg-background/60 px-2.5 py-1.5 text-[11px]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-semibold text-primary tabular-nums">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {d.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {d.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative flex flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-1.5 text-[12px] font-semibold">
        {icon}
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground">{hint}</span>
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function computeNextRuns(cfg: ScheduleConfig, count: number): Date[] {
  const out: Date[] = [];
  const start = cfg.startAt ? new Date(cfg.startAt) : new Date();
  if (isNaN(start.getTime())) return out;

  const now = new Date();
  let cursor = new Date(Math.max(start.getTime(), now.getTime()));

  if (cfg.recurrence === "daily") {
    // align to start time-of-day
    cursor = new Date(start);
    while (cursor < now) cursor.setDate(cursor.getDate() + 1);
    for (let i = 0; i < count; i++) {
      out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  } else if (cfg.recurrence === "weekly") {
    const days = cfg.weekDays.length ? cfg.weekDays : [start.getDay()];
    cursor = new Date(start);
    let safety = 0;
    while (out.length < count && safety++ < 400) {
      if (cursor >= now && days.includes(cursor.getDay())) {
        out.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  } else if (cfg.recurrence === "interval") {
    const h = Math.max(1, cfg.intervalHours || 1);
    cursor = new Date(start);
    while (cursor < now) cursor.setHours(cursor.getHours() + h);
    for (let i = 0; i < count; i++) {
      out.push(new Date(cursor));
      cursor.setHours(cursor.getHours() + h);
    }
  } else if (cfg.recurrence === "custom") {
    // Simple heuristic preview for cron: fall back to daily at start time
    cursor = new Date(start);
    while (cursor < now) cursor.setDate(cursor.getDate() + 1);
    for (let i = 0; i < count; i++) {
      out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return out.slice(0, count);
}
