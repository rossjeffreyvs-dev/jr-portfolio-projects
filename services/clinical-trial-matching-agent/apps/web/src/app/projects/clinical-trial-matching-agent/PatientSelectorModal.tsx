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

function outcomeTextClass(outcome?: MatchOutcome) {
  switch (outcome) {
    case "likely_match":
      return "text-emerald-700";
    case "possible_match":
      return "text-sky-700";
    case "review":
      return "text-amber-700";
    case "unlikely_match":
      return "text-rose-700";
    default:
      return "text-slate-500";
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

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [isOpen, patients, selectedPatientId]);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? null,
    [patients, selectedPatientId],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-[2px]">
      <div className="flex min-h-full items-start justify-center px-5 py-8 md:px-8 md:py-10">
        <div className="relative w-full max-w-[1700px] rounded-[2.75rem] border border-[#cfd7e6] bg-[#f8fafc] shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-8 top-8 flex h-11 w-11 items-center justify-center rounded-full border border-[#d7deeb] bg-white text-xl text-slate-500 transition hover:text-slate-800"
          >
            ×
          </button>

          <div className="px-10 pb-10 pt-10 md:px-12 md:pb-12 md:pt-12">
            <div className="inline-flex rounded-full bg-[#dfe7f7] px-7 py-4 text-[1.05rem] font-extrabold uppercase tracking-[0.12em] text-[#3558c8]">
              Select patient
            </div>

            <div className="mt-7 pr-16">
              <h2 className="text-[2.65rem] font-semibold tracking-[-0.04em] text-[#1b2957] md:text-[3.2rem]">
                Ranked patient candidates
              </h2>
              {trialTitle ? (
                <p className="mt-3 text-[1.05rem] text-slate-600 md:text-[1.15rem]">
                  Review candidate fit for {trialTitle}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                {patients.length} candidate{patients.length === 1 ? "" : "s"}
              </div>

              {selectedPatient ? (
                <button
                  type="button"
                  onClick={() => onStartEvaluation(selectedPatient)}
                  disabled={isStartingEvaluation}
                  className="inline-flex items-center justify-center rounded-full border border-[#cad4e4] bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isStartingEvaluation
                    ? patientActionLabel
                    : "Start Evaluation"}
                </button>
              ) : null}
            </div>

            <div className="mt-8 overflow-hidden rounded-[2.1rem] border border-[#d5ddea] bg-white">
              <div className="max-h-[62vh] overflow-y-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Patient
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Demographics
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Diagnosis
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Match
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Score
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Summary
                      </th>
                      <th className="border-b border-[#dce3ef] px-6 py-6 text-left text-[1rem] font-extrabold uppercase tracking-[0.14em] text-[#5a6b93]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-10 text-center text-lg text-slate-500"
                        >
                          Loading patient candidates...
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-10 text-center text-lg text-slate-500"
                        >
                          No candidate patients found for this trial.
                        </td>
                      </tr>
                    ) : (
                      patients.map((patient) => {
                        const isSelected = selectedPatientId === patient.id;

                        return (
                          <tr
                            key={patient.id}
                            className={`cursor-pointer transition ${
                              isSelected ? "bg-[#f6f9ff]" : "hover:bg-[#fafcff]"
                            }`}
                            onClick={() => setSelectedPatientId(patient.id)}
                          >
                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem] text-slate-700">
                              <div className="font-semibold text-[#263868]">
                                {patient.name}
                              </div>
                              <div className="mt-1 text-slate-500">
                                {patient.id}
                              </div>
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem] text-slate-700">
                              {patient.age != null ? `${patient.age} yrs` : "—"}
                              {patient.sex ? ` • ${patient.sex}` : ""}
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem] leading-8 text-slate-700">
                              {patient.diagnosis || "—"}
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem]">
                              <span
                                className={`font-medium ${outcomeTextClass(patient.outcome)}`}
                              >
                                {formatOutcomeLabel(patient.outcome)}
                              </span>
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem] text-slate-700">
                              {formatScore(patient.score)}
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top text-[1rem] leading-8 text-slate-700">
                              <div className="max-w-[520px]">
                                {patient.summary || "—"}
                              </div>
                            </td>

                            <td className="border-b border-[#e3e9f3] px-6 py-7 align-top">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onStartEvaluation(patient);
                                }}
                                disabled={isStartingEvaluation}
                                className="inline-flex items-center justify-center rounded-full border border-[#cad4e4] bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isStartingEvaluation &&
                                selectedPatientId === patient.id
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
    </div>
  );
}
