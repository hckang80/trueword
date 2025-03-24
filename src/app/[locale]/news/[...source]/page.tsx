import { newsKeys } from '@/shared';
import { fetchNews } from '@/features/news';
import { QueryClient } from '@tanstack/react-query';

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

  return <pre>{JSON.stringify(newsById, null, 2)}</pre>;
}
