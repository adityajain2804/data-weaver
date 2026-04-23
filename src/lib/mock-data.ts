export interface ScrapeJob {
  id: string;
  url: string;
  status: "success" | "failed" | "running" | "pending";
  timestamp: string;
  duration: number;
  itemsScraped?: number;
  error?: string;
  selectedFields?: string[];
  category?: string;
}

export const mockJobs: ScrapeJob[] = [
  { id: "job-001", url: "https://store.example.com/products", status: "success", timestamp: "2026-03-25T10:23:00Z", duration: 2340, itemsScraped: 48, selectedFields: ["Product Name", "Price", "Product URL", "Image URL", "Rating"], category: "Sofa" },
  { id: "job-002", url: "https://shop.demo.io/electronics", status: "success", timestamp: "2026-03-25T09:45:00Z", duration: 1890, itemsScraped: 32, selectedFields: ["Product Name", "Price", "MRP", "Discount %", "Product URL"], category: "Laptop" },
  { id: "job-003", url: "https://market.test.com/shoes", status: "failed", timestamp: "2026-03-25T09:12:00Z", duration: 5200, error: "Timeout: Page load exceeded 30s", selectedFields: ["Product Name", "Price", "Product URL", "Availability"], category: "Shoes" },
  { id: "job-004", url: "https://deals.example.org/phones", status: "success", timestamp: "2026-03-25T08:30:00Z", duration: 3100, itemsScraped: 24, selectedFields: ["Product Name", "Price", "Brand", "Rating", "Product URL", "Image URL"], category: "Phone" },
  { id: "job-005", url: "https://price.tracker.io/laptops", status: "failed", timestamp: "2026-03-25T07:55:00Z", duration: 8400, error: "403 Forbidden - Access Denied", selectedFields: ["Product Name", "Price", "Product URL"], category: "Laptop" },
  { id: "job-006", url: "https://store.example.com/cameras", status: "success", timestamp: "2026-03-24T22:10:00Z", duration: 1540, itemsScraped: 16, selectedFields: ["Product Name", "Price", "MRP", "Discount %", "Product URL", "Image URL"], category: "Camera" },
  { id: "job-007", url: "https://shop.demo.io/tablets", status: "success", timestamp: "2026-03-24T20:45:00Z", duration: 2780, itemsScraped: 55, selectedFields: ["Product Name", "Price", "Product URL", "Image URL"], category: "Tablet" },
  { id: "job-008", url: "https://market.test.com/watches", status: "success", timestamp: "2026-03-24T18:30:00Z", duration: 1920, itemsScraped: 21, selectedFields: ["Product Name", "Price", "Brand", "Product URL"], category: "Watch" },
];

export interface ProductDataItem {
  title: string;
  price: string;
  mrp: string;
  discount: string;
  availability: string;
  rating: number;
  brand: string;
  imageUrl: string;
  productUrl: string;
  previousPrice: string;
  previousDiscount: string;
  priceChangePct: number; // negative = drop
  lastUpdated: string;
  sku: string;
  seller: string;
  priceHistory: { date: string; price: number; discount: number }[];
}

export const mockProductData: ProductDataItem[] = [
  {
    title: "MacBook Pro 14\" M3", price: "$1,599.00", mrp: "$1,799.00", discount: "11%",
    availability: "In Stock", rating: 4.8, brand: "Apple",
    imageUrl: "https://via.placeholder.com/400x400?text=MacBook",
    productUrl: "https://store.example.com/macbook-pro",
    previousPrice: "$1,699.00", previousDiscount: "6%", priceChangePct: -5.9,
    lastUpdated: "2026-04-22T14:20:00Z", sku: "APL-MBP14-M3-512",
    seller: "store.example.com",
    priceHistory: [
      { date: "Apr 16", price: 1799, discount: 0 },
      { date: "Apr 18", price: 1749, discount: 3 },
      { date: "Apr 20", price: 1699, discount: 6 },
      { date: "Apr 22", price: 1649, discount: 8 },
      { date: "Apr 23", price: 1599, discount: 11 },
    ],
  },
  {
    title: "Sony WH-1000XM5", price: "$349.99", mrp: "$399.99", discount: "13%",
    availability: "In Stock", rating: 4.7, brand: "Sony",
    imageUrl: "https://via.placeholder.com/400x400?text=Sony+XM5",
    productUrl: "https://store.example.com/sony-xm5",
    previousPrice: "$379.99", previousDiscount: "5%", priceChangePct: -7.9,
    lastUpdated: "2026-04-22T10:10:00Z", sku: "SNY-WH1000XM5-BLK",
    seller: "shop.demo.io",
    priceHistory: [
      { date: "Apr 16", price: 399, discount: 0 },
      { date: "Apr 18", price: 389, discount: 2 },
      { date: "Apr 20", price: 379, discount: 5 },
      { date: "Apr 22", price: 359, discount: 10 },
      { date: "Apr 23", price: 349, discount: 13 },
    ],
  },
  {
    title: "Samsung Galaxy S24 Ultra", price: "$1,299.99", mrp: "$1,419.99", discount: "8%",
    availability: "Low Stock", rating: 4.6, brand: "Samsung",
    imageUrl: "https://via.placeholder.com/400x400?text=Galaxy+S24",
    productUrl: "https://store.example.com/galaxy-s24",
    previousPrice: "$1,249.99", previousDiscount: "12%", priceChangePct: 4.0,
    lastUpdated: "2026-04-22T09:00:00Z", sku: "SMS-S24U-256",
    seller: "store.example.com",
    priceHistory: [
      { date: "Apr 16", price: 1419, discount: 0 },
      { date: "Apr 18", price: 1319, discount: 7 },
      { date: "Apr 20", price: 1249, discount: 12 },
      { date: "Apr 22", price: 1279, discount: 10 },
      { date: "Apr 23", price: 1299, discount: 8 },
    ],
  },
  {
    title: "iPad Air M2", price: "$599.00", mrp: "$649.00", discount: "8%",
    availability: "In Stock", rating: 4.5, brand: "Apple",
    imageUrl: "https://via.placeholder.com/400x400?text=iPad+Air",
    productUrl: "https://store.example.com/ipad-air",
    previousPrice: "$619.00", previousDiscount: "5%", priceChangePct: -3.2,
    lastUpdated: "2026-04-22T08:45:00Z", sku: "APL-IPADAIR-M2-128",
    seller: "store.example.com",
    priceHistory: [
      { date: "Apr 16", price: 649, discount: 0 },
      { date: "Apr 18", price: 639, discount: 2 },
      { date: "Apr 20", price: 619, discount: 5 },
      { date: "Apr 22", price: 609, discount: 6 },
      { date: "Apr 23", price: 599, discount: 8 },
    ],
  },
  {
    title: "Bose QC Ultra Headphones", price: "$429.00", mrp: "$449.00", discount: "4%",
    availability: "Out of Stock", rating: 4.4, brand: "Bose",
    imageUrl: "https://via.placeholder.com/400x400?text=Bose+QC",
    productUrl: "https://store.example.com/bose-qc",
    previousPrice: "$419.00", previousDiscount: "7%", priceChangePct: 2.4,
    lastUpdated: "2026-04-22T07:30:00Z", sku: "BOS-QCU-BLK",
    seller: "market.test.com",
    priceHistory: [
      { date: "Apr 16", price: 449, discount: 0 },
      { date: "Apr 18", price: 439, discount: 2 },
      { date: "Apr 20", price: 419, discount: 7 },
      { date: "Apr 22", price: 424, discount: 5 },
      { date: "Apr 23", price: 429, discount: 4 },
    ],
  },
];

export const mockLogs = [
  { timestamp: "10:23:01.234", level: "info" as const, message: "Launching browser instance..." },
  { timestamp: "10:23:02.456", level: "info" as const, message: "Navigating to https://store.example.com/products" },
  { timestamp: "10:23:03.789", level: "info" as const, message: "Waiting for selector: .product-grid" },
  { timestamp: "10:23:05.012", level: "success" as const, message: "Page fully loaded (JS rendered)" },
  { timestamp: "10:23:05.234", level: "info" as const, message: "Extracting product data..." },
  { timestamp: "10:23:06.456", level: "info" as const, message: "Found 48 product elements" },
  { timestamp: "10:23:07.789", level: "success" as const, message: "Data extraction complete — 48 items scraped" },
  { timestamp: "10:23:08.012", level: "info" as const, message: "Closing browser instance" },
  { timestamp: "10:23:08.234", level: "error" as const, message: "Network error: Failed to fetch https://cdn.example.com/image-404.jpg (404)" },
  { timestamp: "10:23:08.456", level: "warning" as const, message: "Rate limit warning: 429 response from API endpoint" },
  { timestamp: "10:23:09.012", level: "info" as const, message: "Job completed successfully" },
];

export const mockChartData = [
  { date: "Mar 19", success: 12, failed: 2 },
  { date: "Mar 20", success: 18, failed: 1 },
  { date: "Mar 21", success: 15, failed: 3 },
  { date: "Mar 22", success: 22, failed: 0 },
  { date: "Mar 23", success: 20, failed: 2 },
  { date: "Mar 24", success: 25, failed: 1 },
  { date: "Mar 25", success: 14, failed: 2 },
];
