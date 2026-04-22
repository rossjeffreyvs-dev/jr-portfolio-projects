"use client";

import type { Trial } from "@/lib/api";

type ChangeTrialModalProps = {
  isOpen: boolean;
  trials: Trial[];
  activeTrialId?: string;
  isChangingTrial: boolean;
  onClose: () => void;
  onSelectTrial: (trialId: string) => void;
};

function readTrialField(trial: Trial, keys: string[], fallback = "—"): string {
  const record = trial as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (value === null || value === undefined || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : fallback;
    }

    return String(value);
  }

  return fallback;
}

export default function ChangeTrialModal({
  isOpen,
  trials,
  activeTrialId,
  isChangingTrial,
  onClose,
  onSelectTrial,
}: ChangeTrialModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Change active trial"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(1120px, 100%)",
          maxHeight: "85vh",
          overflow: "hidden",
          background: "#ffffff",
          border: "1.5px solid #d6ddeb",
          borderRadius: 28,
          boxShadow: "0 24px 64px rgba(15, 23, 42, 0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            padding: "24px 24px 18px",
            borderBottom: "1px solid #ebeff7",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                background: "#dce4f6",
                color: "#3158c9",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.06em",
                padding: "10px 14px",
                textTransform: "uppercase",
              }}
            >
              Select Trial
            </div>

            <h2
              style={{
                margin: "16px 0 10px",
                fontSize: 34,
                lineHeight: 1.05,
                color: "#16213f",
              }}
            >
              Change active trial
            </h2>

            <p
              style={{
                margin: 0,
                color: "#617091",
                fontSize: 15,
                lineHeight: 1.55,
                maxWidth: 760,
              }}
            >
              Choose the study you want to load into the active worklist and
              patient evaluation workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close change trial modal"
            onClick={onClose}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "1px solid #d6ddeb",
              background: "#ffffff",
              color: "#16213f",
              fontSize: 26,
              lineHeight: 1,
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: 24,
          }}
        >
          <div
            style={{
              border: "1px solid #d6ddeb",
              borderRadius: 22,
              overflow: "hidden",
              background: "#fbfcff",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.2fr) 120px 180px 120px 140px",
                gap: 0,
                padding: "14px 18px",
                borderBottom: "1px solid #ebeff7",
                fontSize: 12,
                fontWeight: 900,
                color: "#617091",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <div>Trial</div>
              <div>Phase</div>
              <div>Disease Area</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {trials.map((trial) => {
              const isActive = trial.id === activeTrialId;

              return (
                <div
                  key={trial.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 2.2fr) 120px 180px 120px 140px",
                    gap: 0,
                    alignItems: "center",
                    padding: "18px 18px",
                    borderBottom: "1px solid #ebeff7",
                    background: isActive ? "#ffffff" : "#fbfcff",
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: 20 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#16213f",
                        lineHeight: 1.3,
                      }}
                    >
                      {readTrialField(trial, ["title"])}
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#617091",
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {readTrialField(trial, ["phase"])}
                  </div>

                  <div
                    style={{
                      color: "#617091",
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {readTrialField(trial, [
                      "disease_area",
                      "diseaseArea",
                      "indication",
                    ])}
                  </div>

                  <div>
                    <span
                      className={`badge ${isActive ? "info" : "match"}`}
                      style={{ height: 36 }}
                    >
                      {isActive ? "Active" : "Available"}
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      className={
                        isActive ? "secondary-button" : "primary-button"
                      }
                      onClick={() => onSelectTrial(trial.id)}
                      disabled={isChangingTrial}
                    >
                      {isActive ? "Current Trial" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
