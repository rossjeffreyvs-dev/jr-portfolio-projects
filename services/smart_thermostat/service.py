from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"service": "smart_thermostat", "status": "ok"}
