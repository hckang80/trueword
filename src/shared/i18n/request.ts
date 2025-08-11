import { DEFAULT_LOCALE, isSupportedLocale } from '@/shared/config';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isSupportedLocale(locale) || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    defaultLocale: DEFAULT_LOCALE,
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: 'Asia/Seoul'
  };
});
