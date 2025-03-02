'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { getLanguageFullName } from '@/lib/utils';
import { useBible } from './Provider';

export default function BibleLanguages() {
  const { translations, isChangingBookLanguage } = useBible();

  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const params = new URLSearchParams(location.search);

  const [value, setValue] = useState(params.get('bibleLanguage') || locale);

  const handleChange = (language: string) => {
    params.set('bibleLanguage', language);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
    setValue(language);
  };

  const languages = [...new Set([...Object.values(translations).map(({ lang }) => lang)])];
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
