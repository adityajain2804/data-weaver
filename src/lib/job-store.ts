// Frontend-only job store (replaces /api/listjobs + /api/createjobs).
import { mockJobs, type ScrapeJob } from "@/lib/mock-data";
import { startPipelineRun, stopPipelineRun } from "@/lib/pipeline-store";

type Listener = () => void;
const listeners = new Set<Listener>();
const jobs: ScrapeJob[] = [...mockJobs];

function emit() { listeners.forEach((l) => l()); }

export function subscribeJobs(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function listJobs(): ScrapeJob[] {
  return [...jobs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getJob(id: string): ScrapeJob | undefined {
  return jobs.find((j) => j.id === id);
}

export interface CreateJobInput {
  url: string;
  selectedFields: string[];
  crawl_depth: number;
  category?: string;
  concurrency?: number;
  modular?: boolean;
}

export function createJob(input: CreateJobInput): ScrapeJob {
  const id = `job-${String(jobs.length + 1).padStart(3, "0")}-${Date.now().toString(36)}`;
  const job: ScrapeJob = {
    id,
    url: input.url,
    status: "running",
    timestamp: new Date().toISOString(),
    duration: 0,
    selectedFields: input.selectedFields,
    crawl_depth: input.crawl_depth,
    category: input.category,
    concurrency: input.concurrency,
    modular: input.modular,
    last_error: null,
  };
  jobs.unshift(job);
  emit();

  // ~12% failure rate to demo error handling
  const fail = Math.random() < 0.12;
  startPipelineRun(id, { fail });

  // Reflect terminal status on the job after pipeline finishes
  const startedAt = Date.now();
  const finalize = () => {
    const j = jobs.find((x) => x.id === id);
    if (!j) return;
    j.duration = Date.now() - startedAt;
    if (fail) {
      j.status = "failed";
      j.last_error = "Schema validation failed on 12 rows (missing `price`).";
    } else {
      j.status = "completed";
      j.itemsScraped = 1182;
    }
    emit();
  };
  setTimeout(finalize, fail ? 3000 : 4400);

  return job;
}

export function stopJob(id: string) {
  const j = jobs.find((x) => x.id === id);
  if (!j) return;
  j.status = "stopped";
  stopPipelineRun(id);
  emit();
}
