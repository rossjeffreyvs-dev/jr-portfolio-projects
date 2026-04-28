import { useEffect, useState } from "react";
import { getDashboardData } from "./data/api";

const tabs = ["Project Description", "Demo", "PM Playbook"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Project Description");
  const [trials, setTrials] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getDashboardData().then((data) => {
      setTrials(data.trials);
      setPatients(data.patients);
    });
  }, []);

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark">JR</div>
          <span>Projects</span>
        </div>

        <nav className="top-nav">
          <a href="/">Home</a>
          <a className="active" href="/projects">
            Projects
          </a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <main className="project-shell">
        <section className="project-title">
          <h1>Claude Clinical Protocol Reasoning Engine</h1>
          <p>
            Interpret dense clinical trial protocol language, compare criteria
            against synthetic patient records, and surface explainable
            reasoning.
          </p>

          <div className="tab-row">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Project Description" && (
          <section className="card">
            <p className="eyebrow">Project Overview</p>
            <h2>AI-Assisted Clinical Protocol Reasoning Workflow</h2>
            <p>
              This project uses ClinicalTrials.gov-style trial records,
              Synthea-style synthetic patients, and Claude as a reasoning layer
              for interpreting nuanced eligibility language.
            </p>

            <div className="feature-grid">
              <div>Protocol interpretation</div>
              <div>Criterion-level reasoning</div>
              <div>Synthetic patient evaluation</div>
              <div>Human review workflow</div>
            </div>
          </section>
        )}

        {activeTab === "Demo" && (
          <section className="dashboard-grid">
            <div className="card">
              <h2>Loaded Trials</h2>
              {trials.map((trial) => (
                <div className="list-card" key={trial.id}>
                  <strong>{trial.title}</strong>
                  <span>
                    {trial.phase} · {trial.status}
                  </span>
                  <p>{trial.condition}</p>
                </div>
              ))}
            </div>

            <div className="card">
              <h2>Synthetic Patients</h2>
              {patients.map((patient) => (
                <div className="list-card" key={patient.id}>
                  <strong>{patient.id}</strong>
                  <span>
                    {patient.age} · {patient.sex} · ECOG {patient.ecog}
                  </span>
                  <p>{patient.diagnoses.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "PM Playbook" && (
          <section className="card">
            <h2>Product Strategy</h2>
            <p>
              The MVP focuses on transparent protocol reasoning rather than
              black-box matching. The product differentiator is the ability to
              show how each eligibility criterion was interpreted, evaluated,
              and escalated when uncertain.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
