import type { LifecycleAgent } from "../types";

type AgentCardProps = {
  agent: LifecycleAgent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <article className="agent-card">
      <div className="agent-card-header">
        <span>{agent.stage}</span>
        <em>{agent.status}</em>
      </div>

      <h3>{agent.name}</h3>
      <p>{agent.description}</p>

      <div className="agent-signal">
        <strong>Signal</strong>
        <span>{agent.signal}</span>
      </div>

      <div className="agent-signal">
        <strong>Recommendation</strong>
        <span>{agent.recommendation}</span>
      </div>
    </article>
  );
}
