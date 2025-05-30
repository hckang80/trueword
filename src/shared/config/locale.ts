export const isSupportedLocale = (
  locale: string
): locale is 'en' | 'ko' | 'zh' | 'zh-Hans' | 'zh-Hant' | 'de' | 'nl' | 'sv' => {
  return ['en', 'ko', 'zh', 'zh-Hans', 'zh-Hant', 'de', 'nl', 'sv'].includes(locale);
};

export const locales = ['en', 'ko', 'zh', 'zh-Hans', 'zh-Hant', 'de', 'nl', 'sv'] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const supportedTranslations = locales.map((locale) => getLocaleDisplayName(locale));

function getLocaleDisplayName(locale: Locale, targetLocale: string = 'en') {
  const displayNames = new Intl.DisplayNames([targetLocale], { type: 'language' });
  return displayNames.of(locale) || locale;
}
