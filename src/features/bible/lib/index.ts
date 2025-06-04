import { TransitionVersion } from '@/features/bible';
import { DEFAULT_LOCALE, isSupportedLocale, type Locale, locales } from '@/shared';

export function getLanguageFullName(langCode: Locale, locale = DEFAULT_LOCALE) {
  if (!langCode) throw Error('langCode가 빈 문자열입니다.');

  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
  return displayNames.of(langCode);
}

export function availableTranslationVersions(
  versions: Record<string, TransitionVersion>
): TransitionVersion[] {
  return Object.values(versions).filter(
    ({ distribution_license, distribution_versification, lang }) => {
      const conditions = {
        lang: isSupportedLocale(lang) && locales.includes(lang),
        license: ['Public Domain', 'Copyrighted; Free non-commercial distribution'].includes(
          distribution_license
        ),
        versification: !!distribution_versification
      };
      return Object.values(conditions).every(Boolean);
    }
  );
}
