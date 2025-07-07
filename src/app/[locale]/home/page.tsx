import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';
import { newsQueryOptions } from '@/features/news';
import type { RouteProps } from '@/shared';
import { backgroundPhotoQueryOptions, type PhotoParams } from '@/entities/background';

const MainPage = async ({ params }: RouteProps) => {
  const { locale } = await params;
  const backgroundPhotoParams = {
    query: 'verse empty center',
    page: 1,
    perPage: 10,
    color: 'white',
    orientation: 'portrait'
  } satisfies PhotoParams;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale)),
    queryClient.prefetchQuery(backgroundPhotoQueryOptions(backgroundPhotoParams))
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container backgroundPhotoParams={backgroundPhotoParams} />
    </HydrationBoundary>
  );
};

export default MainPage;
