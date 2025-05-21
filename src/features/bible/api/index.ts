import type {
  BibleChapterInstance,
  TransitionVersion,
  TranslationBooks,
  YouTubeVideo
} from '@/features/bible';
import { axiosInstance } from '@/shared';
import { availableTranslationVersions } from '..';

export async function getLocalizedTranslationVersions(language: string) {
  const data = await fetchTranslationVersions();

  return data.filter(({ lang }) => lang === language);
}

export async function fetchTranslationVersions() {
  const { data } = await axiosInstance<Record<string, TransitionVersion>>('/api/translations');

  return availableTranslationVersions(data);
}

export async function fetchBibleInstance(params: string[]) {
  const [abbreviation, bookNumber, chapterNumber] = params;
  const { data } = await axiosInstance<BibleChapterInstance>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );

  return data;
}

export async function fetchTranslationBooks(translation: string) {
  const { data } = await axiosInstance<TranslationBooks>(`/translations/${translation}`);
  return data;
}

export async function fetchYouTubeVideos(query: string) {
  const { data } = await axiosInstance.get<YouTubeVideo[]>('/api/video', {
    params: {
      q: query
    }
  });
  return data;
}
