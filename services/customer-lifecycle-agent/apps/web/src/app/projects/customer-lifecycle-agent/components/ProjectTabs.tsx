"use client";

import { useState } from "react";
import ProjectDescription from "./ProjectDescription";
import DemoDashboard from "./DemoDashboard";
import PMPlaybook from "./PMPlaybook";

type TabId = "description" | "demo" | "playbook";

const tabs: { id: TabId; label: string }[] = [
  { id: "description", label: "Project Description" },
  { id: "demo", label: "Demo" },
  { id: "playbook", label: "PM Playbook" },
];

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <section className="project-tabs-shell">
      <div className="project-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {activeTab === "description" && <ProjectDescription />}
        {activeTab === "demo" && <DemoDashboard />}
        {activeTab === "playbook" && <PMPlaybook />}
      </div>
    </section>
  );
}
