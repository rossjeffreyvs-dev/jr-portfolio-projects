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

const FIRST_SCROLL_DELAY_MS = 180;
const PANEL_PAUSE_MS = 1300;
const SECOND_SCROLL_DELAY_MS = 120;
const START_BANNER_DURATION_MS = 4200;

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
  const [evaluationStartBanner, setEvaluationStartBanner] = useState<
    string | null
  >(null);

  const evaluationSectionRef = useRef<HTMLElement | null>(null);
  const workflowSectionRef = useRef<HTMLElement | null>(null);
  const lastStartedEvaluationRef = useRef<string | null>(null);

  const selectedWorklistPatient = useMemo(() => {
    if (!selectedEvaluation) return undefined;

    return patients.find(
      (patient) => patient.id === selectedEvaluation.patient_id,
    );
  }, [patients, selectedEvaluation]);

  const resolvedSelectedPatient = selectedPatient || selectedWorklistPatient;

  function handleOpenEvaluation(evaluationId: string) {
    onSelectEvaluation(evaluationId);
    setWorkspaceTab("patient-evaluation");
  }

  useEffect(() => {
    if (!startedEvaluationId) {
      lastStartedEvaluationRef.current = null;
      setEvaluationStartBanner(null);
      return;
    }

    if (
      !selectedEvaluation ||
      selectedEvaluation.id !== startedEvaluationId ||
      lastStartedEvaluationRef.current === startedEvaluationId
    ) {
      return;
    }

    lastStartedEvaluationRef.current = startedEvaluationId;
    setWorkspaceTab("patient-evaluation");

    const patientLabel =
      resolvedSelectedPatient?.display_name ||
      resolvedSelectedPatient?.id ||
      selectedEvaluation.patient_id;

    const trialLabel = activeTrial?.title || "the selected trial";

    setEvaluationStartBanner(
      `Patient ${patientLabel} selected. Running eligibility evaluation for ${trialLabel}…`,
    );

    let pauseTimer: number | undefined;
    let secondScrollTimer: number | undefined;

    const firstScrollTimer = window.setTimeout(() => {
      evaluationSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      pauseTimer = window.setTimeout(() => {
        secondScrollTimer = window.setTimeout(() => {
          workflowSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, SECOND_SCROLL_DELAY_MS);
      }, PANEL_PAUSE_MS);
    }, FIRST_SCROLL_DELAY_MS);

    const bannerTimer = window.setTimeout(() => {
      setEvaluationStartBanner(null);
    }, START_BANNER_DURATION_MS);

    return () => {
      window.clearTimeout(firstScrollTimer);
      if (pauseTimer) window.clearTimeout(pauseTimer);
      if (secondScrollTimer) window.clearTimeout(secondScrollTimer);
      window.clearTimeout(bannerTimer);
    };
  }, [
    activeTrial,
    resolvedSelectedPatient,
    selectedEvaluation,
    startedEvaluationId,
  ]);

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
          {evaluationStartBanner ? (
            <div
              className="cardish"
              style={{
                marginTop: 28,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#edf3ff",
                borderColor: "#c8d7fb",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#3158c9",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  color: "var(--ink)",
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.45,
                }}
              >
                {evaluationStartBanner}
              </div>
            </div>
          ) : null}

          <section
            ref={evaluationSectionRef}
            className="card"
            style={{ marginTop: 28 }}
          >
            <PatientEvaluationRecommendationCard
              activeTrial={activeTrial}
              selectedPatient={resolvedSelectedPatient}
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
