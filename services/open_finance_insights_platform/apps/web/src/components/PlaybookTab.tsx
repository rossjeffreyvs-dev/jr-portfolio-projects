const productizationSteps = [
  {
    icon: "👤",
    title: "Define the financial workflow",
    body: "Clarify whether the platform supports affordability, financial health, expense management, underwriting, lending readiness, or operational finance workflows.",
  },
  {
    icon: "🧩",
    title: "Normalize provider data",
    body: "Create a reusable common financial data model so workflows are not tightly coupled to a single provider schema or payload shape.",
  },
  {
    icon: "🛠️",
    title: "Coordinate insight tools",
    body: "Route analysis to deterministic services for merchant normalization, recurring detection, cash-flow analysis, volatility scoring, and signal ranking.",
  },
  {
    icon: "📈",
    title: "Generate explainable signals",
    body: "Surface evidence-backed risks and opportunities with confidence, workflow traces, and recommendation context.",
  },
  {
    icon: "✅",
    title: "Keep humans in the loop",
    body: "Expose assumptions, evidence, and next-step recommendations before any financial action is accepted or automated.",
  },
];

const mvpItems = [
  {
    icon: "🏦",
    title: "Institution + account ingest",
    body: "Synthetic Plaid-style institution, account, and balance payloads.",
  },
  {
    icon: "💳",
    title: "Transaction normalization",
    body: "Provider records mapped into stable transaction, merchant, and category entities.",
  },
  {
    icon: "🔁",
    title: "Recurring payment detection",
    body: "Subscriptions, payroll, utilities, debt obligations, and recurring charges.",
  },
  {
    icon: "📊",
    title: "Cash-flow analysis",
    body: "Runway, inflow/outflow summaries, discretionary spend, and volatility tracking.",
  },
  {
    icon: "🚦",
    title: "Financial-health signals",
    body: "Evidence-backed opportunity and risk scoring.",
  },
  {
    icon: "🤖",
    title: "Workflow streaming",
    body: "Visible tool calls, orchestration steps, and recommendation generation.",
  },
];

const roadmapItems = [
  {
    title: "Plaid Sandbox integration",
    body: "Replace synthetic ingest with institution-linked sandbox accounts and transactions.",
  },
  {
    title: "Webhook-driven workflows",
    body: "Trigger workflows from deposits, invoice events, failed renewals, or balance changes.",
  },
  {
    title: "Semantic financial memory",
    body: "Add embeddings and retrieval to support longitudinal financial context.",
  },
  {
    title: "Adaptive personalization",
    body: "Rank recommendations based on prior workflow outcomes and user feedback.",
  },
  {
    title: "Operational review tooling",
    body: "Expand audit trails, recommendation review, and workflow governance.",
  },
  {
    title: "Institution sync monitoring",
    body: "Track provider reliability, stale account data, and ingestion failures.",
  },
];

export default function PlaybookTab() {
  return (
    <section className="tab-stack">
      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">PM playbook</p>

        <h2>How I would productize this platform</h2>

        <p>
          The product goal is to transform fragmented financial connectivity
          into a reusable intelligence layer for developers, fintech product
          teams, operations teams, and workflow operators. The system should
          help users understand what changed, why it matters, which tools were
          used, and what recommendation should be reviewed before taking action.
        </p>

        <div className="feature-row">
          {productizationSteps.map((step) => (
            <div className="feature-card" key={step.title}>
              <span className="feature-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="section-grid">
        <article className="panel">
          <p className="eyebrow">Product strategy</p>

          <h2>The primary product bet</h2>

          <p>
            The core product bet is that modern financial applications need a
            reusable intelligence layer between raw financial connectivity and
            end-user experiences. A normalized financial model makes downstream
            workflows faster to build, easier to audit, and more adaptable
            across multiple products.
          </p>

          <p>
            The platform is intentionally positioned between open-finance
            infrastructure and AI-native financial operations tooling — making
            it relevant to developer platforms, operational finance products,
            and workflow-oriented fintech systems.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Explainable AI workflows</p>

          <h2>Reasoning visibility as a trust mechanism</h2>

          <ul className="plain-list">
            <li>
              <strong>Buyer:</strong> fintech product teams, developers,
              operational finance teams, lending platforms, and workflow
              operators.
            </li>
            <li>
              <strong>Primary users:</strong> PMs, analysts, support teams, risk
              reviewers, and operations workflows.
            </li>
            <li>
              <strong>Key principle:</strong> recommendations should remain
              explainable, inspectable, and review-oriented rather than opaque
              autonomous outputs.
            </li>
          </ul>
        </article>
      </div>

      <article className="panel full-span">
        <p className="eyebrow">MVP scope</p>

        <h2>What I would build first</h2>

        <p>
          The initial release should focus on a small number of high-value,
          explainable workflows: normalize transactions, detect recurring
          charges, summarize cash flow, surface operational financial-health
          signals, and generate evidence-backed recommendations.
        </p>

        <div className="feature-row feature-row-6 compact-grid">
          {mvpItems.map((item) => (
            <div className="feature-card" key={item.title}>
              <span className="feature-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="section-grid">
        <article className="panel">
          <p className="eyebrow">Operational risks</p>

          <h2>Areas requiring strong governance</h2>

          <ul className="plain-list">
            <li>
              <strong>Merchant ambiguity:</strong> providers often expose noisy
              or inconsistent merchant naming.
            </li>
            <li>
              <strong>Recurring detection drift:</strong> false positives can
              reduce user trust quickly.
            </li>
            <li>
              <strong>Recommendation confidence:</strong> financial workflows
              should expose uncertainty instead of overconfident outputs.
            </li>
            <li>
              <strong>Workflow explainability:</strong> operators need visible
              evidence and reasoning traces.
            </li>
          </ul>
        </article>

        <article className="panel">
          <p className="eyebrow">Success metrics</p>

          <h2>Signals I would monitor closely</h2>

          <ul className="plain-list">
            <li>
              <strong>Workflow completion rate</strong>
            </li>
            <li>
              <strong>Recurring-payment detection precision</strong>
            </li>
            <li>
              <strong>Recommendation acceptance rate</strong>
            </li>
            <li>
              <strong>Merchant normalization accuracy</strong>
            </li>
            <li>
              <strong>User trust and review engagement</strong>
            </li>
          </ul>
        </article>
      </div>

      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">Future roadmap</p>

        <h2>Where the platform could evolve next</h2>

        <div className="feature-row feature-row-6 compact-grid">
          {roadmapItems.map((item) => (
            <div className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
