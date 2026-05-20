from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import analysis, cdm, institutions, workflow

load_dotenv()

app = FastAPI(title="Open Finance Insights API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "open-finance-insights-api", "version": "0.1.0"}

app.include_router(institutions.router)
app.include_router(cdm.router)
app.include_router(analysis.router)
app.include_router(workflow.router)
