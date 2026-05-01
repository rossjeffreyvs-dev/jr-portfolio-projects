import { descriptionHighlights } from "../content/semanticContent";

const workflowSteps = [
  {
    index: "01",
    icon: "🧾",
    title: "Assemble profile",
    description:
      "Combine demographics, diagnoses, medications, labs, and narrative summary into a searchable patient profile.",
  },
  {
    index: "02",
    icon: "🔎",
    title: "Embed query",
    description:
      "Convert natural-language user intent into a comparable semantic representation.",
  },
  {
    index: "03",
    icon: "📊",
    title: "Score matches",
    description:
      "Rank patient profiles by conceptual similarity rather than exact keyword overlap.",
  },
  {
    index: "04",
    icon: "✨",
    title: "Explain results",
    description:
      "Return ranked records with context that explains why each patient matched the query.",
  },
];

const featureIcons = ["💬", "🧠", "📚", "✨", "🧪"];

export default function SemanticProjectDescription() {
  return (
    <section className="descriptionLayout">
      <section className="descriptionHero cardish section-emphasis">
        <p className="descriptionKicker">
          Semantic Healthcare Discovery Workflow
        </p>
        <h2>Semantic Patient Search</h2>
        <p className="descriptionLead">
          Semantic Patient Search is a healthcare discovery demo that shows how
          synthetic patient, demographic, and clinical records can be
          transformed into searchable patient profiles. Instead of relying on
          exact keyword matches, the system interprets natural-language intent
          and returns conceptually relevant patient records.
        </p>

        <div className="descriptionHighlightGrid">
          {descriptionHighlights.map((item, index) => (
            <article key={item} className="descriptionHighlightCard">
              <span className="descriptionIcon" aria-hidden="true">
                {featureIcons[index] ?? "✦"}
              </span>
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="descriptionTwoCol">
        <article className="descriptionSection cardish section-soft">
          <div className="descriptionSectionHeader">
            <span className="descriptionIcon" aria-hidden="true">
              ?
            </span>
            <h3>Problem</h3>
          </div>
          <p>
            Traditional keyword search is brittle in healthcare-style datasets.
            Relevant records may be missed when query wording does not exactly
            match diagnosis names, medication names, or narrative descriptions.
          </p>
        </article>

        <article className="descriptionSection cardish section-soft">
          <div className="descriptionSectionHeader">
            <span className="descriptionIcon" aria-hidden="true">
              ✓
            </span>
            <h3>Solution</h3>
          </div>
          <p>
            The app creates a semantic profile for each synthetic patient,
            embeds both profile and query, then ranks matches using similarity
            scoring and explanatory context.
          </p>
        </article>
      </section>

      <section className="descriptionSection cardish">
        <p className="descriptionKicker">Technical Architecture</p>
        <h3>How the workflow operates</h3>
        <p className="descriptionSectionIntro">
          A compact retrieval workflow turns patient context and
          natural-language intent into ranked, explainable discovery results.
        </p>

        <div className="workflowGrid semanticWorkflowGrid">
          {workflowSteps.map((step) => (
            <article key={step.title}>
              <span className="workflowStepIndex">{step.index}</span>
              <div className="workflowStepTitle">
                <span className="workflowStepIcon" aria-hidden="true">
                  {step.icon}
                </span>
                <h4>{step.title}</h4>
              </div>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="descriptionTwoCol">
        <article className="descriptionSection cardish">
          <p className="descriptionKicker">Why it matters</p>
          <h3>Discovery should support clinical language</h3>
          <p>
            Semantic retrieval is a strong fit for discovery workflows where
            users describe concepts, risk patterns, or clinical context rather
            than exact terms.
          </p>
        </article>

        <article className="descriptionSection cardish">
          <p className="descriptionKicker">Portfolio relevance</p>
          <h3>AI search with product-grade explainability</h3>
          <p>
            The project connects AI search, healthcare data platforms, synthetic
            data design, explainable retrieval, and product strategy in a
            shareable demo.
          </p>
        </article>
      </section>
    </section>
  );
}
