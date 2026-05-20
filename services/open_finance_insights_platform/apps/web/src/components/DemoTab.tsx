"use client";

import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { API_BASE, getFinancialProfile } from "@/lib/api";

type Profile = {
  institutions: any[];
  accounts: any[];
  transactions: any[];
  recurring_payments: any[];
  cash_flow: any;
  signals: any[];
};

type WorkflowEvent = { id: string; step: string; detail: string; status: string; artifact?: string };

export default function DemoTab({ autoRunToken }: { autoRunToken: number }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<WorkflowEvent[]>([]);
  const [running, setRunning] = useState(false);
  const workflowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { getFinancialProfile().then(setProfile).catch(console.error); }, []);
  useEffect(() => { if (autoRunToken > 0) runWorkflow(); }, [autoRunToken]);

  function runWorkflow() {
    setRunning(true);
    setEvents([]);
    workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const source = new EventSource(`${API_BASE}/open-finance/workflow/stream`);
    source.onmessage = (message) => {
      const payload = JSON.parse(message.data);
      if (payload.type === "profile") {
        setProfile(payload.payload);
        setRunning(false);
        source.close();
        return;
      }
      setEvents((current) => [...current, payload]);
    };
    source.onerror = () => {
      setRunning(false);
      source.close();
    };
  }

  const chartData = profile ? [
    { name: "Income", value: profile.cash_flow.monthly_income },
    { name: "Outflow", value: profile.cash_flow.monthly_outflow },
    { name: "Recurring", value: profile.cash_flow.recurring_spend },
    { name: "Discretionary", value: profile.cash_flow.discretionary_spend },
  ] : [];

  return (
    <section className="demo-grid">
      <div className="content-card large" ref={workflowRef}>
        <div className="section-header-row">
          <div>
            <p className="eyebrow">Agent workflow</p>
            <h2>Analyze this financial profile</h2>
          </div>
          <button className="primary-button compact" onClick={runWorkflow}>{running ? "Running..." : "Run Workflow"}</button>
        </div>
        <div className="workflow-list">
          {(events.length ? events : [{ id: "placeholder", step: "Ready", detail: "Run the workflow to stream the tool activity trace.", status: "queued" }]).map((event) => (
            <div className="workflow-event" key={event.id}>
              <span className={`status-dot ${event.status}`} />
              <div><h4>{event.step}</h4><p>{event.detail}</p>{event.artifact && <small>{event.artifact}</small>}</div>
            </div>
          ))}
        </div>
      </div>

      {profile && (
        <>
          <div className="content-card">
            <p className="eyebrow">Cash flow summary</p>
            <h3>${profile.cash_flow.net_cash_flow.toLocaleString()} net monthly cash flow</h3>
            <p>{profile.cash_flow.runway_months} months of liquidity runway based on normalized checking and savings balances.</p>
            <div className="mini-metrics">
              <span>Income <strong>${profile.cash_flow.monthly_income.toLocaleString()}</strong></span>
              <span>Outflow <strong>${profile.cash_flow.monthly_outflow.toLocaleString()}</strong></span>
            </div>
          </div>

          <div className="content-card chart-card">
            <p className="eyebrow">Financial model</p>
            <h3>Monthly flow by category</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" /></BarChart>
            </ResponsiveContainer>
          </div>

          <div className="content-card full-span">
            <p className="eyebrow">Recommendations</p>
            <h3>Risk and opportunity signals</h3>
            <div className="signals-grid">
              {profile.signals.map((signal) => (
                <article className="signal-card" key={signal.id}>
                  <span className={`severity ${signal.severity}`}>{signal.severity}</span>
                  <h4>{signal.title}</h4>
                  <p>{signal.description}</p>
                  <strong>{signal.recommendation}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="content-card full-span">
            <p className="eyebrow">Common data model preview</p>
            <h3>Normalized entities</h3>
            <div className="table-wrap">
              <table><thead><tr><th>Transaction</th><th>Merchant</th><th>Amount</th><th>Category</th><th>Subcategory</th></tr></thead><tbody>
                {profile.transactions.slice(0, 8).map((txn) => (
                  <tr key={txn.id}><td>{txn.date}</td><td>{txn.merchant_name}</td><td>${txn.amount.toLocaleString()}</td><td>{txn.category}</td><td>{txn.subcategory}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
