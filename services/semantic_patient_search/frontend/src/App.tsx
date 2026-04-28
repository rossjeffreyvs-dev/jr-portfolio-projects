import { useState } from "react";

import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import SemanticDemo from "./components/SemanticDemo";
import SemanticPMPlaybook from "./components/SemanticPMPlaybook";
import SemanticProjectDescription from "./components/SemanticProjectDescription";
import StandardHeader from "./components/StandardHeader";
import ProjectFooter from "./components/ProjectFooter";
import type { ActiveTab } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("description");

  return (
    <div className="pageShell">
      <StandardHeader />

      <main className="pageContainer">
        <ProjectHero
          title="Semantic Patient Search"
          description="Search synthetic patient, demographic, and clinical data using natural language and semantic similarity rather than keyword-only matching."
        />

        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "description" && <SemanticProjectDescription />}
        {activeTab === "demo" && <SemanticDemo />}
        {activeTab === "playbook" && <SemanticPMPlaybook />}
      </main>

      <ProjectFooter projectName="Semantic Patient Search<" />
    </div>
  );
}
