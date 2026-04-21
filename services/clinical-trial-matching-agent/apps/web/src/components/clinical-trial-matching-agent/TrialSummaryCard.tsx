"use client";

import type { Trial } from "@/lib/api";

type TrialSummaryCardProps = {
  activeTrial?: Trial;
};

function readTrialValue(
  trial: Trial | undefined,
  keys: string[],
  fallback = "—",
) {
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
  const status = readTrialValue(activeTrial, ["status"], "active");
  const keyInclusion = readTrialValue(activeTrial, [
    "key_inclusion",
    "keyInclusion",
    "inclusion_summary",
  ]);
  const performance = readTrialValue(activeTrial, [
    "performance",
    "performance_requirement",
    "performance_status_requirement",
  ]);
  const imagingContext = readTrialValue(activeTrial, [
    "imaging_context",
    "imaging_requirements",
    "disease_context",
  ]);
  const exclusions = readTrialValue(activeTrial, [
    "exclusions",
    "key_exclusion",
    "keyExclusion",
    "exclusion_summary",
  ]);

  return (
    <div className="meta-list">
      <div className="meta-item">
        <strong>Title</strong>
        <span>{title}</span>
      </div>

      <div className="meta-item">
        <strong>Disease Area</strong>
        <span>{diseaseArea}</span>
      </div>

      <div className="meta-item">
        <strong>Phase</strong>
        <span>{phase}</span>
      </div>

      <div className="meta-item">
        <strong>Status</strong>
        <span>{status}</span>
      </div>

      <div className="meta-item">
        <strong>Key Inclusion</strong>
        <span>{keyInclusion}</span>
      </div>

      <div className="meta-item">
        <strong>Performance</strong>
        <span>{performance}</span>
      </div>

      <div className="meta-item">
        <strong>Imaging / Disease Context</strong>
        <span>{imagingContext}</span>
      </div>

      <div className="meta-item">
        <strong>Exclusions</strong>
        <span>{exclusions}</span>
      </div>
    </div>
  );
}
