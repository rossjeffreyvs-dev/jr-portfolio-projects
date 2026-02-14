import React, { useEffect, useState } from "react";
import { fetchPatients } from "../api";
import { Patient } from "../types";

const PatientTable: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Patients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="table-header">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Diagnosis</th>
              <th className="px-4 py-2">Eligibility</th>
              <th className="px-4 py-2">Reason</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.gender}</td>
                <td className="px-4 py-2">{p.age}</td>
                <td className="px-4 py-2">{p.diagnosis}</td>
                <td
                  className={`font-bold ${
                    p.eligibility_decision === "Suitable"
                      ? "badge-suitable"
                      : p.eligibility_decision === "Not suitable"
                      ? "badge-not-suitable"
                      : "badge-manual"
                  }`}
                >
                  {p.eligibility_decision}
                </td>
                <td className="px-4 py-2">{p.eligibility_reasoning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
