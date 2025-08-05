import { routing } from '@/shared/i18n/routing';
import createMiddleware from 'next-intl/middleware';

// const privatePages = [''];

// const handleI18nRouting = createMiddleware(routing);

// export default function middleware(request: NextRequest) {
//   const privatePathnameRegex = RegExp(
//     `^(/(${locales.join('|')}))?(${privatePages
//       .flatMap((p) => (p === '/' ? ['', '/'] : p))
//       .join('|')})/?$`,
//     'i'
//   );
//   const isPrivatePage = privatePathnameRegex.test(request.nextUrl.pathname);

//   return isPrivatePage ? updateSession(request) : handleI18nRouting(request);
// }
export default createMiddleware(routing);

export const config = {
  matcher: ['/(en|ko)/:path*']
};
