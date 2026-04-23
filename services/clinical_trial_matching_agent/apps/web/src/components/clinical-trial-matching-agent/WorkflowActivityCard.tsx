"use client";

import { useMemo } from "react";
import type { Evaluation, WorkflowEvent } from "@/lib/api";

type WorkflowActivityCardProps = {
  selectedEvaluation?: Evaluation;
  visibleEventCount?: number;
  isEvaluationInProgress?: boolean;
};

function formatTimestamp(timestamp?: string) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WorkflowActivityCard({
  selectedEvaluation,
  visibleEventCount,
  isEvaluationInProgress = false,
}: WorkflowActivityCardProps) {
  const events = useMemo(
    () => selectedEvaluation?.workflow_events || [],
    [selectedEvaluation],
  );

  if (!selectedEvaluation) {
    return (
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Select an evaluation to review workflow activity.
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p style={{ margin: 0, color: "var(--muted)" }}>
        No workflow activity is available for this evaluation yet.
      </p>
    );
  }

  const visibleCount =
    typeof visibleEventCount === "number" ? visibleEventCount : events.length;

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <>
      {isEvaluationInProgress && visibleEvents.length === 0 ? (
        <div
          className="workflow-detail"
          style={{ marginBottom: 12, fontWeight: 600 }}
        >
          Initializing eligibility evaluation…
        </div>
      ) : null}

      <div className="workflow-list">
        {visibleEvents.map((item: WorkflowEvent, index: number) => {
          const timestamp = formatTimestamp(item.timestamp ?? undefined);

          return (
            <div className="workflow-item" key={`${item.stage}-${index}`}>
              <div className="workflow-dot" />

              <div>
                <strong className="workflow-title">{item.label}</strong>

                {item.detail ? (
                  <div className="workflow-detail">{item.detail}</div>
                ) : null}

                {timestamp ? (
                  <div
                    className="workflow-detail"
                    style={{ marginTop: 4, fontSize: 12 }}
                  >
                    {timestamp}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {isEvaluationInProgress ? (
        <div
          className="workflow-detail"
          style={{ marginTop: 12, fontWeight: 600 }}
        >
          Running evaluation workflow…
        </div>
      ) : null}
    </>
  );
}
