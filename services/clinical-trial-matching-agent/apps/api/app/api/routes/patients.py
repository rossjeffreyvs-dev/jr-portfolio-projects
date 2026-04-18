from fastapi import APIRouter, HTTPException

from app.services.store import PATIENTS

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("")
def list_patients():
    return {"items": [patient.model_dump() for patient in PATIENTS.values()]}


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = PATIENTS.get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient.model_dump()
