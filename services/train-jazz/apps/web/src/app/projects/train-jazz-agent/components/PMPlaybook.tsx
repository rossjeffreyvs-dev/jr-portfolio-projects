import FeatureListGrid from "./FeatureListGrid";
import Panel from "./Panel";

const playbookSteps = [
  {
    icon: "🚇",
    title: "Define signal",
    description: "Transit events + line state",
  },
  {
    icon: "🎛️",
    title: "Ingest activity",
    description: "Line counts, density, movement",
  },
  {
    icon: "🤖",
    title: "Conduct ensemble",
    description: "Shape texture and tension",
  },
  {
    icon: "🎷",
    title: "Generate output",
    description: "Ambient jazz soundscape",
  },
  {
    icon: "📈",
    title: "Measure quality",
    description: "Pleasantness and clarity",
  },
];

const mvpScope = [
  {
    icon: "🚇",
    title: "Signal ingestion",
    description: "Reliable subway activity inputs for the experience.",
  },
  {
    icon: "🎛️",
    title: "Line-to-instrument map",
    description: "Clear mapping between transit lines and musical roles.",
  },
  {
    icon: "🤖",
    title: "AI conductor",
    description: "Decision layer that shapes density, activity, and tension.",
  },
  {
    icon: "🗺️",
    title: "Visual map",
    description: "Map and event feed that explain what the sound represents.",
  },
  {
    icon: "🎧",
    title: "Audio quality loop",
    description: "Feedback loop for pleasantness, clarity, and restraint.",
  },
];

const buyerUserBullets = [
  <>
    <strong>Creative technologists:</strong> build ambient installations from
    operational data.
  </>,
  <>
    <strong>Data platform teams:</strong> explore non-dashboard observability
    interfaces.
  </>,
  <>
    <strong>Product teams:</strong> demonstrate agentic interpretation of
    real-time signals.
  </>,
];

const agentWorkflowBullets = [
  <>
    <strong>Ingestion Agent:</strong> tracks subway activity by line.
  </>,
  <>
    <strong>Movement Agent:</strong> updates train positions on the visual map.
  </>,
  <>
    <strong>Mapping Agent:</strong> maps line personality to instruments.
  </>,
  <>
    <strong>AI Conductor:</strong> shapes density, activity, tension, and lead
    voice.
  </>,
];

const resultsBullets = [
  "Converts operational activity into an understandable output.",
  "Shows how an AI decision layer can shape system behavior.",
  "Demonstrates a reusable pattern for ambient monitoring.",
  "Turns a complex real-time signal into a calm product experience.",
];

export default function PMPlaybook() {
  return (
    <div className="content-grid playbook-grid">
      <Panel
        eyebrow="PM Playbook"
        title="How I would productize this agentic sound system"
        body="The product strategy is to turn a creative subway sonification experiment into a reusable real-time signal interpretation platform: ingest operational activity, explain the system state, and generate a human-perceivable output."
        className="panel-accent-purple playbook-hero-card"
        wide
      >
        <FeatureListGrid
          items={playbookSteps}
          ariaLabel="TrainJazz productization steps"
          className="playbook-feature-grid"
        />
      </Panel>

      <Panel
        eyebrow="Buyer & User"
        title="Who this is for"
        bullets={buyerUserBullets}
        className="panel-accent-blue playbook-info-card"
      />

      <Panel
        eyebrow="Product Strategy"
        title="Primary product bet"
        body="Real-time systems do not always need another dashboard. The bet is that an AI conductor can translate activity, density, and tension into an ambient operating layer that makes a complex system easier to feel, monitor, and explain."
        className="panel-accent-green playbook-info-card"
      />

      <Panel
        eyebrow="MVP Scope"
        title="What I would build first"
        body="The first release should focus on one high-value loop: reliable signal ingestion, understandable conductor decisions, and a pleasant audio-visual experience. Everything else should support that loop."
        className="playbook-scope-card"
        wide
      >
        <FeatureListGrid
          items={mvpScope}
          ariaLabel="TrainJazz MVP scope"
          className="playbook-feature-grid"
        />
      </Panel>

      <Panel
        eyebrow="Agent Workflow"
        title="Multi-agent operating model"
        bullets={agentWorkflowBullets}
        className="panel-accent-purple-soft playbook-info-card"
      />

      <Panel
        eyebrow="Results & Impact"
        title="What the demo proves"
        bullets={resultsBullets}
        className="panel-accent-green playbook-info-card"
      />
    </div>
  );
}
