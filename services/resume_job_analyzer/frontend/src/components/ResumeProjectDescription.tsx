type Highlight = {
  icon: string;
  title: string;
};

type WorkflowStep = {
  index: string;
  icon: string;
  title: string;
  description: string;
};

type ArchitectureColumn = {
  eyebrow: string;
  title: string;
  items: string[];
};

const highlights: Highlight[] = [
  { icon: "📄", title: "Resume parsing" },
  { icon: "🧾", title: "Job description analysis" },
  { icon: "🎯", title: "AI match scoring" },
  { icon: "🔎", title: "Gap identification" },
  { icon: "✅", title: "Actionable recommendations" },
];

const workflowSteps: WorkflowStep[] = [
  {
    index: "01",
    icon: "🧾",
    title: "Paste job description",
    description:
      "Load the target role, responsibilities, required skills, and evaluation context.",
  },
  {
    index: "02",
    icon: "📄",
    title: "Upload resume",
    description:
      "Provide the candidate resume as the source document for role-fit analysis.",
  },
  {
    index: "03",
    icon: "🧠",
    title: "Extract document text",
    description:
      "Parse resume content into structured text that can be compared against the role.",
  },
  {
    index: "04",
    icon: "⚖️",
    title: "Generate match analysis",
    description:
      "Compare evidence across strengths, gaps, and role-specific alignment signals.",
  },
  {
    index: "05",
    icon: "✨",
    title: "Review recommendations",
    description:
      "Return clear guidance that helps the candidate understand what to improve next.",
  },
];

const architectureColumns: ArchitectureColumn[] = [
  {
    eyebrow: "Frontend",
    title: "React Interface",
    items: [
      "Project shell",
      "Resume upload flow",
      "Job description input",
      "Match report viewer",
    ],
  },
  {
    eyebrow: "Backend",
    title: "Flask API",
    items: [
      "File upload endpoint",
      "PDF / DOCX parsing",
      "Sample demo route",
      "OpenAI integration",
    ],
  },
  {
    eyebrow: "AI Layer",
    title: "LLM Match Analysis",
    items: [
      "Resume-to-role comparison",
      "Strength identification",
      "Gap analysis",
      "Recommendation generation",
    ],
  },
];

export default function ResumeProjectDescription() {
  return (
    <div className="project-description">
      <section className="description-card overview-card section-emphasis">
        <p className="description-eyebrow">Project Overview</p>
        <h2>AI-Assisted Resume Match Workflow</h2>
        <p className="description-lede">
          Resume Analyzer evaluates a candidate resume against a job description
          and produces a structured match report. The workflow demonstrates how
          document parsing, LLM-assisted comparison, and candidate-facing
          recommendations can work together in a focused career-tech product.
        </p>

        <div className="description-highlight-grid">
          {highlights.map((item) => (
            <article className="description-highlight" key={item.title}>
              <span className="description-icon" aria-hidden="true">
                {item.icon}
              </span>
              <strong>{item.title}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="problem-solution-grid">
        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Problem</p>
            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                ❔
              </span>
              <h3>Resume fit is hard to interpret</h3>
            </div>
          </div>{" "}
          <p>
            Candidates often struggle to understand whether their resume matches
            a target role. Job descriptions are dense, resumes are unstructured,
            and the comparison process is usually manual and subjective.
          </p>
        </article>

        <article className="description-card section-card section-soft">
          <div className="description-section-header compact-heading">
            <p className="description-eyebrow">Solution</p>
            <div className="playbook-card-title-row">
              <span className="section-icon" aria-hidden="true">
                ✓
              </span>
              <h3>Structured AI match review</h3>
            </div>
          </div>{" "}
          <p>
            The system extracts text from uploaded resumes, compares it against
            a job description, and generates a clear report showing strengths,
            gaps, and improvement opportunities.
          </p>
        </article>
      </section>

      <section className="description-card section-card">
        <div className="description-section-header compact-heading">
          <p className="description-eyebrow">Workflow</p>
          <div className="playbook-card-title-row">
            <span className="section-icon" aria-hidden="true">
              ⚙️
            </span>
            <h3>How It Works</h3>
          </div>
        </div>{" "}
        <div className="workflow-step-grid product-step-grid">
          {workflowSteps.map((step) => (
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

      <section className="description-card section-card">
        <div className="description-section-header compact-heading">
          <p className="description-eyebrow">Architecture</p>
          <div className="playbook-card-title-row">
            <span className="section-icon" aria-hidden="true">
              🧩
            </span>
            <h3>Technical architecture</h3>
          </div>
        </div>{" "}
        <div className="architecture-column-grid neutral-architecture-grid">
          {architectureColumns.map((column) => (
            <article className="architecture-column" key={column.title}>
              <p>{column.eyebrow}</p>
              <h4>{column.title}</h4>
              <ul className="check-list">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-note-card">
        <div>
          <p>Demo flow</p>
          <h3>Use the Demo tab to run a resume-to-job match analysis.</h3>
        </div>
        <span>
          Job description → Resume upload → AI report → Candidate guidance
        </span>
      </section>
    </div>
  );
}
