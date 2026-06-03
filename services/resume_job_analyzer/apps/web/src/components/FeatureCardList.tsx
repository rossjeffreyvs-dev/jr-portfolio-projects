"use client";

import type { ReactNode } from "react";

export type FeatureCardGridItem = {
  icon?: ReactNode;
  number?: string;
  title: string;
  description: string;
};

type FeatureCardGridProps = {
  items: FeatureCardGridItem[];
  numbered?: boolean;
  columns?: 3 | 4 | 5;
  ariaLabel?: string;
};

export default function FeatureCardGrid({
  items,
  numbered = false,
  columns = 5,
  ariaLabel = "Feature cards",
}: FeatureCardGridProps) {
  return (
    <div
      className={`ui-feature-card-grid ui-feature-card-grid-${columns}`}
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const number = item.number ?? String(index + 1).padStart(2, "0");

        return (
          <article className="ui-feature-card" key={item.title}>
            {numbered ? (
              <span className="ui-feature-card-number" aria-hidden="true">
                {number}
              </span>
            ) : null}

            <div className="ui-feature-card-title-row">
              {item.icon ? (
                <span className="ui-feature-card-icon" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}

              <h3>{item.title}</h3>
            </div>

            <p>{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}
