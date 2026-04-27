"use client";

import type { CustomerLifecycleSummary } from "@/app/types";

type ReviewAction = "approve" | "reject" | "request_data";

type Props = {
  lifecycle: CustomerLifecycleSummary | null;
  isRefreshing: boolean;
  onIngestProspect: () => void;
  onReviewAction: (reviewId: string, action: ReviewAction) => void;
};

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function LifecycleRevenuePanel({
  lifecycle,
  isRefreshing,
  onIngestProspect,
  onReviewAction,
}: Props) {
  if (!lifecycle) {
    return <div>Loading lifecycle…</div>;
  }

  const {
    customer_profile,
    prospect_feed,
    funnel,
    review_queue,
    agent_insight,
  } = lifecycle;

  return (
    <section className="revenue-panel">
      <div className="revenue-header">
        <div>
          <p className="section-label">Revenue Lifecycle Layer</p>
          <h2>Prospect feed → human review → converted customer</h2>
          <p className="section-subtext">
            Buyer: {customer_profile.buyer} · User: {customer_profile.user}
          </p>
        </div>

        <button
          className="primary-button"
          onClick={onIngestProspect}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Updating…" : "Add New Prospect"}
        </button>
      </div>

      {/* Top metrics */}
      <div className="revenue-grid">
        <div className="revenue-card">
          <h4>Target Customer Profile</h4>
          <p>{customer_profile.target_customer_profile.segment}</p>
          <small>{customer_profile.target_customer_profile.use_case}</small>
        </div>

        <div className="revenue-card">
          <h4>Revenue Funnel</h4>
          <p>Prospects: {funnel.prospects}</p>
          <p>Qualified: {funnel.qualified}</p>
          <p>Evaluated: {funnel.evaluated}</p>
          <p>Human Review: {funnel.in_review}</p>
          <p>Converted: {funnel.converted}</p>
        </div>

        <div className="revenue-card">
          <h4>Revenue Impact</h4>
          <p>Realized value: {money(funnel.realized_value)}</p>
          <p>Potential: {money(funnel.potential_value)}</p>
          <p style={{ color: "#dc2626" }}>
            Leakage: {money(funnel.leakage_value)}
          </p>
        </div>

        <div className="revenue-card">
          <h4>Agent Revenue Insight</h4>
          <p>{agent_insight.reason}</p>
          <strong>{agent_insight.recommendation}</strong>
          <p style={{ marginTop: 8, color: "#16a34a" }}>
            Estimated upside: {money(agent_insight.estimated_gain)}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="revenue-content">
        {/* LEFT: Feed */}
        <div className="revenue-feed">
          <h4>Live Prospect Feed</h4>

          {prospect_feed.map((p) => (
            <div key={p.id} className="prospect-card">
              <div>
                <strong>{p.name}</strong>
                <span>{p.segment}</span>
              </div>

              <div>
                <small>{p.signal}</small>
                <span>{p.fit_score}%</span>
              </div>

              <div className="stage-pill">{p.stage}</div>
            </div>
          ))}
        </div>

        {/* RIGHT: Revenue Blockers */}
        <div className="revenue-blockers">
          <h4>Revenue at Risk (Needs Action)</h4>

          {review_queue.map((item) => (
            <div key={item.id} className="blocker-card">
              <div>
                <strong>{item.prospect?.name || item.prospect_id}</strong>
                <span>
                  {item.priority} priority · {money(item.estimated_value)}
                </span>

                {/* 🔥 NEW: Explainability Layer */}
                <div className="why-prospect-box">
                  <strong>Why this prospect?</strong>
                  <ul>
                    {item.reason.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                    <li>
                      Estimated conversion value: {money(item.estimated_value)}
                    </li>
                    <li>Recommended action: {item.recommended_action}</li>
                  </ul>
                </div>
              </div>

              <div className="blocker-actions">
                <button onClick={() => onReviewAction(item.id, "approve")}>
                  Approve → Convert ({money(item.estimated_value)})
                </button>

                <button onClick={() => onReviewAction(item.id, "request_data")}>
                  Request Data
                </button>

                <button onClick={() => onReviewAction(item.id, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
