import React, { useEffect, useMemo, useRef, useState } from "react";

type TabKey = "description" | "demo";

type StageKey = "idle" | "rates" | "news" | "report" | "done" | "error";

type RatesMap = Record<string, number>;

type InsightResponse = {
  timestamp?: string;
  base?: string;
  rates?: RatesMap;
  insight?: string;
  error?: string;
  raw?: string;
};

const DEFAULT_BASE = "EUR";
const DEFAULT_SYMBOLS = "USD,GBP,JPY";
const DEFAULT_COUNTRIES = "us,gb,jp";
const TAB_STORAGE_KEY = "ai-fx-insights.activeTab";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = (params.get("tab") || "").toLowerCase();
      const savedTab = (
        localStorage.getItem(TAB_STORAGE_KEY) || ""
      ).toLowerCase();
      const resolved = urlTab || savedTab || "description";
      return resolved === "demo" ? "demo" : "description";
    } catch {
      return "description";
    }
  });

  const [base, setBase] = useState<string>(DEFAULT_BASE);
  const [symbols, setSymbols] = useState<string>(DEFAULT_SYMBOLS);
  const [countries, setCountries] = useState<string>(DEFAULT_COUNTRIES);

  const [loading, setLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<StageKey>("idle");
  const [stageText, setStageText] = useState<string>("");

  const [progress, setProgress] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);

  const [rates, setRates] = useState<RatesMap>({});
  const [headlineCount, setHeadlineCount] = useState<number>(0);
  const [report, setReport] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const extractStreamText = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw);

      if (typeof parsed === "string") return parsed;
      if (parsed && typeof parsed.text === "string") return parsed.text;
      if (parsed && typeof parsed.token === "string") return parsed.token;
      if (parsed && typeof parsed.content === "string") return parsed.content;

      return raw;
    } catch {
      return raw;
    }
  };

  const sortedRates = useMemo(() => {
    return Object.entries(rates).sort(([a], [b]) => a.localeCompare(b));
  }, [rates]);

  const showTab = (tab: TabKey) => {
    setActiveTab(tab);

    try {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch {
      // ignore storage issues
    }

    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore URL update issues
    }
  };

  const resetProgressLoop = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startProgressLoop = () => {
    resetProgressLoop();
    setProgress(6);

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }

        if (stage === "rates") {
          return Math.min(prev + 6, 28);
        }

        if (stage === "news") {
          return Math.min(prev + 4, 58);
        }

        if (stage === "report") {
          return Math.min(prev + 2.5, 90);
        }

        return Math.min(prev + 1.5, 90);
      });
    }, 350);
  };

  const finishProgress = () => {
    resetProgressLoop();
    setProgress(100);
    window.setTimeout(() => {
      setProgress(0);
    }, 1000);
  };

  const closeStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const resetRunState = () => {
    setError(null);
    setRates({});
    setHeadlineCount(0);
    setReport("");
    setStage("idle");
    setStageText("");
    setProgress(0);
  };

  const resolveStageLabel = (value: string): string => {
    const normalized = value.trim().toLowerCase();

    if (normalized.includes("exchange") || normalized.includes("rate")) {
      return "Getting exchange rates...";
    }
    if (
      normalized.includes("headline") ||
      normalized.includes("news") ||
      normalized.includes("market")
    ) {
      return "Getting market news...";
    }
    if (
      normalized.includes("report") ||
      normalized.includes("generate") ||
      normalized.includes("analysis") ||
      normalized.includes("client")
    ) {
      return "Generating client report...";
    }
    if (normalized.includes("done") || normalized.includes("complete")) {
      return "Report complete";
    }

    return value;
  };

  const setStageFromMessage = (value: string) => {
    const normalized = value.trim().toLowerCase();

    if (normalized.includes("exchange") || normalized.includes("rate")) {
      setStage("rates");
      setStageText("Getting exchange rates...");
      return;
    }

    if (
      normalized.includes("headline") ||
      normalized.includes("news") ||
      normalized.includes("market")
    ) {
      setStage("news");
      setStageText("Getting market news...");
      return;
    }

    if (
      normalized.includes("report") ||
      normalized.includes("generate") ||
      normalized.includes("analysis") ||
      normalized.includes("client")
    ) {
      setStage("report");
      setStageText("Generating client report...");
      return;
    }

    if (normalized.includes("done") || normalized.includes("complete")) {
      setStage("done");
      setStageText("Report complete");
      return;
    }

    setStageText(resolveStageLabel(value));
  };

  const fallbackFetch = async () => {
    const params = new URLSearchParams({
      base,
      symbols,
      countries,
    });

    const response = await fetch(`/api/insight?${params.toString()}`);
    const payload = (await response.json()) as InsightResponse;

    if (!response.ok || payload.error) {
      throw new Error(payload.error || "Failed to fetch insight.");
    }

    setRates(payload.rates || {});
    setReport(payload.insight || payload.raw || "");
    setStage("done");
    setStageText("Report complete");
    finishProgress();
    setLoading(false);
  };

  const runReport = async () => {
    closeStream();
    resetRunState();
    setLoading(true);
    setActiveTab("demo");
    setStage("rates");
    setStageText("Getting exchange rates...");
    startProgressLoop();

    const params = new URLSearchParams({
      base,
      symbols,
      countries,
    });

    try {
      const streamUrl = `/api/report/stream?${params.toString()}`;
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.addEventListener("open", () => {
        setStage("rates");
        setStageText("Getting exchange rates...");
      });

      es.addEventListener("stage", (event) => {
        const message = (event as MessageEvent).data || "";
        setStageFromMessage(String(message));
      });

      es.addEventListener("rates", (event) => {
        try {
          const parsed = JSON.parse((event as MessageEvent).data);
          if (parsed && parsed.rates) {
            setRates(parsed.rates as RatesMap);
          } else if (parsed && typeof parsed === "object") {
            setRates(parsed as RatesMap);
          }
        } catch {
          // ignore parse errors for optional event
        }
      });

      es.addEventListener("news", (event) => {
        try {
          const parsed = JSON.parse((event as MessageEvent).data);
          if (Array.isArray(parsed)) {
            setHeadlineCount(parsed.length);
          } else if (Array.isArray(parsed.headlines)) {
            setHeadlineCount(parsed.headlines.length);
          } else if (typeof parsed.count === "number") {
            setHeadlineCount(parsed.count);
          }
        } catch {
          // ignore parse errors for optional event
        }
      });

      es.addEventListener("token", (event) => {
        const raw = String((event as MessageEvent).data || "");
        const chunk = extractStreamText(raw);

        setStage("report");
        setStageText("Generating client report...");
        setReport((prev) => prev + chunk);
      });

      es.addEventListener("done", () => {
        setStage("done");
        setStageText("Report complete");
        setLoading(false);
        finishProgress();
        closeStream();

        window.setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      });

      es.addEventListener("error", async (event) => {
        const messageEvent = event as MessageEvent;
        const streamError =
          typeof messageEvent?.data === "string" && messageEvent.data.trim()
            ? messageEvent.data
            : null;

        closeStream();

        if (streamError) {
          setError(streamError);
          setStage("error");
          setStageText("An error occurred");
          setLoading(false);
          finishProgress();
          return;
        }

        // Sometimes browsers emit a generic SSE error on unexpected close.
        // If we already have report content, treat it as completed.
        if (report.trim().length > 0) {
          setStage("done");
          setStageText("Report complete");
          setLoading(false);
          finishProgress();
          return;
        }

        try {
          await fallbackFetch();
        } catch (fallbackError) {
          const message =
            fallbackError instanceof Error
              ? fallbackError.message
              : "Streaming connection error (check backend logs)";
          setError(message);
          setStage("error");
          setStageText("An error occurred");
          setLoading(false);
          finishProgress();
        }
      });
    } catch (streamInitError) {
      try {
        await fallbackFetch();
      } catch (fallbackError) {
        const message =
          fallbackError instanceof Error
            ? fallbackError.message
            : "Unable to start report generation.";
        setError(message);
        setStage("error");
        setStageText("An error occurred");
        setLoading(false);
        finishProgress();
      }
    }
  };

  useEffect(() => {
    return () => {
      closeStream();
      resetProgressLoop();
    };
  }, []);

  useEffect(() => {
    if (stage === "report" && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [report, stage]);

  const buttonLabel = useMemo(() => {
    if (!loading) {
      return "Generate FX report";
    }

    if (stage === "rates") {
      return "Getting exchange rates...";
    }
    if (stage === "news") {
      return "Getting market news...";
    }
    if (stage === "report") {
      return "Generating client report...";
    }

    return "Working...";
  }, [loading, stage]);

  return (
    <div className="fx-page case-study">
      <nav>
        <div className="nav-container">
          <a href="https://www.jeffrey-ross.me" className="nav-left">
            <span className="logo">JR</span> Projects
          </a>

          <div className="nav-right">
            <a href="https://www.jeffrey-ross.me">Home</a>
            <a href="https://www.jeffrey-ross.me/projects" className="active">
              Projects
            </a>
            <a href="https://www.jeffrey-ross.me/blog">Blog</a>
            <a href="https://www.jeffrey-ross.me/about">About</a>
            <a href="https://www.jeffrey-ross.me/contact">Contact</a>
          </div>
        </div>
      </nav>

      <header>
        <h1>AI FX Insights</h1>
        <p>
          Stream client-ready FX commentary from live rates, headlines, and AI
          analysis
        </p>
      </header>

      <main className="page-shell">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => showTab("description")}
            type="button"
          >
            Project Description
          </button>
          <button
            className={`tab-btn ${activeTab === "demo" ? "active" : ""}`}
            onClick={() => showTab("demo")}
            type="button"
          >
            Demo
          </button>
        </div>

        <section
          id="description"
          className={`card description-card ${activeTab !== "description" ? "hidden" : ""} ${
            activeTab === "description" ? "active" : ""
          }`}
        >
          <section className="project-hero">
            <div className="eyebrow">AI-Powered Market Commentary Workflow</div>
            <h2>AI FX Insights</h2>
            <p className="hero-copy">
              AI FX Insights is a market commentary demo that combines foreign
              exchange data, current market headlines, and large language model
              output to generate a concise, client-ready report. The workflow is
              streamed to the browser in stages so users can see progress as the
              system moves from data retrieval to narrative generation.
            </p>

            <div className="callout-grid">
              <div className="callout-card">
                <span className="callout-label">Live Demo Pattern</span>
                <span className="callout-value">Rates → News → Report</span>
              </div>
              <div className="callout-card">
                <span className="callout-label">Streaming</span>
                <span className="callout-value">Server-Sent Events (SSE)</span>
              </div>
              <div className="callout-card">
                <span className="callout-label">Deployment Style</span>
                <span className="callout-value">
                  Independent app in multi-service platform
                </span>
              </div>
            </div>

            <div className="highlights-panel">
              <div className="highlights-title">System Highlights</div>
              <div className="highlight-pills">
                <span className="highlight-pill">Live FX data retrieval</span>
                <span className="highlight-pill">
                  Market headline aggregation
                </span>
                <span className="highlight-pill">
                  Streaming AI-generated report
                </span>
                <span className="highlight-pill">
                  Progressive user feedback
                </span>
                <span className="highlight-pill">
                  Container-ready architecture
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3>Overview</h3>
            <p>
              The application demonstrates how real-time market inputs can be
              transformed into a polished narrative summary suitable for client
              communication. Rather than presenting users with raw JSON or
              isolated data points, the system orchestrates a sequence of
              retrieval and summarization steps and surfaces them through a more
              guided interface.
            </p>
            <p>
              This project is designed as one of several small, independent
              applications hosted within the broader{" "}
              <strong>jr-portfolio-projects</strong> platform. That pattern
              allows each demo to evolve on its own while still fitting into a
              shared operational and presentation model.
            </p>
          </section>

          <section>
            <h3>Problem</h3>
            <p>
              Financial users often need a quick market readout that blends
              quantitative changes with qualitative context. Pulling exchange
              rates, scanning current headlines, and converting both into a
              short, coherent market summary usually requires switching across
              multiple tools or manually writing commentary.
            </p>
            <p>
              The UX challenge is not just generating the final output. It is
              also making the multi-step process feel responsive and
              understandable while the application is waiting on several
              external systems.
            </p>
          </section>

          <section>
            <h3>Solution</h3>
            <p>
              AI FX Insights addresses that problem through a staged pipeline:
            </p>
            <ul>
              <li>retrieve current FX rates for selected currency pairs</li>
              <li>retrieve recent market headlines for selected countries</li>
              <li>generate a concise client-ready narrative using an LLM</li>
              <li>stream progress and report content to the UI in real time</li>
            </ul>
          </section>

          <section>
            <h3>Technical Architecture</h3>
            <div className="architecture-grid">
              <div className="arch-block">
                <h4>Frontend</h4>
                <ul>
                  <li>React + TypeScript</li>
                  <li>Tab-based case study and demo shell</li>
                  <li>Live stage indicators and streaming report display</li>
                </ul>
              </div>

              <div className="arch-block">
                <h4>Backend</h4>
                <ul>
                  <li>
                    Python service for rates, headlines, and report generation
                  </li>
                  <li>SSE endpoint for incremental report delivery</li>
                  <li>REST fallback for non-streaming request handling</li>
                </ul>
              </div>

              <div className="arch-block">
                <h4>Data + AI Layer</h4>
                <ul>
                  <li>FX rate API integration</li>
                  <li>Market news API integration</li>
                  <li>LLM-based narrative synthesis</li>
                </ul>
              </div>

              <div className="arch-block">
                <h4>Platform Fit</h4>
                <ul>
                  <li>Standalone local execution for rapid testing</li>
                  <li>Gateway-routed service structure</li>
                  <li>Portable deployment to Docker / Lightsail</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3>Why the Streaming UX Matters</h3>
            <p>
              The UI intentionally exposes intermediate stages instead of
              waiting for one final response. That makes the system feel faster,
              helps users understand what the app is doing, and provides a more
              polished demonstration of how data retrieval and AI generation can
              work together in one workflow.
            </p>
          </section>
        </section>

        <section
          id="demo"
          className={`card ${activeTab !== "demo" ? "hidden" : ""} ${
            activeTab === "demo" ? "active" : ""
          }`}
        >
          <div className="demo-intro">
            <h3>Generate a market summary</h3>
            <p>
              Choose a base currency, select quote currencies and countries,
              then stream a client-ready FX report.
            </p>
          </div>

          <div className="fx-form-grid">
            <div className="field-group">
              <label htmlFor="base">Base currency</label>
              <input
                id="base"
                type="text"
                value={base}
                onChange={(e) => setBase(e.target.value.toUpperCase())}
                placeholder="EUR"
                maxLength={6}
              />
            </div>

            <div className="field-group">
              <label htmlFor="symbols">Quote currencies</label>
              <input
                id="symbols"
                type="text"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value.toUpperCase())}
                placeholder="USD,GBP,JPY"
              />
            </div>

            <div className="field-group">
              <label htmlFor="countries">News countries</label>
              <input
                id="countries"
                type="text"
                value={countries}
                onChange={(e) => setCountries(e.target.value.toLowerCase())}
                placeholder="us,gb,jp"
              />
            </div>
          </div>

          <div className="demo-actions">
            <button
              className={`primary-btn ${loading ? "loading" : ""}`}
              onClick={runReport}
              disabled={loading}
            >
              {buttonLabel}
            </button>
          </div>

          <div className={`progress-wrap ${progress > 0 ? "visible" : ""}`}>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {(stageText || error) && (
            <div className="status-row">
              {stageText && (
                <div className={`status-pill status-${stage}`}>{stageText}</div>
              )}
              {headlineCount > 0 && (
                <div className="meta-pill">{headlineCount} headlines</div>
              )}
              {sortedRates.length > 0 && (
                <div className="meta-pill">{sortedRates.length} rates</div>
              )}
            </div>
          )}

          {error && (
            <div className="error-banner">
              <strong>Error:</strong> {error}
            </div>
          )}

          {sortedRates.length > 0 && (
            <div className="data-card">
              <h4>Exchange rates</h4>
              <div className="rates-table-wrap">
                <table className="rates-table">
                  <thead>
                    <tr>
                      <th>Pair</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRates.map(([symbol, value]) => (
                      <tr key={symbol}>
                        <td>
                          {base}/{symbol}
                        </td>
                        <td>
                          {typeof value === "number"
                            ? value.toFixed(4)
                            : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div ref={resultRef} className="result-card">
            <h4>Client-ready market report</h4>
            <div className={`report-output ${loading ? "is-streaming" : ""}`}>
              {report ? (
                <pre>{report}</pre>
              ) : (
                <div className="report-placeholder">
                  Your generated market summary will appear here.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer>
        Built by{" "}
        <a href="https://www.jeffrey-ross.me" target="_blank" rel="noreferrer">
          Jeffrey Ross
        </a>
      </footer>
    </div>
  );
};

export default App;
