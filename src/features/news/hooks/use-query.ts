import { newsKeys } from '@/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchNews, fetchScrapedContent, fetchSummary } from '../api';
import type { NewsItem } from '../model';

export const newsQueryOptions = {
  queryKey: newsKeys._def,
  queryFn: fetchNews,
  staleTime: 1000 * 60 * 5
};
export function useNews() {
  return useSuspenseQuery<NewsItem[]>(newsQueryOptions);
}

export function newsBySourceQueryOptions(sources: string[]) {
  return {
    ...newsKeys.data(sources),
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5
  };
}
export function useNewsBySource(sources: string[]) {
  const [source, id] = sources;

  return useSuspenseQuery({
    ...newsBySourceQueryOptions(sources),
    select: (news) => news.find(({ guid, sourceEng }) => guid === id && sourceEng === source)
  });
}

export function scrapedContentQueryOptions(url: string) {
  return {
    queryKey: ['scraped', url],
    queryFn: () => fetchScrapedContent(url),
    staleTime: 1000 * 60 * 5
  };
}
export function useScrapedContent(url: string) {
  return useSuspenseQuery(scrapedContentQueryOptions(url));
}

export function summaryQueryOptions(content: string, title: string) {
  return {
    queryKey: ['summary', title],
    queryFn: () => fetchSummary({ content, title }),
    staleTime: 1000 * 60 * 5
  };
}
export function useSummary(content: string, title: string) {
  return useSuspenseQuery(summaryQueryOptions(content, title));
}
