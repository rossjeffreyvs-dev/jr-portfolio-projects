import type { Tab } from "../types";
import { tabs } from "../types";

type ProjectTabsProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

export default function ProjectTabs({ activeTab, onChange }: ProjectTabsProps) {
  return (
    <div className="project-tabs" aria-label="Project sections">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={activeTab === tab ? "tab-btn active" : "tab-btn"}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
