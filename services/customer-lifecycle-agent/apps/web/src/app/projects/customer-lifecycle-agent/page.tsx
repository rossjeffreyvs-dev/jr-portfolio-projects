"use client";

import { useState } from "react";
import LifecycleDashboard from "@/components/customer-lifecycle/LifecycleDashboard";

const tabs = ["Project Description", "Demo", "PM Playbook"] as const;

type Tab = (typeof tabs)[number];

export default function CustomerLifecycleAgentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Project Description");

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3px 28px",
          borderBottom: "1px solid #e2e8f0",
          background: "rgba(255, 255, 255, 0.55)",
        }}
      >
        <a
          href="https://www.jeffrey-ross.me/projects"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              fontWeight: 800,
              fontSize: "18px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                border: "3px solid #0f172a",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "20px",
              }}
            >
              JR
            </div>
            <div>Projects</div>
          </div>
        </a>

        <nav
          style={{
            display: "flex",
            gap: "28px",
            fontSize: "16px",
            fontWeight: 700,
            color: "#64748b",
          }}
        >
          <a
            href="https://www.jeffrey-ross.me"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </a>

          <a
            href="https://www.jeffrey-ross.me/projects"
            style={{
              textDecoration: "none",
              color: "#0f172a",
              borderBottom: "3px solid #0f172a",
              paddingBottom: "10px",
            }}
          >
            Projects
          </a>

          <a
            href="https://www.jeffrey-ross.me/blog"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Blog
          </a>

          <a
            href="https://www.jeffrey-ross.me/about"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            About
          </a>

          <a
            href="https://www.jeffrey-ross.me/contact"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Contact
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Agentic Customer Lifecycle Platform
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Multi-agent system optimizing onboarding, activation, retention, and
          expansion across the customer lifecycle.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-2xl border px-8 py-4 text-base font-extrabold transition ${
                activeTab === tab
                  ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {activeTab === "Project Description" && <ProjectDescription />}
        {activeTab === "Demo" && <LifecycleDashboard />}
        {activeTab === "PM Playbook" && <PMPlaybook />}
      </section>
    </main>
  );
}

function ProjectDescription() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
        Project Overview
      </p>

      <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
        AI-Assisted Customer Lifecycle Workflow
      </h2>

      <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-600">
        This demo simulates a multi-agent customer growth system that analyzes
        account behavior, identifies onboarding and activation risks, recommends
        personalized interventions, and explains the rationale behind each
        action.
      </p>

      <div className="mt-9 grid gap-4 md:grid-cols-5">
        {[
          "Multi-agent lifecycle orchestration",
          "Activation and churn risk detection",
          "Personalized intervention recommendations",
          "Revenue expansion signals",
          "Explainable recommendation rationale",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-extrabold text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <InfoCard
          title="Problem"
          text="Customer onboarding and activation often span many systems, signals, and teams. Drop-offs can go unnoticed until the customer is already at risk."
        />
        <InfoCard
          title="Solution"
          text="The platform uses coordinated agents to evaluate account state, detect lifecycle risks, recommend targeted actions, and log the intervention workflow."
        />
      </div>
    </div>
  );
}

function DemoPlaceholder() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
        Interactive Demo
      </p>

      <h2 className="mt-5 text-4xl font-black tracking-tight">
        Lifecycle Agent Dashboard
      </h2>

      <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
        This tab will contain the account selector, lifecycle stage cards, agent
        activity stream, recommendation panel, and intervention trigger.
      </p>
    </div>
  );
}

function PMPlaybook() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
        PM Playbook
      </p>

      <h2 className="mt-5 text-4xl font-black tracking-tight">
        Product Strategy & Execution
      </h2>

      <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
        This section explains the product assumptions, lifecycle metrics, agent
        responsibilities, evaluation approach, integrations, and rollout
        strategy.
      </p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-7">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="mt-4 text-base leading-7 text-slate-600">{text}</p>
    </article>
  );
}
