import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the next-intl middleware for locale detection and routing
// This handles:
// 1. Detecting user's preferred locale from URL, cookie, or Accept-Language header
// 2. Setting the NEXT_LOCALE cookie when user changes language
// 3. Redirecting to the correct locale-prefixed URL
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/...)
  // - tRPC routes (/trpc/...)
  // - Next.js internals (/_next/...)
  // - Vercel internals (/_vercel/...)
  // - Static files (files with extensions like .ico, .svg, .png, etc.)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

