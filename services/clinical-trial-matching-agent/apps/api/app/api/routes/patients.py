from fastapi import APIRouter, HTTPException, Query
from app.services.store import PATIENTS

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("")
def list_patients(trial_id: str | None = Query(default=None)):
    patients = list(PATIENTS.values())

    if trial_id:
        patients = [patient for patient in patients if trial_id in patient.trial_tags]

    return {"items": [patient.model_dump() for patient in patients]}


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = PATIENTS.get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient.model_dump()