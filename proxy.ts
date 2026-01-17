import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // #region agent log
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0];
  console.log('[DEBUG-I18N] PROXY_ENTRY:', JSON.stringify({
    path: request.nextUrl.pathname,
    cookieLocale: cookieLocale || 'none',
    browserLang: acceptLang || 'none'
  }));
  // #endregion

  const response = handleI18nRouting(request);

  // #region agent log
  const responseCookie = response.cookies.get('NEXT_LOCALE')?.value;
  console.log('[DEBUG-I18N] PROXY_RESPONSE:', JSON.stringify({
    path: request.nextUrl.pathname,
    setCookie: responseCookie || 'not-set',
    redirectLocation: response.headers.get('location') || 'none'
  }));
  // #endregion

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

