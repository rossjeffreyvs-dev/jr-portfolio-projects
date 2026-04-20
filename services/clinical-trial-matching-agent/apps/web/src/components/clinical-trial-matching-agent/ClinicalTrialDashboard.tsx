import type { Evaluation, Patient, ReviewTask, Trial } from "@/lib/api";
import DashboardControls from "@/components/clinical-trial-matching-agent/DashboardControls";
import TrialContextStrip from "@/components/clinical-trial-matching-agent/TrialContextStrip";
import TrialWorklist from "@/components/clinical-trial-matching-agent/TrialWorklist";
import SelectedCaseSummaryCard from "@/components/clinical-trial-matching-agent/SelectedCaseSummaryCard";
import RecommendationCard from "@/components/clinical-trial-matching-agent/RecommendationCard";
import WorkflowActivityCard from "@/components/clinical-trial-matching-agent/WorkflowActivityCard";
import AuditTrailCard from "@/components/clinical-trial-matching-agent/AuditTrailCard";
import PatientSummaryCard from "@/components/clinical-trial-matching-agent/PatientSummaryCard";
import TrialSummaryCard from "@/components/clinical-trial-matching-agent/TrialSummaryCard";
import CriteriaMatchTable from "@/components/clinical-trial-matching-agent/CriteriaMatchTable";

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
  onOpenPatientModal: () => void;
  onChangeTrial: () => void;
  onReplayWorkflow: () => void;
  onSelectEvaluation: (evaluationId: string) => void;
  onReviewCase: (evaluationId: string) => void;
};

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
  onOpenPatientModal,
  onChangeTrial,
  onReplayWorkflow,
  onSelectEvaluation,
  onReviewCase,
}: ClinicalTrialDashboardProps) {
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
        onSelectEvaluation={onSelectEvaluation}
        onReviewCase={onReviewCase}
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
    </>
  );
}
