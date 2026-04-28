"use client";

import { useEffect, useRef, useState } from "react";
import type { Evaluation, Patient, TraceEvent, Trial } from "../types";
import EvaluationResults from "./EvaluationResults";
import PatientSelector from "./PatientSelector";
import ReasoningPanel from "./ReasoningPanel";
import TrialSelector from "./TrialSelector";

const TYPE_SPEED_MS = 42;
const STEP_HOLD_MS = 1800;
const COMPLETE_HOLD_MS = 1200;
const FINAL_SCROLL_DURATION_MS = 1800;

type WorkflowState = "idle" | "streaming" | "complete";

type DemoDashboardProps = {
  trials: Trial[];
  patients: Patient[];
  selectedTrial: Trial | null;
  selectedPatient: Patient | null;
  evaluation: Evaluation | null;
  traceEvents: TraceEvent[];
  isLoading: boolean;
  isEvaluating: boolean;
  onSelectTrial: (trial: Trial) => void;
  onSelectPatient: (patient: Patient) => void;
  onEvaluate: () => void;
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function slowScrollTo(targetY: number, duration = FINAL_SCROLL_DURATION_MS) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

export default function DemoDashboard({
  trials,
  patients,
  selectedTrial,
  selectedPatient,
  evaluation,
  traceEvents,
  isLoading,
  isEvaluating,
  onSelectTrial,
  onSelectPatient,
  onEvaluate,
}: DemoDashboardProps) {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const runIdRef = useRef(0);
  const requestedEvaluationRef = useRef(false);
  const lastProcessedTraceCountRef = useRef(0);

  const [workflowState, setWorkflowState] = useState<WorkflowState>("idle");
  const [workflowTitle, setWorkflowTitle] = useState("Ready to evaluate");
  const [workflowDetail, setWorkflowDetail] = useState(
    "Select a clinical protocol and synthetic patient, then run the reasoning layer to evaluate eligibility with transparent evidence.",
  );

  const typeText = async (text: string, runId: number) => {
    setWorkflowDetail("");

    for (let index = 1; index <= text.length; index += 1) {
      if (runIdRef.current !== runId) return false;

      setWorkflowDetail(text.slice(0, index));
      await sleep(TYPE_SPEED_MS);
    }

    return true;
  };

  const runTraceSequence = async (
    events: TraceEvent[],
    runId: number,
    includeCompletion: boolean,
  ) => {
    setWorkflowState("streaming");

    for (const event of events) {
      if (runIdRef.current !== runId) return;

      setWorkflowTitle(event.label);

      const completedTyping = await typeText(event.detail, runId);
      if (!completedTyping || runIdRef.current !== runId) return;

      await sleep(STEP_HOLD_MS);
    }

    if (!includeCompletion || runIdRef.current !== runId) return;

    setWorkflowState("complete");
    setWorkflowTitle("Recommendation generated");

    const completedTyping = await typeText(
      "Reasoning complete. Review the recommendation summary below.",
      runId,
    );

    if (!completedTyping || runIdRef.current !== runId) return;

    await sleep(COMPLETE_HOLD_MS);

    if (resultsRef.current) {
      const targetY =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 28;

      slowScrollTo(targetY);
    }

    requestedEvaluationRef.current = false;
  };

  const handleEvaluate = () => {
    requestedEvaluationRef.current = true;
    lastProcessedTraceCountRef.current = 0;
    runIdRef.current += 1;

    setWorkflowState("streaming");
    setWorkflowTitle("Starting reasoning workflow");
    setWorkflowDetail("Preparing eligibility criteria and patient evidence.");

    onEvaluate();
  };

  useEffect(() => {
    if (!requestedEvaluationRef.current || isEvaluating) return;
    if (!evaluation) return;

    const runId = runIdRef.current;
    const newEvents = traceEvents.slice(lastProcessedTraceCountRef.current);

    lastProcessedTraceCountRef.current = traceEvents.length;

    const fallbackEvents: TraceEvent[] = [
      {
        label: "Protocol loaded",
        detail: "Clinical protocol criteria were loaded for reasoning.",
        complete: true,
      },
      {
        label: "Patient evidence reviewed",
        detail:
          "Structured patient evidence was reviewed against eligibility criteria.",
        complete: true,
      },
      {
        label: "Criteria evaluated",
        detail: "Inclusion and exclusion criteria were evaluated.",
        complete: true,
      },
      {
        label: "Recommendation generated",
        detail: "Final eligibility recommendation was generated.",
        complete: true,
      },
    ];

    const eventsToReplay =
      newEvents.length > 0
        ? newEvents
        : traceEvents.length > 0
          ? traceEvents
          : fallbackEvents;

    void runTraceSequence(eventsToReplay, runId, true);
  }, [evaluation, isEvaluating, traceEvents]);

  return (
    <div className="dashboard-stack clinical-dashboard-stack">
      <section className={`clinical-workflow-banner ${workflowState}`}>
        <div className="workflow-copy-block">
          <p className="section-label">Protocol Reasoning Workflow</p>
          <h2>{workflowTitle}</h2>
          <p className="workflow-type-line">{workflowDetail}</p>
        </div>
      </section>

      <div className="demo-layout clinical-demo-layout">
        <TrialSelector
          trials={trials}
          selectedTrial={selectedTrial}
          isLoading={isLoading}
          onSelect={onSelectTrial}
        />

        <PatientSelector
          patients={patients}
          selectedPatient={selectedPatient}
          isLoading={isLoading}
          onSelect={onSelectPatient}
        />

        <ReasoningPanel
          selectedTrial={selectedTrial}
          selectedPatient={selectedPatient}
          traceEvents={traceEvents}
          isEvaluating={isEvaluating}
          onEvaluate={handleEvaluate}
        />
      </div>

      <div ref={resultsRef} id="recommendation-summary">
        <EvaluationResults evaluation={evaluation} />
      </div>
    </div>
  );
}
