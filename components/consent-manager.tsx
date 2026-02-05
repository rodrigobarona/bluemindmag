"use client";

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/react";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/components/analytics-provider";

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
