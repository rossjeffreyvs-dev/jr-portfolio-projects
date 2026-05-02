const overviewItems = [
  {
    icon: "🚇",
    title: "Transit signal layer",
    text: "Line activity and train movement become the source data for the experience.",
  },
  {
    icon: "🧠",
    title: "AI conductor",
    text: "A decision layer interprets density, activity, and tension before shaping the mix.",
  },
  {
    icon: "🎷",
    title: "Generative ensemble",
    text: "Each subway line maps to an instrument family with overlapping, restrained voices.",
  },
  {
    icon: "🗺️",
    title: "Visual map",
    text: "Animated train dots make the soundscape explainable instead of abstract.",
  },
];

export default function ProjectDescription() {
  return (
    <div className="content-grid">
      <section className="panel wide panel-accent-blue overview-panel">
        <p className="section-label">Project Overview</p>
        <h2 className="feature-title">
          Real-time subway activity as an explainable jazz system
        </h2>
        <p>
          Train Jazz Agent is a TrainJazz-inspired multi-agent demo that
          translates live-like NYC subway movement into an ambient jazz
          soundscape. A transit signal layer tracks line activity, mapping
          agents assign instruments, and an AI conductor keeps the ensemble
          sparse, balanced, and explainable.
        </p>
        <div className="overview-card-grid">
          {overviewItems.map((item) => (
            <div className="overview-mini-card" key={item.title}>
              <span className="overview-icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="section-label">Problem</p>
        <h2>Operational data is hard to feel</h2>
        <p>
          Real-time transit data is usually shown as dashboards, tables, or
          alerts. This project explores a different interface pattern: using
          sound and motion to make a complex live system understandable, calm,
          and memorable.
        </p>
      </section>

      <section className="panel">
        <p className="section-label">Solution</p>
        <h2>Agents convert movement into musical behavior</h2>
        <p>
          Movement, mapping, and conductor agents translate line activity into
          overlapping musical voices. The result is not a song; it is a
          continuously changing audio-visual system shaped by the state of the
          subway network.
        </p>
      </section>

      <section className="panel wide">
        <p className="section-label">Architecture</p>
        <h2>Train data → agents → conductor → soundscape</h2>
        <div className="flow-row">
          <span>🚇 Train activity</span>
          <span>📡 Movement agent</span>
          <span>🎼 Mapping agent</span>
          <span>🧠 AI conductor</span>
          <span>🎧 Audio engine</span>
          <span>🗺️ Map + feed</span>
        </div>
        <p>
          The conductor layer keeps the experience from becoming raw telemetry.
          It adjusts density, activity, tension, phrase probability, and lead
          instrument family so the audio remains airy instead of chaotic.
        </p>
      </section>
    </div>
  );
}
