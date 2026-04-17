import { useEffect, useMemo, useRef, useState } from 'react';

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

type ActiveTab = 'description' | 'demo';
type Stage = 'idle' | 'embedding' | 'scoring' | 'ranking' | 'done' | 'error';

const sampleQueries = [
  'middle-aged diabetic patient with declining kidney function',
  'elderly patient with repeated ED visits and heart failure',
  'breast cancer patient receiving immunotherapy',
  'patient with poor glycemic control and foot ulcer',
];

const highlightPills = [
  'Natural-language patient discovery',
  'Structured + narrative retrieval',
  'Synthetic healthcare dataset',
  'Similarity-ranked search results',
  'Portfolio-ready architecture',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('description');
  const [query, setQuery] = useState(sampleQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  const stageText = useMemo(() => {
    switch (stage) {
      case 'embedding':
        return 'Embedding query...';
      case 'scoring':
        return 'Scoring patient profiles...';
      case 'ranking':
        return 'Ranking matches...';
      case 'done':
        return 'Results ready';
      case 'error':
        return 'Search failed';
      default:
        return 'Ready to search';
    }
  }, [stage]);

  const progressValue = useMemo(() => {
    switch (stage) {
      case 'embedding':
        return 28;
      case 'scoring':
        return 62;
      case 'ranking':
        return 86;
      case 'done':
        return 100;
      case 'error':
        return 100;
      default:
        return 0;
    }
  }, [stage]);

  useEffect(() => {
    if ((results.length > 0 || error) && activeTab === 'demo') {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [results, error, activeTab]);

  async function runSearch() {
    setActiveTab('demo');
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      setStage('embedding');
      await new Promise((resolve) => setTimeout(resolve, 220));
      setStage('scoring');
      await new Promise((resolve) => setTimeout(resolve, 220));
      setStage('ranking');

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 5 }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to run search.');
      }

      setResults(payload.results || []);
      setStage('done');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setStage('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageShell">
      <header className="siteHeader">
        <div className="siteHeaderInner">
          <a className="brandLockup" href="https://www.jeffrey-ross.me/projects">
            <span className="brandBadge">JR</span>
            <span className="brandText">Projects</span>
          </a>

          <nav className="siteNav" aria-label="Primary navigation">
            <a href="https://www.jeffrey-ross.me">Home</a>
            <a className="active" href="https://www.jeffrey-ross.me/projects">
              Projects
            </a>
            <a href="https://www.jeffrey-ross.me/blog">Blog</a>
            <a href="https://www.jeffrey-ross.me/about">About</a>
            <a href="https://www.jeffrey-ross.me/contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="pageContainer">
        <section className="hero heroCentered">
          <h1>Semantic Patient Search</h1>
          <p className="heroText heroTextCentered">
            Search synthetic patient, demographic, and clinical data using natural language and semantic
            similarity rather than keyword-only matching.
          </p>

          <div className="tabNav" role="tablist" aria-label="Semantic Patient Search sections">
            <button
              type="button"
              className={`tabButton ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Project Description
            </button>
            <button
              type="button"
              className={`tabButton ${activeTab === 'demo' ? 'active' : ''}`}
              onClick={() => setActiveTab('demo')}
            >
              Demo
            </button>
          </div>
        </section>

        {activeTab === 'description' ? (
          <section className="descriptionLayout">
            <article className="contentCard heroCard">
              <p className="sectionBadge">SEMANTIC HEALTHCARE DISCOVERY WORKFLOW</p>
              <h2>Semantic Patient Search</h2>
              <p className="sectionIntro">
                Semantic Patient Search is a healthcare discovery demo that shows how synthetic patient,
                demographic, and clinical records can be transformed into searchable patient profiles.
                Instead of relying on exact keyword matches, the system interprets natural-language intent
                and returns the most conceptually relevant patient records.
              </p>

              <div className="summaryGrid">
                <div className="summaryCard">
                  <p className="summaryLabel">SEARCH PATTERN</p>
                  <strong>Natural language → semantic ranking → matched profiles</strong>
                </div>
                <div className="summaryCard">
                  <p className="summaryLabel">DATA MODEL</p>
                  <strong>Demographics, diagnoses, meds, labs, summaries</strong>
                </div>
                <div className="summaryCard">
                  <p className="summaryLabel">DEPLOYMENT STYLE</p>
                  <strong>Independent portfolio app in a multi-service platform</strong>
                </div>
              </div>

              <div className="highlightsPanel">
                <p className="subSectionLabel">SYSTEM HIGHLIGHTS</p>
                <div className="pillRow">
                  {highlightPills.map((item) => (
                    <span key={item} className="highlightPill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="contentSection">
              <h3>Overview</h3>
              <p>
                The application demonstrates how healthcare-oriented search can be improved by combining
                structured data and narrative context into a unified semantic representation. Each patient
                profile is assembled from multiple data elements so the system can retrieve records that are
                clinically similar even when the user&apos;s wording differs from the source data.
              </p>
            </article>

            <article className="contentSection twoColSection">
              <div>
                <h3>Problem</h3>
                <p>
                  Traditional keyword search is often brittle in healthcare-style datasets. Relevant patient
                  records may be missed when the query wording does not exactly match diagnoses, medication
                  names, or narrative descriptions. This makes cohort discovery and exploratory search harder
                  than it needs to be.
                </p>
              </div>
              <div>
                <h3>Solution</h3>
                <p>
                  This demo creates a searchable semantic profile for each synthetic patient, embeds both the
                  profile and the user query, and then ranks matches using similarity scoring. The result is a
                  more intuitive retrieval experience that better reflects clinical intent rather than exact
                  text overlap.
                </p>
              </div>
            </article>

            <article className="contentSection">
              <h3>Technical Architecture</h3>
              <div className="archGrid">
                <div className="archCard">
                  <p className="summaryLabel">FRONTEND</p>
                  <strong>React + Vite interface with description and demo views</strong>
                </div>
                <div className="archCard">
                  <p className="summaryLabel">BACKEND</p>
                  <strong>Python service exposing health, sample query, and semantic search endpoints</strong>
                </div>
                <div className="archCard">
                  <p className="summaryLabel">RETRIEVAL FLOW</p>
                  <strong>Profile assembly → embedding → scoring → top match explanations</strong>
                </div>
              </div>
              <ol className="contentList orderedList">
                <li>Assemble each synthetic patient into a unified searchable profile.</li>
                <li>Convert the user&apos;s natural-language query into an embedding representation.</li>
                <li>Compare the query against patient profiles using semantic similarity.</li>
                <li>Return ranked results with scores, diagnoses, medications, labs, and match context.</li>
              </ol>
            </article>

            <article className="contentSection twoColSection">
              <div>
                <h3>Why it matters</h3>
                <p>
                  Semantic retrieval is a strong fit for healthcare discovery use cases because real-world
                  questions are often descriptive, contextual, and only partially structured. This project
                  shows how search can become more flexible and useful for patient discovery, cohort building,
                  and research-oriented exploration.
                </p>
              </div>
              <div>
                <h3>Portfolio relevance</h3>
                <p>
                  The demo is intentionally built on synthetic data so it can be shared publicly while still
                  demonstrating patterns that are directly relevant to healthcare data platforms, semantic
                  search, and AI-assisted discovery workflows.
                </p>
              </div>
            </article>
          </section>
        ) : (
          <section className="dashboardGrid">
            <div className="primaryPanel contentCard">
              <div className="panelHeaderRow">
                <div>
                  <p className="panelKicker">Patient discovery dashboard</p>
                  <h2>Find conceptually similar patients</h2>
                </div>
              </div>

              <p className="panelIntro">
                The search index combines demographics, diagnoses, medications, encounters, labs, and
                narrative summaries into a semantically searchable patient profile.
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
                  <button className="primaryButton" disabled={loading} onClick={runSearch}>
                    {loading ? 'Running Search...' : 'Run Semantic Search'}
                  </button>
                </div>

                <div className="progressSection" aria-live="polite">
                  <div className="progressTrack" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressValue}>
                    <div
                      className={`progressFill ${loading ? 'is-animated' : ''} ${stage === 'error' ? 'is-error' : ''}`}
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                  <div
                    className={`statusBubble ${stage === 'done' ? 'done' : ''} ${stage === 'error' ? 'error' : ''}`}
                  >
                    {stageText}
                  </div>
                </div>
              </div>

              <div className="sampleQueryWrap">
                {sampleQueries.map((item) => (
                  <button key={item} className="sampleChip" onClick={() => setQuery(item)}>
                    {item}
                  </button>
                ))}
              </div>

              {error ? <div className="errorBanner">{error}</div> : null}

              <section className="resultsSection" ref={resultsRef}>
                <div className="resultsHeader">
                  <h3>Top patient matches</h3>
                  <span>{results.length ? `${results.length} result(s)` : 'No results yet'}</span>
                </div>

                <div className="resultsList">
                  {results.length === 0 ? (
                    <div className="emptyState">
                      Run one of the sample searches to preview how semantic patient retrieval works.
                    </div>
                  ) : (
                    results.map((result) => (
                      <article key={result.patient_id} className="resultCard">
                        <div className="resultTopRow">
                          <div>
                            <h4>{result.name}</h4>
                            <p className="resultMeta">
                              {result.patient_id} · {result.age} · {result.sex} · {result.city}
                            </p>
                          </div>
                          <div className="scoreBadge">Score {result.similarity_score}</div>
                        </div>

                        <div className="resultGrid">
                          <div>
                            <p className="fieldLabel">Diagnoses</p>
                            <p>{result.diagnoses.join(', ')}</p>
                          </div>
                          <div>
                            <p className="fieldLabel">Medications</p>
                            <p>{result.medications.join(', ')}</p>
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
                                  .join(', ')
                              : 'No significant labs in sample profile'}
                          </p>
                        </div>

                        <div className="matchExplanation">{result.match_explanation}</div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>

            <aside className="secondaryPanel">
              <div className="infoCard contentCard">
                <p className="panelKicker">Use cases</p>
                <h3>What this demo demonstrates</h3>
                <ul>
                  <li>Semantic retrieval over healthcare-oriented records</li>
                  <li>Search across both structured and narrative patient context</li>
                  <li>Similarity ranking for discovery and cohort-building workflows</li>
                  <li>Synthetic data design suitable for a public portfolio demo</li>
                </ul>
              </div>

              <div className="infoCard contentCard">
                <p className="panelKicker">How to try it</p>
                <ol>
                  <li>Select a sample query or enter your own clinical description.</li>
                  <li>Run the search to rank semantically similar patient profiles.</li>
                  <li>Review the returned diagnoses, medications, labs, and explanation.</li>
                </ol>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
