export type LifecycleStage =
  | "Onboarding"
  | "Activation"
  | "Experimentation"
  | "Personalization"
  | "Revenue"
  | "Retention";

export type AgentStatus = "Monitoring" | "Recommended" | "Actioned";

export type LifecycleAgent = {
  id: string;
  name: string;
  stage: LifecycleStage;
  description: string;
  status: AgentStatus;
  signal: string;
  recommendation: string;
};

export type Customer = {
  id: string;
  name: string;
  segment: string;
  lifecycleStage: LifecycleStage;
  healthScore: number;
  churnRisk: "Low" | "Medium" | "High";
  activationProgress: number;
  lastEvent: string;
  recommendedAction: string;
};

export type LifecycleEvent = {
  id: string;
  stage: LifecycleStage;
  title: string;
  description: string;
  timestamp: string;
};
