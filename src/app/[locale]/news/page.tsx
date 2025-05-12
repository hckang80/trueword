import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Container from '../news/__container';
import { newsQueryOptions } from '@/features/news';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  return {
    title: `News - ${previousTitle?.absolute}`
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(newsQueryOptions(locale));

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense
      fallback={
        <div className="center-absolute">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <HydrationBoundary state={dehydratedState}>
        <Container />
      </HydrationBoundary>
    </Suspense>
  );
}
