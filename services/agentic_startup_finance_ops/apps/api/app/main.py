from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
from app.routers import metrics, questions, reasoning, reviews, scenarios, workflow
app=FastAPI(title='Agentic Startup Finance & Operations API',version='1.4.0')
app.add_middleware(CORSMiddleware,allow_origins=['*'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
@app.get('/health')
def health(): return {'status':'ok','service':'agentic-startup-finance-ops-api','version':'1.4.0'}
app.include_router(metrics.router); app.include_router(scenarios.router); app.include_router(questions.router); app.include_router(workflow.router); app.include_router(reviews.router); app.include_router(reasoning.router)
