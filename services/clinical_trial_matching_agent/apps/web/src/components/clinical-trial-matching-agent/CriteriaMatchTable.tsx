"use client";

import type { CriterionResult, Evaluation } from "@/lib/api";
import { titleCaseStatus } from "./dashboardUtils";

type CriteriaMatchTableProps = {
  selectedEvaluation?: Evaluation;
  visibleRowCount?: number;
  isEvaluationInProgress?: boolean;
};

export default function CriteriaMatchTable({
  selectedEvaluation,
  visibleRowCount,
  isEvaluationInProgress = false,
}: CriteriaMatchTableProps) {
  const rows = selectedEvaluation?.criterion_results || [];
  const visibleCount =
    typeof visibleRowCount === "number" ? visibleRowCount : rows.length;
  const visibleRows = rows.slice(0, visibleCount);

  return (
    <>
      {isEvaluationInProgress && visibleRows.length === 0 ? (
        <p style={{ marginTop: 0, color: "var(--muted)", fontWeight: 600 }}>
          Building criterion-level evidence…
        </p>
      ) : null}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Type</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Confidence</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row: CriterionResult, index: number) => (
              <tr key={`${row.criterion_text}-${index}`}>
                <td>{row.criterion_text}</td>
                <td>{row.criterion_type}</td>
                <td>{titleCaseStatus(row.status)}</td>
                <td>{row.evidence}</td>
                <td>{row.confidence}</td>
                <td>{row.action_needed || "None"}</td>
              </tr>
            ))}

            {!rows.length ? (
              <tr>
                <td colSpan={6}>No criterion results available.</td>
              </tr>
            ) : null}

            {rows.length > 0 &&
            visibleRows.length === 0 &&
            isEvaluationInProgress ? (
              <tr>
                <td colSpan={6} style={{ color: "var(--muted)" }}>
                  Awaiting criterion evaluation results…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
