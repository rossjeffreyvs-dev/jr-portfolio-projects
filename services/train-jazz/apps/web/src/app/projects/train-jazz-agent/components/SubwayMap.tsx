import type { VisualTrain } from "../types";
import { LINE_META, ORDERED_LINES } from "../agents/instrumentMappingAgent";
import { MAP_PATHS } from "../agents/movementAgent";

function pointOnCurve(progress: number, pathIndex: number) {
  const base = [
    [328, 84, 302, 165, 302, 245, 315, 334, 328, 430, 305, 548, 290, 735],
    [394, 72, 370, 170, 365, 255, 382, 350, 402, 456, 382, 560, 398, 742],
    [185, 120, 288, 184, 330, 268, 338, 370, 346, 500, 300, 618, 295, 748],
    [468, 86, 423, 188, 438, 268, 458, 356, 482, 468, 465, 588, 492, 744],
    [356, 250, 455, 210, 560, 190, 678, 170],
    [560, 238, 515, 320, 505, 418, 520, 574],
    [440, 456, 525, 456, 595, 490, 688, 552],
    [310, 410, 432, 392, 560, 400, 688, 392],
    [505, 92, 455, 205, 492, 322, 455, 440, 420, 560, 525, 642, 595, 744],
    [345, 335, 410, 335],
    [112, 732, 170, 684, 214, 648, 250, 596],
  ][pathIndex] || [0, 0, 0, 0];
  const t = progress;
  if (base.length === 4) {
    return { x: base[0] + (base[2] - base[0]) * t, y: base[1] + (base[3] - base[1]) * t };
  }
  const segment = t < 0.5 ? 0 : 1;
  const localT = segment === 0 ? t * 2 : (t - 0.5) * 2;
  const i = segment === 0 ? 0 : 6;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = base.slice(i, i + 8);
  const u = 1 - localT;
  return {
    x: u ** 3 * x0 + 3 * u ** 2 * localT * x1 + 3 * u * localT ** 2 * x2 + localT ** 3 * x3,
    y: u ** 3 * y0 + 3 * u ** 2 * localT * y1 + 3 * u * localT ** 2 * y2 + localT ** 3 * y3,
  };
}

export default function SubwayMap({ trains }: { trains: VisualTrain[] }) {
  return (
    <section className="tj-panel map-card">
      <h2>Subway Map</h2>
      <div className="map-legend">
        {ORDERED_LINES.map((line) => <div key={line} className="badge" style={{ background: LINE_META[line].color }}>{line}</div>)}
      </div>
      <svg className="subway-map" viewBox="0 0 720 820" role="img" aria-label="Stylized subway map">
        <g>
          {MAP_PATHS.map((route, index) => <path key={index} d={route.d} fill="none" stroke="#b8b4ae" strokeWidth="5" strokeLinecap="round" opacity="0.7" />)}
          {MAP_PATHS.map((route, index) => <path key={`thin-${index}`} d={route.d} fill="none" stroke="#e4dfd6" strokeWidth="2" strokeLinecap="round" />)}
        </g>
        <g>
          {trains.map((train) => {
            const point = pointOnCurve(train.progress, train.pathIndex);
            return (
              <g key={train.id} transform={`translate(${point.x} ${point.y})`}>
                <circle r="9" fill="white" opacity="0.88" />
                <circle r="5" fill={LINE_META[train.line]?.color || "#333"} />
              </g>
            );
          })}
        </g>
      </svg>
    </section>
  );
}
