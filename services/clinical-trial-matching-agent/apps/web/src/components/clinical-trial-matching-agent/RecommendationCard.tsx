import type { Evaluation } from "@/lib/api";

type RecommendationCardProps = {
  selectedEvaluation?: Evaluation;
};

export default function RecommendationCard({
  selectedEvaluation,
}: RecommendationCardProps) {
  return (
    <article className="card col-4">
      <span className="section-label">C. Recommendation</span>
      <h2>
        {selectedEvaluation?.recommendation || "No recommendation loaded"}
      </h2>

      <div className="stat-row">
        <div className="stat-box">
          <div className="eyebrow">Match Score</div>
          <strong className="stat-emphasis">
            {selectedEvaluation?.match_score ?? "—"}%
          </strong>
        </div>

        <div className="stat-box">
          <div className="eyebrow">Confidence</div>
          <strong className="stat-emphasis">
            {selectedEvaluation?.confidence || "—"}
          </strong>
        </div>

        <div className="stat-box">
          <div className="eyebrow">Review Required</div>
          <span
            className={
              selectedEvaluation?.review_required
                ? "badge review"
                : "badge match"
            }
          >
            {selectedEvaluation?.review_required ? "Yes" : "No"}
          </span>
        </div>

        <div className="stat-box">
          <div className="eyebrow">Hard Blockers</div>
          <strong className="stat-copy">
            {selectedEvaluation?.blockers.length
              ? selectedEvaluation.blockers.length
              : 0}
          </strong>
        </div>
      </div>
    </article>
  );
}
