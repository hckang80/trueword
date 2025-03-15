export const isSupportedLocale = (locale: string): locale is 'en' | 'ko' => {
  return ['en', 'ko'].includes(locale);
};

export const locales = ['en', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = 'ko';
