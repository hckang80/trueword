'use client';

import {
  type BackGroundPhoto,
  createVerseCard,
  PHOTO_SIZE,
  type PhotoParams,
  shareCard,
  useBackgroundPhoto
} from '@/entities/background';
import { type TodayVerseItem, useBibleToday } from '@/features/bible';
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
} from '@/shared/components';
import { Link } from '@/shared/i18n/routing';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronRight, Share2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Suspense } from 'react';

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
    <div className='flex flex-col gap-4'>
      <Card className='relative overflow-hidden'>
        <Image
          src={verseBackground.urls.regular}
          alt={verseBackground.alt_description}
          fill
          priority
          sizes={`${verseBackground.width}px`}
        />
        <CardHeader className='relative'>
          <CardTitle className='text-white font-semibold custom-text-shadow-black'>
            {`${t('todaysVerse')} (🌍 UTC)`}
          </CardTitle>
          <CardDescription className='text-gray-300 custom-text-shadow-black'>
            {verse.name}
          </CardDescription>
          <CardAction className='flex gap-1'>
            <Suspense
              fallback={
                <Button size='icon'>
                  <Share2 className='animate-spin' />
                </Button>
              }
            >
              <Drawer>
                <DrawerTrigger asChild>
                  <Button size='icon'>
                    <Share2 />
                    <span className='sr-only'>{t('viewVerseCard')}</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>{t('shareDialog.title')}</DrawerTitle>
                    <DrawerDescription asChild>
                      <div>
                        <p>{t('shareDialog.description')}</p>
                        <div className='snap-x snap-mandatory flex gap-3 overflow-x-auto mt-3'>
                          {photoData.results.map(photo => (
                            <VerseCardItem
                              key={photo.urls.regular}
                              photo={photo}
                              verse={verse}
                              callback={shareCard}
                            />
                          ))}
                        </div>
                      </div>
                    </DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </Suspense>
            <Button size='icon' asChild>
              <Link href={moreTodayWordPath} title={t('viewFullContext')}>
                <ChevronRight />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='relative'>
          <p className='text-white font-semibold custom-text-shadow-black'>{verse.text}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('news')}</CardTitle>
          <CardDescription>{t('newsDescription')}</CardDescription>
          <CardAction>
            <Button size='sm' asChild>
              <Link href='/news'>{t('more')}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className='grid grid-cols-2 gap-4'>
            {filteredNews.map(item => (
              <HomeNewsItem key={item.guid} item={item} />
            ))}
          </ul>
        </CardContent>
      </Card>

      <footer className='text-xs text-center'>
        &copy; {new Date().getFullYear()} TrueWord. All rights reserved.
      </footer>
    </div>
  );
}

function VerseCardItem({
  photo,
  verse,
  callback
}: {
  photo: BackGroundPhoto;
  verse: TodayVerseItem;
  callback: typeof shareCard;
}) {
  const { data: cardData, error } = useSuspenseQuery({
    queryKey: ['verseCard', photo.urls.regular],
    queryFn: async () => {
      return await createVerseCard({
        verse: verse.text,
        reference: verse.name,
        src: photo.urls.regular
      });
    }
  });

  if (error) throw new Error('말씀카드 생성 실패');

  return (
    <button
      className='snap-center shrink-0'
      key={photo.urls.regular}
      onClick={() =>
        callback({
          ...cardData,
          verse: verse.text,
          reference: verse.name
        })
      }
    >
      <Image
        src={cardData.url}
        width={(PHOTO_SIZE / 10) * 3}
        height={(PHOTO_SIZE / 10) * 3}
        alt={photo.alt_description}
      />
    </button>
  );
}
