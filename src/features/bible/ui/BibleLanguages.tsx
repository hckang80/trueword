'use client';

import {
  type Locale,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared';
import { useBibleLanguage, useUpdateBibleParams } from '@/features/bible';
import { useTranslationVersions } from '@/features/bible';

function BibleLanguages() {
  const value = useBibleLanguage();
  const updateBibleParams = useUpdateBibleParams();

  const { data: translationVersions } = useTranslationVersions();

  const getTranslationVersion = (language: Locale) =>
    translationVersions.find(({ id }) => id === language);

  const handleChange = (language: Locale) => {
    const translationVersion = getTranslationVersion(language);
    if (!translationVersion) return;

    updateBibleParams({ language, abbreviation: translationVersion.translations[0].short_name });
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {translationVersions.map(({ id, language }) => (
          <SelectItem value={id} key={id}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default BibleLanguages;
