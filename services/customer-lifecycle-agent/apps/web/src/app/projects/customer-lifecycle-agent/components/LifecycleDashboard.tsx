"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomerLifecycleSummary, Prospect } from "@/app/types";
import {
  getCustomerLifecycleSummary,
  ingestMockProspect,
  submitReviewAction,
} from "@/api/customerLifecycleApi";
import LifecycleRevenuePanel from "./LifecycleRevenuePanel";

type ReviewAction = "approve" | "reject" | "request_data";

type ActivityEvent = {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  tone?: "info" | "success" | "warning";
};

function nowLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function formatStage(stage: string) {
  return stage.replaceAll("_", " ");
}

function buildProspectNarrative(prospect: Prospect) {
  const stage = formatStage(prospect.stage);

  return `${prospect.name} entered from ${prospect.source}. Agent evaluation scored ${prospect.fit_score}% fit and classified the prospect as ${stage}. Result: ${prospect.signal}. Estimated pipeline value: $${prospect.estimated_value.toLocaleString()}.`;
}

export default function LifecycleDashboard() {
  const [lifecycle, setLifecycle] = useState<CustomerLifecycleSummary | null>(
    null,
  );
  const [refreshingLifecycle, setRefreshingLifecycle] = useState(false);
  const [message, setMessage] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [autoIngestEnabled, setAutoIngestEnabled] = useState(false);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  async function refreshRevenueLifecycle() {
    const response = await getCustomerLifecycleSummary();
    setLifecycle(response);
  }

  function addActivityEvent(event: Omit<ActivityEvent, "id" | "timestamp">) {
    setActivityEvents((current) => {
      const next = [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          timestamp: nowLabel(),
          ...event,
        },
      ];

      return next.slice(-5);
    });
  }

  function showStatus(nextMessage: string) {
    setMessage(nextMessage);
    setTypedMessage("");
  }

  function scrollToRevenuePanel() {
    window.setTimeout(() => {
      const element = panelRef.current;
      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY - 28;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    }, 120);
  }

  useEffect(() => {
    if (!message) return;

    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;
      setTypedMessage(message.slice(0, index));

      if (index >= message.length) {
        window.clearInterval(interval);
      }
    }, 12);

    return () => window.clearInterval(interval);
  }, [message]);

  useEffect(() => {
    async function loadInitialLifecycle() {
      try {
        await refreshRevenueLifecycle();
      } catch (error) {
        showStatus(
          error instanceof Error ? error.message : "Unable to load lifecycle.",
        );
      }
    }

    loadInitialLifecycle();
  }, []);

  useEffect(() => {
    if (!autoIngestEnabled) return;

    const intervalId = window.setInterval(async () => {
      try {
        setRefreshingLifecycle(true);

        const response = await ingestMockProspect();
        await refreshRevenueLifecycle();

        const detail = buildProspectNarrative(response.prospect);

        showStatus(detail);
        addActivityEvent({
          title: "Prospect evaluated",
          detail,
          tone:
            response.prospect.stage === "in_review"
              ? "warning"
              : response.prospect.stage === "converted"
                ? "success"
                : "info",
        });
      } catch (error) {
        const detail =
          error instanceof Error
            ? error.message
            : "Unable to auto-ingest prospect.";

        showStatus(detail);
        addActivityEvent({
          title: "Live feed error",
          detail,
          tone: "warning",
        });
      } finally {
        setRefreshingLifecycle(false);
      }
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [autoIngestEnabled]);

  function handleToggleLiveFeed() {
    const nextState = !autoIngestEnabled;
    setAutoIngestEnabled(nextState);

    if (nextState) {
      const detail =
        "Live feed started. The system will simulate inbound prospects, evaluate fit, classify funnel stage, and update revenue impact every 6 seconds.";

      showStatus(detail);
      addActivityEvent({
        title: "Live feed started",
        detail,
        tone: "info",
      });
      scrollToRevenuePanel();
    } else {
      const detail = "Live feed paused. Prospect ingestion is stopped.";

      showStatus(detail);
      addActivityEvent({
        title: "Live feed paused",
        detail,
        tone: "warning",
      });
    }
  }

  async function handleIngestProspect() {
    setRefreshingLifecycle(true);

    try {
      const response = await ingestMockProspect();
      await refreshRevenueLifecycle();

      const detail = buildProspectNarrative(response.prospect);

      showStatus(detail);
      addActivityEvent({
        title: "Manual prospect evaluated",
        detail,
        tone:
          response.prospect.stage === "in_review"
            ? "warning"
            : response.prospect.stage === "converted"
              ? "success"
              : "info",
      });

      scrollToRevenuePanel();
    } catch (error) {
      showStatus(
        error instanceof Error ? error.message : "Unable to ingest prospect.",
      );
    } finally {
      setRefreshingLifecycle(false);
    }
  }

  async function handleReviewAction(reviewId: string, action: ReviewAction) {
    setRefreshingLifecycle(true);

    try {
      await submitReviewAction(reviewId, action);
      await refreshRevenueLifecycle();

      if (action === "approve") {
        const detail =
          "Human decision captured: prospect converted to customer. Realized revenue increased and the blocker was removed from the review queue.";

        showStatus(detail);
        addActivityEvent({
          title: "Revenue converted",
          detail,
          tone: "success",
        });
      } else if (action === "reject") {
        const detail =
          "Human decision captured: prospect removed from pipeline. Revenue blocker cleared without increasing realized revenue.";

        showStatus(detail);
        addActivityEvent({
          title: "Prospect removed",
          detail,
          tone: "warning",
        });
      } else {
        const detail =
          "Human requested additional information. Conversion is paused, the prospect remains in review, and revenue stays at risk until follow-up is completed.";

        showStatus(detail);
        addActivityEvent({
          title: "Follow-up workflow started",
          detail,
          tone: "warning",
        });
      }

      scrollToRevenuePanel();
    } catch (error) {
      showStatus(
        error instanceof Error
          ? error.message
          : "Unable to submit review action.",
      );
    } finally {
      setRefreshingLifecycle(false);
    }
  }

  return (
    <div className="dashboard-stack">
      <div className="live-feed-control">
        <div>
          <strong>Live Prospect Feed</strong>
          <span>
            {autoIngestEnabled
              ? "Auto-ingest is running every 6 seconds. Updates appear inside the revenue panel below."
              : "Turn on auto-ingest to simulate prospects entering the funnel."}
          </span>
        </div>

        <button
          type="button"
          className={autoIngestEnabled ? "secondary-button" : "primary-button"}
          onClick={handleToggleLiveFeed}
        >
          {autoIngestEnabled ? "Pause Live Feed" : "Start Live Feed"}
        </button>
      </div>

      {activityEvents.length ? (
        <section className="activity-panel">
          <div>
            <p className="section-label">Live Activity</p>
            <h3>Recent lifecycle events</h3>
          </div>

          <div className="activity-list">
            {activityEvents.map((event) => (
              <article
                key={event.id}
                className={`activity-event ${event.tone || "info"} ${
                  event.id === activityEvents[activityEvents.length - 1]?.id
                    ? "newest"
                    : ""
                }`}
              >
                <time>{event.timestamp}</time>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div ref={panelRef} className="revenue-panel-scroll-anchor">
        <LifecycleRevenuePanel
          lifecycle={lifecycle}
          isRefreshing={refreshingLifecycle}
          statusMessage={typedMessage || message}
          onIngestProspect={handleIngestProspect}
          onReviewAction={handleReviewAction}
        />
      </div>
    </div>
  );
}
