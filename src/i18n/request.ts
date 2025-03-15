import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { DEFAULT_LOCALE, isSupportedLocale } from '@/shared';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isSupportedLocale(locale) || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    defaultLocale: DEFAULT_LOCALE,
    messages: (await import(`@/messages/${locale}.json`)).default,
    timeZone: 'Asia/Seoul'
  };
});
