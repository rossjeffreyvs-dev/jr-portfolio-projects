# curl quickstart

Run the API on port 8000 and then use these examples.

## list trials
curl http://localhost:8000/trials

## list patients
curl http://localhost:8000/patients

## activate trial
curl -X POST http://localhost:8000/trials/trial_nsclc_001/activate

## start evaluation
curl -X POST http://localhost:8000/evaluations/start \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"patient_003","trial_id":"trial_nsclc_001"}'

## workflow state
curl http://localhost:8000/workflow/eval_001

## evaluation results
curl http://localhost:8000/evaluations/eval_001/results

## review queue
curl http://localhost:8000/reviews

## approve review item
curl -X POST http://localhost:8000/reviews/review_001/decision \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve","note":"Reviewed and approved for follow-up."}'
