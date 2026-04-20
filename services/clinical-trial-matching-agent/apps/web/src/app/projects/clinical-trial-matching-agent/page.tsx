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
  type CriterionResult,
  type Evaluation,
  type Patient,
  type ReviewTask,
  type Trial,
  type WorkflowEvent,
} from "@/lib/api";
import PatientSelectorModal from "./PatientSelectorModal";

function statusClass(status: string) {
  if (status === "Likely Match") return "badge match";
  if (status === "Requires Review") return "badge review";
  if (status === "Not Eligible") return "badge reject";
  return "badge info";
}

function titleCaseStatus(status: CriterionResult["status"]) {
  if (status === "missing_information") return "Missing Info";
  if (status === "possibly_met") return "Possibly Met";
  if (status === "not_met") return "Not Met";
  return "Met";
}

function joinList(items: string[]) {
  return items.length ? items.join(", ") : "None";
}

function formatLabs(labs: Record<string, string | number>) {
  return Object.entries(labs)
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
    .join(", ");
}

function outcomeOrder(status: Patient["seeded_outcome"]) {
  if (status === "Likely Match") return 0;
  if (status === "Requires Review") return 1;
  if (status === "Not Eligible") return 2;
  return 3;
}

function sortPatientsForTrial(items: Patient[]) {
  return [...items].sort((a, b) => {
    const outcomeDelta =
      outcomeOrder(a.seeded_outcome) - outcomeOrder(b.seeded_outcome);

    if (outcomeDelta !== 0) return outcomeDelta;
    return b.seeded_score - a.seeded_score;
  });
}

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

  const handleStartEvaluationFromModal = (patient: { id: string }) => {
    const fullPatient = trialPatients.find((p) => p.id === patient.id);
    if (!fullPatient) return;
    void handleSelectPatient(fullPatient);
  };

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

    setTrials(trialResponse.items);
    setActiveTrialId(activeId);
    setPatients(patientResponse.items);
    setEvaluations(evaluationResponse.items);
    setReviews(reviewResponse.items);

    const nextSelected =
      preferredEvaluationId ||
      evaluationResponse.items.find(
        (item) => item.recommendation === "Requires Review",
      )?.id ||
      evaluationResponse.items[0]?.id ||
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

    bootstrap();
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

  const modalPatients = useMemo(
    () =>
      trialPatients.map((patient) => ({
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
    [trialPatients],
  );

  async function handleOpenPatientModal() {
    console.log("open clicked", {
      activeTrialId: activeTrial?.id,
      isStartingEvaluation,
      isLoadingTrialPatients,
    });

    if (!activeTrial || isStartingEvaluation) return;

    setError(null);
    setPatientModalError(null);
    setTrialPatients([]);
    setIsPatientModalOpen(true);
    setIsLoadingTrialPatients(true);

    console.log("set modal open");

    try {
      const response = await getPatientsForTrial(activeTrial.id);
      console.log("patients response", response);
      setTrialPatients(sortPatientsForTrial(response.items));
    } catch (err) {
      console.error("patient modal load failed", err);
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
        <section className="control-panel cardish">
          <div className="control-panel-header">
            <div>
              <div className="eyebrow">Simulation Controls</div>
              <h2>Kick off new evaluations or switch context</h2>
              <p>
                The dashboard is now reading from the FastAPI stub. Use the
                controls below to simulate a new workflow run or cycle to
                another trial protocol.
              </p>
            </div>
          </div>

          <div className="control-actions">
            <button
              className="primary-btn"
              onClick={handleOpenPatientModal}
              disabled={!activeTrial || isLoadingTrialPatients}
            >
              {isLoadingTrialPatients ? "Loading Patients…" : "Select Patient"}
            </button>

            <button
              className="secondary-btn"
              onClick={handleChangeTrial}
              disabled={isChangingTrial}
            >
              {isChangingTrial ? "Changing Trial…" : "Select Trial"}
            </button>

            <button
              className="secondary-btn"
              onClick={handleReplayWorkflow}
              disabled={!selectedEvaluation}
            >
              Replay Evaluation
            </button>
          </div>

          <div className="control-status-row">
            <div className="control-status-card">
              <span className="eyebrow">Current Trial</span>
              <strong>{activeTrial?.title || "No trial selected"}</strong>
            </div>

            <div className="control-status-card">
              <span className="eyebrow">Current Patient</span>
              <strong>
                {selectedPatient?.display_name ||
                  selectedPatient?.id ||
                  "No patient selected"}
              </strong>
            </div>

            <div className="control-status-card">
              <span className="eyebrow">Latest Recommendation</span>
              <strong>
                {selectedEvaluation?.recommendation || "No evaluation loaded"}
              </strong>
            </div>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
        </section>
        <section className="card">
          <span className="section-label">
            Eligibility Operations Dashboard
          </span>

          <div className="callout-grid">
            <div className="callout">
              <div>
                <div className="eyebrow">Active trial loaded</div>
                <p>
                  {activeTrial
                    ? `${activeTrial.title} is active and ready for evaluation.`
                    : "No active trial is currently loaded."}
                </p>
              </div>
              <button
                className="secondary-btn small"
                onClick={handleChangeTrial}
              >
                Change Trial
              </button>
            </div>

            <div className="callout">
              <div>
                <div className="eyebrow">Patients ready for evaluation</div>
                <p>
                  Review the API-backed queue below or simulate a new patient
                  entering the workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="section-header">
            <h2>Patient Evaluation Queue</h2>
            <p>
              Click a patient card to drive the main recommendation and workflow
              panels below.
            </p>
          </div>

          {evaluations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-base font-semibold text-slate-900">
                No evaluations yet for this trial
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Use Select Patient to open the candidate list and start a new
                evaluation.
              </p>
            </div>
          ) : (
            <div className="queue-grid">
              {evaluations.map((evaluation, index) => {
                const patient = patients.find(
                  (item) => item.id === evaluation.patient_id,
                );

                return (
                  <article
                    key={evaluation.id}
                    className={`queue-card queue-card-button ${
                      evaluation.id === selectedEvaluation?.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedEvaluationId(evaluation.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedEvaluationId(evaluation.id);
                      }
                    }}
                  >
                    <div className="queue-top-row">
                      <div className="eyebrow">
                        Rank #{index + 1} •{" "}
                        {patient?.display_name || evaluation.patient_id}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={statusClass(evaluation.recommendation)}
                        >
                          {evaluation.recommendation}
                        </span>
                      </div>
                    </div>

                    <h3>
                      {patient?.diagnosis?.[0] || "Diagnosis unavailable"}
                    </h3>

                    <p className="queue-note">{evaluation.explanation}</p>

                    <div className="queue-footer">
                      <div>
                        <div className="eyebrow">Match Score</div>
                        <strong className="queue-score">
                          {evaluation.match_score}%
                        </strong>
                      </div>

                      {patient && selectedPatient?.id === patient.id && (
                        <span className="badge info">Selected</span>
                      )}

                      <button className="text-btn">View Details</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <section className="dashboard-grid">
          <article className="card col-4">
            <span className="section-label">Active Trial</span>
            <h2>{activeTrial?.title || "No active trial"}</h2>
            <div className="meta-list">
              <div className="meta-item">
                <strong>Disease Area</strong>
                {activeTrial?.disease_area || "—"}
              </div>
              <div className="meta-item">
                <strong>Phase</strong>
                {activeTrial?.phase || "—"}
              </div>
              <div className="meta-item">
                <strong>Status</strong>
                <span className="badge info">
                  {activeTrial?.protocol_status || "unknown"}
                </span>
              </div>
              <div className="meta-item">
                <strong>Criteria</strong>
                {activeTrial
                  ? `${activeTrial.inclusion_criteria.length} inclusion / ${activeTrial.exclusion_criteria.length} exclusion`
                  : "—"}
              </div>
            </div>
          </article>

          <article className="card col-4">
            <span className="section-label">Agent Workflow</span>
            <h2>Live workflow status</h2>
            <div className="workflow-list">
              {(selectedEvaluation?.workflow_events || []).map(
                (item: WorkflowEvent) => (
                  <div
                    className="workflow-item"
                    key={`${selectedEvaluation?.id}-${item.stage}`}
                  >
                    <div className="workflow-dot" />
                    <div>
                      <strong className="workflow-title">{item.label}</strong>
                      <span className="workflow-detail">{item.detail}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </article>

          <article className="card col-4">
            <span className="section-label">Recommendation</span>
            <h2>
              {selectedEvaluation?.recommendation || "No recommendation loaded"}
            </h2>
            <div className="stat-row">
              <div className="stat-box">
                <div className="eyebrow">Match Score</div>
                <strong className="stat-emphasis">
                  {selectedEvaluation?.match_score ?? "—"}%
                </strong>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Confidence</div>
                <strong className="stat-emphasis">
                  {selectedEvaluation?.confidence || "—"}
                </strong>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Review Required</div>
                <span
                  className={
                    selectedEvaluation?.review_required
                      ? "badge review"
                      : "badge match"
                  }
                >
                  {selectedEvaluation?.review_required ? "Yes" : "No"}
                </span>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Blockers</div>
                <strong className="stat-copy">
                  {selectedEvaluation?.blockers.length
                    ? selectedEvaluation.blockers.length
                    : 0}{" "}
                  hard blockers
                </strong>
              </div>
            </div>
            <p className="panel-copy">
              {selectedEvaluation?.explanation || "No explanation available."}
            </p>
          </article>

          <article className="card col-6">
            <span className="section-label">Patient Summary</span>
            <h2>
              {selectedPatient?.display_name || "Unknown patient"} overview
            </h2>
            <div className="meta-list">
              <div className="meta-item">
                <strong>Age / Sex</strong>
                {selectedPatient
                  ? `${selectedPatient.age} / ${selectedPatient.sex}`
                  : "—"}
              </div>
              <div className="meta-item">
                <strong>Diagnosis</strong>
                {selectedPatient ? joinList(selectedPatient.diagnosis) : "—"}
              </div>
              <div className="meta-item">
                <strong>Biomarkers</strong>
                {selectedPatient ? joinList(selectedPatient.biomarkers) : "—"}
              </div>
              <div className="meta-item">
                <strong>ECOG</strong>
                {selectedPatient?.ecog || "—"}
              </div>
              <div className="meta-item">
                <strong>Prior Therapies</strong>
                {selectedPatient
                  ? joinList(selectedPatient.prior_therapies)
                  : "—"}
              </div>
              <div className="meta-item">
                <strong>Labs</strong>
                {selectedPatient ? formatLabs(selectedPatient.labs) : "—"}
              </div>
              <div className="meta-item">
                <strong>Comorbidities</strong>
                {selectedPatient
                  ? joinList(selectedPatient.comorbidities)
                  : "—"}
              </div>
              <div className="meta-item">
                <strong>Missing Data</strong>
                {selectedEvaluation?.missing_information.length
                  ? joinList(selectedEvaluation.missing_information)
                  : "None"}
              </div>
            </div>
          </article>

          <article className="card col-6">
            <span className="section-label">Trial Criteria</span>
            <h2>Parsed eligibility summary</h2>
            <div className="stat-row">
              <div className="stat-box">
                <div className="eyebrow">Key Inclusion</div>
                <strong className="stat-copy">
                  {activeTrial?.inclusion_criteria[0]?.text || "—"}
                </strong>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Performance</div>
                <strong className="stat-copy">
                  {activeTrial?.inclusion_criteria[1]?.text || "—"}
                </strong>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Imaging</div>
                <strong className="stat-copy">
                  {activeTrial?.inclusion_criteria[2]?.text || "—"}
                </strong>
              </div>
              <div className="stat-box">
                <div className="eyebrow">Exclusions</div>
                <strong className="stat-copy">
                  {activeTrial
                    ? activeTrial.exclusion_criteria
                        .map((item) => item.text)
                        .join(", ")
                    : "—"}
                </strong>
              </div>
            </div>
          </article>

          <article className="card col-8">
            <span className="section-label">Criteria Match Table</span>
            <h2>Criterion-by-criterion evaluation</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Evidence</th>
                    <th>Confidence</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedEvaluation?.criterion_results || []).map(
                    (row: CriterionResult, index: number) => (
                      <tr
                        key={`${selectedEvaluation?.id ?? "evaluation"}-${row.criterion_id}-${index}`}
                      >
                        <td>{row.criterion_text}</td>
                        <td>{row.criterion_type}</td>
                        <td>{titleCaseStatus(row.status)}</td>
                        <td>{row.evidence}</td>
                        <td>{row.confidence}</td>
                        <td>{row.action_needed || "None"}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card col-4">
            <span className="section-label">Human Review Queue</span>
            <h2>Flagged cases</h2>

            {reviewCards.length === 0 ? (
              <div className="queue-card review-card">
                <p>No open review tasks for the active trial.</p>
              </div>
            ) : (
              reviewCards.map((item) => {
                const patient = patients.find(
                  (candidate) => candidate.id === item.patient_id,
                );

                return (
                  <div key={item.id} className="queue-card review-card">
                    <div className="review-card-top">
                      <strong>
                        {patient?.display_name || item.patient_id}
                      </strong>
                      <span
                        className={
                          item.priority === "High"
                            ? "badge review"
                            : "badge info"
                        }
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p>{item.reason.join(", ")}</p>

                    <div className="review-card-footer">
                      <span className="badge info">{item.review_status}</span>
                      <button className="secondary-btn small">
                        Review Case
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </article>

          <article className="card col-12">
            <span className="section-label">Audit Feed</span>
            <h2>Recent workflow and reviewer actions</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Event</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedEvaluation?.workflow_events || []).map((event) => (
                    <tr key={`${selectedEvaluation?.id}-${event.stage}-audit`}>
                      <td>
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td>
                        {selectedPatient?.display_name ||
                          selectedEvaluation?.patient_id}
                      </td>
                      <td>{event.detail}</td>
                      <td>{selectedEvaluation?.recommendation || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {(() => {
          console.log("render modal", {
            isPatientModalOpen,
            isLoadingTrialPatients,
            trialPatients: trialPatients.length,
          });
          return null;
        })()}

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
      </main>
    </div>
  );
}
