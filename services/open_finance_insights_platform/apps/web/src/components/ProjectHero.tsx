type ProjectHeroProps = {
  onRunDemo: () => void;
};

const metrics = [
  { value: "4", label: "Data sources" },
  { value: "7", label: "CDM entities" },
  { value: "6", label: "Insight tools" },
];

export default function ProjectHero({ onRunDemo }: ProjectHeroProps) {
  return (
    <section className="hero">
      <h1>AI-Powered Open Finance Data Platform</h1>
      <p className="hero-subtitle">
        Normalize mock bank, account, balance, and transaction data into a
        common financial data model, then run explainable insight workflows
        across cash flow, recurring payments, and financial health signals.
      </p>

      <div className="hero-metrics" aria-label="Project metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
