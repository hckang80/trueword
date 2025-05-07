import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import {
  localizedTranslationVersionsQueryOptions,
  bibleChapterInstanceQueryOptions,
  translationBooksQueryOptions
} from '@/features/bible';
import type { Metadata, ResolvingMetadata } from 'next';
import { LoaderCircle } from 'lucide-react';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ locale: string }>;
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
  const getTranslationVersionId = abbreviation || defaultTranslation.abbreviation;

  await Promise.all([
    queryClient.prefetchQuery(
      bibleChapterInstanceQueryOptions([getTranslationVersionId, '1', '1'])
    ),
    queryClient.prefetchQuery(translationBooksQueryOptions(getTranslationVersionId))
  ]);

  return (
    <Suspense
      fallback={
        <div className="center-absolute">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container />
      </HydrationBoundary>
    </Suspense>
  );
}
