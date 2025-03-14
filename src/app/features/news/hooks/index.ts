import type { NewsItem } from '@/app/entities/news';
import { useQuery } from '@tanstack/react-query';

async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch('/api/news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
}

export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 15, // 15분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: 1
  });
}
