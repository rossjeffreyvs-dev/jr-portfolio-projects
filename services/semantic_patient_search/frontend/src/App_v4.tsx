import { useMemo, useState } from "react";

type SearchResult = {
  patient_id: string;
  name: string;
  age: number;
  sex: string;
  city: string;
  diagnoses: string[];
  medications: string[];
  labs: Record<string, string>;
  clinical_summary: string;
  similarity_score: number;
  match_explanation: string;
};

const sampleQueries = [
  "middle-aged diabetic patient with declining kidney function",
  "elderly patient with repeated ED visits and heart failure",
  "breast cancer patient receiving immunotherapy",
  "patient with poor glycemic control and foot ulcer",
];

export default function App() {
  const [query, setQuery] = useState(sampleQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<
    "idle" | "embedding" | "scoring" | "ranking" | "done" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const stageText = useMemo(() => {
    switch (stage) {
      case "embedding":
        return "Embedding query...";
      case "scoring":
        return "Scoring patient profiles...";
      case "ranking":
        return "Ranking matches...";
      case "done":
        return "Results ready";
      case "error":
        return "Search failed";
      default:
        return "Ready";
    }
  }, [stage]);

  const progressValue = useMemo(() => {
    switch (stage) {
      case "embedding":
        return 28;
      case "scoring":
        return 62;
      case "ranking":
        return 88;
      case "done":
        return 100;
      case "error":
        return 100;
      default:
        return 0;
    }
  }, [stage]);

  async function runSearch() {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      setStage("embedding");
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStage("scoring");
      await new Promise((resolve) => setTimeout(resolve, 300));
      setStage("ranking");

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 5 }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to run search.");
      }

      setResults(payload.results || []);
      setStage("done");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStage("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageShell">
      <div className="backgroundGlow backgroundGlowOne" />
      <div className="backgroundGlow backgroundGlowTwo" />

      <main className="pageContainer">
        <header className="hero">
          <div className="eyebrow">AI</div>
          <div className="heroCopy">
            <div>
              <p className="sectionKicker">Healthcare discovery demo</p>
              <h1>Semantic Patient Search</h1>
              <p className="heroText">
                Search synthetic patient, demographic, and clinical data using
                natural language and semantic similarity rather than
                keyword-only matching.
              </p>
            </div>
            <a className="backLink" href="https://www.jeffrey-ross.me">
              ← Back to Portfolio
            </a>
          </div>
        </header>

        <section className="dashboardGrid">
          <div className="primaryPanel glassPanel">
            <div className="panelHeaderRow">
              <div>
                <p className="panelKicker">Patient discovery dashboard</p>
                <h2>Find conceptually similar patients</h2>
              </div>
            </div>

            <p className="panelIntro">
              The search index combines demographics, diagnoses, medications,
              encounters, labs, and narrative summaries into a semantically
              searchable patient profile.
            </p>

            <div className="queryPanel">
              <label htmlFor="queryBox">Natural language query</label>
              <textarea
                id="queryBox"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                rows={5}
                placeholder="Example: diabetic patient with worsening renal function"
              />
              <div className="queryActions">
                <button
                  className="primaryButton"
                  disabled={loading}
                  onClick={runSearch}
                >
                  {loading ? "Running Search..." : "Run Semantic Search"}
                </button>
              </div>

              {stage !== "idle" ? (
                <div className="progressSection" aria-live="polite">
                  <div
                    className="progressTrack"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressValue}
                  >
                    <div
                      className={`progressFill ${loading ? "is-animated" : ""}`}
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                  <div className={`statusBubble ${stage}`}>{stageText}</div>
                </div>
              ) : null}
            </div>

            <div className="sampleQueryWrap">
              {sampleQueries.map((item) => (
                <button
                  key={item}
                  className="sampleChip"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {error ? <div className="errorBanner">{error}</div> : null}

            <div className="resultsSection">
              <div className="resultsHeader">
                <h3>Top patient matches</h3>
                <span>
                  {results.length
                    ? `${results.length} result(s)`
                    : "No results yet"}
                </span>
              </div>

              <div className="resultsList">
                {results.length === 0 ? (
                  <div className="emptyState">
                    Run one of the sample searches to preview how semantic
                    patient retrieval works.
                  </div>
                ) : (
                  results.map((result) => (
                    <article key={result.patient_id} className="resultCard">
                      <div className="resultTopRow">
                        <div>
                          <h4>{result.name}</h4>
                          <p className="resultMeta">
                            {result.patient_id} · {result.age} · {result.sex} ·{" "}
                            {result.city}
                          </p>
                        </div>
                        <div className="scoreBadge">
                          Score {result.similarity_score}
                        </div>
                      </div>

                      <div className="resultGrid">
                        <div>
                          <p className="fieldLabel">Diagnoses</p>
                          <p>{result.diagnoses.join(", ")}</p>
                        </div>
                        <div>
                          <p className="fieldLabel">Medications</p>
                          <p>{result.medications.join(", ")}</p>
                        </div>
                      </div>

                      <div className="resultBodyBlock">
                        <p className="fieldLabel">Clinical summary</p>
                        <p>{result.clinical_summary}</p>
                      </div>

                      <div className="resultBodyBlock">
                        <p className="fieldLabel">Labs</p>
                        <p>
                          {Object.entries(result.labs).length
                            ? Object.entries(result.labs)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")
                            : "No significant labs in sample profile"}
                        </p>
                      </div>

                      <div className="matchExplanation">
                        {result.match_explanation}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="secondaryPanel glassPanel">
            <div className="infoCard">
              <p className="panelKicker">Use cases</p>
              <h3>What this demonstrates</h3>
              <ul>
                <li>Semantic retrieval over healthcare-oriented records</li>
                <li>
                  Search across both structured and narrative patient context
                </li>
                <li>
                  Similarity ranking for discovery and cohort-building workflows
                </li>
                <li>
                  Synthetic data design suitable for a public portfolio demo
                </li>
              </ul>
            </div>

            <div className="infoCard">
              <p className="panelKicker">Example workflow</p>
              <ol>
                <li>
                  Convert each patient profile into a searchable narrative
                  document.
                </li>
                <li>Embed the query and compare it to all patient profiles.</li>
                <li>Rank the most relevant matches using cosine similarity.</li>
                <li>
                  Return results with scores and short match explanations.
                </li>
              </ol>
            </div>

            <div className="infoCard highlightCard">
              <p className="panelKicker">Next enhancements</p>
              <ul>
                <li>Hybrid filtering by age, diagnosis, or geography</li>
                <li>Ontology-aware search and cohort builder</li>
                <li>Vector database integration</li>
                <li>RAG-based match explanations</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
