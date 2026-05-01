import { pmPlaybookSections } from "../content/semanticContent";

const navId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const playbookIcons = ["🎯", "🧭", "🧪", "📊", "🛡️", "🚀"];

export default function SemanticPMPlaybook() {
  return (
    <section className="playbookShell semanticPlaybookShell">
      <aside className="playbookNav">
        <p className="playbookNavTitle">PM Playbook</p>
        {pmPlaybookSections.map((section) => (
          <a key={section.label} href={`#${navId(section.label)}`}>
            {section.label}
          </a>
        ))}
      </aside>

      <div className="playbookContent">
        <section className="descriptionHero cardish section-emphasis">
          <p className="descriptionKicker">PM Playbook</p>
          <h2>How I would productize semantic patient discovery</h2>
          <p className="descriptionLead">
            A product management view of an AI-powered research discovery tool
            that helps investigators find relevant patient cohorts using natural
            language, semantic matching, governed data concepts, and explainable
            search results.
          </p>

          <div
            className="semanticPlaybookStrip"
            aria-label="Productization focus areas"
          >
            <article>
              <span aria-hidden="true">💬</span>
              <strong>Natural-language cohort discovery</strong>
            </article>
            <article>
              <span aria-hidden="true">🧠</span>
              <strong>Semantic patient profile ranking</strong>
            </article>
            <article>
              <span aria-hidden="true">✨</span>
              <strong>Explainable match rationale</strong>
            </article>
            <article>
              <span aria-hidden="true">🛡️</span>
              <strong>Governed synthetic health data</strong>
            </article>
          </div>
        </section>

        <div className="playbookGrid semanticPlaybookGrid">
          {pmPlaybookSections.map((section, index) => (
            <article
              key={section.label}
              id={navId(section.label)}
              className="descriptionSection cardish"
            >
              <div className="semanticPlaybookTitleRow">
                <span className="descriptionIcon" aria-hidden="true">
                  {playbookIcons[index] ?? "✦"}
                </span>
                <div>
                  <p className="descriptionKicker">{section.label}</p>
                  <h3>{section.title}</h3>
                </div>
              </div>
              <p>{section.body}</p>
              <ul className="descriptionBulletList">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
