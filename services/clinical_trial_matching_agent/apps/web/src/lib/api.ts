const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getTrials() {
  return request("/trials");
}

export function getPatients() {
  return request("/patients");
}

export function getPatientsForTrial(trialId: string) {
  return request(`/trials/${trialId}/patients`);
}

export function getEvaluations(trialId?: string) {
  const query = trialId ? `?trial_id=${trialId}` : "";
  return request(`/evaluations${query}`);
}

export function getReviews() {
  return request("/reviews");
}

export function activateTrial(trialId: string) {
  return request(`/trials/${trialId}/activate`, {
    method: "POST",
  });
}

export function startEvaluation(
  patientId: string,
  trialId: string,
) {
  return request("/evaluations/start", {
    method: "POST",
    body: JSON.stringify({
      patient_id: patientId,
      trial_id: trialId,
    }),
  });
}

export function getSemanticQuerySuggestions(trialId: string) {
  return request(
    `/patients/semantic-search/suggestions?trial_id=${trialId}`,
  );
}

export function semanticSearchPatients(payload: {
  trial_id: string;
  query: string;
  top_k?: number;
}) {
  return request("/patients/semantic-search", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetDemoData() {
  return request("/evaluations/reset", {
    method: "POST",
  });
}

export function removeEvaluation(evaluationId: string) {
  return request(`/evaluations/${evaluationId}`, {
    method: "DELETE",
  });
}