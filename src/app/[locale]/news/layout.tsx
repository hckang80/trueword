import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { newsQueryOptions } from '@/features/news';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function NewsLayout({ children, params }: Props) {
  const { locale } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(newsQueryOptions(locale));

  const dehydratedState = dehydrate(queryClient);

  return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
