import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from '../news/__container';
import { newsQueryOptions } from '@/features/news';
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

  await queryClient.fetchQuery(newsQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Container />
    </HydrationBoundary>
  );
}
