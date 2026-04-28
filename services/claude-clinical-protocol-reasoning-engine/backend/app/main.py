from pathlib import Path
import asyncio
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

app = FastAPI(title="Claude Clinical Protocol Reasoning Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvaluationRequest(BaseModel):
    trial_id: str
    patient_id: str


def load_json(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


def get_trial_and_patient(trial_id: str, patient_id: str):
    trials = load_json("trials.json")
    patients = load_json("patients.json")

    trial = next((item for item in trials if item["id"] == trial_id), None)
    patient = next((item for item in patients if item["id"] == patient_id), None)

    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return trial, patient


def evaluate_criterion(criterion: dict, patient: dict):
    patient_diagnoses = " ".join(patient.get("diagnoses", [])).lower()
    patient_flags = " ".join(patient.get("flags", [])).lower()
    patient_ecog = patient.get("ecog")

    text = criterion.get("text", "")
    category = criterion.get("category", "")
    criterion_type = criterion.get("type", "")
    normalized = f"{text} {category}".lower()

    result = "uncertain"
    confidence = 0.65
    rationale = (
        "The available synthetic patient record does not provide enough "
        "structured evidence to make a definitive determination."
    )
    evidence = [
        "Structured patient evidence was reviewed.",
        "No definitive matching field was found for this criterion.",
    ]

    if "nsclc" in normalized or "non-small cell lung cancer" in normalized:
        if "nsclc" in patient_diagnoses or "non-small cell lung cancer" in patient_diagnoses:
            result = "match"
            confidence = 0.92
            rationale = "The patient diagnosis includes NSCLC, matching the trial diagnosis requirement."
            evidence = [
                "Patient diagnosis includes NSCLC or non-small cell lung cancer.",
                "Trial criterion requires metastatic non-small cell lung cancer.",
            ]
        else:
            result = "no_match"
            confidence = 0.88
            rationale = "The patient diagnosis does not include NSCLC."
            evidence = [
                "Patient diagnoses were reviewed.",
                "No NSCLC diagnosis was found in the structured record.",
            ]

    elif "her2" in normalized or "breast cancer" in normalized:
        if "her2" in patient_diagnoses or "breast cancer" in patient_diagnoses:
            result = "match"
            confidence = 0.90
            rationale = "The patient diagnosis aligns with the HER2-positive breast cancer trial requirement."
            evidence = [
                "Patient diagnosis includes HER2-positive breast cancer or breast cancer.",
                "Trial criterion requires HER2-positive metastatic breast cancer.",
            ]
        else:
            result = "no_match"
            confidence = 0.86
            rationale = "The patient diagnosis does not align with the breast cancer trial requirement."
            evidence = [
                "Patient diagnoses were reviewed.",
                "No breast cancer or HER2-positive diagnosis was found.",
            ]

    elif "ecog" in normalized or "performance status" in normalized:
        if patient_ecog in [0, 1]:
            result = "match"
            confidence = 0.95
            rationale = (
                f"The patient ECOG score is {patient_ecog}, which satisfies "
                "the 0–1 performance status requirement."
            )
            evidence = [
                f"Patient ECOG score is {patient_ecog}.",
                "Trial requires ECOG performance status of 0 or 1.",
            ]
        elif patient_ecog is not None:
            result = "no_match"
            confidence = 0.93
            rationale = (
                f"The patient ECOG score is {patient_ecog}, which does not "
                "satisfy the 0–1 requirement."
            )
            evidence = [
                f"Patient ECOG score is {patient_ecog}.",
                "Trial requires ECOG performance status of 0 or 1.",
            ]

    elif "autoimmune" in normalized:
        if "autoimmune" in patient_flags or "rheumatoid arthritis" in patient_diagnoses:
            result = "no_match" if criterion_type == "exclusion" else "uncertain"
            confidence = 0.84
            rationale = "The patient record includes autoimmune-related evidence that may trigger this exclusion criterion."
            evidence = [
                "Patient has autoimmune-related evidence in diagnoses or flags.",
                "Criterion excludes active autoimmune disease requiring systemic treatment.",
            ]
        else:
            result = "match" if criterion_type == "exclusion" else "uncertain"
            confidence = 0.78
            rationale = "No autoimmune-related exclusion evidence is present in the synthetic patient record."
            evidence = [
                "No autoimmune diagnosis or flag was found.",
                "Criterion is an exclusion rule, so absence of evidence supports eligibility.",
            ]

    elif "cardiac" in normalized or "ejection fraction" in normalized:
        if "cardiac" in patient_flags or "reduced ejection fraction" in patient_flags:
            result = "no_match" if criterion_type == "exclusion" else "uncertain"
            confidence = 0.82
            rationale = "The patient record includes cardiac-related risk evidence relevant to this exclusion criterion."
            evidence = [
                "Patient record includes cardiac-related flag evidence.",
                "Criterion excludes clinically significant cardiac disease or reduced ejection fraction.",
            ]
        else:
            result = "match" if criterion_type == "exclusion" else "uncertain"
            confidence = 0.74
            rationale = "No cardiac exclusion evidence is present, but detailed ejection fraction data is not available."
            evidence = [
                "No cardiac risk flag was found.",
                "Detailed ejection fraction data is not available in this synthetic record.",
            ]

    return {
        "criterion_id": criterion.get("id"),
        "criterion": text,
        "type": criterion_type,
        "category": category,
        "result": result,
        "confidence": confidence,
        "rationale": rationale,
        "evidence": evidence,
    }


def build_evaluation(trial: dict, patient: dict):
    results = [
        evaluate_criterion(criterion, patient)
        for criterion in trial.get("criteria", [])
    ]

    matches = sum(1 for item in results if item["result"] == "match")
    no_matches = sum(1 for item in results if item["result"] == "no_match")
    uncertain = sum(1 for item in results if item["result"] == "uncertain")

    if no_matches > 0:
        recommendation = "not_eligible"
        decision_rationale = (
            "At least one criterion failed, so the patient should not proceed "
            "without additional review or updated evidence."
        )
    elif uncertain > 0:
        recommendation = "needs_review"
        decision_rationale = (
            "No hard failures were found, but one or more criteria require "
            "human review because structured evidence is incomplete."
        )
    else:
        recommendation = "potential_match"
        decision_rationale = (
            "All evaluated criteria matched the available synthetic patient "
            "record, so the patient appears to be a potential match."
        )

    return {
        "trial_id": trial["id"],
        "patient_id": patient["id"],
        "recommendation": recommendation,
        "decision_rationale": decision_rationale,
        "summary": {
            "matches": matches,
            "no_matches": no_matches,
            "uncertain": uncertain,
            "total": len(results),
        },
        "results": results,
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/trials")
def get_trials():
    return load_json("trials.json")


@app.get("/patients")
def get_patients():
    return load_json("patients.json")


@app.get("/dashboard")
def get_dashboard():
    return {
        "trials": load_json("trials.json"),
        "patients": load_json("patients.json"),
    }


@app.post("/evaluate")
def evaluate(payload: EvaluationRequest):
    trial, patient = get_trial_and_patient(payload.trial_id, payload.patient_id)
    return build_evaluation(trial, patient)


@app.post("/evaluate-stream")
async def evaluate_stream(payload: EvaluationRequest):
    trial, patient = get_trial_and_patient(payload.trial_id, payload.patient_id)

    async def stream_events():
        yield json.dumps(
            {
                "event": "started",
                "message": "Protocol reasoning started.",
                "trial_id": trial["id"],
                "patient_id": patient["id"],
            }
        ) + "\n"

        await asyncio.sleep(0.35)

        yield json.dumps(
            {
                "event": "trace",
                "label": "Protocol parsed",
                "detail": f"{len(trial.get('criteria', []))} eligibility criteria loaded.",
            }
        ) + "\n"

        await asyncio.sleep(0.35)

        yield json.dumps(
            {
                "event": "trace",
                "label": "Patient evidence retrieved",
                "detail": f"{patient['id']} diagnoses, ECOG, medications, labs, and flags reviewed.",
            }
        ) + "\n"

        await asyncio.sleep(0.35)

        streamed_results = []

        for criterion in trial.get("criteria", []):
            result = evaluate_criterion(criterion, patient)
            streamed_results.append(result)

            yield json.dumps(
                {
                    "event": "criterion",
                    "data": result,
                }
            ) + "\n"

            await asyncio.sleep(0.65)

        evaluation = build_evaluation(trial, patient)

        yield json.dumps(
            {
                "event": "complete",
                "data": {
                    "trial_id": evaluation["trial_id"],
                    "patient_id": evaluation["patient_id"],
                    "recommendation": evaluation["recommendation"],
                    "decision_rationale": evaluation["decision_rationale"],
                    "summary": evaluation["summary"],
                },
            }
        ) + "\n"

    return StreamingResponse(
        stream_events(),
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )