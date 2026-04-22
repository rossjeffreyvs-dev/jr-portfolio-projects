"use client";

import { useEffect, useRef, useState } from "react";

import type { Evaluation, Patient, ReviewTask } from "@/lib/api";
import { statusClass } from "./dashboardUtils";

type TrialWorklistProps = {
  evaluations: Evaluation[];
  patients: Patient[];
  reviewCards: ReviewTask[];
  selectedEvaluationId?: string;
  onSelectEvaluation: (evaluationId: string) => void;
  onRemoveEvaluation: (evaluationId: string) => void;
};

type WorklistMenuProps = {
  evaluationId: string;
  onRemove: (evaluationId: string) => void;
};

function normalizeToken(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

function getRecommendationLabel(
  evaluation: Evaluation,
  requiresReview: boolean,
): string {
  if (requiresReview) {
    return "Requires Review";
  }

  return evaluation.recommendation || "Evaluation Ready";
}

function getViewEvaluationButtonClassName(requiresReview: boolean) {
  return [
    "queue-cta-btn",
    requiresReview ? "queue-cta-review" : "queue-cta-secondary",
  ].join(" ");
}

function WorklistMenu({ evaluationId, onRemove }: WorklistMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="queue-menu" ref={menuRef}>
      <button
        type="button"
        className="queue-menu-trigger"
        aria-label="Open worklist actions"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        …
      </button>

      {isOpen ? (
        <div className="queue-menu-popover">
          <button
            type="button"
            className="queue-menu-item queue-menu-item-danger"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(evaluationId);
              setIsOpen(false);
            }}
          >
            Remove from Worklist
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function TrialWorklist({
  evaluations,
  patients,
  reviewCards,
  selectedEvaluationId,
  onSelectEvaluation,
  onRemoveEvaluation,
}: TrialWorklistProps) {
  function handleRemoveFromWorklist(evaluationId: string) {
    onRemoveEvaluation(evaluationId);
  }

  if (evaluations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-900">
          No evaluations yet for this trial
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Use Find Patients for Trial to open the candidate list and start a new
          evaluation.
        </p>
      </div>
    );
  }

  return (
    <div className="queue-grid">
      {evaluations.map((evaluation) => {
        const patient = patients.find(
          (item) => item.id === evaluation.patient_id,
        );

        const isSelected = evaluation.id === selectedEvaluationId;

        const hasReviewTask = reviewCards.some((review) => {
          const reviewStatus = normalizeToken(
            (review as { status?: string }).status,
          );

          return (
            review.patient_id === evaluation.patient_id &&
            ![
              "approved",
              "resolved",
              "closed",
              "completed",
              "dismissed",
            ].includes(reviewStatus)
          );
        });

        const recommendationToken = normalizeToken(evaluation.recommendation);

        const requiresReview =
          Boolean(evaluation.review_required) ||
          hasReviewTask ||
          [
            "requires_review",
            "review_required",
            "needs_review",
            "manual_review",
            "indeterminate",
            "borderline",
          ].includes(recommendationToken);

        const recommendationLabel = getRecommendationLabel(
          evaluation,
          requiresReview,
        );

        return (
          <article
            key={evaluation.id}
            className={`queue-card queue-card-button ${
              isSelected ? "selected" : ""
            }`}
            onClick={() => onSelectEvaluation(evaluation.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectEvaluation(evaluation.id);
              }
            }}
          >
            <div className="queue-top-row">
              <div className="queue-top-meta">
                <p className="queue-patient-id">
                  {patient?.display_name ||
                    patient?.id ||
                    evaluation.patient_id}
                </p>
                <p className="queue-match-inline">
                  MATCH SCORE: {evaluation.match_score}%
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <span className={statusClass(recommendationLabel)}>
                  {recommendationLabel}
                </span>

                <WorklistMenu
                  evaluationId={evaluation.id}
                  onRemove={handleRemoveFromWorklist}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                {patient?.diagnosis?.[0] || "Diagnosis unavailable"}
              </h3>

              <p
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: "var(--muted)",
                }}
              >
                {evaluation.explanation}
              </p>
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: 18,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className={getViewEvaluationButtonClassName(requiresReview)}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectEvaluation(evaluation.id);
                }}
              >
                View Evaluation <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
