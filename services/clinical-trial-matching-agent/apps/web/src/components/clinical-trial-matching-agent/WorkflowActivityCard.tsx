"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Evaluation, WorkflowEvent } from "@/lib/api";

type WorkflowActivityCardProps = {
  selectedEvaluation?: Evaluation;
  startedEvaluationId?: string | null;
};

const INITIAL_DELAY_MS = 500;
const STEP_DELAY_MS = 850;

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
  startedEvaluationId,
}: WorkflowActivityCardProps) {
  const events = useMemo(
    () => selectedEvaluation?.workflow_events || [],
    [selectedEvaluation],
  );

  const [visibleCount, setVisibleCount] = useState(events.length);
  const timersRef = useRef<number[]>([]);
  const lastAnimatedEvaluationRef = useRef<string | null>(null);

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (!selectedEvaluation) {
      setVisibleCount(0);
      lastAnimatedEvaluationRef.current = null;
      return;
    }

    const shouldAnimate =
      startedEvaluationId === selectedEvaluation.id &&
      lastAnimatedEvaluationRef.current !== selectedEvaluation.id &&
      events.length > 0;

    if (!shouldAnimate) {
      setVisibleCount(events.length);
      return;
    }

    lastAnimatedEvaluationRef.current = selectedEvaluation.id;
    setVisibleCount(0);

    events.forEach((_, index) => {
      const timer = window.setTimeout(
        () => {
          setVisibleCount(index + 1);
        },
        INITIAL_DELAY_MS + index * STEP_DELAY_MS,
      );

      timersRef.current.push(timer);
    });

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [events, selectedEvaluation, startedEvaluationId]);

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

  const visibleEvents = events.slice(0, visibleCount);
  const isAnimating =
    startedEvaluationId === selectedEvaluation.id &&
    visibleCount < events.length;

  return (
    <>
      <div className="workflow-list">
        {visibleEvents.map((item: WorkflowEvent, index: number) => {
          const timestamp = formatTimestamp(item.timestamp);

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

      {isAnimating ? (
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
