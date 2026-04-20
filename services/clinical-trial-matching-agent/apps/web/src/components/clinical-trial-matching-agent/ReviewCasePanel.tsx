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
  if (!isOpen || !evaluation) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-5xl rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Human Review
            </div>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Review Case
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Review the model recommendation, supporting evidence, and
              criterion-level results before approving or rejecting this case.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT SIDE */}
          <section className="space-y-6">
            {/* Summary */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Patient
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">
                    {patient?.display_name || evaluation.patient_id}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {patient?.diagnosis?.[0] || "Diagnosis unavailable"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Recommendation
                  </div>
                  <div className="mt-1 text-base font-semibold text-slate-900">
                    {evaluation.recommendation}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Match score {evaluation.match_score}% · Confidence{" "}
                    {evaluation.confidence}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Evaluation Summary
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {evaluation.explanation}
                </p>
              </div>
            </div>

            {/* Criteria */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Criteria Highlights
              </div>

              <div className="mt-4 space-y-3">
                {(evaluation.criterion_results || []).slice(0, 5).map((row) => (
                  <div
                    key={`${evaluation.id}-${row.criterion_id}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-900">
                        {row.criterion_text}
                      </div>
                      <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        {titleCaseStatus(row.status)}
                      </span>
                    </div>

                    <div className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">
                      Evidence
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      {row.evidence || "No evidence provided."}
                    </p>

                    <div className="mt-2 text-xs text-slate-500">
                      Confidence: {row.confidence}
                    </div>
                  </div>
                ))}

                {!evaluation.criterion_results?.length && (
                  <p className="text-sm text-slate-500">
                    No criterion results available.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Reviewer Note
              </div>

              <textarea
                value={reviewNote}
                onChange={(e) => onReviewNoteChange(e.target.value)}
                placeholder="Add reviewer rationale..."
                className="mt-3 min-h-[200px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Actions
              </div>

              <div className="mt-4 space-y-3">
                <button
                  onClick={onApprove}
                  className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  Approve Case
                </button>

                <button
                  onClick={onReject}
                  className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Reject Case
                </button>

                <button
                  onClick={onClose}
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
