"use client";

import type { Evaluation, Patient, Trial } from "@/lib/api";

type PatientEvaluationRecommendationCardProps = {
  activeTrial?: Trial;
  selectedPatient?: Patient;
  selectedEvaluation?: Evaluation;
};

function asText(value: unknown, fallback = "—") {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : fallback;
  }
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : fallback;
  }
  return String(value);
}

function getPatientField(
  patient: Patient | undefined,
  keys: string[],
  fallback = "—",
) {
  if (!patient) return fallback;

  const record = patient as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") {
      return asText(value, fallback);
    }
  }

  return fallback;
}

function getEvaluationField(
  evaluation: Evaluation | undefined,
  keys: string[],
  fallback = "—",
) {
  if (!evaluation) return fallback;

  const record = evaluation as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") {
      return asText(value, fallback);
    }
  }

  return fallback;
}

function getRecommendationBadgeClass(
  recommendation?: string,
  reviewRequired?: boolean,
) {
  if (reviewRequired) return "badge review";
  if (recommendation === "Likely Match") return "badge match";
  if (recommendation === "Not Eligible") return "badge reject";
  return "badge info";
}

export default function PatientEvaluationRecommendationCard({
  activeTrial,
  selectedPatient,
  selectedEvaluation,
}: PatientEvaluationRecommendationCardProps) {
  if (!selectedEvaluation || !selectedPatient) {
    return (
      <>
        <span className="section-label">
          Patient Evaluation and Recommendation
        </span>
        <h2 style={{ marginTop: 16, marginBottom: 12 }}>
          No evaluation selected
        </h2>
        <p style={{ margin: 0 }}>
          Choose a case from the Active Trial worklist to load patient
          evaluation details, recommendation, workflow activity, criteria, and
          audit trail.
        </p>
      </>
    );
  }

  const recommendation =
    selectedEvaluation.recommendation ||
    (selectedEvaluation.review_required ? "Requires Review" : "In Progress");

  const matchScore = getEvaluationField(
    selectedEvaluation,
    ["match_score"],
    "—",
  );

  const confidence = getEvaluationField(
    selectedEvaluation,
    ["confidence", "confidence_level"],
    "—",
  );

  const hardBlockers = getEvaluationField(
    selectedEvaluation,
    ["hard_blockers", "blockers_count"],
    "0",
  );

  const diagnosis = getPatientField(selectedPatient, ["diagnosis"]);
  const biomarkers = getPatientField(selectedPatient, [
    "biomarkers",
    "biomarker_summary",
    "molecular_profile",
  ]);

  const ecog = getPatientField(selectedPatient, ["ecog", "performance_status"]);
  const priorTherapies = getPatientField(selectedPatient, [
    "prior_therapies",
    "therapy_history",
  ]);

  const labs = getPatientField(selectedPatient, ["labs", "lab_summary"]);
  const comorbidities = getPatientField(selectedPatient, [
    "comorbidities",
    "comorbidity_summary",
  ]);

  const missingInfo = getEvaluationField(
    selectedEvaluation,
    ["missing_information", "missing_info"],
    "None",
  );

  const rationale = getEvaluationField(
    selectedEvaluation,
    ["summary", "reasoning_summary", "notes", "explanation"],
    "Supporting evidence indicates a manual review step is still required before final coordinator action.",
  );

  return (
    <>
      <span className="section-label">
        Patient Evaluation and Recommendation
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginTop: 16,
          alignItems: "flex-start",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 640px" }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            {(selectedPatient.display_name || selectedPatient.id) + " — "}
            {activeTrial?.title || "Selected Trial"}
          </h2>

          <p style={{ marginTop: 0, marginBottom: 0 }}>
            Review the recommendation, supporting patient context, and active
            trial details before moving to workflow, criteria evidence, and
            audit history.
          </p>
        </div>

        <span
          className={getRecommendationBadgeClass(
            selectedEvaluation.recommendation,
            selectedEvaluation.review_required,
          )}
        >
          {recommendation}
        </span>
      </div>

      <div
        className="dashboard-grid"
        style={{
          marginTop: 24,
          alignItems: "start",
          rowGap: 18,
        }}
      >
        <div className="col-4" style={{ minWidth: 0 }}>
          <div className="card" style={{ height: "100%" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Recommendation</h3>

            <div className="meta-list">
              <div className="meta-item">
                <strong>Status</strong>
                <span>{recommendation}</span>
              </div>

              <div className="meta-item">
                <strong>Match score</strong>
                <span>{matchScore === "—" ? "—" : `${matchScore}%`}</span>
              </div>

              <div className="meta-item">
                <strong>Confidence</strong>
                <span>{confidence}</span>
              </div>

              <div className="meta-item">
                <strong>Review required</strong>
                <span>{selectedEvaluation.review_required ? "Yes" : "No"}</span>
              </div>

              <div className="meta-item">
                <strong>Hard blockers</strong>
                <span>{hardBlockers}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4" style={{ minWidth: 0 }}>
          <div className="card" style={{ height: "100%" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>
              Selected Evaluation
            </h3>

            <div className="meta-list">
              <div className="meta-item">
                <strong>Patient</strong>
                <span>{selectedPatient.display_name || "—"}</span>
              </div>

              <div className="meta-item">
                <strong>Patient ID</strong>
                <span>{selectedPatient.id}</span>
              </div>

              <div className="meta-item">
                <strong>Diagnosis</strong>
                <span>{diagnosis}</span>
              </div>

              <div className="meta-item">
                <strong>Active trial</strong>
                <span>{activeTrial?.title || "—"}</span>
              </div>

              <div className="meta-item">
                <strong>Missing information</strong>
                <span>{missingInfo}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4" style={{ minWidth: 0 }}>
          <div className="card" style={{ height: "100%" }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>
              Supporting Context
            </h3>

            <div className="meta-list">
              <div className="meta-item">
                <strong>Biomarkers</strong>
                <span>{biomarkers}</span>
              </div>

              <div className="meta-item">
                <strong>ECOG</strong>
                <span>{ecog}</span>
              </div>

              <div className="meta-item">
                <strong>Prior therapies</strong>
                <span>{priorTherapies}</span>
              </div>

              <div className="meta-item">
                <strong>Labs</strong>
                <span>{labs}</span>
              </div>

              <div className="meta-item">
                <strong>Comorbidities</strong>
                <span>{comorbidities}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>
          Recommendation Summary
        </h3>
        <p style={{ margin: 0 }}>{rationale}</p>
      </div>
    </>
  );
}
