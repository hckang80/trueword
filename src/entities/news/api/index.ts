export * from './extractThumbnail';
export * from './fetchRssFeed';

import { axiosInstance } from '@/shared';
import { useSuspenseQuery } from '@tanstack/react-query';

export const fetchScrapedContent = async (url: string) => {
  const { data } = await axiosInstance.post<{ content: string; title: string }>('/api/scrape', {
    url
  });
  return data;
};

export const fetchSummary = async ({ content, title }: { content: string; title: string }) => {
  const { data } = await axiosInstance.post<{ summary: string }>('/api/summarize', {
    content,
    title
  });
  return data;
};

export const useScrapedContent = (url: string) => {
  return useSuspenseQuery({
    queryKey: ['scraped', url],
    queryFn: () => fetchScrapedContent(url),
    staleTime: 1000 * 60 * 5
  });
};

export const useSummary = (content: string, title: string) => {
  return useSuspenseQuery({
    queryKey: ['summary', content, title],
    queryFn: () => fetchSummary({ content, title }),
    staleTime: 1000 * 60 * 5
  });
};
