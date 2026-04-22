"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Evaluation, Patient } from "@/lib/api";
import { titleCaseStatus } from "./dashboardUtils";

type ReviewCasePanelProps = {
  evaluation?: Evaluation;
  patient?: Patient;
  isOpen: boolean;
  reviewNote: string;
  onReviewNoteChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
};

export default function ReviewCasePanel({
  evaluation,
  patient,
  isOpen,
  reviewNote,
  onReviewNoteChange,
  onApprove,
  onReject,
  onClose,
}: ReviewCasePanelProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !evaluation) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1120,
          maxHeight: "90vh",
          overflow: "auto",
          background: "#ffffff",
          border: "1px solid #dbe3f0",
          borderRadius: 28,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            padding: "24px 24px 20px 24px",
            borderBottom: "1px solid #e2e8f0",
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
              Human Review
            </div>
            <h2
              style={{
                margin: "6px 0 0 0",
                fontSize: 22,
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Review Case
            </h2>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#475569",
                maxWidth: 760,
              }}
            >
              Review the model recommendation, supporting evidence, and
              criterion-level results before approving or rejecting this case.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              borderRadius: 999,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 24,
            padding: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                background: "#f8fafc",
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    Patient
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {patient?.display_name || evaluation.patient_id}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      color: "#475569",
                    }}
                  >
                    {patient?.diagnosis?.[0] || "Diagnosis unavailable"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    Recommendation
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {evaluation.recommendation}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      color: "#475569",
                    }}
                  >
                    Match score {evaluation.match_score}% · Confidence{" "}
                    {evaluation.confidence}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Evaluation Summary
                </div>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#334155",
                  }}
                >
                  {evaluation.explanation}
                </p>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Criteria Highlights
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
                {(evaluation.criterion_results || [])
                  .slice(0, 5)
                  .map((row, index) => (
                    <div
                      key={`${evaluation.id}-${row.criterion_id}-${index}`}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        background: "#f8fafc",
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 1.5,
                          }}
                        >
                          {row.criterion_text}
                        </div>

                        <div
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: 999,
                            background: "#ffffff",
                            padding: "6px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#475569",
                            whiteSpace: "nowrap",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {titleCaseStatus(row.status)}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        Evidence
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 14,
                          lineHeight: 1.7,
                          color: "#334155",
                        }}
                      >
                        {row.evidence || "No evidence provided."}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        Confidence: {row.confidence}
                        {row.action_needed
                          ? ` · Action: ${row.action_needed}`
                          : ""}
                      </div>
                    </div>
                  ))}

                {!evaluation.criterion_results?.length ? (
                  <div style={{ fontSize: 14, color: "#64748b" }}>
                    No criterion results available.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
              alignContent: "start",
            }}
          >
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                background: "#ffffff",
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Reviewer Note
              </div>

              <textarea
                value={reviewNote}
                onChange={(event) => onReviewNoteChange(event.target.value)}
                placeholder="Add reviewer rationale..."
                style={{
                  width: "100%",
                  minHeight: 220,
                  marginTop: 12,
                  border: "1px solid #dbe3f0",
                  borderRadius: 18,
                  background: "#f8fafc",
                  padding: 16,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#0f172a",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                background: "#f8fafc",
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Actions
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                <button
                  type="button"
                  onClick={onApprove}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 999,
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Approve Case
                </button>

                <button
                  type="button"
                  onClick={onReject}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: 999,
                    background: "#ffffff",
                    color: "#0f172a",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reject Case
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    borderRadius: 999,
                    background: "#ffffff",
                    color: "#475569",
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
