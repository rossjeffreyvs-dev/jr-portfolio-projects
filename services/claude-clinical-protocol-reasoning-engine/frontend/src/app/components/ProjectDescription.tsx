export default function ProjectDescription() {
  return (
    <section className="panel">
      <p className="eyebrow">Project Overview</p>
      <h2>AI-assisted protocol interpretation</h2>
      <p>
        This project combines ClinicalTrials.gov-style trial data, Synthea-style
        synthetic patients, and Claude-style reasoning to evaluate eligibility
        criteria with transparent explanations.
      </p>

      <div className="feature-grid">
        <div>Protocol criteria parsing</div>
        <div>Patient profile normalization</div>
        <div>Criterion-level reasoning</div>
        <div>Human review escalation</div>
      </div>
    </section>
  );
}
