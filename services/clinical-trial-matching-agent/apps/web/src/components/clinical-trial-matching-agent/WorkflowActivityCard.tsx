import type { Evaluation, WorkflowEvent } from "@/lib/api";

type WorkflowActivityCardProps = {
  selectedEvaluation?: Evaluation;
};

export default function WorkflowActivityCard({
  selectedEvaluation,
}: WorkflowActivityCardProps) {
  return (
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
  );
}
