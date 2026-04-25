import type { ActiveTab } from "../types";

type ProjectTabsProps = {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
};

const tabs: Array<{ key: ActiveTab; label: string }> = [
  { key: "description", label: "Project Description" },
  { key: "demo", label: "Demo" },
  { key: "playbook", label: "PM Playbook" },
];

export default function ProjectTabs({
  activeTab,
  onTabChange,
}: ProjectTabsProps) {
  return (
    <nav className="projectTabs" aria-label="Project sections">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`projectTab ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
