import ProjectFooter from "./components/ProjectFooter";
import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import StandardHeader from "./components/StandardHeader";

export default function TrainJazzPage() {
  return (
    <div className="project-shell">
      <StandardHeader />
      <main className="project-main">
        <ProjectHero />
        <ProjectTabs />
      </main>
      <ProjectFooter />
    </div>
  );
}
