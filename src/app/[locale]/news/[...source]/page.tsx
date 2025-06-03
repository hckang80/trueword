import { newsBySourceQueryOptions } from '@/features/news';
import { QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';

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

export default async function NewsIdPage() {
  return <Container />;
}
