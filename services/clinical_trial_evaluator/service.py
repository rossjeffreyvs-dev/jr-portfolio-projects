from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"service": "clinical_trial_evaluator", "status": "ok"}
