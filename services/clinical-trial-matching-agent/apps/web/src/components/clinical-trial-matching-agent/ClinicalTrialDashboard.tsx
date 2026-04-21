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

const BANNER_SCROLL_DELAY_MS = 140;
const BANNER_PAUSE_MS = 1800;
const EVALUATION_SCROLL_DELAY_MS = 140;
const EVALUATION_PANEL_PAUSE_MS = 1700;
const WORKFLOW_SCROLL_DELAY_MS = 180;

const WORKFLOW_INITIAL_DELAY_MS = 800;
const WORKFLOW_STEP_DELAY_MS = 1150;

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
  const [isEvaluationInProgress, setIsEvaluationInProgress] = useState(false);

  const bannerRef = useRef<HTMLDivElement | null>(null);
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
      setIsEvaluationInProgress(false);
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
    setIsEvaluationInProgress(true);

    const patientLabel =
      resolvedSelectedPatient?.display_name ||
      resolvedSelectedPatient?.id ||
      selectedEvaluation.patient_id;

    const trialLabel = activeTrial?.title || "the selected trial";

    setEvaluationStartBanner(
      `Patient ${patientLabel} selected. Running eligibility evaluation for ${trialLabel}…`,
    );

    const workflowEventCount = selectedEvaluation.workflow_events?.length || 0;
    const workflowAnimationDurationMs =
      WORKFLOW_INITIAL_DELAY_MS + workflowEventCount * WORKFLOW_STEP_DELAY_MS;
    const totalExperienceDurationMs =
      BANNER_SCROLL_DELAY_MS +
      BANNER_PAUSE_MS +
      EVALUATION_SCROLL_DELAY_MS +
      EVALUATION_PANEL_PAUSE_MS +
      WORKFLOW_SCROLL_DELAY_MS +
      workflowAnimationDurationMs +
      300;

    let bannerPauseTimer: number | undefined;
    let evaluationPauseTimer: number | undefined;
    let workflowScrollTimer: number | undefined;

    const bannerScrollTimer = window.setTimeout(() => {
      bannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      bannerPauseTimer = window.setTimeout(() => {
        evaluationSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        evaluationPauseTimer = window.setTimeout(() => {
          workflowScrollTimer = window.setTimeout(() => {
            workflowSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, WORKFLOW_SCROLL_DELAY_MS);
        }, EVALUATION_PANEL_PAUSE_MS);
      }, BANNER_PAUSE_MS);
    }, BANNER_SCROLL_DELAY_MS);

    const completeTimer = window.setTimeout(() => {
      setEvaluationStartBanner(null);
      setIsEvaluationInProgress(false);
    }, totalExperienceDurationMs);

    return () => {
      window.clearTimeout(bannerScrollTimer);
      if (bannerPauseTimer) window.clearTimeout(bannerPauseTimer);
      if (evaluationPauseTimer) window.clearTimeout(evaluationPauseTimer);
      if (workflowScrollTimer) window.clearTimeout(workflowScrollTimer);
      window.clearTimeout(completeTimer);
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
              ref={bannerRef}
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
              isEvaluationInProgress={isEvaluationInProgress}
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
                animationStartDelayMs={
                  BANNER_SCROLL_DELAY_MS +
                  BANNER_PAUSE_MS +
                  EVALUATION_SCROLL_DELAY_MS +
                  EVALUATION_PANEL_PAUSE_MS +
                  WORKFLOW_SCROLL_DELAY_MS +
                  WORKFLOW_INITIAL_DELAY_MS
                }
                stepDelayMs={WORKFLOW_STEP_DELAY_MS}
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
