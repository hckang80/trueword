import { routing } from '@/shared/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { locales } from './shared';
import { updateSession } from './shared/lib/supabase/middleware';

const privatePages = [''];

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const privatePathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${privatePages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPrivatePage = privatePathnameRegex.test(request.nextUrl.pathname);

  return isPrivatePage ? updateSession(request) : handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(en|ko)/:path*']
};
