import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from '../news/__container';
import { fetchNews } from '@/features/news';
import { newsKeys } from '@/shared';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  return {
    title: `News - ${previousTitle?.absolute}`
  };
}

export default async function NewsPage() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: newsKeys._def,
    queryFn: fetchNews
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
}
