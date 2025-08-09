import { type BibleBook, type TodayVerse, type YouTubeVideo } from '@/features/bible';
import { axiosInstance, type Locale } from '@/shared';
import type { NewBibleBook, NewBibleLanguage, NewVerse, NewVerseInstance } from '..';

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

export async function fetchBibleInstance(
  params: string[]
): Promise<{ book: BibleBook; verses: NewVerse[] }> {
  const [abbreviation, bookNumber, chapterNumber] = params;

  const {
    data: { results }
  } = await axiosInstance<NewVerseInstance>(
    `/translations/${abbreviation}/${bookNumber}/${chapterNumber}`
  );

  return {
    book: {
      bookid: results[0].book_id,
      name: results[0].book_name,
      chapters: +results[0].chapter_verse
    },
    verses: Object.values(results[0].verses[abbreviation][chapterNumber])
  };
}

export async function fetchTranslationBooks(locale: Locale) {
  const { data } = await axiosInstance<NewBibleBook[]>(`/translations/${locale}`);
  return data.map((item) => ({ ...item, bookid: item.id }));
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
