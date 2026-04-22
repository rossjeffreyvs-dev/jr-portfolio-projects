"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { SemanticQuerySuggestion } from "@/lib/api";

type MatchOutcome =
  | "likely_match"
  | "possible_match"
  | "review"
  | "unlikely_match"
  | string
  | null;

export type TrialPatient = {
  id: string;
  name: string;
  age?: number | null;
  sex?: string | null;
  diagnosis?: string | null;
  score?: number | null;
  outcome?: MatchOutcome;
  summary?: string | null;
  semanticExplanation?: string | null;
  semanticMatchedTerms?: string[];
  semanticRank?: number | null;
  isSemanticResult?: boolean;
};

type PatientSelectorModalProps = {
  isOpen: boolean;
  patients: TrialPatient[];
  trialTitle?: string;
  isLoading?: boolean;
  isStartingEvaluation?: boolean;
  patientActionLabel?: string;
  onClose: () => void;
  onStartEvaluation: (patient: TrialPatient) => void;

  semanticQuery: string;
  onSemanticQueryChange: (value: string) => void;
  onRunSemanticSearch: () => void;
  onResetPatientSearch: () => void;

  semanticSuggestions: SemanticQuerySuggestion[];
  onSelectSemanticSuggestion: (suggestion: SemanticQuerySuggestion) => void;

  isSemanticSearchLoading?: boolean;
  semanticSearchError?: string | null;
  hasRunSemanticSearch?: boolean;
};

function formatOutcomeLabel(outcome?: MatchOutcome) {
  switch (outcome) {
    case "likely_match":
      return "Likely match";
    case "possible_match":
      return "Possible match";
    case "review":
      return "Needs review";
    case "unlikely_match":
      return "Unlikely match";
    default:
      return "Unknown";
  }
}

function formatScore(score?: number | null) {
  if (score == null || Number.isNaN(score)) return "—";
  return `${Math.round(score * 100)}%`;
}

function outcomePillStyle(outcome?: MatchOutcome): React.CSSProperties {
  switch (outcome) {
    case "likely_match":
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    case "possible_match":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    case "review":
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    case "unlikely_match":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    default:
      return {
        background: "#e2e8f0",
        color: "#475569",
      };
  }
}

export default function PatientSelectorModal({
  isOpen,
  patients,
  trialTitle,
  isLoading = false,
  isStartingEvaluation = false,
  patientActionLabel = "Starting Evaluation...",
  onClose,
  onStartEvaluation,
  semanticQuery,
  onSemanticQueryChange,
  onRunSemanticSearch,
  onResetPatientSearch,
  semanticSuggestions,
  onSelectSemanticSuggestion,
  isSemanticSearchLoading = false,
  semanticSearchError = null,
  hasRunSemanticSearch = false,
}: PatientSelectorModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (patients.length === 0) {
      setSelectedPatientId(null);
      return;
    }

    setSelectedPatientId((current) => {
      if (current && patients.some((patient) => patient.id === current)) {
        return current;
      }
      return patients[0].id;
    });
  }, [isOpen, patients]);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? null,
    [patients, selectedPatientId],
  );

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(1280px, 96vw)",
          height: "min(860px, 92vh)",
          background: "#ffffff",
          border: "1px solid #dbe3f0",
          borderRadius: 28,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1.25fr 0.95fr",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 2,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#334155",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Close
        </button>

        <section
          style={{
            borderRight: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: 28,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Select Patient
            </div>

            <h2
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 28,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Ranked patient candidates
            </h2>

            {trialTitle ? (
              <p
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                Review candidate fit for {trialTitle}
              </p>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 18,
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              background: "#ffffff",
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Semantic query
            </div>

            <textarea
              value={semanticQuery}
              onChange={(event) => onSemanticQueryChange(event.target.value)}
              placeholder="Describe the type of patient you want to find for this trial."
              style={{
                width: "100%",
                minHeight: 72,
                height: 72,
                marginTop: 10,
                border: "1px solid #dbe3f0",
                borderRadius: 18,
                background: "#ffffff",
                padding: 14,
                fontSize: 15,
                lineHeight: 1.45,
                color: "#0f172a",
                resize: "none",
                outline: "none",
              }}
            />

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={onRunSemanticSearch}
                disabled={isSemanticSearchLoading || isLoading}
                style={{
                  border: "none",
                  borderRadius: 999,
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    isSemanticSearchLoading || isLoading
                      ? "not-allowed"
                      : "pointer",
                  opacity: isSemanticSearchLoading || isLoading ? 0.65 : 1,
                }}
              >
                {isSemanticSearchLoading
                  ? "Running Search..."
                  : "Run Semantic Search"}
              </button>

              <button
                type="button"
                onClick={onResetPatientSearch}
                disabled={isSemanticSearchLoading || isLoading}
                style={{
                  border: "1px solid #cbd5e1",
                  borderRadius: 999,
                  background: "#ffffff",
                  color: "#334155",
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    isSemanticSearchLoading || isLoading
                      ? "not-allowed"
                      : "pointer",
                  opacity: isSemanticSearchLoading || isLoading ? 0.65 : 1,
                }}
              >
                Reset to Trial Patient List
              </button>
            </div>

            {semanticSearchError ? (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#dc2626",
                }}
              >
                {semanticSearchError}
              </div>
            ) : null}

            {semanticSuggestions.length > 0 ? (
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Suggested searches
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {semanticSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => onSelectSemanticSuggestion(suggestion)}
                      style={{
                        border: "1px solid #bfdbfe",
                        borderRadius: 999,
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        padding: "8px 12px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#475569",
              }}
            >
              {hasRunSemanticSearch
                ? "Showing ranked semantic matches for the active trial."
                : "Showing seeded patients mapped to the active trial."}
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 999,
                background: "#ffffff",
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
                flexShrink: 0,
              }}
            >
              {patients.length} result{patients.length === 1 ? "" : "s"}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
            {isLoading ? (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  background: "#ffffff",
                  padding: 20,
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                Loading patient candidates...
              </div>
            ) : patients.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: 20,
                  background: "#ffffff",
                  padding: 20,
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                {hasRunSemanticSearch
                  ? "No semantic matches found. Try a suggested search or reset to the default trial patient list."
                  : "No seeded patients are currently available for the active trial."}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {patients.map((patient) => {
                  const isSelected = selectedPatientId === patient.id;

                  return (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => setSelectedPatientId(patient.id)}
                      style={{
                        width: "100%",
                        border: isSelected
                          ? "1px solid #0f172a"
                          : "1px solid #e2e8f0",
                        borderRadius: 22,
                        background: "#ffffff",
                        padding: 16,
                        textAlign: "left",
                        cursor: "pointer",
                        boxShadow: isSelected
                          ? "0 8px 24px rgba(15, 23, 42, 0.08)"
                          : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 16,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            {patient.isSemanticResult &&
                            patient.semanticRank ? (
                              <span
                                style={{
                                  border: "1px solid #e2e8f0",
                                  borderRadius: 999,
                                  background: "#f8fafc",
                                  padding: "5px 10px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: "#64748b",
                                }}
                              >
                                Rank #{patient.semanticRank}
                              </span>
                            ) : null}

                            <span
                              style={{
                                ...outcomePillStyle(patient.outcome),
                                borderRadius: 999,
                                padding: "6px 10px",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                              }}
                            >
                              {formatOutcomeLabel(patient.outcome)}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 18,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {patient.name}
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 14,
                              color: "#475569",
                            }}
                          >
                            {patient.diagnosis || "Diagnosis unavailable"}
                          </div>
                        </div>

                        <div
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 18,
                            background: "#f8fafc",
                            padding: "10px 12px",
                            textAlign: "right",
                            minWidth: 102,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "#64748b",
                            }}
                          >
                            Match Score
                          </div>
                          <div
                            style={{
                              marginTop: 2,
                              fontSize: 18,
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {formatScore(patient.score)}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "#334155",
                        }}
                      >
                        {patient.semanticExplanation ||
                          patient.summary ||
                          "No summary available."}
                      </div>

                      {patient.semanticMatchedTerms?.length ? (
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {patient.semanticMatchedTerms.map((term) => (
                            <span
                              key={`${patient.id}-${term}`}
                              style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 999,
                                background: "#f8fafc",
                                padding: "6px 10px",
                                fontSize: 12,
                                color: "#334155",
                              }}
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        {patient.age != null || patient.sex
                          ? `Age ${patient.age ?? "—"} • ${patient.sex ?? "—"}`
                          : "Demographics unavailable"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <aside
          style={{
            background: "#ffffff",
            padding: 28,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Selected Patient
          </div>

          {selectedPatient ? (
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 24,
                  background: "#f8fafc",
                  padding: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedPatient.name}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        color: "#475569",
                      }}
                    >
                      {selectedPatient.diagnosis || "Diagnosis unavailable"}
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 999,
                      background: "#ffffff",
                      padding: "8px 14px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {formatScore(selectedPatient.score)}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gap: 10,
                    fontSize: 14,
                    color: "#334155",
                  }}
                >
                  <div>
                    <strong>Age / Sex:</strong> {selectedPatient.age ?? "—"} /{" "}
                    {selectedPatient.sex ?? "—"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {formatOutcomeLabel(selectedPatient.outcome)}
                  </div>
                  <div>
                    <strong>Summary:</strong>{" "}
                    {selectedPatient.summary || "No summary available."}
                  </div>
                </div>

                {selectedPatient.semanticExplanation ? (
                  <div
                    style={{
                      marginTop: 18,
                      border: "1px solid #bfdbfe",
                      borderRadius: 18,
                      background: "#eff6ff",
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#1d4ed8",
                      }}
                    >
                      Why this patient ranked
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#334155",
                      }}
                    >
                      {selectedPatient.semanticExplanation}
                    </div>
                  </div>
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 20,
                  border: "1px solid #e2e8f0",
                  borderRadius: 24,
                  background: "#ffffff",
                  padding: 22,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Next Action
                </div>

                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#475569",
                  }}
                >
                  Start a new eligibility evaluation for this patient within the
                  active trial workflow.
                </p>

                <button
                  type="button"
                  onClick={() => onStartEvaluation(selectedPatient)}
                  disabled={isStartingEvaluation}
                  style={{
                    marginTop: 18,
                    width: "100%",
                    border: "none",
                    borderRadius: 999,
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isStartingEvaluation ? "not-allowed" : "pointer",
                    opacity: isStartingEvaluation ? 0.65 : 1,
                  }}
                >
                  {isStartingEvaluation
                    ? patientActionLabel
                    : "Start Evaluation"}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 20,
                border: "1px dashed #cbd5e1",
                borderRadius: 24,
                background: "#f8fafc",
                padding: 20,
                fontSize: 14,
                color: "#475569",
              }}
            >
              Select a patient from the ranked list to review fit and launch a
              new evaluation.
            </div>
          )}
        </aside>
      </div>
    </div>,
    document.body,
  );
}
