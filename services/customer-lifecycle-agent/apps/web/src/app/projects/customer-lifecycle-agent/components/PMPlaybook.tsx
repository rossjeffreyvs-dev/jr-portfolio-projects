import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import ArchitectureGrid from "./ArchitectureGrid";

const users = [
  "Buyer: Head of Product, Growth, Revenue, Developer Experience, or Customer Success.",
  "Primary users:</strong> customer success managers, growth operators, solutions engineers, and lifecycle PMs.",
  "Business need:</strong> improve conversion, activation, retention, and expansion from existing customer signals.",
];

const workflowSteps = [
  { icon: "📡", label: "Signal ingestion" },
  { icon: "🎯", label: "Fit evaluation" },
  { icon: "💰", label: "Revenue risk queue" },
  { icon: "👤", label: "Human review" },
  { icon: "📈", label: "Outcome tracking" },
];

const validations = [
  "Which signals best predict conversion or activation?",
  "Which blockers most often delay revenue?",
  "Which actions should be automated vs. human-reviewed?",
  "How much explanation does an operator need before acting?",
  "What outcome proves the recommendation was useful?",
];

const metrics = [
  "Prospect-to-qualified conversion rate",
  "Qualified-to-evaluated conversion rate",
  "Review queue resolution time",
  "Revenue at risk reduced",
  "Revenue realized from reviewed opportunities",
  "Operator trust in recommendation rationale",
];

const architectureItems = [
  {
    eyebrow: "Product Analytics",
    title: "Usage signals",
    description:
      "Events from Segment, Amplitude, Mixpanel, or internal logs to detect onboarding progress, activation gaps, and usage momentum.",
  },
  {
    eyebrow: "CRM",
    title: "Account context",
    description:
      "Salesforce or HubSpot data for account owner, stage, segment, opportunity value, sales motion, and follow-up ownership.",
  },
  {
    eyebrow: "Support + Success",
    title: "Blocker context",
    description:
      "Zendesk, Intercom, or Gainsight signals to identify unresolved questions, implementation friction, or customer health risk.",
  },
  {
    eyebrow: "Workflow",
    title: "Action routing",
    description:
      "Slack, email, task management, or internal review queues to assign the next best action to a human owner.",
  },
];

const risks = [
  "Revenue-impacting conversion or rejection decisions",
  "Enterprise account escalation",
  "Security, legal, or compliance blockers",
  "Low-confidence model recommendations",
  "Actions that directly affect customer communication",
];

const iterations = [
  "Add feedback loops from accepted and rejected recommendations.",
  "Compare agent-suggested actions against control groups.",
  "Add confidence scoring and reason-code analytics.",
  "Support account-specific playbooks by segment and lifecycle stage.",
  "Connect outcomes back to product analytics and CRM revenue data.",
];

export default function PMPlaybook() {
  return (
    <div className="content-grid">
      <section className="panel wide panel-accent-blue">
        <p className="section-label">PM Playbook</p>
        <h2 className="feature-title">How I would productize this platform</h2>
        <p>
          The PM goal is to turn fragmented customer and product signals into a
          repeatable revenue operating system. The product should help teams
          identify where prospects are stuck, understand why, take the right
          action, and measure whether that action improved conversion.
        </p>

        <div className="insight-strip playbook-strip">
          <div className="insight-pill">
            <span className="insight-icon">👥</span>
            <strong>Define user + buyer</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">📡</span>
            <strong>Ingest lifecycle signals</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">🧠</span>
            <strong>Explain recommendations</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">🧑‍⚖️</span>
            <strong>Route human decisions</strong>
          </div>
          <div className="insight-pill">
            <span className="insight-icon">📈</span>
            <strong>Measure revenue impact</strong>
          </div>
        </div>
      </section>

      <Panel
        eyebrow="Agent Workflow"
        title="Multi-agent operating model"
        bullets={users}
      />

      <Panel eyebrow="Product Strategy" title="Primary product bet">
        <p>
          The core bet is that revenue teams do not just need more dashboards;
          they need an explainable action layer that converts signals into
          prioritized decisions.
        </p>
        <p>
          The product should show which opportunities are valuable, why they are
          blocked, and what action is most likely to move them forward.
        </p>
      </Panel>

      <Panel
        eyebrow="MVP Scope"
        title="What I would build first"
        body="The first version should focus on one high-value workflow: identifying
          prospects or customers stuck before conversion and routing them to a
          clear human decision. Everything else should support that loop."
        wide
      >
        <FeatureListGrid items={workflowSteps} />
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

      <Panel
        eyebrow="Integration Strategy"
        title="Where this would connect in the real world"
        wide
      >
        <ArchitectureGrid items={architectureItems} />
      </Panel>

      <Panel
        eyebrow="Risk & Governance"
        title="What should stay human-reviewed"
        bullets={risks}
      />

      <Panel
        eyebrow="Next Iteration"
        title="How I would evolve it"
        bullets={iterations}
      />
    </div>
  );
}
