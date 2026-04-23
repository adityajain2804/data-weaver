import { useEffect, useState } from "react";
import {
  getPipeline,
  subscribePipeline,
  type PipelineSnapshot,
  type StageStatus,
  type StageInfo,
  type OverallStatus,
} from "@/lib/pipeline-store";

export type { StageStatus, StageInfo, OverallStatus };

export interface PipelineState {
  overallStatus: OverallStatus;
  pipelineId: string | null;
  stages: PipelineSnapshot["stages"];
  fetchError: boolean;
}

const empty: PipelineState = {
  overallStatus: "pending",
  pipelineId: null,
  stages: {
    bronze: { status: "pending" },
    silver: { status: "pending" },
    gold: { status: "pending" },
  },
  fetchError: false,
};

/**
 * Frontend-only equivalent of the original polling hook.
 * Subscribes to the in-memory pipeline store keyed by jobId.
 */
export function usePipelineStatus(jobId: string | null): PipelineState {
  const [state, setState] = useState<PipelineState>(empty);

  useEffect(() => {
    if (!jobId) {
      setState(empty);
      return;
    }
    const apply = (snap: PipelineSnapshot) =>
      setState({ ...snap, fetchError: false });
    apply(getPipeline(jobId));
    return subscribePipeline(jobId, apply);
  }, [jobId]);

  return state;
}
