'use client';

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from '@c15t/react';
import type { ReactNode } from 'react';

interface ConsentManagerProps {
  children: ReactNode;
  locale?: string;
}

function ConsentManagerContent({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CookieBanner />
      <ConsentManagerDialog />
    </>
  );
}

export default function ConsentManager({ children, locale = 'en' }: ConsentManagerProps) {
  return (
    <ConsentManagerProvider
      options={{
        mode: 'c15t',
        backendURL: '/api/c15t',
        consentCategories: ['necessary', 'functionality', 'measurement', 'marketing'],
        // Always show banner regardless of geolocation (for testing/development)
        ignoreGeoLocation: true,
      }}
    >
      <ConsentManagerContent>{children}</ConsentManagerContent>
    </ConsentManagerProvider>
  );
}

