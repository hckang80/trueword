'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import {
  fetchTranslationVersions,
  getLanguageFullName,
  useBibleLanguage,
  useBibleStore
} from '@/features/bible';
import { useQuery } from '@tanstack/react-query';
import { translationsKeys } from '@/shared';
import { TransitionVersion } from '@/entities/bible';

export default function BibleLanguages({
  setOpen,
  setSelectedTranslationVersion
}: {
  setOpen: (open: boolean) => void;
  setSelectedTranslationVersion: (value: TransitionVersion) => void;
}) {
  const { setBibleLanguage } = useBibleStore();
  const value = useBibleLanguage();

  const { data: translationVersions = [] } = useQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslationVersions,
    staleTime: Infinity
  });

  const handleChange = (language: string) => {
    const translationVersion = translationVersions.find(({ lang }) => lang === language);
    if (!translationVersion) return;

    setBibleLanguage(language);
    setSelectedTranslationVersion(translationVersion);
    setOpen(false);
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
