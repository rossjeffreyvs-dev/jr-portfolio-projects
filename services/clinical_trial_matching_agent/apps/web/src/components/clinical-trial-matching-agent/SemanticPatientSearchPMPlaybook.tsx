"use client";

const sections = [
  { id: "problem", label: "Problem" },
  { id: "vision", label: "Vision" },
  { id: "solution", label: "Solution" },
  { id: "mvp", label: "MVP" },
  { id: "metrics", label: "Metrics" },
  { id: "feedback", label: "Feedback" },
  { id: "risks", label: "Risks" },
  { id: "reflection", label: "Reflection" },
];

const capabilities = [
  "Natural-language cohort discovery",
  "Ontology-aware patient/specimen search",
  "Semantic matching across structured and unstructured data",
  "Explainable result ranking",
  "Researcher-friendly filtering and refinement",
];

const metrics = [
  "Time to identify relevant patient cohort",
  "Search-to-result success rate",
  "Query refinement rate",
  "Result acceptance rate",
  "Precision / recall against curated cohorts",
  "Researcher satisfaction score",
];

export default function SemanticPatientSearchPMPlaybook() {
  return (
    <div className="playbook-shell" id="top">
      <aside className="playbook-nav" aria-label="PM Playbook sections">
        <div className="playbook-nav-title">PM Playbook</div>

        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </aside>

      <div className="description-layout playbook-content">
        <section className="description-hero card fade-section">
          <div className="description-kicker">PM Playbook</div>
          <h2>Semantic Patient Search</h2>
          <p className="description-lead">
            A product management view of an AI-powered research discovery tool
            that helps investigators find relevant patient cohorts using natural
            language, semantic matching, ontology-backed entities, and
            explainable search results.
          </p>

          <div className="description-highlight-grid">
            {capabilities.map((item) => (
              <div key={item} className="description-highlight-card">
                <div className="description-highlight-label">{item}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="problem" className="description-section card fade-section">
          <div className="description-section-header">
            <div className="description-kicker">Discovery</div>
            <h3>Problem Framing & Discovery</h3>
            <p>
              Researchers often struggle to find relevant patient cohorts
              because clinical, biospecimen, pathology, genomic, and demographic
              data live across fragmented systems and are difficult to query
              without technical support.
            </p>
          </div>

          <ul className="description-bullet-list">
            <li>
              Investigators need faster access to clinically relevant cohorts.
            </li>
            <li>
              Research operations teams need repeatable, governed discovery
              workflows.
            </li>
            <li>
              Data platform teams need to reduce ad hoc SQL/reporting requests.
            </li>
            <li>
              Search needs to support both precise filters and exploratory
              questions.
            </li>
          </ul>
        </section>

        <section id="vision" className="description-section card fade-section">
          <div className="description-section-header">
            <div className="description-kicker">Strategy</div>
            <h3>Product Vision & Strategy</h3>
            <p>
              Build a semantic discovery layer that allows researchers to search
              across patient, specimen, clinical, and molecular data using
              natural language while preserving governance, explainability, and
              trust.
            </p>
          </div>

          <div className="description-highlight-grid">
            <div className="description-highlight-card">
              <div className="description-highlight-label">
                Researcher-first search
              </div>
              <p>
                Let users ask cohort questions in familiar clinical language.
              </p>
            </div>

            <div className="description-highlight-card">
              <div className="description-highlight-label">
                Ontology-backed discovery
              </div>
              <p>
                Ground search results in governed patient, specimen, and disease
                entities.
              </p>
            </div>

            <div className="description-highlight-card">
              <div className="description-highlight-label">
                Explainable ranking
              </div>
              <p>
                Show why patients or cohorts matched the query instead of
                returning opaque results.
              </p>
            </div>
          </div>
        </section>

        <section
          id="solution"
          className="description-section card fade-section"
        >
          <div className="description-section-header">
            <div className="description-kicker">Solution Design</div>
            <h3>Search Workflow Architecture</h3>
            <p>
              The system combines natural-language query interpretation,
              embedding-based retrieval, structured filters, ontology mappings,
              and result explanation.
            </p>
          </div>

          <div className="description-step-flow">
            {[
              "User enters research query",
              "System interprets intent",
              "Semantic retrieval finds candidates",
              "Structured filters refine cohort",
              "Results explain match rationale",
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

        <section id="mvp" className="description-section card fade-section">
          <div className="description-section-header">
            <div className="description-kicker">MVP</div>
            <h3>What This Demo Should Prove</h3>
            <p>
              The MVP should validate that non-technical users can ask
              meaningful cohort questions and receive useful, understandable,
              and trust-building results.
            </p>
          </div>

          <ul className="description-bullet-list">
            <li>Natural-language search over mock patient profiles.</li>
            <li>Ranked patient or cohort results with match scores.</li>
            <li>Plain-English explanation for why each result matched.</li>
            <li>
              Filters for disease area, specimen type, biomarkers, and age.
            </li>
            <li>Saved queries or shortlist workflow for follow-up review.</li>
          </ul>
        </section>

        <div className="description-two-col">
          <section
            id="metrics"
            className="description-section card fade-section"
          >
            <div className="description-section-header">
              <div className="description-kicker">Metrics</div>
              <h3>Success KPI Framework</h3>
              <p>
                The north-star metric is researcher time-to-cohort: how quickly
                a user can identify a useful, reviewable patient cohort.
              </p>
            </div>

            <ul className="description-bullet-list">
              {metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </section>

          <section className="description-section card fade-section">
            <div className="description-section-header">
              <div className="description-kicker">Experimentation</div>
              <h3>Validation Plan</h3>
            </div>

            <ul className="description-bullet-list">
              <li>
                Compare semantic search against keyword-only search for cohort
                discovery.
              </li>
              <li>
                Measure whether explanations increase researcher trust in
                results.
              </li>
              <li>
                Test whether suggested filters reduce query refinement time.
              </li>
            </ul>
          </section>
        </div>

        <section
          id="feedback"
          className="description-section card fade-section"
        >
          <div className="description-section-header">
            <div className="description-kicker">Feedback Loop</div>
            <h3>Human Feedback & Search Learning</h3>
            <p>
              Every search interaction should generate feedback signals that
              improve retrieval quality, ranking, and explanations over time.
            </p>
          </div>

          <ul className="description-bullet-list">
            <li>User marks a result as useful, irrelevant, or needs review.</li>
            <li>Saved cohorts become training/evaluation examples.</li>
            <li>
              Repeated query refinements reveal missing filters or synonyms.
            </li>
            <li>
              Reviewer feedback improves ontology mappings and ranking logic.
            </li>
          </ul>
        </section>

        <div className="description-two-col">
          <section id="risks" className="description-section card fade-section">
            <div className="description-section-header">
              <div className="description-kicker">Risks</div>
              <h3>Tradeoffs & Controls</h3>
            </div>

            <ul className="description-bullet-list">
              <li>
                False positives can waste researcher time and require clear
                match rationale.
              </li>
              <li>
                False negatives can hide relevant cohorts and require recall
                monitoring.
              </li>
              <li>
                Sensitive clinical data requires role-based access and audit
                trails.
              </li>
              <li>
                Semantic results must be grounded in governed data, not
                hallucinated.
              </li>
            </ul>
          </section>

          <section
            id="reflection"
            className="description-section card fade-section"
          >
            <div className="description-section-header">
              <div className="description-kicker">Reflection</div>
              <h3>PM Takeaway</h3>
              <p>
                The product opportunity is not simply “better search.” It is a
                governed research discovery experience that translates ambiguous
                scientific intent into reliable, explainable, and actionable
                cohort results.
              </p>
            </div>
          </section>
        </div>

        <div className="description-note cardish fade-section">
          This demo should be positioned as a research discovery aid, not a
          clinical decision-making tool. The strongest portfolio narrative is
          the combination of semantic search, governed ontology-backed data, and
          human validation.
        </div>

        <a className="back-to-top" href="#top">
          Back to top ↑
        </a>
      </div>
    </div>
  );
}
