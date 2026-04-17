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

const sampleQueries = [
  'middle-aged diabetic patient with declining kidney function',
  'elderly patient with repeated ED visits and heart failure',
  'breast cancer patient receiving immunotherapy',
  'patient with poor glycemic control and foot ulcer',
];

const projectHighlights = [
  'Semantic retrieval over synthetic healthcare-oriented records',
  'Search across both structured fields and narrative patient context',
  'Similarity ranking to support discovery and cohort-building workflows',
  'Portfolio-ready demo design using de-identified synthetic data only',
];

const technicalNotes = [
  'Patient profiles combine demographics, diagnoses, medications, labs, and narrative summaries into a searchable text representation.',
  'A natural-language query is embedded and compared against patient profile embeddings using similarity scoring.',
  'Top matches are returned with scores and short explanations to make ranking behavior easier to interpret.',
  'The architecture can be extended with metadata filters, vector databases, ontologies, and RAG-style explanations.',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('description');
  const [query, setQuery] = useState(sampleQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'embedding' | 'scoring' | 'ranking' | 'done' | 'error'>('idle');
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
        return 'Ready';
    }
  }, [stage]);

  useEffect(() => {
    if ((results.length > 0 || error) && activeTab === 'demo') {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results, error, activeTab]);

  async function runSearch() {
    setActiveTab('demo');
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      setStage('embedding');
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStage('scoring');
      await new Promise((resolve) => setTimeout(resolve, 250));
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
      <div className="backgroundGlow backgroundGlowOne" />
      <div className="backgroundGlow backgroundGlowTwo" />

      <main className="pageContainer">
        <header className="topNav glassPanel">
          <div className="navBrandWrap">
            <div className="eyebrow">AI</div>
            <div>
              <p className="sectionKicker navKicker">Healthcare discovery demo</p>
              <div className="navTitle">Semantic Patient Search</div>
            </div>
          </div>

          <div className="navActions">
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

            <a className="backLink" href="https://www.jeffrey-ross.me">
              ← Back to Portfolio
            </a>
          </div>
        </header>

        <section className="hero">
          <p className="sectionKicker">Semantic healthcare search</p>
          <h1>Semantic Patient Search</h1>
          <p className="heroText">
            Search synthetic patient, demographic, and clinical data using natural language and
            semantic similarity rather than keyword-only matching.
          </p>
        </section>

        {activeTab === 'description' ? (
          <section className="descriptionLayout">
            <article className="glassPanel contentPanel descriptionHeroPanel">
              <p className="panelKicker">Overview</p>
              <h2>Natural-language discovery across synthetic patient records</h2>
              <p className="panelIntro">
                This demo shows how semantic search can support healthcare discovery workflows by
                representing each synthetic patient as a unified profile that blends structured data
                and narrative context. Instead of relying on exact keyword matches, the system ranks
                patients by conceptual similarity to the clinician or analyst&apos;s query.
              </p>
              <div className="descriptionCallouts">
                <div className="statCard">
                  <span>Searchable profile inputs</span>
                  <strong>Demographics, diagnoses, meds, labs, summaries</strong>
                </div>
                <div className="statCard">
                  <span>Primary retrieval method</span>
                  <strong>Semantic similarity over patient profiles</strong>
                </div>
                <div className="statCard">
                  <span>Portfolio focus</span>
                  <strong>Healthcare discovery with safe synthetic data</strong>
                </div>
              </div>
            </article>

            <div className="descriptionGrid">
              <article className="glassPanel contentPanel">
                <p className="panelKicker">What this demonstrates</p>
                <h3>Why this project matters</h3>
                <ul className="contentList">
                  {projectHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="glassPanel contentPanel">
                <p className="panelKicker">Example workflow</p>
                <h3>How the retrieval flow works</h3>
                <ol className="contentList orderedList">
                  <li>Convert each patient profile into a searchable narrative-oriented document.</li>
                  <li>Embed the user query and compare it against patient profile embeddings.</li>
                  <li>Rank the most relevant matches using semantic similarity scoring.</li>
                  <li>Return top results with scores and plain-language match explanations.</li>
                </ol>
              </article>

              <article className="glassPanel contentPanel">
                <p className="panelKicker">Technical design</p>
                <h3>Core implementation notes</h3>
                <ul className="contentList">
                  {technicalNotes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="glassPanel contentPanel highlightCard">
                <p className="panelKicker">Next enhancements</p>
                <h3>Logical extensions</h3>
                <ul className="contentList">
                  <li>Hybrid filtering by age, diagnosis, geography, or encounter history</li>
                  <li>Ontology-aware search and cohort builder workflows</li>
                  <li>Vector database integration for larger-scale retrieval</li>
                  <li>RAG-based explanations and researcher-facing summaries</li>
                </ul>
              </article>
            </div>
          </section>
        ) : (
          <section className="dashboardGrid">
            <div className="primaryPanel glassPanel">
              <div className="panelHeaderRow">
                <div>
                  <p className="panelKicker">Patient discovery dashboard</p>
                  <h2>Find conceptually similar patients</h2>
                </div>
                <div className="statusPill">{stageText}</div>
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
              <div className="infoCard glassPanel">
                <p className="panelKicker">Use cases</p>
                <h3>What this demo demonstrates</h3>
                <ul>
                  <li>Semantic retrieval over healthcare-oriented records</li>
                  <li>Search across both structured and narrative patient context</li>
                  <li>Similarity ranking for discovery and cohort-building workflows</li>
                  <li>Synthetic data design suitable for a public portfolio demo</li>
                </ul>
              </div>

              <div className="infoCard glassPanel">
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
