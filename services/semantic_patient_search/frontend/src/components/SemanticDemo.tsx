import { useEffect, useMemo, useRef, useState } from "react";

import { sampleQueries } from "../content/semanticContent";
import type { PatientSearchResult, SearchStage } from "../types";
import InfoSidebar from "./InfoSidebar";
import ResultsPanel from "./ResultsPanel";
import SearchPanel from "./SearchPanel";

export default function SemanticDemo() {
  const [query, setQuery] = useState(sampleQueries[0]);
  const [results, setResults] = useState<PatientSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<SearchStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

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
        return "Ready to search";
    }
  }, [stage]);

  const progressValue = useMemo(() => {
    switch (stage) {
      case "embedding":
        return 28;
      case "scoring":
        return 62;
      case "ranking":
        return 86;
      case "done":
      case "error":
        return 100;
      default:
        return 0;
    }
  }, [stage]);

  useEffect(() => {
    if (results.length > 0 || error) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [results, error]);

  async function runSearch() {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      setStage("embedding");
      await new Promise((resolve) => setTimeout(resolve, 220));

      setStage("scoring");
      await new Promise((resolve) => setTimeout(resolve, 220));

      setStage("ranking");

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, top_k: 5 }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to run search.");
      }

      setResults(payload.results || []);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStage("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboardGrid">
      <div className="primaryPanel contentCard">
        <SearchPanel
          query={query}
          loading={loading}
          stage={stage}
          stageText={stageText}
          progressValue={progressValue}
          onQueryChange={setQuery}
          onRunSearch={runSearch}
          onSampleQuerySelect={setQuery}
        />

        {error ? <div className="errorBanner">{error}</div> : null}

        <ResultsPanel ref={resultsRef} results={results} />
      </div>

      <InfoSidebar />
    </section>
  );
}
