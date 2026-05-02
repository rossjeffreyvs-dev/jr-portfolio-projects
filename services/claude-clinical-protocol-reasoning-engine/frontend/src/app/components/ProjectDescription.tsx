import Panel from "./Panel";
import StepList from "./StepList";

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
    number: "01",
    icon: "📄",
    title: "Protocol loaded",
    description:
      "A structured trial protocol is selected and eligibility criteria are prepared for review.",
  },
  {
    number: "02",
    icon: "👤",
    title: "Patient evidence reviewed",
    description:
      "Synthetic patient details are normalized into the fields needed for criterion evaluation.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Criteria evaluated",
    description:
      "Each inclusion and exclusion rule is checked with rationale, confidence, and evidence context.",
  },
  {
    number: "04",
    icon: "↗️",
    title: "Review flagged",
    description:
      "Ambiguous or low-confidence cases are routed for human review instead of being auto-decided.",
  },
];

export default function ProjectDescription() {
  return (
    <div className="content-grid">
      <section className="panel wide panel-accent-blue">
        <p className="section-label">Project Overview</p>
        <h2 className="feature-title">
          Claude Reasoning & Eligibility Platform
        </h2>
        <p>
          This demo models a clinical protocol reasoning workflow where dense
          eligibility criteria, synthetic patient records, and explainable AI
          reasoning are brought together to support transparent trial-screening
          decisions. The system shows how a clinical or research team can move
          from protocol interpretation to patient evidence review,
          criterion-level reasoning, human escalation, and auditable eligibility
          output.
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

      <Panel
        eyebrow="Problem"
        title="Protocol eligibility is hard to interpret consistently"
      >
        <p>
          Trial criteria often contain nuanced medical language, exceptions,
          timing requirements, and ambiguous evidence needs. Research teams must
          compare those criteria against fragmented patient information while
          maintaining explainability and reviewability.
        </p>
      </Panel>

      <Panel
        eyebrow="Solution"
        title="Protocol → evidence → reasoning → recommendation"
      >
        <p>
          The platform parses protocol criteria, normalizes synthetic patient
          records, evaluates each eligibility requirement, and produces a
          transparent recommendation with rationale, confidence, and review
          flags for uncertain cases.
        </p>
      </Panel>

      <Panel
        eyebrow="How it works"
        title="Clinical reasoning workflow"
        body="A user selects a trial and patient, runs an evaluation, and watches the reasoning trace progress from protocol parsing to final review routing."
        wide
      >
        <StepList items={workflowSteps} />
      </Panel>
    </div>
  );
}
