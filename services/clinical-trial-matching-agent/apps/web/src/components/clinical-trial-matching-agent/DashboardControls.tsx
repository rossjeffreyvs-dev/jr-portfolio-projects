"use client";

type DashboardControlsProps = {
  error?: string | null;
  isLoadingTrialPatients: boolean;
  isChangingTrial: boolean;
  hasSelectedEvaluation: boolean;
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
};

export default function DashboardControls({
  error,
  isLoadingTrialPatients,
  isChangingTrial,
  hasSelectedEvaluation,
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
}: DashboardControlsProps) {
  return (
    <section className="card">
      <span className="section-label">Simulation Controls</span>

      <h2 style={{ marginTop: 16, marginBottom: 12 }}>
        Kick off new evaluations or switch context
      </h2>

      <p style={{ marginTop: 0 }}>
        Use the controls below to open the candidate list, create a new
        evaluation, switch the active trial, or replay the selected case.
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 24,
        }}
      >
        <button
          type="button"
          className="secondary-button"
          onClick={onOpenPatientModal}
          disabled={isLoadingTrialPatients}
        >
          {isLoadingTrialPatients
            ? "Loading Patients..."
            : "Find Patients for Trial"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onChangeTrial}
          disabled={isChangingTrial}
        >
          {isChangingTrial ? "Changing Trial..." : "Change Trial"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onReplayWorkflow}
          disabled={!hasSelectedEvaluation}
        >
          Replay Evaluation
        </button>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 18,
            color: "#b42318",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}
