"use client";

import { useEffect, useState } from "react";
import {
  getAccounts,
  getLifecycle,
  runAgents,
  triggerIntervention,
} from "@/lib/customerLifecycleApi";

import type { Account, AgentRun, JourneyStage } from "@/app/types";

export default function LifecycleDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [journey, setJourney] = useState<JourneyStage[]>([]);
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = accounts.find((a) => a.id === selectedId);

  useEffect(() => {
    async function load() {
      const res = await getAccounts();
      setAccounts(res.items);
      setSelectedId(res.items[0]?.id || "");
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    async function loadLifecycle() {
      const res = await getLifecycle(selectedId);
      setJourney(res.journey);
      setAgentRun(null);
    }

    loadLifecycle();
  }, [selectedId]);

  async function handleRunAgents() {
    if (!selectedId) return;
    setLoading(true);

    const res = await runAgents(selectedId);
    setAgentRun(res);

    setLoading(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      {/* LEFT PANEL */}
      <div className="rounded-2xl border bg-white p-4">
        <h3 className="mb-4 font-bold">Accounts</h3>

        <div className="grid gap-2">
          {accounts.map((acct) => (
            <button
              key={acct.id}
              onClick={() => setSelectedId(acct.id)}
              className={`rounded-xl border p-3 text-left ${
                acct.id === selectedId
                  ? "border-black bg-slate-100"
                  : "border-slate-200"
              }`}
            >
              <div className="font-semibold">{acct.name}</div>
              <div className="text-xs text-slate-500">{acct.segment}</div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{selected?.name}</h2>
            <p className="text-sm text-slate-500">
              {selected?.integration_status}
            </p>
          </div>

          <button
            onClick={handleRunAgents}
            className="rounded-xl bg-black px-4 py-2 text-white font-semibold"
          >
            {loading ? "Running..." : "Run Agents"}
          </button>
        </div>

        {/* Lifecycle */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {journey.map((stage) => (
            <div key={stage.stage} className="rounded-xl border p-3">
              <div className="font-semibold">{stage.stage}</div>
              <div className="text-2xl font-bold">{stage.score}</div>
              <div className="text-xs text-slate-500">{stage.signal}</div>
            </div>
          ))}
        </div>

        {/* Agents */}
        {agentRun && (
          <div className="mt-8">
            <h3 className="font-bold mb-3">Agent Activity</h3>

            <div className="grid gap-3">
              {agentRun.agents.map((a) => (
                <div key={a.name} className="rounded-xl border p-3">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-sm text-slate-600">{a.finding}</div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-6 rounded-xl border bg-slate-50 p-4">
              <h4 className="font-bold">{agentRun.recommendation.title}</h4>
              <p className="text-sm mt-2">{agentRun.recommendation.summary}</p>

              <button
                onClick={() => triggerIntervention(selectedId)}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white"
              >
                Trigger Intervention
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
