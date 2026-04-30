import type { TrainState } from "../types";
import { ORDERED_LINES } from "../agents/instrumentMappingAgent";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function createInitialTrainState(): TrainState {
  const lines: Record<string, number> = {};
  ORDERED_LINES.forEach((line) => {
    lines[line] = Math.floor(4 + Math.random() * 18);
  });
  return normalizeLines(lines, 0.18);
}

export function evolveTrainState(previous: TrainState): TrainState {
  const lines: Record<string, number> = {};
  ORDERED_LINES.forEach((line) => {
    const current = previous.lines[line] ?? 0;
    const drift = Math.floor(Math.random() * 7) - 3;
    lines[line] = Math.round(clamp(current + drift, 0, 34));
  });
  const tension = clamp(previous.tension + (Math.random() - 0.5) * 0.08, 0.04, 0.42);
  return normalizeLines(lines, tension);
}

function normalizeLines(lines: Record<string, number>, tension: number): TrainState {
  const totalTrains = Object.values(lines).reduce((sum, count) => sum + count, 0);
  const activeLines = Object.values(lines).filter((count) => count > 0).length;
  return {
    lines,
    totalTrains,
    activeLines,
    density: clamp(0.22 + totalTrains / 520, 0.22, 0.78),
    activity: clamp(0.18 + activeLines / 34 + Math.random() * 0.08, 0.18, 0.72),
    tension,
  };
}
