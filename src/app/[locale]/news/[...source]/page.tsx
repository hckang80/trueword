import { axiosInstance, newsKeys } from '@/shared';
import { fetchNews } from '@/features/news';
import { QueryClient } from '@tanstack/react-query';
import Container from './__container';

export default async function NewsIdPage({ params }: { params: Promise<{ source: string[] }> }) {
  const queryClient = new QueryClient();
  const {
    source: [source, id]
  } = await params;

  const news = await queryClient.fetchQuery({
    queryKey: newsKeys._def,
    queryFn: fetchNews
  });

  const newsById = news.find(({ guid, sourceEng }) => guid === id && sourceEng && source);

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

  return <Container data={data.summary} />;
}
