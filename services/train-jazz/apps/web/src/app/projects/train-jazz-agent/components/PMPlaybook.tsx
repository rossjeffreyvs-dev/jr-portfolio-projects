const playbookSteps = [
  {
    icon: "🚇",
    title: "Define signal",
    subtitle: "Transit events + line state",
  },
  {
    icon: "🎛️",
    title: "Ingest activity",
    subtitle: "Line counts, density, movement",
  },
  {
    icon: "🤖",
    title: "Conduct ensemble",
    subtitle: "Shape texture and tension",
  },
  { icon: "🎷", title: "Generate output", subtitle: "Ambient jazz soundscape" },
  {
    icon: "📈",
    title: "Measure quality",
    subtitle: "Pleasantness and clarity",
  },
];

export default function PMPlaybook() {
  return (
    <div className="content-grid playbook-grid">
      <section className="panel wide panel-accent-purple playbook-hero-card">
        <p className="section-label">PM Playbook</p>
        <h2 className="feature-title">
          How I would productize this agentic sound system
        </h2>
        <p>
          The product strategy is to turn a creative subway sonification
          experiment into a reusable real-time signal interpretation platform:
          ingest operational activity, explain the system state, and generate a
          human-perceivable output.
        </p>
        <div className="playbook-step-grid">
          {playbookSteps.map((step) => (
            <div className="playbook-step-card" key={step.title}>
              <span className="playbook-step-icon">{step.icon}</span>
              <span>
                <strong>{step.title}</strong>
                <small>{step.subtitle}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel playbook-info-card panel-accent-blue">
        <p className="section-label">Buyer & User</p>
        <div className="panel-heading-icon">
          {/* <span className="playbook-circle-icon">👥</span> */}
          <h2>Who this is for</h2>
        </div>
        <ul className="playbook-list check-list">
          <li>
            <strong>Creative technologists:</strong> build ambient installations
            from operational data.
          </li>
          <li>
            <strong>Data platform teams:</strong> explore non-dashboard
            observability interfaces.
          </li>
          <li>
            <strong>Product teams:</strong> demonstrate agentic interpretation
            of real-time signals.
          </li>
        </ul>
      </section>

      <section className="panel playbook-info-card panel-accent-green">
        <p className="section-label">Product Strategy</p>
        <div className="panel-heading-icon">
          <span className="playbook-circle-icon">🎯</span>
          <h2>Primary product bet</h2>
        </div>
        <p>
          Real-time systems do not always need another dashboard. The bet is
          that an AI conductor can translate activity, density, and tension into
          an ambient operating layer that makes a complex system easier to feel,
          monitor, and explain.
        </p>
      </section>

      <section className="panel wide playbook-scope-card">
        <p className="section-label">MVP Scope</p>
        <div className="panel-heading-icon">
          <span className="playbook-circle-icon">▦</span>
          <h2>What I would build first</h2>
        </div>
        <div className="flow-row compact-flow-row">
          <span>🚇 Signal ingestion</span>
          <span>🎛️ Line-to-instrument map</span>
          <span>🤖 AI conductor</span>
          <span>🗺️ Visual map</span>
          <span>🎧 Audio quality loop</span>
        </div>
        <p>
          The first release should focus on one high-value loop: reliable signal
          ingestion, understandable conductor decisions, and a pleasant
          audio-visual experience. Everything else should support that loop.
        </p>
      </section>

      <section className="panel playbook-info-card panel-accent-purple-soft">
        <p className="section-label">Agent Workflow</p>
        <div className="panel-heading-icon">
          <span className="playbook-circle-icon">◎</span>
          <h2>Multi-agent operating model</h2>
        </div>
        <ul className="playbook-list check-list">
          <li>
            <strong>Ingestion Agent:</strong> tracks subway activity by line.
          </li>
          <li>
            <strong>Movement Agent:</strong> updates train positions on the
            visual map.
          </li>
          <li>
            <strong>Mapping Agent:</strong> maps line personality to
            instruments.
          </li>
          <li>
            <strong>AI Conductor:</strong> shapes density, activity, tension,
            and lead voice.
          </li>
        </ul>
      </section>

      <section className="panel playbook-info-card panel-accent-green">
        <p className="section-label">Results & Impact</p>
        <div className="panel-heading-icon">
          <span className="playbook-circle-icon">✓</span>
          <h2>What the demo proves</h2>
        </div>
        <ul className="playbook-list check-list">
          <li>Converts operational activity into an understandable output.</li>
          <li>Shows how an AI decision layer can shape system behavior.</li>
          <li>Demonstrates a reusable pattern for ambient monitoring.</li>
          <li>
            Turns a complex real-time signal into a calm product experience.
          </li>
        </ul>
      </section>
    </div>
  );
}
