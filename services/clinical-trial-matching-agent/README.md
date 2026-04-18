# Clinical Trial Matching Agent System

Starter scaffold for a portfolio-ready demo with:
- Next.js frontend mock dashboard
- FastAPI backend with seeded data
- Simulated Kafka-style workflow states
- curl-testable endpoints

## Structure

- `apps/web` — frontend demo page and components
- `apps/api` — FastAPI API, seeded trials/patients/reviews, workflow simulation
- `docs` — quick integration notes

## Quick start

### Backend

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend demo route:

```text
/projects/clinical-trial-matching-agent
```

## curl examples

### List trials
```bash
curl http://localhost:8000/trials
```

### Activate a trial
```bash
curl -X POST http://localhost:8000/trials/trial_nsclc_001/activate
```

### List seeded patients
```bash
curl http://localhost:8000/patients
```

### Start evaluation
```bash
curl -X POST http://localhost:8000/evaluations/start \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"patient_003","trial_id":"trial_nsclc_001"}'
```

### List evaluations
```bash
curl http://localhost:8000/evaluations
```

### Workflow state
```bash
curl http://localhost:8000/workflow/eval_001
```

### Workflow events
```bash
curl http://localhost:8000/workflow/eval_001/events
```

### Evaluation results
```bash
curl http://localhost:8000/evaluations/eval_001/results
```

### List review queue
```bash
curl http://localhost:8000/reviews
```

### Submit review decision
```bash
curl -X POST http://localhost:8000/reviews/review_001/decision \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve","note":"Reviewed manually and acceptable for coordinator follow-up."}'
```
