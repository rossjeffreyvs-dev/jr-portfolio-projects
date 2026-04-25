export default function PMPlaybook() {
  return (
    <div className="content-grid">
      <section className="panel">
        <p className="section-label">Product Strategy</p>
        <h2>Problem framing</h2>
        <p>
          Growth teams often have fragmented signals across analytics, CRM,
          support, billing, and product usage. This platform demonstrates how
          agentic workflows could turn those signals into explainable actions.
        </p>
      </section>

      <section className="panel">
        <p className="section-label">PM Decisions</p>
        <h2>What to evaluate</h2>
        <ul className="playbook-list">
          <li>Which customer signals predict activation or churn?</li>
          <li>Which interventions improve conversion to first value?</li>
          <li>Which actions should stay automated vs. human-reviewed?</li>
          <li>
            How should recommendations be explained to customer-facing teams?
          </li>
        </ul>
      </section>

      <section className="panel wide">
        <p className="section-label">Demo Narrative</p>
        <h2>Portfolio storyline</h2>
        <p>
          A customer signs up, product events stream into the lifecycle system,
          agents evaluate risk and opportunity, and the platform recommends a
          targeted intervention with supporting evidence.
        </p>
      </section>
    </div>
  );
}
