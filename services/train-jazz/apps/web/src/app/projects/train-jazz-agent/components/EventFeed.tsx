import type { FeedEvent } from "../types";

export default function EventFeed({ events }: { events: FeedEvent[] }) {
  return (
    <section className="tj-panel">
      <h2>Event Feed</h2>
      <div className="event-feed">
        {events.map((event) => <div className="event" key={event.id}>{event.text}</div>)}
      </div>
    </section>
  );
}
