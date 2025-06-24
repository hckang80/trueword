'use client';

import { getLanguageFullName } from '../lib';
import { useRouter } from 'nextjs-toploader/app';
import { useLocale } from 'next-intl';

export const useBibleLanguage = () => {
  const locale = useLocale();

  return getLanguageFullName(locale, 'en');
};

export const useUpdateBibleParams = () => {
  const router = useRouter();
  const locale = useLocale();

  return ({
    abbreviation,
    bookNumber = 1,
    chapterNumber = 1
  }: {
    abbreviation: string;
    bookNumber?: number;
    chapterNumber?: number;
  }) => {
    const reference = [abbreviation, bookNumber, chapterNumber];
    const href = `/${locale}/bible/${reference.join('/')}`;
    router.push(href);
  };
};
