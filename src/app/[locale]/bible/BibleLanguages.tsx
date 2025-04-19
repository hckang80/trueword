'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useBible } from './Provider';
import { fetchTranslations, getLanguageFullName } from '@/features/bible';
import { useQuery } from '@tanstack/react-query';
import { translationsKeys } from '@/shared';

export default function BibleLanguages({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { isChangingBookLanguage } = useBible();

  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const value = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('bibleLanguage') || locale;
  }, [locale]);

  const { data: translationVersions = [] } = useQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslations,
    staleTime: 1000 * 60 * 5
  });

  const handleChange = useCallback(
    (language: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set('bibleLanguage', language);
      window.history.pushState(null, '', `${pathname}?${params.toString()}`);
      setOpen(false);
    },
    [pathname, setOpen]
  );

  const languages = [...new Set([...Object.values(translationVersions).map(({ lang }) => lang)])];
  const languagesWithLabel = languages.map((language) => ({
    language,
    label: getLanguageFullName(language, language)
  }));

  return (
    <Select value={value} onValueChange={handleChange} disabled={isChangingBookLanguage}>
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
