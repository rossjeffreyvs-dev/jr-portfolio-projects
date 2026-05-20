const overviewCards = [
  {
    icon: "🏦",
    title: "Financial connectivity",
    body: "Mock Plaid-style institutions, accounts, balances, and transactions enter the platform as fragmented source records from multiple providers and schemas.",
  },
  {
    icon: "🧩",
    title: "Open finance CDM",
    body: "Source records are normalized into reusable account, institution, merchant, transaction, category, cash-flow, and signal entities.",
  },
  {
    icon: "📊",
    title: "Deterministic insight tools",
    body: "Recurring payment detection, cash-flow analysis, runway estimation, merchant enrichment, and affordability signals are generated through explainable services.",
  },
  {
    icon: "🤖",
    title: "AI workflow orchestration",
    body: "An agent workflow plans tool execution, streams workflow progress, surfaces evidence, and generates review-oriented recommendations.",
  },
  {
    icon: "✅",
    title: "Explainable recommendation layer",
    body: "Signals are surfaced as evidence-backed risks and opportunities instead of opaque chatbot-style financial advice.",
  },
];

const workflowSteps = [
  {
    icon: "01",
    title: "Ingest",
    body: "Load accounts, balances, institutions, and raw transactions from connected financial providers.",
  },
  {
    icon: "02",
    title: "Normalize",
    body: "Map provider-specific payloads into a reusable common financial data model.",
  },
  {
    icon: "03",
    title: "Enrich",
    body: "Attach merchant, category, recurrence, and cash-flow metadata.",
  },
  {
    icon: "04",
    title: "Analyze",
    body: "Calculate runway, volatility, subscription exposure, affordability, and financial-health signals.",
  },
  {
    icon: "05",
    title: "Recommend",
    body: "Generate explainable product recommendations with visible workflow traces and evidence.",
  },
];

const architectureItems = [
  {
    title: "Frontend",
    body: "Next.js operational dashboard with workflow streaming, recommendation panels, and explainable insight visualization.",
  },
  {
    title: "API layer",
    body: "FastAPI services expose normalized financial entities, workflow orchestration, and deterministic insight tools.",
  },
  {
    title: "Normalization engine",
    body: "Transforms fragmented provider payloads into reusable financial entities and derived operational signals.",
  },
  {
    title: "Workflow orchestrator",
    body: "Coordinates tool execution, workflow sequencing, streaming updates, and recommendation generation.",
  },
  {
    title: "Insight tools",
    body: "Recurring payment detection, merchant normalization, cash-flow analysis, category analysis, and risk scoring.",
  },
  {
    title: "Recommendation layer",
    body: "Produces explainable operational recommendations designed for review rather than autonomous financial action.",
  },
];

export default function DescriptionTab() {
  return (
    <section id="project-description" className="tab-stack">
      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">Project overview</p>

        <h2>AI-powered open finance intelligence platform</h2>

        <p>
          This project models how modern open-finance platforms transform
          fragmented account and transaction feeds into normalized,
          application-ready intelligence. The emphasis is not a generic
          budgeting chatbot — it is the reusable data platform and workflow
          layer that makes financial insights explainable, auditable, and safe
          for downstream product experiences.
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

          <h2>
            Financial data arrives fragmented and difficult to operationalize
          </h2>

          <p>
            Financial data providers expose accounts, balances, merchants, and
            transactions through inconsistent schemas, naming conventions,
            category systems, and timing patterns. Product teams often inherit
            raw transactional data without the operational context needed to
            build reliable financial experiences.
          </p>

          <p>
            Raw transactions can show what happened, but they rarely explain
            which patterns matter, which recommendations should be trusted, or
            what workflow action should happen next.
          </p>
        </article>

        <article className="panel">
          <p className="eyebrow">Solution</p>

          <h2>Normalize first, reason second</h2>

          <p>
            The platform ingests synthetic open-finance data, maps it into a
            reusable common financial data model, enriches entities with derived
            metadata, and then runs an explainable workflow that coordinates
            deterministic financial analysis tools.
          </p>

          <p>
            The output becomes a reusable recommendation layer: recurring
            charges, income volatility, subscription exposure, runway,
            affordability signals, and evidence-backed financial-health
            opportunities.
          </p>
        </article>
      </div>

      <article className="panel panel-blue overview-panel full-span">
        <p className="eyebrow">Open finance common data model</p>

        <h2>
          Reusable financial entities and explainable workflow orchestration
        </h2>

        <p>
          The architecture mirrors common data model patterns used in healthcare
          and enterprise data systems: preserve raw provider payloads, normalize
          them into stable operational entities, enrich them with derived
          signals, and expose a workflow layer that keeps recommendations
          inspectable and auditable.
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

      <article className="panel full-span">
        <p className="eyebrow">System architecture</p>

        <h2>AI-native financial data and workflow platform</h2>

        <div className="feature-row feature-row-6 compact-grid">
          {architectureItems.map((item) => (
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
