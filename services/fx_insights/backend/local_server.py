from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path
import traceback

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request, send_from_directory

# Project root: services/fx_insights
PROJECT_ROOT = Path(__file__).resolve().parent.parent
STATIC_DIR = Path(__file__).resolve().parent / "static"

# Load local env file if present; container env vars still override normally
load_dotenv(PROJECT_ROOT / ".env")

from .lambda_function import (  # noqa: E402
    generate_report_payload,
    generate_report_stream,
    get_news_payload,
    get_rates_payload,
)

app = Flask(
    __name__,
    static_folder=str(STATIC_DIR),
    static_url_path="",
)


def _frontend_exists() -> bool:
    return (STATIC_DIR / "index.html").exists()


def _serve_frontend_index():
    if _frontend_exists():
        return send_from_directory(STATIC_DIR, "index.html")
    return (
        jsonify(
            {
                "error": "Frontend build not found.",
                "message": "Build the FX frontend and copy dist into backend/static.",
            }
        ),
        503,
    )


@app.get("/")
def serve_index():
    return _serve_frontend_index()


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "fx_insights"})


@app.get("/api/rates")
def api_rates():
    try:
        base = request.args.get("base", "EUR")
        symbols = request.args.get("symbols", "USD,GBP,JPY")
        payload = get_rates_payload(base, symbols)
        return jsonify(
            {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **payload,
            }
        )
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.get("/api/news")
def api_news():
    try:
        countries = request.args.get("countries", "us,gb,jp")
        language = request.args.get("language", "en")
        limit = int(request.args.get("limit", "5"))
        payload = get_news_payload(countries, language=language, limit=limit)
        return jsonify(
            {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "headlines": payload.get("headlines", []),
            }
        )
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.post("/api/report")
def api_report():
    """Non-streaming report generation for debugging / fallback."""
    try:
        body = request.get_json(force=True) or {}
        base = body.get("base", "EUR")
        rates = body.get("rates") or {}
        headlines = body.get("headlines") or []
        payload = generate_report_payload(base, rates, headlines)
        return jsonify(
            {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **payload,
            }
        )
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.get("/api/report/stream")
def api_report_stream():
    """
    SSE streaming endpoint.

    Emits:
    - event: stage data: {"stage":"rates"|"news"|"report"|"done", "progress": int, ...}
    - event: token data: {"text":"..."}
    - event: done  data: {"timestamp":"...", "base":"...", "rates":{...}, "insight":"..."}
    - event: error data: {"error":"..."}
    """
    base = request.args.get("base", "EUR")
    symbols = request.args.get("symbols", "USD,GBP,JPY")
    countries = request.args.get("countries", "us,gb,jp")

    def sse(event_name: str, payload: dict) -> str:
        return f"event: {event_name}\ndata: {json.dumps(payload)}\n\n"

    def generate():
        insight_accum: list[str] = []
        rates = {}
        headlines: list[str] = []

        try:
            yield sse(
                "stage",
                {
                    "stage": "rates",
                    "progress": 10,
                    "message": "Getting exchange rates...",
                },
            )
            rp = get_rates_payload(base, symbols)
            rates = rp.get("rates", {})
            yield sse(
                "stage",
                {
                    "stage": "rates",
                    "progress": 33,
                    "message": "Exchange rates received.",
                },
            )

            yield sse(
                "stage",
                {
                    "stage": "news",
                    "progress": 40,
                    "message": "Getting market news...",
                },
            )
            np = get_news_payload(countries, language="en", limit=5)
            headlines = np.get("headlines", [])
            yield sse(
                "stage",
                {
                    "stage": "news",
                    "progress": 66,
                    "message": "Market news received.",
                },
            )

            yield sse(
                "stage",
                {
                    "stage": "report",
                    "progress": 75,
                    "message": "Generating client report...",
                },
            )
            for chunk in generate_report_stream(base, rates, headlines):
                insight_accum.append(chunk)
                yield sse("token", {"text": chunk})

            insight = "".join(insight_accum).strip()
            yield sse(
                "stage",
                {
                    "stage": "done",
                    "progress": 100,
                    "message": "Done.",
                },
            )
            yield sse(
                "done",
                {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "base": base,
                    "rates": rates,
                    "insight": insight,
                },
            )
        except GeneratorExit:
            return
        except Exception as exc:
            traceback.print_exc()
            yield sse("error", {"error": str(exc)})

    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "Access-Control-Allow-Origin": "*",
    }
    return Response(generate(), headers=headers)


@app.get("/api/insight")
def api_insight():
    """Compatibility endpoint for the old single-call path."""
    try:
        base = request.args.get("base", "EUR")
        symbols = request.args.get("symbols", "USD,GBP,JPY")
        countries = request.args.get("countries", "us,gb,jp")

        rp = get_rates_payload(base, symbols)
        np = get_news_payload(countries, language="en", limit=5)
        payload = generate_report_payload(
            base,
            rp.get("rates", {}),
            np.get("headlines", []),
        )

        return jsonify(
            {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **payload,
            }
        )
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


@app.get("/<path:path>")
def serve_frontend_assets(path: str):
    """
    Serve built frontend assets if present; otherwise fall back to index.html
    so React client-side routing keeps working.
    """
    candidate = STATIC_DIR / path
    if candidate.exists() and candidate.is_file():
        return send_from_directory(STATIC_DIR, path)

    # Never swallow API routes here
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404

    return _serve_frontend_index()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)