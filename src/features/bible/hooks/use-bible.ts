'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { getLanguageFullName } from '../lib';

export const useBibleParams = () => {
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const routeParams = useParams<{ locale: string }>();
  const { locale } = routeParams;

  return { urlSearchParams, pathname, locale };
};

export const useBibleSearchParams = () => {
  const searchParams = useSearchParams();

  return {
    abbreviation: searchParams.get('abbreviation'),
    bookNumber: searchParams.get('bookNumber') || '1',
    chapterNumber: searchParams.get('chapterNumber') || '1',
    verseNumber: searchParams.get('verseNumber')
  };
};

export const useBibleLanguage = () => {
  const { locale } = useBibleParams();

  return getLanguageFullName(locale, 'en');
};

export const useUpdateBibleParams = () => {
  const { urlSearchParams, pathname } = useBibleParams();

  return ({
    abbreviation,
    bookNumber = 1,
    chapterNumber = 1,
    verseNumber = 0
  }: {
    abbreviation: string;
    bookNumber?: number;
    chapterNumber?: number;
    verseNumber?: number;
  }) => {
    urlSearchParams.set('abbreviation', abbreviation);
    urlSearchParams.set('bookNumber', '' + bookNumber);
    urlSearchParams.set('chapterNumber', '' + chapterNumber);
    urlSearchParams.set('verseNumber', '' + verseNumber);
    window.history.pushState(null, '', `${pathname}?${urlSearchParams.toString()}`);
  };
};
