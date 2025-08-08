import { type BibleBook, type TodayVerse, type YouTubeVideo } from '@/features/bible';
import { axiosInstance, type Locale } from '@/shared';
import type { NewBibleLanguage, NewVerse, NewVerseInstance } from '..';

export async function fetchTranslationVersions() {
  const {
    data: { results }
  } = await axiosInstance<NewBibleLanguage>('/api/translations');

  return Object.entries(results).map(([id, item]) => ({
    id,
    language: item.lang_short,
    translations: {
      short_name: item.module,
      full_name: item.name,
      ...(item.rtl && { dir: 'rtl' })
    }
  }));
}

export async function fetchBibleInstance(params: string[]): Promise<NewVerse[]> {
  const [abbreviation, bookNumber, chapterNumber] = params;

  const {
    data: { results }
  } = await axiosInstance<NewVerseInstance>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );

  return Object.values(results[0].verses[abbreviation][chapterNumber]);
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
