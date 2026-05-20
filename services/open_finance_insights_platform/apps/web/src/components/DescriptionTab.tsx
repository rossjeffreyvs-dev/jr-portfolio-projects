const overviewCards = [
  {
    icon: "🏦",
    title: "Data ingest",
    body: "Mock Plaid-style institutions, accounts, balances, and transactions enter the platform as fragmented source records.",
  },
  {
    icon: "🧩",
    title: "Common model",
    body: "Source data is normalized into account, institution, merchant, transaction, category, cash-flow, and signal entities.",
  },
  {
    icon: "📊",
    title: "Insight tools",
    body: "Deterministic services detect recurring charges, calculate runway, summarize cash flow, and identify financial health signals.",
  },
  {
    icon: "🤖",
    title: "AI workflow",
    body: "An explainable agent workflow calls the right tools, streams progress, and generates recommendations for review.",
  },
  {
    icon: "✅",
    title: "Review layer",
    body: "Recommendations are surfaced as ranked risks and opportunities rather than a generic budgeting chatbot response.",
  },
];

const workflowSteps = [
  {
    icon: "01",
    title: "Ingest",
    body: "Load accounts, balances, institutions, and raw transactions.",
  },
  {
    icon: "02",
    title: "Normalize",
    body: "Map raw data into the financial CDM.",
  },
  {
    icon: "03",
    title: "Enrich",
    body: "Attach merchant, category, and recurrence metadata.",
  },
  {
    icon: "04",
    title: "Analyze",
    body: "Calculate cash-flow, runway, volatility, and subscription signals.",
  },
  {
    icon: "05",
    title: "Recommend",
    body: "Rank risks and opportunities with evidence.",
  },
];

export default function DescriptionTab() {
  return (
    <section id="project-description" className="tab-stack">
      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">Project overview</p>
        <h2>Open Finance Insights Platform</h2>
        <p>
          This demo models how open finance products convert fragmented account
          and transaction feeds into normalized, application-ready intelligence.
          The product emphasis is not a chatbot — it is the data platform and
          workflow layer that makes account intelligence reliable, explainable,
          and usable by downstream products.
        </p>
        <div className="feature-row">
          {overviewCards.map((card) => (
            <div className="feature-card" key={card.title}>
              <span className="feature-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="section-grid">
        <article className="panel">
          <p className="eyebrow">Problem</p>
          <h2>Financial data arrives fragmented and hard to reason over</h2>
          <p>
            Account, balance, merchant, and transaction records often arrive
            with inconsistent naming, category, and timing patterns. Product
            teams need a normalized operational model before they can build
            credible affordability, cash-flow, lending, underwriting, or
            financial-health experiences.
          </p>
          <p>
            Raw transactions can show what happened, but they rarely explain
            which patterns matter, which signals should be trusted, or what
            product action should happen next.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Solution</p>
          <h2>Source data → CDM → explainable insight workflow</h2>
          <p>
            The platform ingests synthetic open-finance data, normalizes it into
            a reusable common financial data model, then runs an explainable
            workflow that calls analysis tools and produces ranked signals.
          </p>
          <p>
            The output is a product-ready recommendation layer: recurring
            charges, cash-flow runway, income volatility, subscription risk,
            category trends, and financial-health opportunities.
          </p>
        </article>
      </div>

      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">How it works</p>
        <h2>Common financial data model and agent workflow</h2>
        <p>
          The architecture mirrors common data model thinking from healthcare
          and enterprise data platforms: preserve raw source data, map it into
          stable entities, enrich the model with derived signals, and expose a
          workflow layer that makes the reasoning auditable.
        </p>
        <div className="feature-row compact-grid">
          {workflowSteps.map((step) => (
            <div className="feature-card step-card" key={step.title}>
              <span className="step-number">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
