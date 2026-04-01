from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from gateway.host_router import get_app_for_host

app = FastAPI()

@app.middleware("http")
async def host_dispatch(request: Request, call_next):
    host = (request.headers.get("host") or "").split(":")[0].lower()
    target_app = get_app_for_host(host)

    if target_app is not None:
        # forward to the matched ASGI app
        return await target_app(request.scope, request.receive, request.send)

    return HTMLResponse(
        """
        <h2>JR Portfolio Projects</h2>
        <p>Unknown host. Try a project subdomain:</p>
        <ul>
          <li>ai-fx-insights.jeffrey-ross.me</li>
          <li>resume-analyzer.jeffrey-ross.me</li>
          <li>smart-thermostat.jeffrey-ross.me</li>
          <li>ai-clinical-trial-evaluator.jeffrey-ross.me</li>
        </ul>
        """,
        status_code=200,
    )
