
Commands to Run the App
🧠 A. Fast Mock Mode (no API calls — instant)

Used for local development, UI testing, or when you don’t want to burn tokens.

# from your backend folder
export MOCK_MODE=true
uvicorn app:app --reload --port 5000


✅ What happens:

Skips all OpenAI API calls.

Returns instant “mock” reasoning text.

Saves cache instantly (no latency).

⚡ B. Live Mode (real OpenAI eligibility evaluation)

Used when you’re ready to test real AI logic.

export MOCK_MODE=false
export OPENAI_API_KEY="sk-your-key-here"
uvicorn app:app --reload --port 5000


✅ What happens:

Calls gpt-4o-mini (default) for each new patient.

Runs multiple requests concurrently (async).

Writes results to backend/data/eligibility_cache.json.

💡 Tip: You can use a faster, cheaper model if you prefer:

export OPENAI_MODEL="gpt-3.5-turbo"

🧩 2️⃣ Clearing the Cache (to re-run all patients)

If you want to force a full re-evaluation, simply delete the cache file:

rm backend/data/eligibility_cache.json


✅ On the next run:

The API will detect the missing cache file.

It will re-evaluate all patients from scratch.

Then re-save the cache automatically.

