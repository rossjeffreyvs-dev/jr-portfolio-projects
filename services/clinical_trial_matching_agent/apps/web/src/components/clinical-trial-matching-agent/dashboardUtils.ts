import type { CriterionResult, Evaluation, Patient } from "@/lib/api";

export function statusClass(status: string) {
  if (status === "Likely Match") return "badge match";
  if (status === "Approved") return "badge match";
  if (status === "Requires Review") return "badge review";
  if (status === "Not Eligible") return "badge reject";
  if (status === "Rejected") return "badge reject";
  return "badge info";
}

export function titleCaseStatus(status: CriterionResult["status"]) {
  if (status === "missing_information") return "Missing Info";
  if (status === "possibly_met") return "Possibly Met";
  if (status === "not_met") return "Not Met";
  return "Met";
}

export function joinList(items: string[]) {
  return items.length ? items.join(", ") : "None";
}

export function formatLabs(labs: Record<string, string | number | boolean>) {
  return Object.entries(labs)
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
    .join(", ");
}

function outcomeOrder(status: Patient["seeded_outcome"]) {
  if (status === "Likely Match") return 0;
  if (status === "Requires Review") return 1;
  if (status === "Not Eligible") return 2;
  return 3;
}

export function sortPatientsForTrial(items: Patient[]) {
  return [...items].sort((a, b) => {
    const outcomeDelta =
      outcomeOrder(a.seeded_outcome) - outcomeOrder(b.seeded_outcome);

    if (outcomeDelta !== 0) return outcomeDelta;

    return b.seeded_score - a.seeded_score;
  });
}

function evaluationTimestampValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function recommendationRank(recommendation?: string) {
  if (recommendation === "Requires Review") return 0;
  if (recommendation === "Approved") return 1;
  if (recommendation === "Likely Match") return 2;
  if (recommendation === "Rejected") return 3;
  if (recommendation === "Not Eligible") return 4;
  return 5;
}

export function dedupeEvaluationsByPatient(items: Evaluation[]) {
  const latestByPatient = new Map<string, Evaluation>();

  for (const evaluation of items) {
    const existing = latestByPatient.get(evaluation.patient_id);

    if (!existing) {
      latestByPatient.set(evaluation.patient_id, evaluation);
      continue;
    }

    const existingTimestamp = evaluationTimestampValue(existing.submitted_at);
    const nextTimestamp = evaluationTimestampValue(evaluation.submitted_at);

    if (nextTimestamp > existingTimestamp) {
      latestByPatient.set(evaluation.patient_id, evaluation);
      continue;
    }

    if (
      nextTimestamp === existingTimestamp &&
      evaluation.match_score > existing.match_score
    ) {
      latestByPatient.set(evaluation.patient_id, evaluation);
    }
  }

  return [...latestByPatient.values()].sort((a, b) => {
    const rankDelta =
      recommendationRank(a.recommendation) -
      recommendationRank(b.recommendation);

    if (rankDelta !== 0) return rankDelta;

    if (b.match_score !== a.match_score) {
      return b.match_score - a.match_score;
    }

    return (
      evaluationTimestampValue(b.submitted_at) -
      evaluationTimestampValue(a.submitted_at)
    );
  });
}
