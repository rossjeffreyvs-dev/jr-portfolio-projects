export type ActiveTab = "description" | "demo" | "playbook";

export type SearchStage =
  | "idle"
  | "embedding"
  | "scoring"
  | "ranking"
  | "done"
  | "error";

export type PatientSearchResult = {
  patient_id: string;
  name: string;
  age: number;
  sex: string;
  city: string;
  diagnoses: string[];
  medications: string[];
  labs: Record<string, string | number>;
  clinical_summary: string;
  similarity_score: number;
  match_explanation: string;
};
