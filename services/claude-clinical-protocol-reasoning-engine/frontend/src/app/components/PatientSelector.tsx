import type { Patient } from "../types";

type PatientSelectorProps = {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  onSelect: (patient: Patient) => void;
};

export default function PatientSelector({
  patients,
  selectedPatient,
  isLoading,
  onSelect,
}: PatientSelectorProps) {
  return (
    <div className="panel">
      <p className="eyebrow">Step 2</p>
      <h2>Select Patient</h2>
      {isLoading && <p>Loading patients…</p>}

      {patients.map((patient) => (
        <article
          className={
            selectedPatient?.id === patient.id
              ? "list-card active"
              : "list-card"
          }
          key={patient.id}
          onClick={() => onSelect(patient)}
        >
          <strong>
            {patient.id} · {patient.name}
          </strong>
          <span>
            {patient.age} · {patient.sex} · ECOG {patient.ecog}
          </span>
          <p>{patient.diagnoses.join(", ")}</p>
        </article>
      ))}
    </div>
  );
}
