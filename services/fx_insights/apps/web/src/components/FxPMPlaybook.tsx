import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import FeatureCardGrid from "./FeatureCardList";

type PlaybookAgent = {
  index: string;
  icon: string;
  title: string;
  text: string;
};

type MvpStep = {
  index: string;
  icon: string;
  title: string;
  description: string;
};

const PLAYBOOK_CONTENT: {
  highlights: { icon: string; label: string }[];
  discovery: string[];
  strategy: string[];
  architecture: PlaybookAgent[];
  mvpSteps: MvpStep[];
  metrics: string[];
  risks: string[];
} = {
  highlights: [
    { icon: "🔎", label: "Discovery-led market workflow framing" },
    { icon: "🧪", label: "MVP scope and report generation loop" },
    { icon: "⚡", label: "Streaming UX and trust-building interaction design" },
    { icon: "🏦", label: "Financial-services platform fit" },
  ],
  discovery: [
    "FX users need faster ways to convert market movement and headlines into concise commentary.",
    "Analysts and client-facing teams often move across rate tools, news sources, and manual writing workflows.",
    "A successful MVP should reduce time-to-brief while preserving analyst review and confidence.",
  ],
  strategy: [
    "Position the product as an AI-assisted market intelligence workflow, not an autonomous trading recommendation engine.",
    "Keep the human in control by making inputs, data sources, progress stages, and generated output visible.",
    "Design the demo around a clear sequence: rates → news → synthesis → reviewable client summary.",
  ],
  architecture: [
    {
      index: "01",
      icon: "📈",
      title: "Rate Retrieval Agent",
      text: "Fetches current FX rates for selected base and quote currencies.",
    },
    {
      index: "02",
      icon: "📰",
      title: "Market News Agent",
      text: "Retrieves current headlines for selected countries or market regions.",
    },
    {
      index: "03",
      icon: "✨",
      title: "Insight Synthesis Agent",
      text: "Combines rate movement and qualitative context into a concise interpretation.",
    },
    {
      index: "04",
      icon: "✉️",
      title: "Report Generation Agent",
      text: "Formats the insight as a client-ready market summary.",
    },
    {
      index: "05",
      icon: "👤",
      title: "Review Layer",
      text: "Keeps the generated commentary visible, editable, and reviewable before use.",
    },
  ],
  mvpSteps: [
    {
      index: "01",
      icon: "🌐",
      title: "Select market inputs",
      description:
        "Choose base currency, quote currencies, and countries for market context.",
    },
    {
      index: "02",
      icon: "📊",
      title: "Retrieve market data",
      description:
        "Collect FX rates and recent headlines from the workflow service.",
    },
    {
      index: "03",
      icon: "⚡",
      title: "Stream progress",
      description:
        "Show stage-level progress while external data and AI generation run.",
    },
    {
      index: "04",
      icon: "📝",
      title: "Generate commentary",
      description:
        "Produce a concise client-ready market narrative grounded in retrieved context.",
    },
    {
      index: "05",
      icon: "✅",
      title: "Review output",
      description:
        "Let the analyst review, refine, and decide whether the summary is usable.",
    },
  ],
  metrics: [
    "Time to generate first usable market summary",
    "Report completion success rate",
    "Streaming workflow completion rate",
    "User copy/export rate",
    "Analyst confidence or usefulness rating",
  ],
  risks: [
    "Market data freshness and API reliability",
    "Hallucinated or unsupported commentary",
    "Over-positioning output as financial advice",
    "Latency across external APIs and LLM generation",
  ],
};

const architectureCards = PLAYBOOK_CONTENT.architecture.map((agent) => ({
  number: agent.index,
  icon: agent.icon,
  title: agent.title,
  description: agent.text,
}));

const mvpCards = PLAYBOOK_CONTENT.mvpSteps.map((step) => ({
  number: step.index,
  icon: step.icon,
  title: step.title,
  description: step.description,
}));

export default function FxPMPlaybook() {
  return (
    <div className="project-description pm-playbook content-grid">
      <Panel
        eyebrow="PM Playbook"
        title="AI FX Market Intelligence"
        body="A product management view of the demo: how the workflow would be discovered, scoped, shipped, measured, and improved through feedback."
        className="panel-accent-blue"
        wide
      >
        <FeatureListGrid items={PLAYBOOK_CONTENT.highlights} columns={4} />
      </Panel>

      <Panel
        eyebrow="Discovery"
        title="Problem Framing & Discovery"
        bullets={PLAYBOOK_CONTENT.discovery}
        className="ui-panel-list-blue"
      />

      <Panel
        eyebrow="Strategy"
        title="Product Vision & Strategy"
        bullets={PLAYBOOK_CONTENT.strategy}
        className="ui-panel-list-green"
      />

      <Panel
        eyebrow="Solution Design"
        title="Agent Architecture"
        body="The product is designed as a multi-step workflow rather than a single black-box AI response."
        wide
      >
        <FeatureCardGrid
          items={architectureCards}
          numbered
          columns={5}
          ariaLabel="FX agent architecture"
        />
      </Panel>

      <Panel
        eyebrow="MVP"
        title="What This Demo Proves"
        body="The MVP validates whether users can understand, trust, and act on an AI-assisted FX briefing workflow."
        wide
      >
        <FeatureCardGrid
          items={mvpCards}
          numbered
          columns={5}
          ariaLabel="FX MVP workflow"
        />
      </Panel>

      <Panel
        eyebrow="Measurement"
        title="Success Metrics"
        bullets={PLAYBOOK_CONTENT.metrics}
        className="ui-panel-list"
      />

      <Panel
        eyebrow="Risk"
        title="Product Risks & Guardrails"
        bullets={PLAYBOOK_CONTENT.risks}
        className="ui-panel-list"
      />

      <Panel
        eyebrow="Portfolio Signal"
        title="An end-to-end product approach spanning UX, document AI, and workflow design moving from - "
        body="PM framing → Agent workflow → Streaming UX → Measurable value"
        className="panel-accent-blue"
        wide
      />
    </div>
  );
}
