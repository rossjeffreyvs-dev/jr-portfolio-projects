import type { Customer } from "../types";

type InterventionPanelProps = {
  customer: Customer;
  hasSimulated: boolean;
  onSimulateIntervention: () => void;
};

export default function InterventionPanel({
  customer,
  hasSimulated,
  onSimulateIntervention,
}: InterventionPanelProps) {
  return (
    <section className="panel intervention-panel">
      <p className="section-label">Recommended Intervention</p>
      <h2>Next-best action</h2>

      <p>{customer.recommendedAction}</p>

      <div className="decision-box">
        <strong>Why this action?</strong>
        <span>
          The customer is currently in the{" "}
          {customer.lifecycleStage.toLowerCase()} stage with a{" "}
          {customer.churnRisk.toLowerCase()} churn risk signal and a health
          score of {customer.healthScore}.
        </span>
      </div>

      <button
        type="button"
        className="primary-action"
        onClick={onSimulateIntervention}
        disabled={hasSimulated}
      >
        {hasSimulated ? "Intervention Actioned" : "Simulate Intervention"}
      </button>
    </section>
  );
}
