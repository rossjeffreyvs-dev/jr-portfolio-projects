const PLAYBOOK_CONTENT = {
  highlights: [
    "Discovery-led market workflow framing",
    "MVP scope and report generation loop",
    "Streaming UX and trust-building interaction design",
    "Financial-services platform fit",
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
      title: "Rate Retrieval Agent",
      text: "Fetches current FX rates for selected base and quote currencies.",
    },
    {
      title: "Market News Agent",
      text: "Retrieves current headlines for selected countries or market regions.",
    },
    {
      title: "Insight Synthesis Agent",
      text: "Combines rate movement and qualitative context into a concise interpretation.",
    },
    {
      title: "Report Generation Agent",
      text: "Formats the insight as a client-ready market summary.",
    },
    {
      title: "Review Layer",
      text: "Keeps the generated commentary visible, editable, and reviewable before use.",
    },
  ],
  mvpSteps: [
    "Select base currency, quote currencies, and countries",
    "Retrieve FX rates and market headlines",
    "Stream generation progress to the UI",
    "Produce client-ready commentary",
    "Review and refine output",
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
      <section className="description-card overview-card">
        <p className="description-eyebrow">PM Playbook</p>
        <h2>AI FX Market Intelligence</h2>
        <p className="description-lede">
          A product management view of the demo: how the workflow would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="description-highlight-grid playbook-highlight-grid">
          {PLAYBOOK_CONTENT.highlights.map((item) => (
            <div className="description-highlight" key={item}>
              <span>{item}</span>
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

        <div className="agent-grid playbook-agent-grid">
          {PLAYBOOK_CONTENT.architecture.map((agent) => (
            <article className="agent-card agent-blue" key={agent.title}>
              <h4>{agent.title}</h4>
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

        <div className="workflow-step-grid">
          {PLAYBOOK_CONTENT.mvpSteps.map((step, index) => (
            <div className="workflow-step-pair" key={step}>
              <article className="workflow-step-card">
                <p>
                  {index + 1}. {step}
                </p>
                <h4>{step}</h4>
              </article>
              {index < PLAYBOOK_CONTENT.mvpSteps.length - 1 ? (
                <div className="workflow-arrow">→</div>
              ) : null}
            </div>
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

      <section className="demo-note-card">
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
