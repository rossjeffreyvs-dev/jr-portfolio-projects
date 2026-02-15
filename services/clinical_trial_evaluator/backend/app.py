# app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import asyncio
import os

from models import Patient, AddPatientResponse, ClearCacheResponse
from ai_eligibility import evaluate_patients_async

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = "backend/data/patients.csv"
PATIENTS_DF = pd.read_csv(DATA_PATH) if os.path.exists(DATA_PATH) else pd.DataFrame()

@app.get("/")
def root():
    return {"message": "Clinical Trial Eligibility API is running."}

@app.get("/api/patients")
async def get_patients():
    print("→ /api/patients called")
    results = await evaluate_patients_async(PATIENTS_DF)
    print("→ results returned")
    return results

@app.post("/api/add-patient", response_model=AddPatientResponse)
async def add_patient(patient: Patient):
    global PATIENTS_DF
    new_row = pd.DataFrame([patient.dict()])
    PATIENTS_DF = pd.concat([PATIENTS_DF, new_row], ignore_index=True)
    PATIENTS_DF.to_csv(DATA_PATH, index=False)
    print(f"🧩 Added patient: {patient.name}")

    asyncio.create_task(evaluate_patients_async(PATIENTS_DF))
    return {"status": f"Added {patient.name} and started re-evaluation."}

@app.delete("/api/clear-cache", response_model=ClearCacheResponse)
def clear_cache():
    cache_path = "backend/data/eligibility_cache.json"
    if os.path.exists(cache_path):
        os.remove(cache_path)
        return {"status": "Cache cleared"}
    return {"status": "Cache not found"}
