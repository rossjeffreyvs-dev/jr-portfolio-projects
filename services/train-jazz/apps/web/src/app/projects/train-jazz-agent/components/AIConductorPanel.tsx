import type { ConductorState } from "../types";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function AIConductorPanel({ conductor }: { conductor: ConductorState }) {
  return (
    <section className="panel conductor-panel">
      <div>
        <p className="section-label">AI Conductor</p>
        <h2>Decision layer shaping the ensemble</h2>
        <p className="guidance">{conductor.guidance}</p>
      </div>
      <div className="conductor-bars">
        {[
          ["Density", conductor.density],
          ["Activity", conductor.activity],
          ["Tension", conductor.tension],
        ].map(([label, value]) => (
          <div className="bar-row" key={label as string}>
            <span>{label as string}</span>
            <div className="bar"><span style={{ width: percent(value as number) }} /></div>
            <strong>{percent(value as number)}</strong>
          </div>
        ))}
        <div className="bar-row"><span>Lead</span><strong style={{ gridColumn: "2 / -1" }}>{conductor.leadFamily}</strong></div>
      </div>
    </section>
  );
}
