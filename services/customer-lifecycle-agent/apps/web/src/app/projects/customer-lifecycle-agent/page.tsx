import StandardHeader from "./components/StandardHeader";
import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import ProjectFooter from "./components/ProjectFooter";

export default function CustomerLifecycleAgentPage() {
  return (
    <>
      <StandardHeader />

      <main className="page-shell">
        <ProjectHero />
        <ProjectTabs />
      </main>

      <ProjectFooter projectName="Customer Lifecycle Agent" />
    </>
  );
}
