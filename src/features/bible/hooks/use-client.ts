'use client';

import { useParams, useSearchParams } from 'next/navigation';

export const useBibleLanguage = () => {
  const params = useParams<{ locale: string }>();
  const { locale: userLocale } = params;
  const searchParams = useSearchParams();
  const bibleLanguage = searchParams.get('bibleLanguage');
  return bibleLanguage || userLocale;
};
