import { type Locale } from '@/shared/config';
import { newsKeys } from '@/shared/lib';
import { useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  fetchNews,
  fetchNewsItem,
  fetchNewsSlice,
  fetchScrapedContent,
  fetchSummary
} from '../api';
import type { NewsItemType, SummaryRequestPayload } from '../model';

export function newsQueryOptions(locale: Locale) {
  return {
    queryKey: newsKeys._def,
    queryFn: () => fetchNews(locale),
    staleTime: Infinity
  };
}
export function useNews(locale: Locale) {
  return useSuspenseQuery<NewsItemType[]>({
    ...newsQueryOptions(locale),
    select: (news) => news.filter((item) => item.locale === locale)
  });
}

export const useInfiniteNews = (allNews: NewsItemType[]) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['news', allNews],
    queryFn: ({ pageParam }) => fetchNewsSlice(allNews, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const { is_end: isListEnd } = lastPage.meta;
      return isListEnd ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: Infinity
  });
};

export function newsBySourceQueryOptions(sources: string[], locale: Locale) {
  return {
    ...newsKeys.data(sources),
    queryFn: () => fetchNewsItem(sources, locale),
    staleTime: Infinity
  };
}
export function useNewsBySource(sources: string[], locale: Locale) {
  const [source, id] = sources;

  return useSuspenseQuery({
    ...newsQueryOptions(locale),
    select: (news) => news.find(({ guid, sourceEng }) => guid === id && sourceEng === source)
  });
}

export function scrapedContentQueryOptions(url: string, description: string) {
  return {
    queryKey: ['scraped', url],
    queryFn: () => fetchScrapedContent(url, description),
    staleTime: Infinity
  };
}
export function useScrapedContent(url: string, description: string) {
  return useSuspenseQuery(scrapedContentQueryOptions(url, description));
}

export function summaryQueryOptions(params: SummaryRequestPayload) {
  return {
    queryKey: ['summary', params.title],
    queryFn: () => fetchSummary(params),
    staleTime: Infinity
  };
}
export function useSummary(params: SummaryRequestPayload) {
  return useQuery(summaryQueryOptions(params));
}
