import { backgroundPhotoQueryOptions, type PhotoParams } from '@/entities/background';
import { bibleTodayQueryOptions } from '@/features/bible';
import { newsQueryOptions } from '@/features/news';
import type { RouteProps } from '@/shared';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';

const MainPage = async ({ params }: RouteProps) => {
  const PHOTO_LIST_SIZE = 10;
  const { locale } = await params;
  const backgroundPhotoParams = {
    query: 'river natural empty center',
    page: 1,
    perPage: PHOTO_LIST_SIZE,
    orientation: 'landscape'
  } satisfies PhotoParams;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(bibleTodayQueryOptions(locale)),
    queryClient.prefetchQuery(newsQueryOptions(locale)),
    queryClient.prefetchQuery(backgroundPhotoQueryOptions(backgroundPhotoParams))
  ]);
  const dehydratedState = dehydrate(queryClient);

  const randomBackgroundPhotoIndex = new Date().getUTCDate() % PHOTO_LIST_SIZE;

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container
        backgroundPhotoParams={backgroundPhotoParams}
        randomBackgroundPhotoIndex={randomBackgroundPhotoIndex}
      />
    </HydrationBoundary>
  );
};

export default MainPage;
