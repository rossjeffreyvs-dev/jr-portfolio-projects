"use client";

const playbookSections = [
  {
    title: "Problem Framing & Discovery",
    eyebrow: "Discovery",
    icon: "🔎",
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
    icon: "🎯",
    body: "Build an agentic system that evaluates patient eligibility for clinical trials with explainable, auditable, and continuously improving decision workflows.",
    bullets: [
      "Explainable AI decisioning",
      "Human-in-the-loop control",
      "Structured and unstructured data fusion",
      "Transparent workflow playback",
    ],
  },
];

const highlightCards = [
  {
    icon: "🧭",
    label: "Discovery-led problem framing",
  },
  {
    icon: "👥",
    label: "MVP scope and user workflow",
  },
  {
    icon: "📈",
    label: "KPI and feedback loop design",
  },
  {
    icon: "🛡️",
    label: "Clinical risk and HITL governance",
  },
];

const agentCards = [
  {
    icon: "📋",
    title: "Trial Parsing Agent",
    text: "Extracts and normalizes eligibility criteria from protocol language.",
  },
  {
    icon: "👤",
    title: "Patient Matching Agent",
    text: "Ranks likely candidates based on trial-specific patient context.",
  },
  {
    icon: "✅",
    title: "Eligibility Evaluation Agent",
    text: "Evaluates each patient against inclusion and exclusion criteria.",
  },
  {
    icon: "🔀",
    title: "Workflow Orchestrator",
    text: "Coordinates agent steps and streams activity to the UI.",
  },
  {
    icon: "🧑‍⚕️",
    title: "HITL Review Layer",
    text: "Routes ambiguous or higher-risk recommendations for human review.",
  },
];

const mvpSteps = [
  {
    icon: "🧪",
    title: "Select active trial",
    text: "Choose an active clinical trial to evaluate against and load its eligibility criteria and context.",
  },
  {
    icon: "🔍",
    title: "Find ranked patient",
    text: "Identify and rank likely candidate patients based on trial-specific eligibility signals.",
  },
  {
    icon: "⚙️",
    title: "Run evaluation",
    text: "Execute the multi-agent workflow to assess each patient against inclusion and exclusion criteria.",
  },
  {
    icon: "📑",
    title: "Review criteria evidence",
    text: "Inspect criterion-level matches, supporting evidence, and rationale behind the recommendation.",
  },
  {
    icon: "✅",
    title: "Approve or reject case",
    text: "Make a final decision or request additional review for borderline or ambiguous cases.",
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

function InlineIcon({ children }: { children: string }) {
  return <span className="clinical-playbook-inline-icon">{children}</span>;
}

export default function ClinicalTrialPMPlaybook() {
  return (
    <div className="description-layout clinical-playbook">
      <section className="description-hero card clinical-playbook-hero">
        <div className="clinical-playbook-title-row">
          <InlineIcon>📖</InlineIcon>

          <div>
            <div className="description-kicker">PM Playbook</div>
            <h2>Agentic Clinical Trial Eligibility</h2>
          </div>
        </div>

        <p className="description-lead">
          A product management view of the demo: how the problem would be
          discovered, scoped, shipped, measured, and improved through feedback.
        </p>

        <div className="clinical-playbook-highlight-grid">
          {highlightCards.map((card) => (
            <div key={card.label} className="clinical-playbook-highlight-card">
              <InlineIcon>{card.icon}</InlineIcon>
              <div className="description-highlight-label">{card.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="description-two-col">
        {playbookSections.map((section) => (
          <section
            key={section.title}
            className="description-section card clinical-playbook-card"
          >
            <div className="description-section-header">
              <div className="clinical-playbook-section-heading">
                <InlineIcon>{section.icon}</InlineIcon>
                <div>
                  <div className="description-kicker">{section.eyebrow}</div>
                  <h3>{section.title}</h3>
                </div>
              </div>

              <p>{section.body}</p>
            </div>

            <ul className="description-bullet-list clinical-playbook-list">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="description-section card clinical-playbook-card">
        <div className="description-section-header">
          <div className="clinical-playbook-section-heading">
            <InlineIcon>🧩</InlineIcon>
            <div>
              <div className="description-kicker">Solution Design</div>
              <h3>Agent Architecture</h3>
            </div>
          </div>

          <p>
            The product is designed as a multi-step workflow rather than a
            single black-box eligibility score.
          </p>
        </div>

        <div className="clinical-playbook-agent-flow clinical-playbook-product-flow">
          {agentCards.map((agent, index) => (
            <div key={agent.title} className="clinical-playbook-flow-item">
              <div className="clinical-playbook-agent-card clinical-playbook-flow-card">
                <div className="clinical-playbook-flow-title">
                  <InlineIcon>{agent.icon}</InlineIcon>
                  <strong>{agent.title}</strong>
                </div>
                <p>{agent.text}</p>
              </div>

              {index < agentCards.length - 1 ? (
                <div className="clinical-playbook-arrow" aria-hidden="true">
                  →
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="description-section card clinical-playbook-card">
        <div className="description-section-header">
          <div className="clinical-playbook-section-heading">
            <InlineIcon>🚀</InlineIcon>
            <div>
              <div className="description-kicker">MVP</div>
              <h3>What This Demo Proves</h3>
            </div>
          </div>

          <p>
            The MVP validates whether users can understand, trust, and act on an
            AI-assisted eligibility recommendation.
          </p>
        </div>

        <div className="clinical-playbook-step-flow clinical-playbook-product-flow clinical-playbook-mvp-flow">
          {mvpSteps.map((step, index) => (
            <div key={step.title} className="clinical-playbook-flow-item">
              <div className="clinical-playbook-step-card clinical-playbook-flow-card">
                <div className="clinical-playbook-flow-title">
                  <InlineIcon>{step.icon}</InlineIcon>
                  <strong>{step.title}</strong>
                </div>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="description-two-col">
        <section className="description-section card clinical-playbook-card clinical-playbook-blue">
          <div className="description-section-header">
            <div className="clinical-playbook-section-heading">
              <InlineIcon>📊</InlineIcon>
              <div>
                <div className="description-kicker">Metrics</div>
                <h3>Success KPI Framework</h3>
              </div>
            </div>

            <p>
              The north-star metric is trial enrollment efficiency: eligible
              patients identified per unit of screening time.
            </p>
          </div>

          <ul className="description-bullet-list clinical-playbook-list">
            {metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </section>

        <section className="description-section card clinical-playbook-card clinical-playbook-green">
          <div className="description-section-header">
            <div className="clinical-playbook-section-heading">
              <InlineIcon>🧪</InlineIcon>
              <div>
                <div className="description-kicker">Experimentation</div>
                <h3>Validation Plan</h3>
              </div>
            </div>
          </div>

          <ul className="description-bullet-list clinical-playbook-list">
            <li>Compare agent-assisted screening vs manual review time.</li>
            <li>Measure reviewer trust with and without evidence display.</li>
            <li>Test HITL thresholds for low-confidence recommendations.</li>
          </ul>
        </section>
      </div>

      <section className="description-section card clinical-playbook-card clinical-playbook-purple">
        <div className="description-section-header">
          <div className="clinical-playbook-section-heading">
            <InlineIcon>🔁</InlineIcon>
            <div>
              <div className="description-kicker">Feedback Loop</div>
              <h3>Human-in-the-Loop Learning</h3>
            </div>
          </div>

          <p>
            Every recommendation should capture reviewer action, override
            reason, and criteria-level corrections so future eligibility
            evaluations become more accurate and easier to audit.
          </p>
        </div>
      </section>

      <div className="description-two-col">
        <section className="description-section card clinical-playbook-card clinical-playbook-orange">
          <div className="description-section-header">
            <div className="clinical-playbook-section-heading">
              <InlineIcon>⚠️</InlineIcon>
              <div>
                <div className="description-kicker">Risks</div>
                <h3>Tradeoffs & Controls</h3>
              </div>
            </div>
          </div>

          <ul className="description-bullet-list clinical-playbook-list">
            <li>Incorrect eligibility recommendations require HITL gating.</li>
            <li>Weak evidence quality requires structured validation.</li>
            <li>Fragmented data requires confidence scoring.</li>
            <li>Clinical adoption requires transparency over automation.</li>
          </ul>
        </section>

        <section className="description-section card clinical-playbook-card clinical-playbook-green">
          <div className="description-section-header">
            <div className="clinical-playbook-section-heading">
              <InlineIcon>💡</InlineIcon>
              <div>
                <div className="description-kicker">Reflection</div>
                <h3>PM Takeaway</h3>
              </div>
            </div>

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
