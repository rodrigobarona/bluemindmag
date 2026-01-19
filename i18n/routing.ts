import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  
  // Enable locale detection from Accept-Language header
  // When disabled, only URL prefix and cookie are used
  localeDetection: true,
  
  // Persist user's locale preference in a cookie
  // This ensures the selected language sticks across navigation
  // The cookie is set by the middleware when user changes locale
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax' // Allow cookie when coming from external sites
  }
});

export type Locale = (typeof routing.locales)[number];

