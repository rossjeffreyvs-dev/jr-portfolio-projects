import type { Tab } from "../types";
import { tabs } from "../types";

type ProjectTabsProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

export default function ProjectTabs({ activeTab, onChange }: ProjectTabsProps) {
  return (
    <div className="tab-row">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "tab active" : "tab"}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
