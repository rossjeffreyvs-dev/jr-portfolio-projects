from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import analyze, health

load_dotenv()

app = FastAPI(
    title="Resume Job Analyzer API",
    description="FastAPI backend for AI Resume Match Analyzer.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(analyze.router)
