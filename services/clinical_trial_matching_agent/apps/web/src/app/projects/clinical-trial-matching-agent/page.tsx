"use client";

import PatientSelectorModal from "@/components/PatientSelectorModal";
import ChangeTrialModal from "@/components/clinical-trial-matching-agent/ChangeTrialModal";
import ClinicalTrialDashboard from "@/components/clinical-trial-matching-agent/ClinicalTrialDashboard";
import ClinicalTrialPMPlaybook from "@/components/clinical-trial-matching-agent/ClinicalTrialPMPlaybook";
import ClinicalTrialProjectDescription from "@/components/clinical-trial-matching-agent/ClinicalTrialProjectDescription";
import ReviewCasePanel from "@/components/clinical-trial-matching-agent/ReviewCasePanel";
import { useClinicalTrialDashboard } from "@/hooks/useClinicalTrialDashboard";
import { useState } from "react";

type ActiveTab = "description" | "demo" | "playbook";

export default function ClinicalTrialProjectPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("description");

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

  return (
    <div className="page-shell">
      <header className="site-header">
        <a href="https://www.jeffrey-ross.me/projects">
          <div className="brand">
            <div className="brand-mark">JR</div>
            <div>Projects</div>
          </div>
        </a>

        <nav className="top-nav">
          <a href="https://www.jeffrey-ross.me">Home</a>
          <a href="https://www.jeffrey-ross.me/projects" className="active">
            Projects
          </a>
          <a href="https://www.jeffrey-ross.me/blog">Blog</a>
          <a href="https://www.jeffrey-ross.me/about">About</a>
          <a href="https://www.jeffrey-ross.me/contact">Contact</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Multi-Agent Clinical Trial Matching System</h1>
          <p>
            Evaluate patient eligibility against clinical trial criteria using a
            simulated agent workflow.
          </p>

          <div className="tabNav" role="tablist" aria-label="Project sections">
            <button
              type="button"
              className={`tabButton ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
              aria-selected={activeTab === "description"}
            >
              Project Description
            </button>

            <button
              type="button"
              className={`tabButton ${activeTab === "demo" ? "active" : ""}`}
              onClick={() => setActiveTab("demo")}
              aria-selected={activeTab === "demo"}
            >
              Demo
            </button>

            <button
              type="button"
              className={`tabButton ${
                activeTab === "playbook" ? "active" : ""
              }`}
              onClick={() => setActiveTab("playbook")}
              aria-selected={activeTab === "playbook"}
            >
              PM Playbook
            </button>
          </div>
        </section>

        {activeTab === "description" ? (
          <ClinicalTrialProjectDescription />
        ) : activeTab === "playbook" ? (
          <ClinicalTrialPMPlaybook />
        ) : isLoading ? (
          <div className="card">
            <div className="section-header">
              <h2>Loading dashboard data…</h2>
              <p>
                Preparing trials, patients, evaluations, workflow playback, and
                review state.
              </p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
