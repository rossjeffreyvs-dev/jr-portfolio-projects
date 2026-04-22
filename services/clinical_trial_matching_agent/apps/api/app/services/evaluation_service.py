from __future__ import annotations

from typing import Dict, List, Optional

from ..models.schemas import (
    CriterionResult,
    Evaluation,
    Patient,
    ReviewTask,
    StartEvaluationRequest,
    Trial,
)
from .store import (
    EVALUATIONS,
    PATIENTS,
    REVIEWS,
    TRIALS,
    build_workflow_events,
    utc_now,
)


def _normalize(value: str) -> str:
    return value.strip().lower()


def _patient_context(patient: Patient) -> Dict[str, str]:
    labs_text = " ".join(f"{key} {value}" for key, value in patient.labs.items())
    return {
        "diagnosis": " ".join(patient.diagnosis).lower(),
        "biomarkers": " ".join(patient.biomarkers).lower(),
        "therapies": " ".join(patient.prior_therapies).lower(),
        "comorbidities": " ".join(patient.comorbidities).lower(),
        "notes": " ".join(patient.notes).lower(),
        "labs": labs_text.lower(),
        "all": " ".join(
            [
                " ".join(patient.diagnosis),
                " ".join(patient.biomarkers),
                " ".join(patient.prior_therapies),
                " ".join(patient.comorbidities),
                " ".join(patient.notes),
                labs_text,
            ]
        ).lower(),
    }


def _contains_any(text: str, terms: List[str]) -> bool:
    return any(term in text for term in terms)


def _safe_ecog_value(patient: Patient) -> Optional[int]:
    if patient.ecog is None:
        return None

    digits = "".join(ch for ch in str(patient.ecog) if ch.isdigit())
    if not digits:
        return None

    try:
        return int(digits[0])
    except ValueError:
        return None


def _existing_evaluation_for_patient_trial(
    patient_id: str,
    trial_id: str,
) -> Optional[Evaluation]:
    for evaluation in EVALUATIONS.values():
        if evaluation.patient_id == patient_id and evaluation.trial_id == trial_id:
            return evaluation
    return None


def _build_exclusion_hits(patient: Patient, trial: Trial) -> List[str]:
    context = _patient_context(patient)
    hits: List[str] = []

    for criterion in trial.exclusion_criteria:
        category = _normalize(criterion.category)
        text = criterion.text

        triggered = False

        if "prior therapy" in category:
            triggered = _contains_any(
                context["therapies"],
                ["pd-1", "pd1", "pd-l1", "pdl1", "checkpoint", "immunotherapy"],
            )
        elif "autoimmune" in category:
            triggered = _contains_any(
                context["all"],
                ["autoimmune", "lupus", "rheumatoid", "crohn", "ulcerative colitis"],
            )
        elif "cardiac" in category:
            triggered = _contains_any(
                context["all"],
                ["cardiac", "heart failure", "arrhythmia", "lvef", "ejection fraction"],
            )
        elif "infection" in category:
            triggered = _contains_any(
                context["all"],
                ["infection", "sepsis", "bacteremia", "neutropenic fever", "pneumonia"],
            )

        if triggered:
            hits.append(text)

    if patient.seeded_outcome == "Not Eligible" and not hits:
        if trial.exclusions:
            hits.append(trial.exclusions[0])
        elif trial.exclusion_criteria:
            hits.append(trial.exclusion_criteria[0].text)

    return hits


def _build_matched_inclusion(patient: Patient, trial: Trial) -> List[str]:
    context = _patient_context(patient)
    ecog = _safe_ecog_value(patient)
    matched: List[str] = []

    for criterion in trial.inclusion_criteria:
        category = _normalize(criterion.category)
        text = criterion.text
        is_match = False

        if "diagnosis" in category:
            if trial.id == "trial_nsclc_001":
                is_match = _contains_any(context["diagnosis"], ["nsclc", "lung"])
            elif trial.id == "trial_breast_001":
                is_match = _contains_any(context["diagnosis"], ["breast"])
            else:
                is_match = _contains_any(
                    context["all"],
                    ["relapsed", "refractory", "lymphoma", "leukemia", "myeloma"],
                )
        elif "performance" in category:
            is_match = ecog is not None and ecog <= 1
        elif "imaging" in category:
            is_match = _contains_any(
                context["all"],
                ["mri", "ct", "pet", "brain", "cns", "restaging", "imaging"],
            )
        elif "age" in category:
            is_match = patient.age >= 18
        elif "disease status" in category:
            is_match = _contains_any(context["all"], ["relapsed", "refractory"])
        else:
            is_match = patient.seeded_outcome != "Not Eligible"

        if is_match:
            matched.append(text)

    return matched


def _build_missing_information(patient: Patient, trial: Trial) -> List[str]:
    context = _patient_context(patient)
    missing: List[str] = []

    ecog = _safe_ecog_value(patient)
    if ecog is None and (
        any("performance" in item.lower() for item in trial.key_inclusion)
        or any("performance" in item.lower() for item in trial.performance)
    ):
        missing.append("ECOG / performance status confirmation")

    if trial.id == "trial_nsclc_001" and not _contains_any(
        context["all"],
        ["mri", "ct", "brain", "cns", "imaging"],
    ):
        missing.append("Recent CNS imaging or metastasis assessment")

    if trial.id == "trial_breast_001" and not _contains_any(
        context["biomarkers"],
        ["her2-low", "her2 low", "1+", "2+"],
    ):
        missing.append("HER2-low pathology confirmation")

    if trial.id == "trial_heme_001" and _contains_any(
        context["all"],
        ["infection", "fever", "sepsis"],
    ):
        missing.append("Documentation that infection is controlled or resolved")

    if patient.seeded_outcome == "Requires Review" and not missing:
        missing.append("Coordinator review of protocol-specific eligibility details")

    # Preserve order and uniqueness
    seen = set()
    deduped: List[str] = []
    for item in missing:
        if item not in seen:
            seen.add(item)
            deduped.append(item)
    return deduped


def _build_review_reasons(
    patient: Patient,
    trial: Trial,
    exclusion_hits: List[str],
    missing_information: List[str],
) -> List[str]:
    reasons: List[str] = []

    if patient.seeded_outcome == "Requires Review":
        if exclusion_hits:
            reasons.append(
                f"Possible exclusion signal requires manual confirmation: {exclusion_hits[0]}"
            )
        if missing_information:
            reasons.append(
                f"Additional source review required for {missing_information[0].lower()}"
            )

        if not reasons:
            reasons.append(patient.seeded_reason)

    return reasons


def _build_unmet_inclusion(
    trial: Trial,
    matched_inclusion: List[str],
) -> List[str]:
    matched = set(matched_inclusion)
    unmet: List[str] = []

    for criterion in trial.inclusion_criteria:
        if criterion.text not in matched:
            unmet.append(criterion.text)

    return unmet


def _build_blockers(
    patient: Patient,
    trial: Trial,
    exclusion_hits: List[str],
    matched_inclusion: List[str],
) -> List[str]:
    blockers: List[str] = []

    if patient.seeded_outcome == "Not Eligible":
        blockers.extend(exclusion_hits)

        unmet_inclusion = _build_unmet_inclusion(trial, matched_inclusion)
        if unmet_inclusion:
            blockers.append(unmet_inclusion[0])

        if not blockers:
            blockers.append(patient.seeded_reason)

    return blockers


def _build_explanation(
    patient: Patient,
    trial: Trial,
    matched_inclusion: List[str],
    exclusion_hits: List[str],
    blockers: List[str],
    missing_information: List[str],
    review_reason: List[str],
) -> str:
    diagnosis = patient.diagnosis[0] if patient.diagnosis else "The patient"
    inclusion_text = ", ".join(matched_inclusion[:2]) if matched_inclusion else "limited inclusion evidence"
    exclusion_text = ", ".join(exclusion_hits[:2]) if exclusion_hits else "no clear exclusion trigger"
    missing_text = ", ".join(missing_information[:2]) if missing_information else "no major missing data"

    if patient.seeded_outcome == "Likely Match":
        return (
            f"{diagnosis} aligns with {trial.title} based on {inclusion_text}. "
            f"The evaluation found {exclusion_text}, and the current recommendation remains Likely Match."
        )

    if patient.seeded_outcome == "Requires Review":
        reason_text = "; ".join(review_reason[:2]) if review_reason else patient.seeded_reason
        return (
            f"{diagnosis} shows partial fit for {trial.title}. "
            f"Manual review is recommended because {reason_text}. "
            f"Follow-up is needed for {missing_text}."
        )

    blocker_text = "; ".join(blockers[:2]) if blockers else patient.seeded_reason
    return (
        f"{diagnosis} does not fit {trial.title} because {blocker_text}. "
        f"Protocol-specific exclusion review identified {exclusion_text}."
    )


def _criterion_confidence(status: str) -> str:
    if status in {"met", "not_met"}:
        return "high"
    if status == "possibly_met":
        return "moderate"
    return "low"


def _evaluate_inclusion_criterion(
    patient: Patient,
    trial: Trial,
    criterion_text: str,
    matched_inclusion: List[str],
    missing_information: List[str],
) -> tuple[str, str, Optional[str]]:
    context = _patient_context(patient)
    ecog = _safe_ecog_value(patient)

    if criterion_text in matched_inclusion:
        if "ECOG" in criterion_text:
            return (
                "met",
                f"ECOG recorded as {patient.ecog or 'unknown'} and is within expected range.",
                None,
            )
        if "Age" in criterion_text:
            return ("met", f"Patient age is {patient.age}.", None)
        if "CNS" in criterion_text or "imaging" in criterion_text.lower():
            return (
                "met",
                "Recent imaging or CNS assessment references were found in the patient context.",
                None,
            )
        return ("met", f"Patient context supports: {criterion_text}.", None)

    if "ECOG" in criterion_text and ecog is None:
        return (
            "missing_information",
            "Performance status is not clearly documented in the available profile.",
            "Confirm ECOG before advancing.",
        )

    if any(item.lower() in criterion_text.lower() for item in missing_information):
        return (
            "missing_information",
            "Supporting source documentation is still needed for this criterion.",
            "Collect the missing protocol evidence.",
        )

    if patient.seeded_outcome == "Requires Review":
        return (
            "possibly_met",
            f"Partial supporting evidence found for: {criterion_text}.",
            "Manual confirmation recommended.",
        )

    return (
        "not_met",
        f"Available patient context does not satisfy: {criterion_text}.",
        "Do not advance unless updated evidence is provided.",
    )


def _evaluate_exclusion_criterion(
    patient: Patient,
    criterion_text: str,
    exclusion_hits: List[str],
) -> tuple[str, str, Optional[str]]:
    context = _patient_context(patient)

    if criterion_text in exclusion_hits:
        return (
            "met",
            f"Patient context suggests this exclusion may apply. Evidence reviewed from therapies/comorbidities/notes: {context['all'][:180] or 'seeded record context'}",
            "Resolve or confirm exclusion before advancing.",
        )

    if patient.seeded_outcome == "Requires Review":
        return (
            "possibly_met",
            "No definitive exclusion was proven, but the available evidence is incomplete.",
            "Manual protocol review recommended.",
        )

    return (
        "not_met",
        "No current evidence suggests that this exclusion criterion is met.",
        None,
    )


def _build_criterion_results(
    patient: Patient,
    trial: Trial,
    matched_inclusion: List[str],
    exclusion_hits: List[str],
    missing_information: List[str],
) -> List[CriterionResult]:
    results: List[CriterionResult] = []

    for criterion in trial.inclusion_criteria:
        status, evidence, action_needed = _evaluate_inclusion_criterion(
            patient,
            trial,
            criterion.text,
            matched_inclusion,
            missing_information,
        )
        results.append(
            CriterionResult(
                criterion_id=criterion.id,
                criterion_text=criterion.text,
                criterion_type="inclusion",
                status=status,  # type: ignore[arg-type]
                evidence=evidence,
                confidence=_criterion_confidence(status),  # type: ignore[arg-type]
                action_needed=action_needed,
            )
        )

    for criterion in trial.exclusion_criteria:
        status, evidence, action_needed = _evaluate_exclusion_criterion(
            patient,
            criterion.text,
            exclusion_hits,
        )
        results.append(
            CriterionResult(
                criterion_id=criterion.id,
                criterion_text=criterion.text,
                criterion_type="exclusion",
                status=status,  # type: ignore[arg-type]
                evidence=evidence,
                confidence=_criterion_confidence(status),  # type: ignore[arg-type]
                action_needed=action_needed,
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
    trial = TRIALS[trial_id]

    if allow_existing:
        existing_evaluation = _existing_evaluation_for_patient_trial(patient_id, trial_id)
        if existing_evaluation is not None:
            return existing_evaluation

    if evaluation_id is None:
        evaluation_id = f"eval_{len(EVALUATIONS) + 1:03d}"

    matched_inclusion = _build_matched_inclusion(patient, trial)
    exclusion_hits = _build_exclusion_hits(patient, trial)
    missing_information = _build_missing_information(patient, trial)
    review_reason = _build_review_reasons(
        patient,
        trial,
        exclusion_hits,
        missing_information,
    )
    blockers = _build_blockers(
        patient,
        trial,
        exclusion_hits,
        matched_inclusion,
    )
    explanation = _build_explanation(
        patient,
        trial,
        matched_inclusion,
        exclusion_hits,
        blockers,
        missing_information,
        review_reason,
    )

    review_required = patient.seeded_outcome == "Requires Review"

    evaluation = Evaluation(
        id=evaluation_id,
        patient_id=patient.id,
        trial_id=trial_id,
        match_score=patient.seeded_score,
        recommendation=patient.seeded_outcome,
        confidence=_evaluation_confidence(patient.seeded_outcome),  # type: ignore[arg-type]
        blockers=blockers,
        missing_information=missing_information,
        review_required=review_required,
        review_reason=review_reason,
        exclusion_hits=exclusion_hits,
        matched_inclusion=matched_inclusion,
        workflow_status="Awaiting Human Review" if review_required else "Completed",
        explanation=explanation,
        criterion_results=_build_criterion_results(
            patient,
            trial,
            matched_inclusion,
            exclusion_hits,
            missing_information,
        ),
        workflow_events=[],
        submitted_at=utc_now(),
        reviewer_action=None,
    )

    evaluation = evaluation.model_copy(
        update={
            "workflow_events": build_workflow_events(
                patient=patient,
                trial=trial,
                recommendation=evaluation.recommendation,
                match_score=evaluation.match_score,
                review_required=evaluation.review_required,
                review_reason=evaluation.review_reason,
                blockers=evaluation.blockers,
                missing_information=evaluation.missing_information,
                explanation=evaluation.explanation,
            )
        }
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
    if payload.patient_id not in PATIENTS:
        raise KeyError(payload.patient_id)

    if payload.trial_id not in TRIALS:
        raise KeyError(payload.trial_id)

    return create_evaluation_for_patient(
        payload.patient_id,
        payload.trial_id,
    )