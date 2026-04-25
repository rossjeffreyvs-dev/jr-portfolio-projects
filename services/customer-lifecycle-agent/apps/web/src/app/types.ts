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

export type CustomerLifecycleStage =
  | "prospect"
  | "qualified"
  | "evaluated"
  | "in_review"
  | "converted"
  | "rejected";

export type Prospect = {
  id: string;
  name: string;
  segment: string;
  source: string;
  stage: CustomerLifecycleStage;
  fit_score: number;
  estimated_value: number;
  signal: string;
  next_action: string;
  created_at: string;
};

export type ReviewQueueItem = {
  id: string;
  prospect_id: string;
  priority: string;
  reason: string[];
  recommended_action: string;
  status: string;
  estimated_value: number;
  prospect?: Prospect | null;
};

export type CustomerLifecycleSummary = {
  customer_profile: {
    title: string;
    buyer: string;
    user: string;
    value_per_converted_customer: number;
    target_customer_profile: {
      segment: string;
      use_case: string;
      success_criteria: string[];
      conversion_risks: string[];
    };
  };
  prospect_feed: Prospect[];
  funnel: {
    prospects: number;
    qualified: number;
    evaluated: number;
    in_review: number;
    converted: number;
    potential_value: number;
    realized_value: number;
    leakage_value: number;
  };
  review_queue: ReviewQueueItem[];
  agent_insight: {
    stage: string;
    severity: string;
    reason: string;
    recommendation: string;
    estimated_gain: number;
  };
};

export type IngestProspectResponse = {
  message: string;
  ingested_at: string;
  prospect: Prospect;
};
