'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { locales } from '@/@types';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Locales() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(location.search);

  const [value, setValue] = useState(params.get('translatedVersion') || locale);

  const handleChange = (locale: string) => {
    params.set('translatedVersion', locale);
    router.replace(`${pathname}?${params.toString()}`);
    setValue(locale);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem value={locale} key={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
