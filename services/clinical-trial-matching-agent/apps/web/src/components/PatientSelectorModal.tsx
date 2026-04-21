"use client";

import { useEffect, useMemo, useState } from "react";

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

function outcomeColor(outcome?: MatchOutcome) {
  switch (outcome) {
    case "likely_match":
      return "#15803d";
    case "possible_match":
      return "#0369a1";
    case "review":
      return "#b45309";
    case "unlikely_match":
      return "#b91c1c";
    default:
      return "#64748b";
  }
}

function formatScore(score?: number | null) {
  if (score == null || Number.isNaN(score)) return "—";
  return `${Math.round(score * 100)}%`;
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
}: PatientSelectorModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15, 23, 42, 0.30)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 18px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1500px",
          maxHeight: "92vh",
          overflow: "hidden",
          borderRadius: "36px",
          border: "1px solid #cfd7e6",
          background: "#f8fafc",
          boxShadow: "0 30px 80px rgba(15,23,42,0.18)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            right: "28px",
            top: "28px",
            width: "44px",
            height: "44px",
            borderRadius: "999px",
            border: "1px solid #d7deeb",
            background: "#ffffff",
            color: "#64748b",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ×
        </button>

        <div style={{ padding: "32px 32px 24px 32px" }}>
          <div
            style={{
              display: "inline-flex",
              borderRadius: "999px",
              background: "#dfe7f7",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#3558c8",
            }}
          >
            Select patient
          </div>

          <div style={{ marginTop: "18px", paddingRight: "64px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "44px",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#1b2957",
              }}
            >
              Ranked patient candidates
            </h2>

            {trialTitle ? (
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: 0,
                  fontSize: "16px",
                  lineHeight: 1.5,
                  color: "#64748b",
                }}
              >
                Review candidate fit for {trialTitle}
              </p>
            ) : null}
          </div>

          <div
            style={{
              marginTop: "18px",
              overflow: "hidden",
              borderRadius: "32px",
              border: "1px solid #d5ddea",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                maxHeight: "380px",
                overflowY: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  background: "#ffffff",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    background: "#edf3ff",
                    boxShadow: "0 1px 0 #dce3ef",
                  }}
                >
                  <tr>
                    {[
                      "Patient",
                      "Demographics",
                      "Diagnosis",
                      "Match",
                      "Score",
                      "Summary",
                      "Action",
                    ].map((label) => (
                      <th
                        key={label}
                        style={{
                          borderBottom: "1px solid #dce3ef",
                          padding: "18px 20px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "#5a6b93",
                          background: "#edf3ff",
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody style={{ background: "#ffffff" }}>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "36px 24px",
                          textAlign: "center",
                          fontSize: "16px",
                          color: "#64748b",
                          background: "#ffffff",
                        }}
                      >
                        Loading patient candidates...
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "36px 24px",
                          textAlign: "center",
                          fontSize: "16px",
                          color: "#64748b",
                          background: "#ffffff",
                        }}
                      >
                        No candidate patients found for this trial.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => {
                      const isHovered = hoveredPatientId === patient.id;
                      const isActionHovered = hoveredActionId === patient.id;
                      const isSelected = selectedPatientId === patient.id;
                      const rowBackground = isSelected
                        ? "#f7faff"
                        : isHovered
                          ? "#f8fbff"
                          : "#ffffff";

                      return (
                        <tr
                          key={patient.id}
                          onClick={() => setSelectedPatientId(patient.id)}
                          onMouseEnter={() => setHoveredPatientId(patient.id)}
                          onMouseLeave={() => setHoveredPatientId(null)}
                          style={{
                            cursor: "pointer",
                            background: rowBackground,
                            boxShadow: isSelected
                              ? "inset 4px 0 0 #3558c8"
                              : "none",
                            transition:
                              "background 160ms ease, box-shadow 160ms ease",
                          }}
                        >
                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              color: "#475569",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              background: rowBackground,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: isSelected ? 800 : 700,
                                color: isSelected ? "#1d3570" : "#263868",
                              }}
                            >
                              {patient.name}
                            </div>
                            {/* <div style={{ marginTop: "2px", color: "#64748b" }}>
                              {patient.id}
                            </div> */}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              color: "#64748b",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              background: rowBackground,
                            }}
                          >
                            {patient.age != null ? `${patient.age} yrs` : "—"}
                            {patient.sex ? ` • ${patient.sex}` : ""}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              color: "#64748b",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              background: rowBackground,
                            }}
                          >
                            {patient.diagnosis || "—"}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              color: outcomeColor(patient.outcome),
                              fontWeight: 600,
                              background: rowBackground,
                            }}
                          >
                            {formatOutcomeLabel(patient.outcome)}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              color: "#64748b",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              background: rowBackground,
                            }}
                          >
                            {formatScore(patient.score)}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              color: "#64748b",
                              fontSize: "15px",
                              lineHeight: 1.45,
                              maxWidth: "420px",
                              background: rowBackground,
                            }}
                          >
                            {patient.summary || "—"}
                          </td>

                          <td
                            style={{
                              borderBottom: "1px solid #e3e9f3",
                              padding: "18px 20px",
                              verticalAlign: "top",
                              background: rowBackground,
                            }}
                          >
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedPatientId(patient.id);
                                onStartEvaluation(patient);
                              }}
                              onMouseEnter={() =>
                                setHoveredActionId(patient.id)
                              }
                              onMouseLeave={() => setHoveredActionId(null)}
                              disabled={isStartingEvaluation}
                              style={{
                                borderRadius: "999px",
                                border: "1px solid #cad4e4",
                                background: isActionHovered
                                  ? "#f3f7ff"
                                  : "#ffffff",
                                padding: "8px 14px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1f2a44",
                                cursor: isStartingEvaluation
                                  ? "default"
                                  : "pointer",
                                opacity: isStartingEvaluation ? 0.6 : 1,
                                whiteSpace: "nowrap",
                                boxShadow: isActionHovered
                                  ? "0 1px 2px rgba(15,23,42,0.06)"
                                  : "none",
                                transition:
                                  "background 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                              }}
                            >
                              {isStartingEvaluation && isSelected
                                ? patientActionLabel
                                : "Start Evaluation"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
