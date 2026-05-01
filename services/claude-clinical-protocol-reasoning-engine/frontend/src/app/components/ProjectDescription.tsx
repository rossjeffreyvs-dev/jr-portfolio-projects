const overviewFeatures = [
  {
    icon: "📄",
    label: "Protocol criteria parsing",
  },
  {
    icon: "👤",
    label: "Patient profile normalization",
  },
  {
    icon: "✅",
    label: "Criterion-level reasoning",
  },
  {
    icon: "↗️",
    label: "Human review escalation",
  },
];

const workflowSteps = [
  {
    index: "01",
    icon: "📄",
    title: "Protocol loaded",
    description:
      "A structured trial protocol is selected and eligibility criteria are prepared for review.",
  },
  {
    index: "02",
    icon: "👤",
    title: "Patient evidence reviewed",
    description:
      "Synthetic patient details are normalized into the fields needed for criterion evaluation.",
  },
  {
    index: "03",
    icon: "✅",
    title: "Criteria evaluated",
    description:
      "Each inclusion and exclusion rule is checked with rationale, confidence, and evidence context.",
  },
  {
    index: "04",
    icon: "↗️",
    title: "Review flagged",
    description:
      "Ambiguous or low-confidence cases are routed for human review instead of being auto-decided.",
  },
];

export default function ProjectDescription() {
  return (
    <div className="description-stack">
      <section className="description-card claude-overview-card section-emphasis">
        <p className="section-label">Project Overview</p>
        <h2>Claude Clinical Protocol Reasoning & Eligibility Platform</h2>

        <p>
          This demo models a clinical protocol reasoning workflow where dense
          eligibility criteria, synthetic patient records, and explainable AI
          reasoning are brought together to support transparent trial-screening
          decisions.
        </p>

        <p>
          The system shows how a clinical or research team can move from
          protocol interpretation to patient evidence review, criterion-level
          reasoning, human escalation, and auditable eligibility output.
        </p>

        <div className="claude-feature-grid">
          {overviewFeatures.map((feature) => (
            <article key={feature.label}>
              <span className="insight-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <strong>{feature.label}</strong>
            </article>
          ))}
        </div>
      </section>

      <div className="content-grid">
        <section className="description-card section-soft">
          <p className="section-label">Problem</p>
          <h2>Protocol eligibility is hard to interpret consistently</h2>
          <p>
            Trial criteria often contain nuanced medical language, exceptions,
            timing requirements, and ambiguous evidence needs. Research teams
            must compare those criteria against fragmented patient information
            while maintaining explainability and reviewability.
          </p>
        </section>

        <section className="description-card section-soft">
          <p className="section-label">Solution</p>
          <h2>Protocol → evidence → reasoning → recommendation</h2>
          <p>
            The platform parses protocol criteria, normalizes synthetic patient
            records, evaluates each eligibility requirement, and produces a
            transparent recommendation with rationale, confidence, and review
            flags for uncertain cases.
          </p>
        </section>

        <section className="description-card wide claude-workflow-card">
          <p className="section-label">How it works</p>
          <h2>Clinical reasoning workflow</h2>
          <p className="section-subtext">
            A user selects a trial and patient, runs an evaluation, and watches
            the reasoning trace progress from protocol parsing to final review
            routing.
          </p>

          <div
            className="claude-workflow-list"
            aria-label="Clinical reasoning workflow steps"
          >
            {workflowSteps.map((step) => (
              <article className="claude-workflow-step" key={step.title}>
                <span className="workflow-step-index">{step.index}</span>
                <div className="workflow-step-body">
                  <div className="workflow-step-title">
                    <span aria-hidden="true">{step.icon}</span>
                    <strong>{step.title}</strong>
                  </div>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
