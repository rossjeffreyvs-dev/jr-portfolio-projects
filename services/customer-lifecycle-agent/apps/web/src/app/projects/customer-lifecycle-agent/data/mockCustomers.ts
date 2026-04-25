import type { Customer } from "../types";

export const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Northstar Fintech",
    segment: "Enterprise",
    lifecycleStage: "Activation",
    healthScore: 72,
    churnRisk: "Medium",
    activationProgress: 64,
    lastEvent:
      "Created production workspace but has not completed API integration.",
    recommendedAction:
      "Send API implementation checklist and assign solutions engineer.",
  },
  {
    id: "cust_002",
    name: "LumaPay",
    segment: "Startup",
    lifecycleStage: "Onboarding",
    healthScore: 84,
    churnRisk: "Low",
    activationProgress: 78,
    lastEvent: "Completed sandbox setup and invited two developers.",
    recommendedAction: "Prompt next-step activation guide.",
  },
  {
    id: "cust_003",
    name: "Atlas Lending",
    segment: "Mid-Market",
    lifecycleStage: "Retention",
    healthScore: 48,
    churnRisk: "High",
    activationProgress: 91,
    lastEvent: "Usage declined for two consecutive weeks.",
    recommendedAction: "Trigger retention playbook and CSM escalation.",
  },
];
