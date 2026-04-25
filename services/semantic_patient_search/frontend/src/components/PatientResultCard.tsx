import type { PatientSearchResult } from "../types";

type PatientResultCardProps = {
  result: PatientSearchResult;
};

export default function PatientResultCard({ result }: PatientResultCardProps) {
  const labs = Object.entries(result.labs);

  return (
    <article className="resultCard">
      <div className="resultTopRow">
        <div>
          <h4>{result.name}</h4>
          <p className="resultMeta">
            {result.patient_id} · {result.age} · {result.sex} · {result.city}
          </p>
        </div>

        <div className="scoreBadge">Score {result.similarity_score}</div>
      </div>

      <div className="resultGrid">
        <div>
          <p className="fieldLabel">Diagnoses</p>
          <p>{result.diagnoses.join(", ")}</p>
        </div>
        <div>
          <p className="fieldLabel">Medications</p>
          <p>{result.medications.join(", ")}</p>
        </div>
      </div>

      <div className="resultBodyBlock">
        <p className="fieldLabel">Clinical summary</p>
        <p>{result.clinical_summary}</p>
      </div>

      <div className="resultBodyBlock">
        <p className="fieldLabel">Labs</p>
        <p>
          {labs.length
            ? labs.map(([key, value]) => `${key}: ${value}`).join(", ")
            : "No significant labs in sample profile"}
        </p>
      </div>

      <div className="matchExplanation">{result.match_explanation}</div>
    </article>
  );
}
