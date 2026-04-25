import StandardHeader from "./components/StandardHeader";
import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";

export default function CustomerLifecycleAgentPage() {
  return (
    <>
      <StandardHeader />

      <main className="page-shell">
        <ProjectHero />
        <ProjectTabs />
      </main>
    </>
  );
}
