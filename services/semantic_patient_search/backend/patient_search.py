from __future__ import annotations

import math
from typing import Any, Dict, List, Optional

from openai import OpenAI


from openai import OpenAI, OpenAIError
import os

class SemanticPatientSearch:
    def __init__(self, patients, embedding_model="text-embedding-3-small", client=None):
        self.patients = patients
        self.embedding_model = embedding_model

        api_key = os.getenv("OPENAI_API_KEY")
        if client is None and not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. Load api_keys.env or export the key before starting semantic_patient_search."
            )

        self.client = client or OpenAI(api_key=api_key)
        
        self.documents = [self._build_patient_profile(patient) for patient in patients]
        self.embeddings = self._embed_texts(self.documents)

    def _build_patient_profile(self, patient: Dict[str, Any]) -> str:
        diagnoses = ", ".join(patient.get("diagnoses", []))
        medications = ", ".join(patient.get("medications", []))
        encounters = ", ".join(patient.get("encounters", []))
        labs = ", ".join(
            [f"{key}: {value}" for key, value in patient.get("labs", {}).items()]
        )

        return (
            f"Patient {patient['patient_id']} named {patient['name']} is a "
            f"{patient['age']}-year-old {patient['sex']} from {patient['city']}. "
            f"Race: {patient['race']}. Ethnicity: {patient['ethnicity']}. "
            f"Diagnoses: {diagnoses}. Medications: {medications}. Labs: {labs}. "
            f"Recent encounters: {encounters}. "
            f"Clinical summary: {patient.get('clinical_summary', '')}"
        )

    def _embed_texts(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []

        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=texts,
        )
        return [item.embedding for item in response.data]

    def _embed_query(self, query: str) -> List[float]:
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=[query],
        )
        return response.data[0].embedding

    @staticmethod
    def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        return dot_product / (norm_a * norm_b)

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        query_embedding = self._embed_query(query)

        scored_results = [
            (index, self._cosine_similarity(query_embedding, embedding))
            for index, embedding in enumerate(self.embeddings)
        ]

        ranked = sorted(scored_results, key=lambda item: item[1], reverse=True)[:top_k]

        return [
            self._format_result(index, float(score), query)
            for index, score in ranked
        ]

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
        query_terms = {
            term.strip(" ,.").lower()
            for term in query.split()
            if len(term.strip(" ,.")) > 2
        }
        matched_fragments: List[str] = []

        for field in (patient.get("diagnoses", []) + patient.get("medications", [])):
            field_lower = field.lower()
            if any(term in field_lower for term in query_terms):
                matched_fragments.append(field)

        if matched_fragments:
            highlights = ", ".join(matched_fragments[:3])
            return (
                "Matched on related conditions or therapies including "
                f"{highlights}."
            )

        return (
            "Matched on overall clinical context and semantic similarity across "
            "diagnoses, encounters, labs, and narrative summary."
        )