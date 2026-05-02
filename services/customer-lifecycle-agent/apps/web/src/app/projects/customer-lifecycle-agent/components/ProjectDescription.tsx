import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import ArchitectureGrid from "./ArchitectureGrid";

const workflowSteps = [
  { icon: "⚡", label: "Prospect Ingested" },
  { icon: "🎯", label: "Fit Evaluated" },
  { icon: "🧭", label: "Stage Classified" },
  { icon: "👤", label: "Blocker Reviewed" },
  { icon: "💰", label: "Revenue Updated" },
];

const architectureItems = [
  {
    eyebrow: "Frontend",
    title: "Next.js / React",
    description:
      "Demo tabs, live prospect feed, revenue funnel, activity stream, blocker review queue, and explainability panels.",
  },
  {
    eyebrow: "API layer",
    title: "FastAPI lifecycle service",
    description:
      "Provides lifecycle summary, prospect ingestion, and human review actions for convert, request information, and reject decisions.",
  },
  {
    eyebrow: "Data layer",
    title: "Structured lifecycle data",
    description:
      "Models prospects, funnel stages, review queue, estimated value, revenue realized, revenue at risk, and recommended actions.",
  },
  {
    eyebrow: "Agent layer",
    title: "Signal and decision agents",
    description:
      "Simulates lifecycle agents for prospect evaluation, activation, personalization, experimentation, revenue optimization, and retention.",
  },
];

const agents = [
  "Ingestion Agent: detects new prospect activity and adds it to the lifecycle funnel.",
  "Evaluation Agent: scores fit, classifies stage, and estimates potential value.",
  "Revenue Agent: identifies blocked revenue and prioritizes the highest-value action.",
  "Review Agent: keeps humans involved for conversion,rejection, or follow-up decisions.",
];

const results = [
  "Connects product signals to revenue outcomes.",
  "Explains why each prospect matters before action is taken.",
  "Shows where conversion is blocked and what decision is needed.",
  "Demonstrates a human-in-the-loop pattern for revenue-impacting actions.",
  "Creates a reusable foundation for CRM, product analytics, billing, support, and customer success integrations.",
];

export default function ProjectDescription() {
  return (
    <div className="content-grid">
      <section className="panel wide panel-accent-blue">
        <p className="section-label">Project Overview</p>
        <h2 className="feature-title">
          Agentic Customer Lifecycle & Revenue Optimization Platform
        </h2>
        <p>
          This demo models a revenue-focused lifecycle platform where agents
          monitor incoming prospects, product-led signals, activation
          milestones, review blockers, and conversion outcomes. The system shows
          how an operator can move from signal detection to explanation, human
          decision, and measurable revenue impact.
        </p>

        <div className="insight-strip">
          <div className="insight-pill">
            <span className="insight-icon">⚡</span>
            <strong>Signal-driven prospect ingest</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">🎯</span>
            <strong>Fit and funnel evaluation</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">💰</span>
            <strong>Revenue-at-risk detection</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">👤</span>
            <strong>Human review workflow</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">🔁</span>
            <strong>Outcome feedback loop</strong>
          </div>
        </div>
      </section>

      <Panel
        eyebrow="Problem"
        title="Revenue leaks between interest and conversion"
      >
        <p>
          Growth, developer experience, sales, and customer success teams often
          have signals spread across analytics, CRM, support, billing,
          onboarding tools, and product usage logs.
        </p>
        <p>
          High-value prospects can stall because a technical review, security
          question, product activation gap, or commercial blocker is unresolved.
        </p>
      </Panel>

      <Panel eyebrow="Solution" title="Signal → explanation → action → revenue">
        <p>
          The platform simulates a lifecycle intelligence layer that turns
          prospect and customer signals into recommended actions. It evaluates
          fit, classifies funnel stage, flags revenue blockers, and keeps a
          human in the loop for decisions that affect conversion.
        </p>
        <p>
          Each blocked prospect includes a rationale, estimated value, and
          recommended next step so an operator understands what to do and why.
        </p>
      </Panel>

      <Panel
        eyebrow="How It Works"
        title="Revenue lifecycle workflow"
        body="New prospects enter from simulated channels such as product-led signup, referrals, outbound, developer community, or inbound demo requests. The system evaluates fit, estimates revenue potential, determines whether human review is required, and updates funnel metrics in real time."
        wide
      >
        <FeatureListGrid items={workflowSteps} />
      </Panel>

      <Panel
        eyebrow="System architecture"
        title="Frontend, API, data model, and agent workflow"
        wide
      >
        <ArchitectureGrid items={architectureItems} />
      </Panel>

      <Panel
        eyebrow="Agent Workflow"
        title="Multi-agent operating model"
        bullets={agents}
      />

      <Panel
        eyebrow="Results & Impact"
        title="What the demo proves"
        bullets={results}
      />
    </div>
  );
}
