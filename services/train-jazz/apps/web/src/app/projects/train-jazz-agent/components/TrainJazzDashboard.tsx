"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AIConductorPanel from "./AIConductorPanel";
import EventFeed from "./EventFeed";
import MetricCard from "./MetricCard";
import SubwayLinesPanel from "./SubwayLinesPanel";
import SubwayMap from "./SubwayMap";
import { createAIConductor } from "../agents/aiConductor";
import { LINE_META } from "../agents/instrumentMappingAgent";
import { makeVisualTrains, moveVisualTrains } from "../agents/movementAgent";
import { TrainJazzAudioEngine } from "../services/audioEngine";
import {
  createInitialTrainState,
  evolveTrainState,
} from "../services/trainDataService";
import type {
  ConductorState,
  FeedEvent,
  TrainState,
  VisualTrain,
} from "../types";

const initialTrainState = createInitialTrainState();
const conductorAgent = createAIConductor();
const initialConductor = conductorAgent.update(initialTrainState, LINE_META);

function stamp(text: string): FeedEvent {
  return {
    id: `${Date.now()}-${Math.random()}`,
    text: `${new Date().toLocaleTimeString()} ${text}`,
  };
}

export default function TrainJazzDashboard() {
  const [trainState, setTrainState] = useState<TrainState>(initialTrainState);
  const [conductor, setConductor] = useState<ConductorState>(initialConductor);
  const [visualTrains, setVisualTrains] = useState<VisualTrain[]>(() =>
    makeVisualTrains(initialTrainState.lines),
  );
  const [events, setEvents] = useState<FeedEvent[]>(() => [
    stamp("system ready · start audio below ↓"),
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const engineRef = useRef<TrainJazzAudioEngine | null>(null);
  const trainStateRef = useRef(trainState);
  const conductorRef = useRef(conductor);

  useEffect(() => {
    trainStateRef.current = trainState;
  }, [trainState]);

  useEffect(() => {
    conductorRef.current = conductor;
  }, [conductor]);

  const addEvent = useCallback((text: string) => {
    setEvents((current) => [stamp(text), ...current].slice(0, 16));
  }, []);

  useEffect(() => {
    const stateTimer = setInterval(() => {
      setTrainState((previous) => {
        const next = evolveTrainState(previous);
        setConductor(conductorAgent.update(next, LINE_META));
        return next;
      });
    }, 3200);

    const mapTimer = setInterval(() => {
      setVisualTrains((current) => moveVisualTrains(current));
    }, 80);

    const trainRefresh = setInterval(() => {
      setVisualTrains(makeVisualTrains(trainStateRef.current.lines));
    }, 5200);

    const feedTimer = setInterval(() => {
      if (engineRef.current?.isPlaying) return;

      const top = Object.entries(trainStateRef.current.lines).sort(
        (a, b) => b[1] - a[1],
      )[0];

      if (!top) return;

      const meta = LINE_META[top[0]];
      addEvent(`${top[0]} line moving · ${meta.instrument} ready`);
    }, 3000);

    return () => {
      clearInterval(stateTimer);
      clearInterval(mapTimer);
      clearInterval(trainRefresh);
      clearInterval(feedTimer);
      engineRef.current?.stop();
    };
  }, [addEvent]);

  const toggleAudio = async () => {
    if (!engineRef.current) engineRef.current = new TrainJazzAudioEngine();

    if (engineRef.current.isPlaying) {
      engineRef.current.stop(addEvent);
      setIsPlaying(false);
      addEvent("audio stopped");
      return;
    }

    setIsLoadingAudio(true);

    try {
      await engineRef.current.start(
        () => trainStateRef.current,
        () => conductorRef.current,
        LINE_META,
        addEvent,
      );
      setIsPlaying(true);
      addEvent("audio started · AI conductor active");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const statusText = useMemo(() => {
    if (isLoadingAudio) return "Loading instruments…";
    if (isPlaying) return "Playing — system live";
    return "Start Audio below ↓";
  }, [isLoadingAudio, isPlaying]);

  return (
    <div className="demo-shell">
      {/* STATUS CARDS — ALWAYS VISIBLE */}
      <div className="status-grid">
        <MetricCard label="Status" value={statusText} />
        <MetricCard label="Trains" value={trainState.totalTrains} />
        <MetricCard label="Active Lines" value={trainState.activeLines} />
        <MetricCard label="Mode" value="AI conductor" />
      </div>

      {/* AI CONDUCTOR */}
      <AIConductorPanel conductor={conductor} />

      {/* START / STOP */}
      <section className="live-control">
        <div>
          <h2>Live Subway Sonification</h2>
          <p>
            Train lines become continuous overlapping jazz voices. The AI
            conductor keeps the mix sparse, airy, and explainable.
          </p>
        </div>

        <button
          type="button"
          className={`primary-button ${!isPlaying ? "idle" : ""}`}
          onClick={toggleAudio}
          disabled={isLoadingAudio}
        >
          {isLoadingAudio
            ? "Loading…"
            : isPlaying
              ? "Stop Audio"
              : "Start Audio"}
        </button>
      </section>

      {/* DASHBOARD */}
      <section className="tj-dashboard">
        <SubwayLinesPanel trainState={trainState} />
        <SubwayMap trains={visualTrains} />
        <EventFeed events={events} />
      </section>
    </div>
  );
}
