import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from '@/shared/i18n/routing';
import { updateSession } from './shared/lib/supabase/middleware';

const privatePages = ['/private'];

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  let response = handleI18nRouting(request);

  const pathname = request.nextUrl.pathname;
  const isPrivatePage = privatePages.some((page) => pathname.startsWith(page));

  if (isPrivatePage && response.status === 200) {
    response = await updateSession(request, response);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
