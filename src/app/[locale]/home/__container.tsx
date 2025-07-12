'use client';

import { type PhotoParams, shareVerseCard, useBackgroundPhoto } from '@/entities/background';
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
import { ChevronRight, Share2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

export default function MainContainer({
  backgroundPhotoParams,
  randomBackgroundPhotoIndex
}: {
  backgroundPhotoParams: PhotoParams;
  randomBackgroundPhotoIndex: number;
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
  const verseBackground = photoData.results[randomBackgroundPhotoIndex];

  return (
    <div className="flex flex-col gap-4 p-[var(--global-inset)]">
      <Card className="relative overflow-hidden">
        <Image
          src={verseBackground.urls.regular}
          alt={verseBackground.alt_description}
          fill
          priority
          sizes={`${verseBackground.width}px`}
        />
        <CardHeader className="relative">
          <CardTitle className="text-white font-semibold text-shadow-xs">
            {t('todaysVerse')}
          </CardTitle>
          <CardDescription className="text-gray-400 text-shadow-xs">{verse.name}</CardDescription>
          <CardAction className="flex gap-1">
            <Button
              size="icon"
              onClick={() => shareVerseCard(verse.text, verse.name, verseBackground.urls.regular)}
            >
              <Share2 />
            </Button>
            <Button size="icon" asChild>
              <Link href={moreTodayWordPath} title={t('viewFullContext')}>
                <ChevronRight />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-white font-semibold text-shadow-xs">{verse.text}</p>
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
