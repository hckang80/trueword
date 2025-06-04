import { bibleKeys, Locale, translationsKeys } from '@/shared';
import { useQuery, useSuspenseQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  fetchBibleInstance,
  fetchTranslationBooks,
  fetchYouTubeVideos,
  getLocalizedTranslationVersions,
  fetchTranslationVersions,
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

export const localizedTranslationVersionsQueryOptions = (locale: Locale) => ({
  ...translationsKeys.data(locale),
  queryFn: () => getLocalizedTranslationVersions(locale),
  staleTime: Infinity
});
export const useLocalizedTranslationVersions = (locale: Locale) => {
  return useSuspenseQuery(localizedTranslationVersionsQueryOptions(locale));
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
