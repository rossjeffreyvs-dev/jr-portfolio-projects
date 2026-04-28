const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getDashboardData() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("Unable to load dashboard data");
  }

  return response.json();
}
