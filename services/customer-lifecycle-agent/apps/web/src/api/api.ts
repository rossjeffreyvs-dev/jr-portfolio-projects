const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export type LifecycleSummary = {
  trial_profile: {
    title: string;
    buyer: string;
    user: string;
    value_per_converted_patient: number;
    requested_patient_profile: {
      diagnosis: string;
      key_inclusion: string[];
      performance: string[];
      exclusions: string[];
    };
  };
  funnel: {
    prospects: number;
    qualified: number;
    evaluated: number;
    in_review: number;
    converted: number;
    potential_value: number;
    realized_value: number;
    leakage_value: number;
  };
  review_queue: {
    review_id: string;
    evaluation_id: string;
    patient_id: string;
    priority: string;
    reason: string[];
    estimated_value: number;
  }[];
  agent_insight: {
    severity: string;
    reason: string;
    recommendation: string;
    estimated_gain: number;
  };
};

export async function getLifecycleSummary(): Promise<LifecycleSummary> {
  return apiFetch<LifecycleSummary>("/lifecycle");
}

export async function ingestMockPatient() {
  return apiFetch("/lifecycle/ingest", {
    method: "POST",
  });
}
