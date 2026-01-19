'use client';

import { useSyncExternalStore } from 'react';
import { 
  ConsentManagerProvider, 
  CookieBanner, 
  ConsentManagerDialog 
} from '@c15t/nextjs';

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

// Stable subscribe function for useSyncExternalStore
const emptySubscribe = () => () => {};

// Hook to detect if we're on the client after hydration
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  // Defer consent manager initialization to client-side only
  const isClient = useIsClient();

  // Render children immediately, consent components only after hydration
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ConsentManagerProvider
      options={{
        // Use hosted c15t backend (consent.io) via rewrite
        mode: 'c15t',
        backendURL: '/api/c15t',
        // Consent categories to show in the banner
        // Valid types: 'necessary', 'functionality', 'experience', 'measurement', 'marketing'
        consentCategories: ['necessary', 'functionality', 'measurement', 'marketing'],
        // Set to false in production to respect geolocation
        // ignoreGeoLocation: true, // Uncomment for development testing
      }}
    >
      {children}
      <CookieBanner />
      <ConsentManagerDialog />
    </ConsentManagerProvider>
  );
}

