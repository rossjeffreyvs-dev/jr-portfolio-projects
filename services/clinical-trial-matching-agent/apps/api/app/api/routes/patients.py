from fastapi import APIRouter, HTTPException, Query

from app.services.store import EVALUATIONS, PATIENTS

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

        evaluated_patient_ids = {
            evaluation.patient_id
            for evaluation in EVALUATIONS.values()
            if evaluation.trial_id == trial_id
        }

        patients = [
            patient
            for patient in patients
            if patient.id not in evaluated_patient_ids
        ]

    return {"items": [patient.model_dump() for patient in patients]}


@router.get("/{patient_id}")
def get_patient(patient_id: str):
    patient = PATIENTS.get(patient_id)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient.model_dump()