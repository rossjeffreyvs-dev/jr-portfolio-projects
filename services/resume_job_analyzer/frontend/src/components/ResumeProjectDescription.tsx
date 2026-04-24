export default function ResumeProjectDescription() {
  return (
    <div className="project-description">
      <section className="description-card overview-card">
        <p className="description-eyebrow">Project Overview</p>
        <h2>AI-Assisted Resume Match Workflow</h2>
        <p className="description-lede">
          Resume Analyzer evaluates a candidate resume against a job description
          and produces a structured match report. The workflow demonstrates how
          document parsing, LLM-assisted comparison, and candidate-facing
          recommendations can work together in a focused career-tech product.
        </p>

        <div className="description-highlight-grid">
          <div className="description-highlight">Resume parsing</div>
          <div className="description-highlight">Job description analysis</div>
          <div className="description-highlight">AI match scoring</div>
          <div className="description-highlight">Gap identification</div>
          <div className="description-highlight">
            Actionable recommendations
          </div>
        </div>
      </section>

      <section className="problem-solution-grid">
        <article className="description-card section-card">
          <p className="description-eyebrow">Problem</p>
          <h3>Resume Fit Is Hard to Interpret</h3>
          <p>
            Candidates often struggle to understand whether their resume matches
            a target role. Job descriptions are dense, resumes are unstructured,
            and the comparison process is usually manual and subjective.
          </p>
        </article>

        <article className="description-card section-card">
          <p className="description-eyebrow">Solution</p>
          <h3>Structured AI Match Review</h3>
          <p>
            The system extracts text from uploaded resumes, compares it against
            a job description, and generates a clear report showing strengths,
            gaps, and improvement opportunities.
          </p>
        </article>
      </section>

      <section className="description-card section-card">
        <p className="description-eyebrow">How It Works</p>
        <h3>Workflow</h3>

        <div className="workflow-step-grid">
          {[
            "Paste job description",
            "Upload resume",
            "Extract document text",
            "Generate match analysis",
            "Review recommendations",
          ].map((step, index) => (
            <div className="workflow-step-pair" key={step}>
              <article className="workflow-step-card">
                <p>
                  {index + 1}. {step}
                </p>
                <h4>{step}</h4>
              </article>
              {index < 4 ? <div className="workflow-arrow">→</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="description-card section-card">
        <p className="description-eyebrow">System Architecture</p>
        <h3>Technical Architecture</h3>

        <div className="architecture-column-grid">
          <article className="architecture-column architecture-blue">
            <p>Frontend</p>
            <h4>React Interface</h4>
            <ul>
              <li>Project shell</li>
              <li>Resume upload flow</li>
              <li>Job description input</li>
              <li>Match report viewer</li>
            </ul>
          </article>

          <article className="architecture-column architecture-purple">
            <p>Backend</p>
            <h4>Flask API</h4>
            <ul>
              <li>File upload endpoint</li>
              <li>PDF / DOCX parsing</li>
              <li>Sample demo route</li>
              <li>OpenAI integration</li>
            </ul>
          </article>

          <article className="architecture-column architecture-green">
            <p>AI Layer</p>
            <h4>LLM Match Analysis</h4>
            <ul>
              <li>Resume-to-role comparison</li>
              <li>Strength identification</li>
              <li>Gap analysis</li>
              <li>Recommendation generation</li>
            </ul>
          </article>
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
