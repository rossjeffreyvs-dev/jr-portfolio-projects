type IconName =
  | "workflow"
  | "chart"
  | "news"
  | "sparkles"
  | "client"
  | "problem"
  | "solution"
  | "overview"
  | "architecture";

type Highlight = {
  label: string;
  icon: IconName;
};

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
  introTitle: "AI-Assisted FX Market Intelligence Workflow",
  introBody:
    "AI FX Insights is a market commentary workflow that combines exchange-rate data, current market headlines, and LLM-generated analysis into a concise client-ready report. It demonstrates how real-time market inputs can be orchestrated into a guided, explainable workflow instead of exposing users to raw data and disconnected tools.",
  highlights: [
    { label: "Live FX data retrieval", icon: "chart" },
    { label: "Market headline aggregation", icon: "news" },
    { label: "Streaming AI-generated report", icon: "sparkles" },
    { label: "Progressive user feedback", icon: "workflow" },
    { label: "Client-ready advisory output", icon: "client" },
  ],
  overview: [
    "Financial users often need to translate rate movement, market headlines, and macro context into a clear client-facing narrative. That work usually requires jumping across tools, collecting raw figures, scanning current headlines, and manually writing commentary.",
    "This demo presents that workflow as a staged product experience. Rather than treating AI output as a one-step response, the application shows data retrieval, news context, report generation, and final narrative output as visible steps in a transparent workflow.",
  ],
  problem: [
    "FX commentary requires both quantitative and qualitative context. Exchange-rate changes alone are rarely enough; users also need market headlines, geographic context, and a concise explanation of what changed and why it matters.",
    "The UX challenge is making a multi-step workflow feel responsive while external APIs and AI generation are running. Users need confidence that the system is progressing, not silently waiting on a black-box response.",
  ],
  solution: [
    "AI FX Insights simulates a market-intelligence pipeline that retrieves selected FX rates, gathers relevant headlines, and generates a structured briefing using an LLM.",
    "The experience emphasizes visibility and flow. The interface shows progress stages, streams report content, and presents the final narrative in a format suitable for analyst review or client communication.",
  ],
  howItWorks: [
    {
      step: "1. Market Inputs",
      title: "Market Inputs",
      description:
        "The user selects a base currency, quote currencies, and countries for headline context.",
      icon: "workflow",
    },
    {
      step: "2. Rate Retrieval",
      title: "Rate Retrieval",
      description:
        "The backend retrieves current exchange-rate data for selected currency pairs.",
      icon: "chart",
    },
    {
      step: "3. News Context",
      title: "News Context",
      description:
        "The workflow gathers recent headlines that may explain or contextualize market movement.",
      icon: "news",
    },
    {
      step: "4. Insight Synthesis",
      title: "Insight Synthesis",
      description:
        "An LLM combines market data and headlines into concise FX commentary.",
      icon: "sparkles",
    },
    {
      step: "5. Client Report",
      title: "Client Report",
      description:
        "The application streams and displays a client-ready market summary for review.",
      icon: "client",
    },
  ],
  architecture: [
    {
      title: "Frontend",
      subtitle: "React / TypeScript",
      tone: "blue",
      items: [
        "Project shell",
        "Input controls",
        "Stage indicators",
        "Streaming report viewer",
        "Case-study tabs",
      ],
    },
    {
      title: "Application Services",
      subtitle: "Python workflow service",
      tone: "purple",
      items: [
        "FX rate endpoint",
        "Market news endpoint",
        "SSE streaming endpoint",
        "REST fallback endpoint",
        "Report generation workflow",
      ],
    },
    {
      title: "Data + AI Layer",
      subtitle: "External data + LLM synthesis",
      tone: "green",
      items: [
        "FX rate API",
        "Market news API",
        "Prompted report generation",
        "Mock/fallback demo data",
        "Client-ready narrative output",
      ],
    },
  ],
  workflowAgents: [
    {
      title: "Rate Retrieval Agent",
      description:
        "Collects current exchange rates for the selected base and quote currencies.",
      tone: "green",
      icon: "chart",
    },
    {
      title: "Market News Agent",
      description:
        "Retrieves recent headlines and market context for the selected countries.",
      tone: "blue",
      icon: "news",
    },
    {
      title: "Insight Synthesis Agent",
      description:
        "Combines quantitative rate movement and qualitative news context into an interpretation.",
      tone: "purple",
      icon: "sparkles",
    },
    {
      title: "Report Generation Agent",
      description:
        "Formats the analysis as a concise, client-ready FX briefing.",
      tone: "orange",
      icon: "client",
    },
    {
      title: "User Review Loop",
      description:
        "Keeps the user in control by exposing intermediate stages and final output for review.",
      tone: "pink",
      icon: "workflow",
    },
  ],
  results: [
    "Demonstrates a realistic AI workflow beyond a single chatbot-style response.",
    "Shows how data retrieval, external context, and LLM synthesis can work together in one product flow.",
    "Uses streaming UX to improve perceived speed and make system progress visible.",
    "Provides a reusable pattern for financial-services intelligence and client-advisory workflows.",
  ],
  takeaways: [
    "Market intelligence products are stronger when raw data is converted into concise, reviewable narratives.",
    "Streaming progress helps users trust multi-step AI workflows that depend on external systems.",
    "LLMs are most useful when grounded by structured data and contextual retrieval.",
    "Agent-style decomposition makes workflow responsibilities easier to explain and evaluate.",
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

        {name === "chart" ? (
          <>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 3-4 3 2 4-7" />
          </>
        ) : null}

        {name === "news" ? (
          <>
            <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
            <path d="M8 8h7" />
            <path d="M8 12h7" />
            <path d="M8 16h4" />
          </>
        ) : null}

        {name === "sparkles" ? (
          <>
            <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
            <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
          </>
        ) : null}

        {name === "client" ? (
          <>
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </>
        ) : null}

        {name === "problem" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </>
        ) : null}

        {name === "solution" ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
          </>
        ) : null}

        {name === "overview" || name === "architecture" ? (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description?: string;
}) {
  return (
    <div className="description-section-header">
      <SectionIcon name={icon} />
      <div>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

function TextSection({
  icon,
  title,
  paragraphs,
}: {
  icon: IconName;
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="description-card section-card">
      <SectionHeader icon={icon} title={title} />
      <div className="description-copy">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function FxProjectDescription() {
  return (
    <div className="project-description">
      <section className="description-card overview-card">
        <p className="description-eyebrow">Project Overview</p>
        <h2>{DESCRIPTION_CONTENT.introTitle}</h2>
        <p className="description-lede">{DESCRIPTION_CONTENT.introBody}</p>

        <div className="description-highlight-grid">
          {DESCRIPTION_CONTENT.highlights.map((highlight) => (
            <div className="description-highlight" key={highlight.label}>
              <SectionIcon name={highlight.icon} />
              <span>{highlight.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="problem-solution-grid">
        <article className="description-card section-card">
          <SectionHeader icon="problem" title="Problem" />
          <div className="description-copy">
            {DESCRIPTION_CONTENT.problem.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="description-card section-card">
          <SectionHeader icon="solution" title="Solution" />
          <div className="description-copy">
            {DESCRIPTION_CONTENT.solution.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>

      <TextSection
        icon="overview"
        title="Overview"
        paragraphs={DESCRIPTION_CONTENT.overview}
      />

      <section className="description-card section-card">
        <SectionHeader
          icon="workflow"
          title="How It Works"
          description="A high-level view of the simulated workflow from market inputs to client report."
        />

        <div className="workflow-step-grid">
          {DESCRIPTION_CONTENT.howItWorks.map((step, index) => (
            <div className="workflow-step-pair" key={step.step}>
              <article className="workflow-step-card">
                <p>{step.step}</p>
                <SectionIcon name={step.icon} />
                <h4>{step.title}</h4>
                <span>{step.description}</span>
              </article>

              {index < DESCRIPTION_CONTENT.howItWorks.length - 1 ? (
                <div className="workflow-arrow">→</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="description-card section-card">
        <SectionHeader
          icon="architecture"
          title="System Architecture"
          description="The demo is intentionally small, but structured like a production workflow."
        />

        <div className="architecture-column-grid">
          {DESCRIPTION_CONTENT.architecture.map((column) => (
            <article
              className={`architecture-column architecture-${column.tone}`}
              key={column.title}
            >
              <p>{column.subtitle}</p>
              <h4>{column.title}</h4>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="description-card section-card">
        <SectionHeader
          icon="sparkles"
          title="Agent Workflow"
          description="The workflow is modeled as specialized agent responsibilities rather than a single opaque response."
        />

        <div className="agent-grid">
          {DESCRIPTION_CONTENT.workflowAgents.map((agent) => (
            <article
              className={`agent-card agent-${agent.tone}`}
              key={agent.title}
            >
              <SectionIcon name={agent.icon} />
              <h4>{agent.title}</h4>
              <p>{agent.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="description-card section-card takeaway-grid-section">
        <div>
          <SectionHeader icon="solution" title="Results & Portfolio Value" />
          <ul className="check-list">
            {DESCRIPTION_CONTENT.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader icon="sparkles" title="Key Takeaways" />
          <ul className="check-list">
            {DESCRIPTION_CONTENT.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="demo-note-card">
        <div>
          <p>Demo flow</p>
          <h3>Use the Demo tab to generate a streaming FX market report.</h3>
        </div>
        <span>Rates → News → AI report → Reviewable client summary</span>
      </section>
    </div>
  );
}
