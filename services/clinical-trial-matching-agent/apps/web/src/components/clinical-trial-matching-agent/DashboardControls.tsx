type DashboardControlsProps = {
  activeTrialTitle?: string;
  selectedPatientLabel?: string;
  latestRecommendation?: string;
  isLoadingTrialPatients: boolean;
  isChangingTrial: boolean;
  hasSelectedEvaluation: boolean;
  error?: string | null;
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
};

export default function DashboardControls({
  activeTrialTitle,
  selectedPatientLabel,
  latestRecommendation,
  isLoadingTrialPatients,
  isChangingTrial,
  hasSelectedEvaluation,
  error,
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
}: DashboardControlsProps) {
  return (
    <section className="control-panel cardish">
      <div className="control-panel-header">
        <div>
          <div className="eyebrow">Simulation Controls</div>
          <h2>Kick off new evaluations or switch context</h2>
          <p>
            Use the controls below to open the candidate list, create a new
            evaluation, switch the active trial, or replay the selected case.
          </p>
        </div>
      </div>

      <div className="control-actions">
        <button
          className="primary-btn"
          onClick={onOpenPatientModal}
          disabled={isLoadingTrialPatients}
        >
          {isLoadingTrialPatients
            ? "Loading Patients…"
            : "Find Patients for Trial"}
        </button>

        <button
          className="secondary-btn"
          onClick={onChangeTrial}
          disabled={isChangingTrial}
        >
          {isChangingTrial ? "Changing Trial…" : "Change Trial"}
        </button>

        <button
          className="secondary-btn"
          onClick={onReplayWorkflow}
          disabled={!hasSelectedEvaluation}
        >
          Replay Evaluation
        </button>
      </div>

      <div className="control-status-row">
        <div className="control-status-card">
          <span className="eyebrow">Current Trial</span>
          <strong>{activeTrialTitle || "No trial selected"}</strong>
        </div>

        <div className="control-status-card">
          <span className="eyebrow">Current Patient</span>
          <strong>{selectedPatientLabel || "No patient selected"}</strong>
        </div>

        <div className="control-status-card">
          <span className="eyebrow">Latest Recommendation</span>
          <strong>{latestRecommendation || "No evaluation loaded"}</strong>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
