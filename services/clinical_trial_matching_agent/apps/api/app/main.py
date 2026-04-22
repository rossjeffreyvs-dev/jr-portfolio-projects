from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import evaluations, patients, reviews, trials, workflow
from .services.store import seed_initial_evaluations

app = FastAPI(title="Clinical Trial Matching Agent API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    seed_initial_evaluations()


@app.get("/")
def healthcheck():
    return {"message": "Clinical Trial Matching Agent API is running"}


app.include_router(trials.router)
app.include_router(patients.router)
app.include_router(evaluations.router)
app.include_router(workflow.router)
app.include_router(reviews.router)
