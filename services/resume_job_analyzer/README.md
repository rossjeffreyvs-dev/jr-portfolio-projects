# AI Resume Match Analyzer v2

Modernized Resume Analyzer using the same architecture pattern as the newer portfolio projects:

- `apps/api` — FastAPI backend
- `apps/web` — Next.js frontend

## Local development on Windows

### 1. Start the API

```powershell
cd C:\Projects\jr-portfolio-projects\services\resume_job_analyzer_v2\apps\api
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env` and add your OpenAI key:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
```

Run:

```powershell
uvicorn app.main:app --reload --port 5000
```

Validate:

```powershell
curl.exe http://127.0.0.1:5000/health
```

Expected:

```json
{"service":"resume-job-analyzer-api","status":"ok"}
```

### 2. Start the web app

Open a second PowerShell:

```powershell
cd C:\Projects\jr-portfolio-projects\services\resume_job_analyzer_v2\apps\web
npm install
copy .env.local.example .env.local
npm run dev
```

Open:

```text
http://localhost:3002
```

## API endpoints

```text
GET  /health
POST /api/analyze
POST /api/demo
```

## Migration notes

This version removes the legacy Flask/Jinja/static structure and replaces it with a project layout consistent with the newer portfolio demos.
