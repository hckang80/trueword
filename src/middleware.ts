import { routing } from '@/shared/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
  matcher: [`/(en|ko)/:path*`] // TODO: en|ko -> locales를 이용해 동적삽입 필요
};
