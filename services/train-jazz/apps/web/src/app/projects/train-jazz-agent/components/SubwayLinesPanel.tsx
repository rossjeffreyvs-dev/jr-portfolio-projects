import type { TrainState } from "../types";
import { LINE_META } from "../agents/instrumentMappingAgent";

export default function SubwayLinesPanel({ trainState }: { trainState: TrainState }) {
  const lines = Object.entries(trainState.lines)
    .filter(([line]) => LINE_META[line])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18);

  return (
    <section className="tj-panel">
      <h2>Subway Lines</h2>
      <div>
        {lines.map(([line, count]) => {
          const meta = LINE_META[line];
          return (
            <div className="line-row" key={line}>
              <div className="badge" style={{ background: meta.color }}>{line}</div>
              <div><strong>{line}</strong><div className="inst">{meta.instrument}</div></div>
              <strong>{count}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
