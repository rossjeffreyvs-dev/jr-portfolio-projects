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
    item["id"]: Trial.model_validate(item) for item in _load_json("trials/trials.json")
}
PATIENTS: Dict[str, Patient] = {
    item["id"]: Patient.model_validate(item) for item in _load_json("patients/patients.json")
}
REVIEWS: Dict[str, ReviewTask] = {
    item["id"]: ReviewTask.model_validate(item) for item in _load_json("reviews/reviews.json")
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


def _join_or_dash(values: List[str]) -> str:
    return ", ".join(values) if values else "none reported"


def _lab_summary(patient: Patient) -> str:
    if not patient.labs:
        return "no key lab summary available"

    parts = [f"{name} {value}" for name, value in patient.labs.items()]
    return ", ".join(parts[:3])


def build_workflow_events(
    *,
    patient: Patient,
    trial: Trial,
    recommendation: str,
    match_score: int,
    review_required: bool,
    review_reason: List[str],
    blockers: List[str],
    missing_information: List[str],
    explanation: str,
) -> List[WorkflowEvent]:
    timestamp = utc_now()
    diagnosis = patient.diagnosis[0] if patient.diagnosis else "seeded diagnosis"
    biomarkers = _join_or_dash(patient.biomarkers)
    prior_therapies = _join_or_dash(patient.prior_therapies)
    labs = _lab_summary(patient)

    events: List[WorkflowEvent] = [
        WorkflowEvent(
            stage="patient_selected",
            label="Patient selected",
            status="complete",
            timestamp=timestamp,
            detail=f"{patient.display_name} added for {diagnosis} evaluation in {trial.title}.",
        ),
        WorkflowEvent(
            stage="event_published",
            label="Event published",
            status="complete",
            timestamp=timestamp,
            detail=f"Eligibility request published to the internal orchestration workflow for {trial.id}.",
        ),
        WorkflowEvent(
            stage="patient_context_built",
            label="Patient context built",
            status="complete",
            timestamp=timestamp,
            detail=(
                f"Context assembled from biomarkers ({biomarkers}), ECOG {patient.ecog or 'unknown'}, "
                f"prior therapies ({prior_therapies}), and labs ({labs})."
            ),
        ),
        WorkflowEvent(
            stage="trial_criteria_loaded",
            label="Trial criteria loaded",
            status="complete",
            timestamp=timestamp,
            detail=(
                f"Loaded {len(trial.inclusion_criteria)} inclusion and "
                f"{len(trial.exclusion_criteria)} exclusion criteria from active protocol."
            ),
        ),
        WorkflowEvent(
            stage="criteria_scored",
            label="Matching criteria",
            status="complete",
            timestamp=timestamp,
            detail=f"Case-specific criteria scored to seeded match score {match_score} with provisional outcome {recommendation}.",
        ),
        WorkflowEvent(
            stage="explanation_generated",
            label="Explanation generated",
            status="complete",
            timestamp=timestamp,
            detail=explanation,
        ),
    ]

    if review_required:
        review_detail = (
            "; ".join(review_reason)
            if review_reason
            else "Case reviewed for coordinator escalation and uncertainty handling."
        )
        events.append(
            WorkflowEvent(
                stage="hitl_assessed",
                label="HITL review assessed",
                status="complete",
                timestamp=timestamp,
                detail=review_detail,
            )
        )

    if blockers:
        final_detail = f"Final recommendation set to {recommendation} due to {blockers[0]}."
    elif review_required and review_reason:
        final_detail = f"Final recommendation set to {recommendation}; coordinator review triggered for {review_reason[0]}."
    elif missing_information:
        final_detail = f"Final recommendation set to {recommendation}; follow-up needed for {missing_information[0]}."
    else:
        final_detail = f"Final recommendation set to {recommendation} based on protocol fit and available supporting evidence."

    events.append(
        WorkflowEvent(
            stage="recommendation_completed",
            label="Recommendation complete",
            status="complete",
            timestamp=timestamp,
            detail=final_detail,
        )
    )

    return events


def _timestamp_value(value: str) -> float:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return 0.0


def _dedupe_evaluations(items: List[Evaluation]) -> List[Evaluation]:
    latest_by_patient: Dict[str, Evaluation] = {}

    for evaluation in items:
        existing = latest_by_patient.get(evaluation.patient_id)

        if existing is None:
            latest_by_patient[evaluation.patient_id] = evaluation
            continue

        existing_ts = _timestamp_value(existing.submitted_at)
        next_ts = _timestamp_value(evaluation.submitted_at)

        if next_ts > existing_ts:
            latest_by_patient[evaluation.patient_id] = evaluation
            continue

        if next_ts == existing_ts and evaluation.match_score > existing.match_score:
            latest_by_patient[evaluation.patient_id] = evaluation

    return list(latest_by_patient.values())


def list_evaluations(*, trial_id: str | None = None) -> List[Evaluation]:
    items = list(EVALUATIONS.values())

    if trial_id:
        items = [evaluation for evaluation in items if evaluation.trial_id == trial_id]

    items = _dedupe_evaluations(items)

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
            -_timestamp_value(evaluation.submitted_at),
        ),
    )


def seed_initial_evaluations() -> None:
    from app.services.evaluation_service import create_evaluation_for_patient

    if EVALUATIONS:
        return

    seeded_by_trial = {
        "trial_nsclc_001": ["patient_001", "patient_002", "patient_003", "patient_004"],
        "trial_breast_001": ["patient_101", "patient_102", "patient_103"],
        "trial_heme_001": ["patient_201", "patient_202", "patient_203"],
    }

    seed_counter = 1

    for trial_id, patient_ids in seeded_by_trial.items():
        for patient_id in patient_ids:
            if patient_id not in PATIENTS:
                continue

            create_evaluation_for_patient(
                patient_id,
                trial_id,
                evaluation_id=f"seed_eval_{seed_counter:03d}",
            )
            seed_counter += 1

    if "review_001" in REVIEWS:
        review = REVIEWS["review_001"]
        REVIEWS["review_001"] = review.model_copy(
            update={
                "evaluation_id": "seed_eval_003",
                "patient_id": "patient_003",
                "trial_id": "trial_nsclc_001",
            }
        )