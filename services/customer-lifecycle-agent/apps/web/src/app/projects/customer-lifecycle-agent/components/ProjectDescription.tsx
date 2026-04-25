export default function ProjectDescription() {
  return (
    <div className="content-grid">
      <section className="panel">
        <p className="section-label">Overview</p>
        <h2>What this project demonstrates</h2>
        <p>
          This demo models a customer lifecycle platform where specialized
          agents observe product signals, identify lifecycle risks, recommend
          next-best actions, and explain why those actions were suggested.
        </p>
      </section>

      <section className="panel">
        <p className="section-label">Why it matters</p>
        <h2>Product growth system</h2>
        <p>
          The platform connects product analytics, experimentation,
          personalization, revenue intelligence, and customer success workflows
          into one explainable operating layer.
        </p>
      </section>

      <section className="panel wide">
        <p className="section-label">Architecture</p>
        <h2>Core system flow</h2>
        <div className="flow-row">
          <span>Customer event</span>
          <span>Signal detection</span>
          <span>Agent reasoning</span>
          <span>Recommended action</span>
          <span>Outcome tracking</span>
        </div>
      </section>
    </div>
  );
}
