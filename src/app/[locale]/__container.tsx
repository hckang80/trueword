'use client';

import { useBibleToday } from '@/features/bible';
import { HomeNewsItem, useNews } from '@/features/news';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared';
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

  const { data: news } = useNews(locale);
  const filteredNews = news.filter(({ thumbnail }) => thumbnail).slice(0, 4);

  return (
    <div className="p-[var(--global-inset)]">
      <Card>
        <CardHeader>
          <CardTitle>{t('todaysVerse')}</CardTitle>
          <CardDescription>{verse.name}</CardDescription>
          <CardAction>
            <Button size="sm" asChild>
              <Link href={moreTodayWord}>{t('viewFullContext')}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>{verse.text}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('news')}</CardTitle>
          <CardDescription>{t('newsDescription')}</CardDescription>
          <CardAction>
            <Button size="sm" asChild>
              <Link href={moreTodayWord}>{t('more')}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-4">
            {filteredNews.map((item) => (
              <HomeNewsItem key={item.guid} item={item} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
