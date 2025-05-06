import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { bibleKeys, translationsKeys } from '@/shared';
import {
  fetchTranslationVersions,
  fetchBibleInstance,
  fetchTranslationBooks
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

  console.time('translationVersions');
  const translationVersions = await queryClient.fetchQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslationVersions,
    staleTime: Infinity
  });
  console.timeEnd('translationVersions');

  console.time('localizedTranslationVersions');
  const localizedTranslationVersions = await queryClient.fetchQuery({
    ...translationsKeys.data(language),
    queryFn: () => translationVersions.filter(({ lang }) => lang === language)
  });
  console.timeEnd('localizedTranslationVersions');

  const [defaultTranslation] = localizedTranslationVersions;
  const getTranslationVersionId = abbreviation || defaultTranslation.abbreviation;

  console.time('fetchBibleInstance');
  await queryClient.prefetchQuery({
    ...bibleKeys.data([getTranslationVersionId, '1', '1']),
    queryFn: () => fetchBibleInstance(getTranslationVersionId, '1', '1')
  });
  console.timeEnd('fetchBibleInstance');

  await queryClient.prefetchQuery({
    queryKey: [getTranslationVersionId],
    queryFn: () => fetchTranslationBooks(getTranslationVersionId)
  });

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
