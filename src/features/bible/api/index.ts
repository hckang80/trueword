import { type Verse, type BibleBook, type TodayVerse, type YouTubeVideo } from '@/features/bible';
import { axiosInstance, type Locale } from '@/shared';
import type { BibleLanguage } from '..';

export async function getLocalizedTranslationVersions(language: string) {
  const data = await fetchTranslationVersions();

  const localizedData = data.find(({ id }) => id === language);

  if (!localizedData) {
    throw new Error(`No translation found for language: ${language}`);
  }

  const { translations } = localizedData;

  return translations;
}

export async function fetchTranslationVersions() {
  const { data } = await axiosInstance<BibleLanguage[]>('/api/translations');

  return data.map((item) => {
    const [id] = item.language.split(' ');
    return { ...item, id };
  });
}

export async function fetchBibleInstance(params: string[]) {
  const [abbreviation, bookNumber, chapterNumber] = params;

  const { data } = await axiosInstance<Verse[]>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );

  return data;
}

export async function fetchTranslationBooks(translation: string) {
  const { data } = await axiosInstance<BibleBook[]>(`/translations/${translation}`);
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

export async function fetchBibleToday(locale: Locale) {
  const { data } = await axiosInstance.get<TodayVerse>('/api/bible/today', {
    headers: {
      'Accept-Language': locale
    }
  });
  return data;
}
