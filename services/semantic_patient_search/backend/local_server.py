from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from .sample_data import SAMPLE_PATIENTS
from .patient_search import SemanticPatientSearch

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

search_engine = SemanticPatientSearch(SAMPLE_PATIENTS)


@app.get("/api/health")
def health() -> tuple:
    return jsonify({"status": "ok", "patients_indexed": len(SAMPLE_PATIENTS)}), 200


@app.get("/api/sample-queries")
def sample_queries() -> tuple:
    return jsonify(
        {
            "queries": [
                "middle-aged diabetic patient with declining kidney function",
                "elderly patient with repeated ED visits and heart failure",
                "breast cancer patient receiving immunotherapy",
                "patient with poor glycemic control and foot ulcer",
            ]
        }
    ), 200


@app.post("/api/search")
def search() -> tuple:
    payload = request.get_json(silent=True) or {}
    query = str(payload.get("query", "")).strip()
    top_k = int(payload.get("top_k", 5))

    if not query:
        return jsonify({"error": "Query is required."}), 400

    results = search_engine.search(query=query, top_k=top_k)
    return jsonify({"query": query, "count": len(results), "results": results}), 200


@app.get("/")
def serve_index():
    static_dir = Path(app.static_folder or "static")
    index_file = static_dir / "index.html"
    if index_file.exists():
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({"message": "Semantic Patient Search API is running."})


@app.get("/<path:path>")
def serve_static(path: str):
    static_dir = Path(app.static_folder or "static")
    file_path = static_dir / path
    if file_path.exists() and file_path.is_file():
        return send_from_directory(app.static_folder, path)
    index_file = static_dir / "index.html"
    if index_file.exists():
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
