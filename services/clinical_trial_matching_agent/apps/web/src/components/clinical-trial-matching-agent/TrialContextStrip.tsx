import type { Evaluation, Patient, Trial } from "@/lib/api";

type TrialContextStripProps = {
  activeTrial?: Trial;
  selectedPatient?: Patient;
  selectedEvaluation?: Evaluation;
};

export default function TrialContextStrip({
  activeTrial,
  selectedPatient,
  selectedEvaluation,
}: TrialContextStripProps) {
  return (
    <section className="card">
      <span className="section-label">A. Trial Context Strip</span>

      <div className="control-status-row">
        <div className="control-status-card">
          <span className="eyebrow">Active Trial</span>
          <strong>{activeTrial?.title || "No trial selected"}</strong>
          <p className="panel-copy">
            {activeTrial?.phase
              ? `${activeTrial.phase} • ${activeTrial.disease_area}`
              : activeTrial?.disease_area || "No disease area available"}
          </p>
        </div>

        <div className="control-status-card">
          <span className="eyebrow">Selected Patient</span>
          <strong>
            {selectedPatient?.display_name ||
              selectedPatient?.id ||
              "No patient selected"}
          </strong>
          <p className="panel-copy">
            {selectedPatient?.diagnosis?.[0] || "No diagnosis available"}
          </p>
        </div>

        <div className="control-status-card">
          <span className="eyebrow">Latest Recommendation</span>
          <strong>
            {selectedEvaluation?.recommendation || "No evaluation loaded"}
          </strong>
          <p className="panel-copy">
            {selectedEvaluation
              ? `Match score ${selectedEvaluation.match_score}%`
              : "No score available"}
          </p>
        </div>
      </div>
    </section>
  );
}
