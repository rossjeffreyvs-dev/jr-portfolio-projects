export type TabKey = "description" | "demo" | "playbook";

export default function ProjectTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}) {
  return (
    <div className="tabs" role="tablist" aria-label="Project sections">
      <button
        className={activeTab === "description" ? "active" : ""}
        onClick={() => setActiveTab("description")}
      >
        Project Description
      </button>
      <button
        className={activeTab === "demo" ? "active" : ""}
        onClick={() => setActiveTab("demo")}
      >
        Demo
      </button>
      <button
        className={activeTab === "playbook" ? "active" : ""}
        onClick={() => setActiveTab("playbook")}
      >
        PM Playbook
      </button>
    </div>
  );
}
