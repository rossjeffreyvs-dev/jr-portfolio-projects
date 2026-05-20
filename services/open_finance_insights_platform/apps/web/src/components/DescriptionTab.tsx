const architecture = [
  ["Source layer", "Mock Plaid-style institutions, accounts, balances, and transactions."],
  ["Common financial data model", "Canonical Account, Institution, Transaction, Merchant, Category, CashFlowSummary, and FinancialSignal objects."],
  ["Analysis layer", "Merchant categorization, recurring payment detection, spending analysis, runway, and affordability signals."],
  ["Agent workflow", "Visible tool/activity stream that turns normalized data into recommendations."],
];

export default function DescriptionTab() {
  return (
    <section className="section-grid">
      <div className="content-card large">
        <p className="eyebrow">Product concept</p>
        <h2>From fragmented financial data to application-ready insight</h2>
        <p>
          This project reframes financial data connectivity as a product platform challenge: source records are useful,
          but the durable value comes from normalization, operational semantics, and downstream workflows that teams can trust.
        </p>
        <p>
          The MVP mirrors open-finance product thinking: ingest account and transaction records, normalize them into a common model,
          detect meaningful financial patterns, and expose an explainable recommendation panel for users, operators, or internal PM teams.
        </p>
      </div>
      <div className="content-card">
        <p className="eyebrow">Why it matters</p>
        <h3>Plaid-aligned product signal</h3>
        <p>
          The strongest portfolio signal is not just AI. It is the combination of developer-platform orientation, data normalization,
          account intelligence, and AI-assisted workflow orchestration.
        </p>
      </div>
      <div className="content-card full-span">
        <p className="eyebrow">Architecture</p>
        <h3>Open finance data flow</h3>
        <div className="architecture-grid">
          {architecture.map(([title, body], index) => (
            <div className="architecture-step" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{title}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
