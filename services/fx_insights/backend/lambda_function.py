import os
import json
from datetime import datetime
from typing import Dict, List, Generator, Any

import requests
from openai import OpenAI

# Env vars:
#   OPENAI_API_KEY   (required)
#   NEWS_API_KEY     (required for MarketAux)
#   FX_API_KEY       (required for exchangerate.host with access_key)
# Optional:
#   OPENAI_MODEL     (default: gpt-4o-mini)
#   OPENAI_TIMEOUT_S (default: 30)

# NOTE: With access_key keys, exchangerate.host commonly uses /live + source/currencies
FX_API_URL = "https://api.exchangerate.host/live"
NEWS_API_URL = "https://api.marketaux.com/v1/news/all"


def fetch_rates(base: str, symbols: str) -> Dict[str, float]:
    api_key = os.getenv("FX_API_KEY")
    if not api_key:
        raise RuntimeError("FX_API_KEY is not set. Add it to your environment (or .env).")

    resp = requests.get(
        FX_API_URL,
        params={
            "access_key": api_key,
            "source": base,
            "currencies": symbols,
        },
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()

    if not data.get("success", False):
        raise RuntimeError(f"FX API error: {data.get('error') or data}")

    quotes = data.get("quotes") or {}
    # quotes format: {"EURUSD": 1.08, "EURGBP": 0.85, ...}
    rates: Dict[str, float] = {}
    for pair, val in quotes.items():
        if pair.startswith(base):
            sym = pair[len(base):]
            rates[sym] = val

    if not rates:
        raise RuntimeError(f"FX API returned no rates. Raw quotes: {quotes}")

    return rates


def fetch_news(countries: str, language="en", limit=5) -> List[dict]:
    api_token = os.getenv("NEWS_API_KEY")
    if not api_token:
        raise RuntimeError("NEWS_API_KEY is not set. Add it to your environment (or .env).")

    resp = requests.get(
        NEWS_API_URL,
        params={
            "api_token": api_token,
            "countries": countries,
            "language": language,
            "limit": limit,
        },
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json().get("data", [])


def build_prompt(base: str, rates: dict, headlines: list) -> str:
    return (
        "You are a currency markets analyst writing a concise client update.\n\n"
        f"Base currency: {base}\n"
        f"FX rates: {rates}\n"
        f"Relevant headlines: {headlines}\n\n"
        "Write ~200 words explaining how FX moves and news combine, what to watch next, "
        "and practical implications for the next 1-2 weeks. Use plain English."
    )


def call_openai(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set. Add it to your environment (or .env).")

    client = OpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    timeout_s = float(os.getenv("OPENAI_TIMEOUT_S", "30"))

    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You generate helpful FX market commentary."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
        max_tokens=450,
        timeout=timeout_s,
    )
    return (resp.choices[0].message.content or "").strip()


def stream_openai(prompt: str) -> Generator[str, None, None]:
    """
    Yields text chunks from OpenAI streaming response.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set. Add it to your environment (or .env).")

    client = OpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    timeout_s = float(os.getenv("OPENAI_TIMEOUT_S", "30"))

    stream = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You generate helpful FX market commentary."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
        max_tokens=450,
        stream=True,
        timeout=timeout_s,
    )

    for event in stream:
        # event.choices[0].delta.content contains incremental tokens
        try:
            delta = event.choices[0].delta
            chunk = getattr(delta, "content", None)
            if chunk:
                yield chunk
        except Exception:
            # If the SDK format changes, we’d rather not kill the stream silently.
            continue


# --- Helpers for the 3-stage design ---

def get_rates_payload(base: str, symbols: str) -> Dict[str, Any]:
    rates = fetch_rates(base, symbols)
    return {"base": base, "rates": rates}


def get_news_payload(countries: str, language="en", limit=5) -> Dict[str, Any]:
    news = fetch_news(countries, language=language, limit=limit)
    headlines = [item.get("title") for item in news if item.get("title")]
    return {"headlines": headlines, "news": news}


def generate_report_payload(base: str, rates: dict, headlines: list) -> Dict[str, Any]:
    prompt = build_prompt(base, rates, headlines)
    insight = call_openai(prompt)
    return {"base": base, "rates": rates, "insight": insight}


def generate_report_stream(base: str, rates: dict, headlines: list) -> Generator[str, None, None]:
    """
    Yields the report text as it streams from OpenAI.
    """
    prompt = build_prompt(base, rates, headlines)
    for chunk in stream_openai(prompt):
        yield chunk


# --- Original lambda-style handler (kept for compatibility) ---

def lambda_handler(event, context):
    q = (event or {}).get("queryStringParameters") or {}
    base = q.get("base", "EUR")
    symbols = q.get("symbols", "USD,GBP,JPY")
    countries = q.get("countries", "us,gb,jp")

    try:
        rates = fetch_rates(base, symbols)
        news = fetch_news(countries)
        headlines = [item.get("title") for item in news if item.get("title")]
        prompt = build_prompt(base, rates, headlines)
        insight = call_openai(prompt)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "base": base,
                "rates": rates,
                "insight": insight
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
