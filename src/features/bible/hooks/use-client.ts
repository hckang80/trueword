'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useBibleStore } from '../model';

export const useBibleLanguage = () => {
  const { bibleLanguage } = useBibleStore();
  const params = useParams<{ locale: string }>();
  const { locale: userLocale } = params;
  return bibleLanguage || userLocale;
};

export const useBibleParamsChange = () => {
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return ({
    language = params.locale,
    abbreviation
  }: {
    language?: string;
    abbreviation: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', language);
    params.set('abbreviation', abbreviation);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };
};
