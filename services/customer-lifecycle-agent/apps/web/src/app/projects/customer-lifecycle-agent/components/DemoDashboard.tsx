"use client";

import { useMemo, useState } from "react";
import AgentCard from "./AgentCard";
import CustomerProfilePanel from "./CustomerProfilePanel";
import InterventionPanel from "./InterventionPanel";
import LifecycleTimeline from "./LifecycleTimeline";
import MetricCard from "./MetricCard";
import { mockAgents } from "../data/mockAgents";
import { mockCustomers } from "../data/mockCustomers";
import { mockEvents } from "../data/mockEvents";
import type { LifecycleEvent } from "../types";

export default function DemoDashboard() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    mockCustomers[0].id,
  );
  const [customers, setCustomers] = useState(mockCustomers);
  const [agents, setAgents] = useState(mockAgents);
  const [events, setEvents] = useState<LifecycleEvent[]>(mockEvents);
  const [hasSimulated, setHasSimulated] = useState(false);

  const selectedCustomer = useMemo(
    () =>
      customers.find((customer) => customer.id === selectedCustomerId) ??
      customers[0],
    [customers, selectedCustomerId],
  );

  const recommendedAgents = agents.filter(
    (agent) => agent.status === "Recommended",
  );

  function handleSimulateIntervention() {
    if (hasSimulated) return;

    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === selectedCustomerId
          ? {
              ...customer,
              healthScore: Math.min(customer.healthScore + 12, 100),
              churnRisk: customer.churnRisk === "High" ? "Medium" : "Low",
              lastEvent:
                "Intervention sent and customer success workflow started.",
              recommendedAction:
                "Monitor next product session and confirm activation progress.",
            }
          : customer,
      ),
    );

    setAgents((currentAgents) =>
      currentAgents.map((agent) =>
        agent.status === "Recommended"
          ? {
              ...agent,
              status: "Actioned",
            }
          : agent,
      ),
    );

    setEvents((currentEvents) => [
      ...currentEvents,
      {
        id: "evt_intervention_sent",
        stage: "Retention",
        title: "Intervention actioned",
        description:
          "The platform triggered the recommended lifecycle intervention and updated the customer health model.",
        timestamp: "Now",
      },
    ]);

    setHasSimulated(true);
  }

  return (
    <div className="dashboard-grid">
      <div className="metrics-row">
        <MetricCard
          label="Health Score"
          value={`${selectedCustomer.healthScore}`}
          detail="Customer health"
        />
        <MetricCard
          label="Activation"
          value={`${selectedCustomer.activationProgress}%`}
          detail="Progress to first value"
        />
        <MetricCard
          label="Churn Risk"
          value={selectedCustomer.churnRisk}
          detail="Predicted risk level"
        />
        <MetricCard
          label="Open Actions"
          value={`${recommendedAgents.length}`}
          detail="Agent recommendations"
        />
      </div>

      <section className="panel customer-list-panel">
        <p className="section-label">Customers</p>
        <h2>Lifecycle worklist</h2>

        <div className="customer-list">
          {customers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              className={
                customer.id === selectedCustomerId
                  ? "customer-row active"
                  : "customer-row"
              }
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setHasSimulated(false);
              }}
            >
              <span>
                <strong>{customer.name}</strong>
                <small>{customer.segment}</small>
              </span>
              <em>{customer.churnRisk} risk</em>
            </button>
          ))}
        </div>
      </section>

      <CustomerProfilePanel customer={selectedCustomer} />

      <InterventionPanel
        customer={selectedCustomer}
        hasSimulated={hasSimulated}
        onSimulateIntervention={handleSimulateIntervention}
      />

      <section className="panel wide">
        <p className="section-label">Agents</p>
        <h2>Lifecycle agent layer</h2>

        <div className="agent-grid">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <LifecycleTimeline events={events} />
    </div>
  );
}
