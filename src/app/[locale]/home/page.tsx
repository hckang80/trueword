import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';
import { newsQueryOptions } from '@/features/news';
import type { RouteProps } from '@/shared';

const MainPage = async ({ params }: RouteProps) => {
  const { locale } = await params;
  const queryClient = new QueryClient();
  Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale))
  ]);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
};

export default MainPage;
