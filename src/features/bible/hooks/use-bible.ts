'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

export const useBibleLanguage = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const routeParams = useParams<{ locale: string }>();
  const { locale: userLocale } = routeParams;

  return params.get('translation') || userLocale;
};

export const useBibleParamsChange = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const routeParams = useParams<{ locale: string }>();
  const pathname = usePathname();

  return ({
    language = params.get('translation') || routeParams.locale,
    abbreviation
  }: {
    language?: string;
    abbreviation: string;
  }) => {
    params.set('translation', language);
    params.set('abbreviation', abbreviation);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };
};
