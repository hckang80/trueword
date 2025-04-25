import { axiosInstance, newsKeys } from '@/shared';
import type { NewsItem } from '@/entities/news';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export async function fetchNews(): Promise<NewsItem[]> {
  const { data } = await axiosInstance<NewsItem[]>('/api/news');
  return data;
}

export async function fetchScrapedContent(url: string) {
  const { data } = await axiosInstance.post<{ content: string; title: string }>('/api/scrape', {
    url
  });
  return data;
}

export async function fetchSummary({ content, title }: { content: string; title: string }) {
  const { data } = await axiosInstance.post<{ summary: string }>('/api/summarize', {
    content,
    title
  });
  return data;
}

export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: newsKeys._def,
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5
  });
}

export function useNewsBySource(sources: string[]) {
  const [source, id] = sources;

  return useSuspenseQuery({
    ...newsKeys.data(sources),
    queryFn: fetchNews,
    select: (news) => news.find(({ guid, sourceEng }) => guid === id && sourceEng === source),
    staleTime: 1000 * 60 * 5
  });
}

export function useScrapedContent(url: string) {
  return useSuspenseQuery({
    queryKey: ['scraped', url],
    queryFn: () => fetchScrapedContent(url),
    staleTime: 1000 * 60 * 5
  });
}

export function useSummary(content: string, title: string) {
  return useSuspenseQuery({
    queryKey: ['summary', title],
    queryFn: () => fetchSummary({ content, title }),
    staleTime: 1000 * 60 * 5
  });
}
