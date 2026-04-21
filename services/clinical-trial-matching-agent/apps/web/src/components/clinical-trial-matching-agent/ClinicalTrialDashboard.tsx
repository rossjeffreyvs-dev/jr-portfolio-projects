"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Evaluation, Patient, ReviewTask, Trial } from "@/lib/api";
import DashboardControls from "@/components/clinical-trial-matching-agent/DashboardControls";
import TrialWorklist from "@/components/clinical-trial-matching-agent/TrialWorklist";
import TrialSummaryCard from "@/components/clinical-trial-matching-agent/TrialSummaryCard";
import WorkflowActivityCard from "@/components/clinical-trial-matching-agent/WorkflowActivityCard";
import AuditTrailCard from "@/components/clinical-trial-matching-agent/AuditTrailCard";
import CriteriaMatchTable from "@/components/clinical-trial-matching-agent/CriteriaMatchTable";
import PatientEvaluationRecommendationCard from "@/components/clinical-trial-matching-agent/PatientEvaluationRecommendationCard";

type WorkspaceTab = "active-trial" | "patient-evaluation";

type ClinicalTrialDashboardProps = {
  activeTrial?: Trial;
  selectedPatient?: Patient;
  selectedEvaluation?: Evaluation;
  evaluations: Evaluation[];
  patients: Patient[];
  reviewCards: ReviewTask[];
  error?: string | null;
  isLoadingTrialPatients: boolean;
  isChangingTrial: boolean;
  startedEvaluationId?: string | null;
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
  onSelectEvaluation: (evaluationId: string) => void;
  onReviewCase: (evaluationId: string) => void;
  onRemoveEvaluation: (evaluationId: string) => void;
};

export default function ClinicalTrialDashboard({
  activeTrial,
  selectedPatient,
  selectedEvaluation,
  evaluations,
  patients,
  reviewCards,
  error,
  isLoadingTrialPatients,
  isChangingTrial,
  startedEvaluationId,
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
  onSelectEvaluation,
  onReviewCase,
  onRemoveEvaluation,
}: ClinicalTrialDashboardProps) {
  const [workspaceTab, setWorkspaceTab] =
    useState<WorkspaceTab>("active-trial");

  const workflowSectionRef = useRef<HTMLElement | null>(null);
  const lastStartedEvaluationRef = useRef<string | null>(null);

  const selectedWorklistPatient = useMemo(() => {
    if (!selectedEvaluation) return undefined;

    return patients.find(
      (patient) => patient.id === selectedEvaluation.patient_id,
    );
  }, [patients, selectedEvaluation]);

  function handleOpenEvaluation(evaluationId: string) {
    onSelectEvaluation(evaluationId);
    setWorkspaceTab("patient-evaluation");
  }

  useEffect(() => {
    if (!startedEvaluationId) {
      lastStartedEvaluationRef.current = null;
      return;
    }

    if (lastStartedEvaluationRef.current === startedEvaluationId) {
      return;
    }

    lastStartedEvaluationRef.current = startedEvaluationId;
    setWorkspaceTab("patient-evaluation");

    const scrollTimer = window.setTimeout(() => {
      workflowSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 220);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [startedEvaluationId]);

  return (
    <>
      <DashboardControls
        error={error}
        isLoadingTrialPatients={isLoadingTrialPatients}
        isChangingTrial={isChangingTrial}
        hasSelectedEvaluation={Boolean(selectedEvaluation)}
        onOpenPatientModal={onOpenPatientModal}
        onChangeTrial={onChangeTrial}
        onReplayWorkflow={onReplayWorkflow}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 28,
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          className={`tab-btn ${
            workspaceTab === "active-trial" ? "active" : ""
          }`}
          onClick={() => setWorkspaceTab("active-trial")}
        >
          Active Trial
        </button>

        <button
          type="button"
          className={`tab-btn ${
            workspaceTab === "patient-evaluation" ? "active" : ""
          }`}
          onClick={() => setWorkspaceTab("patient-evaluation")}
        >
          Patient Evaluation
        </button>
      </div>

      {workspaceTab === "active-trial" ? (
        <>
          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Trial Worklist</span>

            <h2 style={{ marginTop: 16, marginBottom: 12 }}>
              Queued evaluations for the active trial
            </h2>

            <p style={{ marginTop: 0 }}>
              Select a case to inspect details, or use the action button to
              review flagged evaluations.
            </p>

            <div style={{ marginTop: 28 }}>
              <TrialWorklist
                evaluations={evaluations}
                patients={patients}
                reviewCards={reviewCards}
                selectedEvaluationId={selectedEvaluation?.id}
                onSelectEvaluation={handleOpenEvaluation}
                onRemoveEvaluation={onRemoveEvaluation}
              />
            </div>
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Trial Summary</span>

            <h2 style={{ marginTop: 16, marginBottom: 12 }}>
              Active trial details
            </h2>

            <p style={{ marginTop: 0 }}>
              Review the core study context, eligibility framing, and trial
              attributes associated with the current worklist.
            </p>

            <div style={{ marginTop: 28 }}>
              <TrialSummaryCard activeTrial={activeTrial} />
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="card" style={{ marginTop: 28 }}>
            <PatientEvaluationRecommendationCard
              activeTrial={activeTrial}
              selectedPatient={selectedPatient || selectedWorklistPatient}
              selectedEvaluation={selectedEvaluation}
              onReviewCase={onReviewCase}
            />
          </section>

          <section
            ref={workflowSectionRef}
            className="card"
            style={{ marginTop: 28 }}
          >
            <span className="section-label">Workflow Activity</span>
            <div style={{ marginTop: 20 }}>
              <WorkflowActivityCard
                selectedEvaluation={selectedEvaluation}
                startedEvaluationId={startedEvaluationId}
              />
            </div>
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Criteria Match Table</span>

            <h2 style={{ marginTop: 16, marginBottom: 20 }}>
              Criterion-by-criterion evaluation
            </h2>

            <CriteriaMatchTable selectedEvaluation={selectedEvaluation} />
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Audit Trail</span>
            <div style={{ marginTop: 20 }}>
              <AuditTrailCard selectedEvaluation={selectedEvaluation} />
            </div>
          </section>
        </>
      )}
    </>
  );
}
