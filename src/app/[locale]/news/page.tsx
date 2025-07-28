import type { Metadata, ResolvingMetadata } from 'next';
import Container from '../news/__container';

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  return {
    title: `News - ${previousTitle?.absolute}`
  };
}

export default async function NewsPage() {
  return <Container />;
}
