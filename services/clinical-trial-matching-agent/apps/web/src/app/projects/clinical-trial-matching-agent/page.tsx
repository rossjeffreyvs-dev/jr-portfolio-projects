"use client";

import PatientSelectorModal from "@/components/PatientSelectorModal";
import ChangeTrialModal from "@/components/clinical-trial-matching-agent/ChangeTrialModal";
import ClinicalTrialDashboard from "@/components/clinical-trial-matching-agent/ClinicalTrialDashboard";
import ReviewCasePanel from "@/components/clinical-trial-matching-agent/ReviewCasePanel";
import { useClinicalTrialDashboard } from "@/hooks/useClinicalTrialDashboard";

export default function ClinicalTrialProjectPage() {
  const {
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
  } = useClinicalTrialDashboard();

  if (isLoading) {
    return (
      <div className="page-shell">
        <main className="container">
          <section className="hero">
            <h1>Multi-Agent Clinical Trial Matching System</h1>
            <p>Loading dashboard data…</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="container">
        <section className="hero">
          <h1>Multi-Agent Clinical Trial Matching System</h1>
          <p>
            Evaluate patient eligibility against clinical trial criteria using a
            simulated agent workflow.
          </p>
        </section>

        <ClinicalTrialDashboard
          activeTrial={activeTrial}
          selectedPatient={selectedPatient}
          selectedEvaluation={selectedEvaluation}
          evaluations={evaluations}
          patients={patients}
          reviewCards={reviewCards}
          error={error}
          isLoadingTrialPatients={isLoadingTrialPatients}
          isChangingTrial={isChangingTrial}
          isResettingDemo={isResettingDemo}
          startedEvaluationId={startedEvaluationId}
          playbackSequenceKey={playbackSequenceKey}
          onOpenPatientModal={handleOpenPatientModal}
          onChangeTrial={handleOpenChangeTrialModal}
          onReplayWorkflow={handleReplayWorkflow}
          onResetDemo={handleResetDemo}
          onSelectEvaluation={setSelectedEvaluationId}
          onReviewCase={handleOpenReview}
          onRemoveEvaluation={handleRemoveEvaluation}
        />

        <PatientSelectorModal
          isOpen={isPatientModalOpen}
          patients={modalPatients}
          trialTitle={activeTrial?.title}
          isLoading={isLoadingTrialPatients}
          isStartingEvaluation={isStartingEvaluation}
          onClose={handleClosePatientModal}
          onStartEvaluation={handleStartEvaluationFromModal}
          semanticQuery={semanticQuery}
          onSemanticQueryChange={setSemanticQuery}
          onRunSemanticSearch={() => void handleRunSemanticSearch()}
          onResetPatientSearch={() => void handleResetPatientSearch()}
          semanticSuggestions={semanticSuggestions}
          onSelectSemanticSuggestion={(suggestion) =>
            void handleSelectSemanticSuggestion(suggestion)
          }
          isSemanticSearchLoading={isSemanticSearchLoading}
          semanticSearchError={semanticSearchError}
          hasRunSemanticSearch={hasRunSemanticSearch}
        />

        <ChangeTrialModal
          isOpen={isChangeTrialModalOpen}
          trials={trials}
          activeTrialId={activeTrialId}
          isChangingTrial={isChangingTrial}
          onClose={handleCloseChangeTrialModal}
          onSelectTrial={handleSelectTrial}
        />

        <ReviewCasePanel
          isOpen={Boolean(activeReviewEvaluation)}
          evaluation={activeReviewEvaluation}
          patient={activeReviewPatient}
          reviewNote={reviewNote}
          onReviewNoteChange={setReviewNote}
          onApprove={handleApproveReview}
          onReject={handleRejectReview}
          onClose={handleCloseReview}
        />

        {patientModalError ? (
          <div className="error-text">{patientModalError}</div>
        ) : null}
      </main>
    </div>
  );
}
