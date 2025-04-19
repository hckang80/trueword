import { Suspense } from 'react';
import Container from './__container';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { bibleKeys, translationsKeys } from '@/shared';
import { BibleProvider } from './Provider';
import { fetchTranslations, fetchTranslationsByLanguage } from '@/features/bible';
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

export default async function Bible({ params, searchParams }: Props) {
  const { locale: userLocale } = await params;

  const queryClient = new QueryClient();

  const { bibleLanguage = '' } = await searchParams;

  const language = bibleLanguage || userLocale;

  const translationVersions = await queryClient.fetchQuery({
    queryKey: translationsKeys._def,
    queryFn: fetchTranslations
  });

  const localizedTranslationVersions = await queryClient.fetchQuery({
    ...translationsKeys.data(language),
    queryFn: () => translationVersions.filter(({ lang }) => lang === language)
  });

  const [defaultTranslation] = localizedTranslationVersions;

  const bible = await queryClient.fetchQuery({
    ...bibleKeys.data(defaultTranslation.abbreviation),
    queryFn: () => fetchTranslationsByLanguage(defaultTranslation.abbreviation)
  });

  return (
    <Suspense
      fallback={
        <div className="text-center">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BibleProvider data={bible}>
          <Container />
        </BibleProvider>
      </HydrationBoundary>
    </Suspense>
  );
}
