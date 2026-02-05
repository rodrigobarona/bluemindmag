"use client";

import { useConsentManager } from "@c15t/react";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Consent-aware Google Analytics provider
 * Only loads GA when the user has granted 'measurement' consent
 * Integrates with the c15t consent management system
 */
export function AnalyticsProvider() {
  const { has } = useConsentManager();

  // Check if user has granted measurement (analytics) consent
  const hasAnalyticsConsent = has("measurement");

  // Only render GoogleAnalytics if consent is granted and measurement ID is configured
  if (!hasAnalyticsConsent) {
    return null;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    // Silently return null in production if no measurement ID is configured
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is not configured. Google Analytics will not load."
      );
    }
    return null;
  }

  return <GoogleAnalytics gaId={measurementId} />;
}
