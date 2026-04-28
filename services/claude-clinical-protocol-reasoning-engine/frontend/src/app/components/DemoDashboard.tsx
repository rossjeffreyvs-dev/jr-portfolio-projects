import type { Evaluation, Patient, TraceEvent, Trial } from "../types";
import TrialSelector from "./TrialSelector";
import PatientSelector from "./PatientSelector";
import ReasoningPanel from "./ReasoningPanel";
import EvaluationResults from "./EvaluationResults";

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
  return (
    <section className="demo-stack">
      <div className="demo-layout">
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
          onEvaluate={onEvaluate}
        />
      </div>

      <EvaluationResults evaluation={evaluation} />
    </section>
  );
}
