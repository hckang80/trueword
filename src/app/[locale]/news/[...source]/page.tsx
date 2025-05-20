import {
  getNewsItem,
  newsQueryOptions,
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

  const news = await queryClient.fetchQuery(newsQueryOptions(locale));
  const newsBySource = getNewsItem(news, sources);

  return {
    title: `${newsBySource?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { locale, source: sources } = await params;
  const t = await getTranslations('News');

  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery(newsQueryOptions(locale));
  const newsBySource = getNewsItem(news, sources);

  if (!newsBySource) return <p className="center-absolute">{t('noNews')}</p>;

  const scraped = await queryClient.fetchQuery(
    scrapedContentQueryOptions(newsBySource.link, newsBySource.description)
  );

  await queryClient.prefetchQuery(summaryQueryOptions(scraped.content, scraped.title, locale));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
