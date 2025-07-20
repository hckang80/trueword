'use client';

import {
  createVerseCard,
  PHOTO_SIZE,
  type PhotoParams,
  shareCard,
  useBackgroundPhoto
} from '@/entities/background';
import { useBibleToday } from '@/features/bible';
import { HomeNewsItem, useNews } from '@/features/news';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
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
  const MAX_NEWS_ITEMS = 6;
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
          <CardTitle className="text-white font-semibold custom-text-shadow-black">
            {`${t('todaysVerse')} (🌍 UTC)`}
          </CardTitle>
          <CardDescription className="text-gray-300 custom-text-shadow-black">
            {verse.name}
          </CardDescription>
          <CardAction className="flex gap-1">
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="icon">
                  <Share2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="p-0">
                  <DrawerTitle>말씀 카드 공유</DrawerTitle>
                  <DrawerDescription asChild>
                    <div className="snap-x snap-mandatory flex gap-3 overflow-x-auto mt-3">
                      {photoData.results.map(async ({ urls, alt_description }) => {
                        return (
                          <button
                            className="snap-center shrink-0"
                            key={urls.regular}
                            onClick={async () =>
                              shareCard({
                                verse: verse.text,
                                reference: verse.name,
                                ...(await createVerseCard({
                                  verse: verse.text,
                                  reference: verse.name,
                                  src: urls.regular
                                }))
                              })
                            }
                          >
                            <Image
                              src={
                                (
                                  await createVerseCard({
                                    verse: verse.text,
                                    reference: verse.name,
                                    src: urls.regular
                                  })
                                ).url
                              }
                              width={(PHOTO_SIZE / 10) * 3}
                              height={(PHOTO_SIZE / 10) * 3}
                              alt={alt_description}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
            <Button size="icon" asChild>
              <Link href={moreTodayWordPath} title={t('viewFullContext')}>
                <ChevronRight />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-white font-semibold custom-text-shadow-black">{verse.text}</p>
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
