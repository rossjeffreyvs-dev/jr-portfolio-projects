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
  playbackSequenceKey: number;
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
  onSelectEvaluation: (evaluationId: string) => void;
  onReviewCase: (evaluationId: string) => void;
  onRemoveEvaluation: (evaluationId: string) => void;
};

const INITIAL_SCROLL_DELAY_MS = 180;
const TYPE_INTERVAL_MS = 26;
const POST_TYPING_PAUSE_MS = 500;
const WORKFLOW_SCROLL_DELAY_MS = 180;
const WORKFLOW_INITIAL_STEP_DELAY_MS = 850;
const WORKFLOW_STEP_DELAY_MS = 1250;
const CRITERIA_INITIAL_STEP_DELAY_MS = 500;
const CRITERIA_STEP_DELAY_MS = 260;
const POST_WORKFLOW_PAUSE_MS = 900;
const RETURN_TO_RECOMMENDATION_DELAY_MS = 180;
const RECOMMENDATION_REVEAL_DELAY_MS = 900;
const BANNER_CLEAR_DELAY_MS = 2200;

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
  playbackSequenceKey,
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
  onSelectEvaluation,
  onReviewCase,
  onRemoveEvaluation,
}: ClinicalTrialDashboardProps) {
  const [workspaceTab, setWorkspaceTab] =
    useState<WorkspaceTab>("active-trial");
  const [typedBannerText, setTypedBannerText] = useState("");
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [showFinalRecommendation, setShowFinalRecommendation] = useState(true);
  const [visibleWorkflowCount, setVisibleWorkflowCount] = useState<
    number | undefined
  >(undefined);
  const [visibleCriteriaCount, setVisibleCriteriaCount] = useState<
    number | undefined
  >(undefined);
  const [visibleAuditCount, setVisibleAuditCount] = useState<
    number | undefined
  >(undefined);

  const tabAnchorRef = useRef<HTMLDivElement | null>(null);
  const evaluationSectionRef = useRef<HTMLElement | null>(null);
  const workflowSectionRef = useRef<HTMLElement | null>(null);
  const lastPlaybackKeyRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  const selectedWorklistPatient = useMemo(() => {
    if (!selectedEvaluation) return undefined;

    return patients.find(
      (patient) => patient.id === selectedEvaluation.patient_id,
    );
  }, [patients, selectedEvaluation]);

  const resolvedSelectedPatient = selectedPatient || selectedWorklistPatient;

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function schedule(callback: () => void, delayMs: number) {
    const timer = window.setTimeout(callback, delayMs);
    timersRef.current.push(timer);
    return timer;
  }

  function handleOpenEvaluation(evaluationId: string) {
    onSelectEvaluation(evaluationId);
    setWorkspaceTab("patient-evaluation");
    setTypedBannerText("");
    setIsPlaybackActive(false);
    setShowFinalRecommendation(true);
    setVisibleWorkflowCount(undefined);
    setVisibleCriteriaCount(undefined);
    setVisibleAuditCount(undefined);
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!startedEvaluationId || playbackSequenceKey === 0) {
      lastPlaybackKeyRef.current = null;
      setTypedBannerText("");
      setIsPlaybackActive(false);
      setShowFinalRecommendation(true);
      setVisibleWorkflowCount(undefined);
      setVisibleCriteriaCount(undefined);
      setVisibleAuditCount(undefined);
      clearTimers();
      return;
    }

    if (
      !selectedEvaluation ||
      selectedEvaluation.id !== startedEvaluationId ||
      lastPlaybackKeyRef.current === playbackSequenceKey
    ) {
      return;
    }

    lastPlaybackKeyRef.current = playbackSequenceKey;
    clearTimers();

    const workflowEvents = selectedEvaluation.workflow_events || [];
    const criteriaRows = selectedEvaluation.criterion_results || [];

    const patientLabel =
      resolvedSelectedPatient?.display_name ||
      resolvedSelectedPatient?.id ||
      selectedEvaluation.patient_id;

    const trialLabel = activeTrial?.title || "the selected trial";
    const fullBannerText = `Patient ${patientLabel} selected. Running eligibility evaluation for ${trialLabel}…`;

    setWorkspaceTab("patient-evaluation");
    setTypedBannerText("");
    setIsPlaybackActive(true);
    setShowFinalRecommendation(false);
    setVisibleWorkflowCount(0);
    setVisibleCriteriaCount(0);
    setVisibleAuditCount(0);

    schedule(() => {
      tabAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, INITIAL_SCROLL_DELAY_MS);

    let elapsedMs = INITIAL_SCROLL_DELAY_MS;

    for (let index = 0; index < fullBannerText.length; index += 1) {
      elapsedMs += TYPE_INTERVAL_MS;
      schedule(() => {
        setTypedBannerText(fullBannerText.slice(0, index + 1));
      }, elapsedMs);
    }

    elapsedMs += POST_TYPING_PAUSE_MS;

    elapsedMs += WORKFLOW_SCROLL_DELAY_MS;
    schedule(() => {
      workflowSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, elapsedMs);

    if (workflowEvents.length > 0) {
      elapsedMs += WORKFLOW_INITIAL_STEP_DELAY_MS;

      workflowEvents.forEach((_, index) => {
        const eventDelay = elapsedMs + index * WORKFLOW_STEP_DELAY_MS;

        schedule(() => {
          setVisibleWorkflowCount(index + 1);
          setVisibleAuditCount(index + 1);
        }, eventDelay);
      });

      elapsedMs += workflowEvents.length * WORKFLOW_STEP_DELAY_MS;
    } else {
      elapsedMs += WORKFLOW_INITIAL_STEP_DELAY_MS;
    }

    if (criteriaRows.length > 0) {
      elapsedMs += CRITERIA_INITIAL_STEP_DELAY_MS;

      criteriaRows.forEach((_, index) => {
        schedule(
          () => {
            setVisibleCriteriaCount(index + 1);
          },
          elapsedMs + index * CRITERIA_STEP_DELAY_MS,
        );
      });

      elapsedMs += criteriaRows.length * CRITERIA_STEP_DELAY_MS;
    }

    elapsedMs += POST_WORKFLOW_PAUSE_MS;

    elapsedMs += RETURN_TO_RECOMMENDATION_DELAY_MS;
    schedule(() => {
      evaluationSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, elapsedMs);

    elapsedMs += RECOMMENDATION_REVEAL_DELAY_MS;
    schedule(() => {
      setShowFinalRecommendation(true);
      setIsPlaybackActive(false);
      setVisibleWorkflowCount(undefined);
      setVisibleCriteriaCount(undefined);
      setVisibleAuditCount(undefined);
    }, elapsedMs);

    elapsedMs += BANNER_CLEAR_DELAY_MS;
    schedule(() => {
      setTypedBannerText("");
    }, elapsedMs);
  }, [
    activeTrial,
    playbackSequenceKey,
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

      <div ref={tabAnchorRef} />

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
              {activeTrial?.title && (
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>
                  {" "}
                  — {activeTrial.title}
                </span>
              )}
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
          {typedBannerText ? (
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
                  minHeight: 20,
                }}
              >
                {typedBannerText}
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
              isEvaluationInProgress={isPlaybackActive}
              showFinalRecommendation={showFinalRecommendation}
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
                visibleEventCount={visibleWorkflowCount}
                isEvaluationInProgress={isPlaybackActive}
              />
            </div>
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Criteria Match Table</span>

            {/* <h2 style={{ marginTop: 16, marginBottom: 20 }}>
              Criterion-by-criterion evaluation
            </h2> */}

            <CriteriaMatchTable
              selectedEvaluation={selectedEvaluation}
              visibleRowCount={visibleCriteriaCount}
              isEvaluationInProgress={isPlaybackActive}
            />
          </section>

          <section className="card" style={{ marginTop: 28 }}>
            <span className="section-label">Audit Trail</span>
            <div style={{ marginTop: 20 }}>
              <AuditTrailCard
                selectedEvaluation={selectedEvaluation}
                visibleEventCount={visibleAuditCount}
                isEvaluationInProgress={isPlaybackActive}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}
