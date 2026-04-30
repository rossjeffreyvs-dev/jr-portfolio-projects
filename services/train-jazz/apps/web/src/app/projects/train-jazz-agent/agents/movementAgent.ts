import type { VisualTrain } from "../types";

export const MAP_PATHS = [
  { lines: ["1", "2", "3"], d: "M328 84 C302 165 302 245 315 334 C328 430 305 548 290 735" },
  { lines: ["4", "5", "6"], d: "M394 72 C370 170 365 255 382 350 C402 456 382 560 398 742" },
  { lines: ["A", "C", "E"], d: "M185 120 C288 184 330 268 338 370 C346 500 300 618 295 748" },
  { lines: ["B", "D", "F", "M"], d: "M468 86 C423 188 438 268 458 356 C482 468 465 588 492 744" },
  { lines: ["7"], d: "M356 250 C455 210 560 190 678 170" },
  { lines: ["G"], d: "M560 238 C515 320 505 418 520 574" },
  { lines: ["J", "Z"], d: "M440 456 C525 456 595 490 688 552" },
  { lines: ["L"], d: "M310 410 C432 392 560 400 688 392" },
  { lines: ["N", "Q", "R", "W"], d: "M505 92 C455 205 492 322 455 440 C420 560 525 642 595 744" },
  { lines: ["S"], d: "M345 335 L410 335" },
  { lines: ["SI"], d: "M112 732 C170 684 214 648 250 596" },
];

export function makeVisualTrains(lines: Record<string, number>): VisualTrain[] {
  const visual: VisualTrain[] = [];
  Object.entries(lines).forEach(([line, count]) => {
    const pathIndex = MAP_PATHS.findIndex((route) => route.lines.includes(line));
    if (pathIndex < 0 || count <= 0) return;
    const visibleCount = Math.min(Math.max(Math.round(count / 4), 1), 10);
    for (let index = 0; index < visibleCount; index += 1) {
      visual.push({
        id: `${line}-${index}`,
        line,
        x: 0,
        y: 0,
        pathIndex,
        progress: (index / Math.max(visibleCount, 1) + Math.random() * 0.08) % 1,
        speed: 0.00035 + Math.random() * 0.0007,
      });
    }
  });
  return visual;
}

export function moveVisualTrains(trains: VisualTrain[]) {
  return trains.map((train) => ({
    ...train,
    progress: (train.progress + train.speed) % 1,
  }));
}
