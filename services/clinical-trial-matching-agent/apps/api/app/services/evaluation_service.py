from __future__ import annotations

from typing import List, Optional

from app.models.schemas import (
    CriterionResult,
    Evaluation,
    ReviewTask,
    StartEvaluationRequest,
)
from app.services.store import EVALUATIONS, PATIENTS, REVIEWS, TRIALS, build_workflow_events, utc_now


def _safe_text(items, index: int, fallback: str) -> str:
    return items[index].text if len(items) > index else fallback


def _safe_id(items, index: int, fallback: str) -> str:
    return items[index].id if len(items) > index else fallback


def _existing_evaluation_for_patient_trial(patient_id: str, trial_id: str) -> Evaluation | None:
    matches = [
        evaluation
        for evaluation in EVALUATIONS.values()
        if evaluation.patient_id == patient_id and evaluation.trial_id == trial_id
    ]
    if not matches:
        return None

    return max(matches, key=lambda evaluation: (evaluation.submitted_at, evaluation.match_score))


def _build_criterion_results(patient_id: str, trial_id: str) -> List[CriterionResult]:
    patient = PATIENTS[patient_id]
    trial = TRIALS[trial_id]
    inclusion = trial.inclusion_criteria
    exclusion = trial.exclusion_criteria

    if patient.seeded_outcome == "Likely Match":
        results: List[CriterionResult] = []

        if len(inclusion) > 0:
            results.append(
                CriterionResult(
                    criterion_id=_safe_id(inclusion, 0, "INC_FALLBACK_001"),
                    criterion_text=_safe_text(
                        inclusion,
                        0,
                        "Primary eligibility criterion satisfied.",
                    ),
                    criterion_type="inclusion",
                    status="met",
                    evidence=f"Patient diagnosis includes {patient.diagnosis[0]}.",
                    confidence="high",
                )
            )

        if len(inclusion) > 1:
            results.append(
                CriterionResult(
                    criterion_id=_safe_id(inclusion, 1, "INC_FALLBACK_002"),
                    criterion_text=_safe_text(
                        inclusion,
                        1,
                        "Performance or demographic criterion satisfied.",
                    ),
                    criterion_type="inclusion",
                    status="met",
                    evidence=f"Performance status recorded as {patient.ecog}.",
                    confidence="high",
                )
            )

        if len(exclusion) > 0:
            results.append(
                CriterionResult(
                    criterion_id=_safe_id(exclusion, 0, "EXC_FALLBACK_001"),
                    criterion_text=_safe_text(
                        exclusion,
                        0,
                        "No seeded exclusion criterion conflict found.",
                    ),
                    criterion_type="exclusion",
                    status="met",
                    evidence="No documented prohibited prior therapy found.",
                    confidence="moderate",
                )
            )

        return results

    if patient.seeded_outcome == "Not Eligible":
        results = []

        if len(exclusion) > 0:
            results.append(
                CriterionResult(
                    criterion_id=_safe_id(exclusion, 0, "EXC_FALLBACK_001"),
                    criterion_text=_safe_text(
                        exclusion,
                        0,
                        "Seeded exclusion criterion triggered.",
                    ),
                    criterion_type="exclusion",
                    status="not_met",
                    evidence="Prior prohibited therapy or equivalent exclusion signal identified.",
                    confidence="high",
                    action_needed="Do not advance unless protocol changes.",
                )
            )

        if len(inclusion) > 0:
            results.append(
                CriterionResult(
                    criterion_id=_safe_id(
                        inclusion,
                        min(1, len(inclusion) - 1),
                        "INC_FALLBACK_001",
                    ),
                    criterion_text=_safe_text(
                        inclusion,
                        min(1, len(inclusion) - 1),
                        "Supporting inclusion criterion needs confirmation.",
                    ),
                    criterion_type="inclusion",
                    status="possibly_met",
                    evidence="Supporting criterion referenced in notes but not fully confirmed.",
                    confidence="low",
                    action_needed="Recent visit confirmation recommended.",
                )
            )

        return results

    results = []

    if len(inclusion) > 0:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 0, "INC_FALLBACK_001"),
                criterion_text=_safe_text(
                    inclusion,
                    0,
                    "Primary eligibility criterion appears met.",
                ),
                criterion_type="inclusion",
                status="met",
                evidence=f"Diagnosis history is consistent with {patient.diagnosis[0]}.",
                confidence="high",
            )
        )

    if len(inclusion) > 1:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 1, "INC_FALLBACK_002"),
                criterion_text=_safe_text(
                    inclusion,
                    1,
                    "Additional inclusion criterion requires confirmation.",
                ),
                criterion_type="inclusion",
                status="missing_information",
                evidence="No recent supporting statement found in seeded data.",
                confidence="low",
                action_needed="Manual chart review required.",
            )
        )
    elif len(inclusion) > 0:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 0, "INC_FALLBACK_001"),
                criterion_text="Additional supporting evidence required for final review.",
                criterion_type="inclusion",
                status="missing_information",
                evidence="Seeded data does not fully cover all protocol-specific review needs.",
                confidence="low",
                action_needed="Manual chart review required.",
            )
        )

    if len(exclusion) > 1:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(exclusion, 1, "EXC_FALLBACK_002"),
                criterion_text=_safe_text(
                    exclusion,
                    1,
                    "Potential exclusion criterion needs review.",
                ),
                criterion_type="exclusion",
                status="possibly_met",
                evidence="Potential conflict referenced indirectly in note summary.",
                confidence="low",
                action_needed="Coordinator review recommended.",
            )
        )
    elif len(exclusion) > 0:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(exclusion, 0, "EXC_FALLBACK_001"),
                criterion_text="Potential exclusion review required.",
                criterion_type="exclusion",
                status="possibly_met",
                evidence="Trial-specific exclusion needs manual verification for this seeded case.",
                confidence="low",
                action_needed="Coordinator review recommended.",
            )
        )

    return results


def _evaluation_confidence(seed_outcome: str) -> str:
    if seed_outcome == "Likely Match":
        return "high"
    if seed_outcome == "Requires Review":
        return "low"
    return "moderate"


def create_evaluation_for_patient(
    patient_id: str,
    trial_id: str,
    *,
    evaluation_id: Optional[str] = None,
    create_review_task: bool = True,
    allow_existing: bool = False,
) -> Evaluation:
    patient = PATIENTS[patient_id]

    if allow_existing:
        existing_evaluation = _existing_evaluation_for_patient_trial(patient_id, trial_id)
        if existing_evaluation is not None:
            return existing_evaluation

    review_required = patient.seeded_outcome == "Requires Review"

    if evaluation_id is None:
        evaluation_id = f"eval_{len(EVALUATIONS) + 1:03d}"

    evaluation = Evaluation(
        id=evaluation_id,
        patient_id=patient.id,
        trial_id=trial_id,
        match_score=patient.seeded_score,
        recommendation=patient.seeded_outcome,
        confidence=_evaluation_confidence(patient.seeded_outcome),
        blockers=[]
        if patient.seeded_outcome != "Not Eligible"
        else ["Prior PD-1 inhibitor exposure"],
        missing_information=[]
        if patient.seeded_outcome != "Requires Review"
        else ["Brain metastases status", "Washout period confirmation"],
        review_required=review_required,
        review_reason=[]
        if not review_required
        else ["Ambiguous autoimmune history", "Missing recent imaging evidence"],
        workflow_status="Awaiting Human Review" if review_required else "Completed",
        explanation=patient.seeded_reason,
        criterion_results=_build_criterion_results(patient.id, trial_id),
        workflow_events=build_workflow_events(),
        submitted_at=utc_now(),
        reviewer_action=None,
    )

    EVALUATIONS[evaluation.id] = evaluation

    if review_required and create_review_task:
        existing_review = next(
            (review for review in REVIEWS.values() if review.evaluation_id == evaluation.id),
            None,
        )
        if not existing_review:
            review_id = f"review_{len(REVIEWS) + 1:03d}"
            REVIEWS[review_id] = ReviewTask(
                id=review_id,
                evaluation_id=evaluation.id,
                patient_id=patient.id,
                trial_id=trial_id,
                reason=evaluation.review_reason,
                priority="High",
                review_status="Open",
            )

    return evaluation


def start_evaluation(payload: StartEvaluationRequest) -> Evaluation:
    return create_evaluation_for_patient(
        payload.patient_id,
        payload.trial_id,
        allow_existing=True,
    )
