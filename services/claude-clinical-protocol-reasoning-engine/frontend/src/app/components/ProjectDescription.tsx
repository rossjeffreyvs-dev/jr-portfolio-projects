export default function ProjectDescription() {
  return (
    <section className="description-card claude-overview-card">
      <p className="section-label">Project Overview</p>
      <h2>AI-assisted protocol interpretation</h2>
      <p>
        This project combines ClinicalTrials.gov-style trial data, Synthea-style
        synthetic patients, and Claude-style reasoning to evaluate eligibility
        criteria with transparent explanations.
      </p>

      <div className="claude-feature-grid">
        <article>
          <span className="insight-icon">▦</span>
          <strong>Protocol criteria parsing</strong>
        </article>
        <article>
          <span className="insight-icon">👤</span>
          <strong>Patient profile normalization</strong>
        </article>
        <article>
          <span className="insight-icon">✓</span>
          <strong>Criterion-level reasoning</strong>
        </article>
        <article>
          <span className="insight-icon">↗</span>
          <strong>Human review escalation</strong>
        </article>
      </div>
    </section>
  );
}
