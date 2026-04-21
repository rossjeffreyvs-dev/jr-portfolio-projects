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
  onReviewCase: (evaluationId: string) => void;
};

type WorklistMenuProps = {
  evaluationId: string;
  onRemove: (evaluationId: string) => void;
};

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
    <div
      ref={menuRef}
      className="queue-menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="queue-menu-trigger"
        aria-label="Open worklist menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        …
      </button>

      {isOpen && (
        <div className="queue-menu-popover">
          <button
            type="button"
            className="queue-menu-item queue-menu-item-danger"
            onClick={() => {
              onRemove(evaluationId);
              setIsOpen(false);
            }}
          >
            Remove from Worklist
          </button>
        </div>
      )}
    </div>
  );
}

export default function TrialWorklist({
  evaluations,
  patients,
  reviewCards,
  selectedEvaluationId,
  onSelectEvaluation,
  onReviewCase,
}: TrialWorklistProps) {
  function handleRemoveFromWorklist(evaluationId: string) {
    console.log("remove from worklist", { evaluationId });
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

        const hasReviewTask = reviewCards.some(
          (review) => review.patient_id === evaluation.patient_id,
        );

        const requiresReview = evaluation.review_required || hasReviewTask;

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
                onSelectEvaluation(evaluation.id);
              }
            }}
          >
            <div className="queue-top-row">
              <div className="queue-top-meta">
                <div className="queue-patient-id">{evaluation.patient_id}</div>
                <div className="eyebrow queue-match-inline">
                  Match score: {evaluation.match_score}%
                </div>
              </div>

              <div className="queue-top-actions">
                <span className={statusClass(evaluation.recommendation)}>
                  {evaluation.recommendation}
                </span>

                <WorklistMenu
                  evaluationId={evaluation.id}
                  onRemove={handleRemoveFromWorklist}
                />
              </div>
            </div>

            <h3>{patient?.diagnosis?.[0] || "Diagnosis unavailable"}</h3>

            <p className="queue-note">{evaluation.explanation}</p>

            <div className="queue-cta-row">
              <button
                type="button"
                className={`queue-cta-btn ${
                  requiresReview ? "queue-cta-review" : "queue-cta-secondary"
                }`}
                onClick={(event) => {
                  event.stopPropagation();

                  if (requiresReview) {
                    onReviewCase(evaluation.id);
                  } else {
                    onSelectEvaluation(evaluation.id);
                  }
                }}
              >
                {requiresReview ? "Review Case →" : "View Evaluation →"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
