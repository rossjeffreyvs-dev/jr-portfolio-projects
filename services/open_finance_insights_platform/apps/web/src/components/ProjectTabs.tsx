export type TabKey = "description" | "demo" | "playbook";

type ProjectTabsProps = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "description", label: "Project Description" },
  { key: "demo", label: "Demo" },
  { key: "playbook", label: "PM Playbook" },
];

export default function ProjectTabs({ activeTab, setActiveTab }: ProjectTabsProps) {
  return (
    <nav className="tabs" aria-label="Project sections">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active" : ""}
          type="button"
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
