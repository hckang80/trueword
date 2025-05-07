'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { getLanguageFullName, useBibleLanguage, useUpdateBibleParams } from '@/features/bible';
import { useTranslationVersions } from '@/features/bible';

export default function BibleLanguages() {
  const value = useBibleLanguage();
  const updateBibleParams = useUpdateBibleParams();

  const { data: translationVersions } = useTranslationVersions();

  const getTranslationVersion = (language: string) =>
    translationVersions.find(({ lang }) => lang === language);

  const handleChange = (language: string) => {
    const translationVersion = getTranslationVersion(language);
    if (!translationVersion) return;

    updateBibleParams({ language, abbreviation: translationVersion.abbreviation });
  };

  const languages = [...new Set([...Object.values(translationVersions).map(({ lang }) => lang)])];
  const languagesWithLabel = languages.map((language) => ({
    language,
    label: getLanguageFullName(language, language)
  }));

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {languagesWithLabel.map(({ language, label }) => (
          <SelectItem value={language} key={language}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
