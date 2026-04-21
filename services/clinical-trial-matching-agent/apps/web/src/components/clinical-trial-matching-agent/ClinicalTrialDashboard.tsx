"use client";

import { useEffect, useMemo, useState } from "react";
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
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
  onSelectEvaluation: (evaluationId: string) => void;
  onReviewCase: (evaluationId: string) => void;
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
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
  onSelectEvaluation,
  onReviewCase,
}: ClinicalTrialDashboardProps) {
  const [workspaceTab, setWorkspaceTab] =
    useState<WorkspaceTab>("active-trial");

  const selectedWorklistPatient = useMemo(() => {
    if (!selectedEvaluation) return undefined;

    return patients.find(
      (patient) => patient.id === selectedEvaluation.patient_id,
    );
  }, [patients, selectedEvaluation]);

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
                onSelectEvaluation={onSelectEvaluation}
                onReviewCase={onReviewCase}
              />
            </div>
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Trial Summary</h2>
            <TrialSummaryCard activeTrial={activeTrial} />
          </section>
        </>
      ) : (
        <>
          <section className="card" style={{ marginTop: 28 }}>
            <PatientEvaluationRecommendationCard
              activeTrial={activeTrial}
              selectedPatient={selectedPatient || selectedWorklistPatient}
              selectedEvaluation={selectedEvaluation}
            />
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Workflow Activity</span>
            <div style={{ marginTop: 20 }}>
              <WorkflowActivityCard selectedEvaluation={selectedEvaluation} />
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
