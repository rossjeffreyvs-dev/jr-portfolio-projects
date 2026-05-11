"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { askQuestion, getMetrics, getScenarios } from "@/lib/api";
import type { AskResponse, MetricSummary, Scenario, WorkflowRun } from "@/types";
import Panel from "./Panel";

const starterQuestions = [
  "Can we afford to hire 2 engineers?",
  "What revenue is at risk?",
  "Where are we overspending?",
  "Why are activation rates declining?",
  "Generate a board-ready update.",
];

type WorkflowStatus = "idle" | "planning" | "priming" | "streaming" | "complete";

function money(value?: number) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function compactMoney(value?: number) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-US", { notation: "compact", style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(value);
}

function normalizeChartDatum(data: WorkflowRun["charts"]["revenue_risk_breakdown"] = []) {
  return data.map((item) => ({ name: item.label || `Month ${item.month}`, value: item.value || 0 }));
}

function workflowStatusLabel(status: WorkflowStatus, loading: boolean) {
  if (loading || status === "planning") return "Planning";
  if (status === "priming") return "Ready to stream";
  if (status === "streaming") return "Executing";
  if (status === "complete") return "Completed";
  return "Ready";
}

export default function DemoDashboard() {
  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [question, setQuestion] = useState("Which enterprise customers are most likely to churn next quarter?");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleEventCount, setVisibleEventCount] = useState(0);
  const [streamingStarted, setStreamingStarted] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("idle");
  const workflowRef = useRef<HTMLDivElement | null>(null);
  const streamPanelRef = useRef<HTMLDivElement | null>(null);
  const streamEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([getMetrics(), getScenarios()])
      .then(([metricPayload, scenarioPayload]) => {
        setMetrics(metricPayload);
        setScenarios(scenarioPayload);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load API data"));
  }, []);

  function scrollToWorkflow(delay = 120) {
    window.setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, delay);
  }

  async function runQuestion(nextQuestion = question) {
    const trimmedQuestion = nextQuestion.trim();
    if (!trimmedQuestion) return;

    setLoading(true);
    setError(null);
    setQuestion(trimmedQuestion);
    setActiveQuestion(trimmedQuestion);
    setResult(null);
    setVisibleEventCount(0);
    setStreamingStarted(false);
    setWorkflowStatus("planning");
    scrollToWorkflow(180);

    try {
      const payload = await askQuestion(trimmedQuestion);
      setResult(payload);
      setWorkflowStatus("priming");
      scrollToWorkflow(220);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run workflow");
      setWorkflowStatus("idle");
    } finally {
      setLoading(false);
    }
  }

  const run = result?.run;
  const plan = result?.plan || run?.plan;
  const parameters = result?.parameters || run?.parameters || {};
  const runwayData = run?.charts?.runway_projection || [];
  const revenueRiskData = normalizeChartDatum(run?.charts?.revenue_risk_breakdown);
  const activationData = normalizeChartDatum(run?.charts?.activation_funnel);
  const failedPaymentData = normalizeChartDatum(run?.charts?.failed_payments_trend);
  const suggestedQuestions = scenarios.length ? scenarios.map((scenario) => scenario.question) : starterQuestions;

  const visibleEvents = run?.events.slice(0, visibleEventCount) || [];
  const activeEventId = workflowStatus === "streaming" && visibleEvents.length
    ? visibleEvents[visibleEvents.length - 1].id
    : null;

  useEffect(() => {
    if (!run?.run_id || workflowStatus !== "priming") return;

    setVisibleEventCount(0);
    setStreamingStarted(false);

    const scrollTimer = window.setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    const streamTimer = window.setTimeout(() => {
      setStreamingStarted(true);
      setWorkflowStatus("streaming");
      streamPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1250);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(streamTimer);
    };
  }, [run?.run_id, workflowStatus]);

  useEffect(() => {
    if (!run?.run_id || !streamingStarted || workflowStatus !== "streaming") return;

    setVisibleEventCount(0);
    const totalEvents = run.events.length;
    if (!totalEvents) return;

    let current = 0;
    const firstStepTimer = window.setTimeout(() => {
      current = 1;
      setVisibleEventCount(Math.min(current, totalEvents));
    }, 1100);

    const interval = window.setInterval(() => {
      current += 1;
      setVisibleEventCount(Math.min(current, totalEvents));
      if (current >= totalEvents) {
        window.clearInterval(interval);
        window.setTimeout(() => setWorkflowStatus("complete"), 850);
      }
    }, 2250);

    return () => {
      window.clearTimeout(firstStepTimer);
      window.clearInterval(interval);
    };
  }, [run?.run_id, run?.events.length, streamingStarted, workflowStatus]);

  useEffect(() => {
    if (!streamingStarted || !visibleEventCount) return;
    const timer = window.setTimeout(() => {
      streamEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [visibleEventCount, streamingStarted]);

  const topRecommendation = run?.recommendations?.[0];
  const metricCards = useMemo(() => ([
    ["MRR", money(metrics?.monthly_recurring_revenue), "Stripe-like subscription revenue"],
    ["Runway", metrics ? `${metrics.runway_months.toFixed(1)} mo` : "—", "Current operating runway"],
    ["Failed payments", money(metrics?.failed_payments_value), "Near-term recovery opportunity"],
    ["NRR", metrics ? `${metrics.net_revenue_retention.toFixed(0)}%` : "—", "Expansion and retention signal"],
  ]), [metrics]);

  const hasWorkflowContext = Boolean(run || activeQuestion || workflowStatus !== "idle");
  const displayQuestion = result?.question || activeQuestion || question;
  const displayObjective = plan?.objective || (loading
    ? "Extracting intent, selecting agents, and preparing tool calls for the adaptive workflow."
    : "Run a founder question to generate an adaptive workflow plan.");
  const workflowClassName = `analysis-header workflow-state-${workflowStatus}`;

  return (
    <div className="demo-stack">
      <Panel tone="blue" className="question-panel">
        <div>
          <p className="eyebrow">Founder Command Center</p>
          <h2>Ask a startup finance or operations question</h2>
          <p>
            The backend extracts intent, selects agents and tools, calls mock Stripe/forecasting/customer-health tools,
            and uses OpenAI to synthesize recommendations over grounded evidence.
          </p>
        </div>
        <form
          className="question-form"
          onSubmit={(event) => {
            event.preventDefault();
            runQuestion();
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            aria-label="Founder question"
            placeholder="Ask about hiring, runway, revenue risk, overspending, activation, or board updates..."
          />
          <button type="submit" disabled={loading}>{loading ? "Planning..." : "Run Agent Workflow"}</button>
        </form>

        <div className="founder-scenarios">
          <div className="founder-scenarios-header">
            <span>Suggested founder scenarios</span>
            <strong>Click any question to begin an adaptive workflow</strong>
          </div>
          <div className="scenario-command-grid">
            {suggestedQuestions.slice(0, 5).map((starter, index) => (
              <button className="scenario-command" key={starter} onClick={() => runQuestion(starter)} disabled={loading}>
                <span className="scenario-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{starter}</strong>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {error && <div className="error-card">{error}</div>}

      <div className="metrics-grid">
        {metricCards.map(([label, value, help]) => (
          <Panel className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{help}</p>
          </Panel>
        ))}
      </div>

      <div ref={workflowRef} className="workflow-scroll-anchor" />

      {hasWorkflowContext ? (
        <>
          <Panel className={workflowClassName}>
            <div>
              <p className="eyebrow">Adaptive AI Workflow</p>
              <h2>{displayQuestion}</h2>
              <p>{displayObjective}</p>
            </div>
            <div className="workflow-status-stack">
              <span className={`workflow-status workflow-status-${workflowStatus}`}>
                <span className="workflow-status-dot" />
                {workflowStatusLabel(workflowStatus, loading)}
              </span>
              <div className="pill-row">
                <span className="pill">Intent: {result?.intent || "detecting"}</span>
                <span className="pill">Provider: {run?.llm_reasoning?.provider || "pending"}</span>
                <span className="pill">Model: {run?.llm_reasoning?.model || "pending"}</span>
              </div>
            </div>
          </Panel>

          <div ref={streamPanelRef} className="stream-scroll-anchor" />
          <Panel className="workflow-stream-panel">
            <div className="stream-header">
              <div>
                <p className="eyebrow">Agent Tool Activity · Streaming</p>
                <h3>Adaptive agent execution</h3>
                <p>
                  The workflow reveals one agent step at a time so the user can see how the system selects agents,
                  calls tools, gathers evidence, and prepares recommendations.
                </p>
              </div>
              <span className="stream-counter">{visibleEvents.length}/{run?.events.length || 0} steps</span>
            </div>
            <div className="timeline timeline-streaming">
              {visibleEvents.map((event) => (
                <article
                  className={`timeline-item status-${event.status} ${event.id === activeEventId ? "active" : ""}`}
                  key={event.id}
                >
                  <div className="timeline-dot" />
                  <div>
                    <div className="timeline-topline">
                      <strong>{event.agent}</strong>
                      <span>{event.duration_ms}ms</span>
                    </div>
                    <h4>{event.title}</h4>
                    <p>{event.message}</p>
                    {event.tool_call && (
                      <div className="tool-call-card">
                        <span>Tool call</span>
                        <strong>{event.tool_call.tool_name}</strong>
                        <p>{event.tool_call.output_summary}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {(loading || workflowStatus === "planning" || workflowStatus === "priming") && (
                <article className="timeline-item pending prestream">
                  <div className="timeline-dot pulse" />
                  <div>
                    <div className="timeline-topline">
                      <strong>{loading ? "Planning adaptive workflow…" : "Preparing workflow stream…"}</strong>
                      <span>{loading ? "planning" : "ready"}</span>
                    </div>
                    <p>
                      {loading
                        ? "Extracting parameters and selecting the relevant agents and tools."
                        : "Scroll position is set. Agent steps will begin shortly."}
                    </p>
                  </div>
                </article>
              )}
              {workflowStatus === "streaming" && visibleEvents.length < (run?.events.length || 0) && (
                <article className="timeline-item pending">
                  <div className="timeline-dot pulse" />
                  <div>
                    <div className="timeline-topline">
                      <strong>Waiting for next agent step…</strong>
                      <span>streaming</span>
                    </div>
                    <p>Preparing the next tool call and evidence update.</p>
                  </div>
                </article>
              )}
              <div ref={streamEndRef} className="stream-end-anchor" />
            </div>
          </Panel>

          {run && (
            <>
              <div className="three-col">
                <Panel>
                  <p className="eyebrow">Semantic Understanding</p>
                  <h3>Extracted parameters</h3>
                  <div className="parameter-list">
                    {Object.entries(parameters).length ? Object.entries(parameters).map(([key, value]) => (
                      <div key={key}>
                        <span>{key.replaceAll("_", " ")}</span>
                        <strong>{String(value)}</strong>
                      </div>
                    )) : <p>No explicit parameters extracted.</p>}
                  </div>
                </Panel>

                <Panel>
                  <p className="eyebrow">Dynamic Planner</p>
                  <h3>Selected agents</h3>
                  <div className="chip-list">
                    {plan?.selected_agents.map((agent) => <span className="chip selected" key={agent}>{agent}</span>)}
                  </div>
                  {!!plan?.skipped_agents?.length && (
                    <>
                      <h4>Skipped</h4>
                      <div className="chip-list muted">
                        {plan.skipped_agents.map((agent) => <span className="chip" key={agent}>{agent}</span>)}
                      </div>
                    </>
                  )}
                </Panel>

                <Panel>
                  <p className="eyebrow">Ranked Recommendation</p>
                  <h3>{topRecommendation?.title || "No recommendation yet"}</h3>
                  {topRecommendation && (
                    <>
                      <p>{topRecommendation.rationale}</p>
                      <div className="impact-badge">{topRecommendation.impact}</div>
                      <div className="score-row">
                        <span>Confidence {Math.round(topRecommendation.confidence * 100)}%</span>
                        <span>Rank {topRecommendation.rank_score?.toFixed(3) || "—"}</span>
                      </div>
                    </>
                  )}
                </Panel>
              </div>

              <div className="two-col insight-grid">
                <Panel>
                  <p className="eyebrow">OpenAI Reasoning</p>
                  <h3>Executive synthesis</h3>
                  <p>{run.llm_reasoning?.summary}</p>
                  <ul className="clean-list compact">
                    {run.llm_reasoning?.recommendation_notes?.slice(0, 4).map((note) => <li key={note}>{note}</li>)}
                  </ul>
                </Panel>

                <Panel>
                  <p className="eyebrow">Review Queue</p>
                  <h3>Human decisions</h3>
                  <div className="review-list">
                    {run.reviews.map((review) => (
                      <article key={review.id}>
                        <span>{review.priority}</span>
                        <strong>{review.title}</strong>
                        <p>{review.estimated_impact}</p>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="chart-grid">
                <Panel>
                  <p className="eyebrow">Runway Projection</p>
                  <h3>Cash over time</h3>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={runwayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => compactMoney(Number(value))} />
                        <Tooltip formatter={(value) => money(Number(value))} />
                        <Area type="monotone" dataKey="current_plan_cash" strokeWidth={2} fillOpacity={0.15} />
                        <Area type="monotone" dataKey="hiring_plan_cash" strokeWidth={2} fillOpacity={0.1} />
                        <Area type="monotone" dataKey="optimized_plan_cash" strokeWidth={2} fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <Panel>
                  <p className="eyebrow">Revenue Risk</p>
                  <h3>Accounts or funnel exposure</h3>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={revenueRiskData.length ? revenueRiskData : activationData.length ? activationData : failedPaymentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(value) => compactMoney(Number(value))} />
                        <Tooltip formatter={(value) => money(Number(value))} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              </div>
            </>
          )}
        </>
      ) : (
        <Panel className="empty-state">
          <p className="eyebrow">Ready</p>
          <h3>Run a founder question to start the agent workflow</h3>
          <p>The first run will populate semantic extraction, workflow planning, tool traces, recommendations, review queue, and charts.</p>
        </Panel>
      )}
    </div>
  );
}
