import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
from docx import Document

# ==========================================================
#  Environment Setup
# ==========================================================

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

SAMPLE_JOB_DESC_PATH = os.path.join(BASE_DIR, "tests", "test-job-description.docx")
SAMPLE_RESUME_PATH = os.path.join(BASE_DIR, "tests", "test-resume.docx")

# ==========================================================
#  Initialize OpenAI Client
# ==========================================================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print("API key present:", bool(OPENAI_API_KEY))

if not OPENAI_API_KEY:
    raise RuntimeError(
        "❌ OPENAI_API_KEY is not set. "
        "For local dev: create a .env file with your API key.\n"
        "For production: add OPENAI_API_KEY in Lightsail container environment variables."
    )

client = OpenAI(api_key=OPENAI_API_KEY)

# ==========================================================
#  Helper Functions
# ==========================================================

def extract_text_from_file(filepath):
    """Extract text from a PDF or DOCX file."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    _, ext = os.path.splitext(filepath)
    ext = ext.lower()

    if ext == ".pdf":
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    if ext == ".docx":
        doc = Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])

    raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")


def normalize_analysis_payload(payload):
    """Guarantee the API returns the shape the React UI expects."""
    return {
        "score": int(payload.get("score", 0) or 0),
        "summary": payload.get("summary", "") or "No summary returned.",
        "matches": payload.get("matches", []) or [],
        "gaps": payload.get("gaps", []) or [],
        "recommendations": payload.get("recommendations", []) or [],
    }


def generate_match_analysis(job_description, resume_text):
    """Call OpenAI API and return structured match analysis as a dict."""
    prompt = f"""
You are an expert product hiring assistant.

Compare the following job description and resume.

Return ONLY valid JSON. Do not include markdown, code fences, explanations, or text outside the JSON.

Use this exact JSON shape:
{{
  "score": 0,
  "summary": "A concise 2-3 sentence overview of candidate fit.",
  "matches": [
    "Specific strength or matching requirement."
  ],
  "gaps": [
    "Specific missing or weaker requirement."
  ],
  "recommendations": [
    "Specific resume or positioning improvement."
  ]
}}

Scoring guidance:
- 90-100: exceptional match
- 75-89: strong match with minor gaps
- 60-74: partial match with meaningful gaps
- below 60: weak match

Job Description:
{job_description}

Resume:
{resume_text}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1400,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content or "{}"
        parsed = json.loads(raw)
        print("OpenAI structured analysis succeeded")
        return normalize_analysis_payload(parsed)

    except Exception as e:
        print("OpenAI error:", type(e).__name__, str(e))
        return {
            "score": 0,
            "summary": "Unable to generate structured analysis.",
            "matches": [],
            "gaps": [],
            "recommendations": [f"Error generating match response: {e}"],
        }


def generate_match_response(job_description, resume_text):
    """
    Legacy text response for the existing Flask/Jinja page.
    Keeps old routes working while React uses structured API responses.
    """
    analysis = generate_match_analysis(job_description, resume_text)

    lines = [
        f"Match Score: {analysis['score']}%",
        "",
        f"Summary: {analysis['summary']}",
        "",
        "Matches:",
        *[f"✔️ Matches: {item}" for item in analysis["matches"]],
        "",
        "Gaps:",
        *[f"❌ Missing: {item}" for item in analysis["gaps"]],
        "",
        "Recommendations:",
        *[f"→ {item}" for item in analysis["recommendations"]],
    ]

    return "\n".join(lines)


# ==========================================================
#  Routes
# ==========================================================

@app.route("/", methods=["GET", "POST"])
def index():
    match_report = None
    error = None
    job_desc_value = ""
    active_tab = "description"

    if request.method == "POST":
        try:
            job_desc_value = (request.form.get("job_desc") or "").strip()
            resume_file = request.files.get("resume_file")
            active_tab = "demo"

            if not job_desc_value or not resume_file or not resume_file.filename:
                error = "Please provide both a job description and a resume file."
            else:
                filename = secure_filename(resume_file.filename)
                filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                resume_file.save(filepath)

                resume_text = extract_text_from_file(filepath)
                match_report = generate_match_response(job_desc_value, resume_text)

        except Exception as e:
            error = f"⚠️ {str(e)}"

    return render_template(
        "index.html",
        match_report=match_report,
        error=error,
        job_desc=job_desc_value,
        demo_mode=False,
        active_tab=active_tab,
    )


@app.route("/demo", methods=["POST"])
def demo():
    try:
        job_desc_value = extract_text_from_file(SAMPLE_JOB_DESC_PATH)
        resume_text = extract_text_from_file(SAMPLE_RESUME_PATH)
        match_report = generate_match_response(job_desc_value, resume_text)

        return render_template(
            "index.html",
            match_report=match_report,
            error=None,
            job_desc=job_desc_value,
            demo_mode=True,
            active_tab="demo",
        )

    except Exception as e:
        return render_template(
            "index.html",
            match_report=None,
            error=f"⚠️ Demo failed: {str(e)}",
            job_desc="",
            demo_mode=False,
            active_tab="demo",
        )


@app.route("/api/analyze", methods=["POST"])
def analyze_api():
    try:
        job_desc_value = (request.form.get("job_desc") or "").strip()
        resume_file = request.files.get("resume_file")

        if not job_desc_value or not resume_file or not resume_file.filename:
            return jsonify(
                {"error": "Please provide both a job description and a resume file."}
            ), 400

        filename = secure_filename(resume_file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        resume_file.save(filepath)

        resume_text = extract_text_from_file(filepath)
        analysis = generate_match_analysis(job_desc_value, resume_text)

        return jsonify(
            {
                **analysis,
                "demo_mode": False,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/demo", methods=["POST"])
def demo_api():
    try:
        job_desc_value = extract_text_from_file(SAMPLE_JOB_DESC_PATH)
        resume_text = extract_text_from_file(SAMPLE_RESUME_PATH)
        analysis = generate_match_analysis(job_desc_value, resume_text)

        return jsonify(
            {
                **analysis,
                "job_desc": job_desc_value,
                "demo_mode": True,
            }
        )

    except Exception as e:
        return jsonify({"error": f"Demo failed: {str(e)}"}), 500


# ==========================================================
#  Entry Point
# ==========================================================

if __name__ == "__main__":
    print("✅ Starting Flask development server...")
    app.run(host="0.0.0.0", port=5000, debug=True)