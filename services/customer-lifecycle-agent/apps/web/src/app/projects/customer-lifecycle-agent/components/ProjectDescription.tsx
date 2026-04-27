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
          milestones, review blockers, and conversion outcomes.
        </p>
        <p>
          The system shows how an operator can move from signal detection to
          explanation, human decision, and measurable revenue impact.
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

      <section className="panel panel-accent-orange">
        <p className="section-label">Problem</p>
        <h2 className="panel-heading-icon">
          <span>?</span>
          Revenue leaks between interest and conversion
        </h2>
        <p>
          Growth, developer experience, sales, and customer success teams often
          have signals spread across analytics, CRM, support, billing,
          onboarding tools, and product usage logs.
        </p>
        <p>
          High-value prospects can stall because a technical review, security
          question, product activation gap, or commercial blocker is unresolved.
        </p>
      </section>

      <section className="panel panel-accent-green">
        <p className="section-label">Solution</p>
        <h2 className="panel-heading-icon">
          <span>✓</span>
          Signal → explanation → action → revenue
        </h2>
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
      </section>

      <section className="panel wide">
        <p className="section-label">How It Works</p>
        <h2 className="panel-heading-icon">
          <span>↗</span>
          Revenue lifecycle workflow
        </h2>

        <div className="flow-row icon-flow-row">
          <span>⚡ Prospect Ingested</span>
          <span>🎯 Fit Evaluated</span>
          <span>🧭 Stage Classified</span>
          <span>👤 Blocker Reviewed</span>
          <span>💰 Revenue Updated</span>
        </div>

        <p>
          New prospects enter from simulated channels such as product-led
          signup, referrals, outbound, developer community, or inbound demo
          requests. The system evaluates fit, estimates revenue potential,
          determines whether human review is required, and updates funnel
          metrics in real time.
        </p>
      </section>

      <section className="panel wide">
        <p className="section-label">System Architecture</p>
        <h2 className="panel-heading-icon">
          <span>▦</span>
          Frontend, API, lifecycle data model, and agent workflow
        </h2>

        <div className="content-grid">
          <article className="project-card project-card-accent">
            <p className="section-label">Frontend</p>
            <h2>🖥️ Next.js / React</h2>
            <p>
              Demo tabs, live prospect feed, revenue funnel, activity stream,
              blocker review queue, and explainability panels.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">API Layer</p>
            <h2>🔌 FastAPI lifecycle service</h2>
            <p>
              Provides lifecycle summary, prospect ingestion, and human review
              actions for convert, request information, and reject decisions.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">Data Layer</p>
            <h2>🧱 Structured lifecycle data</h2>
            <p>
              Models prospects, funnel stages, review queue, estimated value,
              revenue realized, revenue at risk, and recommended actions.
            </p>
          </article>

          <article className="project-card project-card-accent">
            <p className="section-label">Agent Layer</p>
            <h2>🤖 Signal and decision agents</h2>
            <p>
              Simulates lifecycle agents for prospect evaluation, activation,
              personalization, experimentation, revenue optimization, and
              retention.
            </p>
          </article>
        </div>
      </section>

      <section className="panel panel-accent-purple">
        <p className="section-label">Agent Workflow</p>
        <h2 className="panel-heading-icon">
          <span>◎</span>
          Multi-agent operating model
        </h2>
        <ul className="playbook-list icon-list">
          <li>
            <strong>Ingestion Agent:</strong> detects new prospect activity and
            adds it to the lifecycle funnel.
          </li>
          <li>
            <strong>Evaluation Agent:</strong> scores fit, classifies stage, and
            estimates potential value.
          </li>
          <li>
            <strong>Revenue Agent:</strong> identifies blocked revenue and
            prioritizes the highest-value action.
          </li>
          <li>
            <strong>Review Agent:</strong> keeps humans involved for conversion,
            rejection, or follow-up decisions.
          </li>
        </ul>
      </section>

      <section className="panel panel-accent-green">
        <p className="section-label">Results & Impact</p>
        <h2 className="panel-heading-icon">
          <span>✓</span>
          What the demo proves
        </h2>
        <ul className="playbook-list icon-list">
          <li>Connects product signals to revenue outcomes.</li>
          <li>Explains why each prospect matters before action is taken.</li>
          <li>
            Shows where conversion is blocked and what decision is needed.
          </li>
          <li>
            Demonstrates a human-in-the-loop pattern for revenue-impacting
            actions.
          </li>
          <li>
            Creates a reusable foundation for CRM, product analytics, billing,
            support, and customer success integrations.
          </li>
        </ul>
      </section>
    </div>
  );
}
