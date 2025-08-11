import { newsBySourceQueryOptions } from '@/features/news';
import type { RouteProps } from '@/shared/types';
import { QueryClient } from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';
import Container from './__container';

type Props = RouteProps & { params: Promise<{ source: string[] }> };

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
