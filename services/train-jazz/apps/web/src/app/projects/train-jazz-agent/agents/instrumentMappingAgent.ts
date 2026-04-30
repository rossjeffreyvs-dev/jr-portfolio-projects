import type { LineMeta } from "../types";

export const LINE_META: Record<string, LineMeta> = {
  "1": { group: "bass", color: "#ef3e36", instrument: "Upright Bass", root: "D2" },
  "2": { group: "bass", color: "#ef3e36", instrument: "Upright Bass", root: "F2" },
  "3": { group: "bass", color: "#ef3e36", instrument: "Upright Bass", root: "A2" },
  "4": { group: "rhodes", color: "#43b02a", instrument: "Rhodes Electric Piano", root: "D3" },
  "5": { group: "rhodes", color: "#43b02a", instrument: "Rhodes Electric Piano", root: "F3" },
  "6": { group: "rhodes", color: "#43b02a", instrument: "Rhodes Electric Piano", root: "A3" },
  "7": { group: "vibes", color: "#b933c9", instrument: "Vibraphone", root: "D4" },
  A: { group: "trombone", color: "#2850ad", instrument: "Jazz Trombone", root: "D3" },
  C: { group: "trombone", color: "#2850ad", instrument: "Jazz Trombone", root: "F3" },
  E: { group: "trombone", color: "#2850ad", instrument: "Jazz Trombone", root: "A3" },
  B: { group: "sax", color: "#ff6319", instrument: "Tenor Saxophone", root: "F3" },
  D: { group: "sax", color: "#ff6319", instrument: "Tenor Saxophone", root: "A3" },
  F: { group: "sax", color: "#ff6319", instrument: "Tenor Saxophone", root: "C4" },
  M: { group: "sax", color: "#ff6319", instrument: "Tenor Saxophone", root: "D4" },
  G: { group: "celesta", color: "#6cbe45", instrument: "Celesta", root: "D4" },
  J: { group: "accent", color: "#996633", instrument: "Maracas", root: "D4" },
  Z: { group: "accent", color: "#996633", instrument: "Maracas", root: "F4" },
  L: { group: "accent", color: "#a7a9ac", instrument: "Closed Hi-Hat", root: "G4" },
  N: { group: "guitar", color: "#fccc0a", instrument: "Clean Jazz Guitar", root: "D3" },
  Q: { group: "guitar", color: "#fccc0a", instrument: "Bright Jazz Guitar", root: "F3" },
  R: { group: "guitar", color: "#fccc0a", instrument: "Softer Jazz Guitar", root: "A3" },
  W: { group: "guitar", color: "#fccc0a", instrument: "Hollow Warm Jazz Guitar", root: "C4" },
  S: { group: "accent", color: "#808183", instrument: "Side-Stick Rimshot", root: "C4" },
  SI: { group: "accent", color: "#006bb6", instrument: "Open Hi-Hat", root: "A4" },
};

export const ORDERED_LINES = Object.keys(LINE_META);
