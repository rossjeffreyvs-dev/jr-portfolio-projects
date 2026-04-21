"use client";

import type { Evaluation, Patient, Trial } from "@/lib/api";

type PatientEvaluationRecommendationCardProps = {
  activeTrial?: Trial;
  selectedPatient?: Patient;
  selectedEvaluation?: Evaluation;
  onReviewCase?: (evaluationId: string) => void;
  isEvaluationInProgress?: boolean;
  showFinalRecommendation?: boolean;
};

function asText(value: unknown, fallback = "—") {
  if (value === null || value === undefined) return fallback;

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : fallback;
  }

  if (typeof value === "string") {
    return value.trim().length > 0 ? value : fallback;
  }

  if (typeof value === "object") {
    return fallback;
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
  isEvaluationInProgress?: boolean,
) {
  if (isEvaluationInProgress) return "badge info";
  if (reviewRequired) return "badge review";
  if (recommendation === "Likely Match") return "badge match";
  if (recommendation === "Not Eligible") return "badge reject";
  return "badge info";
}

export default function PatientEvaluationRecommendationCard({
  activeTrial,
  selectedPatient,
  selectedEvaluation,
  onReviewCase,
  isEvaluationInProgress = false,
  showFinalRecommendation = true,
}: PatientEvaluationRecommendationCardProps) {
  if (!selectedEvaluation || !selectedPatient) {
    return (
      <>
        <span className="section-label">
          Patient Evaluation and Recommendation
        </span>

        <h2 style={{ marginTop: 16 }}>No evaluation selected</h2>

        <p style={{ marginTop: 8 }}>
          Choose a case from the Active Trial worklist to load patient
          evaluation details, recommendation, workflow activity, criteria, and
          audit trail.
        </p>
      </>
    );
  }

  const shouldShowLiveState =
    isEvaluationInProgress && !showFinalRecommendation;

  const recommendation = shouldShowLiveState
    ? "Running Evaluation"
    : selectedEvaluation.recommendation ||
      (selectedEvaluation.review_required ? "Requires Review" : "In Progress");

  const matchScore = shouldShowLiveState
    ? "—"
    : getEvaluationField(selectedEvaluation, ["match_score"], "—");

  const confidence = shouldShowLiveState
    ? "—"
    : getEvaluationField(
        selectedEvaluation,
        ["confidence", "confidence_level"],
        "—",
      );

  const hardBlockers = shouldShowLiveState
    ? "—"
    : getEvaluationField(
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

  const missingInfo = shouldShowLiveState
    ? "Assessing patient context and protocol criteria"
    : getEvaluationField(
        selectedEvaluation,
        ["missing_information", "missing_info"],
        "None",
      );

  const rationale = shouldShowLiveState
    ? "Eligibility evaluation in progress. Building recommendation from patient context, biomarkers, labs, prior therapies, and protocol criteria."
    : getEvaluationField(
        selectedEvaluation,
        ["summary", "reasoning_summary", "notes", "explanation"],
        "Supporting evidence indicates a manual review step is still required before final coordinator action.",
      );

  const shouldShowReviewCase =
    !shouldShowLiveState &&
    (Boolean(selectedEvaluation.review_required) ||
      recommendation === "Requires Review");

  return (
    <>
      <span className="section-label">
        Patient Evaluation and Recommendation
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 10 }}>
            {(selectedPatient.display_name || selectedPatient.id) + " — "}
            {activeTrial?.title || "Selected Trial"}
          </h2>

          <p style={{ marginTop: 0 }}>
            Review the recommendation, supporting patient context, and active
            trial details before moving to workflow, criteria evidence, and
            audit history.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            className={getRecommendationBadgeClass(
              recommendation,
              selectedEvaluation.review_required,
              shouldShowLiveState,
            )}
          >
            {recommendation}
          </span>

          {shouldShowReviewCase ? (
            <button
              type="button"
              className="primary-btn small"
              onClick={() => onReviewCase?.(selectedEvaluation.id)}
            >
              Review Case
            </button>
          ) : null}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        <section className="cardish col-4">
          <h3 style={{ marginTop: 0 }}>Selected Evaluation</h3>

          <div className="meta-list">
            <div className="meta-item">
              <strong>Patient</strong>
              <span>{selectedPatient.display_name || "—"}</span>
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
        </section>

        <section className="cardish col-4">
          <h3 style={{ marginTop: 0 }}>Recommendation</h3>

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
              <span>
                {shouldShowLiveState
                  ? "Pending"
                  : selectedEvaluation.review_required
                    ? "Yes"
                    : "No"}
              </span>
            </div>

            <div className="meta-item">
              <strong>Hard blockers</strong>
              <span>{hardBlockers}</span>
            </div>
          </div>
        </section>

        <section className="cardish col-4">
          <h3 style={{ marginTop: 0 }}>Supporting Context</h3>

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
        </section>
      </div>

      <section className="cardish" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Recommendation Summary</h3>
        <p style={{ marginTop: 8, marginBottom: 0 }}>{rationale}</p>
      </section>
    </>
  );
}
