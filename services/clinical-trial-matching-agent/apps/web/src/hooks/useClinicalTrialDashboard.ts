"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

export function useClinicalTrialDashboard() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [reviews, setReviews] = useState<ReviewTask[]>([]);
  const [activeTrialId, setActiveTrialId] = useState<string>("");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>("");
  const [activeReviewEvaluationId, setActiveReviewEvaluationId] = useState<
    string | null
  >(null);
  const [reviewNote, setReviewNote] = useState("");
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

  const loadDashboard = useCallback(async (preferredEvaluationId?: string) => {
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

  const handleOpenPatientModal = useCallback(async () => {
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

  const handleChangeTrial = useCallback(async () => {
    if (trials.length <= 1 || isChangingTrial) return;

    setIsChangingTrial(true);
    setError(null);

    try {
      const currentIndex = trials.findIndex(
        (trial) => trial.id === activeTrialId,
      );
      const nextTrial = trials[(currentIndex + 1) % trials.length] || trials[0];

      await activateTrial(nextTrial.id);
      setActiveReviewEvaluationId(null);
      setReviewNote("");
      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to change trial.";
      setError(message);
    } finally {
      setIsChangingTrial(false);
    }
  }, [trials, isChangingTrial, activeTrialId, loadDashboard]);

  const handleReplayWorkflow = useCallback(() => {
    if (selectedEvaluation) {
      setSelectedEvaluationId(selectedEvaluation.id);
    }
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

    console.log("approve review", {
      evaluationId: activeReviewEvaluation.id,
      note: reviewNote,
    });

    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, [activeReviewEvaluation, reviewNote]);

  const handleRejectReview = useCallback(() => {
    if (!activeReviewEvaluation) return;

    console.log("reject review", {
      evaluationId: activeReviewEvaluation.id,
      note: reviewNote,
    });

    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, [activeReviewEvaluation, reviewNote]);

  return {
    isLoading,
    activeTrial,
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
    isPatientModalOpen,
    modalPatients,
    activeReviewEvaluation,
    activeReviewPatient,
    reviewNote,
    setReviewNote,
    setSelectedEvaluationId,
    handleOpenPatientModal,
    handleChangeTrial,
    handleReplayWorkflow,
    handleClosePatientModal,
    handleStartEvaluationFromModal,
    handleOpenReview,
    handleCloseReview,
    handleApproveReview,
    handleRejectReview,
  };
}
