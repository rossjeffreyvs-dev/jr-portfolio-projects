type IconName =
  | "search"
  | "brain"
  | "database"
  | "chart"
  | "shield"
  | "problem"
  | "solution"
  | "overview"
  | "workflow"
  | "architecture"
  | "feedback";

type Highlight = {
  label: string;
  icon: IconName;
};

type WorkflowStep = {
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

type SearchLayer = {
  title: string;
  description: string;
  tone: "green" | "blue" | "purple" | "orange" | "pink";
  icon: IconName;
};

const DESCRIPTION_CONTENT = {
  introTitle: "Semantic Patient Search",
  introBody:
    "Semantic Patient Search is a healthcare discovery demo that shows how synthetic patient, demographic, and clinical records can be transformed into searchable patient profiles. Instead of relying on exact keyword matches, the system interprets natural-language intent and returns conceptually relevant patient records.",

  highlights: [
    { label: "Natural-language patient discovery", icon: "search" },
    { label: "Embedding-based semantic ranking", icon: "brain" },
    { label: "Structured + narrative retrieval", icon: "database" },
    { label: "Explainable result matching", icon: "chart" },
    { label: "Synthetic healthcare dataset", icon: "shield" },
  ] satisfies Highlight[],

  problem: [
    "Healthcare researchers often need to identify patient cohorts based on nuanced clinical context, but relevant information may be distributed across demographics, diagnoses, medications, labs, and narrative summaries.",
    "Keyword search can miss clinically relevant records when the user’s wording differs from the source data, making cohort discovery slow, brittle, and dependent on technical intermediaries.",
  ],

  solution: [
    "This demo creates a searchable semantic profile for each synthetic patient, converts both the user query and patient profile into comparable representations, and ranks matches using semantic similarity.",
    "The experience emphasizes discovery, explainability, and researcher usability: users can ask clinical questions in natural language and inspect why each patient was returned.",
  ],

  overview: [
    "The application demonstrates how healthcare-oriented search can be improved by combining structured data and narrative context into a unified semantic representation.",
    "Each patient profile is assembled from multiple data elements so the system can retrieve clinically similar records even when wording differs from the source data.",
  ],

  howItWorks: [
    {
      step: "1. Query",
      title: "Natural-Language Query",
      description:
        "A user enters a clinical research question using familiar language.",
      icon: "search",
    },
    {
      step: "2. Profile Assembly",
      title: "Patient Profile Assembly",
      description:
        "Demographics, diagnoses, medications, labs, and summaries are combined.",
      icon: "database",
    },
    {
      step: "3. Embedding",
      title: "Semantic Representation",
      description:
        "The query and patient profiles are converted into comparable vectors.",
      icon: "brain",
    },
    {
      step: "4. Ranking",
      title: "Similarity Ranking",
      description:
        "The system ranks patients by conceptual similarity to the query.",
      icon: "chart",
    },
    {
      step: "5. Explanation",
      title: "Match Explanation",
      description:
        "Results include rationale showing why each patient matched.",
      icon: "feedback",
    },
  ] satisfies WorkflowStep[],

  architecture: [
    {
      title: "Frontend",
      subtitle: "React / Vite",
      tone: "blue",
      items: [
        "Tabbed project views",
        "Natural-language query input",
        "Search progress state",
        "Ranked result cards",
        "Explanation display",
      ],
    },
    {
      title: "Application Services",
      subtitle: "Python API Layer",
      tone: "purple",
      items: [
        "Health endpoint",
        "Sample query support",
        "Search endpoint",
        "Profile assembly",
        "Similarity scoring",
      ],
    },
    {
      title: "Data Layer",
      subtitle: "Synthetic Dataset",
      tone: "green",
      items: [
        "Patient demographics",
        "Diagnoses",
        "Medications",
        "Labs",
        "Clinical summaries",
      ],
    },
  ] satisfies ArchitectureColumn[],

  searchLayers: [
    {
      title: "Intent Interpretation",
      description:
        "Transforms the user’s natural-language prompt into a search intent.",
      tone: "green",
      icon: "search",
    },
    {
      title: "Profile Context",
      description:
        "Combines structured and narrative patient attributes into a search profile.",
      tone: "blue",
      icon: "database",
    },
    {
      title: "Semantic Retrieval",
      description:
        "Ranks patients using conceptual similarity rather than exact keyword overlap.",
      tone: "purple",
      icon: "brain",
    },
    {
      title: "Result Explanation",
      description:
        "Surfaces the clinical context that contributed to each returned match.",
      tone: "orange",
      icon: "feedback",
    },
    {
      title: "Research Review",
      description:
        "Supports researcher review, refinement, and future cohort-building workflows.",
      tone: "pink",
      icon: "shield",
    },
  ] satisfies SearchLayer[],

  results: [
    "Demonstrates researcher-friendly search over synthetic patient records.",
    "Shows how semantic ranking can improve discovery beyond keyword matching.",
    "Provides explanations that make search results easier to trust and review.",
    "Creates a reusable foundation for cohort exploration and biomedical search demos.",
  ],

  takeaways: [
    "Clinical discovery tools need to support ambiguous natural-language intent.",
    "Search quality depends on both retrieval relevance and result explainability.",
    "Governed semantic search is a strong product pattern for healthcare AI systems.",
    "Synthetic data can still demonstrate realistic product and architecture decisions.",
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
        {name === "search" ? (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.4-4.4" />
          </>
        ) : null}

        {name === "brain" ? (
          <>
            <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.2A3 3 0 0 0 6 18h3" />
            <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.2A3 3 0 0 1 18 18h-3" />
            <path d="M9 4v16" />
            <path d="M15 4v16" />
            <path d="M9 9H6" />
            <path d="M15 9h3" />
            <path d="M9 14H6" />
            <path d="M15 14h3" />
          </>
        ) : null}

        {name === "database" ? (
          <>
            <ellipse cx="12" cy="5" rx="7" ry="3" />
            <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
            <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
          </>
        ) : null}

        {name === "chart" ? (
          <>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15l3-4 3 2 4-6" />
            <path d="M18 7h2v2" />
          </>
        ) : null}

        {name === "shield" ? (
          <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
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

        {name === "feedback" ? (
          <>
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
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
  children: React.ReactNode;
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

export default function SemanticPatientSearchProjectDescription() {
  return (
    <div className="description-layout">
      <section className="description-hero card">
        <div className="description-kicker">
          Semantic Healthcare Discovery Workflow
        </div>

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
        intro="A high-level view of the semantic search workflow from natural-language query to explainable ranked results."
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
        intro="The application combines a modern frontend, an API-driven search service, and a structured synthetic healthcare dataset."
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
        title="Search Workflow"
        icon="brain"
        intro="A closer look at the product layers that turn a clinical query into ranked, explainable search results."
      >
        <div className="description-agent-layout">
          <div className="description-agent-flow">
            {DESCRIPTION_CONTENT.searchLayers.map((layer, index) => (
              <div key={layer.title} className="description-agent-flow-item">
                <div className={`description-agent-card tone-${layer.tone}`}>
                  <div className="description-agent-card-icon">
                    <SectionIcon name={layer.icon} />
                  </div>

                  <div className="description-agent-title">{layer.title}</div>

                  <p>{layer.description}</p>
                </div>

                {index < DESCRIPTION_CONTENT.searchLayers.length - 1 ? (
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
        <DescriptionSection title="Results & Impact" icon="chart">
          <ul className="description-bullet-list">
            {DESCRIPTION_CONTENT.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DescriptionSection>

        <DescriptionSection title="Key Takeaways" icon="feedback">
          <ul className="description-bullet-list">
            {DESCRIPTION_CONTENT.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </DescriptionSection>
      </div>

      <div className="description-note cardish">
        This is a simulated environment with synthetic data for demonstration
        purposes. The workflow, data, and results are fictional and are not
        intended for clinical decision-making.
      </div>
    </div>
  );
}