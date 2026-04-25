"use client";

type LifecycleSummary = {
  trial_profile: {
    title: string;
    buyer: string;
    user: string;
    value_per_converted_patient: number;
    requested_patient_profile: {
      diagnosis: string;
      key_inclusion: string[];
      performance: string[];
      exclusions: string[];
    };
  };
  funnel: {
    prospects: number;
    qualified: number;
    evaluated: number;
    in_review: number;
    converted: number;
    potential_value: number;
    realized_value: number;
    leakage_value: number;
  };
  review_queue: {
    review_id: string;
    evaluation_id: string;
    patient_id: string;
    priority: string;
    reason: string[];
    estimated_value: number;
  }[];
  agent_insight: {
    severity: string;
    reason: string;
    recommendation: string;
    estimated_gain: number;
  };
};

type Props = {
  lifecycle?: LifecycleSummary | null;
  onIngestPatient?: () => void;
  onReviewCase?: (evaluationId: string) => void;
};

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function LifecycleRevenuePanel({
  lifecycle,
  onIngestPatient,
  onReviewCase,
}: Props) {
  if (!lifecycle) return null;

  const { trial_profile, funnel, review_queue, agent_insight } = lifecycle;

  return (
    <section className="lifecycle-panel">
      <div className="lifecycle-header">
        <div>
          <p className="eyebrow">Revenue Lifecycle Layer</p>
          <h2>Trial demand → patient feed → review → conversion</h2>
          <p>
            Buyer: {trial_profile.buyer}. User: {trial_profile.user}. Converted
            patient value: {money(trial_profile.value_per_converted_patient)}.
          </p>
        </div>

        <button className="secondary-button" onClick={onIngestPatient}>
          Ingest Mock Patient
        </button>
      </div>

      <div className="lifecycle-grid">
        <article className="lifecycle-card">
          <h3>Requested Patient Profile</h3>
          <p>{trial_profile.requested_patient_profile.diagnosis}</p>
          <ul>
            {trial_profile.requested_patient_profile.key_inclusion
              .slice(0, 3)
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </ul>
        </article>

        <article className="lifecycle-card">
          <h3>Revenue Funnel</h3>
          <div className="funnel-row">
            <span>Prospects</span>
            <strong>{funnel.prospects}</strong>
          </div>
          <div className="funnel-row">
            <span>Qualified</span>
            <strong>{funnel.qualified}</strong>
          </div>
          <div className="funnel-row">
            <span>Evaluated</span>
            <strong>{funnel.evaluated}</strong>
          </div>
          <div className="funnel-row">
            <span>Human Review</span>
            <strong>{funnel.in_review}</strong>
          </div>
          <div className="funnel-row">
            <span>Converted</span>
            <strong>{funnel.converted}</strong>
          </div>
        </article>

        <article className="lifecycle-card">
          <h3>Revenue Impact</h3>
          <div className="metric-large">{money(funnel.realized_value)}</div>
          <p>Realized value</p>
          <div className="funnel-row">
            <span>Potential</span>
            <strong>{money(funnel.potential_value)}</strong>
          </div>
          <div className="funnel-row warning">
            <span>Leakage</span>
            <strong>{money(funnel.leakage_value)}</strong>
          </div>
        </article>

        <article className="lifecycle-card agent-card">
          <h3>Agent Insight</h3>
          <p>{agent_insight.reason}</p>
          <strong>{agent_insight.recommendation}</strong>
          <div className="estimated-gain">
            Estimated upside: {money(agent_insight.estimated_gain)}
          </div>
        </article>
      </div>

      <div className="review-queue-panel">
        <div>
          <h3>Human Review Queue</h3>
          <p>Coordinator decision point before conversion.</p>
        </div>

        <div className="review-queue-list">
          {review_queue.length ? (
            review_queue.map((item) => (
              <div className="review-queue-row" key={item.review_id}>
                <div>
                  <strong>{item.patient_id}</strong>
                  <p>{item.reason.join(" ")}</p>
                </div>
                <span>{item.priority}</span>
                <button
                  className="secondary-button compact"
                  onClick={() => onReviewCase?.(item.evaluation_id)}
                >
                  Review
                </button>
              </div>
            ))
          ) : (
            <p className="empty-copy">No open human review cases.</p>
          )}
        </div>
      </div>
    </section>
  );
}
