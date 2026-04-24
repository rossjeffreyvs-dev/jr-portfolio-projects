import type { ReactNode } from "react";

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
      step: "1. Patient Selection",
      title: "Patient Selection",
      description:
        "A patient is selected from the active trial’s eligible population.",
      icon: "users",
    },
    {
      step: "2. Eligibility Evaluation",
      title: "Eligibility Evaluation",
      description:
        "Agents evaluate patient data against inclusion and exclusion criteria.",
      icon: "clipboard",
    },
    {
      step: "3. Recommendation",
      title: "Recommendation",
      description:
        "A recommendation with rationale and confidence is generated.",
      icon: "sparkles",
    },
    {
      step: "4. Evidence Review",
      title: "Evidence Review",
      description: "Criteria-level evidence is presented for transparency.",
      icon: "target",
    },
    {
      step: "5. Human Review",
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
  return (
    <span className="description-icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {name === "workflow" ? (
          <>
            <path d="M12 5v4" />
            <path d="M6 19v-4" />
            <path d="M18 19v-4" />
            <path d="M12 9H7a1 1 0 0 0-1 1v1" />
            <path d="M12 9h5a1 1 0 0 1 1 1v1" />
            <rect x="9" y="3" width="6" height="4" rx="1.5" />
            <rect x="3" y="15" width="6" height="6" rx="1.5" />
            <rect x="15" y="15" width="6" height="6" rx="1.5" />
          </>
        ) : null}

        {name === "shield" ? (
          <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
        ) : null}

        {name === "clipboard" ? (
          <>
            <rect x="6" y="5" width="12" height="16" rx="2" />
            <path d="M9 5.5h6V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.5z" />
            <path d="M9 11h6" />
            <path d="M9 15h6" />
          </>
        ) : null}

        {name === "users" ? (
          <>
            <path d="M16 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
            <circle cx="10" cy="8" r="3" />
            <path d="M20 20v-1a3 3 0 0 0-2-2.83" />
            <path d="M16 5.13a3 3 0 0 1 0 5.74" />
          </>
        ) : null}

        {name === "target" ? (
          <>
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
          </>
        ) : null}

        {name === "problem" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.8-1.2 1.2-1.2 2.2" />
            <circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
          </>
        ) : null}

        {name === "solution" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.2 2.2 4.8-5" />
          </>
        ) : null}

        {name === "overview" ? (
          <>
            <path d="M7 3h7l3 3v15H7z" />
            <path d="M14 3v4h4" />
            <path d="M10 12h4" />
            <path d="M10 16h4" />
          </>
        ) : null}

        {name === "architecture" ? (
          <>
            <rect x="3" y="4" width="18" height="4" rx="1.5" />
            <rect x="3" y="10" width="18" height="4" rx="1.5" />
            <rect x="3" y="16" width="18" height="4" rx="1.5" />
            <path d="M7 8v2" />
            <path d="M12 14v2" />
            <path d="M17 8v2" />
          </>
        ) : null}

        {name === "sparkles" ? (
          <>
            <path d="m12 4 1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4z" />
            <path d="M19 4v3" />
            <path d="M20.5 5.5h-3" />
          </>
        ) : null}
      </svg>
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
        <DescriptionSection title="Problem" icon="problem">
          {DESCRIPTION_CONTENT.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </DescriptionSection>

        <DescriptionSection title="Solution" icon="solution">
          {DESCRIPTION_CONTENT.solution.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </DescriptionSection>
      </div>

      <DescriptionSection title="Overview" icon="overview">
        {DESCRIPTION_CONTENT.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </DescriptionSection>

      <DescriptionSection
        title="How It Works"
        icon="workflow"
        intro="A high-level view of the simulated workflow from candidate selection through review."
      >
        <div className="description-step-flow">
          {DESCRIPTION_CONTENT.howItWorks.map((item, index) => (
            <div key={item.step} className="description-step-flow-item">
              <div className="description-step-card">
                <div className="description-step-title">{item.step}</div>
                <div className="description-step-icon-wrap">
                  <SectionIcon name={item.icon} />
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
        icon="architecture"
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
        icon="users"
        intro="A closer look at the simulated multi-agent workflow that powers each evaluation."
      >
        <div className="description-agent-layout">
          <div className="description-agent-flow">
            {DESCRIPTION_CONTENT.workflowAgents.map((agent, index) => (
              <div key={agent.title} className="description-agent-flow-item">
                <div className={`description-agent-card tone-${agent.tone}`}>
                  <div className="description-agent-card-icon">
                    <SectionIcon name={agent.icon} />
                  </div>
                  <div className="description-agent-title">{agent.title}</div>
                  <p>{agent.description}</p>
                </div>

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
        <DescriptionSection title="Results & Impact" icon="sparkles">
          <ul className="description-bullet-list">
            {DESCRIPTION_CONTENT.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DescriptionSection>

        <DescriptionSection title="Key Takeaways" icon="sparkles">
          <ul className="description-bullet-list">
            {DESCRIPTION_CONTENT.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DescriptionSection>
      </div>

      <div className="description-note cardish">
        This is a simulated environment with mock data for demonstration
        purposes. The workflow, data, and results are fictional and are not
        intended for clinical decision-making.
      </div>
    </div>
  );
}
