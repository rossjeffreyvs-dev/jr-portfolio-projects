from __future__ import annotations
from typing import Any, Literal
from pydantic import BaseModel, Field

Status = Literal['queued','running','completed','warning','requires_review','failed']
Priority = Literal['low','medium','high','critical']

class ConfidenceDetail(BaseModel):
    score: float
    label: str

def confidence_detail(score: float) -> ConfidenceDetail:
    return ConfidenceDetail(score=score, label='Very High Confidence' if score>=.9 else 'High Confidence' if score>=.75 else 'Medium Confidence' if score>=.6 else 'Low Confidence')

class ScenarioContext(BaseModel):
    intent: str
    scenario_id: str
    question: str
    parameters: dict[str, Any] = Field(default_factory=dict)

class WorkflowPlan(BaseModel):
    intent: str
    objective: str
    selected_agents: list[str] = Field(default_factory=list)
    selected_tools: list[str] = Field(default_factory=list)
    skipped_agents: list[str] = Field(default_factory=list)
    rationale: str
    parameters: dict[str, Any] = Field(default_factory=dict)

class StartupMetrics(BaseModel):
    startup_id: str; name: str; cash_balance: float; monthly_recurring_revenue: float; annual_recurring_revenue: float; monthly_burn: float; runway_months: float; net_revenue_retention: float; gross_revenue_retention: float; active_customers: int; failed_payments_count: int; failed_payments_value: float; expansion_pipeline: float; churn_risk_accounts: int

class Scenario(BaseModel):
    id: str; category: str; question: str; description: str; default: bool=False; tags: list[str]=Field(default_factory=list)

class ToolCallTrace(BaseModel):
    id: str; agent: str; tool_name: str; input_summary: str; output_summary: str; status: Status='completed'; evidence: list[str]=Field(default_factory=list); duration_ms: int=0; metadata: dict[str, Any]=Field(default_factory=dict)

class WorkflowEvent(BaseModel):
    id: str; run_id: str; sequence: int; agent: str; title: str; message: str; status: Status='completed'; evidence: list[str]=Field(default_factory=list); started_at: str; completed_at: str; duration_ms: int; tool_call: ToolCallTrace|None=None

class AgentFinding(BaseModel):
    agent: str; title: str; finding: str; confidence: float; confidence_detail: ConfidenceDetail; evidence: list[str]=Field(default_factory=list); metrics: dict[str, Any]=Field(default_factory=dict); tool_calls: list[ToolCallTrace]=Field(default_factory=list)

class Recommendation(BaseModel):
    id: str; run_id: str; type: str; priority: Priority; title: str; impact: str; confidence: float; confidence_detail: ConfidenceDetail; rationale: str; status: Status='requires_review'; evidence: list[str]=Field(default_factory=list); scenario_type: str; estimated_financial_impact: float; recommended_action_type: str; feedback_weight: float=0.0; rank_score: float=0.0

class ReviewItem(BaseModel):
    id: str; run_id: str; title: str; owner: str='Founder / Finance Lead'; priority: Priority; status: Status='requires_review'; recommendation_id: str; decision_required: str='Approve, reject, or mark executed'; estimated_impact: str

class LLMReasoning(BaseModel):
    enabled: bool; provider: str; model: str; summary: str; recommendation_notes: list[str]=Field(default_factory=list)

class WorkflowRun(BaseModel):
    run_id: str; scenario_id: str; question: str; intent: str; status: Literal['running','completed','failed']='completed'; scenario_type: str; severity: Priority; estimated_financial_impact: float; recommended_action_type: str; parameters: dict[str, Any]=Field(default_factory=dict); plan: WorkflowPlan|None=None; events: list[WorkflowEvent]=Field(default_factory=list); findings: list[AgentFinding]=Field(default_factory=list); recommendations: list[Recommendation]=Field(default_factory=list); reviews: list[ReviewItem]=Field(default_factory=list); charts: dict[str, list[dict[str, Any]]]=Field(default_factory=dict); tool_calls: list[ToolCallTrace]=Field(default_factory=list); llm_reasoning: LLMReasoning|None=None

class QuestionRequest(BaseModel): question: str
class ReviewFeedbackRequest(BaseModel): decision: Literal['approved','rejected','executed','modified']; reason: str|None=None; actual_outcome: str|None=None; user_rating: int|None=None
