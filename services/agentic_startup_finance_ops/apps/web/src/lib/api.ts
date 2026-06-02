const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8030";

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getMetrics() {
  return apiRequest("/metrics");
}

export function getScenarios() {
  return apiRequest("/scenarios");
}

export function askQuestion(question: string) {
  return apiRequest("/questions/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}