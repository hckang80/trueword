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
  const routeParams = useParams<{ locale: string }>();
  const { locale } = routeParams;

  return {
    translation: searchParams.get('translation') || locale,
    abbreviation: searchParams.get('abbreviation'),
    bookNumber: searchParams.get('bookNumber') || '1',
    chapterNumber: searchParams.get('chapterNumber') || '1',
    verseNumber: searchParams.get('verseNumber')
  };
};

export const useBibleLanguage = () => {
  const { urlSearchParams, locale } = useBibleParams();

  return urlSearchParams.get('translation') || getLanguageFullName(locale);
};

export const useUpdateBibleParams = () => {
  const { urlSearchParams, pathname, locale } = useBibleParams();

  return ({
    language = urlSearchParams.get('translation') || locale,
    abbreviation,
    bookNumber = 1,
    chapterNumber = 1,
    verseNumber = 0
  }: {
    language?: string;
    abbreviation: string;
    bookNumber?: number;
    chapterNumber?: number;
    verseNumber?: number;
  }) => {
    urlSearchParams.set('translation', language);
    urlSearchParams.set('abbreviation', abbreviation);
    urlSearchParams.set('bookNumber', '' + bookNumber);
    urlSearchParams.set('chapterNumber', '' + chapterNumber);
    urlSearchParams.set('verseNumber', '' + verseNumber);
    window.history.pushState(null, '', `${pathname}?${urlSearchParams.toString()}`);
  };
};
