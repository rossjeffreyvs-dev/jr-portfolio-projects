const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchPatients = async () => {
  const res = await fetch(`${API_URL}/patients`);
  return res.json();
};

export const addPatient = async (data: any) => {
  const res = await fetch(`${API_URL}/add-patient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
