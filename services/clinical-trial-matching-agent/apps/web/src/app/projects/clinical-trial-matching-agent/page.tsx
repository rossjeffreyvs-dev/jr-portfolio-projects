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
    handleClosePatientModal,
    handleCloseChangeTrialModal,
    handleStartEvaluationFromModal,
    handleOpenReview,
    handleCloseReview,
    handleApproveReview,
    handleRejectReview,
    handleRemoveEvaluation,
  } = useClinicalTrialDashboard();

  if (isLoading) {
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
          startedEvaluationId={startedEvaluationId}
          playbackSequenceKey={playbackSequenceKey}
          onOpenPatientModal={handleOpenPatientModal}
          onChangeTrial={handleOpenChangeTrialModal}
          onReplayWorkflow={handleReplayWorkflow}
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
          patientActionLabel={
            isStartingEvaluation
              ? "Loading patient + trial context..."
              : "Initializing evaluation..."
          }
          onClose={handleClosePatientModal}
          onStartEvaluation={handleStartEvaluationFromModal}
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
          evaluation={activeReviewEvaluation || undefined}
          patient={activeReviewPatient || undefined}
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
