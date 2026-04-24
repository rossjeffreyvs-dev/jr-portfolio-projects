import type { TabKey } from "../App";

type ProjectTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "description", label: "Project Description" },
  { key: "demo", label: "Demo" },
  { key: "playbook", label: "PM Playbook" },
];

export default function ProjectTabs({
  activeTab,
  onTabChange,
}: ProjectTabsProps) {
  return (
    <div className="project-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={activeTab === tab.key ? "active" : ""}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
