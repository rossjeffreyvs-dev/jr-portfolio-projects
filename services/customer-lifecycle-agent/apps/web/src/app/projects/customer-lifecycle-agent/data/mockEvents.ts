import type { LifecycleEvent } from "../types";

export const mockEvents: LifecycleEvent[] = [
  {
    id: "evt_001",
    stage: "Onboarding",
    title: "Customer signed up",
    description: "Workspace created and onboarding sequence initialized.",
    timestamp: "Day 0",
  },
  {
    id: "evt_002",
    stage: "Activation",
    title: "Activation risk detected",
    description:
      "No successful production API call within expected activation window.",
    timestamp: "Day 5",
  },
  {
    id: "evt_003",
    stage: "Personalization",
    title: "Guidance personalized",
    description:
      "Customer shown API setup guide based on implementation behavior.",
    timestamp: "Day 6",
  },
  {
    id: "evt_004",
    stage: "Retention",
    title: "Intervention recommended",
    description: "Agent recommends human follow-up and technical enablement.",
    timestamp: "Day 7",
  },
];
