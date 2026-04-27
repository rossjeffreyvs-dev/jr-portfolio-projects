"use client";

import { useEffect, useState } from "react";
import type { CustomerLifecycleSummary } from "@/app/types";
import {
  getCustomerLifecycleSummary,
  ingestMockProspect,
  submitReviewAction,
} from "@/api/customerLifecycleApi";
import LifecycleRevenuePanel from "./LifecycleRevenuePanel";

type ReviewAction = "approve" | "reject" | "request_data";

export default function LifecycleDashboard() {
  const [lifecycle, setLifecycle] = useState<CustomerLifecycleSummary | null>(
    null,
  );
  const [refreshingLifecycle, setRefreshingLifecycle] = useState(false);
  const [message, setMessage] = useState("");

  async function refreshRevenueLifecycle() {
    const response = await getCustomerLifecycleSummary();
    setLifecycle(response);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialLifecycle() {
      try {
        const response = await getCustomerLifecycleSummary();

        if (!isMounted) return;

        setLifecycle(response);
      } catch (error) {
        if (!isMounted) return;

        setMessage(
          error instanceof Error ? error.message : "Unable to load lifecycle.",
        );
      }
    }

    loadInitialLifecycle();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleIngestProspect() {
    setRefreshingLifecycle(true);
    setMessage("");

    try {
      const response = await ingestMockProspect();
      await refreshRevenueLifecycle();
      setMessage(`${response.prospect.name} added to the lifecycle funnel.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to ingest prospect.",
      );
    } finally {
      setRefreshingLifecycle(false);
    }
  }

  async function handleReviewAction(reviewId: string, action: ReviewAction) {
    setRefreshingLifecycle(true);
    setMessage("");

    try {
      await submitReviewAction(reviewId, action);
      await refreshRevenueLifecycle();

      if (action === "approve") {
        setMessage("Prospect converted. Realized revenue updated.");
      } else if (action === "reject") {
        setMessage("Prospect rejected. Revenue blocker removed.");
      } else {
        setMessage("Additional information requested.");
      }
    } catch (error) {
      setMessage(
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
      <LifecycleRevenuePanel
        lifecycle={lifecycle}
        isRefreshing={refreshingLifecycle}
        onIngestProspect={handleIngestProspect}
        onReviewAction={handleReviewAction}
      />

      {message ? <div className="status-banner">{message}</div> : null}
    </div>
  );
}
