import type { Evaluation, WorkflowEvent } from "@/lib/api";

type AuditTrailCardProps = {
  selectedEvaluation?: Evaluation;
};

export default function AuditTrailCard({
  selectedEvaluation,
}: AuditTrailCardProps) {
  return (
    <article className="card col-6">
      <span className="section-label">D. Evaluation Process</span>
      <h2>Audit Trail</h2>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Stage</th>
              <th>Event</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {(selectedEvaluation?.workflow_events || []).map(
              (event: WorkflowEvent, index: number) => (
                <tr
                  key={`${selectedEvaluation?.id}-${event.stage}-audit-${index}`}
                >
                  <td>
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td>{event.label}</td>
                  <td>{event.detail}</td>
                  <td>{selectedEvaluation?.recommendation || "—"}</td>
                </tr>
              ),
            )}

            {!selectedEvaluation?.workflow_events?.length ? (
              <tr>
                <td colSpan={4}>No audit events available.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </article>
  );
}
