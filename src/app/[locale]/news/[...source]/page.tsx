import {
  newsBySourceQueryOptions,
  scrapedContentQueryOptions,
  summaryQueryOptions
} from '@/features/news';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string; source: string[] }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  const { locale, source: sources } = await params;

  const queryClient = new QueryClient();

  const newsBySource = await queryClient.fetchQuery(newsBySourceQueryOptions(sources, locale));

  return {
    title: `${newsBySource?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { locale, source: sources } = await params;
  const t = await getTranslations('News');

  const queryClient = new QueryClient();

  const metrics = {
    newsBySourceTime: 0,
    scrapedContentTime: 0,
    summaryTime: 0
  };

  const startNewsBySource = performance.now();
  const newsBySource = await queryClient.fetchQuery(newsBySourceQueryOptions(sources, locale));
  metrics.newsBySourceTime = performance.now() - startNewsBySource;

  if (!newsBySource) return <p className="center-absolute">{t('noNews')}</p>;

  const startScrapedContent = performance.now();
  const scraped = await queryClient.fetchQuery(
    scrapedContentQueryOptions(newsBySource.link, newsBySource.description)
  );
  metrics.scrapedContentTime = performance.now() - startScrapedContent;

  const startSummary = performance.now();
  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title, locale));
  metrics.summaryTime = performance.now() - startSummary;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Container />
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </>
    </HydrationBoundary>
  );
}
