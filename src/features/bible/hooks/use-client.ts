'use client';

import { useParams } from 'next/navigation';
import { useBibleStore } from '../model';

export const useBibleLanguage = () => {
  const { bibleLanguage } = useBibleStore();
  const params = useParams<{ locale: string }>();
  const { locale: userLocale } = params;
  return bibleLanguage || userLocale;
};
