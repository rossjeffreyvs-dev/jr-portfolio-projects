import type { EvaluationResult } from "./types";

export function formatRecommendation(value?: string) {
  if (value === "potential_match") return "Potential Match";
  if (value === "needs_review") return "Needs Review";
  if (value === "not_eligible") return "Not Eligible";
  return "Pending Evaluation";
}

export function formatResult(value: string) {
  if (value === "no_match") return "No Match";
  return value.replace("_", " ");
}

export function getEmptySummary() {
  return {
    matches: 0,
    no_matches: 0,
    uncertain: 0,
    total: 0,
  };
}

export function calculateSummary(results: EvaluationResult[]) {
  return {
    matches: results.filter((item) => item.result === "match").length,
    no_matches: results.filter((item) => item.result === "no_match").length,
    uncertain: results.filter((item) => item.result === "uncertain").length,
    total: results.length,
  };
}
