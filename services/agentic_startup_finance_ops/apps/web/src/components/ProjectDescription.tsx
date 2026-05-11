import Panel from "./Panel";

const overviewCards = [
  [
    "🧭",
    "Semantic intent",
    "Free-form founder questions are converted into structured intent, parameters, and operating context.",
  ],
  [
    "🛠️",
    "Tool-using agents",
    "Specialized agents call Stripe-like, forecasting, expense, customer-health, and LLM tools.",
  ],
  [
    "📈",
    "Dynamic planning",
    "The orchestrator selects relevant agents, skips unnecessary work, and creates an evidence-backed plan.",
  ],
  [
    "🤖",
    "LLM synthesis",
    "OpenAI reasons over grounded findings to generate concise recommendations and tradeoff analysis.",
  ],
  [
    "👤",
    "Human review",
    "High-impact actions are ranked, reviewed, and routed to a founder or finance lead for approval.",
  ],
];

const workflowSteps2 = [
  ["🧭", "Question Interpreted"],
  ["🎯", "Intent Extracted"],
  ["🧰", "Tools Selected"],
  ["📊", "Evidence Gathered"],
  ["🤖", "Reasoning Generated"],
  ["✅", "Review Routed"],
];

const workflowSteps = [
  {
    icon: "🧭",
    title: "Question Interpreted",
    description:
      "The orchestrator converts free-form founder language into structured operating intent.",
  },
  {
    icon: "🎯",
    title: "Intent Extracted",
    description:
      "The semantic layer identifies parameters like department, timeframe, hiring count, or revenue-risk category.",
  },
  {
    icon: "🧰",
    title: "Tools Selected",
    description:
      "The planner selects only the relevant Stripe-like, forecasting, expense, customer-health, and LLM tools.",
  },
  {
    icon: "📊",
    title: "Evidence Gathered",
    description:
      "Agents gather metrics, signals, failed payments, spend anomalies, and operational context.",
  },
  {
    icon: "🤖",
    title: "Reasoning Generated",
    description:
      "OpenAI synthesizes grounded recommendations, tradeoffs, confidence, and risk analysis.",
  },
  {
    icon: "✅",
    title: "Review Routed",
    description:
      "High-impact recommendations are ranked and routed to a founder or finance lead before action.",
  },
];

const architectureCards = [
  {
    eyebrow: "Frontend",
    title: "Next.js / React",
    copy: "Demo tabs, founder command center, adaptive workflow stream, semantic extraction, tool traces, charts, recommendations, and review queue.",
  },
  {
    eyebrow: "API Layer",
    title: "FastAPI agent service",
    copy: "Routes founder questions, returns metrics and scenarios, orchestrates agents, exposes workflow results, and maintains review actions.",
  },
  {
    eyebrow: "Tool Layer",
    title: "Mock Stripe + operating tools",
    copy: "Stripe-like subscription and invoice tools, forecasting tools, expense analysis, customer-health tools, and investor summary tooling.",
  },
  {
    eyebrow: "AI Layer",
    title: "Semantic routing + OpenAI reasoning",
    copy: "Extracts intent and parameters, plans agent execution, synthesizes evidence, and produces grounded operating recommendations.",
  },
];

export default function ProjectDescription() {
  return (
    <div className="tab-stack">
      <Panel tone="blue" className="overview-panel">
        <p className="eyebrow">Project Overview</p>
        <h2>Agentic Startup Finance & Operations Platform</h2>
        <p className="lede">
          This demo models an AI-native operating layer for startup founders. A
          founder can ask a question about hiring, runway, revenue risk,
          overspending, activation drop-off, or board readiness. The system
          extracts intent, selects the right agents and tools, gathers evidence,
          and generates ranked recommendations with human review.
        </p>
        <div className="feature-row">
          {overviewCards.map(([icon, title, copy]) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon">{icon}</span>
              <div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <div className="two-col">
        <Panel>
          <p className="eyebrow">Problem</p>
          <h3>Startup operating decisions depend on fragmented signals</h3>
          <p>
            Founders often decide whether to hire, reduce spend, pursue
            collections, or prepare investor updates using disconnected views
            across billing, subscriptions, customer health, onboarding,
            expenses, and cash.
          </p>
          <p>
            Dashboards can show what happened, but they rarely explain what
            action matters most, which team should act, and how the decision
            affects runway or revenue risk.
          </p>
        </Panel>

        <Panel>
          <p className="eyebrow">Solution</p>
          <h3>Question → plan → tools → evidence → action</h3>
          <p>
            The platform converts founder questions into adaptive AI workflows.
            It identifies the operating intent, extracts parameters such as
            segment, role, expense type, and timeframe, then selects the agents
            and tools needed for the decision.
          </p>
          <p>
            The output is an explainable recommendation, not a generic chatbot
            answer. Every recommendation is tied to tool calls, evidence,
            confidence, financial impact, and a reviewable next step.
          </p>
        </Panel>
      </div>

      <Panel>
        <p className="eyebrow">How It Works</p>
        <h3>Adaptive finance and operations workflow</h3>
        <p>
          A founder starts with a natural-language question. The backend
          interprets the question, creates a dynamic workflow plan, calls the
          selected tools, streams agent activity, and synthesizes a
          recommendation for human approval.
        </p>

        <div className="feature-row-6">
          {workflowSteps.map((step) => (
            <article className="feature-card" key={step.title}>
              {/* <span className="feature-card-number">{step.number}</span> */}

              <span className="feature-icon">{step.icon}</span>

              <div>
                <strong>
                  {step.title.split(" ").map((word, index) => (
                    <span key={index}>
                      {word}
                      <br />
                    </span>
                  ))}
                </strong>

                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="eyebrow">System Architecture</p>
        <h3>Frontend, API, tool layer, and AI reasoning workflow</h3>
        <div className="architecture-grid">
          {architectureCards.map((card) => (
            <article className="architecture-card" key={card.title}>
              <p className="mini-eyebrow">{card.eyebrow}</p>
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="two-col">
        <Panel>
          <p className="eyebrow">Agent Workflow</p>
          <h3>Multi-agent operating model</h3>
          <ul className="clean-list compact">
            <li>
              <strong>Semantic router:</strong> converts free-form founder
              questions into structured intent and parameters.
            </li>
            <li>
              <strong>Planner:</strong> selects relevant agents and skips
              unrelated work based on the question.
            </li>
            <li>
              <strong>Revenue agent:</strong> calls Stripe-like subscription,
              invoice, and revenue-at-risk tools.
            </li>
            <li>
              <strong>Runway agent:</strong> models hiring, burn, cash balance,
              and runway impact.
            </li>
            <li>
              <strong>Operations agent:</strong> identifies overlapping or
              underutilized vendor spend.
            </li>
            <li>
              <strong>Growth risk agent:</strong> evaluates customer health,
              activation drop-off, and churn exposure.
            </li>
          </ul>
        </Panel>

        <Panel>
          <p className="eyebrow">Results & Impact</p>
          <h3>What the demo proves</h3>
          <ul className="clean-list compact">
            <li>
              Shows how agentic AI can move beyond chat into operational
              decision infrastructure.
            </li>
            <li>
              Connects Stripe-style billing data with runway, expense,
              activation, and customer-health signals.
            </li>
            <li>
              Explains which agents and tools were selected, skipped, and used
              to generate evidence.
            </li>
            <li>
              Ranks recommendations by impact, confidence, feedback weight, and
              review status.
            </li>
            <li>
              Demonstrates a human-in-the-loop path for finance and operating
              decisions.
            </li>
            <li>
              Provides a credible foundation for future Stripe sandbox, Plaid,
              CRM, and Slack integrations.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
