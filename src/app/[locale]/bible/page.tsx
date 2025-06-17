import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import {
  localizedTranslationVersionsQueryOptions,
  bibleChapterInstanceQueryOptions,
  translationBooksQueryOptions,
  translationVersionsQueryOptions,
  getLanguageFullName
} from '@/features/bible';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { isSupportedLocale, Loading, type RouteProps } from '@/shared';

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
  const { locale } = await params;
  const { abbreviation } = await searchParams;

  const queryClient = new QueryClient();

  if (!isSupportedLocale(locale) || !getLanguageFullName(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const localizedTranslationVersions = await queryClient.fetchQuery(
    localizedTranslationVersionsQueryOptions(getLanguageFullName(locale, 'en'))
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
