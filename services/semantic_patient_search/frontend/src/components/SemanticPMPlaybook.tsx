import { pmPlaybookSections } from "../content/semanticContent";

export default function SemanticPMPlaybook() {
  return (
    <section className="playbookShell">
      <aside className="playbookNav">
        <p className="playbookNavTitle">PM Playbook</p>
        {pmPlaybookSections.map((section) => (
          <a key={section.label} href={`#${section.label.toLowerCase()}`}>
            {section.label}
          </a>
        ))}
      </aside>

      <div className="playbookContent">
        <section className="descriptionHero cardish">
          <p className="descriptionKicker">PM Playbook</p>
          <h2>Semantic Patient Search</h2>
          <p className="descriptionLead">
            A product management view of an AI-powered research discovery tool
            that helps investigators find relevant patient cohorts using natural
            language, semantic matching, governed data concepts, and explainable
            search results.
          </p>
        </section>

        <div className="playbookGrid">
          {pmPlaybookSections.map((section) => (
            <article
              key={section.label}
              id={section.label.toLowerCase()}
              className="descriptionSection cardish"
            >
              <p className="descriptionKicker">{section.label}</p>
              <h3>{section.title}</h3>
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
