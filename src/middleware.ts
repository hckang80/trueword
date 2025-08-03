import { routing } from '@/shared/i18n/routing';
import { updateSession } from '@/shared/lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
export default createMiddleware(routing);

export const config = {
  matcher: [
    `/(en|ko)/:path*`, // TODO: en|ko -> locales를 이용해 동적삽입 필요
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
