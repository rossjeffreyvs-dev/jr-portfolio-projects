from __future__ import annotations

from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

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
    key_inclusion: List[str] = Field(default_factory=list)
    performance: List[str] = Field(default_factory=list)
    imaging_context: List[str] = Field(default_factory=list)
    exclusions: List[str] = Field(default_factory=list)


class Patient(BaseModel):
    id: str
    display_name: str
    age: int
    sex: str
    diagnosis: List[str]
    biomarkers: List[str] = Field(default_factory=list)
    ecog: Optional[str] = None
    prior_therapies: List[str] = Field(default_factory=list)
    labs: Dict[str, str | float | int] = Field(default_factory=dict)
    comorbidities: List[str] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)
    eligible_trial_ids: List[str] = Field(default_factory=list)
    seeded_outcome: StatusType
    seeded_score: int
    seeded_reason: str

    @field_validator("seeded_outcome", mode="before")
    @classmethod
    def normalize_seeded_outcome(cls, value: str) -> str:
        if not isinstance(value, str):
            return value

        normalized = value.strip().lower()
        aliases = {
            "review required": "Requires Review",
            "requires review": "Requires Review",
            "likely match": "Likely Match",
            "not eligible": "Not Eligible",
            "in progress": "In Progress",
        }
        return aliases.get(normalized, value)


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
    blockers: List[str] = Field(default_factory=list)
    missing_information: List[str] = Field(default_factory=list)
    review_required: bool = False
    review_reason: List[str] = Field(default_factory=list)
    exclusion_hits: List[str] = Field(default_factory=list)
    matched_inclusion: List[str] = Field(default_factory=list)
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


SemanticSuggestionCategory = Literal[
    "disease",
    "biomarker",
    "treatment_history",
    "comorbidity",
    "lab_pattern",
    "general",
]


class SemanticQuerySuggestion(BaseModel):
    id: str
    label: str
    query: str
    category: SemanticSuggestionCategory


class SemanticSearchRequest(BaseModel):
    trial_id: str
    query: str = Field(min_length=3)
    top_k: int = Field(default=10, ge=1, le=25)
    include_nontrial_matches: bool = False


class SemanticSearchHighlights(BaseModel):
    diagnosis: List[str] = Field(default_factory=list)
    biomarkers: List[str] = Field(default_factory=list)
    prior_therapies: List[str] = Field(default_factory=list)
    comorbidities: List[str] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)
    labs: List[str] = Field(default_factory=list)


class SemanticSearchResult(BaseModel):
    patient_id: str
    score: int = Field(ge=0, le=100)
    similarity: float
    rank: int
    explanation: str
    matched_terms: List[str] = Field(default_factory=list)
    highlights: SemanticSearchHighlights
    patient: Patient


class SemanticQuerySuggestionResponse(BaseModel):
    trial_id: str
    items: List[SemanticQuerySuggestion]


class SemanticSearchResponse(BaseModel):
    trial_id: str
    query: str
    strategy: Literal["token_weighted_demo_semantic"]
    total_candidates: int
    items: List[SemanticSearchResult]
    suggestions: List[SemanticQuerySuggestion] = Field(default_factory=list)