import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';
import { newsQueryOptions } from '@/features/news';
import { axiosInstance, type RouteProps } from '@/shared';
import { backgroundPhotoQueryOptions, type PhotoParams } from '@/entities/background';

const MainPage = async ({ params }: RouteProps) => {
  const { locale } = await params;
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale)),
    queryClient.prefetchQuery(
      backgroundPhotoQueryOptions({
        query: 'cat',
        page: 1,
        perPage: 10,
        color: 'green',
        orientation: 'portrait'
      })
    )
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
};

export default MainPage;
