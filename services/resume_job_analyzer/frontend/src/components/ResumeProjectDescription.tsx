import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import FeatureCardGrid from "./FeatureCardList";

type Highlight = {
  icon: string;
  label: string;
};

type WorkflowStep = {
  number: string;
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
  { icon: "📄", label: "Resume parsing" },
  { icon: "🧾", label: "Job description analysis" },
  { icon: "🎯", label: "AI match scoring" },
  { icon: "🔎", label: "Gap identification" },
  { icon: "✅", label: "Actionable recommendations" },
];

const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    icon: "🧾",
    title: "Paste job description",
    description:
      "Load the target role, responsibilities, required skills, and evaluation context.",
  },
  {
    number: "02",
    icon: "📄",
    title: "Upload resume",
    description:
      "Provide the candidate resume as the source document for role-fit analysis.",
  },
  {
    number: "03",
    icon: "🧠",
    title: "Extract document text",
    description:
      "Parse resume content into structured text that can be compared against the role.",
  },
  {
    number: "04",
    icon: "⚖️",
    title: "Generate match analysis",
    description:
      "Compare evidence across strengths, gaps, and role-specific alignment signals.",
  },
  {
    number: "05",
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
      <Panel
        eyebrow="Project Overview"
        title="AI-Assisted Resume Match Workflow"
        body="Resume Analyzer evaluates a candidate resume against a job description and produces a structured match report. The workflow demonstrates how document parsing, LLM-assisted comparison, and candidate-facing recommendations can work together in a focused career-tech product."
        className="section-emphasis ui-panel-accent-blue"
        wide
      >
        <FeatureListGrid items={highlights} columns={5} />
      </Panel>

      <section
        className="problem-solution-grid"
        aria-label="Problem and solution"
      >
        <Panel
          eyebrow="Problem"
          title="Resume fit is hard to interpret"
          body="Candidates often struggle to understand whether their resume matches a target role. Job descriptions are dense, resumes are unstructured, and the comparison process is usually manual and subjective."
        />

        <Panel
          eyebrow="Solution"
          title="Structured AI match review"
          body="The system extracts text from uploaded resumes, compares it against a job description, and generates a clear report showing strengths, gaps, and improvement opportunities."
        />
      </section>

      <Panel
        eyebrow="Workflow"
        title="How the resume match workflow works"
        body="The demo moves from job context and resume intake to document parsing, match analysis, and candidate-facing recommendations."
        wide
      >
        <FeatureCardGrid
          items={workflowSteps}
          numbered
          columns={5}
          ariaLabel="Resume match workflow steps"
        />
      </Panel>

      <Panel
        eyebrow="Architecture"
        title="Technical architecture"
        body="The system combines a React project shell, Flask API services, document parsing, and LLM-assisted comparison into a focused resume-to-role analysis workflow."
        wide
      >
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
      </Panel>

      <Panel
        eyebrow="Demo flow"
        title="Use the Demo tab to run a resume-to-job match analysis"
        body="Job description → Resume upload → AI report → Candidate guidance"
        className="ui-panel-accent-blue"
        wide
      />
    </div>
  );
}
