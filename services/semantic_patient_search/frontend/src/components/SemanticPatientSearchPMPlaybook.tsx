"use client";

import type { ReactNode } from "react";

type IconName =
  | "problem"
  | "strategy"
  | "workflow"
  | "mvp"
  | "metrics"
  | "feedback"
  | "risk"
  | "reflection"
  | "search"
  | "shield";

const sections = [
  { id: "problem", label: "Problem" },
  { id: "strategy", label: "Strategy" },
  { id: "solution", label: "Solution" },
  { id: "mvp", label: "MVP" },
  { id: "metrics", label: "Metrics" },
  { id: "feedback", label: "Feedback" },
  { id: "risks", label: "Risks" },
  { id: "reflection", label: "Reflection" },
];

const focusAreas = [
  { label: "Discovery-led problem framing", icon: "problem" as IconName },
  { label: "Researcher-first search workflow", icon: "search" as IconName },
  { label: "Semantic retrieval KPI framework", icon: "metrics" as IconName },
  { label: "Human feedback and quality loop", icon: "feedback" as IconName },
  { label: "Governance, privacy, and trust controls", icon: "shield" as IconName },
];

const metrics = [
  "Time to identify relevant patient cohort",
  "Search-to-result success rate",
  "Query refinement rate",
  "Result acceptance rate",
  "Precision / recall against curated cohorts",
  "Researcher satisfaction score",
];

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
        {name === "problem" && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.8-1.2 1.2-1.2 2.2" />
            <circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none" />
          </>
        )}

        {name === "strategy" && (
          <>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
          </>
        )}

        {name === "workflow" && (
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
        )}

        {name === "mvp" && (
          <>
            <path d="M7 3h7l3 3v15H7z" />
            <path d="M14 3v4h4" />
            <path d="M10 12h4" />
            <path d="M10 16h4" />
          </>
        )}

        {name === "metrics" && (
          <>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15l3-4 3 2 4-6" />
          </>
        )}

        {name === "feedback" && (
          <>
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
          </>
        )}

        {name === "risk" && (
          <>
            <path d="M12 3 2 21h20L12 3z" />
            <path d="M12 9v5" />
            <path d="M12 17h.01" />
          </>
        )}

        {name === "reflection" && (
          <>
            <path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z" />
            <path d="M9 20h6" />
            <path d="M10 17h4" />
          </>
        )}

        {name === "search" && (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.4-4.4" />
          </>
        )}

        {name === "shield" && (
          <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
        )}
      </svg>
    </span>
  );
}

function PlaybookSection({
  id,
  title,
  icon,
  kicker,
  intro,
  children,
}: {
  id?: string;
  title: string;
  icon: IconName;
  kicker?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="description-section card fade-section">
      <div className="description-section-header">
        {kicker ? <div className="description-kicker">{kicker}</div> : null}
        <div className="description-section-title-row">
          <SectionIcon name={icon} />
          <h3>{title}</h3>
        </div>
        {intro ? <p>{intro}</p> : null}
      </div>

      {children ? <div className="description-section-body">{children}</div> : null}
    </section>
  );
}

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
            language, semantic matching, governed data concepts, and explainable
            search results.
          </p>

          <div className="description-highlight-grid">
            {focusAreas.map((item) => (
              <div key={item.label} className="description-highlight-card">
                <SectionIcon name={item.icon} />
                <div className="description-highlight-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="description-two-col">
          <PlaybookSection
            id="problem"
            title="Problem Framing & Discovery"
            icon="problem"
            kicker="Discovery"
          >
            <p>
              Researchers struggle to find relevant cohorts because clinical,
              biospecimen, pathology, genomic, and demographic data often live
              across fragmented systems and are difficult to query without
              technical support.
            </p>

            <ul className="description-bullet-list">
              <li>Investigators need faster access to clinically relevant cohorts.</li>
              <li>Research operations teams need repeatable discovery workflows.</li>
              <li>Data platform teams need fewer ad hoc SQL or reporting requests.</li>
              <li>Search needs to support precise filters and exploratory questions.</li>
            </ul>
          </PlaybookSection>

          <PlaybookSection
            id="strategy"
            title="Product Vision & Strategy"
            icon="strategy"
            kicker="Strategy"
          >
            <p>
              Build a semantic discovery layer that allows researchers to search
              across patient, specimen, clinical, and molecular data using natural
              language while preserving governance, explainability, and trust.
            </p>

            <ul className="description-bullet-list">
              <li>Researcher-first natural-language search.</li>
              <li>Governed patient and specimen discovery.</li>
              <li>Explainable ranking and result rationale.</li>
              <li>Human validation before downstream research use.</li>
            </ul>
          </PlaybookSection>
        </div>

        <PlaybookSection
          id="solution"
          title="Search Workflow Architecture"
          icon="workflow"
          kicker="Solution Design"
          intro="The product is designed as a transparent discovery workflow rather than a black-box search result list."
        >
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
                  <div className="description-step-title">Step {index + 1}</div>
                  <p>{step}</p>
                </div>

                {index < arr.length - 1 ? (
                  <div className="description-step-arrow" aria-hidden="true">
                    →
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </PlaybookSection>

        <PlaybookSection
          id="mvp"
          title="What This Demo Should Prove"
          icon="mvp"
          kicker="MVP"
        >
          <p>
            The MVP validates whether non-technical users can ask meaningful
            cohort questions and receive useful, understandable, and
            trust-building results.
          </p>

          <ul className="description-bullet-list">
            <li>Natural-language search over mock patient profiles.</li>
            <li>Ranked patient results with match scores.</li>
            <li>Plain-English explanation for why each result matched.</li>
            <li>Filters for disease area, specimen type, biomarkers, and age.</li>
            <li>Saved queries or shortlist workflow for follow-up review.</li>
          </ul>
        </PlaybookSection>

        <div className="description-two-col">
          <PlaybookSection
            id="metrics"
            title="Success KPI Framework"
            icon="metrics"
            kicker="Metrics"
          >
            <p>
              The north-star metric is researcher time-to-cohort: how quickly a
              user can identify a useful, reviewable patient cohort.
            </p>

            <ul className="description-bullet-list">
              {metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </PlaybookSection>

          <PlaybookSection
            title="Validation Plan"
            icon="metrics"
            kicker="Experimentation"
          >
            <ul className="description-bullet-list">
              <li>Compare semantic search against keyword-only cohort discovery.</li>
              <li>Measure whether explanations increase researcher trust.</li>
              <li>Test whether suggested filters reduce query refinement time.</li>
              <li>Track where users abandon or reformulate searches.</li>
            </ul>
          </PlaybookSection>
        </div>

        <PlaybookSection
          id="feedback"
          title="Human Feedback & Search Learning"
          icon="feedback"
          kicker="Feedback Loop"
        >
          <p>
            Every search interaction should generate feedback signals that
            improve retrieval quality, ranking, and explanations over time.
          </p>

          <ul className="description-bullet-list">
            <li>User marks results as useful, irrelevant, or needing review.</li>
            <li>Saved cohorts become training and evaluation examples.</li>
            <li>Repeated query refinements reveal missing filters or synonyms.</li>
            <li>Reviewer feedback improves mappings and ranking logic.</li>
          </ul>
        </PlaybookSection>

        <div className="description-two-col">
          <PlaybookSection
            id="risks"
            title="Tradeoffs & Controls"
            icon="risk"
            kicker="Risks"
          >
            <ul className="description-bullet-list">
              <li>False positives can waste researcher time and require clear rationale.</li>
              <li>False negatives can hide relevant cohorts and require recall monitoring.</li>
              <li>Sensitive data requires role-based access and audit trails.</li>
              <li>Semantic results must be grounded in governed data, not hallucinated.</li>
            </ul>
          </PlaybookSection>

          <PlaybookSection
            id="reflection"
            title="PM Takeaway"
            icon="reflection"
            kicker="Reflection"
          >
            <p>
              The product opportunity is not simply “better search.” It is a
              governed research discovery experience that translates ambiguous
              scientific intent into reliable, explainable, and actionable cohort
              results.
            </p>
          </PlaybookSection>
        </div>

        <div className="description-note cardish fade-section">
          This demo should be positioned as a research discovery aid, not a
          clinical decision-making tool. The strongest portfolio narrative is the
          combination of semantic search, governed data concepts, and human
          validation.
        </div>

        <a className="back-to-top" href="#top">
          Back to top ↑
        </a>
      </div>
    </div>
  );
}