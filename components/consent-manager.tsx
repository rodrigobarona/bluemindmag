"use client";

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/react";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { WebVitals } from "@/components/web-vitals";

interface ConsentManagerProps {
  children: ReactNode;
}

function ConsentManagerContent({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CookieBanner />
      <ConsentManagerDialog />
      {/* Google Analytics - only loads when measurement consent is granted */}
      <AnalyticsProvider />
      {/* Core Web Vitals reporting - sends metrics to GA4 when consent is granted */}
      <WebVitals />
    </>
  );
}

export default function ConsentManager({ children }: ConsentManagerProps) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "c15t",
        backendURL: "/api/c15t",
        consentCategories: [
          "necessary",
          "functionality",
          "measurement",
          "marketing",
        ],
      }}
    >
      <ConsentManagerContent>{children}</ConsentManagerContent>
    </ConsentManagerProvider>
  );
}
