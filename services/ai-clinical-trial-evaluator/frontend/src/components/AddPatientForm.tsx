import React, { useState } from "react";
import { addPatient } from "../api";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const AddPatientForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    diagnosis: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addPatient({
      name: form.name,
      gender: form.gender,
      age: parseInt(form.age),
      diagnosis: form.diagnosis,
    });
    setMessage(res.status);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Add New Patient
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select...</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Save Patient"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </div>
        </form>

        {message && (
          <p className="text-center text-green-600 mt-4 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddPatientForm;
