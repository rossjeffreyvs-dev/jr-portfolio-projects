import type { LifecycleEvent } from "../types";

type LifecycleTimelineProps = {
  events: LifecycleEvent[];
};

export default function LifecycleTimeline({ events }: LifecycleTimelineProps) {
  return (
    <section className="panel wide">
      <p className="section-label">Workflow Activity</p>
      <h2>Lifecycle timeline</h2>

      <div className="timeline">
        {events.map((event) => (
          <div key={event.id} className="timeline-item">
            <div>
              <strong>{event.timestamp}</strong>
              <span>{event.stage}</span>
            </div>

            <article>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
