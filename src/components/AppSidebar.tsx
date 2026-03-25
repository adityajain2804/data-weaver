import { LayoutDashboard, Plus, History, Terminal, Settings, Bug } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "New Scrape Job", url: "/new-job", icon: Plus },
  { title: "Job History", url: "/history", icon: History },
  { title: "Logs & Debugging", url: "/logs", icon: Terminal },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <Bug className="h-5 w-5 text-primary" strokeWidth={1.5} />
        <span className="text-sm font-semibold text-foreground tracking-tight">ScrapeAI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary -ml-px"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-alt"
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Systems Operational
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-live-pulse" />
          <span className="text-[10px] text-muted-foreground">All services up</span>
        </div>
      </div>
    </aside>
  );
}
