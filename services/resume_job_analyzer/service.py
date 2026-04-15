from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"service": "resume_job_analyzer", "status": "ok"}

@app.get("/health")
def health():
    return {"service": "resume_job_analyzer", "status": "ok"}