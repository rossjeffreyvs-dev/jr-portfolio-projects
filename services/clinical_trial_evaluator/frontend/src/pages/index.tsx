import React from "react";
import PatientTable from "../components/PatientTable";

const HomePage: React.FC = () => (
  <main className="flex flex-col items-center pt-24 px-8">
    <h1 className="text-3xl font-bold mb-4">Clinical Trial Recruitment Hub</h1>

    <div className="flex justify-end mb-4">
      <Button variant="secondary" onClick={() => navigate("/add")}>
        Add new Patient
      </Button>
    </div>

    <PatientTable />
  </main>
);

export default HomePage;
