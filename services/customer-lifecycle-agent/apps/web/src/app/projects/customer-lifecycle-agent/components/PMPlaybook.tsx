export default function PMPlaybook() {
  return (
    <div className="content-grid">
      <section className="panel wide panel-accent-purple">
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

      <section className="panel panel-accent-blue">
        <p className="section-label">Buyer & User</p>
        <h2 className="panel-heading-icon">
          <span>👥</span>
          Who this is for
        </h2>
        <ul className="playbook-list icon-list">
          <li>
            <strong>Buyer:</strong> Head of Product, Growth, Revenue, Developer
            Experience, or Customer Success.
          </li>
          <li>
            <strong>Primary users:</strong> customer success managers, growth
            operators, solutions engineers, and lifecycle PMs.
          </li>
          <li>
            <strong>Business need:</strong> improve conversion, activation,
            retention, and expansion from existing customer signals.
          </li>
        </ul>
      </section>

      <section className="panel panel-accent-green">
        <p className="section-label">Product Strategy</p>
        <h2 className="panel-heading-icon">
          <span>🎯</span>
          Primary product bet
        </h2>
        <p>
          The core bet is that revenue teams do not just need more dashboards;
          they need an explainable action layer that converts signals into
          prioritized decisions.
        </p>
        <p>
          The product should show which opportunities are valuable, why they are
          blocked, and what action is most likely to move them forward.
        </p>
      </section>

      <section className="panel wide">
        <p className="section-label">MVP Scope</p>
        <h2 className="panel-heading-icon">
          <span>▦</span>
          What I would build first
        </h2>

        <div className="flow-row icon-flow-row">
          <span>📡 Signal ingestion</span>
          <span>🎯 Fit evaluation</span>
          <span>💰 Revenue risk queue</span>
          <span>👤 Human review</span>
          <span>📈 Outcome tracking</span>
        </div>

        <p>
          The first version should focus on one high-value workflow: identifying
          prospects or customers stuck before conversion and routing them to a
          clear human decision. Everything else should support that loop.
        </p>
      </section>

      <section className="panel panel-accent-orange">
        <p className="section-label">Key PM Questions</p>
        <h2 className="panel-heading-icon">
          <span>?</span>
          What to validate
        </h2>
        <ul className="playbook-list icon-list">
          <li>Which signals best predict conversion or activation?</li>
          <li>Which blockers most often delay revenue?</li>
          <li>Which actions should be automated vs. human-reviewed?</li>
          <li>How much explanation does an operator need before acting?</li>
          <li>What outcome proves the recommendation was useful?</li>
        </ul>
      </section>

      <section className="panel panel-accent-green">
        <p className="section-label">Evaluation Metrics</p>
        <h2 className="panel-heading-icon">
          <span>📈</span>
          How success should be measured
        </h2>
        <ul className="playbook-list icon-list">
          <li>Prospect-to-qualified conversion rate</li>
          <li>Qualified-to-evaluated conversion rate</li>
          <li>Review queue resolution time</li>
          <li>Revenue at risk reduced</li>
          <li>Revenue realized from reviewed opportunities</li>
          <li>Operator trust in recommendation rationale</li>
        </ul>
      </section>

      <section className="panel wide panel-accent-blue">
        <p className="section-label">Integration Strategy</p>
        <h2 className="panel-heading-icon">
          <span>🔌</span>
          Where this would connect in the real world
        </h2>

        <div className="content-grid">
          <article className="project-card project-card-accent">
            <p className="section-label">Product Analytics</p>
            <h2>📊 Usage signals</h2>
            <p>
              Events from Segment, Amplitude, Mixpanel, or internal logs to
              detect onboarding progress, activation gaps, and usage momentum.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">CRM</p>
            <h2>🏢 Account context</h2>
            <p>
              Salesforce or HubSpot data for account owner, stage, segment,
              opportunity value, sales motion, and follow-up ownership.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">Support + Success</p>
            <h2>🧩 Blocker context</h2>
            <p>
              Zendesk, Intercom, or Gainsight signals to identify unresolved
              questions, implementation friction, or customer health risk.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">Workflow</p>
            <h2>📨 Action routing</h2>
            <p>
              Slack, email, task management, or internal review queues to assign
              the next best action to a human owner.
            </p>
          </article>
        </div>
      </section>

      <section className="panel panel-accent-orange">
        <p className="section-label">Risk & Governance</p>
        <h2 className="panel-heading-icon">
          <span>⚠</span>
          What should stay human-reviewed
        </h2>
        <ul className="playbook-list icon-list">
          <li>Revenue-impacting conversion or rejection decisions</li>
          <li>Enterprise account escalation</li>
          <li>Security, legal, or compliance blockers</li>
          <li>Low-confidence model recommendations</li>
          <li>Actions that directly affect customer communication</li>
        </ul>
      </section>

      <section className="panel panel-accent-purple">
        <p className="section-label">Next Iteration</p>
        <h2 className="panel-heading-icon">
          <span>🔁</span>
          How I would evolve it
        </h2>
        <ul className="playbook-list icon-list">
          <li>
            Add feedback loops from accepted and rejected recommendations.
          </li>
          <li>Compare agent-suggested actions against control groups.</li>
          <li>Add confidence scoring and reason-code analytics.</li>
          <li>
            Support account-specific playbooks by segment and lifecycle stage.
          </li>
          <li>
            Connect outcomes back to product analytics and CRM revenue data.
          </li>
        </ul>
      </section>
    </div>
  );
}
