# Semantic Patient Search (Local Dev)

A small full-stack healthcare discovery demo that uses **semantic search** over **synthetic patient records**.

- **Backend:** Python + Flask + sentence-transformers
- **Frontend:** Vite + React + TypeScript
- **Deployment pattern:** mirrors the `fx_insights` service style used in `jr-portfolio-projects`

This project demonstrates how natural-language search can retrieve the most relevant patient profiles by combining demographics, diagnoses, medications, labs, encounters, and short narrative clinical summaries into a semantically searchable representation.

## What the demo does

Users can enter queries like:

- `middle-aged diabetic patient with declining kidney function`
- `elderly patient with repeated ED visits and heart failure`
- `breast cancer patient receiving immunotherapy`

The app embeds the query, compares it to embedded synthetic patient profiles, and returns the top matches with similarity scores and concise match explanations.

## Folder structure

```text
semantic_patient_search/
  backend/
    local_server.py
    patient_search.py
    sample_data.py
    requirements.txt
  frontend/
    index.html
    package.json
    tsconfig.json
    vite.config.ts
    src/
      App.tsx
      main.tsx
      index.css
  scripts/
    dev.sh
  Dockerfile
  package.json
  run_local.sh
  service.py
  setup_local.sh
  __init__.py
```

## Prereqs

- Node.js 18+ or 20+
- Python 3.10+

## 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python local_server.py
```

Backend runs at: `http://127.0.0.1:5002`

## 2) Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5174`

The Vite dev server proxies `/api/*` requests to the backend dev server.

## 3) Use the app

Open the frontend and either:

- choose one of the sample searches, or
- enter your own natural-language query

Then click **Run Semantic Search**.

## Docker

From this service directory:

```bash
docker build -t semantic-patient-search .
docker run --rm -p 5002:5002 semantic-patient-search
```

Then open `http://127.0.0.1:5002`.

## Notes

- The data is fully **synthetic** and intended only for demonstration.
- The backend uses `sentence-transformers/all-MiniLM-L6-v2` for local embeddings.
- For a larger or production-style version, you could swap in OpenAI embeddings plus a vector database such as pgvector, Pinecone, or OpenSearch.
