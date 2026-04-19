from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

from app.models.schemas import Evaluation, Patient, ReviewTask, Trial, WorkflowEvent

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _load_json(relative_path: str):
    with open(DATA_DIR / relative_path, "r", encoding="utf-8") as handle:
        return json.load(handle)


TRIALS: Dict[str, Trial] = {
    item["id"]: Trial.model_validate(item)
    for item in _load_json("trials/trials.json")
}

PATIENTS: Dict[str, Patient] = {
    item["id"]: Patient.model_validate(item)
    for item in _load_json("patients/patients.json")
}

REVIEWS: Dict[str, ReviewTask] = {
    item["id"]: ReviewTask.model_validate(item)
    for item in _load_json("reviews/reviews.json")
}

EVALUATIONS: Dict[str, Evaluation] = {}
ACTIVE_TRIAL_ID: str = "trial_nsclc_001"


def set_active_trial(trial_id: str) -> Trial:
    global ACTIVE_TRIAL_ID

    if trial_id not in TRIALS:
        raise KeyError(trial_id)

    ACTIVE_TRIAL_ID = trial_id

    for tid, trial in list(TRIALS.items()):
        status = "active" if tid == trial_id else "parsed"
        TRIALS[tid] = trial.model_copy(update={"protocol_status": status})

    return TRIALS[trial_id]


STAGE_LABELS = [
    (
        "patient_selected",
        "Patient selected",
        "Synthetic patient added to active trial queue.",
    ),
    (
        "event_published",
        "Event published",
        "Simulated patient event pushed to internal workflow bus.",
    ),
    (
        "patient_context_built",
        "Patient context built",
        "Structured profile created from diagnosis, labs, and note context.",
    ),
    (
        "trial_criteria_loaded",
        "Trial criteria loaded",
        "Normalized inclusion and exclusion criteria loaded from active protocol.",
    ),
    (
        "criteria_scored",
        "Matching criteria",
        "Rules and semantic scoring completed for seeded trial criteria.",
    ),
    (
        "explanation_generated",
        "Explanation generated",
        "Narrative recommendation and evidence summary prepared.",
    ),
    (
        "hitl_assessed",
        "HITL review assessed",
        "Case reviewed for coordinator escalation and uncertainty handling.",
    ),
    (
        "recommendation_completed",
        "Recommendation complete",
        "Dashboard panels updated with final recommendation.",
    ),
]


def build_workflow_events() -> List[WorkflowEvent]:
    timestamp = utc_now()
    events: List[WorkflowEvent] = []

    for stage, label, detail in STAGE_LABELS:
        events.append(
            WorkflowEvent(
                stage=stage,
                label=label,
                status="complete",
                timestamp=timestamp,
                detail=detail,
            )
        )

    return events


def list_evaluations(*, trial_id: str | None = None) -> List[Evaluation]:
    items = list(EVALUATIONS.values())

    if trial_id:
        items = [evaluation for evaluation in items if evaluation.trial_id == trial_id]

    status_rank = {
        "Likely Match": 0,
        "Requires Review": 1,
        "Not Eligible": 2,
        "In Progress": 3,
    }

    return sorted(
        items,
        key=lambda evaluation: (
            status_rank.get(evaluation.recommendation, 99),
            -evaluation.match_score,
            evaluation.submitted_at,
        ),
    )


def seed_initial_evaluations() -> None:
    from app.services.evaluation_service import create_evaluation_for_patient

    if EVALUATIONS:
        return

    seeded_pairs = [
        ("patient_001", "trial_nsclc_001", "seed_eval_001"),
        ("patient_002", "trial_nsclc_001", "seed_eval_002"),
        ("patient_003", "trial_nsclc_001", "seed_eval_003"),
        ("patient_004", "trial_nsclc_001", "seed_eval_004"),
        ("patient_101", "trial_breast_001", "seed_eval_101"),
        ("patient_102", "trial_breast_001", "seed_eval_102"),
        ("patient_103", "trial_breast_001", "seed_eval_103"),
        ("patient_201", "trial_heme_001", "seed_eval_201"),
        ("patient_202", "trial_heme_001", "seed_eval_202"),
        ("patient_203", "trial_heme_001", "seed_eval_203"),
    ]

    for patient_id, trial_id, evaluation_id in seeded_pairs:
        create_evaluation_for_patient(
            patient_id,
            trial_id,
            evaluation_id=evaluation_id,
            create_review_task=False,
        )

    if "review_001" in REVIEWS:
        review = REVIEWS["review_001"]
        REVIEWS["review_001"] = review.model_copy(
            update={
                "evaluation_id": "seed_eval_003",
                "patient_id": "patient_003",
                "trial_id": "trial_nsclc_001",
            }
        )