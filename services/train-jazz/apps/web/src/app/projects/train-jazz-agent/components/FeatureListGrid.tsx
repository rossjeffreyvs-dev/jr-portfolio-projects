export type FeatureListItem = {
  icon?: string;
  title: string;
  description: string;
};

type FeatureListGridProps = {
  items: FeatureListItem[];
  showIndex?: boolean;
  ariaLabel?: string;
  className?: string;
};

export default function FeatureListGrid({
  items,
  showIndex = false,
  ariaLabel,
  className = "",
}: FeatureListGridProps) {
  const classes = ["ui-feature-grid", className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-label={ariaLabel}>
      {items.map((item, index) => (
        <article className="ui-feature-card" key={item.title}>
          {showIndex ? (
            <span className="ui-feature-index">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}

          <div className="ui-feature-card-title">
            {item.icon ? (
              <span className="ui-feature-icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}

            <strong>{item.title}</strong>
          </div>

          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}
