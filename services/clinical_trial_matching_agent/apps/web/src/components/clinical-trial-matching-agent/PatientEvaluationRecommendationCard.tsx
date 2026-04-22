"use client";

import { useEffect, useState } from "react";
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

function firstNonEmpty(
  items: Array<string | undefined | null>,
  fallback: string,
) {
  for (const item of items) {
    if (item && item.trim()) return item;
  }
  return fallback;
}

function joinList(items: string[] | undefined, fallback: string) {
  return items && items.length > 0 ? items.join("; ") : fallback;
}

const FINAL_REVEAL_DELAY_MS = 140;
const PULSE_DURATION_MS = 1800;

export default function PatientEvaluationRecommendationCard({
  activeTrial,
  selectedPatient,
  selectedEvaluation,
  onReviewCase,
  isEvaluationInProgress = false,
  showFinalRecommendation = true,
}: PatientEvaluationRecommendationCardProps) {
  const [isFinalContentVisible, setIsFinalContentVisible] = useState(
    showFinalRecommendation,
  );
  const [shouldPulseStatus, setShouldPulseStatus] = useState(false);

  useEffect(() => {
    if (!showFinalRecommendation) {
      setIsFinalContentVisible(false);
      setShouldPulseStatus(false);
      return;
    }

    const revealTimer = window.setTimeout(() => {
      setIsFinalContentVisible(true);
      setShouldPulseStatus(true);
    }, FINAL_REVEAL_DELAY_MS);

    const pulseTimer = window.setTimeout(() => {
      setShouldPulseStatus(false);
    }, FINAL_REVEAL_DELAY_MS + PULSE_DURATION_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(pulseTimer);
    };
  }, [showFinalRecommendation, selectedEvaluation?.id]);

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

  const whyThisDecision = shouldShowLiveState
    ? "Building the recommendation from patient context, biomarkers, labs, prior therapies, and protocol criteria."
    : firstNonEmpty(
        [
          selectedEvaluation.explanation,
          getEvaluationField(
            selectedEvaluation,
            ["summary", "reasoning_summary", "notes"],
            "",
          ),
        ],
        "Recommendation logic is being assembled from the available patient and protocol evidence.",
      );

  const blockers =
    (selectedEvaluation as unknown as { blockers?: string[] }).blockers || [];
  const reviewReasons =
    (selectedEvaluation as unknown as { review_reason?: string[] })
      .review_reason || [];
  const missingItems =
    (selectedEvaluation as unknown as { missing_information?: string[] })
      .missing_information || [];

  const primaryRiskOrUncertainty = shouldShowLiveState
    ? "Checking for exclusion criteria, review triggers, and missing source documentation."
    : firstNonEmpty(
        [
          blockers[0],
          reviewReasons[0],
          missingItems[0],
          selectedEvaluation.review_required
            ? "Coordinator review is required before final action."
            : undefined,
        ],
        recommendation === "Likely Match"
          ? "No major risk factor is currently driving this recommendation."
          : "No additional uncertainty was identified beyond the available supporting evidence.",
      );

  const whatWouldChangeThisDecision = shouldShowLiveState
    ? "Final recommendation will update after workflow review, evidence scoring, and protocol checks complete."
    : firstNonEmpty(
        [
          missingItems.length > 0
            ? `Confirming ${joinList(
                missingItems,
                "required source documentation",
              )} could change the recommendation.`
            : undefined,
          reviewReasons.length > 0
            ? `Resolving ${joinList(
                reviewReasons,
                "the flagged review items",
              )} could change the recommendation.`
            : undefined,
          blockers.length > 0
            ? `This decision would likely change only if ${joinList(
                blockers,
                "the current blocker",
              )} is resolved.`
            : undefined,
        ],
        recommendation === "Likely Match"
          ? "A conflicting exclusion, missing documentation, or new clinical concern would be most likely to change this decision."
          : "Additional clarifying evidence or protocol review would be most likely to change this decision.",
      );

  const shouldShowReviewCase =
    !shouldShowLiveState &&
    isFinalContentVisible &&
    (Boolean(selectedEvaluation.review_required) ||
      recommendation === "Requires Review");

  const finalContentStyle = {
    opacity: shouldShowLiveState ? 1 : isFinalContentVisible ? 1 : 0,
    transform: shouldShowLiveState
      ? "translateY(0)"
      : isFinalContentVisible
        ? "translateY(0)"
        : "translateY(6px)",
    transition: "opacity 420ms ease, transform 420ms ease",
  } as const;

  const statusBadgeStyle = shouldPulseStatus
    ? {
        transform: "scale(1.04)",
        boxShadow: "0 0 0 8px rgba(49, 88, 201, 0.08)",
        transition: "transform 500ms ease, box-shadow 500ms ease",
      }
    : {
        transform: "scale(1)",
        boxShadow: "0 0 0 0 rgba(49, 88, 201, 0)",
        transition: "transform 500ms ease, box-shadow 500ms ease",
      };

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
            style={statusBadgeStyle}
          >
            {recommendation}
          </span>

          {shouldShowReviewCase ? (
            <button
              type="button"
              className="primary-btn small"
              onClick={() => onReviewCase?.(selectedEvaluation.id)}
              style={finalContentStyle}
            >
              Review Case
            </button>
          ) : null}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        <section className="cardish col-4" style={finalContentStyle}>
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

        <section className="cardish col-4" style={finalContentStyle}>
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

        <section className="cardish col-4" style={finalContentStyle}>
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

      <section
        className="cardish"
        style={{ marginTop: 18, ...finalContentStyle }}
      >
        <h3 style={{ marginTop: 0 }}>Recommendation Summary</h3>

        {shouldShowLiveState ? (
          <div className="workflow-list" style={{ marginTop: 12 }}>
            <div className="workflow-item">
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">Why this decision</strong>
                <div className="workflow-detail">{whyThisDecision}</div>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">
                  Primary risk or uncertainty
                </strong>
                <div className="workflow-detail">
                  {primaryRiskOrUncertainty}
                </div>
              </div>
            </div>

            <div
              className="workflow-item"
              style={{ borderBottom: "none", paddingBottom: 0 }}
            >
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">
                  What would change this decision
                </strong>
                <div className="workflow-detail">
                  {whatWouldChangeThisDecision}
                </div>
              </div>
            </div>
          </div>
        ) : isFinalContentVisible ? (
          <div className="workflow-list" style={{ marginTop: 12 }}>
            <div className="workflow-item">
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">Why this decision</strong>
                <div className="workflow-detail">{whyThisDecision}</div>
              </div>
            </div>

            <div className="workflow-item">
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">
                  Primary risk or uncertainty
                </strong>
                <div className="workflow-detail">
                  {primaryRiskOrUncertainty}
                </div>
              </div>
            </div>

            <div
              className="workflow-item"
              style={{ borderBottom: "none", paddingBottom: 0 }}
            >
              <div className="workflow-dot" />
              <div>
                <strong className="workflow-title">
                  What would change this decision
                </strong>
                <div className="workflow-detail">
                  {whatWouldChangeThisDecision}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: "var(--muted)",
              fontWeight: 600,
            }}
          >
            Building structured recommendation summary…
          </p>
        )}
      </section>
    </>
  );
}
