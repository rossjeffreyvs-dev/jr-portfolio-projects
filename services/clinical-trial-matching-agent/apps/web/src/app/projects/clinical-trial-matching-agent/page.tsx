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
import PatientSelectorModal from "@/components/PatientSelectorModal";

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

function evaluationTimestampValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function recommendationRank(recommendation?: string) {
  if (recommendation === "Likely Match") return 0;
  if (recommendation === "Requires Review") return 1;
  if (recommendation === "Not Eligible") return 2;
  return 3;
}

function dedupeEvaluationsByPatient(items: Evaluation[]) {
  const latestByPatient = new Map<string, Evaluation>();

  for (const evaluation of items) {
    const existing = latestByPatient.get(evaluation.patient_id);

    if (!existing) {
      latestByPatient.set(evaluation.patient_id, evaluation);
      continue;
    }

    const existingTimestamp = evaluationTimestampValue(existing.submitted_at);
    const nextTimestamp = evaluationTimestampValue(evaluation.submitted_at);

    if (nextTimestamp > existingTimestamp) {
      latestByPatient.set(evaluation.patient_id, evaluation);
      continue;
    }

    if (
      nextTimestamp === existingTimestamp &&
      evaluation.match_score > existing.match_score
    ) {
      latestByPatient.set(evaluation.patient_id, evaluation);
    }
  }

  return [...latestByPatient.values()].sort((a, b) => {
    const rankDelta =
      recommendationRank(a.recommendation) -
      recommendationRank(b.recommendation);

    if (rankDelta !== 0) return rankDelta;
    if (b.match_score !== a.match_score) return b.match_score - a.match_score;

    return (
      evaluationTimestampValue(b.submitted_at) -
      evaluationTimestampValue(a.submitted_at)
    );
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

        <section className="control-panel cardish">
          <div className="control-panel-header">
            <div>
              <div className="eyebrow">Simulation Controls</div>
              <h2>Kick off new evaluations or switch context</h2>
              <p>
                Use the controls below to open the candidate list, create a new
                evaluation, switch the active trial, or replay the selected
                case.
              </p>
            </div>
          </div>

          <div className="control-actions">
            <button
              className="primary-btn"
              onClick={handleOpenPatientModal}
              disabled={!activeTrial || isLoadingTrialPatients}
            >
              {isLoadingTrialPatients
                ? "Loading Patients…"
                : "Find Patients for Trial"}
            </button>

            <button
              className="secondary-btn"
              onClick={handleChangeTrial}
              disabled={isChangingTrial}
            >
              {isChangingTrial ? "Changing Trial…" : "Change Trial"}
            </button>

            <button
              className="secondary-btn"
              onClick={handleReplayWorkflow}
              disabled={!selectedEvaluation}
            >
              Replay Evaluation
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
        </section>

        <section className="card">
          <span className="section-label">A. Trial Context Strip</span>
          <div className="control-status-row">
            <div className="control-status-card">
              <span className="eyebrow">Active Trial</span>
              <strong>{activeTrial?.title || "No trial selected"}</strong>
              <p className="panel-copy">
                {activeTrial?.phase
                  ? `${activeTrial.phase} • ${activeTrial.disease_area}`
                  : activeTrial?.disease_area || "No disease area available"}
              </p>
            </div>

            <div className="control-status-card">
              <span className="eyebrow">Selected Patient</span>
              <strong>
                {selectedPatient?.display_name ||
                  selectedPatient?.id ||
                  "No patient selected"}
              </strong>
              <p className="panel-copy">
                {selectedPatient?.diagnosis?.[0] || "No diagnosis available"}
              </p>
            </div>

            <div className="control-status-card">
              <span className="eyebrow">Latest Recommendation</span>
              <strong>
                {selectedEvaluation?.recommendation || "No evaluation loaded"}
              </strong>
              <p className="panel-copy">
                {selectedEvaluation
                  ? `Match score ${selectedEvaluation.match_score}%`
                  : "No score available"}
              </p>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <span className="section-label">B. Trial Worklist</span>
              <h2>Queued evaluations for the active trial</h2>
              <p>
                Select a card to update the case summary, recommendation,
                workflow activity, audit trail, and supporting context below.
              </p>
            </div>
          </div>

          {evaluations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-base font-semibold text-slate-900">
                No evaluations yet for this trial
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Use Find Patients for Trial to open the candidate list and start
                a new evaluation.
              </p>
            </div>
          ) : (
            <div className="queue-grid">
              {evaluations.map((evaluation, index) => {
                const patient = patients.find(
                  (item) => item.id === evaluation.patient_id,
                );
                const isSelected = evaluation.id === selectedEvaluation?.id;
                const hasReviewTask = reviewCards.some(
                  (review) => review.patient_id === evaluation.patient_id,
                );

                return (
                  <article
                    key={evaluation.id}
                    className={`queue-card queue-card-button ${
                      isSelected ? "selected" : ""
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

                      <span className={statusClass(evaluation.recommendation)}>
                        {evaluation.recommendation}
                      </span>
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

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="badge info">Selected</span>
                        ) : null}
                        {evaluation.review_required || hasReviewTask ? (
                          <span className="badge review">Review Needed</span>
                        ) : (
                          <span className="badge match">Ready</span>
                        )}
                      </div>

                      <button className="text-btn" type="button">
                        {evaluation.review_required || hasReviewTask
                          ? "Review Case"
                          : "Show Evaluation Process"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-grid">
          <article className="card col-8">
            <span className="section-label">C. Selected Evaluation</span>
            <h2>Selected Case Summary</h2>

            <div className="meta-list">
              <div className="meta-item">
                <strong>Patient</strong>
                {selectedPatient?.display_name ||
                  selectedEvaluation?.patient_id ||
                  "—"}
              </div>
              <div className="meta-item">
                <strong>Diagnosis</strong>
                {selectedPatient?.diagnosis?.[0] || "—"}
              </div>
              <div className="meta-item">
                <strong>Trial</strong>
                {activeTrial?.title || "—"}
              </div>
              <div className="meta-item">
                <strong>Submitted</strong>
                {selectedEvaluation?.submitted_at
                  ? new Date(selectedEvaluation.submitted_at).toLocaleString()
                  : "—"}
              </div>
              <div className="meta-item">
                <strong>Missing Information</strong>
                {selectedEvaluation?.missing_information?.length
                  ? joinList(selectedEvaluation.missing_information)
                  : "None"}
              </div>
              <div className="meta-item">
                <strong>Blockers</strong>
                {selectedEvaluation?.blockers?.length
                  ? joinList(selectedEvaluation.blockers)
                  : "None"}
              </div>
            </div>

            <p className="panel-copy">
              {selectedEvaluation?.explanation ||
                "No evaluation explanation available."}
            </p>
          </article>

          <article className="card col-4">
            <span className="section-label">C. Recommendation</span>
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
                <div className="eyebrow">Hard Blockers</div>
                <strong className="stat-copy">
                  {selectedEvaluation?.blockers.length
                    ? selectedEvaluation.blockers.length
                    : 0}
                </strong>
              </div>
            </div>
          </article>

          <article className="card col-6">
            <span className="section-label">D. Evaluation Process</span>
            <h2>Workflow Activity</h2>

            <div className="workflow-list">
              {(selectedEvaluation?.workflow_events || []).map(
                (item: WorkflowEvent, index: number) => (
                  <div
                    className="workflow-item"
                    key={`${selectedEvaluation?.id}-${item.stage}-${index}`}
                  >
                    <div className="workflow-dot" />
                    <div>
                      <strong className="workflow-title">{item.label}</strong>
                      <span className="workflow-detail">{item.detail}</span>
                    </div>
                  </div>
                ),
              )}

              {!selectedEvaluation?.workflow_events?.length ? (
                <p className="panel-copy">No workflow activity available.</p>
              ) : null}
            </div>
          </article>

          <article className="card col-6">
            <span className="section-label">D. Evaluation Process</span>
            <h2>Audit Trail</h2>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Stage</th>
                    <th>Event</th>
                    <th>Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedEvaluation?.workflow_events || []).map(
                    (event: WorkflowEvent, index: number) => (
                      <tr
                        key={`${selectedEvaluation?.id}-${event.stage}-audit-${index}`}
                      >
                        <td>
                          {event.timestamp
                            ? new Date(event.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td>{event.label}</td>
                        <td>{event.detail}</td>
                        <td>{selectedEvaluation?.recommendation || "—"}</td>
                      </tr>
                    ),
                  )}

                  {!selectedEvaluation?.workflow_events?.length ? (
                    <tr>
                      <td colSpan={4}>No audit events available.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card col-6">
            <span className="section-label">E. Supporting Context</span>
            <h2>Patient Summary</h2>

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
                <strong>Notes</strong>
                {selectedPatient?.notes?.length
                  ? selectedPatient.notes.join(" ")
                  : "None"}
              </div>
            </div>
          </article>

          <article className="card col-6">
            <span className="section-label">E. Supporting Context</span>
            <h2>Trial Summary</h2>

            <div className="meta-list">
              <div className="meta-item">
                <strong>Title</strong>
                {activeTrial?.title || "—"}
              </div>
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
                <strong>Key Inclusion</strong>
                {activeTrial?.inclusion_criteria?.[0]?.text || "—"}
              </div>
              <div className="meta-item">
                <strong>Performance</strong>
                {activeTrial?.inclusion_criteria?.[1]?.text || "—"}
              </div>
              <div className="meta-item">
                <strong>Imaging / Disease Context</strong>
                {activeTrial?.inclusion_criteria?.[2]?.text || "—"}
              </div>
              <div className="meta-item">
                <strong>Exclusions</strong>
                {activeTrial?.exclusion_criteria?.length
                  ? activeTrial.exclusion_criteria
                      .map((item) => item.text)
                      .join(", ")
                  : "None"}
              </div>
            </div>
          </article>

          <article className="card col-12">
            <span className="section-label">F. Criteria Match Table</span>
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

                  {!selectedEvaluation?.criterion_results?.length ? (
                    <tr>
                      <td colSpan={6}>No criterion results available.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
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
      </main>
    </div>
  );
}
