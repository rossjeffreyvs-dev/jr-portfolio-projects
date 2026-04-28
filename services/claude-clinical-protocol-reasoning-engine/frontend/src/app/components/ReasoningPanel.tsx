import type { Patient, TraceEvent, Trial } from "../types";

type ReasoningPanelProps = {
  selectedTrial: Trial | null;
  selectedPatient: Patient | null;
  traceEvents: TraceEvent[];
  isEvaluating: boolean;
  onEvaluate: () => void;
};

export default function ReasoningPanel({
  selectedTrial,
  selectedPatient,
  traceEvents,
  isEvaluating,
  onEvaluate,
}: ReasoningPanelProps) {
  return (
    <div className="panel">
      <p className="eyebrow">Step 3</p>
      <h2>Run Reasoning</h2>

      <div className="selection-summary">
        <p>
          <strong>Trial:</strong>{" "}
          {selectedTrial ? selectedTrial.title : "None selected"}
        </p>
        <p>
          <strong>Patient:</strong>{" "}
          {selectedPatient
            ? `${selectedPatient.id} · ${selectedPatient.name}`
            : "None selected"}
        </p>
      </div>

      <button
        className="primary-action"
        onClick={onEvaluate}
        disabled={!selectedTrial || !selectedPatient || isEvaluating}
      >
        {isEvaluating ? "Reasoning…" : "Evaluate Eligibility"}
      </button>

      <div className="reasoning-trace">
        {traceEvents.map((step, index) => (
          <div
            className={step.complete ? "trace-row complete" : "trace-row"}
            key={`${step.label}-${index}`}
          >
            <div className="trace-index">{index + 1}</div>
            <div>
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
