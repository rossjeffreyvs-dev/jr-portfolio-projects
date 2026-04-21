import type { Trial } from "@/lib/api";

type TrialSummaryCardProps = {
  activeTrial?: Trial;
};

export default function TrialSummaryCard({
  activeTrial,
}: TrialSummaryCardProps) {
  return (
    <article className="card col-6">
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
            ? activeTrial.exclusion_criteria.map((item) => item.text).join(", ")
            : "None"}
        </div>
      </div>
    </article>
  );
}
