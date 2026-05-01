type PlaybookAgent = {
  index: string;
  icon: string;
  title: string;
  text: string;
};

type MvpStep = {
  index: string;
  icon: string;
  title: string;
  description: string;
};

const PLAYBOOK_CONTENT: {
  highlights: { icon: string; label: string }[];
  discovery: string[];
  strategy: string[];
  architecture: PlaybookAgent[];
  mvpSteps: MvpStep[];
  metrics: string[];
  risks: string[];
} = {
  highlights: [
    { icon: "🔎", label: "Discovery-led market workflow framing" },
    { icon: "🧪", label: "MVP scope and report generation loop" },
    { icon: "⚡", label: "Streaming UX and trust-building interaction design" },
    { icon: "🏦", label: "Financial-services platform fit" },
  ],
  discovery: [
    "FX users need faster ways to convert market movement and headlines into concise commentary.",
    "Analysts and client-facing teams often move across rate tools, news sources, and manual writing workflows.",
    "A successful MVP should reduce time-to-brief while preserving analyst review and confidence.",
  ],
  strategy: [
    "Position the product as an AI-assisted market intelligence workflow, not an autonomous trading recommendation engine.",
    "Keep the human in control by making inputs, data sources, progress stages, and generated output visible.",
    "Design the demo around a clear sequence: rates → news → synthesis → reviewable client summary.",
  ],
  architecture: [
    {
      index: "01",
      icon: "📈",
      title: "Rate Retrieval Agent",
      text: "Fetches current FX rates for selected base and quote currencies.",
    },
    {
      index: "02",
      icon: "📰",
      title: "Market News Agent",
      text: "Retrieves current headlines for selected countries or market regions.",
    },
    {
      index: "03",
      icon: "✨",
      title: "Insight Synthesis Agent",
      text: "Combines rate movement and qualitative context into a concise interpretation.",
    },
    {
      index: "04",
      icon: "✉️",
      title: "Report Generation Agent",
      text: "Formats the insight as a client-ready market summary.",
    },
    {
      index: "05",
      icon: "👤",
      title: "Review Layer",
      text: "Keeps the generated commentary visible, editable, and reviewable before use.",
    },
  ],
  mvpSteps: [
    {
      index: "01",
      icon: "🌐",
      title: "Select market inputs",
      description:
        "Choose base currency, quote currencies, and countries for market context.",
    },
    {
      index: "02",
      icon: "📊",
      title: "Retrieve market data",
      description:
        "Collect FX rates and recent headlines from the workflow service.",
    },
    {
      index: "03",
      icon: "⚡",
      title: "Stream progress",
      description:
        "Show stage-level progress while external data and AI generation run.",
    },
    {
      index: "04",
      icon: "📝",
      title: "Generate commentary",
      description:
        "Produce a concise client-ready market narrative grounded in retrieved context.",
    },
    {
      index: "05",
      icon: "✅",
      title: "Review output",
      description:
        "Let the analyst review, refine, and decide whether the summary is usable.",
    },
  ],
  metrics: [
    "Time to generate first usable market summary",
    "Report completion success rate",
    "Streaming workflow completion rate",
    "User copy/export rate",
    "Analyst confidence or usefulness rating",
  ],
  risks: [
    "Market data freshness and API reliability",
    "Hallucinated or unsupported commentary",
    "Over-positioning output as financial advice",
    "Latency across external APIs and LLM generation",
  ],
};

export default function FxPMPlaybook() {
  return (
    <div className="project-description pm-playbook">
      <section className="description-card overview-card pm-overview-card">
        <p className="description-eyebrow">PM Playbook</p>
        <h2>AI FX Market Intelligence</h2>
        <p className="description-lede">
          A product management view of the demo: how the workflow would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="description-highlight-grid playbook-highlight-grid">
          {PLAYBOOK_CONTENT.highlights.map((item) => (
            <div className="description-highlight" key={item.label}>
              <span className="playbook-pill-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="problem-solution-grid">
        <article className="description-card section-card">
          <p className="description-eyebrow">Discovery</p>
          <h3>Problem Framing & Discovery</h3>
          <ul className="check-list">
            {PLAYBOOK_CONTENT.discovery.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="description-card section-card">
          <p className="description-eyebrow">Strategy</p>
          <h3>Product Vision & Strategy</h3>
          <ul className="check-list">
            {PLAYBOOK_CONTENT.strategy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="description-card section-card">
        <p className="description-eyebrow">Solution Design</p>
        <h3>Agent Architecture</h3>
        <p className="description-lede compact">
          The product is designed as a multi-step workflow rather than a single
          black-box AI response.
        </p>

        <div className="fx-playbook-flow">
          {PLAYBOOK_CONTENT.architecture.map((agent) => (
            <article className="fx-playbook-flow-card" key={agent.title}>
              <span className="fx-step-index">{agent.index}</span>
              <div className="fx-playbook-flow-title">
                <span className="playbook-pill-icon" aria-hidden="true">
                  {agent.icon}
                </span>
                <strong>{agent.title}</strong>
              </div>
              <p>{agent.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="description-card section-card">
        <p className="description-eyebrow">MVP</p>
        <h3>What This Demo Proves</h3>
        <p className="description-lede compact">
          The MVP validates whether users can understand, trust, and act on an
          AI-assisted FX briefing workflow.
        </p>

        <div className="fx-mvp-grid">
          {PLAYBOOK_CONTENT.mvpSteps.map((step) => (
            <article className="fx-mvp-card" key={step.title}>
              <span className="fx-step-index">{step.index}</span>
              <div className="fx-playbook-flow-title">
                <span className="playbook-pill-icon" aria-hidden="true">
                  {step.icon}
                </span>
                <strong>{step.title}</strong>
              </div>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="takeaway-grid-section">
        <article className="description-card section-card">
          <p className="description-eyebrow">Measurement</p>
          <h3>Success Metrics</h3>
          <ul className="check-list">
            {PLAYBOOK_CONTENT.metrics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="description-card section-card">
          <p className="description-eyebrow">Risk</p>
          <h3>Product Risks & Guardrails</h3>
          <ul className="check-list">
            {PLAYBOOK_CONTENT.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="demo-note-card portfolio-signal-card">
        <div>
          <p>Portfolio signal</p>
          <h3>
            Shows product thinking across discovery, UX, AI orchestration,
            metrics, and platform deployment.
          </h3>
        </div>
        <span>
          PM framing → Agent workflow → Streaming UX → Measurable value
        </span>
      </section>
    </div>
  );
}
