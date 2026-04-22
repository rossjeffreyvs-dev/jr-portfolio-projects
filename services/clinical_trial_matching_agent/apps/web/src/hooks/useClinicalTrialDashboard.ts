"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  activateTrial,
  getEvaluations,
  getPatients,
  getPatientsForTrial,
  getReviews,
  getSemanticQuerySuggestions,
  getTrials,
  removeEvaluation,
  resetDemoData,
  semanticSearchPatients,
  startEvaluation,
  type Evaluation,
  type Patient,
  type ReviewTask,
  type SemanticQuerySuggestion,
  type SemanticSearchResult,
  type Trial,
} from "@/lib/api";
import {
  dedupeEvaluationsByPatient,
  sortPatientsForTrial,
} from "@/components/clinical-trial-matching-agent/dashboardUtils";

export type ModalPatient = {
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
  semanticExplanation?: string | null;
  semanticMatchedTerms?: string[];
  semanticRank?: number | null;
  isSemanticResult?: boolean;
};

function mapPatientOutcome(
  outcome: Patient["seeded_outcome"],
): ModalPatient["outcome"] {
  if (outcome === "Likely Match") return "likely_match";
  if (outcome === "Requires Review") return "review";
  if (outcome === "Not Eligible") return "unlikely_match";
  if (outcome === "Possible Match") return "possible_match";
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
    semanticExplanation: null,
    semanticMatchedTerms: [],
    semanticRank: null,
    isSemanticResult: false,
  }));
}

function normalizeSemanticResults(
  results: SemanticSearchResult[],
): SemanticSearchResult[] {
  return [...results].sort((left, right) => {
    const leftRank =
      typeof left.rank === "number" && Number.isFinite(left.rank)
        ? left.rank
        : Number.POSITIVE_INFINITY;
    const rightRank =
      typeof right.rank === "number" && Number.isFinite(right.rank)
        ? right.rank
        : Number.POSITIVE_INFINITY;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    const leftScore =
      typeof left.score === "number" && Number.isFinite(left.score)
        ? left.score
        : -1;
    const rightScore =
      typeof right.score === "number" && Number.isFinite(right.score)
        ? right.score
        : -1;

    return rightScore - leftScore;
  });
}

function mapSemanticResultsToModalRows(
  results: SemanticSearchResult[],
): ModalPatient[] {
  return results.map((item) => ({
    id: item.patient.id,
    name: item.patient.display_name,
    age: item.patient.age ?? null,
    sex: item.patient.sex ?? null,
    diagnosis: item.patient.diagnosis.length
      ? item.patient.diagnosis.join(", ")
      : "—",
    score: typeof item.score === "number" ? item.score / 100 : null,
    outcome: mapPatientOutcome(item.patient.seeded_outcome),
    summary: item.patient.seeded_reason || "No summary available.",
    semanticExplanation: item.explanation,
    semanticMatchedTerms: item.matched_terms || [],
    semanticRank: item.rank ?? null,
    isSemanticResult: true,
  }));
}

function updateEvaluationRecommendation(
  evaluation: Evaluation,
  decision: "approve" | "reject",
  note: string,
): Evaluation {
  const approved = decision === "approve";

  return {
    ...evaluation,
    recommendation: approved ? "Approved" : "Rejected",
    workflow_status: "Completed",
    review_required: false,
    reviewer_action: note.trim() || (approved ? "Approved" : "Rejected"),
    review_reason: approved ? [] : evaluation.review_reason,
  };
}

function updateReviewTask(
  review: ReviewTask,
  decision: "approve" | "reject",
  note: string,
): ReviewTask {
  return {
    ...review,
    review_status: "Resolved",
    reviewer_decision: decision,
    reviewer_note: note.trim() || null,
  };
}

function getFallbackSemanticQuery(trial?: Trial): string {
  if (!trial) return "";

  const title = trial.title.toLowerCase();

  if (title.includes("breast")) {
    return "HER2-low metastatic breast cancer patient appropriate for targeted therapy";
  }

  if (title.includes("lung")) {
    return "lung cancer immunotherapy candidate with metastatic disease";
  }

  if (
    title.includes("heme") ||
    title.includes("hematologic") ||
    title.includes("lymphoma") ||
    title.includes("leukemia")
  ) {
    return "hematologic malignancy patient with prior systemic treatment";
  }

  return "eligible candidate for trial";
}

export function useClinicalTrialDashboard() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [reviews, setReviews] = useState<ReviewTask[]>([]);
  const [activeTrialId, setActiveTrialId] = useState("");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState("");
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

  const [semanticQuery, setSemanticQuery] = useState("");
  const [semanticSuggestions, setSemanticSuggestions] = useState<
    SemanticQuerySuggestion[]
  >([]);
  const [semanticResults, setSemanticResults] = useState<
    SemanticSearchResult[]
  >([]);
  const [isSemanticSearchLoading, setIsSemanticSearchLoading] = useState(false);
  const [semanticSearchError, setSemanticSearchError] = useState<string | null>(
    null,
  );
  const [hasRunSemanticSearch, setHasRunSemanticSearch] = useState(false);

  const [activeReviewEvaluationId, setActiveReviewEvaluationId] = useState<
    string | null
  >(null);
  const [reviewNote, setReviewNote] = useState("");

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

    return {
      trials: nextTrials,
      activeTrialId: resolvedActiveTrialId,
      evaluations: uniqueEvaluations,
      reviews: reviewResponse.items || [],
      patients: patientResponse.items || [],
    };
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

  const activeReviewEvaluation = useMemo(() => {
    if (!activeReviewEvaluationId) return undefined;
    return evaluations.find((item) => item.id === activeReviewEvaluationId);
  }, [activeReviewEvaluationId, evaluations]);

  const activeReviewPatient = useMemo(() => {
    if (!activeReviewEvaluation) return undefined;
    return patients.find(
      (patient) => patient.id === activeReviewEvaluation.patient_id,
    );
  }, [activeReviewEvaluation, patients]);

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

  const fallbackModalPatients = useMemo(
    () => mapPatientsToModalRows(availableTrialPatients),
    [availableTrialPatients],
  );

  const semanticModalPatients = useMemo(
    () => mapSemanticResultsToModalRows(semanticResults),
    [semanticResults],
  );

  const modalPatients = useMemo(() => {
    if (hasRunSemanticSearch) {
      return semanticModalPatients;
    }
    return fallbackModalPatients;
  }, [fallbackModalPatients, hasRunSemanticSearch, semanticModalPatients]);

  const resetSemanticState = useCallback(() => {
    setSemanticQuery("");
    setSemanticResults([]);
    setSemanticSearchError(null);
    setHasRunSemanticSearch(false);
  }, []);

  const loadSemanticSuggestions = useCallback(async (trialId: string) => {
    const response = await getSemanticQuerySuggestions(trialId);
    setSemanticSuggestions(response.items || []);
  }, []);

  const handleRunSemanticSearch = useCallback(
    async (nextQuery?: string) => {
      if (!activeTrial) return;

      const resolvedQuery = (nextQuery ?? semanticQuery).trim();
      setSemanticSearchError(null);

      if (resolvedQuery.length < 3) {
        setSemanticSearchError(
          "Enter at least 3 characters to run semantic search.",
        );
        return;
      }

      setIsSemanticSearchLoading(true);

      try {
        const response = await semanticSearchPatients({
          trial_id: activeTrial.id,
          query: resolvedQuery,
          top_k: 10,
        });

        const normalizedResults = normalizeSemanticResults(
          response.items || [],
        );

        setSemanticQuery(resolvedQuery);
        setSemanticResults(normalizedResults);
        setSemanticSuggestions(response.suggestions || []);
        setHasRunSemanticSearch(true);

        return normalizedResults;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to run semantic search.";
        setSemanticSearchError(message);
        return undefined;
      } finally {
        setIsSemanticSearchLoading(false);
      }
    },
    [activeTrial, semanticQuery],
  );

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
    resetSemanticState();
    setIsPatientModalOpen(true);
    setIsLoadingTrialPatients(true);

    try {
      const [patientResponse, suggestionsResponse] = await Promise.all([
        getPatientsForTrial(activeTrial.id),
        getSemanticQuerySuggestions(activeTrial.id),
      ]);

      const nextTrialPatients = patientResponse.items || [];
      const nextSuggestions = suggestionsResponse.items || [];
      const defaultQuery =
        nextSuggestions[0]?.query?.trim() ||
        getFallbackSemanticQuery(activeTrial);

      setTrialPatients(nextTrialPatients);
      setSemanticSuggestions(nextSuggestions);

      if (defaultQuery.length >= 3) {
        setSemanticQuery(defaultQuery);
        await handleRunSemanticSearch(defaultQuery);
      } else {
        setSemanticQuery(defaultQuery);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load patients for this trial.";
      setError(message);
      setPatientModalError(message);
      setTrialPatients([]);
      setSemanticSuggestions([]);
    } finally {
      setIsLoadingTrialPatients(false);
    }
  }, [
    activeTrial,
    handleRunSemanticSearch,
    isStartingEvaluation,
    resetSemanticState,
  ]);

  const handleSelectSemanticSuggestion = useCallback(
    async (suggestion: SemanticQuerySuggestion) => {
      setSemanticQuery(suggestion.query);
      await handleRunSemanticSearch(suggestion.query);
    },
    [handleRunSemanticSearch],
  );

  const handleResetPatientSearch = useCallback(async () => {
    resetSemanticState();

    if (!activeTrial) return;

    try {
      const [patientResponse, suggestionsResponse] = await Promise.all([
        getPatientsForTrial(activeTrial.id),
        getSemanticQuerySuggestions(activeTrial.id),
      ]);

      setTrialPatients(patientResponse.items || []);
      setSemanticSuggestions(suggestionsResponse.items || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reset patient list.";
      setSemanticSearchError(message);
    }
  }, [activeTrial, resetSemanticState]);

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
        resetSemanticState();

        await loadDashboard(evaluation.id);

        setSelectedEvaluationId(evaluation.id);
        setStartedEvaluationId(evaluation.id);
        setPlaybackSequenceKey((current) => current + 1);
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
    [activeTrial, isStartingEvaluation, loadDashboard, resetSemanticState],
  );

  const handleStartEvaluationFromModal = useCallback(
    (patient: { id: string }) => {
      const sourcePatients = hasRunSemanticSearch
        ? semanticResults.map((item) => item.patient)
        : availableTrialPatients;

      const fullPatient = sourcePatients.find((item) => item.id === patient.id);
      if (!fullPatient) return;

      void handleSelectPatient(fullPatient);
    },
    [
      availableTrialPatients,
      handleSelectPatient,
      hasRunSemanticSearch,
      semanticResults,
    ],
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
        setIsChangeTrialModalOpen(false);
        resetSemanticState();
        setStartedEvaluationId(null);
        setPlaybackSequenceKey(0);
        await loadDashboard();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to change trial.";
        setError(message);
      } finally {
        setIsChangingTrial(false);
      }
    },
    [activeTrialId, isChangingTrial, loadDashboard, resetSemanticState],
  );

  const handleReplayWorkflow = useCallback(() => {
    if (!selectedEvaluation) return;

    setStartedEvaluationId(selectedEvaluation.id);
    setPlaybackSequenceKey((current) => current + 1);
  }, [selectedEvaluation]);

  const handleResetDemo = useCallback(async () => {
    setIsResettingDemo(true);
    setError(null);

    try {
      await resetDemoData();
      setIsPatientModalOpen(false);
      setIsChangeTrialModalOpen(false);
      setActiveReviewEvaluationId(null);
      setReviewNote("");
      setStartedEvaluationId(null);
      setPlaybackSequenceKey(0);
      resetSemanticState();
      await loadDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reset demo data.";
      setError(message);
    } finally {
      setIsResettingDemo(false);
    }
  }, [loadDashboard, resetSemanticState]);

  const handleOpenReview = useCallback(
    (evaluationId: string) => {
      const evaluation = evaluations.find((item) => item.id === evaluationId);
      setActiveReviewEvaluationId(evaluationId);
      setReviewNote(evaluation?.reviewer_action || "");
    },
    [evaluations],
  );

  const handleCloseReview = useCallback(() => {
    setActiveReviewEvaluationId(null);
    setReviewNote("");
  }, []);

  const applyReviewDecision = useCallback(
    (decision: "approve" | "reject") => {
      if (!activeReviewEvaluation) return;

      const nextEvaluation = updateEvaluationRecommendation(
        activeReviewEvaluation,
        decision,
        reviewNote,
      );

      setEvaluations((current) =>
        dedupeEvaluationsByPatient(
          current.map((item) =>
            item.id === activeReviewEvaluation.id ? nextEvaluation : item,
          ),
        ),
      );

      setReviews((current) =>
        current.map((review) =>
          review.evaluation_id === activeReviewEvaluation.id
            ? updateReviewTask(review, decision, reviewNote)
            : review,
        ),
      );

      if (selectedEvaluationId === activeReviewEvaluation.id) {
        setSelectedEvaluationId(nextEvaluation.id);
      }

      handleCloseReview();
    },
    [
      activeReviewEvaluation,
      handleCloseReview,
      reviewNote,
      selectedEvaluationId,
    ],
  );

  const handleApproveReview = useCallback(() => {
    applyReviewDecision("approve");
  }, [applyReviewDecision]);

  const handleRejectReview = useCallback(() => {
    applyReviewDecision("reject");
  }, [applyReviewDecision]);

  const handleRemoveEvaluation = useCallback(
    async (evaluationId: string) => {
      setError(null);

      try {
        await removeEvaluation(evaluationId);

        setEvaluations((current) => {
          const remaining = current.filter((item) => item.id !== evaluationId);
          const deduped = dedupeEvaluationsByPatient(remaining);

          if (selectedEvaluationId === evaluationId) {
            setSelectedEvaluationId(deduped[0]?.id || "");
          }

          return deduped;
        });

        setReviews((current) =>
          current.filter((review) => review.evaluation_id !== evaluationId),
        );

        if (activeReviewEvaluationId === evaluationId) {
          handleCloseReview();
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to remove evaluation from worklist.";
        setError(message);
      }
    },
    [activeReviewEvaluationId, handleCloseReview, selectedEvaluationId],
  );

  const handleClosePatientModal = useCallback(() => {
    setIsPatientModalOpen(false);
    setIsLoadingTrialPatients(false);
    setPatientModalError(null);
    setTrialPatients([]);
    resetSemanticState();
  }, [resetSemanticState]);

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

    semanticQuery,
    semanticSuggestions,
    isSemanticSearchLoading,
    semanticSearchError,
    hasRunSemanticSearch,

    setReviewNote,
    setSemanticQuery,
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

    handleRunSemanticSearch,
    handleSelectSemanticSuggestion,
    handleResetPatientSearch,
    loadSemanticSuggestions,
  };
}
