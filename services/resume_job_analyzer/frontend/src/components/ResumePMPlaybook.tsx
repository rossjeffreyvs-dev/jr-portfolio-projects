export default function ResumePMPlaybook() {
  return (
    <div className="project-description pm-playbook">
      <section className="description-card overview-card">
        <p className="description-eyebrow">PM Playbook</p>
        <h2>AI Resume Match Analyzer</h2>
        <p className="description-lede">
          A product management view of the demo: how the opportunity would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="description-highlight-grid playbook-highlight-grid">
          <div className="description-highlight">Candidate problem framing</div>
          <div className="description-highlight">MVP workflow scope</div>
          <div className="description-highlight">Trust and explainability</div>
          <div className="description-highlight">Feedback-driven iteration</div>
        </div>
      </section>

      <section className="problem-solution-grid">
        <article className="description-card section-card">
          <p className="description-eyebrow">Discovery</p>
          <h3>Problem Framing & Discovery</h3>
          <ul className="check-list">
            <li>Candidates need faster feedback on role fit.</li>
            <li>
              Resume gaps are hard to identify from a job description alone.
            </li>
            <li>Users need actionable guidance, not generic resume advice.</li>
          </ul>
        </article>

        <article className="description-card section-card">
          <p className="description-eyebrow">Strategy</p>
          <h3>Product Vision & Strategy</h3>
          <ul className="check-list">
            <li>Position as an assistant, not an automated hiring decision.</li>
            <li>Make the comparison transparent and easy to review.</li>
            <li>Focus on strengths, gaps, and rewrite opportunities.</li>
          </ul>
        </article>
      </section>

      <section className="description-card section-card">
        <p className="description-eyebrow">MVP</p>
        <h3>What This Demo Proves</h3>
        <p className="description-lede compact">
          The MVP validates whether users can understand and act on an
          AI-assisted resume match report.
        </p>

        <div className="workflow-step-grid">
          {[
            "Input job description",
            "Upload resume",
            "Extract text",
            "Generate report",
            "Review guidance",
          ].map((step, index) => (
            <div className="workflow-step-pair" key={step}>
              <article className="workflow-step-card">
                <p>
                  {index + 1}. {step}
                </p>
                <h4>{step}</h4>
              </article>
              {index < 4 ? <div className="workflow-arrow">→</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="takeaway-grid-section">
        <article className="description-card section-card">
          <p className="description-eyebrow">Measurement</p>
          <h3>Success Metrics</h3>
          <ul className="check-list">
            <li>Report generation completion rate</li>
            <li>User copy/download rate</li>
            <li>Perceived usefulness rating</li>
            <li>Repeat analysis frequency</li>
          </ul>
        </article>

        <article className="description-card section-card">
          <p className="description-eyebrow">Risk</p>
          <h3>Product Risks & Guardrails</h3>
          <ul className="check-list">
            <li>Avoid presenting analysis as hiring certainty.</li>
            <li>Make outputs reviewable and editable.</li>
            <li>Protect uploaded resume data.</li>
            <li>Clarify limitations of AI-generated feedback.</li>
          </ul>
        </article>
      </section>

      <section className="demo-note-card">
        <div>
          <p>Portfolio signal</p>
          <h3>
            Shows product thinking across UX, document AI, workflow design, and
            candidate-facing recommendations.
          </h3>
        </div>
        <span>Discovery → MVP → AI workflow → Measurable user value</span>
      </section>
    </div>
  );
}
