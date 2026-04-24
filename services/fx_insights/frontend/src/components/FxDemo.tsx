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

export default function FxDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = (params.get("tab") || "").toLowerCase();

      return urlTab === "demo" ? "demo" : "description";
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
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLElement | null>(null);
  const demoRef = useRef<HTMLElement | null>(null);

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

  const showTab = (
    tab: TabKey,
    options?: { smooth?: boolean; updateUrl?: boolean },
  ) => {
    const smooth = options?.smooth ?? true;
    const updateUrl = options?.updateUrl ?? true;

    setActiveTab(tab);

    if (updateUrl) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // ignore URL update issues
      }
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
    <section className="project-card">
      <div className="demo-intro">
        <h3>Generate a market summary</h3>
        <p>
          Choose a base currency, select quote currencies and countries, then
          stream a client-ready FX report.
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
  );
}
