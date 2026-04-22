"use client";

type DashboardControlsProps = {
  error?: string | null;
  isLoadingTrialPatients: boolean;
  isChangingTrial: boolean;
  isResettingDemo: boolean;
  hasSelectedEvaluation: boolean;
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
  onResetDemo: () => void;
};

export default function DashboardControls({
  error,
  isLoadingTrialPatients,
  isChangingTrial,
  isResettingDemo,
  hasSelectedEvaluation,
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
  onResetDemo,
}: DashboardControlsProps) {
  return (
    <section className="card control-panel">
      <div className="control-panel-header">
        <span className="section-label">Simulation Controls</span>
        <h2>Kick off new evaluations or switch context</h2>
        <p>
          Use the controls below to open the candidate list, create a new
          evaluation, switch the active trial, replay the selected case, or
          reset the seeded demo data.
        </p>
      </div>

      <div className="control-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={isLoadingTrialPatients || isResettingDemo}
          onClick={onOpenPatientModal}
        >
          {isLoadingTrialPatients
            ? "Loading Patients..."
            : "Find Patients for Trial"}
        </button>

        <button
          type="button"
          className="secondary-button"
          disabled={isChangingTrial || isResettingDemo}
          onClick={onChangeTrial}
        >
          {isChangingTrial ? "Changing Trial..." : "Change Trial"}
        </button>

        <button
          type="button"
          className="secondary-button"
          disabled={!hasSelectedEvaluation || isResettingDemo}
          onClick={onReplayWorkflow}
        >
          Replay Evaluation
        </button>

        <button
          type="button"
          className="secondary-button"
          disabled={isResettingDemo}
          onClick={onResetDemo}
        >
          {isResettingDemo ? "Resetting Demo..." : "Reset Demo Data"}
        </button>
      </div>

      {error ? <div className="error-text">{error}</div> : null}
    </section>
  );
}
