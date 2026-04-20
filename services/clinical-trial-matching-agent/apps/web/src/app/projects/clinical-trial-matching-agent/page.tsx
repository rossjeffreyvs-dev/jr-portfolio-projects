"use client";

import { useEffect, useMemo, useState } from "react";
import {
  activateTrial,
  getEvaluations,
  getPatients,
  getPatientsForTrial,
  getReviews,
  getTrials,
  startEvaluation,
  type Evaluation,
  type Patient,
  type ReviewTask,
  type Trial,
} from "@/lib/api";
import PatientSelectorModal from "@/components/PatientSelectorModal";
import AuditTrailCard from "@/components/clinical-trial-matching-agent/AuditTrailCard";
import CriteriaMatchTable from "@/components/clinical-trial-matching-agent/CriteriaMatchTable";
import DashboardControls from "@/components/clinical-trial-matching-agent/DashboardControls";
import PatientSummaryCard from "@/components/clinical-trial-matching-agent/PatientSummaryCard";
import RecommendationCard from "@/components/clinical-trial-matching-agent/RecommendationCard";
import SelectedCaseSummaryCard from "@/components/clinical-trial-matching-agent/SelectedCaseSummaryCard";
import TrialContextStrip from "@/components/clinical-trial-matching-agent/TrialContextStrip";
import TrialSummaryCard from "@/components/clinical-trial-matching-agent/TrialSummaryCard";
import TrialWorklist from "@/components/clinical-trial-matching-agent/TrialWorklist";
import WorkflowActivityCard from "@/components/clinical-trial-matching-agent/WorkflowActivityCard";
import {
  dedupeEvaluationsByPatient,
  sortPatientsForTrial,
} from "@/components/clinical-trial-matching-agent/dashboardUtils";

export default function ClinicalTrialProjectPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [reviews, setReviews] = useState<ReviewTask[]>([]);
  const [activeTrialId, setActiveTrialId] = useState<string>("");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingEvaluation, setIsStartingEvaluation] = useState(false);
  const [isChangingTrial, setIsChangingTrial] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientModalError, setPatientModalError] = useState<string | null>(
    null,
  );
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [trialPatients, setTrialPatients] = useState<Patient[]>([]);
  const [isLoadingTrialPatients, setIsLoadingTrialPatients] = useState(false);

  async function loadDashboard(preferredEvaluationId?: string) {
    setError(null);

    const trialResponse = await getTrials();
    const activeId = trialResponse.active_trial_id;

    const [patientResponse, evaluationResponse, reviewResponse] =
      await Promise.all([
        getPatients(),
        getEvaluations(activeId),
        getReviews(),
      ]);

    const uniqueEvaluations = dedupeEvaluationsByPatient(
      evaluationResponse.items,
    );

    setTrials(trialResponse.items);
    setActiveTrialId(activeId);
    setPatients(patientResponse.items);
    setEvaluations(uniqueEvaluations);
    setReviews(reviewResponse.items);

    const nextSelected =
      preferredEvaluationId ||
      uniqueEvaluations.find(
        (item) => item.recommendation === "Requires Review",
      )?.id ||
      uniqueEvaluations[0]?.id ||
      "";

    setSelectedEvaluationId(nextSelected);
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        await loadDashboard();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);

  const activeTrial = useMemo(
    () => trials.find((trial) => trial.id === activeTrialId) || trials[0],
    [trials, activeTrialId],
  );

  const selectedEvaluation = useMemo(
    () =>
      evaluations.find(
        (evaluation) => evaluation.id === selectedEvaluationId,
      ) || evaluations[0],
    [evaluations, selectedEvaluationId],
  );

  const selectedPatient = useMemo(
    () =>
      patients.find((patient) => patient.id === selectedEvaluation?.patient_id),
    [patients, selectedEvaluation],
  );

  const reviewCards = useMemo(
    () =>
      reviews.filter(
        (review) =>
          review.review_status !== "Resolved" &&
          review.trial_id === activeTrialId,
      ),
    [reviews, activeTrialId],
  );

  const queuedPatientIds = useMemo(
    () => new Set(evaluations.map((evaluation) => evaluation.patient_id)),
    [evaluations],
  );

  const availableTrialPatients = useMemo(
    () =>
      sortPatientsForTrial(
        trialPatients.filter((patient) => !queuedPatientIds.has(patient.id)),
      ),
    [trialPatients, queuedPatientIds],
  );

  const modalPatients = useMemo(
    () =>
      availableTrialPatients.map((patient) => ({
        id: patient.id,
        name: patient.display_name,
        age: patient.age ?? null,
        sex: patient.sex ?? null,
        diagnosis: patient.diagnosis.length
          ? patient.diagnosis.join(", ")
          : "—",
        score:
          typeof patient.seeded_score === "number"
            ? patient.seeded_score / 100
            : null,
        outcome:
          patient.seeded_outcome === "Likely Match"
            ? "likely_match"
            : patient.seeded_outcome === "Possible Match"
              ? "possible_match"
              : patient.seeded_outcome === "Requires Review"
                ? "review"
                : patient.seeded_outcome === "Not Eligible"
                  ? "unlikely_match"
                  : null,
        summary: patient.notes.length
          ? patient.notes.join(" ")
          : patient.seeded_reason || "No summary available.",
      })),
    [availableTrialPatients],
  );

  async function handleOpenPatientModal() {
    if (!activeTrial || isStartingEvaluation) return;

    setError(null);
    setPatientModalError(null);
    setTrialPatients([]);
    setIsPatientModalOpen(true);
    setIsLoadingTrialPatients(true);

    try {
      const response = await getPatientsForTrial(activeTrial.id);
      setTrialPatients(response.items);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load patients for this trial.";
      setError(message);
      setPatientModalError(message);
      setTrialPatients([]);
    } finally {
      setIsLoadingTrialPatients(false);
    }
  }

  async function handleSelectPatient(patient: Patient) {
    if (!activeTrial || isStartingEvaluation) return;

    setIsStartingEvaluation(true);
    setError(null);
    setPatientModalError(null);

    try {
      const evaluation = await startEvaluation(patient.id, activeTrial.id);
      setIsPatientModalOpen(false);
      setTrialPatients([]);
      await loadDashboard(evaluation.id);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to start a new evaluation.";
      setError(message);
      setPatientModalError(message);
    } finally {
      setIsStartingEvaluation(false);
    }
  }

  function handleStartEvaluationFromModal(patient: { id: string }) {
    const fullPatient = availableTrialPatients.find(
      (item) => item.id === patient.id,
    );

    if (!fullPatient) return;

    void handleSelectPatient(fullPatient);
  }

  async function handleChangeTrial() {
    if (trials.length <= 1 || isChangingTrial) return;

    setIsChangingTrial(true);
    setError(null);

    try {
      const currentIndex = trials.findIndex(
        (trial) => trial.id === activeTrialId,
      );
      const nextTrial = trials[(currentIndex + 1) % trials.length] || trials[0];

      await activateTrial(nextTrial.id);
      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to change trial.";
      setError(message);
    } finally {
      setIsChangingTrial(false);
    }
  }

  function handleReplayWorkflow() {
    if (selectedEvaluation) {
      setSelectedEvaluationId(selectedEvaluation.id);
    }
  }

  function handleClosePatientModal() {
    setIsPatientModalOpen(false);
    setIsLoadingTrialPatients(false);
    setPatientModalError(null);
    setTrialPatients([]);
  }

  if (isLoading) {
    return (
      <div className="page-shell">
        <main className="container">
          <section className="hero">
            <h1>Multi-Agent Clinical Trial Matching System</h1>
            <p>Loading dashboard data from the local API…</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark">JR</div>
          <div>Projects</div>
        </div>

        <nav className="top-nav">
          <a href="#">Home</a>
          <a href="#" className="active">
            Projects
          </a>
          <a href="#">Blog</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Multi-Agent Clinical Trial Matching System</h1>
          <p>
            Evaluate patient eligibility against clinical trial criteria using a
            simulated agent workflow spanning patient context building,
            matching, explanation, and human review.
          </p>

          <div className="tab-row">
            <button className="tab-btn">Project Description</button>
            <button className="tab-btn active">Demo</button>
          </div>
        </section>

        <DashboardControls
          activeTrialTitle={activeTrial?.title}
          selectedPatientLabel={
            selectedPatient?.display_name ||
            selectedPatient?.id ||
            "No patient selected"
          }
          latestRecommendation={selectedEvaluation?.recommendation}
          isLoadingTrialPatients={isLoadingTrialPatients}
          isChangingTrial={isChangingTrial}
          hasSelectedEvaluation={Boolean(selectedEvaluation)}
          error={error}
          onOpenPatientModal={handleOpenPatientModal}
          onChangeTrial={handleChangeTrial}
          onReplayWorkflow={handleReplayWorkflow}
        />

        <TrialContextStrip
          activeTrial={activeTrial}
          selectedPatient={selectedPatient}
          selectedEvaluation={selectedEvaluation}
        />

        <TrialWorklist
          evaluations={evaluations}
          patients={patients}
          reviewCards={reviewCards}
          selectedEvaluationId={selectedEvaluation?.id}
          onSelectEvaluation={setSelectedEvaluationId}
        />

        <section className="dashboard-grid">
          <SelectedCaseSummaryCard
            selectedEvaluation={selectedEvaluation}
            selectedPatient={selectedPatient}
            activeTrial={activeTrial}
          />

          <RecommendationCard selectedEvaluation={selectedEvaluation} />

          <WorkflowActivityCard selectedEvaluation={selectedEvaluation} />

          <AuditTrailCard selectedEvaluation={selectedEvaluation} />

          <PatientSummaryCard
            selectedPatient={selectedPatient}
            selectedEvaluation={selectedEvaluation}
          />

          <TrialSummaryCard activeTrial={activeTrial} />

          <CriteriaMatchTable selectedEvaluation={selectedEvaluation} />
        </section>

        <PatientSelectorModal
          isOpen={isPatientModalOpen}
          patients={modalPatients}
          trialTitle={activeTrial?.title}
          isLoading={isLoadingTrialPatients}
          isStartingEvaluation={isStartingEvaluation}
          patientActionLabel="Starting Evaluation..."
          onClose={handleClosePatientModal}
          onStartEvaluation={handleStartEvaluationFromModal}
        />

        {patientModalError ? (
          <div className="mt-4 text-sm text-red-600">{patientModalError}</div>
        ) : null}
      </main>
    </div>
  );
}
