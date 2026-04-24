import { useState } from "react";

import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import ResumeDemo from "./components/ResumeDemo";
import ResumePMPlaybook from "./components/ResumePMPlaybook";
import ResumeProjectDescription from "./components/ResumeProjectDescription";
import StandardHeader from "./components/StandardHeader";

type TabKey = "description" | "demo" | "playbook";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  return (
    <div className="app-shell">
      <StandardHeader />

      <ProjectHero
        title="AI Resume Match Analyzer"
        description="Compare a resume against a job description and generate an AI-powered match analysis"
      />

      <ProjectTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <main className="project-content">
        {activeTab === "description" && <ResumeProjectDescription />}
        {activeTab === "demo" && <ResumeDemo />}
        {activeTab === "playbook" && <ResumePMPlaybook />}
      </main>
    </div>
  );
}
