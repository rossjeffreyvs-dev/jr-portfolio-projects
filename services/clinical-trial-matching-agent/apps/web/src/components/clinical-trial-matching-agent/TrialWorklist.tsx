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

export default function TrialWorklist({
  evaluations,
  patients,
  reviewCards,
  selectedEvaluationId,
  onSelectEvaluation,
  onReviewCase,
}: TrialWorklistProps) {
  return (
    <section className="card">
      <div className="section-header">
        <div>
          <span className="section-label">B. Trial Worklist</span>
          <h2>Queued evaluations for the active trial</h2>
          <p>
            Select a card to update the case summary, recommendation, workflow
            activity, audit trail, and supporting context below.
          </p>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-base font-semibold text-slate-900">
            No evaluations yet for this trial
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Use Find Patients for Trial to open the candidate list and start a
            new evaluation.
          </p>
        </div>
      ) : (
        <div className="queue-grid">
          {evaluations.map((evaluation, index) => {
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
                  <div className="eyebrow">
                    Rank #{index + 1} •{" "}
                    {patient?.display_name || evaluation.patient_id}
                  </div>

                  <span className={statusClass(evaluation.recommendation)}>
                    {evaluation.recommendation}
                  </span>
                </div>

                <h3>{patient?.diagnosis?.[0] || "Diagnosis unavailable"}</h3>

                <p className="queue-note">{evaluation.explanation}</p>

                <div className="queue-footer">
                  <div>
                    <div className="eyebrow">Match Score</div>
                    <strong className="queue-score">
                      {evaluation.match_score}%
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected && <span className="badge info">Selected</span>}

                    {requiresReview ? (
                      <span className="badge review">Review Needed</span>
                    ) : (
                      <span className="badge match">Ready</span>
                    )}
                  </div>

                  <button
                    className="text-btn"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation(); // 🔥 critical

                      if (requiresReview) {
                        onReviewCase(evaluation.id);
                      } else {
                        onSelectEvaluation(evaluation.id);
                      }
                    }}
                  >
                    {requiresReview ? "Review Case" : "Show Evaluation Process"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
