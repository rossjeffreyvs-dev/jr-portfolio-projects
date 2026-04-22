import type { Evaluation, Patient } from "@/lib/api";
import { formatLabs, joinList } from "./dashboardUtils";

type PatientSummaryCardProps = {
  selectedPatient?: Patient;
  selectedEvaluation?: Evaluation;
};

export default function PatientSummaryCard({
  selectedPatient,
  selectedEvaluation,
}: PatientSummaryCardProps) {
  return (
    <article className="card col-6">
      <span className="section-label">E. Supporting Context</span>
      <h2>Patient Summary</h2>

      <div className="meta-list">
        <div className="meta-item">
          <strong>Age / Sex</strong>
          {selectedPatient
            ? `${selectedPatient.age} / ${selectedPatient.sex}`
            : "—"}
        </div>
        <div className="meta-item">
          <strong>Diagnosis</strong>
          {selectedPatient ? joinList(selectedPatient.diagnosis) : "—"}
        </div>
        <div className="meta-item">
          <strong>Biomarkers</strong>
          {selectedPatient ? joinList(selectedPatient.biomarkers) : "—"}
        </div>
        <div className="meta-item">
          <strong>ECOG</strong>
          {selectedPatient?.ecog || "—"}
        </div>
        <div className="meta-item">
          <strong>Prior Therapies</strong>
          {selectedPatient ? joinList(selectedPatient.prior_therapies) : "—"}
        </div>
        <div className="meta-item">
          <strong>Labs</strong>
          {selectedPatient ? formatLabs(selectedPatient.labs) : "—"}
        </div>
        <div className="meta-item">
          <strong>Comorbidities</strong>
          {selectedPatient ? joinList(selectedPatient.comorbidities) : "—"}
        </div>
        <div className="meta-item">
          <strong>Missing Data</strong>
          {selectedEvaluation?.missing_information.length
            ? joinList(selectedEvaluation.missing_information)
            : "None"}
        </div>
        <div className="meta-item">
          <strong>Notes</strong>
          {selectedPatient?.notes?.length
            ? selectedPatient.notes.join(" ")
            : "None"}
        </div>
      </div>
    </article>
  );
}
