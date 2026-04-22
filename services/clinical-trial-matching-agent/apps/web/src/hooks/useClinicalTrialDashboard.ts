"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  activateTrial,
  getEvaluations,
  getPatients,
  getPatientsForTrial,
  getReviews,
  getTrials,
  removeEvaluation,
  resetDemoData,
  startEvaluation,
  type Evaluation,
  type Patient,
  type ReviewTask,
  type Trial,
  type WorkflowEvent,
} from "@/lib/api";
import {
  dedupeEvaluationsByPatient,
  sortPatientsForTrial,
} from "@/components/clinical-trial-matching-agent/dashboardUtils";

type ModalPatient = {
  id: string;
  name: string;
  age: number | null;
  sex: string | null;
  diagnosis: string;
  score: number | null;
  outcome:
    | "likely_match"
    | "possible_match"
    | "review"
    | "unlikely_match"
    | null;
  summary: string;
};

function mapPatientOutcome(
  outcome: Patient["seeded_outcome"],
): ModalPatient["outcome"] {
  if (outcome === "Likely Match") return "likely_match";
  if (outcome === "Possible Match") return "possible_match";
  if (outcome === "Requires Review") return "review";
  if (outcome === "Not Eligible") return "unlikely_match";
  return null;
}

function mapPatientsToModalRows(patients: Patient[]): ModalPatient[] {
  return patients.map((patient) => ({
    id: patient.id,
    name: patient.display_name,
    age: patient.age ?? null,
    sex: patient.sex ?? null,
    diagnosis: patient.diagnosis.length ? patient.diagnosis.join(", ") : "—",
    score:
      typeof patient.seeded_score === "number"
        ? patient.seeded_score / 100
        : null,
    outcome: mapPatientOutcome(patient.seeded_outcome),
    summary: patient.notes.length
      ? patient.notes.join(" ")
      : patient.seeded_reason || "No summary available.",
  }));
}

function buildHumanReviewEvent(
  decision: "approved" | "rejected",
  note?: string,
): WorkflowEvent {
  return {
    stage: "human_review",
    label: "Human Review",
    status: "complete",
    detail:
      decision === "approved"
        ? note?.trim()
          ? `Approved by reviewer.\nNote: ${note.trim()}`
          : "Approved by reviewer."
        : note?.trim()
          ? `Rejected by reviewer.\nNote: ${note.trim()}`
          : "Rejected by reviewer.",
    timestamp: new Date().toISOString(),
  };
}

export function useClinicalTrialDashboard() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [reviews, setReviews] = useState<ReviewTask[]>([]);
  const [activeTrialId, setActiveTrialId] = useState("");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState("");
  const [activeReviewEvaluationId, setActiveReviewEvaluationId] = useState<
    string | null
  >(null);
  const [reviewNote, setReviewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingEvaluation, setIsStartingEvaluation] = useState(false);
  const [isChangingTrial, setIsChangingTrial] = useState(false);
  const [isResettingDemo, setIsResettingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientModalError, setPatientModalError] = useState<string | null>(
    null,
  );
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isChangeTrialModalOpen, setIsChangeTrialModalOpen] = useState(false);
  const [trialPatients, setTrialPatients] = useState<Patient[]>([]);
  const [isLoadingTrialPatients, setIsLoadingTrialPatients] = useState(false);
  const [startedEvaluationId, setStartedEvaluationId] = useState<string | null>(
    null,
  );
  const [playbackSequenceKey, setPlaybackSequenceKey] = useState(0);

  const loadDashboard = useCallback(async (preferredEvaluationId?: string) => {
    setError(null);

    const trialResponse = await getTrials();
    const nextTrials = trialResponse.items || [];
    const resolvedActiveTrialId =
      trialResponse.active_trial_id || nextTrials[0]?.id || "";

    const [patientResponse, evaluationResponse, reviewResponse] =
      await Promise.all([
        getPatients(),
        resolvedActiveTrialId
          ? getEvaluations(resolvedActiveTrialId)
          : Promise.resolve({ items: [] as Evaluation[] }),
        getReviews(),
      ]);

    const uniqueEvaluations = dedupeEvaluationsByPatient(
      evaluationResponse.items || [],
    );

    setTrials(nextTrials);
    setActiveTrialId(resolvedActiveTrialId);
    setPatients(patientResponse.items || []);
    setEvaluations(uniqueEvaluations);
    setReviews(reviewResponse.items || []);

    const nextSelected =
      preferredEvaluationId ||
      uniqueEvaluations.find(
        (item) => item.recommendation === "Requires Review",
      )?.id ||
      uniqueEvaluations[0]?.id ||
      "";

    setSelectedEvaluationId(nextSelected);
  }, []);

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
  }, [loadDashboard]);

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
    () => mapPatientsToModalRows(availableTrialPatients),
    [availableTrialPatients],
  );

  const activeReviewEvaluation = useMemo(
    () =>
      evaluations.find(
        (evaluation) => evaluation.id === activeReviewEvaluationId,
      ) || null,
    [evaluations, activeReviewEvaluationId],
  );

  const activeReviewPatient = useMemo(() => {
    if (!activeReviewEvaluation) return null;

    return (
      patients.find(
        (patient) => patient.id === activeReviewEvaluation.patient_id,
      ) || null
    );
  }, [patients, activeReviewEvaluation]);

  const handleRemoveEvaluation = useCallback(
    async (evaluationId: string) => {
      try {
        setError(null);
        await removeEvaluation(evaluationId);

        const removingSelected = selectedEvaluationId === evaluationId;
        await loadDashboard(
          removingSelected ? undefined : selectedEvaluationId,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to remove evaluation from worklist.";
        setError(message);
      }
    },
    [loadDashboard, selectedEvaluationId],
  );

  const handleResetDemo = useCallback(async () => {
    try {
      setIsResettingDemo(true);
      setError(null);
      setPatientModalError(null);
      setIsPatientModalOpen(false);
      setIsChangeTrialModalOpen(false);
      setActiveReviewEvaluationId(null);
      setReviewNote("");
      setStartedEvaluationId(null);
      setPlaybackSequenceKey(0);

      await resetDemoData();
      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reset demo data.";
      setError(message);
    } finally {
      setIsResettingDemo(false);
    }
  }, [loadDashboard]);

  const handleOpenPatientModal = useCallback(async () => {
    if (!activeTrial || isStartingEvaluation) {
      if (!activeTrial) {
        setError("No active trial is available. Select a trial first.");
      }
      return;
    }

    setError(null);
    setPatientModalError(null);
    setTrialPatients([]);
    setIsPatientModalOpen(true);
    setIsLoadingTrialPatients(true);

    try {
      const response = await getPatientsForTrial(activeTrial.id);
      setTrialPatients(response.items || []);
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
  }, [activeTrial, isStartingEvaluation]);

  const handleSelectPatient = useCallback(
    async (patient: Patient) => {
      if (!activeTrial || isStartingEvaluation) return;

      setIsStartingEvaluation(true);
      setError(null);
      setPatientModalError(null);

      try {
        const evaluation = await startEvaluation(patient.id, activeTrial.id);
        setIsPatientModalOpen(false);
        setTrialPatients([]);
        setStartedEvaluationId(evaluation.id);
        setPlaybackSequenceKey((prev) => prev + 1);
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
    },
    [activeTrial, isStartingEvaluation, loadDashboard],
  );

  const handleStartEvaluationFromModal = useCallback(
    (patient: { id: string }) => {
      const fullPatient = availableTrialPatients.find(
        (item) => item.id === patient.id,
      );
      if (!fullPatient) return;

      void handleSelectPatient(fullPatient);
    },
    [availableTrialPatients, handleSelectPatient],
  );

  const handleOpenChangeTrialModal = useCallback(() => {
    setIsChangeTrialModalOpen(true);
  }, []);

  const handleCloseChangeTrialModal = useCallback(() => {
    setIsChangeTrialModalOpen(false);
  }, []);

  const handleSelectTrial = useCallback(
    async (trialId: string) => {
      if (!trialId || isChangingTrial) return;

      if (trialId === activeTrialId) {
        setIsChangeTrialModalOpen(false);
        return;
      }

      setIsChangingTrial(true);
      setError(null);

      try {
        await activateTrial(trialId);
        setActiveReviewEvaluationId(null);
        setReviewNote("");
        setStartedEvaluationId(null);
        setIsChangeTrialModalOpen(false);
        await loadDashboard();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to change trial.";
        setError(message);
      } finally {
        setIsChangingTrial(false);
      }
    },
    [activeTrialId, isChangingTrial, loadDashboard],
  );

  const handleReplayWorkflow = useCallback(() => {
    if (!selectedEvaluation) return;

    setActiveReviewEvaluationId(null);
    setReviewNote("");
    setStartedEvaluationId(selectedEvaluation.id);
    setSelectedEvaluationId(selectedEvaluation.id);
    setPlaybackSequenceKey((prev) => prev + 1);
  }, [selectedEvaluation]);

  const handleClosePatientModal = useCallback(() => {
    setIsPatientModalOpen(false);
    setIsLoadingTrialPatients(false);
    setPatientModalError(null);
    setTrialPatients([]);
  }, []);

  const handleOpenReview = useCallback((evaluationId: string) => {
    setActiveReviewEvaluationId(evaluationId);
    setReviewNote("");
    setSelectedEvaluationId(evaluationId);
  }, []);

  const handleCloseReview = useCallback(() => {
    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, []);

  const handleApproveReview = useCallback(() => {
    if (!activeReviewEvaluation) return;

    const note = reviewNote.trim();
    const reviewEvent = buildHumanReviewEvent("approved", note);

    setEvaluations((prev) =>
      prev.map((evaluation) =>
        evaluation.id === activeReviewEvaluation.id
          ? {
              ...evaluation,
              recommendation: "Approved" as Evaluation["recommendation"],
              review_required: false,
              explanation: note
                ? `${evaluation.explanation} Reviewer note: ${note}`
                : evaluation.explanation,
              workflow_events: [
                ...(evaluation.workflow_events || []),
                reviewEvent,
              ] as WorkflowEvent[],
            }
          : evaluation,
      ),
    );

    setReviews((prev) =>
      prev.map((review) =>
        review.patient_id === activeReviewEvaluation.patient_id &&
        review.trial_id === activeTrialId &&
        review.review_status !== "Resolved"
          ? {
              ...review,
              review_status: "Resolved",
            }
          : review,
      ),
    );

    setSelectedEvaluationId(activeReviewEvaluation.id);
    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, [activeReviewEvaluation, reviewNote, activeTrialId]);

  const handleRejectReview = useCallback(() => {
    if (!activeReviewEvaluation) return;

    const note = reviewNote.trim();
    const reviewEvent = buildHumanReviewEvent("rejected", note);

    setEvaluations((prev) =>
      prev.map((evaluation) =>
        evaluation.id === activeReviewEvaluation.id
          ? {
              ...evaluation,
              recommendation: "Rejected" as Evaluation["recommendation"],
              review_required: false,
              explanation: note
                ? `${evaluation.explanation} Reviewer note: ${note}`
                : evaluation.explanation,
              workflow_events: [
                ...(evaluation.workflow_events || []),
                reviewEvent,
              ] as WorkflowEvent[],
            }
          : evaluation,
      ),
    );

    setReviews((prev) =>
      prev.map((review) =>
        review.patient_id === activeReviewEvaluation.patient_id &&
        review.trial_id === activeTrialId &&
        review.review_status !== "Resolved"
          ? {
              ...review,
              review_status: "Resolved",
            }
          : review,
      ),
    );

    setSelectedEvaluationId(activeReviewEvaluation.id);
    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, [activeReviewEvaluation, reviewNote, activeTrialId]);

  return {
    isLoading,
    trials,
    activeTrial,
    activeTrialId,
    selectedPatient,
    selectedEvaluation,
    evaluations,
    patients,
    reviewCards,
    error,
    patientModalError,
    isLoadingTrialPatients,
    isStartingEvaluation,
    isChangingTrial,
    isResettingDemo,
    isPatientModalOpen,
    isChangeTrialModalOpen,
    modalPatients,
    activeReviewEvaluation,
    activeReviewPatient,
    reviewNote,
    startedEvaluationId,
    playbackSequenceKey,
    setReviewNote,
    setSelectedEvaluationId,
    handleOpenPatientModal,
    handleOpenChangeTrialModal,
    handleSelectTrial,
    handleReplayWorkflow,
    handleResetDemo,
    handleClosePatientModal,
    handleCloseChangeTrialModal,
    handleStartEvaluationFromModal,
    handleOpenReview,
    handleCloseReview,
    handleApproveReview,
    handleRejectReview,
    handleRemoveEvaluation,
  };
}
