from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import (
    SemanticQuerySuggestionResponse,
    SemanticSearchRequest,
    SemanticSearchResponse,
)
from app.services.patient_semantic_search import (
    get_semantic_query_suggestions,
    rank_patients_for_query,
)
from app.services.store import PATIENTS, TRIALS

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("")
def list_patients(trial_id: str | None = Query(default=None)):
    patients = list(PATIENTS.values())

    if trial_id:
        patients = [
            patient
            for patient in patients
            if trial_id in patient.eligible_trial_ids
        ]

    return {"items": [patient.model_dump() for patient in patients]}


@router.get("/semantic-search/suggestions", response_model=SemanticQuerySuggestionResponse)
def get_semantic_suggestions(trial_id: str = Query(...)):
    trial = TRIALS.get(trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    suggestions = get_semantic_query_suggestions(trial)
    return SemanticQuerySuggestionResponse(trial_id=trial_id, items=suggestions)


@router.post("/semantic-search", response_model=SemanticSearchResponse)
def semantic_search_patients(payload: SemanticSearchRequest):
    trial = TRIALS.get(payload.trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    query = payload.query.strip()
    suggestions = get_semantic_query_suggestions(trial)

    if not query:
        return SemanticSearchResponse(
            trial_id=payload.trial_id,
            query=query,
            strategy="token_weighted_demo_semantic",
            total_candidates=0,
            items=[],
            suggestions=suggestions,
        )

    candidates = list(PATIENTS.values())
    if not payload.include_nontrial_matches:
        candidates = [
            patient
            for patient in candidates
            if payload.trial_id in patient.eligible_trial_ids
        ]

    ranked = rank_patients_for_query(
        trial=trial,
        patients=candidates,
        query=query,
        top_k=payload.top_k,
    )

    return SemanticSearchResponse(
        trial_id=payload.trial_id,
        query=query,
        strategy="token_weighted_demo_semantic",
        total_candidates=len(candidates),
        items=ranked,
        suggestions=suggestions,
    )


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = PATIENTS.get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient.model_dump()