from services.fx_insights.service import app as fx_app
from services.resume_job_analyzer.service import app as resume_app
from services.smart_thermostat.service import app as thermo_app
from services.clinical_trial_evaluator.service import app as trial_app

HOST_MAP = {
    # production subdomains
    "ai-fx-insights.jeffrey-ross.me": fx_app,
    "resume-analyzer.jeffrey-ross.me": resume_app,
    "smart-thermostat.jeffrey-ross.me": thermo_app,
    "ai-clinical-trial-evaluator.jeffrey-ross.me": trial_app,

    # optional aliases if you later create DNS for them
    "fx-insights.jeffrey-ross.me": fx_app,
}

def get_app_for_host(host: str):
    return HOST_MAP.get(host)
