import type { ConductorState, InstrumentGroup, LineMeta, TrainState } from "../types";

const FAMILY_PRIORITY: InstrumentGroup[] = ["bass", "rhodes", "vibes", "sax", "trombone", "guitar", "celesta"];
const LEAD_ROTATION_SECONDS = 18;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function topFamilyFromLines(lines: Record<string, number>, lineMeta: Record<string, LineMeta>): InstrumentGroup {
  const totals: Partial<Record<InstrumentGroup, number>> = {};
  Object.entries(lines).forEach(([line, count]) => {
    const group = lineMeta[line]?.group;
    if (!group || group === "accent") return;
    totals[group] = (totals[group] || 0) + count;
  });
  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] as InstrumentGroup) || "rhodes";
}

function rotatingLeadFamily(seedFamily: InstrumentGroup): InstrumentGroup {
  const rotation = [seedFamily, "vibes", "sax", "trombone", "guitar", "rhodes"]
    .filter((value, index, arr) => arr.indexOf(value) === index && FAMILY_PRIORITY.includes(value as InstrumentGroup)) as InstrumentGroup[];
  const index = Math.floor(Date.now() / (LEAD_ROTATION_SECONDS * 1000)) % rotation.length;
  return rotation[index] || seedFamily || "rhodes";
}

export function createAIConductor() {
  let state: ConductorState = {
    density: 0.35,
    activity: 0.32,
    tension: 0.12,
    leadFamily: "rhodes",
    bedGain: 1,
    accentGain: 1,
    phraseChance: 0.62,
    clusterChance: 0.42,
    maxActiveNotes: 26,
    guidance: "Balancing line voices with restrained accents.",
  };

  function update(trainState: TrainState, lineMeta: Record<string, LineMeta>) {
    const rawDensity = clamp(trainState.density ?? 0.35, 0, 1);
    const rawActivity = clamp(trainState.activity ?? 0.32, 0, 1);
    const rawTension = clamp(trainState.tension ?? 0.12, 0, 1);
    const seedFamily = topFamilyFromLines(trainState.lines, lineMeta);
    const leadFamily = rotatingLeadFamily(seedFamily);

    const target = {
      density: clamp(rawDensity * 0.92 + rawActivity * 0.08, 0.18, 0.82),
      activity: clamp(rawActivity * 0.86 + rawDensity * 0.14, 0.14, 0.76),
      tension: clamp(rawTension, 0.04, 0.48),
      leadFamily,
      bedGain: clamp(0.86 + rawDensity * 0.26, 0.82, 1.10),
      accentGain: clamp(0.78 + rawActivity * 0.36, 0.76, 1.12),
      phraseChance: clamp(0.42 + rawActivity * 0.42, 0.38, 0.78),
      clusterChance: clamp(0.24 + rawDensity * 0.34, 0.24, 0.55),
      maxActiveNotes: Math.round(clamp(18 + rawDensity * 16, 18, 34)),
    };

    state = {
      ...state,
      density: state.density + (target.density - state.density) * 0.18,
      activity: state.activity + (target.activity - state.activity) * 0.18,
      tension: state.tension + (target.tension - state.tension) * 0.14,
      bedGain: state.bedGain + (target.bedGain - state.bedGain) * 0.16,
      accentGain: state.accentGain + (target.accentGain - state.accentGain) * 0.16,
      phraseChance: state.phraseChance + (target.phraseChance - state.phraseChance) * 0.16,
      clusterChance: state.clusterChance + (target.clusterChance - state.clusterChance) * 0.16,
      maxActiveNotes: target.maxActiveNotes,
      leadFamily: target.leadFamily,
      guidance: `Lead ${target.leadFamily}; ${rawDensity > 0.58 ? "thicken harmony" : "keep harmony airy"}; ${rawTension > 0.30 ? "allow slight tension" : "favor consonant tones"}.`,
    };

    return { ...state };
  }

  function getState() {
    return { ...state };
  }

  return { update, getState };
}
