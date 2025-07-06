import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';
import { newsQueryOptions } from '@/features/news';
import { axiosInstance, type RouteProps } from '@/shared';
import { PhotoParams } from '@/app/api/background/route';

const MainPage = async ({ params }: RouteProps) => {
  const { locale } = await params;
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale))
  ]);
  const dehydratedState = dehydrate(queryClient);

  const { data } = await axiosInstance('/api/background', {
    params: {
      query: 'cat',
      page: 1,
      perPage: 10,
      color: 'green',
      orientation: 'portrait'
    } satisfies PhotoParams
  });
  console.log({ data });

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
};

export default MainPage;
