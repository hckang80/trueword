import { newsKeys } from '@/shared';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { fetchNews, fetchNewsSlice, fetchScrapedContent, fetchSummary } from '../api';
import type { NewsItem } from '../model';

export const newsQueryOptions = {
  queryKey: newsKeys._def,
  queryFn: fetchNews,
  staleTime: 1000 * 60 * 5
};
export function useNews() {
  return useSuspenseQuery<NewsItem[]>(newsQueryOptions);
}

export const useInfiniteNews = (allNews: NewsItem[]) => {
  return useInfiniteQuery({
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
