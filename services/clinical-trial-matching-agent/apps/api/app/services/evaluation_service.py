from __future__ import annotations

from typing import List, Optional

from app.models.schemas import CriterionResult, Evaluation, ReviewTask, StartEvaluationRequest
from app.services.store import EVALUATIONS, PATIENTS, REVIEWS, TRIALS, build_workflow_events, utc_now


def _build_criterion_results(patient_id: str, trial_id: str) -> List[CriterionResult]:
    patient = PATIENTS[patient_id]
    trial = TRIALS[trial_id]

    if patient.seeded_outcome == "Likely Match":
        return [
            CriterionResult(
                criterion_id=trial.inclusion_criteria[0].id,
                criterion_text=trial.inclusion_criteria[0].text,
                criterion_type="inclusion",
                status="met",
                evidence=f"Patient diagnosis includes {patient.diagnosis[0]}.",
                confidence="high",
            ),
            CriterionResult(
                criterion_id=trial.inclusion_criteria[1].id,
                criterion_text=trial.inclusion_criteria[1].text,
                criterion_type="inclusion",
                status="met",
                evidence=f"Performance status recorded as {patient.ecog}.",
                confidence="high",
            ),
            CriterionResult(
                criterion_id=trial.exclusion_criteria[0].id,
                criterion_text=trial.exclusion_criteria[0].text,
                criterion_type="exclusion",
                status="met",
                evidence="No documented prohibited prior therapy found.",
                confidence="moderate",
            ),
        ]

    if patient.seeded_outcome == "Not Eligible":
        return [
            CriterionResult(
                criterion_id=trial.exclusion_criteria[0].id,
                criterion_text=trial.exclusion_criteria[0].text,
                criterion_type="exclusion",
                status="not_met",
                evidence="Prior PD-1 exposure identified in therapy history.",
                confidence="high",
                action_needed="Do not advance unless protocol changes.",
            ),
            CriterionResult(
                criterion_id=trial.inclusion_criteria[1].id,
                criterion_text=trial.inclusion_criteria[1].text,
                criterion_type="inclusion",
                status="possibly_met",
                evidence="ECOG listed in prior note but not recent encounter.",
                confidence="low",
                action_needed="Recent visit confirmation recommended.",
            ),
        ]

    return [
        CriterionResult(
            criterion_id=trial.inclusion_criteria[0].id,
            criterion_text=trial.inclusion_criteria[0].text,
            criterion_type="inclusion",
            status="met",
            evidence=f"Diagnosis history is consistent with {patient.diagnosis[0]}.",
            confidence="high",
        ),
        CriterionResult(
            criterion_id=trial.inclusion_criteria[2].id,
            criterion_text=trial.inclusion_criteria[2].text,
            criterion_type="inclusion",
            status="missing_information",
            evidence="No recent imaging statement found in seeded data.",
            confidence="low",
            action_needed="Manual chart review required.",
        ),
        CriterionResult(
            criterion_id=trial.exclusion_criteria[1].id,
            criterion_text=trial.exclusion_criteria[1].text,
            criterion_type="exclusion",
            status="possibly_met",
            evidence="Autoimmune history referenced indirectly in note summary.",
            confidence="low",
            action_needed="Coordinator review recommended.",
        ),
    ]


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
) -> Evaluation:
    patient = PATIENTS[patient_id]
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
        blockers=[] if patient.seeded_outcome != "Not Eligible" else ["Prior PD-1 inhibitor exposure"],
        missing_information=[] if patient.seeded_outcome != "Requires Review" else ["Brain metastases status", "Washout period confirmation"],
        review_required=review_required,
        review_reason=[] if not review_required else ["Ambiguous autoimmune history", "Missing recent imaging evidence"],
        workflow_status="Awaiting Human Review" if review_required else "Completed",
        explanation=patient.seeded_reason,
        criterion_results=_build_criterion_results(patient.id, trial_id),
        workflow_events=build_workflow_events(),
        submitted_at=utc_now(),
        reviewer_action=None,
    )
    EVALUATIONS[evaluation.id] = evaluation

    if review_required and create_review_task:
        existing = next(
            (review for review in REVIEWS.values() if review.evaluation_id == evaluation.id),
            None,
        )
        if not existing:
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
    return create_evaluation_for_patient(payload.patient_id, payload.trial_id)
