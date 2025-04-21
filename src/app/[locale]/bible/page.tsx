import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { bibleKeys, translationsKeys } from '@/shared';
import { fetchTranslationVersions, fetchBibleInstance } from '@/features/bible';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bibleLanguage?: string }>;
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

export default async function Bible({ params }: Props) {
  const { locale: language } = await params;

  const queryClient = new QueryClient();

  const translationVersions = await queryClient.fetchQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslationVersions
  });

  const localizedTranslationVersions = await queryClient.fetchQuery({
    ...translationsKeys.data(language),
    queryFn: () => translationVersions.filter(({ lang }) => lang === language)
  });

  const [defaultTranslation] = localizedTranslationVersions;

  queryClient.prefetchQuery({
    ...bibleKeys.data(defaultTranslation.abbreviation),
    queryFn: () => fetchBibleInstance(defaultTranslation.abbreviation)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container />
    </HydrationBoundary>
  );
}
