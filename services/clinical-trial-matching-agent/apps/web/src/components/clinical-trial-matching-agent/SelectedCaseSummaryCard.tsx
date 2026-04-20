import type { Evaluation, Patient, Trial } from "@/lib/api";
import { joinList } from "./dashboardUtils";

type SelectedCaseSummaryCardProps = {
  selectedEvaluation?: Evaluation;
  selectedPatient?: Patient;
  activeTrial?: Trial;
};

export default function SelectedCaseSummaryCard({
  selectedEvaluation,
  selectedPatient,
  activeTrial,
}: SelectedCaseSummaryCardProps) {
  return (
    <article className="card col-8">
      <span className="section-label">C. Selected Evaluation</span>
      <h2>Selected Case Summary</h2>

      <div className="meta-list">
        <div className="meta-item">
          <strong>Patient</strong>
          {selectedPatient?.display_name ||
            selectedEvaluation?.patient_id ||
            "—"}
        </div>
        <div className="meta-item">
          <strong>Diagnosis</strong>
          {selectedPatient?.diagnosis?.[0] || "—"}
        </div>
        <div className="meta-item">
          <strong>Trial</strong>
          {activeTrial?.title || "—"}
        </div>
        <div className="meta-item">
          <strong>Submitted</strong>
          {selectedEvaluation?.submitted_at
            ? new Date(selectedEvaluation.submitted_at).toLocaleString()
            : "—"}
        </div>
        <div className="meta-item">
          <strong>Missing Information</strong>
          {selectedEvaluation?.missing_information?.length
            ? joinList(selectedEvaluation.missing_information)
            : "None"}
        </div>
        <div className="meta-item">
          <strong>Blockers</strong>
          {selectedEvaluation?.blockers?.length
            ? joinList(selectedEvaluation.blockers)
            : "None"}
        </div>
      </div>

      <p className="panel-copy">
        {selectedEvaluation?.explanation ||
          "No evaluation explanation available."}
      </p>
    </article>
  );
}