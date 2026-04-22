from __future__ import annotations

import math
import re
from collections import defaultdict
from typing import Dict, Iterable, List

from ..models.schemas import (
    Patient,
    SemanticQuerySuggestion,
    SemanticSearchHighlights,
    SemanticSearchResult,
    Trial,
)

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "history",
    "in",
    "is",
    "of",
    "on",
    "or",
    "patient",
    "profile",
    "relevant",
    "status",
    "that",
    "the",
    "to",
    "with",
}

FIELD_WEIGHTS = {
    "diagnosis": 4.0,
    "biomarkers": 3.5,
    "prior_therapies": 3.0,
    "notes": 2.5,
    "labs": 2.0,
    "comorbidities": 1.5,
    "demographics": 1.0,
}

TRIAL_QUERY_SUGGESTIONS: Dict[str, List[dict[str, str]]] = {
    "trial_nsclc_001": [
        {
            "id": "nsclc-metastatic",
            "label": "Metastatic NSCLC",
            "query": "metastatic NSCLC patient with good performance status",
            "category": "disease",
        },
        {
            "id": "nsclc-no-immunotherapy",
            "label": "No prior immunotherapy",
            "query": "lung cancer patient with no prior PD-1 or PD-L1 immunotherapy",
            "category": "treatment_history",
        },
        {
            "id": "nsclc-cns-imaging",
            "label": "CNS imaging context",
            "query": "non small cell lung cancer patient with current CNS imaging or brain metastasis assessment",
            "category": "general",
        },
    ],
    "trial_breast_001": [
        {
            "id": "breast-her2-low",
            "label": "HER2-low metastatic breast cancer",
            "query": "HER2-low metastatic breast cancer patient appropriate for targeted therapy",
            "category": "biomarker",
        },
        {
            "id": "breast-systemic-treatment",
            "label": "Prior systemic treatment",
            "query": "metastatic breast cancer patient with prior systemic treatment history",
            "category": "treatment_history",
        },
        {
            "id": "breast-stable-targeted",
            "label": "Clinically stable candidate",
            "query": "clinically stable breast cancer patient suitable for combination targeted therapy",
            "category": "general",
        },
    ],
    "trial_heme_001": [
        {
            "id": "heme-relapsed",
            "label": "Relapsed or refractory disease",
            "query": "relapsed hematologic malignancy patient after prior standard therapy",
            "category": "disease",
        },
        {
            "id": "heme-cell-therapy",
            "label": "Cell therapy workup candidate",
            "query": "hematology patient stable enough for intensive cell therapy evaluation",
            "category": "general",
        },
        {
            "id": "heme-prior-therapy",
            "label": "Multiple prior therapies",
            "query": "refractory hematologic cancer patient with prior treatment history",
            "category": "treatment_history",
        },
    ],
}

SYNONYM_GROUPS = {
    "nsclc": {"nsclc", "non-small", "non", "small", "cell", "lung", "thoracic"},
    "metastatic": {"metastatic", "stage", "advanced"},
    "immunotherapy": {"immunotherapy", "pd-1", "pd1", "pd-l1", "pdl1", "checkpoint", "pembrolizumab"},
    "breast": {"breast", "her2", "her2-low", "triple", "negative", "er-positive", "hormone-positive"},
    "heme": {"hematologic", "hematology", "leukemia", "lymphoma", "myeloma", "aml", "cll"},
    "performance": {"ecog", "performance", "fit", "stable"},
    "cell_therapy": {"cell", "therapy", "intensive", "workup"},
    "renal": {"creatinine", "clearance", "kidney", "renal"},
}


def tokenize(text: str) -> List[str]:
    normalized = re.sub(r"[^a-zA-Z0-9\-\+ ]+", " ", text.lower())
    parts = [part.strip() for part in normalized.split() if part.strip()]
    return [part for part in parts if part not in STOPWORDS]


def expand_query_terms(query: str) -> List[str]:
    terms = tokenize(query)
    expanded = set(terms)
    for term in list(terms):
        for values in SYNONYM_GROUPS.values():
            if term in values:
                expanded.update(values)
    return list(expanded)


def patient_profile(patient: Patient) -> Dict[str, List[str]]:
    return {
        "diagnosis": patient.diagnosis or [],
        "biomarkers": patient.biomarkers or [],
        "prior_therapies": patient.prior_therapies or [],
        "comorbidities": patient.comorbidities or [],
        "notes": patient.notes or [],
        "labs": [f"{key} {value}" for key, value in (patient.labs or {}).items()],
        "demographics": [
            patient.sex or "",
            str(patient.age) if patient.age is not None else "",
            f"ecog {patient.ecog}" if patient.ecog else "",
        ],
    }


def text_matches_terms(text: str, terms: Iterable[str]) -> List[str]:
    haystack = text.lower()
    matches: List[str] = []
    for term in terms:
        if term and term in haystack:
            matches.append(term)
    return matches


def calculate_similarity_score(patient: Patient, trial: Trial, query: str) -> tuple[float, dict[str, list[str]], list[str]]:
    profile = patient_profile(patient)
    query_terms = expand_query_terms(query)
    matched_fields: dict[str, list[str]] = defaultdict(list)

    weighted_sum = 0.0
    max_possible = 0.0

    for field_name, values in profile.items():
        weight = FIELD_WEIGHTS.get(field_name, 1.0)
        max_possible += weight

        field_hits: list[str] = []
        for value in values:
            field_hits.extend(text_matches_terms(value, query_terms))

        if field_hits:
            deduped_hits = sorted(set(field_hits))
            matched_fields[field_name] = deduped_hits
            weighted_sum += weight

    trial_context = " ".join(
        [
            trial.indication,
            " ".join(trial.key_inclusion),
            " ".join(trial.exclusions),
            " ".join(trial.performance),
        ]
    )
    trial_term_hits = text_matches_terms(trial_context, query_terms)
    if trial_term_hits:
        weighted_sum += 0.75
        max_possible += 0.75

    if patient.seeded_outcome == "Likely Match":
        weighted_sum += 0.4
        max_possible += 0.4
    elif patient.seeded_outcome == "Requires Review":
        weighted_sum += 0.2
        max_possible += 0.4
    else:
        max_possible += 0.4

    similarity = weighted_sum / max_possible if max_possible else 0.0
    return similarity, matched_fields, sorted(set(query_terms))


def build_highlights(patient: Patient, matched_fields: dict[str, list[str]]) -> SemanticSearchHighlights:
    profile = patient_profile(patient)

    def clip(field_name: str) -> list[str]:
        values = profile.get(field_name, [])
        if not values:
            return []
        return values[:3]

    return SemanticSearchHighlights(
        diagnosis=clip("diagnosis") if "diagnosis" in matched_fields else [],
        biomarkers=clip("biomarkers") if "biomarkers" in matched_fields else [],
        prior_therapies=clip("prior_therapies") if "prior_therapies" in matched_fields else [],
        comorbidities=clip("comorbidities") if "comorbidities" in matched_fields else [],
        notes=clip("notes") if "notes" in matched_fields else [],
        labs=clip("labs") if "labs" in matched_fields else [],
    )


def build_explanation(
    patient: Patient,
    trial: Trial,
    matched_fields: dict[str, list[str]],
) -> str:
    parts: List[str] = []

    if matched_fields.get("diagnosis"):
        parts.append(f"diagnosis context aligns with {patient.diagnosis[0]}")
    if matched_fields.get("biomarkers") and patient.biomarkers:
        parts.append(f"biomarker context includes {patient.biomarkers[0]}")
    if matched_fields.get("prior_therapies") and patient.prior_therapies:
        parts.append(f"prior therapy history includes {patient.prior_therapies[0]}")
    if matched_fields.get("notes") and patient.notes:
        parts.append(f"clinical notes mention {patient.notes[0].rstrip('.')}")
    if matched_fields.get("comorbidities") and patient.comorbidities:
        parts.append(f"comorbidity context includes {patient.comorbidities[0]}")
    if matched_fields.get("labs") and patient.labs:
        first_lab_key = next(iter(patient.labs.keys()))
        parts.append(f"lab profile includes {first_lab_key.replace('_', ' ')} data")

    if not parts:
        parts.append(f"general patient profile overlaps with the active trial context for {trial.indication.lower()}")

    sentence = "Matched because " + ", ".join(parts[:3]) + "."
    return sentence[0].upper() + sentence[1:]


def normalize_score(similarity: float) -> int:
    return max(0, min(100, int(math.floor(similarity * 100))))


def get_semantic_query_suggestions(trial: Trial) -> List[SemanticQuerySuggestion]:
    raw_items = TRIAL_QUERY_SUGGESTIONS.get(trial.id)
    if raw_items:
        return [SemanticQuerySuggestion.model_validate(item) for item in raw_items]

    fallback = [
        {
            "id": f"{trial.id}-general-1",
            "label": "Diagnosis-aligned patient",
            "query": f"{trial.indication} patient appropriate for this clinical trial",
            "category": "general",
        },
        {
            "id": f"{trial.id}-general-2",
            "label": "Prior treatment history",
            "query": f"patient with treatment history relevant to {trial.indication}",
            "category": "treatment_history",
        },
    ]
    return [SemanticQuerySuggestion.model_validate(item) for item in fallback]


def rank_patients_for_query(
    *,
    trial: Trial,
    patients: List[Patient],
    query: str,
    top_k: int = 10,
) -> List[SemanticSearchResult]:
    scored_results: List[SemanticSearchResult] = []

    for patient in patients:
        similarity, matched_fields, query_terms = calculate_similarity_score(patient, trial, query)
        if similarity <= 0:
            continue

        explanation = build_explanation(patient, trial, matched_fields)
        highlights = build_highlights(patient, matched_fields)
        matched_terms = sorted(
            {
                term
                for field_terms in matched_fields.values()
                for term in field_terms
                if term in query_terms
            }
        )

        scored_results.append(
            SemanticSearchResult(
                patient_id=patient.id,
                score=normalize_score(similarity),
                similarity=round(similarity, 4),
                rank=0,
                explanation=explanation,
                matched_terms=matched_terms[:8],
                highlights=highlights,
                patient=patient,
            )
        )

    scored_results.sort(
        key=lambda item: (
            -item.similarity,
            -item.patient.seeded_score,
            item.patient.display_name,
        )
    )

    for index, item in enumerate(scored_results[:top_k], start=1):
        item.rank = index

    return scored_results[:top_k]