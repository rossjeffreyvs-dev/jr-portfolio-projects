import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import FeatureCardGrid from "./FeatureCardList";

const playbookHighlights = [
  {
    icon: "🎯",
    label: "Candidate problem framing",
  },
  {
    icon: "🧩",
    label: "MVP workflow scope",
  },
  {
    icon: "🛡️",
    label: "Trust and explainability",
  },
  {
    icon: "🔁",
    label: "Feedback-driven iteration",
  },
];

const productSteps = [
  {
    number: "01",
    icon: "🧾",
    title: "Input job description",
    description:
      "Start with the target role so the product can anchor feedback in real requirements.",
  },
  {
    number: "02",
    icon: "📄",
    title: "Upload resume",
    description:
      "Capture the candidate source document without forcing manual re-entry.",
  },
  {
    number: "03",
    icon: "🔎",
    title: "Extract text",
    description:
      "Parse the uploaded file into clean text for repeatable comparison.",
  },
  {
    number: "04",
    icon: "🧠",
    title: "Generate report",
    description:
      "Summarize fit, strengths, gaps, and role-specific recommendations.",
  },
  {
    number: "05",
    icon: "✅",
    title: "Review guidance",
    description:
      "Help the user act on the analysis with clear next steps and editable feedback.",
  },
];

const discoveryBullets = [
  "Candidates need faster feedback on role fit.",
  "Resume gaps are hard to identify from a job description alone.",
  "Users need actionable guidance, not generic resume advice.",
];

const strategyBullets = [
  "Position as an assistant, not an automated hiring decision.",
  "Make the comparison transparent and easy to review.",
  "Focus on strengths, gaps, and rewrite opportunities.",
];

const metricBullets = [
  "Report generation completion rate",
  "User copy/download rate",
  "Perceived usefulness rating",
  "Repeat analysis frequency",
];

const riskBullets = [
  "Avoid presenting analysis as hiring certainty.",
  "Make outputs reviewable and editable.",
  "Protect uploaded resume data.",
  "Clarify limitations of AI-generated feedback.",
];

export default function ResumePMPlaybook() {
  return (
    <div className="project-description">
      <Panel
        eyebrow="PM Playbook"
        title="AI Resume Match Analyzer"
        body="A product management view of the demo: how the opportunity would be discovered, scoped, shipped, measured, and improved through feedback."
        className="ui-panel-accent-blue"
        wide
      >
        <FeatureListGrid items={playbookHighlights} columns={4} />
      </Panel>

      <section
        className="problem-solution-grid"
        aria-label="Problem and solution"
      >
        <Panel
          eyebrow="Discovery"
          title="Problem framing & discovery"
          bullets={discoveryBullets}
        />

        <Panel
          eyebrow="Strategy"
          title="Product vision & strategy"
          bullets={strategyBullets}
        />
      </section>

      <Panel
        eyebrow="MVP"
        title="What this demo proves"
        body="The MVP validates whether users can understand and act on an AI-assisted resume match report."
        wide
      >
        <FeatureCardGrid
          items={productSteps}
          numbered
          columns={5}
          ariaLabel="Resume analyzer MVP workflow"
        />
      </Panel>

      <section
        className="problem-solution-grid"
        aria-label="Problem and solution"
      >
        <Panel
          eyebrow="Measurement"
          title="Success metrics"
          bullets={metricBullets}
        />

        <Panel
          eyebrow="Risk"
          title="Product risks & guardrails"
          bullets={riskBullets}
        />
      </section>

      <Panel
        eyebrow="Portfolio Signal"
        title="An end-to-end product approach spanning UX, document AI, and workflow design moving from - "
        body="Discovery → MVP → AI workflow → Measurable user value"
        className="ui-panel-accent-blue"
        wide
      />
    </div>
  );
}
