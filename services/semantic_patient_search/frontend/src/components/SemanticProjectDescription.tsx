import { descriptionHighlights } from "../content/semanticContent";

export default function SemanticProjectDescription() {
  return (
    <section className="descriptionLayout">
      <section className="descriptionHero cardish">
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
          {descriptionHighlights.map((item) => (
            <article key={item} className="descriptionHighlightCard">
              <span className="descriptionIcon" aria-hidden="true">
                ✦
              </span>
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="descriptionTwoCol">
        <article className="descriptionSection cardish">
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

        <article className="descriptionSection cardish">
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

        <div className="workflowGrid">
          <article>
            <span>1</span>
            <h4>Assemble profile</h4>
            <p>
              Combine demographics, diagnoses, medications, labs, and summary.
            </p>
          </article>
          <article>
            <span>2</span>
            <h4>Embed query</h4>
            <p>
              Convert natural-language user intent into a comparable vector.
            </p>
          </article>
          <article>
            <span>3</span>
            <h4>Score matches</h4>
            <p>Compare query and patient profiles using semantic similarity.</p>
          </article>
          <article>
            <span>4</span>
            <h4>Explain results</h4>
            <p>Return ranked records with context that explains the match.</p>
          </article>
        </div>
      </section>

      <section className="descriptionTwoCol">
        <article className="descriptionSection cardish">
          <p className="descriptionKicker">Why it matters</p>
          <p>
            Semantic retrieval is a strong fit for discovery workflows where
            users describe concepts, risk patterns, or clinical context rather
            than exact terms.
          </p>
        </article>

        <article className="descriptionSection cardish">
          <p className="descriptionKicker">Portfolio relevance</p>
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
