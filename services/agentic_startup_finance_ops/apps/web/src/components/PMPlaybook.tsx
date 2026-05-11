import Panel from "./Panel";

const playbookSteps = [
  [
    "👥",
    "Define founder job",
    "Clarify whether the founder is asking about hiring, runway, revenue risk, spend, activation, or board readiness.",
  ],
  [
    "🧠",
    "Extract parameters",
    "Capture segment, role, headcount, risk type, department, expense category, and timeframe from natural language.",
  ],
  [
    "🛠️",
    "Select tools",
    "Route only the relevant Stripe-like, forecasting, expense, customer-health, and LLM tools for the question.",
  ],
  [
    "📊",
    "Rank decisions",
    "Prioritize recommendations by financial impact, confidence, risk severity, and feedback-weighted learning signals.",
  ],
  [
    "✅",
    "Route review",
    "Send high-impact operating actions to a founder or finance lead before execution.",
  ],
];

const playbookSteps2 = [
  {
    number: "01",
    icon: "💬",
    title: "Capture founder question",
    description:
      "Start with five high-value finance and operating questions around hiring, runway, revenue risk, overspending, activation decline, and board reporting.",
  },
  {
    number: "02",
    icon: "🎯",
    title: "Extract operating intent",
    description:
      "Convert free-form founder language into structured intent, parameters, timeframe, segment, role, department, and risk type.",
  },
  {
    number: "03",
    icon: "🛠️",
    title: "Select agents and tools",
    description:
      "Use the workflow planner to choose only the relevant finance agents, Stripe-like tools, forecasting tools, expense tools, customer-health tools, and LLM synthesis.",
  },
  {
    number: "04",
    icon: "📈",
    title: "Rank recommendations",
    description:
      "Prioritize recommendations by financial impact, confidence, risk severity, and feedback-weighted learning signals.",
  },
  {
    number: "05",
    icon: "✅",
    title: "Route human review",
    description:
      "Send high-impact hiring, revenue, customer-risk, or board-facing recommendations to a founder or finance lead before execution.",
  },
];

const mvpSteps2 = [
  ["🧭", "Question intake"],
  ["🎯", "Intent extraction"],
  ["🛠️", "Tool selection"],
  ["📈", "Scenario modeling"],
  ["👤", "Human review"],
  ["🔁", "Feedback learning"],
];

const mvpSteps = [
  {
    number: "01",
    icon: "🧭",
    title: "Question intake",
    description:
      "Capture founder finance and operations questions from natural language.",
  },
  {
    number: "02",
    icon: "🎯",
    title: "Intent extraction",
    description:
      "Convert questions into structured operating intent and parameters.",
  },
  {
    number: "03",
    icon: "🛠️",
    title: "Tool selection",
    description:
      "Select only the relevant finance, forecasting, and risk-analysis tools.",
  },
  {
    number: "04",
    icon: "📈",
    title: "Scenario modeling",
    description:
      "Estimate runway, revenue impact, savings opportunities, and operational risk.",
  },
  {
    number: "05",
    icon: "👤",
    title: "Human review",
    description:
      "Route high-impact recommendations for founder or finance approval.",
  },
  {
    number: "06",
    icon: "🔁",
    title: "Feedback learning",
    description:
      "Use reviewer feedback signals to improve future recommendation ranking.",
  },
];

const integrationCards = [
  {
    eyebrow: "Stripe Billing",
    title: "Revenue context",
    copy: "Subscriptions, invoices, failed payments, customer segments, expansion signals, and revenue-at-risk workflows.",
  },
  {
    eyebrow: "Forecasting",
    title: "Runway modeling",
    copy: "Hiring scenarios, burn changes, cash runway, savings impact, and fundraising-window tradeoffs.",
  },
  {
    eyebrow: "Expense Systems",
    title: "Spend intelligence",
    copy: "Vendor overlap, underutilized SaaS, deferrable costs, department-level spend, and savings recommendations.",
  },
  {
    eyebrow: "Workflow",
    title: "Decision routing",
    copy: "Slack, task management, finance review queues, founder approvals, and feedback loops for recommendation learning.",
  },
];

export default function PMPlaybook() {
  return (
    <div className="tab-stack">
      {/* <Panel
        eyebrow="PM Playbook"
        title="How I would productize startup finance operations"
        body="The PM goal is to turn fragmented startup finance and operating signals into an adaptive decision system."
        wide
      >
        <FeatureCardGrid items={playbookSteps} numbered columns={5} />
      </Panel> */}

      <Panel tone="blue" className="overview-panel">
        <p className="eyebrow">PM Playbook</p>
        <h2>How I would productize this platform</h2>
        <p className="lede">
          The PM goal is to turn fragmented startup finance and operating
          signals into an adaptive decision system. The product should help
          founders understand what changed, why it matters, which agents and
          tools were used, and what action should be reviewed before money,
          hiring, or customer-risk decisions are made.
        </p>
        <div className="feature-row">
          {playbookSteps.map(([icon, title, copy]) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon">{icon}</span>
              <div>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <div className="two-col">
        <Panel>
          <p className="eyebrow">Agent Workflow</p>
          <h3>Adaptive multi-agent operating model</h3>
          <ul className="clean-list compact">
            <li>
              <strong>Buyer:</strong> founders, finance leads, startup
              operators, and revenue leaders who need operating decisions from
              disconnected finance and customer signals.
            </li>
            <li>
              <strong>Primary users:</strong> founders, finance operators,
              growth leaders, customer success leads, and investor-relations
              owners.
            </li>
            <li>
              <strong>Business need:</strong> make faster, evidence-backed
              decisions about hiring, collections, spend, runway, activation,
              and investor communication.
            </li>
          </ul>
        </Panel>

        <Panel>
          <p className="eyebrow">Product Strategy</p>
          <h3>Primary product bet</h3>
          <p>
            The core bet is that early-stage teams do not need another
            dashboard; they need an explainable action layer that converts
            finance, billing, and customer-health signals into prioritized
            decisions.
          </p>
          <p>
            The product should show which opportunities or risks are most
            important, why they matter, which tools were called, and what action
            is most likely to improve runway or protect revenue.
          </p>
        </Panel>
      </div>

      <Panel>
        <p className="eyebrow">MVP Scope</p>
        <h3>What I would build first</h3>
        <p>
          The first version should focus on five high-value founder questions:
          hiring affordability, revenue at risk, overspending, activation
          decline, and board-ready reporting. Everything else should support
          that loop.
        </p>

        <div className="feature-row-6">
          {mvpSteps.map((step) => (
            <article className="feature-card" key={step.title}>
              {/* <span className="feature-card-number">{step.number}</span> */}

              <span className="feature-icon">{step.icon}</span>

              <div>
                <strong>
                  {step.title.split(" ").map((word, index) => (
                    <span key={index}>
                      {word}
                      <br />
                    </span>
                  ))}
                </strong>

                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        {/* <div className="feature-row workflow-row">
          {mvpSteps.map((step) => (
            <article
              className="feature-card workflow-step-card"
              key={step.title}
            >
              <span className="feature-icon">{step.icon}</span>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
          ))}{" "}
        </div> */}
      </Panel>

      <div className="two-col">
        <Panel>
          <p className="eyebrow">Key PM Questions</p>
          <h3>What to validate</h3>
          <ul className="clean-list compact">
            <li>
              Which founder questions occur often enough to justify dedicated
              agent workflows?
            </li>
            <li>
              Which decisions need AI recommendations versus simple reporting?
            </li>
            <li>
              Which recommendation types require human approval before action?
            </li>
            <li>
              How much evidence is needed before a founder trusts the
              recommendation?
            </li>
            <li>
              What feedback signals should change future ranking and confidence?
            </li>
          </ul>
        </Panel>

        <Panel>
          <p className="eyebrow">Evaluation Metrics</p>
          <h3>How success should be measured</h3>
          <ul className="clean-list compact">
            <li>Time from founder question to recommended action.</li>
            <li>Percent of recommendations accepted, rejected, or modified.</li>
            <li>Revenue recovered from failed payments or at-risk accounts.</li>
            <li>
              Runway preserved through spend optimization or hiring sequencing.
            </li>
            <li>
              Accuracy of extracted intent, parameters, selected agents, and
              selected tools.
            </li>
            <li>
              Founder trust score for explanation quality and evidence
              transparency.
            </li>
          </ul>
        </Panel>
      </div>

      <Panel>
        <p className="eyebrow">Integration Strategy</p>
        <h3>Where this would connect in the real world</h3>
        <div className="architecture-grid">
          {integrationCards.map((card) => (
            <article className="architecture-card" key={card.title}>
              <p className="mini-eyebrow">{card.eyebrow}</p>
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="two-col">
        <Panel>
          <p className="eyebrow">Risk & Governance</p>
          <h3>What should stay human-reviewed</h3>
          <ul className="clean-list compact">
            <li>
              Hiring, headcount, or budget recommendations that materially
              change burn.
            </li>
            <li>
              Customer outreach involving collections, churn prevention, or
              contract negotiation.
            </li>
            <li>Investor-facing summaries and board-ready narratives.</li>
            <li>
              Low-confidence recommendations or recommendations based on
              incomplete signals.
            </li>
            <li>
              Actions that directly affect customer communication, pricing, or
              access.
            </li>
          </ul>
        </Panel>

        <Panel>
          <p className="eyebrow">Next Iteration</p>
          <h3>How I would evolve it</h3>
          <ul className="clean-list compact">
            <li>
              Add Stripe sandbox support for subscriptions, invoices, failed
              payments, and test clocks.
            </li>
            <li>
              Add Plaid-style cash-flow and bank transaction inputs for expense
              and runway analysis.
            </li>
            <li>
              Add CRM and product analytics integrations for customer-health and
              activation signals.
            </li>
            <li>
              Compare accepted versus rejected recommendations across founder
              segments.
            </li>
            <li>
              Use feedback loops to adjust recommendation ranking, confidence
              labels, and agent selection.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
