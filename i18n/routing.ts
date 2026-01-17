import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Persist user's locale preference in a cookie
  // This ensures the selected language sticks across navigation
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  }
});

export type Locale = (typeof routing.locales)[number];

