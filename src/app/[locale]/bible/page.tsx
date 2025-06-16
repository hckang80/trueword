import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import {
  localizedTranslationVersionsQueryOptions,
  bibleChapterInstanceQueryOptions,
  translationBooksQueryOptions,
  translationVersionsQueryOptions
} from '@/features/bible';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { Loading, type RouteProps } from '@/shared';

type Props = RouteProps & {
  searchParams: Promise<Partial<{ locale: string; abbreviation: string }>>;
};

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  return {
    title: `Bible - ${previousTitle?.absolute}`
  };
}

export default async function Bible({ params, searchParams }: Props) {
  const { locale: language } = await params;
  const { abbreviation } = await searchParams;

  const queryClient = new QueryClient();

  const localizedTranslationVersions = await queryClient.fetchQuery(
    localizedTranslationVersionsQueryOptions(language)
  );

  const [defaultTranslation] = localizedTranslationVersions;
  const getTranslationVersionId = abbreviation || defaultTranslation.short_name;

  await Promise.all([
    queryClient.prefetchQuery(
      bibleChapterInstanceQueryOptions([getTranslationVersionId, '1', '1'])
    ),
    queryClient.prefetchQuery(translationBooksQueryOptions(getTranslationVersionId)),
    queryClient.prefetchQuery(translationVersionsQueryOptions)
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container />
      </HydrationBoundary>
    </Suspense>
  );
}
