"use client";

import { useEffect, useMemo, useState } from "react";

import DemoDashboard from "./components/DemoDashboard";
import PMPlaybook from "./components/PMPlaybook";
import ProjectDescription from "./components/ProjectDescription";
import ProjectHero from "./components/ProjectHero";
import ProjectTabs from "./components/ProjectTabs";
import StandardHeader from "./components/StandardHeader";
import ProjectFooter from "./components/ProjectFooter";

import type {
  DashboardData,
  Evaluation,
  Patient,
  StreamEvent,
  Tab,
  TraceEvent,
  Trial,
} from "./types";
import {
  calculateSummary,
  formatRecommendation,
  getEmptySummary,
} from "./utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CLAUDE_API_BASE_URL || "http://127.0.0.1:8020";

export default function ClaudeProtocolPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Project Description");
  const [data, setData] = useState<DashboardData>({
    trials: [],
    patients: [],
  });
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const reasoningSteps = useMemo<TraceEvent[]>(() => {
    if (traceEvents.length > 0 || isEvaluating) {
      return traceEvents;
    }

    return [
      {
        label: "Protocol parsed",
        detail: selectedTrial
          ? `${selectedTrial.criteria?.length ?? 0} eligibility criteria loaded`
          : "Awaiting trial selection",
        complete: Boolean(selectedTrial),
      },
      {
        label: "Patient evidence retrieved",
        detail: selectedPatient
          ? `${selectedPatient.id} profile, diagnoses, ECOG, and flags reviewed`
          : "Awaiting patient selection",
        complete: Boolean(selectedPatient),
      },
      {
        label: "Criteria evaluated",
        detail: evaluation
          ? `${evaluation.summary.total} criterion-level determinations generated`
          : "Run evaluation to generate determinations",
        complete: Boolean(evaluation),
      },
      {
        label: "Recommendation generated",
        detail: evaluation
          ? formatRecommendation(evaluation.recommendation)
          : "Pending reasoning output",
        complete: Boolean(evaluation),
      },
    ];
  }, [traceEvents, isEvaluating, selectedTrial, selectedPatient, evaluation]);

  useEffect(() => {
    async function loadDashboard() {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      const dashboard: DashboardData = await response.json();

      setData(dashboard);
      setSelectedTrial(dashboard.trials[0] ?? null);
      setSelectedPatient(dashboard.patients[0] ?? null);
      setIsLoading(false);
    }

    loadDashboard().catch(() => setIsLoading(false));
  }, []);

  function handleSelectTrial(trial: Trial) {
    setSelectedTrial(trial);
    setEvaluation(null);
    setTraceEvents([]);
  }

  function handleSelectPatient(patient: Patient) {
    setSelectedPatient(patient);
    setEvaluation(null);
    setTraceEvents([]);
  }

  async function runEvaluation() {
    if (!selectedTrial || !selectedPatient) return;

    setIsEvaluating(true);
    setTraceEvents([]);
    setEvaluation({
      trial_id: selectedTrial.id,
      patient_id: selectedPatient.id,
      recommendation: "pending",
      decision_rationale: "",
      summary: getEmptySummary(),
      results: [],
    });

    try {
      const response = await fetch(`${API_BASE_URL}/evaluate-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trial_id: selectedTrial.id,
          patient_id: selectedPatient.id,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Streaming evaluation request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          const event = JSON.parse(line) as StreamEvent;

          if (event.event === "started") {
            setTraceEvents([
              {
                label: "Reasoning started",
                detail: event.message,
                complete: true,
              },
            ]);
          }

          if (event.event === "trace") {
            setTraceEvents((current) => [
              ...current,
              {
                label: event.label,
                detail: event.detail,
                complete: true,
              },
            ]);
          }

          if (event.event === "criterion") {
            setEvaluation((current) => {
              const previousResults = current?.results ?? [];
              const nextResults = [...previousResults, event.data];

              return {
                trial_id: selectedTrial.id,
                patient_id: selectedPatient.id,
                recommendation: current?.recommendation ?? "pending",
                decision_rationale: current?.decision_rationale ?? "",
                summary: calculateSummary(nextResults),
                results: nextResults,
              };
            });
          }

          if (event.event === "complete") {
            setEvaluation((current) => ({
              trial_id: event.data.trial_id,
              patient_id: event.data.patient_id,
              recommendation: event.data.recommendation,
              decision_rationale: event.data.decision_rationale,
              summary: event.data.summary,
              results: current?.results ?? [],
            }));

            setTraceEvents((current) => [
              ...current,
              {
                label: "Recommendation generated",
                detail: formatRecommendation(event.data.recommendation),
                complete: true,
              },
            ]);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setTraceEvents((current) => [
        ...current,
        {
          label: "Evaluation failed",
          detail: "The reasoning service did not return a valid response.",
          complete: false,
        },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div className="page-shell">
      <StandardHeader />

      <main className="project-shell">
        <ProjectHero
          trialCount={data.trials.length}
          patientCount={data.patients.length}
        />

        <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "Project Description" && <ProjectDescription />}

        {activeTab === "Demo" && (
          <DemoDashboard
            trials={data.trials}
            patients={data.patients}
            selectedTrial={selectedTrial}
            selectedPatient={selectedPatient}
            evaluation={evaluation}
            traceEvents={reasoningSteps}
            isLoading={isLoading}
            isEvaluating={isEvaluating}
            onSelectTrial={handleSelectTrial}
            onSelectPatient={handleSelectPatient}
            onEvaluate={runEvaluation}
          />
        )}

        {activeTab === "PM Playbook" && <PMPlaybook />}
      </main>

      <ProjectFooter projectName="Claude Clinical Protocol Reasoning Engine" />
    </div>
  );
}
