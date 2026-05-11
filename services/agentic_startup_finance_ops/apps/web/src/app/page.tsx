"use client";

import { useState } from "react";
import DemoDashboard from "@/components/DemoDashboard";
import PMPlaybook from "@/components/PMPlaybook";
import ProjectDescription from "@/components/ProjectDescription";
import ProjectHero from "@/components/ProjectHero";
import SiteHeader from "@/components/SiteHeader";
import ProjectFooter from "@/components/ProjectFooter";

const tabs = ["Project Description", "Demo", "PM Playbook"] as const;
type Tab = (typeof tabs)[number];

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("Project Description");

  return (
    <main>
      <SiteHeader />
      <ProjectHero />

      <div className="tabs" role="tablist" aria-label="Project tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="page-shell">
        {activeTab === "Project Description" && <ProjectDescription />}
        {activeTab === "Demo" && <DemoDashboard />}
        {activeTab === "PM Playbook" && <PMPlaybook />}
      </section>

      <ProjectFooter />
    </main>
  );
}
