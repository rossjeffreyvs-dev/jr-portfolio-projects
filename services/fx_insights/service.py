from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"service": "fx_insights", "status": "ok"}
