import { bibleTodayQueryOptions } from '@/features/bible';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react';
import Container from './__container';

type Props = {
  params: Promise<{ locale: string }>;
};

const MainPage = async ({ params }: Props) => {
  const { locale } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(bibleTodayQueryOptions(locale));
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
};

export default MainPage;
