import type {
  AccountsResponse,
  ActionResponse,
  AgentRun,
  CustomerLifecycleSummary,
  IngestProspectResponse,
  LifecycleResponse,
} from "@/app/types";

const API_BASE =
  process.env.NEXT_PUBLIC_CUSTOMER_LIFECYCLE_API_BASE_URL ||
  "http://127.0.0.1:8010";

function apiPath(path: string) {
  return `${API_BASE.replace(/\/$/, "")}${path}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(apiPath(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getAccounts() {
  return request<AccountsResponse>("/accounts");
}

export function getLifecycle(accountId: string) {
  return request<LifecycleResponse>(`/accounts/${accountId}/lifecycle`);
}

export function runAgents(accountId: string) {
  return request<AgentRun>(`/accounts/${accountId}/run-agents`, {
    method: "POST",
  });
}

export function triggerIntervention(accountId: string) {
  return request<ActionResponse>(`/accounts/${accountId}/interventions`, {
    method: "POST",
  });
}

export function resetAccount(accountId: string) {
  return request<ActionResponse>(`/accounts/${accountId}/reset`, {
    method: "POST",
  });
}

export function getCustomerLifecycleSummary() {
  return request<CustomerLifecycleSummary>("/lifecycle");
}

export function ingestMockProspect() {
  return request<IngestProspectResponse>("/lifecycle/ingest", {
    method: "POST",
  });
}

export function submitReviewAction(
  reviewId: string,
  action: "approve" | "reject" | "request_data",
) {
  return request<ActionResponse>(`/lifecycle/reviews/${reviewId}/${action}`, {
    method: "POST",
  });
}
