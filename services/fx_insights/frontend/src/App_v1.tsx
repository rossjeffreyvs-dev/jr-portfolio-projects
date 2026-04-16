import React, { useMemo, useRef, useState } from "react";

interface DonePayload {
  timestamp: string;
  base: string;
  rates: Record<string, number>;
  insight: string;
}

type Stage = "idle" | "rates" | "news" | "report" | "done" | "error";

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<DonePayload | null>(null);

  const [streamText, setStreamText] = useState<string>("");

  const [base] = useState("EUR");
  const [symbols] = useState("USD,GBP,JPY");
  const [countries] = useState("us,gb,jp");

  const esRef = useRef<EventSource | null>(null);

  const isLoading = stage === "rates" || stage === "news" || stage === "report";

  const embedMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("embed") === "1";
  }, []);

  const buttonLabel = useMemo(() => {
    switch (stage) {
      case "rates":
        return "Getting exchange rates...";
      case "news":
        return "Getting market news...";
      case "report":
        return "Generating client report...";
      default:
        return "Generate Insight Now";
    }
  }, [stage]);

  const stageHint = useMemo(() => {
    switch (stage) {
      case "idle":
        return "Ready";
      case "rates":
        return "Step 1/3: Fetching FX rates";
      case "news":
        return "Step 2/3: Fetching market news";
      case "report":
        return "Step 3/3: Generating the report (streaming)";
      case "done":
        return "Done";
      case "error":
        return "Error";
    }
  }, [stage]);

  const reset = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setStage("idle");
    setProgress(0);
    setError(null);
    setDone(null);
    setStreamText("");
  };

  const startSSE = () => {
    reset();
    setStage("rates");
    setProgress(1);

    const url =
      `/api/report/stream?base=${encodeURIComponent(base)}` +
      `&symbols=${encodeURIComponent(symbols)}` +
      `&countries=${encodeURIComponent(countries)}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("stage", (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data);
        const nextStage = payload?.stage as Stage;
        const nextProgress = Number(payload?.progress ?? 0);

        if (nextStage) setStage(nextStage);
        if (!Number.isNaN(nextProgress)) setProgress(nextProgress);
      } catch {
        // ignore
      }
    });

    es.addEventListener("token", (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data);
        const text = payload?.text ?? "";
        if (text) setStreamText((prev) => prev + text);
      } catch {
        // ignore
      }
    });

    es.addEventListener("done", (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data) as DonePayload;
        setDone(payload);
        setStage("done");
        setProgress(100);
      } catch {
        setError("Failed to parse completion payload.");
        setStage("error");
        setProgress(100);
      } finally {
        es.close();
        esRef.current = null;
      }
    });

    es.addEventListener("error", (evt: MessageEvent) => {
      try {
        const data = (evt as any)?.data;
        if (data) {
          const payload = JSON.parse(data);
          setError(payload?.error || "Streaming error.");
        } else {
          setError("Streaming connection error (check backend logs).");
        }
      } catch {
        setError("Streaming connection error (check backend logs).");
      } finally {
        setStage("error");
        setProgress(100);
        es.close();
        esRef.current = null;
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!embedMode && (
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                FX
              </div>
              <div>
                <div className="font-semibold leading-tight">
                  AI FX Insights
                </div>
                <div className="text-sm text-gray-600 leading-tight">
                  Streaming market commentary demo
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-4 text-sm">
              <a
                href="https://jeffrey-ross.me/projects"
                className="text-gray-700 hover:text-blue-600"
              >
                &lt;- Back to Portfolio
              </a>
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1">
        <div className="p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            FX & Market Insight Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Fetch FX rates + market headlines, then stream a client-ready report
            via server-sent events for distribution to clients.
          </p>

          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={startSSE}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? buttonLabel : "Generate Insight Now"}
            </button>

            {!isLoading && (stage === "done" || stage === "error") && (
              <button
                onClick={reset}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">{stageHint}</div>
          </div>

          {error && (
            <div className="text-red-500 mb-4 whitespace-pre-wrap">
              Error: {error}
            </div>
          )}

          {stage === "report" && (
            <div className="bg-gray-100 p-4 rounded mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Generating report…
              </div>
              <p className="whitespace-pre-wrap">{streamText || "…"}</p>
            </div>
          )}

          {done && (
            <div>
              <div className="mb-4">
                <strong>Timestamp:</strong> {done.timestamp}
              </div>
              <div className="mb-4">
                <strong>Base Currency:</strong> {done.base}
              </div>

              <table className="min-w-full bg-white border-collapse mb-6">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Currency</th>
                    <th className="border px-4 py-2">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(done?.rates ?? {}).map(([sym, rate]) => (
                    <tr key={sym}>
                      <td className="border px-4 py-2">{sym}</td>
                      <td className="border px-4 py-2">
                        {typeof rate === "number"
                          ? rate.toFixed(4)
                          : String(rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-100 p-4 rounded">
                <p className="whitespace-pre-wrap">{done.insight}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {!embedMode && (
        <footer className="border-t bg-white">
          <div className="max-w-5xl mx-auto px-6 py-5 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div>
              © {new Date().getFullYear()} Jeffrey Ross • AI FX Insights
            </div>
            <div className="flex gap-4">
              <a className="hover:text-blue-600" href="https://jeffrey-ross.me">
                Portfolio
              </a>
              <a
                className="hover:text-blue-600"
                href="https://github.com/rossjeffreyvs-dev"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
      aria-label="Loading"
    />
  );
}
