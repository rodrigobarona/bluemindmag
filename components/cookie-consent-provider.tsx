'use client';

import { ConsentManagerProvider, CookieBanner } from '@c15t/nextjs';

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  return (
    <ConsentManagerProvider
      options={{
        // Use offline mode (no backend required)
        mode: 'offline',
      }}
    >
      {children}
      <CookieBanner />
    </ConsentManagerProvider>
  );
}

