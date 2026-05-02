type StepListItem = {
  number: string;
  icon?: string;
  title: string;
  description: string;
};

type StepListProps = {
  items: StepListItem[];
};

export default function StepList({ items }: StepListProps) {
  return (
    <div className="ui-step-list">
      {items.map((item) => (
        <article className="ui-step-list-item" key={item.title}>
          <span className="ui-step-list-number">{item.number}</span>

          <div className="ui-step-list-content">
            <h3>
              {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
              {item.title}
            </h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
