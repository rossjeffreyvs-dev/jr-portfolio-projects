const playbookSteps = [
  {
    index: "01",
    icon: "📄",
    label: "Parse protocol criteria",
    description:
      "Convert dense eligibility language into structured criteria that can be reviewed and evaluated.",
  },
  {
    index: "02",
    icon: "👤",
    label: "Normalize patient evidence",
    description:
      "Map synthetic patient details to the evidence fields required for each inclusion and exclusion rule.",
  },
  {
    index: "03",
    icon: "🧠",
    label: "Explain eligibility reasoning",
    description:
      "Show criterion-level rationale, confidence, and evidence gaps instead of a black-box match score.",
  },
  {
    index: "04",
    icon: "⚖️",
    label: "Route uncertain cases",
    description:
      "Send ambiguous, incomplete, or higher-risk recommendations to a human review queue.",
  },
  {
    index: "05",
    icon: "📈",
    label: "Measure review quality",
    description:
      "Track reviewer agreement, evidence traceability, and screening-time reduction over time.",
  },
];

const mvpSteps = [
  {
    icon: "📄",
    label: "Criteria extraction",
    description:
      "Start with a focused set of inclusion and exclusion criteria from one active protocol.",
  },
  {
    icon: "👤",
    label: "Patient profile review",
    description:
      "Present the patient context needed to evaluate each rule clearly and consistently.",
  },
  {
    icon: "🧠",
    label: "Criterion reasoning",
    description:
      "Explain match, no-match, and uncertain decisions at the criterion level.",
  },
  {
    icon: "⚖️",
    label: "Human review queue",
    description:
      "Route uncertain or high-impact cases to the right reviewer with supporting evidence.",
  },
  {
    icon: "📈",
    label: "Decision feedback",
    description:
      "Capture approval, rejection, and reviewer notes to improve future workflow design.",
  },
];

export default function PMPlaybook() {
  return (
    <div className="content-grid clinical-playbook-grid">
      <section className="panel wide clinical-playbook-overview section-emphasis">
        <p className="section-label">PM Playbook</p>
        <h2>How I would productize clinical protocol reasoning</h2>
        <p>
          The PM goal is to turn complex eligibility criteria into a
          transparent, repeatable decision workflow. The product should help
          clinical teams understand how criteria were interpreted, which patient
          evidence was used, and when a case should move to human review.
        </p>

        <div
          className="claude-playbook-flow"
          aria-label="Productized protocol reasoning flow"
        >
          {playbookSteps.map((step) => (
            <article className="claude-playbook-flow-card" key={step.label}>
              <span className="clinical-playbook-step-index">{step.index}</span>

              <div className="claude-playbook-flow-title">
                <span
                  className="clinical-playbook-pill-icon"
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
                <strong>{step.label}</strong>
              </div>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel section-soft">
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

      <section className="panel section-soft">
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
        <p className="section-subtext">
          The first version should focus on one high-value loop: evaluate a
          patient against an active protocol, explain each inclusion and
          exclusion decision, and route uncertain cases for human review.
        </p>

        <div className="claude-mvp-grid" aria-label="MVP scope steps">
          {mvpSteps.map((step) => (
            <article className="claude-mvp-card" key={step.label}>
              <div className="claude-mvp-title">
                <span
                  className="clinical-playbook-pill-icon"
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
                <strong>{step.label}</strong>
              </div>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
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
