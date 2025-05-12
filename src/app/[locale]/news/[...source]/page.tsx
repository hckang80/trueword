import {
  newsBySourceQueryOptions,
  scrapedContentQueryOptions,
  summaryQueryOptions
} from '@/features/news';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';
import { getNewsItem } from '@/features/bible';

type Props = { params: Promise<{ source: string[] }> };

export default async function NewsIdPage({ params }: Props) {
  const { source: sources } = await params;

  const queryClient = new QueryClient();
  console.time('useNewsBySource');
  const news = await queryClient.fetchQuery(newsBySourceQueryOptions(sources));
  const newsBySource = getNewsItem(news, sources);
  console.timeEnd('useNewsBySource');
  if (!newsBySource) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  console.time('useScrapedContent');
  const scraped = await queryClient.fetchQuery(scrapedContentQueryOptions(newsBySource.link));
  console.timeEnd('useScrapedContent');

  console.time('useSummary');
  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title));
  console.timeEnd('useSummary');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
