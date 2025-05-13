import {
  newsBySourceQueryOptions,
  scrapedContentQueryOptions,
  summaryQueryOptions
} from '@/features/news';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';
import { getNewsItem } from '@/features/bible';

type Props = { params: Promise<{ locale: string; source: string[] }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  const { locale, source: sources } = await params;

  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery(newsBySourceQueryOptions(sources, locale));
  const newsBySource = getNewsItem(news, sources);

  return {
    title: `${newsBySource?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { locale, source: sources } = await params;

  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery(newsBySourceQueryOptions(sources, locale));
  const newsBySource = getNewsItem(news, sources);

  if (!newsBySource) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  const scraped = await queryClient.fetchQuery(scrapedContentQueryOptions(newsBySource.link));

  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title, locale));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
