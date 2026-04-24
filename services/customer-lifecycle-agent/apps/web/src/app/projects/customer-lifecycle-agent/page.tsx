"use client";

import { useEffect, useState } from "react";
import {
  getAccounts,
  getLifecycle,
  resetAccount,
  runAgents,
  triggerIntervention,
} from "@/lib/customerLifecycleApi";

import type {
  Account,
  AgentFinding,
  AgentRun,
  JourneyStage,
} from "@/lib/types";

export default function CustomerLifecycleAgentPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [journey, setJourney] = useState<JourneyStage[]>([]);
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId,
  );

  useEffect(() => {
    async function load() {
      const response = await getAccounts();
      setAccounts(response.items);
      setSelectedAccountId(response.items[0]?.id || "");
    }

    load();
  }, []);

  useEffect(() => {
    async function loadLifecycle() {
      if (!selectedAccountId) return;

      const response = await getLifecycle(selectedAccountId);
      setJourney(response.journey);
      setAgentRun(null);
      setMessage("");
    }

    loadLifecycle();
  }, [selectedAccountId]);

  async function handleRunAgents() {
    if (!selectedAccountId) return;

    setIsRunning(true);
    setMessage("");

    try {
      const response = await runAgents(selectedAccountId);
      setAgentRun(response);
    } finally {
      setIsRunning(false);
    }
  }

  async function handleTriggerIntervention() {
    if (!selectedAccountId) return;

    const response = await triggerIntervention(selectedAccountId);
    setMessage(response.message);
  }

  async function handleReset() {
    if (!selectedAccountId) return;

    const response = await resetAccount(selectedAccountId);
    setAgentRun(null);
    setMessage(response.message);
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>JR Projects</p>
          <h1 style={styles.title}>Agentic Customer Lifecycle Platform</h1>
          <p style={styles.subtitle}>
            Multi-agent system optimizing onboarding, activation, retention, and
            expansion.
          </p>
        </div>
      </header>

      <section style={styles.grid}>
        <aside style={styles.panel}>
          <h2 style={styles.panelTitle}>Accounts</h2>

          <div style={styles.accountList}>
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
                style={{
                  ...styles.accountButton,
                  ...(account.id === selectedAccountId
                    ? styles.accountButtonActive
                    : {}),
                }}
              >
                <strong>{account.name}</strong>
                <span>{account.segment}</span>
              </button>
            ))}
          </div>
        </aside>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>{selectedAccount?.name}</h2>
              <p style={styles.muted}>{selectedAccount?.integration_status}</p>
            </div>

            <button style={styles.primaryButton} onClick={handleRunAgents}>
              {isRunning ? "Running Agents..." : "Run Lifecycle Agents"}
            </button>
          </div>

          {selectedAccount && (
            <div style={styles.metrics}>
              <Metric
                label="Health Score"
                value={selectedAccount.health_score}
              />
              <Metric
                label="Activation Risk"
                value={selectedAccount.activation_risk}
              />
              <Metric label="Churn Risk" value={selectedAccount.churn_risk} />
              <Metric
                label="Revenue Opportunity"
                value={`$${selectedAccount.revenue_opportunity.toLocaleString()}`}
              />
            </div>
          )}

          <h3 style={styles.sectionTitle}>Lifecycle Journey</h3>

          <div style={styles.stageGrid}>
            {journey.map((stage) => (
              <article key={stage.stage} style={styles.stageCard}>
                <div style={styles.stageTop}>
                  <strong>{stage.stage}</strong>
                  <span style={styles.badge}>{stage.status}</span>
                </div>
                <p style={styles.score}>{stage.score}</p>
                <p style={styles.muted}>{stage.signal}</p>
              </article>
            ))}
          </div>

          {agentRun && (
            <>
              <h3 style={styles.sectionTitle}>Agent Activity</h3>

              <div style={styles.activityList}>
                {agentRun.agents.map((agent: AgentFinding) => (
                  <article key={agent.name} style={styles.activityItem}>
                    <div>
                      <strong>{agent.name}</strong>
                      <p style={styles.muted}>{agent.finding}</p>
                    </div>
                    <span style={styles.badge}>{agent.status}</span>
                  </article>
                ))}
              </div>

              <h3 style={styles.sectionTitle}>Recommendation</h3>

              <div style={styles.recommendation}>
                <h4>{agentRun.recommendation.title}</h4>
                <p>{agentRun.recommendation.summary}</p>
                <p>
                  <strong>Recommended action:</strong>{" "}
                  {agentRun.recommendation.primary_action}
                </p>
                <p>
                  <strong>Expected impact:</strong>{" "}
                  {agentRun.recommendation.expected_impact}
                </p>

                <div style={styles.actionRow}>
                  <button
                    style={styles.primaryButton}
                    onClick={handleTriggerIntervention}
                  >
                    Trigger Intervention
                  </button>

                  <button style={styles.secondaryButton} onClick={handleReset}>
                    Reset Demo
                  </button>
                </div>
              </div>
            </>
          )}

          {message && <div style={styles.toast}>{message}</div>}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.muted}>{label}</span>
      <strong style={styles.metricValue}>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "32px",
    color: "#0f172a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
  },
  eyebrow: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#2563eb",
    fontWeight: 700,
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.1,
    margin: "8px 0",
  },
  subtitle: {
    color: "#475569",
    fontSize: "17px",
    maxWidth: "720px",
  },
  grid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "24px",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "20px",
  },
  muted: {
    color: "#64748b",
    fontSize: "14px",
    margin: "6px 0 0",
  },
  accountList: {
    display: "grid",
    gap: "12px",
    marginTop: "18px",
  },
  accountButton: {
    textAlign: "left",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#fff",
    padding: "16px",
    display: "grid",
    gap: "4px",
    cursor: "pointer",
  },
  accountButtonActive: {
    borderColor: "#2563eb",
    background: "#eff6ff",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginTop: "24px",
  },
  metricCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    background: "#f8fafc",
  },
  metricValue: {
    display: "block",
    fontSize: "24px",
    marginTop: "6px",
  },
  sectionTitle: {
    marginTop: "28px",
    marginBottom: "14px",
    fontSize: "16px",
  },
  stageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },
  stageCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
  },
  stageTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    alignItems: "center",
  },
  badge: {
    borderRadius: "999px",
    padding: "4px 9px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  score: {
    fontSize: "30px",
    fontWeight: 800,
    margin: "16px 0 0",
  },
  activityList: {
    display: "grid",
    gap: "12px",
  },
  activityItem: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  },
  recommendation: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    borderRadius: "20px",
    padding: "20px",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
  },
  primaryButton: {
    border: "none",
    borderRadius: "999px",
    background: "#2563eb",
    color: "#fff",
    padding: "11px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    background: "#fff",
    color: "#0f172a",
    padding: "11px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  toast: {
    marginTop: "18px",
    borderRadius: "16px",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "14px 16px",
    fontWeight: 700,
  },
};
