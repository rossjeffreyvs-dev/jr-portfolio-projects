type FeatureListItem = {
  icon?: string;
  label: string;
};

type FeatureListGridProps = {
  items: FeatureListItem[];
  columns?: 4 | 5;
};

export default function FeatureListGrid({
  items,
  columns = 5,
}: FeatureListGridProps) {
  return (
    <div
      className={`ui-feature-list-grid ui-feature-list-grid-${columns}`}
      aria-label="Workflow steps"
    >
      {items.map((item) => (
        <article className="ui-feature-list-card" key={item.label}>
          {item.icon ? (
            <span className="ui-feature-list-icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <strong>{item.label}</strong>
        </article>
      ))}
    </div>
  );
}
