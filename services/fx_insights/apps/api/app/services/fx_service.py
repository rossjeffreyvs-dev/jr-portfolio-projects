from __future__ import annotations

import os
from typing import Any, Generator

import requests
from openai import OpenAI

FX_API_URL = "https://api.exchangerate.host/live"
NEWS_API_URL = "https://api.marketaux.com/v1/news/all"

DEMO_RATES: dict[str, dict[str, float]] = {
    "EUR": {"USD": 1.0837, "GBP": 0.8461, "JPY": 169.42},
    "USD": {"EUR": 0.9228, "GBP": 0.7810, "JPY": 156.35},
    "GBP": {"EUR": 1.1819, "USD": 1.2805, "JPY": 200.18},
}

DEMO_HEADLINES = [
    "Dollar steadies as traders reassess the timing of rate cuts",
    "Eurozone inflation data keeps attention on central-bank guidance",
    "Sterling holds recent gains as services activity remains resilient",
    "Yen volatility persists as markets watch policy signals from Japan",
    "Risk appetite improves modestly after mixed global growth data",
]


def _normalize_csv(value: str) -> list[str]:
    return [item.strip().upper() for item in value.split(",") if item.strip()]


def fetch_rates(base: str, symbols: str) -> dict[str, float]:
    normalized_base = (base or "EUR").upper()
    requested = _normalize_csv(symbols or "USD,GBP,JPY")

    api_key = os.getenv("FX_API_KEY", "").strip()
    if not api_key:
        demo = DEMO_RATES.get(normalized_base, DEMO_RATES["EUR"])
        return {symbol: demo.get(symbol, 1.0) for symbol in requested}

    response = requests.get(
        FX_API_URL,
        params={
            "access_key": api_key,
            "source": normalized_base,
            "currencies": ",".join(requested),
        },
        timeout=20,
    )
    response.raise_for_status()
    data = response.json()

    if not data.get("success", False):
        raise RuntimeError(f"FX API error: {data.get('error') or data}")

    quotes = data.get("quotes") or {}
    rates: dict[str, float] = {}

    for pair, value in quotes.items():
        if pair.startswith(normalized_base):
            symbol = pair[len(normalized_base):]
            rates[symbol] = float(value)

    if not rates:
        raise RuntimeError(f"FX API returned no rates. Raw quotes: {quotes}")

    return rates


def fetch_news(countries: str, language: str = "en", limit: int = 5) -> list[dict[str, Any]]:
    api_token = os.getenv("NEWS_API_KEY", "").strip()
    if not api_token:
        return [{"title": title} for title in DEMO_HEADLINES[:limit]]

    response = requests.get(
        NEWS_API_URL,
        params={
            "api_token": api_token,
            "countries": countries,
            "language": language,
            "limit": limit,
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json().get("data", [])


def build_prompt(base: str, rates: dict[str, float], headlines: list[str]) -> str:
    return (
        "You are a currency markets analyst writing a concise client update.\n\n"
        f"Base currency: {base}\n"
        f"FX rates: {rates}\n"
        f"Relevant headlines: {headlines}\n\n"
        "Write approximately 200 words explaining how FX moves and news combine, "
        "what to watch next, and practical implications for the next 1-2 weeks. "
        "Use plain English and avoid overclaiming."
    )


def demo_insight(base: str, rates: dict[str, float], headlines: list[str]) -> str:
    rate_bits = ", ".join(f"{base}/{symbol} at {value:.4f}" for symbol, value in rates.items())
    headline_context = "; ".join(headlines[:3]) if headlines else "limited fresh headline context"

    return (
        f"{base} markets are showing a mixed but orderly setup, with {rate_bits}. "
        f"The headline backdrop points to {headline_context}. For clients, the near-term read is that "
        "currency moves are being driven less by a single shock and more by the interaction of rate-cut "
        "expectations, relative growth data, and risk sentiment. The practical implication is to avoid "
        "overreacting to one data point and instead watch whether incoming inflation and activity numbers "
        "confirm the current central-bank path. Over the next one to two weeks, the most important signals "
        "are likely to be changes in rate expectations, comments from policy makers, and whether equity and "
        "credit markets continue to support risk appetite. For exposed portfolios or operating budgets, this "
        "argues for scenario planning around modest volatility rather than a one-way currency call."
    )


def call_openai(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        # The caller supplies structured rates/headlines, but the prompt is simple enough
        # that the deterministic fallback is better handled before this function.
        raise RuntimeError("OPENAI_API_KEY is not set.")

    client = OpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    timeout_s = float(os.getenv("OPENAI_TIMEOUT_S", "30"))

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You generate helpful FX market commentary."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
        max_tokens=450,
        timeout=timeout_s,
    )
    return (response.choices[0].message.content or "").strip()


def stream_openai(prompt: str) -> Generator[str, None, None]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set.")

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
        try:
            chunk = event.choices[0].delta.content
            if chunk:
                yield chunk
        except Exception:
            continue


def get_rates_payload(base: str, symbols: str) -> dict[str, Any]:
    normalized_base = (base or "EUR").upper()
    return {"base": normalized_base, "rates": fetch_rates(normalized_base, symbols)}


def get_news_payload(countries: str, language: str = "en", limit: int = 5) -> dict[str, Any]:
    news = fetch_news(countries, language=language, limit=limit)
    headlines = [item.get("title") for item in news if item.get("title")]
    return {"headlines": headlines, "news": news}


def generate_report_payload(base: str, rates: dict[str, float], headlines: list[str]) -> dict[str, Any]:
    normalized_base = (base or "EUR").upper()
    if not os.getenv("OPENAI_API_KEY", "").strip():
        insight = demo_insight(normalized_base, rates, headlines)
    else:
        insight = call_openai(build_prompt(normalized_base, rates, headlines))

    return {"base": normalized_base, "rates": rates, "insight": insight}


def generate_report_stream(base: str, rates: dict[str, float], headlines: list[str]) -> Generator[str, None, None]:
    normalized_base = (base or "EUR").upper()

    if not os.getenv("OPENAI_API_KEY", "").strip():
        text = demo_insight(normalized_base, rates, headlines)
        words = text.split(" ")
        for index, word in enumerate(words):
            suffix = "" if index == len(words) - 1 else " "
            yield word + suffix
        return

    yield from stream_openai(build_prompt(normalized_base, rates, headlines))
