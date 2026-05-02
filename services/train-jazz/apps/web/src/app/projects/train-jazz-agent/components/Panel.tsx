import type { ReactNode } from "react";

type PanelProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
  className?: string;
  wide?: boolean;
};

export default function Panel({
  eyebrow,
  title,
  body,
  children,
  className = "",
  wide = false,
}: PanelProps) {
  const classes = ["ui-panel", wide ? "ui-panel-wide" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}

      <h2 className="ui-panel-title">{title}</h2>

      {body ? <p className="ui-panel-body">{body}</p> : null}

      {children ? (
        <div className="ui-panel-content ui-panel-body">{children}</div>
      ) : null}
    </section>
  );
}
