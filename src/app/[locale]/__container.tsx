'use client';

import { useBibleToday } from '@/features/bible';
import { Button } from '@/shared';
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
    <div className="p-[var(--global-inset)]">
      <section>
        <h2>{t('todaysVerse')}</h2>
        <p>{verse.name}</p>
        <p>{verse.text}</p>
        <Button size="sm" className="mt-2" asChild>
          <Link href={moreTodayWord}>{t('viewFullContext')}</Link>
        </Button>
      </section>
    </div>
  );
}
