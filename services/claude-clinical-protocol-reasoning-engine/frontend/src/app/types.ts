export type TrialCriterion = {
  id: string;
  type: string;
  category: string;
  text: string;
};

export type Trial = {
  id: string;
  title: string;
  condition: string;
  phase: string;
  status: string;
  criteria?: TrialCriterion[];
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: string;
  ecog: number;
  diagnoses: string[];
};

export type EvaluationResult = {
  criterion_id?: string;
  criterion: string;
  type?: string;
  category?: string;
  result: "match" | "no_match" | "uncertain" | string;
  confidence: number;
  rationale?: string;
  evidence?: string[];
};

export type Evaluation = {
  trial_id: string;
  patient_id: string;
  recommendation: "potential_match" | "needs_review" | "not_eligible" | string;
  decision_rationale?: string;
  summary: {
    matches: number;
    no_matches: number;
    uncertain: number;
    total: number;
  };
  results: EvaluationResult[];
};

export type DashboardData = {
  trials: Trial[];
  patients: Patient[];
};

export type TraceEvent = {
  label: string;
  detail: string;
  complete: boolean;
};

export type StreamEvent =
  | {
      event: "started";
      message: string;
      trial_id: string;
      patient_id: string;
    }
  | {
      event: "trace";
      label: string;
      detail: string;
    }
  | {
      event: "criterion";
      data: EvaluationResult;
    }
  | {
      event: "complete";
      data: Omit<Evaluation, "results">;
    };

export const tabs = ["Project Description", "Demo", "PM Playbook"] as const;

export type Tab = (typeof tabs)[number];
