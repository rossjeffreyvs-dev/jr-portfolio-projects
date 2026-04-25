export default function InfoSidebar() {
  return (
    <aside className="secondaryPanel">
      <div className="infoCard contentCard">
        <p className="panelKicker">Use cases</p>
        <h3>What this demo demonstrates</h3>
        <ul>
          <li>Semantic retrieval over healthcare-oriented records</li>
          <li>Search across both structured and narrative patient context</li>
          <li>
            Similarity ranking for discovery and cohort-building workflows
          </li>
          <li>Synthetic data design suitable for a public portfolio demo</li>
        </ul>
      </div>

      <div className="infoCard contentCard">
        <p className="panelKicker">How to try it</p>
        <ol>
          <li>Select a sample query or enter your own clinical description.</li>
          <li>Run the search to rank semantically similar patient profiles.</li>
          <li>Review diagnoses, medications, labs, and explanations.</li>
        </ol>
      </div>
    </aside>
  );
}
