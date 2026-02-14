import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import { Patient } from "../types";
import { fetchPatients } from "../api";

const ReviewPatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [override, setOverride] = useState<string>("");

  useEffect(() => {
    fetchPatients().then((data) => {
      const p = data[Number(id)];
      setPatient(p);
    });
  }, [id]);

  if (!patient)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading patient...</p>
      </div>
    );

  const handleOverride = () => {
    alert(`Override saved: ${override || "No change"}`);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Review Patient Eligibility
        </h2>

        <div className="space-y-3 mb-6">
          <div>
            <h3 className="text-gray-700 font-semibold">Patient</h3>
            <p>
              {patient.name}, {patient.gender}, {patient.age}
            </p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">Diagnosis</h3>
            <p>{patient.diagnosis}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">AI Decision</h3>
            <p
              className={
                patient.eligibility_decision === "Suitable"
                  ? "text-green-600 font-semibold"
                  : patient.eligibility_decision === "Not suitable"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {patient.eligibility_decision}
            </p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold">AI Reasoning</h3>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md border">
              {patient.eligibility_reasoning}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Override Decision
          </label>
          <select
            value={override}
            onChange={(e) => setOverride(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">No change</option>
            <option value="Suitable">Suitable</option>
            <option value="Not suitable">Not suitable</option>
            <option value="Manual review required">
              Manual review required
            </option>
          </select>
        </div>

        <div className="flex justify-center space-x-3 pt-6">
          <Button variant="primary" onClick={handleOverride}>
            Save Review
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPatientForm;
