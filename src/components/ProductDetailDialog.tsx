import { motion } from "framer-motion";
import {
  Package,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Star,
  Clock,
  Store,
  Tag,
  BadgePercent,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ProductDataItem } from "@/lib/mock-data";

interface ProductDetailDialogProps {
  product: ProductDataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  if (!product) return null;

  const priceDropped = product.priceChangePct < 0;
  const changeAbs = Math.abs(product.priceChangePct).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-4 space-y-0">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Package className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[15px] font-semibold text-foreground leading-tight text-balance">
                {product.title}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                  {product.brand}
                </span>
                <span>·</span>
                <span className="font-mono text-[11px]">{product.sku}</span>
              </DialogDescription>
            </div>
            <StatusBadge
              status={
                product.availability === "In Stock"
                  ? "success"
                  : product.availability === "Low Stock"
                  ? "pending"
                  : "failed"
              }
            />
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Price comparison hero */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Previous price
              </div>
              <div className="mt-1.5 font-mono text-lg font-semibold text-muted-foreground line-through tabular-nums">
                {product.previousPrice}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Discount was{" "}
                <span className="font-medium text-foreground">{product.previousDiscount}</span>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08 }}
              className={`rounded-lg border p-4 ${
                priceDropped
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Current price
                </div>
                <div
                  className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                    priceDropped
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {priceDropped ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {changeAbs}%
                </div>
              </div>
              <div className="mt-1.5 font-mono text-lg font-semibold text-primary tabular-nums">
                {product.price}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Discount now{" "}
                <span className="font-medium text-success">{product.discount}</span>
              </div>
            </motion.div>
          </div>

          {/* Price history chart */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgePercent className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                <h3 className="text-[12px] font-semibold text-foreground">Price history</h3>
              </div>
              <span className="text-[10px] text-muted-foreground">Last 7 days</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.priceHistory} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 11,
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaItem
              icon={<Tag className="h-3 w-3" />}
              label="MRP"
              value={product.mrp}
              mono
            />
            <MetaItem
              icon={<Star className="h-3 w-3" />}
              label="Rating"
              value={`${product.rating} / 5`}
            />
            <MetaItem
              icon={<Store className="h-3 w-3" />}
              label="Seller"
              value={product.seller}
            />
            <MetaItem
              icon={<Clock className="h-3 w-3" />}
              label="Updated"
              value={new Date(product.lastUpdated).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {product.productUrl}
            </span>
            <Button asChild size="sm" variant="outline" className="shrink-0 text-[11px]">
              <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3 w-3" />
                View product
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetaItem({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div
        className={`mt-1 truncate text-[12px] font-medium text-foreground ${
          mono ? "font-mono tabular-nums" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
