import type { Evaluation } from "../types";
import { formatRecommendation, formatResult } from "../utils";

type EvaluationResultsProps = {
  evaluation: Evaluation | null;
};

export default function EvaluationResults({
  evaluation,
}: EvaluationResultsProps) {
  if (!evaluation || evaluation.results.length === 0) {
    return null;
  }

  return (
    <section className="panel results-panel">
      <div className="results-header">
        <div>
          <p className="eyebrow">Recommendation Summary</p>
          <h2>{formatRecommendation(evaluation.recommendation)}</h2>
          <p>
            {evaluation.summary.matches} matched ·{" "}
            {evaluation.summary.no_matches} failed ·{" "}
            {evaluation.summary.uncertain} uncertain
          </p>
        </div>

        <div className={`recommendation-badge ${evaluation.recommendation}`}>
          {formatRecommendation(evaluation.recommendation)}
        </div>
      </div>

      <div className="why-panel">
        <div>
          <p className="eyebrow">Why this decision?</p>
          <h3>Evidence-based eligibility reasoning</h3>
          <p>
            {evaluation.decision_rationale ||
              "The final recommendation will appear once the reasoning stream completes."}
          </p>
        </div>

        <div className="why-grid">
          <div>
            <strong>{evaluation.summary.matches}</strong>
            <span>Criteria matched patient evidence</span>
          </div>
          <div>
            <strong>{evaluation.summary.no_matches}</strong>
            <span>Criteria failed against patient evidence</span>
          </div>
          <div>
            <strong>{evaluation.summary.uncertain}</strong>
            <span>Criteria require human review</span>
          </div>
        </div>
      </div>

      <div className="summary-metrics">
        <div>
          <strong>{evaluation.summary.matches}</strong>
          <span>Matched</span>
        </div>
        <div>
          <strong>{evaluation.summary.no_matches}</strong>
          <span>Failed</span>
        </div>
        <div>
          <strong>{evaluation.summary.uncertain}</strong>
          <span>Uncertain</span>
        </div>
        <div>
          <strong>{evaluation.summary.total}</strong>
          <span>Total criteria</span>
        </div>
      </div>

      <div className="criterion-list">
        {evaluation.results.map((result, index) => (
          <article
            className="criterion-card"
            key={`${result.criterion}-${index}`}
          >
            <div className="criterion-heading">
              <div>
                <span className="criterion-category">
                  {result.category || "Eligibility Criterion"}
                </span>
                <strong>{result.criterion}</strong>
              </div>
              <span className={`status-pill ${result.result}`}>
                {formatResult(result.result)}
              </span>
            </div>

            <p>{result.rationale}</p>

            {result.evidence && result.evidence.length > 0 && (
              <div className="evidence-list">
                <strong>Supporting evidence</strong>
                {result.evidence.map((item) => (
                  <div className="evidence-row" key={item}>
                    <span>•</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="confidence-row">
              <span>Confidence: {Math.round(result.confidence * 100)}%</span>
              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{
                    width: `${Math.round(result.confidence * 100)}%`,
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
