import { DEFAULT_LOCALE } from '@/shared';

export function getLanguageFullName(langCode: string, locale = DEFAULT_LOCALE) {
  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
  return displayNames.of(langCode) || '';
}
