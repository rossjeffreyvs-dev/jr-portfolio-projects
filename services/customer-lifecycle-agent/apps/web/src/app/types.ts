export type Account = {
  id: string;
  name: string;
  segment: string;
  stage: string;
  health_score: number;
  activation_risk: number;
  churn_risk: number;
  revenue_opportunity: number;
  current_plan: string;
  users: number;
  integration_status: string;
  last_event: string;
};

export type JourneyStage = {
  stage: string;
  status: string;
  score: number;
  signal: string;
};

export type AgentFinding = {
  name: string;
  status: string;
  finding: string;
};

export type AgentRecommendation = {
  title: string;
  summary: string;
  primary_action: string;
  expected_impact: string;
  confidence: number;
};

export type AgentRun = {
  account_id: string;
  risk_level: string;
  recommendation: AgentRecommendation;
  agents: AgentFinding[];
};

export type LifecycleResponse = {
  account_id: string;
  journey: JourneyStage[];
};

export type AccountsResponse = {
  items: Account[];
};

export type ActionResponse = {
  account_id?: string;
  status: string;
  message: string;
};
