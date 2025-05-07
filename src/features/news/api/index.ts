import { axiosInstance } from '@/shared';
import type { NewsItem } from '@/features/news';

export * from './fetchRssFeed';

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
