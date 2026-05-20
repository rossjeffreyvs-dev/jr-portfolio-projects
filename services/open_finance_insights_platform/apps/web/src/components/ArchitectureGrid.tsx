type ArchitectureItem = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function ArchitectureGrid({
  items,
}: {
  items: ArchitectureItem[];
}) {
  return (
    <div className="ui-architecture-grid">
      {items.map((item) => (
        <div key={item.title} className="ui-architecture-card">
          <p className="ui-architecture-eyebrow">{item.eyebrow}</p>
          <h3 className="ui-architecture-title">{item.title}</h3>
          <p className="ui-architecture-body">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
