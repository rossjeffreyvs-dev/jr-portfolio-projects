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
    <section className="panel results-panel clinical-results-panel">
      <div className="results-header clinical-results-header">
        <div>
          <p className="section-label">Recommendation Summary</p>
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

      <div className="why-panel clinical-why-panel">
        <div className="clinical-why-copy">
          <p className="section-label">Why this decision</p>
          <h3>Evidence-based eligibility reasoning</h3>
          <p>
            {evaluation.decision_rationale ||
              "The final recommendation will appear once the reasoning stream completes."}
          </p>
        </div>

        <div className="why-grid clinical-why-metrics">
          <div>
            <strong>{evaluation.summary.matches}</strong>
            <span>Matched criteria</span>
          </div>
          <div>
            <strong>{evaluation.summary.no_matches}</strong>
            <span>Failed criteria</span>
          </div>
          <div>
            <strong>{evaluation.summary.uncertain}</strong>
            <span>Needs review</span>
          </div>
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
