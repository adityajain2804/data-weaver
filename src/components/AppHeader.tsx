import { User, Activity, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground">Web Scraping Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ opacity: 0, scale: 0.8, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8, rotate: 90 }} transition={{ duration: 0.15 }}>
                <Sun className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ opacity: 0, scale: 0.8, rotate: 90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8, rotate: -90 }} transition={{ duration: 0.15 }}>
                <Moon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Status */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
          <Activity className="h-3.5 w-3.5 text-success" strokeWidth={1.5} />
          <span className="text-[11px] font-medium text-success">Active</span>
        </div>

        {/* User */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted transition-colors hover:bg-accent">
          <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
