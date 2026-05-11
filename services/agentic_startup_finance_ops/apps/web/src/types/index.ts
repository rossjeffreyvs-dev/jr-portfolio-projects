export type MetricSummary = {
  startup_id: string;
  name: string;
  cash_balance: number;
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  monthly_burn: number;
  runway_months: number;
  net_revenue_retention: number;
  gross_revenue_retention: number;
  active_customers: number;
  failed_payments_count: number;
  failed_payments_value: number;
  expansion_pipeline: number;
  churn_risk_accounts: number;
};

export type Scenario = {
  id: string;
  category: string;
  question: string;
  description: string;
  default?: boolean;
  tags?: string[];
};

export type WorkflowPlan = {
  intent: string;
  objective: string;
  selected_agents: string[];
  selected_tools: string[];
  skipped_agents: string[];
  rationale: string;
  parameters: Record<string, string | number | boolean | null>;
};

export type ToolCall = {
  id: string;
  agent: string;
  tool_name: string;
  input_summary: string;
  output_summary: string;
  status: string;
  evidence: string[];
  duration_ms: number;
  metadata?: Record<string, unknown>;
};

export type WorkflowEvent = {
  id: string;
  run_id: string;
  sequence: number;
  agent: string;
  title: string;
  message: string;
  status: string;
  evidence: string[];
  started_at: string;
  completed_at: string;
  duration_ms: number;
  tool_call?: ToolCall | null;
};

export type AgentFinding = {
  agent: string;
  title: string;
  finding: string;
  confidence: number;
  confidence_detail?: { score: number; label: string };
  evidence: string[];
  metrics: Record<string, unknown>;
  tool_calls?: ToolCall[];
};

export type Recommendation = {
  id: string;
  run_id: string;
  type: string;
  priority: string;
  title: string;
  impact: string;
  confidence: number;
  confidence_detail?: { score: number; label: string };
  rationale: string;
  status: string;
  evidence: string[];
  scenario_type: string;
  estimated_financial_impact: number;
  recommended_action_type: string;
  feedback_weight?: number;
  rank_score?: number;
};

export type Review = {
  id: string;
  run_id: string;
  title: string;
  owner: string;
  priority: string;
  status: string;
  recommendation_id: string;
  decision_required: string;
  estimated_impact: string;
};

export type ChartDatum = {
  label?: string;
  month?: number;
  value?: number;
  current_plan_cash?: number;
  hiring_plan_cash?: number;
  optimized_plan_cash?: number;
  metadata?: Record<string, unknown>;
};

export type LLMReasoning = {
  enabled: boolean;
  provider: string;
  model: string;
  summary: string;
  recommendation_notes: string[];
};

export type WorkflowRun = {
  run_id: string;
  scenario_id: string;
  question: string;
  intent: string;
  status: string;
  scenario_type: string;
  severity: string;
  estimated_financial_impact: number;
  recommended_action_type: string;
  parameters: Record<string, string | number | boolean | null>;
  plan: WorkflowPlan;
  events: WorkflowEvent[];
  findings: AgentFinding[];
  recommendations: Recommendation[];
  reviews: Review[];
  charts: {
    runway_projection?: ChartDatum[];
    burn_projection?: ChartDatum[];
    revenue_risk_breakdown?: ChartDatum[];
    failed_payments_trend?: ChartDatum[];
    activation_funnel?: ChartDatum[];
  };
  tool_calls?: ToolCall[];
  llm_reasoning?: LLMReasoning;
};

export type AskResponse = {
  question: string;
  intent: string;
  matched_scenario_id: string;
  matched_scenario_question: string;
  parameters: Record<string, string | number | boolean | null>;
  plan: WorkflowPlan;
  run: WorkflowRun;
};
