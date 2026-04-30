export type LineId =
  | "1" | "2" | "3" | "4" | "5" | "6" | "7"
  | "A" | "C" | "E" | "B" | "D" | "F" | "M"
  | "G" | "J" | "Z" | "L" | "N" | "Q" | "R" | "W" | "S" | "SI";

export type InstrumentGroup =
  | "bass" | "rhodes" | "vibes" | "sax" | "trombone" | "guitar" | "celesta" | "accent";

export type LineMeta = {
  group: InstrumentGroup;
  color: string;
  instrument: string;
  root: string;
};

export type TrainState = {
  lines: Record<string, number>;
  totalTrains: number;
  activeLines: number;
  density: number;
  activity: number;
  tension: number;
};

export type ConductorState = {
  density: number;
  activity: number;
  tension: number;
  leadFamily: InstrumentGroup;
  bedGain: number;
  accentGain: number;
  phraseChance: number;
  clusterChance: number;
  maxActiveNotes: number;
  guidance: string;
};

export type FeedEvent = {
  id: string;
  text: string;
};

export type VisualTrain = {
  id: string;
  line: string;
  x: number;
  y: number;
  pathIndex: number;
  progress: number;
  speed: number;
};
