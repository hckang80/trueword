export const isSupportedLocale = (
  locale: string
): locale is 'en' | 'ko' | 'zh' | 'zh-Hans' | 'zh-Hant' | 'de' | 'nl' | 'sv' => {
  return ['en', 'ko', 'zh', 'zh-Hans', 'zh-Hant', 'de', 'nl', 'sv'].includes(locale);
};

export const translateLocales = ['en', 'ko', 'zh', 'zh-Hans', 'zh-Hant', 'de', 'nl', 'sv'] as const;
export const locales = ['en', 'ko'];

export type Locale = (typeof translateLocales)[number] | (string & {});

export const DEFAULT_LOCALE = 'ko';
