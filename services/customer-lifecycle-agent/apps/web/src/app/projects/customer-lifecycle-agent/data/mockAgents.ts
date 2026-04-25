import type { LifecycleAgent } from "../types";

export const mockAgents: LifecycleAgent[] = [
  {
    id: "agent_onboarding",
    name: "Onboarding Agent",
    stage: "Onboarding",
    description:
      "Guides new users through setup and identifies missing implementation steps.",
    status: "Actioned",
    signal: "Workspace created, but API keys not configured.",
    recommendation:
      "Trigger implementation checklist and schedule technical onboarding.",
  },
  {
    id: "agent_activation",
    name: "Activation Agent",
    stage: "Activation",
    description:
      "Detects product usage drop-offs before the customer reaches first value.",
    status: "Recommended",
    signal: "No successful API call after 5 days.",
    recommendation:
      "Send targeted developer guide and alert CSM for follow-up.",
  },
  {
    id: "agent_experimentation",
    name: "Experimentation Agent",
    stage: "Experimentation",
    description: "Suggests lifecycle experiments based on behavioral cohorts.",
    status: "Monitoring",
    signal: "Activation varies significantly by customer segment.",
    recommendation: "Run onboarding checklist A/B test for startup segment.",
  },
  {
    id: "agent_personalization",
    name: "Personalization Agent",
    stage: "Personalization",
    description:
      "Tailors product education, prompts, and nudges by customer behavior.",
    status: "Monitoring",
    signal: "Customer engages with docs but skips dashboard configuration.",
    recommendation: "Personalize next session with dashboard setup guidance.",
  },
  {
    id: "agent_revenue",
    name: "Revenue Agent",
    stage: "Revenue",
    description: "Identifies expansion and monetization opportunities.",
    status: "Recommended",
    signal: "Customer exceeds usage threshold for current plan.",
    recommendation: "Recommend usage-based upgrade conversation.",
  },
  {
    id: "agent_retention",
    name: "Retention Agent",
    stage: "Retention",
    description: "Predicts churn risk and recommends intervention workflows.",
    status: "Recommended",
    signal: "Usage down 42% over 14 days.",
    recommendation:
      "Escalate to retention playbook with executive sponsor outreach.",
  },
];
