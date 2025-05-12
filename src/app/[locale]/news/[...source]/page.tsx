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

  const performanceMetrics: Record<string, number> = {};

  const queryClient = new QueryClient();

  const startNews = Date.now();
  console.time('useNewsBySource');
  const news = await queryClient.fetchQuery(newsBySourceQueryOptions(sources));
  const newsBySource = getNewsItem(news, sources);
  console.timeEnd('useNewsBySource');
  performanceMetrics.newsBySource = Date.now() - startNews;

  if (!newsBySource) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  const startScrape = Date.now();
  console.time('useScrapedContent');
  const scraped = await queryClient.fetchQuery(scrapedContentQueryOptions(newsBySource.link));
  console.timeEnd('useScrapedContent');
  performanceMetrics.scrapedContent = Date.now() - startScrape;

  const startSummary = Date.now();
  console.time('useSummary');
  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title));
  console.timeEnd('useSummary');
  performanceMetrics.summary = Date.now() - startSummary;

  return (
    <>
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50 max-w-xs">
          <h4 className="font-bold mb-1">Server Timing:</h4>
          <ul>
            <li>News: {performanceMetrics.newsBySource}ms</li>
            <li>Scrape: {performanceMetrics.scrapedContent}ms</li>
            <li>Summary: {performanceMetrics.summary}ms</li>
          </ul>
        </div>
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container />
      </HydrationBoundary>
    </>
  );
}
