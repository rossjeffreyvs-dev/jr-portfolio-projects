import type { CriterionResult, Evaluation } from "@/lib/api";
import { titleCaseStatus } from "./dashboardUtils";

type CriteriaMatchTableProps = {
  selectedEvaluation?: Evaluation;
};

export default function CriteriaMatchTable({
  selectedEvaluation,
}: CriteriaMatchTableProps) {
  return (
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
          {(selectedEvaluation?.criterion_results || []).map(
            (row: CriterionResult, index: number) => (
              <tr
                key={`${selectedEvaluation?.id ?? "evaluation"}-${row.criterion_id}-${index}`}
              >
                <td>{row.criterion_text}</td>
                <td>{row.criterion_type}</td>
                <td>{titleCaseStatus(row.status)}</td>
                <td>{row.evidence}</td>
                <td>{row.confidence}</td>
                <td>{row.action_needed || "None"}</td>
              </tr>
            ),
          )}

          {!selectedEvaluation?.criterion_results?.length ? (
            <tr>
              <td colSpan={6}>No criterion results available.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
