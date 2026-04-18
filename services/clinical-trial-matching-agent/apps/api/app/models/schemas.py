from __future__ import annotations

from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


StatusType = Literal["Likely Match", "Not Eligible", "Requires Review", "In Progress"]
WorkflowStage = Literal[
    "patient_selected",
    "event_published",
    "patient_context_built",
    "trial_criteria_loaded",
    "criteria_scored",
    "explanation_generated",
    "hitl_assessed",
    "recommendation_completed",
]


class TrialCriterion(BaseModel):
    id: str
    type: Literal["inclusion", "exclusion"]
    category: str
    text: str
    required: bool = True


class Trial(BaseModel):
    id: str
    title: str
    disease_area: str
    phase: str
    indication: str
    protocol_status: Literal["parsed", "active", "inactive"]
    inclusion_criteria: List[TrialCriterion]
    exclusion_criteria: List[TrialCriterion]


class Patient(BaseModel):
    id: str
    display_name: str
    age: int
    sex: str
    diagnosis: List[str]
    biomarkers: List[str] = []
    ecog: Optional[str] = None
    prior_therapies: List[str] = []
    labs: Dict[str, str | float | int] = {}
    comorbidities: List[str] = []
    notes: List[str] = []
    trial_tags: List[str] = []
    seeded_outcome: StatusType
    seeded_score: int
    seeded_reason: str
    
class CriterionResult(BaseModel):
    criterion_id: str
    criterion_text: str
    criterion_type: str
    status: Literal["met", "not_met", "possibly_met", "missing_information"]
    evidence: str
    confidence: Literal["high", "moderate", "low"]
    action_needed: Optional[str] = None


class WorkflowEvent(BaseModel):
    stage: WorkflowStage
    label: str
    status: Literal["complete", "current", "pending"]
    timestamp: str
    detail: str


class Evaluation(BaseModel):
    id: str
    patient_id: str
    trial_id: str
    match_score: int
    recommendation: StatusType
    confidence: Literal["high", "moderate", "low"]
    blockers: List[str] = []
    missing_information: List[str] = []
    review_required: bool = False
    review_reason: List[str] = []
    workflow_status: Literal["Completed", "Awaiting Human Review", "In Progress"]
    explanation: str
    criterion_results: List[CriterionResult]
    workflow_events: List[WorkflowEvent]
    submitted_at: str
    reviewer_action: Optional[str] = None


class StartEvaluationRequest(BaseModel):
    patient_id: str
    trial_id: str


class ReviewTask(BaseModel):
    id: str
    evaluation_id: str
    patient_id: str
    trial_id: str
    reason: List[str]
    priority: Literal["Low", "Medium", "High"]
    review_status: Literal["Open", "In Review", "Resolved"]
    reviewer_decision: Optional[str] = None
    reviewer_note: Optional[str] = None


class ReviewDecisionRequest(BaseModel):
    decision: Literal["approve", "reject", "needs_more_data", "escalate"]
    note: str = Field(min_length=1)
