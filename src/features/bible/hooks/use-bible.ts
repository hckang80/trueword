'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

export const useBibleLanguage = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const bibleLanguage = params.get('locale');
  const routeParams = useParams<{ locale: string }>();
  const { locale: userLocale } = routeParams;

  return bibleLanguage || userLocale;
};

export const useBibleParamsChange = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const routeParams = useParams<{ locale: string }>();
  const pathname = usePathname();

  return ({
    language = params.get('locale') || routeParams.locale,
    abbreviation
  }: {
    language?: string;
    abbreviation: string;
  }) => {
    params.set('locale', language);
    params.set('abbreviation', abbreviation);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };
};
