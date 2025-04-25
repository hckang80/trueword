'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

const useBibleParams = () => {
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const routeParams = useParams<{ locale: string }>();
  const { locale } = routeParams;

  return { urlSearchParams, pathname, locale };
};

export const useBibleLanguage = () => {
  const { urlSearchParams, locale } = useBibleParams();

  return urlSearchParams.get('translation') || locale;
};

export const useUpdateBibleParams = () => {
  const { urlSearchParams, pathname, locale } = useBibleParams();

  return ({
    language = urlSearchParams.get('translation') || locale,
    abbreviation
  }: {
    language?: string;
    abbreviation: string;
  }) => {
    urlSearchParams.set('translation', language);
    urlSearchParams.set('abbreviation', abbreviation);
    window.history.pushState(null, '', `${pathname}?${urlSearchParams.toString()}`);
  };
};
