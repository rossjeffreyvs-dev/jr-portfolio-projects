from fastapi import APIRouter, HTTPException

from app.services import store

router = APIRouter(prefix="/trials", tags=["trials"])


@router.get("")
def list_trials():
    return {
        "active_trial_id": store.ACTIVE_TRIAL_ID,
        "items": [trial.model_dump() for trial in store.TRIALS.values()],
    }


@router.get("/{trial_id}")
def get_trial(trial_id: str):
    trial = store.TRIALS.get(trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    return trial.model_dump()


@router.post("/{trial_id}/activate")
def activate_trial(trial_id: str):
    try:
        trial = store.set_active_trial(trial_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Trial not found") from exc
    return {"message": "Trial activated", "trial": trial.model_dump()}
