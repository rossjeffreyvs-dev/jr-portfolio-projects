import { useEffect, useState } from "react";

import FxDemo from "./components/FxDemo";
import FxPMPlaybook from "./components/FxPMPlaybook";
import FxProjectDescription from "./components/FxProjectDescription";
import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import StandardHeader from "./components/StandardHeader";
import ProjectFooter from "./components/ProjectFooter";

export type TabKey = "description" | "demo" | "playbook";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") as TabKey | null;

    if (
      requestedTab === "description" ||
      requestedTab === "demo" ||
      requestedTab === "playbook"
    ) {
      setActiveTab(requestedTab);
    }
  }, []);

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div className="app-shell">
      <StandardHeader />

      <ProjectHero
        title="AI FX Insights"
        description="Stream client-ready FX commentary from live exchange rates, market headlines, and AI-assisted analysis."
      />

      <ProjectTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="project-content">
        {activeTab === "description" && <FxProjectDescription />}
        {activeTab === "demo" && <FxDemo />}
        {activeTab === "playbook" && <FxPMPlaybook />}
      </main>

      <ProjectFooter projectName="AI-Assisted FX Market Intelligence Workflow" />
    </div>
  );
}
