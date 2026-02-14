import os
import json
import asyncio
import pandas as pd
from openai import AsyncOpenAI

# ------------------------------------------------------------------
#  Configuration
# ------------------------------------------------------------------
DATA_DIR = "backend/data"
CACHE_FILE = os.path.join(DATA_DIR, "eligibility_cache.json")
MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ------------------------------------------------------------------
#  Client Initialization
# ------------------------------------------------------------------
client = None
if not MOCK_MODE and os.getenv("OPENAI_API_KEY"):
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
else:
    print("⚙️ Running in MOCK_MODE (no OpenAI calls).")

# ------------------------------------------------------------------
#  Cache Helpers
# ------------------------------------------------------------------
def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE) as f:
                data = json.load(f)
                print(f"📂 Loaded cached results ({len(data)} patients)")
                return data
        except Exception as e:
            print("⚠️ Cache load error:", e)
    return []

def save_cache(results):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(CACHE_FILE, "w") as f:
            json.dump(results, f, indent=2)
        print(f"💾 Cache updated: {len(results)} total patients")
    except Exception as e:
        print("⚠️ Cache save error:", e)

# ------------------------------------------------------------------
#  OpenAI Reasoning
# ------------------------------------------------------------------
async def generate_reasoning_async(patient_dict, trial_context):
    if MOCK_MODE or not client:
        return "Mock mode: patient appears suitable based on available data."

    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a clinical trial eligibility reviewer. "
                    "Determine whether the patient fits the given inclusion/exclusion "
                    "criteria and respond concisely."
                    f"\n\nTrial context:\n{trial_context}"
                ),
            },
            {"role": "user", "content": f"Patient data: {patient_dict}"},
        ]

        completion = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=150,
            timeout=15,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print("⚠️ OpenAI error:", e)
        return f"Error: {e}"

# ------------------------------------------------------------------
#  Eligibility Evaluation
# ------------------------------------------------------------------
async def evaluate_patients_async(df: pd.DataFrame):
    cached = load_cache()

    # Convert cache to dict by patient name for fast lookup
    cache_dict = {entry["name"]: entry for entry in cached}

    trial_context = (
        "Trial: Glycerex for Type 2 Diabetes. "
        "Inclusion: Age 30–70, Type 2 Diabetes Mellitus, on metformin ≥3 months. "
        "Exclusion: cardiac disease, infection in last 3 months."
    )

    tasks = []
    new_patients = []

    for _, row in df.iterrows():
        name = row.get("name")
        if name not in cache_dict:
            new_patients.append(name)
            tasks.append(generate_reasoning_async(row.to_dict(), trial_context))

    if not tasks:
        print("✅ All patients already cached.")
        return cached

    print(f"⚙️ Evaluating {len(tasks)} new patient(s): {new_patients}")

    responses = await asyncio.gather(*tasks)

    new_results = []
    for (i, row), reasoning in zip(df[df["name"].isin(new_patients)].iterrows(), responses):
        status = "Manual review required"
        lower = reasoning.lower()
        if "suitable" in lower or "eligible" in lower:
            status = "Suitable"
        elif "not" in lower or "ineligible" in lower:
            status = "Not suitable"

        new_results.append({
            "name": row.get("name"),
            "gender": row.get("gender"),
            "age": row.get("age"),
            "diagnosis": row.get("diagnosis"),
            "eligibility_decision": status,
            "eligibility_reasoning": reasoning
        })

    # Merge new results into cache
    merged_results = cached + new_results
    save_cache(merged_results)

    print("✅ Evaluation complete (new results added).")
    return merged_results
