import {
  newsBySourceQueryOptions,
  scrapedContentQueryOptions,
  summaryQueryOptions
} from '@/features/news';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = { params: Promise<{ source: string[] }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  const { source } = await params;

  const { newsBySource } = await NewsBySource(source);

  return {
    title: `${newsBySource?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { source: sources } = await params;

  const { queryClient, newsBySource } = await NewsBySource(sources);

  if (!newsBySource) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  const scraped = await queryClient.fetchQuery(scrapedContentQueryOptions(newsBySource.link));

  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}

async function NewsBySource([source, id]: string[]) {
  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery(newsBySourceQueryOptions([source, id]));

  const newsBySource = news.find(({ guid, sourceEng }) => guid === id && sourceEng && source);

  return { queryClient, newsBySource };
}
