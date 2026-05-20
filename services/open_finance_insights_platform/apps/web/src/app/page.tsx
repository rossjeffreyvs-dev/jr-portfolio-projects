"use client";

import { useState } from "react";

import DemoTab from "@/components/DemoTab";
import DescriptionTab from "@/components/DescriptionTab";
import PlaybookTab from "@/components/PlaybookTab";
import ProjectFooter from "@/components/ProjectFooter";
import ProjectHero from "@/components/ProjectHero";
import ProjectTabs, { TabKey } from "@/components/ProjectTabs";
import SiteHeader from "@/components/SiteHeader";

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [autoRunToken, setAutoRunToken] = useState(0);

  function runDemoFromHero() {
    setActiveTab("demo");
    window.setTimeout(() => setAutoRunToken((value) => value + 1), 150);
  }

  return (
    <main>
      <SiteHeader />
      <div className="page-shell">
        <ProjectHero onRunDemo={runDemoFromHero} />
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "description" && <DescriptionTab />}
        {activeTab === "demo" && <DemoTab autoRunToken={autoRunToken} />}
        {activeTab === "playbook" && <PlaybookTab />}
      </div>
      <ProjectFooter />
    </main>
  );
}
