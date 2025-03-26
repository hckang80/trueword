import { axiosInstance, newsKeys } from '@/shared';
import { fetchNews } from '@/features/news';
import { QueryClient } from '@tanstack/react-query';
import Container from './__container';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = { params: Promise<{ source: string[] }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousTitle = (await parent).title;

  const { source } = await params;

  const newsById = await NewsBySource(source);

  return {
    title: `${newsById?.title} - ${previousTitle?.absolute}`
  };
}

export default async function NewsIdPage({ params }: Props) {
  const { source } = await params;

  const newsById = await NewsBySource(source);

  if (!newsById) return <p>찾으시는 뉴스 결과가 없습니다.</p>;

  const scrapeResponse = await axiosInstance.post<{ content: string; title: string }>(
    '/api/scrape',
    { url: newsById.link }
  );
  const { content, title } = scrapeResponse.data;

  const { data } = await axiosInstance.post<{ summary: string }>('/api/summarize', {
    content,
    title
  });

  return <Container summary={data.summary} news={newsById} />;
}

export async function NewsBySource([source, id]: string[]) {
  const queryClient = new QueryClient();

  const news = await queryClient.fetchQuery({
    queryKey: newsKeys._def,
    queryFn: fetchNews
  });

  const newsById = news.find(({ guid, sourceEng }) => guid === id && sourceEng && source);

  return newsById;
}
