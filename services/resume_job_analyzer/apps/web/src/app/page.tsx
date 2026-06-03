"use client";

import { useState } from "react";

import ProjectFooter from "@/components/ProjectFooter";
import ProjectHero from "@/components/ProjectHero";
import ProjectTabs from "@/components/ProjectTabs";
import ResumeDemo from "@/components/ResumeDemo";
import ResumePMPlaybook from "@/components/ResumePMPlaybook";
import ResumeProjectDescription from "@/components/ResumeProjectDescription";
import StandardHeader from "@/components/StandardHeader";
import type { TabKey } from "@/types/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  return (
    <div className="app-shell">
      <StandardHeader />

      <main className="page-shell">
        <ProjectHero
          title="AI Resume Match Analyzer"
          description="Compare a resume against a job description and generate an AI-powered match analysis."
        />

        <ProjectTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

        <section className="project-content">
          {activeTab === "description" && <ResumeProjectDescription />}
          {activeTab === "demo" && <ResumeDemo />}
          {activeTab === "playbook" && <ResumePMPlaybook />}
        </section>
      </main>

      <ProjectFooter projectName="AI Resume Match Analyzer" />
    </div>
  );
}
