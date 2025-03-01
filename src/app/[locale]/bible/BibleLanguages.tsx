'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { locales } from '@/@types';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { getLanguageFullName } from '@/lib/utils';

export default function BibleLanguages() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const params = new URLSearchParams(location.search);

  const [value, setValue] = useState(params.get('bibleLanguage') || locale);

  const handleChange = (language: string) => {
    params.set('bibleLanguage', language);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
    setValue(language);
  };

  const languages = [...locales, 'ja'];

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem value={language} key={language}>
            {getLanguageFullName(language, locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
