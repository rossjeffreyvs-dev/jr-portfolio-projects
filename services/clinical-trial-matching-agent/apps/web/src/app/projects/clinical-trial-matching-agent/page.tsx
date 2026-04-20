"use client";

import PatientSelectorModal from "@/components/PatientSelectorModal";
import ClinicalTrialDashboard from "@/components/clinical-trial-matching-agent/ClinicalTrialDashboard";
import { useClinicalTrialDashboard } from "@/hooks/useClinicalTrialDashboard";

export default function ClinicalTrialProjectPage() {
  const {
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
    setSelectedEvaluationId,
    handleOpenPatientModal,
    handleChangeTrial,
    handleReplayWorkflow,
    handleClosePatientModal,
    handleStartEvaluationFromModal,
  } = useClinicalTrialDashboard();

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
          onOpenPatientModal={handleOpenPatientModal}
          onChangeTrial={handleChangeTrial}
          onReplayWorkflow={handleReplayWorkflow}
          onSelectEvaluation={setSelectedEvaluationId}
        />

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
