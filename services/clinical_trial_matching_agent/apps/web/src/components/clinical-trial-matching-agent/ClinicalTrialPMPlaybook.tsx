"use client";

const playbookSections = [
  {
    title: "Problem Framing & Discovery",
    eyebrow: "Discovery",
    body: "Clinical trial teams struggle to efficiently identify eligible patients because eligibility criteria are complex, unstructured, and require manual cross-referencing against fragmented clinical data.",
    bullets: [
      "Clinical trial coordinators need faster screening workflows.",
      "Research nurses need evidence-backed recommendations.",
      "Clinical operations teams need scalable trial enrollment support.",
    ],
  },
  {
    title: "Product Vision & Strategy",
    eyebrow: "Strategy",
    body: "Build an agentic system that evaluates patient eligibility for clinical trials with explainable, auditable, and continuously improving decision workflows.",
    bullets: [
      "Explainable AI decisioning",
      "Human-in-the-loop control",
      "Structured and unstructured data fusion",
      "Transparent workflow playback",
    ],
  },
];

const agentCards = [
  {
    title: "Trial Parsing Agent",
    text: "Extracts and normalizes eligibility criteria from protocol language.",
  },
  {
    title: "Patient Matching Agent",
    text: "Ranks likely candidates based on trial-specific patient context.",
  },
  {
    title: "Eligibility Evaluation Agent",
    text: "Evaluates each patient against inclusion and exclusion criteria.",
  },
  {
    title: "Workflow Orchestrator",
    text: "Coordinates agent steps and streams activity to the UI.",
  },
  {
    title: "HITL Review Layer",
    text: "Routes ambiguous or higher-risk recommendations for human review.",
  },
];

const metrics = [
  "Time to eligibility decision",
  "Eligible patients identified per trial",
  "Reviewer acceptance rate",
  "Human override rate",
  "Criteria-level accuracy",
  "False positive / false negative rate",
];

export default function ClinicalTrialPMPlaybook() {
  return (
    <div className="description-layout">
      <section className="description-hero card">
        <div className="description-kicker">PM Playbook</div>
        <h2>Agentic Clinical Trial Eligibility</h2>
        <p className="description-lead">
          A product management view of the demo: how the problem would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="description-highlight-grid">
          <div className="description-highlight-card">
            <div className="description-highlight-label">
              Discovery-led problem framing
            </div>
          </div>
          <div className="description-highlight-card">
            <div className="description-highlight-label">
              MVP scope and user workflow
            </div>
          </div>
          <div className="description-highlight-card">
            <div className="description-highlight-label">
              KPI and feedback loop design
            </div>
          </div>
          <div className="description-highlight-card">
            <div className="description-highlight-label">
              Clinical risk and HITL governance
            </div>
          </div>
        </div>
      </section>

      <div className="description-two-col">
        {playbookSections.map((section) => (
          <section key={section.title} className="description-section card">
            <div className="description-section-header">
              <div className="description-kicker">{section.eyebrow}</div>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </div>

            <ul className="description-bullet-list">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="description-section card">
        <div className="description-section-header">
          <div className="description-kicker">Solution Design</div>
          <h3>Agent Architecture</h3>
          <p>
            The product is designed as a multi-step workflow rather than a
            single black-box eligibility score.
          </p>
        </div>

        <div className="description-highlight-grid">
          {agentCards.map((agent) => (
            <div key={agent.title} className="description-highlight-card">
              <div className="description-highlight-label">{agent.title}</div>
              <p>{agent.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="description-section card">
        <div className="description-section-header">
          <div className="description-kicker">MVP</div>
          <h3>What This Demo Proves</h3>
          <p>
            The MVP validates whether users can understand, trust, and act on an
            AI-assisted eligibility recommendation.
          </p>
        </div>

        <div className="description-step-flow">
          {[
            "Select active trial",
            "Find ranked patient",
            "Run evaluation",
            "Review criteria evidence",
            "Approve or reject case",
          ].map((step, index, arr) => (
            <div key={step} className="description-step-flow-item">
              <div className="description-step-card">
                <div className="description-step-title">
                  {index + 1}. {step}
                </div>
              </div>
              {index < arr.length - 1 ? (
                <div className="description-step-arrow">→</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div className="description-two-col">
        <section className="description-section card">
          <div className="description-section-header">
            <div className="description-kicker">Metrics</div>
            <h3>Success KPI Framework</h3>
            <p>
              The north-star metric is trial enrollment efficiency: eligible
              patients identified per unit of screening time.
            </p>
          </div>

          <ul className="description-bullet-list">
            {metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </section>

        <section className="description-section card">
          <div className="description-section-header">
            <div className="description-kicker">Experimentation</div>
            <h3>Validation Plan</h3>
          </div>

          <ul className="description-bullet-list">
            <li>Compare agent-assisted screening vs manual review time.</li>
            <li>Measure reviewer trust with and without evidence display.</li>
            <li>Test HITL thresholds for low-confidence recommendations.</li>
          </ul>
        </section>
      </div>

      <section className="description-section card">
        <div className="description-section-header">
          <div className="description-kicker">Feedback Loop</div>
          <h3>Human-in-the-Loop Learning</h3>
          <p>
            Every recommendation should capture reviewer action, override
            reason, and criteria-level corrections so future eligibility
            evaluations become more accurate and easier to audit.
          </p>
        </div>
      </section>

      <div className="description-two-col">
        <section className="description-section card">
          <div className="description-section-header">
            <div className="description-kicker">Risks</div>
            <h3>Tradeoffs & Controls</h3>
          </div>

          <ul className="description-bullet-list">
            <li>Incorrect eligibility recommendations require HITL gating.</li>
            <li>Weak evidence quality requires structured validation.</li>
            <li>Fragmented data requires confidence scoring.</li>
            <li>Clinical adoption requires transparency over automation.</li>
          </ul>
        </section>

        <section className="description-section card">
          <div className="description-section-header">
            <div className="description-kicker">Reflection</div>
            <h3>PM Takeaway</h3>
            <p>
              The product opportunity is not simply automating screening. It is
              building a trusted decision-support workflow that improves speed
              while preserving clinician oversight, explainability, and
              auditability.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
