import { newsKeys } from '@/shared';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { fetchNews, fetchNewsSlice, fetchScrapedContent, fetchSummary } from '../api';
import type { NewsItem } from '../model';

export function newsQueryOptions(locale: string) {
  return {
    queryKey: newsKeys._def,
    queryFn: () => fetchNews(locale),
    staleTime: 1000 * 60 * 5
  };
}
export function useNews(locale: string) {
  return useSuspenseQuery<NewsItem[]>({
    ...newsQueryOptions(locale)
  });
}

export const useInfiniteNews = (allNews: NewsItem[]) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['news', allNews],
    queryFn: ({ pageParam }) => fetchNewsSlice(allNews, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const { is_end: isListEnd } = lastPage.meta;
      return isListEnd ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5
  });
};

export function newsBySourceQueryOptions(sources: string[], locale: string) {
  return {
    ...newsKeys.data(sources),
    queryFn: () => fetchNews(locale),
    staleTime: 1000 * 60 * 5
  };
}
export function useNewsBySource(sources: string[], locale: string) {
  const [source, id] = sources;

  return useSuspenseQuery({
    ...newsBySourceQueryOptions(sources, locale),
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

export function summaryQueryOptions(content: string, title: string, locale: string) {
  return {
    queryKey: ['summary', title],
    queryFn: () => fetchSummary({ content, title, locale }),
    staleTime: 1000 * 60 * 5
  };
}
export function useSummary(content: string, title: string, locale: string) {
  return useSuspenseQuery(summaryQueryOptions(content, title, locale));
}
