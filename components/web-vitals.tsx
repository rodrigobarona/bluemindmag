"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useConsentManager } from "@c15t/react";
import { useCallback } from "react";

/**
 * Web Vitals reporting component
 * Measures Core Web Vitals (LCP, INP, CLS, FCP, TTFB) and sends them to Google Analytics 4
 * Only reports when user has granted measurement consent
 */
export function WebVitals() {
  const { has } = useConsentManager();
  const hasAnalyticsConsent = has("measurement");

  // Stable callback to prevent duplicate reporting
  // Uses delta (not value) so metrics can be summed across reports
  const reportWebVitals = useCallback(
    (metric: {
      id: string;
      name: string;
      value: number;
      delta: number;
      rating: "good" | "needs-improvement" | "poor";
    }) => {
      // Only report if consent is granted and gtag is available
      if (!hasAnalyticsConsent || typeof window.gtag !== "function") {
        return;
      }

      // Send to Google Analytics 4
      // CLS is multiplied by 1000 since GA4 requires integer values
      window.gtag("event", metric.name, {
        // Use delta so values can be summed across reports
        value: Math.round(
          metric.name === "CLS" ? metric.delta * 1000 : metric.delta
        ),
        // Custom parameters for detailed analysis
        metric_id: metric.id, // Unique ID for deduplication
        metric_value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        metric_rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        // Prevent affecting bounce rate
        non_interaction: true,
      });
    },
    [hasAnalyticsConsent]
  );

  useReportWebVitals(reportWebVitals);

  return null;
}
