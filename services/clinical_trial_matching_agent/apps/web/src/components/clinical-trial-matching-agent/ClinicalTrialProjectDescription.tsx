import type { ReactNode } from "react";
import Panel from "./Panel";

type IconName =
  | "workflow"
  | "shield"
  | "clipboard"
  | "users"
  | "target"
  | "problem"
  | "solution"
  | "overview"
  | "architecture"
  | "sparkles";

type Highlight = { label: string; icon: IconName };

type Step = {
  step: string;
  title: string;
  description: string;
  icon: IconName;
};

type ArchitectureColumn = {
  title: string;
  subtitle: string;
  tone: "blue" | "purple" | "green";
  items: string[];
};

type WorkflowAgent = {
  title: string;
  description: string;
  tone: "green" | "blue" | "purple" | "orange" | "pink";
  icon: IconName;
};

const DESCRIPTION_CONTENT: {
  introTitle: string;
  introBody: string;
  highlights: Highlight[];
  overview: string[];
  problem: string[];
  solution: string[];
  howItWorks: Step[];
  architecture: ArchitectureColumn[];
  workflowAgents: WorkflowAgent[];
  results: string[];
  takeaways: string[];
} = {
  introTitle: "AI-Assisted Clinical Trial Matching Workflow",
  introBody:
    "Clinical Trial Matching Agent is a simulated multi-agent application that evaluates patient eligibility against clinical trial criteria using a structured workflow. It demonstrates how patient context, protocol criteria, recommendation logic, and human review can work together in an explainable screening process.",
  highlights: [
    { label: "Multi-step agent workflow", icon: "workflow" },
    { label: "Explainable recommendations", icon: "shield" },
    { label: "Criteria-level evidence & rationale", icon: "clipboard" },
    { label: "Human-in-the-loop review", icon: "users" },
    { label: "Trial-specific patient & evaluation flows", icon: "target" },
  ],
  overview: [
    "Clinical trial screening is often time-consuming because eligibility criteria are written in protocol language while patient information is spread across multiple structured and unstructured sources. Reviewers need a faster way to assess likely matches without losing transparency into why a patient was recommended or excluded.",
    "This demo presents that challenge as a staged agent workflow. Rather than treating trial matching as a single opaque AI decision, the system breaks the process into patient selection, eligibility evaluation, recommendation generation, evidence review, and human approval.",
  ],
  problem: [
    "Clinical trial screening is slow and complex. Eligibility criteria are nuanced, patient records can be incomplete, and many cases require manual interpretation of inclusion and exclusion rules across multiple systems.",
    "Teams need a faster way to identify likely candidates while preserving transparency, auditability, and clinician oversight.",
  ],
  solution: [
    "This system simulates a multi-agent workflow that evaluates a selected patient against an active trial and produces an explainable recommendation. The workflow breaks screening into clear stages with evidence, rationale, and review handling.",
    "The experience emphasizes transparency over black-box scoring. Users can inspect why a recommendation was made, replay workflow activity, review flagged cases, change the active trial, and reset the demo to explore different screening paths.",
  ],
  howItWorks: [
    {
      step: "Patient Selection",
      title: "Patient Selection",
      description:
        "A patient is selected from the active trial’s eligible population.",
      icon: "users",
    },
    {
      step: "Eligibility Evaluation",
      title: "Eligibility Evaluation",
      description:
        "Agents evaluate patient data against inclusion and exclusion criteria.",
      icon: "clipboard",
    },
    {
      step: "Recommendation",
      title: "Recommendation",
      description:
        "A recommendation with rationale and confidence is generated.",
      icon: "sparkles",
    },
    {
      step: "Evidence Review",
      title: "Evidence Review",
      description: "Criteria-level evidence is presented for transparency.",
      icon: "target",
    },
    {
      step: "Human Review",
      title: "Human Review",
      description: "Reviewers approve, reject, or request more information.",
      icon: "users",
    },
  ],
  architecture: [
    {
      title: "Frontend",
      subtitle: "Next.js / React",
      tone: "blue",
      items: [
        "Dashboard",
        "Patient Selector",
        "Evaluation Viewer",
        "Workflow Activity",
        "Review Panel",
      ],
    },
    {
      title: "Application Services",
      subtitle: "API + Workflow Layer",
      tone: "purple",
      items: [
        "Trial Service",
        "Patient Service",
        "Evaluation Service",
        "Review Service",
        "Playback Service",
        "Demo Reset Service",
      ],
    },
    {
      title: "Data Layer",
      subtitle: "Mock Dataset",
      tone: "green",
      items: [
        "Trials",
        "Patients",
        "Evaluations",
        "Criteria Evidence",
        "Reviews",
        "Workflow Steps",
      ],
    },
  ],
  workflowAgents: [
    {
      title: "Patient Context Agent",
      description:
        "Collects and structures patient data relevant to the active trial.",
      tone: "green",
      icon: "users",
    },
    {
      title: "Criteria Interpretation Agent",
      description:
        "Parses protocol criteria and converts them into machine-usable rules.",
      tone: "blue",
      icon: "overview",
    },
    {
      title: "Eligibility Evaluation Agent",
      description:
        "Evaluates patient data against each criterion and determines match status.",
      tone: "purple",
      icon: "target",
    },
    {
      title: "Recommendation Agent",
      description:
        "Generates the overall recommendation with rationale and confidence.",
      tone: "orange",
      icon: "sparkles",
    },
    {
      title: "Review Agent (Human)",
      description:
        "Makes the final decision or requests more review for ambiguous cases.",
      tone: "pink",
      icon: "users",
    },
  ],
  results: [
    "Demonstrates a more realistic clinical AI product pattern than a single chatbot response.",
    "Provides transparency through criteria-level evidence and workflow explainability.",
    "Supports human-in-the-loop review for ambiguous or higher-risk cases.",
    "Creates a reusable foundation for richer protocol parsing, patient cohorts, and reviewer collaboration.",
  ],
  takeaways: [
    "Clinical AI applications are stronger when recommendation logic is visible, reviewable, and tied to evidence.",
    "Human-in-the-loop design is essential for ambiguous eligibility cases.",
    "A staged workflow makes trial matching easier to understand than a single pass/fail output.",
    "Explainability builds trust with clinicians and accelerates adoption.",
  ],
};

function SectionIcon({ name }: { name: IconName }) {
  const icons: Record<IconName, string> = {
    workflow: "🧭",
    shield: "🛡️",
    clipboard: "📋",
    users: "👥",
    target: "🎯",
    problem: "?",
    solution: "✓",
    overview: "📄",
    architecture: "🏗️",
    sparkles: "✨",
  };

  return (
    <span
      className={`description-icon description-icon-${name}`}
      aria-hidden="true"
    >
      {icons[name]}
    </span>
  );
}

function DescriptionSection({
  title,
  icon,
  intro,
  children,
}: {
  title: string;
  icon?: IconName;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="description-section card">
      <div className="description-section-header">
        <div className="description-section-title-row">
          {icon ? <SectionIcon name={icon} /> : null}
          <h3>{title}</h3>
        </div>
        {intro ? <p>{intro}</p> : null}
      </div>
      <div className="description-section-body">{children}</div>
    </section>
  );
}

export default function ClinicalTrialProjectDescription() {
  return (
    <div className="description-layout">
      <section className="description-hero card">
        <div className="description-kicker">Project Overview</div>
        <h2>{DESCRIPTION_CONTENT.introTitle}</h2>
        <p className="description-lead">{DESCRIPTION_CONTENT.introBody}</p>

        <div className="description-highlight-grid">
          {DESCRIPTION_CONTENT.highlights.map((item) => (
            <div key={item.label} className="description-highlight-card">
              <SectionIcon name={item.icon} />
              <div className="description-highlight-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="description-two-col">
        <Panel
          eyebrow="Problem"
          title="Clinical trial screening is slow, complex, and highly manual"
        >
          {DESCRIPTION_CONTENT.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Panel>

        <Panel
          eyebrow="Solution"
          title="A transparent, explainable screening workflow"
        >
          {DESCRIPTION_CONTENT.solution.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Panel>
      </div>

      <Panel
        eyebrow="Overview"
        title="Reframing clinical trial screening as a structured workflow"
      >
        {DESCRIPTION_CONTENT.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Panel>

      <DescriptionSection
        title="How It Works"
        intro="A high-level view of the simulated workflow from candidate selection through review."
      >
        <div className="description-step-flow">
          {DESCRIPTION_CONTENT.howItWorks.map((item, index) => (
            <div key={item.step} className="description-step-flow-item">
              <div className="description-step-card">
                <div className="description-step-title">
                  <SectionIcon name={item.icon} />
                  <span>{item.step.replace(/^\d+\.\s*/, "")}</span>
                </div>
                <p>{item.description}</p>
              </div>
              {index < DESCRIPTION_CONTENT.howItWorks.length - 1 ? (
                <div className="description-step-arrow" aria-hidden="true">
                  →
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </DescriptionSection>

      <DescriptionSection
        title="System Architecture"
        intro="The application combines a modern frontend, API-driven workflow services, and a structured mock data layer."
      >
        <div className="description-architecture-layout">
          <div className="description-architecture-grid">
            {DESCRIPTION_CONTENT.architecture.map((column) => (
              <div
                key={column.title}
                className={`description-architecture-card tone-${column.tone}`}
              >
                <div className="description-architecture-title">
                  {column.title}
                </div>
                <div className="description-architecture-subtitle">
                  {column.subtitle}
                </div>
                <div className="description-architecture-items">
                  {column.items.map((item) => (
                    <div key={item} className="description-architecture-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DescriptionSection>

      <DescriptionSection
        title="Agent Workflow"
        intro="A closer look at the simulated multi-agent workflow that powers each evaluation."
      >
        <div className="description-agent-layout">
          <div className="description-agent-flow">
            {DESCRIPTION_CONTENT.workflowAgents.map((agent, index) => (
              <div key={agent.title} className="description-agent-flow-item">
                <div className="description-step-card">
                  <div className="description-step-title">
                    <SectionIcon name={agent.icon} />
                    <span>{agent.title}</span>
                  </div>
                  <p>{agent.description}</p>
                </div>

                {/* <div className={`description-agent-card tone-${agent.tone}`}>
                  <div className="description-agent-card-icon">
                    <SectionIcon name={agent.icon} />
                  </div>
                  <div className="description-agent-title">{agent.title}</div>
                  <p>{agent.description}</p>
                </div>
 */}
                {index < DESCRIPTION_CONTENT.workflowAgents.length - 1 ? (
                  <div className="description-step-arrow" aria-hidden="true">
                    →
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </DescriptionSection>

      <div className="description-two-col">
        <Panel
          eyebrow="What this enables"
          title="Turning a demo into a real clinical workflow system"
          bullets={DESCRIPTION_CONTENT.results}
        />

        <Panel
          eyebrow="What this enables"
          title="Designing clinical AI systems for transparency and trust"
          bullets={DESCRIPTION_CONTENT.takeaways}
        />
      </div>

      <div className="ui-disclaimer">
        This is a simulated demo using mock data. The workflow, data, and
        results are illustrative and not intended for clinical decision-making.
      </div>
    </div>
  );
}
