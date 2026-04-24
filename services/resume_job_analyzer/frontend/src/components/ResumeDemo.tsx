import { useRef, useState } from "react";

const API_BASE =
  import.meta.env.VITE_RESUME_API_BASE_URL || "http://127.0.0.1:5000";

type Stage =
  | "idle"
  | "loading-sample"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

type AnalysisResult = {
  score: number;
  summary: string;
  matches: string[];
  gaps: string[];
  recommendations: string[];
};

export default function ResumeDemo() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(e.target.files?.[0] ?? null);
    setError("");
  };

  const scrollToResults = () => {
    window.setTimeout(() => {
      const y =
        (resultsRef.current?.getBoundingClientRect().top ?? 0) +
        window.scrollY -
        120;

      window.scrollTo({ top: y, behavior: "smooth" });
    }, 150);
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!jobDescription.trim() || !resumeFile) {
      setError("Please provide both a job description and a resume file.");
      setStage("error");
      return;
    }

    const formData = new FormData();
    formData.append("job_desc", jobDescription);
    formData.append("resume_file", resumeFile);

    try {
      setLoading(true);
      setStage("uploading");

      await wait(500);
      setStage("analyzing");

      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
      setStage("complete");
      scrollToResults();
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSample = async () => {
    setError("");
    setResult(null);

    try {
      setLoading(true);
      setStage("loading-sample");

      const response = await fetch(`${API_BASE}/api/demo`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Demo failed.");
      }

      setJobDescription(data.job_desc || "");
      setResumeFile(null);
      setResult(data);
      setStage("complete");
      scrollToResults();
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "Demo failed.");
    } finally {
      setLoading(false);
    }
  };

  const progress = getProgress(stage);

  return (
    <section className="project-card demo-card">
      <div className="demo-intro compact">
        <p className="description-eyebrow">Interactive Demo</p>
        <h2>Analyze Resume Fit</h2>
        <p>
          Paste a job description and upload a resume or choose upload sample
          files to generate a structured AI-assisted match report.
        </p>
      </div>

      <div className="resume-demo-grid">
        <div className="field-group">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="resume-upload-panel">
          <div className="file-input-group">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="file-input"
              />

              <span className="file-input-button">Choose Resume</span>

              <span className="file-input-name">
                {resumeFile ? resumeFile.name : "No file chosen"}
              </span>
            </div>

            <span className="field-help">Supported formats: PDF or DOCX.</span>
          </div>

          <button
            className="secondary-btn sample-btn"
            onClick={handleUseSample}
            disabled={loading}
          >
            Upload sample files
          </button>
        </div>
      </div>

      <div className="analysis-action-row">
        <button
          className="primary-btn analysis-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>

        <div className="analysis-progress-card inline">
          <div className="analysis-progress-header">
            <span>{getStageLabel(stage)}</span>
            <strong>{progress}%</strong>
          </div>
          <div className="analysis-progress-track">
            <div
              className="analysis-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      {result && (
        <div ref={resultsRef} className="results-section">
          <h3 className="results-title">Analysis Result</h3>

          <div className="score-card">
            <div className="score-value">{result.score}%</div>
            <div className="score-label">Match Score</div>
          </div>

          <div className="result-block summary">
            <h4>Summary</h4>
            <p>{result.summary}</p>
          </div>

          <div className="result-block strengths">
            <div className="result-block-header">
              <h4>Strengths</h4>
              {/* <span className="section-metric">
                {result.matches.length} strengths
              </span> */}
            </div>
            {result.matches.map((item, index) => (
              <div className="result-item" key={`match-${index}`}>
                <span className="check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="result-block gaps">
            <div className="result-block-header">
              <h4>Gaps</h4>
              {/* <span className="section-metric">{result.gaps.length} gaps</span> */}
            </div>
            {result.gaps.map((item, index) => (
              <div
                className="result-item result-item-missing"
                key={`gap-${index}`}
              >
                <span className="check">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="result-block recommendations">
            <h4>Recommendations</h4>
            {result.recommendations.map((item, index) => (
              <div
                className="result-item result-item-recommendation"
                key={`recommendation-${index}`}
              >
                <span className="recommendation-arrow">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getStageLabel(stage: Stage) {
  switch (stage) {
    case "loading-sample":
      return "Loading sample files";
    case "uploading":
      return "Preparing resume";
    case "analyzing":
      return "Generating match analysis";
    case "complete":
      return "Analysis complete";
    case "error":
      return "Needs attention";
    default:
      return "Ready";
  }
}

function getProgress(stage: Stage) {
  switch (stage) {
    case "loading-sample":
      return 35;
    case "uploading":
      return 45;
    case "analyzing":
      return 78;
    case "complete":
      return 100;
    case "error":
      return 100;
    default:
      return 0;
  }
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
