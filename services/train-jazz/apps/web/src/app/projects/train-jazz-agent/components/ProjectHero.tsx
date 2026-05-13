"use client";

import { useEffect, useState } from "react";

type HeroMetrics = {
  statusText: string;
  totalTrains: number;
  activeLines: number;
  mode: string;
};

const initialMetrics: HeroMetrics = {
  statusText: "Start Audio below ↓",
  totalTrains: 300,
  activeLines: 20,
  mode: "AI conductor",
};

export default function ProjectHero() {
  const [metrics, setMetrics] = useState<HeroMetrics>(initialMetrics);

  useEffect(() => {
    function handleMetricsUpdate(event: Event) {
      const detail = (event as CustomEvent<HeroMetrics>).detail;
      if (!detail) return;

      setMetrics({
        statusText: detail.statusText,
        totalTrains: detail.totalTrains,
        activeLines: detail.activeLines,
        mode: detail.mode,
      });
    }

    window.addEventListener("trainjazz:hero-metrics", handleMetricsUpdate);

    return () => {
      window.removeEventListener("trainjazz:hero-metrics", handleMetricsUpdate);
    };
  }, []);

  return (
    <section className="project-hero centered">
      <h1>Train Jazz Agent</h1>

      <p className="hero-subtitle">
        A TrainJazz-inspired multi-agent system that turns subway movement into
        an ambient, explainable jazz soundscape.
      </p>

      <div className="hero-metrics centered">
        <div>
          <strong>6</strong>
          <span>Signal agents</span>
        </div>

        <div>
          <strong>24</strong>
          <span>Subway lines</span>
        </div>

        <div>
          <strong>1</strong>
          <span>AI conductor</span>
        </div>

        <div>
          <strong>{metrics.totalTrains}</strong>
          <span>Trains</span>
        </div>

        <div>
          <strong>{metrics.activeLines}</strong>
          <span>Active lines</span>
        </div>
      </div>

      {/* <div className="hero-live-status" aria-live="polite">
        <span>{metrics.statusText}</span>
        <span>{metrics.mode}</span>
      </div> */}
    </section>
  );
}
