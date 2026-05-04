import Panel from "./Panel";
import FeatureListGrid from "./FeatureListGrid";
import FeatureCardGrid from "./FeatureCardList";

const overviewFeatures = [
  { icon: "🔎", label: "Natural language search" },
  { icon: "🧠", label: "Embedding-based matching" },
  { icon: "📊", label: "Relevance scoring" },
  { icon: "⚡", label: "Fast cohort discovery" },
  { icon: "🔗", label: "Cross-source data linking" },
];

const workflowSteps = [
  {
    number: "01",
    icon: "📝",
    title: "User query",
    description:
      "A natural language query describes the patient cohort or condition of interest.",
  },
  {
    number: "02",
    icon: "🧠",
    title: "Embedding generation",
    description:
      "The query is transformed into a vector representation capturing semantic meaning.",
  },
  {
    number: "03",
    icon: "🔍",
    title: "Similarity search",
    description:
      "Patient records are compared using vector similarity to identify relevant matches.",
  },
  {
    number: "04",
    icon: "📊",
    title: "Ranking & scoring",
    description:
      "Results are ranked based on semantic relevance and supporting data signals.",
  },
  {
    number: "05",
    icon: "📄",
    title: "Result exploration",
    description:
      "Users review matched patients with context, enabling faster cohort discovery.",
  },
];

export default function SemanticProjectDescription() {
  return (
    <div className="content-grid">
      {/* ------------------------------ */}
      {/* Overview (Full Width)          */}
      {/* ------------------------------ */}
      <Panel
        eyebrow="Project Overview"
        title="Semantic Patient Search Platform"
        body="This project demonstrates how natural language search and embeddings can be applied to clinical data. Instead of relying on keyword filters, the system identifies patients based on meaning, enabling faster and more intuitive cohort discovery."
        className="ui-panel-accent-blue"
        wide
      >
        <FeatureListGrid items={overviewFeatures} />
      </Panel>

      {/* ------------------------------ */}
      {/* Problem / Solution (2-col)     */}
      {/* ------------------------------ */}
      <Panel
        eyebrow="Problem"
        title="Clinical data is difficult to search with traditional tools"
        body="Clinical datasets are often fragmented, inconsistently structured, and require complex filtering logic. Keyword-based search misses relevant records when terminology varies, slowing down cohort identification and research workflows."
      />

      <Panel
        eyebrow="Solution"
        title="Semantic search across patient data"
        body="By converting both queries and patient data into embeddings, the system enables similarity-based matching. This allows users to find relevant patients even when exact keywords differ, improving recall and usability."
      />

      {/* ------------------------------ */}
      {/* How It Works (Full Width)      */}
      {/* ------------------------------ */}
      <Panel
        eyebrow="How it works"
        title="Semantic search workflow"
        body="The system transforms natural language queries into embeddings, compares them against patient vectors, and returns ranked results with contextual relevance."
        wide
      >
        <FeatureCardGrid items={workflowSteps} columns={5} />
      </Panel>

      {/* ------------------------------ */}
      {/* Results / Impact (2-col)       */}
      {/* ------------------------------ */}
      <Panel
        eyebrow="Results & Impact"
        title="Faster and more intuitive cohort discovery"
        bullets={[
          "Reduces reliance on complex filter logic",
          "Improves recall by capturing semantic meaning",
          "Accelerates research workflows",
          "Supports exploratory data analysis",
        ]}
      />

      <Panel
        eyebrow="Key Takeaways"
        title="Applying AI to real data workflows"
        bullets={[
          "Semantic search improves usability of complex datasets",
          "Embeddings enable flexible matching beyond keywords",
          "UX design is critical for trust and adoption",
          "Combining AI + product design creates practical value",
        ]}
      />
    </div>
  );
}
