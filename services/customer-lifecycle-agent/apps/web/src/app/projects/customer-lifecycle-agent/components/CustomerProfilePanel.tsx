import type { Customer } from "../types";

type CustomerProfilePanelProps = {
  customer: Customer;
};

export default function CustomerProfilePanel({
  customer,
}: CustomerProfilePanelProps) {
  return (
    <section className="panel">
      <p className="section-label">Selected Customer</p>
      <h2>{customer.name}</h2>

      <div className="profile-stack">
        <div>
          <span>Segment</span>
          <strong>{customer.segment}</strong>
        </div>

        <div>
          <span>Lifecycle Stage</span>
          <strong>{customer.lifecycleStage}</strong>
        </div>

        <div>
          <span>Last Event</span>
          <strong>{customer.lastEvent}</strong>
        </div>
      </div>
    </section>
  );
}
