import Panel from "./Panel";
import FeatureCardList from "./FeatureCardList";
// import FeatureListGrid from "./FeatureListGrid";

const playbookSteps = [
  {
    number: "01",
    icon: "📄",
    title: "Parse protocol criteria",
    description:
      "Convert dense eligibility language into structured criteria that can be reviewed and evaluated.",
  },
  {
    number: "02",
    icon: "👤",
    title: "Normalize patient evidence",
    description:
      "Map synthetic patient details to the evidence fields required for each inclusion and exclusion rule.",
  },
  {
    number: "03",
    icon: "🧠",
    title: "Explain eligibility reasoning",
    description:
      "Show criterion-level rationale, confidence, and evidence gaps instead of a black-box match score.",
  },
  {
    number: "04",
    icon: "⚖️",
    title: "Route uncertain cases",
    description:
      "Send ambiguous, incomplete, or higher-risk recommendations to a human review queue.",
  },
  {
    number: "05",
    icon: "📈",
    title: "Measure review quality",
    description:
      "Track reviewer agreement, evidence traceability, and screening-time reduction over time.",
  },
];

const mvpSteps = [
  {
    icon: "📄",
    title: "Criteria extraction",
    description:
      "Start with a focused set of inclusion and exclusion criteria from one active protocol.",
  },
  {
    icon: "👤",
    title: "Patient profile review",
    description:
      "Present the patient context needed to evaluate each rule clearly and consistently.",
  },
  {
    icon: "🧠",
    title: "Criterion reasoning",
    description:
      "Explain match, no-match, and uncertain decisions at the criterion level.",
  },
  {
    icon: "⚖️",
    title: "Human review queue",
    description:
      "Route uncertain or high-impact cases to the right reviewer with supporting evidence.",
  },
  {
    icon: "📈",
    title: "Decision feedback",
    description:
      "Capture approval, rejection, and reviewer notes to improve future workflow design.",
  },
];

const users = [
  "Buyer: clinical research leadership, trial operations, oncology program leadership, or digital health product teams.",
  "Primary users: research coordinators, trial nurses, clinical data reviewers, and physician investigators.",
  "Business need: reduce screening burden, improve evidence traceability, and prioritize patients who may qualify for active trials.",
];

const validations = [
  "Which criteria are most difficult for reviewers to interpret?",
  "Which patient data elements are most often missing or ambiguous?",
  "What confidence threshold should trigger human review?",
  "How much rationale does a coordinator need before acting?",
];

const metrics = [
  "Screening time reduced per patient",
  "Reviewer agreement with model recommendation",
  "Percentage of criteria with traceable supporting evidence",
  "Uncertain cases routed correctly to human review",
];

export default function PMPlaybook() {
  return (
    <div className="content-grid clinical-playbook-grid">
      <Panel
        eyebrow="PM Playbook"
        title="How I would productize clinical protocol reasoning"
        body="The PM goal is to turn complex eligibility criteria into a transparent, repeatable decision workflow."
        wide
      >
        <FeatureCardList items={playbookSteps} numbered columns={5} />
      </Panel>

      <Panel eyebrow="Buyer & User" title="Who this is for" bullets={users} />

      <Panel eyebrow="Product Strategy" title="Primary product bet">
        <p>
          The product differentiator is not simply trial matching. It is
          transparent protocol reasoning: showing how each criterion was
          interpreted, which patient evidence was used, and where confidence is
          low.
        </p>
      </Panel>

      <Panel
        eyebrow="MVP Scope"
        title="What I would build first"
        body="The first version should focus on one high-value loop: evaluate a patient against an active protocol, explain each inclusion and exclusion decision, and route uncertain cases for human review."
        wide
      >
        <FeatureCardList items={mvpSteps} columns={5} />
      </Panel>

      <Panel
        eyebrow="Key PM Questions"
        title="What to validate"
        bullets={validations}
      />

      <Panel
        eyebrow="Evaluation Metrics"
        title="How success should be measured"
        bullets={metrics}
      />
    </div>
  );
}
