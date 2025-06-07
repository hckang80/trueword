'use client';

import { useBibleToday } from '@/features/bible';
import { Link } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import type { UrlObject } from 'url';

export default function MainContainer() {
  const { locale } = useParams<{ locale: string }>();

  const {
    data: { verse, ...restData }
  } = useBibleToday(locale);

  const moreTodayWord: UrlObject = {
    pathname: '/bible',
    query: {
      ...restData,
      chapterNumber: verse.chapter,
      verseNumber: verse.verse
    }
  };

  const t = useTranslations('Home');

  return (
    <div>
      <div>
        <h2>{t('todaysVerse')}</h2>
        <p>{verse.name}</p>
        <p>{verse.text}</p>
        <Link href={moreTodayWord}>{t('viewFullContext')}</Link>
      </div>
    </div>
  );
}
