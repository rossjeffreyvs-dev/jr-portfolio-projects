import { sampleQueries } from "../content/semanticContent";
import type { SearchStage } from "../types";

type SearchPanelProps = {
  query: string;
  loading: boolean;
  stage: SearchStage;
  stageText: string;
  progressValue: number;
  onQueryChange: (query: string) => void;
  onRunSearch: () => void;
  onSampleQuerySelect: (query: string) => void;
};

export default function SearchPanel({
  query,
  loading,
  stage,
  stageText,
  progressValue,
  onQueryChange,
  onRunSearch,
  onSampleQuerySelect,
}: SearchPanelProps) {
  return (
    <>
      <div className="panelHeaderRow">
        <div>
          <p className="panelKicker">Patient discovery dashboard</p>
          <h2>Find conceptually similar patients</h2>
          <p className="panelIntro">
            The search index combines demographics, diagnoses, medications,
            encounters, labs, and narrative summaries into a semantically
            searchable patient profile.
          </p>
        </div>
      </div>

      <div className="queryPanel">
        <label htmlFor="semantic-query">Natural language query</label>
        <textarea
          id="semantic-query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          rows={5}
          placeholder="Example: diabetic patient with worsening renal function"
        />

        <div className="queryActions">
          <button
            className="primaryButton"
            disabled={loading}
            onClick={onRunSearch}
          >
            {loading ? "Running Search..." : "Run Semantic Search"}
          </button>
        </div>

        <div className="progressSection" aria-live="polite">
          <div
            className="progressTrack"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
          >
            <div
              className={`progressFill ${loading ? "is-animated" : ""} ${
                stage === "error" ? "is-error" : ""
              }`}
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div
            className={`statusBubble ${stage === "done" ? "done" : ""} ${
              stage === "error" ? "error" : ""
            }`}
          >
            {stageText}
          </div>
        </div>
      </div>

      <div className="sampleQueryWrap">
        {sampleQueries.map((item) => (
          <button
            key={item}
            type="button"
            className="sampleChip"
            onClick={() => onSampleQuerySelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
}
