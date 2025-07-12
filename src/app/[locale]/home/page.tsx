import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';
import { newsQueryOptions } from '@/features/news';
import { getRandomPositiveInt, type RouteProps } from '@/shared';
import { backgroundPhotoQueryOptions, type PhotoParams } from '@/entities/background';

const MainPage = async ({ params }: RouteProps) => {
  const PHOTO_LIST_SIZE = 10;
  const { locale } = await params;
  const backgroundPhotoParams = {
    query: 'river natural empty center',
    page: 1,
    perPage: PHOTO_LIST_SIZE,
    color: 'black_and_white',
    orientation: 'landscape'
  } satisfies PhotoParams;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale)),
    queryClient.prefetchQuery(backgroundPhotoQueryOptions(backgroundPhotoParams))
  ]);
  const dehydratedState = dehydrate(queryClient);

  const randomBackgroundPhotoIndex = new Date().getDate() % PHOTO_LIST_SIZE;

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container
        backgroundPhotoParams={backgroundPhotoParams}
        randomBackgroundPhotoIndex={randomBackgroundPhotoIndex}
        perPage={PHOTO_LIST_SIZE}
      />
    </HydrationBoundary>
  );
};

export default MainPage;
