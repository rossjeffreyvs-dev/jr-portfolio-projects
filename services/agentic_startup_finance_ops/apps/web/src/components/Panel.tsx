import type { ReactNode } from "react";

export default function Panel({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "blue" | "flat";
}) {
  return (
    <section className={`panel panel-${tone} ${className}`}>{children}</section>
  );
}

// import type { ReactNode } from "react";

// type PanelProps = {
//   eyebrow?: string;
//   title: string;
//   body?: string;
//   bullets?: ReactNode[];
//   children?: ReactNode;
//   className?: string;
//   wide?: boolean;
// };

// export default function Panel({
//   eyebrow,
//   title,
//   body,
//   bullets,
//   children,
//   className = "",
//   wide = false,
// }: PanelProps) {
//   const classes = ["ui-panel", wide ? "ui-panel-wide" : "", className]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <section className={classes}>
//       {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}

//       <h2 className="ui-panel-title">{title}</h2>

//       {body ? <p className="ui-panel-body">{body}</p> : null}

//       {children ? <div className="ui-panel-content">{children}</div> : null}

//       {bullets?.length ? (
//         <ul className="ui-clean-list">
//           {bullets.map((bullet, index) => (
//             <li key={index}>{bullet}</li>
//           ))}
//         </ul>
//       ) : null}
//     </section>
//   );
// }
