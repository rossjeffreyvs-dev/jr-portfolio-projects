"use client";

import type { Trial } from "@/lib/api";

type TrialSummaryCardProps = {
  activeTrial?: Trial;
};

function readTrialValue(
  trial: Trial | undefined,
  keys: string[],
  fallback = "—",
): string {
  if (!trial) return fallback;

  const record = trial as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (value === null || value === undefined || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : fallback;
    }

    return String(value);
  }

  return fallback;
}

function readTrialList(trial: Trial | undefined, keys: string[]): string[] {
  if (!trial) return [];

  const record = trial as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return [value.trim()];
    }
  }

  return [];
}

function renderValue(value: string | string[]) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return <span>—</span>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          alignItems: "flex-start",
        }}
      >
        {value.map((item) => (
          <span key={item}>• {item}</span>
        ))}
      </div>
    );
  }

  return <span>{value}</span>;
}

export default function TrialSummaryCard({
  activeTrial,
}: TrialSummaryCardProps) {
  if (!activeTrial) {
    return (
      <div className="meta-list">
        <div className="meta-item">
          <strong>Trial</strong>
          <span>No active trial selected</span>
        </div>
      </div>
    );
  }

  const title = readTrialValue(activeTrial, ["title"]);
  const diseaseArea = readTrialValue(activeTrial, [
    "disease_area",
    "diseaseArea",
    "indication",
  ]);
  const phase = readTrialValue(activeTrial, ["phase"]);
  const status = readTrialValue(
    activeTrial,
    ["protocol_status", "status"],
    "active",
  );

  const keyInclusion = readTrialList(activeTrial, [
    "key_inclusion",
    "keyInclusion",
    "inclusion_summary",
  ]);

  const performance = readTrialList(activeTrial, [
    "performance",
    "performance_requirement",
    "performance_status_requirement",
  ]);

  const imagingContext = readTrialList(activeTrial, [
    "imaging_context",
    "imaging_requirements",
    "disease_context",
  ]);

  const exclusions = readTrialList(activeTrial, [
    "exclusions",
    "key_exclusion",
    "keyExclusion",
    "exclusion_summary",
  ]);

  return (
    <div className="meta-list">
      <div className="meta-item">
        <strong>Title</strong>
        {renderValue(title)}
      </div>

      <div className="meta-item">
        <strong>Disease Area</strong>
        {renderValue(diseaseArea)}
      </div>

      <div className="meta-item">
        <strong>Phase</strong>
        {renderValue(phase)}
      </div>

      <div className="meta-item">
        <strong>Status</strong>
        {renderValue(status)}
      </div>

      <div className="meta-item">
        <strong>Key Inclusion</strong>
        {renderValue(keyInclusion)}
      </div>

      <div className="meta-item">
        <strong>Performance</strong>
        {renderValue(performance)}
      </div>

      <div className="meta-item">
        <strong>Imaging / Disease Context</strong>
        {renderValue(imagingContext)}
      </div>

      <div className="meta-item">
        <strong>Exclusions</strong>
        {renderValue(exclusions)}
      </div>
    </div>
  );
}
