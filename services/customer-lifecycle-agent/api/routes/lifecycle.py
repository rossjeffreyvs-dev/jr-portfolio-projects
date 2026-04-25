from __future__ import annotations

from datetime import datetime, timezone
from random import choice, randint
from typing import Literal

from fastapi import APIRouter

from app.services.store import ACTIVE_TRIAL_ID, EVALUATIONS, PATIENTS, REVIEWS, TRIALS

router = APIRouter(prefix="/lifecycle", tags=["lifecycle"])

VALUE_PER_CONVERTED_PATIENT = 10000

PATIENT_SOURCES = [
    "EHR feed",
    "Community oncology referral",
    "Site coordinator upload",
    "Registry match",
]

DIAGNOSES = [
    "Metastatic NSCLC",
    "Advanced breast cancer",
    "Relapsed hematologic malignancy",
]

BIOMARKERS = [
    "PD-L1 60%",
    "EGFR wild type",
    "HER2 low",
    "NPM1 mutation",
    "Biomarker pending",
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _active_evaluations():
    return [
        evaluation
        for evaluation in EVALUATIONS.values()
        if evaluation.trial_id == ACTIVE_TRIAL_ID
    ]


def _active_reviews():
    return [
        review
        for review in REVIEWS.values()
        if review.trial_id == ACTIVE_TRIAL_ID and review.review_status != "Resolved"
    ]


def _conversion_count() -> int:
    return sum(
        1
        for evaluation in _active_evaluations()
        if evaluation.recommendation == "Likely Match"
        or evaluation.reviewer_action == "approve"
    )


@router.get("")
def get_lifecycle_summary():
    trial = TRIALS.get(ACTIVE_TRIAL_ID)
    evaluations = _active_evaluations()
    review_queue = _active_reviews()

    prospects = [
        patient
        for patient in PATIENTS.values()
        if ACTIVE_TRIAL_ID in patient.eligible_trial_ids
    ]

    qualified_count = len(
        [
            patient
            for patient in prospects
            if patient.seeded_outcome in {"Likely Match", "Requires Review"}
        ]
    )
    evaluated_count = len(evaluations)
    review_count = len(review_queue)
    converted_count = _conversion_count()

    potential_value = len(prospects) * VALUE_PER_CONVERTED_PATIENT
    qualified_value = qualified_count * VALUE_PER_CONVERTED_PATIENT
    evaluated_value = evaluated_count * VALUE_PER_CONVERTED_PATIENT
    realized_value = converted_count * VALUE_PER_CONVERTED_PATIENT
    leakage_value = max(evaluated_value - realized_value, 0)

    insight_stage = "review_to_conversion" if review_count else "qualification_to_evaluation"
    insight_reason = (
        "Open human-review cases are preventing high-fit candidates from converting."
        if review_count
        else "Qualified candidates are available but not yet evaluated."
    )

    recommendation = (
        "Prioritize the review queue and approve high-confidence cases for enrollment follow-up."
        if review_count
        else "Start evaluations for the highest-fit inbound prospects."
    )

    return {
        "trial_profile": {
            "trial_id": trial.id if trial else ACTIVE_TRIAL_ID,
            "title": trial.title if trial else "Active trial",
            "buyer": "Pharma / biotech sponsor",
            "user": "Trial operations coordinator",
            "value_per_converted_patient": VALUE_PER_CONVERTED_PATIENT,
            "requested_patient_profile": {
                "diagnosis": trial.indication if trial else "Active indication",
                "key_inclusion": trial.key_inclusion if trial else [],
                "performance": trial.performance if trial else [],
                "exclusions": trial.exclusions if trial else [],
            },
        },
        "funnel": {
            "prospects": len(prospects),
            "qualified": qualified_count,
            "evaluated": evaluated_count,
            "in_review": review_count,
            "converted": converted_count,
            "potential_value": potential_value,
            "qualified_value": qualified_value,
            "evaluated_value": evaluated_value,
            "realized_value": realized_value,
            "leakage_value": leakage_value,
        },
        "review_queue": [
            {
                "review_id": review.id,
                "evaluation_id": review.evaluation_id,
                "patient_id": review.patient_id,
                "priority": review.priority,
                "reason": review.reason,
                "estimated_value": VALUE_PER_CONVERTED_PATIENT,
            }
            for review in review_queue
        ],
        "agent_insight": {
            "stage": insight_stage,
            "severity": "high" if leakage_value >= 30000 else "medium",
            "reason": insight_reason,
            "recommendation": recommendation,
            "estimated_gain": min(leakage_value, VALUE_PER_CONVERTED_PATIENT * 3),
        },
    }


@router.post("/ingest")
def ingest_mock_patient():
    patient_number = 900 + len(PATIENTS) + randint(1, 99)
    diagnosis = choice(DIAGNOSES)
    biomarker = choice(BIOMARKERS)
    ecog = choice(["0", "1", "2"])
    source = choice(PATIENT_SOURCES)

    fit: Literal["Likely Match", "Requires Review", "Not Eligible"]
    if ecog in {"0", "1"} and "pending" not in biomarker.lower():
        fit = "Likely Match"
        score = randint(78, 92)
    elif "pending" in biomarker.lower():
        fit = "Requires Review"
        score = randint(58, 76)
    else:
        fit = "Not Eligible"
        score = randint(30, 55)

    patient_id = f"patient_{patient_number}"

    patient = {
        "id": patient_id,
        "display_name": f"P-{patient_number}",
        "age": randint(42, 79),
        "sex": choice(["Female", "Male"]),
        "diagnosis": [diagnosis],
        "biomarkers": [biomarker],
        "ecog": ecog,
        "prior_therapies": [choice(["Platinum therapy", "Immunotherapy", "Targeted therapy"])],
        "labs": {},
        "comorbidities": [],
        "notes": [
            f"Ingested from {source}.",
            "Candidate added to sponsor enrollment funnel.",
        ],
        "eligible_trial_ids": [ACTIVE_TRIAL_ID],
        "seeded_outcome": fit,
        "seeded_score": score,
        "seeded_reason": f"{fit} based on diagnosis, biomarker availability, and ECOG {ecog}.",
    }

    from app.models.schemas import Patient

    PATIENTS[patient_id] = Patient.model_validate(patient)

    return {
        "message": "Mock patient ingested",
        "source": source,
        "ingested_at": utc_now(),
        "patient": patient,
    }