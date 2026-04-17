from __future__ import annotations

from typing import Any, Dict, List
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class SemanticPatientSearch:
    def __init__(self, patients: List[Dict[str, Any]]) -> None:
        self.patients = patients
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.documents = [self._build_patient_profile(patient) for patient in patients]
        self.embeddings = self.model.encode(self.documents, convert_to_numpy=True)

    def _build_patient_profile(self, patient: Dict[str, Any]) -> str:
        diagnoses = ", ".join(patient.get("diagnoses", []))
        medications = ", ".join(patient.get("medications", []))
        encounters = ", ".join(patient.get("encounters", []))
        labs = ", ".join([f"{key}: {value}" for key, value in patient.get("labs", {}).items()])

        return (
            f"Patient {patient['patient_id']} named {patient['name']} is a {patient['age']}-year-old "
            f"{patient['sex']} from {patient['city']}. Race: {patient['race']}. Ethnicity: {patient['ethnicity']}. "
            f"Diagnoses: {diagnoses}. Medications: {medications}. Labs: {labs}. "
            f"Recent encounters: {encounters}. Clinical summary: {patient.get('clinical_summary', '')}"
        )

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        scores = cosine_similarity(query_embedding, self.embeddings)[0]
        ranked_indices = np.argsort(scores)[::-1][:top_k]

        return [self._format_result(index, float(scores[index]), query) for index in ranked_indices]

    def _format_result(self, index: int, score: float, query: str) -> Dict[str, Any]:
        patient = self.patients[index]
        return {
            "patient_id": patient["patient_id"],
            "name": patient["name"],
            "age": patient["age"],
            "sex": patient["sex"],
            "city": patient["city"],
            "diagnoses": patient["diagnoses"],
            "medications": patient["medications"],
            "labs": patient["labs"],
            "clinical_summary": patient["clinical_summary"],
            "similarity_score": round(score, 4),
            "match_explanation": self._explain_match(patient, query),
        }

    def _explain_match(self, patient: Dict[str, Any], query: str) -> str:
        query_terms = {term.strip(" ,.").lower() for term in query.split() if len(term.strip()) > 2}
        matched_fragments: List[str] = []

        for field in (patient.get("diagnoses", []) + patient.get("medications", [])):
            field_lower = field.lower()
            if any(term in field_lower for term in query_terms):
                matched_fragments.append(field)

        if matched_fragments:
            highlights = ", ".join(matched_fragments[:3])
            return f"Matched on related conditions or therapies including {highlights}."

        return "Matched on overall clinical context and semantic similarity across diagnoses, encounters, labs, and narrative summary."
