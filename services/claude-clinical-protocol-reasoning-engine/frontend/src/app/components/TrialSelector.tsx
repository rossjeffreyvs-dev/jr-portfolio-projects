import type { Trial } from "../types";

type TrialSelectorProps = {
  trials: Trial[];
  selectedTrial: Trial | null;
  isLoading: boolean;
  onSelect: (trial: Trial) => void;
};

export default function TrialSelector({
  trials,
  selectedTrial,
  isLoading,
  onSelect,
}: TrialSelectorProps) {
  return (
    <div className="panel">
      <p className="eyebrow">Step 1</p>
      <h2>Select Trial</h2>
      {isLoading && <p>Loading trials…</p>}

      {trials.map((trial) => (
        <article
          className={
            selectedTrial?.id === trial.id ? "list-card active" : "list-card"
          }
          key={trial.id}
          onClick={() => onSelect(trial)}
        >
          <strong>{trial.title}</strong>
          <span>
            {trial.phase} · {trial.status}
          </span>
          <p>{trial.condition}</p>
        </article>
      ))}
    </div>
  );
}
