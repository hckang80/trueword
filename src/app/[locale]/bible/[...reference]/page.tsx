import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import {
  bibleChapterInstanceQueryOptions,
  translationBooksQueryOptions,
  translationVersionsQueryOptions,
  getLanguageFullName
} from '@/features/bible';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { isSupportedLocale, Loading, type RouteProps } from '@/shared';

type Props = RouteProps & {
  params: Promise<{ reference: string[] }>;
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

export default async function BiblePage({ params }: Props) {
  const { locale, reference } = await params;
  const [translationVersionCode] = reference;

  const queryClient = new QueryClient();

  if (!isSupportedLocale(locale) || !getLanguageFullName(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  await Promise.all([
    queryClient.prefetchQuery(bibleChapterInstanceQueryOptions(reference)),
    queryClient.prefetchQuery(translationBooksQueryOptions(translationVersionCode)),
    queryClient.prefetchQuery(translationVersionsQueryOptions)
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container reference={reference} />
      </HydrationBoundary>
    </Suspense>
  );
}
