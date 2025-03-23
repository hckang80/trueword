import { axiosInstance, newsKeys } from '@/shared';
import type { NewsItem } from '@/entities/news';
import { useQuery } from '@tanstack/react-query';

export async function fetchNews(): Promise<NewsItem[]> {
  const { data } = await axiosInstance<NewsItem[]>('/api/news');
  return data;
}

export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: newsKeys._def,
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 15
  });
}
