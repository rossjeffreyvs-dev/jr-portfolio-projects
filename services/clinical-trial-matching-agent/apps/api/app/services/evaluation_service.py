from __future__ import annotations

from typing import List, Optional

from app.models.schemas import (
    CriterionResult,
    Evaluation,
    Patient,
    ReviewTask,
    StartEvaluationRequest,
    Trial,
)
from app.services.store import (
    EVALUATIONS,
    PATIENTS,
    REVIEWS,
    TRIALS,
    build_workflow_events,
    utc_now,
)


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


def _join_or_dash(values: List[str]) -> str:
    return ", ".join(values) if values else "none reported"


def _lab_value(patient: Patient, key: str):
    return patient.labs.get(key)


def _contains_any(text: str, phrases: List[str]) -> bool:
    lowered = text.lower()
    return any(phrase in lowered for phrase in phrases)


def _notes_blob(patient: Patient) -> str:
    return " ".join(patient.notes).lower()


def _trial_family(trial: Trial) -> str:
    trial_id = trial.id.lower()

    if "nsclc" in trial_id:
        return "nsclc"
    if "breast" in trial_id:
        return "breast"
    if "heme" in trial_id:
        return "heme"

    return "general"


def _has_prior_checkpoint_exposure(patient: Patient) -> bool:
    checkpoint_terms = [
        "pembrolizumab",
        "nivolumab",
        "atezolizumab",
        "durvalumab",
        "avelumab",
        "checkpoint",
        "pd-1",
        "pd-l1",
    ]
    return _contains_any(" ".join(patient.prior_therapies), checkpoint_terms)


def _format_patient_context(patient: Patient) -> str:
    parts: List[str] = []

    if patient.diagnosis:
        parts.append(patient.diagnosis[0])
    if patient.ecog:
        parts.append(f"ECOG {patient.ecog}")
    if patient.biomarkers:
        parts.append(f"biomarkers {', '.join(patient.biomarkers)}")
    if patient.prior_therapies:
        parts.append(f"prior therapies {', '.join(patient.prior_therapies[:2])}")

    if patient.labs:
        lab_parts = [f"{key} {value}" for key, value in list(patient.labs.items())[:2]]
        parts.append(f"labs {', '.join(lab_parts)}")

    return "; ".join(parts) if parts else "seeded patient context"


def _build_blockers(patient: Patient, trial: Trial) -> List[str]:
    blockers: List[str] = []
    family = _trial_family(trial)
    notes = _notes_blob(patient)
    ecog = int(patient.ecog) if (patient.ecog and str(patient.ecog).isdigit()) else None
    hemoglobin = _lab_value(patient, "hemoglobin")

    if ecog is not None and ecog >= 3:
        blockers.append(f"ECOG {ecog} exceeds protocol performance threshold")

    if isinstance(hemoglobin, (int, float)) and hemoglobin < 9.5:
        blockers.append(f"hemoglobin {hemoglobin} is below minimum study threshold")

    if family == "nsclc" and _has_prior_checkpoint_exposure(patient):
        blockers.append("prior checkpoint inhibitor exposure conflicts with trial exclusion criteria")

    if family == "breast" and _contains_any(" ".join(patient.biomarkers), ["her2 0", "her2-zero", "her2 zero"]):
        blockers.append("HER2-low disease requirement is not met")

    if _contains_any(notes, ["active cellulitis", "active infection", "currently receiving antibiotics", "recent pneumonia"]):
        blockers.append("active or recently uncontrolled infection requires exclusion")

    if not blockers and patient.seeded_outcome == "Not Eligible":
        blockers.append(patient.seeded_reason)

    return blockers


def _build_missing_information(patient: Patient, trial: Trial) -> List[str]:
    if patient.seeded_outcome != "Requires Review":
        return []

    notes = _notes_blob(patient)
    missing: List[str] = []

    if _contains_any(notes, ["brain", "mri"]):
        missing.append("brain metastases status confirmation")

    if _contains_any(notes, ["washout", "prior therapy", "exposure"]):
        missing.append("washout period confirmation")

    if _contains_any(notes, ["echo", "cardiac", "cardiology"]):
        missing.append("cardiac clearance documentation")

    if _contains_any(notes, ["infection", "antibiotics", "infectious disease"]):
        missing.append("infection clearance documentation")

    if not missing:
        family = _trial_family(trial)

        if family == "nsclc":
            missing.append("recent imaging evidence")
        elif family == "breast":
            missing.append("cardiac function confirmation")
        elif family == "heme":
            missing.append("infection and marrow recovery clearance")
        else:
            missing.append("protocol-specific source documentation")

    return missing[:2]


def _build_review_reasons(patient: Patient, trial: Trial) -> List[str]:
    if patient.seeded_outcome != "Requires Review":
        return []

    reasons: List[str] = []
    notes = _notes_blob(patient)
    comorbidity_text = " ".join(patient.comorbidities).lower()

    if _contains_any(comorbidity_text, ["autoimmune", "rheumatoid"]):
        reasons.append("autoimmune history requires manual review")

    if _contains_any(comorbidity_text, ["cardiac", "atrial", "ventricular", "cardiovascular"]):
        reasons.append("cardiac comorbidity requires protocol review")

    if _contains_any(notes, ["borderline", "uncertain", "requires review"]):
        reasons.append("borderline evidence requires coordinator confirmation")

    if _contains_any(notes, ["infection", "infectious", "antibiotics"]):
        reasons.append("recent infection history requires clearance review")

    if not reasons:
        reasons.append(f"{trial.title} requires coordinator review for this seeded edge case")

    return reasons[:2]


def _build_explanation(
    patient: Patient,
    trial: Trial,
    blockers: List[str],
    missing_information: List[str],
    review_reasons: List[str],
) -> str:
    diagnosis = patient.diagnosis[0] if patient.diagnosis else "Seeded diagnosis"
    biomarkers = _join_or_dash(patient.biomarkers)
    prior_therapies = _join_or_dash(patient.prior_therapies)
    ecog = patient.ecog or "unknown"

    if patient.seeded_outcome == "Likely Match":
        return (
            f"{diagnosis} appears aligned with {trial.title}: ECOG {ecog}, biomarkers {biomarkers}, "
            f"prior therapies {prior_therapies}, and seeded labs support eligibility. {patient.seeded_reason}"
        )

    if patient.seeded_outcome == "Requires Review":
        reason_text = "; ".join(review_reasons) if review_reasons else patient.seeded_reason
        missing_text = "; ".join(missing_information) if missing_information else "additional protocol confirmation"
        return (
            f"{diagnosis} shows partial fit for {trial.title}, but manual review is recommended because "
            f"{reason_text}. Follow-up is needed for {missing_text}. {patient.seeded_reason}"
        )

    blocker_text = "; ".join(blockers) if blockers else patient.seeded_reason
    return (
        f"{diagnosis} does not fit {trial.title} because {blocker_text}. "
        f"Key context includes ECOG {ecog}, biomarkers {biomarkers}, and prior therapies {prior_therapies}."
    )


def _disease_evidence(patient: Patient) -> str:
    diagnosis = patient.diagnosis[0] if patient.diagnosis else "seeded diagnosis"
    return f"Diagnosis documented as {diagnosis}."


def _performance_evidence(patient: Patient) -> str:
    return f"Performance status recorded as ECOG {patient.ecog or 'unknown'}."


def _biomarker_evidence(patient: Patient) -> str:
    return f"Biomarker summary: {_join_or_dash(patient.biomarkers)}."


def _therapy_evidence(patient: Patient) -> str:
    return f"Prior therapy history includes {_join_or_dash(patient.prior_therapies)}."


def _lab_evidence(patient: Patient) -> str:
    if not patient.labs:
        return "No structured lab summary was found in seeded data."

    return "Lab summary: " + ", ".join(
        f"{name} {value}" for name, value in list(patient.labs.items())[:3]
    )


def _build_criterion_results(patient_id: str, trial_id: str) -> List[CriterionResult]:
    patient = PATIENTS[patient_id]
    trial = TRIALS[trial_id]
    inclusion = trial.inclusion_criteria
    exclusion = trial.exclusion_criteria

    family = _trial_family(trial)
    ecog = int(patient.ecog) if (patient.ecog and str(patient.ecog).isdigit()) else None
    has_checkpoint = _has_prior_checkpoint_exposure(patient)
    has_active_infection = _contains_any(_notes_blob(patient), ["active cellulitis", "active infection", "antibiotics", "recent pneumonia"])
    biomarkers_text = " ".join(patient.biomarkers).lower()

    results: List[CriterionResult] = []

    # Disease alignment
    if inclusion:
        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 0, "INC_FALLBACK_001"),
                criterion_text=_safe_text(inclusion, 0, "Disease-alignment criterion"),
                criterion_type="inclusion",
                status="met",
                evidence=_disease_evidence(patient),
                confidence="high",
            )
        )

    # Performance / general fitness
    if len(inclusion) > 1:
        performance_status = "met"
        performance_confidence = "high"
        performance_action = None

        if patient.seeded_outcome == "Requires Review" and ecog == 2:
            performance_status = "possibly_met"
            performance_confidence = "moderate"
            performance_action = "Confirm functional status at screening visit."
        elif patient.seeded_outcome == "Not Eligible" and ecog is not None and ecog >= 3:
            performance_status = "not_met"
            performance_confidence = "high"
            performance_action = "Do not advance unless performance status improves."

        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 1, "INC_FALLBACK_002"),
                criterion_text=_safe_text(inclusion, 1, "Performance status criterion"),
                criterion_type="inclusion",
                status=performance_status,
                evidence=_performance_evidence(patient),
                confidence=performance_confidence,  # type: ignore[arg-type]
                action_needed=performance_action,
            )
        )

    # Disease-family-specific evidence row
    if len(inclusion) > 2:
        family_status = "met"
        family_confidence = "high"
        family_action = None
        family_evidence = _biomarker_evidence(patient)

        if family == "nsclc" and has_checkpoint:
            family_status = "not_met" if patient.seeded_outcome == "Not Eligible" else "possibly_met"
            family_confidence = "high" if patient.seeded_outcome == "Not Eligible" else "low"
            family_action = "Review prior checkpoint exposure against protocol washout and exclusion criteria."
            family_evidence = f"{_therapy_evidence(patient)} Prior checkpoint exposure identified."

        elif family == "breast" and _contains_any(biomarkers_text, ["her2 0", "her2-zero", "her2 zero"]):
            family_status = "not_met"
            family_confidence = "high"
            family_action = "HER2-low disease requirement is not satisfied."
            family_evidence = _biomarker_evidence(patient)

        elif family == "heme" and has_active_infection:
            family_status = "possibly_met"
            family_confidence = "low"
            family_action = "Clear active or recent infection before proceeding."
            family_evidence = f"{_lab_evidence(patient)} Recent infection references found in note summary."

        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 2, "INC_FALLBACK_003"),
                criterion_text=_safe_text(inclusion, 2, "Biomarker or disease-specific eligibility criterion"),
                criterion_type="inclusion",
                status=family_status,  # type: ignore[arg-type]
                evidence=family_evidence,
                confidence=family_confidence,  # type: ignore[arg-type]
                action_needed=family_action,
            )
        )

    # Lab / evidence sufficiency row
    if len(inclusion) > 3:
        lab_status = "met"
        lab_confidence = "moderate"
        lab_action = None

        hemoglobin = _lab_value(patient, "hemoglobin")

        if patient.seeded_outcome == "Requires Review":
            lab_status = "missing_information"
            lab_confidence = "low"
            lab_action = "Obtain or confirm protocol-required labs before final decision."
        elif isinstance(hemoglobin, (int, float)) and hemoglobin < 9.5:
            lab_status = "not_met"
            lab_confidence = "high"
            lab_action = "Lab threshold not met."

        results.append(
            CriterionResult(
                criterion_id=_safe_id(inclusion, 3, "INC_FALLBACK_004"),
                criterion_text=_safe_text(inclusion, 3, "Laboratory or source documentation criterion"),
                criterion_type="inclusion",
                status=lab_status,  # type: ignore[arg-type]
                evidence=_lab_evidence(patient),
                confidence=lab_confidence,  # type: ignore[arg-type]
                action_needed=lab_action,
            )
        )

    # Exclusion review
    if exclusion:
        exclusion_status = "met"
        exclusion_confidence = "moderate"
        exclusion_action = None
        exclusion_evidence = "No direct seeded exclusion conflict identified."

        if patient.seeded_outcome == "Requires Review":
            exclusion_status = "possibly_met"
            exclusion_confidence = "low"
            exclusion_action = "Coordinator review recommended."
            exclusion_evidence = (
                "Potential conflict needs review based on seeded notes and comorbidity context."
            )
        elif patient.seeded_outcome == "Not Eligible":
            exclusion_status = "not_met"
            exclusion_confidence = "high"
            exclusion_action = "Do not advance unless exclusion criteria are resolved."
            if has_checkpoint:
                exclusion_evidence = "Prior checkpoint inhibitor exposure conflicts with protocol exclusion logic."
            elif has_active_infection:
                exclusion_evidence = "Active or recently uncontrolled infection conflicts with trial entry."
            else:
                exclusion_evidence = "Seeded exclusion signal identified from performance status, biomarker fit, or lab thresholds."

        results.append(
            CriterionResult(
                criterion_id=_safe_id(exclusion, 0, "EXC_FALLBACK_001"),
                criterion_text=_safe_text(exclusion, 0, "Exclusion review"),
                criterion_type="exclusion",
                status=exclusion_status,  # type: ignore[arg-type]
                evidence=exclusion_evidence,
                confidence=exclusion_confidence,  # type: ignore[arg-type]
                action_needed=exclusion_action,
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

    review_required = patient.seeded_outcome == "Requires Review"

    if evaluation_id is None:
        evaluation_id = f"eval_{len(EVALUATIONS) + 1:03d}"

    blockers = _build_blockers(patient, trial)
    missing_information = _build_missing_information(patient, trial)
    review_reason = _build_review_reasons(patient, trial)
    explanation = _build_explanation(
        patient,
        trial,
        blockers,
        missing_information,
        review_reason,
    )

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
        workflow_status="Awaiting Human Review" if review_required else "Completed",
        explanation=explanation,
        criterion_results=_build_criterion_results(patient.id, trial_id),
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
    return create_evaluation_for_patient(
        payload.patient_id,
        payload.trial_id,
        allow_existing=True,
    )