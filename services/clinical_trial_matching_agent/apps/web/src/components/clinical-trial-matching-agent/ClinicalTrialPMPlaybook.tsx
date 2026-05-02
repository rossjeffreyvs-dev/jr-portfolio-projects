"use client";
import Panel from "./Panel";

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

const validations = [
  "Compare agent-assisted screening vs manual review time.",
  "Measure reviewer trust with and without evidence display.",
  "Test HITL thresholds for low-confidence recommendations.",
];

const risks = [
  "Incorrect eligibility recommendations require HITL gating.",
  "Weak evidence quality requires structured validation.",
  "Fragmented data requires confidence scoring.",
  "Clinical adoption requires transparency over automation.",
];

function InlineIcon({ children }: { children: string }) {
  return <span className="clinical-playbook-inline-icon">{children}</span>;
}

export default function ClinicalTrialPMPlaybook() {
  return (
    <div className="description-layout clinical-playbook">
      <section className="description-hero card clinical-playbook-hero">
        <div className="clinical-playbook-title-row">
          {/* <InlineIcon>📖</InlineIcon> */}

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
          <Panel
            key={section.title}
            eyebrow={section.eyebrow}
            title={section.title}
            body={section.body}
            bullets={section.bullets}
          />
        ))}
      </div>

      <section className="description-section card clinical-playbook-card">
        <div className="description-section-header">
          <div className="clinical-playbook-section-heading">
            {/* <InlineIcon>🧩</InlineIcon> */}
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
            {/* <InlineIcon>🚀</InlineIcon> */}
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
        <Panel
          key="metrics"
          eyebrow="Metrics"
          title="Success KPI Framework"
          body="The north-star metric is trial enrollment efficiency: eligible
              patients identified per unit of screening time."
          bullets={metrics}
        />

        <Panel
          key="experimentation"
          eyebrow="Experimentation"
          title="Validation Plan"
          body=""
          bullets={validations}
        />
      </div>

      <Panel
        key="feedback"
        eyebrow="Feedback Loop"
        title="Human-in-the-Loop Learning"
        body="Every recommendation should capture reviewer action, override
            reason, and criteria-level corrections so future eligibility
            evaluations become more accurate and easier to audit."
      />

      <div className="description-two-col">
        <Panel
          key="risks"
          eyebrow="Risks"
          title="Tradeoffs & Controls"
          bullets={risks}
        />

        <Panel
          key="reflection"
          eyebrow="Reflection"
          title="PM Takeaway"
          body="The product opportunity is not simply automating screening. It is
              building a trusted decision-support workflow that improves speed
              while preserving clinician oversight, explainability, and
              auditability."
        />
      </div>
    </div>
  );
}
