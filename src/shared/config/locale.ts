export const isSupportedLocale = (locale: string): locale is 'en' | 'ko' => {
  return ['en', 'ko'].includes(locale);
};

export const translateLocales = ['en', 'ko', 'zh', 'zh-Hans', 'zh-Hant', 'de', 'nl', 'sv'] as const;
export const locales = ['en', 'ko'] as const;

export type Locale = (typeof locales)[number] | (string & {});

export const DEFAULT_LOCALE = 'ko';
