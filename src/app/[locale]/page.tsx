import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';

const MainPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(bibleTodayQueryOptions);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
};

export default MainPage;
