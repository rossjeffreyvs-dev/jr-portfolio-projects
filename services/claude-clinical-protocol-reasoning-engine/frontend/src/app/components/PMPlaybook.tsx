const playbookSteps = [
  { icon: "📄", label: "Parse protocol criteria" },
  { icon: "👤", label: "Normalize patient evidence" },
  { icon: "🧠", label: "Explain eligibility reasoning" },
  { icon: "⚖️", label: "Route uncertain cases" },
  { icon: "📈", label: "Measure review quality" },
];

export default function PMPlaybook() {
  return (
    <div className="content-grid clinical-playbook-grid">
      <section className="panel wide clinical-playbook-overview">
        <p className="section-label">PM Playbook</p>
        <h2>How I would productize clinical protocol reasoning</h2>
        <p>
          The PM goal is to turn complex eligibility criteria into a
          transparent, repeatable decision workflow. The product should help
          clinical teams understand how criteria were interpreted, which patient
          evidence was used, and when a case should move to human review.
        </p>

        <div className="clinical-playbook-strip">
          {playbookSteps.map((step) => (
            <div className="clinical-playbook-pill" key={step.label}>
              <span>{step.icon}</span>
              <strong>{step.label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="section-label">Buyer & User</p>
        <h2>Who this is for</h2>
        <ul className="playbook-list">
          <li>
            <strong>Buyer:</strong> clinical research leadership, trial
            operations, oncology program leadership, or digital health product
            teams.
          </li>
          <li>
            <strong>Primary users:</strong> research coordinators, trial nurses,
            clinical data reviewers, and physician investigators.
          </li>
          <li>
            <strong>Business need:</strong> reduce screening burden, improve
            evidence traceability, and prioritize patients who may qualify for
            active trials.
          </li>
        </ul>
      </section>

      <section className="panel">
        <p className="section-label">Product Strategy</p>
        <h2>Primary product bet</h2>
        <p>
          The product differentiator is not simply trial matching. It is
          transparent protocol reasoning: showing how each criterion was
          interpreted, which patient evidence was used, and where confidence is
          low.
        </p>
      </section>

      <section className="panel wide">
        <p className="section-label">MVP Scope</p>
        <h2>What I would build first</h2>

        <div className="clinical-flow-row">
          <span>📄 Criteria extraction</span>
          <span>👤 Patient profile review</span>
          <span>🧠 Criterion reasoning</span>
          <span>⚖️ Human review queue</span>
          <span>📈 Decision feedback</span>
        </div>

        <p>
          The first version should focus on one high-value loop: evaluate a
          patient against an active protocol, explain each inclusion and
          exclusion decision, and route uncertain cases for human review.
        </p>
      </section>

      <section className="panel">
        <p className="section-label">Key PM Questions</p>
        <h2>What to validate</h2>
        <ul className="playbook-list">
          <li>Which criteria are most difficult for reviewers to interpret?</li>
          <li>
            Which patient data elements are most often missing or ambiguous?
          </li>
          <li>What confidence threshold should trigger human review?</li>
          <li>How much rationale does a coordinator need before acting?</li>
        </ul>
      </section>

      <section className="panel">
        <p className="section-label">Evaluation Metrics</p>
        <h2>How success should be measured</h2>
        <ul className="playbook-list">
          <li>Screening time reduced per patient</li>
          <li>Reviewer agreement with model recommendation</li>
          <li>Percentage of criteria with traceable supporting evidence</li>
          <li>Uncertain cases routed correctly to human review</li>
        </ul>
      </section>
    </div>
  );
}
