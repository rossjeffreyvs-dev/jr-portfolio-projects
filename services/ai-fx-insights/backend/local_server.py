from pathlib import Path
from datetime import datetime
import json
import traceback

from flask import Flask, request, Response, jsonify
from dotenv import load_dotenv

# Always load .env from repo root (one level above backend/)
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

from lambda_function import (
    get_rates_payload,
    get_news_payload,
    generate_report_payload,
    generate_report_stream,
)

app = Flask(__name__)


@app.get("/api/rates")
def api_rates():
    try:
        base = request.args.get("base", "EUR")
        symbols = request.args.get("symbols", "USD,GBP,JPY")

        payload = get_rates_payload(base, symbols)
        return jsonify({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            **payload
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.get("/api/news")
def api_news():
    try:
        countries = request.args.get("countries", "us,gb,jp")
        language = request.args.get("language", "en")
        limit = int(request.args.get("limit", "5"))

        payload = get_news_payload(countries, language=language, limit=limit)
        # Return only what frontend needs by default
        return jsonify({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "headlines": payload.get("headlines", [])
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.post("/api/report")
def api_report():
    """
    Non-streaming report generation (kept for debugging / fallback).
    """
    try:
        body = request.get_json(force=True) or {}
        base = body.get("base", "EUR")
        rates = body.get("rates") or {}
        headlines = body.get("headlines") or []

        payload = generate_report_payload(base, rates, headlines)
        return jsonify({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            **payload
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.get("/api/report/stream")
def api_report_stream():
    """
    SSE streaming endpoint.
    Emits events:
      - event: stage  data: {"stage":"rates"|"news"|"report"|"done", "progress": int, ...}
      - event: token  data: {"text":"..."}
      - event: done   data: {"timestamp":"...", "base":"...", "rates":{...}, "insight":"..."}
      - event: error  data: {"error":"..."}
    """
    base = request.args.get("base", "EUR")
    symbols = request.args.get("symbols", "USD,GBP,JPY")
    countries = request.args.get("countries", "us,gb,jp")

    def sse(event_name: str, payload: dict) -> str:
        return f"event: {event_name}\ndata: {json.dumps(payload)}\n\n"

    def generate():
        insight_accum = []
        rates = {}
        headlines = []

        try:
            # Stage 1: Rates
            yield sse("stage", {"stage": "rates", "progress": 10, "message": "Getting exchange rates..."})
            rp = get_rates_payload(base, symbols)
            rates = rp.get("rates", {})
            yield sse("stage", {"stage": "rates", "progress": 33, "message": "Exchange rates received."})

            # Stage 2: News
            yield sse("stage", {"stage": "news", "progress": 40, "message": "Getting market news..."})
            np = get_news_payload(countries, language="en", limit=5)
            headlines = np.get("headlines", [])
            yield sse("stage", {"stage": "news", "progress": 66, "message": "Market news received."})

            # Stage 3: Report streaming
            yield sse("stage", {"stage": "report", "progress": 75, "message": "Generating client report..."})

            for chunk in generate_report_stream(base, rates, headlines):
                insight_accum.append(chunk)
                yield sse("token", {"text": chunk})

            insight = "".join(insight_accum).strip()
            yield sse("stage", {"stage": "done", "progress": 100, "message": "Done."})
            yield sse("done", {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "base": base,
                "rates": rates,
                "insight": insight
            })

        except GeneratorExit:
            # Client disconnected; just stop.
            return
        except Exception as e:
            traceback.print_exc()
            yield sse("error", {"error": str(e)})

    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        # Helps with some proxies buffering SSE:
        "X-Accel-Buffering": "no",
        "Access-Control-Allow-Origin": "*",
    }
    return Response(generate(), headers=headers)


@app.get("/api/insight")
def api_insight():
    """
    Compatibility endpoint: old single-call path (optional).
    """
    try:
        base = request.args.get("base", "EUR")
        symbols = request.args.get("symbols", "USD,GBP,JPY")
        countries = request.args.get("countries", "us,gb,jp")

        rp = get_rates_payload(base, symbols)
        np = get_news_payload(countries, language="en", limit=5)
        payload = generate_report_payload(base, rp.get("rates", {}), np.get("headlines", []))

        return jsonify({
            "timestamp": datetime.utcnow().isoformat() + "Z",
            **payload
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
