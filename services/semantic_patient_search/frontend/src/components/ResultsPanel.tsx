import { forwardRef } from "react";

import type { PatientSearchResult } from "../types";
import PatientResultCard from "./PatientResultCard";

type ResultsPanelProps = {
  results: PatientSearchResult[];
};

const ResultsPanel = forwardRef<HTMLElement, ResultsPanelProps>(
  ({ results }, ref) => {
    return (
      <section className="resultsSection" ref={ref}>
        <div className="resultsHeader">
          <h3>Top patient matches</h3>
          <span>
            {results.length ? `${results.length} result(s)` : "No results yet"}
          </span>
        </div>

        <div className="resultsList">
          {results.length === 0 ? (
            <div className="emptyState">
              Run one of the sample searches to preview how semantic patient
              retrieval works.
            </div>
          ) : (
            results.map((result) => (
              <PatientResultCard key={result.patient_id} result={result} />
            ))
          )}
        </div>
      </section>
    );
  },
);

ResultsPanel.displayName = "ResultsPanel";

export default ResultsPanel;
