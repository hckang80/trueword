'use client';

import { type PhotoParams, useBackgroundPhoto } from '@/entities/background';
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
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function MainContainer({
  backgroundPhotoParams
}: {
  backgroundPhotoParams: PhotoParams;
}) {
  const locale = useLocale();

  const {
    data: { verse, abbreviation, bookNumber }
  } = useBibleToday(locale);

  const moreTodayWordPath = `/bible/${abbreviation}/${bookNumber}/${verse.chapter}#${verse.verse}`;

  const t = useTranslations('Home');

  const { data: news } = useNews(locale);
  const MAX_NEWS_ITEMS = 4;
  const filteredNews = news.filter(({ thumbnail }) => thumbnail).slice(0, MAX_NEWS_ITEMS);

  const { data: photoData } = useBackgroundPhoto(backgroundPhotoParams);
  console.log({ photoData });

  return (
    <div className="flex flex-col gap-4 p-[var(--global-inset)]">
      {photoData.results.map(({ urls, width, height, alt_description }) => {
        return <Image src={urls.regular} width={width} height={height} alt={alt_description} />;
      })}

      <Card>
        <CardHeader>
          <CardTitle>{t('todaysVerse')}</CardTitle>
          <CardDescription>{verse.name}</CardDescription>
          <CardAction>
            <Button size="sm" asChild>
              <Link href={moreTodayWordPath}>{t('viewFullContext')}</Link>
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
              <Link href="/news">{t('more')}</Link>
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

      <footer className="text-xs text-center">
        &copy; {new Date().getFullYear()} TrueWord. All rights reserved.
      </footer>
    </div>
  );
}
