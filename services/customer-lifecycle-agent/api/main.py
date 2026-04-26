from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.lifecycle import router as lifecycle_router

app = FastAPI(title="Customer Lifecycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "customer-lifecycle-agent"}

app.include_router(lifecycle_router)