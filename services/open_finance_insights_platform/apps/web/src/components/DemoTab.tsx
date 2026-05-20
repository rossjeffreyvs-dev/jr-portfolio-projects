"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DemoTabProps = {
  autoRunToken: number;
};

type WorkflowStatus = "queued" | "running" | "complete";

type WorkflowEvent = {
  title: string;
  body: string;
  status: WorkflowStatus;
};

const suggestedQuestions = [
  "Analyze this user's financial profile",
  "Which subscriptions should be reviewed?",
  "How stable is monthly cash flow?",
  "What financial health risks are emerging?",
  "Summarize affordability and runway signals.",
];

const workflowSteps: WorkflowEvent[] = [
  {
    title: "Source data loaded",
    body: "Loaded mock institutions, connected accounts, balances, and transaction records.",
    status: "queued",
  },
  {
    title: "Common model created",
    body: "Mapped provider-style records into account, institution, merchant, category, transaction, cash-flow, and signal entities.",
    status: "queued",
  },
  {
    title: "Recurring payments detected",
    body: "Identified payroll deposits, streaming subscriptions, utilities, loan payments, insurance, and repeat obligations.",
    status: "queued",
  },
  {
    title: "Cash-flow summary generated",
    body: "Calculated inflow, outflow, discretionary spend, recurring obligations, and monthly runway indicators.",
    status: "queued",
  },
  {
    title: "Financial signals ranked",
    body: "Ranked risks and opportunities by evidence strength, severity, confidence, and product relevance.",
    status: "queued",
  },
  {
    title: "Recommendation ready",
    body: "Prepared an explainable financial profile summary for review before any user-facing recommendation is accepted.",
    status: "queued",
  },
];

const metrics = [
  {
    label: "Connected accounts",
    value: "4",
    caption: "Checking, savings, credit, loan",
  },
  {
    label: "Monthly inflow",
    value: "$12.8k",
    caption: "Payroll + recurring deposits",
  },
  {
    label: "Recurring charges",
    value: "9",
    caption: "Subscriptions and obligations",
  },
  {
    label: "Runway",
    value: "5.4 mo",
    caption: "Cash-flow resilience estimate",
  },
];

const signals = [
  {
    severity: "Opportunity",
    title: "Three subscription charges appear underused",
    body: "Streaming, storage, and SaaS charges repeat monthly with low inferred utility.",
  },
  {
    severity: "Risk",
    title: "Discretionary spend increased 18%",
    body: "Dining and travel categories rose faster than income over the last period.",
  },
  {
    severity: "Watch",
    title: "Income timing varies by 6 days",
    body: "Payroll cadence is stable, but deposit timing creates short-term liquidity gaps.",
  },
];

export default function DemoTab({ autoRunToken }: DemoTabProps) {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<WorkflowEvent[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const workflowRef = useRef<HTMLElement | null>(null);
  const recommendationRef = useRef<HTMLElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const completedCount = useMemo(
    () => events.filter((event) => event.status === "complete").length,
    [events],
  );

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  function runWorkflow(nextQuestion = question) {
    clearTimers();

    setQuestion(nextQuestion);
    setHasRun(true);
    setIsRunning(true);

    setEvents([
      {
        title: "Planning workflow",
        body: "Preparing the normalized financial profile, CDM mapping sequence, and insight tool plan.",
        status: "running",
      },
    ]);

    schedule(() => {
      workflowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 450);

    workflowSteps.forEach((step, index) => {
      schedule(
        () => {
          setEvents((current) => {
            const completed = current.map((event) =>
              event.status === "running"
                ? { ...event, status: "complete" as const }
                : event,
            );

            return [...completed, { ...step, status: "running" as const }];
          });
        },
        1100 + index * 1250,
      );
    });

    schedule(
      () => {
        setEvents((current) =>
          current.map((event) =>
            event.status === "running"
              ? { ...event, status: "complete" as const }
              : event,
          ),
        );

        setIsRunning(false);

        setTimeout(() => {
          recommendationRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 700);
      },
      1100 + workflowSteps.length * 1250 + 700,
    );
  }

  useEffect(() => {
    if (autoRunToken > 0) {
      runWorkflow();
    }

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunToken]);

  return (
    <section className="tab-stack">
      <article className="content-card blue-panel full-span command-center open-finance-command">
        <p className="eyebrow">Open finance command center</p>

        <h2>Analyze a normalized financial profile</h2>

        <p>
          The backend loads mock Plaid-style source data, maps it into a common
          financial model, calls deterministic insight tools, and streams an
          explainable recommendation workflow.
        </p>

        <div className="question-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <button
            className={`primary-button workflow-run-button ${
              isRunning ? "is-running" : "is-ready"
            }`}
            type="button"
            onClick={() => runWorkflow()}
            disabled={isRunning}
          >
            <span className="run-button-dot" aria-hidden="true" />

            <span>
              {isRunning
                ? "Running Insight Workflow..."
                : "Run Insight Workflow"}
            </span>
          </button>
        </div>

        <div className="suggested-row">
          <span>Suggested analysis prompts</span>
          <small>Click any prompt to begin the same CDM workflow</small>
        </div>

        <div className="scenario-grid">
          {suggestedQuestions.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => runWorkflow(item)}
              disabled={isRunning}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </button>
          ))}
        </div>
      </article>

      <div className="metric-grid">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.caption}</p>
          </div>
        ))}
      </div>

      <article
        className="content-card full-span workflow-panel"
        ref={workflowRef}
      >
        {!hasRun ? (
          <div className="empty-state">
            <p className="eyebrow">Ready</p>

            <h2>
              Run a financial profile question to start the agent workflow
            </h2>

            <p>
              The first run will populate source ingest, CDM mapping, tool
              calls, financial signals, recommendations, and review-ready
              evidence.
            </p>
          </div>
        ) : (
          <>
            <div className="section-header-row">
              <div>
                <p className="eyebrow">Workflow activity</p>
                <h2>Tool calls and reasoning trace</h2>
              </div>

              <div
                className={`progress-pill ${
                  isRunning ? "is-running" : "is-complete"
                }`}
              >
                {isRunning
                  ? "Streaming workflow"
                  : `${completedCount} steps completed`}
              </div>
            </div>

            <div className="workflow-list">
              {events.map((event, index) => (
                <div
                  className={`workflow-event ${event.status}`}
                  key={`${event.title}-${index}`}
                >
                  <span className={`status-dot ${event.status}`} />

                  <div>
                    <small>{event.status}</small>
                    <h3>{event.title}</h3>
                    <p>{event.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </article>

      {hasRun && (
        <article
          className="content-card full-span recommendation-panel"
          ref={recommendationRef}
        >
          <p className="eyebrow">Recommendation panel</p>

          <h2>Financial health signals</h2>

          <p>
            Signals are intentionally framed as evidence-backed product
            recommendations rather than automated financial advice.
          </p>

          <div className="signals-grid">
            {signals.map((signal) => (
              <div className="signal-card" key={signal.title}>
                <span className="severity">{signal.severity}</span>
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </div>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
