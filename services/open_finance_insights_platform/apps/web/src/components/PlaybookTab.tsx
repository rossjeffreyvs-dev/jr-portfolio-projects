const items = [
  ["Discovery", "What do developers, fintech operators, and end users need after account data is connected?"],
  ["MVP strategy", "Keep scope narrow: synthetic data, normalized model, insight engine, visible workflow, final recommendations."],
  ["Data model bet", "Prioritize durable canonical objects over one-off charts or chatbot interactions."],
  ["Risks", "Avoid over-claiming model intelligence; keep calculations deterministic and recommendations traceable."],
  ["Expansion", "Later add Plaid sandbox, webhook-style refreshes, affordability scoring, and developer-facing API docs."],
];

export default function PlaybookTab() {
  return (
    <section className="content-card large">
      <p className="eyebrow">PM Playbook</p>
      <h2>How I would frame and ship the MVP</h2>
      <div className="playbook-list">
        {items.map(([title, body]) => (
          <div className="playbook-item" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
