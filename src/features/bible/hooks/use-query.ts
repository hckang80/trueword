import { bibleKeys, Locale, translationsKeys } from '@/shared';
import { useQuery, UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  fetchBibleInstance,
  fetchBibleToday,
  fetchTranslationBooks,
  fetchTranslationVersions,
  fetchYouTubeVideos,
  type YouTubeVideo
} from '..';

export const bibleChapterInstanceQueryOptions = (params: string[]) => ({
  ...bibleKeys.data(params),
  queryFn: () => fetchBibleInstance(params),
  staleTime: Infinity
});
export const useBibleChapterInstance = (params: string[]) => {
  return useSuspenseQuery(bibleChapterInstanceQueryOptions(params));
};

export const translationBooksQueryOptions = (getTranslationVersionId: string) => ({
  queryKey: [getTranslationVersionId],
  queryFn: () => fetchTranslationBooks(getTranslationVersionId),
  staleTime: Infinity
});
export const useTranslationBooks = (getTranslationVersionId: string) => {
  return useSuspenseQuery(translationBooksQueryOptions(getTranslationVersionId));
};

export const translationVersionsQueryOptions = {
  queryKey: translationsKeys._def,
  queryFn: fetchTranslationVersions,
  staleTime: Infinity
};
export const useTranslationVersions = () => {
  return useSuspenseQuery(translationVersionsQueryOptions);
};

export function useYouTubeVideos(
  query: string,
  queryOptions: Omit<UseQueryOptions<YouTubeVideo[]>, 'queryKey'>
) {
  return useQuery({
    queryKey: ['youtube', 'video', query],
    queryFn: () => fetchYouTubeVideos(query),
    staleTime: 1000 * 60 * 5,
    ...queryOptions
  });
}

export const bibleTodayQueryOptions = (locale: Locale) => ({
  queryKey: ['bible', 'today', locale],
  queryFn: () => fetchBibleToday(locale),
  staleTime: 1000 * 60 * 60 * 24
});
export function useBibleToday(locale: Locale) {
  return useSuspenseQuery(bibleTodayQueryOptions(locale));
}
