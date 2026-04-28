export default function ProjectDescription() {
  return (
    <div className="description-stack">
      <section className="description-card claude-overview-card">
        <p className="section-label">Project Overview</p>
        <h2>Claude Clinical Protocol Reasoning & Eligibility Platform</h2>

        <p>
          This demo models a clinical protocol reasoning workflow where dense
          eligibility criteria, synthetic patient records, and explainable AI
          reasoning are brought together to support transparent trial-screening
          decisions.
        </p>

        <p>
          The system shows how a clinical or research team can move from
          protocol interpretation to patient evidence review, criterion-level
          reasoning, human escalation, and auditable eligibility output.
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

      <div className="content-grid">
        <section className="description-card">
          <p className="section-label">Problem</p>
          <h2>Protocol eligibility is hard to interpret consistently</h2>
          <p>
            Trial criteria often contain nuanced medical language, exceptions,
            timing requirements, and ambiguous evidence needs. Research teams
            must compare those criteria against fragmented patient information
            while maintaining explainability and reviewability.
          </p>
        </section>

        <section className="description-card">
          <p className="section-label">Solution</p>
          <h2>Protocol → evidence → reasoning → recommendation</h2>
          <p>
            The platform parses protocol criteria, normalizes synthetic patient
            records, evaluates each eligibility requirement, and produces a
            transparent recommendation with rationale, confidence, and review
            flags for uncertain cases.
          </p>
        </section>

        <section className="description-card wide">
          <p className="section-label">How it works</p>
          <h2>Clinical reasoning workflow</h2>

          <div className="flow-row">
            <span>📄 Protocol Loaded</span>
            <span>🧬 Patient Evidence Reviewed</span>
            <span>✓ Criteria Evaluated</span>
            <span>↗ Review Flagged</span>
          </div>

          <p>
            A user selects a trial and patient, runs an evaluation, and watches
            the reasoning trace progress through protocol parsing, evidence
            retrieval, criterion-level analysis, and final recommendation. Each
            result explains why the patient appears eligible, ineligible, or
            requires human review.
          </p>
        </section>
      </div>
    </div>
  );
}
