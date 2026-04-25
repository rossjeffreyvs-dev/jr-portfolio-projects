"use client";

import type { CustomerLifecycleSummary } from "@/app/types";

type ReviewAction = "approve" | "reject" | "request_data";

type Props = {
  lifecycle: CustomerLifecycleSummary | null;
  isRefreshing?: boolean;
  onIngestProspect: () => void;
  onReviewAction: (reviewId: string, action: ReviewAction) => void;
};

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

function stageLabel(stage: string) {
  return stage.replaceAll("_", " ");
}

export default function LifecycleRevenuePanel({
  lifecycle,
  isRefreshing = false,
  onIngestProspect,
  onReviewAction,
}: Props) {
  if (!lifecycle) {
    return (
      <section className="panel">
        <p className="section-label">Revenue lifecycle</p>
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
    <section className="lifecycle-revenue-panel">
      <div className="lifecycle-revenue-header">
        <div>
          <p className="section-label">Revenue Lifecycle</p>
          <h2>Prospect → Activation → Conversion</h2>
          <p>
            Buyer: <strong>{customer_profile.buyer}</strong> · User:{" "}
            <strong>{customer_profile.user}</strong>
          </p>
        </div>

        <button
          className="primary-action"
          onClick={onIngestProspect}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Updating…" : "Ingest Prospect"}
        </button>
      </div>

      {/* TOP GRID */}
      <div className="lifecycle-grid">
        <div className="card">
          <h3>Target Profile</h3>
          <p>{customer_profile.target_customer_profile.segment}</p>
          <small>{customer_profile.target_customer_profile.use_case}</small>
        </div>

        <div className="card">
          <h3>Funnel</h3>
          <div>Prospects: {funnel.prospects}</div>
          <div>Qualified: {funnel.qualified}</div>
          <div>Evaluated: {funnel.evaluated}</div>
          <div>Review: {funnel.in_review}</div>
          <div>Converted: {funnel.converted}</div>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <div className="big">{money(funnel.realized_value)}</div>
          <div>Potential: {money(funnel.potential_value)}</div>
          <div className="warning">Leakage: {money(funnel.leakage_value)}</div>
        </div>

        <div className="card insight">
          <h3>Agent Insight</h3>
          <p>{agent_insight.reason}</p>
          <strong>{agent_insight.recommendation}</strong>
          <div className="gain">+{money(agent_insight.estimated_gain)}</div>
        </div>
      </div>

      {/* FEED + REVIEW */}
      <div className="two-col">
        <div className="card">
          <h3>Live Prospect Feed</h3>
          {prospect_feed.slice(0, 6).map((p) => (
            <div key={p.id} className="row">
              <div>
                <strong>{p.name}</strong>
                <div>{p.segment}</div>
                <small>{p.signal}</small>
              </div>
              <div className="meta">
                <span>{stageLabel(p.stage)}</span>
                <strong>{p.fit_score}%</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Review Queue</h3>
          {review_queue.length === 0 && <p>No blocked conversions</p>}

          {review_queue.map((r) => (
            <div key={r.id} className="row">
              <div>
                <strong>{r.prospect?.name}</strong>
                <small>{r.reason.join(" ")}</small>
              </div>

              <div className="actions">
                <button onClick={() => onReviewAction(r.id, "approve")}>
                  Approve
                </button>
                <button onClick={() => onReviewAction(r.id, "request_data")}>
                  Data
                </button>
                <button onClick={() => onReviewAction(r.id, "reject")}>
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
