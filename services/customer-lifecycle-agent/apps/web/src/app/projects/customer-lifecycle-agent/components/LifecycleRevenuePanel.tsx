"use client";

import type { CustomerLifecycleSummary } from "@/app/types";

type ReviewAction = "approve" | "reject" | "request_data";

type Props = {
  lifecycle: CustomerLifecycleSummary | null;
  isRefreshing: boolean;
  statusMessage?: string;
  onIngestProspect: () => void;
  onReviewAction: (reviewId: string, action: ReviewAction) => void;
};

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

function formatStage(stage: string) {
  return stage.replaceAll("_", " ");
}

export default function LifecycleRevenuePanel({
  lifecycle,
  isRefreshing,
  statusMessage,
  onIngestProspect,
  onReviewAction,
}: Props) {
  if (!lifecycle) {
    return (
      <section className="lifecycle-revenue-panel" id="revenue-lifecycle-panel">
        <p className="section-label">Revenue Lifecycle Layer</p>
        <h2>Loading lifecycle intelligence…</h2>
      </section>
    );
  }

  const {
    customer_profile,
    prospect_feed,
    funnel,
    review_queue,
    agent_insight,
  } = lifecycle;

  return (
    <section className="lifecycle-revenue-panel" id="revenue-lifecycle-panel">
      {statusMessage ? (
        <div className="inline-status-banner">{statusMessage}</div>
      ) : null}

      <div className="lifecycle-revenue-header">
        <div>
          <p className="section-label">Revenue Lifecycle Layer</p>
          <h2>Prospect → Review → Conversion → Revenue</h2>

          <p className="section-subtext">
            The system identifies where revenue is blocked, explains why, and
            routes the next best human action.
          </p>

          <p className="section-subtext">
            Buyer: {customer_profile.buyer} · User: {customer_profile.user}
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={onIngestProspect}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Updating…" : "Simulate New Prospect"}
        </button>
      </div>

      <div className="lifecycle-grid">
        <article className="lifecycle-card">
          <h3>Target Customer Profile</h3>
          <p>{customer_profile.target_customer_profile.segment}</p>
          <small>{customer_profile.target_customer_profile.use_case}</small>
        </article>

        <article className="lifecycle-card">
          <h3>Revenue Funnel</h3>

          <div className="funnel-line">
            <span>Prospects</span>
            <strong>{funnel.prospects}</strong>
          </div>
          <div className="funnel-line">
            <span>Qualified</span>
            <strong>{funnel.qualified}</strong>
          </div>
          <div className="funnel-line">
            <span>Evaluated</span>
            <strong>{funnel.evaluated}</strong>
          </div>
          <div className="funnel-line">
            <span>Human Review</span>
            <strong>{funnel.in_review}</strong>
          </div>
          <div className="funnel-line">
            <span>Converted</span>
            <strong>{funnel.converted}</strong>
          </div>
        </article>

        <article className="lifecycle-card">
          <h3>Revenue Impact</h3>
          <div className="revenue-number">{money(funnel.realized_value)}</div>
          <p>Revenue Realized</p>

          <div className="funnel-line">
            <span>Pipeline Potential</span>
            <strong>{money(funnel.potential_value)}</strong>
          </div>

          <div className="funnel-line warning">
            <span>Revenue at Risk</span>
            <strong>{money(funnel.leakage_value)}</strong>
          </div>
        </article>

        <article className="lifecycle-card agent-insight-card">
          <h3>Recommended Next Action</h3>
          <em>{formatStage(agent_insight.stage)}</em>
          <p>{agent_insight.reason}</p>
          <strong>{agent_insight.recommendation}</strong>

          <div className="estimated-gain">
            Estimated upside: {money(agent_insight.estimated_gain)}
          </div>
        </article>
      </div>

      <div className="lifecycle-two-column">
        <article className="lifecycle-card">
          <h3>Live Prospect Feed</h3>
          <p className="muted-copy">
            Incoming customer opportunities from product-led signup, referrals,
            outbound, and partner channels.
          </p>

          <div className="prospect-feed">
            {prospect_feed.slice(0, 6).map((prospect, index) => (
              <div
                className="prospect-card"
                key={`${prospect.id}-${prospect.created_at}-${index}`}
              >
                <div className="prospect-header">
                  <strong>{prospect.name}</strong>
                  <span className="fit-score">{prospect.fit_score}%</span>
                </div>

                <div className="prospect-meta-line">
                  {prospect.segment} · {prospect.source}
                </div>

                <div className="prospect-signal">{prospect.signal}</div>

                <div className="prospect-stage">
                  {formatStage(prospect.stage)}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="lifecycle-card">
          <h3>Revenue Blockers</h3>
          <p className="muted-copy">
            These prospects require a decision before value can be realized.
          </p>

          <div className="review-list">
            {review_queue.length ? (
              review_queue.map((item) => {
                const isAwaitingInfo = item.reason.some((reason) =>
                  reason.toLowerCase().includes("additional information"),
                );

                return (
                  <div className="blocker-card" key={item.id}>
                    <div className="blocker-header">
                      <div>
                        <strong>
                          {item.prospect?.name || item.prospect_id}
                        </strong>
                        <span>
                          {item.priority} priority ·{" "}
                          {money(item.estimated_value)}
                        </span>

                        {item.status === "open" ? (
                          <span className="workflow-badge">
                            {isAwaitingInfo
                              ? "Awaiting Info"
                              : "Needs Decision"}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="blocker-why">
                      <p className="blocker-title">Why this prospect?</p>
                      <ul>
                        {item.reason.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                        <li>
                          Estimated conversion value:{" "}
                          {money(item.estimated_value)}
                        </li>
                        <li>Recommended action: {item.recommended_action}</li>
                      </ul>
                    </div>

                    <div className="blocker-actions">
                      <button
                        className="primary"
                        type="button"
                        onClick={() => onReviewAction(item.id, "approve")}
                      >
                        Convert → +{money(item.estimated_value)}
                      </button>

                      <button
                        className="secondary"
                        type="button"
                        onClick={() => onReviewAction(item.id, "request_data")}
                      >
                        Request Info → Keep in Review
                      </button>

                      <button
                        className="danger"
                        type="button"
                        onClick={() => onReviewAction(item.id, "reject")}
                      >
                        Reject → Remove
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="muted-copy">No open revenue blockers.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
