"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Evaluation, WorkflowEvent } from "@/lib/api";

type WorkflowActivityCardProps = {
  selectedEvaluation?: Evaluation;
  startedEvaluationId?: string | null;
  animationStartDelayMs?: number;
  stepDelayMs?: number;
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
  startedEvaluationId,
  animationStartDelayMs = 800,
  stepDelayMs = 1150,
}: WorkflowActivityCardProps) {
  const events = useMemo(
    () => selectedEvaluation?.workflow_events || [],
    [selectedEvaluation],
  );

  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timersRef = useRef<number[]>([]);
  const lastAnimatedEvaluationRef = useRef<string | null>(null);

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (!selectedEvaluation) {
      setVisibleCount(0);
      setIsAnimating(false);
      lastAnimatedEvaluationRef.current = null;
      return;
    }

    const isFreshStartedEvaluation =
      startedEvaluationId === selectedEvaluation.id &&
      lastAnimatedEvaluationRef.current !== selectedEvaluation.id &&
      events.length > 0;

    if (isFreshStartedEvaluation) {
      lastAnimatedEvaluationRef.current = selectedEvaluation.id;
      setVisibleCount(0);
      setIsAnimating(true);

      events.forEach((_, index) => {
        const timer = window.setTimeout(
          () => {
            setVisibleCount(index + 1);

            if (index === events.length - 1) {
              setIsAnimating(false);
            }
          },
          animationStartDelayMs + index * stepDelayMs,
        );

        timersRef.current.push(timer);
      });

      return () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
      };
    }

    setIsAnimating(false);
    setVisibleCount(events.length);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [
    animationStartDelayMs,
    events,
    selectedEvaluation,
    startedEvaluationId,
    stepDelayMs,
  ]);

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

  return (
    <>
      {isAnimating && visibleEvents.length === 0 ? (
        <div
          className="workflow-detail"
          style={{ marginBottom: 12, fontWeight: 600 }}
        >
          Initializing eligibility evaluation…
        </div>
      ) : null}

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
