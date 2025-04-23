import { newsKeys } from '@/shared';
import { fetchNews } from '@/features/news';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';
import { fetchScrapedContent, fetchSummary } from '@/entities/news';

type Props = { params: Promise<{ source: string[] }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  const { source } = await params;

  const newsBySource = await NewsBySource(source);

  return {
    title: `${newsBySource?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { source } = await params;

  const newsBySource = await NewsBySource(source);

  if (!newsBySource) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['scraped', newsBySource.link],
    queryFn: () => fetchScrapedContent(newsBySource.link)
  });

  const scraped = await fetchScrapedContent(newsBySource.link);

  await queryClient.prefetchQuery({
    queryKey: ['summary', scraped.content, scraped.title],
    queryFn: () => fetchSummary({ content: scraped.content, title: scraped.title })
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container news={newsBySource} />
    </HydrationBoundary>
  );
}

async function NewsBySource([source, id]: string[]) {
  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery({
    queryKey: newsKeys._def,
    queryFn: fetchNews
  });

  const newsBySource = news.find(({ guid, sourceEng }) => guid === id && sourceEng && source);

  return newsBySource;
}
