import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { newsQueryOptions } from '@/features/news';
import type { RouteProps } from '@/shared';

export default async function NewsLayout({ children, params }: RouteProps) {
  const { locale } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(newsQueryOptions(locale));

  const dehydratedState = dehydrate(queryClient);

  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
