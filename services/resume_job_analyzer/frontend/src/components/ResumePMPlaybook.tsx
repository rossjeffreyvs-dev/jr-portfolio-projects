type PlaybookStep = {
  index: string;
  icon: string;
  title: string;
  description: string;
};

const productSteps: PlaybookStep[] = [
  {
    index: "01",
    icon: "🧾",
    title: "Input job description",
    description:
      "Start with the target role so the product can anchor feedback in real requirements.",
  },
  {
    index: "02",
    icon: "📄",
    title: "Upload resume",
    description:
      "Capture the candidate source document without forcing manual re-entry.",
  },
  {
    index: "03",
    icon: "🔎",
    title: "Extract text",
    description:
      "Parse the uploaded file into clean text for repeatable comparison.",
  },
  {
    index: "04",
    icon: "🧠",
    title: "Generate report",
    description:
      "Summarize fit, strengths, gaps, and role-specific recommendations.",
  },
  {
    index: "05",
    icon: "✅",
    title: "Review guidance",
    description:
      "Help the user act on the analysis with clear next steps and editable feedback.",
  },
];

export default function ResumePMPlaybook() {
  return (
    <div className="project-description pm-playbook">
      <section className="description-card overview-card section-emphasis">
        <p className="description-eyebrow">PM Playbook</p>
        <h2>AI Resume Match Analyzer</h2>
        <p className="description-lede">
          A product management view of the demo: how the opportunity would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="description-highlight-grid playbook-highlight-grid">
          <article className="description-highlight">
            <span className="description-icon" aria-hidden="true">
              🎯
            </span>
            <strong>Candidate problem framing</strong>
          </article>
          <article className="description-highlight">
            <span className="description-icon" aria-hidden="true">
              🧩
            </span>
            <strong>MVP workflow scope</strong>
          </article>
          <article className="description-highlight">
            <span className="description-icon" aria-hidden="true">
              🛡️
            </span>
            <strong>Trust and explainability</strong>
          </article>
          <article className="description-highlight">
            <span className="description-icon" aria-hidden="true">
              🔁
            </span>
            <strong>Feedback-driven iteration</strong>
          </article>
        </div>
      </section>
      <section className="problem-solution-grid">
        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Discovery</p>

            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                🔍
              </span>
              <h3>Problem framing & discovery</h3>
            </div>
          </div>{" "}
          <ul className="check-list">
            <li>Candidates need faster feedback on role fit.</li>
            <li>
              Resume gaps are hard to identify from a job description alone.
            </li>
            <li>Users need actionable guidance, not generic resume advice.</li>
          </ul>
        </article>

        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Strategy</p>

            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                🧭
              </span>
              <h3>Product vision & strategy</h3>
            </div>
          </div>{" "}
          <ul className="check-list">
            <li>Position as an assistant, not an automated hiring decision.</li>
            <li>Make the comparison transparent and easy to review.</li>
            <li>Focus on strengths, gaps, and rewrite opportunities.</li>
          </ul>
        </article>
      </section>
      <section className="description-card section-card">
        <div className="description-section-header compact-heading">
          <p className="description-eyebrow">MVP</p>

          <div className="playbook-card-title-row">
            <span className="section-icon" aria-hidden="true">
              🚀
            </span>
            <h3>What this demo proves</h3>
          </div>
        </div>{" "}
        <p className="description-lede compact">
          The MVP validates whether users can understand and act on an
          AI-assisted resume match report.
        </p>
        <div className="workflow-step-grid product-step-grid">
          {productSteps.map((step) => (
            <article
              className="workflow-step-card product-step-card"
              key={step.index}
            >
              <span className="workflow-step-index">{step.index}</span>
              <div className="workflow-step-title">
                <span className="workflow-step-icon" aria-hidden="true">
                  {step.icon}
                </span>
                <h4>{step.title}</h4>
              </div>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="takeaway-grid-section">
        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Measurement</p>

            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                📈
              </span>
              <h3>Success metrics</h3>
            </div>
          </div>{" "}
          <ul className="check-list">
            <li>Report generation completion rate</li>
            <li>User copy/download rate</li>
            <li>Perceived usefulness rating</li>
            <li>Repeat analysis frequency</li>
          </ul>
        </article>

        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Risk</p>

            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                🛡️
              </span>
              <h3>Product risks & guardrails</h3>
            </div>
          </div>{" "}
          <ul className="check-list">
            <li>Avoid presenting analysis as hiring certainty.</li>
            <li>Make outputs reviewable and editable.</li>
            <li>Protect uploaded resume data.</li>
            <li>Clarify limitations of AI-generated feedback.</li>
          </ul>
        </article>
      </section>
      <div className="portfolio-signal-card">
        <div className="portfolio-signal-main">
          <p className="description-eyebrow">Portfolio Signal</p>
          <h3>
            Shows product thinking across UX, document AI, workflow design, and
            candidate-facing recommendations.
          </h3>
        </div>

        <div className="portfolio-signal-flow">
          Discovery → MVP → AI workflow → Measurable user value
        </div>
      </div>{" "}
    </div>
  );
}
