import { User, Activity } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground">Web Scraping Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Status */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
          <Activity className="h-3.5 w-3.5 text-success" strokeWidth={1.5} />
          <span className="text-[11px] font-medium text-success">Active</span>
        </div>

        {/* User */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary transition-colors hover:bg-surface-alt">
          <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
