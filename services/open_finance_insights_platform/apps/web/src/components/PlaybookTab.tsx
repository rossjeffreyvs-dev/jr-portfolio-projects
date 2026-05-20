const productizationSteps = [
  {
    icon: "👤",
    title: "Define user job",
    body: "Clarify whether the user is solving cash-flow planning, affordability, lending readiness, expense management, or financial-health monitoring.",
  },
  {
    icon: "🧩",
    title: "Normalize data",
    body: "Create a stable CDM so insights are not tightly coupled to a single provider payload or transaction format.",
  },
  {
    icon: "🛠️",
    title: "Select tools",
    body: "Route analysis to deterministic services for recurring payments, merchant normalization, cash-flow, category trends, and risk scoring.",
  },
  {
    icon: "📈",
    title: "Rank signals",
    body: "Prioritize recommendations by severity, confidence, customer impact, and ability to take action.",
  },
  {
    icon: "✅",
    title: "Route review",
    body: "Expose evidence, assumptions, and next steps before any user-facing financial recommendation is accepted.",
  },
];

const mvpItems = [
  {
    icon: "🏦",
    title: "Institution + account ingest",
    body: "Synthetic Plaid-style account and balance payloads.",
  },
  {
    icon: "💳",
    title: "Transaction normalization",
    body: "Raw records mapped into stable transaction, merchant, and category entities.",
  },
  {
    icon: "🔁",
    title: "Recurring payment detection",
    body: "Subscriptions, utilities, payroll, and debt obligations.",
  },
  {
    icon: "📊",
    title: "Cash-flow summary",
    body: "Monthly inflows, outflows, runway, and volatility.",
  },
  {
    icon: "🚦",
    title: "Financial signals",
    body: "Risk and opportunity signals with confidence and evidence.",
  },
  {
    icon: "🤖",
    title: "Workflow stream",
    body: "Visible tool calls and recommendation generation.",
  },
];

export default function PlaybookTab() {
  return (
    <section className="tab-stack">
      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">PM playbook</p>
        <h2>How I would productize this platform</h2>
        <p>
          The PM goal is to turn fragmented financial data into an explainable
          decision layer. The product should help developers and
          financial-product teams understand what changed, why it matters, which
          data and tools were used, and what action should be reviewed before
          surfacing a recommendation.
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
          <h2>Primary product bet</h2>
          <p>
            The core bet is that financial applications need a reusable
            intelligence layer between raw open-finance connectivity and
            end-user product experiences. A normalized model makes downstream
            use cases faster to build and easier to audit.
          </p>
          <p>
            This positions the platform for Plaid-style developer
            infrastructure, but also makes it relevant to Stripe, Ramp, Brex,
            Mercury, and fintech operations tools.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Agent workflow</p>
          <h2>Explainable multi-tool operating model</h2>
          <ul className="plain-list">
            <li>
              <strong>Buyer:</strong> developers, fintech product teams,
              financial operations teams, and risk/credit teams.
            </li>
            <li>
              <strong>Primary users:</strong> PMs, analysts, support teams, and
              workflow operators reviewing financial signals.
            </li>
            <li>
              <strong>Business need:</strong> trusted financial insights
              grounded in normalized data and auditable tool outputs.
            </li>
          </ul>
        </article>
      </div>

      <article className="panel full-span">
        <p className="eyebrow">MVP scope</p>
        <h2>What I would build first</h2>
        <p>
          The first version should focus on five high-value workflows: normalize
          accounts and transactions, detect recurring payments, summarize cash
          flow, flag risk/opportunity signals, and generate an explainable
          recommendation panel. Everything else should support that loop.
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
    </section>
  );
}
