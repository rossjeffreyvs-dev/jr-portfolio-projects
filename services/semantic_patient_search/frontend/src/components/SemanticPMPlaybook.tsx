import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import { pmPlaybookSections } from "../content/semanticContent";

const playbookHighlights = [
  { icon: "💬", label: "Natural-language cohort discovery" },
  { icon: "🧠", label: "Semantic patient profile ranking" },
  { icon: "✨", label: "Explainable match rationale" },
  { icon: "🛡️", label: "Governed synthetic health data" },
];

const panelAccentClasses = [
  "semantic-panel-blue",
  "semantic-panel-purple",
  "semantic-panel-green",
  "semantic-panel-amber",
  "semantic-panel-slate",
  "semantic-panel-cyan",
];

export default function SemanticPMPlaybook() {
  return (
    <div className="content-grid semantic-playbook-grid">
      <Panel
        eyebrow="PM Playbook"
        title="How I would productize semantic patient discovery"
        body="A product management view of an AI-powered research discovery tool that helps investigators find relevant patient cohorts using natural language, semantic matching, governed data concepts, and explainable search results."
        className="ui-panel-accent-blue"
        wide
      >
        <FeatureListGrid items={playbookHighlights} columns={4} />
      </Panel>

      {pmPlaybookSections.map((section, index) => (
        <Panel
          key={section.label}
          eyebrow={section.label}
          title={section.title}
          body={section.body}
          bullets={section.bullets}
          className={panelAccentClasses[index] ?? "semantic-panel-slate"}
        />
      ))}
    </div>
  );
}
