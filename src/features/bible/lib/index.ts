import { TransitionVersion } from '@/features/bible';
import { DEFAULT_LOCALE, supportedTranslations } from '@/shared';

export function getLanguageFullName(langCode: string, locale: string = DEFAULT_LOCALE) {
  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
  return displayNames.of(langCode) || '';
}

export function availableTranslationVersions(
  versions: Record<string, TransitionVersion>
): TransitionVersion[] {
  return Object.values(versions).filter(
    ({ distribution_license, distribution_versification, language }) => {
      const conditions = {
        language: supportedTranslations.includes(language),
        license: ['Public Domain', 'Copyrighted; Free non-commercial distribution'].includes(
          distribution_license
        ),
        versification: !!distribution_versification
      };
      return Object.values(conditions).every(Boolean);
    }
  );
}
