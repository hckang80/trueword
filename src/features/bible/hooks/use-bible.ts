'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { getLanguageFullName } from '../lib';
import { useRouter } from 'nextjs-toploader/app';

export const useBibleParams = () => {
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const routeParams = useParams<{ locale: string }>();
  const { locale } = routeParams;

  return { urlSearchParams, pathname, locale };
};

export const useBibleLanguage = () => {
  const { locale } = useBibleParams();

  return getLanguageFullName(locale, 'en');
};

export const useUpdateBibleParams = () => {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

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
