import { howItWorksColumns, timelineNodes, restoreSteps } from "@/data/how-it-works";
import type { HowItWorksColumn, RestoreStep, TimelineNode } from "@/types/listing";

export function getHowItWorksColumns(): HowItWorksColumn[] {
  return howItWorksColumns;
}

export function getTimelineNodes(): TimelineNode[] {
  return timelineNodes;
}

export function getRestoreSteps(): RestoreStep[] {
  return restoreSteps;
}
