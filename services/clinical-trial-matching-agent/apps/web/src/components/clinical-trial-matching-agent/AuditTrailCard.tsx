"use client";

import type { Evaluation, WorkflowEvent } from "@/lib/api";

type AuditTrailCardProps = {
  selectedEvaluation?: Evaluation;
  visibleEventCount?: number;
  isEvaluationInProgress?: boolean;
};

export default function AuditTrailCard({
  selectedEvaluation,
  visibleEventCount,
  isEvaluationInProgress = false,
}: AuditTrailCardProps) {
  const events = selectedEvaluation?.workflow_events || [];
  const visibleCount =
    typeof visibleEventCount === "number" ? visibleEventCount : events.length;
  const visibleEvents = events.slice(0, visibleCount);

  return (
    <>
      {isEvaluationInProgress && visibleEvents.length === 0 ? (
        <p style={{ marginTop: 0, color: "var(--muted)", fontWeight: 600 }}>
          Recording audit events…
        </p>
      ) : null}

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
            {visibleEvents.map((event: WorkflowEvent, index: number) => (
              <tr key={`${event.stage}-${index}`}>
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
            ))}

            {!events.length ? (
              <tr>
                <td colSpan={4}>No audit events available.</td>
              </tr>
            ) : null}

            {events.length > 0 &&
            visibleEvents.length === 0 &&
            isEvaluationInProgress ? (
              <tr>
                <td colSpan={4} style={{ color: "var(--muted)" }}>
                  Awaiting audit log entries…
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
