export function getLanguageFullName(langCode: string, locale = 'en') {
  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
  return displayNames.of(langCode) || '';
}
