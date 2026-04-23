// Frontend-only in-memory pipeline store.
// Simulates the /api/pipeline/status/{jobId} backend used in the original
// architecture so PipelineFlow + StageCard work unchanged.

export type StageStatus = "pending" | "processing" | "completed" | "failed" | "blocked";
export type OverallStatus = "pending" | "running" | "completed" | "failed" | "stopped";

export interface StageInfo {
  status: StageStatus;
  recordCount?: number | null;
  processingTimeSec?: number | null;
  lastUpdated?: string | null;
  errorMessage?: string | null;
}

export interface PipelineSnapshot {
  overallStatus: OverallStatus;
  pipelineId: string | null;
  stages: { bronze: StageInfo; silver: StageInfo; gold: StageInfo };
}

type Listener = (snap: PipelineSnapshot) => void;

const defaultStage: StageInfo = { status: "pending" };
const defaultSnap = (): PipelineSnapshot => ({
  overallStatus: "pending",
  pipelineId: null,
  stages: { bronze: { ...defaultStage }, silver: { ...defaultStage }, gold: { ...defaultStage } },
});

const store = new Map<string, PipelineSnapshot>();
const listeners = new Map<string, Set<Listener>>();

function emit(jobId: string) {
  const snap = store.get(jobId);
  if (!snap) return;
  listeners.get(jobId)?.forEach((l) => l(snap));
}

export function getPipeline(jobId: string): PipelineSnapshot {
  return store.get(jobId) ?? defaultSnap();
}

export function subscribePipeline(jobId: string, l: Listener): () => void {
  if (!listeners.has(jobId)) listeners.set(jobId, new Set());
  listeners.get(jobId)!.add(l);
  return () => listeners.get(jobId)?.delete(l);
}

function setStage(jobId: string, stage: "bronze" | "silver" | "gold", patch: Partial<StageInfo>) {
  const snap = store.get(jobId) ?? defaultSnap();
  snap.stages[stage] = { ...snap.stages[stage], ...patch };
  store.set(jobId, snap);
  emit(jobId);
}

function setOverall(jobId: string, overallStatus: OverallStatus) {
  const snap = store.get(jobId) ?? defaultSnap();
  snap.overallStatus = overallStatus;
  store.set(jobId, snap);
  emit(jobId);
}

/** Begin a simulated DLT pipeline run for the given job id. */
export function startPipelineRun(jobId: string, opts?: { fail?: boolean }) {
  const snap = defaultSnap();
  snap.pipelineId = `pl-${jobId}`;
  snap.overallStatus = "running";
  store.set(jobId, snap);
  emit(jobId);

  const fail = opts?.fail ?? false;
  const now = () => new Date().toISOString();
  const start = Date.now();
  const elapsed = () => Math.round((Date.now() - start) / 1000);

  // Bronze
  setStage(jobId, "bronze", { status: "processing", lastUpdated: now() });
  setTimeout(() => {
    setStage(jobId, "bronze", {
      status: "completed",
      recordCount: 1248,
      processingTimeSec: elapsed(),
      lastUpdated: now(),
    });

    // Silver
    setStage(jobId, "silver", { status: "processing", lastUpdated: now() });
    setTimeout(() => {
      if (fail) {
        setStage(jobId, "silver", {
          status: "failed",
          errorMessage: "Schema validation failed on 12 rows (missing `price`).",
          lastUpdated: now(),
        });
        setStage(jobId, "gold", { status: "blocked" });
        setOverall(jobId, "failed");
        return;
      }
      setStage(jobId, "silver", {
        status: "completed",
        recordCount: 1182,
        processingTimeSec: elapsed(),
        lastUpdated: now(),
      });

      // Gold
      setStage(jobId, "gold", { status: "processing", lastUpdated: now() });
      setTimeout(() => {
        setStage(jobId, "gold", {
          status: "completed",
          recordCount: 1182,
          processingTimeSec: elapsed(),
          lastUpdated: now(),
        });
        setOverall(jobId, "completed");
      }, 1300);
    }, 1500);
  }, 1300);
}

export function stopPipelineRun(jobId: string) {
  const snap = store.get(jobId);
  if (!snap) return;
  (["bronze", "silver", "gold"] as const).forEach((s) => {
    if (snap.stages[s].status === "processing") {
      snap.stages[s] = { ...snap.stages[s], status: "blocked" };
    } else if (snap.stages[s].status === "pending") {
      snap.stages[s] = { ...snap.stages[s], status: "blocked" };
    }
  });
  snap.overallStatus = "stopped";
  store.set(jobId, snap);
  emit(jobId);
}
